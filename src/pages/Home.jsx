import React, { useEffect, useCallback } from 'react';
import { Search, Sparkles, ArrowRight, MessageSquare, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useSchemeStore from '../store/schemeStore';

const CATEGORY_ICONS = {
  'agriculture-farming': '🚜',
  'education-scholarships': '🎓',
  'health-medical': '🏥',
  'housing-urban-development': '🏠',
  'finance-banking': '💰',
  'social-welfare': '🤝',
  'employment-skill': '💼',
  'digital-india': '📱',
  'environment-energy': '🌱',
  'women-empowerment': '👩',
};

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-border p-6 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-lg bg-gray-200" />
      <div className="w-20 h-6 bg-gray-200 rounded-full" />
    </div>
    <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
    <div className="h-4 bg-gray-100 rounded mb-1 w-full" />
    <div className="h-4 bg-gray-100 rounded mb-6 w-2/3" />
    <div className="flex gap-3">
      <div className="flex-1 h-10 bg-gray-100 rounded-lg" />
      <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { schemes, isLoading, fetchSchemes } = useSchemeStore();

  useEffect(() => {
    fetchSchemes({ per_page: 6, page: 1 });
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/assistant?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, navigate]);

  const handleAskAssistant = (scheme) => {
    navigate(`/assistant?schemeId=${scheme.id}&schemeTitle=${encodeURIComponent(scheme.title)}`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm mb-12"
      >
        <h1 className="text-4xl font-bold text-text-dark mb-4 tracking-tight">How can we help you today?</h1>
        <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
          Access government services, find grants, or chat with our AI assistant for immediate guidance.
        </p>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={24} />
          <input
            id="home-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Describe your needs (e.g., 'I need help starting a small business')"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-14 pr-32 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            Ask AI
            <Sparkles size={18} />
          </button>
        </form>

        {/* Quick prompts */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {['Farmer income support', 'Education scholarship', 'Housing loan subsidy', 'Healthcare coverage'].map((q) => (
            <button
              key={q}
              onClick={() => navigate(`/assistant?q=${encodeURIComponent(q)}`)}
              className="text-sm text-text-muted bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-full transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Featured Schemes */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-dark mb-1 tracking-tight">Featured Schemes</h2>
          <p className="text-text-muted">Popular government programs available to you.</p>
        </div>
        <button
          onClick={() => navigate('/schemes')}
          className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : schemes.slice(0, 6).map((scheme, index) => {
              const icon = CATEGORY_ICONS[scheme.category?.slug] || '📋';
              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                      {icon}
                    </div>
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {scheme.category?.name || 'General'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-dark mb-2 leading-tight">{scheme.title}</h3>
                  <p className="text-text-muted text-sm flex-1 mb-6 leading-relaxed line-clamp-3">
                    {scheme.description}
                  </p>

                  {scheme.benefits?.length > 0 && (
                    <p className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg mb-4">
                      ✓ {scheme.benefits[0]}
                    </p>
                  )}

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => navigate(`/schemes/${scheme.id}`)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-text-dark py-2.5 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-1"
                    >
                      Learn More
                      <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={() => handleAskAssistant(scheme)}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <MessageSquare size={16} />
                      Chat
                    </button>
                  </div>
                </motion.div>
              );
            })
        }
      </div>

      {!isLoading && schemes.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted">No schemes loaded yet. Please ensure the backend is running.</p>
          <button onClick={() => fetchSchemes()} className="mt-4 text-primary hover:text-primary-dark font-medium">
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
