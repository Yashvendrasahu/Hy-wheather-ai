// src/components/meteorologist/LoginScreen.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import AppLogo from '../common/AppLogo.jsx';
import {
  Shield,
  Radio,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  ArrowLeft,
  Sparkles,
  KeyRound
} from 'lucide-react';

export default function LoginScreen() {
  const { login, resetPassword } = useAuth();
  const { setMetTab, setPortalMode, showToast } = useMeteorologist();

  const [identifier, setIdentifier] = useState('citizen@weatherai.gov.in');
  const [password, setPassword] = useState('User@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberWorkstation, setRememberWorkstation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lang, setLang] = useState('EN'); // 'EN' | 'HI'

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ loading: false, sent: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Please enter your email or official User ID and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const result = await login(identifier, password);
      if (result.success) {
        if (result.requiresOtp) {
          showToast('Verification code dispatched to your registered email.', 'info');
          // Portal handles showing OTP screen
        } else {
          showToast('Welcome back to WEATHER FUSE.', 'success');
          setPortalMode('citizen');
        }
      } else {
        setErrorMsg(result.error || 'Invalid credentials or account inactive.');
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setForgotStatus({ loading: true, sent: false, error: '' });
    try {
      await resetPassword(forgotEmail);
      setForgotStatus({ loading: false, sent: true, error: '' });
      showToast('If this email is registered, a password reset link has been dispatched.', 'info');
    } catch (err) {
      setForgotStatus({ loading: false, sent: false, error: 'Could not send reset link. Please try again.' });
    }
  };

  // Quick Preset Helper for testing demo accounts easily
  const setDemoAccount = (emailVal, passVal) => {
    setIdentifier(emailVal);
    setPassword(passVal);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] relative overflow-hidden font-sans select-none">
      
      {/* Subtle Radar Isobar Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#radarGlow)" />
          {/* Subtle Isobar Contours */}
          <path d="M-100,200 Q400,100 900,300 T1900,200" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="6,6" />
          <path d="M-100,400 Q500,300 1100,500 T1900,350" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          <path d="M-100,600 Q300,500 1000,700 T1900,550" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx="50%" cy="45%" r="380" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="50%" cy="45%" r="580" fill="none" stroke="#F1F5F9" strokeWidth="1" />
          <text x="5%" y="22%" fill="#94A3B8" fontSize="11" fontFamily="monospace">28° 38' N / 77° 13' E (HQ-NEW DELHI)</text>
          <text x="82%" y="22%" fill="#94A3B8" fontSize="11" fontFamily="monospace">RADAR ISOBAR 1013.25 hPa</text>
        </svg>
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/90 py-3.5 px-4 sm:px-8 shadow-2xs">
        <div className="max-w-[1540px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AppLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 tracking-tight">
                  WEATHER FUSE
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-mono">
                  SECURE ACCESS
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 hidden sm:block">
                National WEATHER FUSE & Civic Disaster Operations Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setPortalMode('citizen')}
              className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer shrink-0"
              title="Return to Public Portal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Public Citizen Portal</span>
              <span className="sm:hidden">Public Portal</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Secure Gateway Online</span>
            </div>

            {/* Language Switch */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold text-slate-700">
              <button
                onClick={() => setLang('EN')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  lang === 'EN' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
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

      {/* Main Login Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6 animate-fade-in">
          
          {/* Top Badge & Icon */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <AppLogo size="lg" showText={false} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
              <KeyRound className="w-3.5 h-3.5 text-sky-600" />
              <span>Unified Role-Based Authentication</span>
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Login</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                Sign in with your registered email or official government user ID.
              </p>
            </div>
          </div>

          {/* Quick Demo Role Selector Pills for Evaluation */}
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 justify-between">
              <span>Quick Test Accounts</span>
              <span className="text-[10px] text-sky-600 font-mono">1-Click Fill</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setDemoAccount('citizen@weatherai.gov.in', 'User@12345')}
                className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-left transition-colors cursor-pointer"
              >
                <div className="text-slate-900">Citizen User</div>
                <div className="text-[10px] text-slate-400 font-normal">Immediate login</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('a.sharma.synoptic@imd.gov.in', 'Synoptic@IMD2025')}
                className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-left transition-colors cursor-pointer"
              >
                <div className="text-sky-700">Meteorologist</div>
                <div className="text-[10px] text-slate-400 font-normal">Requires 2FA OTP</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('v.rathore@rajasthan.gov.in', 'Disaster@EOC2025')}
                className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-left transition-colors cursor-pointer"
              >
                <div className="text-rose-700">Disaster EOC</div>
                <div className="text-[10px] text-slate-400 font-normal">Requires 2FA OTP</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('r.verma@gov.nic.in', 'Admin@SEC2025')}
                className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-left transition-colors cursor-pointer"
              >
                <div className="text-indigo-700">Admin SEC-01</div>
                <div className="text-[10px] text-slate-400 font-normal">Requires 2FA OTP</div>
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Official Email / User ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email Address or Official User ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="e.g. citizen@weatherai.gov.in or MET-IMD-01"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Password
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
                  placeholder="••••••••••••"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={rememberWorkstation}
                  onChange={(e) => setRememberWorkstation(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setForgotEmail(identifier.includes('@') ? identifier : '');
                  setShowForgotModal(true);
                }}
                className="font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
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
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="text-center pt-2 text-xs text-slate-500">
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={() => setPortalMode('signup')}
              className="font-bold text-sky-700 hover:text-sky-900 hover:underline transition-colors cursor-pointer"
            >
              Sign Up for Free
            </button>
          </div>

          {/* Security Banner */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-700">
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span className="uppercase tracking-wider">End-to-End Encrypted Session</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Official credentials, role permissions, and broadcast channels are protected by 256-bit cryptographic security.
            </p>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Reset Password</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Enter your registered official email address. A secure password reset link will be sent to your inbox.
            </p>

            {forgotStatus.sent ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold space-y-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Password reset email dispatched.</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-normal">
                  Check your inbox for instructions to update your password credentials.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="e.g. officer@imd.gov.in"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />

                {forgotStatus.error && (
                  <p className="text-xs text-rose-600 font-semibold">{forgotStatus.error}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotStatus.loading}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-60"
                  >
                    {forgotStatus.loading ? 'Sending Link...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-200 py-6 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-[1540px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-black text-slate-900">WEATHER FUSE</div>
            <p className="text-[11px] text-slate-400">
              © 2025 WEATHER FUSE National Meteorological Service & Disaster Mitigation Platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
            <button onClick={() => showToast('Public Safety Charter', 'info')} className="hover:text-sky-700 cursor-pointer">Public Safety Charter</button>
            <button onClick={() => showToast('National Radar Network Active', 'info')} className="hover:text-sky-700 cursor-pointer">National Radar Network</button>
            <button onClick={() => showToast('Security Protocols Enforced', 'info')} className="hover:text-sky-700 cursor-pointer">Security Protocols</button>
            <span className="text-slate-900 font-bold">Helpdesk: 1800-180-1717</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
