import React, { useState } from 'react';
import { ScreenId } from '../types';
import { MAP_LOCATIONS } from '../data/mockData';

interface ScreenExploreProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const ScreenExplore: React.FC<ScreenExploreProps> = ({ onNavigate, onToast }) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLocId, setSelectedLocId] = useState<string>('sanur');
  const [searchQuery, setSearchQuery] = useState('');

  const filterChips = [
    { id: 'all', label: 'All (18)', icon: 'filter_alt' },
    { id: 'projects', label: 'Projects', icon: 'waves' },
    { id: 'repair', label: 'Net Repair', icon: 'build' },
    { id: 'collection', label: 'Collection Points', icon: 'delete_sweep' },
    { id: 'recycling', label: 'Recycling Partners', icon: 'autorenew' },
    { id: 'recovery', label: 'Authorized Recovery', icon: 'shield' },
  ];

  const selectedLocation = MAP_LOCATIONS.find((l) => l.id === selectedLocId) || MAP_LOCATIONS[0];

  const filteredList = MAP_LOCATIONS.filter((loc) => {
    const matchesSearch =
      searchQuery === '' ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.accepted.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = activeCategory === 'all' || loc.type === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col w-full px-4 pb-24 max-w-lg mx-auto">
      {/* Top Safety Pilot Banner */}
      <div className="pt-2 pb-2">
        <div className="bg-[#ffdbd1] text-[#460b00] px-4 py-1.5 rounded-full flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-[#ba1a1a] text-base shrink-0">verified_user</span>
            <span className="text-[11px] font-semibold truncate font-['DM_Sans']">
              Demo listings — strictly for prototype preview
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ba1a1a]/10 px-2 py-0.5 rounded-full text-[#460b00] shrink-0 font-['DM_Sans']">
            Testbed
          </span>
        </div>
      </div>

      {/* Primary View Mode Toggle & Quick Search */}
      <div className="py-1 flex flex-col gap-2.5">
        {/* View Switcher */}
        <div className="bg-[#e8eff7] p-1 rounded-full flex items-center shadow-inner">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all font-['DM_Sans'] ${
              viewMode === 'map'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'text-[#41484b] hover:text-[#151c22]'
            }`}
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: viewMode === 'map' ? "'FILL' 1" : "'FILL' 0" }}
            >
              map
            </span>
            <span>Map View</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all font-['DM_Sans'] ${
              viewMode === 'list'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'text-[#41484b] hover:text-[#151c22]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">view_list</span>
            <span>List Directory</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined text-[#123b4a] absolute left-3.5 pointer-events-none text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations, repair hubs, drop-offs..."
            className="w-full bg-white text-[#151c22] text-xs pl-10 pr-10 py-2.5 rounded-full shadow-xs border border-[#e8eff7] focus:outline-none focus:ring-2 focus:ring-[#006a63] placeholder:text-[#72787c] font-['Inter']"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-[#72787c] hover:text-[#151c22]"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips (Horizontal Scrollable) */}
      <div className="w-full overflow-x-auto py-2 flex items-center gap-1.5 no-scrollbar">
        {filterChips.map((chip) => {
          const isActive = activeCategory === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setActiveCategory(chip.id)}
              className={`shrink-0 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 font-['DM_Sans'] ${
                isActive
                  ? 'bg-[#002531] text-white shadow-xs'
                  : 'bg-[#eef4fc] text-[#41484b] hover:bg-[#e8eff7]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTAINER 1: MAP VIEW CANVAS */}
      {viewMode === 'map' ? (
        <section className="relative w-full flex flex-col mt-1">
          {/* Map Container Frame */}
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-sm bg-[#123b4a] border border-[#dce3eb]">
            {/* Marine Map Canvas Background */}
            <div className="absolute inset-0 bg-[#123b4a] overflow-hidden">
              {/* Geometric oceanic contours and maritime grid */}
              <svg className="w-full h-full opacity-40" viewBox="0 0 400 400">
                <defs>
                  <radialGradient id="oceanRadar" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#168c83" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#002531" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#001820" stopOpacity="0.95" />
                  </radialGradient>
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#254b5b" strokeWidth="0.8" strokeDasharray="3 3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#oceanRadar)" />
                <rect width="100%" height="100%" fill="url(#gridPattern)" />
                <circle cx="200" cy="200" r="160" fill="none" stroke="#90f4e9" strokeWidth="0.6" strokeDasharray="4 4" />
                <circle cx="200" cy="200" r="110" fill="none" stroke="#90f4e9" strokeWidth="0.8" />
                <circle cx="200" cy="200" r="60" fill="none" stroke="#90f4e9" strokeWidth="0.6" strokeDasharray="4 4" />
                <line x1="200" y1="20" x2="200" y2="380" stroke="#90f4e9" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="20" y1="200" x2="380" y2="200" stroke="#90f4e9" strokeWidth="0.5" strokeOpacity="0.4" />
                {/* Coastal Shoreline Contour Outline */}
                <path
                  d="M 60,40 Q 120,90 140,160 T 170,240 T 260,290 T 350,340"
                  fill="none"
                  stroke="#73d7cd"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                />
                <path
                  d="M 50,20 Q 110,70 130,140 T 160,220 T 250,270 T 340,320"
                  fill="none"
                  stroke="#254b5b"
                  strokeWidth="1.2"
                />
              </svg>
            </div>

            {/* Floating Map Utility Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
              <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 text-[#151c22]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006a63] animate-ping"></span>
                <span className="text-xs font-bold text-[#002531] font-['DM_Sans']">
                  Sanur Waters • Live Radar
                </span>
              </div>
              <div className="pointer-events-auto flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => onToast('Location centered: Sanur Reef outer quadrant')}
                  className="w-9 h-9 rounded-full bg-white text-[#002531] shadow-md flex items-center justify-center active:scale-90 transition-transform"
                  aria-label="Re-center"
                >
                  <span className="material-symbols-outlined text-lg">my_location</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToast('Toggled maritime depth sounding bathymetry')}
                  className="w-9 h-9 rounded-full bg-white text-[#002531] shadow-md flex items-center justify-center active:scale-90 transition-transform"
                  aria-label="Layers"
                >
                  <span className="material-symbols-outlined text-lg">layers</span>
                </button>
              </div>
            </div>

            {/* Interactive Pin 1 (Sanur Depot): Center */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              onClick={() => setSelectedLocId('sanur')}
            >
              <div className="relative flex flex-col items-center">
                {selectedLocId === 'sanur' && (
                  <div className="bg-[#002531] text-white px-2.5 py-0.5 rounded-full shadow-xl text-[10px] flex items-center gap-1 mb-1 border border-[#90f4e9] animate-bounce font-['DM_Sans'] font-bold">
                    <span className="material-symbols-outlined text-xs text-[#90f4e9]">anchor</span>
                    <span className="whitespace-nowrap">Depot (Active)</span>
                  </div>
                )}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    selectedLocId === 'sanur'
                      ? 'bg-[#006a63] text-white ring-4 ring-[#90f4e9]/60 scale-110'
                      : 'bg-[#006a63] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">recycling</span>
                </div>
                <div className="w-2 h-2 bg-[#002531] rounded-full mt-1"></div>
              </div>
            </div>

            {/* Interactive Pin 2 (Banyuwangi Strait): Top Left */}
            <div
              className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              onClick={() => setSelectedLocId('banyuwangi')}
            >
              <div className="relative flex flex-col items-center">
                {selectedLocId === 'banyuwangi' && (
                  <div className="bg-[#002531] text-white px-2.5 py-0.5 rounded-full shadow-xl text-[10px] flex items-center gap-1 mb-1 border border-[#ffb5a1] animate-bounce font-['DM_Sans'] font-bold">
                    <span className="material-symbols-outlined text-xs text-[#ffb5a1]">shield</span>
                    <span className="whitespace-nowrap">Recovery Fleet</span>
                  </div>
                )}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-110 transition-transform ${
                    selectedLocId === 'banyuwangi'
                      ? 'bg-[#ba1a1a] text-white ring-4 ring-[#ffdad6]'
                      : 'bg-[#64200d] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">shield</span>
                </div>
                <span className="absolute -top-1 -right-1 bg-[#ffdbd1] text-[#460b00] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  4
                </span>
              </div>
            </div>

            {/* Interactive Pin 3 (Serangan Hub): Bottom Right */}
            <div
              className="absolute bottom-16 right-1/4 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              onClick={() => setSelectedLocId('serangan')}
            >
              <div className="relative flex flex-col items-center">
                {selectedLocId === 'serangan' && (
                  <div className="bg-[#002531] text-white px-2.5 py-0.5 rounded-full shadow-xl text-[10px] flex items-center gap-1 mb-1 border border-[#c2e8fb] animate-bounce font-['DM_Sans'] font-bold">
                    <span className="material-symbols-outlined text-xs text-[#c2e8fb]">build</span>
                    <span className="whitespace-nowrap">Mending Loft</span>
                  </div>
                )}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-110 transition-transform ${
                    selectedLocId === 'serangan'
                      ? 'bg-[#123b4a] text-[#90f4e9] ring-4 ring-[#c2e8fb]'
                      : 'bg-[#123b4a] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">build</span>
                </div>
                <span className="absolute -top-1 -right-1 bg-[#006a63] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  2
                </span>
              </div>
            </div>

            {/* Interactive Pin 4 (Kusamba Hub): Top Right */}
            <div
              className="absolute top-1/3 right-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              onClick={() => setSelectedLocId('kusamba')}
            >
              <div className="relative flex flex-col items-center">
                {selectedLocId === 'kusamba' && (
                  <div className="bg-[#002531] text-white px-2.5 py-0.5 rounded-full shadow-xl text-[10px] flex items-center gap-1 mb-1 border border-[#90f4e9] animate-bounce font-['DM_Sans'] font-bold">
                    <span className="whitespace-nowrap">Coastal Shredder</span>
                  </div>
                )}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-110 transition-transform ${
                    selectedLocId === 'kusamba'
                      ? 'bg-[#006a63] text-white ring-4 ring-[#90f4e9]'
                      : 'bg-[#e8eff7] text-[#002531]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">delete_sweep</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Detail Card / Bottom Overlay */}
          <div className="mt-2.5 bg-white rounded-2xl p-4 shadow-sm border border-[#e8eff7] flex flex-col gap-2.5 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="bg-[#90f4e9] text-[#00504a] px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 font-['DM_Sans']">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    {selectedLocation.statusBadge}
                  </span>
                  <span className="bg-[#e8eff7] text-[#41484b] px-2 py-0.5 rounded-full text-[11px] font-['DM_Sans']">
                    {selectedLocation.distance}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#151c22] font-['DM_Sans'] truncate">
                  {selectedLocation.name}
                </h2>
                <p className="text-xs text-[#41484b] flex items-center gap-1 mt-0.5 font-['Inter']">
                  <span className="material-symbols-outlined text-base text-[#006a63]">location_on</span>
                  <span className="truncate">{selectedLocation.address}</span>
                </p>
              </div>
            </div>

            {/* Quick Specs Matrix */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-[#eef4fc] p-2.5 rounded-xl flex flex-col justify-between">
                <span className="text-[11px] text-[#41484b] flex items-center gap-1 font-['DM_Sans']">
                  <span className="material-symbols-outlined text-sm text-[#006a63]">schedule</span> Hours
                </span>
                <span className="text-xs text-[#151c22] mt-1 font-bold font-['DM_Sans']">
                  {selectedLocation.hours}
                </span>
                <span className="text-[10px] text-[#006a63] font-bold flex items-center gap-0.5 mt-0.5 font-['DM_Sans']">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006a63] inline-block"></span> Open Now
                </span>
              </div>

              <div className="bg-[#eef4fc] p-2.5 rounded-xl flex flex-col justify-between">
                <span className="text-[11px] text-[#41484b] flex items-center gap-1 font-['DM_Sans']">
                  <span className="material-symbols-outlined text-sm text-[#123b4a]">inventory_2</span> Intake Capacity
                </span>
                <span className="text-xs text-[#151c22] mt-1 font-bold font-['DM_Sans']">
                  {selectedLocation.capacityLeft}
                </span>
                <div className="w-full bg-[#dce3eb] h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-[#006a63] h-full rounded-full"
                    style={{ width: `${selectedLocation.capacityPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Accepted Fishing Gear Tags */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-xs font-bold text-[#151c22] flex items-center gap-1 font-['DM_Sans']">
                <span className="material-symbols-outlined text-base text-[#002531]">category</span>
                Accepted Fishing Materials:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedLocation.accepted.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-[#e8eff7] text-[#151c22] px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 font-['Inter']"
                  >
                    <span className="material-symbols-outlined text-xs text-[#006a63]">check</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e8eff7]">
              <button
                type="button"
                onClick={() => onToast(`Navigating to ${selectedLocation.name} via GPS...`, 'directions')}
                className="min-h-[44px] px-2 py-2 bg-[#006a63] hover:bg-[#00504a] text-white rounded-full text-xs font-bold flex flex-col items-center justify-center gap-0.5 shadow-xs active:scale-95 transition-all font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-lg">directions</span>
                <span>Directions</span>
              </button>

              <button
                type="button"
                onClick={() => onToast('Drop-off prep guide: Rinse salt, bundle lines by polymer type.')}
                className="min-h-[44px] px-2 py-2 bg-[#123b4a] hover:bg-[#002531] text-white rounded-full text-xs font-bold flex flex-col items-center justify-center gap-0.5 shadow-xs active:scale-95 transition-all font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-lg">menu_book</span>
                <span>Drop Guide</span>
              </button>

              <button
                type="button"
                onClick={() => onToast(`Calling ${selectedLocation.name} harbor coordinator...`, 'call')}
                className="min-h-[44px] px-2 py-2 bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] rounded-full text-xs font-bold flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-lg text-[#002531]">support_agent</span>
                <span>Contact Hub</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* CONTAINER 2: ACCESSIBLE LIST VIEW DIRECTORY */
        <section className="w-full flex flex-col gap-3 mt-1">
          <div className="flex items-center justify-between py-1">
            <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">
              {filteredList.length} Verified Facilities Nearby
            </span>
            <span className="text-xs font-semibold text-[#006a63] flex items-center gap-0.5 font-['DM_Sans']">
              <span className="material-symbols-outlined text-sm">tune</span> Sorted by Distance
            </span>
          </div>

          {filteredList.map((loc) => (
            <article
              key={loc.id}
              className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8eff7] flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#90f4e9] text-[#00504a] px-2 py-0.5 rounded-full text-[10px] font-bold font-['DM_Sans']">
                      {loc.statusBadge}
                    </span>
                    <span className="text-[#41484b] text-xs font-['DM_Sans']">{loc.distance}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#151c22] font-['DM_Sans'] mt-1">{loc.name}</h3>
                  <p className="text-xs text-[#41484b] font-['Inter']">{loc.address}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#006a63]/10 flex items-center justify-center text-[#006a63] shrink-0">
                  <span className="material-symbols-outlined text-2xl">
                    {loc.type === 'repair' ? 'build' : loc.type === 'recovery' ? 'shield' : 'recycling'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 py-1">
                {loc.accepted.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-[#eef4fc] text-[#41484b] text-[10px] font-medium px-2 py-0.5 rounded-full font-['Inter']"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e8eff7]">
                <span className="text-[#006a63] text-xs font-bold flex items-center gap-1 font-['DM_Sans']">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {loc.capacityLeft}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedLocId(loc.id);
                    setViewMode('map');
                    onToast(`Selected ${loc.name} on radar.`);
                  }}
                  className="px-4 py-1.5 bg-[#006a63] hover:bg-[#00504a] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all font-['DM_Sans']"
                >
                  <span>View on Map</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Community Impact Counter Footer */}
      <div className="pt-5 pb-2 flex flex-col items-center text-center">
        <div className="w-full bg-[#eef4fc] rounded-2xl p-4 flex items-center justify-between border border-[#dce3eb]/60">
          <div className="flex flex-col text-left">
            <span className="text-2xl font-bold text-[#006a63] font-['DM_Sans']">14,280 kg</span>
            <span className="text-xs text-[#41484b] font-['Inter']">
              Ghost gear safely diverted this quarter
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#90f4e9] flex items-center justify-center text-[#00201d] shadow-xs">
            <span className="material-symbols-outlined text-2xl">eco</span>
          </div>
        </div>
      </div>
    </div>
  );
};
