// src/components/dma/DMAProfileSettingsScreen.jsx
import React, { useState } from 'react';
import { useDisasterManagement } from '../../context/DisasterManagementContext.jsx';
import {
  User,
  Shield,
  CheckCircle2,
  Lock,
  Bell,
  Sliders,
  Radio,
  MapPin,
  Laptop,
  Smartphone,
  Save,
  Key,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  Building,
  Eye,
  LogOut,
  X
} from 'lucide-react';

export default function DMAProfileSettingsScreen() {
  const {
    officerUser,
    setOfficerUser,
    safetyGuardrails,
    setSafetyGuardrails,
    monitoringPrefs,
    setMonitoringPrefs,
    notificationMatrix,
    setNotificationMatrix,
    showToast
  } = useDisasterManagement();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: officerUser.name,
    email: officerUser.email,
    phone: officerUser.phone,
    designation: officerUser.designation,
    state: officerUser.state,
    district: officerUser.district
  });

  const [selectedHazards, setSelectedHazards] = useState(monitoringPrefs.monitoredHazards);
  const [selectedMapLayer, setSelectedMapLayer] = useState(monitoringPrefs.defaultMapLayer);
  const [selectedHorizon, setSelectedHorizon] = useState(monitoringPrefs.defaultForecastWindow);

  const [mapWorkspacePrefs, setMapWorkspacePrefs] = useState({
    showLegend: true,
    enableHatching: true,
    retainLayer: true
  });

  const [density, setDensity] = useState('comfortable'); // 'comfortable' | 'compact'

  const allHazardsList = [
    'Heavy Rainfall',
    'Flood & Inundation',
    'Heat Wave',
    'Strong Wind & Squall',
    'Thunderstorm & Lightning',
    'Extreme Temperature',
    'Riverine Surge'
  ];

  const handleToggleHazard = (hazard) => {
    if (selectedHazards.includes(hazard)) {
      setSelectedHazards(selectedHazards.filter(h => h !== hazard));
    } else {
      setSelectedHazards([...selectedHazards, hazard]);
    }
  };

  const handleSelectAllHazards = () => {
    if (selectedHazards.length === allHazardsList.length) {
      setSelectedHazards(['Heavy Rainfall']);
    } else {
      setSelectedHazards([...allHazardsList]);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setOfficerUser(prev => ({
      ...prev,
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      designation: profileForm.designation
    }));
    setIsEditingProfile(false);
    showToast('Officer profile parameters updated successfully.', 'success');
  };

  const handleSavePreferences = () => {
    setMonitoringPrefs(prev => ({
      ...prev,
      monitoredHazards: selectedHazards,
      defaultMapLayer: selectedMapLayer,
      defaultForecastWindow: selectedHorizon
    }));
    showToast('Monitoring and hazard preferences saved to EOC workspace.', 'success');
  };

  const handleSaveNotifications = () => {
    showToast('Operational notification matrix updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-sky-600" />
            <span>STATE EMERGENCY OPERATIONS CENTRE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage your authority profile, monitoring preferences, security credentials and operational safety guardrails.
          </p>
        </div>

        {/* Success badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Authority sync updated across all EOC nodes.</span>
        </div>
      </div>

      {/* Main Grid: Left Column (7 cols) + Right Column (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Profile Information */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-black text-slate-900">
                  Profile Information
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified Government Account</span>
              </span>
            </div>

            {/* Officer Avatar & Primary Credentials */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black text-sky-400 shrink-0 shadow-xs">
                {officerUser.initials || 'RV'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900">
                    {officerUser.name}
                  </h4>
                  <span className="px-2 py-0.2 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                    {officerUser.badge}
                  </span>
                </div>
                <div className="text-xs font-bold text-sky-800 mt-0.5 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-sky-600" />
                  <span>{officerUser.roleShort}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {officerUser.organization}
                </div>
              </div>
            </div>

            {/* Details Form / View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div>
                <label className="block text-slate-500 mb-1 text-[11px] uppercase">FULL NAME</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold">
                  {profileForm.name}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 text-[11px] uppercase">OFFICIAL EMAIL</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono">
                  {profileForm.email} <span className="text-emerald-700 font-bold ml-1">✓ Verified .gov.in</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 text-[11px] uppercase">MOBILE NUMBER</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono">
                  {profileForm.phone} <span className="text-[10px] text-slate-400 block font-sans">Secure EOC Hotline Linked</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 text-[11px] uppercase">DESIGNATION</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">
                  {profileForm.designation}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-500 mb-1 text-[11px] uppercase">ORGANIZATION / DEPARTMENT</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">
                  {officerUser.department}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 text-[11px] uppercase">STATE</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">
                  {profileForm.state}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 text-[11px] uppercase">DISTRICT / SYNOPTIC REGION</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">
                  {profileForm.district}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => showToast('Clearance update request sent to State Nodal Administrator', 'info')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Request Clearance Update
              </button>
              <button
                onClick={() => showToast('Profile editor unlocked for session.', 'info')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors cursor-pointer"
              >
                Edit Profile
              </button>
            </div>

          </div>

          {/* Card 2: Monitoring Preferences */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Monitoring Preferences
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Choose the regions and hazards you want to monitor across the GIS and dashboard feeds.
                </p>
              </div>
            </div>

            {/* Region Hierarchy */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
              <div>
                <label className="block text-slate-500 mb-1 text-[10px] uppercase">MACRO ZONE</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900">
                  <option>Central & Western Corridor</option>
                  <option>Northern Plains</option>
                  <option>Southern Peninsula</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 text-[10px] uppercase">STATE</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900">
                  <option>Madhya Pradesh</option>
                  <option>Maharashtra</option>
                  <option>Gujarat</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 text-[10px] uppercase">DISTRICT / PRIORITY CLUSTER</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900">
                  <option>Indore, Dewas & Ujjain Priority Cluster</option>
                  <option>Bhopal Urban Division</option>
                  <option>Jabalpur & Mahakoshal Sector</option>
                </select>
              </div>
            </div>

            {/* Active Monitored Hazards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 uppercase text-[10px]">ACTIVE MONITORED HAZARDS</span>
                <button
                  onClick={handleSelectAllHazards}
                  className="text-sky-700 hover:underline cursor-pointer text-[11px]"
                >
                  {selectedHazards.length === allHazardsList.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {allHazardsList.map(h => {
                  const isSelected = selectedHazards.includes(h);
                  return (
                    <button
                      key={h}
                      onClick={() => handleToggleHazard(h)}
                      className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white font-extrabold shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{h}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Default Risk Layer Map View */}
            <div className="space-y-2">
              <span className="block text-slate-700 uppercase text-[10px] font-bold">
                DEFAULT RISK LAYER MAP VIEW
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 text-xs font-bold">
                {['All Hazards', 'Rainfall Risk', 'Flood Risk', 'Heat Risk', 'Wind Risk', 'Thunderstorm'].map(layer => (
                  <button
                    key={layer}
                    onClick={() => setSelectedMapLayer(layer)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedMapLayer === layer
                        ? 'bg-sky-50 border-sky-600 text-sky-900 font-extrabold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Forecast Horizon */}
            <div className="space-y-2">
              <span className="block text-slate-700 uppercase text-[10px] font-bold">
                DEFAULT FORECAST HORIZON WINDOW
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {['Now (Radar)', 'Next 6 Hours (Selected)', 'Next 12 Hours', 'Next 24 Hours', 'Next 72 Hours'].map(h => (
                  <button
                    key={h}
                    onClick={() => setSelectedHorizon(h)}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      selectedHorizon === h
                        ? 'bg-slate-900 text-white border-slate-900 font-extrabold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={handleSavePreferences}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Preferences</span>
              </button>
            </div>

          </div>

          {/* Card 3: Notification Preferences */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Notification Preferences
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Configure alerts routed to your workstation, encrypted mobile channel, and dispatch desk.
                </p>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase">
                    <th className="py-2.5 px-3">ALERT CATEGORY</th>
                    <th className="py-2.5 px-3 text-center">IN-APP BROADCAST</th>
                    <th className="py-2.5 px-3 text-center">GOV SMS GATEWAY</th>
                    <th className="py-2.5 px-3 text-center">SECURE GOV EMAIL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {[
                    { key: 'criticalRisk', label: 'Critical risk alerts', desc: 'Nowcasts & Flash Floods (Red Bulletins)' },
                    { key: 'highRisk', label: 'High-risk region alerts', desc: '6-hour synoptic forecast threshold events' },
                    { key: 'incidentUpdates', label: 'Incident status updates & SDRF dispatches', desc: 'Field relief team coordination milestones' },
                    { key: 'emergencyConfirmations', label: 'Emergency action confirmations', desc: 'Broadcast audits & cell dispatch receipts' }
                  ].map(row => (
                    <tr key={row.key} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-slate-900">{row.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{row.desc}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                          ✓ ON
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                          ✓ ON
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                          ✓ ON
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-snug">
              <strong>Supported Delivery Nodes:</strong> High-priority In-App Broadcasts, Verified Gov SMS Gateway (NIC Push API), and Official EOC Secure Email (Secured via Gov NIC Mail Exchange).
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={handleSaveNotifications}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notification Settings</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Account & Clearance */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-sky-600" />
                <span>Account & Clearance</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                SSO Authenticated
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-bold">Account Status</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">
                  Active
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">ROLE CLEARANCE</span>
                <div className="font-extrabold text-slate-900 text-xs mt-0.5">
                  {officerUser.role}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">SSO AUTHENTICATION</span>
                  <span className="font-extrabold text-slate-900">{officerUser.ssoAuth}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ✓ Verified
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">DIGITAL CERTIFICATE</span>
                <div className="font-extrabold text-slate-900 mt-0.5">{officerUser.digitalCertificate}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{officerUser.certValidity}</div>
              </div>
            </div>
          </div>

          {/* Card 2: Alert & Action Safety Guardrails */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Alert & Action Safety Guardrails</span>
              </h3>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Protocols governing emergency dispatches and citizen public warnings.
            </p>

            {/* Threshold buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                ALERT PRIORITY TRIGGER THRESHOLD
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {['Critical', 'High', 'Moderate'].map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setSafetyGuardrails({ ...safetyGuardrails, alertPriorityThreshold: t });
                      showToast(`Trigger threshold set to ${t}`, 'info');
                    }}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      safetyGuardrails.alertPriorityThreshold === t
                        ? 'bg-rose-50 border-rose-500 text-rose-900 font-extrabold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    Require confirmation before emergency actions
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Critical communication actions and cell broadcasts always require two-step cryptographic authorization.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={safetyGuardrails.requireEmergencyConfirmation}
                  onChange={(e) => setSafetyGuardrails({ ...safetyGuardrails, requireEmergencyConfirmation: e.target.checked })}
                  className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer mt-1"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    Require human review before publishing AI-generated advisories
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    AI-generated public safety messages must be verified and approved by the EOC duty officer before publication.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={safetyGuardrails.requireHumanReviewAI}
                  onChange={(e) => setSafetyGuardrails({ ...safetyGuardrails, requireHumanReviewAI: e.target.checked })}
                  className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer mt-1"
                />
              </div>

            </div>

            <div className="p-3 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-mono">
              🔒 Authorizations are locked to State EOC Standard Operating Procedures (SOP 2025).
            </div>

          </div>

          {/* Card 3: Interface Preferences */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-600" />
                <span>Interface Preferences</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs font-bold">
              
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">COLOR SYSTEM</span>
                  <span className="text-slate-900 font-extrabold">Light Mode (Standard Civic Protocol)</span>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">🔒 LOCKED</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block mb-1">DASHBOARD DENSITY</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDensity('comfortable')}
                    className={`flex-1 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                      density === 'comfortable' ? 'bg-slate-900 text-white font-black' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Comfortable (Selected)
                  </button>
                  <button
                    onClick={() => setDensity('compact')}
                    className={`flex-1 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                      density === 'compact' ? 'bg-slate-900 text-white font-black' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Compact
                  </button>
                </div>
              </div>

              {/* Map Workspace Preferences checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase block">MAP WORKSPACE PREFERENCES</span>
                
                <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mapWorkspacePrefs.showLegend}
                    onChange={(e) => setMapWorkspacePrefs({ ...mapWorkspacePrefs, showLegend: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                  <span>Show risk severity legend on map load</span>
                </label>

                <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mapWorkspacePrefs.enableHatching}
                    onChange={(e) => setMapWorkspacePrefs({ ...mapWorkspacePrefs, enableHatching: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                  <span>Enable automatic low-lying basin drainage hatching</span>
                </label>

                <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mapWorkspacePrefs.retainLayer}
                    onChange={(e) => setMapWorkspacePrefs({ ...mapWorkspacePrefs, retainLayer: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                  <span>Retain selected hazard layer between sessions</span>
                </label>
              </div>

            </div>

          </div>

          {/* Card 4: Security & Active Sessions */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-700" />
                <span>Security & Active Sessions</span>
              </h3>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-extrabold text-slate-900">Official Access Credential</div>
                <div className="text-[10px] text-slate-500">Password last changed 14 days ago (Mandatory 90-day rotation)</div>
              </div>
              <button
                onClick={() => showToast('Password reset link dispatched to GovNet mail', 'info')}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 hover:bg-slate-100 text-xs shadow-2xs cursor-pointer"
              >
                Change Password
              </button>
            </div>

            {/* Sessions list */}
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between text-xs">
                <div className="flex items-start gap-2.5">
                  <Laptop className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>Chrome 124 · Windows 11</span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">
                        Current Session
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      State EOC Workstation WS-04 · Bhopal Central Complex
                    </div>
                    <div className="text-[9px] font-mono text-slate-400">
                      IP: 10.14.22.8 (GovNIC Intranet) · Active Now
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between text-xs">
                <div className="flex items-start gap-2.5">
                  <Smartphone className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-slate-900">Safari Mobile · iPhone 15</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Encrypted State Mobile Channel · Bhopal</div>
                    <div className="text-[9px] font-mono text-slate-400">Active 42 mins ago · 2FA Token Synced</div>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Terminated mobile session token.', 'info')}
                  className="text-rose-600 hover:underline font-bold text-xs cursor-pointer"
                >
                  Terminate
                </button>
              </div>
            </div>

            <button
              onClick={() => showToast('Signed out of State EOC node.', 'info')}
              className="w-full py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Sign Out of WeatherAI</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
