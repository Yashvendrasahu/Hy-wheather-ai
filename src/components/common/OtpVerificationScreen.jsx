// src/components/common/OtpVerificationScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import {
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
  Mail,
  Lock,
  Sparkles
} from 'lucide-react';

export default function OtpVerificationScreen() {
  const { otpState, verifyOtp, resendOtp, logout, role, profile } = useAuth();
  const { setPortalMode } = useMeteorologist();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef([]);

  // Auto-focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Expiry countdown timer (5 mins)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Resend cooldown timer (60s)
  useEffect(() => {
    if (resendCooldown > 0) {
      const cooldownTimer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(cooldownTimer);
    }
  }, [resendCooldown]);

  const handleDigitChange = (index, value) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const char = cleanVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMsg('');

    // Advance to next input
    if (char && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);
    setErrorMsg('');

    const nextIndex = Math.min(pasted.length, 5);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }

    if (timeLeft <= 0) {
      setErrorMsg('Verification code has expired. Please request a new one.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const result = await verifyOtp(fullCode);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          // Redirect to appropriate role portal
          const targetRole = result.role || role;
          if (targetRole === 'meteorologist') {
            setPortalMode('meteorologist');
          } else if (targetRole === 'disaster_manager') {
            setPortalMode('dma');
          } else if (targetRole === 'administrator') {
            setPortalMode('admin');
          } else {
            setPortalMode('citizen');
          }
        }, 1200);
      } else {
        setErrorMsg(result.error || 'Verification failed. Please check the code and try again.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    setErrorMsg('');

    try {
      const res = await resendOtp();
      if (res.success) {
        setResendCooldown(60);
        setTimeLeft(300);
        setDigits(['', '', '', '', '', '']);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }
    } catch (_) {
      setErrorMsg('Failed to resend code. Please try again in a few moments.');
    } finally {
      setIsResending(false);
    }
  };

  // Format time as MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  const maskedEmail = otpState.challenge?.maskedEmail || 'r••••••@gov.in';
  const devPreviewOtp = otpState.challenge?.devPreviewOtp;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] relative overflow-hidden font-sans select-none">
      
      {/* Background Isobar & Radar Contours */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="otpGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#otpGlow)" />
          <path d="M-100,300 Q500,200 1100,400 T1900,300" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="6,6" />
          <circle cx="50%" cy="50%" r="420" fill="none" stroke="#E2E8F0" strokeWidth="1" />
        </svg>
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/90 py-3.5 px-4 sm:px-8 shadow-2xs">
        <div className="max-w-[1540px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <span className="text-base font-black text-slate-900 tracking-tight">
                WeatherAI <span className="text-sky-600">Mausam Suraksha</span>
              </span>
              <span className="ml-2 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-mono">
                2FA ENCLAVE
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
            title="Cancel & Sign Out"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cancel & Back to Login</span>
            <span className="sm:hidden">Cancel</span>
          </button>
        </div>
      </header>

      {/* Center Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          
          {/* Header Icon & Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Two-Factor Authentication</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Verify your identity
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Enter the 6-digit verification code sent to your registered email.
              </p>
            </div>

            {/* Masked Email Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
              <Mail className="w-3.5 h-3.5 text-sky-600" />
              <span>{maskedEmail}</span>
            </div>
          </div>

          {/* Dev Preview Helper Banner (For testing sandbox) */}
          {devPreviewOtp && (
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  Demo Code: <strong className="font-mono text-sm tracking-wider font-bold text-sky-950">{devPreviewOtp}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDigits(devPreviewOtp.split(''));
                  setErrorMsg('');
                }}
                className="px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* OTP Digits Input Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  disabled={isVerifying || isSuccess}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-2xs"
                />
              ))}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success State */}
            {isSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm">Verification successful! Redirecting to secure portal...</span>
              </div>
            )}

            {/* Expiry Timer & Resend Controls */}
            <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
              <div className="flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Code expires in: </span>
                <strong className={timeLeft < 60 ? 'text-rose-600 font-bold' : 'text-slate-800 font-bold'}>
                  {formatTime(timeLeft)}
                </strong>
              </div>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className="font-bold text-sky-700 hover:text-sky-900 transition-colors disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                {isResending ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : null}
                <span>
                  {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend Code'}
                </span>
              </button>
            </div>

            {/* Submit Verification Button */}
            <button
              type="submit"
              disabled={isVerifying || isSuccess || digits.join('').length !== 6}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Code via Supabase...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verification Complete</span>
                </>
              ) : (
                <>
                  <span>Verify Identity & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Assurance */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-700">
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span className="uppercase tracking-wider">National Security Compliance</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Operational portal credentials are cryptographically verified and bound to gazetted officer identity.
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
