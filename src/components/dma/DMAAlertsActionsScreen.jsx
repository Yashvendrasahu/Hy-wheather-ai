// src/components/dma/DMAAlertsActionsScreen.jsx
import React, { useState } from 'react';
import { useDisasterManagement } from '../../context/DisasterManagementContext.jsx';
import {
  DMA_SUMMARY_METRICS
} from '../../data/disasterManagementData.js';
import {
  Bell,
  Radio,
  Send,
  FileText,
  ShieldAlert,
  AlertTriangle,
  Clock,
  RefreshCw,
  CheckCircle2,
  Filter,
  ShieldCheck,
  CheckSquare,
  Square,
  Sparkles,
  ChevronDown,
  Building,
  Lock,
  ArrowRight,
  TrendingUp,
  Droplets,
  CloudRain,
  Activity,
  Layers,
  Zap
} from 'lucide-react';

export default function DMAAlertsActionsScreen() {
  const {
    selectedAlert,
    setSelectedAlertId,
    alerts,
    dispatchLogs,
    escalations,
    officerUser,
    selectedSector,
    protocolChecklist,
    handleToggleProtocol,
    alertLocationFilter,
    setAlertLocationFilter,
    alertHazardFilter,
    setAlertHazardFilter,
    alertSeverityFilter,
    setAlertSeverityFilter,
    alertStatusFilter,
    setAlertStatusFilter,
    alertTimeFilter,
    setAlertTimeFilter,
    setShowBroadcastModal,
    setShowOfficialAlertModal,
    setShowPublicAdvisoryModal,
    setShowEscalateModal,
    handleSendOfficialAlert,
    handlePublishPublicAdvisory,
    showToast,
    dmaForecast,
    isLoadingDmaForecast,
    refreshDmaForecast
  } = useDisasterManagement();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [advisoryLang, setAdvisoryLang] = useState('EN');
  const [isConfirmingDispatch, setIsConfirmingDispatch] = useState(false);
  const [advisoryTextEn, setAdvisoryTextEn] = useState(
    `Urgent Weather Advisory for Indore Urban & Low-Lying Catchments: Heavy rain spells expected between 4:00 PM and 7:00 PM. Citizens are advised to avoid waterlogged underpasses, stay indoors during peak downpour, and dial 112 / 1077 for emergency assistance. SDRF units have been positioned.`
  );

  const [advisoryTextHi, setAdvisoryTextHi] = useState(
    `इंदौर शहरी और निचले जलभराव क्षेत्रों के लिए आवश्यक मौसम परामर्श: शाम 4:00 से 7:00 बजे के बीच भारी बारिश की संभावना है। नागरिकों से अनुरोध है कि जलभराव वाले अंडरपास से बचें, घर के अंदर रहें और 112 / 1077 पर संपर्क करें।`
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshDmaForecast();
      showToast('Live operational alert queue synchronized with live AI model.', 'success');
    } catch {
      showToast('Live operational alert queue synchronized.', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleConfirmInlineDispatch = () => {
    setIsConfirmingDispatch(true);
    setTimeout(() => {
      setIsConfirmingDispatch(false);
      handleSendOfficialAlert({
        recipient: 'Indore Collectorate & Municipal EOC',
        code: selectedSector?.dispatchCode || 'EOC-MP04-HR-FLASH-0914',
        hazard: `${dmaForecast?.precipitation?.alert || 'CRITICAL'} — Heavy Rain (${dmaForecast?.precipitation?.quantiles_mm?.p50 || 52.9} mm/h)`
      });
    }, 700);
  };

  const handleAuthorizeInlineAdvisory = () => {
    handlePublishPublicAdvisory(advisoryLang === 'EN' ? advisoryTextEn : advisoryTextHi, advisoryLang);
  };

  const filteredAlerts = alerts.filter(a => {
    if (alertSeverityFilter === 'Critical Only' && a.severity !== 'CRITICAL') return false;
    if (alertHazardFilter !== 'All Hazards' && !a.hazardType.toLowerCase().includes(alertHazardFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Title & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Alerts & Emergency Actions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-black uppercase font-mono">
              LIVE OPERATIONAL DISPATCH
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Review active weather alerts and manage authorized emergency communications across monitored state sectors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>Live Monitoring · Updated: 12:15 PM IST</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Alerts</span>
          </button>
        </div>
      </div>

      {/* 5 Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase">ACTIVE ALERTS</span>
            <Radio className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5">12</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-1">Across 4 state sectors</div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-700 uppercase">CRITICAL (RED)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-1.5">3 <span className="text-xs font-bold text-rose-600">Urgent</span></div>
          <div className="text-[10px] text-rose-600 font-bold mt-1">Requires immediate intervention</div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-700 uppercase">HIGH (AMBER)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 mt-1.5">5</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-1">Heightened surveillance</div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-sky-700 uppercase">AWAITING ACTION</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-800 mt-1.5">4 <span className="text-xs font-bold text-sky-600">Pending</span></div>
          <div className="text-[10px] text-slate-500 font-semibold mt-1">Pending dispatch clearance</div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-700 uppercase">RESOLVED TODAY</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1.5">7</div>
          <div className="text-[10px] text-emerald-800 font-semibold mt-1">Completed protocols</div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          <select
            value={alertLocationFilter}
            onChange={(e) => setAlertLocationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          >
            <option>All Locations (Malwa & Narmada)</option>
            <option>Indore District (Zone MP-04)</option>
            <option>Dewas Industrial Belt</option>
            <option>Ujjain Corridor</option>
            <option>Bhopal Lower Lake</option>
          </select>

          <select
            value={alertHazardFilter}
            onChange={(e) => setAlertHazardFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          >
            <option>All Hazards</option>
            <option>Rainfall</option>
            <option>Flood</option>
            <option>Wind</option>
          </select>

          <select
            value={alertSeverityFilter}
            onChange={(e) => setAlertSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          >
            <option>All Severities</option>
            <option>Critical Only</option>
            <option>High & Moderate</option>
          </select>

          <select
            value={alertStatusFilter}
            onChange={(e) => setAlertStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          >
            <option>All Statuses</option>
            <option>Awaiting Action</option>
            <option>Issued</option>
            <option>Acknowledged</option>
          </select>

          <select
            value={alertTimeFilter}
            onChange={(e) => setAlertTimeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          >
            <option>Last 6 Hours</option>
            <option>Last 12 Hours</option>
            <option>Today (Consolidated)</option>
          </select>

        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAlertLocationFilter('All Locations (Malwa & Narmada)');
              setAlertHazardFilter('All Hazards');
              setAlertSeverityFilter('All Severities');
              setAlertStatusFilter('All Statuses');
              setAlertTimeFilter('Last 6 Hours');
              showToast('Alert filters reset.', 'info');
            }}
            className="px-3 py-2 text-slate-500 hover:text-slate-800 font-bold"
          >
            Reset
          </button>
          <button
            onClick={() => showToast('Filters applied to alert queue.', 'success')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* Main Split: Active Alerts Queue Left (7 cols) + Alert Verification & Detail Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Alerts Queue Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
                +
              </span>
              <h3 className="text-base font-black text-slate-900">
                Active Alerts Queue
              </h3>
              <span className="px-2 py-0.2 rounded bg-amber-100 text-amber-800 font-black text-[10px] uppercase">
                4 AWAITING ACTION
              </span>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Showing {filteredAlerts.length} Monitored Sectors
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Alert & Hazard</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Probability</th>
                  <th className="py-2.5 px-3">Time Horizon</th>
                  <th className="py-2.5 px-3">Potential Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredAlerts.map(alert => (
                  <tr
                    key={alert.id}
                    onClick={() => setSelectedAlertId(alert.id)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      selectedAlert.id === alert.id ? 'bg-sky-50/60 font-bold border-l-4 border-l-sky-600' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${alert.severityClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'}`} />
                        <span>{alert.severity}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{alert.event}</div>
                      <div className="text-[10px] text-slate-500">{alert.eventDetail}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{alert.location}</div>
                      <div className="text-[10px] text-slate-500">{alert.locationDetail}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-rose-700">
                      <div>{alert.probability}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{alert.probTier}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                      {alert.expectedTime}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs leading-snug">
                      {alert.potentialImpact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Alert Verification & Detail (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="px-2 py-0.2 rounded bg-rose-50 text-rose-800 font-mono text-[10px] font-black uppercase border border-rose-200">
                CRITICAL ALERT · ZONE MP-04
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Alert Verification & Detail
              </h3>
              <p className="text-[11px] text-slate-500">
                Operational telemetry & recommended civil defense actions.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold">
              ID: WR-2025-0914
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-bold text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase">HAZARD</span>
              <div className="text-sm font-black text-slate-900 mt-0.5">Heavy Rainfall</div>
              <div className="text-[10px] text-rose-600 font-bold">{dmaForecast?.precipitation?.quantiles_mm?.p50 || 52.9} mm/h Peak</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase">LOCATION</span>
              <div className="text-sm font-black text-slate-900 mt-0.5">{selectedSector.name}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{selectedSector.subdivision}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase">PROBABILITY</span>
              <div className="text-sm font-black text-rose-700 mt-0.5">
                {Math.round((dmaForecast?.precipitation?.nwp_bust_probability || 0.78) * 100)}%
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">Confidence: {dmaForecast?.precipitation?.conformal_coverage || '86.75%'}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase">TIMING</span>
              <div className="text-sm font-black text-slate-900 mt-0.5">{selectedSector.timing}</div>
              <div className="text-[10px] text-slate-500 font-semibold">Today (IST)</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1 text-xs">
            <div className="font-black text-[11px] text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
              <span>POTENTIAL LOCAL IMPACT</span>
            </div>
            <p className="text-rose-900 text-[11px] leading-relaxed font-medium">
              Localized surface flooding and flash inundation across Khan River catchment and Ring Road underpasses if peak burst exceeds 45 mm/h. P90 Hazard Ceiling: {dmaForecast?.precipitation?.quantiles_mm?.p90 || 92.5} mm.
            </p>
          </div>

          {/* Forecast Metrics & Ensemble */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-semibold">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              FORECAST METRICS & ENSEMBLE
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200 text-[11px]">
              <span className="text-slate-600">Expected Rainfall:</span>
              <span className="font-mono font-bold text-slate-900">{dmaForecast?.precipitation?.quantiles_mm?.p50 || 52.9} mm</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200 text-[11px]">
              <span className="text-slate-600">P90 Upper Range:</span>
              <span className="font-mono font-bold text-rose-700">{dmaForecast?.precipitation?.quantiles_mm?.p90 || 92.5} mm</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200 text-[11px]">
              <span className="text-slate-600">Risk Trend:</span>
              <span className="font-bold text-rose-600">
                {dmaForecast?.precipitation?.is_bust_warning ? '↗ Increasing (Peak 6:00 PM - Rapid Intensification)' : 'Stable'}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600">Model Guarantee:</span>
              <span className="font-bold text-sky-800">{dmaForecast?.precipitation?.conformal_coverage || '86.75% Guaranteed'}</span>
            </div>
          </div>

          {/* Mandatory Protocol Checklist */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              MANDATORY PROTOCOL CHECKLIST
            </div>
            
            <div className="space-y-1.5">
              {[
                { key: 'reviewRisk', label: 'Review local risk zone and vulnerable underpasses' },
                { key: 'notifyCollector', label: 'Notify responsible district magistrate and municipal commissioner' },
                { key: 'monitorTelemetry', label: 'Monitor real-time telemetry from AWS 42680' },
                { key: 'standbySDRF', label: 'Place SDRF rapid deployment unit on standby' }
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => handleToggleProtocol(item.key)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-[11px] font-bold text-slate-700"
                >
                  {protocolChecklist[item.key] ? (
                    <CheckSquare className="w-4 h-4 text-sky-700 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={protocolChecklist[item.key] ? 'line-through text-slate-400' : ''}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowOfficialAlertModal(true)}
            className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-sky-400" />
            <span>Select Emergency Response</span>
          </button>

        </div>

      </div>

      {/* Emergency Action Center (4 Cards) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="text-sky-600">🏛️</span>
              <span>Emergency Action Center</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Authorized cryptographic dispatch workflows. Actions require two-step officer confirmation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-slate-900 uppercase">SEND OFFICIAL ALERT</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Notify authorized district magistrates, municipal commissioners & police chiefs across encrypted civic networks.
              </p>
            </div>
            <button
              onClick={() => setShowOfficialAlertModal(true)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Send Official Alert</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 text-[9px] font-black uppercase">
                  CIVIC SIREN
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 uppercase">EMERGENCY CELL BROADCAST</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Send verified geo-targeted emergency warning to citizens within alert polygon via telecommunication tower push.
              </p>
            </div>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="w-full py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Send Cell Broadcast</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-slate-900 uppercase">PUBLIC ADVISORY</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Generate and publish an authorized public safety bulletin across media handles, news tickers & civic portal.
              </p>
            </div>
            <button
              onClick={() => setShowPublicAdvisoryModal(true)}
              className="w-full py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Create Public Advisory</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-slate-900 uppercase">ESCALATE INCIDENT</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Escalate critical incident to State Disaster Management Authority (SDMA) & NDMA national coordinating desk.
              </p>
            </div>
            <button
              onClick={() => setShowEscalateModal(true)}
              className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Escalate to SDMA</span>
            </button>
          </div>

        </div>
      </div>

      {/* Inline Action Workspace: Confirm Emergency Alert Dispatch + Public Advisory Creator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Confirm Emergency Alert Dispatch (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <h3 className="text-base font-black text-slate-900">
                Confirm Emergency Alert Dispatch
              </h3>
            </div>
            <span className="px-2 py-0.2 rounded bg-rose-50 text-rose-700 font-mono text-[10px] font-extrabold border border-rose-200 uppercase">
              {selectedSector.name.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            You are about to issue a formal executive directive to district crisis administrators. Verify parameters before biometric or cryptographic token authorization.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-semibold">
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-500">Target Recipients:</span>
              <strong className="text-slate-900">{selectedSector.name} Collectorate & Municipal EOC</strong>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-500">Mandated Dispatch Code:</span>
              <span className="font-mono text-sky-800 font-bold">{selectedSector?.dispatchCode || 'EOC-MP04-HR-FLASH-0914'}</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-500">Severity & Hazard:</span>
              <strong className="text-rose-700">
                {dmaForecast?.precipitation?.alert || 'CRITICAL'} — Heavy Rain ({dmaForecast?.precipitation?.quantiles_mm?.p50 || 52.9} mm/h)
              </strong>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-500">P90 Hazard Ceiling:</span>
              <span className="font-mono text-rose-600 font-bold">{dmaForecast?.precipitation?.quantiles_mm?.p90 || 92.5} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Authorizing Officer:</span>
              <strong className="text-slate-900">{officerUser.name} (State EOC)</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px] flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Two-Step IAS Token Authorization is active on this session key.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => showToast('Dispatch cancelled.', 'info')}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmInlineDispatch}
              disabled={isConfirmingDispatch}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
            >
              <ShieldCheck className={`w-4 h-4 ${isConfirmingDispatch ? 'animate-spin' : ''}`} />
              <span>{isConfirmingDispatch ? 'Authenticating...' : 'Confirm & Authenticate Dispatch'}</span>
            </button>
          </div>
        </div>

        {/* Right: Public Advisory Creator (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
                🏛️
              </span>
              <h3 className="text-base font-black text-slate-900">
                Public Advisory Creator
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase font-mono">
              AI-ASSISTED DRAFT
            </span>
          </div>

          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 text-[11px] flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>Review and authorize plain-language public advisory draft before publication across citizen portals.</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <span>BULLETIN TEXT (DUAL LANGUAGE VERIFIED)</span>
              <div className="flex gap-1 text-slate-600 font-bold">
                <button
                  onClick={() => setAdvisoryLang('EN')}
                  className={`px-2 py-0.5 rounded ${advisoryLang === 'EN' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setAdvisoryLang('HI')}
                  className={`px-2 py-0.5 rounded ${advisoryLang === 'HI' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            {advisoryLang === 'EN' ? (
              <textarea
                rows={4}
                value={advisoryTextEn}
                onChange={(e) => setAdvisoryTextEn(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            ) : (
              <textarea
                rows={4}
                value={advisoryTextHi}
                onChange={(e) => setAdvisoryTextHi(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => showToast('Advisory draft saved.', 'info')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Save Draft
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdvisoryLang(advisoryLang === 'EN' ? 'HI' : 'EN')}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
              >
                Preview Hindi / English
              </button>
              <button
                onClick={handleAuthorizeInlineAdvisory}
                className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Authorize & Publish</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Alert Delivery Pipeline Left + Recent Dispatch Activity Log Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Alert Delivery Pipeline (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-sky-600" />
              <span>Alert Delivery Pipeline</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">REALTIME AUDIT</span>
          </div>

          <div className="space-y-2 text-xs font-bold">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-700">Awaiting Action</span>
              </div>
              <span className="font-mono text-slate-900 text-sm">4</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-600" />
                <span className="text-slate-700">Acknowledged by DEOC</span>
              </div>
              <span className="font-mono text-slate-900 text-sm">6</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="text-slate-700">Dispatches Sent</span>
              </div>
              <span className="font-mono text-slate-900 text-sm">12</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-700">Verified Delivered</span>
              </div>
              <span className="font-mono text-emerald-700 text-sm">10</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-700">Resolved & Logged</span>
              </div>
              <span className="font-mono text-slate-900 text-sm">7</span>
            </div>
          </div>
        </div>

        {/* Right: Recent Dispatch Activity Log (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Recent Dispatch Activity Log</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">TODAY'S AUDIT STREAM</span>
          </div>

          <div className="space-y-2.5">
            {dispatchLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-slate-900 text-[11px]">{log.title}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{log.desc}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-[10px] text-slate-500 font-bold">{log.time}</div>
                  <span className="text-[10px] font-bold text-emerald-700">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Inter-Agency Escalation Queue Footer Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Inter-Agency Escalation Queue
            </h3>
          </div>
          <span className="px-2 py-0.2 rounded bg-rose-50 text-rose-700 font-bold text-[10px] uppercase">
            2 INCIDENTS FLAGGED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {escalations.map((esc) => (
            <div
              key={esc.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
            >
              <div>
                <div className="font-extrabold text-xs text-slate-900">{esc.title}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">{esc.desc}</div>
              </div>
              <button
                onClick={() => showToast(`Loaded brief for ${esc.title}`, 'info')}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-100 transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                {esc.actionLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
