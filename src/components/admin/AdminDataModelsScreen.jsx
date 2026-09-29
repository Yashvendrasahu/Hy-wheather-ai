// src/components/admin/AdminDataModelsScreen.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import {
  Layers,
  Activity,
  Cpu,
  Server,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Database,
  Radio,
  FileCode,
  Sliders,
  ExternalLink,
  ChevronRight,
  HardDrive
} from 'lucide-react';

export default function AdminDataModelsScreen() {
  const {
    pipelines,
    triggerPipelineResync,
    openDiagnostics,
    showToast
  } = useAdmin();

  const [activeModelTab, setActiveModelTab] = useState('models'); // 'models', 'radar', 'vector-cache'
  const [purgingCache, setPurgingCache] = useState(false);

  const modelNodes = [
    {
      name: 'NOAA GFS Global Forecast System',
      code: 'GFS-0.25-GLOBAL',
      resolution: '0.25° Spatial (~27 km)',
      horizon: 'T+240 Hours',
      runInterval: 'Every 6 Hours (00Z, 06Z, 12Z, 18Z)',
      status: 'Online',
      statusType: 'success',
      vram: '38%',
      latency: '8ms',
      lastBatch: '12Z Cycle Run • 144,000 vectors'
    },
    {
      name: 'IMD / NCMRWF NCUM Regional Model',
      code: 'NCUM-4KM-INDIA',
      resolution: '4.0 km High-Resolution',
      horizon: 'T+72 Hours',
      runInterval: 'Twice Daily (00Z, 12Z)',
      status: 'Online',
      statusType: 'success',
      vram: '52%',
      latency: '14ms',
      lastBatch: '06Z Synoptic Grid • 820,000 vectors'
    },
    {
      name: 'WeatherAI DeepNowcast Neural Model',
      code: 'NOWCAST-V4-TPU',
      resolution: '1.0 km Optical Flow Radar Extrapolation',
      horizon: 'T+6 Hours (Sub-hourly)',
      runInterval: 'Every 15 Minutes (Continuous)',
      status: 'Throttling',
      statusType: 'warning',
      vram: '89%',
      latency: '42ms',
      lastBatch: 'T+15m Live Inference • Queue 142'
    },
    {
      name: 'IMD WRF-ARW Multi-Domain Ensemble',
      code: 'WRF-3KM-CONVECTIVE',
      resolution: '3.0 km Convective Resolving',
      horizon: 'T+48 Hours',
      runInterval: '00Z, 12Z Cycles',
      status: 'Online',
      statusType: 'success',
      vram: '41%',
      latency: '11ms',
      lastBatch: 'Convective CAPE / CIN & Cloud Water Ingested'
    }
  ];

  const radarStations = [
    { station: 'DWR Bhuj (S-Band)', lat: '23.25° N, 69.67° E', scan: 'Vol 42 (95%)', carrier: 'Redundant Microwave', status: 'Healthy' },
    { station: 'DWR Mumbai (C-Band)', lat: '18.92° N, 72.83° E', scan: 'Vol 42 (100%)', carrier: 'GovNet Fiber Ring', status: 'Healthy' },
    { station: 'DWR Bhopal (S-Band)', lat: '23.28° N, 77.41° E', scan: 'Vol 42 (100%)', carrier: 'GovNet Fiber Ring', status: 'Healthy' },
    { station: 'DWR Jaipur (S-Band)', lat: '26.91° N, 75.78° E', scan: 'Vol 42 (100%)', carrier: 'BSNL Leased Line', status: 'Healthy' },
    { station: 'DWR Chennai (S-Band)', lat: '13.08° N, 80.27° E', scan: 'Vol 42 (100%)', carrier: 'GovNet Fiber Ring', status: 'Healthy' },
    { station: 'DWR Kolkata (S-Band)', lat: '22.57° N, 88.36° E', scan: 'Vol 42 (100%)', carrier: 'GovNet Fiber Ring', status: 'Healthy' }
  ];

  const handlePurgeVectorCache = () => {
    setPurgingCache(true);
    showToast('Purging Vector Cache', 'info', 'Flushing Redis L2/L3 in-memory tensor buffers...');
    setTimeout(() => {
      setPurgingCache(false);
      showToast('Cache Purged & Warm', 'success', '38 isobaric weather vector matrices re-synthesized.');
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Data & Numerical Model Pipelines
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
              NWP ENCLAVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supercomputer ingestion clusters, tensor extrapolation workers, and Doppler radar composite network.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePurgeVectorCache}
            disabled={purgingCache}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${purgingCache ? 'animate-spin' : 'text-slate-500'}`} />
            <span>Purge Vector Cache</span>
          </button>

          <button
            onClick={() => triggerPipelineResync()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Force Re-sync All Feeds</span>
          </button>
        </div>
      </div>

      {/* Model Nodes Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modelNodes.map((node, idx) => {
          const isThrottling = node.statusType === 'warning';
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
                    isThrottling ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}>
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{node.name}</h3>
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {node.code}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                    isThrottling
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {node.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400">Resolution:</span>
                  <div className="font-semibold text-slate-800">{node.resolution}</div>
                </div>
                <div>
                  <span className="text-slate-400">Lead Horizon:</span>
                  <div className="font-semibold text-slate-800">{node.horizon}</div>
                </div>
                <div>
                  <span className="text-slate-400">VRAM / Latency:</span>
                  <div className={`font-semibold font-mono ${isThrottling ? 'text-amber-600' : 'text-slate-800'}`}>
                    {node.vram} • {node.latency}
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] flex items-center justify-between">
                <div className="text-slate-600 truncate mr-2 font-mono">
                  {node.lastBatch}
                </div>
                {isThrottling ? (
                  <button
                    onClick={() => openDiagnostics()}
                    className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] shadow-xs flex-shrink-0"
                  >
                    Diagnose
                  </button>
                ) : (
                  <button
                    onClick={() => triggerPipelineResync()}
                    className="px-2 py-0.5 rounded text-slate-600 hover:text-slate-900 font-medium text-[11px] flex-shrink-0"
                  >
                    Trigger Ingest
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Doppler Radar Network Composite Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">
                National Doppler Weather Radar (DWR) Grid
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                34 RADARS LINKED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dual-polarization radar volume scans aggregated into real-time convective mosaics.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">Scan Frequency: 10 mins</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {radarStations.map((station, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between transition-colors"
            >
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-sky-600" />
                  <span>{station.station}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">{station.lat}</div>
                <div className="text-[11px] text-slate-600">{station.carrier}</div>
              </div>

              <div className="text-right space-y-1">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {station.status}
                </span>
                <div className="text-[10px] font-mono text-slate-500">{station.scan}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
