import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MAP_LOCATIONS } from '../data/mockData';
import { ScreenId, MapLocationItem } from '../types';

interface ExploreScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const REGION_PRESETS: Record<string, { name: string; center: [number, number]; zoom: number; icon: string }> = {
  all: { name: 'Global Oceans', center: [10, 20], zoom: 2, icon: 'public' },
  indonesia: { name: 'Indonesia & Coral Triangle', center: [-8.65, 115.3], zoom: 8, icon: 'waves' },
  pacific: { name: 'Pacific & Hawaii', center: [21.4, -157.8], zoom: 7, icon: 'surfing' },
  mediterranean: { name: 'Mediterranean', center: [38.2, 18.0], zoom: 5, icon: 'water' },
  atlantic: { name: 'Atlantic & Caribbean', center: [26.0, -60.0], zoom: 4, icon: 'sailing' },
};

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onNavigate, showToast }) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedPinId, setSelectedPinId] = useState<string>('sanur');
  const [activeRegion, setActiveRegion] = useState<string>('indonesia');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSonarPinging, setIsSonarPinging] = useState<boolean>(false);
  const [cursorCoords, setCursorCoords] = useState<string>('8.7052° S, 115.2625° E');
  const [mapTileLayer, setMapTileLayer] = useState<'ocean' | 'satellite' | 'tactical'>('ocean');
  const [showGoogleEmbed, setShowGoogleEmbed] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Filter locations
  const filteredLocations = MAP_LOCATIONS.filter((loc) => {
    const matchesRegion = activeRegion === 'all' || loc.region === activeRegion;
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'repair' && loc.type === 'repair') ||
      (activeCategory === 'collection' && loc.type === 'collection') ||
      (activeCategory === 'recovery' && loc.type === 'recovery') ||
      (activeCategory === 'sanctuary' && loc.type === 'sanctuary');
    const matchesQuery =
      searchQuery.trim() === '' ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.regionLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.accepted.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRegion && matchesCategory && matchesQuery;
  });

  const selectedLocation: MapLocationItem =
    MAP_LOCATIONS.find((loc) => loc.id === selectedPinId) || filteredLocations[0] || MAP_LOCATIONS[0];

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const preset = REGION_PRESETS[activeRegion] || REGION_PRESETS.indonesia;
      const map = L.map(mapContainerRef.current, {
        center: preset.center,
        zoom: preset.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Free Open Source Map Tiles (No API key required)
      const tileUrl =
        mapTileLayer === 'tactical'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      tileLayerRef.current = tiles;

      map.on('mousemove', (e) => {
        const lat = e.latlng.lat.toFixed(4);
        const lng = e.latlng.lng.toFixed(4);
        const latDir = e.latlng.lat >= 0 ? 'N' : 'S';
        const lngDir = e.latlng.lng >= 0 ? 'E' : 'W';
        setCursorCoords(`${Math.abs(Number(lat))}° ${latDir}, ${Math.abs(Number(lng))}° ${lngDir}`);
      });

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Custom Icon Generator with Glowing Neon Pin
    const createCustomIcon = (loc: MapLocationItem, isSelected: boolean) => {
      const isSanctuary = loc.type === 'sanctuary';
      const isRepair = loc.type === 'repair';
      const isRecovery = loc.type === 'recovery';

      const colorBg = isSanctuary
        ? '#7c3aed'
        : isRepair
        ? '#006a63'
        : isRecovery
        ? '#b45309'
        : '#0284c7';

      const iconSymbol = isSanctuary
        ? 'water_drop'
        : isRepair
        ? 'build'
        : isRecovery
        ? 'shield'
        : 'recycling';

      const html = `
        <div class="relative flex flex-col items-center cursor-pointer group transition-transform ${
          isSelected ? 'scale-125 z-50' : 'scale-100 hover:scale-110 z-20'
        }">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xl border-2 ${
            isSelected ? 'border-[#90f4e9] ring-4 ring-[#90f4e9]/50 animate-pulse' : 'border-white'
          }" style="background-color: ${colorBg}; box-shadow: 0 4px 14px ${colorBg}88;">
            <span class="material-symbols-outlined text-[17px]">${iconSymbol}</span>
          </div>
          <div class="w-1.5 h-1.5 rounded-full mt-0.5" style="background-color: ${colorBg};"></div>
          ${
            isSelected
              ? `<div class="absolute -top-7 whitespace-nowrap bg-[#002531] text-[#90f4e9] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-[#90f4e9]/40">
                  ${loc.name.split(' ')[0]}
                </div>`
              : ''
          }
        </div>
      `;

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html,
        iconSize: [36, 44],
        iconAnchor: [18, 40],
      });
    };

    // Render markers
    MAP_LOCATIONS.forEach((loc) => {
      const isSelected = loc.id === selectedPinId;
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createCustomIcon(loc, isSelected),
        title: loc.name,
      }).addTo(map);

      marker.on('click', () => {
        setSelectedPinId(loc.id);
        map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 8), { duration: 1 });
        showToast(`Locked Station: ${loc.name}`, 'pin_drop');
      });

      markersRef.current[loc.id] = marker;
    });
  }, [viewMode, selectedPinId, mapTileLayer]);

  // Handle Region Switching & Camera FlyTo
  const handleSelectRegion = (regionKey: string) => {
    setActiveRegion(regionKey);
    const preset = REGION_PRESETS[regionKey];
    if (preset && leafletMapRef.current) {
      leafletMapRef.current.flyTo(preset.center, preset.zoom, { duration: 1.4 });
    }
    const matching = MAP_LOCATIONS.find((l) => regionKey === 'all' || l.region === regionKey);
    if (matching) setSelectedPinId(matching.id);
    showToast(`Switched region to ${preset.name}`, preset.icon);
  };

  // Sonar Radar Sweep
  const triggerSonarPing = () => {
    setIsSonarPinging(true);
    showToast('Transmitting acoustic sonar ping across marine stations...', 'radar', 'info');
    setTimeout(() => setIsSonarPinging(false), 2400);
  };

  // Center on current selected pin
  const handleCenterOnSelected = () => {
    if (selectedLocation && leafletMapRef.current) {
      leafletMapRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 10, { duration: 1.2 });
      showToast(`Re-centered on ${selectedLocation.name}`, 'my_location');
    }
  };

  // Toggle map tiles (Standard OpenStreetMap vs Satellite Imagery)
  const handleToggleTileTheme = () => {
    const nextTheme = mapTileLayer === 'ocean' ? 'tactical' : 'ocean';
    setMapTileLayer(nextTheme);
    if (tileLayerRef.current && leafletMapRef.current) {
      tileLayerRef.current.remove();
      const tileUrl =
        nextTheme === 'tactical'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(
        leafletMapRef.current
      );
      showToast(`Switched to ${nextTheme === 'tactical' ? 'Satellite Imagery' : 'Nautical Street'} map`, 'layers');
    }
  };

  const categories = [
    { id: 'all', label: 'All Stations', icon: 'filter_alt' },
    { id: 'collection', label: 'Net Depots', icon: 'delete_sweep' },
    { id: 'repair', label: 'Repair Hubs', icon: 'build' },
    { id: 'recovery', label: 'Rapid Fleet', icon: 'shield' },
    { id: 'sanctuary', label: 'Sanctuaries', icon: 'water_drop' },
  ];

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-4">
      {/* Top Global Dispatch Ribbon */}
      <div className="relative overflow-hidden rounded-2xl bg-[#002531] text-white p-3.5 shadow-md border border-[#90f4e9]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#90f4e9] animate-ping shrink-0"></span>
            <div>
              <h2 className="text-xs font-bold text-[#90f4e9] uppercase tracking-wider font-['DM_Sans']">
                Global Marine Stewardship Grid
              </h2>
              <p className="text-[11px] text-[#c2e8fb]">
                Multi-ocean gear salvage, circular net depots &amp; reef sanctuaries
              </p>
            </div>
          </div>
          <button
            onClick={triggerSonarPing}
            className="btn-cool-glow px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 active:scale-95"
            title="Acoustic Sonar Ping"
          >
            <span className={`material-symbols-outlined text-sm ${isSonarPinging ? 'animate-spin' : ''}`}>
              radar
            </span>
            <span>Sonar</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Map vs Directory */}
      <div className="flex flex-col gap-2.5">
        <div className="bg-[#e8eff7] p-1 rounded-2xl flex items-center shadow-inner">
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              viewMode === 'map'
                ? 'btn-cool-primary text-white shadow-md'
                : 'text-[#41484b] hover:text-[#151c22]'
            }`}
          >
            <span className="material-symbols-outlined text-base">map</span>
            <span>Interactive Map</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              viewMode === 'list'
                ? 'btn-cool-primary text-white shadow-md'
                : 'text-[#41484b] hover:text-[#151c22]'
            }`}
          >
            <span className="material-symbols-outlined text-base">view_list</span>
            <span>Directory ({filteredLocations.length})</span>
          </button>
        </div>

        {/* Region Switcher Pills: Bali, Pacific, Mediterranean, Atlantic, Global */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {Object.entries(REGION_PRESETS).map(([key, reg]) => {
            const isRegActive = activeRegion === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectRegion(key)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                  isRegActive
                    ? 'bg-[#006a63] text-white shadow-sm ring-2 ring-[#90f4e9]/60'
                    : 'bg-white text-[#41484b] border border-[#dce3eb] hover:bg-[#e8eff7]'
                }`}
              >
                <span className="material-symbols-outlined text-sm text-[#90f4e9]">{reg.icon}</span>
                <span>{reg.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined text-[#006a63] absolute left-3.5 pointer-events-none text-lg">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-[#151c22] text-xs font-semibold pl-10 pr-10 py-2.5 rounded-2xl shadow-xs border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63] placeholder:text-[#72787c]"
            placeholder="Search stations, ports, materials (e.g. Hawaii, Gillnets, Raja Ampat)..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-[#72787c] hover:text-[#151c22]"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Station Category Filter Chips */}
      <div className="w-full overflow-x-auto pb-1 flex items-center gap-1.5 no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                showToast(`Filtered: ${cat.label}`, cat.icon);
              }}
              className={`shrink-0 py-1.5 px-3 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#002531] text-white shadow-sm'
                  : 'bg-[#eef4fc] text-[#41484b] border border-[#e8eff7] hover:bg-[#e8eff7]'
              }`}
            >
              <span className="material-symbols-outlined text-xs text-[#90f4e9]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAP VIEW */}
      {viewMode === 'map' && (
        <section className="flex flex-col gap-3">
          {/* Interactive Leaflet Container */}
          <div className="relative w-full h-[410px] rounded-3xl overflow-hidden shadow-lg border-2 border-[#123b4a] bg-[#001f29]">
            {/* The Map Div */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Sonar Radar Wave Animation Overlay */}
            {isSonarPinging && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 overflow-hidden">
                <div className="w-48 h-48 rounded-full border-4 border-[#90f4e9] animate-sonar opacity-80"></div>
                <div className="w-96 h-96 rounded-full border-2 border-[#00e5cc] animate-sonar opacity-50 delay-300"></div>
              </div>
            )}

            {/* Floating Top Controls: Coordinates HUD & Layer Toggles */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
              <div className="pointer-events-auto bg-[#002531]/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 border border-white/10 text-white">
                <span className="w-2 h-2 rounded-full bg-[#90f4e9] animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold tracking-tight text-[#90f4e9]">
                  {cursorCoords}
                </span>
              </div>

              <div className="pointer-events-auto flex items-center gap-1.5">
                <button
                  onClick={handleCenterOnSelected}
                  className="w-9 h-9 rounded-full bg-white/95 text-[#002531] shadow-md flex items-center justify-center active:scale-90 transition-all hover:bg-white"
                  title="Center on Selected Station"
                >
                  <span className="material-symbols-outlined text-lg">my_location</span>
                </button>
                <button
                  onClick={handleToggleTileTheme}
                  className="w-9 h-9 rounded-full bg-[#002531] text-[#90f4e9] shadow-md flex items-center justify-center border border-[#90f4e9]/40 active:scale-90 transition-all"
                  title="Toggle Nautical / Tactical Map Theme"
                >
                  <span className="material-symbols-outlined text-lg">layers</span>
                </button>
              </div>
            </div>

            {/* Floating Zoom Buttons (Bottom Right) */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-20">
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => leafletMapRef.current?.zoomIn()}
                className="w-8 h-8 rounded-full bg-white/95 text-[#002531] shadow-md flex items-center justify-center font-bold active:scale-90 hover:bg-white text-base"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => leafletMapRef.current?.zoomOut()}
                className="w-8 h-8 rounded-full bg-white/95 text-[#002531] shadow-md flex items-center justify-center font-bold active:scale-90 hover:bg-white text-base"
              >
                -
              </button>
            </div>
          </div>

          {/* Active Detail Card for Selected Pin */}
          {selectedLocation && (
            <div className="bg-white rounded-3xl p-5 shadow-lg border border-[#e8eff7] flex flex-col gap-3.5 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="bg-[#90f4e9] text-[#00504a] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      <span>{selectedLocation.statusBadge}</span>
                    </span>
                    <span className="bg-[#123b4a] text-white px-2 py-0.5 rounded-full text-[11px] font-semibold">
                      {selectedLocation.regionLabel}
                    </span>
                    <span className="bg-[#e8eff7] text-[#41484b] px-2 py-0.5 rounded-full text-[11px] font-medium">
                      {selectedLocation.distance}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#151c22] truncate">
                    {selectedLocation.name}
                  </h2>
                  <p className="text-xs text-[#41484b] flex items-center gap-1 mt-0.5 truncate">
                    <span className="material-symbols-outlined text-sm text-[#006a63]">
                      location_on
                    </span>
                    <span>{selectedLocation.address}</span>
                  </p>
                </div>
              </div>

              {/* Quick Specs Matrix */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-[#f6faff] p-3 rounded-2xl border border-[#e8eff7]">
                  <span className="text-[11px] text-[#41484b] flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-xs text-[#006a63]">schedule</span>
                    Operating Hours
                  </span>
                  <span className="text-xs font-bold text-[#151c22] mt-0.5 block truncate">
                    {selectedLocation.hours}
                  </span>
                  <span className="text-[10px] text-[#006a63] font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006a63] animate-pulse"></span>
                    <span>Station Online</span>
                  </span>
                </div>

                <div className="bg-[#f6faff] p-3 rounded-2xl border border-[#e8eff7]">
                  <span className="text-[11px] text-[#41484b] flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-xs text-[#123b4a]">
                      inventory_2
                    </span>
                    Processing Capacity
                  </span>
                  <span className="text-xs font-bold text-[#151c22] mt-0.5 block truncate">
                    {selectedLocation.capacityLeft}
                  </span>
                  <div className="w-full bg-[#dce3eb] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#006a63] h-full rounded-full transition-all duration-500"
                      style={{ width: `${selectedLocation.capacityPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Accepted Fishing Gear / Waste Materials */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#151c22]">
                  Target Recovered Marine Materials:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLocation.accepted.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-[#e8eff7] text-[#151c22] px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs text-[#006a63]">check</span>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Google Maps Live View (Zero API Key Required) */}
              {showGoogleEmbed && (
                <div className="rounded-2xl overflow-hidden border-2 border-[#123b4a] bg-[#001f29] shadow-inner p-1 animate-fadeIn">
                  <div className="flex items-center justify-between px-3 py-1.5 text-white text-[11px] font-bold">
                    <span className="flex items-center gap-1.5 text-[#90f4e9]">
                      <span className="material-symbols-outlined text-sm">map</span>
                      <span>Google Maps Live (No API Key Required)</span>
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        selectedLocation.name + ' ' + selectedLocation.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#90f4e9] hover:underline flex items-center gap-0.5 text-[10px]"
                    >
                      <span>Full Google Maps ↗</span>
                    </a>
                  </div>
                  <iframe
                    title={`Google Map - ${selectedLocation.name}`}
                    src={`https://maps.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&hl=en&z=15&output=embed`}
                    className="w-full h-56 rounded-xl border-0"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Cool Action Buttons Row */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {/* 1. Direct Google Maps External Link */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedLocation.name + ' ' + selectedLocation.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cool-primary min-h-[46px] py-2 px-1 rounded-2xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition-all text-white text-center"
                  title="Open in Google Maps"
                >
                  <span className="material-symbols-outlined text-base">near_me</span>
                  <span className="leading-tight">Google Maps ↗</span>
                </a>

                {/* 2. Embedded Google Maps Toggle */}
                <button
                  type="button"
                  onClick={() => setShowGoogleEmbed(!showGoogleEmbed)}
                  className={`min-h-[46px] py-2 px-1 rounded-2xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition-all leading-tight ${
                    showGoogleEmbed
                      ? 'bg-[#123b4a] text-[#90f4e9] ring-2 ring-[#90f4e9]'
                      : 'btn-cool-glow text-[#90f4e9]'
                  }`}
                  title="Toggle Google Maps Live View"
                >
                  <span className="material-symbols-outlined text-base">
                    {showGoogleEmbed ? 'map' : 'explore'}
                  </span>
                  <span>{showGoogleEmbed ? 'Hide Map' : 'Embed View'}</span>
                </button>

                {/* 3. Recycling Guide */}
                <button
                  type="button"
                  onClick={() => onNavigate('recycling')}
                  className="btn-cool-glow min-h-[46px] py-2 px-1 rounded-2xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition-all text-[#90f4e9] leading-tight"
                >
                  <span className="material-symbols-outlined text-base">recycling</span>
                  <span>Drop Guide</span>
                </button>

                {/* 4. Radio VHF */}
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Radio hail to ${selectedLocation.name} frequency 156.8 MHz (Ch 16)...`,
                      'settings_input_antenna',
                      'info'
                    )
                  }
                  className="btn-cool-accent min-h-[46px] py-2 px-1 rounded-2xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all leading-tight"
                >
                  <span className="material-symbols-outlined text-base">
                    settings_input_antenna
                  </span>
                  <span>Radio VHF</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* DIRECTORY LIST VIEW */}
      {viewMode === 'list' && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-xs font-bold text-[#151c22]">
              {filteredLocations.length} Stations in Active Filter
            </span>
            <span className="text-xs text-[#006a63] font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              <span>Multi-Regional Network</span>
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {filteredLocations.map((loc) => (
              <article
                key={loc.id}
                className="bg-white p-4 rounded-3xl shadow-sm border border-[#e8eff7] flex flex-col gap-2.5 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="bg-[#90f4e9] text-[#00504a] px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {loc.statusBadge}
                      </span>
                      <span className="text-[11px] font-bold text-[#002531] bg-[#e8eff7] px-2 py-0.5 rounded-full">
                        {loc.regionLabel}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#151c22] truncate">{loc.name}</h3>
                    <p className="text-xs text-[#41484b] truncate mt-0.5">{loc.address}</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#90f4e9]/30 text-[#006a63] flex items-center justify-center shrink-0 border border-[#006a63]/20">
                    <span className="material-symbols-outlined text-xl">
                      {loc.type === 'repair'
                        ? 'build'
                        : loc.type === 'recovery'
                        ? 'shield'
                        : loc.type === 'sanctuary'
                        ? 'water_drop'
                        : 'recycling'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 py-0.5">
                  {loc.accepted.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-[#f6faff] text-[#41484b] text-[10px] px-2.5 py-0.5 rounded-full border border-[#e8eff7]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#e8eff7] gap-2 flex-wrap">
                  <span className="text-xs text-[#006a63] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>{loc.hours}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + loc.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cool-glow px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 text-[#90f4e9] active:scale-95"
                      title="Open in Google Maps"
                    >
                      <span className="material-symbols-outlined text-xs">near_me</span>
                      <span>Google Maps ↗</span>
                    </a>

                    <button
                      onClick={() => {
                        setSelectedPinId(loc.id);
                        setViewMode('map');
                        showToast(`Focused map on ${loc.name}`, 'pin_drop');
                      }}
                      className="btn-cool-primary px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 active:scale-95"
                    >
                      <span>Radar</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Global Impact Summary Bar */}
      <div className="pt-2">
        <div className="w-full bg-[#123b4a] text-white rounded-3xl p-4 flex items-center justify-between border border-white/10 shadow-md">
          <div className="flex flex-col text-left">
            <span className="text-xl font-bold text-[#90f4e9]">14,280 kg Diverted</span>
            <span className="text-xs text-[#c2e8fb]">
              Across 14 global marine stations in 5 countries
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#90f4e9] flex items-center justify-center text-[#00201d] shadow-sm">
            <span className="material-symbols-outlined text-2xl">public</span>
          </div>
        </div>
      </div>
    </div>
  );
};
