// src/components/admin/AdminConfigScreen.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import {
  SlidersHorizontal,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Edit2,
  RefreshCw,
  Zap,
  Radio,
  FileCheck2,
  Save,
  RotateCcw
} from 'lucide-react';

export default function AdminConfigScreen() {
  const {
    configSettings,
    configMutations,
    openEditConfigModal,
    showToast
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('dataPipeline'); // 'dataPipeline', 'modelProcessing', 'alertNotification', 'securityGovernance'

  const categories = [
    { id: 'dataPipeline', label: 'Data Ingestion Pipelines' },
    { id: 'modelProcessing', label: 'AI & NWP Inference' },
    { id: 'alertNotification', label: 'Emergency Alerts & Siren' },
    { id: 'securityGovernance', label: 'Security & Enclave' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Global Platform Configuration
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
              SOP-2025 ENCLAVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tune ingestion thresholds, model batching intervals, CAP siren parameters and security timeouts.
          </p>
        </div>

        <button
          onClick={() => showToast('Configuration Validated', 'success', 'All system configuration hashes verified against central MoES repo.')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Validate Config Schema</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === cat.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Parameters Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {categories.find((c) => c.id === activeTab)?.label} Settings
          </h3>
          <span className="text-xs text-slate-400 font-mono">Domain: Level-1 GovCloud</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(configSettings[activeTab] || []).map((item) => (
            <div
              key={item.id || item.title}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 flex flex-col justify-between space-y-3 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  {item.isLocked ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3" />
                      <span>LOCKED</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                <div className="font-mono font-bold text-sky-700 text-xs">
                  {item.value}
                </div>

                {!item.isLocked && (
                  <button
                    onClick={() => openEditConfigModal({ ...item, sectionKey: activeTab })}
                    className="px-3 py-1 rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Edit2 className="w-3 h-3 text-slate-500" />
                    <span>Edit Parameter</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mutation Audit Trail */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">
              Configuration Mutation Ledger
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              AUDITED
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Last updated today</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {configMutations.map((mut, idx) => (
            <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{mut.setting}</span>
                  <span className="text-slate-400 font-mono text-[11px]">[{mut.timestamp}]</span>
                </div>
                <div className="text-slate-600 text-[11px] mt-0.5">
                  Changed from <span className="font-mono text-slate-700">{mut.prevValue}</span> &rarr;{' '}
                  <span className="font-mono font-bold text-sky-700">{mut.newValue}</span> • Justification: {mut.reason}
                </div>
              </div>

              <div className="text-right font-mono text-[11px] text-slate-500 self-start sm:self-auto">
                <div>By: <strong className="text-slate-800">{mut.changedBy}</strong></div>
                <div className="text-emerald-600 text-[10px]">{mut.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
