import React, { useState } from 'react';
import { ASSETS } from '../data/assets';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProjectDetailsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string) => void;
  isRegistered: boolean;
  onToggleRegister: () => void;
}

export const ProjectDetailsScreen: React.FC<ProjectDetailsScreenProps> = ({
  onNavigate,
  showToast,
  isRegistered,
  onToggleRegister,
}) => {
  const { user, projects, joinProject, leaveProject, setAuthModalOpen } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'kuta' | 'sanur'>('kuta');

  const projectId = activeTab === 'kuta' ? 'proj_kuta_01' : 'proj_sanur_02';
  const currentProject = projects.find((p) => p.id === projectId) || projects[0];

  const isUserJoined = Boolean(user && currentProject?.participants?.some((p) => p.userId === user.id));
  const participantsList = currentProject?.participants || [];
  const currentCount = 12 + participantsList.length;
  const maxCapacity = currentProject?.maxParticipants || 15;
  const openBerths = Math.max(0, maxCapacity - currentCount);
  const pct = Math.min(100, Math.round((currentCount / maxCapacity) * 100));

  const handleToggleJoin = async () => {
    if (!user) {
      setAuthModalOpen(true);
      showToast('Please sign in or create an account to join projects', 'info');
      return;
    }

    try {
      if (isUserJoined) {
        await leaveProject(currentProject.id);
        showToast('Left project. Your berth has reopened.', 'info');
      } else {
        await joinProject(currentProject.id);
        showToast('Registered for project! Gate pass generated.', 'task_alt');
      }
      onToggleRegister();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleCopyCoords = () => {
    navigator.clipboard?.writeText?.("8°44'51.2\"S 115°12'32.6\"E");
    showToast('GPS coordinates copied: 8°44\'51.2"S 115°12\'32.6"E', 'pin_drop');
  };

  const handleShare = () => {
    showToast('Project link copied to clipboard!', 'share');
  };

  const handleCalendar = () => {
    showToast('Event saved: Kuta_Harbor_Net_Sorting.ics', 'event');
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-4">
      {/* Top Action Strip */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-[#002531] hover:text-[#006a63] text-xs font-bold py-1 px-2.5 rounded-full hover:bg-[#e8eff7] transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Projects</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#41484b] hover:text-[#002531] hover:bg-[#e8eff7] transition-colors"
            title="Share Project"
          >
            <span className="material-symbols-outlined text-lg">share</span>
          </button>
          <button
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              showToast(
                isBookmarked ? 'Removed from saved projects' : 'Project bookmarked!',
                'bookmark'
              );
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#e8eff7] transition-colors ${
              isBookmarked ? 'text-[#006a63]' : 'text-[#41484b]'
            }`}
            title="Bookmark Project"
          >
            <span className="material-symbols-outlined text-lg">
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Visual Frame with Badges */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#002531] shadow-md">
        <div className="h-60 w-full relative">
          <img
            src={activeTab === 'kuta' ? ASSETS.kutaHarborPavilion : ASSETS.sanurCoralDivers}
            alt="Harbor Net Sorting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002531]/90 via-[#002531]/30 to-transparent"></div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-[#90f4e9] text-[#00504a] text-xs font-bold shadow-sm backdrop-blur-md flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Verified Drive</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#ffdbd1] text-[#460b00] text-xs font-bold shadow-sm backdrop-blur-md flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">anchor</span>
            <span>Shore Crew Needed</span>
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-5 text-white">
          <div className="flex items-center gap-1.5 text-[#90f4e9] text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>
              {activeTab === 'kuta'
                ? 'Benoa & Kuta Port Sector 3, Bali'
                : 'Sanur Marine Sanctuary Outer Reef'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight text-white tracking-tight">
            {activeTab === 'kuta'
              ? 'Kuta Harbor Net Sorting & Drop-off'
              : 'Sanur Coral Net Extraction'}
          </h1>
        </div>
      </div>

      {/* Alternative Project Switcher Tab */}
      <div className="flex items-center gap-1 p-1 bg-[#e8eff7] rounded-full text-xs font-semibold">
        <button
          onClick={() => setActiveTab('kuta')}
          className={`flex-1 py-2 px-3 rounded-full text-center transition-all ${
            activeTab === 'kuta'
              ? 'bg-white text-[#002531] shadow-xs font-bold'
              : 'text-[#41484b] hover:text-[#002531]'
          }`}
        >
          Kuta Harbor Sorting (Active)
        </button>
        <button
          onClick={() => {
            setActiveTab('sanur');
            showToast('Switched to Sanur Coral Net Extraction briefing', 'scuba_diving');
          }}
          className={`flex-1 py-2 px-3 rounded-full text-center transition-all ${
            activeTab === 'sanur'
              ? 'bg-white text-[#002531] shadow-xs font-bold'
              : 'text-[#41484b] hover:text-[#002531]'
          }`}
        >
          Sanur Coral Net Extraction
        </button>
      </div>

      {/* Registration Capacity Section */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white shadow-sm border border-[#e8eff7] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006a63] text-xl">group</span>
            <span className="text-sm font-bold text-[#002531]">Volunteer Berths</span>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              openBerths <= 2 ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#90f4e9] text-[#00504a]'
            }`}
          >
            {openBerths} berths open
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold text-[#002531]">
            {currentCount}{' '}
            <span className="text-xs font-normal text-[#41484b]">/ {maxCapacity} Registered</span>
          </span>
          <span className="text-xs font-bold text-[#41484b]">{pct}% filled</span>
        </div>

        <div className="w-full h-3 rounded-full bg-[#dce3eb] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#006a63] transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>

      {/* Key Event Details (Date, Location) */}
      <div className="grid grid-cols-1 gap-2.5">
        <div className="p-4 rounded-3xl bg-[#eef4fc] flex items-start gap-3 border border-[#dce3eb]">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 text-[#002531] shadow-xs">
            <span className="material-symbols-outlined text-xl">calendar_today</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-[#72787c] uppercase tracking-wider">
              Date & Schedule
            </div>
            <div className="text-sm font-bold text-[#151c22]">This Saturday, 08:00 – 12:30 WITA</div>
            <p className="text-xs text-[#41484b] mt-0.5">Briefing starts promptly at 08:15 under pavilion roof.</p>
            <button
              onClick={handleCalendar}
              className="mt-2 inline-flex items-center gap-1.5 text-[#006a63] hover:text-[#002531] text-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-base">event_available</span>
              <span>Add to Calendar (.ics)</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[#eef4fc] flex items-start gap-3 border border-[#dce3eb]">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 text-[#002531] shadow-xs">
            <span className="material-symbols-outlined text-xl">pin_drop</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-[#72787c] uppercase tracking-wider">
              Muster Point
            </div>
            <div className="text-sm font-bold text-[#151c22]">Benoa & Kuta Port Sector 3</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white text-[#151c22] font-mono text-xs font-semibold border border-[#dce3eb]">
                8°44'51.2"S 115°12'32.6"E
              </span>
              <button
                onClick={handleCopyCoords}
                className="text-[#006a63] hover:text-[#002531] p-1 rounded-full hover:bg-white"
                title="Copy Coordinates"
              >
                <span className="material-symbols-outlined text-base">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Thumbnail */}
      <div className="rounded-3xl overflow-hidden shadow-sm border border-[#dce3eb] relative h-36">
        <img
          src={ASSETS.benoaMap}
          alt="Map Area"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#002531]/30 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-[#002531] shadow-md text-xs font-bold">
            <span className="material-symbols-outlined text-[#006a63] text-base">navigation</span>
            <span>Pavilion Station 3</span>
          </div>
        </div>
      </div>

      {/* Project Stewards */}
      <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#e8eff7]">
        <div className="text-[11px] font-bold text-[#72787c] uppercase tracking-wider mb-2">
          Project Stewards
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 overflow-hidden shrink-0">
            <img
              src={ASSETS.budiSantoso}
              alt="Budi Santoso"
              className="inline-block h-12 w-12 rounded-full object-cover ring-2 ring-white"
            />
            <img
              src={ASSETS.sarahJenkins}
              alt="Sarah Jenkins"
              className="inline-block h-12 w-12 rounded-full object-cover ring-2 ring-white"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-[#002531] truncate">
              Budi Santoso & Sarah Jenkins
            </div>
            <p className="text-xs text-[#41484b] truncate">
              Serangan Fishermen Cooperative & Ocean Action Bali
            </p>
          </div>
          <button
            onClick={() => showToast('Opening steward direct messaging channel...', 'chat')}
            className="w-10 h-10 rounded-full bg-[#e8eff7] hover:bg-[#90f4e9] text-[#002531] flex items-center justify-center transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safety Instruction (Domain Critical) */}
      <div className="p-4 rounded-3xl bg-[#64200d] text-white shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ffdad6]/20 flex items-center justify-center shrink-0 text-[#ffb5a1]">
            <span className="material-symbols-outlined text-xl">warning</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white mb-1 uppercase tracking-wider">
              Mandatory Safety Instruction
            </h2>
            <p className="text-xs text-[#ffb5a1] leading-relaxed">
              Do not enter the water or attempt submerged net cuts. Authorized and certified dive
              teams handle all underwater salvage. Shore volunteers handle dry sorting and spooling
              only.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion / Content Sections */}
      <div className="space-y-3">
        {/* Environmental Objective */}
        <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#e8eff7]">
          <div className="flex items-center gap-2 mb-1.5 text-[#006a63]">
            <span className="material-symbols-outlined text-lg">nature</span>
            <h3 className="text-sm font-bold text-[#002531]">Environmental Objective</h3>
          </div>
          <p className="text-xs text-[#41484b] leading-relaxed">
            Categorizing monofilament nylon gillnets and separating high-density polyethylene (HDPE)
            lines salvaged from Bali and East Java shipping lanes. Material is pre-sorted for
            regional closed-loop recycling partners, preventing microplastic degradation.
          </p>
        </div>

        {/* Participant Activities */}
        <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#e8eff7]">
          <div className="flex items-center gap-2 mb-2 text-[#006a63]">
            <span className="material-symbols-outlined text-lg">checklist</span>
            <h3 className="text-sm font-bold text-[#002531]">Participant Activities</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#151c22]">
            <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
              <span className="material-symbols-outlined text-[#006a63] text-sm">check_circle</span>
              <span>Unspooling</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
              <span className="material-symbols-outlined text-[#006a63] text-sm">check_circle</span>
              <span>Freshwater Rinse</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
              <span className="material-symbols-outlined text-[#006a63] text-sm">check_circle</span>
              <span>Weighing Batches</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
              <span className="material-symbols-outlined text-[#006a63] text-sm">check_circle</span>
              <span>Fiber Tagging</span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5 p-2 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
              <span className="material-symbols-outlined text-[#006a63] text-sm">check_circle</span>
              <span>Manual Baling for Depot Truck</span>
            </div>
          </div>
        </div>

        {/* Requirements & Amenities */}
        <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#e8eff7]">
          <div className="flex items-center gap-2 mb-2 text-[#006a63]">
            <span className="material-symbols-outlined text-lg">health_and_safety</span>
            <h3 className="text-sm font-bold text-[#002531]">Requirements & Amenities</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-[#41484b]">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#006a63] text-sm shrink-0 mt-0.5">
                verified_user
              </span>
              <span>
                Cut-resistant safety gloves and steel-toe rubber boots provided on site for all
                registered shore crew.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#006a63] text-sm shrink-0 mt-0.5">
                roofing
              </span>
              <span>Shaded open-air harbor sorting pavilion equipped with industrial fans.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#006a63] text-sm shrink-0 mt-0.5">
                water_drop
              </span>
              <span>Free chilled electrolyte hydration stations and fresh local tropical fruit provided.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* QR Check-in Pass Card (Dynamically Shown Once Registered) */}
      {isRegistered && (
        <div className="p-5 rounded-3xl bg-white shadow-md border-2 border-[#006a63] animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between border-b pb-2 border-[#e8eff7]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a63] text-xl">qr_code_scanner</span>
              <span className="text-sm font-bold text-[#002531]">Harbor Gate Check-in Pass</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-xs font-bold">
              Active
            </span>
          </div>

          <div className="mt-3 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f6faff] text-center border border-[#dce3eb]">
            <div className="p-3 bg-white rounded-2xl shadow-xs mb-2">
              <svg className="w-28 h-28" fill="currentColor" viewBox="0 0 100 100">
                <path
                  d="M0 0h30v30H0zm5 5v20h20V5zm5 5h10v10H10zM70 0h30v30H70zm5 5v20h20V5zm5 5h10v10H80zM0 70h30v30H0zm5 5v20h20V75zm5 5h10v10H10zM35 10h10v10H35zm15 0h10v10H50zm-15 25h10v10H35zm30 0h10v10H65zm15 0h10v10H80zm-45 15h10v10H35zm15 0h10v10H50zm15 0h10v10H65zm15 0h10v10H80zm-45 15h10v10H35zm30 0h10v10H65zm-15 15h10v10H50zm30 0h10v10H80z"
                  fill="#002531"
                ></path>
              </svg>
            </div>
            <div className="font-mono text-xs font-bold text-[#002531] tracking-widest">
              TK-BALI-8842-SHORE
            </div>
            <p className="text-[11px] text-[#41484b] mt-1">
              Show to Harbor Warden at Pier Gate 3 for glove size assignment
            </p>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="p-2 bg-[#eef4fc] rounded-full shadow-lg flex items-center justify-between border border-[#dce3eb]">
        <div className="pl-4">
          <div className="text-[10px] text-[#72787c] font-semibold leading-none">Role: Shore Crew</div>
          <div className="text-xs font-bold text-[#002531]">
            {currentCount} Registered • {openBerths} Spots Left
          </div>
        </div>
        <button
          onClick={handleToggleJoin}
          className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 ${
            isUserJoined
              ? 'bg-[#90f4e9] text-[#00201d]'
              : 'bg-[#006a63] hover:bg-[#123b4a] text-white'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {isUserJoined ? 'done_all' : 'volunteer_activism'}
          </span>
          <span>{isUserJoined ? 'Joined ✓ (Leave)' : 'Join Project'}</span>
        </button>
      </div>
    </div>
  );
};
