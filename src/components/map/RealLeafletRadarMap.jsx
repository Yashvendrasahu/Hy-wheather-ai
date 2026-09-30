// src/components/map/RealLeafletRadarMap.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import axios from 'axios';
import { useWeather } from '../../context/WeatherContext.jsx';
import {
  ZoomIn,
  ZoomOut,
  Navigation,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CloudRain,
  Eye,
  RefreshCw,
  Play,
  Pause,
  CloudLightning,
  Wind
} from 'lucide-react';

// Default enriched regional & national cities across India with precise geographical coordinates
const DEFAULT_MAP_CITIES = [
  {
    id: 'satna',
    name: 'Satna',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 24.5797,
    lng: 80.8322,
    tempC: 29,
    rainProb: 60,
    rainRate: 4.2,
    condition: 'Scattered Rain Clouds',
    windSpeed: 16,
    windDir: 'NW',
    humidity: 76,
    pressure: 1011,
    baseZone: 'YELLOW',
    zoneTitle: 'Yellow Watch Zone',
    zoneDesc: 'Active convective cloud clusters & light-to-moderate showers',
    radiusMeters: 28000
  },
  {
    id: 'maihar',
    name: 'Maihar',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 24.2694,
    lng: 80.7562,
    tempC: 28,
    rainProb: 55,
    rainRate: 3.5,
    condition: 'Overcast & Showers',
    windSpeed: 14,
    windDir: 'WNW',
    humidity: 78,
    pressure: 1012,
    baseZone: 'YELLOW',
    zoneTitle: 'Yellow Watch Zone',
    zoneDesc: 'Highland moisture convergence, rain cloud build-up',
    radiusMeters: 25000
  },
  {
    id: 'rewa',
    name: 'Rewa',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 24.5362,
    lng: 81.3037,
    tempC: 30,
    rainProb: 40,
    rainRate: 1.8,
    condition: 'Convective Clouds',
    windSpeed: 15,
    windDir: 'W',
    humidity: 70,
    pressure: 1012,
    baseZone: 'GREEN',
    zoneTitle: 'Green Safe Zone',
    zoneDesc: 'Scattered moisture clouds, moderate stability',
    radiusMeters: 26000
  },
  {
    id: 'indore',
    name: 'Indore',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 22.7196,
    lng: 75.8577,
    tempC: 28,
    rainProb: 70,
    rainRate: 6.8,
    condition: 'Heavy Convective Downpour',
    windSpeed: 22,
    windDir: 'NW',
    humidity: 82,
    pressure: 1010,
    baseZone: 'ORANGE',
    zoneTitle: 'Orange Alert Zone',
    zoneDesc: 'Active convective rain bands & gust potential',
    radiusMeters: 32000
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 23.2599,
    lng: 77.4126,
    tempC: 29,
    rainProb: 45,
    rainRate: 2.2,
    condition: 'Passing Showers',
    windSpeed: 16,
    windDir: 'WNW',
    humidity: 72,
    pressure: 1011,
    baseZone: 'YELLOW',
    zoneTitle: 'Yellow Watch Zone',
    zoneDesc: 'Moderate cloud build-up and scattered showers',
    radiusMeters: 28000
  },
  {
    id: 'jabalpur',
    name: 'Jabalpur',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 23.1815,
    lng: 79.9864,
    tempC: 27,
    rainProb: 85,
    rainRate: 16.5,
    condition: 'Severe Thunderstorm & Downpour',
    windSpeed: 30,
    windDir: 'NW',
    humidity: 88,
    pressure: 1008,
    baseZone: 'RED',
    zoneTitle: 'Red Cloudburst Hazard Zone',
    zoneDesc: 'Severe convective cloudburst risk (P90 > 50mm)',
    radiusMeters: 36000
  },
  {
    id: 'mandi',
    name: 'Mandi',
    region: 'Himachal Pradesh',
    country: 'India',
    lat: 31.7087,
    lng: 76.9320,
    tempC: 21,
    rainProb: 95,
    rainRate: 24.5,
    condition: 'Flash Flood & Cloudburst Alert',
    windSpeed: 32,
    windDir: 'NNE',
    humidity: 92,
    pressure: 1004,
    baseZone: 'RED',
    zoneTitle: 'Red Extreme Hazard Zone',
    zoneDesc: 'High bust probability, severe Himalayan orographic cloudburst',
    radiusMeters: 38000
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    tempC: 31,
    rainProb: 65,
    rainRate: 8.5,
    condition: 'Coastal Monsoon Squall',
    windSpeed: 28,
    windDir: 'WSW',
    humidity: 85,
    pressure: 1008,
    baseZone: 'ORANGE',
    zoneTitle: 'Orange Squall Zone',
    zoneDesc: 'Coastal moisture surge and intense squall bands',
    radiusMeters: 35000
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    region: 'Delhi NCR',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    tempC: 36,
    rainProb: 15,
    rainRate: 0.0,
    condition: 'Partly Cloudy / Heat',
    windSpeed: 12,
    windDir: 'NW',
    humidity: 42,
    pressure: 1011,
    baseZone: 'YELLOW',
    zoneTitle: 'Yellow Heat Watch',
    zoneDesc: 'High Rothfusz heat index with inversion cap',
    radiusMeters: 35000
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    region: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    tempC: 25,
    rainProb: 30,
    rainRate: 0.8,
    condition: 'Pleasant Clouds',
    windSpeed: 14,
    windDir: 'SW',
    humidity: 68,
    pressure: 1014,
    baseZone: 'GREEN',
    zoneTitle: 'Green Safe Zone',
    zoneDesc: 'Stable highland weather, mild breeze',
    radiusMeters: 28000
  }
];

// Helper to generate natural organic cloud polygon coordinates around a center point
// Creates fluffy, scalloped cloud edges rather than plain circles
function generateCloudPolygon(centerLat, centerLng, radiusKm, lobeCount = 7, roughness = 0.22, angleOffset = 0) {
  const points = [];
  const totalSteps = 32;
  const kmToDegreeLat = 1 / 110.574;
  const kmToDegreeLng = 1 / (111.320 * Math.cos(centerLat * (Math.PI / 180)));

  for (let i = 0; i < totalSteps; i++) {
    const angle = (i / totalSteps) * 2 * Math.PI + angleOffset;
    // Harmonic wave for natural cloud bulges (badal ke aakaar)
    const perturbation = 1 + roughness * Math.sin(lobeCount * angle) + (roughness * 0.5) * Math.cos(3 * angle);
    const r = radiusKm * perturbation;

    const lat = centerLat + r * Math.sin(angle) * kmToDegreeLat;
    const lng = centerLng + r * Math.cos(angle) * kmToDegreeLng;
    points.push([lat, lng]);
  }
  return points;
}

// Zone styling configuration
function getZoneStyle(zone) {
  switch (zone) {
    case 'RED':
      return {
        fillColor: '#EF4444',
        color: '#DC2626',
        badgeBg: 'bg-red-500',
        badgeLight: 'bg-red-50 text-red-700 border-red-200',
        label: 'RED CLOUDBURST HAZARD'
      };
    case 'ORANGE':
      return {
        fillColor: '#F97316',
        color: '#EA580C',
        badgeBg: 'bg-orange-500',
        badgeLight: 'bg-orange-50 text-orange-700 border-orange-200',
        label: 'ORANGE CONVECTIVE WATCH'
      };
    case 'YELLOW':
      return {
        fillColor: '#F59E0B',
        color: '#D97706',
        badgeBg: 'bg-amber-500',
        badgeLight: 'bg-amber-50 text-amber-700 border-amber-200',
        label: 'YELLOW MOISTURE WATCH'
      };
    case 'GREEN':
    default:
      return {
        fillColor: '#10B981',
        color: '#059669',
        badgeBg: 'bg-emerald-500',
        badgeLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        label: 'GREEN SAFE ZONE'
      };
  }
}

export default function RealLeafletRadarMap({
  height = 540,
  isCompact = false,
  onCitySelected = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseTileLayerRef = useRef(null);
  const rainViewerTileLayerRef = useRef(null);
  const cloudRadarGroupRef = useRef(null);
  const markersGroupRef = useRef(null);
  const userGpsMarkerRef = useRef(null);

  const {
    currentLocation,
    formatTemp,
    mapLayer,
    setMapLayer,
    radarPlaying,
    setRadarPlaying,
    radarTimeStep,
    selectedMapPoint,
    setSelectedMapPoint,
    fetchWeatherForecast,
    detectUserLocation,
    moesResult,
    showToast
  } = useWeather();

  const [mapTileTheme, setMapTileTheme] = useState('osm'); // 'osm' | 'esri' | 'dark'
  const [activeZoneFilter, setActiveZoneFilter] = useState('all');
  const [showDopplerClouds, setShowDopplerClouds] = useState(true);
  const [cloudDriftStep, setCloudDriftStep] = useState(0);
  const [rainViewerPath, setRainViewerPath] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // 1. Fetch latest RainViewer global Doppler radar timestamp
  useEffect(() => {
    let isMounted = true;
    const fetchRadarTiles = async () => {
      try {
        const res = await axios.get('https://api.rainviewer.com/public/weather-maps.json', { timeout: 4000 });
        if (isMounted && res.data?.radar?.past && res.data.radar.past.length > 0) {
          const latestPast = res.data.radar.past[res.data.radar.past.length - 1];
          setRainViewerPath(latestPast.path);
        }
      } catch (err) {
        console.warn('RainViewer API offline, using high-resolution synoptic cloud engine:', err?.message);
      }
    };
    fetchRadarTiles();
    return () => { isMounted = false; };
  }, []);

  // 2. Animate radar clouds drift when playing
  useEffect(() => {
    if (!radarPlaying) return;
    const interval = setInterval(() => {
      setCloudDriftStep(prev => (prev + 1) % 6);
    }, 1800);
    return () => clearInterval(interval);
  }, [radarPlaying]);

  // Construct dynamic city points combining regional stations + user's current location
  const getEnrichedCities = useCallback(() => {
    const list = [...DEFAULT_MAP_CITIES];

    if (currentLocation && currentLocation.latNum && currentLocation.lngNum) {
      const existingIdx = list.findIndex(c =>
        (Math.abs(c.lat - currentLocation.latNum) < 0.12 && Math.abs(c.lng - currentLocation.lngNum) < 0.12) ||
        c.name.toLowerCase() === currentLocation.name.toLowerCase()
      );

      const aiAlert = moesResult?.precipitation?.alert;
      let calculatedZone = 'GREEN';
      if (aiAlert === 'RED' || currentLocation.precipitation > 70) {
        calculatedZone = 'RED';
      } else if (aiAlert === 'ORANGE' || currentLocation.precipitation > 45) {
        calculatedZone = 'ORANGE';
      } else if (aiAlert === 'YELLOW' || currentLocation.precipitation > 15 || currentLocation.tempC > 36) {
        calculatedZone = 'YELLOW';
      }

      const activeCityObj = {
        id: currentLocation.id || `active-${currentLocation.latNum}`,
        name: currentLocation.name || 'Current Location',
        region: currentLocation.region || '',
        country: currentLocation.country || 'India',
        lat: currentLocation.latNum,
        lng: currentLocation.lngNum,
        tempC: currentLocation.tempC ?? 28,
        rainProb: currentLocation.precipitation ?? 25,
        rainRate: currentLocation.precipitation > 50 ? 8.2 : currentLocation.precipitation > 20 ? 3.4 : 0.2,
        condition: currentLocation.condition || 'Live Telemetry',
        windSpeed: currentLocation.windSpeed ?? 14,
        windDir: currentLocation.windDirection ?? 'NW',
        humidity: currentLocation.humidity ?? 68,
        pressure: currentLocation.pressure ?? 1012,
        baseZone: calculatedZone,
        zoneTitle: calculatedZone === 'RED' ? 'Red Cloudburst Hazard Zone' : calculatedZone === 'ORANGE' ? 'Orange Convective Watch' : calculatedZone === 'YELLOW' ? 'Yellow Moisture Caution' : 'Green Safe Zone',
        zoneDesc: calculatedZone === 'RED' ? 'Extreme convective cloud activity & cloudburst risk' : 'Active synoptic atmospheric observation',
        radiusMeters: 32000,
        isCurrentGPS: true
      };

      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...activeCityObj, isCurrentGPS: true };
      } else {
        list.unshift(activeCityObj);
      }
    }

    return list;
  }, [currentLocation, moesResult]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = currentLocation?.latNum || 24.5797;
    const initialLng = currentLocation?.lngNum || 80.8322;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: isCompact ? 9 : 8,
      zoomControl: false,
      attributionControl: true
    });

    mapInstanceRef.current = map;

    // Layer groups
    cloudRadarGroupRef.current = L.layerGroup().addTo(map);
    markersGroupRef.current = L.layerGroup().addTo(map);

    map.attributionControl.setPrefix(
      '<span class="text-[10px] text-slate-500 font-semibold">© OpenStreetMap contributors • RainViewer Radar</span>'
    );

    setIsMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isCompact]);

  // 4. Update base map tiles (OpenStreetMap, Esri Street, Dark Radar)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    let tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let maxZoom = 19;
    let attribution = '© OpenStreetMap contributors';

    if (mapTileTheme === 'esri') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 19;
      attribution = 'Tiles © Esri';
    } else if (mapTileTheme === 'dark') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 16;
      attribution = 'Tiles © Esri & OpenStreetMap';
    }

    baseTileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom,
      attribution
    }).addTo(map);
  }, [mapTileTheme, isMapReady]);

  // 5. Update RainViewer Global Doppler Radar Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (rainViewerTileLayerRef.current) {
      map.removeLayer(rainViewerTileLayerRef.current);
      rainViewerTileLayerRef.current = null;
    }

    if (showDopplerClouds && rainViewerPath) {
      // Color scheme 2 = universal Doppler weather radar (Green, Yellow, Orange, Red)
      const radarUrl = `https://tilecache.rainviewer.com${rainViewerPath}/256/{z}/{x}/{y}/2/1_1.png`;
      rainViewerTileLayerRef.current = L.tileLayer(radarUrl, {
        opacity: 0.65,
        zIndex: 200,
        attribution: 'RainViewer Live Radar'
      }).addTo(map);
    }
  }, [showDopplerClouds, rainViewerPath, isMapReady]);

  // 6. Render Dynamic Weather Clouds ("Badal" in Green, Yellow, Orange, Red)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !cloudRadarGroupRef.current) return;

    cloudRadarGroupRef.current.clearLayers();

    if (!showDopplerClouds) return;

    const cities = getEnrichedCities();
    // Drift offset based on animation step
    const driftLat = (cloudDriftStep - 2.5) * 0.035;
    const driftLng = (cloudDriftStep - 2.5) * 0.045;

    cities.forEach((city, cityIdx) => {
      // Determine rain intensity and cloud size based on city data & MoES alert
      const rainIntensity = city.rainRate || (city.rainProb > 50 ? 5.0 : 0.5);
      const isRedAlert = city.baseZone === 'RED';
      const isOrangeAlert = city.baseZone === 'ORANGE';
      const isYellowAlert = city.baseZone === 'YELLOW';

      // Always draw active clouds around locations with rain or user's active spot
      if (city.rainProb >= 20 || city.isCurrentGPS) {
        const cLat = city.lat + driftLat;
        const cLng = city.lng + driftLng;
        const baseRadiusKm = 24 + (city.rainProb * 0.25);

        // ==========================================
        // 1. GREEN CLOUD LAYER (हरा बादल - Light Rain 15-25 dBZ)
        // ==========================================
        const greenPolyCoords = generateCloudPolygon(
          cLat,
          cLng,
          baseRadiusKm * 1.35,
          7,
          0.26,
          cityIdx + cloudDriftStep * 0.2
        );
        const greenCloud = L.polygon(greenPolyCoords, {
          color: '#16a34a',
          weight: 1.2,
          opacity: 0.7,
          fillColor: '#22c55e',
          fillOpacity: 0.35,
          smoothFactor: 1.5,
          interactive: false
        });
        greenCloud.addTo(cloudRadarGroupRef.current);

        // ==========================================
        // 2. YELLOW CLOUD LAYER (पीला बादल - Moderate Rain 25-35 dBZ)
        // ==========================================
        if (city.rainProb >= 35 || isYellowAlert || isOrangeAlert || isRedAlert) {
          const yellowPolyCoords = generateCloudPolygon(
            cLat + 0.02,
            cLng + 0.02,
            baseRadiusKm * 0.85,
            6,
            0.22,
            cityIdx * 1.5
          );
          const yellowCloud = L.polygon(yellowPolyCoords, {
            color: '#ca8a04',
            weight: 1.5,
            opacity: 0.85,
            fillColor: '#eab308',
            fillOpacity: 0.52,
            smoothFactor: 1.5,
            interactive: false
          });
          yellowCloud.addTo(cloudRadarGroupRef.current);
        }

        // ==========================================
        // 3. ORANGE CLOUD LAYER (नारंगी बादल - Heavy Rain 35-45 dBZ)
        // ==========================================
        if (city.rainProb >= 60 || isOrangeAlert || isRedAlert || rainIntensity >= 6.0) {
          const orangePolyCoords = generateCloudPolygon(
            cLat + 0.03,
            cLng + 0.03,
            baseRadiusKm * 0.52,
            5,
            0.20,
            cityIdx * 2.2
          );
          const orangeCloud = L.polygon(orangePolyCoords, {
            color: '#ea580c',
            weight: 1.8,
            opacity: 0.90,
            fillColor: '#f97316',
            fillOpacity: 0.68,
            smoothFactor: 1.5,
            interactive: false
          });
          orangeCloud.addTo(cloudRadarGroupRef.current);
        }

        // ==========================================
        // 4. RED CLOUDBURST CORE (लाल बादल - Severe Storm > 45-65 dBZ)
        // ==========================================
        if (isRedAlert || rainIntensity >= 14.0 || city.rainProb >= 80) {
          const redPolyCoords = generateCloudPolygon(
            cLat + 0.035,
            cLng + 0.035,
            baseRadiusKm * 0.28,
            5,
            0.18,
            cityIdx * 3.0
          );
          const redCloud = L.polygon(redPolyCoords, {
            color: '#dc2626',
            weight: 2.2,
            opacity: 0.98,
            fillColor: '#ef4444',
            fillOpacity: 0.82,
            smoothFactor: 1.5,
            className: 'animate-pulse',
            interactive: false
          });
          redCloud.addTo(cloudRadarGroupRef.current);

          // Deep purple convective center core for extreme cloudburst
          const purpleCore = L.circle([cLat + 0.035, cLng + 0.035], {
            radius: baseRadiusKm * 180,
            color: '#9333ea',
            weight: 1.5,
            fillColor: '#a855f7',
            fillOpacity: 0.92,
            interactive: false
          });
          purpleCore.addTo(cloudRadarGroupRef.current);
        }
      }
    });
  }, [showDopplerClouds, cloudDriftStep, getEnrichedCities, isMapReady]);

  // 7. Render City Markers & Weather Channel-Style User GPS Blue Dot
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    const cities = getEnrichedCities();
    const filteredCities = activeZoneFilter === 'all'
      ? cities
      : cities.filter(c => c.baseZone === activeZoneFilter);

    filteredCities.forEach(city => {
      const style = getZoneStyle(city.baseZone);

      // If this is the active user's location, render the exact Blue Location Dot matching The Weather Channel
      if (city.isCurrentGPS) {
        const userDotHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute w-9 h-9 rounded-full bg-blue-500/40 animate-ping"></div>
            <div class="w-4.5 h-4.5 rounded-full bg-blue-600 border-2 border-white shadow-lg z-10 flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <div class="absolute top-6 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900/90 text-white font-black text-[10px] tracking-tight shadow-md border border-slate-700/80 pointer-events-none">
              ${city.name} • ${formatTemp(city.tempC)}
            </div>
          </div>
        `;

        const userGpsIcon = L.divIcon({
          html: userDotHtml,
          className: 'user-gps-marker',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const userMarker = L.marker([city.lat, city.lng], {
          icon: userGpsIcon,
          zIndexOffset: 1000
        });

        userMarker.bindPopup(`
          <div class="p-2.5 font-sans max-w-[220px]">
            <div class="flex items-center gap-1.5 text-xs font-bold text-sky-700 mb-1">
              <span class="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Your Current Location</span>
            </div>
            <h4 class="text-sm font-extrabold text-slate-900 leading-tight">${city.name}</h4>
            <p class="text-[11px] text-slate-500 mb-2">${city.region}, ${city.country}</p>
            <div class="grid grid-cols-2 gap-1 p-1.5 bg-slate-50 rounded-lg text-xs font-mono">
              <div>Temp: <b class="text-slate-900">${formatTemp(city.tempC)}</b></div>
              <div>Rain: <b class="text-sky-600">${city.rainProb}%</b></div>
            </div>
          </div>
        `);

        userMarker.addTo(markersGroupRef.current);
        return;
      }

      // If compact widget mode, only show the user dot and a couple key cities to keep it clean like the screenshot
      if (isCompact && !city.isCurrentGPS) {
        // Simple subtle label pin in compact mode
        const compactMarkerHtml = `
          <div class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/90 border border-slate-200 shadow-2xs text-[10px] font-bold text-slate-700 whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full ${style.badgeBg}"></span>
            <span>${city.name}</span>
          </div>
        `;
        const compactIcon = L.divIcon({
          html: compactMarkerHtml,
          className: 'compact-marker',
          iconSize: [60, 20],
          iconAnchor: [30, 10]
        });
        const cMarker = L.marker([city.lat, city.lng], { icon: compactIcon });
        cMarker.addTo(markersGroupRef.current);
        return;
      }

      // Standard Rich City Marker for full screen mode
      const isSelected = selectedMapPoint?.id === city.id;
      const markerHtml = `
        <div class="group cursor-pointer transform -translate-x-1/2 -translate-y-full transition-all hover:scale-105">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md border ${
            isSelected
              ? 'bg-sky-900 text-white border-sky-300 ring-2 ring-sky-300/40'
              : 'bg-white/95 text-slate-800 border-slate-200/90'
          }">
            <span class="w-2 h-2 rounded-full shrink-0 ${style.badgeBg} ${
              city.baseZone === 'RED' ? 'animate-ping' : ''
            }"></span>
            <span class="text-xs font-extrabold tracking-tight whitespace-nowrap">${city.name}</span>
            <span class="text-[11px] font-black font-mono ml-0.5 text-slate-900">${formatTemp(city.tempC)}</span>
          </div>
          <div class="w-2 h-2 mx-auto rotate-45 -mt-1 bg-white border-r border-b border-slate-200"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-city-marker',
        iconSize: [110, 38],
        iconAnchor: [55, 38]
      });

      const marker = L.marker([city.lat, city.lng], { icon: customIcon });

      const popupContent = `
        <div class="p-3 font-sans max-w-[240px]">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${style.badgeLight}">
              ${style.label}
            </span>
          </div>
          <h4 class="text-sm font-extrabold text-slate-900 leading-tight">${city.name}</h4>
          <p class="text-xs text-slate-500 font-medium mb-2">${city.region}, ${city.country}</p>

          <div class="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-2">
            <div>
              <span class="text-[10px] text-slate-400 block font-semibold">Temperature</span>
              <span class="font-extrabold text-slate-900 font-mono">${formatTemp(city.tempC)}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block font-semibold">Rain Probability</span>
              <span class="font-extrabold text-sky-600 font-mono">${city.rainProb}%</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block font-semibold">Wind</span>
              <span class="font-bold text-slate-700 font-mono">${city.windSpeed} km/h</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block font-semibold">Humidity</span>
              <span class="font-bold text-slate-700 font-mono">${city.humidity}%</span>
            </div>
          </div>

          <button
            id="load-city-btn-${city.id}"
            class="w-full py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Sync Live Weather</span>
            <span>→</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260 });

      marker.on('click', () => {
        setSelectedMapPoint({
          id: city.id,
          name: city.name,
          regionName: `${city.name}, ${city.region}`,
          lat: city.lat,
          lng: city.lng,
          currentTempC: city.tempC,
          rainRateMmHr: city.rainRate,
          condition: city.condition,
          status: city.zoneTitle
        });
        if (onCitySelected) onCitySelected(city);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`load-city-btn-${city.id}`);
        if (btn) {
          btn.onclick = () => {
            fetchWeatherForecast(city.lat, city.lng, 5, {
              name: city.name,
              region: city.region,
              country: city.country,
              fullName: `${city.name}, ${city.region}`
            });
            showToast(`Loaded live weather for ${city.name}`, 'success');
          };
        }
      });

      marker.addTo(markersGroupRef.current);
    });
  }, [activeZoneFilter, isCompact, selectedMapPoint, currentLocation, formatTemp, getEnrichedCities, fetchWeatherForecast, onCitySelected, showToast, isMapReady]);

  // Center map to user's GPS coordinates
  const handleCenterGPS = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentLocation?.latNum && currentLocation?.lngNum) {
      map.flyTo([currentLocation.latNum, currentLocation.lngNum], isCompact ? 10 : 9, {
        duration: 1.0
      });
      showToast(`Map centered to ${currentLocation.fullName || currentLocation.name}`);
    } else {
      detectUserLocation(true);
    }
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  const cities = getEnrichedCities();
  const redCount = cities.filter(c => c.baseZone === 'RED').length;
  const orangeCount = cities.filter(c => c.baseZone === 'ORANGE').length;
  const yellowCount = cities.filter(c => c.baseZone === 'YELLOW').length;
  const greenCount = cities.filter(c => c.baseZone === 'GREEN').length;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100 select-none">
      
      {/* 1. TOP-LEFT "NOW" LIVE BADGE (Matching The Weather Channel Screenshot) */}
      <div className="absolute top-3.5 left-3.5 z-[400] flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white backdrop-blur-md shadow-md border border-slate-700/80 font-bold text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="tracking-wide">Now</span>
        </div>

        {/* Doppler Clouds Active Pill */}
        <button
          onClick={() => setShowDopplerClouds(!showDopplerClouds)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md backdrop-blur-md cursor-pointer border ${
            showDopplerClouds
              ? 'bg-white/95 text-slate-800 border-slate-200 hover:bg-slate-50'
              : 'bg-slate-800/80 text-slate-300 border-slate-700'
          }`}
          title="Toggle Doppler Weather Clouds (बादल)"
        >
          <CloudRain className={`w-3.5 h-3.5 ${showDopplerClouds ? 'text-sky-600' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Radar Clouds (बादल)</span>
          <span className="sm:hidden">Clouds</span>
        </button>
      </div>

      {/* 2. TOP RIGHT CONTROLS: Center GPS & Map Switcher */}
      <div className="absolute top-3.5 right-3.5 z-[400] flex items-center gap-2 pointer-events-auto">
        {!isCompact && (
          <div className="hidden sm:flex items-center p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-md text-xs font-bold text-slate-700">
            <button
              onClick={() => setMapTileTheme('osm')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                mapTileTheme === 'osm' ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              OpenStreetMap
            </button>
            <button
              onClick={() => setMapTileTheme('esri')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                mapTileTheme === 'esri' ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              HD Street Map
            </button>
            <button
              onClick={() => setMapTileTheme('dark')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                mapTileTheme === 'dark' ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              Dark Radar
            </button>
          </div>
        )}

        <button
          onClick={handleCenterGPS}
          className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md hover:bg-sky-50 text-sky-700 border border-slate-200/80 shadow-md transition-all cursor-pointer"
          title="Fly to My Current GPS Location"
        >
          <Navigation className="w-4 h-4 text-sky-600" />
        </button>
      </div>

      {/* 3. FULL-MODE ONLY: Alert Filter Badges Bar */}
      {!isCompact && (
        <div className="absolute top-16 left-3.5 right-3.5 z-[400] flex items-center gap-1.5 p-1 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md pointer-events-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveZoneFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
              activeZoneFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Stations ({cities.length})
          </button>
          <button
            onClick={() => setActiveZoneFilter('RED')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeZoneFilter === 'RED'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 bg-red-50 hover:bg-red-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>Red Hazard ({redCount})</span>
          </button>
          <button
            onClick={() => setActiveZoneFilter('ORANGE')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeZoneFilter === 'ORANGE'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-orange-700 bg-orange-50 hover:bg-orange-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Orange Alert ({orangeCount})</span>
          </button>
          <button
            onClick={() => setActiveZoneFilter('YELLOW')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeZoneFilter === 'YELLOW'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Yellow Watch ({yellowCount})</span>
          </button>
          <button
            onClick={() => setActiveZoneFilter('GREEN')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeZoneFilter === 'GREEN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Green Safe ({greenCount})</span>
          </button>
        </div>
      )}

      {/* 4. MAIN MAP CONTAINER */}
      <div
        ref={mapContainerRef}
        style={{ height: `${height}px` }}
        className="w-full z-0"
      />

      {/* 5. BOTTOM-RIGHT FLOATING ZOOM CONTROLS */}
      <div className="absolute bottom-4 right-3.5 z-[400] flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          className="p-2 sm:p-2.5 rounded-xl bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-800 border border-slate-200/80 shadow-md transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 sm:p-2.5 rounded-xl bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-800 border border-slate-200/80 shadow-md transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* 6. BOTTOM DOPPLER RADAR REFLECTIVITY BAR (Green -> Yellow -> Orange -> Red) */}
      <div className="absolute bottom-4 left-3.5 z-[400] p-2 sm:p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md pointer-events-auto max-w-[calc(100%-80px)] sm:max-w-md">
        <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-600 mb-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>Doppler Radar Cloud Scale</span>
          </div>
          <span className="font-mono text-slate-400">dBZ (Reflectivity)</span>
        </div>

        {/* Gradient Reflectivity Bar */}
        <div className="h-2 rounded-full overflow-hidden flex shadow-inner border border-slate-200">
          <div className="h-full flex-1 bg-emerald-500" title="Light Rain (15-25 dBZ)" />
          <div className="h-full flex-1 bg-yellow-400" title="Moderate Rain (25-35 dBZ)" />
          <div className="h-full flex-1 bg-orange-500" title="Heavy Rain (35-45 dBZ)" />
          <div className="h-full flex-1 bg-rose-600" title="Severe Storm / Cloudburst (> 45 dBZ)" />
          <div className="h-full flex-[0.5] bg-purple-600" title="Extreme Convective Burst (> 60 dBZ)" />
        </div>

        {/* Legend Labels */}
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 mt-1">
          <span className="text-emerald-700">Light (हरा)</span>
          <span className="text-amber-700">Moderate (पीला)</span>
          <span className="text-orange-700">Heavy (नारंगी)</span>
          <span className="text-rose-700">Severe (लाल)</span>
        </div>
      </div>

    </div>
  );
}
