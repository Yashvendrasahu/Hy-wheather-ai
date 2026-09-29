// src/components/alerts/NationalSynopticRainAlertMap.jsx
import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import {
  AlertTriangle,
  CloudLightning,
  Wind,
  CloudRain,
  ShieldAlert,
  Zap,
  Radio,
  Eye,
  Info,
  Maximize2,
  RefreshCw,
  Compass,
  MapPin,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

// National state weather alert definitions based on IMD / MoES AI severe weather warnings
export const INDIA_STATE_ALERTS = [
  {
    id: 'up',
    name: 'Uttar Pradesh',
    shortName: 'UP',
    alert: 'RED',
    alertTitle: 'Red Alert: Severe Rain & Cloudburst',
    rain24h: '95 - 165 mm',
    windSpeed: '60 - 75 km/h',
    lightningRisk: 'Extreme',
    statusDesc: 'Deep convective depression causing torrential rainfall and urban flash flood risks.',
    keyDistricts: ['Lucknow', 'Varanasi', 'Prayagraj', 'Gorakhpur', 'Kanpur', 'Ayodhya'],
    synopticReason: 'Monsoon trough convergence with mid-tropospheric cyclonic circulation.',
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.65)',
    svgPath: 'M 350,150 L 390,165 L 430,195 L 460,205 L 450,240 L 410,250 L 380,245 L 350,225 L 330,190 Z',
    labelPos: { x: 395, y: 205 }
  },
  {
    id: 'bihar',
    name: 'Bihar',
    shortName: 'Bihar',
    alert: 'RED',
    alertTitle: 'Red Alert: Torrential Downpour',
    rain24h: '110 - 180 mm',
    windSpeed: '55 - 70 km/h',
    lightningRisk: 'Extreme (Vajra-paat Warning)',
    statusDesc: 'Heavy catchment runoff into Kosi and Gandak basins. High probability of flash inundation.',
    keyDistricts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
    synopticReason: 'Low-pressure system anchored over Bihar-Jharkhand border with moisture feed from Bay of Bengal.',
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.65)',
    svgPath: 'M 460,205 L 520,215 L 530,255 L 485,260 L 450,240 Z',
    labelPos: { x: 490, y: 235 }
  },
  {
    id: 'kerala',
    name: 'Kerala',
    shortName: 'Kerala',
    alert: 'RED',
    alertTitle: 'Red Alert: Coastal Ghats Cloudburst',
    rain24h: '140 - 220 mm',
    windSpeed: '65 - 80 km/h',
    lightningRisk: 'High',
    statusDesc: 'Offshore moisture trough driving severe orographic cloud bursts along the Western Ghats.',
    keyDistricts: ['Wayanad', 'Idukki', 'Kottayam', 'Ernakulam', 'Thrissur', 'Palakkad'],
    synopticReason: 'Vigorous Arabian Sea surge pushing heavy stratiform and convective rain bands.',
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.7)',
    svgPath: 'M 285,465 L 305,485 L 330,550 L 320,565 L 295,520 L 280,480 Z',
    labelPos: { x: 275, y: 525 }
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    shortName: 'Uttarakhand',
    alert: 'ORANGE',
    alertTitle: 'Orange Alert: Orographic Cloudburst',
    rain24h: '75 - 125 mm',
    windSpeed: '45 - 60 km/h',
    lightningRisk: 'Moderate-High',
    statusDesc: 'High risk of mudslides, cloudbursts, and sudden river level rise in hilly terrains.',
    keyDistricts: ['Dehradun', 'Haridwar', 'Nainital', 'Chamoli', 'Rishikesh', 'Pithoragarh'],
    synopticReason: 'Western disturbance interaction with monsoon easterly winds.',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    svgPath: 'M 330,120 L 375,135 L 370,170 L 335,160 Z',
    labelPos: { x: 355, y: 145 }
  },
  {
    id: 'himachal',
    name: 'Himachal Pradesh',
    shortName: 'HP',
    alert: 'ORANGE',
    alertTitle: 'Orange Alert: Flash Flood Warning',
    rain24h: '70 - 110 mm',
    windSpeed: '40 - 55 km/h',
    lightningRisk: 'High',
    statusDesc: 'Severe convective thunderstorms with isolated cloudbursts in Beas and Sutlej valleys.',
    keyDistricts: ['Mandi', 'Shimla', 'Kullu', 'Kangra', 'Chamba', 'Solan'],
    synopticReason: 'Himalayan windward lifting of intense moisture plumes.',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    svgPath: 'M 305,85 L 345,100 L 330,135 L 295,120 Z',
    labelPos: { x: 320, y: 105 }
  },
  {
    id: 'punjab',
    name: 'Punjab',
    shortName: 'Punjab',
    alert: 'ORANGE',
    alertTitle: 'Orange Alert: Squall & Heavy Rain',
    rain24h: '50 - 90 mm',
    windSpeed: '55 - 70 km/h',
    lightningRisk: 'High',
    statusDesc: 'Approaching squall line with gusty winds and widespread downpours.',
    keyDistricts: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda'],
    synopticReason: 'Convective instability along the northern terminal of the monsoon trough.',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    svgPath: 'M 270,105 L 305,100 L 295,145 L 260,140 Z',
    labelPos: { x: 280, y: 125 }
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    shortName: 'Rajasthan',
    alert: 'ORANGE',
    alertTitle: 'Orange Alert: Cyclonic Gale & Downpour',
    rain24h: '60 - 105 mm',
    windSpeed: '60 - 75 km/h',
    lightningRisk: 'Severe',
    statusDesc: 'Deep cyclonic circulation drawing Arabian Sea moisture across southern & eastern desert belts.',
    keyDistricts: ['Jaipur', 'Udaipur', 'Kota', 'Ajmer', 'Jodhpur', 'Bhilwara'],
    synopticReason: 'Arabian Sea cyclonic depression track moving northeastward.',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    svgPath: 'M 215,150 L 290,145 L 330,195 L 300,260 L 240,240 L 210,190 Z',
    labelPos: { x: 270, y: 200 }
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    shortName: 'Gujarat',
    alert: 'ORANGE',
    alertTitle: 'Orange Alert: Coastal Cyclone Vortex',
    rain24h: '80 - 145 mm',
    windSpeed: '65 - 80 km/h',
    lightningRisk: 'High',
    statusDesc: 'Severe coastal squall and tidal surges. High wind gusts over Saurashtra and Kutch.',
    keyDistricts: ['Surat', 'Ahmedabad', 'Rajkot', 'Vadodara', 'Dwarka', 'Bhavnagar'],
    synopticReason: 'Deep atmospheric depression rotating over northeast Arabian Sea.',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.7)',
    svgPath: 'M 170,245 L 240,240 L 260,290 L 215,320 L 175,295 L 155,260 Z',
    labelPos: { x: 205, y: 275 }
  },
  {
    id: 'mp',
    name: 'Madhya Pradesh',
    shortName: 'MP',
    alert: 'ORANGE',
    alertTitle: 'Orange Alert: Convective Rain Storms',
    rain24h: '70 - 120 mm',
    windSpeed: '50 - 65 km/h',
    lightningRisk: 'High',
    statusDesc: 'Wide convective squall bands crossing Indore-Bhopal-Rewa-Satna corridor.',
    keyDistricts: ['Indore', 'Bhopal', 'Satna', 'Jabalpur', 'Rewa', 'Ujjain', 'Gwalior'],
    synopticReason: 'Central India low-pressure convergence zone actively producing multi-cell storm clusters.',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    svgPath: 'M 285,230 L 375,225 L 430,265 L 390,320 L 310,310 L 265,280 Z',
    labelPos: { x: 345, y: 270 }
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    shortName: 'Maharashtra',
    alert: 'ORANGE',
    alertTitle: 'Orange Alert: Heavy Konkan & Ghats Rain',
    rain24h: '90 - 150 mm',
    windSpeed: '55 - 70 km/h',
    lightningRisk: 'Moderate-High',
    statusDesc: 'Continuous monsoon downpours over Mumbai, Thane, Pune, and coastal Konkan belt.',
    keyDistricts: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Ratnagiri', 'Kolhapur', 'Thane'],
    synopticReason: 'Strong westerly offshore winds colliding with Sahyadri mountain range.',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.65)',
    svgPath: 'M 235,305 L 310,305 L 370,335 L 340,400 L 275,395 L 245,340 Z',
    labelPos: { x: 295, y: 350 }
  },
  {
    id: 'tamilnadu',
    name: 'Tamil Nadu',
    shortName: 'Tamil Nadu',
    alert: 'ORANGE',
    alertTitle: 'Orange Alert: Thunderstorms & Downpours',
    rain24h: '60 - 100 mm',
    windSpeed: '45 - 60 km/h',
    lightningRisk: 'High',
    statusDesc: 'Intense evening convective cells with heavy localized downpours and lightning.',
    keyDistricts: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Kanyakumari'],
    synopticReason: 'Easterly moisture pulse from southern Bay of Bengal creating thermodynamic updrafts.',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    svgPath: 'M 305,485 L 360,470 L 350,560 L 320,565 Z',
    labelPos: { x: 335, y: 515 }
  },
  {
    id: 'kashmir',
    name: 'Jammu & Kashmir / Ladakh',
    shortName: 'J&K',
    alert: 'YELLOW',
    alertTitle: 'Yellow Watch: Western Disturbance',
    rain24h: '20 - 45 mm',
    windSpeed: '30 - 45 km/h',
    lightningRisk: 'Low-Moderate',
    statusDesc: 'Scattered light to moderate snow/rain over higher reaches.',
    keyDistricts: ['Srinagar', 'Jammu', 'Leh', 'Anantnag', 'Baramulla'],
    synopticReason: 'Upper air cyclonic circulation over north Pakistan & adjoining J&K.',
    color: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    svgPath: 'M 260,25 L 320,30 L 350,75 L 295,85 L 260,60 Z',
    labelPos: { x: 300, y: 55 }
  },
  {
    id: 'odisha',
    name: 'Odisha',
    shortName: 'Odisha',
    alert: 'YELLOW',
    alertTitle: 'Yellow Watch: Coastal Showers',
    rain24h: '35 - 65 mm',
    windSpeed: '40 - 50 km/h',
    lightningRisk: 'Moderate',
    statusDesc: 'Approaching rain bands from Bay of Bengal low-pressure area.',
    keyDistricts: ['Bhubaneswar', 'Cuttack', 'Puri', 'Balasore', 'Rourkela'],
    synopticReason: 'Cyclonic circulation over north-west Bay of Bengal.',
    color: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    svgPath: 'M 410,290 L 460,290 L 440,360 L 390,340 Z',
    labelPos: { x: 425, y: 320 }
  },
  {
    id: 'northeast',
    name: 'North-East States (Assam, Meghalaya)',
    shortName: 'North-East',
    alert: 'ORANGE',
    alertTitle: 'Orange Alert: Brahmaputra Valley Heavy Rain',
    rain24h: '85 - 150 mm',
    windSpeed: '40 - 55 km/h',
    lightningRisk: 'High',
    statusDesc: 'Heavy monsoonal moisture surge trapped between Himalayan foothills and Meghalaya plateau.',
    keyDistricts: ['Guwahati', 'Cherrapunji', 'Shillong', 'Silchar', 'Dibrugarh'],
    synopticReason: 'Strong south-westerly winds from Bay of Bengal hitting the Cherra-Mawsynram ridge.',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    svgPath: 'M 545,190 L 610,195 L 615,245 L 540,245 Z',
    labelPos: { x: 575, y: 220 }
  }
];

export default function NationalSynopticRainAlertMap({
  isCompact = false,
  onStateSelect = null
}) {
  const { currentLocation, formatTemp, showToast } = useWeather();
  const [selectedState, setSelectedState] = useState(INDIA_STATE_ALERTS[0]); // Default UP or matched state
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'RED' | 'ORANGE' | 'CYCLONE'
  const [isVortexActive, setIsVortexActive] = useState(true);
  const [lightningFlash, setLightningFlash] = useState(false);

  // Auto-detect matching state from user location if possible
  useEffect(() => {
    if (currentLocation?.region) {
      const regionLower = currentLocation.region.toLowerCase();
      const matched = INDIA_STATE_ALERTS.find(
        st => regionLower.includes(st.name.toLowerCase()) || regionLower.includes(st.shortName.toLowerCase())
      );
      if (matched) {
        setSelectedState(matched);
      }
    }
  }, [currentLocation]);

  // Periodic lightning flash simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLightningFlash(true);
      setTimeout(() => setLightningFlash(false), 240);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleStateClick = (state) => {
    setSelectedState(state);
    if (onStateSelect) onStateSelect(state);
    showToast(`Viewing alert status for ${state.name} (${state.alert} Alert)`, 'info');
  };

  const redCount = INDIA_STATE_ALERTS.filter(s => s.alert === 'RED').length;
  const orangeCount = INDIA_STATE_ALERTS.filter(s => s.alert === 'ORANGE').length;
  const yellowCount = INDIA_STATE_ALERTS.filter(s => s.alert === 'YELLOW').length;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#071328] via-[#091b36] to-[#040d1a] border border-slate-700/80 shadow-2xl text-white select-none">
      
      {/* 1. TOP HEADER & LIVE SYNOPTIC CONTROLS */}
      <div className="relative z-20 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/90 bg-slate-950/40 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-sky-400 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>National Severe Weather & Cyclone Alert</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline font-mono">IMD & MoES AI Model</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>अखिल भारतीय वर्षा एवं तूफान चेतावनी</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold">
              LIVE RADAR
            </span>
          </h2>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'ALL' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            All States ({INDIA_STATE_ALERTS.length})
          </button>
          <button
            onClick={() => setFilterMode('RED')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filterMode === 'RED' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Red Alert ({redCount})</span>
          </button>
          <button
            onClick={() => setFilterMode('ORANGE')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filterMode === 'ORANGE' ? 'bg-orange-500 text-white shadow-xs' : 'text-orange-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Orange ({orangeCount})</span>
          </button>
          <button
            onClick={() => setIsVortexActive(!isVortexActive)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isVortexActive ? 'bg-cyan-600 text-white shadow-xs' : 'text-cyan-400 hover:text-white'
            }`}
            title="Toggle Cyclonic Wind Vortex"
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cyclone Wind (70 km/h)</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN VISUAL CANVAS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-3 sm:p-5 relative items-center">
        
        {/* Left: Glowing Vector India Alert Map with Cyclonic Vortex (7 Cols) */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] overflow-hidden rounded-2xl bg-radial from-[#0d284f] to-[#040d1a] border border-slate-800/80 shadow-inner">
          
          {/* Background Ambient Atmospheric Isobars */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="synopticGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#synopticGrid)" />
          </svg>

          {/* Cyclonic Wind Vortex Streamlines (Arabian Sea Spiral) */}
          {isVortexActive && (
            <div className="absolute top-1/2 left-[20%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                
                {/* Spiral Concentric Wind Rings */}
                <svg className="w-full h-full animate-spin-slow opacity-80" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="14,14" strokeOpacity="0.8" />
                  <circle cx="100" cy="100" r="65" fill="none" stroke="#06B6D4" strokeWidth="2.2" strokeDasharray="12,12" strokeOpacity="0.85" />
                  <circle cx="100" cy="100" r="45" fill="none" stroke="#22D3EE" strokeWidth="2" strokeDasharray="10,10" strokeOpacity="0.9" />
                  <circle cx="100" cy="100" r="25" fill="none" stroke="#67E8F9" strokeWidth="1.8" strokeDasharray="8,8" strokeOpacity="0.95" />
                  
                  {/* Vortex Arrow Markers */}
                  <polygon points="100,10 108,18 92,18" fill="#38BDF8" />
                  <polygon points="190,100 182,108 182,92" fill="#06B6D4" />
                  <polygon points="100,190 92,182 108,182" fill="#22D3EE" />
                  <polygon points="10,100 18,92 18,108" fill="#38BDF8" />
                </svg>

                {/* Center High Wind Badge (Matching Screenshot "Up to 70 kmph") */}
                <div className="absolute px-3 py-1.5 rounded-2xl bg-slate-950/90 border border-cyan-400/80 shadow-2xl backdrop-blur-md text-center pointer-events-auto">
                  <div className="text-[10px] uppercase font-black tracking-wider text-cyan-300">Up to</div>
                  <div className="text-base sm:text-lg font-black text-white font-mono leading-none">70 kmph</div>
                  <div className="text-[8px] text-cyan-400/90 font-bold uppercase tracking-tight">Gust Vortex</div>
                </div>
              </div>
            </div>
          )}

          {/* Severe Lightning Strikes Over Bay of Bengal & Red Zones */}
          <div className="absolute top-1/3 right-8 pointer-events-none z-10">
            <svg
              className={`w-16 h-24 sm:w-20 sm:h-32 text-amber-300 transition-opacity duration-150 ${
                lightningFlash ? 'opacity-100 drop-shadow-[0_0_20px_#FDE047]' : 'opacity-20'
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <div className="text-[9px] font-black text-amber-400 font-mono tracking-wider text-center uppercase">
              ⚡ Vajra-Paat Risk
            </div>
          </div>

          {/* INDIA VECTOR MAP WITH GLOWING ALERT STATES */}
          <svg
            className="w-full max-w-[560px] h-[360px] sm:h-[440px] z-15 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
            viewBox="120 10 520 580"
          >
            {/* Ambient Background Glow Layer */}
            <defs>
              <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render Each State Vector Polygon */}
            {INDIA_STATE_ALERTS.map((state) => {
              const isSelected = selectedState?.id === state.id;
              const isFiltered =
                filterMode === 'ALL' ||
                (filterMode === 'RED' && state.alert === 'RED') ||
                (filterMode === 'ORANGE' && state.alert === 'ORANGE');

              if (!isFiltered) return null;

              const isRed = state.alert === 'RED';
              const isOrange = state.alert === 'ORANGE';

              return (
                <g key={state.id} className="cursor-pointer group" onClick={() => handleStateClick(state)}>
                  {/* Outer Pulsing Aura for Red Alert States */}
                  {isRed && (
                    <path
                      d={state.svgPath}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="5"
                      strokeOpacity="0.4"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main State Shape */}
                  <path
                    d={state.svgPath}
                    fill={state.color}
                    fillOpacity={isSelected ? 0.95 : isRed ? 0.85 : isOrange ? 0.78 : 0.55}
                    stroke={isSelected ? '#FFFFFF' : isRed ? '#FCA5A5' : isOrange ? '#FED7AA' : '#FEF08A'}
                    strokeWidth={isSelected ? 3.5 : 1.8}
                    filter={isRed ? 'url(#glowRed)' : isOrange ? 'url(#glowOrange)' : undefined}
                    className="transition-all duration-200 hover:brightness-125"
                  />

                  {/* State Name Text Label with Drop Shadow */}
                  <text
                    x={state.labelPos.x}
                    y={state.labelPos.y}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="900"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    className="pointer-events-none select-none tracking-tight filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  >
                    {state.shortName}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Bottom Left Legend */}
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-bold">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Red (अति भारी)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Orange (भारी)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span>Yellow (मध्यम)</span>
            </div>
          </div>
        </div>

        {/* Right: Selected State Synoptic Threat & Safety Dossier (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-xl space-y-3.5 backdrop-blur-md">
          
          {/* Active State Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  selectedState.alert === 'RED'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                    : selectedState.alert === 'ORANGE'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                }`}>
                  {selectedState.alertTitle}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {selectedState.name}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">24h Rainfall</span>
              <span className="text-base font-black text-cyan-300 font-mono">{selectedState.rain24h}</span>
            </div>
          </div>

          {/* Meteorological Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/90 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" /> Wind Gusts
              </span>
              <span className="font-extrabold text-white font-mono">{selectedState.windSpeed}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Lightning / वज्रपात
              </span>
              <span className="font-extrabold text-amber-300">{selectedState.lightningRisk}</span>
            </div>
          </div>

          {/* Operational Threat Narrative */}
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-[11px] font-black text-slate-300 uppercase tracking-wide">
              IMD Synoptic Alert Reason:
            </div>
            <p className="text-slate-300 leading-relaxed">
              {selectedState.synopticReason}
            </p>
          </div>

          {/* Key Districts Under Vigil */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              🔴 Affected High-Vulnerability Districts:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedState.keyDistricts.map((dst) => (
                <span
                  key={dst}
                  className="px-2 py-0.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700 text-[11px] font-bold"
                >
                  {dst}
                </span>
              ))}
            </div>
          </div>

          {/* Safety Action Directive */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/40 to-orange-950/40 border border-rose-500/30 text-xs text-rose-200 space-y-1">
            <div className="font-black flex items-center gap-1.5 text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Safety Advisory / सुरक्षा निर्देश</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Avoid travelling through low-lying waterlogged roads and hill slopes. Stay indoors during lightning flashes.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
