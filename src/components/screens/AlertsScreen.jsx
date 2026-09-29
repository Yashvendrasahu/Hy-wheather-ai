// src/components/screens/AlertsScreen.jsx
import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import { ALERTS_DATA, EMERGENCY_HELPLINES } from '../../data/weatherData.js';
import NationalSynopticRainAlertMap from '../alerts/NationalSynopticRainAlertMap.jsx';
import {
  AlertTriangle,
  Shield,
  ShieldAlert,
  Info,
  Clock,
  MapPin,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Radio,
  Sun,
  CloudRain,
  Wind,
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function AlertsScreen() {
  const {
    currentLocation,
    dynamicAlerts,
    alertFilter,
    setAlertFilter,
    warningsOnly,
    setWarningsOnly,
    setActiveModalAlert,
    setActiveTab,
    showToast,
    moesResult
  } = useWeather();

  const [expandedGusty, setExpandedGusty] = useState(false);
  const [showArchived, setShowArchived] = useState(true);

  // Dynamic values mapped from live FastAPI ML backend
  const alertLevel = moesResult?.precipitation?.alert || 'ORANGE';
  const p50 = moesResult?.precipitation?.quantiles_mm?.p50 ?? 0;
  const p90 = moesResult?.precipitation?.quantiles_mm?.p90 ?? 0;
  const isBustWarning = moesResult?.precipitation?.is_bust_warning ?? false;
  const conformalCoverage = moesResult?.precipitation?.conformal_coverage || '86.75% Guaranteed';
  const sustainedWind = moesResult?.wind?.sustained_speed_kmh ?? 17;
  const gustWind = moesResult?.wind?.gust_ceiling_p90_kmh ?? 26.4;

  const baseAlerts = dynamicAlerts && dynamicAlerts.length > 0 ? dynamicAlerts : ALERTS_DATA;

  // Filter alerts based on active tab and toggle
  let displayedAlerts = baseAlerts;
  if (alertFilter === 'active') {
    displayedAlerts = displayedAlerts.filter(a => a.status === 'active');
  } else if (alertFilter === 'upcoming') {
    displayedAlerts = displayedAlerts.filter(a => a.status === 'upcoming');
  } else if (alertFilter === 'past') {
    displayedAlerts = displayedAlerts.filter(a => a.status === 'resolved');
  }

  if (warningsOnly) {
    displayedAlerts = displayedAlerts.filter(a => a.level >= 2);
  }

  const activeCount = baseAlerts.filter(a => a.status === 'active').length;
  const upcomingCount = baseAlerts.filter(a => a.status === 'upcoming').length;
  const resolvedCount = baseAlerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              Public Weather Safety
            </span>
            <span>•</span>
            <span>Local Radar Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Weather Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Important weather warnings for your area.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">🕒 Updated 5 mins ago (10:45 AM IST)</span>
          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>{currentLocation.fullName}</span>
            <span className="text-sky-600 hover:underline">• Change</span>
          </button>
        </div>
      </div>

      {/* National Synoptic Severe Rain & Cyclone Map (अखिल भारतीय वर्षा अलर्ट) */}
      <NationalSynopticRainAlertMap />

      {/* Filter Tabs & Warnings Toggle Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All Alerts (${activeCount + upcomingCount})` },
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'upcoming', label: `Upcoming (${upcomingCount})` },
            { id: 'past', label: `Past (${resolvedCount})` }
          ].map((tab) => {
            const isActive = alertFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAlertFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-3 py-1 text-xs text-slate-700 font-medium border-t sm:border-t-0 sm:border-l border-slate-100">
          <span>Warnings & Severe Only</span>
          <button
            onClick={() => setWarningsOnly(!warningsOnly)}
            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
              warningsOnly ? 'bg-rose-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                warningsOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Summary Amber/Yellow Banner */}
      <div className={`rounded-3xl p-6 border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        alertLevel === 'RED'
          ? 'bg-rose-50/90 border-rose-300'
          : alertLevel === 'ORANGE'
          ? 'bg-orange-50/90 border-orange-300'
          : alertLevel === 'YELLOW'
          ? 'bg-amber-50/90 border-amber-300'
          : 'bg-emerald-50/90 border-emerald-300'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-2xl shrink-0 ${
            alertLevel === 'RED' ? 'bg-rose-100 text-rose-800' :
            alertLevel === 'ORANGE' ? 'bg-orange-100 text-orange-800' :
            alertLevel === 'YELLOW' ? 'bg-amber-100 text-amber-800' :
            'bg-emerald-100 text-emerald-800'
          }`}>
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
                ⚠️ {alertLevel} ALERT: Convective Rain Warning for {currentLocation.name}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              Live physics AI telemetry active ({conformalCoverage}). Median rain: {p50} mm (Hazard ceiling: {p90} mm).
            </p>
          </div>
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto text-center shrink-0">
          <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Active</span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">2 Events</span>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Confidence</span>
            <span className="text-xs font-bold text-sky-700 font-mono mt-0.5 block truncate max-w-[80px]">
              {conformalCoverage.split(' ')[0]}
            </span>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Peak Severity</span>
            <span className={`text-xs font-bold flex items-center justify-center gap-1 mt-0.5 ${
              alertLevel === 'RED' ? 'text-rose-700' :
              alertLevel === 'ORANGE' ? 'text-orange-700' :
              alertLevel === 'YELLOW' ? 'text-amber-700' :
              'text-emerald-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                alertLevel === 'RED' ? 'bg-rose-500' :
                alertLevel === 'ORANGE' ? 'bg-orange-500' :
                alertLevel === 'YELLOW' ? 'bg-amber-500' :
                'bg-emerald-500'
              }`} />
              {alertLevel}
            </span>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Clear</span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">9:00 PM</span>
          </div>
        </div>
      </div>

      {/* Meteorological Severity Classification Cards */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-semibold">
          <span className="uppercase tracking-wider">Meteorological Severity Classification</span>
          <span className="hidden sm:inline">Standardized Public Warning Matrix</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level 1: Advisory */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Level 1: Advisory</span>
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 text-[10px] font-bold">Info</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Minor disruption possible. Be aware of local shifts.
              </p>
            </div>
          </div>

          {/* Level 2: Warning */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Level 2: Warning</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">Moderate</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Take precautions. Travel & outdoor exposure risk.
              </p>
            </div>
          </div>

          {/* Level 3: Severe Warning */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Level 3: Severe Warning</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">Urgent</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Immediate precautions advised. Stay indoors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts + Alert Area Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Alerts Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Active Alerts (2 Current)</h3>
            <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Radar Sync
            </span>
          </div>

          {/* Card 1: Thunderstorm & Rain Warning */}
          <div className="bg-white rounded-3xl p-6 border-t-4 border-t-amber-500 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      WARNING • MODERATE
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> 4:00 PM – 8:00 PM
                    </span>
                    <span>•</span>
                    <span>Indore & Suburbs</span>
                  </div>

                  <h4 className="text-lg font-extrabold text-slate-900 mt-1.5">
                    Thunderstorm & Rain Warning
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Heavy rain and thunderstorms expected.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs font-semibold text-amber-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Action: Stay indoors during thunderstorms.</span>
            </div>

            {/* Expected & Safety Action Mini Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected</span>
                <span className="text-slate-800 font-semibold">Heavy rain and thunderstorms.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Safety Action</span>
                <span className="text-slate-800 font-semibold">Stay indoors during thunderstorms.</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModalAlert(ALERTS_DATA[0])}
                className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                View Details
              </button>
              <button
                onClick={() => setActiveTab('weather-map')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('forecast')}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                View Forecast
              </button>
            </div>
          </div>

          {/* Card 2: Gusty Surface Wind */}
          <div className="bg-white rounded-3xl p-5 border-t-4 border-t-sky-500 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold">
                      ADVISORY • LOW
                    </span>
                    <span>•</span>
                    <span className="font-mono">12:00 PM – 8:00 PM</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    Gusty Surface Wind
                  </h4>
                  <p className="text-xs text-slate-500">
                    Indore & nearby areas • Strong winds may occur.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setExpandedGusty(!expandedGusty)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View Details</span>
                {expandedGusty ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {expandedGusty && (
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                <p>
                  Sustained surface winds 20–30 km/h with gusts exceeding 38 km/h. Exercise caution while operating two-wheelers on bypass flyovers and secure light patio items.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-sky-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>No structural damage expected; general outdoor caution required.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Alert Area Map Radar Visualization */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Compass className="w-4.5 h-4.5 text-sky-600" />
                <span>Alert Area Map</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Radar Live
              </span>
            </div>

            {/* Radar Circle Graphic */}
            <div className="relative w-full aspect-square max-h-72 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-4 select-none">
              {/* Concentric rings */}
              <div className="w-56 h-56 rounded-full border border-dashed border-amber-400/80 bg-amber-500/10 flex items-center justify-center relative">
                <div className="w-40 h-40 rounded-full border border-slate-300 bg-slate-100/50 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-slate-300 flex items-center justify-center">
                    {/* Center Pin */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-700 text-white text-[11px] font-bold shadow-md ring-2 ring-white">
                      <MapPin className="w-3 h-3 text-white" />
                      <span>Indore (You)</span>
                    </div>
                  </div>
                </div>

                {/* Radar beam rotation */}
                <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none bg-gradient-to-tr from-transparent via-amber-500/15 to-transparent" />
              </div>

              {/* Tag labels */}
              <div className="absolute top-3 left-3 text-[11px] font-bold text-amber-800 flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-md border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Warning Zone: Indore District</span>
              </div>
              <div className="absolute top-3 right-3 text-[11px] font-mono text-slate-500 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200">
                Radius: ~35 km
              </div>

              <div className="absolute bottom-3 inset-x-3 text-[11px] text-center bg-white/95 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-medium shadow-xs">
                Thunderstorm band passing through southwest corridor
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('weather-map')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>View on Weather Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upcoming Weather Alerts */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Upcoming Weather Alerts</h3>
          <p className="text-xs text-slate-500">
            Advisories expected over the next 24 to 48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upcoming 1 */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold">
                    ADVISORY
                  </span>
                  <span className="font-mono text-slate-400">65% probability</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  Heavy Rain Advisory
                </h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  Tomorrow • 2:00 PM
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('forecast')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>View Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Upcoming 2 */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                    SOLAR WATCH
                  </span>
                  <span className="font-mono text-amber-700 font-bold">Peak Index: 9.4</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  Elevated UV Index Alert
                </h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  Thursday • 11:30 AM
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('forecast')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>View UV Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Past Alerts (2 Resolved) - Collapsible */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Past Alerts</h3>
            <span className="text-xs text-slate-400">(2 Resolved)</span>
          </div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{showArchived ? 'Hide Archived Records' : 'Show Archived Records'}</span>
            {showArchived ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showArchived && (
          <div className="divide-y divide-slate-100 pt-2">
            <div className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Flame className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="font-bold text-slate-800">Heatwave Advisory</span>
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                    Expired • Resolved
                  </span>
                </div>
              </div>
              <span className="font-mono text-slate-400">May 18</span>
            </div>

            <div className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="font-bold text-slate-800">High UV Radiation</span>
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                    Expired • Resolved
                  </span>
                </div>
              </div>
              <span className="font-mono text-slate-400">May 17</span>
            </div>
          </div>
        )}
      </div>

      {/* Verified Emergency Helplines Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <PhoneCall className="w-5 h-5 text-sky-600" />
            <span>Verified Emergency Helplines</span>
          </div>
          <span className="text-xs text-slate-400">
            Madhya Pradesh State Civil Defense Grid
          </span>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EMERGENCY_HELPLINES.map((h) => (
            <div
              key={h.id}
              onClick={() => showToast(`Calling ${h.label} (${h.number})`)}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                  {h.label}
                </span>
                <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight group-hover:text-sky-600">
                  {h.number}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data synchronized with official meteorological centers.</span>
          </div>
          <span className="font-semibold text-slate-700">24/7 Citizen Emergency Support</span>
        </div>
      </div>
    </div>
  );
}
