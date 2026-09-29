// src/data/meteorologistData.js
// Comprehensive mock scientific data matching IMD / NCMRWF / MoES meteorologist portal reference designs

export const SCIENTIST_PROFILE = {
  name: 'Dr. Arvind Sharma',
  shortName: 'Dr. A. Sharma',
  initials: 'AS',
  title: 'Senior Meteorologist & Synoptic Lead Forecaster',
  department: 'India Meteorological Department (IMD) / Ministry of Earth Sciences (MoES)',
  organization: 'Mausam Suraksha | WeatherAI Research Network',
  level: 'Authorized Forecaster (Level 4)',
  email: 'a.sharma.synoptic@imd.gov.in',
  stationId: 'IMD-AWS-42680-DEL',
  badgeId: 'SCI-8841',
  securityClearance: 'Level 4 — Operational Synoptic Override',
  lastLogin: 'Today, 06:42 IST · Terminal DEL-01',
  clusterStatus: 'NCMRWF HPC CLUSTER 04: ONLINE',
  clusterNode: 'IN-DEL-HPC-NCMRWF-N04',
  protocol: 'TLS 1.3 FIPS-140-3',
  govIdVerified: true
};

export const METEOROLOGIST_SUMMARY_METRICS = {
  monitoredLocations: 142,
  highPriorityWatchLocations: 12,
  activeWeatherEvents: 7,
  severeConvectiveSqualls: 3,
  highModelDisagreement: 3,
  disagreementRegions: 'Konkan, East MP, Vidarbha',
  highUncertaintyAreas: 5,
  uncertaintyCriteria: 'Convective CAPE > 2400 J/kg',
  highProbabilityEvents: 4,
  highUncertaintyEvents: 3,
  newSignalsPast2h: 2
};

export const PRIORITY_LOCATIONS_TABLE = [
  {
    id: 'indore',
    name: 'Indore',
    subdivision: 'Madhya Pradesh · AWS 42680',
    lat: 22.7196,
    lng: 75.8577,
    currentWeather: '28°C Partly Cloudy',
    tempC: 28,
    condition: 'Partly Cloudy with Convective Threat',
    rainProb: 62,
    rainBarColor: 'bg-sky-600',
    confidence: 'High',
    confidenceClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    modelAgreement: '92%',
    modelAgreementDetail: '4/5 models',
    alertStatus: 'Normal',
    alertStatusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    category: 'high-watch'
  },
  {
    id: 'mumbai',
    name: 'Mumbai (Santacruz)',
    subdivision: 'Maharashtra · AWS 43003',
    lat: 19.0760,
    lng: 72.8777,
    currentWeather: '29°C Heavy Showers',
    tempC: 29,
    condition: 'Thunderstorm & Coastal Squall',
    rainProb: 78,
    rainBarColor: 'bg-amber-500',
    confidence: 'Moderate',
    confidenceClass: 'bg-amber-50 text-amber-700 border-amber-200',
    modelAgreement: '54%',
    modelAgreementDetail: 'Spread 2.4',
    alertStatus: 'Watch',
    alertStatusClass: 'bg-amber-50 text-amber-700 border-amber-200',
    category: 'severe'
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    subdivision: 'Madhya Pradesh · AWS 42667',
    lat: 23.2599,
    lng: 77.4126,
    currentWeather: '27°C Overcast',
    tempC: 27,
    condition: 'Overcast & Strong Wind Risk',
    rainProb: 45,
    rainBarColor: 'bg-sky-600',
    confidence: 'High',
    confidenceClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    modelAgreement: '88%',
    modelAgreementDetail: 'Consistent',
    alertStatus: 'Normal',
    alertStatusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    category: 'all'
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    subdivision: 'Maharashtra · AWS 42867',
    lat: 21.1458,
    lng: 79.0882,
    currentWeather: '31°C Pre-convective',
    tempC: 31,
    condition: 'Pre-convective Thermal Plume',
    rainProb: 55,
    rainBarColor: 'bg-amber-500',
    confidence: 'Moderate',
    confidenceClass: 'bg-amber-50 text-amber-700 border-amber-200',
    modelAgreement: '71%',
    modelAgreementDetail: 'Ensemble spread',
    alertStatus: 'Advisory',
    alertStatusClass: 'bg-amber-50 text-amber-700 border-amber-200',
    category: 'high-watch'
  },
  {
    id: 'jabalpur',
    name: 'Jabalpur',
    subdivision: 'Madhya Pradesh · AWS 42675',
    lat: 23.1815,
    lng: 79.9864,
    currentWeather: '26°C Thunderstorms',
    tempC: 26,
    condition: 'Severe Convective Cell',
    rainProb: 82,
    rainBarColor: 'bg-rose-600',
    confidence: 'High',
    confidenceClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    modelAgreement: '68%',
    modelAgreementDetail: 'Doppler locked',
    alertStatus: 'Warning',
    alertStatusClass: 'bg-red-50 text-red-700 border-red-200',
    category: 'severe'
  },
  {
    id: 'pune',
    name: 'Pune (Shivajinagar)',
    subdivision: 'Maharashtra · AWS 43063',
    lat: 18.5204,
    lng: 73.8567,
    currentWeather: '25°C Light Rain',
    tempC: 25,
    condition: 'Orographic Drizzle',
    rainProb: 35,
    rainBarColor: 'bg-sky-600',
    confidence: 'High',
    confidenceClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    modelAgreement: '94%',
    modelAgreementDetail: 'High consensus',
    alertStatus: 'Normal',
    alertStatusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    category: 'all'
  },
  {
    id: 'ujjain',
    name: 'Ujjain',
    subdivision: 'Madhya Pradesh · AWS 42678',
    lat: 23.1765,
    lng: 75.7885,
    currentWeather: '28°C Approaching Squall',
    tempC: 28,
    condition: 'Convective Gust Front',
    rainProb: 72,
    rainBarColor: 'bg-rose-500',
    confidence: 'High',
    confidenceClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    modelAgreement: '89%',
    modelAgreementDetail: 'Boundary locked',
    alertStatus: 'Watch',
    alertStatusClass: 'bg-amber-50 text-amber-700 border-amber-200',
    category: 'high-watch'
  }
];

export const ACTIVE_SURVEILLANCE_EVENTS = [
  {
    id: 'evt-indore',
    title: 'Convective Squall Line',
    location: 'Indore – Ujjain Belt',
    region: 'Central India (Malwa Plateau)',
    subdivision: 'Indore District & Ujjain Corridor (AWS 42680)',
    headline: 'Convective Heavy Rain & Squall',
    riskLevel: 'Moderate Risk',
    riskClass: 'bg-amber-100 text-amber-800 border-amber-300',
    alertBadge: 'WARNING (ORANGE LEVEL)',
    alertType: 'WARNING',
    probability: '74%',
    probNum: 74,
    deepDiveProb: '78%',
    duration: '18:00 – 22:00 IST (4h)',
    timeWindow: '18:00 – 22:00 IST',
    expectedTime: 'Expected Time: 16:00 – 20:30 IST',
    confidence: 'HIGH (92% EPS)',
    description: 'Mid-tropospheric dry intrusion interacting with boundary moist plume. Sounding displays severe CAPE at 2100 J/kg with Lifted Index -4.8. Multi-cell thunderstorm propagation with gust wind vectors up to 65 km/h.',
    soundingProfile: 'CAPE 2100 J/kg',
    radarReflectivity: '52 dBZ Core',
    radarNote: 'Approaching SW perimeter',
    capeIndex: '1850 J/kg',
    capeNote: 'High convective initiation',
    p10Floor: '18 mm',
    p50Median: '38 mm',
    p90Burst: '65 mm',
    consensusP50: '38 mm',
    multiModelVariance: [
      { model: 'GFS (0.25° Global)', accum: '28 mm', peak: 'Peak: 19:30 IST' },
      { model: 'NCUM (12 km Regional MoES)', accum: '44 mm', peak: 'Peak: 18:45 IST' },
      { model: 'AI Neural NWP (0.1° High-Res)', accum: '42 mm', peak: 'Peak: 18:15 IST' },
      { model: 'Regional EPS (21-mem Spread)', accum: '36 mm', peak: 'Spread: ±14 mm' }
    ],
    verification: {
      leadHorizon: 'LEAD +1H VERIFICATION',
      text: 'Forecast 12.0 mm vs Obs 10.2 mm',
      delta: 'Δ -1.8 mm (MAE 0.88)'
    },
    activeTarget: true,
    radarCoords: { x: 38, y: 44 }
  },
  {
    id: 'evt-mumbai',
    title: 'Coastal Wind Surge & Thunderstorm',
    location: 'North Konkan / Mumbai',
    region: 'Western Coast (Konkan & Mumbai)',
    subdivision: 'Santacruz AWS (AWS 43003)',
    headline: 'Thunderstorm & Coastal Squall',
    riskLevel: 'High Risk',
    riskClass: 'bg-rose-100 text-rose-800 border-rose-300',
    alertBadge: 'WATCH (YELLOW LEVEL)',
    alertType: 'WATCH',
    probability: '85%',
    probNum: 85,
    deepDiveProb: '64%',
    duration: '20:00 – 23:00 IST (3h)',
    timeWindow: '20:00 – 23:00 IST',
    expectedTime: 'Expected Time: 17:30 – 23:00 IST',
    confidence: 'MODERATE (78% EPS)',
    description: 'High-tide synchrony with sustained westerly squalls 55-70 km/h and localized inundation risk along marine corridors. Cape 1640 J/kg · Gusts 55 km/h.',
    soundingProfile: 'CAPE 1640 J/kg',
    radarReflectivity: '48 dBZ',
    radarNote: 'Offshore band converging',
    capeIndex: '1640 J/kg',
    capeNote: 'Marine instability layer',
    p10Floor: '22 mm',
    p50Median: '48 mm',
    p90Burst: '80 mm',
    consensusP50: '48 mm',
    multiModelVariance: [
      { model: 'GFS (0.25° Global)', accum: '32 mm', peak: 'Peak: 21:00 IST' },
      { model: 'NCUM (12 km Regional MoES)', accum: '52 mm', peak: 'Peak: 20:30 IST' },
      { model: 'AI Neural NWP (0.1° High-Res)', accum: '56 mm', peak: 'Peak: 20:15 IST' },
      { model: 'Regional EPS (21-mem Spread)', accum: '45 mm', peak: 'Spread: ±18 mm' }
    ],
    verification: {
      leadHorizon: 'LEAD +2H VERIFICATION',
      text: 'Forecast 18.0 mm vs Obs 15.6 mm',
      delta: 'Δ -2.4 mm (MAE 1.10)'
    },
    activeTarget: false,
    radarCoords: { x: 18, y: 62 }
  },
  {
    id: 'evt-bhopal',
    title: 'Strong Wind & Microburst Risk',
    location: 'Bhopal Urban',
    region: 'Central India (Malwa Plateau)',
    subdivision: 'Bhopal AWS 42667',
    headline: 'Strong Wind & Microburst Risk',
    riskLevel: 'Moderate Risk',
    riskClass: 'bg-amber-100 text-amber-800 border-amber-300',
    alertBadge: 'ADVISORY (BLUE LEVEL)',
    alertType: 'ADVISORY',
    probability: '58%',
    probNum: 58,
    deepDiveProb: '58%',
    duration: '15:00 – 19:00 IST (4h)',
    timeWindow: '15:00 – 19:00 IST',
    expectedTime: 'Expected Time: 15:00 – 19:00 IST',
    confidence: 'HIGH (84% EPS)',
    description: 'Ensemble spread 1.8σ. Elevated mid-level dry entrainment creating localized downdraft burst risks up to 52 km/h across urban sectors.',
    soundingProfile: 'CAPE 1420 J/kg',
    radarReflectivity: '40 dBZ',
    radarNote: 'Scattered convective anvil',
    capeIndex: '1420 J/kg',
    capeNote: 'Dry sub-cloud layer',
    p10Floor: '8 mm',
    p50Median: '18 mm',
    p90Burst: '32 mm',
    consensusP50: '18 mm',
    multiModelVariance: [
      { model: 'GFS (0.25° Global)', accum: '12 mm', peak: 'Peak: 16:30 IST' },
      { model: 'NCUM (12 km Regional MoES)', accum: '22 mm', peak: 'Peak: 17:00 IST' },
      { model: 'AI Neural NWP (0.1° High-Res)', accum: '19 mm', peak: 'Peak: 16:45 IST' },
      { model: 'Regional EPS (21-mem Spread)', accum: '17 mm', peak: 'Spread: ±8 mm' }
    ],
    verification: {
      leadHorizon: 'LEAD +1H VERIFICATION',
      text: 'Forecast 5.0 mm vs Obs 4.2 mm',
      delta: 'Δ -0.8 mm (MAE 0.45)'
    },
    activeTarget: false,
    radarCoords: { x: 55, y: 38 }
  },
  {
    id: 'evt-vidarbha',
    title: 'Localized Heavy Downburst',
    location: 'Eastern Vidarbha / Chandrapur',
    region: 'East Vidarbha Basin',
    subdivision: 'Chandrapur AWS / Vidarbha Corridor',
    headline: 'Localized Downburst',
    riskLevel: 'Moderate Risk',
    riskClass: 'bg-amber-100 text-amber-800 border-amber-300',
    alertBadge: 'WATCH (YELLOW LEVEL)',
    alertType: 'WATCH',
    probability: '60%',
    probNum: 60,
    deepDiveProb: '60%',
    duration: '18:30 – 21:00 IST (2.5h)',
    timeWindow: '18:30 – 21:00 IST',
    expectedTime: 'Expected Time: 18:00 – 21:00 IST',
    confidence: 'MODERATE (76% EPS)',
    description: 'Deep orographic convection with microburst potential near Chandrapur. DCAPE values exceeding 980 J/kg in south Indore/Vidarbha suburban perimeter indicating potential for microburst wind gusts approaching 55 km/h.',
    soundingProfile: 'DCAPE 980 J/kg',
    radarReflectivity: '46 dBZ',
    radarNote: 'Echo top: 14.5 km',
    capeIndex: '1720 J/kg',
    capeNote: 'Elevated DCAPE plume',
    p10Floor: '14 mm',
    p50Median: '28 mm',
    p90Burst: '52 mm',
    consensusP50: '28 mm',
    multiModelVariance: [
      { model: 'GFS (0.25° Global)', accum: '18 mm', peak: 'Peak: 19:00 IST' },
      { model: 'NCUM (12 km Regional MoES)', accum: '34 mm', peak: 'Peak: 19:30 IST' },
      { model: 'AI Neural NWP (0.1° High-Res)', accum: '30 mm', peak: 'Peak: 19:15 IST' },
      { model: 'Regional EPS (21-mem Spread)', accum: '26 mm', peak: 'Spread: ±12 mm' }
    ],
    verification: {
      leadHorizon: 'LEAD +1H VERIFICATION',
      text: 'Forecast 8.0 mm vs Obs 7.1 mm',
      delta: 'Δ -0.9 mm (MAE 0.52)'
    },
    activeTarget: false,
    radarCoords: { x: 68, y: 70 }
  }
];

export const MODEL_HEALTH_METRICS = {
  dataFreshness: '8 min ago',
  dataFreshnessPercent: 95,
  modelAvailability: '100% (5/5)',
  modelAvailabilityPercent: 100,
  forecastConfidence: '82% High',
  forecastConfidencePercent: 82,
  overallModelAgreement: '76%',
  overallModelAgreementPercent: 76
};

export const MODEL_PERFORMANCE_SNAPSHOT_24H = [
  { model: 'GFS (Global Forecast System)', res: '0.25°', mae: '1.4°C', rmse: '1.9', bias: '+0.2mm' },
  { model: 'NCUM (National Centre Unified Model)', res: '12 km', mae: '1.2°C', rmse: '1.7', bias: '-0.1mm' },
  { model: 'AI-Weather Model (Neural NWP)', res: '0.1° High-Res', mae: '1.1°C', rmse: '1.5', bias: '+0.0mm' },
  { model: 'Regional Ensemble (EPS 21-member)', res: '4 km', mae: '1.3°C', rmse: '1.6', spread: '1.8' },
  { model: 'Operational Blended Consensus', res: 'Weighted', mae: '0.9°C', rmse: '1.3', reliab: '94%' }
];

export const FORECAST_HOURLY_8STEP = [
  { time: '14:00', temp: '29°C', rainProb: '15%', wind: '14k', icon: 'sun', condition: 'Sunny / Warm' },
  { time: '15:00', temp: '30°C', rainProb: '25%', wind: '16k', icon: 'sun-cloud', condition: 'Cloud Build' },
  { time: '16:00', temp: '29°C', rainProb: '40%', wind: '18k', icon: 'cloud', condition: 'Pre-convective' },
  { time: '17:00', temp: '28°C', rainProb: '55%', wind: '22k', icon: 'cloud-rain', condition: 'Approaching Squall' },
  { time: '18:00', temp: '27°C', rainProb: '65%', wind: '28k', icon: 'cloud-rain-heavy', condition: 'Peak Convective Burst', isPeak: true },
  { time: '19:00', temp: '26°C', rainProb: '58%', wind: '24k', icon: 'cloud-rain', condition: 'Active Downpour' },
  { time: '20:00', temp: '25°C', rainProb: '35%', wind: '17k', icon: 'cloud-moon', condition: 'Tapering Showers' },
  { time: '21:00', temp: '25°C', rainProb: '20%', wind: '14k', icon: 'moon', condition: 'Cool Night' }
];

export const MODEL_COMPARISON_MATRIX = [
  {
    param: 'Temperature',
    gfs: '29.2°C',
    ncum: '27.8°C',
    aiNeural: '28.1°C',
    regionalEps: '28.0°C',
    blended: '28.0°C',
    spread: '1.4°C',
    cohesion: 'Controlled'
  },
  {
    param: 'Rain Probability',
    gfs: '58%',
    ncum: '61%',
    aiNeural: '67%',
    regionalEps: '63%',
    blended: '62%',
    spread: '9%',
    cohesion: 'Moderate'
  },
  {
    param: 'Accumulation (24h)',
    gfs: '9.5 mm',
    ncum: '14.2 mm',
    aiNeural: '11.8 mm',
    regionalEps: '13.0 mm',
    blended: '12.0 mm',
    spread: '4.7 mm',
    cohesion: 'Elevated'
  },
  {
    param: 'Wind Speed',
    gfs: '20 km/h',
    ncum: '17 km/h',
    aiNeural: '18 km/h',
    regionalEps: '18 km/h',
    blended: '18 km/h',
    spread: '3 km/h',
    cohesion: 'High'
  }
];

export const ENSEMBLE_WEIGHTS = [
  {
    name: 'GFS (0.25° Global)',
    defaultWeight: 40,
    weight: 0.40,
    note: 'Based on 48h spatial skill score (0.84)',
    skillRank: 2
  },
  {
    name: 'NCUM (12 km IMD)',
    defaultWeight: 60,
    weight: 0.60,
    note: 'High regional boundary skill score (0.91)',
    skillRank: 1
  },
  {
    name: 'AI Neural NWP (0.1°)',
    defaultWeight: 33,
    weight: 0.33,
    note: 'Fast convective initiation tracking',
    skillRank: 3
  },
  {
    name: 'Regional EPS (21-mem)',
    defaultWeight: 25,
    weight: 0.25,
    note: 'Turbulence & spread calibration',
    skillRank: 4
  }
];

export const GROUND_TRUTH_VERIFICATION_TABLE = [
  {
    param: 'Temperature (2m Surface)',
    blended: '28.0°C',
    observed: '27.6°C',
    delta: '-0.4°C',
    biasStatus: 'Within Normal Variance',
    statusClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  {
    param: 'Rainfall Accumulation (1h)',
    blended: '12.0 mm',
    observed: '10.2 mm',
    delta: '-1.8 mm',
    biasStatus: 'Bounded Spread',
    statusClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  {
    param: 'Surface Wind Velocity',
    blended: '18.0 km/h',
    observed: '16.5 km/h',
    delta: '-1.5 km/h',
    biasStatus: 'Excellent Alignment',
    statusClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  {
    param: 'Atmospheric Pressure (QNH)',
    blended: '1008.4 hPa',
    observed: '1008.1 hPa',
    delta: '-0.3 hPa',
    biasStatus: 'Near-zero Barometric Drift',
    statusClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  }
];

export const ANALYTICS_KPIS = {
  mae: '1.12°C',
  maeSub: '/ 2.4mm',
  maeBenchmark: 'Historical benchmark ±5%',
  rmse: '1.58',
  rmseNote: 'Stable dispersion band',
  systematicBias: '-0.18 mm',
  biasNote: 'Dry bias in orographic sectors',
  forecastConfidence: '88.4%',
  confidenceNote: 'High confidence index',
  modelAgreement: '81.6%',
  agreementNote: 'Ensemble alignment score',
  dataCoverage: '99.2%',
  coverageNote: 'Ground-truth sync verified'
};

export const ANALYTICS_MODEL_PERFORMANCE_MATRIX = [
  {
    model: 'GFS (NOAA Global)',
    resCycle: '0.25° · 00/06/12/18 UTC',
    mae: '1.34°C',
    rmse: '1.82',
    bias: '+0.22 mm',
    corr: '0.82',
    skillEts: '0.68',
    dispersion: '1.34°C (ETS 0.68)',
    barWidth: '78%'
  },
  {
    model: 'NCUM (IMD/NCMRWF)',
    resCycle: '12 km · 00/12 UTC',
    mae: '1.18°C',
    rmse: '1.64',
    bias: '-0.14 mm',
    corr: '0.86',
    skillEts: '0.73',
    dispersion: '1.18°C (ETS 0.73)',
    barWidth: '65%'
  },
  {
    model: 'AI Neural NWP',
    resCycle: '0.1° High-Res · Hourly',
    mae: '1.08°C',
    rmse: '1.49',
    bias: '-0.06 mm',
    corr: '0.91',
    skillEts: '0.79',
    dispersion: '1.08°C (ETS 0.79)',
    barWidth: '55%'
  },
  {
    model: 'Regional EPS',
    resCycle: '21-member · 00/12 UTC',
    mae: '1.22°C',
    rmse: '1.59',
    bias: '-0.09 mm',
    corr: '0.88',
    skillEts: '0.76',
    dispersion: '1.22°C (ETS 0.76)',
    barWidth: '68%'
  },
  {
    model: 'Operational Blended Consensus',
    resCycle: 'Multi-Model Weighted',
    mae: '0.98°C',
    rmse: '1.36',
    bias: '-0.02 mm',
    corr: '0.94',
    skillEts: '0.84',
    dispersion: '0.98°C (ETS 0.84)',
    barWidth: '42%',
    isHighlighted: true
  }
];

export const BLENDED_VS_COMPONENT_MODELS = [
  {
    horizon: '+06 Hours',
    gfs: '1.10°C',
    ncum: '0.96°C',
    aiNeural: '0.72°C',
    regionalEps: '0.89°C',
    blended: '0.68°C',
    reduction: '-18.1% vs Mean'
  },
  {
    horizon: '+12 Hours',
    gfs: '1.24°C',
    ncum: '1.04°C',
    aiNeural: '0.88°C',
    regionalEps: '1.01°C',
    blended: '0.81°C',
    reduction: '-22.1% vs Mean'
  },
  {
    horizon: '+24 Hours (Synoptic Target)',
    gfs: '1.34°C',
    ncum: '1.18°C',
    aiNeural: '1.08°C',
    regionalEps: '1.22°C',
    blended: '0.98°C',
    reduction: '-18.6% vs Mean',
    isTarget: true
  },
  {
    horizon: '+48 Hours',
    gfs: '1.68°C',
    ncum: '1.46°C',
    aiNeural: '1.42°C',
    regionalEps: '1.50°C',
    blended: '1.24°C',
    reduction: '-18.2% vs Mean'
  },
  {
    horizon: '+72 Hours',
    gfs: '2.14°C',
    ncum: '1.88°C',
    aiNeural: '1.85°C',
    regionalEps: '1.89°C',
    blended: '1.56°C',
    reduction: '-19.5% vs Mean'
  }
];

export const HISTORICAL_VALIDATION_EVENT_AUDIT = [
  {
    hour: '10:00 UTC (15:30 IST)',
    forecast: '32.1°C · 0.0 mm · 14 km/h',
    observed: '31.9°C · 0.0 mm · 12 km/h',
    delta: '+0.2°C / 0.0 mm',
    status: 'Pre-Event Stable',
    statusClass: 'bg-slate-100 text-slate-700'
  },
  {
    hour: '11:00 UTC (16:30 IST)',
    forecast: '29.4°C · 4.5 mm · 38 km/h',
    observed: '28.8°C · 6.0 mm · 42 km/h',
    delta: '+0.6°C / -1.5 mm',
    status: 'Caution Triggered',
    statusClass: 'bg-amber-100 text-amber-800'
  },
  {
    hour: '12:00 UTC (17:30 IST)',
    forecast: '24.2°C · 28.0 mm · 65 km/h',
    observed: '23.6°C · 31.4 mm · 68 km/h',
    delta: '+0.6°C / -3.4 mm',
    status: 'Peak Squall Verified',
    statusClass: 'bg-rose-100 text-rose-800'
  },
  {
    hour: '13:00 UTC (18:30 IST)',
    forecast: '23.1°C · 12.0 mm · 34 km/h',
    observed: '23.0°C · 11.2 mm · 29 km/h',
    delta: '+0.1°C / +0.8 mm',
    status: 'Receding Convection',
    statusClass: 'bg-sky-100 text-sky-800'
  },
  {
    hour: '14:00 UTC (19:30 IST)',
    forecast: '22.8°C · 1.2 mm · 18 km/h',
    observed: '22.7°C · 0.8 mm · 16 km/h',
    delta: '+0.1°C / +0.4 mm',
    status: 'Post-Event Normal',
    statusClass: 'bg-emerald-100 text-emerald-800'
  }
];

export const AUTHORIZED_TERMINAL_SESSIONS = [
  {
    id: 'sess-1',
    name: 'IMD Synoptic Desk Alpha',
    detail: 'Chrome on Linux · Delhi Weather Control Room (Mausam Bhawan)',
    ip: '10.14.82.11 (GovNet NIC)',
    status: 'Active now',
    isCurrent: true
  },
  {
    id: 'sess-2',
    name: 'MoES Regional Field Workstation',
    detail: 'Firefox on MacOS · Mumbai Regional Radar Met Hub',
    ip: '14.139.112.4',
    status: 'Last active 3 hours ago',
    isCurrent: false,
    tag: 'SECURE VPN'
  }
];
