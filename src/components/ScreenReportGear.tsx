import React, { useState } from 'react';
import { ScreenId } from '../types';
import { ASSETS } from '../data/assets';

interface ScreenReportGearProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const ScreenReportGear: React.FC<ScreenReportGearProps> = ({ onNavigate, onToast }) => {
  const [selectedGearType, setSelectedGearType] = useState('Net (Gillnet / Trammel)');
  const [condition, setCondition] = useState<'snagged' | 'stranded' | 'floating'>('snagged');
  const [gpsCoords, setGpsCoords] = useState('-8.689, 115.263');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [obsDate, setObsDate] = useState('2025-05-18');
  const [obsTime, setObsTime] = useState('09:45');
  const [threatToggle, setThreatToggle] = useState(true);
  const [hasPhoto, setHasPhoto] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const gearTypes = [
    'Net (Gillnet / Trammel)',
    'Trap / Crab Pot',
    'Heavy Line / Poly Ropes',
    'Longline Monofilament',
    'Other / Unidentified Marine Debris',
  ];

  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    setTimeout(() => {
      setIsDetectingGps(false);
      setGpsCoords('-8.7052, 115.2625 (±3m)');
      onToast('GPS coordinates locked to device marine sensor!', 'my_location');
    }, 700);
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    setObsDate(today);
    setObsTime(`${hours}:${mins}`);
    onToast('Set observation timestamp to current time');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
    onToast('Dispatched instant emergency beacon to Bali Coastal Operations Hub!', 'radar');
  };

  return (
    <div className="flex flex-col w-full px-4 pb-24 max-w-lg mx-auto">
      {/* Top Navigation & Reports Counter Bar */}
      <div className="flex items-center justify-between py-2">
        <button
          type="button"
          onClick={() => onNavigate('actions')}
          className="inline-flex items-center gap-1 text-[#41484b] hover:text-[#002531] text-xs font-bold font-['DM_Sans']"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Home / Actions</span>
        </button>

        <button
          type="button"
          onClick={() => setShowDrawer(true)}
          className="inline-flex items-center gap-1.5 bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] px-3.5 py-1.5 rounded-full shadow-xs text-xs font-bold font-['DM_Sans'] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base text-[#006a63]">inventory_2</span>
          <span>My Reports (2)</span>
        </button>
      </div>

      {/* Safety Warning Banner */}
      <div className="mt-2 bg-[#ffdad6]/60 p-4 rounded-2xl shadow-xs flex items-start gap-3 border border-[#ffdad6]">
        <div className="w-8 h-8 rounded-full bg-[#ba1a1a]/15 text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider mb-0.5 font-['DM_Sans']">
            Critical Safety Standard
          </p>
          <p className="text-xs text-[#151c22] leading-relaxed font-['Inter']">
            Do not enter the water or attempt to recover submerged or hazardous gear yourself. Reports are safely
            prioritized, reviewed by coordinators, and assigned to certified maritime recovery divers.
          </p>
        </div>
      </div>

      {/* Main Multi-Step Form */}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        {/* Step 1: Gear Classification */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8eff7] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center font-['DM_Sans']">
                1
              </span>
              <h2 className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Type of Ghost Gear</h2>
            </div>
            <span className="text-[11px] text-[#41484b] font-medium font-['DM_Sans']">Required</span>
          </div>

          <p className="text-xs text-[#41484b] font-['Inter']">
            Select the primary material or entanglement structure sighted:
          </p>

          <div className="grid grid-cols-2 gap-2 mt-1">
            {gearTypes.map((type, idx) => {
              const active = selectedGearType === type;
              const isFull = idx === 4;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedGearType(type)}
                  className={`py-2 px-3 rounded-full text-xs font-bold text-left flex items-center justify-between shadow-xs transition-all font-['DM_Sans'] ${
                    isFull ? 'col-span-2' : ''
                  } ${
                    active
                      ? 'bg-[#006a63] text-white'
                      : 'bg-[#eef4fc] text-[#151c22] hover:bg-[#e8eff7]'
                  }`}
                >
                  <span className="truncate">{type}</span>
                  {active && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Estimated Condition */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8eff7] flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center font-['DM_Sans']">
              2
            </span>
            <h2 className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Estimated Condition</h2>
          </div>

          <p className="text-xs text-[#41484b] font-['Inter']">How is the gear behaving in the marine environment?</p>

          <div className="flex flex-col gap-2 mt-1">
            <label
              onClick={() => setCondition('snagged')}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                condition === 'snagged'
                  ? 'bg-[#eef4fc] border-[#006a63]'
                  : 'bg-white border-[#e8eff7] hover:bg-[#f6faff]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  condition === 'snagged' ? 'bg-[#006a63]' : 'bg-[#dce3eb]'
                }`}
              >
                {condition === 'snagged' && <span className="material-symbols-outlined text-xs">done</span>}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Submerged &amp; Snagged</span>
                <span className="text-[11px] text-[#41484b] font-['Inter']">
                  Anchored to reef, bommie, or seafloor structure
                </span>
              </div>
            </label>

            <label
              onClick={() => setCondition('stranded')}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                condition === 'stranded'
                  ? 'bg-[#eef4fc] border-[#006a63]'
                  : 'bg-white border-[#e8eff7] hover:bg-[#f6faff]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  condition === 'stranded' ? 'bg-[#006a63]' : 'bg-[#dce3eb]'
                }`}
              >
                {condition === 'stranded' && <span className="material-symbols-outlined text-xs">done</span>}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Washed Ashore / Stranded</span>
                <span className="text-[11px] text-[#41484b] font-['Inter']">
                  Resting in intertidal zone, rocks, or mangrove fringe
                </span>
              </div>
            </label>

            <label
              onClick={() => setCondition('floating')}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                condition === 'floating'
                  ? 'bg-[#eef4fc] border-[#006a63]'
                  : 'bg-white border-[#e8eff7] hover:bg-[#f6faff]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  condition === 'floating' ? 'bg-[#006a63]' : 'bg-[#dce3eb]'
                }`}
              >
                {condition === 'floating' && <span className="material-symbols-outlined text-xs">done</span>}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Floating Debris</span>
                <span className="text-[11px] text-[#41484b] font-['Inter']">
                  Actively drifting with tidal current or surface swell
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Step 3: Marine Location & GPS */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8eff7] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center font-['DM_Sans']">
                3
              </span>
              <h2 className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Sighting Location</h2>
            </div>
            <span className="text-xs font-bold text-[#006a63] flex items-center gap-0.5 font-['DM_Sans']">
              <span className="material-symbols-outlined text-sm">my_location</span> GPS Ready
            </span>
          </div>

          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#123b4a]">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${ASSETS.benoaMap})` }}
            ></div>
            <div className="absolute inset-0 bg-[#002531]/30 flex items-center justify-center">
              <div className="flex flex-col items-center animate-bounce">
                <span
                  className="material-symbols-outlined text-4xl text-[#ba1a1a] drop-shadow-md"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
                <span className="px-2 py-0.5 bg-[#002531] text-white text-[10px] rounded-full shadow-xs font-['DM_Sans'] font-bold">
                  Target Area
                </span>
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 bg-[#123b4a]/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between text-white text-xs">
              <span className="font-semibold truncate font-['DM_Sans']">Sanur Reef Outer Sector</span>
              <span className="font-mono text-[11px] text-[#90f4e9] shrink-0 font-bold">{gpsCoords}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetectingGps}
              className="flex-1 h-11 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all font-['DM_Sans']"
            >
              <span className={`material-symbols-outlined text-lg ${isDetectingGps ? 'animate-spin' : ''}`}>
                {isDetectingGps ? 'refresh' : 'near_me'}
              </span>
              <span>{isDetectingGps ? 'Locating Marine Sensor...' : 'Detect Current GPS'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(gpsCoords);
                onToast(`Coordinates copied: ${gpsCoords}`);
              }}
              title="Copy Coordinates"
              className="w-11 h-11 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] flex items-center justify-center shrink-0 active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-base">content_copy</span>
            </button>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <label htmlFor="harborInput" className="text-[11px] font-semibold text-[#41484b] font-['DM_Sans']">
              Harbor, Reef, or Coastal Landmark Name
            </label>
            <input
              id="harborInput"
              type="text"
              defaultValue="Sanur Harbor, 420m ESE of Marine Channel Marker 4"
              className="h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1] transition-all font-['Inter']"
            />
          </div>
        </div>

        {/* Step 4: Date & Time Observed */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8eff7] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center font-['DM_Sans']">
                4
              </span>
              <h2 className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Date &amp; Time Observed</h2>
            </div>
            <button
              type="button"
              onClick={handleSetToday}
              className="bg-[#90f4e9] text-[#00504a] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all font-['DM_Sans']"
            >
              <span className="material-symbols-outlined text-xs">schedule</span>
              <span>Observed Today</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex flex-col gap-1">
              <label htmlFor="obsDate" className="text-[11px] font-semibold text-[#41484b] font-['DM_Sans']">
                Observation Date
              </label>
              <input
                id="obsDate"
                type="date"
                value={obsDate}
                onChange={(e) => setObsDate(e.target.value)}
                className="h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1] font-['Inter']"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="obsTime" className="text-[11px] font-semibold text-[#41484b] font-['DM_Sans']">
                Local Time
              </label>
              <input
                id="obsTime"
                type="time"
                value={obsTime}
                onChange={(e) => setObsTime(e.target.value)}
                className="h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1] font-['Inter']"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Photo & Evidence Log */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8eff7] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center font-['DM_Sans']">
                5
              </span>
              <h2 className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Photo &amp; Evidence Log</h2>
            </div>
            <span className="text-xs font-bold text-[#006a63] font-['DM_Sans']">
              {hasPhoto ? '1 File Attached' : 'No Files'}
            </span>
          </div>

          <p className="text-xs text-[#41484b] font-['Inter']">
            Clear field imagery aids rapid dive team staging and line-cutter selection.
          </p>

          {hasPhoto && (
            <div className="flex items-center gap-3 p-2.5 bg-[#eef4fc] rounded-xl border border-[#dce3eb]/50">
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                <img src={ASSETS.netSnagSample} alt="Ghost net sample" className="w-full h-full object-cover" />
                <div className="absolute bottom-0.5 left-0.5 bg-[#002531]/80 rounded px-1 text-[8px] text-white font-mono">
                  JPG
                </div>
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-bold text-[#151c22] font-['DM_Sans'] truncate">net_snag_sample.jpg</span>
                <span className="text-[11px] text-[#41484b] font-['Inter']">3.4 MB • High Definition GPS Exif</span>
                <span className="text-[10px] text-[#006a63] font-semibold">Verified by Device Sensors</span>
              </div>

              <button
                type="button"
                onClick={() => setHasPhoto(false)}
                className="w-8 h-8 rounded-full bg-[#dce3eb] text-[#41484b] hover:text-[#ba1a1a] flex items-center justify-center transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          <div
            onClick={() => {
              setHasPhoto(true);
              onToast('Added high-definition photo: IMG_REEF_NET_902.jpg');
            }}
            className="border-dashed border-2 border-[#c1c7cb] rounded-xl p-3 flex flex-col items-center justify-center text-center bg-[#eef4fc]/40 hover:bg-[#eef4fc] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#006a63] text-2xl mb-1">add_photo_alternate</span>
            <span className="text-xs font-bold text-[#002531] font-['DM_Sans']">
              Add more images or video snippet
            </span>
            <span className="text-[10px] text-[#41484b]">Drag file or tap to snap from marine camera</span>
          </div>
        </div>

        {/* Step 6: Description & Wildlife Threat Level */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8eff7] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center font-['DM_Sans']">
                6
              </span>
              <h2 className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Threat Assessment</h2>
            </div>
            <span className="text-[10px] font-bold text-[#ba1a1a] uppercase bg-[#ffdad6] px-2 py-0.5 rounded-full font-['DM_Sans']">
              Urgent Sighting
            </span>
          </div>

          {/* Wildlife Threat Toggle Card */}
          <div className="p-3 rounded-xl bg-[#ffdad6]/40 border border-[#ffdad6] flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span
                className="material-symbols-outlined text-2xl text-[#ba1a1a] mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                phishing
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">
                  Active Entanglement Hazard
                </span>
                <span className="text-[11px] text-[#41484b] font-['Inter']">
                  High risk: Active sea turtle / manta / reef damage
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setThreatToggle(!threatToggle)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                threatToggle ? 'bg-[#ba1a1a]' : 'bg-[#c1c7cb]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  threatToggle ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <label htmlFor="gearNotes" className="text-[11px] font-semibold text-[#41484b] font-['DM_Sans']">
              Field Observation Notes
            </label>
            <textarea
              id="gearNotes"
              rows={3}
              defaultValue="Dense mesh net wrapping approximately 6 meters across an active hard coral head. Moderate tidal surge present. Several small reef fish trapped, juvenile green sea turtle sighted feeding within 15 meters."
              className="p-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1] transition-all resize-none font-['Inter'] leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* Step 7: Submitter / Observer Details */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8eff7] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#006a63] text-white text-xs font-bold flex items-center justify-center font-['DM_Sans']">
                7
              </span>
              <h2 className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Observer Details</h2>
            </div>
            <span className="text-xs text-[#006a63] font-semibold font-['DM_Sans']">Signed In</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#41484b] font-['DM_Sans']">Contact Name</label>
              <input
                type="text"
                defaultValue="Alex Steward"
                className="h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs font-medium focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#41484b] font-['DM_Sans']">Email (Updates)</label>
              <input
                type="email"
                defaultValue="alex@tidekind.org"
                className="h-11 px-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <p className="text-[11px] text-[#72787c] flex items-center gap-1 pt-1 font-['Inter']">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Contact shared solely with regional recovery partners &amp; dive coordinators.</span>
          </p>
        </div>

        {/* Step 8: Action Trigger */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-14 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all font-['DM_Sans']"
          >
            <span className="material-symbols-outlined text-2xl">send</span>
            <span>Submit Report for Review</span>
          </button>
          <p className="text-center text-xs text-[#41484b] mt-2 font-['Inter']">
            Dispatches instant dispatch beacon to Bali Coastal Operations Hub.
          </p>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#90f4e9] text-[#00504a] flex items-center justify-center mb-3 shadow-inner">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                task_alt
              </span>
            </div>

            <div className="px-3 py-1 rounded-full bg-[#c2e8fb] text-[#001f29] text-xs font-mono font-bold mb-1">
              Report #TK-2025-084
            </div>

            <h3 className="text-xl font-bold text-[#151c22] font-['DM_Sans']">Submitted for Review</h3>
            <p className="text-xs text-[#41484b] mt-1.5 leading-relaxed font-['Inter']">
              Thank you for safeguarding Bali's marine ecosystem. Your report has been dispatched directly to the{' '}
              <strong className="text-[#151c22]">Bali Coastal Hub Coordinator</strong>.
            </p>

            <div className="w-full bg-[#eef4fc] p-3 rounded-xl mt-4 text-left flex flex-col gap-1 border border-[#dce3eb]/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Incident Status:</span>
                <span className="text-xs text-[#006a63] font-bold flex items-center gap-1 font-['DM_Sans']">
                  <span className="w-2 h-2 rounded-full bg-[#006a63] animate-ping"></span> Under Review
                </span>
              </div>
              <p className="text-[11px] text-[#41484b] font-['Inter']">
                Assigned to certified recovery diver group: <span className="font-bold">Sanur Marine Patrol</span>
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmation(false);
                  onNavigate('dossiers');
                }}
                className="w-full h-11 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-base">timeline</span>
                <span>Track Case in My Reports</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowConfirmation(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full h-11 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-base">add_location_alt</span>
                <span>Report Another Location</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Reports Slide-out Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-[#002531]/40 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="p-4 border-b border-[#e8eff7] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">sailing</span>
                <h3 className="text-base font-bold text-[#002531] font-['DM_Sans']">My Active Reports</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              {/* Item 1 */}
              <div className="bg-[#eef4fc] p-3.5 rounded-2xl border border-[#dce3eb]/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#41484b] font-mono font-bold">TK-2025-079</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#90f4e9] text-[#00504a] flex items-center gap-1 font-bold font-['DM_Sans']">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006a63]"></span> Partner Contacted
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#002531] font-['DM_Sans']">
                  Nusa Dua Coral Wall - Longline
                </h4>
                <p className="text-xs text-[#41484b] font-['Inter'] line-clamp-2">
                  Assigned to Ocean Clean Bali Diver Unit 3. Deployment boat departure scheduled for tomorrow morning high tide.
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-[#dce3eb]/60 text-xs">
                  <span className="text-[11px] text-[#72787c]">Logged: 2 days ago</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDrawer(false);
                      onNavigate('dossiers');
                    }}
                    className="text-[#006a63] font-bold flex items-center gap-0.5 font-['DM_Sans']"
                  >
                    <span>View Log</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-[#eef4fc] p-3.5 rounded-2xl border border-[#dce3eb]/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#41484b] font-mono font-bold">TK-2025-081</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#c2e8fb] text-[#001f29] flex items-center gap-1 font-bold font-['DM_Sans']">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#002531] animate-pulse"></span> Under Review
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#002531] font-['DM_Sans']">
                  Amed Outer Dropoff - Crab Pots
                </h4>
                <p className="text-xs text-[#41484b] font-['Inter'] line-clamp-2">
                  Sighting telemetry confirmed. Regional coordinator validating vessel salvage clearance with harbor master.
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-[#dce3eb]/60 text-xs">
                  <span className="text-[11px] text-[#72787c]">Logged: Yesterday, 16:30</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDrawer(false);
                      onNavigate('dossiers');
                    }}
                    className="text-[#006a63] font-bold flex items-center gap-0.5 font-['DM_Sans']"
                  >
                    <span>View Log</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#eef4fc] border-t border-[#dce3eb]">
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="w-full h-11 rounded-full bg-white hover:bg-[#dce3eb] font-bold text-xs text-[#002531] transition-colors font-['DM_Sans']"
              >
                Close Reports Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
