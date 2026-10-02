import React from 'react';
import { ShieldCheck, Github, ExternalLink, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#040814] py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 mb-14 lg:mb-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-500" />
          <span className="font-bold text-slate-700 dark:text-slate-200">
            Fake News Detector (TruthGuard)
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline italic">
            "Detect. Verify. Understand. Before You Share."
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link to="/how-it-works" className="hover:text-indigo-500 transition-colors">
            Methodology
          </Link>
          <Link to="/dashboard" className="hover:text-indigo-500 transition-colors">
            Dashboard
          </Link>
          <Link to="/settings" className="hover:text-indigo-500 transition-colors">
            Settings
          </Link>
        </div>

        {/* Tag & Copyright */}
        <div className="text-center md:text-right">
          <p>© {new Date().getFullYear()} Fake News Detector. Academic AIML Project.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
