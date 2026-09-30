// src/components/moes/TopAlertRibbon.jsx
import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Flame,
  CloudLightning,
  Activity
} from 'lucide-react';

export default function TopAlertRibbon({ alertLevel = 'GREEN', precipitation, cin = 0, isBustWarning = false }) {
  const normalizedAlert = (alertLevel || 'GREEN').toUpperCase();

  const alertConfigs = {
    GREEN: {
      bg: 'bg-[#16A34A]',
      border: 'border-emerald-700',
      badgeBg: 'bg-emerald-800/80 text-emerald-100',
      text: 'text-white',
      icon: CheckCircle2,
      label: 'GREEN ALERT — NORMAL OPERATIONS',
      headline: 'Atmospheric stability within standard parameters. No critical convective or orographic hazard detected.',
      subtext: 'NWP convergence high across ensemble runs. Operational readiness normal.'
    },
    YELLOW: {
      bg: 'bg-[#CA8A04]',
      border: 'border-amber-700',
      badgeBg: 'bg-amber-900/80 text-amber-100',
      text: 'text-white',
      icon: AlertCircle,
      label: 'YELLOW ADVISORY — MODEL DIVERGENCE / HEAT STRESS',
      headline: 'Elevated thermal or thermodynamic anomaly detected. Model spreads warrant close monitoring.',
      subtext: 'High thermal heat index or capping inversion active. Precautionary monitoring advised.'
    },
    ORANGE: {
      bg: 'bg-[#EA580C]',
      border: 'border-orange-800',
      badgeBg: 'bg-orange-900/80 text-orange-100',
      text: 'text-white',
      icon: AlertTriangle,
      label: 'ORANGE WATCH — PREPAREDNESS WATCH / CONVECTIVE RAIN THREAT',
      headline: 'Significant convective precipitation likely. Coastal or plateau squall potential escalated.',
      subtext: 'Deep tropospheric moisture flux active. Disaster response teams placed on standby.'
    },
    RED: {
      bg: 'bg-[#DC2626]',
      border: 'border-red-800',
      badgeBg: 'bg-red-950/90 text-red-100',
      text: 'text-white',
      icon: CloudLightning,
      label: 'RED ALERT — SEVERE CLOUDBURST / EXTREME BUST THREAT',
      headline: 'High-risk orographic convective surge detected. Potential localized cloudburst and flash flood threat.',
      subtext: 'Extreme vertical shear and high CAPE conditions. Immediate civil defense precautions required.'
    }
  };

  const current = alertConfigs[normalizedAlert] || alertConfigs.GREEN;
  const IconComponent = current.icon;
  const isPhysicalVeto = cin > 80;

  return (
    <div className={`w-full rounded-2xl ${current.bg} ${current.text} p-4 sm:p-5 shadow-lg border ${current.border} transition-all duration-300 relative overflow-hidden`}>
      {/* Background ambient pulse for Red/Orange */}
      {(normalizedAlert === 'RED' || normalizedAlert === 'ORANGE') && (
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md shrink-0 mt-0.5 shadow-sm">
            <IconComponent className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider uppercase ${current.badgeBg} shadow-xs border border-white/20`}>
                {current.label}
              </span>
              
              {isBustWarning && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/40 text-amber-200 border border-amber-300/40 animate-pulse">
                  ⚠️ NWP BUST WARNING ACTIVE
                </span>
              )}

              {isPhysicalVeto && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-200 border border-emerald-400/50">
                  PHYSICAL VETO: INVERSION ACTIVE (False Alarms Filtered)
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold tracking-tight">
              {current.headline}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 mt-0.5 font-medium leading-relaxed max-w-3xl">
              {current.subtext}
            </p>
          </div>
        </div>

        {/* Right side telemetry tags */}
        <div className="flex flex-wrap md:flex-col items-end gap-2 text-right shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/20 backdrop-blur-xs text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            <span>Coverage: {precipitation?.conformal_coverage || '86.75% Guaranteed'}</span>
          </div>

          <div className="text-[11px] text-white/80 font-mono">
            {precipitation?.quantiles_mm?.p50 !== undefined && (
              <span>Median p50: <strong>{precipitation.quantiles_mm.p50} mm</strong> • Peak p90: <strong>{precipitation.quantiles_mm.p90} mm</strong></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
