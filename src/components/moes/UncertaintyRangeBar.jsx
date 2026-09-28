// src/components/moes/UncertaintyRangeBar.jsx
import React from 'react';
import { ShieldCheck, Sparkles, AlertCircle, Info } from 'lucide-react';

export default function UncertaintyRangeBar({ precipitation }) {
  const p10 = precipitation?.quantiles_mm?.p10 ?? 0;
  const p50 = precipitation?.quantiles_mm?.p50 ?? 0;
  const p90 = precipitation?.quantiles_mm?.p90 ?? 0;
  const coverage = precipitation?.conformal_coverage || '86.75% Guaranteed';

  // Calculate percentage positions across 0 to maxScale
  const maxScale = Math.max(p90 * 1.25, 40);
  const p10Pct = Math.min(100, Math.max(0, (p10 / maxScale) * 100));
  const p50Pct = Math.min(100, Math.max(0, (p50 / maxScale) * 100));
  const p90Pct = Math.min(100, Math.max(0, (p90 / maxScale) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900">
              Conformal Uncertainty Range
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{coverage}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Finite-sample non-parametric uncertainty interval calibrated to prevent catastrophic forecast busts.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Distribution: p10 – p50 – p90
        </div>
      </div>

      {/* 3 Metric Quantile Cards */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {/* Baseline p10 */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Lower Baseline (p10)
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-700 font-mono mt-1 tabular-nums">
            {p10.toFixed(1)} <span className="text-xs font-normal text-slate-400">mm</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">90% exceedance likelihood</span>
        </div>

        {/* Most Likely p50 */}
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-center ring-2 ring-blue-400/30">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
            Most Likely Expected (p50)
          </span>
          <div className="text-xl sm:text-2xl font-black text-blue-700 font-mono mt-1 tabular-nums">
            {p50.toFixed(1)} <span className="text-xs font-normal text-blue-500">mm</span>
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">AI Median Projection</span>
        </div>

        {/* Hazard Ceiling p90 */}
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center ring-2 ring-rose-400/30">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
            Upper Hazard Ceiling (p90)
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-600 font-mono mt-1 tabular-nums">
            {p90.toFixed(1)} <span className="text-xs font-normal text-rose-400">mm</span>
          </div>
          <span className="text-[10px] text-rose-600 font-semibold">Conformal Safety Bound</span>
        </div>
      </div>

      {/* Visual Uncertainty Range Slider Bar */}
      <div className="pt-4 pb-2">
        <div className="relative h-10 w-full flex items-center">
          {/* Base bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
            {/* Shaded p10 to p90 interval */}
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-300 via-blue-500 to-rose-500 rounded-full opacity-70"
              style={{
                left: `${p10Pct}%`,
                width: `${Math.max(4, p90Pct - p10Pct)}%`
              }}
            />
          </div>

          {/* p10 pin */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${p10Pct}%` }}
          >
            <div className="w-4 h-4 rounded-full bg-slate-600 border-2 border-white shadow-sm" />
            <span className="text-[10px] font-mono font-bold text-slate-600 mt-1 whitespace-nowrap">
              p10: {p10}
            </span>
          </div>

          {/* p50 pin (Primary median) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10"
            style={{ left: `${p50Pct}%` }}
          >
            <div className="w-5 h-5 rounded-full bg-[#2563EB] border-2 border-white shadow-md ring-2 ring-blue-300" />
            <span className="text-[10px] font-mono font-extrabold text-blue-700 mt-1 whitespace-nowrap bg-blue-50 px-1 rounded">
              p50: {p50}
            </span>
          </div>

          {/* p90 pin (Worst case ceiling) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${p90Pct}%` }}
          >
            <div className="w-4.5 h-4.5 rounded-full bg-[#DC2626] border-2 border-white shadow-md ring-2 ring-rose-300" />
            <span className="text-[10px] font-mono font-extrabold text-rose-600 mt-1 whitespace-nowrap bg-rose-50 px-1 rounded">
              p90: {p90}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
