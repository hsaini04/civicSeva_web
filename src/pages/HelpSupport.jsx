import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, FileText, ChevronDown, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

const FAQS = [
  {
    q: "How do I apply for a scheme?",
    a: "You can apply for most schemes directly through the 'Browse Schemes' page. Click on any scheme to view its eligibility criteria and application process. Some schemes will redirect you to the official government portal for submission."
  },
  {
    q: "Is CivicSeva free to use?",
    a: "Yes! CivicSeva is a completely free platform designed to help citizens discover and access government benefits."
  },
  {
    q: "How do I track my application?",
    a: "Currently, you can track applications for supported schemes directly on their respective official government portals. We are working on integrating direct status tracking in future updates."
  },
  {
    q: "Are my details secure?",
    a: "Absolutely. We use industry-standard encryption to protect your data. Your profile details are securely stored and only used to match you with eligible government schemes."
  }
];

const HelpSupport = () => {
  const user = useAuthStore((s) => s.user);

  const [activeFaq, setActiveFaq] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/support/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.debug || data.message || 'Failed to submit ticket');
      }

      setStatus('success');
      setFormData({
        ...formData,
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);

    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const inputClass = "w-full bg-gray-50 border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-dark placeholder:text-text-muted";
  const labelClass = "block text-sm font-medium text-text-dark mb-1.5";

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24 h-full overflow-y-auto scrollbar-thin">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-text-dark tracking-tight mb-2">Help & Support</h1>
        <p className="text-text-muted text-lg">We're here to help you navigate government services.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: FAQ & Contact Info */}
        <div className="lg:col-span-5 space-y-8 flex flex-col gap-5">

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-white border border-border rounded-2xl p-5 shadow-sm text-center flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-bold text-text-dark text-sm">Live Chat</h3>
              <p className="text-xs text-text-muted">Available via CivicAssist</p>
            </div>
            <div className="bg-bg-white border border-border rounded-2xl p-5 shadow-sm text-center flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-text-dark text-sm">Documentation</h3>
              <p className="text-xs text-text-muted">Read our guides</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className=" bg-bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text-dark">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-border">
              {FAQS.map((faq, i) => (
                <div key={i} className="group">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-medium text-text-dark pr-4">{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-text-muted transition-transform duration-200 ${activeFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-sm text-text-muted leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-bg-white border border-border rounded-2xl shadow-sm p-6 md:p-8 relative overflow-hidden">

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-dark">Send us a message</h2>
                <p className="text-sm text-text-muted">We usually reply within 24 hours.</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-6 text-center"
                >
                  <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-1">Ticket Submitted!</h3>
                  <p className="text-sm text-green-700 dark:text-green-500/80">
                    Thank you for reaching out. We have received your query and will get back to you at <strong>{formData.email}</strong> soon.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-4 py-2 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {status === 'error' && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Submission Failed</h4>
                        <p className="text-sm text-red-600 dark:text-red-400/80 mt-0.5">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Query Category</label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Scheme Application Issue">Scheme Application Issue</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Account Management">Account Management</option>
                          <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Briefly describe your issue"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputClass} resize-none`}
                      placeholder="Please provide as much detail as possible..."
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl font-medium shadow-sm shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Submit Ticket'
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
