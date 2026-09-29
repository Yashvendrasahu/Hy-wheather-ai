// src/components/admin/modals/DiagnosticsModal.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext.jsx';
import {
  Activity,
  X,
  Cpu,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Terminal,
  Database,
  ArrowRight
} from 'lucide-react';

export default function DiagnosticsModal() {
  const {
    activeModal,
    setActiveModal,
    diagnosticsTarget,
    resolveLogEvent,
    acknowledgeWarningBanner,
    showToast
  } = useAdmin();

  const [isTriggeringFailover, setIsTriggeringFailover] = useState(false);
  const [failoverComplete, setFailoverComplete] = useState(false);

  if (activeModal !== 'diagnostics') {
    return null;
  }

  const data = diagnosticsTarget || {
    title: 'AI Neural Inference Service',
    node: 'Zone Central-02 (AI-02)',
    code: 'WARN_QUEUE_LATENCY_THRESHOLD_EXCEEDED',
    vram: '89.4%',
    batchQueue: 142,
    failover: 'node-central-02-standby'
  };

  const handleTriggerAutoscaleFailover = () => {
    setIsTriggeringFailover(true);
    showToast('Autoscale Failover Dispatched', 'info', 'Spawning secondary inference pod on Zone Central-02 Standby...');

    setTimeout(() => {
      setIsTriggeringFailover(false);
      setFailoverComplete(true);
      acknowledgeWarningBanner();
      resolveLogEvent('LOG-2025-8841');
      showToast('Queue Latency Normalized', 'success', 'VRAM load balanced to 44% across dual inference workers.');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Subsystem Diagnostics & Live Telemetry
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  DIAG-ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Worker Node: {data.node || 'Zone Central-02 (AI-02)'}
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
          {/* Status Alert Header */}
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-amber-950">
                AI Neural Inference Service: Minor queuing detected on Zone Central-02
              </div>
              <div className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                Tensor batch inference queues are currently holding at <strong>{data.batchQueue || 142} requests</strong> due to high-resolution radar extrapolation burst. Latency is slightly elevated to <strong>42ms</strong>.
              </div>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">VRAM Usage</span>
              <div className={`text-lg font-bold font-mono mt-1 ${failoverComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                {failoverComplete ? '44.2%' : (data.vram || '89.4%')}
              </div>
              <span className="text-[10px] text-slate-400">Limit: 85.0%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Batch Queue</span>
              <div className={`text-lg font-bold font-mono mt-1 ${failoverComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                {failoverComplete ? '12 tasks' : `${data.batchQueue || 142} tasks`}
              </div>
              <span className="text-[10px] text-slate-400">Target &lt; 50</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Inference Latency</span>
              <div className={`text-lg font-bold font-mono mt-1 ${failoverComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                {failoverComplete ? '14 ms' : '42 ms'}
              </div>
              <span className="text-[10px] text-slate-400">SLA: &lt; 20 ms</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Pod Health</span>
              <div className="text-lg font-bold font-mono text-emerald-600 mt-1">
                {failoverComplete ? '2/2 Nodes' : '1/1 Ready'}
              </div>
              <span className="text-[10px] text-slate-400">Zero Crashes</span>
            </div>
          </div>

          {/* Diagnostics Console Logs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-700 font-bold">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-600" />
                <span>Microservice Pod Telemetry Trace</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">pod/nowcast-worker-02a</span>
            </div>
            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto max-h-36 border border-slate-800">
              <div className="text-slate-400">[14:26:12.890] INF: Ingesting GRIB2 mosaic: 34 Doppler stations active</div>
              <div className="text-slate-400">[14:26:14.102] INF: Dispatched 144k grid points to tensor extrapolation kernel</div>
              <div className="text-amber-400">[14:26:15.420] WARN: Tensor core VRAM exceeded 85% safety buffer (current: 89.4%)</div>
              <div className="text-slate-300">[14:26:16.002] INF: Automatic queue throttling engaged to prevent OOM crash</div>
              {failoverComplete && (
                <>
                  <div className="text-emerald-400">[14:35:10.114] OK: Standby worker pod nowcast-worker-02b attached successfully</div>
                  <div className="text-emerald-400">[14:35:12.502] OK: Batch split 50/50. Average queue latency normalized to 14ms</div>
                </>
              )}
            </div>
          </div>

          {/* Failover / Remediation Control */}
          <div className="p-4 rounded-lg bg-sky-50 border border-sky-200 space-y-2">
            <div className="font-bold text-sky-950 text-xs flex items-center justify-between">
              <span>Automated Remediation Trigger</span>
              <span className="font-mono text-[10px] text-sky-700">Zone Standby Target</span>
            </div>
            <p className="text-[11px] text-sky-900">
              Scale out inference worker pool by initializing standby worker <strong>nowcast-worker-02b</strong> on Zone Central-02 to immediately drain batch queues.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 text-xs"
          >
            Close Diagnostics
          </button>

          <button
            type="button"
            disabled={isTriggeringFailover || failoverComplete}
            onClick={handleTriggerAutoscaleFailover}
            className={`px-5 py-2.5 rounded-lg text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all ${
              failoverComplete
                ? 'bg-emerald-600 hover:bg-emerald-700 cursor-default'
                : 'bg-sky-600 hover:bg-sky-700'
            } ${isTriggeringFailover ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isTriggeringFailover ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Spawning Standby Node...</span>
              </>
            ) : failoverComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Autoscaled & Balanced</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Trigger Autoscale & Balance Load</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
