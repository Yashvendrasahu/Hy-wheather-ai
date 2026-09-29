// src/components/admin/AdminFooter.jsx
import React from 'react';
import { Shield, Server, Activity, Lock, ExternalLink, Cpu } from 'lucide-react';

export default function AdminFooter() {
  return (
    <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-200 font-semibold flex items-center gap-2">
                <span>WeatherAI GovCloud Infrastructure</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  ISO-27001 / FIPS-140-3
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                National Meteorological Operations & Cyber-Security Enclave • MoES & NDMA GovNet
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-400" />
              <span>Edge Node: <strong className="text-slate-200">Zone-Central-02</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Inference Core: <strong className="text-slate-200">v4 TPU / A100x8</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cryptographic Seal: <strong className="text-slate-200">SHA-512 Valid</strong></span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© 2025 Ministry of Earth Sciences (MoES), Government of India. Official Administration Console.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Security Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">SDRF / NDMA Hotline</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">GovNIC NOC Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
