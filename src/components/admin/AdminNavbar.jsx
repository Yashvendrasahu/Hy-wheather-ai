// src/components/admin/AdminNavbar.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ShieldAlert,
  Layers,
  FileCheck2,
  TerminalSquare,
  SlidersHorizontal,
  Bell,
  Activity,
  UserCheck,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  Shield,
  Radio,
  Server,
  CloudRain,
  User,
  LogOut,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Zap
} from 'lucide-react';

export default function AdminNavbar() {
  const {
    adminProfile,
    adminTab,
    setAdminTab,
    registrationQueue,
    refreshDashboard,
    lastSyncTime,
    openDiagnostics,
    backendHealth,
    liveNode,
    clusterUptime,
    isProbing
  } = useAdmin();

  const { setPortalMode } = useMeteorologist();
  const { logout, profile } = useAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const pendingApprovalsCount = registrationQueue.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'data-models', label: 'Data & Models', icon: Layers },
    { id: 'approvals', label: 'Approvals', icon: FileCheck2, badge: pendingApprovalsCount },
    { id: 'logs', label: 'System Logs', icon: TerminalSquare },
    { id: 'config', label: 'Configuration', icon: SlidersHorizontal }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-800 text-slate-100 shadow-md">
      {/* Topmost Gov Flag & Micro Security Header */}
      <div className="bg-[#0B1120] text-slate-400 text-[11px] px-4 sm:px-6 py-1 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300">NATIONAL CLIMATE & DISASTER OPERATIONS • GOVNIC SECURE ENCLAVE</span>
          </div>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            Node: <span className="text-sky-400 font-mono font-semibold">{liveNode}</span>
          </span>
          <span className="hidden lg:inline text-slate-600">|</span>
          <span className="hidden lg:inline text-slate-400 font-mono">
            Uptime: <strong className="text-emerald-400 font-semibold">{clusterUptime}</strong>
          </span>
          <span className="hidden xl:inline text-slate-600">|</span>
          <span className="hidden xl:inline text-slate-400 font-mono">
            Sync Latency: <span className="text-sky-300 font-bold">{backendHealth?.latency || 14} ms</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-slate-400">
            Synced: <span className="text-slate-200 font-mono">{lastSyncTime}</span>
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 text-[10px] font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>CORE GRID {clusterUptime}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3.5">
            <div
              onClick={() => setAdminTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-900/30 border border-sky-400/30 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                    WeatherAI <span className="text-sky-400 text-xs sm:text-sm font-semibold">Mausam Suraksha</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-indigo-900/80 text-indigo-300 border border-indigo-700/60">
                    ADMIN
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium font-mono">
                  GovCloud Infrastructure Tier-1
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full animate-pulse font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Live Node Status Pill */}
            <button
              onClick={() => openDiagnostics()}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 text-xs transition-colors"
              title={`Live Node: ${liveNode} • Ping: ${backendHealth?.latency || 14}ms`}
            >
              <div className={`w-2 h-2 rounded-full ${isProbing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></div>
              <span className="font-mono text-[11px] text-slate-300">Live Node:</span>
              <span className="font-mono font-semibold text-emerald-400 text-[11px]">Zone Central-02</span>
            </button>

            {/* Manual Sync Telemetry */}
            <button
              onClick={refreshDashboard}
              className="p-2 rounded-md bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="Refresh System Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-md bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-slate-200">System Notifications</span>
                    <span className="text-[10px] text-sky-400 font-mono">3 Unread</span>
                  </div>
                  <div className="divide-y divide-slate-800 max-h-64 overflow-y-auto">
                    <div
                      onClick={() => {
                        setAdminTab('logs');
                        setNotifDropdownOpen(false);
                      }}
                      className="p-3 hover:bg-slate-800/60 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>AI Inference Batch Jitter</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Worker pool nowcast-worker-02a throttle (89% VRAM).
                      </p>
                      <span className="text-slate-500 text-[10px]">2m ago</span>
                    </div>
                    <div
                      onClick={() => {
                        setAdminTab('approvals');
                        setNotifDropdownOpen(false);
                      }}
                      className="p-3 hover:bg-slate-800/60 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 text-sky-400 font-medium">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>5 Pending Registrations</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        New gazetted verification requests awaiting Tier-1 crypto seal.
                      </p>
                      <span className="text-slate-500 text-[10px]">10m ago</span>
                    </div>
                  </div>
                  <div className="p-2 border-t border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setAdminTab('logs');
                        setNotifDropdownOpen(false);
                      }}
                      className="text-sky-400 hover:text-sky-300 text-[11px] font-medium"
                    >
                      View All System Events &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Portal Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-700/60 text-indigo-200 text-xs font-medium transition-colors"
                title="Switch Operating Portal"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-semibold text-white">Admin</span>
                <ChevronDown className="w-3 h-3 text-indigo-300" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Operational Role
                  </div>
                  <button
                    onClick={() => {
                      setPortalMode('admin');
                      setAdminTab('dashboard');
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 bg-slate-800/80 text-white flex items-center justify-between font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="font-bold">System Administrator</div>
                        <div className="text-[10px] text-slate-400">GovCloud & Data Ingestion Enclave</div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  </button>

                  <button
                    onClick={() => {
                      setPortalMode('dma');
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/60 text-slate-300 flex items-center gap-2 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <div>
                      <div className="font-bold text-slate-200">Disaster Management Auth (DMA)</div>
                      <div className="text-[10px] text-slate-400">EOC Command & Cell Broadcast</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setPortalMode('meteorologist');
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/60 text-slate-300 flex items-center gap-2 transition-colors"
                  >
                    <Radio className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-bold text-slate-200">Meteorologist Synoptic Desk</div>
                      <div className="text-[10px] text-slate-400">IMD/NCMRWF NWP Multi-Model Blend</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setPortalMode('citizen');
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/60 text-slate-300 flex items-center gap-2 transition-colors border-t border-slate-800"
                  >
                    <CloudRain className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold text-slate-200">Public Citizen Portal</div>
                      <div className="text-[10px] text-slate-400">Local Forecast & Weather Alerts</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Admin Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-sky-700 text-white flex items-center justify-center font-bold text-xs border border-sky-400/40 font-mono">
                  RV
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-100 leading-tight">
                    {adminProfile.name.split(',')[0]}
                  </span>
                  <span className="text-[10px] text-sky-400 font-mono leading-tight">
                    {adminProfile.roleShort}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3.5 py-2.5 border-b border-slate-800">
                    <div className="font-bold text-slate-100 text-sm">{adminProfile.name}</div>
                    <div className="text-sky-400 text-[11px] font-mono mt-0.5">{adminProfile.title}</div>
                    <div className="text-slate-400 text-[10px] mt-1">{adminProfile.organization}</div>
                  </div>

                  <div className="p-2 border-b border-slate-800 text-[11px] space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">GovNIC ID:</span>
                      <span className="font-mono font-medium text-slate-200">{adminProfile.authRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Clearance:</span>
                      <span className="text-emerald-400 font-mono font-medium">Tier-1 Hardware PKI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Node Cluster:</span>
                      <span className="font-mono font-medium text-slate-200">{adminProfile.node}</span>
                    </div>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        setAdminTab('config');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                      <span>Security & Enclave Config</span>
                    </button>
                    <button
                      onClick={() => {
                        setPortalMode('citizen');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-800 text-slate-300 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-400" />
                      <span>Exit to Public Portal</span>
                    </button>
                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false);
                        await logout();
                        setPortalMode('citizen');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-800 text-rose-300 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Sign Out (Supabase Auth)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="xl:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
