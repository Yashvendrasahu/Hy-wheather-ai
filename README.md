⚡ WEATHER FUSE
<div align="center">
  <img src="/public/logo.png" alt="WEATHER FUSE Logo" width="120" height="120" style="border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.4);" />
  <br />
  <h3>Precision Microclimate, Synoptic NWP & Severe Storm Doppler Intelligence Platform</h3>
  <p>
    <strong>Hybrid AI Physics + Numerical Weather Prediction (NWP) for Citizens, Meteorologists, and Disaster Mitigation Authorities.</strong>
  </p>
<p>
    <a href="#-features"><img src="https://img.shields.io/badge/Features-Comprehensive-0284C7?style=flat-square" alt="Features" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS-38BDF8?style=flat-square" alt="Stack" /></a>
    <a href="#-portals--roles"><img src="https://img.shields.io/badge/Portals-Multi--Role%20Enclave-4F46E5?style=flat-square" alt="Portals" /></a>
    <a href="#-license"><img src="https://img.shields.io/badge/License-Proprietary%20%2F%20Open-10B981?style=flat-square" alt="License" /></a>
  </p>
</div>
---
📖 Overview
WEATHER FUSE is a state-of-the-art atmospheric intelligence web platform designed to bridge high-resolution global numerical weather prediction models (ECMWF, GFS, WRF) with localized micro-grid AI neural physics emulations and real-time ground AWS (Automated Weather Station) sensor meshes.
Whether tracking rapid convective squall lines, assessing agricultural soil moisture gradients, or broadcasting critical Common Alerting Protocol (CAP) civil protection alerts, WEATHER FUSE provides sub-hourly resolution forecasting and decisive emergency operations support.
---


🌟 Key Features
1. 🌤️ Citizen Public Weather Portal
Hyper-Local Real-Time Telemetry: Instant temperature, dew point, relative humidity, barometric pressure trend, and wind velocity vectors.
1km² Micro-Grid AI Forecasts: Hourly step-by-step precipitation probabilities, cloud cover, and UV index guidance.
Interactive Doppler Radar Map: Multi-layer Leaflet visualization with precipitation reflectivity, wind speed streamlines, temperature contours, cloud cover, and severe weather tracks.
Air Quality (AQI) & Environmental Index: Real-time PM2.5, PM10, Ozone, NO₂, SO₂, and CO tracking with health recommendations.
Agricultural & Livestock Weather Advisory: Soil volumetric water content, evapo-transpiration rates, and localized crop protection advisories.
GPS Location Detection & Search: Instant synoptic data retrieval across all districts, cities, and global micro-coordinates.
---


2. 🔬 Professional Meteorologist Synoptic Desk
Multi-Model NWP Intercomparison: Side-by-side analysis of ECMWF IFS (9km), GFS (13km), WRF High-Res (1.2km), and Deep QRNN AI Attention models.
Atmospheric Sounding & Skew-T Emulation: Convective Available Potential Energy (CAPE), Lifted Index (LI), storm-relative helicity, and boundary layer shear.
Radar & Satellite Ingest Controls: Real-time reflectivity calibration, Doppler radial velocity, and cloud-top brightness temperature tracking.
Official Bulletin Drafting & Verification: Standardized meteorological bulletin creation and multi-channel dissemination.
---


3. 🚨 Disaster Management Authority (DMA) Civic EOC
Emergency Operations Center (EOC) Cockpit: Active multi-hazard monitoring (Flash Floods, Cyclones, Heatwaves, Severe Squalls).
CAP Standardized Alert Broadcasts: 1-click issuance of Level-1 to Level-4 civil alerts to sirens, SMS gateways, and citizen apps.
Shelter & Evacuation Grid Management: Real-time capacity, inventory, logistics tracking, and emergency transit route status.
Incident Response Dispatch: Field team coordination, disaster liaison hotline, and inter-agency resource management.
---


4. 🛡️ GovCloud Cyber Admin Enclave
Real-Time Data Pipeline Monitor: Ingestion telemetry from AWS ground stations, radar feeds, and satellite transponders.
User Verification & RBAC Governance: Role-based access control with 2FA / OTP verification enclaves.
AI Deep QRNN Model Diagnostics: Accuracy scoring, inference latency, parameter weights, and automated failover monitoring.
---


🛠️ Tech Stack
Layer	Technologies
Frontend Framework	React (JavaScript / JSX), Vite
Styling & UI	Tailwind CSS, Modern Glassmorphism, Responsive Grid System
Icons & Visuals	Lucide React
Interactive Mapping	Leaflet.js, OpenStreetMap Carto Tiles, Weather Radar Layer Overlays
State Management	Modular React Context API (`AuthContext`, `WeatherContext`, `MeteorologistContext`)
Weather APIs & Telemetry	MoES Synoptic Engine, Open-Meteo High-Res API, Browser Geolocation API
---


📁 Project Structure
```
├── public/
│   ├── logo.png                # Brand Logo Asset (High-Res)
│   └── logo.svg                # Vector Logo Asset
├── src/
│   ├── components/
│   │   ├── admin/              # Cyber Admin Dashboards, Pipelines & Audit Logs
│   │   ├── common/             # Header, Footer, AppLogo, Modals, OTP Enclave
│   │   ├── dma/                # Disaster Management EOC, Alerts & Evacuation
│   │   ├── meteorologist/      # Synoptic Desk, Soundings, Radar Controls & Login
│   │   ├── screens/            # Home, Forecast, Doppler Radar, AQI, Alerts, About
│   │   └── ui/                 # Reusable buttons, cards, badges, indicators
│   ├── context/
│   │   ├── AuthContext.jsx     # User authentication, RBAC, 2FA OTP state
│   │   ├── WeatherContext.jsx  # Live weather state, synoptic caching, GPS coordinates
│   │   └── MeteorologistContext.jsx # Synoptic desk & disaster operations state
│   ├── data/                   # Atmospheric presets, mock stations, alerts & models
│   ├── services/
│   │   ├── liveWeatherService.js # Open-Meteo & Synoptic real-time data client
│   │   └── moesWeatherApi.js     # MoES AI Engine & NWP model simulation client
│   ├── App.jsx                 # Main Application router & portal switcher
│   ├── index.css               # Global Tailwind CSS imports & custom styles
│   └── main.jsx                # React DOM entrypoint
├── index.html                  # HTML entry with SEO meta tags & favicon
├── package.json                # Project dependencies & npm scripts
├── vite.config.ts              # Vite configuration
└── README.md                   # Project Documentation
```


---
🚀 Getting Started
Prerequisites
Node.js: v18.0.0 or higher
npm or bun / yarn
Installation
Clone the repository:
```bash
   git clone https://github.com/your-username/weather-fuse.git
   cd weather-fuse
   ```
Install dependencies:
```bash
   npm install
   ```
Start the development server:
```bash
   npm run dev
   ```


Open in browser:
Navigate to `http://localhost:3000` (or `http://localhost:5173`).
---


👥 Portals & Roles
Role	Access Route	Key Capabilities
Citizen (Public)	Default Home View	Live weather, 10-day forecast, air quality, radar, storm warnings.
Meteorologist	Sign In / Met Portal	Soundings, ECMWF/GFS NWP models, official bulletin release.
Disaster Authority (DMA)	DMA EOC Portal	Hazard map, shelter allocation, CAP emergency broadcast trigger.
Administrator	Admin Console	Server pipeline health, user verification, system audit logs.

youtube demo link :
https://youtu.be/FKY0YRavM88
---


🔒 Security & Privacy
Real-time Ephemeral Telemetry: User coordinates are processed strictly in real-time to compute localized 1km² micro-grid atmospheric forecasts and never transferred to commercial advertising trackers.
Two-Factor Authentication: Sensitive operational desks (Meteorologist, DMA, Cyber Admin) utilize 2FA verification code flows.
---
📄 License
© 2025 WEATHER FUSE. All rights reserved. Designed for precision meteorological monitoring and disaster mitigation support.
