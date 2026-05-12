import { create } from 'zustand';
import api from '../lib/api';

/* ─── Default preferences ───────────────────────────────────────────────────── */
const DEFAULT_PREFS = {
  theme:   'system',        // 'light' | 'dark' | 'system'
  density: 'comfortable',   // 'compact' | 'comfortable' | 'spacious'
  privacy: {
    save_chat: true,
    analytics: true,
  },
};

/* ─── Theme application ─────────────────────────────────────────────────────── */
// Keep a reference so we can remove the listener when theme changes
let _systemThemeListener = null;

export const applyTheme = (theme) => {
  // Remove any previous system-preference listener
  if (_systemThemeListener) {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', _systemThemeListener);
    _systemThemeListener = null;
  }

  const apply = (dark) => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  };

  if (theme === 'dark') {
    apply(true);
  } else if (theme === 'light') {
    apply(false);
  } else {
    // 'system' — follow OS preference and keep watching
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    apply(mq.matches);
    _systemThemeListener = (e) => apply(e.matches);
    mq.addEventListener('change', _systemThemeListener);
  }
};

/* ─── Density application ───────────────────────────────────────────────────── */
export const applyDensity = (density) => {
  document.documentElement.setAttribute('data-density', density);
};

const useAuthStore = create((set, get) => ({
  user:            JSON.parse(localStorage.getItem('civicseva_user') || 'null'),
  token:           localStorage.getItem('civicseva_token') || null,
  isAuthenticated: !!localStorage.getItem('civicseva_token'),
  preferences:     JSON.parse(localStorage.getItem('civicseva_prefs') || 'null') || DEFAULT_PREFS,
  isLoading:       false,
  error:           null,

  // ─── Register ──────────────────────────────────────────────────────────────
  register: async ({ name, email, password, password_confirmation, phone }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', {
        name, email, password, password_confirmation, phone,
      });
      const { user, token } = data.data;
      localStorage.setItem('civicseva_token', token);
      localStorage.setItem('civicseva_user', JSON.stringify(user));
      const prefs = user.preferences || DEFAULT_PREFS;
      localStorage.setItem('civicseva_prefs', JSON.stringify(prefs));
      applyTheme(prefs.theme);
      applyDensity(prefs.density);
      set({ user, token, isAuthenticated: true, preferences: prefs, isLoading: false });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ isLoading: false, error });
      return { success: false, error };
    }
  },

  // ─── Login ─────────────────────────────────────────────────────────────────
  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user, token } = data.data;
      localStorage.setItem('civicseva_token', token);
      localStorage.setItem('civicseva_user', JSON.stringify(user));
      const prefs = user.preferences || DEFAULT_PREFS;
      localStorage.setItem('civicseva_prefs', JSON.stringify(prefs));
      applyTheme(prefs.theme);
      applyDensity(prefs.density);
      set({ user, token, isAuthenticated: true, preferences: prefs, isLoading: false });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Invalid email or password.';
      set({ isLoading: false, error });
      return { success: false, error };
    }
  },

  // ─── Logout ────────────────────────────────────────────────────────────────
  logout: async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    localStorage.removeItem('civicseva_token');
    localStorage.removeItem('civicseva_user');
    localStorage.removeItem('civicseva_prefs');
    applyTheme('system');
    applyDensity('comfortable');
    set({ user: null, token: null, isAuthenticated: false, preferences: DEFAULT_PREFS, error: null });
  },

  // ─── Fetch Current User ─────────────────────────────────────────────────────
  fetchMe: async () => {
    if (!get().token) return;
    set({ isLoading: true });
    try {
      const { data } = await api.get('/auth/me');
      const user = data.data;
      localStorage.setItem('civicseva_user', JSON.stringify(user));
      const prefs = user.preferences || DEFAULT_PREFS;
      localStorage.setItem('civicseva_prefs', JSON.stringify(prefs));
      applyTheme(prefs.theme);
      applyDensity(prefs.density);
      set({ user, isAuthenticated: true, preferences: prefs, isLoading: false });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('civicseva_token');
        localStorage.removeItem('civicseva_user');
        localStorage.removeItem('civicseva_prefs');
        set({ user: null, token: null, isAuthenticated: false, preferences: DEFAULT_PREFS, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    }
  },

  // ─── Update Profile ─────────────────────────────────────────────────────────
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put('/auth/profile', profileData);
      const { data } = await api.get('/auth/me');
      const user = data.data;
      localStorage.setItem('civicseva_user', JSON.stringify(user));
      set({ user, isLoading: false });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Failed to update profile.';
      set({ isLoading: false, error });
      return { success: false, error };
    }
  },

  // ─── Update Preferences ─────────────────────────────────────────────────────
  updatePreferences: async (partial) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put('/auth/preferences', partial);
      const prefs = data.data;
      localStorage.setItem('civicseva_prefs', JSON.stringify(prefs));
      if (partial.theme)   applyTheme(prefs.theme);
      if (partial.density) applyDensity(prefs.density);
      set({ preferences: prefs, isLoading: false });
      return { success: true, data: prefs };
    } catch (err) {
      const error = err.response?.data?.message || 'Failed to save preferences.';
      set({ isLoading: false, error });
      return { success: false, error };
    }
  },

  clearError: () => set({ error: null }),
}));

// Listen for 401 events from the API interceptor
window.addEventListener('auth:unauthorized', () => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
});

// Apply stored preferences immediately on module load (before React mounts)
const bootPrefs = JSON.parse(localStorage.getItem('civicseva_prefs') || 'null') || DEFAULT_PREFS;
applyTheme(bootPrefs.theme);
applyDensity(bootPrefs.density);

export default useAuthStore;
