// src/components/meteorologist/modals/SoundingModal.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../../context/MeteorologistContext.jsx';
import {
  Activity,
  X,
  Compass,
  Zap,
  Layers,
  Thermometer,
  CloudRain,
  Wind,
  Download,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function SoundingModal() {
  const {
    showSoundingModal,
    setShowSoundingModal,
    targetObservatory,
    showToast
  } = useMeteorologist();

  const [soundingTime, setSoundingTime] = useState('06:00 UTC (11:30 IST)');

  if (!showSoundingModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  Atmospheric Sounding & Skew-T Profile
                </h3>
                <span className="px-2 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold">
                  RADIOSONDE / AWS 42680
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thermodynamic profiles & vertical atmospheric instability indicators for {targetObservatory.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSoundingModal(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar text-xs">
          
          {/* Top Parameters Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-bold">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-black">CAPE Surface-Based</div>
              <div className="text-base font-black text-rose-700 mt-0.5">2,140 J/kg</div>
              <div className="text-[10px] text-rose-600 font-semibold">Severe Convective Trigger</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-black">Lifted Index (LI)</div>
              <div className="text-base font-black text-amber-700 mt-0.5">-4.8 °C</div>
              <div className="text-[10px] text-amber-600 font-semibold">Strong Instability</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-black">Downdraft CAPE (DCAPE)</div>
              <div className="text-base font-black text-slate-900 mt-0.5">980 J/kg</div>
              <div className="text-[10px] text-slate-500 font-semibold">Microburst Gust Risk 65k</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-black">0-6 km Bulk Wind Shear</div>
              <div className="text-base font-black text-sky-700 mt-0.5">38 Knots</div>
              <div className="text-[10px] text-sky-600 font-semibold">Multi-cell Propagation</div>
            </div>
          </div>

          {/* SVG Skew-T Thermodynamic Chart Graphic */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-white space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-0.5 bg-rose-500 rounded" />
                <span>Environmental Temp (T)</span>
                <span className="w-2.5 h-0.5 bg-emerald-400 rounded ml-2" />
                <span>Dewpoint (Td)</span>
                <span className="w-2.5 h-0.5 bg-sky-400 rounded ml-2" />
                <span>Parcel Trajectory</span>
              </div>
              <span>Sounding: 06 UTC RS/RW</span>
            </div>

            <div className="h-56 w-full relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Pressure Grid lines */}
                <line x1="0" y1="20" x2="600" y2="20" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,4" />
                <text x="10" y="25" fill="#64748B" fontSize="9" fontFamily="monospace">200 hPa (Tropopause)</text>

                <line x1="0" y1="70" x2="600" y2="70" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,4" />
                <text x="10" y="75" fill="#64748B" fontSize="9" fontFamily="monospace">500 hPa (Freezing Level)</text>

                <line x1="0" y1="130" x2="600" y2="130" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,4" />
                <text x="10" y="135" fill="#64748B" fontSize="9" fontFamily="monospace">700 hPa</text>

                <line x1="0" y1="185" x2="600" y2="185" stroke="#334155" strokeWidth="0.8" />
                <text x="10" y="193" fill="#64748B" fontSize="9" fontFamily="monospace">1000 hPa Surface (553m MSL)</text>

                {/* Shaded CAPE positive area between parcel and temp curve */}
                <path
                  d="M180,185 C220,150 250,110 320,70 C370,45 420,30 460,20 L400,20 C350,35 300,60 260,95 C220,135 190,165 170,185 Z"
                  fill="#F43F5E"
                  fillOpacity="0.25"
                />

                {/* Dewpoint Profile (Td) Green */}
                <path
                  d="M140,185 C160,150 180,120 200,90 C220,60 230,40 240,20"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="2.2"
                />

                {/* Environmental Temp (T) Red */}
                <path
                  d="M200,185 C240,150 270,115 310,80 C360,45 400,30 430,20"
                  fill="none"
                  stroke="#F87171"
                  strokeWidth="2.2"
                />

                {/* Ascending Parcel (Sky Blue) */}
                <path
                  d="M200,185 C230,140 280,90 350,55 C410,30 440,22 470,20"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeDasharray="4,3"
                />

                <text x="310" y="55" fill="#F43F5E" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  CAPE Area: 2140 J/kg
                </text>
              </svg>
            </div>
          </div>

          {/* Scientific Interpretation */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
            <div className="font-extrabold flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Diagnostic Warning: High Instability with Strong Capping Inversion Erosion</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">
              Low-level moisture advection from Arabian Sea sector (dewpoint 23°C at 925 hPa) has eroded the morning convective cap. Surface heating exceeding 31°C will trigger violent explosive updrafts during afternoon heating peak.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              showToast('Sounding CSV & Skew-T diagram exported to data archive.', 'success');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Skew-T Data (CSV / BUFR)</span>
          </button>

          <button
            onClick={() => setShowSoundingModal(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
          >
            Close Sounding
          </button>
        </div>

      </div>
    </div>
  );
}
