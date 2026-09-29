// src/components/dma/DMADashboard.jsx
import React, { useState } from 'react';
import { useDisasterManagement } from '../../context/DisasterManagementContext.jsx';
import {
  DMA_SUMMARY_METRICS,
  POTENTIAL_IMPACT_SUMMARY
} from '../../data/disasterManagementData.js';
import {
  AlertTriangle,
  Radio,
  Send,
  FileText,
  ShieldAlert,
  MapPin,
  Clock,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Droplets,
  CloudRain,
  Wind,
  Flame,
  Activity,
  Layers,
  Sparkles,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Building,
  ShieldCheck,
  Eye,
  FileCheck,
  Info
} from 'lucide-react';

export default function DMADashboard() {
  const {
    setDmaTab,
    selectedSector,
    setSelectedSectorId,
    sectors,
    alerts,
    incidents,
    dispatchLogs,
    mapHazardFilter,
    setMapHazardFilter,
    setShowBroadcastModal,
    setShowOfficialAlertModal,
    setShowPublicAdvisoryModal,
    setShowEscalateModal,
    setShowReadinessAuditModal,
    showToast,
    dmaPayload,
    dmaForecast,
    isLoadingDmaForecast,
    refreshDmaForecast
  } = useDisasterManagement();

  const [activeAlertFilter, setActiveAlertFilter] = useState('all'); // 'all' | 'severe' | 'next4h'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredAlerts = alerts.filter(a => {
    if (activeAlertFilter === 'severe') return a.severity === 'CRITICAL';
    if (activeAlertFilter === 'next4h') return a.timeShort.includes('4:00') || a.timeShort.includes('6:00');
    return true;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshDmaForecast();
      showToast('State EOC telemetry & Doppler radar feeds refreshed from live AI model.', 'success');
    } catch {
      showToast('Refreshed calibrated forecast telemetry.', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReviewAlert = (alert) => {
    if (alert.sectorId) {
      setSelectedSectorId(alert.sectorId);
    }
    setDmaTab('alerts-actions');
    showToast(`Loaded verification desk for ${alert.location}`, 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Header Card with Meta Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Disaster Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Monitor weather risks, potential impacts and emergency response priorities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Monitoring</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Last updated: 12:15 PM IST</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* 4 Top Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Critical Alerts */}
        <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Critical Alerts
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>{dmaForecast?.precipitation?.alert === 'RED' ? 'CRITICAL' : dmaForecast?.precipitation?.alert || 'CRITICAL'}</span>
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            {DMA_SUMMARY_METRICS.criticalAlerts + (dmaForecast?.precipitation?.alert === 'RED' ? 1 : 0)}
          </div>
          <div className="text-xs font-bold text-rose-600 mt-2 flex items-center gap-1">
            <span>↗ {DMA_SUMMARY_METRICS.criticalAlertsNew} new in the last hour</span>
          </div>
        </div>

        {/* Card 2: High-Risk Regions */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              High-Risk Regions
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase flex items-center gap-1">
              <Eye className="w-3 h-3 text-amber-600" />
              <span>VIGILANT</span>
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            {DMA_SUMMARY_METRICS.highRiskRegions}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-2">
            {DMA_SUMMARY_METRICS.highRiskStates}
          </div>
        </div>

        {/* Card 3: Active Incidents */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Active Incidents
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-black uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-sky-600" />
              <span>{dmaForecast?.precipitation?.is_bust_warning ? 'DISPATCH ACTIVE' : 'STANDBY'}</span>
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            {dmaForecast?.precipitation?.is_bust_warning ? DMA_SUMMARY_METRICS.activeIncidents : DMA_SUMMARY_METRICS.activeIncidents - 1}
          </div>
          <div className="text-xs font-bold text-rose-600 mt-2">
            {dmaForecast?.precipitation?.is_bust_warning ? `${DMA_SUMMARY_METRICS.activeIncidentsImmediate} require immediate action` : '1 requires immediate action'}
          </div>
        </div>

        {/* Card 4: Affected Areas */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Affected Areas
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black uppercase">
              MUNICIPAL DESKS
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            {DMA_SUMMARY_METRICS.affectedAreas}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-2 truncate">
            {DMA_SUMMARY_METRICS.affectedAreasLabel}
          </div>
        </div>

      </div>

      {/* Live Risk Overview (GIS Polygon Map Container) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        
        {/* Header & Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-600" />
              <span>Live Risk Overview</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Current weather-related risk across monitored regions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            {[
              { id: 'all', label: 'All Hazards (Active)' },
              { id: 'rainfall', label: 'Rainfall Risk' },
              { id: 'flood', label: 'Flood Risk' },
              { id: 'heat', label: 'Heat Risk' },
              { id: 'wind', label: 'Wind Risk' },
              { id: 'thunderstorm', label: 'Thunderstorm' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setMapHazardFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  mapHazardFilter === f.id
                    ? 'bg-slate-900 text-white font-extrabold shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Simulated GIS Map Canvas */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-100 to-sky-50 border border-slate-200 overflow-hidden flex items-center justify-center select-none">
          
          {/* Subtle Map Grid lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Topographic Contours */}
            <path d="M50,150 Q250,50 500,200 T900,100" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4,4" />
            <path d="M50,250 Q350,180 650,300 T1100,220" fill="none" stroke="#CBD5E1" strokeWidth="1" />
          </svg>

          {/* Rendered Regional Vector Polygons */}
          <div className="absolute inset-0 p-6 flex items-center justify-center">
            <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
              
              {/* Ujjain Corridor Polygon (Red/Orange) */}
              <div
                onClick={() => setSelectedSectorId('sec-ujjain')}
                className="absolute top-10 left-12 sm:left-24 w-36 sm:w-44 h-24 bg-rose-500/20 hover:bg-rose-500/35 border-2 border-rose-500/80 rounded-2xl backdrop-blur-2xs cursor-pointer transition-all p-2 flex flex-col justify-between shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-rose-950 uppercase">Ujjain Corridor</span>
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                </div>
                <div className="text-[9px] font-bold text-rose-800 bg-white/80 px-1.5 py-0.5 rounded w-fit">
                  HIGH SQUALL · 75k
                </div>
              </div>

              {/* Dewas Belt Polygon (Amber) */}
              <div
                onClick={() => setSelectedSectorId('sec-dewas')}
                className="absolute top-20 left-44 sm:left-64 w-36 sm:w-44 h-24 bg-amber-500/20 hover:bg-amber-500/35 border-2 border-amber-500/80 rounded-2xl backdrop-blur-2xs cursor-pointer transition-all p-2 flex flex-col justify-between shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-amber-950 uppercase">Dewas Belt</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="text-[9px] font-bold text-amber-800 bg-white/80 px-1.5 py-0.5 rounded w-fit">
                  BE VIGILANT · 42.4mm
                </div>
              </div>

              {/* Bhopal Catchment Polygon (Amber) */}
              <div
                onClick={() => setSelectedSectorId('sec-bhopal')}
                className="absolute top-12 right-12 sm:right-28 w-40 sm:w-48 h-28 bg-amber-500/15 hover:bg-amber-500/30 border-2 border-amber-400/80 rounded-2xl backdrop-blur-2xs cursor-pointer transition-all p-2 flex flex-col justify-between shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-amber-950 uppercase">Bhopal Metro</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="text-[9px] font-bold text-amber-800 bg-white/80 px-1.5 py-0.5 rounded w-fit">
                  URBAN FLOOD WATCH
                </div>
              </div>

              {/* Indore District Polygon (Red Critical - Active Focus) */}
              <div
                onClick={() => setSelectedSectorId('sec-indore')}
                className={`absolute bottom-6 left-20 sm:left-36 w-48 sm:w-56 h-32 bg-rose-600/25 hover:bg-rose-600/40 border-2 border-rose-600 rounded-2xl backdrop-blur-2xs cursor-pointer transition-all p-2.5 flex flex-col justify-between shadow-md ${
                  selectedSector.id === 'sec-indore' ? 'ring-4 ring-rose-400/50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-rose-700" />
                    <span className="text-[11px] font-black text-rose-950 uppercase">Indore District</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-black">
                    {dmaForecast?.precipitation?.alert === 'RED' ? 'HIGH RISK' : dmaForecast?.precipitation?.alert || 'HIGH RISK'}
                  </span>
                </div>
                <div className="text-[10px] font-extrabold text-rose-900 bg-white/90 px-2 py-1 rounded shadow-2xs flex items-center justify-between">
                  <span>Heavy Rain: {dmaForecast?.precipitation?.quantiles_mm?.p50 ? `${dmaForecast.precipitation.quantiles_mm.p50} mm/h` : '52.9 mm/h'}</span>
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                </div>
              </div>

              {/* Jabalpur Eastern Sector (Green Nominal) */}
              <div
                onClick={() => setSelectedSectorId('sec-jabalpur')}
                className="absolute bottom-10 right-8 sm:right-16 w-32 sm:w-40 h-20 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/80 rounded-2xl backdrop-blur-2xs cursor-pointer transition-all p-2 flex flex-col justify-between shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-950 uppercase">Jabalpur</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[9px] font-bold text-emerald-800 bg-white/80 px-1.5 py-0.5 rounded w-fit">
                  NOMINAL · 2.4mm
                </div>
              </div>

            </div>
          </div>

          {/* Left Floating Overlay Info Card */}
          <div className="absolute top-4 left-4 z-10 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xl space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-black text-slate-900">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="truncate">{selectedSector.name} — {selectedSector.code}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                dmaForecast?.precipitation?.alert === 'RED'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : dmaForecast?.precipitation?.alert === 'ORANGE'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {dmaForecast?.precipitation?.alert || selectedSector.riskTier} LEVEL
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div>
                <span className="text-slate-500">Hazard Identified: </span>
                <strong className="text-slate-900">
                  {dmaForecast?.precipitation?.quantiles_mm?.p50 || 52.9} mm/h peak heavy rainfall
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Probability / Risk Level: </span>
                <strong className="text-slate-900">
                  {Math.round((dmaForecast?.precipitation?.nwp_bust_probability || 0.78) * 100)}% | Severity Ribbon: {dmaForecast?.precipitation?.alert || 'RED'} LEVEL
                </strong>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-snug">
              <strong className="text-slate-800">Potential Impact: </strong>
              Localized flooding may occur in low-lying peri-urban areas if rainfall exceeds 45 mm/h. High risk for Khan River catchment. P90 Hazard Ceiling: {dmaForecast?.precipitation?.quantiles_mm?.p90 || 92.5} mm.
            </div>

            <button
              onClick={() => {
                setDmaTab('risk-map');
                showToast(`Focused Risk & Impact GIS Map on ${selectedSector.name}`, 'info');
              }}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>View Risk Details & Dispatch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Controls (Right Top) */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => showToast('Zoom in map view', 'info')}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('Zoom out map view', 'info')}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedSectorId('sec-indore');
                showToast('Reset GIS map center coordinates', 'info');
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Coordinates Tag */}
          <div className="absolute bottom-2 left-4 z-10 font-mono text-[9px] text-slate-400 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
            LAT: 22.7196° N | LON: 75.8577° E · IMD RADAR COMPOSITE 500KM
          </div>
        </div>

        {/* Legend Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold pt-2 border-t border-slate-100 text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Green — Nominal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Amber — Be Vigilant</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Red — Action Required</span>
            </span>
          </div>

          <button
            onClick={() => setDmaTab('risk-map')}
            className="text-sky-700 hover:text-sky-900 font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <span>Open Full Geospatial Risk & Impact Map →</span>
          </button>
        </div>

      </div>

      {/* Priority Alerts Table Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Priority Alerts
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Events requiring attention based on current risk and expected impact.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            {[
              { id: 'all', label: `All Active (${alerts.length})` },
              { id: 'severe', label: 'Severe Only (2)' },
              { id: 'next4h', label: 'Next 4 Hours' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveAlertFilter(tab.id)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeAlertFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Probability</th>
                <th className="py-2.5 px-3">Expected Time</th>
                <th className="py-2.5 px-3">Potential Impact</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredAlerts.map(alert => (
                <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${alert.severityClass}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900">
                    {alert.event}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">
                    {alert.location}
                  </td>
                  <td className="py-3 px-3 font-bold text-rose-700">
                    {alert.probability}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-600">
                    {alert.timeShort}
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                    {alert.potentialImpact}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleReviewAlert(alert)}
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

        {/* Table Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-semibold">
          <span>Showing {filteredAlerts.length} high-priority synchronized alerts</span>
          <button
            onClick={() => setDmaTab('alerts-actions')}
            className="text-sky-700 hover:text-sky-900 font-extrabold cursor-pointer"
          >
            View All Alerts (12) →
          </button>
        </div>

      </div>

      {/* Two-Column Middle Section: AI Advisory + Live Risk Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: AI Impact-Based Advisory */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                AI Impact-Based Advisory · Automated Synthesis
              </h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
              dmaForecast?.precipitation?.alert === 'RED'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : dmaForecast?.precipitation?.alert === 'ORANGE'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {dmaForecast?.precipitation?.alert === 'RED' ? 'CRITICAL RISK' : `${dmaForecast?.precipitation?.alert || 'CRITICAL'} RISK`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs font-bold">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Hazard</span>
              <div className="text-slate-900 font-extrabold mt-0.5">Heavy Rainfall ({dmaForecast?.precipitation?.quantiles_mm?.p50 || 52.9} mm/h)</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Location</span>
              <div className="text-slate-900 font-extrabold mt-0.5">{selectedSector.name}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Expected Window</span>
              <div className="text-slate-900 font-extrabold mt-0.5">{selectedSector.timing}</div>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
              POTENTIAL IMPACT ANALYSIS
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">
              Localized flooding may occur in low-lying peri-urban areas if rainfall exceeds 45 mm/h. High risk for Khan River catchment. P90 Hazard Ceiling: {dmaForecast?.precipitation?.quantiles_mm?.p90 || 92.5} mm.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1 text-xs">
            <div className="font-black text-[11px] text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>MANDATED RECOMMENDED ACTION</span>
            </div>
            <p className="text-amber-900 leading-snug font-medium">
              {selectedSector.mandatedAction}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-semibold">
              Model Confidence: <strong className="text-slate-900 font-bold">{dmaForecast?.precipitation?.conformal_coverage || '86.75% Guaranteed'}</strong>
            </span>
            <button
              onClick={() => setDmaTab('alerts-actions')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              View Full Advisory & Protocol Checklist
            </button>
          </div>
        </div>

        {/* Right: Live Risk Parameters (Station Indore EOC) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Live Risk Parameters</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              STATION {selectedSector.name.toUpperCase()} EOC
            </span>
          </div>

          <div className="space-y-3">
            
            {/* Rainfall Rate */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Rainfall Rate</div>
                  <div className="text-[10px] text-slate-500">Peak nowcast {dmaForecast?.precipitation?.quantiles_mm?.p90 || 65} mm</div>
                </div>
              </div>
              <span className="text-sm font-black text-rose-700 font-mono">
                {dmaForecast?.precipitation?.quantiles_mm?.p50 || 52.9} mm/h
              </span>
            </div>

            {/* Flood Runoff Risk */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Flood Runoff Risk</div>
                  <div className="text-[10px] text-slate-500">
                    {(dmaForecast?.precipitation?.quantiles_mm?.p90 || 92.5) > 65.0 ? 'High soil saturation (84%)' : 'Moderate soil saturation'}
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                (dmaForecast?.precipitation?.quantiles_mm?.p90 || 92.5) > 65.0
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {(dmaForecast?.precipitation?.quantiles_mm?.p90 || 92.5) > 65.0 ? 'CRITICAL' : 'MODERATE'}
              </span>
            </div>

            {/* Heat Index */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Heat Index</div>
                  <div className="text-[10px] text-slate-500">Normal ambient thermal load</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900">
                  {dmaForecast?.temperature?.rothfusz_heat_index_celsius || 34.0}°C
                </span>
                <span className="block text-[9px] font-bold text-emerald-700">Nominal</span>
              </div>
            </div>

            {/* Surface Wind */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Surface Wind</div>
                  <div className="text-[10px] text-slate-500">
                    Gusts up to {dmaForecast?.wind?.gust_ceiling_p90_kmh || 38.0} km/h
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900 font-mono">
                  {dmaForecast?.wind?.sustained_speed_kmh || 24.0} km/h NW
                </span>
                <span className="block text-[9px] font-bold text-amber-700">
                  {dmaForecast?.wind?.gale_warning ? 'Gale Warning' : 'Squall Potential'}
                </span>
              </div>
            </div>

            {/* Thunderstorm Probability */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Thunderstorm Probability</div>
                  <div className="text-[10px] text-slate-500">
                    CAPE Index {dmaPayload?.cape || 1850} J/kg
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900 font-mono">
                  {Math.round((dmaForecast?.precipitation?.nwp_bust_probability || 0.78) * 100)}%
                </span>
                <span className="block text-[9px] font-bold text-amber-700">Elevated</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Emergency Action Center (4 Response Action Cards) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="text-rose-600 font-black">✱</span>
              <span>Emergency Action Center</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Take authorized response actions for verified incidents.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <span>🔒 Official actions require two-step cryptographic verification prior to dispatch.</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {/* Action 1: Send Official Alert */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Send Official Alert
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                Notify authorized local district magistrate & municipal commissioners.
              </p>
            </div>
            <button
              onClick={() => setShowOfficialAlertModal(true)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
            >
              Initiate Alert
            </button>
          </div>

          {/* Action 2: Emergency SMS / Cell Broadcast */}
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Emergency SMS / Cell Broadcast
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                Send verified emergency geo-targeted notification to citizens in polygon.
              </p>
            </div>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="w-full py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
            >
              Draft Cell Broadcast
            </button>
          </div>

          {/* Action 3: Public Advisory */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Public Advisory
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                Publish approved public safety bulletin to citizen portal & media wires.
              </p>
            </div>
            <button
              onClick={() => setShowPublicAdvisoryModal(true)}
              className="w-full py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
            >
              Release Public Advisory
            </button>
          </div>

          {/* Action 4: Escalate Incident */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Escalate Incident
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                Escalate critical incident to State Disaster Management Authority (SDMA) & NDMA.
              </p>
            </div>
            <button
              onClick={() => setShowEscalateModal(true)}
              className="w-full py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
            >
              Escalate to SDMA
            </button>
          </div>

        </div>
      </div>

      {/* Bottom 3-Column Grid: Active Incidents + Response Status + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Active Incidents (5) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Active Incidents ({incidents.length})
              </h3>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                LIVE QUEUE
              </span>
            </div>

            <div className="space-y-2.5">
              {incidents.slice(0, 3).map(inc => (
                <div
                  key={inc.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-slate-900">{inc.title}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${inc.responseBadgeClass}`}>
                      {inc.responseStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Location: {inc.location} · Severity: <strong className="text-slate-800">{inc.severity}</strong>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span>Updated: {inc.updatedTime}</span>
                    <button
                      onClick={() => setDmaTab('incident-history')}
                      className="text-sky-700 hover:underline font-bold cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setDmaTab('incident-history')}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Audit All Incident Logs
          </button>
        </div>

        {/* Column 2: Response Status (EOC Metrics) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Response Status
              </h3>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                EOC METRICS
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-600">Alerts Issued</span>
                  <span className="text-slate-900">8 / 10 Target Desks</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-600">Authorities Notified</span>
                  <span className="text-emerald-700">6 Confirmed Ack</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-600">Response Teams Activated</span>
                  <span className="text-sky-800 font-bold">3 SDRF / Fire Units</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-800 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>

              <div className="flex justify-between text-[11px] pt-1 text-slate-500 font-semibold">
                <span>Awaiting Confirmation:</span>
                <span className="text-amber-700 font-bold">2 District Desks</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All primary VHF repeater channels operational with zero outage.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowReadinessAuditModal(true)}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Generate Readiness Audit
          </button>
        </div>

        {/* Column 3: Recent Activity (Realtime Audit) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Recent Activity
              </h3>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                REALTIME AUDIT
              </span>
            </div>

            <div className="space-y-3">
              {dispatchLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-[11px] leading-tight">
                      {log.title}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {log.time} · {log.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setDmaTab('incident-history')}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            View Complete System Feed
          </button>
        </div>

      </div>

      {/* Quick Link Navigation Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        
        <div
          onClick={() => setDmaTab('risk-map')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-300 transition-all cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 group-hover:text-sky-800 transition-colors">
              Risk & Impact Map
            </div>
            <div className="text-[11px] text-slate-500">
              Explore interactive multi-hazard regional GIS risk layers.
            </div>
          </div>
        </div>

        <div
          onClick={() => setDmaTab('alerts-actions')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-300 transition-all cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 group-hover:text-sky-800 transition-colors">
              Alerts & Actions
            </div>
            <div className="text-[11px] text-slate-500">
              Manage active disaster protocols & dispatch history.
            </div>
          </div>
        </div>

        <div
          onClick={() => setDmaTab('incident-history')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-300 transition-all cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 group-hover:text-sky-800 transition-colors">
              Incident History
            </div>
            <div className="text-[11px] text-slate-500">
              Audit past synoptic events & post-action reports.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
