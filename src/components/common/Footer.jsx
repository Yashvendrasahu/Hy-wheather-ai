// src/components/common/Footer.jsx
import React from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import { CloudRain, Sparkles } from 'lucide-react';

export default function Footer() {
  const { setActiveTab } = useWeather();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 pt-12 pb-8 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-slate-100">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-xs">
                <CloudRain className="w-4.5 h-4.5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Weather<span className="text-sky-600">AI</span>
              </span>
            </div>
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

            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">About</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-sky-600 transition-colors">
                  AI Ensemble Model
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-sky-600 transition-colors">
                  Sensor Network API
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2025 WeatherAI Inc. All rights reserved.
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
