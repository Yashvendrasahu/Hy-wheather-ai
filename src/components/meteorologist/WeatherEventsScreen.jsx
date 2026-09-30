// src/components/meteorologist/WeatherEventsScreen.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import {
  ACTIVE_SURVEILLANCE_EVENTS,
  METEOROLOGIST_SUMMARY_METRICS
} from '../../data/meteorologistData.js';
import {
  Radio,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Clock,
  ArrowRight,
  Send,
  FileText,
  Shield,
  Info,
  Droplets,
  Wind,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function WeatherEventsScreen() {
  const {
    selectedEventId,
    setSelectedEventId,
    activeEvent,
    targetObservatory,
    synopticResult,
    setMetTab,
    setShowBulletinModal,
    setShowDisasterLiaisonModal,
    showToast
  } = useMeteorologist();

  const [activeLayer, setActiveLayer] = useState('radar'); // 'radar' | 'cape' | 'wind' | 'ir'
  const [isPlayingRadar, setIsPlayingRadar] = useState(true);
  const [radarStep, setRadarStep] = useState(2); // 0: 14:00, 1: 16:00, 2: 18:00, 3: 20:00, 4: 22:00
  const [rightTab, setRightTab] = useState('signals'); // 'signals' | 'telemetry'
  const [isSyncing, setIsSyncing] = useState(false);

  // Dynamic telemetry from PyTorch QRNN FastAPI backend
  const p10 = synopticResult?.precipitation?.quantiles_mm?.p10 ?? 18.0;
  const p50 = synopticResult?.precipitation?.quantiles_mm?.p50 ?? 38.0;
  const p90 = synopticResult?.precipitation?.quantiles_mm?.p90 ?? 65.0;
  const bustProb = synopticResult?.precipitation?.nwp_bust_probability ?? 0.78;
  const alertLevel = synopticResult?.precipitation?.alert || 'ORANGE';

  // Filters
  const [regionFilter, setRegionFilter] = useState('All Regions (Central & West)');
  const [typeFilter, setTypeFilter] = useState('All Types (Rain, Squall, Thunder, Heat)');
  const [severityFilter, setSeverityFilter] = useState('All Severities: Normal, Advisory, Watch, Warning');
  const [timeFilter, setTimeFilter] = useState('Next 24H (Consensus Window)');
  const [confidenceFilter, setConfidenceFilter] = useState('Min 60%');

  const handleSyncNwp = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('NWP radar ingestion updated to 06:00 UTC cycle.', 'success');
    }, 600);
  };

  const handleClearFilters = () => {
    setRegionFilter('All Regions (Central & West)');
    setTypeFilter('All Types (Rain, Squall, Thunder, Heat)');
    setSeverityFilter('All Severities: Normal, Advisory, Watch, Warning');
    setTimeFilter('Next 24H (Consensus Window)');
    setConfidenceFilter('Min 60%');
    showToast('Surveillance filters reset.', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Weather Events
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Live Signal Desk</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Monitor significant forecast signals across regions.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated 3 min ago (Cycle 06:00 UTC)</span>
          </div>

          <button
            onClick={handleSyncNwp}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync NWP</span>
          </button>
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold text-slate-700">
          
          {/* Region Dropdown */}
          <div className="relative">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All Regions (Central & West)">All Regions (Central & West)</option>
              <option value="Malwa Plateau">Malwa Plateau</option>
              <option value="Konkan Coast">Konkan Coast</option>
              <option value="Vidarbha Basin">Vidarbha Basin</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All Types (Rain, Squall, Thunder, Heat)">All Types (Rain, Squall, Thunder, Heat)</option>
              <option value="Convective Heavy Rain">Convective Heavy Rain</option>
              <option value="Squall & High Wind">Squall & High Wind</option>
              <option value="Microburst Downburst">Microburst Downburst</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Severities Dropdown */}
          <div className="relative">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All Severities: Normal, Advisory, Watch, Warning">All Severities: Normal, Advisory, Watch, Warning</option>
              <option value="Warning (Red Level)">Warning (Red Level)</option>
              <option value="Watch (Orange/Yellow)">Watch (Orange/Yellow)</option>
              <option value="Advisory (Blue)">Advisory (Blue)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Time Window Dropdown */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Next 24H (Consensus Window)">Next 24H (Consensus Window)</option>
              <option value="Next 6H (Nowcast)">Next 6H (Nowcast)</option>
              <option value="Next 48H">Next 48H</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Confidence Slider Pill */}
          <div className="relative">
            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Min 60%">Confidence: Min 60%</option>
              <option value="Min 75%">Confidence: Min 75%</option>
              <option value="Min 90%">Confidence: Min 90%</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Clear Filters */}
          <button
            onClick={handleClearFilters}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer ml-auto"
          >
            ↻ Clear Filters
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              ACTIVE EVENTS
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {METEOROLOGIST_SUMMARY_METRICS.activeWeatherEvents}
          </div>
          <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>3 high-watch convective squalls</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              HIGH PROBABILITY (&gt;70%)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 font-mono tracking-tight">
            {METEOROLOGIST_SUMMARY_METRICS.highProbabilityEvents}
          </div>
          <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>2 heavy rain, 2 thunderstorm</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              HIGH UNCERTAINTY
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-600 font-mono tracking-tight">
            {METEOROLOGIST_SUMMARY_METRICS.highUncertaintyEvents}
          </div>
          <div className="text-xs font-bold text-indigo-800">
            Ensemble spread &gt; 2.5σ in coastal sectors
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              NEW SIGNALS (PAST 2H)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono tracking-tight">
            {METEOROLOGIST_SUMMARY_METRICS.newSignalsPast2h}
          </div>
          <div className="text-xs font-bold text-emerald-800">
            Localized downburst detected in Vidarbha
          </div>
        </div>

      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (55% width, lg:col-span-7): Regional Synoptic Radar & Hazard Footprint */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            
            {/* Header & Layer Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>Regional Synoptic Radar & Hazard Footprint</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Sector: Central & Western India (Malwa Plateau, Konkan Coast, Vidarbha)
                </p>
              </div>

              {/* Layer Switches & Zoom */}
              <div className="flex items-center gap-1.5">
                <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                  {[
                    { id: 'radar', label: 'Radar dBZ' },
                    { id: 'cape', label: 'CAPE' },
                    { id: 'wind', label: 'Wind' },
                    { id: 'ir', label: 'IR Sat' }
                  ].map((lyr) => (
                    <button
                      key={lyr.id}
                      onClick={() => setActiveLayer(lyr.id)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        activeLayer === lyr.id
                          ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lyr.label}
                    </button>
                  ))}
                </div>

                <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <button onClick={() => showToast('Zoom In')} className="px-2 py-1 hover:text-slate-900 font-bold">+</button>
                  <button onClick={() => showToast('Zoom Out')} className="px-2 py-1 hover:text-slate-900 font-bold">−</button>
                  <button onClick={() => showToast('Full Extent')} className="px-2 py-1 hover:text-slate-900 font-bold">⛶</button>
                </div>
              </div>
            </div>

            {/* Dark Radar Viewer Canvas Area */}
            <div className="relative h-[420px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
              
              {/* Radar Grid & Range Rings */}
              <svg className="absolute inset-0 w-full h-full opacity-60">
                <defs>
                  <radialGradient id="radarSweepGlow" cx="45%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                    <stop offset="60%" stopColor="#1E293B" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#radarSweepGlow)" />
                
                {/* Range Rings */}
                <circle cx="45%" cy="40%" r="70" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="45%" cy="40%" r="140" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
                <circle cx="45%" cy="40%" r="220" fill="none" stroke="#1E293B" strokeWidth="1" />
                
                {/* Azimuth Radial Lines */}
                <line x1="45%" y1="0%" x2="45%" y2="80%" stroke="#1E293B" strokeWidth="1" />
                <line x1="0%" y1="40%" x2="90%" y2="40%" stroke="#1E293B" strokeWidth="1" />
              </svg>

              {/* Convective Radar dBZ Blobs */}
              <div className="absolute top-[32%] left-[34%] w-40 h-40 rounded-full bg-rose-500/35 blur-xl animate-pulse" />
              <div className="absolute top-[36%] left-[38%] w-24 h-24 rounded-full bg-amber-500/40 blur-md" />
              <div className="absolute top-[58%] left-[16%] w-32 h-32 rounded-full bg-amber-500/30 blur-lg" />
              <div className="absolute top-[64%] left-[62%] w-28 h-28 rounded-full bg-sky-500/30 blur-md" />

              {/* Interactive Event Pins on Radar */}
              
              {/* Pin 1: Indore (Selected Target) */}
              <div
                onClick={() => setSelectedEventId('evt-indore')}
                className="absolute top-[35%] left-[38%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="flex items-center gap-2 p-2 bg-slate-900/95 backdrop-blur-md rounded-2xl border-2 border-rose-500 text-white shadow-xl group-hover:scale-105 transition-transform">
                  <div className="w-7 h-7 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div className="text-left pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-500 text-white font-mono">
                        WARNING
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">AWS 42680</span>
                    </div>
                    <div className="text-xs font-black text-white">Indore Sector</div>
                    <div className="text-[10px] text-rose-300 font-bold">
                      Heavy Rain (78% Prob) · <strong className="text-white">52 dBZ</strong>
                    </div>
                    <div className="text-[9px] text-sky-400 font-bold mt-0.5">
                      ● Selected for Deep Dive
                    </div>
                  </div>
                </div>
              </div>

              {/* Pin 2: Mumbai */}
              <div
                onClick={() => setSelectedEventId('evt-mumbai')}
                className="absolute top-[62%] left-[18%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-amber-500/80 text-white shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <div className="text-left text-xs">
                    <div className="text-[10px] font-bold text-amber-300">WATCH</div>
                    <div className="font-extrabold text-white text-[11px]">Mumbai (Santacruz)</div>
                    <div className="text-[10px] text-slate-400">Squall & Thunder (64%)</div>
                  </div>
                </div>
              </div>

              {/* Pin 3: Nagpur */}
              <div
                onClick={() => showToast('Nagpur: 42% Cumulus cloud cover', 'info')}
                className="absolute top-[42%] left-[64%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700 text-white shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-300">Nagpur (42% Cumulus)</span>
                </div>
              </div>

              {/* Pin 4: Eastern Vidarbha */}
              <div
                onClick={() => setSelectedEventId('evt-vidarbha')}
                className="absolute top-[68%] left-[68%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-amber-500 text-white shadow-md group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-bold text-amber-300">E. Vidarbha (60% Downburst)</span>
                </div>
              </div>

              {/* Bottom Left Hazard Spectrum Legend */}
              <div className="absolute left-3 bottom-3 z-30 p-2.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] space-y-1">
                <div className="font-black text-slate-400 uppercase tracking-wider">HAZARD SPECTRUM</div>
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Warning (Take Immediate Action)</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Watch / Advisory (Be Prepared)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Monitored / Low Threat</span>
                </div>
              </div>

            </div>

            {/* Bottom Scrubber Player Bar */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsPlayingRadar(!isPlayingRadar)}
                  className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xs cursor-pointer shrink-0"
                >
                  {isPlayingRadar ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="text-xs font-extrabold text-slate-900 font-mono">
                  18:00 IST <span className="text-slate-400 font-normal">(T+4H Nowcast Window)</span>
                </div>
              </div>

              {/* Timeline Track */}
              <div className="flex-1 w-full max-w-sm px-2">
                <div className="relative flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>14:00 (Observed)</span>
                  <span className="text-rose-700 font-bold">18:00 (Peak Threat)</span>
                  <span>22:00 (Dissipating)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={radarStep}
                  onChange={(e) => setRadarStep(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              <div className="text-[11px] font-mono text-slate-500 font-bold shrink-0">
                10 min cadence
              </div>
            </div>

            {/* Operational Synoptic Note Box */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-bold block mb-0.5">Operational Synoptic Note:</strong>
                Severe convective initiation underway over Indore-Ujjain ridge triggered by intense low-level boundary layer moisture pooling from Arabian Sea branch. Cell velocity 24 km/h moving north-east. Urban flash runoff watch recommended for municipal drainage liaisons.
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (45% width, lg:col-span-5): Active Signals & Event Deep Dive */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Top Signals / Telemetry Tab Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRightTab('signals')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    rightTab === 'signals' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Active Signals ({ACTIVE_SURVEILLANCE_EVENTS.length})
                </button>
                <button
                  onClick={() => setRightTab('telemetry')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    rightTab === 'telemetry' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Model Telemetry
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-400 font-bold">
                Priority Sort: Severity ↓
              </span>
            </div>

            {/* Signals List */}
            <div className="space-y-2.5">
              {ACTIVE_SURVEILLANCE_EVENTS.map((evt) => {
                const isSelected = selectedEventId === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventId(evt.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/40 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase font-mono ${
                          evt.alertType === 'WARNING' ? 'bg-rose-600 text-white' :
                          evt.alertType === 'WATCH' ? 'bg-amber-500 text-white' : 'bg-sky-600 text-white'
                        }`}>
                          {evt.alertType}
                        </span>
                        <span className="font-extrabold text-slate-900">{evt.location}</span>
                      </div>
                      <span className="font-black text-rose-600 font-mono text-xs">{evt.deepDiveProb} Prob</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">{evt.headline}</span>
                      <span className="text-slate-500 font-mono">{evt.timeWindow}</span>
                    </div>

                    {isSelected ? (
                      <div className="flex items-center justify-between text-[10px] font-bold text-rose-800 pt-1 border-t border-rose-200">
                        <span>● Active Target for Deep Analysis</span>
                        <span>Ensemble 92% Conf</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                        <span>{evt.description.slice(0, 45)}...</span>
                        <span className="text-sky-700 font-bold">View Analysis →</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Event Deep Dive Card for Selected Target */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5">
            
            {/* Header & Warning Badge */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="text-[10px] font-black text-rose-600 uppercase tracking-wider mb-0.5">
                  CRITICAL HAZARD RADAR PROFILE
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Event Deep Dive: {activeEvent.headline}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Target Station: <strong className="text-slate-800">{targetObservatory.name}</strong>
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-lg text-white text-xs font-black uppercase shadow-2xs ${
                alertLevel === 'RED' ? 'bg-rose-600' :
                alertLevel === 'ORANGE' ? 'bg-orange-600' :
                alertLevel === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-600'
              }`}>
                {alertLevel === 'ORANGE' ? 'WARNING (ORANGE LEVEL)' : `${alertLevel} LEVEL`}
              </span>
            </div>

            {/* 3 Metrics: Probability, Duration, Confidence */}
            <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">PROBABILITY</span>
                <span className="text-lg font-black text-rose-600 font-mono">{Math.round(bustProb * 100)}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">DURATION</span>
                <span className="text-sm font-black text-slate-900 font-mono">{activeEvent.duration}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">CONFIDENCE</span>
                <span className="text-xs font-black text-emerald-700 block mt-1">{activeEvent.confidence}</span>
              </div>
            </div>

            {/* Probabilistic Rainfall Accumulation Spread */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">PROBABILISTIC RAINFALL ACCUMULATION SPREAD</span>
                <span className="text-sky-700 font-mono">Consensus P50: {p50} mm</span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-sky-300" style={{ width: '28%' }} />
                <div className="h-full bg-sky-600" style={{ width: '30%' }} />
                <div className="h-full bg-rose-500" style={{ width: '42%' }} />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                <div>
                  <span className="text-slate-400 block">P10 (Floor)</span>
                  <strong className="text-slate-800 text-xs">{p10} mm</strong>
                </div>
                <div className="text-center">
                  <span className="text-sky-700 font-bold block">P50 (Median)</span>
                  <strong className="text-sky-900 text-sm font-black">{p50} mm</strong>
                </div>
                <div className="text-right">
                  <span className="text-rose-600 font-bold block">P90 (Burst Potential)</span>
                  <strong className="text-rose-700 text-xs font-black">{p90} mm</strong>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                *P90 indicates severe localized waterlogging risk in low-lying peri-urban wards.
              </p>
            </div>

            {/* Multi-Model Ensemble Variance Table */}
            <div className="space-y-2">
              <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                MULTI-MODEL ENSEMBLE VARIANCE (T+6H)
              </div>
              <div className="space-y-1.5 text-xs">
                {activeEvent.multiModelVariance.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-xl border ${
                      m.model.includes('AI Neural')
                        ? 'bg-sky-50 border-sky-300 text-sky-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{m.model}</span>
                    <span className="font-mono">
                      <strong>{m.accum}</strong> | <span className="text-slate-500">{m.peak}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CAPE & Doppler Core Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">CAPE INDEX</span>
                <span className="text-base font-black text-amber-600 font-mono">{activeEvent.capeIndex}</span>
                <div className="text-[10px] text-slate-500">{activeEvent.capeNote}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">DOPPLER REFLECTIVITY</span>
                <span className="text-base font-black text-rose-600 font-mono">{activeEvent.radarReflectivity}</span>
                <div className="text-[10px] text-slate-500">{activeEvent.radarNote}</div>
              </div>
            </div>

            {/* Lead +1H Verification */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-bold">
              <div>
                <span className="text-[10px] text-emerald-700 uppercase block">{activeEvent.verification.leadHorizon}</span>
                <span>{activeEvent.verification.text}</span>
              </div>
              <span className="font-mono text-emerald-800 text-xs px-2 py-0.5 rounded bg-white border border-emerald-300">
                {activeEvent.verification.delta}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setMetTab('forecast-analysis')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Open Forecast Analysis Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowBulletinModal(true)}
                  className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>Issue IMD Advisory</span>
                </button>

                <button
                  onClick={() => setShowDisasterLiaisonModal(true)}
                  className="py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600" />
                  <span>Share with DEOC Indore</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
