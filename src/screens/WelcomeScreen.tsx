import React, { useState } from 'react';
import { ASSETS } from '../data/assets';
import { ScreenId } from '../types';

interface WelcomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate, showToast }) => {
  const [selectedChips, setSelectedChips] = useState<string[]>(['fishing-community', 'volunteer']);
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
    setSelectedChips((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleJoin = () => {
    showToast('Welcome to the Tidekind Network! Regional feed active.', 'waving_hand');
    onNavigate('home');
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto bg-[#f6faff]">
      {/* Coastal Ambient Hero Banner */}
      <div className="relative w-full overflow-hidden rounded-b-3xl shadow-md bg-[#123b4a]">
        <div className="relative w-full h-72 flex flex-col justify-between p-6 bg-cover bg-center">
          <img
            src={ASSETS.coastalHero}
            alt="Coastal Shoreline Sunrise"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#002531]/90 via-[#002531]/40 to-transparent"></div>

          {/* Floating Micro-Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#006a63] text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#006a63] animate-pulse"></span>
              <span>TideKind Network</span>
            </span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 text-[#002531] backdrop-blur-md shadow-sm">
              <span className="material-symbols-outlined text-base">waves</span>
            </span>
          </div>

          {/* Hero Header & Value Proposition */}
          <div className="relative z-10 text-white">
            <p className="text-xs font-bold text-[#90f4e9] mb-1 tracking-wide uppercase">
              Ocean Stewardship • Community Action
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Give ghost gear a second chance.
            </h1>
          </div>
        </div>
      </div>

      {/* Main Narrative & Call to Actions Container */}
      <div className="px-4 pt-5 flex flex-col gap-4">
        {/* Warm Community Intro Card */}
        <div className="p-5 rounded-3xl bg-[#eef4fc] shadow-sm border border-[#dce3eb] flex flex-col gap-3">
          <p className="text-xs sm:text-sm text-[#151c22] leading-relaxed">
            Join a community helping prevent lost fishing gear from harming marine life through
            repair, responsible recovery, recycling, and local action.
          </p>

          {/* Key Impact Micro-Row */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-2xl bg-white shadow-xs border border-[#e8eff7] flex flex-col items-center">
              <span className="material-symbols-outlined text-[#006a63] text-xl mb-0.5">
                sailing
              </span>
              <span className="text-base font-bold text-[#002531]">14.2t</span>
              <span className="text-[10px] text-[#72787c]">Recovered</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white shadow-xs border border-[#e8eff7] flex flex-col items-center">
              <span className="material-symbols-outlined text-[#006a63] text-xl mb-0.5">
                build_circle
              </span>
              <span className="text-base font-bold text-[#002531]">820+</span>
              <span className="text-[10px] text-[#72787c]">Repaired</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white shadow-xs border border-[#e8eff7] flex flex-col items-center">
              <span className="material-symbols-outlined text-[#006a63] text-xl mb-0.5">
                group
              </span>
              <span className="text-base font-bold text-[#002531]">38</span>
              <span className="text-[10px] text-[#72787c]">Harbors</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleJoin}
            className="w-full min-h-[48px] px-6 py-3 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span>Join the Community</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
          <button
            onClick={() => onNavigate('project-details')}
            className="w-full min-h-[48px] px-6 py-3 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg text-[#006a63]">explore</span>
            <span>Explore Projects First</span>
          </button>
        </div>

        {/* Interactive Onboarding Customization Section */}
        <div className="p-5 rounded-3xl bg-white shadow-sm border border-[#e8eff7] flex flex-col gap-3.5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a63]">
                Personalize your journey
              </span>
              <h2 className="text-base font-bold text-[#002531]">
                How would you like to participate?
              </h2>
            </div>
            <span className="material-symbols-outlined text-[#73d7cd] text-2xl">eco</span>
          </div>

          <p className="text-xs text-[#41484b]">
            Select all that spark joy. We adapt project feeds and workshop alerts to your interests.
          </p>

          {/* Multi-select Interest Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((chip) => {
              const active = selectedChips.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => toggleChip(chip.id)}
                  type="button"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    active
                      ? 'bg-[#006a63] text-white shadow-xs'
                      : 'bg-[#e8eff7] text-[#151c22] hover:bg-[#dce3eb]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{chip.icon}</span>
                  <span>{chip.label}</span>
                  {active && <span className="material-symbols-outlined text-xs">check</span>}
                </button>
              );
            })}
          </div>

          {/* Area Selection */}
          <div className="pt-2 flex flex-col gap-2">
            <label className="text-xs font-bold text-[#002531] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006a63] text-base">pin_drop</span>
              <span>Your Region or Port Hub</span>
            </label>
            <div className="relative w-full">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full min-h-[44px] appearance-none px-4 py-2.5 pr-10 rounded-2xl bg-[#f6faff] text-xs font-semibold text-[#151c22] border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
              >
                <option value="id-bali-eastjava">Indonesia (Bali & East Java Pilot)</option>
                <option value="id-sulawesi">Indonesia (North Sulawesi / Bunaken)</option>
                <option value="ph-visayas">Philippines (Central Visayas)</option>
                <option value="my-sabah">Malaysia (Sabah Coastal Zone)</option>
                <option value="other-intl">International Supporter (Global)</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#72787c]">
                expand_more
              </span>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-[#eef4fc] text-[#41484b] border border-[#dce3eb]">
              <span className="material-symbols-outlined text-[#006a63] text-base shrink-0 mt-0.5">
                shield
              </span>
              <p className="text-[11px] leading-snug">
                General area only — exact location not required for privacy.
              </p>
            </div>
          </div>

          {/* Reassurance Banner */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-1 text-[#72787c]">
              <span className="material-symbols-outlined text-sm text-[#006a63]">
                sentiment_satisfied
              </span>
              <span>Skip optional steps anytime.</span>
            </div>
            <button
              onClick={() => {
                showToast('Preference defaults saved', 'done');
                onNavigate('home');
              }}
              className="text-xs font-bold text-[#006a63] underline"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Community Spotlight Photo Card */}
        <div className="rounded-3xl bg-white overflow-hidden shadow-sm border border-[#e8eff7] flex flex-col">
          <div className="w-full h-40 relative bg-[#002531]">
            <img
              src={ASSETS.banyuwangiWorkshop}
              alt="Banyuwangi Harbor Workshop"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-[#002531]/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#90f4e9]">location_on</span>
              <span>Banyuwangi Harbor Workshop</span>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#002531]">
                Local net upcycling cooperative
              </p>
              <p className="text-[11px] text-[#41484b] mt-0.5 leading-snug">
                Over 1,200 meters of ghost nylon woven into new port bags this month.
              </p>
            </div>
            <button
              onClick={() => onNavigate('recycling')}
              className="btn-cool-primary px-3 py-1.5 rounded-full text-xs font-bold shrink-0 active:scale-95 transition-all shadow-xs"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Reassurance Footer */}
        <div className="text-center py-2 text-[#72787c] flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-[11px]">
            <span className="material-symbols-outlined text-[#006a63] text-sm">lock</span>
            <span>Community-led • Zero spam • Open marine safety data</span>
          </div>
        </div>
      </div>
    </div>
  );
};
