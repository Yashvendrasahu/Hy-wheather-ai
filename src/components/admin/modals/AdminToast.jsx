// src/components/admin/modals/AdminToast.jsx
import React from 'react';
import { useAdmin } from '../../../context/AdminContext.jsx';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function AdminToast() {
  const { toast, closeToast } = useAdmin();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';
  const isInfo = toast.type === 'info';

  const getBorderColor = () => {
    if (isSuccess) return 'border-emerald-500 bg-white text-emerald-900';
    if (isError) return 'border-rose-500 bg-white text-rose-900';
    if (isWarning) return 'border-amber-500 bg-white text-amber-900';
    return 'border-sky-500 bg-white text-sky-900';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp max-w-sm w-full shadow-2xl">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg border border-slate-200 ${getBorderColor()}`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {isError && <XCircle className="w-5 h-5 text-rose-600" />}
          {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
          {isInfo && <Info className="w-5 h-5 text-sky-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-900">{toast.message}</h4>
          {toast.description && (
            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{toast.description}</p>
          )}
        </div>
        <button
          onClick={closeToast}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
