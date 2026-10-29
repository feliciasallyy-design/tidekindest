import React from 'react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenQuickMenu?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
}) => {
  // Hide on onboarding welcome screen
  if (currentScreen === 'welcome') {
    return null;
  }

  const isHomeActive = currentScreen === 'home';
  const isExploreActive = currentScreen === 'explore';
  const isActionActive = currentScreen === 'actions' || currentScreen === 'report-gear';
  const isProjectsActive = currentScreen === 'project-details';
  const isCommunityActive = currentScreen === 'community-feed' || currentScreen === 'recycling' || currentScreen === 'dossiers';

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#f6faff]/95 backdrop-blur-xl border-t border-[#dce3eb] shadow-[0_-2px_16px_rgba(18,59,74,0.08)] pb-safe">
      <div className="flex items-center justify-between h-16 max-w-lg mx-auto px-2 relative">
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            isHomeActive ? 'text-[#006a63] font-bold' : 'text-[#41484b] hover:text-[#151c22]'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: isHomeActive ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="text-[11px] font-medium leading-tight font-['DM_Sans']">Home</span>
        </button>

        {/* Tab 2: Explore */}
        <button
          type="button"
          onClick={() => onNavigate('explore')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            isExploreActive ? 'text-[#006a63] font-bold' : 'text-[#41484b] hover:text-[#151c22]'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: isExploreActive ? "'FILL' 1" : "'FILL' 0" }}
          >
            explore
          </span>
          <span className="text-[11px] font-medium leading-tight font-['DM_Sans']">Explore</span>
        </button>

        {/* Tab 3: Action (Elevated Floating Center Button with Sonar Glow) */}
        <div className="flex-1 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onNavigate('actions')}
            aria-label="Take Action"
            className={`-top-5 relative w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-[0_8px_25px_-2px_rgba(0,106,99,0.5)] active:scale-90 transition-all duration-200 group ${
              isActionActive
                ? 'bg-[#123b4a] text-white ring-4 ring-[#90f4e9] shadow-[0_0_20px_rgba(144,244,233,0.5)]'
                : 'btn-cool-primary text-white hover:shadow-[0_0_24px_rgba(0,106,99,0.6)]'
            }`}
          >
            <div className="absolute inset-0 rounded-full border border-white/20"></div>
            <span
              className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              add_alert
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider leading-none mt-0.5 font-['DM_Sans']">
              Action
            </span>
          </button>
        </div>

        {/* Tab 4: Projects */}
        <button
          type="button"
          onClick={() => onNavigate('project-details')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            isProjectsActive ? 'text-[#006a63] font-bold' : 'text-[#41484b] hover:text-[#151c22]'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: isProjectsActive ? "'FILL' 1" : "'FILL' 0" }}
          >
            sailing
          </span>
          <span className="text-[11px] font-medium leading-tight font-['DM_Sans']">Projects</span>
        </button>

        {/* Tab 5: Community */}
        <button
          type="button"
          onClick={() => onNavigate('community-feed')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            isCommunityActive ? 'text-[#006a63] font-bold' : 'text-[#41484b] hover:text-[#151c22]'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: isCommunityActive ? "'FILL' 1" : "'FILL' 0" }}
          >
            group
          </span>
          <span className="text-[11px] font-medium leading-tight font-['DM_Sans']">Community</span>
        </button>
      </div>
    </nav>
  );
};
