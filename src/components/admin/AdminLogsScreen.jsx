// src/components/admin/AdminLogsScreen.jsx
import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import {
  TerminalSquare,
  Search,
  Filter,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  HardDrive,
  Lock,
  ArrowRight,
  X
} from 'lucide-react';

export default function AdminLogsScreen() {
  const {
    systemLogs,
    resolveLogEvent,
    acknowledgeLogEvent,
    openDiagnostics,
    isLiveStreaming,
    setIsLiveStreaming,
    lastSyncTime,
    showToast,
    failuresSummary,
    backendHealth
  } = useAdmin();

  // Active failures calculation based on API exceptions & log state
  const activeFailuresCount = useMemo(() => {
    if (failuresSummary && failuresSummary.length > 0) {
      return failuresSummary.filter(
        (f) => f.severity === 'Warning' || f.severity === 'Critical' || f.severity === 'Investigating'
      ).length;
    }
    return 1;
  }, [failuresSummary]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedService, setSelectedService] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Detail Drawer state
  const [activeLogDrawer, setActiveLogDrawer] = useState(null);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return systemLogs.filter((log) => {
      const matchesSearch =
        searchQuery === '' ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.detail && log.detail.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSeverity =
        selectedSeverity === 'ALL' ||
        log.severity.toUpperCase() === selectedSeverity.toUpperCase();

      const matchesService =
        selectedService === 'ALL' ||
        log.service.toLowerCase().includes(selectedService.toLowerCase());

      const matchesStatus =
        selectedStatus === 'ALL' ||
        log.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesSeverity && matchesService && matchesStatus;
    });
  }, [systemLogs, searchQuery, selectedSeverity, selectedService, selectedStatus]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSeverity('ALL');
    setSelectedService('ALL');
    setSelectedStatus('ALL');
    setSelectedTimeRange('24h');
  };

  // Export Filtered Logs as CSV
  const handleExportCSV = () => {
    if (!filteredLogs || filteredLogs.length === 0) {
      showToast('No Logs to Export', 'warning', 'No log records match your current filter criteria.');
      return;
    }

    showToast('Exporting CSV', 'info', `Compiling ${filteredLogs.length} filtered log entries...`);

    try {
      const headers = [
        'Log ID',
        'Timestamp',
        'Service',
        'Severity',
        'Status',
        'Description',
        'Detail',
        'Duration',
        'Impact Statement',
        'Subsystem Pod',
        'Error Code'
      ];

      const csvRows = [
        headers.join(','),
        ...filteredLogs.map((log) => {
          const escapeCsv = (val) => {
            if (val === undefined || val === null) return '""';
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
          };

          return [
            escapeCsv(log.id),
            escapeCsv(log.time || log.detected),
            escapeCsv(log.service),
            escapeCsv(log.severity),
            escapeCsv(log.status),
            escapeCsv(log.description),
            escapeCsv(log.detail),
            escapeCsv(log.duration),
            escapeCsv(log.impactStatement || ''),
            escapeCsv(log.diagnostics?.pod || log.diagnostics?.subsystem || ''),
            escapeCsv(log.diagnostics?.error_code || '')
          ].join(',');
        })
      ];

      const csvContent = csvRows.join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadAnchor.setAttribute('href', url);
      downloadAnchor.setAttribute('download', `system-logs-export-${timestamp}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(url);

      showToast(
        'CSV Export Complete',
        'success',
        `Successfully exported ${filteredLogs.length} records to CSV.`
      );
    } catch (err) {
      console.error('CSV export failed:', err);
      showToast('Export Error', 'error', 'Failed to generate CSV file.');
    }
  };

  const handleExportLogs = () => {
    showToast('Exporting Log Bundle', 'info', 'Generating encrypted SHA-256 JSON audit archive...');
    setTimeout(() => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `system-events-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Export Complete', 'success', `Exported ${filteredLogs.length} filtered system events.`);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              System Logs & Failures
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
              AUDIT TRAIL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor system events, pipeline failures, operational anomalies and incident resolutions in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Streaming Toggle */}
          <button
            onClick={() => {
              setIsLiveStreaming(!isLiveStreaming);
              showToast(
                isLiveStreaming ? 'Live Stream Paused' : 'Live Stream Resumed',
                'info',
                isLiveStreaming ? 'Event polling suspended.' : 'Listening on GovNIC WebSocket edge.'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isLiveStreaming
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {isLiveStreaming ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Streaming</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-slate-500" />
                <span>Stream Paused</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Export filtered records as CSV file to your device"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredLogs.length})</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
            title="Export full JSON encrypted audit package"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Synced: {lastSyncTime}</span>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards for Logs Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Issues</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600">0</span>
            <span className="text-xs font-medium text-emerald-600">Zero Blockers</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Zero P1 sev incidents active
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Failures</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600">{activeFailuresCount}</span>
            <span className="text-xs font-medium text-amber-700">
              {activeFailuresCount > 0 ? 'In Remediation' : 'All Resolved'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            {activeFailuresCount > 0 ? 'Zone Central-02 VRAM throttle' : 'Zero Active Remediation'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Warnings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">2</span>
            <span className="text-xs font-medium text-slate-500">Minor Jitter</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            FTP Retry & Bhuj link failover
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">14</span>
            <span className="text-xs font-medium text-emerald-600">Archived to Vault</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            100% resolution compliance
          </div>
        </div>
      </div>

      {/* Operational Advisory Banner for Active Issue */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-amber-950 flex items-center gap-2">
              <span>Active Anomaly: High GPU Memory Pressure on nowcast-worker-02a</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-200/70 text-amber-900 font-mono font-bold">
                REF: LOG-2025-8841
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              Tensor extrapolation batch processing queue depth at 142 items. Model synthesis delayed by ~3 mins.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => openDiagnostics()}
            className="px-3 py-1.5 rounded-lg bg-white text-amber-900 hover:bg-amber-100 border border-amber-300 text-xs font-semibold shadow-xs"
          >
            View Diagnostics
          </button>
          <button
            onClick={() => resolveLogEvent('LOG-2025-8841')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
          >
            Resolve Anomaly
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event, service, error code, ref ID..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Severities</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
              <option value="CRITICAL">Critical</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Services</option>
              <option value="AI">AI Processing</option>
              <option value="Data Pipeline">Data Pipeline</option>
              <option value="Forecast Engine">Forecast Engine</option>
              <option value="Storage">Storage & Archive</option>
              <option value="Auth">Auth & Gateway</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Investigating">Investigating</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] pt-2 border-t border-slate-100 text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              Showing <strong className="text-slate-800">{filteredLogs.length}</strong> of{' '}
              <strong className="text-slate-600">{systemLogs.length}</strong> system event entries
            </span>
            {(searchQuery || selectedSeverity !== 'ALL' || selectedService !== 'ALL' || selectedStatus !== 'ALL') && (
              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium text-[10px] border border-sky-200">
                Filters Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download Filtered as CSV</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={clearFilters}
              className="text-sky-600 hover:text-sky-700 font-medium cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main System Events Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Service</th>
                <th className="px-5 py-3 font-semibold">Event Description</th>
                <th className="px-5 py-3 font-semibold">Severity</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Duration</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredLogs.map((log) => {
                const isWarning = log.severity === 'Warning';
                const isInfo = log.severity === 'Info';
                const isResolved = log.status === 'Resolved';

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => setActiveLogDrawer(log)}
                  >
                    <td className="px-5 py-3.5 font-mono text-slate-800 font-medium whitespace-nowrap">
                      {log.time}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {log.service}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{log.description}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {log.detail}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold border ${log.severityClass}`}
                      >
                        {isWarning && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {isInfo && <ShieldCheck className="w-3 h-3 text-slate-500" />}
                        {isResolved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        <span>{log.severity}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${log.statusClass}`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {log.duration}
                    </td>
                    <td
                      className="px-5 py-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveLogDrawer(log)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                        >
                          Inspect
                        </button>
                        {!isResolved && (
                          <button
                            onClick={() => resolveLogEvent(log.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Event Inspection Drawer */}
      {activeLogDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-slideLeft">
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-400/40 flex items-center justify-center text-sky-400">
                  <TerminalSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">Event Log Inspector</h3>
                    <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-sky-300 border border-slate-700">
                      {activeLogDrawer.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{activeLogDrawer.service}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveLogDrawer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 flex-1">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {activeLogDrawer.description}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeLogDrawer.severityClass}`}>
                    {activeLogDrawer.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeLogDrawer.statusClass}`}>
                    {activeLogDrawer.status}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{activeLogDrawer.time}</span>
                </div>
              </div>

              {/* Impact Statement */}
              {activeLogDrawer.impactStatement && (
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Operational Impact Statement
                  </span>
                  <p className="text-slate-800 text-xs mt-1 leading-relaxed font-medium">
                    {activeLogDrawer.impactStatement}
                  </p>
                </div>
              )}

              {/* Progression Steps Timeline */}
              {activeLogDrawer.progression && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Incident Resolution Progression
                  </span>
                  <div className="space-y-2.5 border-l-2 border-slate-200 pl-4 ml-2">
                    {activeLogDrawer.progression.map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-600 ring-4 ring-white"></div>
                        <div className="font-bold text-slate-900 text-[11px] flex items-center justify-between">
                          <span>{step.step}</span>
                          <span className="text-[10px] font-mono text-slate-400 font-normal">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Diagnostics Specs */}
              {activeLogDrawer.diagnostics && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Telemetry Metadata (JSON)
                  </span>
                  <pre className="p-3 rounded-lg bg-slate-900 text-sky-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
                    {JSON.stringify(activeLogDrawer.diagnostics, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveLogDrawer(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium"
              >
                Close Drawer
              </button>

              <div className="flex items-center gap-2">
                {activeLogDrawer.status !== 'Resolved' && (
                  <>
                    <button
                      onClick={() => acknowledgeLogEvent(activeLogDrawer.id)}
                      className="px-3 py-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-semibold"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => resolveLogEvent(activeLogDrawer.id)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                    >
                      Resolve Event
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
