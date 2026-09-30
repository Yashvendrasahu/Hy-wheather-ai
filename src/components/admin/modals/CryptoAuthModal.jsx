// src/components/admin/modals/CryptoAuthModal.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext.jsx';
import {
  Lock,
  X,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Stamp,
  Sparkles
} from 'lucide-react';

export default function CryptoAuthModal() {
  const {
    activeModal,
    setActiveModal,
    selectedApplicant,
    selectedRegistrations,
    approveApplicant,
    batchApproveSelected,
    adminProfile
  } = useAdmin();

  const [pin, setPin] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [useHardwareKey, setUseHardwareKey] = useState(true);

  if (activeModal !== 'crypto-auth') {
    return null;
  }

  const isBatch = !selectedApplicant && selectedRegistrations.length > 0;
  const targetCount = isBatch ? selectedRegistrations.length : 1;
  const targetName = selectedApplicant ? selectedApplicant.applicant : `${targetCount} Selected Officials`;

  const handleExecuteAuthorization = () => {
    setIsSigning(true);

    setTimeout(() => {
      setIsSigning(false);
      if (isBatch) {
        batchApproveSelected();
      } else if (selectedApplicant) {
        approveApplicant(selectedApplicant.id);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Cryptographic Signature Authorization
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                Tier-1 Hardware Security Module (HSM) Enclave
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-900">Issuing Authorization Credentials:</strong>
              <div className="mt-1 text-[11px] text-emerald-800">
                You are about to issue valid operational GovNIC credentials and synoptic override permissions to{' '}
                <strong className="font-bold">{targetName}</strong>.
              </div>
            </div>
          </div>

          <div className="space-y-2.5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center text-slate-600">
              <span>Signing Administrator:</span>
              <span className="font-semibold text-slate-900">{adminProfile.name}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Admin Hardware Token:</span>
              <span className="font-mono font-bold text-indigo-700">{adminProfile.authRef} (Active)</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Clearance Scope:</span>
              <span className="text-slate-800 font-medium">National Grid Read/Write • SOP Authorized</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Validity:</span>
              <span className="text-slate-800 font-medium">365 Days (Annual Verification Cycle)</span>
            </div>
          </div>

          {/* 2FA / PIN Authentication Input */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                <span>Enter Tier-1 Admin PIN or Hardware Token Touch</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">FIPS-140-3 Compliant</span>
            </label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="•••••• (Default: 9942)"
              className="w-full text-center tracking-[0.5em] text-lg font-mono py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useHardwareKey}
                  onChange={(e) => setUseHardwareKey(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Simulate YubiKey / GovNIC HSM Token Press</span>
              </label>
              <span className="text-indigo-600 font-medium">Auto-synced with NIC SSO</span>
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
            disabled={isSigning}
            onClick={handleExecuteAuthorization}
            className={`px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all ${
              isSigning ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSigning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sealing Cryptographic Certificate...</span>
              </>
            ) : (
              <>
                <Stamp className="w-4 h-4" />
                <span>Confirm & Issue Gov Credentials</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
