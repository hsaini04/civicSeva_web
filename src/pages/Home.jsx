import React from 'react';
import { Search, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const featuredSchemes = [
    {
      id: 1,
      title: 'Agricultural Subsidy',
      description: 'Financial support for local farmers to adopt sustainable farming technologies.',
      category: 'Agriculture',
      icon: '🚜'
    },
    {
      id: 2,
      title: 'Higher Education Grant',
      description: 'Grants for eligible students pursuing undergraduate degrees at accredited institutions.',
      category: 'Education',
      icon: '🎓'
    },
    {
      id: 3,
      title: 'Small Business Startup',
      description: 'Initial funding and mentorship programs for new local business ventures.',
      category: 'Business',
      icon: '🏪'
    },
    {
      id: 4,
      title: 'First-Time Homebuyer',
      description: 'Subsidized home loans and direct allocation of affordable housing units.',
      category: 'Housing',
      icon: '🏠'
    },
    {
      id: 5,
      title: 'Solar Energy Rebate',
      description: 'Rebates for installing solar panels on residential and commercial properties.',
      category: 'Environment',
      icon: '☀️'
    },
    {
      id: 6,
      title: 'Senior Care Support',
      description: 'Financial assistance for seniors requiring in-home care and medical support.',
      category: 'Social',
      icon: '👵'
    }
  ];

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

        <div className="max-w-3xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Describe your needs (e.g., 'I need help starting a small business')"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-14 pr-32 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            Ask AI
            <Sparkles size={18} />
          </button>
        </div>
      </motion.div>

      {/* Featured Schemes Section */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-dark mb-1 tracking-tight">Featured Schemes</h2>
          <p className="text-text-muted">Popular programs tailored for you.</p>
        </div>
        <button className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors">
          View All
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                {scheme.icon}
              </div>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {scheme.category}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-text-dark mb-2 leading-tight">{scheme.title}</h3>
            <p className="text-text-muted text-sm flex-1 mb-6 leading-relaxed">
              {scheme.description}
            </p>
            
            <div className="flex gap-3 mt-auto">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-text-dark py-2.5 rounded-lg font-medium transition-colors text-sm">
                Learn More
              </button>
              <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm">
                <MessageSquare size={16} />
                Chat
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
