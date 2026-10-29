import React, { useState } from 'react';
import { ASSETS } from '../data/assets';
import { INITIAL_REPORTS } from '../data/mockData';
import { GearReport, ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';

interface DossiersScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string) => void;
  reportsList: GearReport[];
}

export const DossiersScreen: React.FC<DossiersScreenProps> = ({
  onNavigate,
  showToast,
  reportsList,
}) => {
  const { updateReportStatus, user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'review' | 'planned' | 'diverted'>('all');
  const [sector, setSector] = useState('all');
  const [search, setSearch] = useState('');
  const [activeDossier, setActiveDossier] = useState<GearReport | null>(null);

  const filteredReports = reportsList.filter((r) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'review'
        ? r.status === 'Under Review'
        : filter === 'planned'
        ? r.status === 'Action Planned'
        : r.status === 'Verified & Salvaged';

    const matchesSearch =
      search === '' ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.gearType.toLowerCase().includes(search.toLowerCase()) ||
      r.locationName.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-4">
      {/* Top Context Bar */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1 text-[#41484b] hover:text-[#002531] text-xs font-bold py-1 px-2.5 rounded-full hover:bg-[#e8eff7] transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Dossiers</span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#006a63] animate-pulse"></span>
          <span className="text-[11px] font-bold text-[#006a63] uppercase tracking-wider">
            Telemetry Live
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#151c22] tracking-tight">
          TIDEKIND Field Reports
        </h1>
        <p className="text-xs text-[#41484b] mt-0.5">
          Community observations, AI sensor scans, and verified maritime salvage trails.
        </p>
      </div>

      {/* Safety Protocol Banner */}
      <div className="p-3.5 rounded-3xl bg-[#eef4fc] shadow-xs flex items-start gap-3 border border-[#dce3eb]">
        <div className="w-8 h-8 rounded-full bg-[#123b4a] text-[#90f4e9] flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-lg">shield_with_heart</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[#002531]">Safety & Dispatch Protocol</span>
          <p className="text-xs text-[#41484b] leading-relaxed mt-0.5">
            Reports are verified by certified harbor coordinators. Unassisted submerged salvage is
            strictly restricted to authorized marine dive crews.
          </p>
        </div>
      </div>

      {/* Filter Carousel */}
      <div className="overflow-x-auto flex items-center gap-1.5 no-scrollbar pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-[#006a63] text-white shadow-xs'
              : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
          }`}
        >
          All Reports ({reportsList.length})
        </button>
        <button
          onClick={() => setFilter('review')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'review'
              ? 'bg-[#006a63] text-white shadow-xs'
              : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
          }`}
        >
          Awaiting Review (4)
        </button>
        <button
          onClick={() => setFilter('planned')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'planned'
              ? 'bg-[#006a63] text-white shadow-xs'
              : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
          }`}
        >
          Action Planned (3)
        </button>
        <button
          onClick={() => setFilter('diverted')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'diverted'
              ? 'bg-[#006a63] text-white shadow-xs'
              : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
          }`}
        >
          Verified / Diverted (7)
        </button>
      </div>

      {/* Search & Sector Selector */}
      <div className="space-y-2">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72787c] text-xl pointer-events-none">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white text-[#151c22] rounded-full text-xs sm:text-sm border border-[#e8eff7] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#006a63]"
            placeholder="Search gear ID, tag, or material..."
            type="search"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full h-11 pl-9 pr-8 bg-white text-[#151c22] text-xs font-semibold rounded-full border border-[#e8eff7] shadow-xs appearance-none focus:outline-none focus:ring-2 focus:ring-[#006a63]"
            >
              <option value="all">All Oceanic Sectors (Bali / Java)</option>
              <option value="sanur">Sanur Outer Reef & Jetty</option>
              <option value="benoa">Benoa Channel & Serangan Lagoon</option>
              <option value="kuta">Kuta Harbor Sector 3</option>
              <option value="nusa">Nusa Penida Marine Sanctuary</option>
            </select>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#72787c] text-lg pointer-events-none">
              location_on
            </span>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#72787c] text-lg pointer-events-none">
              expand_more
            </span>
          </div>
          <button
            onClick={() => showToast('Sector filter refreshed for Bali Coast', 'tune')}
            className="w-11 h-11 bg-white text-[#41484b] rounded-full flex items-center justify-center border border-[#e8eff7] shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">tune</span>
          </button>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4 pt-1">
        {filteredReports.map((r) => {
          const isCritical = r.hasWildlifeEntanglement;
          const isSalvaged = r.status === 'Verified & Salvaged';
          const isReview = r.status === 'Under Review';

          return (
            <article
              key={r.id}
              className="bg-white rounded-3xl shadow-sm border border-[#e8eff7] p-4 sm:p-5 flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-md"
            >
              {/* Top Meta Line */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold">
                    <span className="material-symbols-outlined text-xs">auto_awesome</span>
                    <span>{r.confidence || 'Telemetry Verified'}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#151c22]">#{r.id}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSalvaged
                      ? 'bg-[#90f4e9] text-[#00201d]'
                      : isReview
                      ? 'bg-[#e8eff7] text-[#002531]'
                      : 'bg-[#90f4e9] text-[#00504a]'
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {/* Main Visual & Summary */}
              <div className="flex gap-3 mt-0.5">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#002531]">
                  <img
                    src={r.imageUrl || ASSETS.polypropyleneGillnet}
                    alt={r.gearType}
                    className="w-full h-full object-cover"
                  />
                  {isCritical ? (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#ba1a1a] text-white text-[9px] font-bold uppercase tracking-wider">
                      Critical
                    </span>
                  ) : (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#002531]/80 backdrop-blur-xs text-white text-[9px] font-bold">
                      {r.confidence || '91.4% Match'}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-between min-w-0 flex-1">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#151c22] leading-tight truncate">
                      {r.gearType}
                    </h3>
                    <p className="text-xs text-[#41484b] mt-0.5 line-clamp-2">{r.notes}</p>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#f6faff] text-[#41484b] text-[11px] w-fit max-w-full border border-[#e8eff7]">
                    <span className="material-symbols-outlined text-xs text-[#006a63] shrink-0">
                      my_location
                    </span>
                    <span className="truncate font-mono">{r.coords}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isCritical ? 'bg-[#ba1a1a]' : 'bg-[#006a63]'
                      }`}
                    ></span>
                    <span className="text-[#41484b] truncate">
                      Threat: <strong className="text-[#151c22]">{r.threatLevel}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned Team Snippet */}
              <div className="p-2.5 rounded-2xl bg-[#eef4fc] flex items-center justify-between text-xs text-[#41484b] border border-[#dce3eb]">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-[#006a63] text-sm shrink-0">
                    sailing
                  </span>
                  <span className="truncate">{r.assignedTeam || 'Local Steward Squad Assigned'}</span>
                </div>
                <span className="text-[10px] text-[#72787c] shrink-0">{r.submittedAt}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#e8eff7]">
                <button
                  onClick={() => setActiveDossier(r)}
                  className="flex-1 h-9 px-3 rounded-full bg-[#123b4a] hover:bg-[#002531] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">fact_check</span>
                  <span>Review Dossier</span>
                </button>
                <button
                  onClick={() => {
                    showToast(`Elevated report #${r.id} for emergency harbor squad`, 'rocket_launch');
                  }}
                  className="h-9 px-3.5 rounded-full bg-[#90f4e9] hover:bg-[#73d7cd] text-[#00201d] text-xs font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">rocket_launch</span>
                  <span>Deploy Action</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ShoreScan Mesh Overview */}
      <div className="p-4 rounded-3xl bg-[#002531] text-white shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#90f4e9] text-xl">sensors</span>
            <span className="text-xs font-bold text-[#90f4e9]">ShoreScan Mesh Overview</span>
          </div>
          <span className="text-[11px] text-[#a6ccdf]">6 Scanners Active</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-2xl bg-[#123b4a] flex flex-col">
            <span className="text-lg font-bold text-[#90f4e9]">14</span>
            <span className="text-[10px] text-[#a6ccdf] mt-0.5">Total Logs</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#123b4a] flex flex-col">
            <span className="text-lg font-bold text-[#c2e8fb]">91%</span>
            <span className="text-[10px] text-[#a6ccdf] mt-0.5">Mean Conf.</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#123b4a] flex flex-col">
            <span className="text-lg font-bold text-[#ffb5a1]">38kg</span>
            <span className="text-[10px] text-[#a6ccdf] mt-0.5">Salvaged</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick Bar */}
      <div className="sticky bottom-20 z-30 pt-2">
        <div className="p-1.5 rounded-full bg-[#123b4a]/95 backdrop-blur-md shadow-xl flex items-center justify-between gap-2 border border-white/10">
          <button
            onClick={() => onNavigate('report-gear')}
            className="flex-1 h-11 px-3 rounded-full bg-[#006a63] hover:bg-[#007169] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
            <span>+ Submit Report</span>
          </button>
          <button
            onClick={() => onNavigate('shorescan')}
            className="flex-1 h-11 px-3 rounded-full bg-[#002531] hover:bg-[#123b4a] text-[#90f4e9] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">videocam</span>
            <span>Connect AI Cam</span>
          </button>
        </div>
      </div>

      {/* Dossier Detail Modal */}
      {activeDossier && (
        <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">
                  folder_managed
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#006a63] uppercase">
                    Incident Dossier
                  </span>
                  <h3 className="text-sm font-bold text-[#151c22]">#{activeDossier.id}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveDossier(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#002531]">
              <img
                src={activeDossier.imageUrl || ASSETS.polypropyleneGillnet}
                alt={activeDossier.gearType}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#151c22]">{activeDossier.gearType}</h4>
              <p className="text-xs text-[#41484b] leading-relaxed">{activeDossier.notes}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
                <span className="text-[10px] text-[#72787c] block">Sighting GPS</span>
                <span className="font-mono font-bold text-[#002531]">{activeDossier.coords}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
                <span className="text-[10px] text-[#72787c] block">Threat Assessment</span>
                <span className="font-bold text-[#ba1a1a]">{activeDossier.threatLevel}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#eef4fc] border border-[#dce3eb] text-xs">
              <span className="text-[10px] text-[#72787c] block mb-0.5">Assigned Recovery Unit</span>
              <span className="font-semibold text-[#002531]">{activeDossier.assignedTeam}</span>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={async () => {
                  const targetId = activeDossier.id;
                  setActiveDossier(null);
                  try {
                    await updateReportStatus(targetId, 'Action Planned', 'Serangan Maritime Recovery Unit');
                    showToast(`Incident #${targetId} verified! Status changed to Action Planned.`, 'task_alt');
                  } catch (err: any) {
                    showToast(err.message || 'Status update failed', 'error');
                  }
                }}
                className="flex-1 py-3 rounded-full bg-[#006a63] text-white text-xs font-bold active:scale-95 transition-all shadow-xs"
              >
                Approve Verification Quorum
              </button>
              <button
                onClick={() => setActiveDossier(null)}
                className="px-4 py-3 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-bold active:scale-95"
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
