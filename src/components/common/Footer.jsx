// src/components/common/Footer.jsx
import React from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import AppLogo from './AppLogo.jsx';
import { CloudRain, Sparkles, Shield, Lock } from 'lucide-react';

export default function Footer() {
  const { setActiveTab } = useWeather();
  const { setPortalMode } = useMeteorologist();
  const { user, role } = useAuth();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 pt-12 pb-8 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-slate-100">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <AppLogo size="lg" />
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Hybrid AI + NWP precision atmospheric forecasts blending global numerical models with local micro-climate intelligence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/70">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>Powered by Integrated Multi-Model AI Ensemble • Updated every 10 mins</span>
            </div>
          </div>

          {/* Forecast Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Forecast</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('forecast')} className="hover:text-sky-600 transition-colors">
                  Hourly Radar
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('forecast')} className="hover:text-sky-600 transition-colors">
                  14–Day Outlook
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('forecast')} className="hover:text-sky-600 transition-colors">
                  Precipitation Projections
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('forecast')} className="hover:text-sky-600 transition-colors">
                  Air Quality Index (AQI)
                </button>
              </li>
            </ul>
          </div>

          {/* Weather Map Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Weather Map</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('weather-map')} className="hover:text-sky-600 transition-colors">
                  Doppler Wind Vector
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('weather-map')} className="hover:text-sky-600 transition-colors">
                  Satellite Infrared
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('weather-map')} className="hover:text-sky-600 transition-colors">
                  Barometric Isobars
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('weather-map')} className="hover:text-sky-600 transition-colors">
                  Thermal Anomalies
                </button>
              </li>
            </ul>
          </div>

          {/* Alerts & About Columns */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Alerts</h4>
            <ul className="space-y-2 text-xs mb-4">
              <li>
                <button onClick={() => setActiveTab('alerts')} className="hover:text-sky-600 transition-colors">
                  Active Warnings
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('alerts')} className="hover:text-sky-600 transition-colors">
                  Severe Storm Tracking
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('alerts')} className="hover:text-sky-600 transition-colors">
                  Heat Wave Advisories
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('alerts')} className="hover:text-sky-600 transition-colors">
                  Cyclone Pathways
                </button>
              </li>
            </ul>

            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">About & Operations</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-sky-600 transition-colors cursor-pointer">
                  AI Ensemble Model
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-sky-600 transition-colors cursor-pointer">
                  Sensor Network API
                </button>
              </li>
              <li className="pt-1.5 border-t border-slate-100">
                {!user ? (
                  <button
                    onClick={() => setPortalMode('login')}
                    className="text-slate-500 hover:text-sky-700 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                    title="Staff & Officer Login"
                  >
                    <Shield className="w-3.5 h-3.5 text-sky-600" />
                    <span>Official Staff Login</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (role === 'meteorologist') setPortalMode('meteorologist');
                      else if (role === 'disaster_manager') setPortalMode('dma');
                      else if (role === 'administrator') setPortalMode('admin');
                      else setPortalMode('citizen');
                    }}
                    className="text-sky-700 hover:text-sky-900 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-sky-600" />
                    <span>My Operational Portal</span>
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2025 WEATHER FUSE. All rights reserved.
          </div>
          <div className="text-slate-400 text-center">
            Meteorological outputs are provided for public guidance and monitoring.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-700 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-700 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-700 cursor-pointer">Meteorological Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
