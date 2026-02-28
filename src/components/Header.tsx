// AMMA Healthcare Platform - Header Component

import { useState } from 'react';
import {
  Bell,
  Search,
  Settings,
  AlertTriangle,
  Calendar,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuthStore, usePatientStore, useDoctorStore, useUIStore } from '@/store';
import { format } from 'date-fns';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Get notifications based on role
  const patientNotifications = usePatientStore(state => state.notifications);
  const doctorNotifications = useDoctorStore(state => state.notifications);

  const notifications = user?.role === 'patient'
    ? patientNotifications
    : user?.role === 'doctor'
      ? doctorNotifications
      : [];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <Brain className="w-4 h-4 text-[#0070a0]" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-[#00b67a]" />;
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-[#e92222]" />;
      default:
        return <Bell className="w-4 h-4 text-[#626a72]" />;
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-[#dee5eb]/60 dark:border-[#2d2d2d]/60 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
      {/* Left: Greeting + AI Status */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-[#99a4af] dark:text-[#a1a1aa]">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}{user ? `, ${user.email?.split('@')[0]}` : ''}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="live-dot" />
            <span className="text-xs text-[#00b67a] font-medium">AI Engine Online</span>
          </div>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a4af]" />
          <Input
            type="text"
            placeholder="Search patients, records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#f7f9fa] dark:bg-[#1e1e1e] border-[#dee5eb] dark:border-[#2d2d2d] focus:border-[#0070a0] focus:ring-[#0070a0] rounded-lg transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-[#626a72] dark:text-[#a1a1aa] hover:text-[#0070a0] dark:hover:text-[#38bdf8] hover:bg-[#e6f7ff] dark:hover:bg-[#0ea5e9]/10 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#626a72] dark:text-[#a1a1aa] hover:text-[#0070a0] hover:bg-[#e6f7ff] dark:hover:bg-[#0ea5e9]/10 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e92222] text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-[#dee5eb] flex items-center justify-between">
              <h4 className="font-semibold text-[#1f1f1f]">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-xs text-[#0070a0] bg-[#e6f7ff] px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#99a4af]">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-[#dee5eb] hover:bg-[#f7f9fa] transition-colors ${!notification.isRead ? 'bg-[#e6f7ff]/30' : ''
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1f1f1f]">
                          {notification.title}
                        </p>
                        <p className="text-xs text-[#626a72] mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[#99a4af] mt-2">
                          {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-[#0070a0] rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 border-t border-[#dee5eb]">
                <Button variant="ghost" className="w-full text-sm text-[#0070a0]">
                  View All Notifications
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="text-[#626a72] dark:text-[#a1a1aa] hover:text-[#0070a0] hover:bg-[#e6f7ff] dark:hover:bg-[#0ea5e9]/10 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 text-sm text-[#626a72] dark:text-[#a1a1aa] transition-colors">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
        </div>
      </div>
    </header>
  );
}
