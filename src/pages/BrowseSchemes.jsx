import React, { useState, useEffect, useRef } from 'react';
import {
  Search, X, ExternalLink, Bot, ChevronDown,
  Filter, Landmark, ArrowRight, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useSchemeStore from '../store/schemeStore';

/* ─── Category badge colour map ─────────────────────────────────────────────── */
const CATEGORY_COLORS = {
  'Agriculture & Farming':      { bg: 'bg-green-50',   text: 'text-green-700',   dot: 'bg-green-500'   },
  'Health & Medical':           { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'     },
  'Education & Scholarships':   { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  'Housing & Urban Development':{ bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500'  },
  'Finance & Banking':          { bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-500'  },
  'Women Empowerment':          { bg: 'bg-pink-50',    text: 'text-pink-700',    dot: 'bg-pink-500'    },
  'Employment & Skill':         { bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-500'  },
  'Social Welfare':             { bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-500'  },
  'Digital India':              { bg: 'bg-cyan-50',    text: 'text-cyan-700',    dot: 'bg-cyan-500'    },
  'Environment & Energy':       { bg: 'bg-teal-50',    text: 'text-teal-700',    dot: 'bg-teal-500'    },
};
const DEFAULT_COLOR = { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
const getCategoryColor = (name) => CATEGORY_COLORS[name] || DEFAULT_COLOR;

/* ─── Skeleton card ─────────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-24 h-5 bg-gray-100 rounded-full" />
      <div className="w-5 h-5 bg-gray-100 rounded" />
    </div>
    <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
    <div className="h-4 bg-gray-100 rounded mb-1 w-full" />
    <div className="h-4 bg-gray-100 rounded mb-1 w-5/6" />
    <div className="h-4 bg-gray-100 rounded mb-5 w-2/3" />
    <div className="h-3 bg-gray-100 rounded mb-5 w-1/2" />
    <div className="flex gap-2 mt-auto pt-3 border-t border-gray-50">
      <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
      <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

/* ─── Category Dropdown ─────────────────────────────────────────────────────── */
const CategoryDropdown = ({ categories, activeCategory, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = categories.find((c) => c.id === activeCategory);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all min-w-[180px] ${
          activeCategory
            ? 'bg-primary text-white border-primary shadow-sm'
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <Filter size={15} className="shrink-0" />
        <span className="flex-1 text-left truncate">
          {active ? active.name : 'All Categories'}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-30 overflow-hidden py-1"
          >
            <button
              onClick={() => { onChange(''); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${!activeCategory ? 'text-primary font-semibold' : 'text-gray-700'}`}
            >
              <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
              All Categories
            </button>
            <div className="border-t border-gray-100 my-1" />
            {categories.map((cat) => {
              const color = getCategoryColor(cat.name);
              return (
                <button
                  key={cat.id}
                  onClick={() => { onChange(cat.id); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${activeCategory === cat.id ? 'text-primary font-semibold bg-blue-50/50' : 'text-gray-700'}`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${color.dot}`} />
                  {cat.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Scheme Card ───────────────────────────────────────────────────────────── */
const SchemeCard = ({ scheme, index, onAskAssistant, onViewDetail }) => {
  const color = getCategoryColor(scheme.category?.name);

  const handleOfficialSite = (e) => {
    e.stopPropagation();
    if (scheme.application_url) {
      window.open(scheme.application_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.04, duration: 0.22 }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col group cursor-pointer"
      onClick={() => onViewDetail(scheme.id)}
      role="article"
      aria-label={scheme.title}
    >
      {/* Category badge */}
      <div className="flex items-start justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
          {scheme.category?.name || 'General'}
        </span>
        {scheme.application_url && (
          <button
            onClick={handleOfficialSite}
            title="Visit official website"
            className="p-1.5 rounded-lg text-gray-300 hover:text-primary hover:bg-blue-50 transition-all"
          >
            <ExternalLink size={14} />
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
        {scheme.title}
      </h3>

      {/* Description */}
      <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-3">
        {scheme.description}
      </p>

      {/* Ministry */}
      {scheme.ministry && (
        <p className="text-[11px] text-gray-400 mb-3 flex items-center gap-1.5">
          <Landmark size={11} className="shrink-0" />
          <span className="truncate">{scheme.ministry}</span>
        </p>
      )}

      {/* Key benefit pill */}
      {scheme.benefits?.[0] && (
        <div className="flex items-start gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-[12px] font-medium mb-4">
          <span className="shrink-0 mt-px">✓</span>
          <span className="line-clamp-1">{scheme.benefits[0]}</span>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-50 mt-auto" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onAskAssistant(scheme)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/8 text-primary hover:bg-primary/15 transition-colors text-[13px] font-medium"
        >
          <Bot size={14} />
          Ask AI
        </button>
        {scheme.application_url ? (
          <button
            onClick={handleOfficialSite}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-[13px] font-medium border border-gray-100"
          >
            <ExternalLink size={13} />
            Apply Now
          </button>
        ) : (
          <button
            onClick={() => onViewDetail(scheme.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-[13px] font-medium border border-gray-100"
          >
            <ArrowRight size={13} />
            View Details
          </button>
        )}
      </div>
    </motion.article>
  );
};

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
const BrowseSchemes = () => {
  const navigate = useNavigate();
  const { schemes, categories, isLoading, meta, fetchSchemes, fetchCategories } = useSchemeStore();

  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchRef = useRef(null);

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchSchemes({ per_page: 18 });
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 420);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Re-fetch on filter change
  useEffect(() => {
    fetchSchemes({ search: debouncedSearch, categoryid: activeCategory, page: 1 });
  }, [debouncedSearch, activeCategory]);

  const clearFilters = () => { setSearchInput(''); setActiveCategory(''); };
  const hasFilters = searchInput || activeCategory;

  const handleAskAssistant = (scheme) => {
    navigate(`/assistant?schemeId=${scheme.id}&schemeTitle=${encodeURIComponent(scheme.title)}`);
  };

  const activeCategory_obj = categories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-full bg-gray-50/40">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <BookOpen size={14} />
            <span>Government Schemes</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Browse Schemes</h1>
          <p className="text-gray-500 max-w-xl">
            Discover government programs designed to support citizens, businesses, and communities across India.
          </p>
        </div>

        {/* ── Search + Filter Bar ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              ref={searchRef}
              id="browse-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search schemes by name, benefit, or keyword…"
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-9 pr-9 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category dropdown */}
          <CategoryDropdown
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />

          {/* Clear filters */}
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
              >
                <X size={14} /> Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Results meta ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[13px] text-gray-400">
            {isLoading ? (
              <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
            ) : (
              <>
                <span className="font-medium text-gray-700">{meta?.total ?? schemes.length}</span> scheme{(meta?.total ?? schemes.length) !== 1 ? 's' : ''}
                {debouncedSearch && <> matching <span className="font-medium text-gray-700">"{debouncedSearch}"</span></>}
                {activeCategory_obj && <> in <span className="font-medium text-gray-700">{activeCategory_obj.name}</span></>}
              </>
            )}
          </p>
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : schemes.map((scheme, index) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  index={index}
                  onAskAssistant={handleAskAssistant}
                  onViewDetail={(id) => navigate(`/schemes/${id}`)}
                />
              ))
          }
        </div>

        {/* ── Empty State ───────────────────────────────────────────────── */}
        {!isLoading && schemes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={26} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No schemes found</h3>
            <p className="text-gray-500 text-[14px] mb-5">
              {hasFilters ? 'Try different keywords or clear your filters.' : 'No schemes are available at this time.'}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BrowseSchemes;
