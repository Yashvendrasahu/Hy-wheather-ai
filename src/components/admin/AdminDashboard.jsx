// src/components/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import {
  Activity,
  Layers,
  FileCheck2,
  TerminalSquare,
  SlidersHorizontal,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Server,
  Cpu,
  Database,
  Radio,
  HardDrive,
  UserCheck,
  Lock,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Zap,
  Stamp,
  Users,
  Eye,
  Check,
  X,
  ShieldAlert,
  FileText
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    adminProfile,
    pipelines,
    registrationQueue,
    selectedRegistrations,
    toggleSelectRegistration,
    selectAllRegistrations,
    healthServices,
    resourceMetrics,
    failuresSummary,
    activityAudit,
    bannerAcknowledged,
    acknowledgeWarningBanner,
    lastSyncTime,
    refreshDashboard,
    triggerPipelineResync,
    openReviewDocs,
    openCryptoAuthModal,
    openDiagnostics,
    approveApplicant,
    rejectApplicant,
    setAdminTab,
    showToast,
    backendHealth,
    inferenceTelemetry,
    liveNode,
    clusterUptime,
    isProbing
  } = useAdmin();

  const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Operational Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
              SEC-01 ENCLAVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Monitor WeatherAI data pipelines, system health, official account verifications and platform operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentDateFormatted}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Last Synced: <strong className="text-slate-900">{lastSyncTime}</strong></span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-700 font-semibold">{liveNode}</span>
          </div>

          <button
            onClick={refreshDashboard}
            disabled={isProbing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />
            <span>{isProbing ? 'Probing Backend...' : 'Refresh Dashboard'}</span>
          </button>
        </div>
      </div>

      {/* Operational Warning Banner (Dismissible / Acknowledged) */}
      {!bannerAcknowledged && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-amber-950 flex items-center gap-2">
                <span>AI Neural Inference Service: Minor queuing detected on Zone Central-02</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-200/70 text-amber-900 font-mono font-bold">
                  SLA NOTICE
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Tensor batch inference turnaround at {inferenceTelemetry?.latency || 42}ms. PyTorch CPU checkpoint calibrated.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => openDiagnostics()}
              className="px-3 py-1.5 rounded-lg bg-white text-amber-900 hover:bg-amber-100 border border-amber-300 text-xs font-semibold shadow-xs transition-colors"
            >
              View Diagnostics
            </button>
            <button
              onClick={acknowledgeWarningBanner}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Data Pipeline */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Data Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">4 / 4</span>
            <span className="text-xs font-medium text-emerald-600">Streams Active</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>GFS, ECMWF, NCUM, WRF</span>
            <span className="font-semibold text-emerald-600">100% Ingested</span>
          </div>
        </div>

        {/* Card 2: Feature Verification */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Feature Verification</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">18 / 18</span>
            <span className="text-xs font-medium text-sky-600">Weather Vectors Loaded</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span title="Exact feature count of scaler_metadata.joblib" className="truncate max-w-[170px]">
              scaler_metadata.joblib
            </span>
            <span className="font-semibold text-sky-700">Verified</span>
          </div>
        </div>

        {/* Card 3: System Latency */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">System Latency</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {backendHealth?.latency || 14}
            </span>
            <span className="text-xs font-medium text-slate-500 font-mono">ms</span>
            {isProbing && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="truncate max-w-[170px]">
              {backendHealth?.service ? 'MoES Direct API Gateway' : 'GovNIC Gateway Edge'}
            </span>
            <span className="font-semibold text-emerald-600">&lt; 15ms Optimal</span>
          </div>
        </div>

        {/* Card 4: Pending Verification */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Verification</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {registrationQueue.length}
            </span>
            <span className="text-xs font-medium text-amber-700">Requests Waiting</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Awaiting Role Elevation</span>
            <span
              onClick={() => setAdminTab('approvals')}
              className="font-semibold text-sky-600 hover:underline cursor-pointer"
            >
              Review Queue &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Live Data Sync Pipeline Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Live Data Sync Pipeline
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                4 FEEDS ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Numerical Weather Prediction (NWP) model feeds and Doppler telemetry pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerPipelineResync()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Re-sync All Feeds</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">Source / Agency</th>
                <th className="px-5 py-3 font-semibold">Latest Data Run</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Processing Stage</th>
                <th className="px-5 py-3 font-semibold">Latency / Updated</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {pipelines.map((pipe) => {
                const isWarning = pipe.statusType === 'warning';
                return (
                  <tr key={pipe.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{pipe.source}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {pipe.subSource}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-slate-800 font-semibold">{pipe.run}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                          isWarning
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isWarning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                          }`}
                        ></span>
                        {pipe.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-800 font-medium">{pipe.stage}</div>
                      {pipe.progress && (
                        <div className="w-36 bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${pipe.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-700 font-mono">{pipe.latency}</div>
                      <div className="text-[11px] text-slate-500">{pipe.updated}</div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isWarning ? (
                          <button
                            onClick={() => openDiagnostics()}
                            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-[11px] transition-colors"
                          >
                            Diagnose
                          </button>
                        ) : null}
                        <button
                          onClick={() => triggerPipelineResync(pipe.id)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                        >
                          Re-sync
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Official Registration Approval Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Official Registration Approval Queue
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {registrationQueue.length} PENDING
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and authorize gazetted meteorologists and disaster management authorities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectAllRegistrations}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
            >
              {selectedRegistrations.length === registrationQueue.length && registrationQueue.length > 0
                ? 'Deselect All'
                : 'Select All'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedRegistrations.length === registrationQueue.length &&
                      registrationQueue.length > 0
                    }
                    onChange={selectAllRegistrations}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                </th>
                <th className="px-4 py-3 font-semibold">Applicant & Role</th>
                <th className="px-4 py-3 font-semibold">Organization & Email</th>
                <th className="px-4 py-3 font-semibold">Submission</th>
                <th className="px-4 py-3 font-semibold">Verification Artifact</th>
                <th className="px-4 py-3 font-semibold text-right">Authorization Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrationQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <div className="font-bold text-slate-800">All official accounts verified</div>
                    <p className="text-[11px] mt-0.5">No pending registration requests in the queue.</p>
                  </td>
                </tr>
              ) : (
                registrationQueue.map((item) => {
                  const isSelected = selectedRegistrations.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-sky-50/40' : ''
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRegistration(item.id)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs font-mono">
                            {item.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{item.applicant}</div>
                            <div className="text-[11px] font-medium text-sky-700">{item.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800">{item.organization}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {item.email}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-slate-800">{item.submissionTime}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.id}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${item.badgeClass}`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{item.artifact}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openReviewDocs(item)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                          >
                            Review Documents
                          </button>
                          <button
                            onClick={() => openCryptoAuthModal(item)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectApplicant(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Reject Application"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Confirmation Panel (Active when items selected) */}
        {selectedRegistrations.length > 0 && (
          <div className="px-5 py-3.5 bg-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-indigo-900 animate-slideUp">
            <div className="flex items-center gap-2.5 text-xs">
              <div className="w-6 h-6 rounded-md bg-indigo-800 flex items-center justify-center font-bold text-sky-300 font-mono">
                {selectedRegistrations.length}
              </div>
              <div>
                <strong className="text-white">
                  Pending Cryptographic Authorization Confirmation
                </strong>
                <span className="text-indigo-300 ml-1.5 hidden sm:inline">
                  Ready to batch issue Tier-1 GovNIC credentials
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => selectAllRegistrations()}
                className="px-3 py-1.5 rounded-lg text-indigo-300 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => openCryptoAuthModal(null)}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Stamp className="w-3.5 h-3.5" />
                <span>Confirm & Issue Gov Credentials ({selectedRegistrations.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LOWER DASHBOARD: 5 Subsections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subsection 1: System Health Matrix (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                System Health Matrix
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                6/6 SERVICES HEALTHY
              </span>
            </div>
            <span className="text-xs text-slate-500">Live Uptime SLA: 99.98%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {healthServices.map((svc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <div>
                    <div className="font-bold text-slate-800 text-xs">{svc.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {svc.uptime ? `Uptime ${svc.uptime} • ${svc.latency}` : svc.tier || svc.queue || svc.capacity}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800 text-[10px] font-bold">
                  {svc.status}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Resource Monitoring Bar */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Resource Monitoring
              </span>
              <span className="text-[11px] text-slate-500">Auto-balanced across GPU/TPU nodes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[11px]">Compute Load</div>
                <div className="font-bold text-slate-900 font-mono text-sm mt-0.5">
                  {resourceMetrics.computeLoad.percent}%
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: `${resourceMetrics.computeLoad.percent}%` }}></div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[11px]">Memory Utilization</div>
                <div className="font-bold text-slate-900 font-mono text-sm mt-0.5">
                  {resourceMetrics.memoryUtilization.percent}%
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${resourceMetrics.memoryUtilization.percent}%` }}></div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[11px]">Ingestion Queue Depth</div>
                <div className="font-bold text-slate-900 font-mono text-sm mt-0.5">
                  {resourceMetrics.ingestionQueue.current} <span className="text-xs font-normal text-slate-500">tasks</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[11px]">Encrypted Storage</div>
                <div className="font-bold text-slate-900 font-mono text-sm mt-0.5">
                  {resourceMetrics.encryptedStorage.percent} <span className="text-xs font-normal text-slate-500">TB</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: `${resourceMetrics.encryptedStorage.percent}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subsection 2: System Failures & Error Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              System Failures & Error Summary
            </h3>
            <span
              onClick={() => setAdminTab('logs')}
              className="text-xs font-semibold text-sky-600 hover:underline cursor-pointer"
            >
              All Logs &rarr;
            </span>
          </div>

          <div className="space-y-3">
            {failuresSummary.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.severityClass}`}
                  >
                    {item.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{item.note}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                  <span>{item.time}</span>
                  <button
                    onClick={() => {
                      if (item.title.includes('GPU')) {
                        openDiagnostics();
                      } else {
                        setAdminTab('logs');
                      }
                    }}
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    {item.action} &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOWER DASHBOARD: Quick Actions & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Administrative Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Quick Administrative Actions
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setAdminTab('approvals')}
              className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex flex-col justify-between"
            >
              <Users className="w-4 h-4 text-sky-600 mb-2" />
              <div>
                <div className="font-bold text-slate-900 text-xs">Review Registrations</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{registrationQueue.length} pending</div>
              </div>
            </button>

            <button
              onClick={() => triggerPipelineResync()}
              className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex flex-col justify-between"
            >
              <RotateCcw className="w-4 h-4 text-emerald-600 mb-2" />
              <div>
                <div className="font-bold text-slate-900 text-xs">Re-sync Pipelines</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Flush & re-ingest</div>
              </div>
            </button>

            <button
              onClick={() => showToast('Compliance Report Generated', 'info', 'Cryptographic compliance audit bundle downloaded.')}
              className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex flex-col justify-between"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600 mb-2" />
              <div>
                <div className="font-bold text-slate-900 text-xs">Compliance Audit</div>
                <div className="text-[11px] text-slate-500 mt-0.5">FIPS / ISO-27001</div>
              </div>
            </button>

            <button
              onClick={() => setAdminTab('config')}
              className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex flex-col justify-between"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-600 mb-2" />
              <div>
                <div className="font-bold text-slate-900 text-xs">Global Config</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Update thresholds</div>
              </div>
            </button>
          </div>
        </div>

        {/* Admin Activity Audit */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Admin Activity Audit
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                IMMUTABLE LOG
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Enclave SEC-01</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {activityAudit.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700 mt-0.5">
                    {item.time}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 mr-1.5">[{item.action}]</span>
                    <span className="text-slate-600 leading-snug">{item.desc}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>PKI Signed</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
