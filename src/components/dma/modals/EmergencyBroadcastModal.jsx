// src/components/dma/modals/EmergencyBroadcastModal.jsx
import React, { useState } from 'react';
import { useDisasterManagement } from '../../../context/DisasterManagementContext.jsx';
import {
  Radio,
  X,
  AlertTriangle,
  ShieldCheck,
  Send,
  Lock,
  Volume2,
  MapPin,
  Clock,
  Sparkles,
  Users
} from 'lucide-react';

export default function EmergencyBroadcastModal() {
  const {
    showBroadcastModal,
    setShowBroadcastModal,
    selectedSector,
    officerUser,
    handleTriggerEmergencyBroadcast,
    showToast
  } = useMeteorologistDma();

  const [targetPolygon, setTargetPolygon] = useState(selectedSector.name);
  const [severity, setSeverity] = useState('CRITICAL'); // 'CRITICAL' | 'HIGH' | 'MODERATE'
  const [sirenTone, setSirenTone] = useState(true);
  const [broadcastLanguage, setBroadcastLanguage] = useState('DUAL'); // 'DUAL' | 'HI' | 'EN'
  
  const [englishText, setEnglishText] = useState(
    `EMERGENCY ALERT (Govt of MP): Severe Convective Rain & Flash Flood threat in ${selectedSector.name}. Waterlogging expected in Ring Road underpasses and low-lying drains between 4:00 PM and 7:00 PM. Avoid non-essential travel. Emergency Hotline: 112 / 1070.`
  );

  const [hindiText, setHindiText] = useState(
    `आपातकालीन चेतावनी (म.प्र. शासन): ${selectedSector.name} में भारी बारिश और जलभराव का खतरा। शाम 4:00 से 7:00 बजे के बीच निचले इलाकों और अंडरपास से बचें। आपातकालीन संपर्क: 112 / 1070.`
  );

  const [authPin, setAuthPin] = useState('IAS-8841-EOC');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [step, setStep] = useState('draft'); // 'draft' | 'confirm'

  if (!showBroadcastModal) return null;

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (step === 'draft') {
      setStep('confirm');
      return;
    }

    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setShowBroadcastModal(false);
      setStep('draft');
      handleTriggerEmergencyBroadcast({
        targetArea: targetPolygon,
        severity,
        text: englishText
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-rose-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  Emergency Cell Broadcast & Siren Console
                </h3>
                <span className="px-2 py-0.2 rounded bg-rose-500/30 text-rose-200 font-mono text-[10px] font-bold">
                  CAP 1.2 PROTOCOL
                </span>
              </div>
              <p className="text-xs text-rose-200">
                Direct Geo-Targeted Telecommunication Tower Push to All Active Handsets
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowBroadcastModal(false);
              setStep('draft');
            }}
            className="p-1.5 rounded-xl text-rose-300 hover:text-white hover:bg-rose-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleBroadcastSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs font-bold">
          
          {step === 'draft' ? (
            <>
              {/* Target & Severity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Target Geographic Sector / Polygon</label>
                  <select
                    value={targetPolygon}
                    onChange={(e) => setTargetPolygon(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 font-bold"
                  >
                    <option value="Indore District (Zone MP-04)">Indore District (Zone MP-04 · 2.1M Population)</option>
                    <option value="Dewas Industrial Belt">Dewas Industrial Belt (Sector D-1 · 480K Population)</option>
                    <option value="Ujjain Pilgrimage Corridor">Ujjain Pilgrimage Corridor (650K Population)</option>
                    <option value="Bhopal Lower Lake Sector">Bhopal Lower Lake Sector (1.2M Population)</option>
                    <option value="Entire Malwa Agro-Division">Entire Malwa Agro-Division (Multi-District Push)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Alert Severity Level</label>
                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    {['CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-black border-2 cursor-pointer transition-all ${
                          severity === sev
                            ? sev === 'CRITICAL'
                              ? 'bg-rose-50 border-rose-600 text-rose-900'
                              : sev === 'HIGH'
                              ? 'bg-amber-50 border-amber-600 text-amber-900'
                              : 'bg-yellow-50 border-yellow-500 text-yellow-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Siren & Language options */}
              <div className="flex flex-wrap items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sirenTone}
                    onChange={(e) => setSirenTone(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-slate-800 font-bold flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-rose-600" />
                    <span>Trigger High-Decibel Emergency Siren Tone on Phones</span>
                  </span>
                </label>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-500">Language:</span>
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-black">Dual (Hindi + English)</span>
                </div>
              </div>

              {/* English Broadcast Payload */}
              <div>
                <label className="block text-slate-700 mb-1">
                  English Cell Broadcast Payload (Max 160 Characters)
                </label>
                <textarea
                  rows={3}
                  value={englishText}
                  onChange={(e) => setEnglishText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-slate-900 leading-relaxed text-xs"
                />
              </div>

              {/* Hindi Broadcast Payload */}
              <div>
                <label className="block text-slate-700 mb-1">
                  हिंदी आपातकालीन संदेश (Dual Broadcast)
                </label>
                <textarea
                  rows={2}
                  value={hindiText}
                  onChange={(e) => setHindiText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-slate-900 leading-relaxed text-xs"
                />
              </div>

              {/* Legal Warning Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-snug">
                  <strong>NDMA Section 78 Civic Protocol:</strong> Cell broadcasts are legally binding national emergency warnings dispatched to all mobile handsets in the radio tower polygon without carrier throttling.
                </div>
              </div>
            </>
          ) : (
            /* STEP 2: IAS OFFICER TWO-STEP CRYPTOGRAPHIC CONFIRMATION */
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-black text-sm">
                  <ShieldCheck className="w-5 h-5 text-rose-700" />
                  <span>Confirm Emergency Broadcast Authorization</span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed font-medium">
                  You are about to execute an authorized cell broadcast push across <strong>{targetPolygon}</strong>. This will trigger sirens on an estimated <strong>1.4M active mobile devices</strong>.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Authorizing Officer:</span>
                  <span className="text-slate-900 font-extrabold">{officerUser.name} ({officerUser.title})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Target Area:</span>
                  <span className="text-slate-900 font-extrabold">{targetPolygon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dissemination Engine:</span>
                  <span className="text-sky-800 font-mono font-bold">DoT C-DOT Cell Broadcast Engine · All Telcos</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">
                  Enter Officer Cryptographic Authorization Token / PIN
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={authPin}
                      onChange={(e) => setAuthPin(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <span className="px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-mono font-black">
                    TOKEN VALID
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (step === 'confirm') {
                  setStep('draft');
                } else {
                  setShowBroadcastModal(false);
                }
              }}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {step === 'confirm' ? '← Back to Draft' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isTransmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white text-xs font-black shadow-sm transition-colors cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isTransmitting ? 'animate-spin' : ''}`} />
              <span>
                {isTransmitting
                  ? 'Transmitting via Telecom Towers...'
                  : step === 'draft'
                  ? 'Review & Authenticate Dispatch →'
                  : 'Execute National Emergency Broadcast'}
              </span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// Internal hook bridge
function useMeteorologistDma() {
  return useDisasterManagement();
}
