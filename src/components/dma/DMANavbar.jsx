// src/components/dma/DMANavbar.jsx
import React, { useState } from 'react';
import { useDisasterManagement } from '../../context/DisasterManagementContext.jsx';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import {
  Shield,
  Radio,
  Bell,
  HelpCircle,
  ChevronDown,
  User,
  LogOut,
  Settings,
  AlertTriangle,
  Flame,
  CheckCircle2,
  FileText,
  MapPin,
  ExternalLink,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { NOTIFICATION_ITEMS } from '../../data/disasterManagementData.js';

export default function DMANavbar() {
  const {
    dmaTab,
    setDmaTab,
    officerUser,
    setShowBroadcastModal,
    showToast
  } = useDisasterManagement();

  const { setPortalMode } = useMeteorologist();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'risk-map', label: 'Risk & Impact Map' },
    { id: 'alerts-actions', label: 'Alerts & Actions' },
    { id: 'incident-history', label: 'Incident History' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs font-sans">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          
          {/* Left: Brand / Logo + Civic Authority Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setDmaTab('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
                <Shield className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Mausam Suraksha
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 hidden sm:block">
                  WeatherAI Public Safety Decision Support
                </p>
              </div>
            </button>

            {/* Civic EOC Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold text-slate-700 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>CIVIC EOC — DISASTER MANAGEMENT AUTHORITY</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = dmaTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setDmaTab(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'text-sky-700 bg-sky-50 font-extrabold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Red Emergency Broadcast CTA Button */}
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
              title="Launch Cell Broadcast & Emergency Siren Console"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline tracking-wide uppercase">Emergency Broadcast</span>
              <span className="sm:hidden uppercase">Broadcast</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 sm:p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer relative"
                title="Operational Alerts & Dispatch Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black ring-2 ring-white animate-pulse">
                  12
                </span>
              </button>

              {/* Notification Dropdown Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        EOC Live Alerts (12 Active)
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-sky-600 hover:underline font-bold cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                    {NOTIFICATION_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border text-xs ${
                          item.severity === 'critical'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                            : 'bg-amber-50/70 border-amber-200 text-amber-950'
                        }`}
                      >
                        <div className="flex items-center justify-between font-extrabold mb-1">
                          <span className="truncate pr-2">{item.title}</span>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setDmaTab('alerts-actions');
                      setShowNotifications(false);
                    }}
                    className="w-full mt-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View All Alerts & Actions Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Help / SOP Documentation */}
            <button
              onClick={() => showToast('State EOC Standard Operating Procedure: SOP-IND-2025', 'info')}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer hidden md:flex"
              title="State EOC SOP Documentation & Protocol Guidelines"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Officer Profile Badge Pill */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-sky-400 shrink-0">
                  {officerUser.initials || 'RV'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight">
                    {officerUser.name}
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium truncate max-w-[150px]">
                    Disaster Management Authority | State EOC
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-76 bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 z-50 animate-fade-in text-slate-800">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                    <div className="text-xs font-black text-slate-900">{officerUser.name}</div>
                    <div className="text-[11px] text-sky-800 font-bold">{officerUser.designation}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{officerUser.email}</div>
                    <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{officerUser.badge}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-bold">
                    <button
                      onClick={() => {
                        setDmaTab('profile-settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Profile & Authority Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setPortalMode('meteorologist');
                        showToast('Switched to Meteorologist / Synoptic Forecaster Desk', 'info');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sky-800 hover:bg-sky-50 transition-colors text-left cursor-pointer"
                    >
                      <Activity className="w-4 h-4 text-sky-600" />
                      <span>Switch to Meteorologist Portal</span>
                    </button>

                    <button
                      onClick={() => {
                        setPortalMode('admin');
                        showToast('Switched to Tier-1 System Administrator Console', 'info');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-indigo-900 hover:bg-indigo-50 transition-colors text-left cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-indigo-600" />
                      <span>Switch to System Administrator</span>
                    </button>

                    <button
                      onClick={() => {
                        setPortalMode('citizen');
                        showToast('Switched to Public Citizen Portal', 'info');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                      <span>Public Citizen Portal</span>
                    </button>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          showToast('Signed out of State EOC terminal session.', 'info');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out of WeatherAI</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Sub-Navigation */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const isActive = dmaTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setDmaTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white font-black shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
