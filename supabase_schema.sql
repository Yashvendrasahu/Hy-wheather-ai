-- ====================================================================
-- SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS) SETUP
-- WeatherAI / Mausam Suraksha - National Climate & Disaster Operations
-- ====================================================================

-- 1. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  user_id TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'meteorologist', 'disaster_manager', 'administrator')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  organization TEXT,
  designation TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast user_id resolution (e.g. logging in by official ID instead of email)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
-- 1. Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. Administrators can read all profiles
CREATE POLICY "Administrators can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'administrator'
    )
  );

-- 3. Users can update their own personal info (excluding role)
CREATE POLICY "Users can update own non-role fields"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Administrators can update any profile (including role elevations)
CREATE POLICY "Administrators can update all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'administrator'
    )
  );

-- 2. Create AUTH_OTP_CHALLENGES Table
CREATE TABLE IF NOT EXISTS public.auth_otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_otp_user_id ON public.auth_otp_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON public.auth_otp_challenges(expires_at);

-- Enable RLS on OTP Challenges
ALTER TABLE public.auth_otp_challenges ENABLE ROW LEVEL SECURITY;

-- Only authenticated users associated with the challenge can view their own non-sensitive challenge status
CREATE POLICY "Users can view own active challenges"
  ON public.auth_otp_challenges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Automatic Profile Creation Trigger on Supabase Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, user_id, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_id', 'USER-' || substr(md5(random()::text), 1, 6)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Secure Server-Side Function to Create OTP Challenge
CREATE OR REPLACE FUNCTION public.create_otp_challenge(
  p_user_id UUID,
  p_email TEXT,
  p_otp_hash TEXT,
  p_validity_minutes INTEGER DEFAULT 5
)
RETURNS JSON AS $$
DECLARE
  v_challenge_id UUID;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Invalidate any existing unverified challenges for this user
  UPDATE public.auth_otp_challenges
  SET verified = FALSE, expires_at = now() - INTERVAL '1 second'
  WHERE user_id = p_user_id AND verified = FALSE;

  v_expires_at := now() + (p_validity_minutes || ' minutes')::INTERVAL;

  INSERT INTO public.auth_otp_challenges (user_id, email, otp_hash, expires_at, attempts, verified)
  VALUES (p_user_id, p_email, p_otp_hash, v_expires_at, 0, FALSE)
  RETURNING id INTO v_challenge_id;

  RETURN json_build_object(
    'success', true,
    'challenge_id', v_challenge_id,
    'expires_at', v_expires_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Secure Server-Side Function to Verify OTP Challenge
CREATE OR REPLACE FUNCTION public.verify_otp_challenge(
  p_user_id UUID,
  p_challenge_id UUID,
  p_entered_hash TEXT
)
RETURNS JSON AS $$
DECLARE
  v_record RECORD;
BEGIN
  SELECT * INTO v_record
  FROM public.auth_otp_challenges
  WHERE id = p_challenge_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid challenge or session expired.');
  END IF;

  IF v_record.verified THEN
    RETURN json_build_object('success', false, 'error', 'Challenge has already been verified.');
  END IF;

  IF now() > v_record.expires_at THEN
    RETURN json_build_object('success', false, 'error', 'Verification code has expired. Please request a new one.');
  END IF;

  IF v_record.attempts >= v_record.max_attempts THEN
    RETURN json_build_object('success', false, 'error', 'Maximum verification attempts exceeded. Please generate a new code.');
  END IF;

  -- Increment attempts
  UPDATE public.auth_otp_challenges
  SET attempts = attempts + 1
  WHERE id = p_challenge_id;

  -- Validate hash
  IF v_record.otp_hash = p_entered_hash THEN
    UPDATE public.auth_otp_challenges
    SET verified = TRUE
    WHERE id = p_challenge_id;

    RETURN json_build_object('success', true, 'message', 'Verification successful.');
  ELSE
    RETURN json_build_object(
      'success', false,
      'error', 'Incorrect verification code.',
      'remaining_attempts', v_record.max_attempts - (v_record.attempts + 1)
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Helper function to look up email by official User ID
CREATE OR REPLACE FUNCTION public.lookup_email_by_userid(p_user_id TEXT)
RETURNS TEXT AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email
  FROM public.profiles
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;

  RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- SEED DATA INSTRUCTIONS:
-- In Supabase dashboard -> Authentication -> Users, create users or execute:
--
-- 1) Public User:
-- Email: citizen@weatherai.gov.in
-- Password: User@12345
-- Metadata: {"full_name": "Satish Sahu", "role": "user", "user_id": "CITIZEN-01"}
--
-- 2) Meteorologist:
-- Email: a.sharma.synoptic@imd.gov.in
-- Password: Synoptic@IMD2025
-- Metadata: {"full_name": "Dr. Ananya Sharma", "role": "meteorologist", "user_id": "MET-IMD-01"}
--
-- 3) Disaster Management Authority:
-- Email: v.rathore@rajasthan.gov.in
-- Password: Disaster@EOC2025
-- Metadata: {"full_name": "Vikramaditya Rathore", "role": "disaster_manager", "user_id": "DMA-EOC-01"}
--
-- 4) System Administrator:
-- Email: r.verma@gov.nic.in
-- Password: Admin@SEC2025
-- Metadata: {"full_name": "Rajesh K. Verma, IAS", "role": "administrator", "user_id": "ADMIN-SEC-01"}
-- ====================================================================
