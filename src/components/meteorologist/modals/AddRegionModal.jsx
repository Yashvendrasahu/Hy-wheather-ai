// src/components/meteorologist/modals/AddRegionModal.jsx
import React, { useState } from 'react';
import { useMeteorologist } from '../../../context/MeteorologistContext.jsx';
import {
  MapPin,
  X,
  Plus,
  Compass,
  Radio,
  Building,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function AddRegionModal() {
  const {
    showAddRegionModal,
    setShowAddRegionModal,
    setTargetObservatory,
    showToast
  } = useMeteorologist();

  const [form, setForm] = useState({
    name: 'Ratlam',
    subdivision: 'Madhya Pradesh · Malwa Plateau',
    stationCode: 'AWS-42689',
    lat: '23.3315',
    lng: '75.0367',
    elevation: '488m MSL',
    alertThreshold: 'High Watch'
  });

  if (!showAddRegionModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTargetObservatory({
      id: form.name.toLowerCase().replace(/\s+/g, '-'),
      name: `${form.name}, ${form.subdivision}`,
      stationCode: form.stationCode,
      lat: parseFloat(form.lat) || 23.33,
      lng: parseFloat(form.lng) || 75.03,
      elevation: form.elevation,
      region: form.subdivision
    });
    setShowAddRegionModal(false);
    showToast(`Added observatory ${form.name} (${form.stationCode}) to Synoptic Desk.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Add AWS Monitoring Station
              </h3>
              <p className="text-xs text-slate-400">
                Register new automatic weather station to priority synoptic desk
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddRegionModal(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs font-bold">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Station City / Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Official IMD Station Code</label>
              <input
                type="text"
                required
                value={form.stationCode}
                onChange={(e) => setForm({ ...form, stationCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sky-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Subdivision / Meteorological Region</label>
            <input
              type="text"
              required
              value={form.subdivision}
              onChange={(e) => setForm({ ...form, subdivision: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Latitude (°N)</label>
              <input
                type="number"
                step="any"
                required
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Longitude (°E)</label>
              <input
                type="number"
                step="any"
                required
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Elevation MSL</label>
              <input
                type="text"
                value={form.elevation}
                onChange={(e) => setForm({ ...form, elevation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-slate-600 mb-1">Initial Surveillance Category</label>
            <select
              value={form.alertThreshold}
              onChange={(e) => setForm({ ...form, alertThreshold: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            >
              <option>High Watch (Active Convective Tracking)</option>
              <option>Severe Risk Surveillance</option>
              <option>Standard AWS Climatology Baseline</option>
            </select>
          </div>

          {/* Footer inside form */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddRegionModal(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Observatory</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
