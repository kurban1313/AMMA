// AMMA Healthcare Platform - Sidebar Component

import { Link, useLocation } from 'react-router-dom';
import {
  Heart,
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Brain,
  Stethoscope,
  UserCircle,
  MessageSquare,
  Database,
  Download,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';

// Patient navigation items
const patientNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Family Members', href: '/patient/family' },
  { icon: FileText, label: 'Medical Records', href: '/patient/records' },
  { icon: Calendar, label: 'Appointments', href: '/patient/appointments' },
  { icon: Brain, label: 'Health Predictions', href: '/patient/predictions' },
  { icon: Stethoscope, label: 'Trusted Doctors', href: '/patient/doctors' },
];

// Doctor navigation items
const doctorNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor/dashboard' },
  { icon: Users, label: 'My Patients', href: '/doctor/patients' },
  { icon: Calendar, label: 'Appointments', href: '/doctor/appointments' },
  { icon: FileText, label: 'Patient Records', href: '/doctor/records' },
  { icon: UserCircle, label: 'My Profile', href: '/doctor/profile' },
];

// Researcher navigation items
const researcherNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/researcher/dashboard' },
  { icon: MessageSquare, label: 'AI Chatbot', href: '/researcher/chatbot' },
  { icon: Database, label: 'Query History', href: '/researcher/queries' },
  { icon: Download, label: 'Exports', href: '/researcher/exports' },
];

// Admin navigation items
const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'User Management', href: '/admin/users' },
  { icon: Database, label: 'System Logs', href: '/admin/logs' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const getNavItems = () => {
    switch (user?.role) {
      case 'patient':
        return patientNavItems;
      case 'doctor':
        return doctorNavItems;
      case 'researcher':
        return researcherNavItems;
      case 'admin':
        return adminNavItems;
      default:
        return patientNavItems;
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'patient':
        return 'Family Health Vault';
      case 'doctor':
        return 'Doctor Portal';
      case 'researcher':
        return 'Research Platform';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'Dashboard';
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#121212] border-r border-[#dee5eb] dark:border-[#2d2d2d] z-40 flex flex-col transition-colors duration-300">
      {/* Logo */}
      <div className="p-6 border-b border-[#dee5eb] dark:border-[#2d2d2d]">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#0070a0] rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <span className="text-lg font-semibold text-[#1f1f1f] dark:text-white font-['Fraunces'] transition-colors">
              AMMA
            </span>
            <p className="text-[10px] text-[#626a72] dark:text-[#a1a1aa] uppercase tracking-wider transition-colors">
              {getRoleLabel()}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-[#e6f7ff] dark:bg-[#0070a0]/20 text-[#0070a0] dark:text-[#38bdf8]'
                      : 'text-[#626a72] dark:text-[#a1a1aa] hover:bg-[#f7f9fa] dark:hover:bg-[#1e1e1e] hover:text-[#0070a0] dark:hover:text-[#38bdf8]'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-[#0070a0] dark:text-[#38bdf8]' : ''}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-[#dee5eb] dark:border-[#2d2d2d]">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-[#0070a0] flex items-center justify-center text-white font-medium">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1f1f1f] dark:text-[#e4e4e7] truncate transition-colors">
              {user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-[#99a4af] dark:text-[#a1a1aa] capitalize transition-colors">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 text-[#626a72] dark:text-[#a1a1aa] hover:text-[#e92222] dark:hover:text-[#ef4444] hover:border-[#e92222] dark:border-[#2d2d2d] dark:hover:border-[#ef4444] dark:bg-transparent transition-colors"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}
