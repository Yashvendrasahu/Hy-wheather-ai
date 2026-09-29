// src/components/common/AuthGuards.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import LoginScreen from '../meteorologist/LoginScreen.jsx';
import OtpVerificationScreen from './OtpVerificationScreen.jsx';
import { CloudRain, Shield, AlertTriangle } from 'lucide-react';

/**
 * Loading screen during Supabase session initialization
 */
export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse mb-4">
        <CloudRain className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
        <span>Initializing WeatherAI Enclave</span>
        <div className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-ping" />
      </div>
      <p className="text-xs text-slate-400 mt-1 font-mono">
        Securing session via Supabase Auth & PostgreSQL RLS
      </p>
    </div>
  );
}

/**
 * ProtectedRoute: Requires active Supabase authenticated session
 */
export function ProtectedRoute({ children, fallback = <LoginScreen /> }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return fallback;
  }

  return children;
}

/**
 * RoleRoute: Requires active session + authorized role + verified OTP for government roles
 */
export function RoleRoute({
  allowedRoles = [],
  children,
  portalName = 'Restricted Operations'
}) {
  const { user, role, isLoading, isOtpVerified, otpState } = useAuth();
  const { setPortalMode } = useMeteorologist();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Not signed in -> Prompt Supabase Login
  if (!user) {
    return <LoginScreen />;
  }

  // If second-step OTP verification challenge is pending
  if (otpState.pending || (!isOtpVerified && role !== 'user')) {
    return <OtpVerificationScreen />;
  }

  // Administrators can inspect all portals
  const isAuthorized = role === 'administrator' || allowedRoles.includes(role);

  // Unauthorized role attempting access
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Access Restricted</h2>
            <p className="text-xs text-slate-500 mt-1">
              Your account role (<strong className="capitalize text-slate-800">{role}</strong>) does not have clearance for the {portalName}.
            </p>
          </div>
          <button
            onClick={() => setPortalMode('citizen')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Return to Authorized Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}

/**
 * OtpVerificationRoute: Only accessible when authentication requires second-step verification
 */
export function OtpVerificationRoute({ children = <OtpVerificationScreen /> }) {
  const { user, role, isLoading, isOtpVerified, otpState } = useAuth();
  const { setPortalMode } = useMeteorologist();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Not signed in -> Prompt Supabase Login
  if (!user) {
    return <LoginScreen />;
  }

  // If already verified or normal citizen user, direct to their portal
  if (isOtpVerified || role === 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Already Verified</h2>
            <p className="text-xs text-slate-500 mt-1">
              Your session is active and verified. Proceed directly to your operational dashboard.
            </p>
          </div>
          <button
            onClick={() => {
              if (role === 'meteorologist') setPortalMode('meteorologist');
              else if (role === 'disaster_manager') setPortalMode('dma');
              else if (role === 'administrator') setPortalMode('admin');
              else setPortalMode('citizen');
            }}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}

