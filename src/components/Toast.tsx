import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="bg-[#123b4a] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center justify-between gap-2.5 border border-[#90f4e9]/30">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="material-symbols-outlined text-[#90f4e9] shrink-0 text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {toast.icon || 'check_circle'}
          </span>
          <span className="text-xs font-semibold text-white truncate font-['DM_Sans']">
            {toast.message}
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-white/70 hover:text-white p-0.5 rounded-full shrink-0"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
};
