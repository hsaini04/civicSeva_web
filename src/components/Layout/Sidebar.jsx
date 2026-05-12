import React, { useState } from 'react';
import { NavLink as RouterNavLink, NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Bot, LayoutGrid, Plus,
  Settings, HelpCircle, User, LogOut, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useChatStore from '../../store/chatStore';
import { useSidebar } from './AppLayout';

const SIDEBAR_W = 240;
const RAIL_W = 64;

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { clearChat } = useChatStore();
  const { isOpen } = useSidebar();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { name: 'Home',            icon: Home,       path: '/' },
    { name: 'Smart Assistant', icon: Bot,        path: '/assistant' },
    { name: 'Browse Schemes',  icon: LayoutGrid, path: '/schemes' },
  ];

  const handleNewChat = () => { clearChat(); navigate('/assistant'); };
  const handleLogout  = async () => { await logout(); setShowUserMenu(false); navigate('/login'); };

  const displayName = user?.name || 'Guest User';
  const initials    = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const roleLabel   = user?.roles?.[0] || 'citizen';

  return (
    <motion.aside
      animate={{ width: isOpen ? SIDEBAR_W : RAIL_W }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-20 flex flex-col bg-white border-r border-gray-100 shadow-sm overflow-hidden"
      style={{ minWidth: 0 }}
    >
      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center shrink-0 border-b border-gray-100 px-4 gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
          CS
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="brand-text"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <p className="font-bold text-[15px] text-gray-900 whitespace-nowrap leading-tight">CivicSeva</p>
              <p className="text-[11px] text-gray-400 whitespace-nowrap">Government Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── New Chat Button ─────────────────────────────────────────────── */}
      <div className={`px-3 py-4 shrink-0 ${!isOpen && 'flex justify-center'}`}>
        <button
          onClick={handleNewChat}
          title="Start New Chat"
          className={`bg-primary hover:bg-primary-dark text-white rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 ${
            isOpen ? 'w-full py-2.5 px-4' : 'w-10 h-10'
          }`}
        >
          <Plus size={16} className="shrink-0" />
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.span
                key="new-chat-label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Start New Chat
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2 space-y-0.5">
        {navItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            end={path === '/'}
            title={!isOpen ? name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl transition-all text-sm font-medium cursor-pointer select-none
              ${isOpen ? 'px-3 py-2.5' : 'justify-center p-3'}
              ${isActive
                ? 'bg-primary/8 text-primary'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className="shrink-0" />
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.span
                      key={`label-${name}`}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden flex-1"
                    >
                      {name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isOpen && isActive && (
                  <ChevronRight size={13} className="text-primary/50 shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom Utilities ───────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-gray-100 px-2 py-2 space-y-0.5">
        {[
          { label: 'Settings',      Icon: Settings,   path: '/settings' },
          { label: 'Help & Support', Icon: HelpCircle, path: '/support'  },
        ].map(({ label, Icon, path }) => path ? (
          <RouterNavLink
            key={label}
            to={path}
            title={!isOpen ? label : undefined}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-colors ${
                isOpen ? 'px-3 py-2.5' : 'justify-center p-3'
              } ${
                isActive ? 'bg-primary/8 text-primary' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.span key={`util-${label}`} initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden text-left">{label}</motion.span>
              )}
            </AnimatePresence>
          </RouterNavLink>
        ) : (
          <button
            key={label}
            title={!isOpen ? label : undefined}
            className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors ${isOpen ? 'px-3 py-2.5' : 'justify-center p-3'}`}
          >
            <Icon size={18} className="shrink-0" />
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.span key={`util-${label}-btn`} initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden text-left">{label}</motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* ── User Profile ───────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-gray-100 p-2 relative">
        <button
          onClick={() => setShowUserMenu((s) => !s)}
          title={!isOpen ? displayName : undefined}
          className={`w-full flex items-center gap-3 rounded-xl hover:bg-gray-100 transition-colors ${
            isOpen ? 'px-2 py-2' : 'justify-center p-2'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-xs shrink-0 overflow-hidden">
            {user?.avatar
              ? <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
              : isAuthenticated ? initials : <User size={15} />}
          </div>
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="user-info"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 overflow-hidden text-left"
              >
                <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">{displayName}</p>
                <p className="text-[11px] text-gray-400 capitalize truncate">{isAuthenticated ? roleLabel : 'Guest'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.14 }}
                className="absolute bottom-full left-2 right-2 mb-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-20"
              >
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">{displayName}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <button onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <User size={15} /> View Profile
                    </button>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate('/login'); setShowUserMenu(false); }}
                      className="w-full flex items-center justify-center px-4 py-3 text-sm text-primary font-semibold hover:bg-blue-50 transition-colors">
                      Sign In
                    </button>
                    <button onClick={() => { navigate('/register'); setShowUserMenu(false); }}
                      className="w-full flex items-center justify-center px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors border-t border-gray-100">
                      Create Account
                    </button>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
