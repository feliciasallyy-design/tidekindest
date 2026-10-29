import React, { useState } from 'react';
import { ScreenId } from '../types';

interface ScreenActionHubProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const ScreenActionHub: React.FC<ScreenActionHubProps> = ({ onNavigate, onToast }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'volunteer' | 'fishers' | 'partners'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Form states for modals
  const [volunteerPledged, setVolunteerPledged] = useState(false);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');

  const [contribKg, setContribKg] = useState('14.5');
  const [contribMeters, setContribMeters] = useState('30');
  const [contribLocation, setContribLocation] = useState('Sanur Reef Outer Sector');

  const [propTitle, setPropTitle] = useState('');
  const [propPort, setPropPort] = useState('');
  const [propDesc, setPropDesc] = useState('');

  const [partnerType, setPartnerType] = useState('Fisher Cooperative (KUB)');
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');

  const handleEnrollProject = (title: string) => {
    setActiveModal(null);
    onToast(`Enrolled for ${title}! Berth confirmed.`, 'task_alt');
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    onToast(`Logged ${contribKg} kg of ghost net to Banyuwangi verifier quorum!`, 'check_circle');
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    onToast('Civic proposal docket #TK-842 submitted successfully!', 'lightbulb');
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    onToast('Volunteer pledge confirmed! Field pass activated.', 'how_to_reg');
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    onToast('Partnership docket submitted. Coordinator will respond within 48h.', 'handshake');
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 max-w-lg mx-auto">
      {/* Header & Status Bar */}
      <section className="pt-2 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-9 h-9 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] flex items-center justify-center text-[#002531] transition-colors active:scale-95"
              aria-label="Back to home"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#006a63] uppercase tracking-wider font-['DM_Sans']">
                Action Command Hub
              </span>
              <h1 className="text-xl font-bold text-[#002531] font-['DM_Sans'] leading-tight">
                Tidekind Field Pathways
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#90f4e9] text-[#007169] text-xs font-bold shadow-xs active:scale-95 transition-all font-['DM_Sans']"
          >
            <span className="material-symbols-outlined text-base">fact_check</span>
            <span>My Activity</span>
            <span className="w-2 h-2 rounded-full bg-[#006a63] animate-ping ml-0.5"></span>
          </button>
        </div>

        {/* Live Regional Pulse Strip */}
        <div className="p-4 rounded-2xl bg-[#123b4a] text-white shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-[#006a63]/25 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#006a63]/40 flex items-center justify-center text-[#90f4e9] shrink-0">
                <span className="material-symbols-outlined text-2xl">waves</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#90f4e9] animate-pulse"></span>
                  <span className="text-xs font-bold text-[#90f4e9] font-['DM_Sans']">Pilot: Bali &amp; East Java</span>
                </div>
                <p className="text-xs text-[#7fa5b7] truncate font-['Inter']">Operational coastal net salvage grid</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl font-bold text-white block font-['DM_Sans']">340</span>
              <span className="text-[11px] text-[#7fa5b7] font-['DM_Sans']">Stewards</span>
            </div>
          </div>

          <div className="mt-3 pt-2 grid grid-cols-2 gap-2 text-center bg-[#002531]/60 rounded-xl p-2">
            <div className="flex flex-col py-0.5">
              <span className="text-sm font-bold text-[#90f4e9] font-['DM_Sans']">18 Hubs</span>
              <span className="text-[10px] text-[#7fa5b7] font-['DM_Sans']">Active Depots</span>
            </div>
            <div className="flex flex-col py-0.5">
              <span className="text-sm font-bold text-[#ffb5a1] font-['DM_Sans']">4.8 T</span>
              <span className="text-[10px] text-[#7fa5b7] font-['DM_Sans']">Salvaged Nylon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Category Filter */}
      <section className="space-y-2.5 py-1">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72787c] text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search net salvage, depots, reporting..."
            className="w-full h-11 pl-10 pr-9 rounded-full bg-white text-[#151c22] placeholder:text-[#72787c] text-xs shadow-xs border border-[#e8eff7] focus:outline-none focus:ring-2 focus:ring-[#006a63] font-['Inter']"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#72787c]"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-nowrap">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 font-['DM_Sans'] ${
              activeFilter === 'all'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            All Actions
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('volunteer')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 font-['DM_Sans'] ${
              activeFilter === 'volunteer'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            Volunteer
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('fishers')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 font-['DM_Sans'] ${
              activeFilter === 'fishers'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            Fishers &amp; Depots
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('partners')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 font-['DM_Sans'] ${
              activeFilter === 'partners'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            Partners &amp; NGOs
          </button>
        </div>
      </section>

      {/* 7 Key Action Pathways List */}
      <section className="mt-3 space-y-4">
        {/* Card 1: Find a Field Project */}
        {(activeFilter === 'all' || activeFilter === 'volunteer') && (
          <article className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#006a63]/10 flex items-center justify-center text-[#006a63] shrink-0">
                <span className="material-symbols-outlined text-2xl">sailing</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold font-['DM_Sans']">
                    Active in Bali &amp; East Java
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#002531] text-[10px] font-bold font-['DM_Sans']">
                    3 Open Berths
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#002531] font-['DM_Sans'] mt-1">Find a Field Project</h2>
              </div>
            </div>

            <p className="text-xs text-[#41484b] font-['Inter'] mt-2 leading-relaxed">
              Join hands-on teams sorting ghost gear at Banyuwangi harbor, coastal dive surveys in Nusa Penida, or net line braiding workshops.
            </p>

            <div className="mt-2.5 p-2.5 rounded-xl bg-[#eef4fc] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0 text-xs">
                <span className="material-symbols-outlined text-[#006a63] text-base shrink-0">calendar_month</span>
                <span className="font-semibold text-[#002531] truncate font-['DM_Sans']">
                  Next Tide: Sat, Jul 20 · Gilimanuk Depot
                </span>
              </div>
              <span className="text-xs text-[#006a63] font-bold shrink-0 font-['DM_Sans']">Free RSVP</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#e8eff7]">
              <span className="text-xs text-[#72787c] font-['Inter']">Level: Novice to Diver</span>
              <button
                type="button"
                onClick={() => setActiveModal('find-project')}
                className="px-4 py-2 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 font-['DM_Sans']"
              >
                <span>Browse 12 Slots</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </article>
        )}

        {/* Card 2: Report Ghost Gear */}
        {(activeFilter === 'all' || activeFilter === 'volunteer' || activeFilter === 'fishers') && (
          <article className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#ffdad6]/60 flex items-center justify-center text-[#ba1a1a] shrink-0">
                <span className="material-symbols-outlined text-2xl">report_problem</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] uppercase font-bold tracking-wider font-['DM_Sans']">
                  Safety Sensitive
                </span>
                <h2 className="text-base font-bold text-[#002531] font-['DM_Sans'] mt-1">Report Ghost Gear</h2>
              </div>
            </div>

            <div className="mt-2.5 p-2.5 rounded-xl bg-[#ffdad6]/40 text-[#460b00] flex items-start gap-2 border border-[#ffdad6]">
              <span className="material-symbols-outlined text-[#ba1a1a] text-lg shrink-0 mt-0.5">
                health_and_safety
              </span>
              <div className="text-[11px] leading-snug font-['Inter']">
                <strong className="font-bold">Do not enter water to untangle gear.</strong> Snags and sub-surface tides present severe drowning risks. Certified salvage squads deploy coordinates.
              </div>
            </div>

            <p className="text-xs text-[#41484b] font-['Inter'] mt-2 leading-relaxed">
              Spotted submerged nets, trailing longlines, or abandoned fish traps near reefs? Upload a coordinate or photo timestamp for rapid verification.
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#e8eff7]">
              <span className="text-xs text-[#72787c] font-['Inter']">Avg dispatch: 4 hrs</span>
              <button
                type="button"
                onClick={() => onNavigate('report-gear')}
                className="px-4 py-2 rounded-full bg-[#123b4a] hover:bg-[#002531] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-[#ffb5a1] text-base">add_location_alt</span>
                <span>Open Hazard Logger</span>
              </button>
            </div>
          </article>
        )}

        {/* Card 3: Net Repair & Recycling Support */}
        {(activeFilter === 'all' || activeFilter === 'fishers') && (
          <article className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#90f4e9]/50 flex items-center justify-center text-[#006a63] shrink-0">
                <span className="material-symbols-outlined text-2xl">autorenew</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#002531] text-[10px] font-bold font-['DM_Sans']">
                  Resource Exchange
                </span>
                <h2 className="text-base font-bold text-[#002531] font-['DM_Sans'] mt-1">Net Repair &amp; Recycling</h2>
              </div>
            </div>

            <p className="text-xs text-[#41484b] font-['Inter'] mt-2 leading-relaxed">
              Locate artisanal net mending lofts, drop off end-of-life gillnets at coastal shredder stations, or purchase salvaged twine spools.
            </p>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-[#eef4fc] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-base">precision_manufacturing</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-[#002531] truncate font-['DM_Sans']">Banyuwangi Shredder</span>
                  <span className="text-[10px] text-[#72787c]">Open Daily · Free Entry</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-[#eef4fc] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-base">handyman</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-[#002531] truncate font-['DM_Sans']">Kusamba Mending Loft</span>
                  <span className="text-[10px] text-[#72787c]">4 Master Riggers</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#e8eff7]">
              <span className="text-xs text-[#72787c] font-['Inter']">Drop-off incentive: Rp 4k/kg</span>
              <button
                type="button"
                onClick={() => onNavigate('recycling')}
                className="px-4 py-2 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 font-['DM_Sans']"
              >
                <span>View Map &amp; Rates</span>
                <span className="material-symbols-outlined text-sm">map</span>
              </button>
            </div>
          </article>
        )}

        {/* Card 4: Log My Contribution */}
        {(activeFilter === 'all' || activeFilter === 'volunteer' || activeFilter === 'fishers') && (
          <article className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#006a63]/15 flex items-center justify-center text-[#006a63] shrink-0">
                <span className="material-symbols-outlined text-2xl">scale</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold font-['DM_Sans']">
                  Instant Steward Credits
                </span>
                <h2 className="text-base font-bold text-[#002531] font-['DM_Sans'] mt-1">Log My Contribution</h2>
              </div>
            </div>

            <p className="text-xs text-[#41484b] font-['Inter'] mt-2 leading-relaxed">
              Log field salvage weights, net meters mended, or beach triage hours to earn certified coastal stewardship badging and rewards.
            </p>

            <div className="mt-2.5 p-2.5 rounded-xl bg-[#eef4fc] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-lg">verified</span>
                <span className="text-xs font-bold text-[#002531] font-['DM_Sans']">
                  Decentralized Verifier Quorum
                </span>
              </div>
              <span className="text-[11px] text-[#72787c] font-semibold">Requires 1 Geo-Photo</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#e8eff7]">
              <span className="text-xs text-[#72787c] font-['Inter']">Verified under 24 hrs</span>
              <button
                type="button"
                onClick={() => setActiveModal('log-contrib')}
                className="px-4 py-2 rounded-full bg-[#123b4a] hover:bg-[#002531] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 font-['DM_Sans']"
              >
                <span>Log Gear Salvage</span>
                <span className="material-symbols-outlined text-sm">post_add</span>
              </button>
            </div>
          </article>
        )}

        {/* Card 5: Start a Community Initiative */}
        {(activeFilter === 'all' || activeFilter === 'volunteer' || activeFilter === 'partners') && (
          <article className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#c2e8fb] flex items-center justify-center text-[#002531] shrink-0">
                <span className="material-symbols-outlined text-2xl">campaign</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#002531] text-[10px] font-bold font-['DM_Sans']">
                  Civic &amp; School Grant
                </span>
                <h2 className="text-base font-bold text-[#002531] font-['DM_Sans'] mt-1">Start an Initiative</h2>
              </div>
            </div>

            <p className="text-xs text-[#41484b] font-['Inter'] mt-2 leading-relaxed">
              Propose a school micro-recycling bin, launch an offshore harbor survey, or create local youth net-weaving workshops in your kelurahan.
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#e8eff7]">
              <span className="text-xs text-[#72787c] font-['Inter']">Micro-grants up to $500</span>
              <button
                type="button"
                onClick={() => setActiveModal('initiative')}
                className="px-4 py-2 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 font-['DM_Sans']"
              >
                <span>Draft Proposal</span>
                <span className="material-symbols-outlined text-sm">lightbulb</span>
              </button>
            </div>
          </article>
        )}

        {/* Card 6: Become a Volunteer */}
        {(activeFilter === 'all' || activeFilter === 'volunteer') && (
          <article className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#90f4e9] flex items-center justify-center text-[#00504a] shrink-0">
                <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00201d] text-[10px] font-bold font-['DM_Sans']">
                  Free Onboarding
                </span>
                <h2 className="text-base font-bold text-[#002531] font-['DM_Sans'] mt-1">Become a Volunteer</h2>
              </div>
            </div>

            <p className="text-xs text-[#41484b] font-['Inter'] mt-2 leading-relaxed">
              Take our quick 15-minute coastal safety pledge, pick your operational roles (Harbor Sorting, Boat Crew, or Community Outreach), and receive your Tidekind field pass.
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#e8eff7]">
              <span className="text-xs text-[#72787c] font-['Inter']">15 min video &amp; pledge</span>
              <button
                type="button"
                onClick={() => setActiveModal('volunteer-register')}
                className="px-4 py-2 rounded-full bg-[#123b4a] hover:bg-[#002531] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 font-['DM_Sans']"
              >
                <span>Join Movement</span>
                <span className="material-symbols-outlined text-sm">how_to_reg</span>
              </button>
            </div>
          </article>
        )}

        {/* Card 7: Partner With TIDEKIND */}
        {(activeFilter === 'all' || activeFilter === 'partners' || activeFilter === 'fishers') && (
          <article className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#e2e9f1] flex items-center justify-center text-[#002531] shrink-0">
                <span className="material-symbols-outlined text-2xl">handshake</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#151c22] text-[10px] font-bold font-['DM_Sans']">
                  Institutions &amp; Co-ops
                </span>
                <h2 className="text-base font-bold text-[#002531] font-['DM_Sans'] mt-1">Partner With TIDEKIND</h2>
              </div>
            </div>

            <p className="text-xs text-[#41484b] font-['Inter'] mt-2 leading-relaxed">
              Are you a fisher cooperative (KUB), marine NGO, university research lab, or industrial nylon polymer recycler? Integrate your operations into Tidekind.
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#e8eff7]">
              <span className="text-xs text-[#72787c] font-['Inter']">Direct Response &lt; 48 hrs</span>
              <button
                type="button"
                onClick={() => setActiveModal('partner-inquiry')}
                className="px-4 py-2 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 font-['DM_Sans']"
              >
                <span>Inquire Now</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </article>
        )}
      </section>

      {/* FLOATING QUICK ACTIVITY DRAWER */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3"></div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63]">analytics</span>
                <h3 className="text-base font-bold text-[#002531] font-['DM_Sans']">My Activity Hub</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c] hover:text-[#151c22]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-2 text-left max-h-60 overflow-y-auto pr-1">
              {/* Log item 1 */}
              <div className="p-3 rounded-xl bg-[#eef4fc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006a63]"></span>
                  <div>
                    <p className="text-xs font-bold text-[#002531] font-['DM_Sans']">18.5 kg Monofilament Logged</p>
                    <p className="text-[11px] text-[#72787c] font-['Inter']">Serangan Harbor · Today 09:14</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold font-['DM_Sans']">
                  Verifying
                </span>
              </div>

              {/* Log item 2 */}
              <div className="p-3 rounded-xl bg-[#eef4fc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006a63]"></span>
                  <div>
                    <p className="text-xs font-bold text-[#002531] font-['DM_Sans']">Nusa Dua Drift Hazard Report</p>
                    <p className="text-[11px] text-[#72787c] font-['Inter']">Lat -8.8021, Long 115.234 · 2d ago</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#002531] text-[10px] font-bold font-['DM_Sans']">
                  Resolved
                </span>
              </div>
            </div>

            <div className="mt-4 pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDrawer(false);
                  setActiveModal('log-contrib');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white font-bold text-xs text-center font-['DM_Sans'] shadow-xs"
              >
                + New Contribution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: FIND A PROJECT */}
      {activeModal === 'find-project' && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-3 border-b border-[#e8eff7] pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">sailing</span>
                <h3 className="text-base font-bold text-[#002531] font-['DM_Sans']">Upcoming Field Projects</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#eef4fc] flex flex-col gap-1 border border-[#dce3eb]/50">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] font-bold text-[10px] font-['DM_Sans']">
                    Dive &amp; Snorkel
                  </span>
                  <span className="text-[10px] text-[#72787c]">July 20 · 08:30 WITA</span>
                </div>
                <h4 className="text-sm font-bold text-[#002531] font-['DM_Sans'] mt-0.5">
                  Nusa Penida Manta Point Ghost Trap Clearance
                </h4>
                <p className="text-xs text-[#41484b] font-['Inter']">
                  Assisting local dive masters to locate and tag abandoned bamboo &amp; steel cage traps.
                </p>
                <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#dce3eb]/60">
                  <span className="text-xs text-[#006a63] font-bold font-['DM_Sans']">2 berths remaining</span>
                  <button
                    type="button"
                    onClick={() => handleEnrollProject('Nusa Penida Dive Clearance')}
                    className="px-3.5 py-1.5 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold font-['DM_Sans'] shadow-xs"
                  >
                    Enroll
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#eef4fc] flex flex-col gap-1 border border-[#dce3eb]/50">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#002531] font-bold text-[10px] font-['DM_Sans']">
                    Shore Sorting
                  </span>
                  <span className="text-[10px] text-[#72787c]">July 24 · 15:00 WITA</span>
                </div>
                <h4 className="text-sm font-bold text-[#002531] font-['DM_Sans'] mt-0.5">
                  Banyuwangi Port Net Shredding Drive
                </h4>
                <p className="text-xs text-[#41484b] font-['Inter']">
                  Classifying reclaimed nylon 6 vs polypropylene ropes before industrial granulation.
                </p>
                <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#dce3eb]/60">
                  <span className="text-xs text-[#006a63] font-bold font-['DM_Sans']">8 berths open</span>
                  <button
                    type="button"
                    onClick={() => handleEnrollProject('Banyuwangi Shredding Drive')}
                    className="px-3.5 py-1.5 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold font-['DM_Sans'] shadow-xs"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG CONTRIBUTION */}
      {activeModal === 'log-contrib' && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-[#e8eff7] pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">scale</span>
                <h3 className="text-base font-bold text-[#002531] font-['DM_Sans']">Log Salvage or Mending</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                    Kilograms Net
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={contribKg}
                    onChange={(e) => setContribKg(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                    Meters Mended
                  </label>
                  <input
                    type="number"
                    value={contribMeters}
                    onChange={(e) => setContribMeters(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  Activity Location
                </label>
                <input
                  type="text"
                  required
                  value={contribLocation}
                  onChange={(e) => setContribLocation(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  Photo of Scale / Work (Required)
                </label>
                <div
                  onClick={() => onToast('Attached scale certification photo: IMG_SCALE_082.jpg')}
                  className="p-4 rounded-xl bg-[#eef4fc] border border-dashed border-[#c1c7cb] text-center flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#e2e9f1] transition-colors"
                >
                  <span className="material-symbols-outlined text-[#006a63] text-2xl">cloud_upload</span>
                  <span className="text-xs font-bold text-[#002531] font-['DM_Sans']">Upload Field Proof Photo</span>
                  <span className="text-[10px] text-[#72787c]">JPG, PNG under 15MB • GPS Tagged</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white font-bold text-xs shadow-md active:scale-95 transition-transform font-['DM_Sans']"
              >
                Submit for Hub Verifier Quorum
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INITIATIVE PROPOSAL */}
      {activeModal === 'initiative' && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-[#e8eff7] pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">lightbulb</span>
                <h3 className="text-base font-bold text-[#002531] font-['DM_Sans']">Propose Civic Initiative</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleProposalSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  Initiative Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jimbaran High School Net Mending Lab"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  Target Community / Harbor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Kelurahan / Port location"
                  value={propPort}
                  onChange={(e) => setPropPort(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  Brief Proposal (Goals &amp; Equipment)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline your goals, equipment needs, and estimated community members involved..."
                  value={propDesc}
                  onChange={(e) => setPropDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white font-bold text-xs shadow-md active:scale-95 transition-transform font-['DM_Sans']"
              >
                Submit Grant Proposal ($500 Micro-Grant)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VOLUNTEER REGISTRATION & SAFETY PLEDGE */}
      {activeModal === 'volunteer-register' && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-[#e8eff7] pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">volunteer_activism</span>
                <h3 className="text-base font-bold text-[#002531] font-['DM_Sans']">Volunteer Safety Pledge</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#eef4fc] border border-[#dce3eb]/50">
                <h4 className="text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  Tidekind Field Safety Orientation
                </h4>
                <ul className="text-[11px] text-[#41484b] space-y-1 list-disc list-inside font-['Inter']">
                  <li>Never free-dive to loosen heavy entangled ropes without a dive knife and certified buddy.</li>
                  <li>Wear protective cut-resistant gloves during onshore sorting and cutting.</li>
                  <li>Prioritize marine life release over net preservation.</li>
                </ul>
              </div>

              <form onSubmit={handleVolunteerSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="As written in KTP / Passport"
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+62 812..."
                    value={volunteerPhone}
                    onChange={(e) => setVolunteerPhone(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="pledge"
                    type="checkbox"
                    required
                    checked={volunteerPledged}
                    onChange={(e) => setVolunteerPledged(e.target.checked)}
                    className="w-4 h-4 rounded text-[#006a63] focus:ring-0"
                  />
                  <label htmlFor="pledge" className="text-xs font-semibold text-[#002531] font-['DM_Sans']">
                    I accept the field safety code &amp; protocol.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white font-bold text-xs shadow-md active:scale-95 transition-transform font-['DM_Sans']"
                >
                  Complete Registration &amp; Get Pass
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PARTNER INQUIRY */}
      {activeModal === 'partner-inquiry' && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-[#e8eff7] pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">handshake</span>
                <h3 className="text-base font-bold text-[#002531] font-['DM_Sans']">Partner Inquiry</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handlePartnerSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  Organization Type
                </label>
                <select
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none"
                >
                  <option>Fisher Cooperative (KUB)</option>
                  <option>Marine NGO / Conservation Trust</option>
                  <option>Commercial Recycler / Polymer Fabricator</option>
                  <option>Academic / Oceanographic Lab</option>
                  <option>Harbor Port Authority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Entity name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  Official Contact Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@domain.org"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white font-bold text-xs shadow-md active:scale-95 transition-transform font-['DM_Sans']"
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
