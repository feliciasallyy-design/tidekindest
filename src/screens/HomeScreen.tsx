import React, { useState } from 'react';
import { ASSETS } from '../data/assets';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string) => void;
  isRegisteredKuta: boolean;
  onToggleRegisterKuta: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  showToast,
  isRegisteredKuta,
  onToggleRegisterKuta,
}) => {
  const { user, sharedData, setAuthModalOpen } = useAuth();

  const totalDivertedKg = 1420 + (sharedData?.activityLogs?.reduce((acc, l) => acc + (l.weightKg || 0), 0) || 0);
  const totalStewards = 340 + (sharedData?.users?.length || 3);
  const totalProjects = sharedData?.projects?.length || 3;

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-6">
      {/* Greeting Hero Box */}
      <section className="relative w-full rounded-3xl bg-[#eef4fc] p-5 shadow-sm overflow-hidden border border-[#dce3eb]">
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#90f4e9] text-[#00504a] w-fit shadow-xs">
              <span className="material-symbols-outlined text-[14px]">anchor</span>
              <span className="text-xs font-bold">{user?.chapter || 'Global Coastal Steward Network'}</span>
            </div>

            {!user ? (
              <button
                onClick={() => onNavigate('auth')}
                className="btn-cool-primary text-[11px] font-bold px-3 py-1 rounded-full shadow-xs active:scale-95 transition-all"
              >
                Sign In / Join
              </button>
            ) : (
              <button
                onClick={() => onNavigate('profile')}
                className="btn-cool-glow text-[11px] font-bold px-3 py-1 rounded-full active:scale-95 flex items-center gap-1 text-[#90f4e9]"
                title="Edit profile & photo"
              >
                <span className="material-symbols-outlined text-xs">tune</span>
                <span>Customize Profile</span>
              </button>
            )}
          </div>

          <div className="flex flex-col mt-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#151c22]">
              Good morning, {user ? user.name.split(' ')[0] : 'Steward'}!
            </h1>
            <p className="text-sm text-[#41484b] mt-0.5 font-medium">
              {user
                ? `Berth: ${user.location} • ${user.badge}`
                : 'Protecting reefs & tracking marine ghost gear globally.'}
            </p>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[#006a63] text-xs font-semibold bg-white/80 py-2 px-3 rounded-2xl w-fit backdrop-blur-xs border border-white">
            <span className="material-symbols-outlined text-base">water_drop</span>
            <span>Survey window: Low tide at 10:14 AM • 14 global stations active</span>
          </div>
        </div>

        {/* Soft Ambient Decorative Blur */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-[#006a63]/15 pointer-events-none blur-2xl"></div>
      </section>

      {/* Featured Global Interactive Map Teaser Card */}
      <section className="relative w-full rounded-3xl bg-[#002531] text-white p-5 shadow-lg overflow-hidden border border-[#90f4e9]/30">
        <div className="relative z-10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#90f4e9]/20 text-[#90f4e9] text-[11px] font-bold border border-[#90f4e9]/30">
              <span className="w-2 h-2 rounded-full bg-[#90f4e9] animate-ping"></span>
              <span>Interactive Ocean Radar</span>
            </span>
            <span className="text-[11px] text-[#c2e8fb] font-mono">14 Stations Online</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Global Net Stations &amp; Marine Sanctuaries
            </h2>
            <p className="text-xs text-[#c2e8fb] mt-1 leading-relaxed">
              Explore live drop-off depots, circular net mending hubs, and rapid salvage fleets across Bali, Hawaii, California, Mediterranean &amp; Raja Ampat.
            </p>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => onNavigate('explore')}
              className="btn-cool-primary flex-1 h-11 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-base">map</span>
              <span>Launch Interactive Map</span>
            </button>
            <button
              onClick={() => onNavigate('shorescan')}
              className="btn-cool-glow px-4 h-11 rounded-2xl text-xs font-bold text-[#90f4e9] flex items-center justify-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">center_focus_strong</span>
              <span>ShoreScan</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#006a63]/40 pointer-events-none blur-3xl"></div>
      </section>

      {/* Community Impact Summary (2x2 Grid) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006a63] text-xl">insights</span>
            <h2 className="text-lg font-bold text-[#151c22]">Hub Impact Summary</h2>
          </div>
          <span className="text-xs font-semibold text-[#41484b] bg-[#e8eff7] px-2.5 py-0.5 rounded-full">
            Quarter 3
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Metric 1 */}
          <div className="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-[#e8eff7]">
            <div className="w-8 h-8 rounded-full bg-[#90f4e9]/50 text-[#006a63] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">scale</span>
            </div>
            <span className="text-2xl font-bold text-[#002531]">{totalDivertedKg.toLocaleString()} kg</span>
            <span className="text-xs text-[#41484b] mt-0.5">Gear collected</span>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-[#e8eff7]">
            <div className="w-8 h-8 rounded-full bg-[#c2e8fb] text-[#002531] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">carpenter</span>
            </div>
            <span className="text-2xl font-bold text-[#002531]">860 m</span>
            <span className="text-xs text-[#41484b] mt-0.5">Repaired or reused</span>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-[#e8eff7]">
            <div className="w-8 h-8 rounded-full bg-[#e2e9f1] text-[#006a63] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">task_alt</span>
            </div>
            <span className="text-2xl font-bold text-[#002531]">{totalProjects}</span>
            <span className="text-xs text-[#41484b] mt-0.5">Projects active</span>
          </div>

          {/* Metric 4 */}
          <div className="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-[#e8eff7]">
            <div className="w-8 h-8 rounded-full bg-[#90f4e9] text-[#00201d] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">diversity_1</span>
            </div>
            <span className="text-2xl font-bold text-[#002531]">{totalStewards}</span>
            <span className="text-xs text-[#41484b] mt-0.5">Active stewards</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-center">
          <span className="material-symbols-outlined text-[#006a63] text-sm">verified</span>
          <p className="text-xs text-[#41484b]">
            Illustrative demo figures • Verified by local pilot coordinators
          </p>
        </div>
      </section>

      {/* Quick Action Grid */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[#151c22]">Take Direct Action</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Action 1 */}
          <button
            onClick={() => onNavigate('project-details')}
            className="flex flex-col text-left p-4 bg-white rounded-2xl shadow-sm border border-[#e8eff7] hover:bg-[#eef4fc] transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#006a63] text-white flex items-center justify-center mb-3 shadow-xs">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <span className="text-sm font-bold text-[#151c22]">Find a Project</span>
            <span className="text-xs text-[#41484b] line-clamp-2 mt-1 leading-snug">
              Search nearby volunteer & sorting actions
            </span>
          </button>

          {/* Action 2 */}
          <button
            onClick={() => onNavigate('recycling')}
            className="flex flex-col text-left p-4 bg-white rounded-2xl shadow-sm border border-[#e8eff7] hover:bg-[#eef4fc] transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#123b4a] text-white flex items-center justify-center mb-3 shadow-xs">
              <span className="material-symbols-outlined text-xl">recycling</span>
            </div>
            <span className="text-sm font-bold text-[#151c22]">Find Repair</span>
            <span className="text-xs text-[#41484b] line-clamp-2 mt-1 leading-snug">
              Connect with workshops & drop-off points
            </span>
          </button>

          {/* Action 3 */}
          <button
            onClick={() => onNavigate('report-gear')}
            className="flex flex-col text-left p-4 bg-white rounded-2xl shadow-sm border border-[#e8eff7] hover:bg-[#eef4fc] transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#ffdbd1] text-[#64200d] flex items-center justify-center mb-3 shadow-xs">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
            <span className="text-sm font-bold text-[#151c22]">Report Lost Gear</span>
            <span className="text-xs text-[#41484b] line-clamp-2 mt-1 leading-snug">
              Submit observed ghost nets safely
            </span>
          </button>

          {/* Action 4 */}
          <button
            onClick={() => onNavigate('actions')}
            className="flex flex-col text-left p-4 bg-white rounded-2xl shadow-sm border border-[#e8eff7] hover:bg-[#eef4fc] transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#dce3eb] text-[#006a63] flex items-center justify-center mb-3 shadow-xs">
              <span className="material-symbols-outlined text-xl">add_circle</span>
            </div>
            <span className="text-sm font-bold text-[#151c22]">Start Initiative</span>
            <span className="text-xs text-[#41484b] line-clamp-2 mt-1 leading-snug">
              Propose school or local harbor project
            </span>
          </button>
        </div>
      </section>

      {/* Spotlight Drive / Circular Recycling Progress */}
      <section className="flex flex-col p-4 sm:p-5 bg-[#123b4a] text-white rounded-2xl shadow-md gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#90f4e9] text-xl">campaign</span>
            <span className="text-xs uppercase tracking-wider font-bold text-[#90f4e9]">
              Spotlight Drive
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#002531] text-[#90f4e9]">
            Depot in 3 days
          </span>
        </div>

        <div className="flex flex-col">
          <h3 className="text-base sm:text-lg font-bold text-white">
            Jimbaran Gillnet Circular Recycling Drive
          </h3>
          <p className="text-xs sm:text-sm text-[#7fa5b7] mt-1 leading-relaxed">
            Collecting degraded poly filament nets with local artisanal boat crews for upcycling into
            dock bumpers.
          </p>
        </div>

        {/* Recovery Progress Gauge */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#90f4e9] font-semibold">68% of 2-ton pilot goal</span>
            <span className="text-[#7fa5b7]">1,360 / 2,000 kg</span>
          </div>
          <div className="w-full h-3 bg-[#002531] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-[#90f4e9] transition-all duration-700 ease-out"
              style={{ width: '68%' }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-[#7fa5b7] text-xs">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>Jimbaran Fishing Pier</span>
          </div>
          <button
            onClick={() => onNavigate('recycling')}
            className="btn-cool-primary px-4 py-2 rounded-full text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            View Drive Depot
          </button>
        </div>
      </section>

      {/* Upcoming Nearby Opportunities */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006a63] text-xl">event</span>
            <h2 className="text-lg font-bold text-[#151c22]">Upcoming Opportunities</h2>
          </div>
          <button
            onClick={() => onNavigate('project-details')}
            className="text-xs font-bold text-[#006a63] flex items-center hover:underline"
          >
            <span>See all</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        {/* Opportunity Card 1 */}
        <div className="flex flex-col bg-white rounded-3xl shadow-sm border border-[#e8eff7] overflow-hidden">
          <div className="relative w-full h-36 bg-cover bg-center">
            <img
              src={ASSETS.kutaHarborBoats}
              alt="Kuta Harbor Net Sorting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002531]/80 via-transparent to-transparent"></div>
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#006a63] text-white text-[11px] font-bold shadow-sm">
              Open to All Stewards
            </span>
            <div className="absolute bottom-2.5 left-3 text-white">
              <span className="text-xs font-medium flex items-center gap-1 text-[#eef4fc]">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Saturday, 8:00 AM WITA
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-base font-bold text-[#151c22]">
              Kuta Harbor Net Sorting &amp; Drop-off
            </h3>
            <p className="text-xs text-[#41484b] leading-relaxed">
              Assist fishers categorize collected trawl lines and prepare high-density polyethylene for
              regional circular recycling processors.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#e8eff7]">
              <div className="flex items-center gap-1.5 text-xs text-[#41484b]">
                <span className="material-symbols-outlined text-[#006a63] text-base">group</span>
                <span className="font-semibold text-[#151c22]">
                  {isRegisteredKuta ? '13/15 registered' : '12/15 registered'}
                </span>
              </div>
              <button
                onClick={() => {
                  onToggleRegisterKuta();
                  showToast(
                    isRegisteredKuta
                      ? 'Registration cancelled'
                      : 'Registered for Kuta Harbor Net Sorting!',
                    isRegisteredKuta ? 'info' : 'task_alt'
                  );
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1 ${
                  isRegisteredKuta
                    ? 'btn-cool-accent'
                    : 'btn-cool-primary'
                }`}
              >
                {isRegisteredKuta ? (
                  <>
                    <span className="material-symbols-outlined text-sm">check</span>
                    <span>Registered</span>
                  </>
                ) : (
                  <span>Join Project</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Opportunity Card 2 */}
        <div className="flex flex-col bg-white rounded-3xl shadow-sm border border-[#e8eff7] overflow-hidden">
          <div className="relative w-full h-36 bg-cover bg-center">
            <img
              src={ASSETS.sanurCoralDivers}
              alt="Sanur Coral Net Extraction"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002531]/80 via-transparent to-transparent"></div>
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#ffdbd1] text-[#460b00] text-[11px] font-bold shadow-sm">
              Dive Team + Shore Crew
            </span>
            <div className="absolute bottom-2.5 left-3 text-white">
              <span className="text-xs font-medium flex items-center gap-1 text-[#eef4fc]">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Sunday, 7:30 AM WITA
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-base font-bold text-[#151c22]">Sanur Coral Net Extraction</h3>
            <div className="inline-flex items-center gap-1 text-[#64200d] text-[11px] font-semibold bg-[#ffdad6] px-2.5 py-0.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-[13px]">scuba_diving</span>
              <span>Authorized Dive Team for submerged cuts</span>
            </div>
            <p className="text-xs text-[#41484b] leading-relaxed">
              Volunteers needed for shore support crew: handling hoisted wet gear, cataloging marine
              life bycatch, and weighing bins.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#e8eff7]">
              <div className="flex items-center gap-1.5 text-xs text-[#41484b]">
                <span className="material-symbols-outlined text-[#006a63] text-base">support</span>
                <span className="font-semibold text-[#151c22]">Shore Crew Needed</span>
              </div>
              <button
                onClick={() => onNavigate('project-details')}
                className="btn-cool-glow px-4 py-2 rounded-full text-xs font-bold text-[#90f4e9] active:scale-95 transition-all"
              >
                Project Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
