import React, { useState, useRef } from 'react';
import { ASSETS } from '../data/assets';
import { ScreenId, User } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const GLOBAL_LOCATION_OPTIONS = [
  'Sanur, Bali, Indonesia',
  'Serangan Harbor, Bali, Indonesia',
  'Raja Ampat, West Papua, Indonesia',
  'Komodo National Park, Flores, Indonesia',
  'Kaneohe Bay, Oahu, Hawaii, USA',
  'Maalaea Harbor, Maui, Hawaii, USA',
  'Monterey Bay, California, USA',
  'Great Barrier Reef, Queensland, Australia',
  'Cyclades, Paros Island, Greece',
  'Palma de Mallorca, Balearic Islands, Spain',
  'Cozumel, Riviera Maya, Mexico',
  'Horta Marina, Faial Island, Azores, Portugal',
  'Puerto Ayora, Galápagos Islands, Ecuador',
];

const STEWARD_AVATAR_PRESETS = [
  { label: 'Alex (Scout)', url: ASSETS.alexSteward, role: 'Tier 2 Steward' },
  { label: 'Pak Budi (Rigger)', url: ASSETS.pakBudiMending, role: 'Master Rigger' },
  { label: 'Dr. Sarah (Biologist)', url: ASSETS.sarahJenkins, role: 'Lead Biologist' },
  { label: 'Diver Sentinel', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80', role: 'Diver Specialist' },
  { label: 'Coral Ranger', url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=400&q=80', role: 'Reef Guardian' },
  { label: 'Vessel Skipper', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', role: 'Vessel Captain' },
  { label: 'Ocean Sentinel Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=tidekind_sentinel', role: 'Autonomous ROV Pilot' },
  { label: 'Turtle Scout', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ocean_scout', role: 'Marine Scout' },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, showToast }) => {
  const {
    user,
    logout,
    updateProfile,
    logActivity,
    switchDemoAccount,
    setAuthModalOpen,
    setAuthMode,
    activityLogs,
  } = useAuth();

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Settings Toggles
  const [tideAlerts, setTideAlerts] = useState(true);
  const [salvageCalls, setSalvageCalls] = useState(true);
  const [fuzzyGps, setFuzzyGps] = useState(true);

  // Log Form State
  const [logCategory, setLogCategory] = useState('Net Recovery');
  const [logWeight, setLogWeight] = useState('32');
  const [logHours, setLogHours] = useState('4.0');
  const [logLocation, setLogLocation] = useState(user?.location || 'Sanur Outer Reef');
  const [verificationMethod, setVerificationMethod] = useState('Harbor Certified Scale');
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  // Edit Profile Form State (EVERYTHING CAN CHANGE)
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [editChapter, setEditChapter] = useState(user?.chapter || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [editRole, setEditRole] = useState(user?.role || 'Steward');
  const [editBadge, setEditBadge] = useState(user?.badge || 'Tier 1 Steward');
  const [editGearKg, setEditGearKg] = useState(String(user?.stats?.gearDivertedKg || 0));
  const [editHours, setEditHours] = useState(String(user?.stats?.hoursLogged || 0));
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // File upload input ref for avatar
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Sync form when user changes
  React.useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditBio(user.bio);
      setEditLocation(user.location);
      setEditChapter(user.chapter);
      setEditAvatar(user.avatar);
      setEditRole(user.role);
      setEditBadge(user.badge);
      setEditGearKg(String(user.stats?.gearDivertedKg || 0));
      setEditHours(String(user.stats?.hoursLogged || 0));
      setLogLocation(user.location);
    }
  }, [user]);

  // Handle local image file upload & convert to Data URL
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file too large (max 5MB)', 'error', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditAvatar(result);
        try {
          await updateProfile({ avatar: result });
          showToast('Profile photo updated from device!', 'photo_camera', 'success');
        } catch (err: any) {
          showToast(err.message || 'Failed saving avatar', 'error', 'error');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = async (url: string, roleTitle?: string) => {
    setEditAvatar(url);
    try {
      await updateProfile({
        avatar: url,
        ...(roleTitle ? { badge: roleTitle } : {}),
      });
      showToast('New avatar applied!', 'check_circle', 'success');
      setIsPhotoStudioOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed applying avatar', 'error', 'error');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty', 'error', 'error');
      return;
    }
    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: editName.trim(),
        email: editEmail.trim(),
        bio: editBio.trim(),
        location: editLocation.trim(),
        chapter: editChapter.trim(),
        avatar: editAvatar.trim(),
        role: editRole,
        badge: editBadge.trim(),
        stats: {
          gearDivertedKg: Number(editGearKg) || 0,
          hoursLogged: Number(editHours) || 0,
          projectsDone: user?.stats?.projectsDone || 0,
          sortiesCount: user?.stats?.sortiesCount || 0,
        },
      });
      setIsEditProfileOpen(false);
      showToast('Steward credentials & profile updated!', 'verified', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed updating profile', 'error', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'lock', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'lock_reset', 'error');
      return;
    }
    setIsSavingPassword(true);
    try {
      await updateProfile({ password: newPassword } as any);
      setIsChangePasswordOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully!', 'lock', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed updating password', 'error', 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLog(true);
    try {
      await logActivity({
        category: logCategory,
        weightKg: Number(logWeight) || 0,
        hours: Number(logHours) || 1,
        location: logLocation,
        verificationMethod,
      });
      setIsLogModalOpen(false);
      showToast(`Logged ${logWeight} kg at ${logLocation}! Impact verified.`, 'task_alt', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed saving salvage log', 'error', 'error');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of steward account', 'logout');
  };

  const handleQuickSwitch = async (email: string) => {
    try {
      await switchDemoAccount(email);
      showToast(`Switched account persona!`, 'sync');
    } catch (err: any) {
      showToast(err.message || 'Failed switching account', 'error', 'error');
    }
  };

  const userLogs = activityLogs.filter((l) => l.userId === user?.id);

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-4">
      {/* If Not Authenticated Banner */}
      {!user ? (
        <div className="rounded-3xl bg-white p-6 text-center border border-[#dce3eb] shadow-md space-y-3.5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#90f4e9] text-[#006a63] flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-4xl">account_circle</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#151c22]">Guest Oceanic Steward</h2>
            <p className="text-xs text-[#41484b] mt-1 leading-relaxed">
              Sign in or create an account to record verified ghost gear salvage, join international harbor sorties, and customize your steward identity.
            </p>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="btn-cool-primary px-6 py-2.5 rounded-full text-xs font-bold shadow-md active:scale-95"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setAuthModalOpen(true);
              }}
              className="btn-cool-glow px-6 py-2.5 rounded-full text-xs font-bold active:scale-95 text-[#90f4e9]"
            >
              Create Account
            </button>
          </div>
        </div>
      ) : (
        /* Top Profile Card */
        <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-[#e8eff7]">
          {/* Decorative Ambient Cyan Glow */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#90f4e9]/30 blur-2xl pointer-events-none"></div>

          {/* Avatar & Identity with 1-Tap Photo Studio */}
          <div className="relative flex items-center gap-4">
            <div className="relative shrink-0 group">
              <img
                src={user.avatar || ASSETS.userProfile}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover shadow-md ring-3 ring-[#006a63] bg-[#eef4fc] group-hover:opacity-90 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ASSETS.userProfile;
                }}
              />
              {/* Camera Overlay Icon to change photo directly */}
              <button
                type="button"
                onClick={() => setIsPhotoStudioOpen(true)}
                className="absolute inset-0 rounded-full bg-black/45 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm"
                title="Change Profile Photo"
              >
                <span className="material-symbols-outlined text-xl">photo_camera</span>
                <span className="text-[8px] font-bold uppercase tracking-wider">Change</span>
              </button>

              <div
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#006a63] text-white shadow-md ring-2 ring-white"
                title="Verified Active Steward"
              >
                <span className="material-symbols-outlined text-[13px]">verified</span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg font-bold text-[#151c22] truncate">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-[10px] font-bold">
                  {user.badge || 'Steward'}
                </span>
              </div>
              <p className="text-xs text-[#41484b] flex items-center gap-1 mt-0.5 truncate font-medium">
                <span className="material-symbols-outlined text-sm text-[#006a63]">anchor</span>
                <span>{user.chapter || 'Coastal Chapter'}</span>
              </p>
              <p className="text-xs text-[#72787c] flex items-center gap-1 mt-0.5 truncate font-medium">
                <span className="material-symbols-outlined text-sm text-[#006a63]">location_on</span>
                <span>{user.location || 'Denpasar, Bali'}</span>
              </p>
              <p className="text-[11px] text-[#41484b] line-clamp-2 mt-1 italic font-sans leading-tight">
                "{user.bio}"
              </p>
            </div>
          </div>

          {/* Quick Action Button Row: Photo, Edit Everything, Harbor Pass */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => setIsPhotoStudioOpen(true)}
              className="btn-cool-glow h-10 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-1 text-[#90f4e9] active:scale-95"
            >
              <span className="material-symbols-outlined text-base">add_a_photo</span>
              <span>Photo</span>
            </button>

            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="btn-cool-primary h-10 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Edit All</span>
            </button>

            <button
              onClick={() => setIsPassModalOpen(true)}
              className="btn-cool-accent h-10 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-base">qr_code_2</span>
              <span>Pass</span>
            </button>
          </div>

          {/* Verified Contribution Stats */}
          <div className="mt-4 grid grid-cols-2 gap-2 pt-1">
            <div className="rounded-2xl bg-[#f6faff] p-3 flex flex-col justify-between border border-[#e8eff7]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#41484b] font-semibold">Gear Diverted</span>
                <span className="material-symbols-outlined text-[#006a63] text-base">recycling</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#002531]">
                  {user.stats?.gearDivertedKg || 0}
                </span>
                <span className="text-xs text-[#006a63] font-bold">kg</span>
              </div>
              <span className="text-[10px] text-[#006a63] font-bold flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>Weight-certified</span>
              </span>
            </div>

            <div className="rounded-2xl bg-[#f6faff] p-3 flex flex-col justify-between border border-[#e8eff7]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#41484b] font-semibold">Hours Logged</span>
                <span className="material-symbols-outlined text-[#006a63] text-base">timer</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#002531]">
                  {user.stats?.hoursLogged || 0}
                </span>
                <span className="text-xs text-[#72787c] font-bold">hrs</span>
              </div>
              <span className="text-[10px] text-[#72787c] mt-0.5 font-medium">
                Across {user.stats?.sortiesCount || 0} sorties
              </span>
            </div>

            <div className="rounded-2xl bg-[#f6faff] p-3 flex flex-col justify-between border border-[#e8eff7]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#41484b] font-semibold">Projects Done</span>
                <span className="material-symbols-outlined text-[#006a63] text-base">task_alt</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#002531]">
                  {user.stats?.projectsDone || 0}
                </span>
                <span className="text-xs text-[#006a63] font-bold">sorties</span>
              </div>
              <span className="text-[10px] text-[#72787c] mt-0.5 font-medium">Verified attendance</span>
            </div>

            <div className="rounded-2xl bg-[#f6faff] p-3 flex flex-col justify-between border border-[#e8eff7]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#41484b] font-semibold">Steward Role</span>
                <span className="material-symbols-outlined text-[#006a63] text-base">military_tech</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-sm font-bold text-[#002531] truncate">{user.role}</span>
              </div>
              <span className="text-[10px] text-[#006a63] font-bold truncate mt-0.5">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Strip: Log Activity */}
      {user && (
        <button
          onClick={() => setIsLogModalOpen(true)}
          className="btn-cool-primary w-full h-12 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-lg text-[#90f4e9]">add_circle</span>
          <span>Record New Gear Salvage or Volunteer Hours</span>
        </button>
      )}

      {/* Recent Personal Logs */}
      {user && userLogs.length > 0 && (
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-[#e8eff7] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#151c22]">Your Recorded Sorties</h3>
            <span className="text-xs text-[#72787c] font-semibold">{userLogs.length} entries</span>
          </div>

          <div className="space-y-2">
            {userLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-[#f6faff] border border-[#e8eff7] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#90f4e9]/50 text-[#006a63] flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">
                      {log.category.includes('Mending') ? 'carpenter' : 'scale'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#151c22]">{log.category}</h4>
                    <p className="text-[10px] text-[#72787c]">{log.location} • {log.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#002531]">+{log.weightKg} kg</span>
                  <p className="text-[10px] text-[#006a63] font-semibold">{log.hours} hrs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings & Preferences Section */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-[#e8eff7] space-y-4">
        <h3 className="text-sm font-bold text-[#151c22]">Operational Station Settings</h3>

        <div className="space-y-3">
          {/* Toggle 1 */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#006a63] mt-0.5 text-lg">water_drop</span>
              <div>
                <h4 className="text-xs font-bold text-[#151c22]">Tide &amp; Weather Alerts</h4>
                <p className="text-[11px] text-[#72787c]">
                  Receive notifications 1 hour before optimal low tide survey windows
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={tideAlerts}
                onChange={(e) => {
                  setTideAlerts(e.target.checked);
                  showToast(e.target.checked ? 'Tide alerts active' : 'Tide alerts muted');
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#c1c7cb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006a63]"></div>
            </label>
          </div>

          <div className="h-[1px] bg-[#e8eff7] w-full"></div>

          {/* Toggle 2 */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#006a63] mt-0.5 text-lg">radar</span>
              <div>
                <h4 className="text-xs font-bold text-[#151c22]">Emergency Snag Dispatch</h4>
                <p className="text-[11px] text-[#72787c]">
                  Allow regional dive stations to notify your station for urgent ghost gear towing
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={salvageCalls}
                onChange={(e) => {
                  setSalvageCalls(e.target.checked);
                  showToast(e.target.checked ? 'Dive salvage calls active' : 'Calls paused');
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#c1c7cb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006a63]"></div>
            </label>
          </div>

          <div className="h-[1px] bg-[#e8eff7] w-full"></div>

          {/* Security & Password */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#006a63] mt-0.5 text-lg">lock</span>
              <div>
                <h4 className="text-xs font-bold text-[#151c22]">Security &amp; Password</h4>
                <p className="text-[11px] text-[#72787c]">
                  Update your steward account password securely
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="btn-cool-glow px-3 py-1 rounded-xl text-xs font-bold text-[#90f4e9] active:scale-95 shrink-0"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Multi-User Persona Switcher */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-[#e8eff7] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#151c22]">Multi-Ocean Persona Switcher</h3>
          <span className="text-[10px] font-bold text-[#006a63] bg-[#90f4e9]/40 px-2.5 py-0.5 rounded-full">
            Live Testing
          </span>
        </div>
        <p className="text-xs text-[#72787c]">
          Switch between distinct accounts in 1 tap to test concurrent multi-user collaboration:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickSwitch('alex@tidekind.org')}
            className={`p-2.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
              user?.email === 'alex@tidekind.org'
                ? 'bg-[#eef4fc] border-[#006a63] ring-2 ring-[#006a63]/30'
                : 'bg-[#f6faff] border-[#dce3eb] hover:bg-[#eef4fc]'
            }`}
          >
            <img src={ASSETS.alexSteward} alt="Alex" className="w-9 h-9 rounded-full object-cover mb-1" />
            <span className="text-[11px] font-bold text-[#151c22]">Alex Stewart</span>
            <span className="text-[9px] text-[#006a63] font-bold">Bali Scout</span>
          </button>

          <button
            onClick={() => handleQuickSwitch('budi@tidekind.org')}
            className={`p-2.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
              user?.email === 'budi@tidekind.org'
                ? 'bg-[#eef4fc] border-[#006a63] ring-2 ring-[#006a63]/30'
                : 'bg-[#f6faff] border-[#dce3eb] hover:bg-[#eef4fc]'
            }`}
          >
            <img src={ASSETS.pakBudiMending} alt="Budi" className="w-9 h-9 rounded-full object-cover mb-1" />
            <span className="text-[11px] font-bold text-[#151c22]">Pak Budi</span>
            <span className="text-[9px] text-[#006a63] font-bold">Master Rigger</span>
          </button>

          <button
            onClick={() => handleQuickSwitch('sarah@tidekind.org')}
            className={`p-2.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
              user?.email === 'sarah@tidekind.org'
                ? 'bg-[#eef4fc] border-[#006a63] ring-2 ring-[#006a63]/30'
                : 'bg-[#f6faff] border-[#dce3eb] hover:bg-[#eef4fc]'
            }`}
          >
            <img src={ASSETS.sarahJenkins} alt="Sarah" className="w-9 h-9 rounded-full object-cover mb-1" />
            <span className="text-[11px] font-bold text-[#151c22]">Dr. Sarah</span>
            <span className="text-[9px] text-[#006a63] font-bold">Lead Scientist</span>
          </button>
        </div>
      </div>

      {/* Sign Out Button */}
      {user && (
        <div className="pt-2 flex flex-col items-center">
          <button
            onClick={handleLogout}
            className="w-full h-12 rounded-2xl bg-[#ffdad6] hover:bg-[#ffb5a1] text-[#93000a] text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out of {user.name}</span>
          </button>
          <p className="mt-2 text-[10px] text-[#72787c] text-center">
            Tidekind Marine Network Protocol • Verified ID: {user.id}
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: PHOTO STUDIO (UPLOAD PHOTO OR CHOOSE PRESET) */}
      {/* ========================================================= */}
      {isPhotoStudioOpen && user && (
        <div className="fixed inset-0 z-50 bg-[#002531]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#dce3eb] space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b pb-3 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63]">photo_camera</span>
                <h3 className="text-sm font-bold text-[#151c22]">Steward Photo Studio</h3>
              </div>
              <button
                onClick={() => setIsPhotoStudioOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b] active:scale-90"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Current Photo Preview */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f6faff] border border-[#dce3eb]">
              <img
                src={editAvatar || user.avatar || ASSETS.userProfile}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-[#006a63] shadow-lg mb-3"
              />
              <span className="text-xs font-bold text-[#151c22]">{user.name}</span>
              <span className="text-[11px] text-[#006a63] font-semibold">{user.badge}</span>
            </div>

            {/* File Upload Button */}
            <div>
              <input
                type="file"
                ref={photoInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="btn-cool-primary w-full h-11 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">upload_file</span>
                <span>Upload Custom Photo from Device / Camera</span>
              </button>
            </div>

            {/* Avatar Presets Grid */}
            <div>
              <label className="text-xs font-bold text-[#151c22] block mb-2">
                Or Pick an Ocean Steward Persona:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {STEWARD_AVATAR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(p.url, p.role)}
                    className="flex flex-col items-center p-2 rounded-2xl bg-[#f6faff] hover:bg-[#e8eff7] border border-[#dce3eb] transition-all group active:scale-95"
                  >
                    <img
                      src={p.url}
                      alt={p.label}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#006a63] mb-1"
                    />
                    <span className="text-[10px] font-bold text-[#151c22] text-center leading-tight">
                      {p.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#41484b]">Or Paste Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 h-10 px-3 rounded-xl bg-[#f6faff] text-xs font-mono border border-[#dce3eb]"
                />
                <button
                  type="button"
                  onClick={() => handleSelectPresetAvatar(editAvatar)}
                  className="btn-cool-glow px-4 h-10 rounded-xl text-xs font-bold text-[#90f4e9]"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsPhotoStudioOpen(false)}
                className="w-full h-10 rounded-xl bg-[#e8eff7] text-[#002531] text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT EVERYTHING (NAME, BIO, LOCATION, ROLE, ETC.) */}
      {/* ========================================================= */}
      {isEditProfileOpen && user && (
        <div className="fixed inset-0 z-50 bg-[#002531]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#dce3eb] space-y-3.5 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b pb-2.5 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63]">edit_square</span>
                <h3 className="text-sm font-bold text-[#151c22]">Edit Steward Profile &amp; Berth</h3>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b] active:scale-90"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#41484b] block mb-1">
                  Display Name / Callsign
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#41484b] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#41484b] block mb-1">
                    Operational Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full h-11 px-2.5 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                  >
                    <option value="Steward">Steward</option>
                    <option value="Coordinator">Coordinator</option>
                    <option value="Admin">Admin</option>
                    <option value="Diver Specialist">Diver Specialist</option>
                    <option value="Marine Biologist">Marine Biologist</option>
                    <option value="Master Rigger">Master Rigger</option>
                    <option value="Vessel Skipper">Vessel Skipper</option>
                    <option value="Reef Ranger">Reef Ranger</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#41484b] block mb-1">
                    Honor Badge
                  </label>
                  <input
                    type="text"
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                  />
                </div>
              </div>

              {/* Berth / Location Picker */}
              <div>
                <label className="text-[11px] font-bold text-[#41484b] block mb-1">
                  Home Berth / Ocean Location
                </label>
                <select
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] mb-1.5"
                >
                  {GLOBAL_LOCATION_OPTIONS.map((loc, idx) => (
                    <option key={idx} value={loc}>
                      {loc}
                    </option>
                  ))}
                  <option value={editLocation}>Custom Location: {editLocation}</option>
                </select>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="Or enter custom harbor / coordinates..."
                  className="w-full h-9 px-3 rounded-xl bg-[#f6faff] text-xs border border-[#dce3eb]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#41484b] block mb-1">
                  Regional Chapter Affiliation
                </label>
                <input
                  type="text"
                  value={editChapter}
                  onChange={(e) => setEditChapter(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#41484b] block mb-1">
                  Personal Bio &amp; Marine Mission
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#f6faff] text-xs font-medium border border-[#dce3eb]"
                />
              </div>

              {/* Calibrate Stats */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
                <div>
                  <label className="text-[10px] font-bold text-[#72787c] block mb-1">
                    Gear Diverted (kg)
                  </label>
                  <input
                    type="number"
                    value={editGearKg}
                    onChange={(e) => setEditGearKg(e.target.value)}
                    className="w-full h-9 px-2 rounded-xl bg-white text-xs font-bold border border-[#dce3eb]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#72787c] block mb-1">
                    Hours Logged
                  </label>
                  <input
                    type="number"
                    value={editHours}
                    onChange={(e) => setEditHours(e.target.value)}
                    className="w-full h-9 px-2 rounded-xl bg-white text-xs font-bold border border-[#dce3eb]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 h-11 rounded-2xl bg-[#e8eff7] text-[#002531] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn-cool-primary flex-1 h-11 rounded-2xl text-xs font-bold shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSavingProfile ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CHANGE PASSWORD DIRECTLY */}
      {/* ========================================================= */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-[#002531]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#dce3eb] space-y-3.5">
            <div className="flex items-center justify-between border-b pb-2.5 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63]">lock</span>
                <h3 className="text-sm font-bold text-[#151c22]">Change Steward Password</h3>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#41484b] block mb-1">
                  New Password <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#41484b] block mb-1">
                  Confirm New Password <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 h-11 rounded-2xl bg-[#e8eff7] text-[#002531] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="btn-cool-primary flex-1 h-11 rounded-2xl text-xs font-bold shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSavingPassword ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: HARBOR BOARDING PASS */}
      {/* ========================================================= */}
      {isPassModalOpen && user && (
        <div className="fixed inset-0 z-50 bg-[#002531]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl text-center relative border border-[#dce3eb] animate-fadeIn">
            <button
              onClick={() => setIsPassModalOpen(false)}
              className="absolute right-4 top-4 h-8 w-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#90f4e9] text-[#00504a] text-xs font-bold mb-2">
              Official Harbor Muster Pass
            </span>
            <h3 className="text-base font-bold text-[#151c22]">{user.location}</h3>
            <p className="text-xs text-[#72787c] mt-0.5 font-medium">
              Steward: {user.name} ({user.badge})
            </p>

            {/* QR Code Graphic with User Avatar center badge */}
            <div className="my-4 mx-auto w-44 h-44 rounded-3xl bg-[#f6faff] p-3 flex flex-col items-center justify-center border-2 border-dashed border-[#006a63]/40 relative">
              <span className="material-symbols-outlined text-7xl text-[#002531]">qr_code_2</span>
              <img
                src={user.avatar || ASSETS.userProfile}
                alt="Badge"
                className="w-10 h-10 rounded-full object-cover border-2 border-white absolute shadow-md"
              />
              <span className="text-[9px] font-mono text-[#006a63] font-bold mt-1">
                AUTH TOKEN: {user.id.toUpperCase()}
              </span>
            </div>

            <div className="rounded-2xl bg-[#123b4a] text-white p-3 text-left border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#90f4e9] font-medium">Regional Berth</span>
                <span className="font-bold">{user.chapter}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#90f4e9] font-medium">Certified Tier</span>
                <span className="font-bold">{user.role}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsPassModalOpen(false);
                showToast('Harbor pass cached for offline docking gate verification', 'verified');
              }}
              className="btn-cool-primary mt-3 w-full h-11 rounded-2xl text-xs font-bold shadow-md active:scale-95"
            >
              Save to Maritime Wallet
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: LOG SALVAGE ACTIVITY */}
      {/* ========================================================= */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#002531]/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#90f4e9] flex items-center justify-center text-[#006a63]">
                  <span className="material-symbols-outlined text-lg">add</span>
                </div>
                <h3 className="text-sm font-bold text-[#151c22]">Log Salvage Activity</h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitLog} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#72787c] block mb-1">Activity Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogCategory('Net Recovery')}
                    className={`h-10 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      logCategory === 'Net Recovery'
                        ? 'btn-cool-primary text-white shadow-sm'
                        : 'bg-[#e8eff7] text-[#002531]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">set_meal</span>
                    <span>Net Recovery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogCategory('Volunteer Hours')}
                    className={`h-10 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      logCategory === 'Volunteer Hours'
                        ? 'btn-cool-primary text-white shadow-sm'
                        : 'bg-[#e8eff7] text-[#002531]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">hourglass_bottom</span>
                    <span>Volunteer Hours</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#72787c] block mb-1">Net Mass (kg)</label>
                  <input
                    type="number"
                    value={logWeight}
                    onChange={(e) => setLogWeight(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#72787c] block mb-1">Hours Spent</label>
                  <input
                    type="number"
                    step="0.5"
                    value={logHours}
                    onChange={(e) => setLogHours(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#72787c] block mb-1">Muster / Harbor Location</label>
                <input
                  type="text"
                  value={logLocation}
                  onChange={(e) => setLogLocation(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#72787c] block mb-1">Verification Method</label>
                <select
                  value={verificationMethod}
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                >
                  <option value="Harbor Certified Scale">Harbor Certified Scale</option>
                  <option value="Co-op Scale Station #3">Co-op Scale Station #3</option>
                  <option value="Visual Drone Estimate">Visual Drone Estimate</option>
                  <option value="Depot Certified Weight Slip">Depot Certified Weight Slip</option>
                  <option value="Sanctuary Ranger Verification">Sanctuary Ranger Verification</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="flex-1 h-11 rounded-2xl bg-[#e8eff7] text-[#002531] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLog}
                  className="btn-cool-primary flex-1 h-11 rounded-2xl text-xs font-bold shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmittingLog ? 'Recording...' : 'Submit Certified Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
