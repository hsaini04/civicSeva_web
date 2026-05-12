import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, IndianRupee, Shield, CheckCircle2, AlertCircle, Camera, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/authStore';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
  'Andaman & Nicobar','Chandigarh','Dadra & Nagar Haveli','Daman & Diu','Lakshadweep','Puducherry',
];

const Profile = () => {
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({
    name: '', phone: '', state: '', district: '', date_of_birth: '',
    gender: '', annual_income: '', caste_category: '', avatar: '',
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        state: user.state || '',
        district: user.district || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        annual_income: user.annual_income || '',
        caste_category: user.caste_category || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSuccess(false);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    const payload = { ...form };
    if (payload.annual_income) payload.annual_income = parseInt(payload.annual_income);
    const result = await updateProfile(payload);
    if (result.success) setSuccess(true);
  };

  // Profile completion score
  const fields = ['name', 'phone', 'state', 'district', 'date_of_birth', 'gender'];
  const completedCount = fields.filter((f) => form[f]).length;
  const completionPct = Math.round((completedCount / fields.length) * 100);

  const selectClass = "w-full bg-gray-50 border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none text-text-dark";
  const inputClass = "w-full bg-gray-50 border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-dark";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark tracking-tight mb-1">My Profile</h1>
        <p className="text-text-muted">Keep your information up to date to get personalized scheme recommendations.</p>
      </div>

      {/* Profile Completion Banner */}
      <div className={`rounded-2xl p-6 mb-8 flex items-center gap-6 ${completionPct === 100 ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="2" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={completionPct === 100 ? '#22c55e' : '#3b82f6'}
              strokeWidth="2.5"
              strokeDasharray={`${completionPct} ${100 - completionPct}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-dark">{completionPct}%</span>
        </div>
        <div>
          <h3 className="font-bold text-text-dark">
            {completionPct === 100 ? '✅ Profile Complete!' : 'Complete your profile'}
          </h3>
          <p className="text-sm text-text-muted mt-0.5">
            {completionPct === 100
              ? 'You are eligible for personalized scheme recommendations.'
              : `${fields.length - completedCount} fields remaining. Complete your profile to unlock accurate eligibility checks.`}
          </p>
        </div>
      </div>

      {/* Avatar row */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6 flex items-center gap-6 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-border flex items-center justify-center overflow-hidden relative group">
          {form.avatar ? (
            <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={36} className="text-gray-400" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
            <Camera size={20} className="text-white" />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-bold text-text-dark text-lg">{user?.name || 'Your Name'}</p>
          <p className="text-text-muted text-sm">{user?.email}</p>
          <div className="mt-2">
            <label className="text-xs text-text-muted block mb-1">Avatar URL</label>
            <input
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full text-sm bg-gray-50 border border-border rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${user?.profile_completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {user?.profile_completed ? 'Complete' : 'Incomplete'}
          </span>
          {user?.roles && (
            <p className="text-xs text-text-muted mt-2 capitalize">{user.roles[0] || 'citizen'}</p>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-text-dark border-b border-border pb-4">Personal Information</h2>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm"
            >
              <CheckCircle2 size={16} /> Profile updated successfully!
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Full Name *</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input name="name" value={form.name} onChange={handleChange} placeholder="Rahul Sharma" className={inputClass} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" className={inputClass} />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">State *</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <select name="state" value={form.state} onChange={handleChange} className={selectClass}>
                  <option value="">Select state</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">District *</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input name="district" value={form.district} onChange={handleChange} placeholder="e.g. Lucknow" className={inputClass} />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Date of Birth *</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Gender *</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <select name="gender" value={form.gender} onChange={handleChange} className={selectClass}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Annual Income (₹)</label>
              <div className="relative">
                <IndianRupee size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input name="annual_income" type="number" value={form.annual_income} onChange={handleChange} placeholder="e.g. 250000" className={inputClass} />
              </div>
            </div>

            {/* Caste Category */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Category</label>
              <div className="relative">
                <Shield size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <select name="caste_category" value={form.caste_category} onChange={handleChange} className={selectClass}>
                  <option value="">Select category</option>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                  <option value="ews">EWS</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              id="profile-save"
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-dark disabled:opacity-60 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (
                <><CheckCircle2 size={18} /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
