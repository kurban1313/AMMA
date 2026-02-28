// AMMA Healthcare Platform - Dashboard Layout

import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f9fa] dark:bg-[#0a0a0a] flex transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main key={location.pathname} className="flex-1 p-6 overflow-auto page-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
