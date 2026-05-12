import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, Landmark, AlertCircle, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full name is required';
    if (!form.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (form.password !== form.password_confirmation) errors.password_confirmation = 'Passwords do not match';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const errors = validate();
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setFieldErrors({});
    const result = await register(form);
    if (result.success) navigate('/', { replace: true });
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors((f) => ({ ...f, [e.target.name]: '' }));
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Rahul Sharma', icon: User, autoComplete: 'name' },
    { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', icon: Mail, autoComplete: 'email' },
    { name: 'phone', label: 'Phone Number (optional)', type: 'tel', placeholder: '9876543210', icon: Phone, autoComplete: 'tel' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <Landmark size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">CivicSeva</h1>
          <p className="text-blue-200 mt-1 text-sm">Create your citizen account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Create your account</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-200 rounded-lg px-4 py-3 mb-5 text-sm"
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder, icon: Icon, autoComplete }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-blue-100 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input
                    id={`register-${name}`}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full bg-white/10 border ${fieldErrors[name] ? 'border-red-400' : 'border-white/20'} rounded-xl py-3 pl-10 pr-4 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all`}
                  />
                </div>
                {fieldErrors[name] && <p className="text-red-300 text-xs mt-1">{fieldErrors[name]}</p>}
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`w-full bg-white/10 border ${fieldErrors.password ? 'border-red-400' : 'border-white/20'} rounded-xl py-3 pl-10 pr-12 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all`}
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-300 text-xs mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  id="register-password-confirm"
                  name="password_confirmation"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`w-full bg-white/10 border ${fieldErrors.password_confirmation ? 'border-red-400' : 'border-white/20'} rounded-xl py-3 pl-10 pr-4 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all`}
                />
              </div>
              {fieldErrors.password_confirmation && <p className="text-red-300 text-xs mt-1">{fieldErrors.password_confirmation}</p>}
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all mt-6 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-blue-200 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
