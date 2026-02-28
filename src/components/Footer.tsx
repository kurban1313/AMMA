// AMMA Healthcare Platform - Footer Component

import { Link } from 'react-router-dom';
import { Heart, Linkedin, Twitter, Facebook, Mail } from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'Family Health Vault', href: '/features' },
    { label: 'Doctor Portal', href: '/features' },
    { label: 'Research Platform', href: '/features' },
    { label: 'AI Predictions', href: '/features' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'HIPAA Compliance', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Mail, href: 'mailto:contact@amma.health', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#dee5eb]">
      <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#0070a0] rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-semibold text-[#1f1f1f] font-['Fraunces']">
                AMMA
              </span>
            </Link>
            <p className="text-[#626a72] text-sm leading-relaxed max-w-xs">
              Connecting patients, doctors, and researchers for better healthcare. 
              AI-powered health predictions and secure medical record management.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-[#f7f9fa] flex items-center justify-center text-[#626a72] hover:bg-[#e6f7ff] hover:text-[#0070a0] transition-all duration-200 hover:-translate-y-0.5"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-[#1f1f1f] font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#626a72] text-sm hover:text-[#0070a0] transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[#1f1f1f] font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#626a72] text-sm hover:text-[#0070a0] transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[#1f1f1f] font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#626a72] text-sm hover:text-[#0070a0] transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#dee5eb] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#99a4af] text-sm">
            © 2026 AMMA Health Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[#99a4af] text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-[#00b67a] rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
