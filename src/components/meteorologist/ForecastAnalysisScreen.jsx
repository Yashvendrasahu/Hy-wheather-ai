// src/components/meteorologist/ForecastAnalysisScreen.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import {
  FORECAST_HOURLY_8STEP,
  MODEL_COMPARISON_MATRIX,
  ENSEMBLE_WEIGHTS,
  GROUND_TRUTH_VERIFICATION_TABLE,
  ACTIVE_SURVEILLANCE_EVENTS
} from '../../data/meteorologistData.js';
import {
  Sparkles,
  MapPin,
  Clock,
  RefreshCw,
  CloudRain,
  Wind,
  Droplets,
  Gauge,
  Zap,
  Activity,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Download,
  Send,
  FileText,
  Compass,
  ArrowRight,
  ChevronDown,
  Layers,
  Thermometer,
  ShieldAlert
} from 'lucide-react';

export default function ForecastAnalysisScreen() {
  const {
    targetObservatory,
    synopticLeadHorizon,
    setSynopticLeadHorizon,
    forecastViewWindow,
    setForecastViewWindow,
    customWeights,
    setCustomWeights,
    setShowBulletinModal,
    setShowSoundingModal,
    setShowDisasterLiaisonModal,
    showToast
  } = useMeteorologist();

  const [activeParamTab, setActiveParamTab] = useState('Temperature');
  const [weights, setWeights] = useState(customWeights);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [selectedSpatialStep, setSelectedSpatialStep] = useState('+6H (18:00 IST)');
  const [spatialParam, setSpatialParam] = useState('Rainfall Accumulation (mm)');

  const leadHorizons = ['1h', '3h', '6h', '12h', '24h', '48h', '72h'];
  const viewWindows = ['6H', '24H', '3D', '7D'];
  const matrixTabs = ['Temperature', 'Rainfall', 'Rain Probability', 'Wind', 'Humidity', 'CAPE / Instability'];

  const handleApplyOverride = () => {
    setIsRecalculating(true);
    setCustomWeights(weights);
    setTimeout(() => {
      setIsRecalculating(false);
      showToast('Ensemble weights recalculated! Blended consensus updated.', 'success');
    }, 500);
  };

  const handleResetWeights = () => {
    const defaultW = { gfs: 40, ncum: 60, aiNeural: 33, regionalEps: 25 };
    setWeights(defaultW);
    setCustomWeights(defaultW);
    showToast('Reset to operational default ensemble weights.', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Synoptic Lead Horizon & View Window Control Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Synoptic Lead Horizon Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
            SYNOPTIC LEAD HORIZON:
          </span>
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            {leadHorizons.map((h) => {
              const isActive = synopticLeadHorizon === h;
              return (
                <button
                  key={h}
                  onClick={() => {
                    setSynopticLeadHorizon(h);
                    showToast(`Loaded synoptic horizon: ${h}`);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {h === '24h' ? '24h (Consensus Target)' : h}
                </button>
              );
            })}
          </div>
        </div>

        {/* View Window & Force Assimilation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">VIEW WINDOW:</span>
            <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              {viewWindows.map((vw) => (
                <button
                  key={vw}
                  onClick={() => setForecastViewWindow(vw)}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    forecastViewWindow === vw
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {vw}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => showToast('Assimilation Cycle 06:00 UTC forced and verified across cluster.', 'success')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
            <span>Force Assimilation Cycle</span>
          </button>
        </div>

      </div>

      {/* Target Observatory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
        <div>
          <div className="text-[11px] font-mono font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <span>METEOROLOGICAL RESEARCH WORKSTATION</span>
            <span>•</span>
            <span>{targetObservatory.lat}° N, {targetObservatory.lng}° E</span>
            <span>•</span>
            <span>Elevation {targetObservatory.elevation}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Forecast Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Unified Multi-Model Synoptic Intelligence & Probabilistic Guidance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>TARGET OBSERVATORY:</span>
            <span className="text-slate-900 font-extrabold">{targetObservatory.name}</span>
            <button
              onClick={() => showToast('Choose alternative AWS station from 142 network nodes.', 'info')}
              className="text-[11px] text-sky-700 hover:underline font-bold ml-1 cursor-pointer"
            >
              Change Location
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>RUN ASSIMILATION: Updated 2 min ago (Cycle 06:00 UTC)</span>
          </div>
        </div>
      </div>

      {/* 1. Hero Final Blended Operational Forecast Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
        
        {/* Top Title & Confidence Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              SYNOPTIC STATUS · NEXT 24 HOURS
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Final Blended Operational Forecast
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Ensemble Confidence: HIGH</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-black uppercase font-mono">
              WEIGHTED BLEND v4.2
            </span>
          </div>
        </div>

        {/* Big Temp & 6 Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Big Temp & Headline */}
          <div className="space-y-2 lg:border-r lg:border-slate-100 lg:pr-6">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              SURFACE TEMPERATURE
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 font-mono tracking-tight">
                28°C
              </span>
              <div className="text-sm font-bold text-slate-500 font-mono">
                / Feels <strong className="text-slate-800">30.5°C</strong>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-extrabold text-slate-900">
                Partly Cloudy with Convective Threat
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Convective pre-monsoonal squall line expected to mature in western MP corridor between 17:30 and 20:30 IST.
              </p>
            </div>
          </div>

          {/* 6 Core Scientific Telemetry Metrics */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            {/* Metric 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase">
                <span>RAIN PROBABILITY</span>
                <CloudRain className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">62%</div>
              <div className="text-[11px] font-semibold text-sky-700">Elevated after 17:00 IST</div>
            </div>

            {/* Metric 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase">
                <span>RAINFALL ACCUM. (24H)</span>
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">12 mm</div>
              <div className="text-[11px] font-semibold text-slate-500">Spread: 9.5 – 14.2 mm</div>
            </div>

            {/* Metric 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase">
                <span>SURFACE WIND</span>
                <Wind className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">18 km/h NW</div>
              <div className="text-[11px] font-semibold text-slate-500">Gusts up to 28 km/h</div>
            </div>

            {/* Metric 4 */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase">
                <span>RELATIVE HUMIDITY</span>
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">71%</div>
              <div className="text-[11px] font-semibold text-slate-500">Dew point: 22.4°C</div>
            </div>

            {/* Metric 5 */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase">
                <span>BAROMETRIC PRESSURE</span>
                <Gauge className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">1008.4 hPa</div>
              <div className="text-[11px] font-semibold text-amber-700">Tendency: -1.2 hPa / 3h</div>
            </div>

            {/* Metric 6 */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase">
                <span>CAPE / INSTABILITY</span>
                <Zap className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-xl font-black text-amber-600 font-mono">1850 J/kg</div>
              <div className="text-[11px] font-semibold text-rose-700 font-bold">Squall trigger potential</div>
            </div>

          </div>

        </div>

        {/* Synoptic 8-Step Hourly Profile Strip (14:00 - 21:00 IST) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>SYNOPTIC 8-STEP HOURLY PROFILE (14:00 – 21:00 IST)</span>
            <span className="text-[11px] font-mono text-slate-400">Assimilation Verification Window</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {FORECAST_HOURLY_8STEP.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  step.isPeak
                    ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-300 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                {step.isPeak && (
                  <span className="inline-block text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-sky-600 text-white font-mono mb-1">
                    PEAK
                  </span>
                )}
                <div className="text-xs font-extrabold text-slate-600 font-mono">{step.time}</div>
                <div className="text-lg font-black text-slate-900 font-mono my-1">{step.temp}</div>
                <div className="text-[11px] font-bold text-sky-700">{step.rainProb} · {step.wind}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. Inter-Model Synoptic Spread: Model Comparison Matrix */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              INTER-MODEL SYNOPTIC SPREAD
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Model Comparison Matrix
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto no-scrollbar">
            {matrixTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveParamTab(tab)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeParamTab === tab
                    ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-medium">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Meteorological Parameter</th>
                <th className="py-2.5 px-3">GFS (0.25° NOAA)</th>
                <th className="py-2.5 px-3">NCUM (12 km IMD/NCMRWF)</th>
                <th className="py-2.5 px-3">AI Neural NWP (0.1°)</th>
                <th className="py-2.5 px-3">Regional EPS (21-MEM)</th>
                <th className="py-2.5 px-3 text-sky-700 font-extrabold">Blended Consensus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MODEL_COMPARISON_MATRIX.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>{row.param}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">{row.gfs}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{row.ncum}</td>
                  <td className="py-3 px-3 font-mono text-sky-700 font-bold">{row.aiNeural}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{row.regionalEps}</td>
                  <td className="py-3 px-3 font-mono font-black text-slate-900 text-sm bg-sky-50/50">
                    {row.blended}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Temperature Spread Variance Visualizer Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">TEMPERATURE SPREAD VARIANCE (27.0°C – 30.0°C RANGE)</span>
            <span className="text-emerald-700 font-mono">MAX SPREAD: Δ 1.4°C (CONTROLLED COHESION)</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="w-24 text-slate-500 text-[11px]">GFS (0.25°)</span>
              <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-600 rounded-full" style={{ width: '74%' }} />
              </div>
              <span className="w-16 text-right font-bold">+1.2°C</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-24 text-slate-500 text-[11px]">NCUM (12 km)</span>
              <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-600 rounded-full" style={{ width: '45%' }} />
              </div>
              <span className="w-16 text-right font-bold text-sky-700">-0.2°C</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-24 text-slate-500 text-[11px]">AI Neural NWP</span>
              <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '55%' }} />
              </div>
              <span className="w-16 text-right font-bold text-indigo-700">+0.1°C</span>
            </div>

            <div className="flex items-center gap-3 font-black">
              <span className="w-24 text-slate-900 text-[11px]">Blended Consensus</span>
              <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 rounded-full" style={{ width: '50%' }} />
              </div>
              <span className="w-16 text-right text-slate-900">DATUM</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Geographical Model Comparison (Synchronized Spatial Analysis) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              SPATIAL CONVECTIVE RESOLUTION
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Geographical Model Comparison (Synchronized Spatial Analysis)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
            <span>Parameter:</span>
            <span className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200">
              {spatialParam}
            </span>
            <span>Step:</span>
            <span className="px-2 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-200">
              {selectedSpatialStep}
            </span>
            <span>Region:</span>
            <span className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200">
              Central India / Malwa Plateau
            </span>
          </div>
        </div>

        {/* Spatial Colorbar */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono py-1">
          <span>SPATIAL COLORBAR (mm / 6h):</span>
          <div className="flex items-center gap-2">
            <span>0 mm</span>
            <div className="w-36 sm:w-64 h-2 rounded-full bg-gradient-to-r from-sky-200 via-sky-500 via-amber-400 to-rose-600" />
            <span>10 mm → 25 mm → 50+ mm</span>
          </div>
          <span className="hidden sm:inline text-sky-700 font-bold">⇄ Pan & Zoom Locked (22.7°N, 75.8°E)</span>
        </div>

        {/* 3-Panel Side-by-Side Map Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Panel A: Raw GFS */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold">Panel A: Raw GFS (0.25° Global)</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                COARSE GRID
              </span>
            </div>

            {/* Simulated Grid Graphics */}
            <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              <div className="w-28 h-28 rounded-full bg-sky-600/30 blur-xl" />
              <div className="relative text-center p-3">
                <span className="px-2 py-1 rounded bg-slate-900/80 text-[11px] font-mono text-sky-300 border border-slate-700">
                  Indore AWS
                </span>
                <p className="text-[11px] text-slate-300 mt-2 font-medium">
                  Diffuse precipitation footprint (Max 11.2 mm)
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Broad regional frontal distribution. Sub-grid convection under-resolved.
            </p>
          </div>

          {/* Panel B: Raw NCUM */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold">Panel B: Raw NCUM (Unified Model)</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
                12 KM REGIONAL
              </span>
            </div>

            {/* Simulated Grid Graphics */}
            <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
              <div className="w-24 h-24 rounded-full bg-amber-500/40 blur-lg" />
              <div className="relative text-center p-3">
                <span className="px-2 py-1 rounded bg-slate-900/80 text-[11px] font-mono text-amber-300 border border-slate-700">
                  Indore AWS
                </span>
                <p className="text-[11px] text-amber-200 mt-2 font-bold">
                  Sharp convective core (Indore-Ujjain corridor)
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Strong boundary layer convergence along Vindhyan slopes (+16 mm core).
            </p>
          </div>

          {/* Panel C: Operational AI Blended Grid */}
          <div className="p-4 rounded-2xl bg-sky-950 text-white space-y-3 border border-sky-800 relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-sky-300">Panel C: Operational AI Blended Grid</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-600 text-white font-mono">
                CONSENSUS
              </span>
            </div>

            {/* Simulated Grid Graphics */}
            <div className="h-44 rounded-xl bg-slate-950 border border-sky-700 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px] opacity-60" />
              <div className="w-28 h-28 rounded-full bg-sky-500/50 blur-md animate-pulse-subtle" />
              <div className="relative text-center p-3">
                <span className="px-2 py-1 rounded bg-sky-950 text-[11px] font-mono text-white border border-sky-400 font-bold">
                  22.7°N, 75.8°E
                </span>
                <p className="text-[11px] text-sky-200 mt-2 font-bold">
                  Optimized Consensus Contour (12.0 mm mean)
                </p>
              </div>
            </div>

            <p className="text-[11px] text-sky-200 leading-snug">
              Calibrated neural-physical consensus with reduced boundary distortion.
            </p>
          </div>

        </div>

      </div>

      {/* 4. Forecast Probability & Uncertainty Distribution + Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Probability Envelope Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                ENSEMBLE PROBABILITY DENSITY
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Forecast Probability & Uncertainty Distribution
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-bold">
              LEAD TIME: 12H TO 36H
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>TEMPERATURE FORECAST ENVELOPE (P10 – P90 CONFIDENCE CONE)</span>
              <span>UNITS: °C OVER FORECAST LEAD</span>
            </div>

            {/* SVG Forecast Cone */}
            <div className="h-40 w-full bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden flex items-end p-4">
              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                {/* Confidence Area */}
                <polygon
                  points="0,80 100,75 200,60 300,50 400,35 500,20 500,95 400,90 300,85 200,80 100,80 0,80"
                  fill="#0284C7"
                  fillOpacity="0.12"
                />
                {/* P90 Ceiling */}
                <path d="M0,80 L100,75 L200,60 L300,50 L400,35 L500,20" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4,4" />
                {/* Median P50 */}
                <path d="M0,80 L100,77 L200,70 L300,65 L400,58 L500,50" fill="none" stroke="#0284C7" strokeWidth="2.5" />
                {/* P10 Floor */}
                <path d="M0,80 L100,80 L200,80 L300,85 L400,90 L500,95" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="4,4" />
              </svg>
            </div>

            {/* Percentile Cards */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">P10 (LOWER)</div>
                <div className="text-base font-black text-slate-900 font-mono">24°C</div>
                <div className="text-[10px] text-slate-500">4 mm rain</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">P30</div>
                <div className="text-base font-black text-slate-900 font-mono">26°C</div>
                <div className="text-[10px] text-slate-500">8 mm rain</div>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-300">
                <div className="text-[10px] text-sky-800 font-bold uppercase">P50 (MEDIAN)</div>
                <div className="text-base font-black text-sky-900 font-mono">28°C</div>
                <div className="text-[10px] text-sky-700 font-bold">12 mm rain</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">P70</div>
                <div className="text-base font-black text-slate-900 font-mono">30°C</div>
                <div className="text-[10px] text-slate-500">18 mm rain</div>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <div className="text-[10px] text-rose-800 font-bold uppercase">P90 (RISK CEILING)</div>
                <div className="text-base font-black text-rose-900 font-mono">32°C</div>
                <div className="text-[10px] text-rose-700 font-bold">26 mm rain</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Uncertainty Diagnostics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              SYNOPTIC METRICS
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Uncertainty Diagnostics
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Forecast Spread</span>
              <span className="font-mono font-bold text-slate-900">±2.1°C / ±4.5 mm</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Model Variance (σ)</span>
              <span className="font-mono font-bold text-sky-700">0.42 σ (Low-Mod)</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Synoptic Instability</span>
              <span className="font-mono font-bold text-rose-700">CAPE 1850 J/kg</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Uncertainty Trend</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <span>↘ Converging</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block mb-0.5">Forecaster Note:</strong>
              Spread envelope remains tightly bounded for temperature, but diverges noticeably in rainfall volume between 17:00 and 19:30 due to localized convective micro-physics.
            </div>
          </div>
        </div>

      </div>

      {/* 5. Dynamic Ensemble Weights & Synoptic Override */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              ENSEMBLE ARCHITECTURE
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Dynamic Ensemble Weights & Synoptic Override
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
              System Generated (Active)
            </span>
            <span className="text-xs text-slate-500 font-semibold">Manual Override Workstation</span>
          </div>
        </div>

        {/* 4 Weight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Weight 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">GFS (0.25° Global)</span>
              <span className="text-sm font-black text-slate-900 font-mono">{weights.gfs}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.gfs}
              onChange={(e) => setWeights({ ...weights, gfs: Number(e.target.value) })}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="text-[11px] text-slate-500 leading-tight">
              Based on 48h spatial skill score (0.84)
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200">
              <span>Skill Rank: 2</span>
              <span>Weight: {(weights.gfs / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Weight 2 */}
          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">NCUM (12 km IMD)</span>
              <span className="text-sm font-black text-sky-800 font-mono">{weights.ncum}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.ncum}
              onChange={(e) => setWeights({ ...weights, ncum: Number(e.target.value) })}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="text-[11px] text-slate-600 leading-tight">
              High regional boundary skill score (0.91)
            </div>
            <div className="flex justify-between text-[10px] font-mono text-sky-700 pt-1 border-t border-sky-200">
              <span>Skill Rank: 1</span>
              <span>Weight: {(weights.ncum / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Weight 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">AI Neural NWP (0.1°)</span>
              <span className="text-sm font-black text-slate-900 font-mono">{weights.aiNeural}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.aiNeural}
              onChange={(e) => setWeights({ ...weights, aiNeural: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="text-[11px] text-slate-500 leading-tight">
              Fast convective initiation tracking
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200">
              <span>Skill Rank: 3</span>
              <span>Weight: {(weights.aiNeural / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Weight 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">Regional EPS (21-mem)</span>
              <span className="text-sm font-black text-slate-900 font-mono">{weights.regionalEps}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.regionalEps}
              onChange={(e) => setWeights({ ...weights, regionalEps: Number(e.target.value) })}
              className="w-full accent-slate-700 cursor-pointer"
            />
            <div className="text-[11px] text-slate-500 leading-tight">
              Turbulence & spread calibration
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200">
              <span>Skill Rank: 4</span>
              <span>Weight: {(weights.regionalEps / 100).toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Action Button Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            <strong>Notice:</strong> Manual weight overrides will alter operational downstream advisories upon publishing.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetWeights}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Reset to System Weights
            </button>
            <button
              onClick={handleApplyOverride}
              disabled={isRecalculating}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isRecalculating ? 'Recalculating...' : 'Apply Override & Recalculate Blended'}
            </button>
          </div>
        </div>

      </div>

      {/* 6. Model Agreement & Synoptic Disagreement Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Model Agreement Cohesion */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              INTER-MODEL COHESION
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Model Agreement & Synoptic Disagreement Warnings
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900">Temperature Cohesion</span>
                <span className="text-emerald-700 font-bold font-mono">••••• High Agreement</span>
              </div>
              <p className="text-[11px] text-slate-500">Ensemble spread across lead time &lt; 1.2°C</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-amber-900">Rainfall Accumulation Cohesion</span>
                <span className="text-amber-700 font-bold font-mono">••• Moderate Agreement</span>
              </div>
              <p className="text-[11px] text-amber-800">Model spread detected in post-17:00 squall window</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900">Wind Velocity & Shear</span>
                <span className="text-emerald-700 font-bold font-mono">•••• High Agreement</span>
              </div>
              <p className="text-[11px] text-slate-500">Spread bounded within 17 – 21 km/h NW</p>
            </div>

            {/* Warning Callout */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Convective Rainfall Disagreement Detected (Post-18:00 IST)</strong>
                <span>AI Neural NWP projects rapid localized squall (+15 mm accumulation) while global GFS dampens convective initiation. NCUM aligns closely with AI spatial track.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Severe Risk Signal */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Severe Risk Signal
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 text-[10px] font-black uppercase font-mono">
              FLAGGED 06:14 UTC
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <h4 className="text-sm font-black text-rose-600">
              Bust / Rapid Divergence Alert Flagged
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Targeted Sector:</span>
                <span className="font-bold text-slate-900">Mahabaleshwar / Western Ghats Crest</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Model Disagreement:</span>
                <span className="font-bold text-rose-700">Significant (Ensemble Spread &gt; 3.8σ)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Bust Risk Type:</span>
                <span className="font-bold text-slate-800">Orographic Rainfall Under-Forecast</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5">
              <div className="text-[10px] font-black text-sky-400 uppercase tracking-wider">
                OPERATIONAL RECOMMENDATION:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Monitor P90 risk ceiling for localized precipitation burst; verify with live Doppler velocity scan at 16:30 IST. Maintain amber caution status.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 7. Forecast vs Observation Verification (06:00 UTC Ground-Truth Match) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              GROUND-TRUTH MATCHING
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Forecast vs Observation Verification (06:00 UTC Ground-Truth Match)
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600">
            <span>MAE: <strong className="text-slate-900">0.88°C</strong></span>
            <span>•</span>
            <span>RMSE: <strong className="text-slate-900">1.24</strong></span>
            <span>•</span>
            <span>Bias: <strong className="text-slate-900">-0.15 mm</strong></span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase font-sans">
              VALIDATED
            </span>
          </div>
        </div>

        {/* Verification Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-medium">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Meteorological Parameter</th>
                <th className="py-2.5 px-3">Blended Forecast</th>
                <th className="py-2.5 px-3">Observed (Indore AWS)</th>
                <th className="py-2.5 px-3">Absolute Error / Delta</th>
                <th className="py-2.5 px-3">Systematic Bias Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {GROUND_TRUTH_VERIFICATION_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-extrabold text-slate-900">{row.param}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{row.blended}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.observed}</td>
                  <td className="py-3 px-3 font-mono text-sky-700 font-extrabold">{row.delta}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{row.biasStatus}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* 8. Active Weather Events & Operational Action Dock */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              SYNOPTIC SIGNALS & ACTION PROTOCOLS
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Active Weather Events & Operational Action Dock
            </h3>
          </div>
          <span className="text-xs font-bold text-sky-700">
            2 EVENTS MONITORED IN SECTOR
          </span>
        </div>

        {/* 2 Events Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900">Convective Squall Line</h4>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[10px] font-black font-mono">
                PROB 74%
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              WINDOW: 16:00 – 20:30 IST · SEVERITY: MODERATE
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mid-tropospheric dry intrusion interacting with boundary moist plume. Sounding displays severe CAPE at 2100 J/kg with Lifted Index -4.8.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-700">Sounding Profile: CAPE 2100 J/kg</span>
              <button
                onClick={() => setShowSoundingModal(true)}
                className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
              >
                View Doppler Sounding
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900">Localized Downburst Threat</h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black font-mono">
                PROB 48%
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              WINDOW: 18:30 – 20:00 IST · SEVERITY: ELEVATED WATCH
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              DCAPE values exceeding 980 J/kg in south Indore suburban perimeter indicating potential for microburst wind gusts approaching 55 km/h.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-700">Radar Inversion Check: Normal</span>
              <button
                onClick={() => setShowSoundingModal(true)}
                className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
              >
                Examine Radar Echo
              </button>
            </div>
          </div>

        </div>

        {/* Action Buttons Dock */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Ready for Operational Synthesis & Issuance</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showToast('Exporting Synoptic NetCDF / GRIB2 / CSV Package', 'success')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full Synoptic Package (CSV/JSON/GRIB2)</span>
            </button>

            <button
              onClick={() => showToast('Feedback payload dispatched to NCMRWF assimilation server.', 'success')}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Model Feedback to NCMRWF</span>
            </button>

            <button
              onClick={() => setShowBulletinModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate IMD Operational Bulletin</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
