// src/components/dma/modals/OfficialAlertModal.jsx
import React, { useState } from 'react';
import { useDisasterManagement } from '../../../context/DisasterManagementContext.jsx';
import {
  Bell,
  X,
  ShieldCheck,
  Send,
  Building,
  AlertTriangle,
  Lock,
  FileCheck
} from 'lucide-react';

export default function OfficialAlertModal() {
  const {
    showOfficialAlertModal,
    setShowOfficialAlertModal,
    selectedSector,
    officerUser,
    handleSendOfficialAlert,
    showToast
  } = useDisasterManagement();

  const [recipient, setRecipient] = useState('Indore Collectorate & Municipal EOC');
  const [dispatchCode, setDispatchCode] = useState('EOC-MP04-HR-FLASH-0914');
  const [severity, setSeverity] = useState('CRITICAL — Heavy Rain (52.9 mm/h)');
  const [actionDirectives, setActionDirectives] = useState(
    '1. Activate Municipal Flood Control Cells.\n2. Barricade Ring Road underpasses and Pipliyahana low-lying subway.\n3. Position SDRF Unit 03 at Khan River vulnerable catchment.'
  );
  const [isDispatching, setIsDispatching] = useState(false);

  if (!showOfficialAlertModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setShowOfficialAlertModal(false);
      handleSendOfficialAlert({
        recipient,
        code: dispatchCode,
        hazard: selectedSector.hazard
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Issue Official Emergency Alert
              </h3>
              <p className="text-xs text-slate-400">
                Encrypted GovNet Directive to District Magistrates & Police Chiefs
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOfficialAlertModal(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs font-bold">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">MANDATED DISPATCH CODE:</span>
              <span className="font-mono text-sky-800 font-extrabold">{dispatchCode}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">AUTHORIZING OFFICER:</span>
              <span className="text-slate-900 font-extrabold">{officerUser.name} (State EOC)</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Target Authority Recipient</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 font-bold"
            >
              <option>Indore Collectorate & Municipal EOC</option>
              <option>Dewas District Administration & SDRF 5th Battalion</option>
              <option>Ujjain Collectorate & SP Police Control Room</option>
              <option>Bhopal Municipal Corporation & Disaster Cell</option>
              <option>Multi-District Joint Taskforce (Malwa Division)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Severity & Primary Hazard Classification</label>
            <input
              type="text"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Mandated Operational Directives</label>
            <textarea
              rows={4}
              value={actionDirectives}
              onChange={(e) => setActionDirectives(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Cryptographic token indicator */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Two-Step IAS Cryptographic Token active on this session</span>
            </div>
            <span className="font-mono font-bold text-emerald-800">NIC-FIPS-140-3</span>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowOfficialAlertModal(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDispatching}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin' : ''}`} />
              <span>{isDispatching ? 'Dispatching...' : 'Confirm & Authenticate Dispatch'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
