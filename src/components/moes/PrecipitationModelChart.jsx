// src/components/moes/PrecipitationModelChart.jsx
import React from 'react';
import { CloudRain, BarChart3, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PrecipitationModelChart({ payload, precipitation }) {
  const {
    tp_gfs = 0,
    tp_ecmwf = 0,
    tp_ncum = 0,
    tp_wrf = 0
  } = payload || {};

  const p10 = precipitation?.quantiles_mm?.p10 ?? 0;
  const p50 = precipitation?.quantiles_mm?.p50 ?? 0;
  const p90 = precipitation?.quantiles_mm?.p90 ?? 0;

  // Chart data items
  const items = [
    {
      id: 'gfs',
      label: 'GFS (NOAA)',
      value: tp_gfs,
      type: 'raw',
      color: 'bg-slate-400',
      textColor: 'text-slate-700',
      description: '13km Synoptic'
    },
    {
      id: 'ecmwf',
      label: 'ECMWF IFS',
      value: tp_ecmwf,
      type: 'raw',
      color: 'bg-indigo-400',
      textColor: 'text-indigo-800',
      description: '9km Global'
    },
    {
      id: 'ncum',
      label: 'NCUM (India)',
      value: tp_ncum,
      type: 'raw',
      color: 'bg-teal-500',
      textColor: 'text-teal-800',
      description: 'Unified Model'
    },
    {
      id: 'wrf',
      label: 'WRF Meso',
      value: tp_wrf,
      type: 'raw',
      color: 'bg-sky-500',
      textColor: 'text-sky-800',
      description: '1.2km High-Res'
    },
    {
      id: 'p50',
      label: 'AI Blended p50',
      value: p50,
      type: 'ai-median',
      color: 'bg-[#2563EB]', // Primary Royal Blue
      textColor: 'text-blue-700',
      description: 'Most Likely Median',
      isPrimary: true
    },
    {
      id: 'p90',
      label: 'Worst-Case p90',
      value: p90,
      type: 'ai-ceiling',
      color: 'bg-[#DC2626]', // Crimson Red Warning
      textColor: 'text-rose-700',
      description: 'Conformal Ceiling',
      isWarning: true
    }
  ];

  // Calculate scaling ceiling
  const maxValue = Math.max(...items.map(d => d.value), 60);
  const chartCeiling = Math.ceil(maxValue * 1.15);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <CloudRain className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Precipitation Forecast & Multi-Model Comparison
              </h3>
              <p className="text-xs text-slate-500">
                Raw NWP model predictions vs. AI Blended Median (p50) & Conformal Hazard Ceiling (p90)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
              AI Median (p50)
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
              Hazard Ceiling (p90)
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="mt-6 pt-4 pb-2">
          {/* Y-axis reference lines */}
          <div className="relative h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6">
            {/* Horizontal guide lines */}
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-200" />
            <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-100" />
            <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-100" />
            <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-100" />

            {/* Red Worst-Case Threshold Reference Line */}
            {p90 > 0 && (
              <div
                className="absolute inset-x-0 border-b-2 border-red-500/70 border-dashed z-10 pointer-events-none transition-all duration-500"
                style={{ bottom: `${Math.min(95, (p90 / chartCeiling) * 100)}%` }}
              >
                <span className="absolute right-2 -top-4 text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-mono">
                  p90: {p90} mm
                </span>
              </div>
            )}

            {/* Bars */}
            {items.map((item) => {
              const heightPercent = chartCeiling > 0 ? (item.value / chartCeiling) * 100 : 0;
              const isAiBar = item.type.startsWith('ai');
              return (
                <div key={item.id} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                  {/* Hover value tooltip */}
                  <div className="mb-2 text-center">
                    <span className={`text-xs font-mono font-extrabold ${item.textColor} block tabular-nums`}>
                      {item.value.toFixed(1)}
                      <span className="text-[10px] font-normal text-slate-400"> mm</span>
                    </span>
                  </div>

                  {/* Bar pillar */}
                  <div className="w-full max-w-[46px] bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ${item.color} ${
                        item.isPrimary ? 'shadow-md ring-2 ring-blue-300' : ''
                      } ${item.isWarning ? 'shadow-md ring-2 ring-rose-300' : ''} group-hover:brightness-110`}
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
                    />
                  </div>

                  {/* Label below bar */}
                  <div className="mt-3 text-center w-full">
                    <span className={`text-[11px] font-bold block truncate ${
                      item.isPrimary ? 'text-blue-800 font-extrabold' : item.isWarning ? 'text-rose-800 font-extrabold' : 'text-slate-700'
                    }`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {item.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delta Callout strip */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2 bg-slate-50 p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>
            NWP Spread: <strong>{Math.min(tp_gfs, tp_ecmwf, tp_ncum, tp_wrf).toFixed(1)} – {Math.max(tp_gfs, tp_ecmwf, tp_ncum, tp_wrf).toFixed(1)} mm</strong>
          </span>
        </div>
        <div className="text-slate-500 font-mono">
          AI Conformal Safety Headroom: <strong className="text-rose-600">+{Math.max(0, p90 - p50).toFixed(1)} mm</strong> above p50
        </div>
      </div>
    </div>
  );
}
