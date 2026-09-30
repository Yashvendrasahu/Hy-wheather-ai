// src/components/dma/modals/DMAToast.jsx
import React from 'react';
import { useDisasterManagement } from '../../../context/DisasterManagementContext.jsx';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export default function DMAToast() {
  const { dmaToast } = useDisasterManagement();

  if (!dmaToast) return null;

  const { message, type } = dmaToast;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-sky-600 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50 text-emerald-950';
      case 'error':
        return 'border-rose-200 bg-rose-50 text-rose-950';
      case 'warning':
        return 'border-amber-200 bg-amber-50 text-amber-950';
      default:
        return 'border-sky-200 bg-sky-50 text-sky-950';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-up font-sans">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-xl text-xs font-bold ${getBorderColor()} max-w-md`}>
        {getIcon()}
        <span className="flex-1 leading-snug">{message}</span>
      </div>
    </div>
  );
}
