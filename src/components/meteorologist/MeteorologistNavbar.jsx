// src/components/meteorologist/MeteorologistNavbar.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import AppLogo from '../common/AppLogo.jsx';
import {
  Shield,
  Radio,
  ExternalLink,
  Bell,
  HelpCircle,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function MeteorologistNavbar() {
  const {
    metTab,
    setMetTab,
    setPortalMode,
    scientistUser,
    handleLogout,
    showToast
  } = useMeteorologist();

  const { logout, profile } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'forecast-analysis', label: 'Forecast Analysis' },
    { id: 'weather-events', label: 'Weather Events', hasLiveDot: true },
    { id: 'analytics', label: 'Analytics' },
    { id: 'profile-settings', label: 'Profile & Settings' }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Bust / Rapid Divergence Alert Flagged',
      time: '06:14 UTC',
      desc: 'Mahabaleshwar Western Ghats: Significant ensemble spread > 3.8σ detected in orographic rainfall.',
      severity: 'high'
    },
    {
      id: 2,
      title: 'New Convective Squall Line Initiated',
      time: '06:00 UTC',
      desc: 'Indore – Ujjain Corridor: High dBZ reflectivity (52 dBZ core) detected approaching SW perimeter.',
      severity: 'medium'
    },
    {
      id: 3,
      title: 'NCMRWF Assimilation Cycle Complete',
      time: '05:45 UTC',
      desc: 'Global 0.25° GFS & 12 km Regional NCUM run synchronized with zero ingestion lag.',
      severity: 'low'
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMetTab('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <AppLogo size="md" showText={false} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    WEATHER FUSE
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-mono">
                    SYNOPTIC DESK
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 hidden md:block">
                  WEATHER FUSE Researcher & Forecaster Network
                </p>
              </div>
            </button>

            {/* Synoptic Active Feed Status Tag */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="uppercase tracking-wider">IMD / NCMRWF SYNOPTIC FEEDS: ACTIVE</span>
            </div>
          </div>

          {/* Center: Navigation Desk Tabs */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = metTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setMetTab(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-sky-700 bg-sky-50/90 font-extrabold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasLiveDot && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions & Forecaster Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Switch to Disaster Management Authority Portal Button */}
            <button
              onClick={() => {
                setPortalMode('dma');
                showToast('Switched to Disaster Management Authority (State EOC)', 'info');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 text-xs font-black transition-all cursor-pointer shadow-2xs border border-slate-700"
              title="Open Disaster Management Authority (State EOC)"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Disaster Authority EOC</span>
              <span className="sm:hidden font-mono">EOC</span>
            </button>

            {/* Switch to Public Citizen Portal Button */}
            <button
              onClick={() => {
                setPortalMode('citizen');
                showToast('Switched to Public Citizen Portal', 'info');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-sky-800 text-xs font-extrabold border border-slate-200 hover:border-sky-300 transition-all cursor-pointer shadow-2xs"
              title="Open Public Citizen Portal"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Citizen Portal</span>
              <span className="sm:hidden">Citizen</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer relative"
                title="Operational Warnings & Alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-white" />
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Synoptic Alerts & Bulletins (3)
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-sky-600 hover:underline font-bold"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs ${
                          n.severity === 'high'
                            ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                            : n.severity === 'medium'
                            ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="truncate pr-2">{n.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setMetTab('weather-events');
                      setShowNotifications(false);
                    }}
                    className="w-full mt-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Weather Events Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Help / Liaison icon */}
            <button
              onClick={() => showToast('Scientific Liaison Desk: +91 11 2461 8241', 'info')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer hidden md:flex"
              title="Scientific Documentation & Liaison Desk"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Forecaster User Avatar & Pill */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-extrabold text-sky-400 shrink-0">
                  {scientistUser.initials || 'AS'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight">
                    {scientistUser.shortName || scientistUser.name}
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium truncate max-w-[130px]">
                    Senior Forecaster · Synoptic Ops
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-fade-in text-slate-800">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                    <div className="text-xs font-black text-slate-900">{scientistUser.name}</div>
                    <div className="text-[11px] text-sky-700 font-semibold">{scientistUser.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">{scientistUser.email}</div>
                    <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{scientistUser.level}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setMetTab('profile-settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Profile & Forecast Preferences</span>
                    </button>
                    <button
                      onClick={() => {
                        setMetTab('analytics');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                    >
                      <Activity className="w-4 h-4 text-slate-500" />
                      <span>Model Verification Scorecards</span>
                    </button>
                    <button
                      onClick={() => {
                        setPortalMode('admin');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-indigo-800 hover:bg-indigo-50 transition-colors text-left cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-indigo-600" />
                      <span>Switch to System Administrator</span>
                    </button>
                    <button
                      onClick={() => {
                        setPortalMode('dma');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-800 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-rose-600" />
                      <span>Switch to Disaster EOC (DMA)</span>
                    </button>
                    <button
                      onClick={() => {
                        setPortalMode('citizen');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors text-left cursor-pointer"
                    >
                      <CloudRain className="w-4 h-4 text-emerald-600" />
                      <span>Switch to Public Citizen Portal</span>
                    </button>
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={async () => {
                          setShowProfileMenu(false);
                          handleLogout();
                          await logout();
                          setPortalMode('citizen');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out of Scientific Portal</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const isActive = metTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMetTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-700 text-white font-black shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {item.hasLiveDot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
