// src/components/screens/HomeScreen.jsx
import React from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import {
  HOURLY_FORECAST,
  SEVEN_DAY_FORECAST,
  MET_STATION_TELEMETRY
} from '../../data/weatherData.js';
import InteractiveRadarCanvas from '../map/InteractiveRadarCanvas.jsx';
import TopAlertRibbon from '../moes/TopAlertRibbon.jsx';
import {
  Sparkles,
  ShieldAlert,
  Droplets,
  Wind,
  CloudRain,
  Eye,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Sun,
  Cloud,
  CloudLightning,
  Moon,
  Search,
  Radio,
  Clock,
  Compass,
  MapPin,
  ChevronRight,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';

export default function HomeScreen() {
  const {
    currentLocation,
    switchLocation,
    loadLocationByCoords,
    detectUserLocation,
    isDynamicLoading,
    hourlyForecast,
    sevenDayForecast,
    formatTemp,
    setActiveTab,
    setShowSafetyModal,
    selectedHourIndex,
    setSelectedHourIndex,
    radarTimeStep,
    setRadarTimeStep,
    radarPlaying,
    setRadarPlaying,
    mapLayer,
    setMapLayer,
    moesPayload,
    moesResult,
    moesLoading
  } = useWeather();

  const quickCities = [
    { name: 'Indore', lat: 22.7196, lon: 75.8577, region: 'Madhya Pradesh' },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777, region: 'Maharashtra' },
    { name: 'Delhi', lat: 28.6139, lon: 77.2090, region: 'National Capital' },
    { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, region: 'Karnataka' }
  ];

  const currentDateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const getWeatherIcon = (iconName, className = "w-6 h-6") => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'cloud':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'rain':
        return <CloudRain className={`${className} text-sky-500`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-indigo-500`} />;
      case 'moon':
        return <Moon className={`${className} text-indigo-300`} />;
      default:
        return (
          <div className="relative inline-block">
            <Sun className={`${className} text-amber-500`} />
            <Cloud className="w-4 h-4 text-slate-400 absolute -bottom-1 -right-1" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Telemetry & Quick Switch Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-500 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
            Live Telemetry
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {currentLocation.fullName}
          </span>
          <span className="text-slate-300">•</span>
          <span>Updated 2 mins ago (10:43 AM IST)</span>
        </div>

        {/* Quick switch cities */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 mr-1">Quick cities:</span>
          {quickCities.map(city => (
            <button
              key={city.name}
              onClick={() => loadLocationByCoords(city.lat, city.lon, {
                name: city.name,
                region: city.region,
                country: 'India',
                fullName: `${city.name}, ${city.region}`
              })}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              {city.name}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium transition-colors cursor-pointer"
          >
            <Search className="w-3 h-3" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Dynamic Physics AI Alert Ribbon */}
      <TopAlertRibbon
        alertLevel={moesResult?.precipitation?.alert || 'GREEN'}
        precipitation={moesResult?.precipitation}
        cin={moesPayload?.cin || 0}
        isBustWarning={moesResult?.precipitation?.is_bust_warning}
      />

      {/* Top Main Two-Column Hero Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hero Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            {/* Title & AQI Row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {currentLocation.fullName || currentLocation.name}
                  </h1>
                  <CheckCircle className="w-5 h-5 text-sky-500 fill-sky-100" />
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span>{currentDateStr}</span>
                  <span>•</span>
                  <span>{currentTimeStr}</span>
                  <span>•</span>
                  <span>Elevation {currentLocation.coordinates?.elev || '550m'}</span>
                </div>
              </div>

              {/* AQI Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold shrink-0">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>AQI: {currentLocation.aqi} ({currentLocation.aqiLabel})</span>
              </div>
            </div>

            {/* Big Temperature and Weather Artwork */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-6xl sm:text-7xl font-extrabold text-slate-900 tracking-tighter font-mono tabular-nums">
                  {formatTemp(currentLocation.tempC)}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-700">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                    {currentLocation.condition}
                  </span>
                  <span className="text-slate-500">
                    Feels like {formatTemp(currentLocation.feelsLikeC)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500 font-medium">
                  <span className="text-rose-600 font-semibold">↑ H: {formatTemp(currentLocation.highC)}</span>
                  <span className="mx-2">/</span>
                  <span className="text-sky-600 font-semibold">↓ L: {formatTemp(currentLocation.lowC)}</span>
                </div>
              </div>

              {/* Stylized Sun + Cloud + Raindrops Illustration */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center select-none">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 opacity-90 blur-xs absolute top-2 right-2 animate-pulse-subtle" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Sun className="w-20 h-20 sm:w-24 sm:h-24 text-amber-500 stroke-[1.5]" />
                    <Cloud className="w-16 h-16 sm:w-20 sm:h-20 text-slate-200 fill-slate-50 drop-shadow-md absolute -bottom-3 -left-3 stroke-slate-300" />
                    {/* Falling raindrops */}
                    <div className="absolute -bottom-7 left-3 flex gap-1.5 opacity-80">
                      <span className="w-1 h-3.5 bg-sky-400 rounded-full rotate-12 animate-bounce" />
                      <span className="w-1 h-3 bg-sky-400 rounded-full rotate-12 animate-bounce delay-100" />
                      <span className="w-1 h-3.5 bg-sky-400 rounded-full rotate-12 animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Outlook Callout */}
            <div className="mt-6 p-4 rounded-2xl bg-sky-50/60 border border-sky-100/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="font-bold text-sky-900">Live Outlook: </span>
              {currentLocation.liveOutlook}
            </div>
          </div>

          {/* 4 Metric Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>Humidity</span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1 font-mono tabular-nums">
                {currentLocation.humidity}%
              </div>
              <div className="text-[11px] text-slate-400">
                Dew point {formatTemp(currentLocation.dewPointC)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Wind className="w-3.5 h-3.5 text-sky-600" />
                <span>Wind Speed</span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1 font-mono tabular-nums">
                {currentLocation.windSpeed} <span className="text-xs font-normal">km/h</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Direction: {currentLocation.windDirection}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <CloudRain className="w-3.5 h-3.5 text-indigo-500" />
                <span>Precipitation</span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1 font-mono tabular-nums">
                {currentLocation.precipitation}%
              </div>
              <div className="text-[11px] text-slate-400">
                {currentLocation.precipSummary}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Eye className="w-3.5 h-3.5 text-teal-600" />
                <span>Visibility</span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1 font-mono tabular-nums">
                {currentLocation.visibility} <span className="text-xs font-normal">km</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {currentLocation.visibilityDesc}
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Card (AI Forecast Insight) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            {/* AI Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>AI Forecast Insight</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {currentLocation.aiInsight?.version || 'Micro-model v4.2'}
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-4 leading-snug">
              {currentLocation.aiInsight?.headline}
            </h3>

            {/* Micro-shifts timeline cards */}
            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                    <span>{currentLocation.aiInsight?.shift1?.title}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {currentLocation.aiInsight?.shift1?.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLocation.aiInsight?.shift1?.desc}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{currentLocation.aiInsight?.shift2?.title}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {currentLocation.aiInsight?.shift2?.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLocation.aiInsight?.shift2?.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Confidence & Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-medium">Ensemble Confidence</span>
                <span className="font-bold text-sky-700 font-mono">
                  High ({currentLocation.aiInsight?.confidence || 92}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full"
                  style={{ width: `${currentLocation.aiInsight?.confidence || 92}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setActiveTab('forecast')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Detailed Timeline Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weather Advisory Banner */}
      {currentLocation.advisory && (
        <div className="bg-rose-50/80 border-l-4 border-rose-500 p-5 rounded-2xl border border-rose-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  {currentLocation.advisory.type}
                </span>
                <span className="text-xs text-rose-500">• Valid until {currentLocation.advisory.validUntil}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {currentLocation.advisory.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {currentLocation.advisory.summary}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSafetyModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs shrink-0 self-end md:self-center"
          >
            <span>Safety Guidance</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Today's Weather - Hourly Progression */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Today's Weather</h2>
            <p className="text-xs text-slate-500">
              Hourly progression, micro-thermal shift & precipitation likelihood
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-sky-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              Rain chance
            </span>
            <span>•</span>
            <span>Scroll to explore</span>
          </div>
        </div>

        {/* Hourly Cards Row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 custom-scrollbar">
          {(hourlyForecast || []).map((h, idx) => {
            const isSelected = idx === selectedHourIndex;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedHourIndex(idx);
                  setActiveTab('forecast');
                }}
                className={`min-w-[104px] flex-1 p-3.5 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-sky-50/90 border-sky-300 ring-2 ring-sky-400/30 shadow-xs'
                    : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100 hover:border-slate-200'
                }`}
              >
                <span className={`text-xs font-semibold whitespace-nowrap ${isSelected ? 'text-sky-800' : 'text-slate-600'}`}>
                  {h.time}
                </span>

                <div className="my-2.5">
                  {getWeatherIcon(h.icon, "w-6 h-6")}
                </div>

                <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                  {formatTemp(h.tempC)}
                </span>

                {/* Rain probability bar */}
                <div className="w-full mt-3 flex items-center justify-between gap-1 text-[11px] text-slate-500 font-medium">
                  <span className="text-[10px] text-slate-400">Rain</span>
                  <span className={`font-mono font-bold ${h.rainProb > 40 ? 'text-sky-600' : 'text-slate-600'}`}>
                    {h.rainProb}%
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${h.rainProb > 50 ? 'bg-sky-500' : 'bg-slate-400'}`}
                    style={{ width: `${h.rainProb}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Section: 7-Day Forecast & Live Radar Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 7-Day Forecast */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">7–Day Forecast</h3>
                <p className="text-xs text-slate-500">
                  Synoptic prediction calibrated by local radar nodes
                </p>
              </div>
              <button
                onClick={() => setActiveTab('forecast')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Detailed Table</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of 7 Days */}
            <div className="divide-y divide-slate-100">
              {(sevenDayForecast || []).map((d, index) => (
                <div
                  key={index}
                  onClick={() => setActiveTab('forecast')}
                  className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-24">
                    <div className="font-bold text-slate-900">{d.day}</div>
                    <div className="text-[11px] text-slate-400">{d.date}</div>
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    {getWeatherIcon(d.icon, "w-4.5 h-4.5")}
                    <span className="text-slate-700 truncate max-w-[140px] sm:max-w-[180px]">
                      {d.condition}
                    </span>
                  </div>

                  <div className="w-16 text-center">
                    {d.rainProb > 0 ? (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        d.rainProb >= 50
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-sky-50 text-sky-600'
                      }`}>
                        {d.rainProb}% rain
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">0%</span>
                    )}
                  </div>

                  {/* Temperature range bar */}
                  <div className="flex items-center gap-2 w-28 justify-end">
                    <span className="font-mono font-bold text-slate-800">
                      {formatTemp(d.highC)}
                    </span>
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="absolute inset-y-0 left-1 right-1 bg-gradient-to-r from-amber-400 to-sky-500 rounded-full" />
                    </div>
                    <span className="font-mono text-slate-400">
                      {formatTemp(d.lowC)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Radar Map Preview */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Live Radar Map</h3>
                <p className="text-xs text-slate-500">
                  Regional precipitation clusters tracking eastward toward Indore
                </p>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                DOPPLER LIVE
              </span>
            </div>

            {/* Interactive Canvas */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 mb-2">
                {['rain', 'clouds', 'wind'].map((lyr) => (
                  <button
                    key={lyr}
                    onClick={() => setMapLayer(lyr)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                      mapLayer === lyr
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lyr}
                  </button>
                ))}
              </div>

              <InteractiveRadarCanvas isCompact={true} height={260} />
            </div>

            {/* Time player scrubber bar */}
            <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRadarPlaying(p => !p)}
                  className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold hover:bg-sky-700 cursor-pointer"
                >
                  {radarPlaying ? '⏸' : '▶'}
                </button>
                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                  <span className={radarTimeStep === 0 ? 'font-bold text-sky-600' : ''}>-60m</span>
                  <span>•</span>
                  <span className={radarTimeStep === 2 ? 'font-bold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded' : ''}>
                    LIVE NOW
                  </span>
                  <span>•</span>
                  <span className={radarTimeStep === 4 ? 'font-bold text-sky-600' : ''}>+120m</span>
                </div>
              </div>

              <span className="font-mono text-slate-500 font-semibold">10:45 AM</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('weather-map')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Open Full Weather Map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sensor Grid Status Footer Strip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-sky-600 shrink-0 animate-pulse" />
          <span>{MET_STATION_TELEMETRY.gridStatus}</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{MET_STATION_TELEMETRY.uptime}</span>
        </div>
      </div>
    </div>
  );
}
