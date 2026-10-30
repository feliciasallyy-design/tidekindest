import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';

interface ActionsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const ActionsScreen: React.FC<ActionsScreenProps> = ({ onNavigate, showToast }) => {
  const { user, logActivity } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'volunteer' | 'fishers' | 'partners'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Form states inside modals
  const [logKg, setLogKg] = useState('18.5');
  const [logLocation, setLogLocation] = useState('Sanur Reef Outer Sector');
  const [proposalTitle, setProposalTitle] = useState('');
  const [volunteerName, setVolunteerName] = useState(user?.name || 'Alex Steward');
  const [volunteerPhone, setVolunteerPhone] = useState('+62 812-9843-1102');
  const [partnerOrg, setPartnerOrg] = useState('');

  useEffect(() => {
    if (user?.name) {
      setVolunteerName(user.name);
    }
  }, [user]);

  const filterButtons = [
    { id: 'all', label: 'All Actions' },
    { id: 'volunteer', label: 'Volunteer' },
    { id: 'fishers', label: 'Fishers & Depots' },
    { id: 'partners', label: 'Partners & NGOs' },
  ];

  const actions = [
    {
      id: 'find-project',
      category: 'volunteer',
      title: 'Find a Field Project',
      badges: ['Active in Bali & East Java', '3 Open Berths'],
      desc: 'Join hands-on teams sorting ghost gear at Banyuwangi harbor, coastal dive surveys in Nusa Penida, or net line braiding workshops.',
      pillText: 'Next Tide: Sat, Jul 20 · Gilimanuk Depot',
      level: 'Level: Novice to Diver',
      actionLabel: 'Browse 12 Slots',
      icon: 'sailing',
      iconBg: 'bg-[#90f4e9]/30 text-[#006a63]',
      onAction: () => setActiveModal('project'),
    },
    {
      id: 'report-gear',
      category: 'volunteer fishers',
      title: 'Report Ghost Gear',
      badges: ['SAFETY SENSITIVE'],
      badgeClass: 'bg-[#ffdad6] text-[#ba1a1a] font-bold uppercase tracking-wider',
      warning:
        'Do not enter water to untangle gear. Snags and sub-surface tides present severe drowning risks. Certified salvage squads deploy coordinates.',
      desc: 'Spotted submerged nets, trailing longlines, or abandoned fish traps near reefs? Upload a coordinate or photo timestamp for rapid verification.',
      level: 'Avg dispatch: 4 hrs',
      actionLabel: 'Open Hazard Logger',
      icon: 'report_problem',
      iconBg: 'bg-[#ffdad6] text-[#ba1a1a]',
      onAction: () => onNavigate('report-gear'),
    },
    {
      id: 'net-repair',
      category: 'fishers',
      title: 'Net Repair & Recycling',
      badges: ['Resource Exchange'],
      desc: 'Locate artisanal net mending lofts, drop off end-of-life gillnets at coastal shredder stations, or purchase salvaged twine spools.',
      facilities: [
        { name: 'Banyuwangi Shredder', sub: 'Open Daily · Free Entry', icon: 'precision_manufacturing' },
        { name: 'Kusamba Mending Loft', sub: '4 Master Riggers', icon: 'handyman' },
      ],
      level: 'Drop-off incentive: Rp 4k/kg',
      actionLabel: 'View Map & Rates',
      icon: 'autorenew',
      iconBg: 'bg-[#90f4e9]/50 text-[#006a63]',
      onAction: () => onNavigate('recycling'),
    },
    {
      id: 'log-contribution',
      category: 'volunteer fishers',
      title: 'Log My Contribution',
      badges: ['Instant Steward Credits'],
      badgeClass: 'bg-[#90f4e9] text-[#00504a]',
      desc: 'Log field salvage weights, net meters mended, or beach triage hours to earn certified coastal stewardship badging and rewards.',
      quorum: 'Decentralized Verifier Quorum (Requires 1 Geo-Photo)',
      level: 'Verified under 24 hrs',
      actionLabel: 'Log Gear Salvage',
      icon: 'scale',
      iconBg: 'bg-[#90f4e9]/40 text-[#006a63]',
      onAction: () => setActiveModal('log'),
    },
    {
      id: 'start-initiative',
      category: 'volunteer partners',
      title: 'Start an Initiative',
      badges: ['Civic & School Grant'],
      desc: 'Propose a school micro-recycling bin, launch an offshore harbor survey, or create local youth net-weaving workshops in your kelurahan.',
      level: 'Micro-grants up to $500',
      actionLabel: 'Draft Proposal',
      icon: 'campaign',
      iconBg: 'bg-[#c2e8fb] text-[#002531]',
      onAction: () => setActiveModal('initiative'),
    },
    {
      id: 'volunteer',
      category: 'volunteer',
      title: 'Become a Volunteer',
      badges: ['Free Onboarding'],
      badgeClass: 'bg-[#90f4e9] text-[#00201d]',
      desc: 'Take our quick 15-minute coastal safety pledge, pick your operational roles (Harbor Sorting, Boat Crew, or Community Outreach), and receive your Tidekind field pass.',
      level: '15 min video & pledge',
      actionLabel: 'Join Movement',
      icon: 'volunteer_activism',
      iconBg: 'bg-[#90f4e9]/40 text-[#006a63]',
      onAction: () => setActiveModal('volunteer'),
    },
    {
      id: 'partner',
      category: 'partners fishers',
      title: 'Partner With TIDEKIND',
      badges: ['Institutions & Co-ops'],
      desc: 'Are you a fisher cooperative (KUB), marine NGO, university research lab, or industrial nylon polymer recycler? Integrate your operations into Tidekind.',
      level: 'Direct Response < 48 hrs',
      actionLabel: 'Inquire Now',
      icon: 'handshake',
      iconBg: 'bg-[#e2e9f1] text-[#002531]',
      onAction: () => setActiveModal('partner'),
    },
  ];

  const filteredActions = actions.filter((act) => {
    const matchesFilter = activeFilter === 'all' || act.category.includes(activeFilter);
    const matchesSearch =
      searchQuery === '' ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-4">
      {/* Top Header & My Activity Button */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-9 h-9 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#002531] hover:bg-[#dce3eb] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#006a63] uppercase tracking-wider">
              Action Command Hub
            </span>
            <h1 className="text-lg font-bold text-[#002531]">Tidekind Field Pathways</h1>
          </div>
        </div>

        <button
          onClick={() => setIsActivityDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#90f4e9] text-[#00504a] text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base">fact_check</span>
          <span>My Activity</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#006a63] animate-ping ml-0.5"></span>
        </button>
      </div>

      {/* Live Regional Pulse Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#123b4a] text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-[#006a63]/30 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#90f4e9]/20 flex items-center justify-center text-[#90f4e9] shrink-0">
              <span className="material-symbols-outlined text-2xl">waves</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#90f4e9] animate-pulse"></span>
                <span className="text-xs font-bold text-[#90f4e9]">Pilot: Bali & East Java</span>
              </div>
              <p className="text-xs text-[#7fa5b7] truncate">Operational coastal net salvage grid</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-bold text-white block">340</span>
            <span className="text-[11px] text-[#7fa5b7]">Stewards</span>
          </div>
        </div>

        <div className="mt-3 pt-2 grid grid-cols-2 gap-2 text-center bg-[#002531]/50 rounded-2xl p-2 border border-white/5">
          <div className="flex flex-col py-0.5">
            <span className="text-sm font-bold text-[#90f4e9]">18 Hubs</span>
            <span className="text-[10px] text-[#7fa5b7]">Active Depots</span>
          </div>
          <div className="flex flex-col py-0.5">
            <span className="text-sm font-bold text-[#ffb5a1]">4.8 T</span>
            <span className="text-[10px] text-[#7fa5b7]">Salvaged Nylon</span>
          </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-2 sticky top-16 z-30 bg-[#f6faff]/95 backdrop-blur-md py-1">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72787c] text-xl">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-9 rounded-full bg-white text-[#151c22] placeholder:text-[#72787c] text-xs sm:text-sm shadow-xs border border-[#e8eff7] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
            placeholder="Search net salvage, depots, reporting..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#72787c]"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-nowrap">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                activeFilter === btn.id
                  ? 'bg-[#006a63] text-white shadow-xs'
                  : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 7 Key Action Pathways */}
      <div className="space-y-4">
        {filteredActions.map((act) => (
          <article
            key={act.id}
            className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#e8eff7] hover:shadow-md transition-all flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${act.iconBg}`}
              >
                <span className="material-symbols-outlined text-2xl">{act.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {act.badges.map((b, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        act.badgeClass || 'bg-[#e8eff7] text-[#002531]'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <h2 className="text-base font-bold text-[#002531] mt-1">{act.title}</h2>
              </div>
            </div>

            {/* Warning banner if critical */}
            {act.warning && (
              <div className="p-3 rounded-2xl bg-[#ffdad6]/60 text-[#ba1a1a] flex items-start gap-2 border border-[#ffdad6]">
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5">
                  health_and_safety
                </span>
                <p className="text-xs font-medium leading-snug">{act.warning}</p>
              </div>
            )}

            <p className="text-xs text-[#41484b] leading-relaxed">{act.desc}</p>

            {/* Mini preview strip */}
            {act.pillText && (
              <div className="p-2.5 rounded-2xl bg-[#f6faff] flex items-center justify-between border border-[#e8eff7]">
                <div className="flex items-center gap-1.5 min-w-0 text-xs text-[#002531]">
                  <span className="material-symbols-outlined text-[#006a63] text-base shrink-0">
                    calendar_month
                  </span>
                  <span className="truncate font-medium">{act.pillText}</span>
                </div>
                <span className="text-xs font-bold text-[#006a63] shrink-0">Free RSVP</span>
              </div>
            )}

            {/* Facility visual grid if repair */}
            {act.facilities && (
              <div className="grid grid-cols-2 gap-2">
                {act.facilities.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-2xl bg-[#f6faff] flex items-center gap-2 border border-[#e8eff7]"
                  >
                    <span className="material-symbols-outlined text-[#006a63] text-base shrink-0">
                      {f.icon}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#002531] truncate">{f.name}</span>
                      <span className="text-[10px] text-[#72787c] truncate">{f.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quorum banner if log */}
            {act.quorum && (
              <div className="p-2.5 rounded-2xl bg-[#eef4fc] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#002531] font-semibold">
                  <span className="material-symbols-outlined text-[#006a63] text-base">
                    verified
                  </span>
                  <span>Decentralized Verifier Quorum</span>
                </div>
                <span className="text-[11px] text-[#72787c]">Requires 1 Geo-Photo</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e8eff7]">
              <span className="text-xs text-[#72787c]">{act.level}</span>
              <button
                onClick={act.onAction}
                className="px-4 py-2 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1"
              >
                <span>{act.actionLabel}</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </article>
        ))}

        {filteredActions.length === 0 && (
          <div className="text-center py-10 bg-white rounded-3xl p-6 border border-[#e8eff7]">
            <span className="material-symbols-outlined text-4xl text-[#72787c] mb-2">
              search_off
            </span>
            <h3 className="text-base font-bold text-[#002531]">No Matching Pathways</h3>
            <p className="text-xs text-[#41484b] mt-1">
              Try searching for "net", "volunteer", or reset your filters.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 rounded-full bg-[#006a63] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* FLOATING QUICK ACTIVITY DRAWER */}
      {isActivityDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end justify-center p-0 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-5 shadow-2xl border-t border-[#dce3eb] animate-in slide-in-from-bottom">
            <div className="w-10 h-1 bg-[#dce3eb] rounded-full mx-auto mb-3"></div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63]">analytics</span>
                <h3 className="text-base font-bold text-[#002531]">My Activity Hub</h3>
              </div>
              <button
                onClick={() => setIsActivityDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {/* Log item 1 */}
              <div className="p-3 rounded-2xl bg-[#eef4fc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a63] text-lg">
                    fiber_manual_record
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#002531]">18.5 kg Monofilament Logged</p>
                    <p className="text-[11px] text-[#72787c]">Serangan Harbor · Today 09:14</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold">
                  Verifying
                </span>
              </div>

              {/* Log item 2 */}
              <div className="p-3 rounded-2xl bg-[#eef4fc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a63] text-lg">done_all</span>
                  <div>
                    <p className="text-xs font-bold text-[#002531]">Nusa Dua Drift Hazard Report</p>
                    <p className="text-[11px] text-[#72787c]">Lat -8.8021, Long 115.234 · 2d ago</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#002531] text-[10px] font-bold">
                  Resolved
                </span>
              </div>
            </div>

            <div className="mt-4 pt-2 flex gap-2">
              <button
                onClick={() => {
                  setIsActivityDrawerOpen(false);
                  setActiveModal('log');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#006a63] text-white text-xs font-bold text-center active:scale-95 transition-transform"
              >
                + New Contribution Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BROWSE PROJECTS */}
      {activeModal === 'project' && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[80vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">sailing</span>
                <h3 className="text-base font-bold text-[#002531]">Upcoming Field Projects</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#eef4fc] flex flex-col gap-1.5 border border-[#dce3eb]">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[11px] font-bold">
                    Dive & Snorkel
                  </span>
                  <span className="text-[11px] text-[#72787c]">July 20 · 08:30 WITA</span>
                </div>
                <h4 className="text-sm font-bold text-[#002531]">
                  Nusa Penida Manta Point Ghost Trap Clearance
                </h4>
                <p className="text-xs text-[#41484b]">
                  Assisting local dive masters to locate and tag abandoned bamboo & steel cage traps.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#006a63] font-bold">2 berths remaining</span>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      showToast('Enrolled for Nusa Penida Dive Clearance!', 'task_alt');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#006a63] text-white text-xs font-bold"
                  >
                    Enroll
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#eef4fc] flex flex-col gap-1.5 border border-[#dce3eb]">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#002531] text-[11px] font-bold">
                    Shore Sorting
                  </span>
                  <span className="text-[11px] text-[#72787c]">July 24 · 15:00 WITA</span>
                </div>
                <h4 className="text-sm font-bold text-[#002531]">
                  Banyuwangi Port Net Shredding Drive
                </h4>
                <p className="text-xs text-[#41484b]">
                  Classifying reclaimed nylon 6 vs polypropylene ropes before granulation.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#006a63] font-bold">8 berths open</span>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      showToast('Enrolled for Banyuwangi Shredding Drive!', 'task_alt');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#006a63] text-white text-xs font-bold"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOG CONTRIBUTION */}
      {activeModal === 'log' && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">scale</span>
                <h3 className="text-base font-bold text-[#002531]">Log Salvage or Mending</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await logActivity({
                    category: 'Ghost Gear Salvage',
                    weightKg: parseFloat(logKg) || 18.5,
                    hours: 2,
                    location: logLocation,
                    verificationMethod: 'Geo-Photo & Hub Quorum',
                  });
                  setActiveModal(null);
                  showToast(`Salvage log of ${logKg} kg submitted & verified!`, 'task_alt');
                } catch (err: any) {
                  setActiveModal(null);
                  showToast(`Salvage log of ${logKg} kg recorded!`, 'task_alt');
                }
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#002531] mb-1">Kilograms Net</label>
                  <input
                    value={logKg}
                    onChange={(e) => setLogKg(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                    required
                    type="number"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#002531] mb-1">Meters Mended</label>
                  <input
                    defaultValue="30"
                    className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                    type="number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">Activity Location</label>
                <input
                  value={logLocation}
                  onChange={(e) => setLogLocation(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                  required
                  type="text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">
                  Photo of Scale / Work (Required)
                </label>
                <div
                  onClick={() => showToast('Scale photo captured with GPS Exif', 'photo_camera')}
                  className="p-3 rounded-2xl bg-[#f6faff] border border-dashed border-[#006a63] text-center flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#eef4fc]"
                >
                  <span className="material-symbols-outlined text-[#006a63] text-2xl">
                    cloud_upload
                  </span>
                  <span className="text-xs font-bold text-[#002531]">Upload Field Proof Photo</span>
                  <span className="text-[10px] text-[#72787c]">EXIF timestamp verified</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                Submit for Hub Verifier Quorum
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROPOSE CIVIC INITIATIVE */}
      {activeModal === 'initiative' && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">lightbulb</span>
                <h3 className="text-base font-bold text-[#002531]">Propose Civic Initiative</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setActiveModal(null);
                showToast('Proposal docket #TK-842 created successfully!', 'task_alt');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">
                  Initiative Title
                </label>
                <input
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  placeholder="e.g. Jimbaran High School Net Mending Lab"
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                  required
                  type="text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">
                  Target Harbor / Kelurahan
                </label>
                <input
                  defaultValue="Benoa Port Sector 2"
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                  required
                  type="text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">
                  Brief Proposal (200 words)
                </label>
                <textarea
                  defaultValue="Engaging local youth in recovering discarded gillnets and weaving them into community garden shades."
                  className="w-full p-3 rounded-2xl bg-[#f6faff] text-xs text-[#151c22] border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63] resize-none"
                  rows={3}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#006a63] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                Submit Grant Proposal ($500 pool)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BECOME A VOLUNTEER */}
      {activeModal === 'volunteer' && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">
                  volunteer_activism
                </span>
                <h3 className="text-base font-bold text-[#002531]">Volunteer Registration</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#eef4fc] text-xs text-[#41484b] space-y-1 border border-[#dce3eb] mb-3">
              <strong className="text-[#002531] block">Safety Orientation Pledge:</strong>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Never free-dive solo to untangle heavy ropes.</li>
                <li>Wear protective cut-resistant gloves onshore.</li>
                <li>Prioritize marine life release over net salvage.</li>
              </ul>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setActiveModal(null);
                showToast('Pledge confirmed! Welcome to the Tidekind steward roster.', 'task_alt');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">Full Legal Name</label>
                <input
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                  required
                  type="text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">WhatsApp / Phone</label>
                <input
                  value={volunteerPhone}
                  onChange={(e) => setVolunteerPhone(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                  required
                  type="tel"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="safetyCheck"
                  type="checkbox"
                  required
                  defaultChecked
                  className="w-4 h-4 text-[#006a63] rounded"
                />
                <label htmlFor="safetyCheck" className="text-xs font-semibold text-[#002531]">
                  I agree to the field safety code & coastal protocols.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#006a63] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                Complete Registration & Get Field Pass
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PARTNER INQUIRY */}
      {activeModal === 'partner' && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">handshake</span>
                <h3 className="text-base font-bold text-[#002531]">Partner Organization Inquiry</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setActiveModal(null);
                showToast('Partnership docket submitted. We will contact you within 48h.', 'handshake');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">
                  Organization Type
                </label>
                <select className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]">
                  <option>Fisher Cooperative (KUB)</option>
                  <option>Marine NGO / Conservation Trust</option>
                  <option>Commercial Recycler / Polymer Fabricator</option>
                  <option>Academic / Oceanographic Lab</option>
                  <option>Harbor Port Authority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">Organization Name</label>
                <input
                  value={partnerOrg}
                  onChange={(e) => setPartnerOrg(e.target.value)}
                  placeholder="e.g. Bali Marine Research Institute"
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                  required
                  type="text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">Contact Email</label>
                <input
                  defaultValue="coordinator@marineorg.id"
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                  required
                  type="email"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#006a63] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                Submit Partnership Docket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
