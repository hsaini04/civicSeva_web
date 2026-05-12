import React, { useEffect } from 'react';
import { ArrowLeft, Bot, CheckCircle2, ExternalLink, FileText, TrendingUp, HelpCircle, Landmark } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useSchemeStore from '../store/schemeStore';

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentScheme: scheme, isLoadingDetail, error, fetchScheme, clearCurrentScheme } = useSchemeStore();

  useEffect(() => {
    fetchScheme(id);
    return () => clearCurrentScheme();
  }, [id]);

  if (isLoadingDetail) {
    return (
      <div className="p-8 max-w-5xl mx-auto animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-8" />
        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4" />
        <div className="h-4 bg-gray-100 rounded mb-2 w-full" />
        <div className="h-4 bg-gray-100 rounded mb-8 w-5/6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-100 rounded-2xl" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center py-24">
        <Landmark size={48} className="text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-dark mb-2">Scheme not found</h2>
        <p className="text-text-muted mb-6">{error || 'This scheme may have been removed or is no longer available.'}</p>
        <Link to="/schemes" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors">
          <ArrowLeft size={18} /> Browse Schemes
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      {/* Back + Status */}
      <div className="mb-8">
        <Link to="/schemes" className="inline-flex items-center gap-2 text-text-muted hover:text-text-dark font-medium mb-6 transition-colors">
          <ArrowLeft size={18} />
          Back to Schemes
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            <span className={`w-1.5 h-1.5 rounded-full ${scheme.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
            {scheme.is_active ? 'ACTIVE PROGRAM' : 'INACTIVE'}
          </span>
          {scheme.category?.name && (
            <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
              {scheme.category.name}
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4 tracking-tight leading-tight">
          {scheme.title}
        </h1>
        <p className="text-xl text-text-muted max-w-3xl leading-relaxed">{scheme.description}</p>

        {scheme.ministry && (
          <p className="text-sm text-text-muted mt-3 flex items-center gap-1.5">
            <Landmark size={14} />
            {scheme.ministry}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="h-56 bg-gradient-to-tr from-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Landmark size={120} className="text-white" />
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm font-medium opacity-80">Government of India</p>
              <h2 className="text-2xl font-bold">{scheme.title}</h2>
            </div>
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-4">About the Scheme</h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>{scheme.description}</p>
              {scheme.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {scheme.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {scheme.required_documents?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-text-dark mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-primary" /> Required Documents
                </h3>
                <ul className="space-y-2">
                  {scheme.required_documents.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2 text-text-muted text-sm">
                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {scheme.application_url && (
              <div className="mt-8 pt-6 border-t border-border">
                <a
                  href={scheme.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Apply on Official Portal
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Assistant CTA */}
        <div className="bg-[#0b1c3b] rounded-2xl p-8 text-white flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="w-16 h-16 bg-white text-[#0b1c3b] rounded-full flex items-center justify-center mb-6 shadow-md z-10">
            <Bot size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3 z-10">Have Questions?</h3>
          <p className="text-blue-100 mb-8 z-10 text-sm leading-relaxed max-w-[200px]">
            Our Smart Assistant can check your eligibility and guide you step by step.
          </p>
          <button
            onClick={() => navigate(`/assistant?schemeId=${scheme.id}&schemeTitle=${encodeURIComponent(scheme.title)}`)}
            className="w-full bg-[#1d4ed8] hover:bg-blue-600 transition-colors py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 z-10"
          >
            <Bot size={20} />
            Ask about this Scheme
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Benefits */}
        {scheme.benefits?.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-2xl font-bold text-text-dark">Key Benefits</h2>
            </div>
            <ul className="space-y-4">
              {scheme.benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-text-muted text-sm leading-relaxed">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Eligibility */}
        {scheme.eligibility_rules?.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <HelpCircle size={20} />
              </div>
              <h2 className="text-2xl font-bold text-text-dark">Eligibility Criteria</h2>
            </div>
            <div className="space-y-3">
              {scheme.eligibility_rules.map((rule, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 flex gap-3 hover:border-blue-200 transition-colors">
                  <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-text-muted leading-relaxed">{rule.label || `${rule.field} ${rule.operator} ${rule.value}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemeDetail;
