import React, { useState } from 'react';
import { ScreenId } from '../types';
import { ASSETS } from '../data/assets';

interface ScreenCommunityFeedProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const ScreenCommunityFeed: React.FC<ScreenCommunityFeedProps> = ({ onNavigate, onToast }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'volunteer' | 'repair' | 'verified'>('all');
  const [post1Helpful, setPost1Helpful] = useState(28);
  const [post1Liked, setPost1Liked] = useState(false);

  const [post2Helpful, setPost2Helpful] = useState(19);
  const [post2Liked, setPost2Liked] = useState(false);
  const [isVolunteeredPost2, setIsVolunteeredPost2] = useState(false);

  const [post3Helpful, setPost3Helpful] = useState(42);
  const [post3Liked, setPost3Liked] = useState(false);

  const [showComposer, setShowComposer] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [newPosts, setNewPosts] = useState<
    Array<{
      id: string;
      author: string;
      role: string;
      time: string;
      content: string;
      tag: string;
      helpful: number;
    }>
  >([]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      author: 'Alex Steward',
      role: 'Tier 2 Coastal Steward • Serangan',
      time: 'Just now',
      content: composerText,
      tag: '#FieldUpdate',
      helpful: 0,
    };

    setNewPosts([newPost, ...newPosts]);
    setComposerText('');
    setShowComposer(false);
    onToast('Field update shared with Bali marine network!', 'send');
  };

  const handleShare = () => {
    onToast('Post link copied to clipboard!', 'share');
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 max-w-lg mx-auto">
      {/* Guidelines Notice Banner */}
      <div className="pt-2">
        <div className="bg-[#123b4a] text-white rounded-2xl p-4 shadow-xs relative overflow-hidden flex items-start gap-3">
          <div className="p-1.5 rounded-full bg-[#006a63] text-white shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-base">verified_user</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#90f4e9] uppercase tracking-wider font-['DM_Sans']">
                Field Standards
              </span>
              <span className="material-symbols-outlined text-xs text-white/60">info</span>
            </div>
            <p className="text-xs text-[#7fa5b7] mt-0.5 leading-snug font-['Inter']">
              Respectful, collaborative marine action. Never post sensitive wildlife coordinates or unverified claims.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action & Post Trigger */}
      <div className="pt-3">
        <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-[#e8eff7] flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#006a63] shrink-0">
            <span className="material-symbols-outlined text-lg">edit_note</span>
          </div>
          <button
            type="button"
            onClick={() => setShowComposer(true)}
            className="flex-1 text-left bg-[#eef4fc] hover:bg-[#e8eff7] text-[#41484b] text-xs py-2 px-3 rounded-full transition-colors truncate font-['Inter']"
          >
            Share an update, request volunteers, or report gear progress...
          </button>
          <button
            type="button"
            onClick={() => {
              setShowComposer(true);
              onToast('Attach photo to field update');
            }}
            className="w-9 h-9 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] flex items-center justify-center text-[#002531] transition-colors shrink-0"
            aria-label="Attach Field Photo"
          >
            <span className="material-symbols-outlined text-lg">add_a_photo</span>
          </button>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="pt-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all font-['DM_Sans'] ${
              activeTab === 'all'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:text-[#151c22]'
            }`}
          >
            All Updates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('volunteer')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all font-['DM_Sans'] ${
              activeTab === 'volunteer'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:text-[#151c22]'
            }`}
          >
            Volunteer Requests
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('repair')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all font-['DM_Sans'] ${
              activeTab === 'repair'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:text-[#151c22]'
            }`}
          >
            Repair &amp; Repurposing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verified')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all font-['DM_Sans'] ${
              activeTab === 'verified'
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:text-[#151c22]'
            }`}
          >
            Verified Outcomes
          </button>
        </div>
      </div>

      {/* Feed Container */}
      <div className="pt-3 flex flex-col gap-3.5">
        {/* User-submitted new posts */}
        {newPosts.map((np) => (
          <article
            key={np.id}
            className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] flex flex-col gap-2 animate-in fade-in duration-300"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#006a63] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  AS
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#151c22] truncate font-['DM_Sans']">{np.author}</span>
                  <span className="text-[11px] text-[#41484b] truncate font-['Inter']">{np.role}</span>
                  <span className="text-[10px] text-[#72787c]">{np.time}</span>
                </div>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#90f4e9] text-[#00504a] font-['DM_Sans']">
                {np.tag}
              </span>
            </div>
            <p className="text-xs text-[#151c22] leading-relaxed font-['Inter']">{np.content}</p>
          </article>
        ))}

        {/* FEED POST 1: Repair & Repurposing Milestone */}
        {(activeTab === 'all' || activeTab === 'repair') && (
          <article className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] flex flex-col gap-2.5">
            {/* Author Row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#123b4a] text-white flex items-center justify-center font-bold text-xs font-['DM_Sans']">
                    BS
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#90f4e9] text-[#00201d] rounded-full p-0.5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[11px] font-bold">anchor</span>
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#151c22] truncate font-['DM_Sans']">Budi Santoso</span>
                    <span className="material-symbols-outlined text-[#006a63] text-xs">verified</span>
                  </div>
                  <span className="text-[11px] text-[#41484b] truncate font-['Inter']">
                    Serangan Fishermen Cooperative Lead
                  </span>
                  <span className="text-[10px] text-[#72787c]">2h ago • Serangan Depot, Bali</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToast('Post flagged for harbor steward review')}
                className="text-[#72787c] hover:text-[#ba1a1a] p-1 rounded-full transition-colors"
                title="Flag post"
              >
                <span className="material-symbols-outlined text-lg">flag</span>
              </button>
            </div>

            {/* Tag */}
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#90f4e9]/50 text-[#00504a] font-['DM_Sans']">
                <span className="material-symbols-outlined text-xs">build_circle</span>
                #RepairBeforeReplace
              </span>
            </div>

            {/* Content */}
            <p className="text-xs text-[#151c22] leading-relaxed font-['Inter']">
              Completed our weekend net mending session with 14 local fishers. Instead of discarding damaged trammel
              nets, we reinforced 240 meters with recycled twine provided by TIDEKIND depot.
            </p>

            {/* Visual Card */}
            <div className="rounded-xl overflow-hidden bg-[#002531] relative">
              <img
                src={ASSETS.fishermenRepairing}
                alt="Fishermen repairing nets"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-[#002531]/80 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 text-white text-[10px] font-bold font-['DM_Sans']">
                <span className="material-symbols-outlined text-xs">straighten</span>
                <span>240m Restored</span>
              </div>
            </div>

            {/* Stats Bar & Actions */}
            <div className="pt-1 flex items-center justify-between border-t border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = !post1Liked;
                    setPost1Liked(next);
                    setPost1Helpful(next ? post1Helpful + 1 : post1Helpful - 1);
                    onToast(next ? 'Marked as helpful!' : 'Removed helpful mark');
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors font-['DM_Sans'] ${
                    post1Liked
                      ? 'bg-[#90f4e9] text-[#00504a]'
                      : 'bg-[#eef4fc] hover:bg-[#e8eff7] text-[#41484b]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">thumb_up</span>
                  <span>{post1Helpful} Helpful</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToast('Viewing 6 community comments')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eef4fc] hover:bg-[#e8eff7] text-[#41484b] text-xs font-bold transition-colors font-['DM_Sans']"
                >
                  <span className="material-symbols-outlined text-base">mode_comment</span>
                  <span>6</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eef4fc] hover:bg-[#e8eff7] text-[#41484b] text-xs font-bold transition-colors font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-base">share</span>
                <span>Share</span>
              </button>
            </div>
          </article>
        )}

        {/* FEED POST 2: Urgent Volunteer Call */}
        {(activeTab === 'all' || activeTab === 'volunteer') && (
          <article className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#006a63] text-white flex items-center justify-center font-bold text-xs font-['DM_Sans']">
                    SJ
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#ffdbd1] text-[#7a2f1b] rounded-full p-0.5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[11px] font-bold">campaign</span>
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#151c22] truncate font-['DM_Sans']">Sarah Jenkins</span>
                    <span className="material-symbols-outlined text-[#006a63] text-xs">handshake</span>
                  </div>
                  <span className="text-[11px] text-[#41484b] truncate font-['Inter']">Ocean Action Bali Coordinator</span>
                  <span className="text-[10px] text-[#72787c]">5h ago • Benoa Port Hub</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToast('Post flagged for harbor steward review')}
                className="text-[#72787c] hover:text-[#ba1a1a] p-1 rounded-full transition-colors"
                title="Flag post"
              >
                <span className="material-symbols-outlined text-lg">flag</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdbd1] text-[#7a2f1b] font-['DM_Sans']">
                <span className="material-symbols-outlined text-xs">assignment_late</span>
                #VolunteerOpportunity
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8eff7] text-[#41484b] font-['DM_Sans']">
                <span className="material-symbols-outlined text-xs">schedule</span>
                This Thursday, 08:30 WITA
              </span>
            </div>

            <p className="text-xs text-[#151c22] leading-relaxed font-['Inter']">
              Seeking 5 volunteers this Thursday at Benoa Port to assist with weighing, tagging, and baling nylon trawl
              nets before shipment to recycling facility. Gloves and safety boots provided.
            </p>

            {/* Volunteer Metric & Progress Box */}
            <div className="bg-[#eef4fc] rounded-2xl p-3 flex flex-col gap-2 border border-[#dce3eb]/50">
              <div className="flex items-center justify-between text-xs font-['DM_Sans']">
                <span className="text-[#41484b]">Crew Capacity</span>
                <span className="font-bold text-[#006a63]">
                  {isVolunteeredPost2 ? '4/5 spots filled' : '3/5 spots filled'}
                </span>
              </div>

              <div className="w-full bg-[#dce3eb] rounded-full h-2.5 overflow-hidden flex">
                <div
                  className="bg-[#006a63] h-full rounded-full transition-all duration-300"
                  style={{ width: isVolunteeredPost2 ? '80%' : '60%' }}
                ></div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <div className="w-5 h-5 rounded-full bg-[#002531] text-white text-[9px] flex items-center justify-center font-bold">
                    RA
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#90f4e9] text-[#00201d] text-[9px] flex items-center justify-center font-bold">
                    WT
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#64200d] text-white text-[9px] flex items-center justify-center font-bold">
                    LK
                  </div>
                </div>
                <span className="text-[11px] text-[#41484b] font-['DM_Sans'] font-medium">
                  {isVolunteeredPost2 ? '1 berth open' : '2 berths open'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !isVolunteeredPost2;
                  setIsVolunteeredPost2(next);
                  onToast(
                    next ? 'Registered for Benoa Port crew!' : 'Registration cancelled',
                    next ? 'check' : 'cancel'
                  );
                }}
                className={`w-full mt-1 font-bold text-xs py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98 font-['DM_Sans'] ${
                  isVolunteeredPost2
                    ? 'bg-[#90f4e9] text-[#00504a]'
                    : 'bg-[#006a63] hover:bg-[#00504a] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isVolunteeredPost2 ? 'check' : 'person_add'}
                </span>
                <span>{isVolunteeredPost2 ? 'Registered for Shift' : 'Register to Help'}</span>
              </button>
            </div>

            {/* Stats Bar */}
            <div className="pt-1 flex items-center justify-between border-t border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = !post2Liked;
                    setPost2Liked(next);
                    setPost2Helpful(next ? post2Helpful + 1 : post2Helpful - 1);
                    onToast(next ? 'Marked as helpful!' : 'Removed helpful mark');
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors font-['DM_Sans'] ${
                    post2Liked
                      ? 'bg-[#90f4e9] text-[#00504a]'
                      : 'bg-[#eef4fc] hover:bg-[#e8eff7] text-[#41484b]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">thumb_up</span>
                  <span>{post2Helpful} Helpful</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToast('Viewing 4 community comments')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eef4fc] hover:bg-[#e8eff7] text-[#41484b] text-xs font-bold transition-colors font-['DM_Sans']"
                >
                  <span className="material-symbols-outlined text-base">mode_comment</span>
                  <span>4</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eef4fc] hover:bg-[#e8eff7] text-[#41484b] text-xs font-bold transition-colors font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-base">share</span>
                <span>Share</span>
              </button>
            </div>
          </article>
        )}

        {/* FEED POST 3: Circular Recycling Milestone */}
        {(activeTab === 'all' || activeTab === 'verified') && (
          <article className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7] flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#002531] text-white flex items-center justify-center font-bold text-xs font-['DM_Sans']">
                    DS
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#006a63] text-white rounded-full p-0.5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[11px] font-bold">recycling</span>
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#151c22] truncate font-['DM_Sans']">PT Daur Samudera</span>
                    <span className="material-symbols-outlined text-[#006a63] text-xs">verified</span>
                  </div>
                  <span className="text-[11px] text-[#41484b] truncate font-['Inter']">
                    Recycling Partner • Industrial Tier
                  </span>
                  <span className="text-[10px] text-[#72787c]">1d ago • Sidoarjo Facility</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToast('Post flagged for harbor steward review')}
                className="text-[#72787c] hover:text-[#ba1a1a] p-1 rounded-full transition-colors"
                title="Flag post"
              >
                <span className="material-symbols-outlined text-lg">flag</span>
              </button>
            </div>

            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#90f4e9] text-[#00504a] font-['DM_Sans']">
                <span className="material-symbols-outlined text-xs">autorenew</span>
                #MaterialCircularity
              </span>
            </div>

            <p className="text-xs text-[#151c22] leading-relaxed font-['Inter']">
              First batch of 450kg marine nylon from the Kuta pilot successfully cleaned and chipped for pellet
              extrusion test! Traceability batch certificate #ID-KT-088 verified.
            </p>

            <div className="bg-[#eef4fc] rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-[#dce3eb]/50">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#41484b] font-['Inter']">Reclaimed Polymer</span>
                <span className="text-base font-bold text-[#002531] font-['DM_Sans']">450 kg Net Mass</span>
                <span className="text-[11px] text-[#006a63] font-bold flex items-center gap-1 mt-0.5 font-['DM_Sans']">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Extrusion Ready
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#006a63]/10 flex items-center justify-center text-[#006a63] shrink-0">
                <span className="material-symbols-outlined text-2xl">token</span>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="pt-1 flex items-center justify-between border-t border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = !post3Liked;
                    setPost3Liked(next);
                    setPost3Helpful(next ? post3Helpful + 1 : post3Helpful - 1);
                    onToast(next ? 'Marked as helpful!' : 'Removed helpful mark');
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors font-['DM_Sans'] ${
                    post3Liked
                      ? 'bg-[#90f4e9] text-[#00504a]'
                      : 'bg-[#eef4fc] hover:bg-[#e8eff7] text-[#41484b]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">thumb_up</span>
                  <span>{post3Helpful} Helpful</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToast('Viewing 8 community comments')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eef4fc] hover:bg-[#e8eff7] text-[#41484b] text-xs font-bold transition-colors font-['DM_Sans']"
                >
                  <span className="material-symbols-outlined text-base">mode_comment</span>
                  <span>8</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eef4fc] hover:bg-[#e8eff7] text-[#41484b] text-xs font-bold transition-colors font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-base">share</span>
                <span>Share</span>
              </button>
            </div>
          </article>
        )}
      </div>

      {/* Post Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 bg-[#002531]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#e8eff7] pb-2 mb-3">
              <h3 className="text-base font-bold text-[#002531] font-['DM_Sans']">Share Community Update</h3>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#72787c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3">
              <textarea
                rows={4}
                required
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Share field progress, volunteer needs, or salvage updates with the Bali & East Java marine network..."
                className="w-full p-3 rounded-2xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1] resize-none font-['Inter'] leading-relaxed"
              ></textarea>

              <div className="flex items-center justify-between text-xs text-[#41484b]">
                <button
                  type="button"
                  onClick={() => onToast('Attached photo: IMG_FIELD_HARBOR.jpg')}
                  className="flex items-center gap-1 text-[#006a63] font-bold font-['DM_Sans']"
                >
                  <span className="material-symbols-outlined text-lg">add_a_photo</span>
                  <span>Add Photo</span>
                </button>
                <span className="text-[10px] text-[#72787c]">Tagged: #BaliPilot</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#006a63] hover:bg-[#00504a] text-white font-bold text-xs shadow-md active:scale-95 transition-transform font-['DM_Sans']"
              >
                Publish to Community
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
