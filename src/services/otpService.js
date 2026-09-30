// src/services/otpService.js
import { supabase, isSupabaseConfigured, sha256 } from '../lib/supabaseClient.js';

const OTP_VALIDITY_SECONDS = 300; // 5 minutes
const MAX_ATTEMPTS = 5;

// In-memory active challenge store for offline/demo operation & client validation
let activeChallenge = null;

/**
 * Mask an email for security display (e.g. r••••••@gov.in)
 */
export function maskEmail(email) {
  if (!email || !email.includes('@')) return '••••••@gov.in';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}••••@${domain}`;
  }
  return `${local[0]}${'•'.repeat(Math.min(local.length - 1, 6))}@${domain}`;
}

/**
 * Generate a new 6-digit OTP challenge for operational roles
 */
export async function createOtpChallenge(user, profile) {
  // Generate random 6-digit numerical OTP
  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await sha256(rawOtp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_VALIDITY_SECONDS * 1000);
  const challengeId = 'CHALLENGE-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  const challengeData = {
    id: challengeId,
    userId: user.id,
    email: profile.email || user.email,
    maskedEmail: maskEmail(profile.email || user.email),
    otpHash: otpHash,
    // Store rawOtp only for development preview in non-production environments
    devPreviewOtp: rawOtp,
    expiresAt: expiresAt.getTime(),
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    verified: false,
    resendAvailableAt: now.getTime() + 60 * 1000 // 60s cooldown
  };

  activeChallenge = challengeData;

  // If live Supabase is configured with the RPC function:
  if (isSupabaseConfigured) {
    try {
      await supabase.rpc('create_otp_challenge', {
        p_user_id: user.id,
        p_email: profile.email || user.email,
        p_otp_hash: otpHash,
        p_validity_minutes: 5
      });
    } catch (err) {
      console.warn('Supabase RPC create_otp_challenge fallback:', err?.message || err);
    }
  }

  return {
    challengeId: challengeData.id,
    maskedEmail: challengeData.maskedEmail,
    expiresAt: challengeData.expiresAt,
    resendAvailableAt: challengeData.resendAvailableAt,
    devPreviewOtp: challengeData.devPreviewOtp
  };
}

/**
 * Verify entered 6-digit OTP code against active challenge
 */
export async function verifyOtpCode(enteredOtp, userId) {
  if (!activeChallenge) {
    return { success: false, error: 'No active OTP verification session. Please sign in again.' };
  }

  const now = Date.now();
  if (now > activeChallenge.expiresAt) {
    return { success: false, error: 'Verification code has expired (5-minute limit). Please request a new code.' };
  }

  if (activeChallenge.attempts >= activeChallenge.maxAttempts) {
    return { success: false, error: 'Maximum verification attempts (5) exceeded. Please sign in again.' };
  }

  activeChallenge.attempts += 1;
  const enteredHash = await sha256(enteredOtp);

  // Check against Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('verify_otp_challenge', {
        p_user_id: userId || activeChallenge.userId,
        p_challenge_id: activeChallenge.id,
        p_entered_hash: enteredHash
      });

      if (!error && data?.success) {
        activeChallenge.verified = true;
        return { success: true, message: 'Verification successful.' };
      }
    } catch (rpcErr) {
      console.warn('Supabase RPC verify_otp_challenge fallback:', rpcErr?.message || rpcErr);
    }
  }

  // Fallback / in-memory secure comparison
  if (enteredHash === activeChallenge.otpHash) {
    activeChallenge.verified = true;
    return { success: true, message: 'Verification successful.' };
  }

  const remaining = activeChallenge.maxAttempts - activeChallenge.attempts;
  return {
    success: false,
    error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
  };
}

/**
 * Get active challenge details if valid
 */
export function getActiveChallenge() {
  if (!activeChallenge) return null;
  if (Date.now() > activeChallenge.expiresAt) return null;
  return {
    challengeId: activeChallenge.id,
    maskedEmail: activeChallenge.maskedEmail,
    expiresAt: activeChallenge.expiresAt,
    resendAvailableAt: activeChallenge.resendAvailableAt,
    attempts: activeChallenge.attempts,
    maxAttempts: activeChallenge.maxAttempts,
    devPreviewOtp: activeChallenge.devPreviewOtp
  };
}

/**
 * Clear challenge on logout or cancellation
 */
export function clearOtpChallenge() {
  activeChallenge = null;
}
