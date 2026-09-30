// src/components/admin/AdminApprovalsScreen.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import {
  FileCheck2,
  Search,
  Filter,
  ShieldCheck,
  Building,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Stamp,
  Lock,
  Download,
  X,
  FileText
} from 'lucide-react';

export default function AdminApprovalsScreen() {
  const {
    registrationQueue,
    selectedRegistrations,
    toggleSelectRegistration,
    selectAllRegistrations,
    openReviewDocs,
    openCryptoAuthModal,
    approveApplicant,
    rejectApplicant
  } = useAdmin();

  const [searchFilter, setSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredQueue = registrationQueue.filter((item) => {
    const matchesSearch =
      searchFilter === '' ||
      item.applicant.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.id.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesRole =
      roleFilter === 'ALL' || item.roleTag === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Official Account Authorization Desk
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {registrationQueue.length} PENDING VERIFICATION
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Validate gazetted officers, scientific forecasters, and disaster management authority petitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedRegistrations.length > 0 && (
            <button
              onClick={() => openCryptoAuthModal(null)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Stamp className="w-4 h-4" />
              <span>Batch Issue Clearance ({selectedRegistrations.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search applicant name, organization, GovID..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Roles</option>
            <option value="met">Meteorologist / Scientific</option>
            <option value="dma">Disaster Management Authority</option>
          </select>
        </div>

        <button
          onClick={selectAllRegistrations}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
        >
          {selectedRegistrations.length === registrationQueue.length && registrationQueue.length > 0
            ? 'Deselect All'
            : 'Select All'}
        </button>
      </div>

      {/* Cards / Table List */}
      <div className="space-y-3">
        {filteredQueue.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">All applications processed</h3>
            <p className="text-xs text-slate-500 mt-1">
              There are no pending accounts matching your current filter criteria.
            </p>
          </div>
        ) : (
          filteredQueue.map((item) => {
            const isSelected = selectedRegistrations.includes(item.id);
            return (
              <div
                key={item.id}
                className={`bg-white p-5 rounded-xl border transition-all shadow-sm hover:shadow-md ${
                  isSelected ? 'border-sky-500 bg-sky-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectRegistration(item.id)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 mt-1"
                    />

                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm font-mono flex-shrink-0">
                      {item.avatar}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {item.applicant}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-sky-100 text-sky-800 border border-sky-200">
                          {item.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${item.badgeClass}`}>
                          {item.artifact}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 font-medium">
                        {item.designation} • <span className="text-slate-900 font-semibold">{item.organization}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                        <span>Email: <strong className="text-slate-700">{item.email}</strong></span>
                        <span>Phone: <strong className="text-slate-700">{item.phone}</strong></span>
                        <span>Gazette Token: <strong className="text-indigo-700">{item.gazetteToken}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => openReviewDocs(item)}
                      className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Review Documents</span>
                    </button>
                    <button
                      onClick={() => openCryptoAuthModal(item)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => rejectApplicant(item.id)}
                      className="px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
