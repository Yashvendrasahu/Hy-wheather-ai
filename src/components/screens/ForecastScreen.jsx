// src/components/screens/ForecastScreen.jsx
import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import {
  HOURLY_FORECAST,
  SEVEN_DAY_FORECAST,
  MET_STATION_TELEMETRY,
  ALERTS_DATA
} from '../../data/weatherData.js';
import {
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Compass,
  Droplets,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Eye,
  ShieldCheck,
  TrendingUp,
  Activity,
  Radio,
  ArrowRight,
  BarChart3,
  Gauge
} from 'lucide-react';

export default function ForecastScreen() {
  const {
    currentLocation,
    formatTemp,
    setActiveTab,
    selectedHourIndex,
    setSelectedHourIndex,
    setActiveModalAlert,
    showToast,
    hourlyForecast,
    sevenDayForecast,
    moesResult,
    moesPayload
  } = useWeather();

  const [expandedDayIndex, setExpandedDayIndex] = useState(0);

  const selectedHour = hourlyForecast?.[selectedHourIndex] || hourlyForecast?.[0] || {};
  const activeAdvisory = currentLocation.advisory || ALERTS_DATA[0];

  // Dynamic values mapped from live FastAPI ML backend
  const blendedTemp = moesResult?.temperature?.blended_2m_celsius ?? currentLocation.tempC;
  const p50 = moesResult?.precipitation?.quantiles_mm?.p50 ?? 0;
  const p90 = moesResult?.precipitation?.quantiles_mm?.p90 ?? 0;
  const p10 = moesResult?.precipitation?.quantiles_mm?.p10 ?? 0;
  const bustProb = moesResult?.precipitation?.nwp_bust_probability ?? 0.428;
  const isBustWarning = moesResult?.precipitation?.is_bust_warning ?? false;
  const conformalCoverageText = moesResult?.precipitation?.conformal_coverage || '86.75% Guaranteed';
  const alertLevel = moesResult?.precipitation?.alert || 'ORANGE';
  const sustainedWind = moesResult?.wind?.sustained_speed_kmh ?? currentLocation.windSpeed;
  const gustWind = moesResult?.wind?.gust_ceiling_p90_kmh ?? currentLocation.windGusts;
  const pressureVal = moesPayload?.mslp ?? currentLocation.pressure ?? 1012;
  const dynamicRainProb = Math.min(95, Math.round(bustProb * 100 + p50 * 2));
  const dynamicCondition = p50 > 10.0 ? 'Scattered Convective Showers' : (p50 === 0 ? 'Clear / Partly Cloudy' : currentLocation.condition);
  const aiHeadline = isBustWarning
    ? 'Rain chances escalate sharply. Strong convective initiation modeled.'
    : 'Model agreement steady across regional physics runs.';
  const confidencePercent = Math.round(parseFloat(conformalCoverageText) || 87);

  const getWeatherIcon = (iconName, className = "w-5 h-5") => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'cloud':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'rain':
        return <CloudRain className={`${className} text-sky-500`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-indigo-600`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Location Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 tracking-wider uppercase mb-1">
            <span>Synoptic Meteorology</span>
            <span>•</span>
            <span>Ensemble AI v4.2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Detailed Forecast
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">{currentLocation.fullName}</span>
            <span>•</span>
            <span>Tuesday, 20 May</span>
            <span>•</span>
            <span>Updated 10:30 AM IST</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold">
            <Cloud className="w-3.5 h-3.5 text-sky-600" />
            <span>Partly Cloudy, mild humidity</span>
          </div>
          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Change Location</span>
          </button>
        </div>
      </div>

      {/* Advisory Banner */}
      {activeAdvisory && (
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          alertLevel === 'RED'
            ? 'bg-rose-50/80 border-l-4 border-l-rose-500 border-rose-200'
            : alertLevel === 'ORANGE'
            ? 'bg-orange-50/80 border-l-4 border-l-orange-500 border-orange-200'
            : alertLevel === 'YELLOW'
            ? 'bg-amber-50/80 border-l-4 border-l-amber-500 border-amber-200'
            : 'bg-emerald-50/80 border-l-4 border-l-emerald-500 border-emerald-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              alertLevel === 'RED' ? 'bg-rose-100 text-rose-700' :
              alertLevel === 'ORANGE' ? 'bg-orange-100 text-orange-700' :
              alertLevel === 'YELLOW' ? 'bg-amber-100 text-amber-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  {alertLevel} ALERT: Convective Rain Warning for {currentLocation.name}
                </h4>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  alertLevel === 'RED' ? 'bg-rose-100 text-rose-800' :
                  alertLevel === 'ORANGE' ? 'bg-orange-100 text-orange-800' :
                  alertLevel === 'YELLOW' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {alertLevel === 'RED' ? 'Critical Threat' : alertLevel === 'ORANGE' ? 'Convective Rain Alert' : 'Advisory Watch'}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Valid: Today, 2:30 PM – 7:30 PM IST
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Affected Area: <strong className="text-slate-800">{currentLocation.fullName} & Suburbs</strong>. Convective rainfall P50 {p50} mm (P90 hazard ceiling: {p90} mm). Wind gusts up to {gustWind} km/h probable.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModalAlert(activeAdvisory)}
            className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap self-end md:self-center shrink-0 shadow-xs ${
              alertLevel === 'RED' ? 'bg-rose-600 hover:bg-rose-700' :
              alertLevel === 'ORANGE' ? 'bg-orange-600 hover:bg-orange-700' :
              alertLevel === 'YELLOW' ? 'bg-amber-600 hover:bg-amber-700' :
              'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            View Alert Details
          </button>
        </div>
      )}

      {/* 6 Quick Metrics Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Temperature</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
            {formatTemp(blendedTemp)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Feels like {formatTemp(moesResult?.temperature?.rothfusz_heat_index_celsius ?? currentLocation.feelsLikeC)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Day Extremes</span>
            <TrendingUp className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
            ↑{formatTemp(currentLocation.highC)} / ↓{formatTemp(currentLocation.lowC)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Normal diurnal range
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Precip Chance</span>
            <CloudRain className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
            {dynamicRainProb}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            P50: {p50} mm • P90: {p90} mm
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Wind Vector</span>
            <Wind className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
            {sustainedWind} <span className="text-xs font-normal">km/h</span> <span className="text-xs text-slate-500">{currentLocation.windDirection || 'NW'}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Gusts up to {gustWind} km/h
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pressure</span>
            <Compass className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
            {pressureVal} <span className="text-xs font-normal">hPa</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            Stable atmospheric column
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Air Quality Index</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{currentLocation.aqi} AQI</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {currentLocation.aqiLabel} • PM2.5: {currentLocation.pm25}
          </div>
        </div>
      </div>

      {/* Hourly Forecast Section with Interactive Inspection Slot */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hourly Forecast</h2>
            <p className="text-xs text-slate-500">
              24-hour micro-progression • Click any hour to inspect localized metrics
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-sky-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              Rain volume %
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Wind className="w-3 h-3" />
              Wind speed
            </span>
          </div>
        </div>

        {/* Hourly Selectable Cards */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
          {(hourlyForecast || []).map((h, idx) => {
            const isSelected = selectedHourIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedHourIndex(idx)}
                className={`min-w-[102px] p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-102 ring-2 ring-sky-300'
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className={`text-[11px] font-semibold whitespace-nowrap ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                  {h.time}
                </span>

                <div className="my-2">
                  {getWeatherIcon(h.icon, "w-6 h-6")}
                </div>

                <span className={`text-base font-extrabold font-mono tabular-nums ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {formatTemp(h.tempC)}
                </span>

                <div className={`mt-2 text-[11px] font-medium flex flex-col items-center ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                  <span className="font-mono">{h.rainProb}%</span>
                  <span className="text-[10px] opacity-80">{h.windSpeed} km/h</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Hour Detailed Inspector Card */}
        <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-sky-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
                {getWeatherIcon(selectedHour.icon, "w-6 h-6 text-white")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Hour Detail: {selectedHour.hour}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-bold">
                    Selected Slot
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Microclimate analysis for central Indore plateau
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xl font-extrabold text-slate-900 font-mono">
                  {formatTemp(selectedHour.tempC)}
                </div>
                <div className="text-xs text-slate-500">
                  Feels like {formatTemp(selectedHour.feelsLikeC)}
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-white text-sky-800 border border-sky-200 text-xs font-bold shadow-2xs">
                ● {selectedHour.condition}
              </div>
            </div>
          </div>

          {/* 6 Grid Specs for Selected Hour */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            <div className="p-3 bg-white rounded-xl border border-sky-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                <span>Precipitation</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                {selectedHour.rainProb}%
              </div>
              <div className="text-[11px] text-slate-400">{selectedHour.rainVolume}</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sky-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>Humidity</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                {selectedHour.humidity}%
              </div>
              <div className="text-[11px] text-slate-400">Dew point {formatTemp(selectedHour.dewPointC)}</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sky-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Wind className="w-3.5 h-3.5 text-indigo-500" />
                <span>Wind Vector</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                {selectedHour.windSpeed} <span className="text-xs font-normal">km/h</span>
              </div>
              <div className="text-[11px] text-slate-400">Direction: {selectedHour.windDir}</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sky-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Eye className="w-3.5 h-3.5 text-teal-600" />
                <span>Visibility</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                {selectedHour.visibility} <span className="text-xs font-normal">km</span>
              </div>
              <div className="text-[11px] text-slate-400">Daylight clarity</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sky-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Cloud className="w-3.5 h-3.5 text-slate-400" />
                <span>Cloud Cover</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                {selectedHour.cloudCover}%
              </div>
              <div className="text-[11px] text-slate-400">Cumulonimbus aloft</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sky-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>UV Index</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                {selectedHour.uvIndex} <span className="text-xs font-normal">/ 11</span>
              </div>
              <div className="text-[11px] text-slate-400">Cloud filtered</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Synoptic Outlook with Accordion & AI Insight Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Accordion Left */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">7–Day Synoptic Outlook</h3>
              <p className="text-xs text-slate-500">
                Diurnal segment breakdown with atmospheric probability modeling
              </p>
            </div>
            <span className="text-xs text-sky-600 font-medium">Click rows to expand segments</span>
          </div>

          <div className="space-y-3">
            {(sevenDayForecast || []).map((day, idx) => {
              const isExpanded = expandedDayIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-sky-300 bg-sky-50/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {/* Clickable Header Row */}
                  <div
                    onClick={() => setExpandedDayIndex(isExpanded ? -1 : idx)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        {getWeatherIcon(day.icon, "w-5 h-5")}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{day.day}, {day.date.split(', ')[1]}</div>
                        <div className="text-xs text-slate-500">{day.condition}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block">
                        {day.rainProb > 0 ? (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            day.rainProb >= 50 ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'
                          }`}>
                            {day.rainProb}% rain
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">0% rain</span>
                        )}
                      </div>

                      {/* Temperature Range Bar */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400">{formatTemp(day.lowC)}</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                          <div className={`absolute inset-y-0 left-0 right-0 bg-gradient-to-r ${day.barColor}`} />
                        </div>
                        <span className="font-mono text-sm font-bold text-slate-800">{formatTemp(day.highC)}</span>
                      </div>

                      <div className="text-slate-400 p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Diurnal Breakdown Expanded Sub-Cards */}
                  {isExpanded && day.diurnal && (
                    <div className="p-4 pt-1 border-t border-sky-100 bg-white/70">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        Diurnal Breakdown ({day.day.toUpperCase()})
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-800">Morning</span>
                            <span className="text-[10px] text-slate-400 font-mono">6 AM–12 PM</span>
                          </div>
                          <div className="text-xs text-slate-600 font-medium">{day.diurnal.morning.cond}</div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Rain: <strong>{day.diurnal.morning.rain}</strong> • Wind: {day.diurnal.morning.wind}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-amber-900">Afternoon</span>
                            <span className="text-[10px] text-amber-700 font-mono">12 PM–5 PM</span>
                          </div>
                          <div className="text-xs text-amber-800 font-medium">{day.diurnal.afternoon.cond}</div>
                          <div className="text-[11px] text-amber-700 mt-1">
                            Rain: <strong>{day.diurnal.afternoon.rain}</strong> • Wind: {day.diurnal.afternoon.wind}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-800">Evening</span>
                            <span className="text-[10px] text-slate-400 font-mono">5 PM–9 PM</span>
                          </div>
                          <div className="text-xs text-slate-600 font-medium">{day.diurnal.evening.cond}</div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Rain: <strong>{day.diurnal.evening.rain}</strong> • Wind: {day.diurnal.evening.wind}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-800">Night</span>
                            <span className="text-[10px] text-slate-400 font-mono">9 PM–6 AM</span>
                          </div>
                          <div className="text-xs text-slate-600 font-medium">{day.diurnal.night.cond}</div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Rain: <strong>{day.diurnal.night.rain}</strong> • Wind: {day.diurnal.night.wind}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: AI Insight + Forecast Reliability Gauge + Met Station */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI Forecast Insight */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>AI Forecast Insight</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {aiHeadline}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ensemble calibration indicates {dynamicCondition.toLowerCase()} with median accumulation of {p50} mm (P90 upper boundary {p90} mm). Conformal statistical guarantee active at {conformalCoverageText}.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Ensemble: GFS+ECMWF+NCUM</span>
              <span className="text-sky-600 font-semibold">{conformalCoverageText}</span>
            </div>
          </div>

          {/* Forecast Reliability Gauge */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Forecast Reliability
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ● High Confidence ({conformalCoverageText})
              </span>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center font-extrabold text-2xl text-sky-700 font-mono shadow-2xs shrink-0">
                {confidencePercent}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Current atmospheric state and multi-physics NWP inputs confirm {conformalCoverageText} conformal bounds across regional observation points.
              </p>
            </div>
          </div>

          {/* Indore Aerodrome Met Station Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">{MET_STATION_TELEMETRY.stationName}</h4>
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Lat: {MET_STATION_TELEMETRY.lat} • Lon: {MET_STATION_TELEMETRY.lon} • Elev: {MET_STATION_TELEMETRY.elev}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{MET_STATION_TELEMETRY.activeSensors}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conformal Ensemble AI Calibration Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg border border-sky-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-sky-400" />
                Backend Physics AI Model
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                moesResult?.precipitation?.alert === 'RED'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : moesResult?.precipitation?.alert === 'ORANGE'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : moesResult?.precipitation?.alert === 'YELLOW'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {moesResult?.precipitation?.alert || 'GREEN'} ALERT
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              Calibrated Conformal Ensemble Forecast
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Multi-model blend (GFS, ECMWF, NCUM, WRF) with statistical guarantees ({moesResult?.precipitation?.conformal_coverage || '86.75% Guaranteed'}).
              Median rain expectation: <strong className="text-sky-300">{moesResult?.precipitation?.quantiles_mm?.p50 || 0} mm</strong> (P90 hazard ceiling: <strong className="text-rose-300">{moesResult?.precipitation?.quantiles_mm?.p90 || 0} mm</strong>).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 block">P10 Baseline</span>
                <span className="text-base font-bold font-mono text-emerald-300">{moesResult?.precipitation?.quantiles_mm?.p10 ?? 0}mm</span>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-sky-200 block">P50 Expected</span>
                <span className="text-base font-bold font-mono text-sky-300">{moesResult?.precipitation?.quantiles_mm?.p50 ?? 0}mm</span>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-rose-300 block">P90 Hazard</span>
                <span className="text-base font-bold font-mono text-rose-400">{moesResult?.precipitation?.quantiles_mm?.p90 ?? 0}mm</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('alerts')}
              className="px-4 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-sky-500/25 shrink-0"
            >
              <span>View Active Alerts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Meteorological Trends Section (Charts) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">7–Day Meteorological Trends</h3>
          <p className="text-xs text-slate-500">
            Comparative thermal trajectory and precipitation probability curves
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Temperature Trend Chart */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span>Temperature Trend</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Highs
                </span>
                <span className="flex items-center gap-1.5 text-sky-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Lows
                </span>
              </div>
            </div>

            {/* SVG Visualized Trend Line */}
            <div className="h-44 w-full relative">
              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#E2E8F0" strokeDasharray="3 3" />

                {/* Highs Curve: 33, 30, 31, 34, 35, 36, 35 (Scaled) */}
                <path
                  d="M 35,50 Q 105,80 175,70 T 315,40 T 455,30"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Lows Curve: 24, 23, 23, 24, 25, 25, 24 */}
                <path
                  d="M 35,120 Q 105,130 175,130 T 315,115 T 455,120"
                  fill="none"
                  stroke="#0EA5E9"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* High Points */}
                {[
                  { x: 35, y: 50, val: '33°', day: 'Tue' },
                  { x: 105, y: 80, val: '30°', day: 'Wed' },
                  { x: 175, y: 70, val: '31°', day: 'Thu' },
                  { x: 245, y: 45, val: '34°', day: 'Fri' },
                  { x: 315, y: 35, val: '35°', day: 'Sat' },
                  { x: 385, y: 25, val: '36°', day: 'Sun' },
                  { x: 455, y: 35, val: '35°', day: 'Mon' }
                ].map((pt, i) => (
                  <g key={`high-${i}`}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
                    <text x={pt.x} y={pt.y - 10} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350F" className="font-mono">
                      {pt.val}
                    </text>
                  </g>
                ))}

                {/* Low Points */}
                {[
                  { x: 35, y: 120, val: '24°' },
                  { x: 105, y: 130, val: '23°' },
                  { x: 175, y: 130, val: '23°' },
                  { x: 245, y: 120, val: '24°' },
                  { x: 315, y: 115, val: '25°' },
                  { x: 385, y: 115, val: '25°' },
                  { x: 455, y: 120, val: '24°' }
                ].map((pt, i) => (
                  <g key={`low-${i}`}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="2" />
                    <text x={pt.x} y={pt.y + 18} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369A1" className="font-mono">
                      {pt.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Days row */}
            <div className="flex justify-between px-3 text-xs font-semibold text-slate-500 mt-2">
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
              <span>Mon</span>
            </div>

            <p className="text-[11px] text-slate-500 mt-3">
              Thermal nadir on Wednesday during rain; surge follows toward 36°C Sunday.
            </p>
          </div>

          {/* Rain Probability Chart */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <CloudRain className="w-4 h-4 text-sky-600" />
                <span>Rain Probability</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">Likelihood percentage %</span>
            </div>

            {/* Bar Chart Bars */}
            <div className="h-44 flex items-end justify-between gap-3 px-2 pt-6">
              {[
                { day: 'Tue', prob: 40, isPeak: false },
                { day: 'Wed', prob: 65, isPeak: true },
                { day: 'Thu', prob: 30, isPeak: false },
                { day: 'Fri', prob: 10, isPeak: false },
                { day: 'Sat', prob: 5, isPeak: false },
                { day: 'Sun', prob: 0, isPeak: false },
                { day: 'Mon', prob: 15, isPeak: false }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className={`text-[11px] font-bold font-mono ${bar.isPeak ? 'text-rose-600' : 'text-slate-700'}`}>
                    {bar.prob}%
                  </span>
                  <div className="w-full max-w-[32px] bg-slate-200 rounded-t-lg overflow-hidden h-full max-h-[100px] flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        bar.isPeak
                          ? 'bg-rose-500'
                          : bar.prob > 30
                          ? 'bg-sky-400'
                          : 'bg-sky-300'
                      }`}
                      style={{ height: `${Math.max(bar.prob, 6)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${bar.isPeak ? 'text-rose-700' : 'text-slate-600'}`}>
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 mt-3">
              Peak convective precipitation window occurs Wednesday afternoon (65% chance).
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Radar Cell Mini Banner & Station Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 text-sky-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Radar Cell Approaching West Indore</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Doppler reflectivity highlights cell echo ~28 dBZ moving east-southeast at 18 km/h.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('weather-map')}
            className="px-3 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            Open Interactive Doppler Map →
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Station Telemetry
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Pressure Trend:</span>
              <strong className="text-slate-800">{MET_STATION_TELEMETRY.pressureTrend}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Solar Radiation:</span>
              <strong className="text-slate-800">{MET_STATION_TELEMETRY.solarRadiation}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Soil Moisture:</span>
              <strong className="text-slate-800">{MET_STATION_TELEMETRY.soilMoisture}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
