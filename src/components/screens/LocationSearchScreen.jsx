// src/components/screens/LocationSearchScreen.jsx
import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import {
  LOCATIONS,
  RECENT_INQUIRIES
} from '../../data/weatherData.js';
import { searchCitiesOnline } from '../../services/liveWeatherService.js';
import {
  MapPin,
  Search,
  Navigation,
  CheckCircle2,
  Trash2,
  Star,
  Plus,
  Compass,
  Radio,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sun,
  CloudRain,
  Wind,
  Plane,
  Building,
  Building2,
  Factory,
  Clock,
  X,
  Loader2,
  Globe
} from 'lucide-react';

export default function LocationSearchScreen() {
  const {
    currentLocation,
    switchLocation,
    loadLocationByCoords,
    detectUserLocation,
    isDynamicLoading,
    formatTemp,
    gpsState,
    setGpsState,
    pinnedLocations,
    removePinnedLocation,
    setShowAddCityModal,
    setActiveTab,
    showToast
  } = useWeather();

  const [searchQuery, setSearchQuery] = useState('');
  const [onlineResults, setOnlineResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentList, setRecentList] = useState(RECENT_INQUIRIES);

  // Online Geocoding dynamic search with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setOnlineResults([]);
      setIsSearching(false);
      return;
    }

    let isCancelled = false;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCitiesOnline(searchQuery);
        if (!isCancelled) {
          setOnlineResults(results);
          setIsSearching(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const filteredPresetLocations = LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc) => {
    loadLocationByCoords(loc.latNum, loc.lngNum, {
      name: loc.name,
      region: loc.region,
      country: loc.country,
      fullName: loc.fullName
    });
    setActiveTab('home');
  };

  const handleUseCurrentLocation = () => {
    detectUserLocation();
    setActiveTab('home');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              Geolocation & Regional Selection
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Choose a Location
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Use your device's automated micro-climate GPS or search for any city, town, or transit hub worldwide to view real-time numerical weather predictions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            GPS Sync Active • ~150m
          </span>
          <span className="hidden md:inline">Sensor telemetry synced 2m ago</span>
        </div>
      </div>

      {/* Two-Column Top Grid: Direct Telemetry GPS vs Global Database Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Telemetry (Your Current Location) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Direct Telemetry
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
                GPS Active
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">
              Your Current Location
            </h2>

            {/* GPS Telemetry Box */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-sky-600" />
                  <span className="text-base font-bold text-slate-900">
                    {currentLocation.fullName}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-xs font-semibold">
                  {currentLocation.country}
                </span>
              </div>

              <div className="text-xs text-slate-500 font-mono flex flex-wrap gap-x-3 gap-y-1">
                <span>Lat: {currentLocation.coordinates.lat}</span>
                <span>Long: {currentLocation.coordinates.long}</span>
                <span>Elev: {currentLocation.coordinates.elev}</span>
              </div>

              {/* Weather Snapshot */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div className="text-base font-extrabold text-slate-900 font-mono">
                    {formatTemp(currentLocation.tempC)} • {currentLocation.condition}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Dew Point: {formatTemp(currentLocation.dewPointC)} • Humidity: {currentLocation.humidity}%
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sky-700 font-bold block">{currentLocation.precipitation}% Rain</span>
                  <span className="text-[10px] text-slate-400">Next 3 hrs</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleUseCurrentLocation}
              className="w-full mt-4 py-3 px-4 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Use My Current Location</span>
            </button>
          </div>

          {/* Simulate GPS States Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                Simulate GPS States
              </span>
              <span className="text-sky-600 text-[11px] font-medium">Interactive Preview</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { id: 'active', label: 'Active', color: 'bg-emerald-500 text-white' },
                { id: 'locking', label: 'Locking', color: 'bg-amber-500 text-white' },
                { id: 'prompt', label: 'Prompt', color: 'bg-sky-500 text-white' },
                { id: 'error', label: 'Error', color: 'bg-rose-500 text-white' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setGpsState(st.id);
                    showToast(`Simulated GPS state set to: ${st.label}`);
                  }}
                  className={`py-1.5 rounded-xl font-semibold transition-all cursor-pointer text-center ${
                    gpsState === st.id
                      ? st.color + ' shadow-xs ring-2 ring-slate-900/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Global Database Search */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Global Database Search
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">
              Search for a Location
            </h2>

            {/* Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, district, transit corridor..."
                className="w-full pl-10 pr-16 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                ⌘K
              </span>
            </div>

            {/* Results List */}
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
              {isSearching && (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                  <span className="text-xs font-medium">Searching global meteorological stations...</span>
                </div>
              )}

              {/* Online Results if query active */}
              {!isSearching && onlineResults.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider px-1">
                    Live Geocoding Results ({onlineResults.length})
                  </div>
                  {onlineResults.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc)}
                      className="p-3 rounded-2xl border border-sky-200 bg-sky-50/40 hover:bg-sky-100/60 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{loc.name}, {loc.region}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            {loc.country} • {loc.latNum.toFixed(3)}°N, {loc.lngNum.toFixed(3)}°E • Elev: {loc.elev}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLocation(loc);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Presets if no online results */}
              {!isSearching && onlineResults.length === 0 && (
                <div className="space-y-2">
                  {searchQuery && (
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      Preset Indian Hubs
                    </div>
                  )}
                  {filteredPresetLocations.map((loc) => {
                    const isActive = currentLocation.id === loc.id;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => {
                          loadLocationByCoords(loc.latNum, loc.lngNum, {
                            name: loc.name,
                            region: loc.region,
                            country: loc.country,
                            fullName: loc.fullName
                          });
                          setActiveTab('home');
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'bg-sky-50/90 border-sky-300 ring-2 ring-sky-400/30'
                            : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-sky-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{loc.name}, {loc.region}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? 'bg-sky-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {loc.category}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">
                              {loc.fullName} • {loc.latNum}°N, {loc.lngNum}°E
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-extrabold text-slate-900 font-mono">
                              {formatTemp(loc.tempC)}
                            </div>
                            <div className="text-[11px] text-slate-400">{loc.condition}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Keyboard Footer helper */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>⌨️ Use ↑ ↓ to navigate, ↵ to choose, Esc to exit</span>
            <button
              onClick={() => {
                setSearchQuery('');
                showToast('Cleared search field');
              }}
              className="text-slate-500 hover:text-slate-800 font-sans hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        </div>
      </div>

      {/* Pinned Locations Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Pinned Locations</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                {pinnedLocations.length} Saved
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Quick access to key territories, family destinations, and transit routes.
            </p>
          </div>

          <button
            onClick={() => setShowAddCityModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Location</span>
          </button>
        </div>

        {/* 4 Cards Grid (3 Saved + 1 Add Card) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pinnedLocations.map((loc) => (
            <div
              key={loc.id}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100/70 text-sky-800 text-[10px] font-bold">
                    {loc.tag}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => showToast(`Starred ${loc.name}`)}
                      className="p-1 hover:text-amber-500 transition-colors cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    {!loc.isDefault && (
                      <button
                        onClick={() => removePinnedLocation(loc.id)}
                        className="p-1 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-extrabold text-slate-900">{loc.name}</h3>
                  <p className="text-xs text-slate-500">{loc.region}</p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900 font-mono">
                      {formatTemp(loc.tempC)}
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-0.5">
                      {loc.condition}
                    </div>
                  </div>
                  <Sun className="w-7 h-7 text-amber-500" />
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-slate-200 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-white">
                    <span className="text-slate-400 text-[10px] block">H / L</span>
                    <strong className="text-slate-800 font-mono text-[11px]">
                      {formatTemp(loc.highC)}/{formatTemp(loc.lowC)}
                    </strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white">
                    <span className="text-slate-400 text-[10px] block">Rain</span>
                    <strong className="text-sky-700 font-mono text-[11px]">
                      {loc.rainProb}%
                    </strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white">
                    <span className="text-slate-400 text-[10px] block">Wind</span>
                    <strong className="text-slate-800 font-mono text-[11px]">
                      {loc.wind}
                    </strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  switchLocation(loc.id);
                  setActiveTab('forecast');
                }}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Forecast</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          ))}

          {/* "+ Pin Another City" Dashed Card */}
          <button
            onClick={() => setShowAddCityModal(true)}
            className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-50/50 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-sky-100 text-slate-600 group-hover:text-sky-600 flex items-center justify-center transition-colors mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700">
              Pin Another City
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Save international or domestic travel points for instant telemetry access
            </p>
          </button>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900">Recent Inquiries</h3>
          </div>
          <button
            onClick={() => {
              setRecentList([]);
              showToast('Cleared search history');
            }}
            className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Clear History
          </button>
        </div>

        {recentList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  switchLocation(item.id);
                  setActiveTab('home');
                }}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-sky-600 shadow-2xs">
                    {item.icon === 'sun' ? <Sun className="w-4 h-4 text-amber-500" /> : <CloudRain className="w-4 h-4 text-sky-500" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.city}</div>
                    <div className="text-[11px] text-slate-400">{item.subtext}</div>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-slate-900 text-sm">
                  {formatTemp(item.tempC)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 py-3 text-center">
            No recent location searches recorded.
          </div>
        )}
      </div>

      {/* Geolocation Assurance Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Why We Request Geolocation Data</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              WeatherAI uses device GPS telemetry strictly to compile ultra-fine 1km² micro-grid atmospheric forecasts using coupled NWP simulation models. Your coordinates are processed entirely in real-time ephemerally, never logged or transferred to marketing aggregators.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('Opening WeatherAI Privacy and Microclimate Sensor Charter')}
          className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 self-end md:self-center"
        >
          <span>Location & Sensor Policy</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
