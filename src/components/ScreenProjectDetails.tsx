import React, { useState } from 'react';
import { ScreenId } from '../types';
import { ASSETS } from '../data/assets';

interface ScreenProjectDetailsProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
  isRegistered: boolean;
  onToggleRegister: () => void;
}

export const ScreenProjectDetails: React.FC<ScreenProjectDetailsProps> = ({
  onNavigate,
  onToast,
  isRegistered,
  onToggleRegister,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'kuta' | 'sanur'>('kuta');

  const baseCount = 12;
  const maxCapacity = 15;
  const currentCount = isRegistered ? baseCount + 1 : baseCount;
  const openBerths = maxCapacity - currentCount;
  const pct = Math.round((currentCount / maxCapacity) * 100);

  const handleCopyCoords = () => {
    navigator.clipboard?.writeText("8°44'51.2\"S 115°12'32.6\"E");
    onToast("Coordinates copied: 8°44'51.2\"S 115°12'32.6\"E", 'pin_drop');
  };

  const handleShare = () => {
    onToast('Project invitation link copied to clipboard!', 'share');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onToast(isBookmarked ? 'Removed from bookmarks' : 'Project bookmarked!', 'bookmark');
  };

  const handleCalendar = () => {
    onToast('Added Kuta_Harbor_Net_Sorting.ics to your calendar!', 'event_available');
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 max-w-lg mx-auto">
      {/* Top Navigation & Action Strip */}
      <div className="flex items-center justify-between py-2 mb-1">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1 text-[#002531] hover:text-[#006a63] transition-colors text-xs font-bold py-1 px-2 rounded-full hover:bg-[#e8eff7] font-['DM_Sans']"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Projects</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#41484b] hover:text-[#002531] hover:bg-[#e8eff7] transition-colors active:scale-95"
            aria-label="Share project"
          >
            <span className="material-symbols-outlined text-xl">share</span>
          </button>
          <button
            type="button"
            onClick={handleBookmark}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              isBookmarked ? 'text-[#006a63] bg-[#90f4e9]/40' : 'text-[#41484b] hover:bg-[#e8eff7]'
            }`}
            aria-label="Bookmark project"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
            >
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Visual Frame with Badges */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#123b4a] shadow-sm">
        <div
          className="h-60 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${ASSETS.kutaHarborPavilion})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#002531]/90 via-[#002531]/30 to-transparent"></div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#90f4e9] text-[#00504a] shadow-xs backdrop-blur-md font-['DM_Sans']">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="text-[11px] font-bold">Verified Drive</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdbd1] text-[#7a2f1b] shadow-xs backdrop-blur-md font-['DM_Sans']">
            <span className="material-symbols-outlined text-xs">anchor</span>
            <span className="text-[11px] font-bold">Shore Crew Needed</span>
          </div>
        </div>

        {/* Title Content */}
        <div className="absolute bottom-0 inset-x-0 p-4 text-white">
          <div className="flex items-center gap-1 text-[#90f4e9] text-xs font-semibold mb-1 font-['DM_Sans']">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>Benoa &amp; Kuta Port Sector 3, Bali</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight text-white font-['DM_Sans']">
            Kuta Harbor Net Sorting &amp; Drop-off
          </h1>
        </div>
      </div>

      {/* Alternative Project Switcher Tab */}
      <div className="flex items-center gap-1 mt-2.5 p-1 bg-[#e8eff7] rounded-full text-xs font-bold font-['DM_Sans']">
        <button
          type="button"
          onClick={() => setActiveTab('kuta')}
          className={`flex-1 py-1.5 px-3 rounded-full text-center transition-all ${
            activeTab === 'kuta' ? 'bg-white text-[#002531] shadow-xs' : 'text-[#41484b] hover:text-[#002531]'
          }`}
        >
          Kuta Harbor Sorting (Active)
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('sanur');
            onToast('Switched to Sanur Coral Net Extraction brief', 'sailing');
          }}
          className={`flex-1 py-1.5 px-3 rounded-full text-center transition-all ${
            activeTab === 'sanur' ? 'bg-white text-[#002531] shadow-xs' : 'text-[#41484b] hover:text-[#002531]'
          }`}
        >
          Sanur Coral Net Extraction
        </button>
      </div>

      {/* Registration Capacity & Progress Section */}
      <div className="mt-3 p-4 rounded-2xl bg-white shadow-xs border border-[#e8eff7] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006a63] text-lg">group</span>
            <span className="text-xs font-bold text-[#002531] font-['DM_Sans']">Volunteer Berths</span>
          </div>
          <span
            className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold font-['DM_Sans'] ${
              isRegistered ? 'bg-[#90f4e9] text-[#00504a]' : 'bg-[#e8eff7] text-[#002531]'
            }`}
          >
            {openBerths} berths open
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-base font-bold text-[#002531] font-['DM_Sans']">
            {currentCount}{' '}
            <span className="text-xs font-normal text-[#41484b] font-['Inter']">/ {maxCapacity} Registered</span>
          </span>
          <span className="text-xs text-[#41484b] font-semibold font-['DM_Sans']">{pct}% filled</span>
        </div>

        {/* Progress Meter Bar */}
        <div className="w-full h-2.5 rounded-full bg-[#dce3eb] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#006a63] transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>

      {/* QR Check-in Pass Card (Revealed When Joined) */}
      {isRegistered && (
        <div className="mt-3 p-4 rounded-2xl bg-[#eef4fc] border-2 border-[#90f4e9] shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-[#dce3eb] pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a63] text-xl">qr_code_scanner</span>
              <span className="text-sm font-bold text-[#002531] font-['DM_Sans']">Harbor Gate Check-in Pass</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold font-['DM_Sans']">
              Active Verified
            </span>
          </div>

          <div className="mt-3 flex flex-col items-center justify-center p-3 rounded-xl bg-white text-center">
            {/* SVG Crisp QR Code */}
            <div className="p-2 bg-white rounded-xl shadow-xs mb-2">
              <svg className="w-28 h-28" fill="currentColor" viewBox="0 0 100 100">
                <path
                  d="M0 0h30v30H0zm5 5v20h20V5zm5 5h10v10H10zM70 0h30v30H70zm5 5v20h20V5zm5 5h10v10H80zM0 70h30v30H0zm5 5v20h20V75zm5 5h10v10H10zM35 10h10v10H35zm15 0h10v10H50zm-15 25h10v10H35zm30 0h10v10H65zm15 0h10v10H80zm-45 15h10v10H35zm15 0h10v10H50zm15 0h10v10H65zm15 0h10v10H80zm-45 15h10v10H35zm30 0h10v10H65zm-15 15h10v10H50zm30 0h10v10H80z"
                  fill="#002531"
                />
              </svg>
            </div>
            <div className="font-mono text-xs font-bold text-[#002531] tracking-wider">TK-BALI-8842-SHORE</div>
            <p className="text-[11px] text-[#41484b] mt-0.5 font-['Inter']">
              Show to Harbor Warden at Pier Gate 3 for glove and boot assignment
            </p>
          </div>
        </div>
      )}

      {/* Key Event Details */}
      <div className="grid grid-cols-1 gap-2 mt-3">
        <div className="p-3.5 rounded-2xl bg-[#eef4fc] flex items-start gap-3 border border-[#dce3eb]/50">
          <div className="w-9 h-9 rounded-full bg-[#dce3eb] flex items-center justify-center shrink-0 text-[#002531]">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-[#41484b] uppercase tracking-wider font-['DM_Sans']">
              Date &amp; Schedule
            </div>
            <div className="text-sm font-bold text-[#151c22] font-['DM_Sans'] mt-0.5">
              This Saturday, 08:00 – 12:30 WITA
            </div>
            <p className="text-xs text-[#41484b] mt-0.5 font-['Inter']">Briefing starts promptly at 08:15 under pavilion roof.</p>
            <button
              type="button"
              onClick={handleCalendar}
              className="mt-1.5 inline-flex items-center gap-1 text-[#006a63] hover:text-[#002531] text-xs font-bold font-['DM_Sans']"
            >
              <span className="material-symbols-outlined text-sm">event_available</span>
              <span>Add to Calendar (.ics)</span>
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#eef4fc] flex items-start gap-3 border border-[#dce3eb]/50">
          <div className="w-9 h-9 rounded-full bg-[#dce3eb] flex items-center justify-center shrink-0 text-[#002531]">
            <span className="material-symbols-outlined text-lg">pin_drop</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-[#41484b] uppercase tracking-wider font-['DM_Sans']">
              Muster Point
            </div>
            <div className="text-sm font-bold text-[#151c22] font-['DM_Sans'] mt-0.5">
              Benoa &amp; Kuta Port Sector 3
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white text-[#151c22] font-mono text-[11px] font-medium tracking-wide border border-[#dce3eb]">
                8°44'51.2"S 115°12'32.6"E
              </span>
              <button
                type="button"
                onClick={handleCopyCoords}
                className="text-[#006a63] hover:text-[#002531] p-1 rounded-full hover:bg-white transition-colors"
                title="Copy Coordinates"
              >
                <span className="material-symbols-outlined text-base">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Thumbnail Placeholder */}
      <div className="mt-2.5 rounded-2xl overflow-hidden shadow-xs border border-[#dce3eb]">
        <div
          className="w-full h-32 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${ASSETS.benoaMap})` }}
        >
          <div className="absolute inset-0 bg-[#002531]/20 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#002531] shadow-md text-xs font-bold font-['DM_Sans']">
              <span className="material-symbols-outlined text-[#006a63] text-base">navigation</span>
              <span>Pavilion Station 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Organizer Profile Card */}
      <div className="mt-3 p-3.5 rounded-2xl bg-white shadow-xs border border-[#e8eff7]">
        <div className="text-[10px] font-bold text-[#41484b] uppercase tracking-wider mb-2 font-['DM_Sans']">
          Project Stewards
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 overflow-hidden shrink-0">
            <img
              src={ASSETS.budiSantoso}
              alt="Budi Santoso"
              className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-white"
            />
            <img
              src={ASSETS.sarahJenkins}
              alt="Sarah Jenkins"
              className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-white"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[#002531] font-['DM_Sans'] truncate">
              Budi Santoso &amp; Sarah Jenkins
            </div>
            <p className="text-[11px] text-[#41484b] font-['Inter'] truncate">
              Serangan Fishermen Cooperative &amp; Ocean Action Bali
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToast('Direct message dispatch to Harbor Stewards...')}
            className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#002531] hover:bg-[#90f4e9] transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-base">chat</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safety Instruction Warning */}
      <div className="mt-3 p-3.5 rounded-2xl bg-[#64200d] text-white shadow-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[#ffb5a1]">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xs font-bold text-white mb-0.5 font-['DM_Sans']">
              Mandatory Safety Instruction
            </h2>
            <p className="text-[11px] text-[#ffdbd1] leading-relaxed font-['Inter']">
              Do not enter the water or attempt submerged net cuts. Authorized and certified dive teams handle all
              underwater salvage. Shore volunteers handle dry sorting and spooling only.
            </p>
          </div>
        </div>
      </div>

      {/* Environmental Objective & Participant Activities */}
      <div className="mt-3 flex flex-col gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#e8eff7]">
          <div className="flex items-center gap-1.5 mb-1 text-[#006a63]">
            <span className="material-symbols-outlined text-lg">nature</span>
            <h3 className="text-xs font-bold text-[#002531] font-['DM_Sans']">Environmental Objective</h3>
          </div>
          <p className="text-xs text-[#151c22] leading-relaxed font-['Inter']">
            Categorizing monofilament nylon gillnets and separating high-density polyethylene (HDPE) lines salvaged from
            Bali and East Java shipping lanes. Material is pre-sorted for regional closed-loop recycling partners,
            preventing microplastic degradation.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#e8eff7]">
          <div className="flex items-center gap-1.5 mb-2 text-[#006a63]">
            <span className="material-symbols-outlined text-lg">checklist</span>
            <h3 className="text-xs font-bold text-[#002531] font-['DM_Sans']">Participant Activities</h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-[#151c22] font-['DM_Sans'] font-semibold">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#eef4fc]">
              <span className="material-symbols-outlined text-[#006a63] text-base">check_circle</span>
              <span>Unspooling</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#eef4fc]">
              <span className="material-symbols-outlined text-[#006a63] text-base">check_circle</span>
              <span>Freshwater Rinse</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#eef4fc]">
              <span className="material-symbols-outlined text-[#006a63] text-base">check_circle</span>
              <span>Weighing Batches</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#eef4fc]">
              <span className="material-symbols-outlined text-[#006a63] text-base">check_circle</span>
              <span>Fiber Tagging</span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5 p-2 rounded-xl bg-[#eef4fc]">
              <span className="material-symbols-outlined text-[#006a63] text-base">check_circle</span>
              <span>Manual Baling for Depot Truck</span>
            </div>
          </div>
        </div>

        {/* Requirements & Amenities */}
        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#e8eff7]">
          <div className="flex items-center gap-1.5 mb-2 text-[#006a63]">
            <span className="material-symbols-outlined text-lg">health_and_safety</span>
            <h3 className="text-xs font-bold text-[#002531] font-['DM_Sans']">Requirements &amp; Amenities</h3>
          </div>
          <ul className="flex flex-col gap-1.5 text-xs text-[#41484b] font-['Inter']">
            <li className="flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[#006a63] text-base shrink-0 mt-0.5">verified_user</span>
              <span>Cut-resistant safety gloves and steel-toe rubber boots provided on site for all registered shore crew.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[#006a63] text-base shrink-0 mt-0.5">roofing</span>
              <span>Shaded open-air harbor sorting pavilion equipped with industrial fans.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[#006a63] text-base shrink-0 mt-0.5">water_drop</span>
              <span>Free chilled electrolyte hydration stations and fresh local tropical fruit provided.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Sticky-style Registration Action Dock */}
      <div className="mt-4 p-2.5 bg-[#e2e9f1] rounded-full shadow-lg flex items-center gap-2">
        <div className="flex-1 pl-3">
          <div className="text-[10px] text-[#41484b] leading-none font-['DM_Sans'] font-medium">Role: Shore Sorting</div>
          <div className="text-xs font-bold text-[#002531] font-['DM_Sans'] mt-0.5">
            {currentCount} Registered • {openBerths} Spots Left
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onToggleRegister();
            onToast(
              isRegistered
                ? 'Registration cancelled. Berth reopened.'
                : 'Welcome aboard! Check-in pass generated.',
              isRegistered ? 'cancel' : 'task_alt'
            );
          }}
          className={`px-6 py-2.5 rounded-full font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 font-['DM_Sans'] ${
            isRegistered
              ? 'bg-[#90f4e9] text-[#00504a]'
              : 'bg-[#006a63] hover:bg-[#00504a] text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {isRegistered ? 'done_all' : 'volunteer_activism'}
          </span>
          <span>{isRegistered ? 'Joined ✓' : 'Join Project'}</span>
        </button>
      </div>
    </div>
  );
};
