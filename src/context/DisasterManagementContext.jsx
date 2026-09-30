// src/context/DisasterManagementContext.jsx
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import {
  DMA_OFFICER_PROFILE,
  DMA_SUMMARY_METRICS,
  MONITORED_SECTORS,
  PRIORITY_ALERTS_TABLE,
  ACTIVE_INCIDENTS_LIST,
  DISPATCH_ACTIVITY_LOG,
  INTER_AGENCY_ESCALATION_QUEUE,
  NOTIFICATION_ITEMS
} from '../data/disasterManagementData.js';
import { fetchSynopticForecast } from '../services/synopticService.js';

export const DEFAULT_DMA_PAYLOAD = {
  latitude: 22.7196,
  longitude: 75.8577,
  climatic_zone: 4,
  tp_gfs: 32.0,
  tp_ecmwf: 42.0,
  tp_ncum: 48.0,
  tp_wrf: 58.0,
  t2m_gfs: 28.5,
  t2m_ecmwf: 29.0,
  wind_gfs_kmh: 22.0,
  wind_ecmwf_kmh: 26.0,
  cape: 1850.0,
  cin: 30.0,
  rh_700: 84.0,
  mslp: 1008.0,
  wind_shear: 24.0,
  elevation_m: 553.0,
  terrain_slope_deg: 3.5,
  radar_max_dbz: 52.0,
  satellite_ctt_celsius: -58.0
};

export const SECTOR_PAYLOAD_MAP = {
  'sec-indore': {
    latitude: 22.7196,
    longitude: 75.8577,
    climatic_zone: 4,
    tp_gfs: 32.0,
    tp_ecmwf: 42.0,
    tp_ncum: 48.0,
    tp_wrf: 58.0,
    t2m_gfs: 28.5,
    t2m_ecmwf: 29.0,
    wind_gfs_kmh: 22.0,
    wind_ecmwf_kmh: 26.0,
    cape: 1850.0,
    cin: 30.0,
    rh_700: 84.0,
    mslp: 1008.0,
    wind_shear: 24.0,
    elevation_m: 553.0,
    terrain_slope_deg: 3.5,
    radar_max_dbz: 52.0,
    satellite_ctt_celsius: -58.0
  },
  'sec-dewas': {
    latitude: 22.9676,
    longitude: 76.0534,
    climatic_zone: 4,
    tp_gfs: 28.0,
    tp_ecmwf: 38.0,
    tp_ncum: 44.0,
    tp_wrf: 54.0,
    t2m_gfs: 28.0,
    t2m_ecmwf: 28.5,
    wind_gfs_kmh: 20.0,
    wind_ecmwf_kmh: 24.0,
    cape: 1750.0,
    cin: 35.0,
    rh_700: 82.0,
    mslp: 1008.5,
    wind_shear: 22.0,
    elevation_m: 535.0,
    terrain_slope_deg: 2.8,
    radar_max_dbz: 48.0,
    satellite_ctt_celsius: -54.0
  },
  'sec-ujjain': {
    latitude: 23.1765,
    longitude: 75.7885,
    climatic_zone: 4,
    tp_gfs: 24.0,
    tp_ecmwf: 32.0,
    tp_ncum: 38.0,
    tp_wrf: 46.0,
    t2m_gfs: 29.0,
    t2m_ecmwf: 29.5,
    wind_gfs_kmh: 26.0,
    wind_ecmwf_kmh: 30.0,
    cape: 1600.0,
    cin: 40.0,
    rh_700: 76.0,
    mslp: 1007.8,
    wind_shear: 28.0,
    elevation_m: 494.0,
    terrain_slope_deg: 2.1,
    radar_max_dbz: 44.0,
    satellite_ctt_celsius: -50.0
  },
  'sec-bhopal': {
    latitude: 23.2599,
    longitude: 77.4126,
    climatic_zone: 4,
    tp_gfs: 20.0,
    tp_ecmwf: 26.0,
    tp_ncum: 32.0,
    tp_wrf: 38.0,
    t2m_gfs: 27.5,
    t2m_ecmwf: 28.0,
    wind_gfs_kmh: 18.0,
    wind_ecmwf_kmh: 20.0,
    cape: 1400.0,
    cin: 45.0,
    rh_700: 72.0,
    mslp: 1009.2,
    wind_shear: 18.0,
    elevation_m: 527.0,
    terrain_slope_deg: 3.0,
    radar_max_dbz: 38.0,
    satellite_ctt_celsius: -46.0
  },
  'sec-jabalpur': {
    latitude: 23.1815,
    longitude: 79.9864,
    climatic_zone: 4,
    tp_gfs: 4.0,
    tp_ecmwf: 6.0,
    tp_ncum: 8.0,
    tp_wrf: 10.0,
    t2m_gfs: 26.5,
    t2m_ecmwf: 27.0,
    wind_gfs_kmh: 12.0,
    wind_ecmwf_kmh: 14.0,
    cape: 800.0,
    cin: 75.0,
    rh_700: 55.0,
    mslp: 1011.0,
    wind_shear: 12.0,
    elevation_m: 411.0,
    terrain_slope_deg: 2.5,
    radar_max_dbz: 22.0,
    satellite_ctt_celsius: -28.0
  }
};

export const DEFAULT_DMA_FORECAST = {
  status: 'success',
  precipitation: {
    quantiles_mm: {
      p10: 24.00,
      p50: 52.90,
      p90: 92.50
    },
    nwp_bust_probability: 0.78,
    is_bust_warning: true,
    conformal_coverage: '86.75% Guaranteed',
    alert: 'RED'
  },
  temperature: {
    blended_2m_celsius: 28.0,
    rothfusz_heat_index_celsius: 34.0,
    heatwave_advisory: 'Normal'
  },
  wind: {
    sustained_speed_kmh: 24.0,
    gust_ceiling_p90_kmh: 38.0,
    gale_warning: false
  }
};

const DisasterManagementContext = createContext(null);

export function DisasterManagementProvider({ children }) {
  // Navigation tabs: 'dashboard' | 'risk-map' | 'alerts-actions' | 'incident-history' | 'profile-settings'
  const [dmaTab, setDmaTab] = useState('dashboard');

  // Officer Profile
  const [officerUser, setOfficerUser] = useState(DMA_OFFICER_PROFILE);

  // Selected Data Items
  const [selectedSectorId, setSelectedSectorId] = useState('sec-indore');
  const [selectedAlertId, setSelectedAlertId] = useState('alt-1');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-MP-0914');

  // Interactive Live Collections
  const [sectors, setSectors] = useState(MONITORED_SECTORS);
  const [alerts, setAlerts] = useState(PRIORITY_ALERTS_TABLE);
  const [incidents, setIncidents] = useState(ACTIVE_INCIDENTS_LIST);
  const [dispatchLogs, setDispatchLogs] = useState(DISPATCH_ACTIVITY_LOG);
  const [escalations, setEscalations] = useState(INTER_AGENCY_ESCALATION_QUEUE);

  // Live PyTorch QRNN FastAPI Backend Integration State
  const [dmaPayload, setDmaPayload] = useState(DEFAULT_DMA_PAYLOAD);
  const [dmaForecast, setDmaForecast] = useState(DEFAULT_DMA_FORECAST);
  const [isLoadingDmaForecast, setIsLoadingDmaForecast] = useState(false);

  const dmaPayloadRef = useRef(dmaPayload);
  dmaPayloadRef.current = dmaPayload;

  const refreshDmaForecast = useCallback(async (customPayload = null) => {
    setIsLoadingDmaForecast(true);
    const p = customPayload || dmaPayloadRef.current;
    try {
      const res = await fetchSynopticForecast(p);
      if (res && res.precipitation) {
        setDmaForecast(res);
      }
    } catch (err) {
      console.warn('Error fetching DMA synoptic forecast:', err);
    } finally {
      setIsLoadingDmaForecast(false);
    }
  }, []);

  const lastSectorKeyRef = useRef('');

  // Update payload & load telemetry when target district/sector changes
  useEffect(() => {
    if (lastSectorKeyRef.current === selectedSectorId) {
      return;
    }
    lastSectorKeyRef.current = selectedSectorId;

    const sectorPayload = SECTOR_PAYLOAD_MAP[selectedSectorId] || {
      ...DEFAULT_DMA_PAYLOAD,
      latitude: selectedSector?.center?.[0] || 22.7196,
      longitude: selectedSector?.center?.[1] || 75.8577
    };

    dmaPayloadRef.current = sectorPayload;
    setDmaPayload(sectorPayload);
    refreshDmaForecast(sectorPayload);
  }, [selectedSectorId, refreshDmaForecast]);

  // Map Filter states
  const [mapHazardFilter, setMapHazardFilter] = useState('all'); // 'all' | 'rainfall' | 'flood' | 'heat' | 'wind' | 'thunderstorm'
  const [mapRiskFilter, setMapRiskFilter] = useState('all'); // 'all' | 'critical' | 'vigilant' | 'nominal'
  const [mapTimeHorizon, setMapTimeHorizon] = useState('now'); // 'now' | '6h' | '12h' | '24h'
  const [showDrainageHatching, setShowDrainageHatching] = useState(true);

  // Alerts Desk Filters
  const [alertLocationFilter, setAlertLocationFilter] = useState('All Locations (Malwa & Narmada)');
  const [alertHazardFilter, setAlertHazardFilter] = useState('All Hazards');
  const [alertSeverityFilter, setAlertSeverityFilter] = useState('All Severities');
  const [alertStatusFilter, setAlertStatusFilter] = useState('All Statuses');
  const [alertTimeFilter, setAlertTimeFilter] = useState('Last 6 Hours');

  // Protocol Checklist State for Selected Alert
  const [protocolChecklist, setProtocolChecklist] = useState({
    reviewRisk: true,
    notifyCollector: false,
    monitorTelemetry: false,
    standbySDRF: false
  });

  // Safety Guardrails Settings
  const [safetyGuardrails, setSafetyGuardrails] = useState({
    requireEmergencyConfirmation: true,
    requireHumanReviewAI: true,
    alertPriorityThreshold: 'Critical'
  });

  // Monitoring Preferences
  const [monitoringPrefs, setMonitoringPrefs] = useState({
    macroZone: 'Central & Western Corridor',
    state: 'Madhya Pradesh',
    priorityCluster: 'Indore, Dewas & Ujjain Priority Cluster',
    monitoredHazards: ['Heavy Rainfall', 'Flood & Inundation', 'Heat Wave', 'Strong Wind & Squall', 'Thunderstorm & Lightning', 'Extreme Temperature', 'Riverine Surge'],
    defaultMapLayer: 'All Hazards',
    defaultForecastWindow: 'Next 6 Hours (Selected)'
  });

  // Notification Matrix
  const [notificationMatrix, setNotificationMatrix] = useState({
    criticalRisk: { inApp: true, sms: true, email: true },
    highRisk: { inApp: true, sms: true, email: false },
    incidentUpdates: { inApp: true, sms: false, email: true },
    emergencyConfirmations: { inApp: true, sms: true, email: true }
  });

  // Modals & Panels State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showOfficialAlertModal, setShowOfficialAlertModal] = useState(false);
  const [showPublicAdvisoryModal, setShowPublicAdvisoryModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showReadinessAuditModal, setShowReadinessAuditModal] = useState(false);
  const [showIncidentDetailsModal, setShowIncidentDetailsModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConfirmDispatchModal, setShowConfirmDispatchModal] = useState(false);
  const [dispatchModalData, setDispatchModalData] = useState(null);

  // Global Toast
  const [dmaToast, setDmaToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setDmaToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setDmaToast(null);
    }, 4000);
  };

  // Helper getters
  const selectedSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];
  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  // Action methods
  const handleToggleProtocol = (key) => {
    setProtocolChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTriggerEmergencyBroadcast = (broadcastData) => {
    const newLog = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      title: `Emergency Cell Broadcast sent to ${broadcastData.targetArea || selectedSector.name}`,
      desc: `CAP Common Alerting Protocol Push (${broadcastData.severity || 'CRITICAL'} Siren Tone)`,
      status: 'Delivered',
      statusClass: 'text-emerald-700 font-bold',
      icon: 'Radio',
      iconColor: 'text-emerald-600'
    };
    setDispatchLogs(prev => [newLog, ...prev]);
    showToast(`Emergency Cell Broadcast dispatched to ${broadcastData.targetArea || selectedSector.name} telecom towers with IAS cryptographic verification.`, 'success');
  };

  const handleSendOfficialAlert = (alertData) => {
    const newLog = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      title: `Official Emergency Alert issued to ${alertData?.recipient || 'District Collectorate & Municipal EOC'}`,
      desc: `Mandated Dispatch Code: ${alertData?.code || 'EOC-MP04-HR-FLASH-0914'} (${alertData?.hazard || 'Heavy Rainfall'})`,
      status: 'Delivered',
      statusClass: 'text-emerald-700 font-bold',
      icon: 'CheckCircle2',
      iconColor: 'text-emerald-600'
    };
    setDispatchLogs(prev => [newLog, ...prev]);
    showToast(`Official Alert ${alertData?.code || 'EOC-MP04-HR-FLASH-0914'} successfully delivered to District Magistrate & Municipal EOC.`, 'success');
  };

  const handlePublishPublicAdvisory = (advisoryText, lang = 'EN') => {
    const newLog = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      title: `Public Advisory approved & published across citizen channels (${lang})`,
      desc: advisoryText.substring(0, 80) + '...',
      status: 'Published',
      statusClass: 'text-emerald-700 font-bold',
      icon: 'Radio',
      iconColor: 'text-emerald-600'
    };
    setDispatchLogs(prev => [newLog, ...prev]);
    showToast('AI-Assisted Public Advisory approved and published across civic portals and media wires.', 'success');
  };

  const handleEscalateIncident = (escalationData) => {
    const newLog = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      title: `Incident escalated to ${escalationData?.targetAgency || 'SDMA & NDMA National Desk'}`,
      desc: `High priority protocol initiated for ${escalationData?.location || selectedSector.name}`,
      status: 'In Review',
      statusClass: 'text-amber-700 font-bold',
      icon: 'AlertTriangle',
      iconColor: 'text-amber-600'
    };
    setDispatchLogs(prev => [newLog, ...prev]);
    showToast(`Incident successfully escalated to State EOC Director & NDMA Coordination Desk.`, 'warning');
  };

  const handleUpdateIncidentStatus = (incidentId, newStatus) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          responseStatus: newStatus,
          responseBadgeClass: newStatus === 'Resolved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : newStatus === 'Response Initiated' ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-amber-100 text-amber-800 border-amber-300'
        };
      }
      return inc;
    }));
    showToast(`Incident ${incidentId} response status updated to "${newStatus}".`, 'info');
  };

  const value = {
    dmaTab,
    setDmaTab,
    officerUser,
    setOfficerUser,
    selectedSectorId,
    setSelectedSectorId,
    selectedSector,
    selectedAlertId,
    setSelectedAlertId,
    selectedAlert,
    selectedIncidentId,
    setSelectedIncidentId,
    selectedIncident,
    sectors,
    setSectors,
    alerts,
    setAlerts,
    incidents,
    setIncidents,
    dispatchLogs,
    setDispatchLogs,
    escalations,
    setEscalations,
    mapHazardFilter,
    setMapHazardFilter,
    mapRiskFilter,
    setMapRiskFilter,
    mapTimeHorizon,
    setMapTimeHorizon,
    showDrainageHatching,
    setShowDrainageHatching,
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
    protocolChecklist,
    handleToggleProtocol,
    safetyGuardrails,
    setSafetyGuardrails,
    monitoringPrefs,
    setMonitoringPrefs,
    notificationMatrix,
    setNotificationMatrix,
    showBroadcastModal,
    setShowBroadcastModal,
    showOfficialAlertModal,
    setShowOfficialAlertModal,
    showPublicAdvisoryModal,
    setShowPublicAdvisoryModal,
    showEscalateModal,
    setShowEscalateModal,
    showReadinessAuditModal,
    setShowReadinessAuditModal,
    showIncidentDetailsModal,
    setShowIncidentDetailsModal,
    showNotifications,
    setShowNotifications,
    showConfirmDispatchModal,
    setShowConfirmDispatchModal,
    dispatchModalData,
    setDispatchModalData,
    dmaToast,
    showToast,
    dmaPayload,
    setDmaPayload,
    dmaForecast,
    setDmaForecast,
    isLoadingDmaForecast,
    refreshDmaForecast,
    handleTriggerEmergencyBroadcast,
    handleSendOfficialAlert,
    handlePublishPublicAdvisory,
    handleEscalateIncident,
    handleUpdateIncidentStatus
  };

  return (
    <DisasterManagementContext.Provider value={value}>
      {children}
    </DisasterManagementContext.Provider>
  );
}

export function useDisasterManagement() {
  const context = useContext(DisasterManagementContext);
  if (!context) {
    throw new Error('useDisasterManagement must be used within DisasterManagementProvider');
  }
  return context;
}
