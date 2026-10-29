import React from 'react';
import { ScreenId } from '../types';

interface QuickNavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const QuickNavigatorModal: React.FC<QuickNavigatorModalProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onSelectScreen,
}) => {
  if (!isOpen) return null;

  const screens: { id: ScreenId; num: string; title: string; category: string; icon: string; desc: string }[] = [
    {
      id: 'welcome',
      num: '01',
      title: 'Welcome & Onboarding',
      category: 'Onboarding',
      icon: 'waving_hand',
      desc: 'Field role selector, region picker & impact pledges',
    },
    {
      id: 'home',
      num: '02',
      title: 'Home Dashboard',
      category: 'Overview',
      icon: 'home',
      desc: 'Low tide window, 4-stat impact summary & spotlight drive',
    },
    {
      id: 'explore',
      num: '03',
      title: 'Explore Map & Directory',
      category: 'Geospatial',
      icon: 'map',
      desc: 'Radar map with interactive depot pins & list directory',
    },
    {
      id: 'actions',
      num: '04',
      title: 'Take Action Directory',
      category: 'Action Hub',
      icon: 'add_alert',
      desc: '7 verified pathways with interactive modal workflows',
    },
    {
      id: 'project-details',
      num: '05',
      title: 'Project Details & Registration',
      category: 'Operations',
      icon: 'event_available',
      desc: 'Kuta Harbor sorting drive, live berths & QR pass',
    },
    {
      id: 'shorescan',
      num: '06',
      title: 'ShoreScan AI Detector',
      category: 'Physical AI',
      icon: 'videocam',
      desc: 'ESP32-CAM live viewfinder simulator & edge inference',
    },
    {
      id: 'report-gear',
      num: '07',
      title: 'Report Lost Ghost Gear',
      category: 'Field Intake',
      icon: 'report_problem',
      desc: 'GPS auto-pin, danger level, Exif photo & active reports',
    },
    {
      id: 'dossiers',
      num: '08',
      title: 'Community Reports & Dossiers',
      category: 'Triage Stream',
      icon: 'folder_managed',
      desc: 'Verified regional sightings stream & salvage trails',
    },
    {
      id: 'community-feed',
      num: '09',
      title: 'Community Feed',
      category: 'Collaboration',
      icon: 'forum',
      desc: 'Harbor co-op posts, volunteer calls & milestone updates',
    },
    {
      id: 'recycling',
      num: '10',
      title: 'Repair & Recycling Exchange',
      category: 'Circularity',
      icon: 'recycling',
      desc: 'Net mending lofts, coastal shredders & polymer trade-in',
    },
    {
      id: 'profile',
      num: '11',
      title: 'Steward Profile & Activity Log',
      category: 'Steward Pass',
      icon: 'account_circle',
      desc: 'Alex Steward (Tier 2), QR muster badge & salvage ledger',
    },
    {
      id: 'auth',
      num: '12',
      title: 'Steward Sign In & Access Portal',
      category: 'Authentication',
      icon: 'badge',
      desc: 'Instant 1-click test sign in, avatar picker & password recovery',
    },
    {
      id: 'navigator',
      num: 'All',
      title: 'Prototype Navigator Overview',
      category: 'Master Switchboard',
      icon: 'grid_view',
      desc: 'Full-screen architecture & 4 guided user playbooks',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#dce3eb]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e8eff7] flex items-center justify-between bg-[#f6faff]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#006a63] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-xl">devices</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#006a63]"></span>
                <span className="text-xs font-bold text-[#006a63] uppercase tracking-wider">
                  Screen Switchboard
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#151c22]">All 12 Connected Screens</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#41484b] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* List of screens */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 divide-y divide-[#e8eff7]/60">
          <div className="grid grid-cols-1 gap-2.5">
            {screens.map((s) => {
              const isCurrent = currentScreen === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectScreen(s.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl flex items-start gap-3 transition-all ${
                    isCurrent
                      ? 'bg-[#90f4e9]/30 border-2 border-[#006a63] shadow-sm'
                      : 'bg-[#f6faff] hover:bg-[#eef4fc] border border-transparent'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-[#006a63] text-white'
                        : 'bg-[#e8eff7] text-[#006a63]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{s.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold text-[#006a63] uppercase tracking-wider">
                        Screen {s.num} • {s.category}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-[#006a63] text-white text-[10px] font-bold">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-[#151c22] truncate mt-0.5">
                      {s.title}
                    </div>
                    <p className="text-xs text-[#41484b] mt-0.5 line-clamp-1">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#eef4fc] border-t border-[#dce3eb] flex items-center justify-between text-xs text-[#41484b] px-5">
          <span>Tap any screen to switch immediately</span>
          <button
            onClick={() => {
              onSelectScreen('navigator');
              onClose();
            }}
            className="text-[#006a63] font-bold hover:underline flex items-center gap-1"
          >
            <span>Open Full Playbook Guide</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
