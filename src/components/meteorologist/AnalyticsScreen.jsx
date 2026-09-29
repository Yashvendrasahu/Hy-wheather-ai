// src/components/meteorologist/AnalyticsScreen.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import {
  ANALYTICS_KPIS,
  ANALYTICS_MODEL_PERFORMANCE_MATRIX,
  BLENDED_VS_COMPONENT_MODELS,
  HISTORICAL_VALIDATION_EVENT_AUDIT
} from '../../data/meteorologistData.js';
import {
  Activity,
  Download,
  Filter,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  MapPin,
  ChevronDown,
  Info,
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Gauge
} from 'lucide-react';

export default function AnalyticsScreen() {
  const { showToast } = useMeteorologist();

  const [selectedCluster, setSelectedCluster] = useState('Malwa Plateau');
  const [selectedSeason, setSelectedSeason] = useState('Southwest Monsoon');

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Historical forecast performance and model insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verification Cycle: 2024-2025 Consolidated | Ground-Truth Stations: 142 AWS Active</span>
          </div>

          <button
            onClick={() => showToast('Exporting Analytics Package (NetCDF / CSV / Parquet)...', 'success')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics Package (CSV/NetCDF)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold text-slate-700">
          
          <div className="relative">
            <select className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option>Central & West India (Malwa & Konkan)</option>
              <option>Northern Plains</option>
              <option>Southern Peninsula</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option>All Parameters (Temp, Rain, Wind)</option>
              <option>Temperature (2m)</option>
              <option>Rainfall (24h Accumulation)</option>
              <option>Wind Velocity</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option>All 5 Models (GFS, NCUM, AI, EPS, Blended)</option>
              <option>Operational Blended Consensus</option>
              <option>AI Neural NWP</option>
              <option>NCUM (IMD)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option>24h (Consensus Target)</option>
              <option>6h (Nowcast)</option>
              <option>48h (Synoptic Lead)</option>
              <option>72h (Extended)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option>Southwest Monsoon & Post-Monsoon 2024-25</option>
              <option>Pre-Monsoon 2025</option>
              <option>Winter 2024-25</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option>Last 90 Days (01 Aug - 31 Oct)</option>
              <option>Last 30 Days</option>
              <option>Last 365 Days (Full Annual)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => showToast('Analytics filters reset.', 'info')}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer ml-auto"
          >
            ↻ Reset Filters
          </button>
        </div>
      </div>

      {/* 6 Summary Stat KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            MEAN ABSOLUTE ERROR
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {ANALYTICS_KPIS.mae} <span className="text-xs text-slate-500 font-normal">{ANALYTICS_KPIS.maeSub}</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{ANALYTICS_KPIS.maeBenchmark}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            RMSE
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {ANALYTICS_KPIS.rmse}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{ANALYTICS_KPIS.rmseNote}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            SYSTEMATIC BIAS
          </span>
          <div className="text-xl sm:text-2xl font-black text-sky-800 font-mono">
            {ANALYTICS_KPIS.systematicBias}
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            {ANALYTICS_KPIS.biasNote}
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            FORECAST CONFIDENCE
          </span>
          <div className="text-xl sm:text-2xl font-black text-indigo-700 font-mono">
            {ANALYTICS_KPIS.forecastConfidence}
          </div>
          <div className="text-[10px] text-indigo-800 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <span>{ANALYTICS_KPIS.confidenceNote}</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            MODEL AGREEMENT
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
            {ANALYTICS_KPIS.modelAgreement}
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            {ANALYTICS_KPIS.agreementNote}
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            DATA COVERAGE
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
            {ANALYTICS_KPIS.dataCoverage}
          </div>
          <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{ANALYTICS_KPIS.coverageNote}</span>
          </div>
        </div>

      </div>

      {/* 1. Model Performance Matrix & Comparative Dispersion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table (70% width, lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Model Performance Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Factual statistical evaluation against synoptic AWS ground truth (24h lead cycle).
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-500">
              Benchmark Target: Lead +24h
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-medium">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Model Name</th>
                  <th className="py-2.5 px-3">Resolution / Cycle</th>
                  <th className="py-2.5 px-3">MAE</th>
                  <th className="py-2.5 px-3">RMSE</th>
                  <th className="py-2.5 px-3">Systematic Bias</th>
                  <th className="py-2.5 px-3">Correlation (r)</th>
                  <th className="py-2.5 px-3">Skill Score (ETS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ANALYTICS_MODEL_PERFORMANCE_MATRIX.map((m, i) => (
                  <tr
                    key={i}
                    className={`transition-colors ${
                      m.isHighlighted
                        ? 'bg-sky-50/80 font-bold text-sky-950'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <td className="py-3 px-3 font-extrabold flex items-center gap-1.5">
                      {m.isHighlighted && <span className="w-2 h-2 rounded-full bg-sky-600" />}
                      <span>{m.model}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{m.resCycle}</td>
                    <td className="py-3 px-3 font-mono font-extrabold">{m.mae}</td>
                    <td className="py-3 px-3 font-mono">{m.rmse}</td>
                    <td className="py-3 px-3 font-mono">{m.bias}</td>
                    <td className="py-3 px-3 font-mono text-sky-700 font-extrabold">{m.corr}</td>
                    <td className="py-3 px-3 font-mono text-emerald-700 font-extrabold">{m.skillEts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparative Dispersion Chart (30% width, lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Comparative Dispersion
            </h3>
            <p className="text-[11px] text-slate-500">
              Relative deviation per operational model core.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {ANALYTICS_MODEL_PERFORMANCE_MATRIX.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between font-bold text-[11px]">
                  <span className={m.isHighlighted ? 'text-sky-900 font-black' : 'text-slate-700'}>
                    {m.model.split(' ')[0]} {m.model.split(' ')[1] || ''}
                  </span>
                  <span className="font-mono text-slate-600">{m.dispersion}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.isHighlighted ? 'bg-sky-600' : 'bg-slate-700'
                    }`}
                    style={{ width: m.barWidth }}
                  />
                </div>
              </div>
            ))}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 flex items-start gap-2 mt-4">
              <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <span>ETS denotes Equitable Threat Score for rain thresholds ≥10mm.</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Error Growth by Forecast Lead Horizon (Line Chart) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Error Growth by Forecast Lead Horizon
            </h3>
            <p className="text-xs text-slate-500">
              MAE error curve across lead horizons (+1h to 72h verification cycle).
            </p>
          </div>

          {/* Chart Legends */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-900">
              <span className="w-3 h-0.5 bg-slate-900 rounded-full" />
              <span>Blended Consensus</span>
            </span>
            <span className="flex items-center gap-1.5 text-sky-700">
              <span className="w-3 h-0.5 bg-sky-600 rounded-full" />
              <span>AI Neural NWP</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-0.5 bg-slate-400 rounded-full" />
              <span>NCUM (IMD)</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-0.5 bg-slate-300 rounded-full stroke-dash" />
              <span>GFS Global</span>
            </span>
          </div>
        </div>

        {/* SVG Curve Canvas */}
        <div className="h-56 w-full bg-slate-50 rounded-2xl border border-slate-200 p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-400 flex justify-between">
            <span>2.5°</span>
            <span>2.0°</span>
            <span>1.5°</span>
            <span>1.0°</span>
          </div>

          <svg className="w-full h-36" viewBox="0 0 600 120" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="30" x2="600" y2="30" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="0" y1="60" x2="600" y2="60" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="0" y1="90" x2="600" y2="90" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />

            {/* GFS Global Curve (highest error) */}
            <path d="M0,95 Q150,85 300,60 T600,20" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4,4" />
            
            {/* NCUM Curve */}
            <path d="M0,100 Q150,90 300,68 T600,32" fill="none" stroke="#64748B" strokeWidth="2" />
            
            {/* AI Neural NWP Curve */}
            <path d="M0,108 Q150,98 300,75 T600,40" fill="none" stroke="#0284C7" strokeWidth="2.5" />
            
            {/* Blended Consensus Curve (lowest error) */}
            <path d="M0,112 Q150,104 300,82 T600,48" fill="none" stroke="#0F172A" strokeWidth="3" />
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
            <span>+1h Nowcast</span>
            <span>+3h</span>
            <span>+6h</span>
            <span>+12h Mesoscale</span>
            <span className="font-bold text-slate-900">+24h Synoptic</span>
            <span>+48h Medium-Range</span>
            <span>+72h Extended</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-center justify-between">
          <span>
            <strong>Key Observation:</strong> AI Neural NWP demonstrates lowest error growth rate in the 1h–12h regime (+0.08°C/h), while NCUM and Blended Consensus maintain stability in the 48h–72h horizon.
          </span>
          <span className="font-mono font-black text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-200 shrink-0 ml-3">
            Consensus Gain: -19.4% Error
          </span>
        </div>

      </div>

      {/* 3. Performance by Weather Parameter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            Performance by Weather Parameter
          </h3>
          <span className="text-xs font-bold text-slate-400">
            Standard WMO Skill Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Param 1: Temperature */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span>Temperature (2m)</span>
              <Thermometer className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">0.9°C <span className="text-xs font-normal text-slate-400">MAE</span></div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
              <span>Bias: <strong>-0.1°C</strong></span>
              <span>Corr: <strong className="text-sky-700">r = 0.94</strong></span>
            </div>
            <div className="text-[10px] text-slate-400">High thermal correlation</div>
          </div>

          {/* Param 2: Rainfall Accum */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span>Rainfall Accum. (24h)</span>
              <CloudRain className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">3.2 mm <span className="text-xs font-normal text-slate-400">MAE</span></div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
              <span>Bias: <strong>-0.4 mm</strong></span>
              <span>Corr: <strong className="text-sky-700">r = 0.79</strong></span>
            </div>
            <div className="text-[10px] text-slate-400">Moderate convective correlation</div>
          </div>

          {/* Param 3: Wind Velocity */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span>Surface Wind Velocity</span>
              <Wind className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">2.1 km/h <span className="text-xs font-normal text-slate-400">MAE</span></div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
              <span>Bias: <strong>+0.3 km/h</strong></span>
              <span>Corr: <strong className="text-sky-700">r = 0.86</strong></span>
            </div>
            <div className="text-[10px] text-slate-400">Stable vector resolution</div>
          </div>

          {/* Param 4: Relative Humidity */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span>Relative Humidity</span>
              <Droplets className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">4.8% <span className="text-xs font-normal text-slate-400">MAE</span></div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
              <span>Bias: <strong>+1.2%</strong></span>
              <span>Corr: <strong className="text-sky-700">r = 0.89</strong></span>
            </div>
            <div className="text-[10px] text-slate-400">Boundary layer agreement</div>
          </div>

          {/* Param 5: Barometric Pressure */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span>Barometric Pressure</span>
              <Gauge className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">0.6 hPa <span className="text-xs font-normal text-slate-400">MAE</span></div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
              <span>Bias: <strong>0.0 hPa</strong></span>
              <span>Corr: <strong className="text-sky-700">r = 0.98</strong></span>
            </div>
            <div className="text-[10px] text-slate-400">Near-zero barometric drift</div>
          </div>

        </div>
      </div>

      {/* 4. Regional Performance & Observation Network Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Topology Map Card (60% width, lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Regional Performance & Observation Network
              </h3>
              <p className="text-xs text-slate-500">
                Verification cluster accuracy across western and central orographic sectors.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="flex items-center gap-1 text-emerald-700"><span className="w-2 h-2 rounded-full bg-emerald-500" /> High Accuracy (&gt;90%)</span>
              <span className="flex items-center gap-1 text-amber-700"><span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate (75–90%)</span>
            </div>
          </div>

          <div className="h-64 rounded-2xl bg-slate-900 p-4 text-white relative overflow-hidden border border-slate-800">
            <svg className="w-full h-full opacity-40">
              <path d="M50,40 Q180,20 320,80 T550,140" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4,4" />
              <circle cx="280" cy="70" r="18" fill="#10B981" fillOpacity="0.3" />
              <circle cx="280" cy="70" r="5" fill="#10B981" />
              <circle cx="160" cy="110" r="14" fill="#0284C7" fillOpacity="0.3" />
              <circle cx="160" cy="110" r="5" fill="#0284C7" />
              <circle cx="380" cy="140" r="14" fill="#F59E0B" fillOpacity="0.3" />
              <circle cx="380" cy="140" r="5" fill="#F59E0B" />
            </svg>

            {/* Regional Pin Cards on Map */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-emerald-500 text-xs text-center">
              <strong className="text-emerald-400 block font-black">Malwa Plateau (91.4%)</strong>
              <span className="text-[10px] text-slate-400">28 Stations Verified</span>
            </div>

            <div className="absolute top-24 left-12 bg-slate-950/90 px-2.5 py-1 rounded-xl border border-sky-500 text-[11px]">
              <span className="text-sky-300 font-bold">Konkan Coast (90.2%)</span>
            </div>

            <div className="absolute bottom-6 right-16 bg-slate-950/90 px-2.5 py-1 rounded-xl border border-amber-500 text-[11px]">
              <span className="text-amber-300 font-bold">Vidarbha Basin (88.7%)</span>
            </div>

            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400">
              Coordinates: 21.5°N – 24.5°N | 73.0°E – 78.5°E · Active Sensors: 142 Surface Stations
            </div>
          </div>
        </div>

        {/* Selected Observation Cluster Details (40% width, lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                SELECTED OBSERVATION CLUSTER
              </span>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Malwa Plateau AWS Cluster
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-mono text-xs font-black">
              Zone MP-04
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">SYNOPTIC ACCURACY</span>
              <span className="text-xl font-black text-emerald-700 font-mono">91.4%</span>
              <div className="text-[10px] text-emerald-800">Verified &gt; Target (85%)</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">FORECAST CONFIDENCE</span>
              <span className="text-xl font-black text-slate-900 font-mono">89.0%</span>
              <div className="text-[10px] text-slate-500">Variance ±1.4%</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">MODEL AGREEMENT</span>
              <span className="text-xl font-black text-slate-900 font-mono">84.0%</span>
              <div className="text-[10px] text-slate-500">4 of 5 Concurrence</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">LEAD-24H MAE</span>
              <span className="text-xl font-black text-sky-800 font-mono">0.98°C</span>
              <div className="text-[10px] text-sky-700">Consensus target</div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Ground Stations Synchronized:</span>
              <strong className="text-slate-900 font-mono">28 AWS Active Telemetry</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Orographic Bias Tendency:</span>
              <strong className="text-slate-900 font-mono">-0.12°C (Neutral-Cool)</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Last Synoptic Radiosonde Sync:</span>
              <strong className="text-slate-900 font-mono">06:00 UTC (11:30 IST)</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => showToast('Inspecting 28 AWS Sensors in Malwa Plateau', 'info')}
              className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Inspect AWS Sensors
            </button>
            <button
              onClick={() => showToast('Exporting NetCDF Telemetry File...', 'success')}
              className="py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Regional Telemetry NetCDF
            </button>
          </div>
        </div>

      </div>

      {/* 5. Seasonal Performance & Monsoon Dynamics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Seasonal Performance & Monsoon Dynamics
            </h3>
            <p className="text-xs text-slate-500">
              Comparative model reliability across India's meteorological regimes.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            Annual Cycle 2024-2025
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
              <span>PRE-MONSOON</span>
              <span>Mar – May</span>
            </div>
            <h4 className="text-sm font-black text-slate-900">High Thermal Predictability</h4>
            <p className="text-xs text-slate-500 leading-snug">
              Dry synoptic stability with localized convective variance in afternoon heat spikes. Strong temperature correlation (r = 0.96).
            </p>
            <div className="flex justify-between text-xs font-mono font-bold pt-2 border-t border-slate-100 text-slate-700">
              <span>Lead 24h MAE:</span>
              <strong className="text-slate-900">0.86°C</strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200 shadow-2xs space-y-2">
            <div className="flex justify-between text-[11px] font-black uppercase text-sky-800">
              <span>SOUTHWEST MONSOON</span>
              <span>Jun – Sep</span>
            </div>
            <h4 className="text-sm font-black text-sky-950">Heavy Precipitation Verification</h4>
            <p className="text-xs text-slate-600 leading-snug">
              Orographic boundary layer stress tests along the Western Ghats; blended consensus mitigates isolated rain gauge over-forecasting.
            </p>
            <div className="flex justify-between text-xs font-mono font-bold pt-2 border-t border-sky-200 text-sky-900">
              <span>Lead 24h Rain MAE:</span>
              <strong className="text-sky-950">2.8 mm</strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
              <span>POST-MONSOON / CYCLONIC</span>
              <span>Oct – Dec</span>
            </div>
            <h4 className="text-sm font-black text-slate-900">Coastal Squall Accuracy</h4>
            <p className="text-xs text-slate-500 leading-snug">
              High cyclonic track precision in Arabian Sea / Bay of Bengal clusters. Squall landfall deviation maintained under 18 km at 36h lead.
            </p>
            <div className="flex justify-between text-xs font-mono font-bold pt-2 border-t border-slate-100 text-slate-700">
              <span>Track Error (36h):</span>
              <strong className="text-slate-900">16.4 km</strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
              <span>WINTER REGIME</span>
              <span>Jan – Feb</span>
            </div>
            <h4 className="text-sm font-black text-slate-900">Synoptic Fog & Min-Temp</h4>
            <p className="text-xs text-slate-500 leading-snug">
              Stable boundary inversions with highly repeatable nocturnal cooling patterns across northern and central plains.
            </p>
            <div className="flex justify-between text-xs font-mono font-bold pt-2 border-t border-slate-100 text-slate-700">
              <span>Min-Temp MAE:</span>
              <strong className="text-slate-900">0.74°C</strong>
            </div>
          </div>

        </div>
      </div>

      {/* 6. Blended Consensus vs Individual Component Models Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Blended Consensus vs Individual Component Models
            </h3>
            <p className="text-xs text-slate-500">
              Empirical error reduction achieved through multi-model super-ensemble integration.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            Consolidated Delta Evaluation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-medium">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Forecast Lead Horizon</th>
                <th className="py-2.5 px-3">GFS Standalone</th>
                <th className="py-2.5 px-3">NCUM Standalone</th>
                <th className="py-2.5 px-3">AI Neural NWP</th>
                <th className="py-2.5 px-3">Regional EPS</th>
                <th className="py-2.5 px-3 text-sky-800 font-black">Blended Consensus</th>
                <th className="py-2.5 px-3 text-emerald-700 font-black">Net Error Reduction (Δ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BLENDED_VS_COMPONENT_MODELS.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    row.isTarget
                      ? 'bg-sky-50/70 font-bold text-sky-950'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <td className="py-3 px-3 font-extrabold">{row.horizon}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{row.gfs}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{row.ncum}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{row.aiNeural}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{row.regionalEps}</td>
                  <td className="py-3 px-3 font-mono font-black text-sky-900">{row.blended}</td>
                  <td className="py-3 px-3 font-mono font-extrabold text-emerald-700">{row.reduction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          * Statistical evidence demonstrates systematic cancellation of anti-correlated regional biases through weighted Bayesian blending.
        </p>

      </div>

      {/* 7. Historical Validation (Forecast vs Ground-Truth AWS) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Historical Validation (Forecast vs Ground-Truth AWS)
            </h3>
            <p className="text-xs text-slate-500">
              Time-series audit against verified automatic weather station telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>Event Case:</span>
            <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 font-mono">
              24 Oct 2025 Severe Squall Passage - Indore Sector ⬍
            </span>
          </div>
        </div>

        {/* Audit Table & Integrity Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-medium">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Hour (UTC / IST)</th>
                  <th className="py-2.5 px-3">Operational Forecast</th>
                  <th className="py-2.5 px-3">Actual Observed AWS</th>
                  <th className="py-2.5 px-3">Deviation (Delta)</th>
                  <th className="py-2.5 px-3">Alert Calibration Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {HISTORICAL_VALIDATION_EVENT_AUDIT.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.hour}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{row.forecast}</td>
                    <td className="py-3 px-3 font-mono font-black text-slate-900">{row.observed}</td>
                    <td className="py-3 px-3 font-mono font-black text-emerald-700">{row.delta}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${row.statusClass}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Event Telemetry Integrity */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              EVENT TELEMETRY INTEGRITY
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Lead Time of Alert:</span>
                <strong className="text-slate-900 font-mono">+4.5 Hours Prior</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Peak Wind Gust Capture:</span>
                <strong className="text-slate-900 font-mono">95.5% (65 vs 68 km/h)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rain Total Accuracy:</span>
                <strong className="text-slate-900 font-mono">90.8% (45.7 vs 49.4 mm)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sounding Station:</span>
                <strong className="text-slate-900 font-mono">Bhopal Aerodrome (42623)</strong>
              </div>
            </div>

            <button
              onClick={() => showToast('Opening Raw Radiosonde & Sounding Logs...', 'info')}
              className="w-full mt-2 py-2 rounded-xl bg-white hover:bg-slate-100 text-sky-700 font-bold border border-slate-200 text-xs transition-colors text-center cursor-pointer"
            >
              View Raw Radiosonde & Sounding Logs ⬍
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
