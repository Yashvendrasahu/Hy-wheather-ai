// src/components/common/AlertDetailsModal.jsx
import React from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import { AlertTriangle, Shield, Clock, MapPin, CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function AlertDetailsModal() {
  const {
    activeModalAlert,
    setActiveModalAlert,
    setActiveTab,
    showToast
  } = useWeather();

  if (!activeModalAlert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 text-white flex items-start justify-between ${
          activeModalAlert.level === 3
            ? 'bg-rose-600'
            : activeModalAlert.level === 2
            ? 'bg-amber-600'
            : 'bg-sky-600'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                {activeModalAlert.type}
              </span>
              <h3 className="text-xl font-bold">{activeModalAlert.title}</h3>
            </div>
          </div>
          <button
            onClick={() => setActiveModalAlert(null)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar text-sm text-slate-700">
          {/* Metadata chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeModalAlert.timeWindow}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeModalAlert.location}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Meteorological Situation
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {activeModalAlert.details || activeModalAlert.headline}
            </p>
          </div>

          {/* Recommended actions */}
          {activeModalAlert.precautions && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Mandatory Safety Precautions
              </h4>
              <div className="space-y-2">
                {activeModalAlert.precautions.map((prec, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700">{prec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action box */}
          {activeModalAlert.actionRequired && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-700 shrink-0" />
              <div className="text-xs text-amber-900 font-semibold">
                Action: {activeModalAlert.actionRequired}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              setActiveModalAlert(null);
              setActiveTab('weather-map');
            }}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Inspect Radar Doppler</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveModalAlert(null)}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
