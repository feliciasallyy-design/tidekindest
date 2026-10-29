import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ASSETS } from '../data/assets';

// Cool avatar presets for oceanic stewards
const AVATAR_PRESETS = [
  { label: 'Alex (Scout)', url: ASSETS.alexSteward, role: 'Tier 2 Steward' },
  { label: 'Pak Budi (Rigger)', url: ASSETS.pakBudiMending, role: 'Master Rigger' },
  { label: 'Dr. Sarah (Biologist)', url: ASSETS.sarahJenkins, role: 'Lead Biologist' },
  { label: 'Diver Sentinel', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=250&q=80', role: 'Diver Specialist' },
  { label: 'Coral Ranger', url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=250&q=80', role: 'Reef Guardian' },
  { label: 'Vessel Skipper', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', role: 'Vessel Captain' },
];

const LOCATION_PRESETS = [
  'Sanur, Bali, Indonesia',
  'Serangan Harbor, Bali',
  'Raja Ampat, West Papua',
  'Kaneohe Bay, Oahu, Hawaii',
  'Monterey Bay, California, USA',
  'Cyclades, Greece',
  'Cozumel, Quintana Roo, Mexico',
  'Great Barrier Reef, Australia',
  'Azores, Portugal',
  'Galápagos Islands, Ecuador',
];

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    signup,
    switchDemoAccount,
    forgotPassword,
    resetPassword,
  } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Sanur, Bali, Indonesia');
  const [chapter, setChapter] = useState('Sanur Coral Conservation');
  const [bio, setBio] = useState('Dedicated marine steward safeguarding coral reefs and preventing derelict ghost gear hazards.');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);
  const [role, setRole] = useState('Steward');
  const [badge, setBadge] = useState('Tier 1 Steward');

  // Password reset state
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStage, setResetStage] = useState<'request' | 'submit'>('request');
  const [resetInfoMsg, setResetInfoMsg] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!authModalOpen) return null;

  // Handle local image file upload & conversion to Data URL
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
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter both email and password.');
        }
        await login(email.trim(), password);
      } else if (authMode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name or steward callsign.');
        if (!email.trim() || !password.trim()) throw new Error('Email and password are required.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');

        await signup({
          name: name.trim(),
          email: email.trim(),
          password,
          location,
          chapter,
          bio,
          avatar,
          role,
          badge,
        } as any);
      } else if (authMode === 'forgot') {
        if (resetStage === 'request') {
          const res = await forgotPassword(email.trim());
          setResetInfoMsg(res.message);
          if (res.debugToken) {
            setResetToken(res.debugToken);
            setResetInfoMsg(`${res.message} (Auto-filled token for instant test)`);
          }
          setResetStage('submit');
        } else {
          await resetPassword(resetToken, newPassword);
          setResetInfoMsg('Password reset successfully! You can now log in.');
          setAuthMode('login');
          setResetStage('request');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemo1ClickLogin = async (demoEmail: string) => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await switchDemoAccount(demoEmail);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed signing in with demo persona.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail: string, pass: string) => {
    setEmail(demoEmail);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002531]/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#dce3eb] overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#123b4a] text-white p-5 pb-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={ASSETS.logo} alt="Tidekind" className="h-7 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#90f4e9] uppercase tracking-wider font-['DM_Sans']">
                  Tidekind Multi-Ocean Network
                </span>
                <span className="text-base font-bold text-white font-['DM_Sans']">
                  {authMode === 'login' && 'Steward Sign In'}
                  {authMode === 'signup' && 'Register Steward Profile'}
                  {authMode === 'forgot' && 'Account Recovery'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setAuthModalOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors active:scale-90"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 flex rounded-2xl bg-black/25 p-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'login' ? 'btn-cool-primary text-white shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'signup' ? 'btn-cool-primary text-white shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('forgot');
                setErrorMessage('');
                setResetStage('request');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'forgot' ? 'btn-cool-primary text-white shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              Reset Pass
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {resetInfoMsg && (
            <div className="p-3 rounded-2xl bg-[#e8eff7] border border-[#006a63]/30 text-[#00504a] text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#006a63] shrink-0">info</span>
              <span>{resetInfoMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* AVATAR CHOOSER DURING REGISTRATION */}
            {authMode === 'signup' && (
              <div className="p-3.5 rounded-2xl bg-[#f6faff] border border-[#dce3eb] space-y-2.5">
                <span className="block text-xs font-bold text-[#151c22]">
                  Select or Upload Profile Picture:
                </span>

                <div className="flex items-center gap-3">
                  <div className="relative group shrink-0">
                    <img
                      src={avatar}
                      alt="Avatar Preview"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#006a63] shadow-md bg-white"
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
                      <span className="material-symbols-outlined text-lg">photo_camera</span>
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
                    <p className="text-[10px] text-[#72787c] mt-1 truncate">
                      JPG, PNG, GIF or WebP (max 5MB)
                    </p>
                  </div>
                </div>

                {/* Avatar Presets Carousel */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-[#72787c] uppercase tracking-wider block mb-1">
                    Or choose steward persona:
                  </span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {AVATAR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatar(p.url);
                          setRole(p.role);
                        }}
                        className={`p-1 rounded-xl flex flex-col items-center shrink-0 border transition-all ${
                          avatar === p.url
                            ? 'border-[#006a63] bg-[#90f4e9]/30 ring-2 ring-[#006a63]/40'
                            : 'border-[#dce3eb] bg-white hover:bg-[#eef4fc]'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-[9px] font-semibold text-[#151c22] mt-0.5 truncate max-w-[60px]">
                          {p.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                  Full Name / Callsign <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-[#72787c] text-lg">
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
                <span className="material-symbols-outlined absolute left-3 top-3 text-[#72787c] text-lg">
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

            {(authMode === 'login' || authMode === 'signup') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-[#41484b]">
                    Password <span className="text-[#ba1a1a]">*</span>
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setResetStage('request');
                      }}
                      className="text-[11px] text-[#006a63] hover:underline font-semibold"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-[#72787c] text-lg">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
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

            {authMode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                      Berth / Home Ocean
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-10 px-2 rounded-xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                    >
                      {LOCATION_PRESETS.map((loc, idx) => (
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
                      placeholder="e.g. Sanur Coral Crew"
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
                      <option value="Vessel Skipper">Vessel Skipper</option>
                      <option value="Reef Ranger">Reef Ranger</option>
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
                      placeholder="e.g. Tier 1 Steward"
                      className="w-full h-10 px-3 rounded-xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                    Bio / Marine Mission
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short description of your oceanic stewardship goals"
                    className="w-full p-2.5 rounded-xl bg-[#f6faff] text-xs font-medium border border-[#dce3eb]"
                  />
                </div>
              </>
            )}

            {authMode === 'forgot' && resetStage === 'submit' && (
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
                    {authMode === 'login' ? 'login' : authMode === 'signup' ? 'badge' : 'sync'}
                  </span>
                  <span>
                    {authMode === 'login' && 'Sign In to Steward Hub'}
                    {authMode === 'signup' && 'Register Steward Profile'}
                    {authMode === 'forgot' && (resetStage === 'request' ? 'Request Reset Token' : 'Save New Password')}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Personas 1-Click Sign In (For Fast Verification) */}
          <div className="pt-3 border-t border-[#e8eff7]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#72787c] uppercase tracking-wider">
                1-Click Sign In (Test Personas)
              </span>
              <span className="text-[10px] text-[#006a63] font-bold bg-[#90f4e9]/40 px-2 py-0.5 rounded-full">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemo1ClickLogin('alex@tidekind.org')}
                className="flex flex-col items-center p-2 rounded-2xl bg-[#f6faff] hover:bg-[#eef4fc] border border-[#dce3eb] text-center transition-all group active:scale-95"
                title="Sign in as Alex Stewart (Bali)"
              >
                <img
                  src={ASSETS.alexSteward}
                  alt="Alex"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#006a63]/40 group-hover:ring-[#006a63] mb-1"
                />
                <span className="text-[11px] font-bold text-[#151c22] leading-tight">Alex Stewart</span>
                <span className="text-[9px] text-[#006a63] font-bold">1-Click Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo1ClickLogin('budi@tidekind.org')}
                className="flex flex-col items-center p-2 rounded-2xl bg-[#f6faff] hover:bg-[#eef4fc] border border-[#dce3eb] text-center transition-all group active:scale-95"
                title="Sign in as Pak Budi Santoso (Serangan)"
              >
                <img
                  src={ASSETS.pakBudiMending}
                  alt="Pak Budi"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#006a63]/40 group-hover:ring-[#006a63] mb-1"
                />
                <span className="text-[11px] font-bold text-[#151c22] leading-tight">Pak Budi</span>
                <span className="text-[9px] text-[#006a63] font-bold">1-Click Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo1ClickLogin('sarah@tidekind.org')}
                className="flex flex-col items-center p-2 rounded-2xl bg-[#f6faff] hover:bg-[#eef4fc] border border-[#dce3eb] text-center transition-all group active:scale-95"
                title="Sign in as Dr. Sarah Jenkins (Lead Scientist)"
              >
                <img
                  src={ASSETS.sarahJenkins}
                  alt="Sarah"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#006a63]/40 group-hover:ring-[#006a63] mb-1"
                />
                <span className="text-[11px] font-bold text-[#151c22] leading-tight">Dr. Sarah</span>
                <span className="text-[9px] text-[#006a63] font-bold">1-Click Sign In</span>
              </button>
            </div>

            {authMode === 'login' && (
              <div className="mt-2 text-center">
                <span className="text-[10px] text-[#72787c]">
                  Or auto-fill credentials:&nbsp;
                  <button
                    type="button"
                    onClick={() => handleQuickFill('alex@tidekind.org', 'steward2025')}
                    className="text-[#006a63] font-bold underline mr-1.5"
                  >
                    Alex
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('budi@tidekind.org', 'rigger2025')}
                    className="text-[#006a63] font-bold underline mr-1.5"
                  >
                    Budi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('sarah@tidekind.org', 'marine2025')}
                    className="text-[#006a63] font-bold underline"
                  >
                    Sarah
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
