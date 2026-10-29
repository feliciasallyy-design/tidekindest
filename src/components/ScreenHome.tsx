import React, { useState } from 'react';
import { ScreenId } from '../types';
import { ASSETS } from '../data/assets';

interface ScreenHomeProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
  isRegisteredKuta: boolean;
  onToggleRegisterKuta: () => void;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  onNavigate,
  onToast,
  isRegisteredKuta,
  onToggleRegisterKuta,
}) => {
  const [sanurRegistered, setSanurRegistered] = useState(false);

  return (
    <div className="flex flex-col w-full px-4 pb-24 gap-5 max-w-lg mx-auto">
      {/* Greeting Hero Box */}
      <section className="relative w-full rounded-2xl bg-[#eef4fc] p-5 shadow-sm overflow-hidden border border-[#dce3eb]/60 mt-2">
        <div className="relative z-10 flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#90f4e9] text-[#007169] w-fit font-['DM_Sans']">
            <span className="material-symbols-outlined text-sm">anchor</span>
            <span className="text-xs font-bold">Demo Pilot — Bali Coastal Hub</span>
          </div>

          <div className="flex flex-col mt-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#151c22] font-['DM_Sans'] leading-tight">
              Good morning, Alex!
            </h1>
            <p className="text-sm text-[#41484b] font-['Inter'] mt-0.5">
              Ready to make a difference for our oceans today?
            </p>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[#006a63] font-semibold text-xs font-['DM_Sans']">
            <span className="material-symbols-outlined text-base">water_drop</span>
            <span>Low tide at 10:14 AM • Ideal beach survey conditions</span>
          </div>
        </div>

        {/* Soft Ambient Decorative Graphic Element */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#006a63]/10 pointer-events-none blur-2xl"></div>
      </section>

      {/* Community Impact Summary (2x2 Grid) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006a63] text-xl">insights</span>
            <h2 className="text-base font-bold text-[#151c22] font-['DM_Sans']">Hub Impact Summary</h2>
          </div>
          <span className="text-[11px] font-semibold text-[#41484b] bg-[#e8eff7] px-2.5 py-0.5 rounded-full font-['DM_Sans']">
            Quarter 3
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Metric 1 */}
          <div className="flex flex-col p-4 bg-white rounded-2xl shadow-xs border border-[#e8eff7]">
            <div className="w-8 h-8 rounded-full bg-[#90f4e9]/50 text-[#006a63] flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-lg">scale</span>
            </div>
            <span className="text-2xl font-bold text-[#002531] font-['DM_Sans']">1,420 kg</span>
            <span className="text-xs text-[#41484b] mt-0.5 font-['Inter']">Gear collected</span>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col p-4 bg-white rounded-2xl shadow-xs border border-[#e8eff7]">
            <div className="w-8 h-8 rounded-full bg-[#c2e8fb] text-[#002531] flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-lg">carpenter</span>
            </div>
            <span className="text-2xl font-bold text-[#002531] font-['DM_Sans']">860 m</span>
            <span className="text-xs text-[#41484b] mt-0.5 font-['Inter']">Repaired or reused</span>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col p-4 bg-white rounded-2xl shadow-xs border border-[#e8eff7]">
            <div className="w-8 h-8 rounded-full bg-[#dce3eb] text-[#006a63] flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-lg">task_alt</span>
            </div>
            <span className="text-2xl font-bold text-[#002531] font-['DM_Sans']">18</span>
            <span className="text-xs text-[#41484b] mt-0.5 font-['Inter']">Projects finished</span>
          </div>

          {/* Metric 4 */}
          <div className="flex flex-col p-4 bg-white rounded-2xl shadow-xs border border-[#e8eff7]">
            <div className="w-8 h-8 rounded-full bg-[#90f4e9] text-[#00201d] flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-lg">diversity_1</span>
            </div>
            <span className="text-2xl font-bold text-[#002531] font-['DM_Sans']">340</span>
            <span className="text-xs text-[#41484b] mt-0.5 font-['Inter']">Active stewards</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-center">
          <span className="material-symbols-outlined text-[#006a63] text-sm">verified</span>
          <p className="text-[11px] text-[#41484b] font-['Inter']">
            Illustrative demo figures • Verified by local pilot coordinators
          </p>
        </div>
      </section>

      {/* Quick Action Grid */}
      <section className="flex flex-col gap-2.5">
        <h2 className="text-base font-bold text-[#151c22] font-['DM_Sans']">Take Direct Action</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Action 1 */}
          <button
            type="button"
            onClick={() => onNavigate('project-details')}
            className="flex flex-col text-left p-4 bg-white rounded-2xl shadow-xs border border-[#e8eff7] hover:bg-[#eef4fc] transition-all active:scale-98"
          >
            <div className="w-10 h-10 rounded-full bg-[#006a63] text-white flex items-center justify-center mb-2 shadow-sm">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <span className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Find a Project</span>
            <span className="text-xs text-[#41484b] line-clamp-2 mt-0.5 font-['Inter']">
              Search nearby volunteer &amp; sorting actions
            </span>
          </button>

          {/* Action 2 */}
          <button
            type="button"
            onClick={() => onNavigate('recycling')}
            className="flex flex-col text-left p-4 bg-white rounded-2xl shadow-xs border border-[#e8eff7] hover:bg-[#eef4fc] transition-all active:scale-98"
          >
            <div className="w-10 h-10 rounded-full bg-[#123b4a] text-white flex items-center justify-center mb-2 shadow-sm">
              <span className="material-symbols-outlined text-xl">recycling</span>
            </div>
            <span className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Find Repair</span>
            <span className="text-xs text-[#41484b] line-clamp-2 mt-0.5 font-['Inter']">
              Connect with workshops &amp; drop-off points
            </span>
          </button>

          {/* Action 3 */}
          <button
            type="button"
            onClick={() => onNavigate('report-gear')}
            className="flex flex-col text-left p-4 bg-white rounded-2xl shadow-xs border border-[#e8eff7] hover:bg-[#eef4fc] transition-all active:scale-98"
          >
            <div className="w-10 h-10 rounded-full bg-[#ffdbd1] text-[#460b00] flex items-center justify-center mb-2 shadow-sm">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
            <span className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Report Lost Gear</span>
            <span className="text-xs text-[#41484b] line-clamp-2 mt-0.5 font-['Inter']">
              Submit observed ghost nets safely
            </span>
          </button>

          {/* Action 4 */}
          <button
            type="button"
            onClick={() => onNavigate('actions')}
            className="flex flex-col text-left p-4 bg-white rounded-2xl shadow-xs border border-[#e8eff7] hover:bg-[#eef4fc] transition-all active:scale-98"
          >
            <div className="w-10 h-10 rounded-full bg-[#dce3eb] text-[#006a63] flex items-center justify-center mb-2 shadow-sm">
              <span className="material-symbols-outlined text-xl">add_circle</span>
            </div>
            <span className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Start Initiative</span>
            <span className="text-xs text-[#41484b] line-clamp-2 mt-0.5 font-['Inter']">
              Propose school or local harbor project
            </span>
          </button>
        </div>
      </section>

      {/* Community Spotlight / Circular Recycling Drive Progress */}
      <section className="flex flex-col p-4 bg-[#123b4a] text-white rounded-2xl shadow-sm gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#90f4e9] text-xl">campaign</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#90f4e9] font-['DM_Sans']">
              Spotlight Drive
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#002531] text-[#90f4e9] font-semibold font-['DM_Sans']">
            Depot in 3 days
          </span>
        </div>

        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white font-['DM_Sans']">
            Jimbaran Gillnet Circular Recycling Drive
          </h3>
          <p className="text-xs text-[#7fa5b7] mt-1 font-['Inter'] leading-relaxed">
            Collecting degraded poly filament nets with local artisanal boat crews for upcycling into dock bumpers.
          </p>
        </div>

        {/* Multi-segment Recovery Progress Gauge */}
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex justify-between items-center text-xs font-['DM_Sans']">
            <span className="text-[#90f4e9] font-bold">68% of 2-ton pilot goal</span>
            <span className="text-[#7fa5b7]">1,360 / 2,000 kg</span>
          </div>
          <div className="w-full h-3 bg-[#002531] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#90f4e9] transition-all duration-500" style={{ width: '68%' }}></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-[#7fa5b7] text-xs">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="font-['Inter']">Jimbaran Fishing Pier</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onToast('Routing to Jimbaran Collection Depot...');
              onNavigate('explore');
            }}
            className="px-4 py-1.5 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold shadow-xs active:scale-95 transition-all font-['DM_Sans']"
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
            <h2 className="text-base font-bold text-[#151c22] font-['DM_Sans']">Upcoming Opportunities</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('project-details')}
            className="text-xs font-bold text-[#006a63] flex items-center hover:underline font-['DM_Sans']"
          >
            See all <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        {/* Opportunity Card 1 */}
        <div className="flex flex-col bg-white rounded-2xl shadow-xs border border-[#e8eff7] overflow-hidden">
          <div
            className="relative w-full h-36 bg-cover bg-center"
            style={{ backgroundImage: `url(${ASSETS.kutaHarborBoats})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#002531]/80 via-transparent to-transparent"></div>
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#006a63] text-white text-[11px] font-bold shadow-xs font-['DM_Sans']">
              Open to All
            </span>
            <div className="absolute bottom-2 left-3 text-white">
              <span className="text-xs font-medium flex items-center gap-1 font-['DM_Sans']">
                <span className="material-symbols-outlined text-sm">calendar_today</span> Saturday, 8:00 AM
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-1.5">
            <h3 className="text-base font-bold text-[#151c22] font-['DM_Sans']">
              Kuta Harbor Net Sorting &amp; Drop-off
            </h3>
            <p className="text-xs text-[#41484b] font-['Inter'] leading-relaxed">
              Assist fishers categorize collected trawl lines and prepare high-density polyethylene for regional recycling processors.
            </p>

            <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#e8eff7]">
              <div className="flex items-center gap-1.5 text-[#41484b]">
                <span className="material-symbols-outlined text-[#006a63] text-lg">group</span>
                <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">
                  {isRegisteredKuta ? '13/15 registered' : '12/15 registered'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('project-details')}
                  className="px-3 py-1.5 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold active:scale-95 transition-all font-['DM_Sans']"
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleRegisterKuta();
                    if (!isRegisteredKuta) {
                      onToast('Registered for Kuta Harbor shift!', 'check_circle');
                    } else {
                      onToast('Registration cancelled.', 'cancel');
                    }
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all font-['DM_Sans'] flex items-center gap-1 ${
                    isRegisteredKuta
                      ? 'bg-[#90f4e9] text-[#007169]'
                      : 'bg-[#006a63] hover:bg-[#00504a] text-white'
                  }`}
                >
                  {isRegisteredKuta ? (
                    <>
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Joined</span>
                    </>
                  ) : (
                    <span>Join Project</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity Card 2 */}
        <div className="flex flex-col bg-white rounded-2xl shadow-xs border border-[#e8eff7] overflow-hidden">
          <div
            className="relative w-full h-36 bg-cover bg-center"
            style={{ backgroundImage: `url(${ASSETS.sanurCoralDivers})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#002531]/80 via-transparent to-transparent"></div>
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#ffdbd1] text-[#7a2f1b] text-[11px] font-bold shadow-xs font-['DM_Sans']">
              Dive Team + Shore Crew
            </span>
            <div className="absolute bottom-2 left-3 text-white">
              <span className="text-xs font-medium flex items-center gap-1 font-['DM_Sans']">
                <span className="material-symbols-outlined text-sm">calendar_today</span> Sunday, 7:30 AM
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-1.5">
            <h3 className="text-base font-bold text-[#151c22] font-['DM_Sans']">Sanur Coral Net Extraction</h3>
            <div className="inline-flex items-center gap-1 text-[#e8856a] text-[11px] font-semibold bg-[#64200d]/10 px-2 py-0.5 rounded-full w-fit font-['DM_Sans']">
              <span className="material-symbols-outlined text-[13px]">scuba_diving</span>
              Authorized Dive Team only for submerged cuts
            </div>
            <p className="text-xs text-[#41484b] font-['Inter'] leading-relaxed mt-0.5">
              Volunteers needed for shore support crew: handling hoisted wet gear, cataloging marine life bycatch, and weighing bins.
            </p>

            <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#e8eff7]">
              <div className="flex items-center gap-1 text-[#41484b]">
                <span className="material-symbols-outlined text-[#006a63] text-lg">support</span>
                <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Shore Crew Needed</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSanurRegistered(!sanurRegistered);
                  onToast(
                    sanurRegistered
                      ? 'Removed from Sanur Shore Support list.'
                      : 'Signed up for Sanur Shore Support crew!',
                    'task_alt'
                  );
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-all font-['DM_Sans'] ${
                  sanurRegistered
                    ? 'bg-[#90f4e9] text-[#007169]'
                    : 'bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531]'
                }`}
              >
                {sanurRegistered ? 'Enrolled ✓' : 'Support Shore'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
