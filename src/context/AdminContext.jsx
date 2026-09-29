// src/context/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ADMIN_PROFILE,
  ADMIN_KPI_SUMMARY,
  LIVE_DATA_SYNC_PIPELINES,
  OFFICIAL_REGISTRATION_QUEUE,
  SYSTEM_HEALTH_SERVICES,
  SYSTEM_RESOURCE_METRICS,
  SYSTEM_FAILURES_SUMMARY,
  ADMIN_ACTIVITY_AUDIT,
  SYSTEM_EVENTS_LOGS,
  CONFIGURATION_SETTINGS,
  RECENT_CONFIG_MUTATIONS
} from '../data/adminData.js';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  // Navigation State
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard', 'data-models', 'approvals', 'logs', 'config'

  // Operational State
  const [pipelines, setPipelines] = useState(LIVE_DATA_SYNC_PIPELINES);
  const [registrationQueue, setRegistrationQueue] = useState(OFFICIAL_REGISTRATION_QUEUE);
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);
  const [systemLogs, setSystemLogs] = useState(SYSTEM_EVENTS_LOGS);
  const [configSettings, setConfigSettings] = useState(CONFIGURATION_SETTINGS);
  const [configMutations, setConfigMutations] = useState(RECENT_CONFIG_MUTATIONS);
  const [failuresSummary, setFailuresSummary] = useState(SYSTEM_FAILURES_SUMMARY);
  const [activityAudit, setActivityAudit] = useState(ADMIN_ACTIVITY_AUDIT);
  const [healthServices, setHealthServices] = useState(SYSTEM_HEALTH_SERVICES);
  const [resourceMetrics, setResourceMetrics] = useState(SYSTEM_RESOURCE_METRICS);

  // Operational Warning Banner State
  const [bannerAcknowledged, setBannerAcknowledged] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Modals & Drawers State
  const [activeModal, setActiveModal] = useState(null); // 'review-docs', 'crypto-auth', 'diagnostics', 'edit-config', 'view-log-drawer'
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedLogItem, setSelectedLogItem] = useState(null);
  const [selectedConfigItem, setSelectedConfigItem] = useState(null);
  const [diagnosticsTarget, setDiagnosticsTarget] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', description = '') => {
    setToast({ id: Date.now(), message, type, description });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const closeToast = () => setToast(null);

  // Acknowledge Warning Banner
  const acknowledgeWarningBanner = () => {
    setBannerAcknowledged(true);
    showToast('Operational Alert Acknowledged', 'info', 'Zone Central-02 telemetry monitoring priority elevated.');
  };

  // Trigger Manual Pipeline Resync
  const triggerPipelineResync = (pipelineId) => {
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id === pipelineId || !pipelineId) {
          return {
            ...p,
            status: 'Processing',
            statusType: 'warning',
            updated: 'Syncing right now...',
            stage: 'Re-ingesting GRIB2 data stream...'
          };
        }
        return p;
      })
    );

    showToast('Pipeline Re-sync Initiated', 'info', 'GovNIC ingestion handshake dispatched across edge nodes.');

    setTimeout(() => {
      setPipelines((prev) =>
        prev.map((p) => {
          if (p.id === pipelineId || !pipelineId) {
            return {
              ...p,
              status: 'Success',
              statusType: 'success',
              updated: 'Just now',
              stage: 'Synthesized & Mosaic Rendered',
              latency: `${Math.floor(Math.random() * 10) + 6}ms`
            };
          }
          return p;
        })
      );
      showToast('Data Pipeline Re-synced', 'success', 'All isobaric grid parameters verified & cached.');
    }, 2400);
  };

  // Registration Selection for Batch Approval
  const toggleSelectRegistration = (id) => {
    setSelectedRegistrations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllRegistrations = () => {
    if (selectedRegistrations.length === registrationQueue.length) {
      setSelectedRegistrations([]);
    } else {
      setSelectedRegistrations(registrationQueue.map((item) => item.id));
    }
  };

  // Review Documents Modal
  const openReviewDocs = (applicant) => {
    setSelectedApplicant(applicant);
    setActiveModal('review-docs');
  };

  // Confirm Crypto Auth Modal
  const openCryptoAuthModal = (applicantOrBatch) => {
    setSelectedApplicant(applicantOrBatch || null);
    setActiveModal('crypto-auth');
  };

  // Open Diagnostics Modal
  const openDiagnostics = (targetInfo = null) => {
    setDiagnosticsTarget(targetInfo || {
      title: 'AI Neural Inference Service',
      node: 'Zone Central-02 (AI-02)',
      code: 'WARN_QUEUE_LATENCY_THRESHOLD_EXCEEDED',
      vram: '89.4%',
      batchQueue: 142,
      failover: 'node-central-02-standby'
    });
    setActiveModal('diagnostics');
  };

  // Approve Official Account
  const approveApplicant = (applicantId) => {
    const applicant = registrationQueue.find((a) => a.id === applicantId);
    setRegistrationQueue((prev) => prev.filter((a) => a.id !== applicantId));
    setSelectedRegistrations((prev) => prev.filter((id) => id !== applicantId));
    
    // Add to audit trail
    setActivityAudit((prev) => [
      {
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        action: 'Approved',
        desc: `${applicant?.applicant || 'Official'} (${applicant?.role || 'Authority'}) account verified & cryptographic token issued.`
      },
      ...prev
    ]);

    showToast('Official Account Authorized', 'success', `Gazetted clearance issued for ${applicant?.applicant || 'User'}`);
    setActiveModal(null);
  };

  // Reject Official Account
  const rejectApplicant = (applicantId, reason = 'Verification requirements not satisfied') => {
    const applicant = registrationQueue.find((a) => a.id === applicantId);
    setRegistrationQueue((prev) => prev.filter((a) => a.id !== applicantId));
    setSelectedRegistrations((prev) => prev.filter((id) => id !== applicantId));

    setActivityAudit((prev) => [
      {
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        action: 'Rejected',
        desc: `Registration for ${applicant?.applicant || 'Applicant'} rejected: ${reason}`
      },
      ...prev
    ]);

    showToast('Registration Rejected', 'error', `Application ${applicantId} has been revoked.`);
    setActiveModal(null);
  };

  // Batch Approve Selected
  const batchApproveSelected = () => {
    const count = selectedRegistrations.length;
    setRegistrationQueue((prev) => prev.filter((a) => !selectedRegistrations.includes(a.id)));
    
    setActivityAudit((prev) => [
      {
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        action: 'Batch Approved',
        desc: `Batch cryptographic clearance issued for ${count} official accounts by Admin SEC-01.`
      },
      ...prev
    ]);

    setSelectedRegistrations([]);
    showToast('Batch Authorization Complete', 'success', `${count} official government accounts issued Tier-1 clearance.`);
    setActiveModal(null);
  };

  // Log Management
  const resolveLogEvent = (logId) => {
    setSystemLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          return {
            ...log,
            status: 'Resolved',
            statusClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            severity: 'Resolved',
            severityClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            isActive: false,
            currentStatus: 'Resolved (Admin SEC-01)',
            progression: [
              ...log.progression.filter(p => !p.step.includes('Resolved')),
              { step: 'Step 5: Resolved & Verified', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST', desc: 'Resolved by Tier-1 System Administrator' }
            ]
          };
        }
        return log;
      })
    );

    // Also update failures summary if matching
    setFailuresSummary((prev) =>
      prev.map((f) => (f.title.includes('GPU Memory') && logId.includes('8841') ? { ...f, severity: 'Resolved', severityClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' } : f))
    );

    showToast('Incident Resolved', 'success', `Event ${logId} marked resolved and archived to audit log.`);
    if (activeModal === 'view-log-drawer') {
      setActiveModal(null);
    }
  };

  const acknowledgeLogEvent = (logId) => {
    setSystemLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          return {
            ...log,
            status: 'Acknowledged',
            statusClass: 'bg-sky-50 text-sky-800 border-sky-200',
            currentStatus: 'Acknowledged by Admin SEC-01'
          };
        }
        return log;
      })
    );
    showToast('Event Acknowledged', 'info', `Event ${logId} claimed by System Administrator.`);
  };

  // Open Edit Config Modal
  const openEditConfigModal = (configItem) => {
    setSelectedConfigItem(configItem);
    setActiveModal('edit-config');
  };

  // Save Configuration Parameter
  const saveConfigParameter = (sectionKey, configId, newValue, note = 'Updated by System Administrator') => {
    let prevVal = '';
    let settingTitle = '';

    setConfigSettings((prev) => {
      const updatedSection = (prev[sectionKey] || []).map((item) => {
        if (item.id === configId) {
          prevVal = item.value;
          settingTitle = item.title;
          return { ...item, value: newValue, currentValue: newValue };
        }
        return item;
      });
      return { ...prev, [sectionKey]: updatedSection };
    });

    // Add mutation log
    setConfigMutations((prev) => [
      {
        timestamp: 'Just now, ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        setting: settingTitle || configId,
        prevValue: prevVal || 'Previous',
        newValue: newValue,
        changedBy: 'Admin SEC-01',
        reason: note,
        status: 'Applied (Verified)'
      },
      ...prev
    ]);

    showToast('Configuration Updated', 'success', `${settingTitle} parameter set to "${newValue}".`);
    setActiveModal(null);
  };

  // Refresh Dashboard & Sync
  const refreshDashboard = () => {
    setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    showToast('System Telemetry Synced', 'info', 'Polled 6 core microservices, 4 pipelines and GovNIC edge.');
  };

  return (
    <AdminContext.Provider
      value={{
        adminProfile: ADMIN_PROFILE,
        adminKpiSummary: ADMIN_KPI_SUMMARY,
        adminTab,
        setAdminTab,
        pipelines,
        registrationQueue,
        selectedRegistrations,
        toggleSelectRegistration,
        selectAllRegistrations,
        systemLogs,
        configSettings,
        configMutations,
        failuresSummary,
        activityAudit,
        healthServices,
        resourceMetrics,
        bannerAcknowledged,
        acknowledgeWarningBanner,
        isLiveStreaming,
        setIsLiveStreaming,
        lastSyncTime,
        refreshDashboard,
        triggerPipelineResync,
        activeModal,
        setActiveModal,
        selectedApplicant,
        setSelectedApplicant,
        selectedLogItem,
        setSelectedLogItem,
        selectedConfigItem,
        diagnosticsTarget,
        openReviewDocs,
        openCryptoAuthModal,
        openDiagnostics,
        approveApplicant,
        rejectApplicant,
        batchApproveSelected,
        resolveLogEvent,
        acknowledgeLogEvent,
        openEditConfigModal,
        saveConfigParameter,
        toast,
        showToast,
        closeToast
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
