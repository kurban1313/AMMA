// AMMA Healthcare Platform - Main Layout (Public Pages)

import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main key={location.pathname} className="flex-1 page-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
