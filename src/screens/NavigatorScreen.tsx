import React, { useState } from 'react';
import { ScreenId } from '../types';

interface NavigatorScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const NavigatorScreen: React.FC<NavigatorScreenProps> = ({ onNavigate, showToast }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'onboarding' | 'action' | 'ai' | 'community'>('all');
  const [search, setSearch] = useState('');

  const journeys = [
    {
      num: '1',
      title: 'New Member to First Action',
      badge: 'Recommended',
      badgeClass: 'bg-[#90f4e9] text-[#00504a]',
      desc: 'Ideal for new volunteers or harbor partners installing TIDEKIND for the first time.',
      steps: [
        { label: '1. Welcome', screen: 'welcome' as ScreenId },
        { label: '2. Home', screen: 'home' as ScreenId },
        { label: '3. Action Hub', screen: 'actions' as ScreenId },
        { label: '4. Join Project', screen: 'project-details' as ScreenId, highlight: true },
      ],
    },
    {
      num: '2',
      title: 'Physical AI Detection to Response',
      badge: 'Hardware Sync',
      badgeClass: 'bg-[#e8eff7] text-[#002531]',
      desc: 'Demonstrates ESP32-CAM optical edge inference feeding regional muster boards.',
      steps: [
        { label: '1. ShoreScan AI', screen: 'shorescan' as ScreenId, active: true },
        { label: '2. Reports Dossier', screen: 'dossiers' as ScreenId },
        { label: '3. Net Sorting Muster', screen: 'project-details' as ScreenId, highlight: true },
      ],
    },
    {
      num: '3',
      title: 'Citizen Sighting to Harbor Triage',
      badge: 'Hazard Log',
      badgeClass: 'bg-[#ffdad6] text-[#ba1a1a]',
      desc: 'Field reporting of drifting polypropylene tangle with GPS coordinate logging.',
      steps: [
        { label: '1. Report Gear', screen: 'report-gear' as ScreenId },
        { label: '2. Triage Dossier', screen: 'dossiers' as ScreenId },
        { label: '3. Field Salvage Log', screen: 'profile' as ScreenId },
      ],
    },
    {
      num: '4',
      title: 'Circular Economy & Net Exchange',
      badge: 'Recycle',
      badgeClass: 'bg-[#90f4e9] text-[#00504a]',
      desc: 'Connect local fishers to coastal polymer shredding lofts and trade-in incentives.',
      steps: [
        { label: '1. Explore Depot', screen: 'explore' as ScreenId },
        { label: '2. Recycling Exchange', screen: 'recycling' as ScreenId, highlight: true },
        { label: '3. Pellet Ledger', screen: 'community-feed' as ScreenId },
      ],
    },
  ];

  const screensData = [
    {
      category: 'onboarding',
      categoryTitle: 'A. Onboarding & Discovery',
      screens: [
        {
          num: 'Screen 01',
          id: 'welcome' as ScreenId,
          title: 'Welcome & Onboarding',
          tag: 'First Touch',
          desc: 'Field role selector (Fisher, Diver, Citizen), pilot harbor picker (Sanur/Banyuwangi), and mission commitments.',
          meta: '3-step setup',
          action: 'Launch Onboarding',
          icon: 'waving_hand',
        },
        {
          num: 'Screen 02',
          id: 'home' as ScreenId,
          title: 'Home Dashboard',
          tag: 'Main Dashboard',
          desc: 'Real-time Sanur low-tide recovery timer, verified 4.2T nylon recovered metric, urgent alert drawer, and daily actions.',
          meta: 'Live Tide Bar',
          action: 'Go to Home',
          icon: 'home',
        },
        {
          num: 'Screen 03',
          id: 'explore' as ScreenId,
          title: 'Explore Map & Directory',
          tag: 'Geospatial',
          desc: 'Interactive radar map covering Bali & East Java straits, certified weigh stations, drop-off depots, and active dive buoys.',
          meta: '14 Coast Depots',
          action: 'Open Explore Map',
          icon: 'map',
        },
      ],
    },
    {
      category: 'action',
      categoryTitle: 'B. Taking Action & Projects',
      screens: [
        {
          num: 'Screen 04',
          id: 'actions' as ScreenId,
          title: 'Take Action Directory',
          tag: 'Action Hub',
          desc: '7 verified stewardship pathways: Emergency net snag dispatch, coastal sorting, dive retrieval, and gear sponsorship.',
          meta: '7 Active Pathways',
          action: 'Open Action Hub',
          icon: 'add_alert',
        },
        {
          num: 'Screen 05',
          id: 'project-details' as ScreenId,
          title: 'Project Details & Registration',
          tag: 'Operations',
          desc: 'Kuta Harbor Net Sorting Drive details: Remaining volunteer berths, equipment requirements, safety briefs, and muster code.',
          meta: 'Muster Pass Ready',
          action: 'View Project Details',
          icon: 'event_available',
        },
      ],
    },
    {
      category: 'ai',
      categoryTitle: 'C. Reporting & Physical AI (ShoreScan)',
      screens: [
        {
          num: 'Screen 06',
          id: 'shorescan' as ScreenId,
          title: 'ShoreScan AI Detector',
          tag: 'Physical AI',
          desc: 'ESP32-CAM live viewfinder simulator, bounding box net detection (94.2% confidence), polymer breakdown, and Bluetooth edge sync.',
          meta: 'Edge Hardware Live',
          action: 'Open ShoreScan',
          icon: 'videocam',
        },
        {
          num: 'Screen 07',
          id: 'report-gear' as ScreenId,
          title: 'Report Lost Ghost Gear',
          tag: 'Field Intake',
          desc: 'Structured mobile logging flow: GPS auto-pinning, drift hazard severity, wildlife entanglement flags, and media upload.',
          meta: 'Exif GPS Extraction',
          action: 'File Gear Report',
          icon: 'report_problem',
        },
        {
          num: 'Screen 08',
          id: 'dossiers' as ScreenId,
          title: 'Community Reports & Dossiers',
          tag: 'Triage Dossier',
          desc: 'Verified regional triage stream, AI confidence scores, salvage chain verification, and dispatch updates.',
          meta: '9 Verified Sightings',
          action: 'View Reports Hub',
          icon: 'folder_managed',
        },
      ],
    },
    {
      category: 'community',
      categoryTitle: 'D. Community & Circularity',
      screens: [
        {
          num: 'Screen 09',
          id: 'community-feed' as ScreenId,
          title: 'Community Feed',
          tag: 'Harbor Feed',
          desc: 'Local fishers union posts, high-res haul imagery, dive crew shoutouts, and pellet processing milestone updates.',
          meta: '142 Active Stewards',
          action: 'Open Feed',
          icon: 'forum',
        },
        {
          num: 'Screen 10',
          id: 'recycling' as ScreenId,
          title: 'Repair & Recycling Exchange',
          tag: 'Circularity',
          desc: 'Coastal net shredder depots, certified gillnet repair workshops, recycled polymer pellet trade-ins, and gear trade incentives.',
          meta: 'Rp 8,500/kg Bounty',
          action: 'Open Exchange',
          icon: 'recycling',
        },
        {
          num: 'Screen 11',
          id: 'profile' as ScreenId,
          title: 'Steward Profile & Activity Log',
          tag: 'Steward Pass',
          desc: 'Alex Steward (Tier 2 Harbor Champion), 320 kg total recovered nylon ledger, emergency beacon contacts, and QR muster badge.',
          meta: 'Tier 2 Certified',
          action: 'View Profile',
          icon: 'account_circle',
        },
        {
          num: 'Screen 12',
          id: 'auth' as ScreenId,
          title: 'Steward Sign In & Access Portal',
          tag: 'Access Portal',
          desc: '1-click sign in for verified stewards, photo studio uploader, role & ocean berth configuration, and account recovery.',
          meta: '1-Click Fast Auth',
          action: 'Open Sign In',
          icon: 'badge',
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-5">
      {/* Header Info */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#90f4e9] text-[#00504a] text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#006a63] animate-ping"></span>
            <span>12 Connected Screens</span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">sailing</span>
            <span>Global Ocean Pilot</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#002531]">Prototype Navigator</h1>
        <p className="text-xs text-[#41484b] leading-relaxed">
          Complete interactive screen architecture & end-to-end journey orchestrator for field trials.
        </p>
      </div>

      {/* Screen Search & Category Jump Chips */}
      <div className="space-y-2">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72787c] text-xl">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-full bg-white text-xs text-[#151c22] border border-[#dce3eb] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#006a63]"
            placeholder="Filter screens by title, role, or feature (e.g. AI, GPS)..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-nowrap">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-[#123b4a] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            All Screens (11)
          </button>
          <button
            onClick={() => setActiveCategory('onboarding')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'onboarding'
                ? 'bg-[#123b4a] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            Onboarding
          </button>
          <button
            onClick={() => setActiveCategory('action')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'action'
                ? 'bg-[#123b4a] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            Actions & Projects
          </button>
          <button
            onClick={() => setActiveCategory('ai')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'ai'
                ? 'bg-[#123b4a] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            ShoreScan AI & Reports
          </button>
          <button
            onClick={() => setActiveCategory('community')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'community'
                ? 'bg-[#123b4a] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            Circularity & Co-op
          </button>
        </div>
      </div>

      {/* SECTION: Guided End-to-End User Journeys */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#eef4fc] border border-[#dce3eb] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#006a63]">
            <span className="material-symbols-outlined text-2xl">route</span>
            <h2 className="text-base font-bold text-[#002531]">Guided User Journeys</h2>
          </div>
          <span className="text-xs text-[#72787c] font-semibold">4 Playbooks</span>
        </div>
        <p className="text-xs text-[#41484b]">
          Tap any breadcrumb segment or play action below to walk through critical multi-screen workflows:
        </p>

        <div className="space-y-3 pt-1">
          {journeys.map((j) => (
            <div
              key={j.num}
              className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] space-y-2 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#90f4e9]/40 text-[#006a63] text-xs font-bold flex items-center justify-center">
                    {j.num}
                  </span>
                  <span className="text-xs font-bold text-[#002531]">{j.title}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${j.badgeClass}`}>
                  {j.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#41484b] leading-relaxed">{j.desc}</p>

              <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                {j.steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <button
                      onClick={() => {
                        onNavigate(step.screen);
                        showToast(`Stepped to ${step.label}`, 'arrow_forward');
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                        step.highlight
                          ? 'bg-[#006a63] text-white shadow-xs'
                          : step.active
                          ? 'bg-[#90f4e9] text-[#00504a]'
                          : 'bg-[#e8eff7] text-[#002531] hover:bg-[#dce3eb]'
                      }`}
                    >
                      {step.label}
                    </button>
                    {idx < j.steps.length - 1 && (
                      <span className="material-symbols-outlined text-xs text-[#72787c]">
                        arrow_forward
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: All-Screens Directory */}
      <div className="space-y-5">
        {screensData.map((group) => {
          if (activeCategory !== 'all' && activeCategory !== group.category) return null;

          const matchingScreens = group.screens.filter(
            (s) =>
              search === '' ||
              s.title.toLowerCase().includes(search.toLowerCase()) ||
              s.desc.toLowerCase().includes(search.toLowerCase()) ||
              s.tag.toLowerCase().includes(search.toLowerCase())
          );

          if (matchingScreens.length === 0) return null;

          return (
            <div key={group.category} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#002531]">{group.categoryTitle}</h3>
                <span className="text-[11px] text-[#72787c]">
                  {matchingScreens.length} Core Screens
                </span>
              </div>

              <div className="space-y-3">
                {matchingScreens.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#e8eff7] hover:shadow-md transition-all flex items-start gap-3.5"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#eef4fc] text-[#006a63] flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-[#006a63] uppercase tracking-wider">
                          {s.num}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#002531] text-[10px] font-semibold">
                          {s.tag}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#002531] mt-0.5 truncate">{s.title}</h4>
                      <p className="text-xs text-[#41484b] mt-1 leading-relaxed">{s.desc}</p>

                      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#e8eff7]">
                        <span className="text-[11px] text-[#72787c]">{s.meta}</span>
                        <button
                          onClick={() => {
                            onNavigate(s.id);
                            showToast(`Navigated to ${s.title}`, s.icon);
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white text-xs font-bold active:scale-95 transition-all flex items-center gap-1 shadow-xs"
                        >
                          <span>{s.action}</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hardware Edge Architecture Callout */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#123b4a] text-white shadow-md space-y-2 border border-white/10 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#006a63]/30 blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#90f4e9] text-xl">
            electrical_services
          </span>
          <h4 className="text-xs font-bold text-[#90f4e9] uppercase tracking-wider">
            Hardware Edge Architecture
          </h4>
        </div>
        <p className="text-xs text-[#e8eff7] leading-relaxed">
          Prototype screens 06 and 07 communicate with local ESP32-CAM nodes via Bluetooth Low
          Energy (BLE). All GPS coordinate points are formatted to WGS84 standard for Bali coastal
          maritime patrols.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="bg-[#002531]/60 p-2.5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#7fa5b7] uppercase block font-semibold">
              Pilot Coverage
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">85 km Coastline</span>
          </div>
          <div className="bg-[#002531]/60 p-2.5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#7fa5b7] uppercase block font-semibold">
              Offline Buffer
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">48-Hr Indexed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
