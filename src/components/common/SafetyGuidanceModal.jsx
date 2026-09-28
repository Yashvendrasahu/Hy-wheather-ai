// src/components/common/SafetyGuidanceModal.jsx
import React from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import { ShieldCheck, AlertTriangle, CloudLightning, Home, Car, PhoneCall, X } from 'lucide-react';
import { EMERGENCY_HELPLINES } from '../../data/weatherData.js';

export default function SafetyGuidanceModal() {
  const { showSafetyModal, setShowSafetyModal, showToast } = useWeather();

  if (!showSafetyModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 p-6 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-100">
                Civil Safety Protocol • Meteorological Warning
              </div>
              <h3 className="text-xl font-bold">Thunderstorm & Severe Weather Guidance</h3>
            </div>
          </div>
          <button
            onClick={() => setShowSafetyModal(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-slate-700 text-sm">
          {/* Main callout */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-900 text-sm">Active Threat Window: 4:00 PM – 8:00 PM IST</div>
              <p className="text-xs text-amber-800 mt-0.5">
                Intense convective cloud formations are currently bringing lightning discharges and surface gusts up to 38 km/h across the Indore Malwa basin.
              </p>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <Home className="w-4 h-4 text-sky-600" />
                <span>Indoor Precautions</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-600">
                <li>• Stay inside sturdy buildings; avoid open balconies.</li>
                <li>• Unplug delicate electronics and routers.</li>
                <li>• Keep windows securely latched against wind gusts.</li>
                <li>• Charge emergency mobile devices in advance.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <Car className="w-4 h-4 text-amber-600" />
                <span>Transit & Travel Guidance</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-600">
                <li>• Avoid two-wheeler transit on bypass bridges.</li>
                <li>• Beware of localized waterlogging in underpasses.</li>
                <li>• Maintain safe stopping distances in heavy spray.</li>
                <li>• Never park vehicles under large trees or power poles.</li>
              </ul>
            </div>
          </div>

          {/* Direct Helplines */}
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Instant Emergency Dial
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EMERGENCY_HELPLINES.map((h) => (
                <button
                  key={h.id}
                  onClick={() => showToast(`Dialing ${h.label}: ${h.number}`)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 text-center transition-all cursor-pointer group"
                >
                  <div className="text-[10px] font-semibold text-slate-500 uppercase truncate">
                    {h.label}
                  </div>
                  <div className="text-base font-extrabold text-slate-900 font-mono group-hover:text-sky-600">
                    {h.number}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Madhya Pradesh State Disaster Management Authority
          </span>
          <button
            onClick={() => setShowSafetyModal(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            I Understand & Stay Safe
          </button>
        </div>
      </div>
    </div>
  );
}
