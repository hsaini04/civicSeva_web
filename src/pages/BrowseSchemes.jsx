import React, { useState } from 'react';
import { Bookmark, Bot, Calendar, Clock, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const BrowseSchemes = () => {
  const [activeFilter, setActiveFilter] = useState('All Categories');

  const categories = [
    'All Categories', 'Agriculture', 'Education & Skill', 'Healthcare', 'Housing', 'Business & MSME'
  ];

  const schemes = [
    {
      id: 1,
      title: "Prime Minister's Farmer Income Support",
      description: "Direct income support of ₹6,000 per year to all landholding farmer families, provided in three equal installments.",
      category: 'Agriculture',
      deadline: 'Oct 31',
      icon: <Clock size={16} />
    },
    {
      id: 2,
      title: "National Merit Scholarship Portal",
      description: "Financial assistance for meritorious students from low-income families to meet a part of their day-to-day expenses while pursuing higher studies.",
      category: 'Education & Skill',
      department: 'Dept of Education',
      icon: <Building size={16} />
    },
    {
      id: 3,
      title: "Universal Health Coverage Plan",
      description: "Provides health insurance coverage of up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
      category: 'Healthcare',
      status: 'Auto-Renewable',
      icon: <Calendar size={16} />
    },
    {
      id: 4,
      title: "Urban Affordable Housing Scheme",
      description: "Subsidized home loans and direct allocation of affordable housing units for first-time buyers in urban and peri-urban areas.",
      category: 'Housing',
      location: 'Urban Only',
      icon: <Building size={16} />
    },
    {
      id: 5,
      title: "Micro-Enterprise Credit Guarantee",
      description: "Collateral-free credit facility for micro and small enterprises to support working capital and business expansion needs.",
      category: 'Business & MSME',
      type: 'Financial',
      icon: <Bookmark size={16} />
    },
    {
      id: 6,
      title: "Sustainable Irrigation Grant",
      description: "Financial assistance for adopting micro-irrigation systems to improve water use efficiency and crop productivity.",
      category: 'Agriculture',
      impact: 'Environment',
      icon: <Bookmark size={16} />
    }
  ];

  const filteredSchemes = activeFilter === 'All Categories' 
    ? schemes 
    : schemes.filter(s => s.category === activeFilter);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-text-dark mb-4 tracking-tight">Browse Schemes</h1>
        <p className="text-lg text-text-muted max-w-2xl">
          Discover and apply for government programs designed to support citizens, businesses, and communities.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeFilter === category
                ? 'bg-primary text-white shadow-md'
                : 'bg-white border border-border text-text-muted hover:border-gray-300 hover:text-text-dark'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group"
          >
            <button className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-colors">
              <Bookmark size={20} />
            </button>

            <div className="mb-4">
              <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                {scheme.category}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-text-dark mb-3 leading-tight pr-8">{scheme.title}</h3>
            <p className="text-text-muted text-sm flex-1 mb-6 leading-relaxed line-clamp-3">
              {scheme.description}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
              {scheme.icon}
              <span>
                {scheme.deadline && `Deadline: ${scheme.deadline}`}
                {scheme.department && scheme.department}
                {scheme.status && scheme.status}
                {scheme.location && scheme.location}
                {scheme.type && scheme.type}
                {scheme.impact && scheme.impact}
              </span>
            </div>

            <button className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-text-dark py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm">
              <Bot size={18} className="text-primary" />
              Ask Assistant
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BrowseSchemes;
