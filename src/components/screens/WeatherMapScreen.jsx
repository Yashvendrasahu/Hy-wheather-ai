// src/components/screens/WeatherMapScreen.jsx
import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import { REGIONAL_RADAR_POINTS, ALERTS_DATA } from '../../data/weatherData.js';
import InteractiveRadarCanvas from '../map/InteractiveRadarCanvas.jsx';
import {
  Sparkles,
  Navigation,
  Search,
  CloudRain,
  Wind,
  Thermometer,
  Cloud,
  Droplets,
  Compass,
  AlertTriangle,
  ArrowRight,
  Play,
  Pause,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function WeatherMapScreen() {
  const {
    currentLocation,
    formatTemp,
    mapLayer,
    setMapLayer,
    selectedMapPoint,
    setSelectedMapPoint,
    radarPlaying,
    setRadarPlaying,
    radarTimeStep,
    setRadarTimeStep,
    detectUserLocation,
    loadLocationByCoords,
    setActiveTab,
    setActiveModalAlert,
    showToast
  } = useWeather();

  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [showPointCard, setShowPointCard] = useState(true);

  const timeTicks = [
    { step: 0, label: '-1h' },
    { step: 1, label: '-30m' },
    { step: 2, label: 'Now' },
    { step: 3, label: '+1h' },
    { step: 4, label: '+2h' },
    { step: 5, label: '+3h' }
  ];

  const handleSelectPoint = (pt) => {
    setSelectedMapPoint(pt);
    setShowPointCard(true);
    showToast(`Radar focused on ${pt.regionName} (${pt.status})`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Doppler Radar
            </span>
            <span>•</span>
            <span>Updated 1 min ago</span>
            <span>•</span>
            <span className="text-slate-500">INSAT-3DR Ensemble</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Weather Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore real-time telemetry and predictive atmospheric motion vectors across {currentLocation.region || currentLocation.name || 'your region'}.
          </p>
        </div>

        {/* Search input + GPS button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setActiveTab('search');
                }
              }}
              placeholder={currentLocation.fullName || "Search location..."}
              className="pl-9 pr-10 py-2 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 w-52 sm:w-64"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              ↵
            </span>
          </div>

          <button
            onClick={() => {
              detectUserLocation();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 text-sky-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Current GPS</span>
          </button>
        </div>
      </div>

      {/* Main Map Container Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        {/* Layer Switches Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-semibold">
            {[
              { id: 'rain', label: 'Rain', icon: CloudRain },
              { id: 'temp', label: 'Temp', icon: Thermometer },
              { id: 'wind', label: 'Wind', icon: Wind },
              { id: 'clouds', label: 'Clouds', icon: Cloud }
            ].map((lyr) => {
              const Icon = lyr.icon;
              const isActive = mapLayer === lyr.id;
              return (
                <button
                  key={lyr.id}
                  onClick={() => setMapLayer(lyr.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lyr.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            Doppler Mode: 250m Resolution Pulse
          </div>
        </div>

        {/* Interactive Radar Canvas Area with Floating Detail Pin Card */}
        <div className="relative rounded-2xl overflow-hidden">
          <InteractiveRadarCanvas isCompact={false} height={480} />

          {/* Floating Selected City Telemetry Card */}
          {showPointCard && selectedMapPoint && (
            <div className="absolute top-4 right-4 z-20 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedMapPoint.regionName}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-sky-700">
                    Active Selection
                  </span>
                </div>
                <button
                  onClick={() => setShowPointCard(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Big Temp and Status */}
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono">
                    {formatTemp(selectedMapPoint.temp)}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">
                    {selectedMapPoint.status}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <CloudRain className="w-5 h-5" />
                </div>
              </div>

              {/* 4 Quick Stat Pills */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Precip Chance</span>
                  <strong className="text-sky-700 font-mono text-sm">{selectedMapPoint.rainProb}%</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Wind Vector</span>
                  <strong className="text-slate-800 text-xs">{selectedMapPoint.windVector}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Relative Humidity</span>
                  <strong className="text-slate-800 text-xs">{selectedMapPoint.humidity}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Pressure (MSL)</span>
                  <strong className="text-slate-800 text-xs">{selectedMapPoint.pressure}</strong>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => setActiveTab('forecast')}
                className="w-full mt-3 py-2 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Detailed Forecast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Color Legend Bar (bottom-left) */}
          <div className="absolute left-4 bottom-4 z-10 bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm text-xs">
            <div className="flex items-center justify-between gap-4 mb-1 text-[10px] font-bold text-slate-700">
              <span>PRECIPITATION (MM/H)</span>
              <span className="text-slate-400 font-normal">Doppler Reflectivity</span>
            </div>
            <div className="w-48 h-2 rounded-full bg-gradient-to-r from-sky-300 via-emerald-400 via-amber-400 via-orange-500 to-rose-600 mb-1" />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Light (0.1)</span>
              <span>Moderate (4)</span>
              <span>Heavy (15+)</span>
            </div>
          </div>
        </div>

        {/* Player & Time Scrubber Bar */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setRadarPlaying(!radarPlaying)}
              className="w-9 h-9 rounded-xl bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0"
            >
              {radarPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Time Ticks */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 overflow-x-auto no-scrollbar">
              {timeTicks.map((t) => {
                const isActive = radarTimeStep === t.step;
                return (
                  <button
                    key={t.step}
                    onClick={() => setRadarTimeStep(t.step)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
              Live (Now)
            </span>
            <span>Speed: 1.0x Loop</span>
          </div>
        </div>
      </div>

      {/* AI Ensemble Trajectory Insight Card */}
      <div className="bg-sky-50/80 rounded-3xl p-6 border border-sky-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-sky-600 text-white shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                AI Ensemble Trajectory Insight
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-sky-200 text-sky-900 text-[11px] font-bold">
                92% Model Consensus
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed max-w-4xl">
              A moderate convective rain band is currently tracking east-northeast at <strong>22 km/h</strong> from the Dhar–Pithampur ridge. High-resolution NWP microphysics predict precipitation initiation across central Indore within the next <strong>45 minutes</strong>, bringing brief gusty surface winds up to 36 km/h.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('Displaying ECMWF 1.2km Microgrid Simulation Run')}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 transition-colors shadow-2xs whitespace-nowrap cursor-pointer shrink-0 self-end md:self-center"
        >
          Inspect Model Run
        </button>
      </div>

      {/* Nearby Regional Weather Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Nearby Regional Weather</h2>
            <p className="text-xs text-slate-500">
              Live telemetry and precipitation probabilities in surrounding Malwa districts.
            </p>
          </div>
          <span className="text-xs text-slate-400">Click any region to center radar</span>
        </div>

        {/* 5 Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {REGIONAL_RADAR_POINTS.slice(0, 5).map((pt) => {
            const isSelected = selectedMapPoint?.id === pt.id;
            return (
              <div
                key={pt.id}
                onClick={() => handleSelectPoint(pt)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50/90 border-sky-300 ring-2 ring-sky-400/30 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase">
                  <span>{pt.tag}</span>
                  <CloudRain className={`w-3.5 h-3.5 ${pt.rainProb > 50 ? 'text-rose-500' : 'text-sky-500'}`} />
                </div>

                <div className="text-base font-bold text-slate-900 mt-2">
                  {pt.regionName}
                </div>

                <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums my-1">
                  {formatTemp(pt.temp)}
                </div>

                <div className="text-xs text-slate-500 truncate">
                  {pt.status}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Rain Prob.</span>
                  <span className={`font-mono ${pt.rainProb >= 60 ? 'text-rose-600' : 'text-slate-700'}`}>
                    {pt.rainProb}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Alert Banner */}
      <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs text-slate-700">
            <strong className="text-rose-900 font-bold block sm:inline mr-2">
              Thunderstorm & High Wind Advisory:
            </strong>
            Valid until 7:30 PM IST for Indore, Dhar, Pithampur & adjoining Western MP districts. Expect lightning strikes and localized waterlogging.
          </div>
        </div>

        <button
          onClick={() => setActiveTab('alerts')}
          className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 whitespace-nowrap cursor-pointer ml-auto"
        >
          <span>View Alert Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
