// src/components/meteorologist/modals/BulletinModal.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../../context/MeteorologistContext.jsx';
import {
  FileText,
  X,
  Send,
  Download,
  AlertTriangle,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Building,
  Radio,
  Clock,
  MapPin
} from 'lucide-react';

export default function BulletinModal() {
  const {
    showBulletinModal,
    setShowBulletinModal,
    targetObservatory,
    scientistUser,
    activeEvent,
    showToast
  } = useMeteorologist();

  const [bulletinType, setBulletinType] = useState('ORANGE'); // 'RED' | 'ORANGE' | 'YELLOW'
  const [recipient, setRecipient] = useState('SDMA Madhya Pradesh & NDRF 11th Battalion');
  const [headline, setHeadline] = useState(`SEVERE CONVECTIVE SQUALL & GUST THREAT OVER ${targetObservatory.name.toUpperCase()}`);
  const [synopsis, setSynopsis] = useState(
    `A severe convective squall line is actively propagating across the ${targetObservatory.region} with Doppler reflectivity exceeding 52 dBZ. Multi-model ensemble consensus indicates severe wind gusts up to 65 km/h with 1-hour rainfall accumulation of 38-65 mm. Severe microburst and localized waterlogging expected during the 18:00 – 22:00 IST window.`
  );
  const [isTransmitting, setIsTransmitting] = useState(false);

  if (!showBulletinModal) return null;

  const handleDispatch = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setShowBulletinModal(false);
      showToast(`Official ${bulletinType} Convective Bulletin dispatched to ${recipient} with digital cryptographic seal.`, 'success');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  Official Synoptic Weather Warning Bulletin
                </h3>
                <span className="px-2 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold">
                  FORM IMD-OPS-04
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authorized Dissemination to SDMA, District Collectors, NDRF & Media Hubs
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBulletinModal(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
          
          {/* Warning Level Picker */}
          <div>
            <label className="block font-black text-slate-700 uppercase tracking-wider mb-2">
              Warning Severity Level & Color Code
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'RED', label: 'RED WARNING (Take Action)', class: 'border-rose-500 bg-rose-50 text-rose-900' },
                { id: 'ORANGE', label: 'ORANGE ALERT (Be Prepared)', class: 'border-amber-500 bg-amber-50 text-amber-900' },
                { id: 'YELLOW', label: 'YELLOW WATCH (Be Updated)', class: 'border-yellow-500 bg-yellow-50 text-yellow-900' }
              ].map(w => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setBulletinType(w.id)}
                  className={`p-2.5 rounded-xl border-2 font-black text-center cursor-pointer transition-all ${
                    bulletinType === w.id ? w.class : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Location & Primary Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-bold">
            <div>
              <label className="block text-slate-600 mb-1">Target Observatory Subdivision</label>
              <input
                type="text"
                value={targetObservatory.name}
                disabled
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Primary Liaison Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">Bulletin Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Synopsis & Scientific Advisory */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">
              Meteorological Synopsis & Action Guidance
            </label>
            <textarea
              rows={4}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium leading-relaxed"
            />
          </div>

          {/* Forecaster Signature Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-extrabold text-slate-900">Issuing Forecaster: </span>
                <span className="text-slate-700">{scientistUser.name} ({scientistUser.badgeId})</span>
              </div>
            </div>
            <span className="font-mono text-slate-500">DIGITAL SIGNATURE ATTACHED</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              showToast('Official Bulletin PDF compiled to downloads queue.', 'info');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulletinModal(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              disabled={isTransmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isTransmitting ? 'animate-spin' : ''}`} />
              <span>{isTransmitting ? 'Transmitting...' : 'Authorize & Broadcast Bulletin'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
