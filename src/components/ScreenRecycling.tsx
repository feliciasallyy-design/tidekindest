import React, { useState } from 'react';
import { ScreenId } from '../types';
import { ASSETS } from '../data/assets';

interface ScreenRecyclingProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const ScreenRecycling: React.FC<ScreenRecyclingProps> = ({ onNavigate, onToast }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'repair' | 'depots' | 'recycling'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showMendingModal, setShowMendingModal] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMendingModal(false);
    onToast('Mending slot reserved with Pak Budi at Serangan Loft!', 'handyman');
  };

  const handlePartnerOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPartnerModal(false);
    onToast('Facility application submitted for Bali Pilot review!', 'task_alt');
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 max-w-lg mx-auto">
      {/* Top Header */}
      <div className="pt-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="w-9 h-9 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] flex items-center justify-center text-[#002531] transition-colors"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-[#006a63] font-bold font-['DM_Sans']">
              Circularity Network
            </span>
            <h1 className="text-xl font-bold text-[#002531] font-['DM_Sans'] truncate">Resource Exchange</h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <span className="material-symbols-outlined text-[#72787c] absolute left-3.5 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nylon 6, lofts, depots, riggers..."
            className="w-full h-11 pl-10 pr-10 bg-white text-[#151c22] placeholder:text-[#72787c] text-xs rounded-full shadow-xs border border-[#e8eff7] focus:outline-none focus:ring-2 focus:ring-[#006a63] font-['Inter']"
          />
          <button
            type="button"
            onClick={() => onToast('Displaying certified maritime polymer processors')}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[#72787c] hover:text-[#151c22]"
          >
            <span className="material-symbols-outlined text-lg">tune</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setActiveFilter('repair')}
            className={`shrink-0 h-9 px-3.5 rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 font-['DM_Sans'] ${
              activeFilter === 'repair'
                ? 'bg-[#006a63] text-white'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            <span className="material-symbols-outlined text-base">handyman</span>
            <span>Repair Lofts &amp; Mending</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('depots')}
            className={`shrink-0 h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors font-['DM_Sans'] ${
              activeFilter === 'depots'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            <span className="material-symbols-outlined text-base">warehouse</span>
            <span>Collection &amp; Drop Depots</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('recycling')}
            className={`shrink-0 h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors font-['DM_Sans'] ${
              activeFilter === 'recycling'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            <span className="material-symbols-outlined text-base">recycling</span>
            <span>Recycling &amp; Chipping Hubs</span>
          </button>
        </div>

        {/* Active Trade-in Bonus Banner */}
        <div className="w-full bg-[#123b4a] text-white rounded-2xl p-4 relative overflow-hidden shadow-sm mt-1">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#90f4e9]/10 pointer-events-none blur-2xl"></div>
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#006a63] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <span className="material-symbols-outlined text-xl">currency_exchange</span>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#90f4e9]/20 text-[#90f4e9] text-[10px] font-bold px-2 py-0.5 rounded-full font-['DM_Sans']">
                  Active Trade-in Bonus
                </span>
                <span className="text-[#7fa5b7] text-[10px] font-['DM_Sans']">Bali Pilot Zone</span>
              </div>
              <p className="text-xs text-white/90 leading-snug font-['Inter']">
                <strong className="text-[#90f4e9] font-bold">Circular Net Trade-in:</strong> Receive{' '}
                <span className="font-bold text-white">Rp 4,000 / kg</span> incentive for clean sorted monofilament or
                exchange directly for repaired leadline spools.
              </p>
              <div className="pt-1 flex items-center">
                <button
                  type="button"
                  onClick={() => onNavigate('explore')}
                  className="inline-flex items-center gap-1 text-xs text-[#90f4e9] font-bold hover:underline font-['DM_Sans']"
                >
                  <span>Find nearest weigh station</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subheader */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006a63]"></span>
            <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Verified Maritime Facilities</span>
          </div>
          <span className="text-xs text-[#72787c] font-['Inter']">3 Results Nearby</span>
        </div>

        {/* Facilities List */}
        <div className="flex flex-col gap-3.5">
          {/* Facility 1 */}
          {(activeFilter === 'all' || activeFilter === 'repair') && (
            <div className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#006a63]/10 text-[#006a63] text-[10px] px-2.5 py-0.5 rounded-full font-bold font-['DM_Sans']">
                    Net Repair Service
                  </span>
                  <div className="flex items-center gap-1 text-[#72787c] text-xs font-['DM_Sans']">
                    <span className="w-2 h-2 rounded-full bg-[#006a63] shrink-0"></span>
                    <span>Open Mon-Sat</span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-[#151c22] pt-0.5 font-['DM_Sans']">
                  Serangan Artisanal Net Mending Loft
                </h2>
                <div className="flex items-center gap-1.5 text-[#41484b] text-xs font-['Inter']">
                  <span className="material-symbols-outlined text-base text-[#006a63] shrink-0">verified_user</span>
                  <span className="truncate">Master Riggers: Pak Budi &amp; Serangan Fisher Co-op</span>
                </div>
              </div>

              <div className="w-full h-36 rounded-xl overflow-hidden relative shadow-inner">
                <img
                  src={ASSETS.pakBudiMending}
                  alt="Pak Budi mending nets"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <span className="material-symbols-outlined text-sm text-[#006a63]">pace</span>
                  <span className="text-xs text-[#151c22] font-bold font-['DM_Sans']">24–48h Turnaround</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 bg-[#eef4fc] p-2.5 rounded-xl border border-[#dce3eb]/50">
                <span className="text-[10px] text-[#41484b] uppercase tracking-wider font-bold font-['DM_Sans']">
                  Accepted Services
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="bg-white text-[#151c22] text-xs px-2.5 py-0.5 rounded-full shadow-xs font-['Inter']">
                    Trammel net re-braiding
                  </span>
                  <span className="bg-white text-[#151c22] text-xs px-2.5 py-0.5 rounded-full shadow-xs font-['Inter']">
                    Patch stitching
                  </span>
                  <span className="bg-white text-[#151c22] text-xs px-2.5 py-0.5 rounded-full shadow-xs font-['Inter']">
                    Cork line replacement
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#41484b] pt-0.5">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="material-symbols-outlined text-base text-[#006a63] shrink-0">near_me</span>
                  <span className="truncate font-['Inter']">Jl. Pelabuhan Serangan No. 8</span>
                </div>
                <span className="text-xs font-bold text-[#006a63] shrink-0 font-['DM_Sans']">3.2 km away</span>
              </div>

              <div className="flex flex-col gap-2 pt-1 border-t border-[#e8eff7]">
                <button
                  type="button"
                  onClick={() => setShowMendingModal(true)}
                  className="w-full h-11 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all font-['DM_Sans']"
                >
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  <span>Request Mending Slot</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onToast('Launching GPS directions to Serangan Loft...', 'directions')}
                    className="h-10 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center justify-center gap-1 active:scale-98 transition-all font-['DM_Sans']"
                  >
                    <span className="material-symbols-outlined text-base text-[#006a63]">directions</span>
                    <span>Directions</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToast('Connecting call to Pak Budi (+62 812-3921-990)...', 'call')}
                    className="h-10 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center justify-center gap-1 active:scale-98 transition-all font-['DM_Sans']"
                  >
                    <span className="material-symbols-outlined text-base text-[#006a63]">call</span>
                    <span>Call Workshop</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Facility 2 */}
          {(activeFilter === 'all' || activeFilter === 'depots') && (
            <div className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#90f4e9]/50 text-[#00504a] text-[10px] px-2.5 py-0.5 rounded-full font-bold font-['DM_Sans']">
                    Gear Collection Depot
                  </span>
                  <div className="flex items-center gap-1 text-[#72787c] text-xs font-['DM_Sans']">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>Daily 08:00 - 17:00</span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-[#151c22] pt-0.5 font-['DM_Sans']">
                  Kusamba Coastal Shredder &amp; Collection Depot
                </h2>
                <div className="flex items-center gap-1 text-[#41484b] text-xs font-['Inter']">
                  <span className="material-symbols-outlined text-base text-[#006a63] shrink-0">location_on</span>
                  <span className="truncate">Kusamba Fisher Port, Klungkung</span>
                </div>
              </div>

              {/* Weekly load progress */}
              <div className="bg-[#eef4fc] p-3 rounded-xl flex flex-col gap-1 border border-[#dce3eb]/50">
                <div className="flex items-center justify-between text-xs font-['DM_Sans']">
                  <span className="font-semibold text-[#151c22]">Weekly Depot Load</span>
                  <span className="font-bold text-[#006a63]">65% Full (780 / 1,200 kg)</span>
                </div>
                <div className="w-full h-2.5 bg-[#dce3eb] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#006a63] rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-[10px] text-[#72787c] font-['Inter'] pt-0.5">
                  Capacity resets every Monday morning after barge transfer.
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#41484b] uppercase tracking-wider font-bold font-['DM_Sans']">
                  Accepted Materials
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-[#e8eff7] text-[#151c22] text-xs px-2.5 py-1 rounded-full font-['Inter']">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006a63]"></span>Nylon 6 gillnets
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#e8eff7] text-[#151c22] text-xs px-2.5 py-1 rounded-full font-['Inter']">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006a63]"></span>HDPE trawl lines
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#e8eff7] text-[#151c22] text-xs px-2.5 py-1 rounded-full font-['Inter']">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006a63]"></span>Plastic floats
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#ffdad6] text-[#93000a] text-xs px-2.5 py-1 rounded-full font-bold font-['DM_Sans']">
                    <span className="material-symbols-outlined text-sm">block</span>NO wire traps
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#eef4fc] flex items-start gap-2 border border-[#dce3eb]/50">
                <span className="material-symbols-outlined text-[#006a63] text-lg shrink-0 mt-0.5">cleaning_services</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Preparation Guide</span>
                  <p className="text-[11px] text-[#41484b] font-['Inter']">
                    Must be salt-rinsed and free of organic matter before drop-off to qualify for compensation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#e8eff7]">
                <button
                  type="button"
                  onClick={() => onToast('Scheduled drop-off for Kusamba Depot: Dock slot 2 reserved')}
                  className="h-10 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all font-['DM_Sans']"
                >
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>Schedule Drop-off</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToast('Viewing Kusamba Material Grade & Sorting Checklist')}
                  className="h-10 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all font-['DM_Sans']"
                >
                  <span className="material-symbols-outlined text-base text-[#006a63]">info</span>
                  <span>Material Guide</span>
                </button>
              </div>
            </div>
          )}

          {/* Facility 3 */}
          {(activeFilter === 'all' || activeFilter === 'recycling') && (
            <div className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#c2e8fb] text-[#002531] text-[10px] px-2.5 py-0.5 rounded-full font-bold font-['DM_Sans']">
                    Certified Industrial Recycler
                  </span>
                  <div className="flex items-center gap-1 text-[#006a63] text-xs font-bold font-['DM_Sans']">
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>ISO 14001</span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-[#151c22] pt-0.5 font-['DM_Sans']">
                  PT Daur Samudera Polymer Chipping Facility
                </h2>
                <div className="flex items-center gap-1 text-[#41484b] text-xs font-['Inter']">
                  <span className="material-symbols-outlined text-base text-[#006a63] shrink-0">factory</span>
                  <span className="truncate">Banyuwangi Industrial Marine Corridor</span>
                </div>
              </div>

              <div className="w-full h-32 rounded-xl overflow-hidden relative shadow-inner">
                <img
                  src={ASSETS.polymerPlant}
                  alt="Polymer chipping facility"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002531]/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-white text-xs font-bold flex items-center gap-1 font-['DM_Sans']">
                    <span className="material-symbols-outlined text-sm text-[#90f4e9]">token</span>
                    High-purity recycled ocean granules (rPA6)
                  </span>
                </div>
              </div>

              <div className="bg-[#eef4fc] p-2.5 rounded-xl border border-[#dce3eb]/50 flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#006a63] text-base shrink-0 mt-0.5">change_circle</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#151c22] font-['DM_Sans']">Circular Destination</span>
                    <p className="text-[11px] text-[#41484b] font-['Inter']">
                      Reclaimed marine pellets batch-certified for high-tensile outdoor furniture &amp; technical textiles.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#dce3eb]/60 text-xs font-['DM_Sans']">
                  <span className="text-[#41484b]">Minimum Consignment</span>
                  <span className="text-[#002531] font-bold bg-[#dce3eb] px-2 py-0.5 rounded-full text-[11px]">
                    50 kg bulk
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1 border-t border-[#e8eff7]">
                <button
                  type="button"
                  onClick={() => onToast('Inquiry docket created for PT Daur Samudera bulk procurement')}
                  className="w-full h-10 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all font-['DM_Sans']"
                >
                  <span className="material-symbols-outlined text-base">local_shipping</span>
                  <span>Inquire for Bulk Batch</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToast('Circularity certificate #ID-KT-088 verified on ledger')}
                  className="w-full h-10 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all font-['DM_Sans']"
                >
                  <span className="material-symbols-outlined text-base text-[#006a63]">workspace_premium</span>
                  <span>View Circularity Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Partner CTA */}
        <div className="w-full bg-[#e8eff7] rounded-2xl p-4 shadow-xs mt-2 flex flex-col items-center text-center gap-2 border border-[#dce3eb]">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#006a63] shadow-xs">
            <span className="material-symbols-outlined text-xl">add_business</span>
          </div>
          <div className="flex flex-col gap-0.5 max-w-xs">
            <h3 className="text-sm font-bold text-[#151c22] font-['DM_Sans']">Are you a rigger or recycling partner?</h3>
            <p className="text-xs text-[#41484b] font-['Inter']">
              Expand your reach across East Java and Bali fishermen while bolstering ocean recovery.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPartnerModal(true)}
            className="w-full h-10 rounded-full bg-[#002531] hover:bg-[#123b4a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all mt-1 font-['DM_Sans']"
          >
            <span className="material-symbols-outlined text-base">handshake</span>
            <span>Offer a Repair or Drop Service (Submit for Review)</span>
          </button>
        </div>
      </div>

      {/* Mending Booking Modal */}
      {showMendingModal && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#e8eff7] pb-2 mb-3">
              <h3 className="text-base font-bold text-[#002531] font-['DM_Sans']">Request Net Mending Slot</h3>
              <button
                type="button"
                onClick={() => setShowMendingModal(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">Net Type</label>
                <select className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-xs text-[#151c22]">
                  <option>Trammel Net (3-wall nylon)</option>
                  <option>Gillnet (Monofilament)</option>
                  <option>Purse Seine Net (Polyester)</option>
                  <option>Longline Rigging Cord</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">Estimated Meters Damaged</label>
                <input
                  type="number"
                  defaultValue="40"
                  className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-xs text-[#151c22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">Preferred Date</label>
                <input
                  type="date"
                  defaultValue="2025-05-20"
                  className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-xs text-[#151c22]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold shadow-md active:scale-95 transition-transform font-['DM_Sans']"
              >
                Confirm Mending Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Partner Registration Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#e8eff7] pb-2 mb-3">
              <h3 className="text-base font-bold text-[#002531] font-['DM_Sans']">Register Facility / Loft</h3>
              <button
                type="button"
                onClick={() => setShowPartnerModal(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handlePartnerOffer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">Facility Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Padang Bai Co-op Loft"
                  className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-xs text-[#151c22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">Service Offered</label>
                <select className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-xs text-[#151c22]">
                  <option>Net Mending &amp; Braiding</option>
                  <option>Collection &amp; Drop Depot</option>
                  <option>Polymer Chipping &amp; Granulation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1 font-['DM_Sans']">Harbor / Port Location</label>
                <input
                  type="text"
                  required
                  placeholder="Port or Pier location"
                  className="w-full h-11 px-3 rounded-xl bg-[#eef4fc] text-xs text-[#151c22]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-bold shadow-md active:scale-95 transition-transform font-['DM_Sans']"
              >
                Submit Facility for Pilot Integration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
