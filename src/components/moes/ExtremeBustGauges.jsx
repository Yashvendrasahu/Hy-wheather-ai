// src/components/moes/ExtremeBustGauges.jsx
import React from 'react';
import {
  Gauge,
  Flame,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Wind,
  Layers,
  ThermometerSnowflake,
  AlertTriangle
} from 'lucide-react';

export default function ExtremeBustGauges({ payload, precipitation }) {
  const {
    cape = 0,
    cin = 0,
    wind_shear = 0,
    radar_max_dbz = 0,
    satellite_ctt_celsius = 0,
    rh_700 = 0
  } = payload || {};

  const bustProbability = precipitation?.nwp_bust_probability ?? 0.15;
  const bustPercentage = Number((bustProbability * 100).toFixed(1));
  const isBustWarning = precipitation?.is_bust_warning ?? (bustPercentage >= 50);
  const isPhysicalVeto = cin > 80;

  // Arc calculations for Radial Semi-Circle Gauge
  // 180 degrees from -90 to +90 or 0 to 180
  const gaugeAngle = (bustPercentage / 100) * 180;
  const needleRotation = -90 + (bustPercentage / 100) * 180;

  let gaugeColor = '#16A34A'; // Green
  if (bustPercentage >= 65) {
    gaugeColor = '#DC2626'; // Red
  } else if (bustPercentage >= 40) {
    gaugeColor = '#EA580C'; // Orange
  } else if (bustPercentage >= 25) {
    gaugeColor = '#CA8A04'; // Yellow
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900">
              Extreme Bust & Thermodynamic Gating Gauges
            </h3>
            {isPhysicalVeto && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                PHYSICAL VETO: INVERSION ACTIVE (False Alarms Filtered)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-model divergence, CAPE/CIN thermodynamic lid energy, and vertical wind shear metrics.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Coupled NWP-AI Physics
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Radial Bust Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            NWP Model Bust Probability
          </span>

          {/* SVG Semi-Circle Gauge */}
          <div className="relative w-48 h-28 flex items-center justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Colored Segments: Green, Yellow, Orange, Red */}
              <path
                d="M 20 100 A 80 80 0 0 1 60 43"
                fill="none"
                stroke="#16A34A"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.25"
              />
              <path
                d="M 60 43 A 80 80 0 0 1 100 20"
                fill="none"
                stroke="#CA8A04"
                strokeWidth="18"
                opacity="0.25"
              />
              <path
                d="M 100 20 A 80 80 0 0 1 140 43"
                fill="none"
                stroke="#EA580C"
                strokeWidth="18"
                opacity="0.25"
              />
              <path
                d="M 140 43 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#DC2626"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.25"
              />

              {/* Active Progress Needle / Arc */}
              <circle cx="100" cy="100" r="10" fill="#1E293B" />
              <line
                x1="100"
                y1="100"
                x2={100 + 68 * Math.cos((Math.PI * (180 - gaugeAngle)) / 180)}
                y2={100 - 68 * Math.sin((Math.PI * (180 - gaugeAngle)) / 180)}
                stroke={gaugeColor}
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="4" fill="#FFFFFF" />
            </svg>

            {/* Centered Value */}
            <div className="absolute bottom-0 text-center">
              <span className="text-2xl font-black font-mono tracking-tight tabular-nums" style={{ color: gaugeColor }}>
                {bustPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">Bust Risk Index</span>
            </div>
          </div>

          <div className="mt-3 text-center">
            {isBustWarning ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Severe Model Divergence
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Models Converging
              </span>
            )}
          </div>
        </div>

        {/* Right: Thermodynamic Telemetry Grid */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* CAPE */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>CAPE Energy</span>
              <Flame className={`w-4 h-4 ${cape > 2000 ? 'text-rose-500' : 'text-amber-500'}`} />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
              {cape} <span className="text-xs font-normal text-slate-400">J/kg</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {cape > 2500 ? 'High Convective Potential' : cape > 1000 ? 'Moderate Instability' : 'Stable Layer'}
            </div>
          </div>

          {/* CIN */}
          <div className={`p-3.5 rounded-2xl border ${isPhysicalVeto ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>CIN Inversion Lid</span>
              <ShieldCheck className={`w-4 h-4 ${isPhysicalVeto ? 'text-emerald-600' : 'text-slate-400'}`} />
            </div>
            <div className={`text-lg font-black font-mono tabular-nums ${isPhysicalVeto ? 'text-emerald-700' : 'text-slate-900'}`}>
              {cin} <span className="text-xs font-normal text-slate-400">J/kg</span>
            </div>
            <div className="text-[10px] mt-1 font-semibold">
              {isPhysicalVeto ? (
                <span className="text-emerald-700">Lid &gt; 80 J/kg: Rain Suppressed</span>
              ) : (
                <span className="text-slate-400">Weak Cap (Breakable)</span>
              )}
            </div>
          </div>

          {/* Wind Shear */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Vertical Wind Shear</span>
              <Wind className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
              {wind_shear} <span className="text-xs font-normal text-slate-400">m/s</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {wind_shear > 22 ? 'Supercell / Squall Risk' : 'Standard Gradient'}
            </div>
          </div>

          {/* Radar Max dBZ */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Radar Max dBZ</span>
              <Radio className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
              {radar_max_dbz} <span className="text-xs font-normal text-slate-400">dBZ</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {radar_max_dbz >= 45 ? 'Heavy Convective Core' : 'Stratiform Echo'}
            </div>
          </div>

          {/* Satellite CTT */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Cloud Top Temp</span>
              <ThermometerSnowflake className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
              {satellite_ctt_celsius}° <span className="text-xs font-normal text-slate-400">C</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {satellite_ctt_celsius < -60 ? 'Deep Overshooting Top' : 'Warm Cloud Deck'}
            </div>
          </div>

          {/* RH 700 hPa */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>700 hPa RH</span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
              {rh_700}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Mid-tropospheric moisture
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
