// src/context/DisasterManagementContext.jsx
import React, { createContext, useContext, useState } from 'react';
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
