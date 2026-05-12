import React, { useState } from 'react';
import {
  Lock, Palette, ShieldCheck, CheckCircle2, AlertCircle,
  Eye, EyeOff, Sun, Moon, Monitor, Trash2, LogOut, Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/* ─── Tabs config ────────────────────────────────────────────────────────────── */
const TABS = [
  { id: 'appearance', label: 'Appearance', icon: Palette    },
  { id: 'security',   label: 'Security',   icon: Lock       },
  { id: 'privacy',    label: 'Privacy',    icon: ShieldCheck },
];

/* ─── Shared components ─────────────────────────────────────────────────────── */
const SectionCard = ({ title, description, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
    {(title || description) && (
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        {title && <h3 className="font-semibold text-gray-900 text-[15px]">{title}</h3>}
        {description && <p className="text-[13px] text-gray-500 mt-0.5">{description}</p>}
      </div>
    )}
    <div className="px-6 py-5">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 ${checked ? 'bg-primary' : 'bg-gray-200'}`}
  >
    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
);

const FeedbackBanner = ({ feedback }) => (
  <AnimatePresence>
    {feedback && (
      <motion.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm mb-5 ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}
      >
        {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
        {feedback.message}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── Appearance Tab ─────────────────────────────────────────────────────────── */
const AppearanceTab = () => {
  const { preferences, updatePreferences, isLoading } = useAuthStore();
  const [local, setLocal] = useState({
    theme:   preferences.theme   || 'system',
    density: preferences.density || 'comfortable',
  });
  const [feedback, setFeedback] = useState(null);

  const isDirty =
    local.theme !== preferences.theme ||
    local.density !== preferences.density;

  const handleSave = async () => {
    setFeedback(null);
    const result = await updatePreferences(local);
    setFeedback(result.success
      ? { type: 'success', message: 'Appearance saved. Theme and density are now applied.' }
      : { type: 'error',   message: result.error }
    );
    setTimeout(() => setFeedback(null), 4000);
  };

  const THEMES = [
    { id: 'light',  label: 'Light',  icon: Sun,     desc: 'Always light'  },
    { id: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Always dark'   },
    { id: 'system', label: 'System', icon: Monitor, desc: 'Follow OS'     },
  ];
  const DENSITIES = [
    { id: 'compact',     label: 'Compact',     desc: 'Tighter spacing, more content visible' },
    { id: 'comfortable', label: 'Comfortable', desc: 'Balanced layout (recommended)'         },
    { id: 'spacious',    label: 'Spacious',    desc: 'Extra padding for readability'          },
  ];

  return (
    <>
      <FeedbackBanner feedback={feedback} />

      <SectionCard title="Theme" description="Choose how CivicSeva looks. Changes apply instantly after saving.">
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id} onClick={() => setLocal((l) => ({ ...l, theme: id }))}
              className={`flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all text-sm font-medium ${
                local.theme === id
                  ? 'border-primary bg-primary/5 text-primary shadow-sm'
                  : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon size={22} />
              <span>{label}</span>
              <span className="text-[11px] font-normal text-gray-400">{desc}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Content Density" description="Controls padding and font size across the app.">
        <div className="space-y-2">
          {DENSITIES.map(({ id, label, desc }) => (
            <button
              key={id} onClick={() => setLocal((l) => ({ ...l, density: id }))}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all text-left ${
                local.density === id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div>
                <p className={`text-[14px] font-semibold ${local.density === id ? 'text-primary' : 'text-gray-800'}`}>{label}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${local.density === id ? 'border-primary' : 'border-gray-300'}`}>
                {local.density === id && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="flex items-center justify-between">
        {!isDirty && <p className="text-[13px] text-gray-400">No unsaved changes.</p>}
        {isDirty && <p className="text-[13px] text-amber-600 font-medium">You have unsaved changes.</p>}
        <button
          onClick={handleSave}
          disabled={!isDirty || isLoading}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            : <><Save size={15} /> Save Changes</>
          }
        </button>
      </div>
    </>
  );
};

/* ─── Security Tab ────────────────────────────────────────────────────────────── */
const SecurityTab = () => {
  const { updateProfile, isLoading, logout } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', password_confirmation: '' });
  const [showPw, setShowPw] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    if (form.password.length < 8)
      return setFeedback({ type: 'error', message: 'Password must be at least 8 characters.' });
    if (form.password !== form.password_confirmation)
      return setFeedback({ type: 'error', message: 'Passwords do not match.' });

    const result = await updateProfile({
      password: form.password,
      password_confirmation: form.password_confirmation,
    });
    if (result.success) {
      setFeedback({ type: 'success', message: 'Password updated successfully. Please log in again on other devices.' });
      setForm({ password: '', password_confirmation: '' });
    } else {
      setFeedback({ type: 'error', message: result.error || 'Update failed.' });
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleLogoutAll = async () => { await logout(); navigate('/login'); };

  // Password strength
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const STRENGTH_META = [
    null,
    { label: 'Weak',   color: 'bg-red-400'    },
    { label: 'Fair',   color: 'bg-yellow-400'  },
    { label: 'Good',   color: 'bg-blue-400'    },
    { label: 'Strong', color: 'bg-emerald-400' },
  ];

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <>
      <FeedbackBanner feedback={feedback} />

      <SectionCard title="Change Password" description="Use a strong password you don't use elsewhere.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required minLength={8}
                placeholder="Minimum 8 characters"
                className={inputClass}
              />
              <button type="button" onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? (STRENGTH_META[strength]?.color ?? 'bg-gray-200') : 'bg-gray-200'}`} />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500 font-medium w-10">{STRENGTH_META[strength]?.label}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={form.password_confirmation}
              onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))}
              required
              placeholder="Repeat new password"
              className={`${inputClass} ${
                form.password_confirmation && form.password !== form.password_confirmation
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                  : ''
              }`}
            />
            {form.password_confirmation && form.password !== form.password_confirmation && (
              <p className="text-[12px] text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          <button type="submit" disabled={isLoading || !form.password}
            className="w-full bg-primary text-white py-2.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</>
              : <><Lock size={15} /> Update Password</>
            }
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Active Sessions" description="Sign out of all devices if you suspect unauthorized access.">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium text-gray-800">Sign out everywhere</p>
            <p className="text-[12px] text-gray-500 mt-0.5">Revokes all tokens including this session.</p>
          </div>
          <button onClick={handleLogoutAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200">
            <LogOut size={14} /> Sign Out All
          </button>
        </div>
      </SectionCard>
    </>
  );
};

/* ─── Privacy Tab ────────────────────────────────────────────────────────────── */
const PrivacyTab = () => {
  const { preferences, updatePreferences, isLoading } = useAuthStore();
  const [local, setLocal] = useState({
    save_chat: preferences?.privacy?.save_chat ?? true,
    analytics: preferences?.privacy?.analytics ?? true,
  });
  const [feedback, setFeedback] = useState(null);

  const isDirty =
    local.save_chat !== (preferences?.privacy?.save_chat ?? true) ||
    local.analytics !== (preferences?.privacy?.analytics ?? true);

  const handleSave = async () => {
    setFeedback(null);
    const result = await updatePreferences({ privacy: local });
    setFeedback(result.success
      ? { type: 'success', message: 'Privacy settings saved.' }
      : { type: 'error',   message: result.error }
    );
    setTimeout(() => setFeedback(null), 4000);
  };

  const ITEMS = [
    { key: 'save_chat', label: 'Save chat history',   desc: 'Store your AI assistant conversations for future reference' },
    { key: 'analytics', label: 'Anonymous analytics', desc: 'Help improve CivicSeva by sharing anonymous usage data'     },
  ];

  return (
    <>
      <FeedbackBanner feedback={feedback} />

      <SectionCard title="Data & Privacy" description="Control how your data is used within CivicSeva.">
        <div className="space-y-5">
          {ITEMS.map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[14px] font-medium text-gray-800">{label}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">{desc}</p>
              </div>
              <Toggle
                checked={local[key]}
                onChange={(v) => setLocal((l) => ({ ...l, [key]: v }))}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Data Portability" description="Export or delete all your personal data.">
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-[13px] font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
            Export My Data
          </button>
          <button className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-[13px] font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors">
            <Trash2 size={14} /> Delete Account
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-3">
          Data export and account deletion requests are processed within 30 days as per Government data regulations.
        </p>
      </SectionCard>

      <div className="flex items-center justify-between">
        {!isDirty && <p className="text-[13px] text-gray-400">No unsaved changes.</p>}
        {isDirty && <p className="text-[13px] text-amber-600 font-medium">You have unsaved changes.</p>}
        <button
          onClick={handleSave}
          disabled={!isDirty || isLoading}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            : <><Save size={15} /> Save Settings</>
          }
        </button>
      </div>
    </>
  );
};

/* ─── Main Settings Page ──────────────────────────────────────────────────────── */
const Settings = () => {
  const [activeTab, setActiveTab] = useState('appearance');

  const CONTENT = {
    appearance: AppearanceTab,
    security:   SecurityTab,
    privacy:    PrivacyTab,
  };
  const TabContent = CONTENT[activeTab];

  return (
    <div className="min-h-full bg-gray-50/40">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Settings</h1>
          <p className="text-gray-500 text-[15px]">Manage your preferences, security, and privacy.</p>
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <TabContent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;
