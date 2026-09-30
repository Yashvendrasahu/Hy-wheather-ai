// src/components/common/AddLocationModal.jsx
import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import { LOCATIONS } from '../../data/weatherData.js';
import { Search, MapPin, Plus, X } from 'lucide-react';

export default function AddLocationModal() {
  const { showAddCityModal, setShowAddCityModal, addPinnedLocation, formatTemp } = useWeather();
  const [query, setQuery] = useState('');

  if (!showAddCityModal) return null;

  const filtered = LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(query.toLowerCase()) ||
    l.region.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pin a New Location</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add cities and transit hubs for instantaneous telemetry access
            </p>
          </div>
          <button
            onClick={() => setShowAddCityModal(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Box */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city, airport, or region name..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-800 placeholder-slate-400"
              autoFocus
            />
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2 max-h-72 custom-scrollbar">
          {filtered.length > 0 ? (
            filtered.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 hover:bg-slate-50 hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{loc.name}</div>
                    <div className="text-xs text-slate-500">{loc.region}, {loc.country}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900 font-mono tabular-nums">
                      {formatTemp(loc.tempC)}
                    </div>
                    <div className="text-[11px] text-slate-500">{loc.condition}</div>
                  </div>
                  <button
                    onClick={() => {
                      addPinnedLocation(loc);
                      setShowAddCityModal(false);
                    }}
                    className="p-2 rounded-xl bg-slate-900 text-white hover:bg-sky-600 transition-colors cursor-pointer"
                    title="Add to Pinned Locations"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching locations found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setShowAddCityModal(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
