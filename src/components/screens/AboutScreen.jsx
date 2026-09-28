// src/components/screens/AboutScreen.jsx
import React from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import {
  Sparkles,
  CloudRain,
  Radio,
  Cpu,
  ShieldCheck,
  Globe2,
  Database,
  Layers,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function AboutScreen() {
  const { setActiveTab } = useWeather();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
          <span>Technology & Architecture</span>
          <span>•</span>
          <span>NWP + Deep Convective AI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          About WeatherAI Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Next-generation synoptic and microscale weather intelligence blending high-resolution global numerical models with localized IoT sensor mesh arrays.
        </p>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Ensemble AI Micro-models</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Blends ECMWF IFS (9km), GFS (13km), and high-resolution WRF (1.2km) runs with transformer-based deep neural networks for sub-hourly convective storm prediction.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Ground AWS Sensor Grid</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Continuous calibrated ingest from 4 local Automated Weather Stations (AWS) reporting barometric pressure trends, soil volumetric water content, and solar insolation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Civil Defense Alert Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automated threshold monitoring for lightning strikes, sudden wind shears, and urban waterlogging risks with sub-minute alert dispatch and emergency integration.
          </p>
        </div>
      </div>

      {/* Model Specifications Table Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Atmospheric Data Pipeline Specifications</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Subsystem</th>
                <th className="py-3 px-4">Temporal Resolution</th>
                <th className="py-3 px-4">Spatial Grid</th>
                <th className="py-3 px-4">Confidence Metric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Doppler Reflectivity Radar</td>
                <td className="py-3 px-4 font-mono">1 min sync</td>
                <td className="py-3 px-4 font-mono">250m polar mesh</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">99.8% Uptime</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Convective Storm Trajectory AI</td>
                <td className="py-3 px-4 font-mono">10 min inference</td>
                <td className="py-3 px-4 font-mono">1.2 km² cell grid</td>
                <td className="py-3 px-4 text-sky-600 font-semibold">92% Consensus</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Diurnal Micro-Progression</td>
                <td className="py-3 px-4 font-mono">Hourly steps</td>
                <td className="py-3 px-4 font-mono">Regional Plateau</td>
                <td className="py-3 px-4 text-amber-600 font-semibold">91% Reliability</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Back to Home CTA */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-3 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Return to Live Forecast</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
