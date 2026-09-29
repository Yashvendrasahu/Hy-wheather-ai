// src/data/adminData.js
// Comprehensive realistic mock data for the Administrator Role of WeatherAI / Mausam Suraksha

export const ADMIN_PROFILE = {
  name: 'Rajesh K. Verma, IAS',
  shortName: 'Admin SEC-01',
  role: 'System Administrator (Tier-1 Operations)',
  roleShort: 'System Administrator',
  title: 'Joint Secretary / Principal Systems Director',
  department: 'National Meteorological Operations & Cyber-Security',
  organization: 'Ministry of Earth Sciences (MoES) & NDMA Civic Infrastructure',
  jurisdiction: 'NATIONAL WEATHER DATA GRID (ZONE CENTRAL)',
  email: 'r.verma@gov.nic.in',
  phone: '+91 98201 44821',
  clearance: 'Tier-1 PKI Cryptographic Authorization (Valid till 2027)',
  node: 'SEC-01 (Zone Central)',
  uptime: '99.98%',
  status: 'Active Gazetted Officer',
  authRef: 'GOV-IN-9942',
  lastProfileUpdate: '14 Oct 2025'
};

export const ADMIN_KPI_SUMMARY = {
  dataPipeline: { active: 3, total: 3, status: 'Healthy', note: 'GFS, NCUM, Nowcast' },
  featureVerification: { loaded: 38, total: 38, status: 'Verified', note: 'Isobaric & Radar Grids' },
  systemLatency: { value: 14, unit: 'ms', status: 'Normal', note: 'GovNIC Gateway Edge' },
  pendingVerification: { count: 5, status: 'Needs Review', note: '3 Met, 2 Disaster Auth' }
};

export const LIVE_DATA_SYNC_PIPELINES = [
  {
    id: 'pipe-gfs',
    source: 'NOAA GFS Global Forecast System',
    subSource: '0.25° Resolution Grid',
    run: '12Z Cycle Run',
    status: 'Success',
    statusType: 'success',
    stage: 'Processed & Vectorized',
    updated: 'Updated 2m ago',
    badge: 'Healthy',
    latency: '8ms'
  },
  {
    id: 'pipe-ncum',
    source: 'IMD / NCMRWF NCUM Regional Model',
    subSource: '4km Unified Model Sub-grid',
    run: '06Z Synoptic Grid',
    status: 'Success',
    statusType: 'success',
    stage: 'Validated & Ingested',
    updated: 'Updated 4m ago',
    badge: 'Healthy',
    latency: '14ms'
  },
  {
    id: 'pipe-nowcast',
    source: 'WeatherAI DeepNowcast Neural Model',
    subSource: 'High-Frequency Radar Extrapolation',
    run: 'T+15m Live Inference',
    status: 'Processing',
    statusType: 'warning',
    stage: 'Tensor Batching (84%)',
    progress: 84,
    updated: 'Updated 45s ago',
    badge: 'Processing',
    latency: '42ms'
  },
  {
    id: 'pipe-radar',
    source: 'Doppler Radar Composite Network',
    subSource: '34 S/C-Band Radars Aggregated',
    run: 'Volume Scan #42',
    status: 'Success',
    statusType: 'success',
    stage: 'Synthesized & Mosaic Rendered',
    updated: 'Updated 1m ago',
    badge: 'Healthy',
    latency: '12ms'
  }
];

export const OFFICIAL_REGISTRATION_QUEUE = [
  {
    id: 'NIC-AUTH-8821',
    applicant: 'Dr. Aarti Sen (PhD)',
    avatar: 'AS',
    role: 'Meteorologist Level 4',
    roleTag: 'met',
    organization: 'IMD Western Regional Meteorological Centre',
    email: 'aarti.sen@imd.gov.in',
    phone: '+91 98201 55432',
    designation: "Scientist 'E' / Senior Lead",
    jurisdiction: 'Maharashtra & Gujarat Offshore (Western Division Radar Stations)',
    submissionTime: 'Today, 11:20 AM',
    submissionDate: '24 Oct 2025, 11:20 IST via GovNIC Portal',
    artifact: 'Gazette ID & MoES Token',
    artifactStatus: 'Docs Uploaded',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    govId: 'MoES-GOV-ID-2018-9941',
    gazetteToken: 'GAZ-MET-LVL4-2023-B',
    domainValidation: 'gov.in MX Verified',
    clearanceStatus: 'Tier-1 Scientific Clearance',
    docs: [
      { name: 'MoES Official Gazetted Officer ID', size: 'PDF, 2.4 MB • Signed via NIC Digital Key', status: 'Verified' },
      { name: 'IMD Synoptic Station Authorization Order', size: 'PDF, 1.1 MB • Endorsed by Deputy Director IMD', status: 'Verified' },
      { name: 'Aadhaar / GovNIC Identity Proof', size: 'PDF, 890 KB • Cryptographically Sealed', status: 'Verified' }
    ]
  },
  {
    id: 'NIC-AUTH-7419',
    applicant: 'Vikramaditya Rathore',
    avatar: 'VR',
    role: 'Disaster Management Authority',
    roleTag: 'dma',
    organization: 'State EOC Rajasthan & SDRF Liaison',
    email: 'v.rathore@rajasthan.gov.in',
    phone: '+91 94140 88210',
    designation: 'State EOC Joint Director & SDRF Commander',
    jurisdiction: 'Rajasthan State & Aravalli Western Corridor',
    submissionTime: 'Today, 09:45 AM',
    submissionDate: '24 Oct 2025, 09:45 IST via GovNIC Portal',
    artifact: 'GovNIC 2FA Token Attached',
    artifactStatus: 'Requires Review',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    govId: 'RAJ-EOC-DIR-2021-4410',
    gazetteToken: 'GAZ-EOC-LVL4-2024-R',
    domainValidation: 'rajasthan.gov.in Verified',
    clearanceStatus: 'Tier-1 Disaster Ops Clearance',
    docs: [
      { name: 'Rajasthan State Disaster Management Commission Order', size: 'PDF, 3.1 MB • Signed by Principal Secretary', status: 'Verified' },
      { name: 'SDRF Radio Network Authorization Key', size: 'PDF, 950 KB • Encrypted', status: 'Verified' }
    ]
  },
  {
    id: 'NIC-AUTH-6502',
    applicant: 'Dr. K. Ramanathan',
    avatar: 'KR',
    role: 'Senior Synoptic Analyst',
    roleTag: 'met',
    organization: 'NCMRWF Noida Atmospheric Centre',
    email: 'k.raman@ncmrwf.gov.in',
    phone: '+91 98110 33219',
    designation: "Scientist 'F' / Numerical Modeling Head",
    jurisdiction: 'Northern Grid & Himalayan Orographic Radar Mesh',
    submissionTime: 'Yesterday, 16:30 PM',
    submissionDate: '23 Oct 2025, 16:30 IST via GovNIC Portal',
    artifact: 'Pending Verification',
    artifactStatus: 'Pending Verification',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    govId: 'NCMRWF-NWP-2015-1108',
    gazetteToken: 'GAZ-NWP-LVL4-2022-N',
    domainValidation: 'ncmrwf.gov.in Verified',
    clearanceStatus: 'Tier-1 High-Performance NWP Clearance',
    docs: [
      { name: 'NCMRWF HPC Atmospheric Ingestion Mandate', size: 'PDF, 1.8 MB • Signed by Director General', status: 'Verified' }
    ]
  },
  {
    id: 'NIC-AUTH-5912',
    applicant: 'Shweta Mukherjee (IAS)',
    avatar: 'SM',
    role: 'Disaster Management Authority',
    roleTag: 'dma',
    organization: 'WB Disaster Mitigation Dept',
    email: 's.mukherjee@wb.gov.in',
    phone: '+91 98300 77120',
    designation: 'Special Relief Commissioner & Secretary',
    jurisdiction: 'Bay of Bengal Coastal Cyclone Corridor',
    submissionTime: 'Yesterday, 14:15 PM',
    submissionDate: '23 Oct 2025, 14:15 IST via GovNIC Portal',
    artifact: 'Docs Uploaded',
    artifactStatus: 'Docs Uploaded',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    govId: 'WB-IAS-DIS-2019-7711',
    gazetteToken: 'GAZ-WB-IAS-2023-M',
    domainValidation: 'wb.gov.in Verified',
    clearanceStatus: 'Tier-1 Coastal Emergency Clearance',
    docs: [
      { name: 'Govt of West Bengal Departmental Gazetted Notification', size: 'PDF, 2.7 MB', status: 'Verified' }
    ]
  },
  {
    id: 'NIC-AUTH-4820',
    applicant: 'Prof. Arvind Joshi',
    avatar: 'AJ',
    role: 'Meteorologist Level 3',
    roleTag: 'met',
    organization: 'IITM Pune Center',
    email: 'arvind.j@iitm.res.in',
    phone: '+91 94220 11984',
    designation: 'Senior Climate Dynamics Researcher',
    jurisdiction: 'Western Ghats Orographic Cloud Physics Cluster',
    submissionTime: '22 Oct, 17:00 PM',
    submissionDate: '22 Oct 2025, 17:00 IST via GovNIC Portal',
    artifact: 'Requires Attention',
    artifactStatus: 'Requires Attention',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    govId: 'IITM-RES-2020-0941',
    gazetteToken: 'GAZ-RES-LVL3-2024-P',
    domainValidation: 'iitm.res.in Verified',
    clearanceStatus: 'Tier-2 Academic Research Access',
    docs: [
      { name: 'IITM Pune Research Fellowship Credential', size: 'PDF, 1.4 MB', status: 'Needs Review' }
    ]
  }
];

export const SYSTEM_HEALTH_SERVICES = [
  { name: 'Core API Gateway', uptime: '99.99%', latency: '8ms', status: 'Healthy', statusType: 'healthy' },
  { name: 'Data Ingestion Tile Processor', uptime: '100%', latency: '12ms', status: 'Healthy', statusType: 'healthy' },
  { name: 'Forecast Synthesis Pipeline', uptime: '99.95%', latency: '19ms', status: 'Healthy', statusType: 'healthy' },
  { name: 'PostgreSQL GovCloud Cluster', tier: 'Tier-4 • Primary Synced', status: 'Healthy', statusType: 'healthy' },
  { name: 'Emergency Notification Siren', queue: '100% Delivery Queue Ready', status: 'Healthy', statusType: 'healthy' },
  { name: 'Synoptic Radar Archive', capacity: '42.8 TB / 100 TB Allocated', status: 'Healthy', statusType: 'healthy' }
];

export const SYSTEM_RESOURCE_METRICS = {
  computeLoad: { percent: 46, detail: '32 Cores' },
  memoryUtilization: { percent: 61, detail: '128 GB ECC' },
  ingestionQueue: { current: 18, max: 5000, label: 'tasks' },
  encryptedStorage: { percent: 42.8, detail: '100 TB NetApp' }
};

export const SYSTEM_FAILURES_SUMMARY = [
  {
    id: 'fail-1',
    title: 'High GPU Memory Pressure (89%)',
    severity: 'Warning',
    severityClass: 'bg-amber-50 text-amber-800 border-amber-200',
    note: 'Node: AI Inference Node 02 • Auto-scaling initiated',
    time: '13:48 IST',
    action: 'Inspect Log'
  },
  {
    id: 'fail-2',
    title: 'Data packet dropped from AWS Bhuj',
    severity: 'Resolved',
    severityClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    note: 'Doppler Mosaic S-Band • Re-established via secondary microwave link',
    time: '11:15 IST',
    action: 'View Audit'
  },
  {
    id: 'fail-3',
    title: 'Carrier Gateway Timeout Handshake',
    severity: 'Closed',
    severityClass: 'bg-slate-100 text-slate-700 border-slate-200',
    note: 'Cell Broadcast Mock Sandbox • Staging handshake test completed',
    time: '08:30 IST',
    action: 'Archived'
  }
];

export const ADMIN_ACTIVITY_AUDIT = [
  { time: '13:10 IST', action: 'Approved', desc: 'Rajesh Verma (IAS) authority permissions re-validated by Admin SEC-01.' },
  { time: '12:45 IST', action: 'Success', desc: 'IMD Doppler Radar AWS-42680 connection reset and calibrated.' },
  { time: '10:15 IST', action: 'Applied', desc: 'System Configuration updated: Alert auto-dispatch threshold set to SOP-2025.' },
  { time: '09:00 IST', action: 'Verified', desc: 'Daily cryptographic hash validation on historical disaster archive.' }
];

export const SYSTEM_EVENTS_LOGS = [
  {
    id: 'LOG-2025-8841',
    time: '14:26 IST',
    service: 'AI Processing',
    serviceTag: 'ai',
    description: 'GPU Memory Pressure & Batch Delay',
    detail: 'Worker pool nowcast-worker-02a throttle',
    severity: 'Warning',
    severityClass: 'bg-amber-50 text-amber-800 border-amber-200',
    status: 'Investigating',
    statusClass: 'bg-amber-100 text-amber-900 border-amber-300',
    duration: '14m active',
    isActive: true,
    impactStatement: 'AI DeepNowcast inference cycle queue latency elevated to 42ms. Blended nowcast output delayed by ~3 minutes; core GFS/NCUM numerical forecast generation remains unaffected.',
    detected: '24 Oct 2025, 14:26:12 IST',
    lastUpdated: '14:38:05 IST (2m ago)',
    currentStatus: 'Investigating (Admin SEC-01)',
    progression: [
      { step: 'Step 1: Detected', time: '14:26:12 IST', desc: 'Prometheus alert threshold breached (>85% VRAM)' },
      { step: 'Step 2: Investigation Started', time: '14:28:40 IST', desc: 'Assigned to SecOps on-call pool' },
      { step: 'Step 3: Acknowledged', time: '14:31:00 IST', desc: 'Claimed by Admin SEC-01' },
      { step: 'Step 4: Remediation in Progress', time: '14:35:10 IST', desc: 'Worker node auto-scaling initiated on Zone Central-02' },
      { step: 'Step 5: Resolved & Verified', time: 'Pending', desc: 'Pending telemetry clearance and zero queue backlog' }
    ],
    diagnostics: {
      subsystem: 'ai_inference_worker_pool',
      pod: 'nowcast-worker-02a',
      gpu_utilization_pct: 89.4,
      batch_queue_depth: 142,
      throttle_reason: 'VRAM_SPIKE_TENSOR_EXTRAPOLATION',
      failover_target: 'node-central-02-standby',
      error_code: 'WARN_QUEUE_LATENCY_THRESHOLD_EXCEEDED'
    }
  },
  {
    id: 'LOG-2025-8839',
    time: '14:18 IST',
    service: 'Data Pipeline',
    serviceTag: 'data',
    description: 'NCUM Regional 06Z Cycle Timeout Retry (2/3)',
    detail: 'Upstream IMD FTP gateway response delay',
    severity: 'Warning',
    severityClass: 'bg-amber-50 text-amber-800 border-amber-200',
    status: 'Acknowledged',
    statusClass: 'bg-sky-50 text-sky-800 border-sky-200',
    duration: '22m active',
    impactStatement: 'Minor 5-minute lag in regional 4km high-res unified model ingestion. Secondary queue operational.',
    detected: '24 Oct 2025, 14:18:00 IST',
    lastUpdated: '14:30:00 IST',
    currentStatus: 'Acknowledged',
    progression: [
      { step: 'Step 1: Detected', time: '14:18:00 IST', desc: 'FTP timeout on NCUM primary mirror' },
      { step: 'Step 2: Retry Initiated', time: '14:22:00 IST', desc: 'Switched to backup mirror in Pune' }
    ],
    diagnostics: {
      subsystem: 'ncmrwf_ingest_gateway',
      host: 'ftp.imd.gov.in',
      retry_attempt: '2 of 3',
      timeout_ms: 45000,
      mirror: 'in-pun-ncmrwf-b01'
    }
  },
  {
    id: 'LOG-2025-8835',
    time: '13:50 IST',
    service: 'Storage',
    serviceTag: 'storage',
    description: 'Synoptic Radar Archive Volume Scan Snapshot',
    detail: 'Hourly raster multi-band tier cold migration',
    severity: 'Info',
    severityClass: 'bg-slate-50 text-slate-700 border-slate-200',
    status: 'Resolved',
    statusClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    duration: '42s duration',
    impactStatement: 'Automated snapshot backup completed. 34 radar mosaic files stored to GovCloud cold vault.',
    detected: '24 Oct 2025, 13:50:00 IST',
    lastUpdated: '13:50:42 IST',
    currentStatus: 'Resolved',
    progression: [
      { step: 'Step 1: Backup Initiated', time: '13:50:00 IST', desc: 'Cold storage archive job started' },
      { step: 'Step 2: Snapshot Complete', time: '13:50:42 IST', desc: 'SHA-256 hash verified' }
    ],
    diagnostics: {
      job_id: 'cron_radar_snapshot_hourly',
      files_migrated: 34,
      volume_mb: 840,
      hash: 'sha256:88fa2901...verified'
    }
  },
  {
    id: 'LOG-2025-8830',
    time: '13:10 IST',
    service: 'Auth Gateway',
    serviceTag: 'auth',
    description: 'GovNIC 2FA Token Validation Handshake',
    detail: 'Automated daily certificate rotation refresh',
    severity: 'Info',
    severityClass: 'bg-slate-50 text-slate-700 border-slate-200',
    status: 'Resolved',
    statusClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    duration: '180ms',
    impactStatement: 'PKI certificate validation completed for all 4 active EOC stations.',
    detected: '24 Oct 2025, 13:10:00 IST',
    lastUpdated: '13:10:01 IST',
    currentStatus: 'Resolved',
    progression: [
      { step: 'Step 1: Handshake Sent', time: '13:10:00 IST', desc: 'NIC Parichay SSO ping' },
      { step: 'Step 2: Authenticated', time: '13:10:01 IST', desc: 'TLS 1.3 session renewed' }
    ],
    diagnostics: {
      sso_provider: 'NIC_PARICHAY_GOV_IN',
      protocol: 'FIPS-140-3',
      session_keys_rotated: 14
    }
  },
  {
    id: 'LOG-2025-8824',
    time: '12:45 IST',
    service: 'Data Pipeline',
    serviceTag: 'data',
    description: 'AWS Bhuj Radar Link Microwave Packet Jitter',
    detail: 'Dual-carrier redundant link re-routing',
    severity: 'Warning',
    severityClass: 'bg-amber-50 text-amber-800 border-amber-200',
    status: 'Resolved',
    statusClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    duration: '8m duration',
    impactStatement: 'Packet loss normalized following failover to secondary microwave beam.',
    detected: '24 Oct 2025, 12:45:00 IST',
    lastUpdated: '12:53:00 IST',
    currentStatus: 'Resolved',
    progression: [
      { step: 'Step 1: Jitter Flagged', time: '12:45:00 IST', desc: 'Packet loss reached 4.2%' },
      { step: 'Step 2: Failover Re-route', time: '12:48:00 IST', desc: 'Switched to BSNL fiber uplink' },
      { step: 'Step 3: Restored', time: '12:53:00 IST', desc: 'Telemetry jitter < 2ms' }
    ],
    diagnostics: {
      radar_station: 'DWR_BHUJ_S_BAND',
      primary_carrier: 'Microwave_LineOfSight',
      failover_carrier: 'GovNet_Fiber_Ring',
      packet_loss_current: '0.01%'
    }
  },
  {
    id: 'LOG-2025-8818',
    time: '11:30 IST',
    service: 'Forecast Engine',
    serviceTag: 'forecast',
    description: 'GFS 12Z Global Grid Parsing & Feature QA',
    detail: 'NOAA multi-point spatial interpolation passed',
    severity: 'Info',
    severityClass: 'bg-slate-50 text-slate-700 border-slate-200',
    status: 'Resolved',
    statusClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    duration: '95ms',
    impactStatement: 'All 38 isobaric weather vectors verified and uploaded to live database cache.',
    detected: '24 Oct 2025, 11:30:00 IST',
    lastUpdated: '11:30:01 IST',
    currentStatus: 'Resolved',
    progression: [
      { step: 'Step 1: Grid Ingestion', time: '11:30:00 IST', desc: '0.25° GRIB2 parsed' },
      { step: 'Step 2: Interpolated', time: '11:30:01 IST', desc: 'Indian region extracted' }
    ],
    diagnostics: {
      vectors_processed: 38,
      grid_points: 144000,
      checksum: 'sha256:7f3b...valid'
    }
  }
];

export const CONFIGURATION_SETTINGS = {
  dataPipeline: [
    {
      id: 'cfg-freshness',
      key: 'PIPELINE_SYNOPTIC_FRESHNESS_THRESHOLD_SECS',
      title: 'Data Freshness Threshold',
      tag: 'Editable',
      desc: 'Defines elapsed time before incoming synoptic and radar data is flagged as delayed.',
      value: '15 minutes',
      currentValue: '15 minutes',
      newConfiguredValue: '20 minutes',
      domain: 'Domain 01'
    },
    {
      id: 'cfg-health-cadence',
      key: 'PIPELINE_HEALTH_PROBE_CADENCE_SECS',
      title: 'Pipeline Health Monitoring Cadence',
      tag: 'Editable',
      desc: 'Frequency of automated synthetic health probe pinging external ingestion gateways.',
      value: '30 seconds',
      currentValue: '30 seconds',
      newConfiguredValue: '45 seconds',
      domain: 'Domain 01'
    },
    {
      id: 'cfg-timeout',
      key: 'INGESTION_GATEWAY_TIMEOUT_RETRIES',
      title: 'Ingestion Timeout & Retry Policy',
      tag: 'Editable',
      desc: 'Maximum timeout allowance before triggering alternate secondary microwave link failover.',
      value: '3 attempts (45s)',
      currentValue: '3 attempts (45s)',
      newConfiguredValue: '5 attempts (60s)',
      domain: 'Domain 01'
    },
    {
      id: 'cfg-primary-node',
      key: 'PRIMARY_INGESTION_NODE_ALLOCATION',
      title: 'Primary Ingestion Node Allocation',
      tag: 'Read Only',
      desc: 'Designated GovNIC gateway endpoints for IMD/NCUM raw binary telemetry. Managed by Infrastructure PKI.',
      value: 'Zone Central-02 (AI-02)',
      domain: 'Domain 01',
      isLocked: true
    }
  ],
  modelProcessing: [
    {
      id: 'cfg-nowcast-int',
      key: 'DEEP_NOWCAST_INFERENCE_INTERVAL',
      title: 'DeepNowcast Inference Interval',
      statusTag: 'Active',
      desc: 'Cadence of automated radar extrapolation runs.',
      value: 'Every 15 minutes',
      domain: 'Domain 02'
    },
    {
      id: 'cfg-ncum-sync',
      key: 'NCUM_REGIONAL_MODEL_SYNC_TRIGGER',
      title: 'NCUM Regional Model Sync Trigger',
      statusTag: 'Scheduled',
      desc: 'Automated trigger for regional numerical grid ingestion.',
      value: '00Z, 06Z, 12Z, 18Z cycles',
      domain: 'Domain 02'
    },
    {
      id: 'cfg-vram-thresh',
      key: 'INFERENCE_WORKER_VRAM_AUTOSCALE',
      title: 'Inference Node Worker Auto-scaling Target',
      statusTag: 'Active',
      desc: 'Triggers failover worker nodes when batch queue exceeds threshold.',
      value: '85% VRAM Threshold',
      domain: 'Domain 02'
    },
    {
      id: 'cfg-sci-weights',
      key: 'SCIENTIFIC_WEIGHT_CALIBRATION_ACCESS',
      title: 'Scientific Weight Calibration Access',
      tag: 'Read Only',
      desc: 'Meteorological model weights are locked to authenticated scientific researchers.',
      value: 'Role: Senior Meteorologist (Restricted)',
      domain: 'Domain 02',
      isLocked: true
    }
  ],
  forecastDissemination: [
    {
      id: 'cfg-pub-horizon',
      title: 'Citizen Forecast Publishing Horizon',
      desc: 'Public view temporal window for district-level meteorological parameters.',
      value: '72 Hours (3-Hour Increments)',
      domain: 'Domain 03'
    },
    {
      id: 'cfg-blending-cycle',
      title: 'State EOC Emergency Blending Cycle',
      desc: 'Sync cycle for State Emergency Operation Center fused tactical feeds.',
      value: 'Continuous (Sub-minute refresh)',
      domain: 'Domain 03'
    },
    {
      id: 'cfg-auto-dissem',
      title: 'Automatic Public Dissemination Status',
      desc: 'Real-time syndication to NDMA web and mobile endpoints.',
      value: 'Live Sync Enabled',
      isToggle: true,
      enabled: true,
      domain: 'Domain 03'
    }
  ],
  alertNotification: [
    {
      id: 'cfg-cap-siren',
      title: 'Common Alerting Protocol (CAP) Siren Relay',
      desc: 'Direct integration with National Emergency Notification Siren infrastructure.',
      value: 'Enabled',
      isToggle: true,
      enabled: true,
      domain: 'Domain 04'
    },
    {
      id: 'cfg-red-dispatch',
      title: 'High-Risk Red Alert Auto-Dispatch',
      desc: 'Dispatches instant flash notifications upon double-verified threshold breach.',
      value: 'Active',
      isToggle: true,
      enabled: true,
      domain: 'Domain 04'
    },
    {
      id: 'cfg-sms-retries',
      title: 'SMS & Cell Broadcast Gateway Retries',
      desc: 'Telecom gateway failover attempts for critical hazard areas.',
      value: '5 attempts (Exponential backoff)',
      domain: 'Domain 04'
    },
    {
      id: 'cfg-citizen-push',
      title: 'In-App Citizen Alert Push Notification Status',
      desc: 'Broadcasting to 28M active citizen mobile clients across all affected zones.',
      value: 'Enabled',
      isToggle: true,
      enabled: true,
      domain: 'Domain 04'
    }
  ],
  securityGovernance: [
    { title: 'Official Account Mandatory Verification', value: 'Enforced', desc: 'Strict GovNIC / MoES Clearance Required' },
    { title: 'Pending Registration Expiration Window', value: '72 hours', desc: 'Unapproved official petitions expire after timeout.' },
    { title: 'Inactive Session Invalidation Timeout', value: '15 minutes', desc: 'Automatic console lock after operator idle period.' },
    { title: 'Role Assignment Authority', value: 'Tier-1 PKI Hardware Token Only', isLocked: true }
  ]
};

export const RECENT_CONFIG_MUTATIONS = [
  {
    timestamp: 'Today, 13:10 IST',
    setting: 'Alert Auto-Dispatch Threshold',
    prevValue: 'SOP-2023 Ruleset',
    newValue: 'SOP-2025 Heavy Rain Standard',
    changedBy: 'Admin SEC-01',
    reason: 'MoES Annual Protocol Sync',
    status: 'Applied (Verified)'
  },
  {
    timestamp: 'Yesterday, 17:45 IST',
    setting: 'Inference Node 02 Auto-scale',
    prevValue: '75% VRAM',
    newValue: '85% VRAM',
    changedBy: 'Admin SEC-01',
    reason: 'Prevent transient jitter warnings',
    status: 'Applied (Verified)'
  },
  {
    timestamp: '23 Oct, 11:20 IST',
    setting: 'Citizen Forecast Horizon',
    prevValue: '48 Hours',
    newValue: '72 Hours',
    changedBy: 'Duty Officer Sharma',
    reason: 'Extended synoptic outlook mandate',
    status: 'Applied (Verified)'
  },
  {
    timestamp: '21 Oct, 09:15 IST',
    setting: 'Emergency SMS Gateway Retry',
    prevValue: '3 retries',
    newValue: '5 retries',
    changedBy: 'Admin SEC-01',
    reason: 'Telecom SLA redundancy enhancement',
    status: 'Applied (Verified)'
  }
];
