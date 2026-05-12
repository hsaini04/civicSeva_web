import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion } from 'framer-motion';

export const SidebarContext = createContext({ isOpen: true, toggle: () => {} });
export const useSidebar = () => useContext(SidebarContext);

const SIDEBAR_W = 240;
const RAIL_W = 64;

const AppLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen((o) => !o);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <div className="flex h-screen overflow-hidden bg-bg-light font-sans text-text-dark">
        <Sidebar />
        <motion.div
          animate={{ marginLeft: isOpen ? SIDEBAR_W : RAIL_W }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 flex flex-col h-full min-w-0"
        >
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-gray-50/40">
            <Outlet />
          </main>
        </motion.div>
      </div>
    </SidebarContext.Provider>
  );
};

export default AppLayout;
