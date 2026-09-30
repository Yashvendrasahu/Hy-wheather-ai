// src/components/common/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import AppLogo from './AppLogo.jsx';
import {
  MapPin,
  Bell,
  CloudRain,
  User,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  X,
  Navigation,
  Shield,
  KeyRound,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Lock,
  Search
} from 'lucide-react';

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
    setShowSafetyModal,
    showToast
  } = useWeather();

  const { setPortalMode } = useMeteorologist();
  const { user, profile, role, logout, isOtpVerified } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const notificationsRef = useRef(null);
  const accountMenuRef = useRef(null);

  const activeAlerts = (dynamicAlerts || []).filter(a => a.status === 'active');

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowNotifications]);

  // Handle protected role portal switching from account menu
  const handleSwitchToPortal = (targetRole, portalName) => {
    setShowAccountMenu(false);
    if (!user) {
      showToast(`Please sign in to access the ${portalName} portal.`, 'info');
      setPortalMode('login');
      return;
    }

    if (role === 'administrator') {
      if (!isOtpVerified) {
        setPortalMode('otp');
      } else {
        setPortalMode(targetRole);
      }
      return;
    }

    if (role !== targetRole) {
      showToast(`Access Restricted: Account role '${role}' does not have clearance for ${portalName}.`, 'warning');
      return;
    }

    if (!isOtpVerified) {
      setPortalMode('otp');
    } else {
      setPortalMode(targetRole);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'weather-map', label: 'Weather Map' },
    { id: 'alerts', label: 'Alerts', badge: activeAlerts.length > 0 ? activeAlerts.length : null },
    { id: 'search', label: 'Search' },
    { id: 'about', label: 'About' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-4 lg:gap-8 min-w-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-2.5 group text-left cursor-pointer focus-visible:outline-none shrink-0"
            title="WEATHER FUSE - Home"
          >
            <AppLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3.5 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-full transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    {item.label}
                    {item.badge && !isActive && (
                      <span className="px-1.5 py-0.2 rounded-full text-white text-[9px] font-black uppercase tracking-wider bg-rose-500">
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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Current Location Pill & Quick change (Tablet / Desktop) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('search')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-medium text-slate-700 transition-colors border border-slate-200/70 cursor-pointer"
              title="Change selected location"
            >
              <MapPin className={`w-3.5 h-3.5 ${isDynamicLoading ? 'text-amber-500 animate-spin' : 'text-sky-600'} shrink-0`} />
              <span className="truncate max-w-[110px] md:max-w-[160px] font-semibold text-slate-800">
                {currentLocation.fullName || currentLocation.name}
              </span>
              <span className="text-sky-600 hover:underline text-[11px] font-medium ml-0.5">
                Change
              </span>
            </button>

            <button
              onClick={() => detectUserLocation(true)}
              disabled={gpsState === 'detecting' || isDynamicLoading}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-slate-200/70 transition-colors cursor-pointer shrink-0"
              title="Detect Live GPS Location"
            >
              <Navigation className={`w-3.5 h-3.5 ${gpsState === 'detecting' ? 'animate-spin text-sky-600' : ''}`} />
            </button>
          </div>

          {/* Compact Location Pill & Detect for Mobile Screens (< 640px) */}
          <div className="sm:hidden flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('search')}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-medium text-slate-700 border border-slate-200/70 cursor-pointer shrink-0 max-w-[100px]"
              title="Change Location"
            >
              <MapPin className={`w-3 h-3 ${isDynamicLoading ? 'text-amber-500 animate-spin' : 'text-sky-600'} shrink-0`} />
              <span className="truncate font-semibold">{currentLocation.name}</span>
            </button>

            <button
              onClick={() => detectUserLocation(true)}
              disabled={gpsState === 'detecting' || isDynamicLoading}
              className="p-1 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-600 border border-slate-200/70 transition-colors cursor-pointer shrink-0"
              title="Detect Live GPS & OpenStreetMap Location"
            >
              <Navigation className={`w-3 h-3 ${gpsState === 'detecting' ? 'animate-spin text-sky-600' : ''}`} />
            </button>
          </div>

          {/* Temperature Unit Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 shrink-0">
            <button
              onClick={() => setTempUnit('C')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                tempUnit === 'C'
                  ? 'bg-white text-sky-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900 text-slate-500'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setTempUnit('F')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                tempUnit === 'F'
                  ? 'bg-white text-sky-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900 text-slate-500'
              }`}
            >
              °F
            </button>
          </div>

          {/* Notifications Bell Dropdown */}
          <div className="relative shrink-0" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              aria-label="View Weather Alerts & Notifications"
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/70 cursor-pointer"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 divide-y divide-slate-100 animate-fade-in text-left">
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Live Weather Alerts</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                      {activeAlerts.length} Active
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-2 space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
                  {activeAlerts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No active severe weather warnings in your region.
                    </div>
                  ) : (
                    activeAlerts.map(alert => (
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
                    ))
                  )}
                </div>

                <div className="pt-3 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('alerts');
                      setShowNotifications(false);
                    }}
                    className="font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
                  >
                    View All Alerts Center →
                  </button>
                  <button
                    onClick={() => {
                      setShowSafetyModal(true);
                      setShowNotifications(false);
                    }}
                    className="text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Safety Protocols
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login & Signup Dynamic Buttons */}
          {!user ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setPortalMode('login')}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer border border-slate-700 shrink-0"
                title="Sign In"
              >
                <KeyRound className="w-3.5 h-3.5 text-sky-400" />
                <span>Login</span>
              </button>

              <button
                onClick={() => setPortalMode('signup')}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-all border border-sky-200 cursor-pointer shrink-0"
                title="Create Citizen Account"
              >
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            <div className="relative shrink-0" ref={accountMenuRef}>
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all border border-slate-200 cursor-pointer"
                title="Account & Profile Menu"
              >
                <div className="relative shrink-0">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] font-mono">
                    {profile?.full_name
                      ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                      : 'US'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="font-bold text-slate-900 truncate max-w-[100px] md:max-w-[120px]">
                    {profile?.full_name || user?.email}
                  </span>
                  <span className="text-[10px] text-sky-700 font-mono capitalize">
                    {role === 'disaster_manager' ? 'Disaster EOC' : role}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {/* Account Dropdown Menu */}
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-3 divide-y divide-slate-100 animate-fade-in text-left">
                  <div className="pb-2.5">
                    <div className="font-bold text-slate-900 text-sm truncate">{profile?.full_name || 'Authenticated User'}</div>
                    <div className="text-slate-500 text-xs font-mono truncate">{profile?.email || user?.email}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
                        {profile?.user_id || 'USER-01'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 capitalize">
                        {role === 'disaster_manager' ? 'Disaster EOC' : role}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 space-y-1 text-xs font-medium">
                    {/* Authorized Operational Portal Links for Staff/Officers */}
                    {role === 'meteorologist' && (
                      <button
                        onClick={() => handleSwitchToPortal('meteorologist', 'Meteorologist')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>Meteorologist Desk</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Portal</span>
                      </button>
                    )}

                    {role === 'disaster_manager' && (
                      <button
                        onClick={() => handleSwitchToPortal('dma', 'Disaster EOC')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>Disaster EOC Console</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Portal</span>
                      </button>
                    )}

                    {role === 'administrator' && (
                      <div className="space-y-1">
                        <button
                          onClick={() => handleSwitchToPortal('admin', 'Admin Console')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>Admin SEC-01 Enclave</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">Admin</span>
                        </button>
                        <button
                          onClick={() => handleSwitchToPortal('meteorologist', 'Meteorologist')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>Meteorologist Desk</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleSwitchToPortal('dma', 'Disaster EOC')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Disaster EOC Console</span>
                          </div>
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab('search');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Location & Preferences</span>
                      </div>
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={async () => {
                        setShowAccountMenu(false);
                        await logout();
                        showToast('Successfully signed out.', 'info');
                        setPortalMode('citizen');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-700 font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Row (Horizontal Swipe & Clean Layout on Phones) */}
      <div className="md:hidden flex items-center justify-start sm:justify-around px-2 py-1.5 border-t border-slate-100 bg-slate-50/90 backdrop-blur-md overflow-x-auto scrollbar-none gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all shrink-0 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {item.label}
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    isActive ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
