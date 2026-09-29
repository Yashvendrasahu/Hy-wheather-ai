// src/components/meteorologist/MeteorologistDashboard.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import {
  METEOROLOGIST_SUMMARY_METRICS,
  PRIORITY_LOCATIONS_TABLE,
  ACTIVE_SURVEILLANCE_EVENTS,
  MODEL_HEALTH_METRICS,
  MODEL_PERFORMANCE_SNAPSHOT_24H
} from '../../data/meteorologistData.js';
import {
  MapPin,
  Radio,
  GitFork,
  Boxes,
  Search,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CloudRain,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  FileText,
  Compass,
  RefreshCw,
  CheckCircle2,
  SlidersHorizontal,
  Clock
} from 'lucide-react';

export default function MeteorologistDashboard() {
  const {
    setMetTab,
    setTargetObservatory,
    setSelectedEventId,
    setShowBulletinModal,
    setShowSoundingModal,
    showToast
  } = useMeteorologist();

  const [activeTableFilter, setActiveTableFilter] = useState('all'); // 'all' | 'high-watch' | 'severe'
  const [searchLocation, setSearchLocation] = useState('Indore, Madhya Pradesh');
  const [selectedRegion, setSelectedRegion] = useState('Central India - Region IV');
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredLocations = PRIORITY_LOCATIONS_TABLE.filter(loc => {
    if (activeTableFilter === 'high-watch') return loc.category === 'high-watch' || loc.category === 'severe';
    if (activeTableFilter === 'severe') return loc.category === 'severe';
    return true;
  });

  const handleSyncCycle = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Assimilation Cycle 06:00 UTC synchronized across 142 AWS Stations.', 'success');
    }, 700);
  };

  const handleSelectLocation = (loc) => {
    setTargetObservatory({
      id: loc.id,
      name: `${loc.name}, ${loc.subdivision}`,
      stationCode: loc.subdivision.split('·')[1]?.trim() || 'AWS-42680',
      lat: loc.lat,
      lng: loc.lng,
      elevation: '553m MSL',
      region: 'Central India / Malwa Plateau'
    });
    setMetTab('forecast-analysis');
    showToast(`Focused Forecast Analysis Workspace on ${loc.name}`, 'info');
  };

  const handleOpenEventDeepDive = (evtId) => {
    setSelectedEventId(evtId);
    setMetTab('weather-events');
    showToast('Loaded active convective event into Surveillance Desk', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          
          {/* Title and Subtitle */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Meteorologist Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-200 text-xs font-black uppercase font-mono">
                Synoptic Desk IV
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Synoptic forecast monitoring & multi-model atmospheric surveillance
            </p>
          </div>

          {/* Location Search Bar & Quick Jump */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search station or grid..."
                className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 w-56 sm:w-64"
              />
              <MapPin className="w-3.5 h-3.5 text-sky-600 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Region Dropdown */}
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
              >
                <option value="Central India - Region IV">Central India - Region IV</option>
                <option value="Western Coast - Region I">Western Coast - Region I</option>
                <option value="Northwest Plains - Region II">Northwest Plains - Region II</option>
                <option value="Eastern Vidarbha - Region V">Eastern Vidarbha - Region V</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* CTA: Open Forecast Analysis Workspace */}
            <button
              onClick={() => setMetTab('forecast-analysis')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <span>Open Forecast Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Date, Assimilation & Multispectral Pills Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Wednesday, 24 Oct 2025 · 14:45 IST</span>
            </span>

            <button
              onClick={handleSyncCycle}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>06:00 UTC Assimilation · Updated 8 min ago</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold hidden md:inline-flex">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>INSAT-3DR Multispectral Calibrated</span>
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            NWP Engine: ECMWF 1.2km + NCUM Regional 12km + MoES Neural
          </div>
        </div>
      </div>

      {/* 4 Top KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Card 1: Monitored Locations */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              MONITORED LOCATIONS
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
              142
            </span>
            <span className="text-xs text-slate-500 font-semibold">synoptic stations</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>12 in high-priority watch</span>
          </div>
        </div>

        {/* Card 2: Active Weather Events */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              ACTIVE WEATHER EVENTS
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-rose-600 font-mono tracking-tight">
              7
            </span>
            <span className="text-xs text-slate-500 font-semibold">events flagged</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>3 severe convective squalls</span>
          </div>
        </div>

        {/* Card 3: High Model Disagreement */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              HIGH MODEL DISAGREEMENT
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <GitFork className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-600 font-mono tracking-tight">
              3
            </span>
            <span className="text-xs text-slate-500 font-semibold">regions alert</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 truncate">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Konkan, East MP, Vidarbha</span>
          </div>
        </div>

        {/* Card 4: High Uncertainty Areas */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              HIGH UNCERTAINTY AREAS
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-indigo-600 font-mono tracking-tight">
              5
            </span>
            <span className="text-xs text-slate-500 font-semibold">zones identified</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
            <AlertTriangle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Convective CAPE &gt; 2400 J/kg</span>
          </div>
        </div>

      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns (66% width): Priority Locations & Active Weather Events */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Priority Locations Monitoring Desk */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Priority Locations Monitoring Desk
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Live synoptic telemetry, multi-model consensus, and alert status
                  </p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setActiveTableFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTableFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All (142)
                </button>
                <button
                  onClick={() => setActiveTableFilter('high-watch')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTableFilter === 'high-watch'
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  High Watch (12)
                </button>
                <button
                  onClick={() => setActiveTableFilter('severe')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTableFilter === 'severe'
                      ? 'bg-rose-600 text-white shadow-2xs font-extrabold'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  Severe (3)
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Station / Location</th>
                    <th className="py-2.5 px-3">Current Weather</th>
                    <th className="py-2.5 px-3">Rain Prob.</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-3">Model Agreement</th>
                    <th className="py-2.5 px-3">Alert Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLocations.map((loc) => (
                    <tr
                      key={loc.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => handleSelectLocation(loc)}
                    >
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-slate-900 text-sm group-hover:text-sky-700 transition-colors">
                          {loc.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {loc.subdivision}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">
                          {loc.currentWeather}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {loc.condition}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${loc.rainBarColor}`}
                              style={{ width: `${loc.rainProb}%` }}
                            />
                          </div>
                          <span className="font-extrabold text-slate-900 font-mono">
                            {loc.rainProb}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${loc.confidenceClass}`}>
                          {loc.confidence}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-extrabold text-slate-900 font-mono">
                          {loc.modelAgreement}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {loc.modelAgreementDetail}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${loc.alertStatusClass}`}>
                          {loc.alertStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectLocation(loc);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1"
                        >
                          <span>View Analysis</span>
                          <span>→</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination / Total Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
              <span>Displaying 5 of 142 synoptic radar stations in Central Zone</span>
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer disabled:opacity-40" disabled>
                  Previous
                </button>
                <button className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-bold">1</button>
                <button className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">2</button>
                <button className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">Next</button>
              </div>
            </div>

          </div>

          {/* 2. Active Weather Events (Surveillance Desk) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Active Weather Events (Surveillance Desk)
                </h3>
              </div>
              <span className="text-xs font-bold text-sky-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Convective Radar Feeds Active
              </span>
            </div>

            {/* Event Cards */}
            <div className="space-y-3">
              {ACTIVE_SURVEILLANCE_EVENTS.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-sky-50/40 border border-slate-200/90 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black text-slate-900">{evt.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${evt.riskClass}`}>
                        {evt.riskLevel}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        Prob: <strong className="text-slate-900">{evt.probability}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenEventDeepDive(evt.id)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
                    >
                      <span>Examine Radar & Sounding</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">{evt.location}:</strong> {evt.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.expectedTime}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 text-sky-600" />
                      <span>Doppler Reflectivity: <strong>{evt.radarReflectivity}</strong></span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* 3. Bottom 4 Quick Action Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <button
              onClick={() => setMetTab('forecast-analysis')}
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-slate-900 group-hover:text-sky-700">
                Analyze Location
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Station deep dive & soundings</p>
            </button>

            <button
              onClick={() => setMetTab('weather-events')}
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Radio className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-slate-900 group-hover:text-rose-700">
                View Weather Events Desk
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Live Doppler & nowcasting</p>
            </button>

            <button
              onClick={() => setMetTab('analytics')}
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-700">
                Open Verification & Model Analytics
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Statistical bias & scorecards</p>
            </button>

            <button
              onClick={() => setShowBulletinModal(true)}
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-700">
                IMD / MoES Operational Bulletin
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Draft & sign emergency report</p>
            </button>

          </div>

        </div>

        {/* Right Column (33% width): Model & Forecast Health + Performance Snapshot */}
        <div className="space-y-6">
          
          {/* 1. Model & Forecast Health Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Model & Forecast Health
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase border border-emerald-200">
                All Nominal
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {/* Data Freshness */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Data Freshness</span>
                  <span className="font-mono text-emerald-700">{MODEL_HEALTH_METRICS.dataFreshness}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${MODEL_HEALTH_METRICS.dataFreshnessPercent}%` }} />
                </div>
                <div className="text-[10px] text-slate-400">Real-time Doppler & AWS sensor stream nominal</div>
              </div>

              {/* Model Availability */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Model Availability</span>
                  <span className="font-mono text-emerald-700">{MODEL_HEALTH_METRICS.modelAvailability}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: `${MODEL_HEALTH_METRICS.modelAvailabilityPercent}%` }} />
                </div>
                <div className="text-[10px] text-slate-400">NCUM, GFS, AI-NWP, ECMWF, EPS online</div>
              </div>

              {/* Forecast Confidence */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Forecast Confidence</span>
                  <span className="font-mono text-sky-700">{MODEL_HEALTH_METRICS.forecastConfidence}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${MODEL_HEALTH_METRICS.forecastConfidencePercent}%` }} />
                </div>
                <div className="text-[10px] text-slate-400">Synoptic consistency score across synoptic centers</div>
              </div>

              {/* Overall Model Agreement */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Overall Model Agreement</span>
                  <span className="font-mono text-amber-700">{MODEL_HEALTH_METRICS.overallModelAgreement}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${MODEL_HEALTH_METRICS.overallModelAgreementPercent}%` }} />
                </div>
                <div className="text-[10px] text-slate-400">Cross-ensemble spread in Region IV within bounds</div>
              </div>

            </div>

          </div>

          {/* 2. Model Performance Snapshot (24h Verification) Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Model Performance Snapshot
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                24h Verification
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Factual verification metrics against synchronized synoptic ground observations (06:00 UTC cycle):
            </p>

            <div className="space-y-2.5">
              {MODEL_PERFORMANCE_SNAPSHOT_24H.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs transition-all ${
                    item.reliab
                      ? 'bg-sky-50/80 border-sky-200 text-sky-950 font-bold'
                      : 'bg-slate-50/80 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold">{item.model}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-600">
                      {item.res}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">
                      MAE: <strong className="text-slate-900">{item.mae}</strong>
                    </span>
                    <span className="text-slate-500">
                      RMSE: <strong className="text-slate-900">{item.rmse}</strong>
                    </span>
                    {item.bias && (
                      <span className="text-slate-500">
                        Bias: <strong className="text-slate-900">{item.bias}</strong>
                      </span>
                    )}
                    {item.spread && (
                      <span className="text-slate-500">
                        Spread: <strong className="text-slate-900">{item.spread}</strong>
                      </span>
                    )}
                    {item.reliab && (
                      <span className="text-emerald-700 font-bold">
                        Reliab: {item.reliab}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSoundingModal(true)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-sky-600" />
              <span>Full Ensemble Sounding Telemetry</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
