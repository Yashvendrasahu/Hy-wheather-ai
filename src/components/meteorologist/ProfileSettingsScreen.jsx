// src/components/meteorologist/ProfileSettingsScreen.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import {
  SCIENTIST_PROFILE,
  AUTHORIZED_TERMINAL_SESSIONS,
  PRIORITY_LOCATIONS_TABLE
} from '../../data/meteorologistData.js';
import {
  User,
  Shield,
  Key,
  Bell,
  Sliders,
  Database,
  Radio,
  MapPin,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Save,
  RotateCcw,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Lock,
  Compass,
  Cpu,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
  HelpCircle,
  FileCode,
  SlidersHorizontal,
  Mail,
  Building,
  BadgeAlert
} from 'lucide-react';

export default function ProfileSettingsScreen() {
  const {
    scientistUser,
    setScientistUser,
    setShowAddRegionModal,
    showToast
  } = useMeteorologist();

  // Active section tab in Settings: 'identity' | 'model-prefs' | 'notifications' | 'sessions' | 'stations' | 'api-access'
  const [activeSection, setActiveSection] = useState('identity');

  // Form states for Identity & Credentials
  const [profileForm, setProfileForm] = useState({
    name: scientistUser.name || 'Dr. Arvind Sharma',
    title: scientistUser.title || 'Senior Meteorologist & Synoptic Lead Forecaster',
    email: scientistUser.email || 'a.sharma.synoptic@imd.gov.in',
    department: 'India Meteorological Department (IMD) / Ministry of Earth Sciences (MoES)',
    stationId: 'IMD-AWS-42680-DEL',
    badgeId: 'SCI-8841',
    phone: '+91 98110 44291',
    emergencyContact: 'HQ Weather Operations Center (011-24618241)',
    securityClearance: 'Level 4 — Operational Synoptic Override'
  });

  // Model & Ingestion Preferences
  const [modelPrefs, setModelPrefs] = useState({
    primaryModel: 'ncum', // 'ncum' | 'ai-neural' | 'gfs' | 'eps'
    blendStrategy: 'skill-weighted', // 'skill-weighted' | 'equal' | 'ai-biased'
    autoAssimilationSync: true,
    autoTriggerBulletins: true,
    radarColorPalette: 'imd-16', // 'imd-16' | 'nexrad' | 'spectral'
    mapTileStyle: 'osm-standard', // 'osm-standard' | 'esri-street' | 'dark-radar' | 'satellite'
    precipThresholdMm: 50,
    windGustThresholdKmh: 60,
    capeThresholdJkg: 2000,
    unitsSystem: 'metric' // 'metric' | 'hybrid'
  });

  // Notifications & Operational Alerts Matrix
  const [notifMatrix, setNotifMatrix] = useState({
    divergenceAlerts: true,
    severeSquallTriggers: true,
    soundingInversionCAPE: true,
    ndrfDisasterSync: true,
    ncmrwfCycleCompletion: true,
    smsDispatches: false,
    emailDailyDigest: true,
    criticalSoundBuzzer: true
  });

  // API Key & Script Automation State
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKey, setApiKey] = useState('ms_live_synoptic_a79f982b184c7e60938f_prod');
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);

  // Terminal Sessions list
  const [sessions, setSessions] = useState(AUTHORIZED_TERMINAL_SESSIONS);

  // Pinned Monitoring Stations
  const [pinnedStations, setPinnedStations] = useState(PRIORITY_LOCATIONS_TABLE);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setScientistUser(prev => ({
      ...prev,
      name: profileForm.name,
      title: profileForm.title,
      email: profileForm.email
    }));
    showToast('Meteorologist profile details updated successfully.', 'success');
  };

  const handleModelPrefsSave = () => {
    showToast('Numerical model baseline & assimilation preferences saved.', 'success');
  };

  const handleNotifSave = () => {
    showToast('Operational alert matrix & emergency sync preferences updated.', 'success');
  };

  const handleRegenerateApiKey = () => {
    setIsRegeneratingKey(true);
    setTimeout(() => {
      const newKey = `ms_live_synoptic_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 10)}_prod`;
      setApiKey(newKey);
      setIsRegeneratingKey(false);
      showToast('New Scientific API Token generated and activated.', 'success');
    }, 600);
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(apiKey);
    showToast('API Key copied to clipboard.', 'info');
  };

  const handleRevokeSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('Terminal session revoked successfully.', 'info');
  };

  const handleRemoveStation = (stationId) => {
    setPinnedStations(prev => prev.filter(s => s.id !== stationId));
    showToast('Station removed from priority monitoring queue.', 'info');
  };

  const settingsNav = [
    { id: 'identity', label: 'Scientist Identity & Badges', icon: User },
    { id: 'model-prefs', label: 'NWP & Assimilation Rules', icon: SlidersHorizontal },
    { id: 'notifications', label: 'Emergency Alert Matrix', icon: Bell },
    { id: 'stations', label: 'Priority AWS Observatories', icon: MapPin },
    { id: 'api-access', label: 'Python / NetCDF API Pipeline', icon: FileCode },
    { id: 'sessions', label: 'Security & Terminal Nodes', icon: Shield }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Main Forecaster Hero Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Identity Left */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-900 via-sky-950 to-slate-900 border-2 border-sky-400/40 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-md shadow-sky-950/20 shrink-0">
                {scientistUser.initials || 'AS'}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white" title="Verified Forecaster Online">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {profileForm.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-xs font-black font-mono">
                  {SCIENTIST_PROFILE.badgeId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Level 4 Override</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-sky-800">
                {profileForm.title}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {profileForm.department}
              </p>
            </div>
          </div>

          {/* Quick Terminal Meta Right */}
          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                HPC Cluster Node
              </div>
              <div className="font-mono font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>IN-DEL-HPC-NCMRWF-N04</span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Security Protocol
              </div>
              <div className="font-mono font-bold text-slate-800 mt-0.5">
                TLS 1.3 · GovNet FIPS-140-3
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Active Desk Session
              </div>
              <div className="font-semibold text-slate-700 mt-0.5">
                DEL-01 (06:42 IST)
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Settings Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side Navigation Tabs */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-2">
          <div className="bg-white rounded-3xl p-3 border border-slate-200/90 shadow-2xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              PORTAL CONFIGURATION
            </div>
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-sky-900 to-slate-900 rounded-3xl p-5 text-white shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-sky-200">
                Liaison & Protocol Desk
              </h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Need immediate authorization elevation or synchronization with Regional Meteorological Centers (RMC Mumbai / Chennai / Kolkata)?
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="font-mono text-sky-300">HQ Desk: +91 11 2461 8241</span>
              <button
                onClick={() => showToast('Direct Hotline triggered to MoES Weather Ops', 'info')}
                className="text-white hover:text-sky-200 font-bold hover:underline cursor-pointer"
              >
                Hotline →
              </button>
            </div>
          </div>
        </div>

        {/* Right Dynamic Section Content */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          {/* SECTION 1: Identity & Credentials */}
          {activeSection === 'identity' && (
            <form onSubmit={handleProfileSave} className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Scientist Identity & Official Credentials
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Official registry parameters on the MoES / IMD High-Performance Synoptic Network.
                  </p>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-600 mb-1.5">Official Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5">Official Email (GovNet)</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5">Synoptic Role & Designation</label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5">Department / Division</label>
                  <input
                    type="text"
                    value={profileForm.department}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5">Assigned AWS Ground Station Code</label>
                  <input
                    type="text"
                    value={profileForm.stationId}
                    onChange={(e) => setProfileForm({ ...profileForm, stationId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold text-sky-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5">Forecaster Badge ID</label>
                  <input
                    type="text"
                    value={profileForm.badgeId}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5">Operational Emergency Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5">Security Clearance Protocol</label>
                  <input
                    type="text"
                    value={profileForm.securityClearance}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-emerald-800 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Verified Status Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-extrabold text-emerald-950">
                    Aadhaar / GovNet NIC Identity Cryptographically Signed
                  </div>
                  <p className="text-emerald-800 mt-0.5 leading-relaxed">
                    This account holds active Level 4 operational authorization to issue Red / Orange Level Convective Bulletins directly to State Disaster Management Authorities (SDMA).
                  </p>
                </div>
              </div>
            </form>
          )}

          {/* SECTION 2: NWP & Assimilation Rules */}
          {activeSection === 'model-prefs' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Numerical Weather Prediction & Assimilation Configuration
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure operational default physics engines, blend strategies, and threshold triggers.
                  </p>
                </div>
                <button
                  onClick={handleModelPrefsSave}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save NWP Settings</span>
                </button>
              </div>

              {/* Primary Model Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Operational Baseline Physics Engine
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
                  {[
                    { id: 'ncum', name: 'NCUM 12km Regional', org: 'IMD / MoES India', res: '12 km · 00/12 UTC', desc: 'Optimal for Indian monsoon dynamics' },
                    { id: 'ai-neural', name: 'AI Neural NWP', org: 'WeatherAI High-Res', res: '0.1° · Hourly Cycle', desc: 'Fast convective initiation & squall tracking' },
                    { id: 'gfs', name: 'GFS 0.25° Global', org: 'NOAA NCEP', res: '0.25° · 00/06/12/18 UTC', desc: 'Broad synoptic planetary wave tracking' },
                    { id: 'eps', name: 'Regional EPS Ensemble', org: '21-Member Dispersion', res: '4 km · Probabilistic', desc: 'Uncertainty band & bust boundary spread' }
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setModelPrefs({ ...modelPrefs, primaryModel: m.id })}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        modelPrefs.primaryModel === m.id
                          ? 'bg-sky-50/70 border-sky-600 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-slate-900">{m.name}</span>
                        {modelPrefs.primaryModel === m.id && (
                          <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        )}
                      </div>
                      <div className="text-[10px] text-sky-800 font-bold">{m.org}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">{m.res}</div>
                      <p className="text-[11px] text-slate-600 mt-2 leading-tight">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threshold Triggers Grid */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Automated Convective Surveillance Threshold Triggers
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <label className="block text-slate-700">Extreme Rainfall Threshold</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={modelPrefs.precipThresholdMm}
                        onChange={(e) => setModelPrefs({ ...modelPrefs, precipThresholdMm: Number(e.target.value) })}
                        className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-xl text-center font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <span className="text-slate-500 font-bold">mm / hour</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">Triggers automated Red Warning Bulletin draft.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <label className="block text-slate-700">Microburst Gust Threshold</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={modelPrefs.windGustThresholdKmh}
                        onChange={(e) => setModelPrefs({ ...modelPrefs, windGustThresholdKmh: Number(e.target.value) })}
                        className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-xl text-center font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <span className="text-slate-500 font-bold">km / h</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">Triggers airport & aviation squall advisory.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <label className="block text-slate-700">Atmospheric CAPE Instability</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={modelPrefs.capeThresholdJkg}
                        onChange={(e) => setModelPrefs({ ...modelPrefs, capeThresholdJkg: Number(e.target.value) })}
                        className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-xl text-center font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <span className="text-slate-500 font-bold">J / kg</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">Triggers sounding deep-dive prompt.</p>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Real-time Assimilation Sync (00, 06, 12, 18 UTC)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Automatically ingest fresh Doppler radar volumes and satellite radiance every 6 hours.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={modelPrefs.autoAssimilationSync}
                    onChange={(e) => setModelPrefs({ ...modelPrefs, autoAssimilationSync: e.target.checked })}
                    className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Auto-generate State Disaster Management Bulletins (NDRF format)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Pre-compile structured meteorological bulletins when 3/5 ensemble members exceed Warning criteria.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={modelPrefs.autoTriggerBulletins}
                    onChange={(e) => setModelPrefs({ ...modelPrefs, autoTriggerBulletins: e.target.checked })}
                    className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Emergency Alert Matrix */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Emergency Alert & Multi-Channel Dispatch Matrix
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure real-time workstation alerts, SMS gateways, and disaster coordination dispatches.
                  </p>
                </div>
                <button
                  onClick={handleNotifSave}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Matrix</span>
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'divergenceAlerts', title: 'Rapid Forecast Bust & Ensemble Divergence (> 3.5σ)', desc: 'Immediate banner when GFS and NCUM diverge significantly in convective sectors.' },
                  { key: 'severeSquallTriggers', title: 'Severe Convective Cell Initiation (Doppler > 45 dBZ)', desc: 'Radar echo top breach notification with automated gust velocity vectoring.' },
                  { key: 'soundingInversionCAPE', title: 'Atmospheric Inversion Layer & High CAPE (> 2200 J/kg)', desc: 'Skew-T sounding instability spike alerts for monitored subdivisions.' },
                  { key: 'ndrfDisasterSync', title: 'NDRF / SDMA Emergency Hotline Direct Dispatch Sync', desc: 'Instant cryptographic transmission of approved warnings to State Control Rooms.' },
                  { key: 'ncmrwfCycleCompletion', title: 'NCMRWF Global / Regional Run Convergence Completion', desc: 'Receive ingestion ping when high-resolution assimilation finishes.' },
                  { key: 'criticalSoundBuzzer', title: 'Workstation High-Priority Audio Alarm for Red Warnings', desc: 'Audible tone on terminal during active convective emergency triggers.' }
                ].map(item => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/50 transition-colors"
                  >
                    <div className="pr-4">
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={notifMatrix[item.key]}
                        onChange={(e) => setNotifMatrix({ ...notifMatrix, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: Priority Observatories Management */}
          {activeSection === 'stations' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Priority AWS Observatories & Surveillance Queue
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Manage active telemetry stations appearing on your Synoptic Desk priority table.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddRegionModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer self-start"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Observatory Station</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {pinnedStations.map((station) => (
                  <div
                    key={station.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center text-xs font-black">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{station.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-200 text-slate-700 font-bold">
                            {station.subdivision}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Coords: {station.lat}°N, {station.lng}°E · Status: <span className="text-emerald-700 font-bold">Online</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${station.alertStatusClass}`}>
                        {station.alertStatus}
                      </span>
                      <button
                        onClick={() => handleRemoveStation(station.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove from monitoring queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: Python / NetCDF API Pipeline */}
          {activeSection === 'api-access' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Scientific API & Automated Python Pipelines
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Programmatic access tokens for MetPy, GDAL, WRF-Python, and automated NetCDF ingestion.
                  </p>
                </div>
                <button
                  onClick={handleRegenerateApiKey}
                  disabled={isRegeneratingKey}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRegeneratingKey ? 'animate-spin' : ''}`} />
                  <span>Regenerate Token</span>
                </button>
              </div>

              {/* Token Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono font-bold">OPERATIONAL SYNOPTIC REST API TOKEN</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                    SCOPES: READ_NWP · WRITE_BULLETINS
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl font-mono text-xs text-sky-300">
                  <span className="flex-1 truncate">
                    {apiKeyVisible ? apiKey : '••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 font-mono">
                  Authorization Header: Bearer {apiKeyVisible ? apiKey : 'ms_live_synoptic_...'}
                </p>
              </div>

              {/* Sample Python Integration snippet */}
              <div className="space-y-2">
                <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Python MetPy Integration Quickstart
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
                  <pre className="text-[11px] leading-relaxed">
{`import requests
import xarray as xr

HEADERS = {"Authorization": "Bearer ${apiKey}"}
ENDPOINT = "https://weather-api.imd.gov.in/v1/synoptic/consensus"

# Fetch real-time blended consensus & sounding for Indore
res = requests.get(ENDPOINT, params={"station": "AWS-42680", "lead": "24h"}, headers=HEADERS)
data = res.json()
print(f"Blended Temp: {data['temperature']}°C | Rain Prob: {data['rain_prob']}%")`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: Security & Terminal Nodes */}
          {activeSection === 'sessions' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Security, 2FA & Authorized Terminal Sessions
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Active hardware terminals and workstations with verified cryptographic session tokens.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Password change request link sent to GovNet email', 'info')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </button>
              </div>

              <div className="space-y-3">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <Laptop className="w-4 h-4 text-sky-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{sess.name}</span>
                          {sess.isCurrent && (
                            <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                              THIS DEVICE
                            </span>
                          )}
                          {sess.tag && (
                            <span className="px-2 py-0.2 rounded-full bg-sky-100 text-sky-800 text-[10px] font-mono font-bold">
                              {sess.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{sess.detail}</p>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          IP: {sess.ip} · Status: {sess.status}
                        </div>
                      </div>
                    </div>

                    {!sess.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(sess.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer self-start sm:self-center"
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 2FA Status */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">FIPS-140-3 Hardware Token 2FA</div>
                    <div className="text-[11px] text-slate-400">YubiKey GovKey slot #1 verified and active.</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black font-mono">
                  ENFORCED
                </span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
