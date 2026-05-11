import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-white font-sans text-text-dark">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-full">
        {/* We can optionally render Topbar here if it's universal, or inside specific pages. 
            Based on designs, it looks like it might be page specific or universal. Let's make it universal for now. */}
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-gray-50/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
