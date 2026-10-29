import React, { useState } from 'react';
import { ScreenId, GearReport } from '../types';
import { INITIAL_REPORTS } from '../data/mockData';
import { ASSETS } from '../data/assets';

interface ScreenDossiersProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
  reportsList: GearReport[];
}

export const ScreenDossiers: React.FC<ScreenDossiersProps> = ({
  onNavigate,
  onToast,
  reportsList = INITIAL_REPORTS,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'review' | 'planned' | 'diverted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [viewingDossier, setViewingDossier] = useState<GearReport | null>(null);

  const reports = reportsList.length > 0 ? reportsList : INITIAL_REPORTS;

  const filteredReports = reports.filter((rep) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'review' && rep.status === 'Under Review') ||
      (activeFilter === 'planned' && rep.status === 'Action Planned') ||
      (activeFilter === 'diverted' && rep.status === 'Verified & Salvaged');

    const matchesSearch =
      searchQuery === '' ||
      rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.gearType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.locationName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-28 px-4 max-w-lg mx-auto">
      {/* Top Context & Navigation Bar */}
      <div className="pt-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1 text-[#41484b] hover:text-[#006a63] text-xs font-bold font-['DM_Sans']"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Home</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006a63] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#006a63] uppercase tracking-wider font-['DM_Sans']">
              Telemetry Live
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#151c22] tracking-tight font-['DM_Sans']">
            TIDEKIND Field Reports
          </h1>
          <p className="text-xs text-[#41484b] mt-0.5 font-['Inter']">
            Community observations, AI sensor scans, and verified maritime salvage trails.
          </p>
        </div>
      </div>

      {/* Safety Advisory Card */}
      <div className="mt-3 p-3.5 rounded-2xl bg-[#eef4fc] shadow-xs flex items-start gap-3 border border-[#dce3eb]/50">
        <div className="w-8 h-8 rounded-full bg-[#123b4a] text-[#90f4e9] flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-base">shield_with_heart</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[#002531] font-['DM_Sans']">Safety &amp; Dispatch Protocol</span>
          <p className="text-[11px] text-[#41484b] leading-relaxed mt-0.5 font-['Inter']">
            Reports are verified by certified harbor coordinators. Unassisted submerged salvage is strictly restricted to
            authorized marine dive crews.
          </p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="mt-3 overflow-x-auto flex items-center gap-1.5 no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all font-['DM_Sans'] ${
            activeFilter === 'all'
              ? 'bg-[#006a63] text-white shadow-xs'
              : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
          }`}
        >
          All Reports ({reports.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('review')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all font-['DM_Sans'] ${
            activeFilter === 'review'
              ? 'bg-[#006a63] text-white shadow-xs'
              : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
          }`}
        >
          Awaiting Review (1)
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('planned')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all font-['DM_Sans'] ${
            activeFilter === 'planned'
              ? 'bg-[#006a63] text-white shadow-xs'
              : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
          }`}
        >
          Action Planned (1)
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('diverted')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all font-['DM_Sans'] ${
            activeFilter === 'diverted'
              ? 'bg-[#006a63] text-white shadow-xs'
              : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
          }`}
        >
          Verified / Diverted (1)
        </button>
      </div>

      {/* Search & Sector Filter */}
      <div className="mt-3 flex flex-col gap-2">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72787c] text-lg pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gear ID, tag, or material..."
            className="w-full h-11 pl-10 pr-4 bg-white text-[#151c22] rounded-full text-xs shadow-xs border border-[#e8eff7] focus:outline-none focus:ring-2 focus:ring-[#006a63] font-['Inter']"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full h-10 pl-8 pr-8 bg-white text-[#151c22] text-xs font-medium rounded-full shadow-xs border border-[#e8eff7] appearance-none focus:outline-none font-['DM_Sans']"
            >
              <option value="all">All Oceanic Sectors (Bali / Java)</option>
              <option value="sanur">Sanur Outer Reef &amp; Jetty</option>
              <option value="benoa">Benoa Channel &amp; Serangan Lagoon</option>
              <option value="kuta">Kuta Harbor Sector 3</option>
              <option value="nusa">Nusa Penida Marine Sanctuary</option>
            </select>
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#72787c] text-base pointer-events-none">
              location_on
            </span>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#72787c] text-base pointer-events-none">
              expand_more
            </span>
          </div>

          <button
            type="button"
            onClick={() => onToast('Sector filters reset to default')}
            className="w-10 h-10 bg-white text-[#41484b] rounded-full flex items-center justify-center shadow-xs border border-[#e8eff7] hover:text-[#006a63]"
            title="Filter Settings"
          >
            <span className="material-symbols-outlined text-lg">tune</span>
          </button>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="mt-4 flex flex-col gap-3">
        {filteredReports.map((rep) => (
          <article
            key={rep.id}
            className="bg-white rounded-2xl shadow-xs border border-[#e8eff7] p-4 flex flex-col gap-2 relative transition-all hover:shadow-sm"
          >
            {/* Top Meta Line */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold font-['DM_Sans']">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                  ShoreScan AI Detection
                </span>
                <span className="text-[11px] text-[#41484b] font-mono font-bold">#{rep.id}</span>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-['DM_Sans'] ${
                  rep.status === 'Verified & Salvaged'
                    ? 'bg-[#90f4e9] text-[#007169]'
                    : rep.status === 'Action Planned'
                    ? 'bg-[#c2e8fb] text-[#001f29]'
                    : 'bg-[#e8eff7] text-[#41484b]'
                }`}
              >
                {rep.status}
              </span>
            </div>

            {/* Main Visual & Details */}
            <div className="flex gap-3 mt-1">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#002531]">
                <img
                  src={rep.imageUrl || ASSETS.polypropyleneGillnet}
                  alt={rep.gearType}
                  className="w-full h-full object-cover"
                />
                {rep.confidence && (
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#002531]/80 backdrop-blur-xs text-white text-[9px] font-mono font-bold">
                    {rep.confidence}
                  </span>
                )}
                {rep.hasWildlifeEntanglement && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#ba1a1a] text-white text-[9px] font-bold uppercase font-['DM_Sans']">
                    Critical
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-between min-w-0 flex-1">
                <div>
                  <h3 className="text-sm font-bold text-[#151c22] font-['DM_Sans'] leading-tight truncate">
                    {rep.gearType}
                  </h3>
                  <p className="text-xs text-[#41484b] font-['Inter'] mt-0.5 line-clamp-1">{rep.notes}</p>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#eef4fc] text-[#41484b] w-fit max-w-full text-[11px] font-mono truncate">
                  <span className="material-symbols-outlined text-xs text-[#006a63]">my_location</span>
                  <span className="truncate">{rep.locationName}</span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb5a1] shrink-0"></span>
                  <span className="text-[11px] text-[#41484b] font-['Inter'] truncate">
                    Threat: <strong className="text-[#151c22] font-semibold">{rep.threatLevel}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Assignment & Deployment Sub-card */}
            <div className="p-2.5 rounded-xl bg-[#eef4fc] flex flex-col gap-0.5 text-xs text-[#41484b]">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#72787c]">memory</span>
                  {rep.assignedTeam}
                </span>
                <span className="text-[#72787c]">{rep.time}</span>
              </div>
            </div>

            {/* Interactive Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#e8eff7]">
              <button
                type="button"
                onClick={() => setViewingDossier(rep)}
                className="flex-1 h-9 px-3 rounded-full bg-[#123b4a] hover:bg-[#002531] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-base">fact_check</span>
                <span>Review Dossier</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onToast(`Action dispatched for Incident #${rep.id}! Squad notified.`, 'rocket_launch');
                }}
                className="h-9 px-3 rounded-full bg-[#90f4e9] hover:bg-[#73d7cd] text-[#00504a] text-xs font-bold flex items-center justify-center gap-1 font-['DM_Sans']"
                title="Elevate to Field Action"
              >
                <span className="material-symbols-outlined text-base">rocket_launch</span>
                <span className="hidden xs:inline">Deploy Action</span>
              </button>

              {/* Status Context Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdownId(openDropdownId === rep.id ? null : rep.id)}
                  className="w-9 h-9 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b] hover:text-[#151c22]"
                >
                  <span className="material-symbols-outlined text-base">more_vert</span>
                </button>

                {openDropdownId === rep.id && (
                  <div className="absolute right-0 bottom-11 w-44 bg-white rounded-xl shadow-lg border border-[#e8eff7] py-1 z-30 flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdownId(null);
                        onToast(`Verified Incident #${rep.id} on chain`, 'verified');
                      }}
                      className="px-3 py-2 text-left text-xs font-bold text-[#151c22] hover:bg-[#e8eff7] flex items-center gap-2 font-['DM_Sans']"
                    >
                      <span className="material-symbols-outlined text-sm text-[#006a63]">verified</span>
                      <span>Verify Observation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdownId(null);
                        onToast(`Escalated hazard alert for #${rep.id}`, 'warning');
                      }}
                      className="px-3 py-2 text-left text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2 font-['DM_Sans']"
                    >
                      <span className="material-symbols-outlined text-sm text-[#ba1a1a]">flag</span>
                      <span>Escalate Hazard</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Regional Telemetry Mini Summary Card */}
      <div className="mt-4 p-4 rounded-2xl bg-[#002531] text-white shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#90f4e9] text-xl">sensors</span>
            <span className="text-xs font-bold text-[#90f4e9] font-['DM_Sans']">ShoreScan Mesh Overview</span>
          </div>
          <span className="text-[11px] text-[#a6ccdf] font-['DM_Sans']">6 Scanners Active</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mt-1">
          <div className="p-2 rounded-xl bg-[#123b4a] flex flex-col">
            <span className="text-xl font-bold text-[#90f4e9] font-['DM_Sans'] leading-none">14</span>
            <span className="text-[10px] text-[#a6ccdf] mt-1">Total Logs</span>
          </div>
          <div className="p-2 rounded-xl bg-[#123b4a] flex flex-col">
            <span className="text-xl font-bold text-[#c2e8fb] font-['DM_Sans'] leading-none">91%</span>
            <span className="text-[10px] text-[#a6ccdf] mt-1">Mean Conf.</span>
          </div>
          <div className="p-2 rounded-xl bg-[#123b4a] flex flex-col">
            <span className="text-xl font-bold text-[#73d7cd] font-['DM_Sans'] leading-none">38kg</span>
            <span className="text-[10px] text-[#a6ccdf] mt-1">Salvaged</span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-18 left-4 right-4 z-30 max-w-md mx-auto">
        <div className="p-1.5 rounded-full bg-[#002531]/95 backdrop-blur-md shadow-xl flex items-center justify-between gap-2 border border-white/10">
          <button
            type="button"
            onClick={() => onNavigate('report-gear')}
            className="flex-1 h-11 px-3 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all font-['DM_Sans']"
          >
            <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
            <span>+ Submit Report</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('shorescan')}
            className="flex-1 h-11 px-3 rounded-full bg-[#123b4a] text-[#90f4e9] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all font-['DM_Sans']"
          >
            <span className="material-symbols-outlined text-lg">satellite_alt</span>
            <span>Connect AI Cam</span>
          </button>
        </div>
      </div>

      {/* Review Dossier Modal */}
      {viewingDossier && (
        <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl flex flex-col gap-3 animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e8eff7] pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-xl">folder_managed</span>
                <span className="font-bold text-sm text-[#002531] font-['DM_Sans']">
                  Dossier #{viewingDossier.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingDossier(null)}
                className="w-7 h-7 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-900 relative">
              <img
                src={viewingDossier.imageUrl || ASSETS.polypropyleneGillnet}
                alt={viewingDossier.gearType}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white font-mono text-[10px]">
                {viewingDossier.coords}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#006a63] uppercase font-['DM_Sans']">Optical Assessment</span>
              <h3 className="text-base font-bold text-[#151c22] font-['DM_Sans']">{viewingDossier.gearType}</h3>
              <p className="text-xs text-[#41484b] font-['Inter'] leading-relaxed">{viewingDossier.notes}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#eef4fc] space-y-1 text-xs text-[#41484b]">
              <div className="flex justify-between">
                <span>Threat Status:</span>
                <span className="font-bold text-[#ba1a1a]">{viewingDossier.threatLevel}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-semibold text-[#151c22]">{viewingDossier.locationName}</span>
              </div>
              <div className="flex justify-between">
                <span>Salvage Status:</span>
                <span className="font-bold text-[#006a63]">{viewingDossier.status}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#e8eff7]">
              <button
                type="button"
                onClick={() => {
                  setViewingDossier(null);
                  onToast(`Incident #${viewingDossier.id} marked as authorized for vessel deployment`);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#006a63] text-white text-xs font-bold font-['DM_Sans']"
              >
                Authorize Salvage
              </button>
              <button
                type="button"
                onClick={() => setViewingDossier(null)}
                className="flex-1 py-2.5 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-bold font-['DM_Sans']"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
