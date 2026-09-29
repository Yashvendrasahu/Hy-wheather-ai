// src/components/meteorologist/modals/DisasterLiaisonModal.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../../context/MeteorologistContext.jsx';
import {
  ShieldAlert,
  X,
  PhoneCall,
  Send,
  Building,
  Radio,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Users
} from 'lucide-react';

export default function DisasterLiaisonModal() {
  const {
    showDisasterLiaisonModal,
    setShowDisasterLiaisonModal,
    targetObservatory,
    scientistUser,
    showToast
  } = useMeteorologist();

  const [agency, setAgency] = useState('State Disaster Management Authority (SDMA Bhopal)');
  const [priority, setPriority] = useState('CRITICAL');
  const [actionProtocol, setActionProtocol] = useState('Evacuation of Low-lying Drain Catchments + Airport Runway Caution');
  const [isCalling, setIsCalling] = useState(false);

  if (!showDisasterLiaisonModal) return null;

  const handleTriggerLiaison = () => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      setShowDisasterLiaisonModal(false);
      showToast(`Emergency Hotwire & Synoptic Advisory dispatched to ${agency}.`, 'success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-400/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Disaster Management & NDRF Direct Liaison
              </h3>
              <p className="text-xs text-rose-200">
                Direct Emergency Command Hotwire for {targetObservatory.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDisasterLiaisonModal(false)}
            className="p-1.5 rounded-xl text-rose-300 hover:text-white hover:bg-rose-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
          
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-2.5">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-xs">Priority 1 Red Level Escalation Channel</div>
              <p className="text-[11px] text-rose-900 mt-0.5 leading-snug">
                This hotlink bypasses standard public queues and sends instant siren/SMS advisories to District Emergency Operation Centers (DEOC).
              </p>
            </div>
          </div>

          <div className="space-y-3 font-bold">
            <div>
              <label className="block text-slate-700 mb-1">Target Disaster Authority</label>
              <select
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
              >
                <option>State Disaster Management Authority (SDMA Madhya Pradesh)</option>
                <option>NDRF 11th Battalion (Varanasi / MP Quick Response Wing)</option>
                <option>District Collectorate & Municipal Disaster Operations (Indore)</option>
                <option>Air Traffic Control (Devi Ahilyabai Holkar Airport Aviation Desk)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Recommended Emergency Action Protocol</label>
              <textarea
                rows={3}
                value={actionProtocol}
                onChange={(e) => setActionProtocol(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 font-medium leading-relaxed"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setShowDisasterLiaisonModal(false)}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleTriggerLiaison}
            disabled={isCalling}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
          >
            <PhoneCall className={`w-4 h-4 ${isCalling ? 'animate-pulse' : ''}`} />
            <span>{isCalling ? 'Establishing Secure Hotwire...' : 'Dispatch Emergency Command Hotline'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
