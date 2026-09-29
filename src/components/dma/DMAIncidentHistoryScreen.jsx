// src/components/dma/DMAIncidentHistoryScreen.jsx
import React, { useState } from 'react';
import { useDisasterManagement } from '../../context/DisasterManagementContext.jsx';
import {
  Clock,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  FileText,
  ShieldAlert,
  Send,
  Droplets,
  CloudRain,
  Wind,
  Layers,
  ChevronDown,
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function DMAIncidentHistoryScreen() {
  const {
    selectedIncident,
    setSelectedIncidentId,
    incidents,
    setDmaTab,
    setShowEscalateModal,
    handleUpdateIncidentStatus,
    showToast
  } = useDisasterManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Date Range: Today');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [hazardFilter, setHazardFilter] = useState('All Hazards');
  const [severityFilter, setSeverityFilter] = useState('All Severities');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const filteredIncidents = incidents.filter(inc => {
    if (searchQuery && !inc.title.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.location.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (severityFilter !== 'All Severities' && inc.severity.toLowerCase() !== severityFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  const handleExportReport = () => {
    showToast('Exporting State EOC Incident Archive (CSV / NetCDF / Official PDF)...', 'success');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDateRange('Date Range: Today');
    setLocationFilter('All Locations');
    setHazardFilter('All Hazards');
    setSeverityFilter('All Severities');
    showToast('Incident filters reset.', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Title & Operational Badge Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Incident & Response History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Track weather incidents, alerts, response actions, and audit-grade resolution status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational Records · Synchronized with State EOC Archive</span>
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => showToast('Audit filter matrix refreshed.', 'info')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs text-xs font-bold transition-all cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Audit Filters</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase">ACTIVE INCIDENTS</span>
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">5</div>
          <div className="text-xs font-bold text-rose-600 mt-1">● 2 require immediate action</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-700 uppercase">CRITICAL INCIDENTS</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-rose-700 mt-2">2</div>
          <div className="text-xs font-bold text-rose-600 mt-1">Severe hydrometeorological risk</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-700 uppercase">RESOLVED TODAY</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-700 mt-2">7</div>
          <div className="text-xs font-bold text-emerald-800 mt-1">✓ Closed SOP protocols</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-sky-700 uppercase">ACTIONS RECORDED</span>
            <ShieldCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">24</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Multi-agency dispatches & bulletins</div>
        </div>

      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
          
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search incident, location, hazard, or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
            />
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          >
            <option>Date Range: Today</option>
            <option>Yesterday</option>
            <option>Past 7 Days</option>
            <option>Monthly Archive</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          >
            <option>All Locations</option>
            <option>Indore District (Zone MP-04)</option>
            <option>Dewas Industrial Belt</option>
            <option>Ujjain Pilgrimage Corridor</option>
            <option>Bhopal Lower Lake</option>
          </select>

          <select
            value={hazardFilter}
            onChange={(e) => setHazardFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          >
            <option>All Hazards</option>
            <option>Rainfall</option>
            <option>Flood Risk</option>
            <option>High Wind</option>
            <option>Waterlogging</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          >
            <option>All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Severity</option>
            <option value="Moderate">Moderate Severity</option>
          </select>

        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Applied search and incident filters.', 'success')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Apply</span>
          </button>
          <button
            onClick={handleResetFilters}
            className="px-3 py-2 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Split: Incident Records Table Left (7 cols) + Incident Dossier Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Incident Records Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">
                Incident Records
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-black text-[10px]">
                Showing {filteredIncidents.length} Monitored Incidents
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Incident & Code</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Hazard</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Detected</th>
                  <th className="py-2.5 px-3">Alert</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredIncidents.map(inc => (
                  <tr
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      selectedIncident.id === inc.id ? 'bg-sky-50/60 font-bold border-l-4 border-l-sky-600' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-black text-slate-900">{inc.title}</div>
                      <div className="text-[10px] font-mono text-slate-500 font-bold">#{inc.id}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {inc.location}
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1 font-bold text-slate-800">
                        <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                        <span>{inc.hazard}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${inc.severityBadge}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                        <span>{inc.severity}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {inc.detectedTime}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{inc.alertStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${inc.responseBadgeClass}`}>
                        {inc.responseStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-semibold">
            <span>Showing 1 to {filteredIncidents.length} of 5 operational events</span>
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed">Previous</span>
              <span className="px-2.5 py-1 bg-slate-900 text-white rounded font-bold">1</span>
              <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 hover:bg-slate-200 cursor-pointer">Next</span>
            </div>
          </div>
        </div>

        {/* Right: Incident Dossier & Response Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          
          {/* Top Dossier Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.2 rounded bg-rose-50 text-rose-700 font-mono text-[10px] font-black uppercase border border-rose-200">
                  CRITICAL ALERT
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-bold">
                  {selectedIncident.id}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-1">
                {selectedIncident.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {selectedIncident.location}
              </p>
            </div>

            <div className="text-right">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${selectedIncident.responseBadgeClass}`}>
                {selectedIncident.responseStatus}
              </span>
              <span className="block text-[10px] text-slate-400 font-mono mt-1">
                Updated {selectedIncident.updatedTime}
              </span>
            </div>
          </div>

          {/* Hazard Intelligence & Impact */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              HAZARD INTELLIGENCE & IMPACT
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block">PROBABILITY</span>
                <span className="text-sm font-black text-rose-700 mt-0.5 block">{selectedIncident.probability}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block">WINDOW</span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">{selectedIncident.window}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block">CONFIDENCE</span>
                <span className="text-sm font-black text-emerald-700 mt-0.5 block">{selectedIncident.confidence}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              <strong className="text-slate-900 block mb-1">Projected Impact:</strong>
              {selectedIncident.projectedImpact}
            </div>
          </div>

          {/* Response Timeline (UTC+05:30) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                RESPONSE TIMELINE (UTC+05:30)
              </span>
              <span className="text-[10px] font-bold text-sky-800">
                {selectedIncident.timeline.length} Events Logged
              </span>
            </div>

            <div className="space-y-2 relative pl-4 border-l-2 border-slate-200 ml-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {selectedIncident.timeline.map((evt, idx) => (
                <div key={idx} className="relative text-xs pb-1">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-600 ring-4 ring-white" />
                  <div className="flex items-baseline justify-between font-bold text-slate-900">
                    <span>{evt.title}</span>
                    <span className="font-mono text-[10px] text-slate-400">{evt.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{evt.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="w-full py-2 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Update Status
              </button>
              {showStatusMenu && (
                <div className="absolute left-0 bottom-full mb-1 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1 z-30 text-xs font-bold space-y-1">
                  {['Response Initiated', 'Monitoring', 'Resolved'].map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        handleUpdateIncidentStatus(selectedIncident.id, st);
                        setShowStatusMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setDmaTab('risk-map');
                showToast(`Opened GIS risk map for ${selectedIncident.location}`, 'info');
              }}
              className="w-full py-2 px-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
            >
              Open Risk Map
            </button>

            <button
              onClick={() => setShowEscalateModal(true)}
              className="w-full py-2 px-1 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs transition-colors cursor-pointer shadow-2xs"
            >
              Escalate SDMA
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
