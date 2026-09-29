// src/components/admin/modals/ReviewDocsModal.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext.jsx';
import {
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Compass,
  FileCode,
  Lock,
  Stamp,
  UserCheck,
  UserX
} from 'lucide-react';

export default function ReviewDocsModal() {
  const {
    activeModal,
    setActiveModal,
    selectedApplicant,
    approveApplicant,
    rejectApplicant,
    openCryptoAuthModal
  } = useAdmin();

  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [verifiedDocs, setVerifiedDocs] = useState({});

  if (activeModal !== 'review-docs' || !selectedApplicant) {
    return null;
  }

  const handleToggleDocCheck = (docName) => {
    setVerifiedDocs((prev) => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  const handleApproveWithCrypto = () => {
    openCryptoAuthModal(selectedApplicant);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600/30 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Official Document Verification Dossier
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-900/80 text-sky-200 border border-sky-700">
                  {selectedApplicant.id}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                GovNIC & MoES Digital Signature Cryptographic Inspection
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs">
          {/* Applicant Info Summary Box */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Applicant Name & Rank</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {selectedApplicant.applicant}
              </div>
              <div className="text-sky-700 font-medium mt-0.5">{selectedApplicant.designation}</div>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-medium">Organization & Domain</span>
              <div className="font-semibold text-slate-800 text-xs mt-0.5">
                {selectedApplicant.organization}
              </div>
              <div className="text-emerald-700 font-mono text-[11px] mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{selectedApplicant.email}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-medium">Assigned Jurisdiction</span>
              <div className="text-slate-800 font-medium text-[11px] mt-0.5">
                {selectedApplicant.jurisdiction}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-medium">Gov Gazette Token</span>
              <div className="font-mono text-indigo-700 font-bold text-[11px] mt-0.5 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block">
                {selectedApplicant.gazetteToken}
              </div>
            </div>
          </div>

          {/* Attached Artifacts & PDF Verification */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Attached Cryptographic Artifacts ({selectedApplicant.docs?.length || 2} documents)
              </span>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NIC Digital Signature Validated</span>
              </span>
            </div>

            <div className="space-y-2.5">
              {(selectedApplicant.docs || [
                { name: 'MoES Official Gazetted Officer ID & Order', size: 'PDF, 2.4 MB • Signed via NIC Key', status: 'Verified' },
                { name: 'Synoptic Meteorological Operational Mandate', size: 'PDF, 1.2 MB • Endorsed by MoES', status: 'Verified' }
              ]).map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold text-[10px]">
                      PDF
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">{doc.name}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{doc.size}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleDocCheck(doc.name)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border flex items-center gap-1.5 transition-colors ${
                        verifiedDocs[doc.name]
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{verifiedDocs[doc.name] ? 'Inspected' : 'Mark Inspected'}</span>
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200"
                      title="Download artifact for offline verification"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Clearance Statement */}
          <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Official Clearance Check:</strong> All submitted credentials match Central
              Civil Services / IMD Cadre database records with valid NIC Parichay token. Approving
              this request will generate a hardware cryptographic session key for 24-hour access.
            </div>
          </div>

          {/* Rejection Note Field (conditionally rendered) */}
          {showRejectInput && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-2">
              <label className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Specify Official Rejection Ground</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Invalid Gazette token or missing authorization signature from MoES DG..."
                rows={2}
                className="w-full text-xs p-2 rounded border border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectInput(false)}
                  className="px-3 py-1 rounded text-xs text-slate-600 hover:bg-rose-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => rejectApplicant(selectedApplicant.id, rejectionReason)}
                  className="px-3 py-1 rounded text-xs bg-rose-600 text-white font-semibold hover:bg-rose-700"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            {!showRejectInput && (
              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                className="px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <UserX className="w-4 h-4" />
                <span>Reject Application</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 text-xs"
            >
              Close Dossier
            </button>
            <button
              type="button"
              onClick={handleApproveWithCrypto}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Issue Cryptographic Clearance &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileCheck2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}
