import React from 'react';
import { ScreenId } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const alerts = [
    {
      id: '1',
      title: 'Low Tide Survey Window Open',
      desc: 'Optimal beach triage conditions at Sanur Reef until 12:45 PM (-0.4m swell).',
      time: '18 min ago',
      icon: 'water_drop',
      type: 'tide',
      screen: 'home' as ScreenId,
    },
    {
      id: '2',
      title: 'Muster Berth Confirmed #12',
      desc: 'Kuta Harbor Net Sorting gate pass issued for Saturday 08:00 WITA.',
      time: '1 hour ago',
      icon: 'badge',
      type: 'project',
      screen: 'project-details' as ScreenId,
    },
    {
      id: '3',
      title: 'ShoreScan AI Cam Node Synced',
      desc: 'ESP32CAM-v1.4 paired at Sanur Sector 3. Model INT8 initialized.',
      time: '3 hours ago',
      icon: 'videocam',
      type: 'ai',
      screen: 'shorescan' as ScreenId,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b pb-2 border-[#e8eff7]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006a63] text-xl">notifications</span>
            <h3 className="text-sm font-bold text-[#151c22]">Pilot Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto">
          {alerts.map((a) => (
            <div
              key={a.id}
              onClick={() => {
                onNavigate(a.screen);
                onClose();
              }}
              className="p-3 rounded-2xl bg-[#f6faff] hover:bg-[#eef4fc] cursor-pointer transition-all border border-[#e8eff7] space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#002531] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#006a63]">{a.icon}</span>
                  <span>{a.title}</span>
                </span>
                <span className="text-[10px] text-[#72787c]">{a.time}</span>
              </div>
              <p className="text-[11px] text-[#41484b] leading-snug">{a.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-bold"
        >
          Dismiss All
        </button>
      </div>
    </div>
  );
};
