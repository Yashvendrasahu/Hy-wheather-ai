// src/components/moes/MoesCockpitScreen.jsx
import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import {
  SYNOPTIC_PRESETS,
  CLIMATIC_ZONES,
  MOES_API_BASE_URL
} from '../../services/moesWeatherApi.js';
import TopAlertRibbon from './TopAlertRibbon.jsx';
import PrecipitationModelChart from './PrecipitationModelChart.jsx';
import UncertaintyRangeBar from './UncertaintyRangeBar.jsx';
import ExtremeBustGauges from './ExtremeBustGauges.jsx';
import MultiParameterCards from './MultiParameterCards.jsx';
import {
  Sparkles,
  Zap,
  Activity,
  Layers,
  Cpu,
  Radio,
  Sliders,
  Play,
  RotateCw,
  Code2,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  ShieldCheck,
  Flame,
  CloudLightning,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function MoesCockpitScreen() {
  const {
    moesPayload,
    moesResult,
    moesLoading,
    moesActivePresetId,
    moesBackendHealth,
    moesInferenceSource,
    runMoesInference,
    applyMoesPreset,
    updateMoesField,
    pingMoesBackend,
    formatTemp,
    showToast
  } = useWeather();

  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [showParamEditor, setShowParamEditor] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const handleCopy = (text, type) => {
    navigator.clipboard?.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    if (type === 'payload') {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    } else {
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    }
    showToast('Copied JSON to clipboard');
  };

  const precipitation = moesResult?.precipitation || {};
  const temperature = moesResult?.temperature || {};
  const wind = moesResult?.wind || {};

  return (
    <div className="space-y-6">
      {/* Top Header & Architecture Specification Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold flex items-center gap-1 border border-sky-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              MoES SIH26081 Specification
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-mono">POST /predict</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Hybrid AI + Conformal Coverage</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            MoES Weather AI Engine Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Live integration with Ministry of Earth Sciences numerical prediction models, conformal uncertainty bounds, and physics-informed thermodynamic veto filters.
          </p>
        </div>

        {/* Live Backend Connectivity Card */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${moesBackendHealth.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span>Backend API:</span>
                <span className={moesBackendHealth.online ? 'text-emerald-700' : 'text-amber-700'}>
                  {moesBackendHealth.statusText}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {MOES_API_BASE_URL}
              </div>
            </div>
          </div>

          <button
            onClick={pingMoesBackend}
            disabled={moesLoading}
            title="Ping backend health"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 ${moesLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 1. TOP ALERT RIBBON (Binding directly to precipitation.alert: GREEN, YELLOW, ORANGE, RED) */}
      <TopAlertRibbon
        alertLevel={precipitation.alert}
        precipitation={precipitation}
        cin={moesPayload.cin}
        isBustWarning={precipitation.is_bust_warning}
      />

      {/* 2. SYNOPTIC TEST PRESETS FOR 1-CLICK DEMO (Section 5) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-extrabold text-slate-900">
                Synoptic Test Presets (1-Click Live Model Demonstrations)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any benchmark meteorological scenario to instantly transmit the exact 19-parameter payload to the model.
            </p>
          </div>

          <button
            onClick={() => setShowParamEditor(!showParamEditor)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showParamEditor ? 'Hide Parameter Tuner' : 'Custom Parameter Tuner'}</span>
          </button>
        </div>

        {/* 3 Preset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SYNOPTIC_PRESETS.map((preset) => {
            const isSelected = moesActivePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => applyMoesPreset(preset.id)}
                disabled={moesLoading}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-300 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {preset.badge}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      preset.expectedAlert === 'RED'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : preset.expectedAlert === 'YELLOW'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-orange-100 text-orange-800 border border-orange-300'
                    }`}>
                      Target: {preset.expectedAlert} Alert
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-2">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    {preset.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                  <div className="text-slate-700 font-semibold truncate">
                    Expected: {preset.expectedSummary}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">
                    CAPE: {preset.payload.cape} J/kg • CIN: {preset.payload.cin} J/kg
                  </div>
                </div>

                <div className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors ${
                  isSelected ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 group-hover:bg-slate-200'
                }`}>
                  {moesLoading && isSelected ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Computing Model...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isSelected ? 'Active Model State' : 'Run Scenario'}</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom 19-Parameter Tuner Drawer (Expandable) */}
        {showParamEditor && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Interactive 19-Parameter Synoptic Tuner
                </h3>
                <p className="text-xs text-slate-500">
                  Modify individual NWP outputs, thermodynamic parameters (CAPE/CIN), or topographic slope.
                </p>
              </div>

              <button
                onClick={() => runMoesInference()}
                disabled={moesLoading}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {moesLoading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>Execute Live Model Inference</span>
              </button>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {/* Latitude */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.01"
                  value={moesPayload.latitude}
                  onChange={(e) => updateMoesField('latitude', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.01"
                  value={moesPayload.longitude}
                  onChange={(e) => updateMoesField('longitude', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* Climatic Zone */}
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Climatic Zone</label>
                <select
                  value={moesPayload.climatic_zone}
                  onChange={(e) => updateMoesField('climatic_zone', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                >
                  {CLIMATIC_ZONES.map(z => (
                    <option key={z.value} value={z.value}>{z.label}</option>
                  ))}
                </select>
              </div>

              {/* GFS Precip */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">tp_gfs (mm)</label>
                <input
                  type="number"
                  value={moesPayload.tp_gfs}
                  onChange={(e) => updateMoesField('tp_gfs', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* ECMWF Precip */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">tp_ecmwf (mm)</label>
                <input
                  type="number"
                  value={moesPayload.tp_ecmwf}
                  onChange={(e) => updateMoesField('tp_ecmwf', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* NCUM Precip */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">tp_ncum (mm)</label>
                <input
                  type="number"
                  value={moesPayload.tp_ncum}
                  onChange={(e) => updateMoesField('tp_ncum', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* WRF Precip */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">tp_wrf (mm)</label>
                <input
                  type="number"
                  value={moesPayload.tp_wrf}
                  onChange={(e) => updateMoesField('tp_wrf', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* CAPE */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">CAPE (J/kg)</label>
                <input
                  type="number"
                  value={moesPayload.cape}
                  onChange={(e) => updateMoesField('cape', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-rose-600"
                />
              </div>

              {/* CIN */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  CIN Lid (J/kg) {moesPayload.cin > 80 ? '🔒 VETO' : ''}
                </label>
                <input
                  type="number"
                  value={moesPayload.cin}
                  onChange={(e) => updateMoesField('cin', e.target.value)}
                  className={`w-full px-2.5 py-1.5 bg-white border rounded-lg font-mono font-bold ${
                    moesPayload.cin > 80 ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-slate-200'
                  }`}
                />
              </div>

              {/* T2M GFS */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">t2m_gfs (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={moesPayload.t2m_gfs}
                  onChange={(e) => updateMoesField('t2m_gfs', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* T2M ECMWF */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">t2m_ecmwf (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={moesPayload.t2m_ecmwf}
                  onChange={(e) => updateMoesField('t2m_ecmwf', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* Wind Shear */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Wind Shear (m/s)</label>
                <input
                  type="number"
                  value={moesPayload.wind_shear}
                  onChange={(e) => updateMoesField('wind_shear', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* Radar max dBz */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Radar Max dBZ</label>
                <input
                  type="number"
                  value={moesPayload.radar_max_dbz}
                  onChange={(e) => updateMoesField('radar_max_dbz', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* Satellite CTT */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sat CTT (°C)</label>
                <input
                  type="number"
                  value={moesPayload.satellite_ctt_celsius}
                  onChange={(e) => updateMoesField('satellite_ctt_celsius', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {/* Slope Deg */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Slope (°)</label>
                <input
                  type="number"
                  step="0.1"
                  value={moesPayload.terrain_slope_deg}
                  onChange={(e) => updateMoesField('terrain_slope_deg', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. MULTI-MODEL PRECIPITATION COMPARISON CHART */}
      <PrecipitationModelChart
        payload={moesPayload}
        precipitation={precipitation}
      />

      {/* 4. CONFORMAL UNCERTAINTY RANGE (p10, p50, p90) */}
      <UncertaintyRangeBar
        precipitation={precipitation}
      />

      {/* 5. EXTREME BUST GAUGE & THERMODYNAMIC GATING */}
      <ExtremeBustGauges
        payload={moesPayload}
        precipitation={precipitation}
      />

      {/* 6. MULTI-PARAMETER THERMAL & WIND CARDS */}
      <MultiParameterCards
        temperature={temperature}
        wind={wind}
        formatTemp={formatTemp}
      />

      {/* 7. LIVE JSON DATA CONTRACTS INSPECTOR (TECHNICAL AUDIT / JUDGING) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Live Data Contract Inspector (POST /predict)
            </h3>
          </div>

          <button
            onClick={() => setShowJsonInspector(!showJsonInspector)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>{showJsonInspector ? 'Collapse JSON View' : 'Inspect JSON Request & Response'}</span>
            {showJsonInspector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showJsonInspector && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            {/* Input Payload */}
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-slate-400 font-bold">1. INPUT REQUEST PAYLOAD</span>
                <button
                  onClick={() => handleCopy(moesPayload, 'payload')}
                  className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPayload ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="max-h-80 overflow-y-auto custom-scrollbar text-[11px] leading-relaxed text-emerald-300">
                {JSON.stringify(moesPayload, null, 2)}
              </pre>
            </div>

            {/* Output Response */}
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">2. MODEL INFERENCE OUTPUT</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-sky-300">
                    Source: {moesInferenceSource}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(moesResult, 'result')}
                  className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300"
                >
                  {copiedResult ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedResult ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="max-h-80 overflow-y-auto custom-scrollbar text-[11px] leading-relaxed text-sky-300">
                {JSON.stringify(moesResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
