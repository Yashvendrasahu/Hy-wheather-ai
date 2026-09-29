// src/context/WeatherContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  LOCATIONS,
  PINNED_LOCATIONS as INITIAL_PINNED,
  ALERTS_DATA as STATIC_ALERTS,
  REGIONAL_RADAR_POINTS,
  HOURLY_FORECAST as STATIC_HOURLY,
  SEVEN_DAY_FORECAST as STATIC_SEVEN_DAY
} from '../data/weatherData.js';
import {
  predictWeatherAI,
  checkMoesBackendHealth
} from '../services/moesWeatherApi.js';
import {
  fetchLiveWeatherAndAI,
  fetchWeatherForecast as fetchWeatherForecastService,
  detectUserCoordinates
} from '../services/liveWeatherService.js';

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  // Navigation tabs: 'home' | 'forecast' | 'weather-map' | 'alerts' | 'search' | 'about'
  const [activeTab, setActiveTab] = useState('home');
  const [tempUnit, setTempUnit] = useState('C'); // 'C' | 'F'
  const [gpsState, setGpsState] = useState('active'); // 'active' | 'detecting' | 'prompt' | 'error'
  const [pinnedLocations, setPinnedLocations] = useState(INITIAL_PINNED);
  const [selectedHourIndex, setSelectedHourIndex] = useState(2);
  const [alertFilter, setAlertFilter] = useState('all'); // 'all' | 'active' | 'upcoming' | 'past'
  const [warningsOnly, setWarningsOnly] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [activeModalAlert, setActiveModalAlert] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState(null);
  const [mapLayer, setMapLayer] = useState('rain'); // 'rain' | 'temp' | 'wind' | 'clouds'
  const [selectedMapPoint, setSelectedMapPoint] = useState(REGIONAL_RADAR_POINTS[0]);
  const [radarPlaying, setRadarPlaying] = useState(true);
  const [radarTimeStep, setRadarTimeStep] = useState(2);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [searchFilterQuery, setSearchFilterQuery] = useState('');

  // --- Dynamic Real Data & MoES AI Engine Backend States ---
  const [isDynamicLoading, setIsDynamicLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('weatherai_user_detected_location');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return LOCATIONS[0];
  });
  const [hourlyForecast, setHourlyForecast] = useState(STATIC_HOURLY);
  const [sevenDayForecast, setSevenDayForecast] = useState(STATIC_SEVEN_DAY);
  const [dynamicAlerts, setDynamicAlerts] = useState(STATIC_ALERTS);

  const [moesPayload, setMoesPayload] = useState({
    latitude: 22.7196,
    longitude: 75.8577,
    climatic_zone: 4,
    tp_gfs: 14.5,
    tp_ecmwf: 18.2,
    tp_ncum: 22.0,
    tp_wrf: 26.5,
    t2m_gfs: 28.5,
    t2m_ecmwf: 29.0,
    wind_gfs_kmh: 16.0,
    wind_ecmwf_kmh: 18.0,
    cape: 1850.0,
    cin: 35.0,
    rh_700: 72.0,
    mslp: 1012.0,
    wind_shear: 15.0,
    elevation_m: 553.0,
    terrain_slope_deg: 3.5,
    radar_max_dbz: 38.0,
    satellite_ctt_celsius: -48.0
  });

  const [moesResult, setMoesResult] = useState({
    status: 'success',
    precipitation: {
      quantiles_mm: { p10: 8.40, p50: 19.80, p90: 34.50 },
      nwp_bust_probability: 0.428,
      is_bust_warning: true,
      conformal_coverage: '86.75% Guaranteed',
      alert: 'ORANGE'
    },
    temperature: {
      blended_2m_celsius: 28.6,
      rothfusz_heat_index_celsius: 31.2,
      heatwave_advisory: 'Normal'
    },
    wind: {
      sustained_speed_kmh: 17.0,
      gust_ceiling_p90_kmh: 26.4,
      gale_warning: false
    }
  });

  const [moesLoading, setMoesLoading] = useState(false);
  const [moesBackendHealth, setMoesBackendHealth] = useState({
    checked: false,
    online: true,
    statusText: 'Connecting to Render backend...',
    latencyMs: null
  });
  const [moesInferenceSource, setMoesInferenceSource] = useState('live_backend');

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Construct dynamic alerts combining real weather data & MoES backend results
  const buildDynamicAlerts = (loc, ai) => {
    const alertLevel = ai?.precipitation?.alert || 'GREEN';
    const alerts = [];

    if (alertLevel === 'RED') {
      alerts.push({
        id: `alert-red-${Date.now()}`,
        level: 3,
        severity: 'Emergency Warning',
        color: 'red',
        status: 'active',
        title: 'Severe Convective / Cloudburst Warning',
        headline: `MoES AI Engine detected high cloudburst risk (P90 hazard: ${ai.precipitation?.quantiles_mm?.p90}mm).`,
        location: loc.fullName,
        timeWindow: 'Next 3 - 6 Hours',
        description: `Numerical ensemble divergence indicates localized intense precipitation burst exceeding ${ai.precipitation?.quantiles_mm?.p90}mm with active convective cells.`,
        precipPotential: `${ai.precipitation?.quantiles_mm?.p90} mm ceiling`,
        windGusts: `${ai.wind?.gust_ceiling_p90_kmh || 38} km/h`,
        safetySummary: 'Avoid low-lying areas, keep emergency gear accessible, and stay tuned to meteorological advisories.'
      });
    }

    if (alertLevel === 'ORANGE') {
      alerts.push({
        id: `alert-orange-${Date.now()}`,
        level: 2,
        severity: 'Preparedness Watch',
        color: 'orange',
        status: 'active',
        title: 'Convective Rain & Squall Watch',
        headline: `Elevated precipitation expected (${ai.precipitation?.quantiles_mm?.p50}mm - ${ai.precipitation?.quantiles_mm?.p90}mm).`,
        location: loc.fullName,
        timeWindow: 'Next 6 - 12 Hours',
        description: `Moderate to heavy convective shower clusters tracking across the regional radar sector. Surface gust ceiling: ${ai.wind?.gust_ceiling_p90_kmh || 30} km/h.`,
        precipPotential: `${ai.precipitation?.quantiles_mm?.p50} - ${ai.precipitation?.quantiles_mm?.p90} mm`,
        windGusts: `${ai.wind?.gust_ceiling_p90_kmh || 30} km/h`,
        safetySummary: 'Carry rain protection, secure loose outdoor objects, and monitor radar scans.'
      });
    }

    if (ai?.wind?.gale_warning) {
      alerts.push({
        id: `alert-gale-${Date.now()}`,
        level: 2,
        severity: 'Gale Advisory',
        color: 'amber',
        status: 'active',
        title: 'High Surface Wind & Gale Advisory',
        headline: `Sustained wind ${ai.wind?.sustained_speed_kmh} km/h with gusts peaking at ${ai.wind?.gust_ceiling_p90_kmh} km/h.`,
        location: loc.fullName,
        timeWindow: 'Current & Upcoming 8 Hours',
        description: `Strong synoptic pressure gradient causing elevated turbulence and gust hazard for elevated structures and two-wheelers.`,
        precipPotential: 'Scattered',
        windGusts: `${ai.wind?.gust_ceiling_p90_kmh} km/h`,
        safetySummary: 'Exercise caution while driving on open highways and elevated transit flyovers.'
      });
    }

    if (ai?.temperature?.heatwave_advisory && ai.temperature.heatwave_advisory !== 'Normal') {
      alerts.push({
        id: `alert-heat-${Date.now()}`,
        level: 2,
        severity: 'Thermal Stress Advisory',
        color: 'amber',
        status: 'active',
        title: ai.temperature.heatwave_advisory,
        headline: `Rothfusz Heat Index reached ${ai.temperature.rothfusz_heat_index_celsius}°C (Ambient: ${loc.tempC}°C).`,
        location: loc.fullName,
        timeWindow: 'Peak Afternoon Hours',
        description: `Excessive heat index conditions with atmospheric capping inversion suppressing convective relief.`,
        precipPotential: '0 mm (Inversion Veto)',
        windGusts: `${ai.wind?.sustained_speed_kmh} km/h`,
        safetySummary: 'Stay well hydrated, avoid direct sun exposure between 12 PM - 4 PM, and use electrolytes.'
      });
    }

    // Fallback baseline informational alert
    alerts.push({
      id: `alert-info-${Date.now()}`,
      level: 1,
      severity: 'Normal Monitoring',
      color: 'sky',
      status: 'active',
      title: `${loc.name} Live Observation & AI Forecast`,
      headline: `${loc.condition} with ${loc.tempC}°C ambient temperature. Model status: ${alertLevel}.`,
      location: loc.fullName,
      timeWindow: 'Operational 24/7',
      description: `Continuous real-time multi-model ensemble (GFS, ECMWF, NCUM, WRF) monitoring with conformal uncertainty guarantee (${ai?.precipitation?.conformal_coverage || '86.75%'}).`,
      precipPotential: `${ai?.precipitation?.quantiles_mm?.p50 || 0} mm`,
      windGusts: `${loc.windGusts || 20} km/h`,
      safetySummary: 'Routine weather operations. Normal daily outdoor activities permitted.'
    });

    return alerts;
  };

  // Default climatic zone for initial model calibration
  const DEFAULT_CLIMATIC_ZONE = 5;

  // Main weather & forecast fetcher: Fetches live meteorological data and runs AI prediction model
  const fetchWeatherForecast = useCallback(async (latitude, longitude, climatic_zone = DEFAULT_CLIMATIC_ZONE, knownName = null, showNotification = true) => {
    setIsDynamicLoading(true);
    setMoesLoading(true);
    try {
      const data = await fetchWeatherForecastService(latitude, longitude, climatic_zone, knownName);
      if (data && data.location) {
        setCurrentLocation(data.location);
        setHourlyForecast(data.hourlyForecast);
        setSevenDayForecast(data.sevenDayForecast);
        setMoesPayload(data.moesPayload);
        setMoesResult(data.moesResult);
        setMoesInferenceSource(data.inferenceSource);

        // Build dynamic alerts
        const dynamicAlertList = buildDynamicAlerts(data.location, data.moesResult);
        setDynamicAlerts(dynamicAlertList);

        // Sync map center point
        setSelectedMapPoint({
          id: data.location.id,
          name: data.location.name,
          regionName: data.location.fullName,
          lat: data.location.latNum,
          lng: data.location.lngNum,
          currentTempC: data.location.tempC,
          rainRateMmHr: data.location.precipitation > 50 ? 6.2 : data.location.precipitation > 20 ? 1.8 : 0.0,
          condition: data.location.condition,
          status: data.moesResult?.precipitation?.alert === 'RED' ? 'Cloudburst Hazard' : data.location.condition
        });

        if (data.location) {
          try {
            localStorage.setItem('weatherai_user_detected_location', JSON.stringify(data.location));
          } catch (_) {}
        }

        if (showNotification) {
          showToast(`Live weather loaded for ${data.location.fullName}`, 'success');
        }
        return data;
      }
    } catch (err) {
      console.warn('Recovering dynamic weather observation:', err?.message);
    } finally {
      setIsDynamicLoading(false);
      setMoesLoading(false);
    }
  }, []);

  // Backward compatible helper for existing callers
  const loadLocationByCoords = useCallback((lat, lon, knownName = null, showNotification = true) => {
    return fetchWeatherForecast(lat, lon, DEFAULT_CLIMATIC_ZONE, knownName, showNotification);
  }, [fetchWeatherForecast]);

  // Robust location detector:
  // 1. Browser Geolocation (high-accuracy GPS)
  // 2. If geolocation is denied/timeout/iframe policy: IP Geolocation + OpenStreetMap Nominatim Reverse Geocoding
  // 3. Fallback to cached location or capital
  const detectUserLocation = useCallback(async (isUserManualClick = false) => {
    setGpsState('detecting');
    if (isUserManualClick) {
      showToast('Detecting location via GPS & OpenStreetMap...', 'info');
    }

    try {
      const coords = await detectUserCoordinates();
      setGpsState('active');

      let knownName = null;
      if (coords.cityHint) {
        knownName = {
          name: coords.cityHint,
          region: coords.regionHint || '',
          country: coords.countryHint || 'India',
          fullName: `${coords.cityHint}${coords.regionHint ? `, ${coords.regionHint}` : ''}${coords.countryHint ? `, ${coords.countryHint}` : ''}`
        };
      }

      const weatherResult = await fetchWeatherForecast(
        coords.latitude,
        coords.longitude,
        DEFAULT_CLIMATIC_ZONE,
        knownName,
        isUserManualClick
      );

      if (weatherResult?.location) {
        try {
          localStorage.setItem('weatherai_user_detected_location', JSON.stringify(weatherResult.location));
        } catch (_) {}
      }
    } catch (err) {
      console.warn('Location detection fallback triggered:', err);
      setGpsState('prompt');
      await fetchWeatherForecast(28.6139, 77.2090, DEFAULT_CLIMATIC_ZONE, {
        name: 'New Delhi',
        region: 'Delhi',
        country: 'India',
        fullName: 'New Delhi, Delhi, India'
      }, false);
    }
  }, [fetchWeatherForecast]);

  // Initial load: ping backend and detect user's current location by default
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      // 1. Health check MoES backend
      try {
        const startTime = Date.now();
        const health = await checkMoesBackendHealth();
        if (isMounted) {
          const latencyMs = Date.now() - startTime;
          setMoesBackendHealth({
            checked: true,
            online: health.online,
            latencyMs: health.online ? latencyMs : null,
            statusText: health.online ? 'Online (Render Live)' : 'Standby / Physics Emulation'
          });
        }
      } catch (e) {
        console.warn('Backend ping silent error:', e);
      }

      // 2. Automatically fetch user location & live weather data by default on startup
      if (isMounted) {
        detectUserLocation(false);
      }
    };

    init();
    return () => {
      isMounted = false;
    };
  }, [detectUserLocation]);

  const toggleTempUnit = () => {
    setTempUnit(prev => (prev === 'C' ? 'F' : 'C'));
    showToast(`Switched temperature units to °${tempUnit === 'C' ? 'F' : 'C'}`);
  };

  const formatTemp = (celsiusVal) => {
    if (celsiusVal === undefined || celsiusVal === null) return '--°';
    if (tempUnit === 'F') {
      const fVal = Math.round((celsiusVal * 9) / 5 + 32);
      return `${fVal}°`;
    }
    return `${celsiusVal}°`;
  };

  // Switch location from presets or city list
  const switchLocation = (locationId) => {
    const found = LOCATIONS.find(l => l.id === locationId);
    if (found) {
      loadLocationByCoords(found.latNum, found.lngNum, {
        name: found.name,
        region: found.region,
        country: found.country,
        fullName: found.fullName
      }, true);
    }
  };

  const addPinnedLocation = (newLoc) => {
    if (pinnedLocations.some(p => p.name.toLowerCase() === newLoc.name.toLowerCase())) {
      showToast(`${newLoc.name} is already pinned`, 'info');
      return;
    }
    const newEntry = {
      id: newLoc.id || `pin-${Date.now()}`,
      tag: 'Custom Pin',
      name: newLoc.name,
      region: `${newLoc.region}, ${newLoc.country}`,
      tempC: newLoc.tempC,
      tempF: newLoc.tempF,
      highC: newLoc.highC,
      lowC: newLoc.lowC,
      condition: newLoc.condition,
      rainProb: newLoc.precipitation,
      wind: `${newLoc.windSpeed} km/h`,
      latNum: newLoc.latNum,
      lngNum: newLoc.lngNum,
      isDefault: false
    };
    setPinnedLocations(prev => [...prev, newEntry]);
    showToast(`Pinned ${newLoc.name} to quick access list`);
  };

  const removePinnedLocation = (id) => {
    setPinnedLocations(prev => prev.filter(p => p.id !== id));
    showToast('Removed location from pinned list');
  };

  const value = {
    activeTab,
    setActiveTab,
    currentLocation,
    switchLocation,
    fetchWeatherForecast,
    loadLocationByCoords,
    detectUserLocation,
    defaultClimaticZone: DEFAULT_CLIMATIC_ZONE,
    isDynamicLoading,
    hourlyForecast,
    sevenDayForecast,
    dynamicAlerts,
    tempUnit,
    setTempUnit,
    toggleTempUnit,
    formatTemp,
    gpsState,
    setGpsState,
    pinnedLocations,
    addPinnedLocation,
    removePinnedLocation,
    selectedHourIndex,
    setSelectedHourIndex,
    alertFilter,
    setAlertFilter,
    warningsOnly,
    setWarningsOnly,
    showSafetyModal,
    setShowSafetyModal,
    activeModalAlert,
    setActiveModalAlert,
    showNotifications,
    setShowNotifications,
    toast,
    showToast,
    closeToast,
    mapLayer,
    setMapLayer,
    selectedMapPoint,
    setSelectedMapPoint,
    radarPlaying,
    setRadarPlaying,
    radarTimeStep,
    setRadarTimeStep,
    showAddCityModal,
    setShowAddCityModal,
    searchFilterQuery,
    setSearchFilterQuery,
    // MoES SIH26081 model predictions running dynamically in the backend
    moesPayload,
    moesResult,
    moesLoading,
    moesBackendHealth,
    moesInferenceSource
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
