import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/assets';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';

interface ReportGearScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string) => void;
  onAddReport: (newReport: any) => void;
}

export const ReportGearScreen: React.FC<ReportGearScreenProps> = ({
  onNavigate,
  showToast,
  onAddReport,
}) => {
  const { user } = useAuth();
  const [gearType, setGearType] = useState('Net (Gillnet / Trammel)');
  const [condition, setCondition] = useState<'snagged' | 'stranded' | 'floating'>('snagged');
  const [coords, setCoords] = useState('-8.689, 115.263');
  const [landmark, setLandmark] = useState('Sanur Harbor, 420m ESE of Marine Channel Marker 4');
  const [obsDate, setObsDate] = useState('2025-05-18');
  const [obsTime, setObsTime] = useState('09:45');
  const [observerName, setObserverName] = useState(user?.name || 'Alex Steward');
  const [observerEmail, setObserverEmail] = useState(user?.email || 'alex@tidekind.org');

  useEffect(() => {
    if (user) {
      setObserverName(user.name);
      setObserverEmail(user.email);
    }
  }, [user]);
  const [isUrgentThreat, setIsUrgentThreat] = useState(true);
  const [notes, setNotes] = useState(
    'Dense mesh net wrapping approximately 6 meters across an active hard coral head. Moderate tidal surge present. Several small reef fish trapped, juvenile green sea turtle sighted feeding within 15 meters.'
  );
  const [isPhotoAttached, setIsPhotoAttached] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);

  const gearOptions = [
    'Net (Gillnet / Trammel)',
    'Trap / Crab Pot',
    'Heavy Line / Ropes',
    'Longline Monofilament',
    'Other / Unidentified Marine Debris',
  ];

  const handleDetectGPS = () => {
    showToast('Locating Marine GPS Sensor...', 'near_me');
    setTimeout(() => {
      setCoords('-8.6894, 115.2631');
      showToast('Coordinates locked: -8.6894, 115.2631 (±3m)', 'my_location');
    }, 500);
  };

  const handleSetObservedToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setObsDate(today);
    setObsTime(`${h}:${m}`);
    showToast('Set date and time to current timestamp', 'schedule');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport = {
      id: `TK-2025-${Math.floor(100 + Math.random() * 900)}`,
      gearType,
      condition:
        condition === 'snagged'
          ? 'Submerged & Snagged'
          : condition === 'stranded'
          ? 'Washed Ashore / Stranded'
          : 'Floating Debris',
      locationName: landmark,
      coords,
      date: 'Today',
      time: obsTime,
      notes,
      threatLevel: isUrgentThreat ? 'High Entanglement Hazard' : 'Moderate Hazard',
      hasWildlifeEntanglement: isUrgentThreat,
      status: 'Under Review',
      imageUrl: ASSETS.netSnagSample,
      submittedAt: 'Just now',
      confidence: 'Field Steward Report',
      assignedTeam: 'Sanur Marine Patrol',
    };
    onAddReport(newReport);
    setIsSubmittedModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-4">
      {/* Top Nav & Drawer Toggle */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => onNavigate('actions')}
          className="inline-flex items-center gap-1 text-[#41484b] hover:text-[#002531] text-xs font-bold py-1 px-2.5 rounded-full hover:bg-[#e8eff7] transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Home / Actions</span>
        </button>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 bg-[#eef4fc] hover:bg-[#e8eff7] text-[#002531] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all active:scale-95 border border-[#dce3eb]"
        >
          <span className="material-symbols-outlined text-base text-[#006a63]">inventory_2</span>
          <span>My Reports (2)</span>
        </button>
      </div>

      {/* Safety Warning Banner */}
      <div className="bg-[#ffdad6]/60 p-4 rounded-3xl shadow-xs flex items-start gap-3 border border-[#ffdad6]">
        <div className="w-8 h-8 rounded-full bg-[#ba1a1a]/15 text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-lg">warning</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider mb-0.5">
            Critical Safety Standard
          </p>
          <p className="text-xs text-[#151c22] leading-snug">
            Do not enter the water or attempt to recover submerged or hazardous gear yourself.
            Reports are safely prioritized, reviewed by coordinators, and assigned to certified
            maritime recovery divers.
          </p>
        </div>
      </div>

      {/* Main Multi-Step Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Gear Classification */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-[#e8eff7] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-bold text-[#151c22]">Type of Ghost Gear</h2>
            </div>
            <span className="text-[11px] text-[#72787c] font-medium">Required</span>
          </div>
          <p className="text-xs text-[#41484b]">
            Select the primary material or entanglement structure sighted:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {gearOptions.map((opt, i) => {
              const isSelected = gearType === opt;
              const isFull = i === 4;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setGearType(opt)}
                  className={`py-2 px-3 rounded-full text-xs font-semibold text-left flex items-center justify-between shadow-xs transition-all ${
                    isFull ? 'col-span-2' : ''
                  } ${
                    isSelected
                      ? 'bg-[#006a63] text-white'
                      : 'bg-[#e8eff7] text-[#151c22] hover:bg-[#dce3eb]'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Estimated Condition */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-[#e8eff7] space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-bold text-[#151c22]">Estimated Condition</h2>
          </div>
          <p className="text-xs text-[#41484b]">How is the gear behaving in the marine environment?</p>

          <div className="space-y-2 pt-1">
            {/* Condition 1 */}
            <div
              onClick={() => setCondition('snagged')}
              className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                condition === 'snagged'
                  ? 'bg-[#eef4fc] border-[#006a63]'
                  : 'bg-[#f6faff] border-[#e8eff7] hover:bg-[#eef4fc]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  condition === 'snagged' ? 'bg-[#006a63] text-white' : 'bg-[#dce3eb]'
                }`}
              >
                {condition === 'snagged' && (
                  <span className="material-symbols-outlined text-xs">done</span>
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-bold text-[#151c22]">Submerged & Snagged</span>
                <span className="text-[11px] text-[#41484b]">
                  Anchored to reef, bommie, or seafloor structure
                </span>
              </div>
            </div>

            {/* Condition 2 */}
            <div
              onClick={() => setCondition('stranded')}
              className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                condition === 'stranded'
                  ? 'bg-[#eef4fc] border-[#006a63]'
                  : 'bg-[#f6faff] border-[#e8eff7] hover:bg-[#eef4fc]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  condition === 'stranded' ? 'bg-[#006a63] text-white' : 'bg-[#dce3eb]'
                }`}
              >
                {condition === 'stranded' && (
                  <span className="material-symbols-outlined text-xs">done</span>
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-bold text-[#151c22]">Washed Ashore / Stranded</span>
                <span className="text-[11px] text-[#41484b]">
                  Resting in intertidal zone, rocks, or mangrove fringe
                </span>
              </div>
            </div>

            {/* Condition 3 */}
            <div
              onClick={() => setCondition('floating')}
              className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                condition === 'floating'
                  ? 'bg-[#eef4fc] border-[#006a63]'
                  : 'bg-[#f6faff] border-[#e8eff7] hover:bg-[#eef4fc]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  condition === 'floating' ? 'bg-[#006a63] text-white' : 'bg-[#dce3eb]'
                }`}
              >
                {condition === 'floating' && (
                  <span className="material-symbols-outlined text-xs">done</span>
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-bold text-[#151c22]">Floating Debris</span>
                <span className="text-[11px] text-[#41484b]">
                  Actively drifting with tidal current or surface swell
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Marine Location & GPS */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-[#e8eff7] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold text-[#151c22]">Sighting Location</h2>
            </div>
            <span className="text-xs font-bold text-[#006a63] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">my_location</span>
              <span>GPS Ready</span>
            </span>
          </div>

          {/* Map Preview with Target Area */}
          <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-[#dce3eb]">
            <img src={ASSETS.benoaMap} alt="Location" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#002531]/20 backdrop-blur-[0.5px] flex items-center justify-center">
              <div className="flex flex-col items-center animate-bounce">
                <span className="material-symbols-outlined text-3xl text-[#ba1a1a]">
                  location_on
                </span>
                <span className="px-2 py-0.5 bg-[#002531] text-white text-[10px] rounded-full font-bold shadow-xs">
                  Target Area
                </span>
              </div>
            </div>
            <div className="absolute bottom-2 inset-x-2 bg-[#123b4a]/90 backdrop-blur-md px-3 py-1 rounded-xl flex items-center justify-between text-xs text-white">
              <span className="font-semibold truncate">Sanur Reef Outer Sector</span>
              <span className="font-mono text-[#90f4e9] text-[11px] shrink-0">{coords}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDetectGPS}
              className="flex-1 h-11 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#007169] transition-all shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-base">near_me</span>
              <span>Detect Current GPS</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText?.(coords);
                showToast(`Coordinates copied: ${coords}`, 'content_copy');
              }}
              className="w-11 h-11 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] flex items-center justify-center shrink-0 shadow-xs"
              title="Copy Coordinates"
            >
              <span className="material-symbols-outlined text-base">content_copy</span>
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#72787c]">
              Harbor, Reef, or Coastal Landmark Name
            </label>
            <input
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold text-[#151c22] border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
              type="text"
            />
          </div>
        </div>

        {/* Step 4: Observation Date & Time */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-[#e8eff7] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="text-sm font-bold text-[#151c22]">Date & Time Observed</h2>
            </div>
            <button
              type="button"
              onClick={handleSetObservedToday}
              className="bg-[#90f4e9] text-[#00504a] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-xs">schedule</span>
              <span>Observed Today</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-[#72787c] block mb-1">
                Observation Date
              </label>
              <input
                value={obsDate}
                onChange={(e) => setObsDate(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold text-[#151c22] border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                type="date"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#72787c] block mb-1">Local Time</label>
              <input
                value={obsTime}
                onChange={(e) => setObsTime(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold text-[#151c22] border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                type="time"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Photo & Evidence Log */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-[#e8eff7] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h2 className="text-sm font-bold text-[#151c22]">Photo & Evidence Log</h2>
            </div>
            <span className="text-xs font-bold text-[#006a63]">
              {isPhotoAttached ? '1 File Attached' : 'No Files'}
            </span>
          </div>
          <p className="text-xs text-[#41484b]">
            Clear field imagery aids rapid dive team staging and line-cutter selection.
          </p>

          {isPhotoAttached && (
            <div className="flex items-center gap-3 p-2.5 bg-[#f6faff] rounded-2xl border border-[#dce3eb]">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative bg-[#002531]">
                <img
                  src={ASSETS.netSnagSample}
                  alt="Net Snag"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0.5 left-0.5 bg-black/80 px-1 rounded text-[8px] text-white font-mono">
                  JPG
                </span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-bold text-[#151c22] truncate">
                  net_snag_sample.jpg
                </span>
                <span className="text-[10px] text-[#72787c]">3.4 MB • High Definition GPS Exif</span>
                <span className="text-[10px] text-[#006a63] font-semibold">
                  Verified by Device Sensors
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPhotoAttached(false);
                  showToast('Photo removed', 'close');
                }}
                className="w-8 h-8 rounded-full bg-[#e8eff7] hover:bg-[#ffdad6] text-[#41484b] hover:text-[#ba1a1a] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          <div
            onClick={() => {
              setIsPhotoAttached(true);
              showToast('Camera snapshot uploaded with GPS EXIF metadata', 'add_a_photo');
            }}
            className="border-dashed border-2 border-[#c1c7cb] rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-[#f6faff]/50 hover:bg-[#eef4fc] transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#90f4e9]/40 text-[#006a63] flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
            </div>
            <span className="text-xs font-bold text-[#151c22]">
              Add more images or video snippet
            </span>
            <span className="text-[10px] text-[#72787c]">Drag file or tap to snap from camera</span>
          </div>
        </div>

        {/* Step 6: Description & Threat Assessment */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-[#e8eff7] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center">
                6
              </span>
              <h2 className="text-sm font-bold text-[#151c22]">Threat Assessment</h2>
            </div>
            <span className="text-xs font-bold text-[#ba1a1a] uppercase">Urgent Sighting</span>
          </div>

          {/* Wildlife Threat Toggle */}
          <div className="p-3.5 rounded-2xl bg-[#ffdad6]/40 flex items-start justify-between gap-3 border border-[#ffdad6]">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-xl text-[#ba1a1a] mt-0.5">
                phishing
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#151c22]">Active Entanglement Hazard</span>
                <span className="text-[11px] text-[#41484b]">
                  High risk: Active sea turtle / manta / reef damage
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={isUrgentThreat}
                onChange={(e) => setIsUrgentThreat(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#c1c7cb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ba1a1a]"></div>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#72787c]">Field Observation Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#f6faff] text-xs text-[#151c22] border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63] resize-none"
              rows={3}
            ></textarea>
          </div>
        </div>

        {/* Step 7: Submitter Details */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-[#e8eff7] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center">
                7
              </span>
              <h2 className="text-sm font-bold text-[#151c22]">Observer Details</h2>
            </div>
            <span className="text-[11px] font-semibold text-[#006a63]">Signed In</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-[#72787c] block mb-1">Contact Name</label>
              <input
                value={observerName}
                onChange={(e) => setObserverName(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold text-[#151c22] border border-[#dce3eb] focus:outline-none"
                type="text"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#72787c] block mb-1">Email</label>
              <input
                value={observerEmail}
                onChange={(e) => setObserverEmail(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold text-[#151c22] border border-[#dce3eb] focus:outline-none"
                type="email"
              />
            </div>
          </div>
          <p className="text-[10px] text-[#72787c] flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">lock</span>
            <span>Contact shared solely with regional recovery partners & dive coordinators.</span>
          </p>
        </div>

        {/* Step 8: Action Trigger */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-14 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white text-base font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-xl">send</span>
            <span>Submit Report for Review</span>
          </button>
          <p className="text-center text-xs text-[#72787c] mt-2">
            Dispatches instant dispatch beacon to Bali Coastal Operations Hub.
          </p>
        </div>
      </form>

      {/* Confirmation Modal */}
      {isSubmittedModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#90f4e9] text-[#00504a] flex items-center justify-center mb-3 shadow-inner">
              <span className="material-symbols-outlined text-4xl">task_alt</span>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-[#c2e8fb] text-[#001f29] text-xs font-mono font-bold mb-1">
              Report #TK-2025-084
            </div>
            <h3 className="text-xl font-bold text-[#151c22]">Submitted for Review</h3>
            <p className="text-xs text-[#41484b] mt-1 leading-relaxed">
              Thank you for safeguarding Bali's marine ecosystem. Your report has been dispatched
              directly to the <strong>Bali Coastal Hub Coordinator</strong>.
            </p>

            <div className="w-full bg-[#eef4fc] p-3 rounded-2xl mt-4 text-left border border-[#dce3eb]">
              <div className="flex items-center justify-between text-xs font-bold text-[#002531]">
                <span>Incident Status:</span>
                <span className="text-[#006a63] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#006a63] animate-ping"></span>
                  Under Review
                </span>
              </div>
              <p className="text-[11px] text-[#41484b] mt-0.5">
                Assigned to recovery crew: <strong>Sanur Marine Patrol</strong>
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  setIsSubmittedModalOpen(false);
                  onNavigate('dossiers');
                }}
                className="w-full h-11 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">timeline</span>
                <span>Track Case in My Reports</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSubmittedModalOpen(false);
                  showToast('Form reset for next reporting location', 'refresh');
                }}
                className="w-full h-11 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">add_location_alt</span>
                <span>Report Another Location</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Drawer: Active Reports Overview */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end justify-center p-0 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-5 shadow-2xl border-t border-[#dce3eb]">
            <div className="w-12 h-1 bg-[#dce3eb] rounded-full mx-auto mb-3"></div>
            <div className="flex items-center justify-between border-b pb-3 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">sailing</span>
                <h3 className="text-base font-bold text-[#151c22]">My Active Reports</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3 py-3 max-h-72 overflow-y-auto pr-1">
              {/* Item 1 */}
              <div className="bg-[#eef4fc] p-3.5 rounded-2xl border border-[#dce3eb]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-[#002531]">TK-2025-079</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#90f4e9] text-[#00504a]">
                    Partner Contacted
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#151c22]">
                  Nusa Dua Coral Wall - Longline
                </h4>
                <p className="text-[11px] text-[#41484b] mt-0.5">
                  Assigned to Ocean Clean Bali Diver Unit 3. Deployment boat departure scheduled
                  tomorrow morning high tide.
                </p>
              </div>

              {/* Item 2 */}
              <div className="bg-[#eef4fc] p-3.5 rounded-2xl border border-[#dce3eb]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-[#002531]">TK-2025-081</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c2e8fb] text-[#001f29]">
                    Under Review
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#151c22]">Amed Outer Dropoff - Crab Pots</h4>
                <p className="text-[11px] text-[#41484b] mt-0.5">
                  Sighting telemetry confirmed. Regional coordinator validating vessel salvage
                  clearance with harbor master.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-full mt-2 py-3 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-xs font-bold text-[#002531]"
            >
              Close Reports Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
