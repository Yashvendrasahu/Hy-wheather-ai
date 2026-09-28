// src/components/map/RealLeafletRadarMap.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
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
  RefreshCw
} from 'lucide-react';

// Default enriched regional & national cities across India with precise geographical coordinates
const DEFAULT_MAP_CITIES = [
  {
    id: 'indore',
    name: 'Indore',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 22.7196,
    lng: 75.8577,
    tempC: 28,
    rainProb: 65,
    rainRate: 4.8,
    condition: 'Convective Showers',
    windSpeed: 18,
    windDir: 'NW',
    humidity: 74,
    pressure: 1012,
    baseZone: 'ORANGE',
    zoneTitle: 'Orange Alert Zone',
    zoneDesc: 'Active convective rain bands & gust potential',
    radiusMeters: 28000
  },
  {
    id: 'ujjain',
    name: 'Ujjain',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 23.1765,
    lng: 75.7885,
    tempC: 30,
    rainProb: 20,
    rainRate: 0.0,
    condition: 'Partly Cloudy',
    windSpeed: 14,
    windDir: 'SW',
    humidity: 62,
    pressure: 1012,
    baseZone: 'GREEN',
    zoneTitle: 'Green Safe Zone',
    zoneDesc: 'Fair weather, normal atmospheric stability',
    radiusMeters: 22000
  },
  {
    id: 'dewas',
    name: 'Dewas',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 22.9676,
    lng: 76.0534,
    tempC: 29,
    rainProb: 45,
    rainRate: 1.5,
    condition: 'Approaching Showers',
    windSpeed: 16,
    windDir: 'WNW',
    humidity: 68,
    pressure: 1011,
    baseZone: 'YELLOW',
    zoneTitle: 'Yellow Watch Zone',
    zoneDesc: 'Moderate cloud build-up and scattered showers',
    radiusMeters: 24000
  },
  {
    id: 'dhar',
    name: 'Dhar',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 22.5978,
    lng: 75.2967,
    tempC: 26,
    rainProb: 88,
    rainRate: 14.5,
    condition: 'Cloudburst Warning',
    windSpeed: 28,
    windDir: 'NW',
    humidity: 86,
    pressure: 1009,
    baseZone: 'RED',
    zoneTitle: 'Red Hazard Zone',
    zoneDesc: 'Severe convective cloudburst risk (P90 > 50mm)',
    radiusMeters: 32000
  },
  {
    id: 'pithampur',
    name: 'Pithampur',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 22.6145,
    lng: 75.6872,
    tempC: 27,
    rainProb: 75,
    rainRate: 8.2,
    condition: 'Heavy Rain Band',
    windSpeed: 22,
    windDir: 'WNW',
    humidity: 80,
    pressure: 1010,
    baseZone: 'RED',
    zoneTitle: 'Red Hazard Zone',
    zoneDesc: 'High precipitation rate & localized waterlogging risk',
    radiusMeters: 25000
  },
  {
    id: 'mhow',
    name: 'Mhow (Dr. Ambedkar Nagar)',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 22.5539,
    lng: 75.7547,
    tempC: 28,
    rainProb: 55,
    rainRate: 3.2,
    condition: 'Scattered Showers',
    windSpeed: 16,
    windDir: 'NW',
    humidity: 76,
    pressure: 1012,
    baseZone: 'ORANGE',
    zoneTitle: 'Orange Alert Zone',
    zoneDesc: 'Squall wind & convective rain front',
    radiusMeters: 20000
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    region: 'Madhya Pradesh',
    country: 'India',
    lat: 23.2599,
    lng: 77.4126,
    tempC: 31,
    rainProb: 15,
    rainRate: 0.0,
    condition: 'Fair & Sunny',
    windSpeed: 12,
    windDir: 'W',
    humidity: 50,
    pressure: 1013,
    baseZone: 'GREEN',
    zoneTitle: 'Green Safe Zone',
    zoneDesc: 'Stable anticyclone, clear visibility',
    radiusMeters: 30000
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    tempC: 32,
    rainProb: 40,
    rainRate: 1.2,
    condition: 'Humid Sea Breeze',
    windSpeed: 24,
    windDir: 'WSW',
    humidity: 78,
    pressure: 1008,
    baseZone: 'YELLOW',
    zoneTitle: 'Yellow Watch Zone',
    zoneDesc: 'Coastal squall & elevated tidal moisture',
    radiusMeters: 35000
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    region: 'Delhi NCR',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    tempC: 37,
    rainProb: 5,
    rainRate: 0.0,
    condition: 'Heat Stress / Clear',
    windSpeed: 10,
    windDir: 'NW',
    humidity: 35,
    pressure: 1011,
    baseZone: 'YELLOW',
    zoneTitle: 'Yellow Heat Watch',
    zoneDesc: 'High Rothfusz heat index with inversion',
    radiusMeters: 40000
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    region: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    tempC: 24,
    rainProb: 25,
    rainRate: 0.2,
    condition: 'Pleasant Breeze',
    windSpeed: 15,
    windDir: 'SW',
    humidity: 72,
    pressure: 1014,
    baseZone: 'GREEN',
    zoneTitle: 'Green Safe Zone',
    zoneDesc: 'Pleasant highland equilibrium',
    radiusMeters: 30000
  },
  {
    id: 'pune',
    name: 'Pune',
    region: 'Maharashtra',
    country: 'India',
    lat: 18.5204,
    lng: 73.8567,
    tempC: 29,
    rainProb: 20,
    rainRate: 0.0,
    condition: 'Partly Sunny',
    windSpeed: 15,
    windDir: 'W',
    humidity: 58,
    pressure: 1013,
    baseZone: 'GREEN',
    zoneTitle: 'Green Safe Zone',
    zoneDesc: 'Pleasant highland weather',
    radiusMeters: 28000
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    region: 'Gujarat',
    country: 'India',
    lat: 23.0225,
    lng: 72.5714,
    tempC: 35,
    rainProb: 10,
    rainRate: 0.0,
    condition: 'Hot & Clear',
    windSpeed: 14,
    windDir: 'SW',
    humidity: 45,
    pressure: 1010,
    baseZone: 'GREEN',
    zoneTitle: 'Green Safe Zone',
    zoneDesc: 'Dry stable conditions',
    radiusMeters: 30000
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    region: 'Maharashtra',
    country: 'India',
    lat: 21.1458,
    lng: 79.0882,
    tempC: 33,
    rainProb: 50,
    rainRate: 2.5,
    condition: 'Evening Thunder Showers',
    windSpeed: 16,
    windDir: 'WNW',
    humidity: 65,
    pressure: 1011,
    baseZone: 'YELLOW',
    zoneTitle: 'Yellow Watch Zone',
    zoneDesc: 'Isolated convective cells developing',
    radiusMeters: 28000
  }
];

// Helper to determine zone color scheme
function getZoneStyle(zone) {
  switch (zone) {
    case 'RED':
      return {
        fillColor: '#EF4444',
        color: '#DC2626',
        badgeBg: 'bg-red-500',
        badgeText: 'text-red-700',
        badgeBorder: 'border-red-400',
        badgeLight: 'bg-red-50 text-red-700 border-red-200',
        pillBg: '#EF4444',
        glow: 'rgba(239, 68, 68, 0.45)',
        label: 'RED ALERT ZONE'
      };
    case 'ORANGE':
      return {
        fillColor: '#F97316',
        color: '#EA580C',
        badgeBg: 'bg-orange-500',
        badgeText: 'text-orange-700',
        badgeBorder: 'border-orange-400',
        badgeLight: 'bg-orange-50 text-orange-700 border-orange-200',
        pillBg: '#F97316',
        glow: 'rgba(249, 115, 22, 0.35)',
        label: 'ORANGE WATCH ZONE'
      };
    case 'YELLOW':
      return {
        fillColor: '#F59E0B',
        color: '#D97706',
        badgeBg: 'bg-amber-500',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-400',
        badgeLight: 'bg-amber-50 text-amber-700 border-amber-200',
        pillBg: '#F59E0B',
        glow: 'rgba(245, 158, 11, 0.3)',
        label: 'YELLOW CAUTION ZONE'
      };
    case 'GREEN':
    default:
      return {
        fillColor: '#10B981',
        color: '#059669',
        badgeBg: 'bg-emerald-500',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-400',
        badgeLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        pillBg: '#10B981',
        glow: 'rgba(16, 185, 129, 0.25)',
        label: 'GREEN SAFE ZONE'
      };
  }
}

export default function RealLeafletRadarMap({
  height = 540,
  onCitySelected = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);
  const radarOverlayGroupRef = useRef(null);
  const markersGroupRef = useRef(null);

  const {
    currentLocation,
    formatTemp,
    mapLayer,
    setMapLayer,
    radarPlaying,
    radarTimeStep,
    selectedMapPoint,
    setSelectedMapPoint,
    fetchWeatherForecast,
    loadLocationByCoords,
    detectUserLocation,
    moesResult,
    showToast
  } = useWeather();

  const [mapTileTheme, setMapTileTheme] = useState('voyager'); // 'voyager' | 'osm' | 'dark'
  const [activeZoneFilter, setActiveZoneFilter] = useState('all'); // 'all' | 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN'

  // Construct dynamic city points combining preset cities + active user location
  const getEnrichedCities = useCallback(() => {
    const list = [...DEFAULT_MAP_CITIES];

    // If current location is loaded, calculate its zone and add/update it
    if (currentLocation && currentLocation.latNum && currentLocation.lngNum) {
      const existingIdx = list.findIndex(c => 
        (Math.abs(c.lat - currentLocation.latNum) < 0.08 && Math.abs(c.lng - currentLocation.lngNum) < 0.08) ||
        c.name.toLowerCase() === currentLocation.name.toLowerCase()
      );

      // Evaluate zone from moesResult or precipitation
      const aiAlert = moesResult?.precipitation?.alert;
      let calculatedZone = 'GREEN';
      if (aiAlert === 'RED' || currentLocation.precipitation > 75) {
        calculatedZone = 'RED';
      } else if (aiAlert === 'ORANGE' || currentLocation.precipitation > 50) {
        calculatedZone = 'ORANGE';
      } else if (aiAlert === 'YELLOW' || currentLocation.precipitation > 20 || currentLocation.tempC > 36) {
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
        rainProb: currentLocation.precipitation ?? 20,
        rainRate: currentLocation.precipitation > 50 ? 6.5 : currentLocation.precipitation > 20 ? 1.8 : 0.0,
        condition: currentLocation.condition || 'Live Telemetry',
        windSpeed: currentLocation.windSpeed ?? 14,
        windDir: currentLocation.windDirection ?? 'NW',
        humidity: currentLocation.humidity ?? 65,
        pressure: currentLocation.pressure ?? 1012,
        baseZone: calculatedZone,
        zoneTitle: calculatedZone === 'RED' ? 'Red Cloudburst Alert Zone' : calculatedZone === 'ORANGE' ? 'Orange Convective Watch' : calculatedZone === 'YELLOW' ? 'Yellow Thermal/Rain Caution' : 'Green Safe Zone',
        zoneDesc: calculatedZone === 'RED' ? 'Numerical model divergence & convective cloudburst probability high' : 'Continuous synoptic monitoring active',
        radiusMeters: 30000,
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

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map already initialized
    if (mapInstanceRef.current) return;

    const initialLat = currentLocation?.latNum || 22.7196;
    const initialLng = currentLocation?.lngNum || 75.8577;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 8,
      zoomControl: false,
      attributionControl: true
    });

    mapInstanceRef.current = map;

    // Layer groups for clean updates
    layersGroupRef.current = L.layerGroup().addTo(map);
    radarOverlayGroupRef.current = L.layerGroup().addTo(map);
    markersGroupRef.current = L.layerGroup().addTo(map);

    // Attribution
    map.attributionControl.setPrefix(
      '<span class="text-[10px] text-slate-500 font-semibold">© OpenStreetMap • CARTO • WeatherAI Physics Model</span>'
    );

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Handle Tile Layer Switcher (Voyager, OSM Standard, Dark)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let maxZoom = 19;
    let subdomains = 'abcd';

    if (mapTileTheme === 'osm') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    } else if (mapTileTheme === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    // Remove existing tile layer if present
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrl, {
      maxZoom,
      subdomains,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  }, [mapTileTheme]);

  // 3. Render Real Cities & Dynamic Green/Red Risk Zones on the Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layersGroupRef.current || !markersGroupRef.current) return;

    const cities = getEnrichedCities();
    const filteredCities = activeZoneFilter === 'all' 
      ? cities 
      : cities.filter(c => c.baseZone === activeZoneFilter);

    // Clear previous zones & markers
    layersGroupRef.current.clearLayers();
    markersGroupRef.current.clearLayers();

    filteredCities.forEach(city => {
      const style = getZoneStyle(city.baseZone);

      // A. Dynamic Risk Zone Circles (Green / Yellow / Orange / Red)
      if (mapLayer === 'rain' || mapLayer === 'risk') {
        // Base zone circle
        const zoneCircle = L.circle([city.lat, city.lng], {
          radius: city.radiusMeters || 25000,
          color: style.color,
          weight: city.baseZone === 'RED' ? 2.5 : 1.5,
          opacity: 0.85,
          fillColor: style.fillColor,
          fillOpacity: city.baseZone === 'RED' ? 0.32 : city.baseZone === 'ORANGE' ? 0.25 : city.baseZone === 'YELLOW' ? 0.18 : 0.12,
          className: city.baseZone === 'RED' ? 'animate-pulse' : ''
        });

        // Add to map
        zoneCircle.addTo(layersGroupRef.current);

        // For Red and Orange zones, add inner high-intensity core circle
        if (city.baseZone === 'RED' || city.baseZone === 'ORANGE') {
          const coreCircle = L.circle([city.lat, city.lng], {
            radius: (city.radiusMeters || 25000) * 0.45,
            color: style.color,
            weight: 2,
            opacity: 0.95,
            fillColor: style.fillColor,
            fillOpacity: 0.45
          });
          coreCircle.addTo(layersGroupRef.current);
        }
      } else if (mapLayer === 'temp') {
        // Temperature Thermal Zone Circles
        const isHot = city.tempC >= 35;
        const isWarm = city.tempC >= 28;
        const tempColor = isHot ? '#EF4444' : isWarm ? '#F59E0B' : '#10B981';

        L.circle([city.lat, city.lng], {
          radius: 26000,
          color: tempColor,
          weight: 1.5,
          fillColor: tempColor,
          fillOpacity: 0.22
        }).addTo(layersGroupRef.current);
      } else if (mapLayer === 'wind') {
        // Wind Gale Hazard Circles
        const isGale = city.windSpeed >= 22;
        const windColor = isGale ? '#DC2626' : '#0284C7';
        L.circle([city.lat, city.lng], {
          radius: 24000,
          color: windColor,
          weight: 1.5,
          fillColor: windColor,
          fillOpacity: isGale ? 0.28 : 0.15,
          dashArray: '5, 5'
        }).addTo(layersGroupRef.current);
      }

      // B. Custom Rich HTML Marker for Real City
      const isSelected = selectedMapPoint?.id === city.id || 
        (currentLocation?.latNum === city.lat && currentLocation?.lngNum === city.lng);

      const markerHtml = `
        <div class="group cursor-pointer transform -translate-x-1/2 -translate-y-full transition-all hover:scale-110">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg border ${
            city.isCurrentGPS
              ? 'bg-slate-950 text-white border-sky-400 ring-2 ring-sky-400/40'
              : isSelected
              ? 'bg-sky-900 text-white border-sky-300 ring-2 ring-sky-300/40'
              : 'bg-white/95 text-slate-800 border-slate-200/90'
          }">
            <span class="w-2.5 h-2.5 rounded-full shrink-0 ${style.badgeBg} ${
              city.baseZone === 'RED' ? 'animate-ping' : ''
            }"></span>
            <span class="text-xs font-extrabold tracking-tight whitespace-nowrap">${city.name}</span>
            <span class="text-[11px] font-black font-mono ml-0.5 ${
              city.isCurrentGPS ? 'text-sky-300' : 'text-slate-900'
            }">${formatTemp(city.tempC)}</span>
          </div>
          <div class="w-2 h-2 mx-auto rotate-45 -mt-1 ${
            city.isCurrentGPS ? 'bg-slate-950 border-r border-b border-sky-400' : 'bg-white border-r border-b border-slate-200'
          }"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-city-marker',
        iconSize: [120, 42],
        iconAnchor: [60, 42]
      });

      const marker = L.marker([city.lat, city.lng], { icon: customIcon });

      // Popup with Real City Data & 1-Click Load into Dashboard
      const popupContent = `
        <div class="p-3 font-sans max-w-[240px]">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
              style.badgeLight
            }">${style.label}</span>
            <span class="text-[10px] font-bold text-slate-400 font-mono">${city.lat.toFixed(2)}°N, ${city.lng.toFixed(2)}°E</span>
          </div>
          
          <h4 class="text-base font-extrabold text-slate-900 leading-tight">${city.name}</h4>
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
              <span class="text-[10px] text-slate-400 block font-semibold">Surface Wind</span>
              <span class="font-bold text-slate-700 font-mono">${city.windSpeed} km/h ${city.windDir}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block font-semibold">Humidity</span>
              <span class="font-bold text-slate-700 font-mono">${city.humidity}%</span>
            </div>
          </div>

          <p class="text-[11px] text-slate-600 mb-3 bg-white p-2 rounded-lg border border-slate-200">
            <strong class="text-slate-800">${city.zoneTitle}:</strong> ${city.zoneDesc}
          </p>

          <button
            id="load-city-btn-${city.id}"
            class="w-full py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Load & Sync Forecast</span>
            <span>→</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'custom-leaflet-popup'
      });

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
            showToast(`Loaded live weather & AI model for ${city.name}`, 'success');
          };
        }
      });

      marker.addTo(markersGroupRef.current);
    });
  }, [mapLayer, activeZoneFilter, selectedMapPoint, currentLocation, formatTemp, getEnrichedCities, fetchWeatherForecast, onCitySelected, showToast]);

  // 4. Time Scrubber & Dynamic Animated Rain/Doppler Bands
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !radarOverlayGroupRef.current) return;

    radarOverlayGroupRef.current.clearLayers();

    if (mapLayer === 'rain') {
      const cities = getEnrichedCities();
      // Drift offset based on radar time step (0 to 5)
      const driftLat = (radarTimeStep - 2) * 0.04;
      const driftLng = (radarTimeStep - 2) * 0.05;

      cities.filter(c => c.rainProb >= 40).forEach(city => {
        const intensity = city.rainProb >= 75 ? '#EF4444' : city.rainProb >= 50 ? '#F97316' : '#0284C7';
        const radarCell = L.circle([city.lat + driftLat, city.lng + driftLng], {
          radius: 18000 + (radarTimeStep * 1500),
          color: intensity,
          weight: 1,
          fillColor: intensity,
          fillOpacity: 0.28,
          dashArray: '3, 4'
        });
        radarCell.addTo(radarOverlayGroupRef.current);
      });
    }
  }, [radarTimeStep, mapLayer, getEnrichedCities]);

  // 5. Center map to active GPS/selected location
  const handleCenterGPS = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentLocation?.latNum && currentLocation?.lngNum) {
      map.flyTo([currentLocation.latNum, currentLocation.lngNum], 9, {
        duration: 1.2
      });
      showToast(`Map centered to ${currentLocation.fullName || currentLocation.name}`);
    } else {
      detectUserLocation();
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const cities = getEnrichedCities();
  const redCount = cities.filter(c => c.baseZone === 'RED').length;
  const orangeCount = cities.filter(c => c.baseZone === 'ORANGE').length;
  const yellowCount = cities.filter(c => c.baseZone === 'YELLOW').length;
  const greenCount = cities.filter(c => c.baseZone === 'GREEN').length;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Real Zone Filter Badges */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md pointer-events-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveZoneFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeZoneFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Cities ({cities.length})
          </button>
          <button
            onClick={() => setActiveZoneFilter('RED')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeZoneFilter === 'RED'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 bg-red-50 hover:bg-red-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>Red Zone ({redCount})</span>
          </button>
          <button
            onClick={() => setActiveZoneFilter('ORANGE')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeZoneFilter === 'ORANGE'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-orange-700 bg-orange-50 hover:bg-orange-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Orange ({orangeCount})</span>
          </button>
          <button
            onClick={() => setActiveZoneFilter('YELLOW')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeZoneFilter === 'YELLOW'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Yellow ({yellowCount})</span>
          </button>
          <button
            onClick={() => setActiveZoneFilter('GREEN')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeZoneFilter === 'GREEN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Green ({greenCount})</span>
          </button>
        </div>

        {/* Map Tile Switcher & Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-md text-xs font-bold text-slate-700">
            <button
              onClick={() => setMapTileTheme('voyager')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                mapTileTheme === 'voyager' ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              Voyager
            </button>
            <button
              onClick={() => setMapTileTheme('osm')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                mapTileTheme === 'osm' ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              OpenStreetMap
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

          <button
            onClick={handleCenterGPS}
            className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md hover:bg-sky-50 text-sky-700 border border-slate-200/80 shadow-md transition-all cursor-pointer"
            title="Fly to My GPS Location"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div
        ref={mapContainerRef}
        style={{ height: `${height}px` }}
        className="w-full z-0"
      />

      {/* Bottom Right Floating Zoom Controls */}
      <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="p-2.5 rounded-xl bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-800 border border-slate-200/80 shadow-md transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 rounded-xl bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-800 border border-slate-200/80 shadow-md transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left Legend */}
      <div className="absolute bottom-4 left-4 z-[400] p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md hidden sm:block max-w-[280px]">
        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
          Real Atmospheric Risk Zones
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-slate-800 font-bold">Green Zone:</span>
            <span className="text-slate-500 text-[11px]">Safe / Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
            <span className="text-slate-800 font-bold">Yellow Zone:</span>
            <span className="text-slate-500 text-[11px]">Convective Watch</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0"></span>
            <span className="text-slate-800 font-bold">Orange Zone:</span>
            <span className="text-slate-500 text-[11px]">Squall / Heavy Rain</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0"></span>
            <span className="text-slate-800 font-bold">Red Zone:</span>
            <span className="text-slate-500 text-[11px]">Cloudburst Hazard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
