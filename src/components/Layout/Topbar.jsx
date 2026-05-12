import React, { useState, useCallback } from 'react';
import { Search, User, LogOut, ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { useSidebar } from './AppLayout';

const Topbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggle } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/assistant?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
    navigate('/login');
  };

  const displayName = user?.name || 'Guest';
  const initials    = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-4 sticky top-0 z-10 shrink-0">

      {/* ── Hamburger ─────────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        id="topbar-menu-toggle"
        aria-label="Toggle sidebar"
        className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-gray-100 transition-colors shrink-0 group"
      >
        <span className="w-[18px] h-[2px] bg-gray-500 rounded-full transition-colors group-hover:bg-gray-900" />
        <span className="w-[18px] h-[2px] bg-gray-500 rounded-full transition-colors group-hover:bg-gray-900" />
        <span className="w-[14px] h-[2px] bg-gray-500 rounded-full self-start ml-[2px] transition-colors group-hover:bg-gray-900" />
      </button>

      {/* ── Search ────────────────────────────────────────────────────── */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <input
            id="topbar-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes or ask a question…"
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-all"
          />
        </div>
      </form>

      {/* ── Right Controls ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 ml-auto">



        {/* User Menu */}
        <div className="relative ml-1">
          <button
            id="topbar-user-menu"
            onClick={() => setShowMenu((s) => !s)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-xs overflow-hidden shrink-0">
              {user?.avatar
                ? <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                : isAuthenticated ? initials : <User size={15} />
              }
            </div>
            {isAuthenticated && (
              <>
                <span className="text-[13px] font-medium text-gray-800 hidden sm:block">{displayName.split(' ')[0]}</span>
                <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
              </>
            )}
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-20"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-[13px] font-semibold text-gray-900 truncate">{displayName}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <button onClick={() => { navigate('/profile'); setShowMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
                        <User size={15} /> My Profile
                      </button>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { navigate('/login'); setShowMenu(false); }}
                        className="w-full flex items-center justify-center px-4 py-3 text-[13px] text-primary font-semibold hover:bg-blue-50 transition-colors">
                        Sign In
                      </button>
                      <button onClick={() => { navigate('/register'); setShowMenu(false); }}
                        className="w-full flex items-center justify-center px-4 py-2.5 text-[13px] text-gray-500 hover:bg-gray-50 transition-colors border-t border-gray-100">
                        Create Account
                      </button>
                    </>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
