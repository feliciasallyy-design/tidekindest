import React, { useState } from 'react';
import { ScreenId } from '../types';
import { ASSETS } from '../data/assets';

interface ScreenWelcomeProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const ScreenWelcome: React.FC<ScreenWelcomeProps> = ({ onNavigate, onToast }) => {
  const [selectedChips, setSelectedChips] = useState<string[]>(['fishing-community']);
  const [selectedRegion, setSelectedRegion] = useState('id-bali-eastjava');

  const chips = [
    { id: 'volunteer', label: 'Volunteer', icon: 'volunteer_activism' },
    { id: 'fishing-community', label: 'Fishing community', icon: 'phishing' },
    { id: 'repair-recycling', label: 'Repair and recycling', icon: 'recycling' },
    { id: 'school-student', label: 'School or student group', icon: 'school' },
    { id: 'environmental-org', label: 'Environmental organization', icon: 'nature_people' },
    { id: 'general-supporter', label: 'General supporter', icon: 'favorite' },
  ];

  const toggleChip = (id: string) => {
    if (selectedChips.includes(id)) {
      setSelectedChips(selectedChips.filter((c) => c !== id));
    } else {
      setSelectedChips([...selectedChips, id]);
    }
  };

  const handleJoin = () => {
    onToast('Preferences saved! Welcome to Tidekind Bali Pilot.', 'task_alt');
    onNavigate('home');
  };

  return (
    <div className="flex flex-col w-full pb-16 bg-[#f6faff]">
      {/* Coastal Ambient Hero Banner */}
      <div className="relative w-full overflow-hidden rounded-b-2xl shadow-md bg-[#123b4a]">
        <div
          className="bg-cover bg-center w-full h-72 relative flex flex-col justify-between p-6"
          style={{ backgroundImage: `url(${ASSETS.coastalHero})` }}
        >
          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#002531]/90 via-[#002531]/40 to-transparent"></div>

          {/* Floating Micro-Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#006a63] font-semibold text-xs shadow-sm font-['DM_Sans']">
              <span className="w-2 h-2 rounded-full bg-[#006a63] animate-pulse"></span>
              TideKind Network
            </span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 text-[#002531] backdrop-blur-sm shadow-sm">
              <span className="material-symbols-outlined text-base">waves</span>
            </span>
          </div>

          {/* Hero Header & Value Proposition */}
          <div className="relative z-10 text-white">
            <p className="text-xs font-bold text-[#90f4e9] mb-1 tracking-wider uppercase font-['DM_Sans']">
              Ocean Stewardship • Community Action
            </p>
            <h1 className="text-3xl sm:text-4xl tracking-tight text-white font-bold font-['DM_Sans'] leading-tight">
              Give ghost gear a second chance.
            </h1>
          </div>
        </div>
      </div>

      {/* Main Narrative & Call to Actions Container */}
      <div className="px-4 pt-5 flex flex-col gap-5 max-w-lg mx-auto w-full">
        {/* Warm Community Intro Card */}
        <div className="p-5 rounded-2xl bg-[#eef4fc] shadow-sm flex flex-col gap-3 border border-[#dce3eb]/60">
          <p className="text-sm text-[#151c22] leading-relaxed font-['Inter']">
            Join a community helping prevent lost fishing gear from harming marine life through repair,
            responsible recovery, recycling, and local action.
          </p>

          {/* Key Impact Micro-Row */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white text-center shadow-xs">
              <span
                className="material-symbols-outlined text-[#006a63] mb-0.5 text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                sailing
              </span>
              <span className="text-lg font-bold text-[#002531] font-['DM_Sans']">14.2t</span>
              <span className="text-[11px] text-[#41484b] font-['Inter']">Recovered</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white text-center shadow-xs">
              <span
                className="material-symbols-outlined text-[#006a63] mb-0.5 text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                build_circle
              </span>
              <span className="text-lg font-bold text-[#002531] font-['DM_Sans']">820+</span>
              <span className="text-[11px] text-[#41484b] font-['Inter']">Repaired</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white text-center shadow-xs">
              <span
                className="material-symbols-outlined text-[#006a63] mb-0.5 text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                group
              </span>
              <span className="text-lg font-bold text-[#002531] font-['DM_Sans']">38</span>
              <span className="text-[11px] text-[#41484b] font-['Inter']">Harbors</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleJoin}
            className="w-full min-h-[48px] px-6 py-3 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all font-['DM_Sans']"
          >
            <span>Join the Community</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="w-full min-h-[48px] px-6 py-3 rounded-full bg-[#e2e9f1] hover:bg-[#dce3eb] text-[#002531] font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all font-['DM_Sans']"
          >
            <span className="material-symbols-outlined text-lg">explore</span>
            <span>Explore Projects First</span>
          </button>
        </div>

        {/* Interactive Onboarding Customization Section */}
        <div className="p-5 rounded-2xl bg-white shadow-sm flex flex-col gap-4 border border-[#e8eff7]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#006a63] font-bold font-['DM_Sans']">
                Personalize your journey
              </span>
              <h2 className="text-lg text-[#002531] font-bold font-['DM_Sans'] mt-0.5">
                How would you like to participate?
              </h2>
            </div>
            <span className="material-symbols-outlined text-[#73d7cd] text-2xl">eco</span>
          </div>

          <p className="text-xs text-[#41484b] font-['Inter'] leading-relaxed">
            Select all that spark joy. We adapt project feeds and workshop alerts to your interests.
          </p>

          {/* Multi-select Interest Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((chip) => {
              const active = selectedChips.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => toggleChip(chip.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 font-['DM_Sans'] ${
                    active
                      ? 'bg-[#006a63] text-white shadow-xs'
                      : 'bg-[#e8eff7] text-[#151c22] hover:bg-[#dce3eb]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-base ${active ? 'text-white' : 'text-[#006a63]'}`}>
                    {chip.icon}
                  </span>
                  <span>{chip.label}</span>
                  {active && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
              );
            })}
          </div>

          {/* Area Selection Container */}
          <div className="mt-2 pt-3 flex flex-col gap-2 border-t border-[#e8eff7]">
            <label
              htmlFor="regionSelect"
              className="text-xs font-bold text-[#002531] flex items-center gap-1.5 font-['DM_Sans']"
            >
              <span className="material-symbols-outlined text-[#006a63] text-base">pin_drop</span>
              Your Region or Port Hub
            </label>
            <div className="relative w-full">
              <select
                id="regionSelect"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full min-h-[48px] appearance-none px-4 py-3 pr-10 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs font-medium focus:outline-none focus:bg-[#e2e9f1] transition-colors"
              >
                <option value="id-bali-eastjava">Indonesia (Bali &amp; East Java Pilot)</option>
                <option value="id-sulawesi">Indonesia (North Sulawesi / Bunaken)</option>
                <option value="ph-visayas">Philippines (Central Visayas)</option>
                <option value="my-sabah">Malaysia (Sabah Coastal Zone)</option>
                <option value="other-intl">International Supporter (Global)</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#41484b]">
                expand_more
              </span>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#eef4fc] text-[#41484b] text-[11px] font-['Inter']">
              <span
                className="material-symbols-outlined text-[#006a63] text-base mt-0.5 shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield
              </span>
              <p>General area only — exact location not required for privacy.</p>
            </div>
          </div>

          {/* Reassurance Banner */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-[#41484b] text-xs font-['Inter']">
              <span className="material-symbols-outlined text-base text-[#006a63]">sentiment_satisfied</span>
              <span>Skip optional steps anytime.</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs font-semibold text-[#006a63] underline active:opacity-70 font-['DM_Sans']"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Community Spotlight Photo Card */}
        <div className="rounded-2xl bg-[#eef4fc] overflow-hidden shadow-sm flex flex-col border border-[#dce3eb]/60">
          <div
            className="w-full h-44 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${ASSETS.banyuwangiWorkshop})` }}
          >
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-[#002531]/80 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">location_on</span>
              Banyuwangi Harbor Workshop
            </div>
          </div>
          <div className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#002531] font-['DM_Sans']">Local net upcycling cooperative</p>
              <p className="text-xs text-[#41484b] font-['Inter'] mt-0.5">
                Over 1,200 meters of ghost nylon woven into new port bags this month.
              </p>
            </div>
            <span className="shrink-0 w-10 h-10 rounded-full bg-[#90f4e9] text-[#007169] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">handshake</span>
            </span>
          </div>
        </div>

        {/* Reassurance Footer Note */}
        <div className="text-center py-2 text-[#41484b] flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#72787c]">
            <span className="material-symbols-outlined text-[#006a63] text-sm">lock</span>
            <span>Community-led • Zero spam • Open marine safety data</span>
          </div>
        </div>
      </div>
    </div>
  );
};
