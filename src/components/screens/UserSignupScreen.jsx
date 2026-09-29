// src/components/screens/UserSignupScreen.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import { useWeather } from '../../context/WeatherContext.jsx';
import {
  Shield,
  Radio,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CloudRain,
  KeyRound
} from 'lucide-react';

export default function UserSignupScreen() {
  const { signup, isSupabaseConfigured } = useAuth();
  const { setPortalMode, showToast } = useMeteorologist();
  const { currentLocation } = useWeather();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(currentLocation?.name || 'New Delhi');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lang, setLang] = useState('EN');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please complete all required fields (Name, Email, Password).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both password entries.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms of Service & Meteorological Guidelines.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        role: 'user'
      });

      if (result.success) {
        showToast(`Welcome to WeatherAI, ${fullName}! Your citizen account is created.`, 'success');
        setPortalMode('citizen');
      } else {
        setErrorMsg(result.error || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setErrorMsg('A network error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo auto-fill helper
  const handleDemoFill = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFullName('Pooja Patel');
    setEmail(`pooja.patel${randomNum}@weatherai.gov.in`);
    setPhone('+91 98765 43210');
    setCity('Mumbai, Maharashtra');
    setPassword('User@12345');
    setConfirmPassword('User@12345');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] relative overflow-hidden font-sans select-none">
      
      {/* Background Isobar Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="signupGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#signupGlow)" />
          <path d="M-100,200 Q400,100 900,300 T1900,200" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="6,6" />
          <path d="M-100,450 Q500,350 1100,550 T1900,400" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="50%" cy="45%" r="420" fill="none" stroke="#E2E8F0" strokeWidth="1" />
        </svg>
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/90 py-3.5 px-4 sm:px-8 shadow-2xs">
        <div className="max-w-[1540px] mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setPortalMode('citizen')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <CloudRain className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 tracking-tight">
                  Weather<span className="text-sky-600">AI</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-mono">
                  SIGN UP
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 hidden sm:block">
                National WeatherAI & Atmospheric Intelligence Network
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              onClick={() => setPortalMode('citizen')}
              className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer shrink-0"
              title="Return to Public Portal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Public Citizen Portal</span>
              <span className="sm:hidden">Public Portal</span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isSupabaseConfigured ? 'Live Supabase Connected' : 'Supabase Enclave Active'}</span>
            </div>

            {/* Language Switch */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  lang === 'EN' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('HI')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  lang === 'HI' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Registration Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6 animate-fade-in">
          
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Create Citizen Account</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Join WeatherAI
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Get personalized severe weather alerts, precipitation forecasts, and Doppler radar tracking.
            </p>
          </div>

          {/* Quick 1-Click Demo Fill Banner */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-semibold">Quick testing?</span>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-sky-700 font-bold text-[11px] transition-colors cursor-pointer"
            >
              1-Click Demo Fill
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="e.g. Pooja Patel"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="e.g. pooja@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* 2-Column Grid: Phone & Primary City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Phone (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Mobile Number <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
                  />
                </div>
              </div>

              {/* City / Primary Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Primary Location / City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New Delhi, DL"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="pt-1 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full flex-1 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{passwordStrength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span>
                  I agree to the <span className="text-sky-700 font-semibold hover:underline">Terms of Service</span> and acknowledge receipt of meteorological advisory standards.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => setPortalMode('login')}
              className="font-bold text-sky-700 hover:text-sky-900 hover:underline transition-colors cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-600">
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span className="uppercase tracking-wider">Supabase Row-Level Security Enforced</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Citizen profiles and alert preferences are protected by Supabase PostgreSQL encryption.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-200 py-4 px-4 sm:px-8 text-xs text-slate-500 text-center">
        <p className="text-[11px] text-slate-400">
          © 2025 National Meteorological Service & Disaster Mitigation Authority. Government of India.
        </p>
      </footer>

    </div>
  );
}
