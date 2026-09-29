// src/components/meteorologist/MeteorologistFooter.jsx
import React from 'react';
import { useMeteorologist } from '../../context/MeteorologistContext.jsx';
import { Shield, Phone, Activity, Lock, ExternalLink } from 'lucide-react';

export default function MeteorologistFooter() {
  const { showToast } = useMeteorologist();

  return (
    <footer className="bg-white border-t border-slate-200/90 mt-12 py-8 text-xs text-slate-500">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Link Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="text-center md:text-left">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              MAUSAM SURAKSHA · NATIONAL METEOROLOGICAL SERVICE
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              © 2025 National Meteorological Service & Disaster Mitigation Authority. Government of India. All rights reserved. Authorized scientific access only.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
            <button
              onClick={() => showToast('Displaying IMD Public Safety Charter (Doc ID: PSC-2025-IND)', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              Public Safety Charter
            </button>
            <button
              onClick={() => showToast('39/39 Doppler Radar Arrays Online', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              National Radar Network
            </button>
            <button
              onClick={() => showToast('WMO & OGC Open Data Compliant (NetCDF/GRIB2/GeoJSON)', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              Open Data Compliance
            </button>
            <button
              onClick={() => showToast('FIPS 140-3 Level 4 Cryptographic Standards Enforced', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              Security Protocols
            </button>
            <button
              onClick={() => showToast('Telemetry SLAs: 99.98% High Availability Target', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              Terms of Telemetry
            </button>
            <button
              onClick={() => showToast('Direct DEOC Hotline Open: +91 11 2461 8241', 'info')}
              className="hover:text-sky-700 transition-colors cursor-pointer text-sky-700 font-bold"
            >
              Disaster Control Liaison
            </button>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="flex items-center gap-1.5 text-slate-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational Cluster: IN-DEL-HPC-NCMRWF-N04
            </span>
            <span>•</span>
            <span>Secure Protocol: TLS 1.3 FIPS-140-3</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Latency: 12ms · Telemetry: VERIFIED</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 font-sans font-bold">
            <Phone className="w-3.5 h-3.5 text-sky-600" />
            <span>24/7 Scientific Liaison Desk: <strong className="font-mono text-slate-900">+91 11 2461 8241</strong></span>
            <span className="mx-1.5 text-slate-300">|</span>
            <span>Helpdesk: <strong className="font-mono text-slate-900">1800-180-1717</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
}
