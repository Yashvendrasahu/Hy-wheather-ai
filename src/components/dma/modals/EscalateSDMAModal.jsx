// src/components/dma/modals/EscalateSDMAModal.jsx
import React, { useState } from 'react';
import { useDisasterManagement } from '../../../context/DisasterManagementContext.jsx';
import {
  AlertTriangle,
  X,
  PhoneCall,
  Send,
  Building,
  ShieldAlert
} from 'lucide-react';

export default function EscalateSDMAModal() {
  const {
    showEscalateModal,
    setShowEscalateModal,
    selectedSector,
    officerUser,
    handleEscalateIncident,
    showToast
  } = useDisasterManagement();

  const [agency, setAgency] = useState('State Disaster Management Authority (SDMA Bhopal) & NDMA');
  const [priorityTier, setPriorityTier] = useState('Tier-1 (Immediate State Cabinet Escalation)');
  const [escalationJustification, setEscalationJustification] = useState(
    `Heavy rainfall nowcast for ${selectedSector.name} indicates severe surface flooding (>50 mm/h) with saturation in Khan River basin. Inter-district mobilization of additional SDRF battalions required.`
  );
  const [isEscalating, setIsEscalating] = useState(false);

  if (!showEscalateModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEscalating(true);
    setTimeout(() => {
      setIsEscalating(false);
      setShowEscalateModal(false);
      handleEscalateIncident({
        targetAgency: agency,
        location: selectedSector.name
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-amber-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Escalate Incident to SDMA & NDMA
              </h3>
              <p className="text-xs text-amber-200">
                State EOC Multi-Agency High Priority Escalation Channel
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEscalateModal(false)}
            className="p-1.5 rounded-xl text-amber-300 hover:text-white hover:bg-amber-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs font-bold">
          
          <div>
            <label className="block text-slate-700 mb-1">Target Apex Authority</label>
            <select
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-bold"
            >
              <option>State Disaster Management Authority (SDMA Bhopal) & NDMA</option>
              <option>National Disaster Response Force (NDRF 11th Battalion HQ)</option>
              <option>Chief Secretary Disaster Cabinet Committee (Govt. of MP)</option>
              <option>Central Water Commission (CWC Flood Forecasting Desk)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Escalation Tier</label>
            <select
              value={priorityTier}
              onChange={(e) => setPriorityTier(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-bold"
            >
              <option>Tier-1 (Immediate State Cabinet Escalation)</option>
              <option>Tier-2 (Inter-District Resource Mobilization)</option>
              <option>Tier-3 (Precautionary Standing Alert)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Incident Brief & Resource Request Justification</label>
            <textarea
              rows={4}
              value={escalationJustification}
              onChange={(e) => setEscalationJustification(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowEscalateModal(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEscalating}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isEscalating ? 'animate-spin' : ''}`} />
              <span>{isEscalating ? 'Escalating...' : 'Submit Official Escalation'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
