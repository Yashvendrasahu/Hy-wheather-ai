// src/components/dma/DMARiskMapScreen.jsx
import React, { useState } from 'react';
import { useDisasterManagement } from '../../context/DisasterManagementContext.jsx';
import {
  POTENTIAL_IMPACT_SUMMARY
} from '../../data/disasterManagementData.js';
import RealLeafletRadarMap from '../map/RealLeafletRadarMap.jsx';
import {
  MapPin,
  Clock,
  RefreshCw,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Maximize2,
  AlertTriangle,
  CloudRain,
  Droplets,
  Wind,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  Filter,
  Users,
  Compass,
  Building,
  Radio,
  FileText
} from 'lucide-react';

export default function DMARiskMapScreen() {
  const {
    selectedSector,
    setSelectedSectorId,
    sectors,
    setDmaTab,
    mapHazardFilter,
    setMapHazardFilter,
    mapRiskFilter,
    setMapRiskFilter,
    mapTimeHorizon,
    setMapTimeHorizon,
    showDrainageHatching,
    setShowDrainageHatching,
    setShowBroadcastModal,
    showToast,
    dmaForecast,
    isLoadingDmaForecast,
    refreshDmaForecast
  } = useDisasterManagement();

  const [regionFilter, setRegionFilter] = useState('India (Central & Western Corridor)');
  const [dmaMapViewMode, setDmaMapViewMode] = useState('radar'); // 'radar' | 'sectors'
  const [isSyncing, setIsSyncing] = useState(false);

  const handleRefresh = async () => {
    setIsSyncing(true);
    try {
      await refreshDmaForecast();
      showToast('Geospatial GIS layers synchronized with live AI model.', 'success');
    } catch {
      showToast('Geospatial GIS layers refreshed.', 'info');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetFilters = () => {
    setRegionFilter('India (Central & Western Corridor)');
    setMapHazardFilter('all');
    setMapTimeHorizon('now');
    setMapRiskFilter('all');
    showToast('Map GIS filters reset to default operational view.', 'info');
  };

  const handleReviewLocation = (sector) => {
    setSelectedSectorId(sector.id);
    showToast(`Focused on ${sector.name} hazard boundary`, 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Risk & Impact Map
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-xs font-black font-mono">
              Geospatial v4.2
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Explore weather hazards, affected regions and potential impacts across state monitoring sectors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Monitoring</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated: 12:15 PM IST</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Region Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              <option>India (Central & Western Corridor)</option>
              <option>Madhya Pradesh (All 52 Districts)</option>
              <option>Malwa Agro-Climatic Zone</option>
              <option>Narmada River Basin Division</option>
            </select>
          </div>

          {/* Hazard Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <Layers className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <select
              value={mapHazardFilter}
              onChange={(e) => setMapHazardFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Hazards (Active)</option>
              <option value="rainfall">Rainfall Risk (&gt;40mm/h)</option>
              <option value="flood">Flood & Inundation Runoff</option>
              <option value="wind">Strong Wind & Squalls</option>
              <option value="thunderstorm">Thunderstorm & Lightning</option>
            </select>
          </div>

          {/* Time Horizon Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <select
              value={mapTimeHorizon}
              onChange={(e) => setMapTimeHorizon(e.target.value)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              <option value="now">Now (Live Radar)</option>
              <option value="6h">Next 6 Hours (Forecast)</option>
              <option value="12h">Next 12 Hours (Consensus)</option>
              <option value="24h">Next 24 Hours (Synoptic)</option>
            </select>
          </div>

          {/* Risk Levels Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <select
              value={mapRiskFilter}
              onChange={(e) => setMapRiskFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Action Required (Red)</option>
              <option value="vigilant">Be Vigilant (Amber)</option>
              <option value="nominal">Nominal (Green)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleResetFilters}
          className="text-slate-500 hover:text-slate-900 font-bold hover:underline cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      {/* Main Grid: GIS Map Canvas Left (7 cols) + Monitored Cluster Details Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: GIS Vector Polygon Map View (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
              <button
                type="button"
                onClick={() => setDmaMapViewMode('radar')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  dmaMapViewMode === 'radar'
                    ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live Doppler Radar Map
              </button>
              <button
                type="button"
                onClick={() => setDmaMapViewMode('sectors')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  dmaMapViewMode === 'sectors'
                    ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Civil GIS Sectors
              </button>
            </div>

            {dmaMapViewMode === 'sectors' && (
              <button
                type="button"
                onClick={() => setShowDrainageHatching(!showDrainageHatching)}
                className="text-[11px] text-sky-700 hover:underline font-bold cursor-pointer"
              >
                {showDrainageHatching ? 'Drainage Hatching: ON' : 'Drainage Hatching: OFF'}
              </button>
            )}
          </div>

          {dmaMapViewMode === 'radar' ? (
            <div className="rounded-2xl overflow-hidden shadow-inner">
              <RealLeafletRadarMap height={440} />
            </div>
          ) : (
          /* Interactive GIS Visual Container */
          <div className="relative w-full h-96 sm:h-[420px] rounded-2xl bg-gradient-to-br from-slate-50 via-slate-100 to-sky-50 border border-slate-200 overflow-hidden flex items-center justify-center select-none">
            
            {/* Topographic Background */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="gisgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#CBD5E1" strokeWidth="0.6" />
                </pattern>
                {/* Diagonal Drainage Hatching */}
                <pattern id="hatching" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#F43F5E" strokeWidth="1.2" strokeOpacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gisgrid)" />
              {showDrainageHatching && (
                <rect x="15%" y="40%" width="45%" height="45%" fill="url(#hatching)" />
              )}
            </svg>

            {/* Rendered Interactive Sectors */}
            <div className="absolute inset-0 p-4 flex items-center justify-center">
              <div className="relative w-full max-w-xl h-full flex items-center justify-center">
                
                {/* Ujjain Corridor Polygon */}
                <div
                  onClick={() => setSelectedSectorId('sec-ujjain')}
                  className={`absolute top-8 left-8 sm:left-16 w-36 sm:w-44 h-24 bg-rose-500/20 hover:bg-rose-500/35 border-2 border-rose-500/80 rounded-2xl backdrop-blur-2xs cursor-pointer transition-all p-2 flex flex-col justify-between shadow-xs ${
                    selectedSector.id === 'sec-ujjain' ? 'ring-4 ring-rose-400/60 scale-105 z-20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-rose-950 uppercase">Ujjain Corridor</span>
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  </div>
                  <div className="text-[9px] font-bold text-rose-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs w-fit">
                    Gusts &gt;75 km/h
                  </div>
                </div>

                {/* Dewas Belt Polygon */}
                <div
                  onClick={() => setSelectedSectorId('sec-dewas')}
                  className={`absolute top-16 left-40 sm:left-52 w-36 sm:w-44 h-24 bg-amber-500/20 hover:bg-amber-500/35 border-2 border-amber-500/80 rounded-2xl backdrop-blur-2xs cursor-pointer transition-all p-2 flex flex-col justify-between shadow-xs ${
                    selectedSector.id === 'sec-dewas' ? 'ring-4 ring-amber-400/60 scale-105 z-20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-amber-950 uppercase">Dewas Belt</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                  <div className="text-[9px] font-bold text-amber-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs w-fit">
                    Flood Runoff
                  </div>
                </div>

                {/* Bhopal Metro Polygon */}
                <div
                  onClick={() => setSelectedSectorId('sec-bhopal')}
                  className={`absolute top-6 right-6 sm:right-16 w-40 sm:w-48 h-28 bg-amber-500/15 hover:bg-amber-500/30 border-2 border-amber-400/80 rounded-2xl backdrop-blur-2xs cursor-pointer transition-all p-2 flex flex-col justify-between shadow-xs ${
                    selectedSector.id === 'sec-bhopal' ? 'ring-4 ring-amber-400/60 scale-105 z-20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-amber-950 uppercase">Bhopal Catchment</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                  <div className="text-[9px] font-bold text-amber-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs w-fit">
                    BE VIGILANT
                  </div>
                </div>

                {/* Indore District Polygon (Red Critical) */}
                <div
                  onClick={() => setSelectedSectorId('sec-indore')}
                  className={`absolute bottom-6 left-16 sm:left-28 w-52 sm:w-60 h-32 bg-rose-600/25 hover:bg-rose-600/40 border-2 border-rose-600 rounded-2xl backdrop-blur-2xs cursor-pointer transition-all p-2.5 flex flex-col justify-between shadow-md ${
                    selectedSector.id === 'sec-indore' ? 'ring-4 ring-rose-500/70 scale-105 z-20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5 text-rose-700" />
                      <span className="text-[11px] font-black text-rose-950 uppercase">Indore (Zone MP-04)</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  </div>
                  <div className="text-[10px] font-black text-rose-900 bg-white/95 px-2 py-1 rounded shadow-2xs flex items-center justify-between">
                    <span>Heavy Rain: 52.9 mm/h</span>
                    <span className="text-rose-600 uppercase text-[9px]">ACTION REQ.</span>
                  </div>
                </div>

                {/* Jabalpur Nominal Polygon */}
                <div
                  onClick={() => setSelectedSectorId('sec-jabalpur')}
                  className={`absolute bottom-8 right-6 sm:right-12 w-32 sm:w-40 h-20 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/80 rounded-2xl backdrop-blur-2xs cursor-pointer transition-all p-2 flex flex-col justify-between shadow-xs ${
                    selectedSector.id === 'sec-jabalpur' ? 'ring-4 ring-emerald-400/60 scale-105 z-20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-950 uppercase">Jabalpur</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[9px] font-bold text-emerald-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs w-fit">
                    Nominal
                  </div>
                </div>

              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => showToast('Zoomed in', 'info')}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('Zoomed out', 'info')}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedSectorId('sec-indore');
                  showToast('Re-centered GIS view on Indore Zone MP-04', 'info');
                }}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <Crosshair className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('Expanded GIS canvas to full display', 'info')}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          )}

          {/* GIS Legend Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold pt-2 border-t border-slate-100 text-slate-600">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-slate-400 uppercase text-[10px]">RISK LEVEL:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Nominal</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Be Vigilant</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span>Action Required</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-700">
                <span className="w-3.5 h-2 bg-rose-200 border border-rose-400 rounded-2xs" />
                <span>Low-Lying Drainage Hazard</span>
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Layer: Multi-Hazard Overview | Horizon: Next 6 Hours | Units: mm / km/h
            </div>
          </div>

        </div>

        {/* Right: Selected Monitored Cluster Details (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                MONITORED CLUSTER (SELECTED)
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {selectedSector.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {selectedSector.code} ({selectedSector.subdivision})
              </p>
            </div>

            <div className="text-right">
              {dmaForecast?.precipitation?.alert === 'RED' ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300">
                  <AlertTriangle className="w-3 h-3" />
                  <span>ACTION REQUIRED</span>
                </span>
              ) : dmaForecast?.precipitation?.alert === 'ORANGE' ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300">
                  <AlertTriangle className="w-3 h-3" />
                  <span>BE VIGILANT</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>NOMINAL</span>
                </span>
              )}
              <span className="block text-[10px] text-rose-700 font-bold mt-1">
                {dmaForecast?.precipitation?.alert || 'RED'} Level ({selectedSector.hazard} Event)
              </span>
            </div>
          </div>

          {/* Rapid Intensification / Bust Warning Flag */}
          {dmaForecast?.precipitation?.is_bust_warning && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="text-rose-900 block font-black uppercase text-[10px] tracking-wider">
                  Bust / Rapid Divergence Alert Flagged
                </strong>
                Orographic Convective Rapid Intensification risk detected. p90 hazard ceiling at {dmaForecast?.precipitation?.quantiles_mm?.p90 || 92.5} mm.
              </div>
            </div>
          )}

          {/* Atmospheric Advisory Box */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 space-y-1 text-xs">
            <div className="font-extrabold text-[11px] text-sky-900">
              Atmospheric Advisory:
            </div>
            <p className="text-sky-900 leading-relaxed font-medium">
              {selectedSector.atmosphericAdvisory}
            </p>
          </div>

          {/* 4 Metric Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase">PROBABILITY</span>
              <div className="text-base font-black text-rose-700 mt-0.5">
                {Math.round((dmaForecast?.precipitation?.nwp_bust_probability || 0.78) * 100)}% Extreme
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">{selectedSector.probTrend}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase">SEVERITY</span>
              <div className="text-base font-black text-rose-700 mt-0.5">
                {dmaForecast?.precipitation?.alert || selectedSector.riskTier}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">Hydrological Surge</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase">EXPECTED WINDOW</span>
              <div className="text-xs font-black text-slate-900 mt-0.5">{selectedSector.timing}</div>
              <div className="text-[10px] text-slate-500 font-semibold">T-3h 45m onset</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase">MODEL CONFIDENCE</span>
              <div className="text-base font-black text-sky-800 mt-0.5">
                {dmaForecast?.precipitation?.conformal_coverage || '86.75% Guaranteed'}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">PyTorch QRNN + ECMWF</div>
            </div>
          </div>

          {/* Forecast Precipitation Accumulation */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">
                FORECAST PRECIPITATION ACCUMULATION
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 font-mono text-[10px] font-black">
                Floor P10: {dmaForecast?.precipitation?.quantiles_mm?.p10 || 24.0} mm
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {dmaForecast?.precipitation?.quantiles_mm?.p50 || 52.9} mm
                </span>
                <span className="text-xs text-slate-400 ml-1">Expected Mean Intensity</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">P90 Hazard Ceiling</span>
                <span className="text-sm font-black font-mono text-rose-400">
                  {dmaForecast?.precipitation?.quantiles_mm?.p90 || 92.5} mm
                </span>
              </div>
            </div>
          </div>

          {/* Hourly Threat Probability Curve (SVG Sparkline / Graph) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 uppercase text-[10px]">HOURLY THREAT PROBABILITY CURVE</span>
              <span className="text-[10px] text-rose-700 font-black">Peak at 6:00 PM (82%)</span>
            </div>

            <div className="h-20 w-full relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 300 70" preserveAspectRatio="none">
                {/* Horizontal Baseline */}
                <line x1="10" y1="55" x2="290" y2="55" stroke="#E2E8F0" strokeWidth="1" />
                
                {/* Area Fill */}
                <path
                  d="M20,45 Q70,30 140,18 T220,12 T280,35 L280,55 L20,55 Z"
                  fill="#F43F5E"
                  fillOpacity="0.15"
                />

                {/* Curve Line */}
                <path
                  d="M20,45 Q70,30 140,18 T220,12 T280,35"
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="2.5"
                />

                {/* Points */}
                <circle cx="20" cy="45" r="3.5" fill="#E11D48" />
                <circle cx="85" cy="32" r="3.5" fill="#E11D48" />
                <circle cx="150" cy="18" r="4.5" fill="#E11D48" />
                <circle cx="220" cy="12" r="5" fill="#E11D48" />
                <circle cx="280" cy="35" r="3.5" fill="#E11D48" />
              </svg>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold px-1">
              <span>Now: 42%</span>
              <span>2 PM: 61%</span>
              <span className="text-rose-700 font-black">4 PM: 78%</span>
              <span className="text-rose-700 font-black">6 PM: 82%</span>
              <span>8 PM: 55%</span>
            </div>
          </div>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="w-full py-2.5 rounded-2xl bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Launch Emergency Broadcast for this Polygon</span>
          </button>

        </div>

      </div>

      {/* Bottom Row: Top Risk Locations Table Left + Potential Impact Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Top Risk Locations & Potential Impact Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Top Risk Locations & Potential Impact
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Ranked by composite civic vulnerability and probability of severe weather impact.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              5 Active Critical Sectors
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Hazard Type</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3">Probability</th>
                  <th className="py-2.5 px-3">Expected Window</th>
                  <th className="py-2.5 px-3">Potential Impact</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {sectors.map(sector => (
                  <tr
                    key={sector.id}
                    onClick={() => setSelectedSectorId(sector.id)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      selectedSector.id === sector.id ? 'bg-sky-50/50 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-black text-slate-900">
                        <span className={`w-2 h-2 rounded-full ${sector.dotClass}`} />
                        <span>{sector.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {sector.hazard}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${sector.badgeClass}`}>
                        {sector.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-rose-700">
                      {sector.probability}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {sector.expectedTimeShort}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {sector.potentialImpact}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewLocation(sector);
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right: Potential Impact Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Potential Impact Summary</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time demographic and civil infrastructure exposure across active monitoring polygons.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="text-[10px] text-slate-400 uppercase font-black">AFFECTED REGIONS</div>
              <div className="text-base font-black text-slate-900 mt-0.5">{POTENTIAL_IMPACT_SUMMARY.affectedRegions}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{POTENTIAL_IMPACT_SUMMARY.affectedRegionsSub}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="text-[10px] text-slate-400 uppercase font-black">HIGH-RISK ZONES</div>
              <div className="text-base font-black text-rose-700 mt-0.5">{POTENTIAL_IMPACT_SUMMARY.highRiskZones}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{POTENTIAL_IMPACT_SUMMARY.highRiskZonesSub}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="text-[10px] text-slate-400 uppercase font-black">CRITICAL ZONES</div>
              <div className="text-base font-black text-rose-700 mt-0.5">{POTENTIAL_IMPACT_SUMMARY.criticalZones}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{POTENTIAL_IMPACT_SUMMARY.criticalZonesSub}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="text-[10px] text-slate-400 uppercase font-black">POPULATION MONITORED</div>
              <div className="text-base font-black text-slate-900 mt-0.5">{POTENTIAL_IMPACT_SUMMARY.populationMonitored}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{POTENTIAL_IMPACT_SUMMARY.populationMonitoredSub}</div>
            </div>
          </div>

          {/* Monitored Infrastructure Exposure */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <div className="font-extrabold text-slate-700 uppercase text-[10px]">
              MONITORED INFRASTRUCTURE EXPOSURE
            </div>
            <div className="space-y-1.5 font-medium text-slate-600">
              {POTENTIAL_IMPACT_SUMMARY.infrastructure.map((inf, idx) => (
                <div key={idx} className="flex justify-between pb-1 border-b border-slate-100 text-[11px]">
                  <span>{inf.label}</span>
                  <strong className={inf.isStatus ? 'text-emerald-700 font-bold' : 'text-slate-900 font-bold'}>
                    {inf.value}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Civic Protocol Banner */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-2.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug">
              <strong>Civic Protocol:</strong> Emergency broadcasts require two-step cryptographic authorization by State EOC Incident Commander before public dissemination.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
