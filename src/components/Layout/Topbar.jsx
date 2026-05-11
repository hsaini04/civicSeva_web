import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-20 bg-bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search government portals..." 
            className="w-full bg-gray-50 border border-border rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <button className="p-2 text-text-muted hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-border hover:border-gray-300 transition-colors">
          <User size={20} className="text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
