// src/components/admin/modals/EditConfigModal.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext.jsx';
import {
  SlidersHorizontal,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  RotateCcw
} from 'lucide-react';

export default function EditConfigModal() {
  const {
    activeModal,
    setActiveModal,
    selectedConfigItem,
    saveConfigParameter
  } = useAdmin();

  const [paramValue, setParamValue] = useState(
    selectedConfigItem ? selectedConfigItem.value : ''
  );
  const [changeNote, setChangeNote] = useState('');

  if (activeModal !== 'edit-config' || !selectedConfigItem) {
    return null;
  }

  const handleSave = () => {
    saveConfigParameter(
      selectedConfigItem.sectionKey || 'dataPipeline',
      selectedConfigItem.id,
      paramValue,
      changeNote || 'Updated via Admin Parameter Editor'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Edit Operational Parameter</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {selectedConfigItem.key || selectedConfigItem.id}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div>
            <label className="font-bold text-slate-900 text-xs block mb-1">
              {selectedConfigItem.title}
            </label>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {selectedConfigItem.desc}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 flex items-center justify-between">
              <span>Configured Value</span>
              <span className="text-slate-400 font-normal text-[10px]">
                Current: <strong>{selectedConfigItem.value}</strong>
              </span>
            </label>
            <input
              type="text"
              value={paramValue}
              onChange={(e) => setParamValue(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">
              Administrative Justification / Change Ticket
            </label>
            <input
              type="text"
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder="e.g. Ingestion latency optimization for cyclone alert SOP-2025"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Audit Enforcement:</strong> Modifications are recorded in the GovNIC
              cryptographic ledger with timestamp and administrator PKI sign.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Apply & Verify Parameter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
