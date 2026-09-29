// src/components/meteorologist/SignupScreen.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import {
  Shield,
  Radio,
  Lock,
  Mail,
  User,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export default function SignupScreen() {
  const { handleLogin, setMetTab, setPortalMode, showToast } = useMeteorologist();

  const [fullName, setFullName] = useState('Ragul Sharma');
  const [role, setRole] = useState('Senior Meteorologist & Synoptic Lead');
  const [email, setEmail] = useState('ragul.sharma@imd.gov.in');
  const [password, setPassword] = useState('Synoptic@2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberWorkstation, setRememberWorkstation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState('EN');

  const rolesList = [
    'Senior Meteorologist & Synoptic Lead',
    'Operational Synoptic Forecaster',
    'Doppler Radar & Nowcast Specialist',
    'NWP Ensemble & AI Model Researcher',
    'Disaster Early Warning Liaison Officer',
    'High-Performance Climate Analyst'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !role) {
      showToast('Please fill in all scientific registration fields.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(`Account requested for ${fullName}. Authorized Level 4 access provisioned!`, 'success');
      handleLogin(email, role);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] relative overflow-hidden font-sans select-none">
      
      {/* Subtle Radar Isobar Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="radarGlowSignup" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#radarGlowSignup)" />
          <path d="M-100,200 Q400,100 900,300 T1900,200" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="6,6" />
          <path d="M-100,400 Q500,300 1100,500 T1900,350" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          <path d="M-100,600 Q300,500 1000,700 T1900,550" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx="50%" cy="45%" r="380" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="50%" cy="45%" r="580" fill="none" stroke="#F1F5F9" strokeWidth="1" />
          <text x="5%" y="22%" fill="#94A3B8" fontSize="11" fontFamily="monospace">28° 38' N / 77° 13' E (HQ-NEW DELHI)</text>
          <text x="82%" y="22%" fill="#94A3B8" fontSize="11" fontFamily="monospace">RADAR ISOBAR 1013.25 hPa</text>
          <text x="5%" y="80%" fill="#94A3B8" fontSize="11" fontFamily="monospace">NCMRWF HIGH-RESOLUTION ENSEMBLE</text>
          <text x="82%" y="80%" fill="#94A3B8" fontSize="11" fontFamily="monospace">SATELLITE DOWNLINK STABLE</text>
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
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 tracking-tight">
                  Mausam Suraksha
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-mono">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 hidden sm:block">
                WeatherAI Researcher & Meteorologist Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setPortalMode('citizen')}
              className="flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
            >
              <span>← Public Citizen Portal</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>IMD & MoES Telemetry Verified</span>
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

      {/* Main Signup Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-5 animate-fade-in">
          
          {/* Top Badge & Icon */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Authorized Meteorologist Access Only</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-xs">
              <Radio className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Signup</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                Access scientific forecast telemetry, ensemble models, and national hazard alert tools.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ragul Sharma"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Role</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>choose your role</option>
                  {rolesList.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Official Email / Scientist ID */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Official Email / Scientist ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g rahul@imd.gov.in or NCMRWF ID"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* Security Key / Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Security Key / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono transition-all"
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={rememberWorkstation}
                  onChange={(e) => setRememberWorkstation(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span>Remember this workstation</span>
              </label>

              <button
                type="button"
                onClick={() => showToast('Credential recovery protocol available for verified IMD personnel.', 'info')}
                className="font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registering Credentials...</span>
                </>
              ) : (
                <>
                  <span>SignUp</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center pt-1 text-xs text-slate-500">
            <span>Already have account ? </span>
            <button
              onClick={() => setMetTab('login')}
              className="font-bold text-sky-700 hover:text-sky-900 hover:underline transition-colors cursor-pointer"
            >
              login here
            </button>
          </div>

          {/* Security Banner */}
          <div className="pt-2.5 border-t border-slate-100 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-700">
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span className="uppercase tracking-wider">256-Bit Telemetry Encryption</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              System activity is strictly audited and logged for national disaster mitigation and weather protection integrity.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-200 py-6 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-[1540px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-black text-slate-900">Mausam Suraksha</div>
            <p className="text-[11px] text-slate-400">
              © 2025 National Meteorological Service & Disaster Mitigation Authority. Government of India. All rights reserved. Authorized scientific access only.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
            <button onClick={() => showToast('Public Safety Charter', 'info')} className="hover:text-sky-700 cursor-pointer">Public Safety Charter</button>
            <button onClick={() => showToast('National Radar Network Active', 'info')} className="hover:text-sky-700 cursor-pointer">National Radar Network</button>
            <button onClick={() => showToast('Disaster Liaison Hotline: +91 11 2461 8241', 'info')} className="hover:text-sky-700 cursor-pointer">Disaster Control Liaison</button>
            <button onClick={() => showToast('Security Protocols Enforced', 'info')} className="hover:text-sky-700 cursor-pointer">Security Protocols</button>
            <span className="text-slate-900 font-bold">Helpdesk: 1800-180-1717</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
