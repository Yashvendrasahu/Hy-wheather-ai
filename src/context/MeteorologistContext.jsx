// src/context/MeteorologistContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  SCIENTIST_PROFILE,
  ACTIVE_SURVEILLANCE_EVENTS,
  ENSEMBLE_WEIGHTS
} from '../data/meteorologistData.js';
import { fetchSynopticForecast } from '../services/synopticService.js';

const MeteorologistContext = createContext(null);

export function MeteorologistProvider({ children }) {
  // Portal mode: 'dma' | 'meteorologist' | 'citizen'
  const [portalMode, setPortalMode] = useState('dma');

  // Meteorologist page tabs: 'dashboard' | 'forecast-analysis' | 'weather-events' | 'analytics' | 'profile-settings' | 'login' | 'signup'
  const [metTab, setMetTab] = useState('dashboard');

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [scientistUser, setScientistUser] = useState(SCIENTIST_PROFILE);

  // Active target observatory/location for synoptic desk & forecast analysis
  const [targetObservatory, setTargetObservatory] = useState({
    id: 'indore',
    name: 'Indore, Madhya Pradesh (AWS 42680)',
    stationCode: 'AWS-42680',
    lat: 22.7196,
    lng: 75.8577,
    elevation: '553m MSL',
    region: 'Central India / Malwa Plateau'
  });

  // Live Synoptic Model Payload and Result from backend
  const [synopticPayload, setSynopticPayload] = useState({
    latitude: 22.7196,
    longitude: 75.8577,
    climatic_zone: 4,
    tp_gfs: 28.0,
    tp_ecmwf: 32.0,
    tp_ncum: 44.0,
    tp_wrf: 52.0,
    t2m_gfs: 29.2,
    t2m_ecmwf: 27.8,
    wind_gfs_kmh: 20.0,
    wind_ecmwf_kmh: 17.0,
    cape: 1850.0,
    cin: 42.0,
    rh_700: 71.0,
    mslp: 1008.4,
    wind_shear: 22.0,
    elevation_m: 553.0,
    terrain_slope_deg: 3.5,
    radar_max_dbz: 52.0,
    satellite_ctt_celsius: -56.0
  });

  const [synopticResult, setSynopticResult] = useState({
    status: 'success',
    precipitation: {
      quantiles_mm: {
        p10: 18.00,
        p50: 38.00,
        p90: 65.00
      },
      nwp_bust_probability: 0.78,
      is_bust_warning: true,
      conformal_coverage: '86.75% Guaranteed',
      alert: 'ORANGE'
    },
    temperature: {
      blended_2m_celsius: 28.0,
      rothfusz_heat_index_celsius: 30.5,
      heatwave_advisory: 'Normal'
    },
    wind: {
      sustained_speed_kmh: 18.0,
      gust_ceiling_p90_kmh: 28.0,
      gale_warning: false
    }
  });

  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  // Selected event for Deep Dive & Surveillance
  const [selectedEventId, setSelectedEventId] = useState('evt-indore');

  // Synoptic lead horizon: '1h' | '3h' | '6h' | '12h' | '24h' | '48h' | '72h'
  const [synopticLeadHorizon, setSynopticLeadHorizon] = useState('24h');

  // View window: '6H' | '24H' | '3D' | '7D'
  const [forecastViewWindow, setForecastViewWindow] = useState('24H');

  // Dynamic Ensemble Weights
  const [customWeights, setCustomWeights] = useState({
    gfs: 40,
    ncum: 60,
    aiNeural: 33,
    regionalEps: 25
  });

  // Keep a stable ref of the latest synoptic payload
  const synopticPayloadRef = useRef(synopticPayload);
  synopticPayloadRef.current = synopticPayload;

  // Function to load live model telemetry on station selection
  const refreshSynopticForecast = useCallback(async (customPayload = null) => {
    setIsLoadingForecast(true);
    const p = customPayload || synopticPayloadRef.current;
    try {
      const res = await fetchSynopticForecast(p);
      if (res && res.precipitation) {
        setSynopticResult(res);
      }
    } catch (err) {
      console.warn('Error fetching synoptic telemetry:', err);
    } finally {
      setIsLoadingForecast(false);
    }
  }, []);

  const lastStationKeyRef = useRef('');

  // Load telemetry when target observatory changes
  useEffect(() => {
    const lat = targetObservatory?.lat || 22.7196;
    const lng = targetObservatory?.lng || 75.8577;
    const stationKey = `${targetObservatory?.id || 'indore'}_${lat}_${lng}`;

    if (lastStationKeyRef.current === stationKey) {
      return;
    }
    lastStationKeyRef.current = stationKey;

    const newPayload = {
      latitude: Number(lat),
      longitude: Number(lng),
      climatic_zone: 4,
      tp_gfs: 28.0,
      tp_ecmwf: 32.0,
      tp_ncum: 44.0,
      tp_wrf: 52.0,
      t2m_gfs: 29.2,
      t2m_ecmwf: 27.8,
      wind_gfs_kmh: 20.0,
      wind_ecmwf_kmh: 17.0,
      cape: 1850.0,
      cin: 42.0,
      rh_700: 71.0,
      mslp: 1008.4,
      wind_shear: 22.0,
      elevation_m: 553.0,
      terrain_slope_deg: 3.5,
      radar_max_dbz: 52.0,
      satellite_ctt_celsius: -56.0
    };
    synopticPayloadRef.current = newPayload;
    setSynopticPayload(newPayload);
    refreshSynopticForecast(newPayload);
  }, [targetObservatory?.id, targetObservatory?.lat, targetObservatory?.lng, refreshSynopticForecast]);

  // Modals
  const [showBulletinModal, setShowBulletinModal] = useState(false);
  const [showAddRegionModal, setShowAddRegionModal] = useState(false);
  const [showSoundingModal, setShowSoundingModal] = useState(false);
  const [showDisasterLiaisonModal, setShowDisasterLiaisonModal] = useState(false);

  // Global Toast
  const [metToast, setMetToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setMetToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setMetToast(null);
    }, 3800);
  };

  const handleLogin = (email, role = 'Senior Meteorologist') => {
    setIsAuthenticated(true);
    setScientistUser({
      ...SCIENTIST_PROFILE,
      email: email || SCIENTIST_PROFILE.email,
      title: `${role} · Synoptic Ops`
    });
    setMetTab('dashboard');
    showToast(`Authenticated as ${SCIENTIST_PROFILE.name} (${role})`, 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMetTab('login');
    showToast('Signed out of scientific portal terminal.', 'info');
  };

  const activeEvent = ACTIVE_SURVEILLANCE_EVENTS.find(e => e.id === selectedEventId) || ACTIVE_SURVEILLANCE_EVENTS[0];

  const value = {
    portalMode,
    setPortalMode,
    metTab,
    setMetTab,
    isAuthenticated,
    setIsAuthenticated,
    scientistUser,
    setScientistUser,
    handleLogin,
    handleLogout,
    targetObservatory,
    setTargetObservatory,
    selectedEventId,
    setSelectedEventId,
    activeEvent,
    synopticLeadHorizon,
    setSynopticLeadHorizon,
    forecastViewWindow,
    setForecastViewWindow,
    customWeights,
    setCustomWeights,
    synopticResult,
    synopticPayload,
    setSynopticPayload,
    refreshSynopticForecast,
    isLoadingForecast,
    showBulletinModal,
    setShowBulletinModal,
    showAddRegionModal,
    setShowAddRegionModal,
    showSoundingModal,
    setShowSoundingModal,
    showDisasterLiaisonModal,
    setShowDisasterLiaisonModal,
    metToast,
    showToast
  };

  return (
    <MeteorologistContext.Provider value={value}>
      {children}
    </MeteorologistContext.Provider>
  );
}

export function useMeteorologist() {
  const context = useContext(MeteorologistContext);
  if (!context) {
    throw new Error('useMeteorologist must be used within MeteorologistProvider');
  }
  return context;
}
