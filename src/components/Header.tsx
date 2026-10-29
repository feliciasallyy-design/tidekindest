import React, { useState } from 'react';
import { ASSETS } from '../data/assets';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  onOpenNotifications?: () => void;
  onOpenQuickMenu?: () => void;
  onOpenNavigator?: () => void;
  isFramed?: boolean;
  onToggleFrame?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  onOpenNotifications,
  onOpenQuickMenu,
  onOpenNavigator,
  isFramed,
  onToggleFrame,
}) => {
  const { user, setAuthModalOpen } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const getScreenTitle = (screen: ScreenId): string => {
    switch (screen) {
      case 'home':
        return 'Home';
      case 'explore':
        return 'Explore Radar';
      case 'actions':
        return 'Action Hub';
      case 'project-details':
        return 'Project Brief';
      case 'shorescan':
        return 'ShoreScan Detector';
      case 'report-gear':
        return 'Log Hazard';
      case 'dossiers':
        return 'Triage Dossiers';
      case 'community-feed':
        return 'Community Feed';
      case 'recycling':
        return 'Circularity Exchange';
      case 'profile':
        return 'Steward Profile';
      case 'auth':
        return 'Steward Portal';
      case 'welcome':
        return 'Onboarding';
      case 'navigator':
        return 'Prototype Navigator';
      default:
        return 'Tidekind';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#123b4a]/95 text-white backdrop-blur-xl shadow-[0_2px_12px_rgba(18,59,74,0.18)]">
        <div className="flex h-16 items-center justify-between px-4 max-w-lg mx-auto">
          {/* Left: Back button or Logo & Region */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {currentScreen !== 'home' && currentScreen !== 'welcome' && (
              <button
                type="button"
                onClick={onBack ? onBack : () => onNavigate('home')}
                className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                aria-label="Go back"
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 hover:opacity-95 active:scale-98 transition-all text-left min-w-0"
              title="Go to Home"
            >
              <img
                src={ASSETS.logo}
                alt="TIDEKIND"
                className="h-8 w-auto object-contain shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#90f4e9] animate-pulse shrink-0"></span>
                  <span className="text-[10px] font-semibold text-[#90f4e9] tracking-wider truncate uppercase font-['DM_Sans']">
                    {user?.location ? user.location : 'Global Marine Grid'}
                  </span>
                </div>
                <span className="text-sm font-bold tracking-tight text-white truncate font-['DM_Sans']">
                  {getScreenTitle(currentScreen)}
                </span>
              </div>
            </button>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Explore / Map Button */}
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="btn-cool-glow inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-[#90f4e9] active:scale-95"
              title="Open Global Ocean Map"
            >
              <span className="material-symbols-outlined text-[15px]">map</span>
              <span className="text-[11px] hidden sm:inline">Map</span>
            </button>

            {/* Quick Screens Button */}
            <button
              type="button"
              onClick={onOpenNavigator ? onOpenNavigator : () => onNavigate('navigator')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-[#90f4e9] transition-all active:scale-95"
              title="Open Prototype Navigator"
            >
              <span className="material-symbols-outlined text-[15px]">apps</span>
              <span className="text-[11px]">Screens</span>
            </button>

            {/* Notifications Button */}
            <button
              type="button"
              onClick={onOpenNotifications ? onOpenNotifications : () => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#90f4e9] animate-ping"></span>
            </button>

            {/* Real-time Indicator & User Profile Avatar */}
            {user ? (
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                aria-label={`${user.name} Profile`}
                className="w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-[#90f4e9] hover:ring-white transition-all overflow-hidden ml-0.5 active:scale-95 shadow-sm"
                title={`${user.name} (${user.badge || 'Steward'}) - Tap to edit profile`}
              >
                <img
                  src={user.avatar || ASSETS.userProfile}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ASSETS.userProfile;
                  }}
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('auth')}
                className="btn-cool-accent inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-all shadow-md"
                title="Sign in or register"
              >
                <span className="material-symbols-outlined text-[15px]">login</span>
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Dropdown Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-end p-4 pt-18">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3.5 bg-[#123b4a] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#90f4e9]">notifications_active</span>
                <span className="font-bold text-xs font-['DM_Sans']">Coastal Operations Alerts</span>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-600 text-base mt-0.5">warning</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 font-['DM_Sans']">Low Tide Drift Alert</p>
                  <p className="text-[11px] text-slate-600 font-['Inter']">
                    Low tide peak at 10:14 AM WITA. Favorable beach survey window active in Sanur Outer Sector.
                  </p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-base mt-0.5">task_alt</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 font-['DM_Sans']">Incident #SS-2025-042 Logged</p>
                  <p className="text-[11px] text-slate-600 font-['Inter']">
                    ShoreScan auto-paired dossier verified by regional quorum.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(false);
                  onNavigate('dossiers');
                }}
                className="text-xs font-bold text-[#006a63] hover:underline font-['DM_Sans']"
              >
                View All Dispatch Logs →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
