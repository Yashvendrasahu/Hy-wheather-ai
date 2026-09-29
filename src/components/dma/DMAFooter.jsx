// src/components/dma/DMAFooter.jsx
import React from 'react';
import { useDisasterManagement } from '../../context/DisasterManagementContext.jsx';
import { Shield, Phone, Radio, ExternalLink } from 'lucide-react';

export default function DMAFooter() {
  const { showToast } = useDisasterManagement();

  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500 font-sans">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main Footer Links & Hotlines Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
          
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">
                Mausam Suraksha · Civic EOC Infrastructure
              </h4>
            </div>
            <p className="text-[11px] text-slate-500">
              © 2025 National Disaster Management Authority & Meteorological Information Services. Official Civic Infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
            <button
              onClick={() => showToast('Emergency Hotline Matrix: 112 (Disaster), 1070 (State EOC), 1077 (District Relief)', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer text-rose-700 font-bold"
            >
              Emergency Liaisons & Hotlines
            </button>
            <button
              onClick={() => showToast('Displaying SOP Document ID: SOP-EOC-2025-IND', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              SOP Documentation
            </button>
            <button
              onClick={() => showToast('Civic Disaster Response Protocol: Tier 1 to Tier 4 Standard', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              Disaster Response Protocol
            </button>
            <button
              onClick={() => showToast('GovNet Accessibility Standard WCAG 2.1 AA Compliant', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              Accessibility Statement
            </button>
            <button
              onClick={() => showToast('Open Data API: CAP 1.2 XML / JSON Feed Active', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              Open Data API
            </button>
          </div>
        </div>

        {/* Emergency Hotline Badges Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span className="font-bold text-slate-700 font-sans">CIVIC HOTLINES:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold">
              112 (Disaster)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-bold">
              1070 (State EOC)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-bold">
              1077 (District Relief)
            </span>
          </div>

          <div className="text-center sm:text-right font-sans font-semibold text-slate-600">
            <span>NATIONAL EMERGENCY RESPONSE SUPPORT SYSTEM: <strong>112</strong> | STATE EOC HELPLINE: <strong>1070 / 1077</strong> | DISASTER INCIDENT DISPATCH DESK VERIFIED</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
