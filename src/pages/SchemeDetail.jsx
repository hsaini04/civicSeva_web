import React from 'react';
import { ArrowLeft, Bot, CheckCircle2, Stethoscope, Landmark, TrendingUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SchemeDetail = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      {/* Header Info */}
      <div className="mb-8">
        <Link to="/schemes" className="inline-flex items-center gap-2 text-text-muted hover:text-text-dark font-medium mb-6 transition-colors">
          <ArrowLeft size={18} />
          Back to Schemes
        </Link>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            ACTIVE PROGRAM
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4 tracking-tight leading-tight">
          Agricultural Infrastructure Support
        </h1>
        <p className="text-xl text-text-muted max-w-3xl leading-relaxed">
          Financial and material assistance for local farmers to modernize infrastructure, improve yield sustainability, and integrate smart farming technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="h-64 bg-green-100 relative overflow-hidden">
             {/* Using a placeholder gradient for the image */}
             <div className="absolute inset-0 bg-gradient-to-tr from-green-300 to-green-100 opacity-50"></div>
             <img 
               src="https://images.unsplash.com/photo-1592982537447-6f296317b2b3?auto=format&fit=crop&q=80&w=1000" 
               alt="Agricultural field" 
               className="w-full h-full object-cover mix-blend-overlay"
             />
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-4">About the Scheme</h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                The Agricultural Infrastructure Support Scheme is a federal initiative designed to fortify the backbone of our local food supply chain. By providing targeted funding and resources, we aim to lower the barrier to entry for modern farming equipment and sustainable practices.
              </p>
              <p>
                This program covers up to 60% of eligible costs associated with building upgrades, smart irrigation systems, and renewable energy installations tailored for agricultural use.
              </p>
            </div>
          </div>
        </div>

        {/* Assistant CTA Card */}
        <div className="bg-[#0b1c3b] rounded-2xl p-8 text-white flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="w-16 h-16 bg-white text-[#0b1c3b] rounded-full flex items-center justify-center mb-6 shadow-md z-10">
            <Bot size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3 z-10">Have Questions?</h3>
          <p className="text-blue-100 mb-8 z-10 text-sm leading-relaxed max-w-[200px]">
            Our Smart Assistant can help you determine your eligibility and guide you through the process instantly.
          </p>
          <button className="w-full bg-[#1d4ed8] hover:bg-blue-600 transition-colors py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 z-10">
            <Bot size={20} />
            Ask Assistant about this Scheme
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Benefits Card */}
        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
               <TrendingUp size={20} />
            </div>
            <h2 className="text-2xl font-bold text-text-dark">Key Benefits</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Landmark size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-text-dark mb-1 text-sm">Financial Grants</h4>
                <p className="text-xs text-text-muted leading-relaxed">Up to $50,000 in direct grants for approved infrastructure projects.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-text-dark mb-1 text-sm">Sustainability Bonus</h4>
                <p className="text-xs text-text-muted leading-relaxed">Additional 10% coverage for projects reducing carbon footprint.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Stethoscope size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-text-dark mb-1 text-sm">Expert Consultation</h4>
                <p className="text-xs text-text-muted leading-relaxed">Free access to government agricultural engineers for planning.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-text-dark mb-1 text-sm">Tax Incentives</h4>
                <p className="text-xs text-text-muted leading-relaxed">Accelerated depreciation on new equipment purchased through the scheme.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Checklist Card */}
        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
               <HelpCircle size={20} />
            </div>
            <h2 className="text-2xl font-bold text-text-dark">Eligibility Checklist</h2>
          </div>
          
          <p className="text-sm text-text-muted mb-6 leading-relaxed">
            To qualify for this scheme, applicants must meet the following baseline criteria. The Smart Assistant can help verify specific edge cases.
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-4 flex gap-4">
              <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-text-dark text-sm mb-1">Registered Business Entity</h4>
                <p className="text-xs text-text-muted">Must be a registered farm or agricultural cooperative operating for at least 2 years.</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 flex gap-4">
              <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-text-dark text-sm mb-1">Revenue Threshold</h4>
                <p className="text-xs text-text-muted">Annual gross revenue strictly derived from farming must be below $5 million.</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 flex gap-4">
              <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-text-dark text-sm mb-1">Compliance Status</h4>
                <p className="text-xs text-text-muted">Must hold active environmental and zoning compliance certificates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;
