import React, { useState } from 'react';
import { ScreenId } from '../types';
import { ASSETS } from '../data/assets';

interface ScreenProfileProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
  isRegisteredKuta: boolean;
}

export const ScreenProfile: React.FC<ScreenProfileProps> = ({
  onNavigate,
  onToast,
  isRegisteredKuta,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [tideAlerts, setTideAlerts] = useState(true);
  const [salvageCalls, setSalvageCalls] = useState(true);
  const [fuzzyGps, setFuzzyGps] = useState(true);

  const [logWeight, setLogWeight] = useState('24');
  const [logCategory, setLogCategory] = useState<'net' | 'hours'>('net');

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLogModal(false);
    onToast(`Logged ${logWeight} kg net for Serangan harbor verification!`, 'task_alt');
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 max-w-lg mx-auto">
      {/* Top Profile Card */}
      <div className="pt-2">
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs border border-[#e8eff7]">
          {/* Decorative Glow */}
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#90f4e9]/30 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-[#c2e8fb]/30 blur-xl pointer-events-none"></div>

          {/* Avatar & Identity Info */}
          <div className="relative flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={ASSETS.alexSteward}
                alt="Alex Steward"
                className="h-16 w-16 rounded-full object-cover shadow-xs border-2 border-white"
              />
              <div
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#006a63] text-white shadow-xs ring-2 ring-white"
                title="Verified Tier 2 Steward"
              >
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg font-bold text-[#151c22] font-['DM_Sans'] truncate">Alex Steward</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold font-['DM_Sans']">
                  Tier 2 Steward
                </span>
              </div>
              <p className="text-xs text-[#41484b] font-['Inter'] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-sm text-[#006a63]">anchor</span>
                <span className="truncate">Serangan Harbor Chapter</span>
              </p>
              <p className="text-xs text-[#72787c] font-['Inter'] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span>Denpasar, Bali</span>
              </p>
            </div>
          </div>

          {/* Verified Contribution Stats Grid */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 pt-1 border-t border-[#e8eff7]">
            <div className="rounded-xl bg-[#eef4fc] p-3 flex flex-col justify-between border border-[#dce3eb]/50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#41484b] font-semibold font-['DM_Sans']">Gear Diverted</span>
                <span className="material-symbols-outlined text-[#006a63] text-base">recycling</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#002531] font-['DM_Sans']">340</span>
                <span className="text-xs text-[#006a63] font-bold font-['DM_Sans']">kg</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#41484b] font-['Inter']">
                <span className="material-symbols-outlined text-[#006a63] text-xs">verified</span>
                <span>Weight-certified</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#eef4fc] p-3 flex flex-col justify-between border border-[#dce3eb]/50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#41484b] font-semibold font-['DM_Sans']">Hours Logged</span>
                <span className="material-symbols-outlined text-[#006a63] text-base">timer</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#002531] font-['DM_Sans']">18</span>
                <span className="text-xs text-[#72787c] font-['DM_Sans']">hrs</span>
              </div>
              <div className="mt-0.5 text-[10px] text-[#41484b] font-['Inter']">
                <span>Across 6 sorties</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#eef4fc] p-3 flex flex-col justify-between border border-[#dce3eb]/50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#41484b] font-semibold font-['DM_Sans']">Projects Done</span>
                <span className="material-symbols-outlined text-[#006a63] text-base">task_alt</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#002531] font-['DM_Sans']">4</span>
                <span className="text-xs text-[#006a63] font-bold font-['DM_Sans']">harbors</span>
              </div>
              <div className="mt-0.5 text-[10px] text-[#41484b] font-['Inter']">
                <span>100% attendance</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#eef4fc] p-3 flex flex-col justify-between border border-[#dce3eb]/50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#41484b] font-semibold font-['DM_Sans']">Gear Dossiers</span>
                <span className="material-symbols-outlined text-[#006a63] text-base">document_scanner</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#002531] font-['DM_Sans']">3</span>
                <span className="text-xs text-[#72787c] font-['DM_Sans']">verified</span>
              </div>
              <div className="mt-0.5 text-[10px] text-[#006a63] font-bold font-['Inter']">
                <span>ShoreScan AI tagged</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowLogModal(true)}
              className="w-full h-11 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all font-['DM_Sans']"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Log New Contribution</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigate('dossiers')}
                className="h-10 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center justify-center gap-1 active:scale-98 transition-all font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-base text-[#006a63]">folder_shared</span>
                <span>My Dossiers (3)</span>
              </button>
              <button
                type="button"
                onClick={() => onToast('Opening harbor profile editor...')}
                className="h-10 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center justify-center gap-1 active:scale-98 transition-all font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-base text-[#72787c]">tune</span>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Activity Card */}
      <div className="mt-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006a63] animate-ping"></span>
            <h2 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Upcoming Activity</h2>
          </div>
          <span className="text-[11px] text-[#006a63] font-bold font-['DM_Sans']">Confirmed</span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#123b4a] text-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold mb-1 font-['DM_Sans']">
                Harbor Sort &amp; Drop-off
              </span>
              <h3 className="text-base font-bold text-white font-['DM_Sans']">Kuta Harbor Net Sorting</h3>
              <p className="text-xs text-[#7fa5b7] mt-0.5 flex items-center gap-1 font-['Inter']">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span>Saturday, 08:00 WITA</span>
              </p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-xs px-2.5 py-1.5 text-center shrink-0">
              <span className="block text-[9px] uppercase text-[#90f4e9] font-bold tracking-wider font-['DM_Sans']">
                Berth
              </span>
              <span className="block text-lg font-bold text-white font-['DM_Sans']">#12</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[#006a63] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">near_me</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white font-['DM_Sans']">Muster Point Bravo</p>
                <p className="text-[10px] text-[#7fa5b7] font-['Inter']">Dry Dock Gantry Gate</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPassModal(true)}
              className="h-8 px-3 rounded-full bg-[#90f4e9] hover:bg-[#73d7cd] text-[#00504a] text-xs font-bold flex items-center gap-1 active:scale-95 transition-all font-['DM_Sans']"
            >
              <span className="material-symbols-outlined text-sm">qr_code_2</span>
              <span>View Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <div className="mt-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h2 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Earned Badges</h2>
            <p className="text-[11px] text-[#41484b] font-['Inter']">Validated skills &amp; harbor certifications</p>
          </div>
          <span className="text-xs text-[#006a63] font-bold font-['DM_Sans']">3 Unlocked</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {/* Badge 1 */}
          <div className="shrink-0 w-36 rounded-2xl bg-white p-3 shadow-xs border border-[#e8eff7] flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-[#90f4e9] flex items-center justify-center text-[#006a63] mb-1">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                waves
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Tidekeeper Lvl 1</h4>
            <p className="text-[10px] text-[#72787c] mt-0.5 line-clamp-2 font-['Inter']">
              Awarded for 300+ kg ghost gear diversion
            </p>
            <span className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] text-[#006a63] font-bold font-['DM_Sans']">
              <span className="material-symbols-outlined text-xs">military_tech</span> Verified
            </span>
          </div>

          {/* Badge 2 */}
          <div className="shrink-0 w-36 rounded-2xl bg-white p-3 shadow-xs border border-[#e8eff7] flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-[#c2e8fb] flex items-center justify-center text-[#002531] mb-1">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                hardware
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Master Knot Untangler</h4>
            <p className="text-[10px] text-[#72787c] mt-0.5 line-clamp-2 font-['Inter']">
              Lead deck hand for entangled nylon rigs
            </p>
            <span className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] text-[#006a63] font-bold font-['DM_Sans']">
              <span className="material-symbols-outlined text-xs">military_tech</span> Certified
            </span>
          </div>

          {/* Badge 3 */}
          <div className="shrink-0 w-36 rounded-2xl bg-white p-3 shadow-xs border border-[#e8eff7] flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-[#90f4e9]/50 flex items-center justify-center text-[#006a63] mb-1">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                photo_camera
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">ShoreScan Pioneer</h4>
            <p className="text-[10px] text-[#72787c] mt-0.5 line-clamp-2 font-['Inter']">
              First 3 micro-plastic &amp; drift net detections
            </p>
            <span className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] text-[#006a63] font-bold font-['DM_Sans']">
              <span className="material-symbols-outlined text-xs">military_tech</span> Pioneer
            </span>
          </div>

          {/* Locked Badge */}
          <div className="shrink-0 w-32 rounded-2xl bg-[#eef4fc]/60 p-3 flex flex-col items-center text-center opacity-70 border border-dashed border-[#c1c7cb]">
            <div className="h-10 w-10 rounded-full bg-[#dce3eb] flex items-center justify-center text-[#72787c] mb-1">
              <span className="material-symbols-outlined text-xl">sailing</span>
            </div>
            <h4 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Deep Reef Diver</h4>
            <p className="text-[10px] text-[#72787c] mt-0.5 font-['Inter']">2 more deep sorties</p>
            <span className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] text-[#72787c] font-['DM_Sans']">
              <span className="material-symbols-outlined text-xs">lock</span> Locked
            </span>
          </div>
        </div>
      </div>

      {/* Contribution History */}
      <div className="mt-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h2 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Contribution History</h2>
            <p className="text-[11px] text-[#41484b] font-['Inter']">Validated chain of salvage logs</p>
          </div>
          <button
            type="button"
            onClick={() => onToast('Exporting salvage ledger (.csv format)...', 'download')}
            className="text-xs text-[#006a63] font-bold hover:underline font-['DM_Sans']"
          >
            Export Log
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {/* Item 1 */}
          <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-[#e8eff7]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-[#90f4e9]/50 flex items-center justify-center text-[#006a63] shrink-0">
                  <span className="material-symbols-outlined text-lg">scale</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">45 kg Monofilament Gillnet</h4>
                  <p className="text-[11px] text-[#72787c] font-['Inter']">Jimbaran Drive • May 14</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold font-['DM_Sans']">
                <span className="material-symbols-outlined text-xs">verified</span>
                Verified
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xl bg-[#eef4fc] px-2.5 py-1.5 text-[11px] font-['Inter']">
              <span className="text-[#41484b]">Audited by Serangan Co-op</span>
              <span className="text-[#002531] font-bold font-mono">Chain ID #7721</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-[#e8eff7]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-[#c2e8fb] flex items-center justify-center text-[#002531] shrink-0">
                  <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">4 Hrs Beach Triage &amp; Spooling</h4>
                  <p className="text-[11px] text-[#72787c] font-['Inter']">Sanur Reef Clean • May 02</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold font-['DM_Sans']">
                <span className="material-symbols-outlined text-xs">verified</span>
                Verified
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xl bg-[#eef4fc] px-2.5 py-1.5 text-[11px] font-['Inter']">
              <span className="text-[#41484b]">Validated by Field Lead Wayan</span>
              <span className="text-[#002531] font-bold font-['DM_Sans']">12 volunteers total</span>
            </div>
          </div>

          {/* Item 3 */}
          <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-[#e8eff7]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-[#ffdbd1] flex items-center justify-center text-[#64200d] shrink-0">
                  <span className="material-symbols-outlined text-lg">radar</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">ShoreScan #SS-2025-042</h4>
                  <p className="text-[11px] text-[#72787c] font-['Inter']">Serangan Outer Reef • Today 10:14</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdbd1] text-[#7a2f1b] text-[10px] font-bold font-['DM_Sans']">
                <span className="w-1.5 h-1.5 rounded-full bg-[#64200d] animate-pulse"></span>
                Under Review
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xl bg-[#eef4fc] px-2.5 py-1.5 text-[11px] font-['Inter']">
              <span className="text-[#41484b]">Pending Quorum (2 of 3 signed)</span>
              <span className="text-[#006a63] font-bold font-['DM_Sans']">Live Triage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences & Field Safety */}
      <div className="mt-3.5">
        <h2 className="text-xs font-bold text-[#151c22] mb-1.5 font-['DM_Sans']">Preferences &amp; Field Safety</h2>
        <div className="rounded-2xl bg-white p-4 shadow-xs border border-[#e8eff7] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#006a63] text-lg mt-0.5">tsunami</span>
              <div>
                <h4 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Tide &amp; Drift Net Alerts</h4>
                <p className="text-[11px] text-[#41484b] font-['Inter']">
                  Receive push notification when currents push ghost rigs into Serangan
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !tideAlerts;
                setTideAlerts(next);
                onToast(next ? 'Tide drift alerts enabled' : 'Tide drift alerts paused');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                tideAlerts ? 'bg-[#006a63]' : 'bg-[#c1c7cb]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  tideAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="h-[1px] bg-[#e8eff7] w-full"></div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#006a63] text-lg mt-0.5">scuba_diving</span>
              <div>
                <h4 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Urgent Dive Salvage Calls</h4>
                <p className="text-[11px] text-[#41484b] font-['Inter']">
                  Priority dispatch ping when mammal entanglement is reported nearby
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !salvageCalls;
                setSalvageCalls(next);
                onToast(next ? 'Priority dive alerts active' : 'Dive dispatch muted');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                salvageCalls ? 'bg-[#006a63]' : 'bg-[#c1c7cb]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  salvageCalls ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="h-[1px] bg-[#e8eff7] w-full"></div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#006a63] text-lg mt-0.5">share_location</span>
              <div>
                <h4 className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Fuzzy GPS Privacy</h4>
                <p className="text-[11px] text-[#41484b] font-['Inter']">
                  Fuzz my home berth coords by 500m on the community public map
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !fuzzyGps;
                setFuzzyGps(next);
                onToast(next ? 'Fuzzy GPS enabled (500m jitter)' : 'Precise vessel GPS enabled');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                fuzzyGps ? 'bg-[#006a63]' : 'bg-[#c1c7cb]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  fuzzyGps ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out & Identity Footer */}
      <div className="mt-5 flex flex-col items-center">
        <button
          type="button"
          onClick={() => {
            onToast('Logged out. Switched vessel session to Guest.');
            onNavigate('welcome');
          }}
          className="w-full h-11 rounded-full bg-[#e8eff7] hover:bg-[#ffdad6] text-[#002531] hover:text-[#ba1a1a] text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all font-['DM_Sans']"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Sign Out &amp; Switch Vessel ID</span>
        </button>

        <p className="mt-2 text-[10px] text-[#72787c] text-center font-mono">
          Tidekind Marine Network Protocol • v2.4-Bali • ID: TK-BLI-88930
        </p>
      </div>

      {/* Modal: Muster Pass */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative text-center animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowPassModal(false)}
              className="absolute right-4 top-4 h-7 w-7 rounded-full flex items-center justify-center text-[#72787c] hover:text-[#151c22]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#90f4e9] text-[#00504a] text-xs font-bold mb-1 font-['DM_Sans']">
              Boarding &amp; Staging Pass
            </span>
            <h3 className="text-base font-bold text-[#151c22] font-['DM_Sans']">Kuta Net Sort Berth #12</h3>
            <p className="text-xs text-[#72787c] font-['Inter']">Steward: Alex Steward (TK-BLI-88930)</p>

            {/* QR Code graphic */}
            <div className="my-4 mx-auto w-36 h-36 rounded-xl bg-[#eef4fc] p-3 flex flex-col items-center justify-center border border-dashed border-[#c1c7cb]">
              <span className="material-symbols-outlined text-5xl text-[#002531] mb-1">qr_code_2</span>
              <span className="text-[9px] text-[#72787c] font-mono">SCAN AT DOCK GANTRY</span>
            </div>

            <div className="rounded-xl bg-[#123b4a] text-white p-3 text-left">
              <div className="flex items-center justify-between text-xs font-['DM_Sans']">
                <span className="text-[#90f4e9] font-bold">Muster Time</span>
                <span className="font-bold">07:45 WITA (Sharp)</span>
              </div>
              <p className="text-[11px] text-[#7fa5b7] mt-1 font-['Inter'] leading-relaxed">
                Bring puncture-resistant gloves and deck boots. High-vis vest provided on arrival.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowPassModal(false);
                onToast('Pass cached for offline harbor gate check', 'badge');
              }}
              className="mt-3.5 w-full h-10 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold font-['DM_Sans'] shadow-xs"
            >
              Save to Offline Wallet
            </button>
          </div>
        </div>
      )}

      {/* Modal: Log Contribution */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#e8eff7] mb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006a63] text-xl">scale</span>
                <h3 className="text-sm font-bold text-[#002531] font-['DM_Sans']">Log Salvage Activity</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">Activity Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogCategory('net')}
                    className={`h-10 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1 font-['DM_Sans'] ${
                      logCategory === 'net'
                        ? 'bg-[#006a63] text-white'
                        : 'bg-[#e8eff7] text-[#002531]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">set_meal</span>
                    <span>Net Recovery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogCategory('hours')}
                    className={`h-10 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1 font-['DM_Sans'] ${
                      logCategory === 'hours'
                        ? 'bg-[#006a63] text-white'
                        : 'bg-[#e8eff7] text-[#002531]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">hourglass_bottom</span>
                    <span>Volunteer Hours</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  {logCategory === 'net' ? 'Net Weight (kg)' : 'Hours Dedicated'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={logWeight}
                    onChange={(e) => setLogWeight(e.target.value)}
                    className="w-full h-11 rounded-xl bg-[#eef4fc] px-3 text-xs text-[#151c22] focus:outline-none"
                  />
                  <span className="absolute right-3 top-3 text-[11px] font-bold text-[#72787c] font-['DM_Sans']">
                    {logCategory === 'net' ? 'kg net' : 'hours'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">
                  Muster / Harbor Location
                </label>
                <input
                  type="text"
                  defaultValue="Serangan Harbor Dock #4"
                  className="w-full h-11 rounded-xl bg-[#eef4fc] px-3 text-xs text-[#151c22] focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#eef4fc] flex items-center justify-between border border-[#dce3eb]/50">
                <div className="flex items-center gap-1.5 text-xs text-[#151c22]">
                  <span className="material-symbols-outlined text-[#006a63] text-base">domain_verification</span>
                  <span>Co-op Scale Station #3</span>
                </div>
                <span className="text-[10px] text-[#006a63] font-bold font-['DM_Sans']">Auto-Pair</span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 h-10 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-bold font-['DM_Sans']"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold shadow-xs font-['DM_Sans']"
                >
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
