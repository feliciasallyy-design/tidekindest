import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ASSETS } from '../data/assets';
import { ScreenId } from '../types';

interface AuthScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const STEWARD_AVATARS = [
  { label: 'Alex (Scout)', url: ASSETS.alexSteward, role: 'Tier 2 Steward' },
  { label: 'Pak Budi (Rigger)', url: ASSETS.pakBudiMending, role: 'Master Rigger' },
  { label: 'Dr. Sarah (Biologist)', url: ASSETS.sarahJenkins, role: 'Lead Biologist' },
  { label: 'Diver Specialist', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80', role: 'Diver Specialist' },
  { label: 'Reef Guardian', url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=400&q=80', role: 'Reef Guardian' },
  { label: 'Vessel Captain', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', role: 'Vessel Captain' },
];

const GLOBAL_LOCATION_CHOICES = [
  'Sanur, Bali, Indonesia',
  'Serangan Harbor, Bali, Indonesia',
  'Raja Ampat, West Papua, Indonesia',
  'Kaneohe Bay, Oahu, Hawaii, USA',
  'Maalaea Harbor, Maui, Hawaii, USA',
  'Monterey Bay, California, USA',
  'Great Barrier Reef, Queensland, Australia',
  'Cyclades, Paros Island, Greece',
  'Cozumel, Riviera Maya, Mexico',
  'Azores, Portugal',
  'Galápagos Islands, Ecuador',
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate, showToast }) => {
  const { user, login, signup, switchDemoAccount, forgotPassword, resetPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Sanur, Bali, Indonesia');
  const [chapter, setChapter] = useState('Sanur Coral Conservation');
  const [bio, setBio] = useState('Dedicated ocean steward committed to coastal net salvage and circular recycling.');
  const [avatar, setAvatar] = useState(STEWARD_AVATARS[0].url);
  const [role, setRole] = useState('Steward');
  const [badge, setBadge] = useState('Tier 1 Steward');

  // Recovery
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStage, setResetStage] = useState<'request' | 'submit'>('request');
  const [resetInfo, setResetInfo] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file is too large (max 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatar(result);
        setErrorMessage('');
        showToast('Photo loaded!', 'photo_camera');
      }
    };
    reader.readAsDataURL(file);
  };

  const handle1ClickLogin = async (demoEmail: string, demoName: string) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await switchDemoAccount(demoEmail);
      showToast(`Welcome back, ${demoName}!`, 'check_circle', 'success');
      onNavigate('profile');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed signing in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        if (!email.trim()) throw new Error('Please enter your email address.');
        await login(email.trim(), password || 'steward2025');
        showToast('Signed in successfully!', 'login', 'success');
        onNavigate('profile');
      } else if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name or callsign.');
        if (!email.trim()) throw new Error('Please enter your email address.');
        await signup({
          name: name.trim(),
          email: email.trim(),
          password: password || 'steward2025',
          location,
          chapter,
          bio,
          avatar,
          role,
          badge,
        } as any);
        showToast('Steward account created & verified!', 'verified', 'success');
        onNavigate('profile');
      } else if (mode === 'forgot') {
        if (resetStage === 'request') {
          const res = await forgotPassword(email.trim());
          setResetInfo(res.message);
          if (res.debugToken) {
            setResetToken(res.debugToken);
            setResetInfo(`${res.message} (Test Token: ${res.debugToken})`);
          }
          setResetStage('submit');
        } else {
          await resetPassword(resetToken, newPassword);
          setResetInfo('Password reset! You can now sign in.');
          setMode('login');
          setResetStage('request');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-4 animate-fadeIn">
      {/* Top Banner & Navigation */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#006a63] hover:underline"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Home</span>
        </button>

        <span className="text-[11px] font-bold text-[#72787c] uppercase tracking-wider">
          Steward Access
        </span>
      </div>

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg border border-[#dce3eb]">
        {/* Header Ribbon */}
        <div className="bg-[#123b4a] text-white p-6 pb-5 relative">
          <div className="flex items-center gap-3">
            <img src={ASSETS.logo} alt="Tidekind" className="h-9 w-auto object-contain" />
            <div>
              <span className="text-[10px] font-bold text-[#90f4e9] uppercase tracking-wider block">
                Multi-Ocean Maritime Network
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {mode === 'login' && 'Steward Sign In Portal'}
                {mode === 'signup' && 'Register Steward Profile'}
                {mode === 'forgot' && 'Reset Account Password'}
              </h1>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 flex rounded-2xl bg-black/25 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'login' ? 'btn-cool-primary text-white shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'signup' ? 'btn-cool-primary text-white shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setErrorMessage('');
                setResetStage('request');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'forgot' ? 'btn-cool-primary text-white shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              Recovery
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {resetInfo && (
            <div className="p-3.5 rounded-2xl bg-[#e8eff7] border border-[#006a63]/30 text-[#00504a] text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-[#006a63] shrink-0">info</span>
              <span>{resetInfo}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* AVATAR CHOOSER DURING REGISTRATION */}
            {mode === 'signup' && (
              <div className="p-4 rounded-2xl bg-[#f6faff] border border-[#dce3eb] space-y-3">
                <span className="block text-xs font-bold text-[#151c22]">
                  Profile Photo &amp; Avatar Studio:
                </span>

                <div className="flex items-center gap-3">
                  <div className="relative group shrink-0">
                    <img
                      src={avatar}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover ring-3 ring-[#006a63] shadow-md bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ASSETS.userProfile;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Upload custom image"
                    >
                      <span className="material-symbols-outlined text-xl">photo_camera</span>
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-cool-glow px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 text-[#90f4e9]"
                    >
                      <span className="material-symbols-outlined text-base">upload_file</span>
                      <span>Upload from Device</span>
                    </button>
                    <p className="text-[10px] text-[#72787c] mt-1">
                      JPG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>
                </div>

                {/* Avatar Presets */}
                <div>
                  <span className="text-[10px] font-bold text-[#72787c] uppercase tracking-wider block mb-1.5">
                    Or select steward persona:
                  </span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {STEWARD_AVATARS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatar(p.url);
                          setRole(p.role);
                        }}
                        className={`p-1.5 rounded-xl flex flex-col items-center shrink-0 border transition-all ${
                          avatar === p.url
                            ? 'border-[#006a63] bg-[#90f4e9]/30 ring-2 ring-[#006a63]/40'
                            : 'border-[#dce3eb] bg-white hover:bg-[#eef4fc]'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-9 h-9 rounded-full object-cover" />
                        <span className="text-[9px] font-bold text-[#151c22] mt-0.5 truncate max-w-[65px]">
                          {p.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                  Full Name / Steward Callsign <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#72787c] text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full h-11 pl-10 pr-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:border-[#006a63] focus:ring-1 focus:ring-[#006a63] outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                Email Address <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#72787c] text-lg">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full h-11 pl-10 pr-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:border-[#006a63] focus:ring-1 focus:ring-[#006a63] outline-hidden"
                />
              </div>
            </div>

            {(mode === 'login' || mode === 'signup') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-[#41484b]">
                    Password <span className="text-[#ba1a1a]">*</span>
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setResetStage('request');
                      }}
                      className="text-[11px] text-[#006a63] hover:underline font-bold"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#72787c] text-lg">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'login' ? 'Enter password (or leave default)' : 'Min 6 characters'}
                    className="w-full h-11 pl-10 pr-10 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:border-[#006a63] focus:ring-1 focus:ring-[#006a63] outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#72787c] hover:text-[#151c22]"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                      Home Berth / Ocean
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-10 px-2 rounded-xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                    >
                      {GLOBAL_LOCATION_CHOICES.map((loc, idx) => (
                        <option key={idx} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                      Regional Chapter
                    </label>
                    <input
                      type="text"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                      Operational Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        setBadge(`${e.target.value} Certified`);
                      }}
                      className="w-full h-10 px-2 rounded-xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                    >
                      <option value="Steward">Steward</option>
                      <option value="Diver Specialist">Diver Specialist</option>
                      <option value="Marine Biologist">Marine Biologist</option>
                      <option value="Master Rigger">Master Rigger</option>
                      <option value="Vessel Captain">Vessel Captain</option>
                      <option value="Reef Guardian">Reef Guardian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                      Honor Badge
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                    Bio &amp; Marine Mission
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f6faff] text-xs font-medium border border-[#dce3eb]"
                  />
                </div>
              </>
            )}

            {mode === 'forgot' && resetStage === 'submit' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                    Reset Token <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Paste 24-character token"
                    className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-mono border border-[#dce3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                    New Password <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 chars)"
                    className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs border border-[#dce3eb]"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-cool-primary w-full h-12 rounded-2xl text-xs font-bold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">
                    {mode === 'login' ? 'login' : mode === 'signup' ? 'badge' : 'sync'}
                  </span>
                  <span>
                    {mode === 'login' && 'Sign In to Steward Hub'}
                    {mode === 'signup' && 'Register Steward Profile'}
                    {mode === 'forgot' && (resetStage === 'request' ? 'Request Reset Token' : 'Save New Password')}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* 1-Click Fast Steward Sign In */}
          <div className="pt-4 border-t border-[#e8eff7]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#72787c] uppercase tracking-wider">
                1-Click Instant Sign-In (Verified Personas)
              </span>
              <span className="text-[10px] text-[#006a63] font-bold bg-[#90f4e9]/40 px-2 py-0.5 rounded-full">
                Always Works
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handle1ClickLogin('alex@tidekind.org', 'Alex Stewart')}
                className="flex flex-col items-center p-2.5 rounded-2xl bg-[#f6faff] hover:bg-[#eef4fc] border border-[#dce3eb] text-center transition-all group active:scale-95"
              >
                <img
                  src={ASSETS.alexSteward}
                  alt="Alex"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#006a63]/40 group-hover:ring-[#006a63] mb-1"
                />
                <span className="text-[11px] font-bold text-[#151c22]">Alex Stewart</span>
                <span className="text-[9px] text-[#006a63] font-bold">Bali Scout</span>
              </button>

              <button
                type="button"
                onClick={() => handle1ClickLogin('budi@tidekind.org', 'Pak Budi')}
                className="flex flex-col items-center p-2.5 rounded-2xl bg-[#f6faff] hover:bg-[#eef4fc] border border-[#dce3eb] text-center transition-all group active:scale-95"
              >
                <img
                  src={ASSETS.pakBudiMending}
                  alt="Pak Budi"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#006a63]/40 group-hover:ring-[#006a63] mb-1"
                />
                <span className="text-[11px] font-bold text-[#151c22]">Pak Budi</span>
                <span className="text-[9px] text-[#006a63] font-bold">Master Rigger</span>
              </button>

              <button
                type="button"
                onClick={() => handle1ClickLogin('sarah@tidekind.org', 'Dr. Sarah')}
                className="flex flex-col items-center p-2.5 rounded-2xl bg-[#f6faff] hover:bg-[#eef4fc] border border-[#dce3eb] text-center transition-all group active:scale-95"
              >
                <img
                  src={ASSETS.sarahJenkins}
                  alt="Sarah"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#006a63]/40 group-hover:ring-[#006a63] mb-1"
                />
                <span className="text-[11px] font-bold text-[#151c22]">Dr. Sarah</span>
                <span className="text-[9px] text-[#006a63] font-bold">Lead Scientist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
