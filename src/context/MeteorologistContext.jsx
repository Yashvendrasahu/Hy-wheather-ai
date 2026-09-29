// src/context/MeteorologistContext.jsx
import React, { createContext, useContext, useState } from 'react';
import {
  SCIENTIST_PROFILE,
  ACTIVE_SURVEILLANCE_EVENTS,
  ENSEMBLE_WEIGHTS
} from '../data/meteorologistData.js';

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
