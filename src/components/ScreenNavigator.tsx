import React, { useState } from 'react';
import { ScreenId } from '../types';

interface ScreenNavigatorProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const ScreenNavigator: React.FC<ScreenNavigatorProps> = ({ onNavigate, onToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'onboarding' | 'action' | 'ai' | 'community'>('all');

  const filterChips = [
    { id: 'all', label: 'All Screens (11)' },
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'action', label: 'Actions & Projects' },
    { id: 'ai', label: 'ShoreScan AI & Reports' },
    { id: 'community', label: 'Circularity & Co-op' },
  ];

  const handleScreenLaunch = (screen: ScreenId, title: string) => {
    onToast(`Routing to ${title}...`, 'explore');
    onNavigate(screen);
  };

  const screens = [
    // Category A
    {
      id: 'welcome' as ScreenId,
      cat: 'onboarding',
      num: 'Screen 01',
      badge: 'First Touch',
      title: 'Welcome & Onboarding',
      icon: 'waving_hand',
      desc: 'Field role selector (Fisher, Diver, Citizen), pilot harbor picker (Sanur/Banyuwangi), and mission commitments.',
      subtext: '3-step setup',
      btnText: 'Launch Onboarding',
    },
    {
      id: 'home' as ScreenId,
      cat: 'onboarding',
      num: 'Screen 02',
      badge: 'Main Dashboard',
      title: 'Home Dashboard',
      icon: 'home',
      desc: 'Real-time Sanur low-tide recovery timer, verified 4.2T nylon recovered metric, urgent alert drawer, and daily actions.',
      subtext: 'Live Tide Bar',
      btnText: 'Go to Home',
    },
    {
      id: 'explore' as ScreenId,
      cat: 'onboarding',
      num: 'Screen 03',
      badge: 'Geospatial',
      title: 'Explore Map & Directory',
      icon: 'map',
      desc: 'Interactive radar map covering Bali & East Java straits, certified weigh stations, drop-off depots, and active dive buoys.',
      subtext: '14 Coast Depots',
      btnText: 'Open Explore Map',
    },

    // Category B
    {
      id: 'actions' as ScreenId,
      cat: 'action',
      num: 'Screen 04',
      badge: 'Action Hub',
      title: 'Take Action Directory',
      icon: 'add_alert',
      desc: '7 verified stewardship pathways: Emergency net snag dispatch, coastal sorting, dive retrieval, and gear sponsorship.',
      subtext: '7 Active Pathways',
      btnText: 'Open Action Hub',
    },
    {
      id: 'project-details' as ScreenId,
      cat: 'action',
      num: 'Screen 05',
      badge: 'Operations',
      title: 'Project Details & Registration',
      icon: 'event_available',
      desc: 'Kuta Harbor Net Sorting Drive details: Remaining volunteer berths, equipment requirements, safety briefs, and muster code.',
      subtext: 'Muster Pass Ready',
      btnText: 'View Project Details',
    },

    // Category C
    {
      id: 'shorescan' as ScreenId,
      cat: 'ai',
      num: 'Screen 06',
      badge: 'Physical AI',
      title: 'ShoreScan AI Detector',
      icon: 'videocam',
      desc: 'ESP32-CAM live viewfinder simulator, bounding box net detection (94.2% confidence), polymer breakdown, and Bluetooth edge sync.',
      subtext: 'Edge Hardware Live',
      btnText: 'Open ShoreScan',
    },
    {
      id: 'report-gear' as ScreenId,
      cat: 'ai',
      num: 'Screen 07',
      badge: 'Field Intake',
      title: 'Report Lost Ghost Gear',
      icon: 'report_problem',
      desc: 'Structured mobile logging flow: GPS auto-pinning, drift hazard severity, wildlife entanglement flags, and media upload.',
      subtext: 'Exif GPS Extraction',
      btnText: 'File Gear Report',
    },
    {
      id: 'dossiers' as ScreenId,
      cat: 'ai',
      num: 'Screen 08',
      badge: 'Triage Dossier',
      title: 'Community Reports & Dossiers',
      icon: 'folder_managed',
      desc: 'Verified regional triage stream, AI confidence scores, salvage chain verification, and dispatch updates.',
      subtext: '9 Verified Sightings',
      btnText: 'View Reports Hub',
    },

    // Category D
    {
      id: 'community-feed' as ScreenId,
      cat: 'community',
      num: 'Screen 09',
      badge: 'Harbor Feed',
      title: 'Community Feed',
      icon: 'forum',
      desc: 'Local fishers union posts, high-res haul imagery, dive crew shoutouts, and pellet processing milestone updates.',
      subtext: '142 Active Stewards',
      btnText: 'Open Feed',
    },
    {
      id: 'recycling' as ScreenId,
      cat: 'community',
      num: 'Screen 10',
      badge: 'Circularity',
      title: 'Repair & Recycling Exchange',
      icon: 'recycling',
      desc: 'Coastal net shredder depots, certified gillnet repair workshops, recycled polymer pellet trade-ins, and gear trade incentives.',
      subtext: 'Rp 8,500/kg Bounty',
      btnText: 'Open Exchange',
    },
    {
      id: 'profile' as ScreenId,
      cat: 'community',
      num: 'Screen 11',
      badge: 'Steward Pass',
      title: 'Steward Profile & Activity Log',
      icon: 'account_circle',
      desc: 'Alex Steward (Tier 2 Harbor Champion), 320 kg total recovered nylon ledger, emergency beacon contacts, and QR muster badge.',
      subtext: 'Tier 2 Certified',
      btnText: 'View Profile',
    },
  ];

  const filteredScreens = screens.filter((s) => {
    const matchesCat = activeCategory === 'all' || s.cat === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      query === '' ||
      s.title.toLowerCase().includes(query) ||
      s.desc.toLowerCase().includes(query) ||
      s.num.toLowerCase().includes(query);

    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto">
      {/* Master Header Section */}
      <div className="px-4 pt-3 pb-4 bg-[#f6faff]">
        <div className="flex flex-col gap-1">
          {/* Status Badge & Scope */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#90f4e9] text-[#00504a] font-bold text-xs shadow-xs font-['DM_Sans']">
              <span className="w-2 h-2 rounded-full bg-[#006a63] animate-ping"></span>
              11 Connected Screens
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e8eff7] text-[#41484b] text-xs font-semibold font-['DM_Sans']">
              <span className="material-symbols-outlined text-sm">sailing</span>
              Bali &amp; East Java Pilot
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#002531] tracking-tight mt-1 font-['DM_Sans']">
            Prototype Navigator
          </h1>
          <p className="text-xs text-[#41484b] font-['Inter'] leading-relaxed">
            Complete interactive screen architecture &amp; end-to-end journey orchestrator for field trials.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-3 relative">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#72787c] pointer-events-none text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter screens by title, role, or feature (e.g. AI, GPS, Sort)..."
              className="w-full h-11 pl-10 pr-9 rounded-full bg-[#e8eff7] text-[#151c22] placeholder:text-[#72787c] text-xs focus:outline-none focus:ring-2 focus:ring-[#006a63] font-['Inter']"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#72787c]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Jump Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
            {filterChips.map((chip) => {
              const active = activeCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveCategory(chip.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all font-['DM_Sans'] ${
                    active
                      ? 'bg-[#123b4a] text-white shadow-xs'
                      : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION: Guided End-to-End User Journeys */}
      <div className="px-4 py-4 bg-[#eef4fc] border-y border-[#dce3eb]/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#006a63] text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              route
            </span>
            <h2 className="text-sm font-bold text-[#002531] font-['DM_Sans']">Guided User Journeys</h2>
          </div>
          <span className="text-xs text-[#72787c] font-['DM_Sans']">4 Playbooks</span>
        </div>

        <p className="text-xs text-[#41484b] mb-3 font-['Inter']">
          Tap any breadcrumb segment or play action below to walk through critical multi-screen workflows:
        </p>

        <div className="flex flex-col gap-3">
          {/* Journey 1 */}
          <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#e8eff7]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#006a63]/10 text-[#006a63] flex items-center justify-center text-xs font-bold font-['DM_Sans']">
                  1
                </span>
                <span className="text-xs font-bold text-[#002531] font-['DM_Sans']">
                  New Member to First Action
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold font-['DM_Sans']">
                Recommended
              </span>
            </div>
            <p className="text-xs text-[#41484b] mb-2 font-['Inter']">
              Ideal for new volunteers or harbor partners installing TIDEKIND for the first time.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-['DM_Sans']">
              <button
                type="button"
                onClick={() => handleScreenLaunch('welcome', 'Screen 01: Welcome')}
                className="px-2.5 py-1 rounded-full bg-[#e8eff7] text-[#002531] font-bold hover:bg-[#90f4e9]"
              >
                1. Welcome
              </button>
              <span className="material-symbols-outlined text-[#72787c] text-xs">arrow_forward</span>
              <button
                type="button"
                onClick={() => handleScreenLaunch('home', 'Screen 02: Home')}
                className="px-2.5 py-1 rounded-full bg-[#e8eff7] text-[#002531] font-bold hover:bg-[#90f4e9]"
              >
                2. Home
              </button>
              <span className="material-symbols-outlined text-[#72787c] text-xs">arrow_forward</span>
              <button
                type="button"
                onClick={() => handleScreenLaunch('actions', 'Screen 04: Action Hub')}
                className="px-2.5 py-1 rounded-full bg-[#e8eff7] text-[#002531] font-bold hover:bg-[#90f4e9]"
              >
                3. Action Hub
              </button>
              <span className="material-symbols-outlined text-[#72787c] text-xs">arrow_forward</span>
              <button
                type="button"
                onClick={() => handleScreenLaunch('project-details', 'Screen 05: Project Details')}
                className="px-2.5 py-1 rounded-full bg-[#006a63] text-white font-bold hover:bg-[#123b4a]"
              >
                4. Join Project
              </button>
            </div>
          </div>

          {/* Journey 2 */}
          <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#e8eff7]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#002531]/10 text-[#002531] flex items-center justify-center text-xs font-bold font-['DM_Sans']">
                  2
                </span>
                <span className="text-xs font-bold text-[#002531] font-['DM_Sans']">
                  Physical AI Detection to Response
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#41484b] text-[10px] font-bold font-['DM_Sans']">
                Hardware Sync
              </span>
            </div>
            <p className="text-xs text-[#41484b] mb-2 font-['Inter']">
              Demonstrates ESP32-CAM optical edge inference feeding regional muster boards.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-['DM_Sans']">
              <button
                type="button"
                onClick={() => handleScreenLaunch('shorescan', 'Screen 06: ShoreScan AI')}
                className="px-2.5 py-1 rounded-full bg-[#90f4e9] text-[#00504a] font-bold hover:bg-[#006a63] hover:text-white"
              >
                1. ShoreScan AI
              </button>
              <span className="material-symbols-outlined text-[#72787c] text-xs">arrow_forward</span>
              <button
                type="button"
                onClick={() => handleScreenLaunch('dossiers', 'Screen 08: Reports Dossier')}
                className="px-2.5 py-1 rounded-full bg-[#e8eff7] text-[#002531] font-bold hover:bg-[#90f4e9]"
              >
                2. Reports Dossier
              </button>
              <span className="material-symbols-outlined text-[#72787c] text-xs">arrow_forward</span>
              <button
                type="button"
                onClick={() => handleScreenLaunch('project-details', 'Screen 05: Net Sorting Muster')}
                className="px-2.5 py-1 rounded-full bg-[#002531] text-white font-bold hover:bg-[#123b4a]"
              >
                3. Net Sorting Muster
              </button>
            </div>
          </div>

          {/* Journey 3 */}
          <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#e8eff7]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center text-xs font-bold font-['DM_Sans']">
                  3
                </span>
                <span className="text-xs font-bold text-[#002531] font-['DM_Sans']">
                  Citizen Sighting to Harbor Triage
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold font-['DM_Sans']">
                Hazard Log
              </span>
            </div>
            <p className="text-xs text-[#41484b] mb-2 font-['Inter']">
              Field reporting of drifting polypropylene tangle with GPS coordinate logging.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-['DM_Sans']">
              <button
                type="button"
                onClick={() => handleScreenLaunch('report-gear', 'Screen 07: Report Gear')}
                className="px-2.5 py-1 rounded-full bg-[#e8eff7] text-[#002531] font-bold hover:bg-[#90f4e9]"
              >
                1. Report Gear
              </button>
              <span className="material-symbols-outlined text-[#72787c] text-xs">arrow_forward</span>
              <button
                type="button"
                onClick={() => handleScreenLaunch('dossiers', 'Screen 08: Triage Dossier')}
                className="px-2.5 py-1 rounded-full bg-[#e8eff7] text-[#002531] font-bold hover:bg-[#90f4e9]"
              >
                2. Triage Dossier
              </button>
              <span className="material-symbols-outlined text-[#72787c] text-xs">arrow_forward</span>
              <button
                type="button"
                onClick={() => handleScreenLaunch('profile', 'Screen 11: Field Salvage Log')}
                className="px-2.5 py-1 rounded-full bg-[#e8eff7] text-[#002531] font-bold hover:bg-[#90f4e9]"
              >
                3. Field Salvage Log
              </button>
            </div>
          </div>

          {/* Journey 4 */}
          <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#e8eff7]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#006a63]/15 text-[#006a63] flex items-center justify-center text-xs font-bold font-['DM_Sans']">
                  4
                </span>
                <span className="text-xs font-bold text-[#002531] font-['DM_Sans']">
                  Circular Economy &amp; Net Exchange
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold font-['DM_Sans']">
                Recycle
              </span>
            </div>
            <p className="text-xs text-[#41484b] mb-2 font-['Inter']">
              Connect local fishers to coastal polymer shredding lofts and trade-in incentives.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-['DM_Sans']">
              <button
                type="button"
                onClick={() => handleScreenLaunch('explore', 'Screen 03: Explore Depot')}
                className="px-2.5 py-1 rounded-full bg-[#e8eff7] text-[#002531] font-bold hover:bg-[#90f4e9]"
              >
                1. Explore Depot
              </button>
              <span className="material-symbols-outlined text-[#72787c] text-xs">arrow_forward</span>
              <button
                type="button"
                onClick={() => handleScreenLaunch('recycling', 'Screen 10: Recycling Exchange')}
                className="px-2.5 py-1 rounded-full bg-[#006a63] text-white font-bold hover:bg-[#123b4a]"
              >
                2. Recycling Exchange
              </button>
              <span className="material-symbols-outlined text-[#72787c] text-xs">arrow_forward</span>
              <button
                type="button"
                onClick={() => handleScreenLaunch('community-feed', 'Screen 09: Pellet Ledger')}
                className="px-2.5 py-1 rounded-full bg-[#e8eff7] text-[#002531] font-bold hover:bg-[#90f4e9]"
              >
                3. Pellet Ledger
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Complete All-Screens Directory */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[#002531] font-['DM_Sans']">
          Screen Directory ({filteredScreens.length})
        </h2>

        {filteredScreens.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e8eff7] flex items-center justify-center text-[#006a63] shrink-0">
                <span className="material-symbols-outlined text-xl">{s.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#006a63] font-bold uppercase tracking-wider font-['DM_Sans']">
                    {s.num}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#41484b] text-[10px] font-semibold font-['DM_Sans']">
                    {s.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#002531] font-['DM_Sans'] truncate mt-0.5">{s.title}</h4>
                <p className="text-xs text-[#41484b] font-['Inter'] mt-1 leading-relaxed">{s.desc}</p>
                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#e8eff7]">
                  <span className="text-[11px] text-[#72787c] font-['Inter']">{s.subtext}</span>
                  <button
                    type="button"
                    onClick={() => handleScreenLaunch(s.id, s.title)}
                    className="px-3.5 py-1.5 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all font-['DM_Sans']"
                  >
                    <span>{s.btnText}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Field Testing Architecture Spec Box */}
      <div className="px-4 pb-4">
        <div className="bg-[#123b4a] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="material-symbols-outlined text-[#90f4e9] text-lg">electrical_services</span>
            <h4 className="text-xs font-bold text-[#90f4e9] font-['DM_Sans']">Hardware Edge Architecture</h4>
          </div>
          <p className="text-xs text-[#ebf1fa] font-['Inter'] leading-relaxed">
            Prototype screens 06 and 07 communicate with local ESP32-CAM nodes via Bluetooth Low Energy (BLE). All GPS coordinate points are formatted to WGS84 standard for Bali coastal maritime patrols.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-white/10">
            <div className="bg-[#002531]/60 p-2 rounded-xl flex flex-col">
              <span className="text-[10px] text-[#7fa5b7] uppercase font-['DM_Sans']">Pilot Coverage</span>
              <span className="text-sm font-bold text-white mt-0.5 font-['DM_Sans']">85 km Coastline</span>
            </div>
            <div className="bg-[#002531]/60 p-2 rounded-xl flex flex-col">
              <span className="text-[10px] text-[#7fa5b7] uppercase font-['DM_Sans']">Offline Buffer</span>
              <span className="text-sm font-bold text-white mt-0.5 font-['DM_Sans']">48-Hr Indexed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
