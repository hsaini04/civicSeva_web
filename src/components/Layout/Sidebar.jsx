import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Bot, 
  LayoutGrid, 
  Plus, 
  Settings, 
  HelpCircle,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Smart Assistant', icon: Bot, path: '/assistant' },
    { name: 'Browse Schemes', icon: LayoutGrid, path: '/schemes' },
  ];

  return (
    <div className="w-64 h-screen bg-bg-light border-r border-border flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-text-dark text-white rounded flex items-center justify-center font-bold">
          <span className="text-sm">III</span>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">CivicConnect</h1>
          <p className="text-xs text-text-muted">Government Portal</p>
        </div>
      </div>

      {/* Start New Chat CTA */}
      <div className="px-6 mb-6">
        <button className="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium transition-colors">
          <Plus size={18} />
          Start New Chat
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-primary'
                  : 'text-text-muted hover:bg-gray-100 hover:text-text-dark'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-text-muted hover:bg-gray-100 hover:text-text-dark transition-colors">
          <Settings size={20} />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-text-muted hover:bg-gray-100 hover:text-text-dark transition-colors">
          <HelpCircle size={20} />
          Help
        </button>
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-border flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
           <User size={20} className="text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-dark">John Citizen</p>
          <p className="text-xs text-text-muted">Citizen Account</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
