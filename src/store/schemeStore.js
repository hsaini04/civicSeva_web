import { create } from 'zustand';
import api from '../lib/api';

const useSchemeStore = create((set, get) => ({
  schemes: [],
  categories: [],
  currentScheme: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  meta: null,
  filters: {
    search: '',
    categoryid: '',
    page: 1,
    per_page: 15,
  },

  // ─── Fetch Schemes ──────────────────────────────────────────────────────────
  fetchSchemes: async (overrideFilters = {}) => {
    set({ isLoading: true, error: null });
    const filters = { ...get().filters, ...overrideFilters };
    set({ filters });

    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.categoryid) params.category_id = filters.categoryid;
      if (filters.page) params.page = filters.page;
      if (filters.per_page) params.per_page = filters.per_page;

      const { data } = await api.get('/schemes', { params });
      set({
        schemes: data.data,
        meta: data.meta,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to load schemes.',
        isLoading: false,
      });
    }
  },

  // ─── Fetch Categories ────────────────────────────────────────────────────────
  fetchCategories: async () => {
    try {
      const { data } = await api.get('/categories');
      set({ categories: data.data || [] });
    } catch (_) {
      // Non-critical — silently fail
    }
  },

  // ─── Fetch Single Scheme ─────────────────────────────────────────────────────
  fetchScheme: async (id) => {
    set({ isLoadingDetail: true, error: null, currentScheme: null });
    try {
      const { data } = await api.get(`/schemes/${id}`);
      set({ currentScheme: data.data, isLoadingDetail: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Scheme not found.',
        isLoadingDetail: false,
      });
    }
  },

  clearCurrentScheme: () => set({ currentScheme: null }),
  clearError: () => set({ error: null }),
}));

export default useSchemeStore;
