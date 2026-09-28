// src/components/moes/MultiParameterCards.jsx
import React from 'react';
import {
  Thermometer,
  Wind,
  Flame,
  AlertTriangle,
  Compass,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function MultiParameterCards({ temperature, wind, formatTemp }) {
  const blendedTemp = temperature?.blended_2m_celsius ?? 25;
  const heatIndex = temperature?.rothfusz_heat_index_celsius ?? blendedTemp;
  const heatwaveAdvisory = temperature?.heatwave_advisory || 'Normal';

  const sustainedWind = wind?.sustained_speed_kmh ?? 15;
  const gustCeiling = wind?.gust_ceiling_p90_kmh ?? 25;
  const isGaleWarning = wind?.gale_warning ?? (sustainedWind > 35 || gustCeiling > 45);

  const getHeatChipStyle = (advisory) => {
    if (advisory.includes('Severe Heatwave') || advisory.includes('Warning')) {
      return 'bg-rose-100 text-rose-800 border-rose-300';
    }
    if (advisory.includes('Caution') || advisory.includes('Stress')) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Thermal Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Thermometer className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Thermal & Heat Stress Telemetry
              </h3>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getHeatChipStyle(heatwaveAdvisory)}`}>
              {heatwaveAdvisory}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            {/* Blended 2m Temp */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Blended 2m Surface
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono mt-1 tabular-nums">
                {formatTemp ? formatTemp(blendedTemp) : `${blendedTemp}°C`}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                NWP Coupled Mean
              </span>
            </div>

            {/* Rothfusz Heat Index */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Rothfusz Heat Index
                </span>
                <Flame className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-900 font-mono mt-1 tabular-nums">
                {formatTemp ? formatTemp(heatIndex) : `${heatIndex}°C`}
              </div>
              <span className="text-[11px] text-amber-700 mt-1 block font-medium">
                Apparent Biothermal Load
              </span>
            </div>
          </div>
        </div>

        {/* Heatwave advisory footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Formula: Rothfusz Multi-polynomial expansion</span>
          <span className="font-semibold text-slate-700">MoES Standard</span>
        </div>
      </div>

      {/* 2. Wind & Gust Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Wind className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Wind Dynamics & Squall Assessment
              </h3>
            </div>

            {isGaleWarning ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                ⚠️ GALE WARNING ACTIVE
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                Standard Flow
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            {/* Sustained Speed */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Sustained Speed (10m)
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono mt-1 tabular-nums">
                {sustainedWind} <span className="text-sm font-normal text-slate-400">km/h</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Blended ECMWF/GFS
              </span>
            </div>

            {/* Gust Ceiling p90 */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wider block">
                  Gust Ceiling (p90)
                </span>
                <Compass className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="text-3xl font-black text-sky-900 font-mono mt-1 tabular-nums">
                {gustCeiling} <span className="text-sm font-normal text-sky-600">km/h</span>
              </div>
              <span className="text-[11px] text-sky-700 mt-1 block font-medium">
                Peak Kinematic Potential
              </span>
            </div>
          </div>
        </div>

        {/* Gale Banner if Active */}
        {isGaleWarning ? (
          <div className="mt-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>High maritime or surface squall potential. Secure outdoor installations.</span>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sustained wind below advisory thresholds (&lt; 35 km/h)</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Marine Nominal
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
