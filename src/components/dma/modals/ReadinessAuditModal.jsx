// src/components/dma/modals/ReadinessAuditModal.jsx
import React from 'react';
import { useDisasterManagement } from '../../../context/DisasterManagementContext.jsx';
import {
  FileCheck,
  X,
  Printer,
  Download,
  CheckCircle2,
  Radio,
  Building,
  ShieldCheck
} from 'lucide-react';

export default function ReadinessAuditModal() {
  const {
    showReadinessAuditModal,
    setShowReadinessAuditModal,
    officerUser,
    showToast
  } = useDisasterManagement();

  if (!showReadinessAuditModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                State EOC Emergency Readiness & Audit Report
              </h3>
              <p className="text-xs text-slate-400">
                Official Multi-Sector Telemetry & Battalion Mobilization Status
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReadinessAuditModal(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-bold">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase">Target Desks</div>
              <div className="text-base font-black text-slate-900 mt-0.5">8 / 10</div>
              <div className="text-[10px] text-emerald-700">80% Reached</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase">Confirmed Acks</div>
              <div className="text-base font-black text-emerald-700 mt-0.5">6 Desks</div>
              <div className="text-[10px] text-slate-500">DEOC Verified</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase">SDRF Active</div>
              <div className="text-base font-black text-sky-700 mt-0.5">3 Units</div>
              <div className="text-[10px] text-sky-800">Deployed & Standby</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase">VHF Status</div>
              <div className="text-base font-black text-emerald-700 mt-0.5">100%</div>
              <div className="text-[10px] text-emerald-800">Zero Outage</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Mobilized Sector Summary
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              <div className="flex justify-between pb-1 border-b border-slate-200">
                <span>Indore District (Zone MP-04):</span>
                <span className="font-bold text-rose-700">SDRF Unit 03 at Sanwer Rd + 4 Dewatering Pumps</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-200">
                <span>Dewas Industrial Bypass:</span>
                <span className="font-bold text-amber-700">2 Inflatable Boats + Kshipra Canal Watch</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-200">
                <span>Ujjain Mahakal Corridor:</span>
                <span className="font-bold text-emerald-700">Queue Holding Shelters Activated</span>
              </div>
              <div className="flex justify-between">
                <span>Bhopal Upper Lake Spillway:</span>
                <span className="font-bold text-slate-900">Sluice Gate 4 Controlled Discharge Complete</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Signed by {officerUser.name} (Duty Director, State EOC)</span>
            </div>
            <span className="font-mono text-emerald-800 font-bold">AUDIT #EA-2025-0929</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => showToast('Audit report PDF exported to downloads.', 'success')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit PDF</span>
          </button>

          <button
            onClick={() => setShowReadinessAuditModal(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  );
}
