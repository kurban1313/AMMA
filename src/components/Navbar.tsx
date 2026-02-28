// AMMA Healthcare Platform - Navbar Component

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore, useUIStore } from '@/store';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'patient':
        return '/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'researcher':
        return '/researcher/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,112,160,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[75px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 bg-[#0070a0] rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Heart className="w-5 h-5 text-white fill-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#faea73] rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-semibold text-[#1f1f1f] dark:text-white font-['Fraunces'] transition-colors">
              AMMA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-[15px] font-medium transition-colors duration-200 ${location.pathname === link.href
                    ? 'text-[#0070a0] dark:text-[#38bdf8]'
                    : 'text-[#33383f] dark:text-[#a1a1aa] hover:text-[#0070a0] dark:hover:text-[#38bdf8]'
                  }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#0070a0] dark:bg-[#38bdf8] transition-all duration-300 ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-[#626a72] dark:text-[#a1a1aa] hover:text-[#0070a0] dark:hover:text-[#38bdf8] hover:bg-[#e6f7ff] dark:hover:bg-[#0ea5e9]/10 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {isAuthenticated ? (
              <Link to={getDashboardLink()}>
                <Button className="bg-[#0070a0] hover:bg-[#00577c] text-white px-6 py-2 rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,112,160,0.3)]">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-[#0070a0] hover:text-[#00577c] hover:bg-[#e6f7ff]"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#0070a0] hover:bg-[#00577c] text-white px-6 py-2 rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,112,160,0.3)]">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-[#33383f] dark:text-[#a1a1aa]"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <button
              className="p-2 text-[#33383f] dark:text-[#a1a1aa]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#121212] shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block py-2 text-[#33383f] dark:text-[#a1a1aa] hover:text-[#0070a0] dark:hover:text-[#38bdf8] font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#dee5eb] dark:border-[#2d2d2d] space-y-2">
            {isAuthenticated ? (
              <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-[#0070a0] hover:bg-[#00577c] text-white">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#0070a0] hover:bg-[#00577c] text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
