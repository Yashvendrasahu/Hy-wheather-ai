// src/components/common/Header.jsx
import React from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import { MapPin, Bell, CloudRain, User, Sparkles, AlertTriangle, ShieldCheck, X, Navigation, Shield } from 'lucide-react';
import { ALERTS_DATA } from '../../data/weatherData.js';

export default function Header() {
  const {
    activeTab,
    setActiveTab,
    currentLocation,
    dynamicAlerts,
    detectUserLocation,
    gpsState,
    isDynamicLoading,
    tempUnit,
    setTempUnit,
    showNotifications,
    setShowNotifications,
    setActiveModalAlert,
    setShowSafetyModal
  } = useWeather();

  const { setPortalMode, setMetTab } = useMeteorologist();

  const activeAlerts = (dynamicAlerts || []).filter(a => a.status === 'active');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'weather-map', label: 'Weather Map' },
    { id: 'alerts', label: 'Alerts', badge: activeAlerts.length > 0 ? activeAlerts.length : null },
    { id: 'search', label: 'Search' },
    { id: 'about', label: 'About' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <CloudRain className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Weather<span className="text-sky-600">AI</span>
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    {item.label}
                    {item.badge && !isActive && (
                      <span className={`px-1.5 py-0.2 rounded-full text-white text-[9px] font-black uppercase tracking-wider ${
                        item.badgeColor || 'bg-rose-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions Zone */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Current Location Pill & Quick change */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('search')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-medium text-slate-700 transition-colors border border-slate-200/60 cursor-pointer"
              title="Choose or change location"
            >
              <MapPin className={`w-3.5 h-3.5 ${isDynamicLoading ? 'text-amber-500 animate-spin' : 'text-sky-600'} shrink-0`} />
              <span className="truncate max-w-[140px] sm:max-w-[180px] font-semibold text-slate-800">
                {currentLocation.fullName || currentLocation.name}
              </span>
              <span className="text-sky-600 hover:underline text-[11px] font-medium ml-0.5">
                Change
              </span>
            </button>

            <button
              onClick={detectUserLocation}
              disabled={gpsState === 'detecting' || isDynamicLoading}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-slate-200/60 transition-colors cursor-pointer"
              title="Detect My Live GPS Location"
            >
              <Navigation className={`w-3.5 h-3.5 ${gpsState === 'detecting' ? 'animate-spin text-sky-600' : ''}`} />
            </button>
          </div>

          {/* Temperature Unit Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-full border border-slate-200 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setTempUnit('C')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                tempUnit === 'C'
                  ? 'bg-white text-sky-700 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setTempUnit('F')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                tempUnit === 'F'
                  ? 'bg-white text-sky-700 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              °F
            </button>
          </div>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              aria-label="View Weather Alerts & Notifications"
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/60 cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 divide-y divide-slate-100">
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Live Weather Alerts</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                      {activeAlerts.length} Active
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-2 space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
                  {activeAlerts.map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setActiveModalAlert(alert);
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100/70 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{alert.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {alert.headline}
                      </p>
                      <div className="mt-1 text-[11px] text-amber-700 font-medium">
                        {alert.timeWindow} • {alert.location}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('alerts');
                      setShowNotifications(false);
                    }}
                    className="font-semibold text-sky-600 hover:text-sky-700"
                  >
                    View All Alerts Center →
                  </button>
                  <button
                    onClick={() => {
                      setShowSafetyModal(true);
                      setShowNotifications(false);
                    }}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Safety Protocols
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Disaster Management Authority Switcher Button */}
          <button
            onClick={() => {
              setPortalMode('dma');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-900 hover:bg-rose-800 text-white text-xs font-black shadow-xs transition-all cursor-pointer border border-rose-700"
            title="Open Disaster Management Authority (State EOC)"
          >
            <Shield className="w-3.5 h-3.5 text-rose-300" />
            <span className="hidden sm:inline">Disaster EOC</span>
            <span className="sm:hidden font-mono">EOC</span>
          </button>

          {/* Meteorologist / Researcher Portal Switcher Button */}
          <button
            onClick={() => {
              setPortalMode('meteorologist');
              setMetTab('dashboard');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 text-xs font-black shadow-xs transition-all cursor-pointer border border-slate-700"
            title="Open Meteorologist / Researcher Portal"
          >
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Meteorologist</span>
            <span className="sm:hidden font-mono">MET</span>
          </button>

          {/* Admin Enclave Switcher Button */}
          <button
            onClick={() => {
              setPortalMode('admin');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950 hover:bg-indigo-900 text-indigo-200 hover:text-white text-xs font-black shadow-xs transition-all cursor-pointer border border-indigo-700"
            title="Open WeatherAI System Administrator Console"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Admin SEC-01</span>
            <span className="sm:hidden font-mono">ADMIN</span>
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => setActiveTab('search')}
            title="User Profile & Preferences"
            className="w-8.5 h-8.5 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer ring-2 ring-slate-200"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile navigation bottom row */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 border-t border-slate-100 bg-slate-50/80 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
