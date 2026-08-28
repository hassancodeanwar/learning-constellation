import React from 'react';
import { AppView } from '../types';
import { Sparkles, Search, GraduationCap, Compass, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isTeacherAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isTeacherAuthenticated
}) => {
  return (
    <header className="relative z-30 border-b border-white/10 bg-[#0c0d1f]/80 backdrop-blur-xl sticky top-0 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500/20 via-indigo-500/20 to-amber-500/30 border border-white/15 flex items-center justify-center text-amber-300 shadow-lg group-hover:scale-105 group-hover:border-teal-400/40 transition-all duration-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Learning Constellation
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30 hidden sm:inline-block">
                EdTech
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
              Psychometric Learner Mapping & Synergies
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => onNavigate('studentForm')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'studentForm' || currentView === 'quiz'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">Take Assessment</span>
            <span className="xs:hidden">Quiz</span>
          </button>

          <button
            onClick={() => onNavigate('lookup')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'lookup'
                ? 'bg-teal-400/15 text-teal-300 border border-teal-400/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4 text-teal-400" />
            <span>Look Up</span>
          </button>

          <button
            onClick={() => onNavigate('aboutScales')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'aboutScales'
                ? 'bg-indigo-400/15 text-indigo-300 border border-indigo-400/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">6 Scales</span>
          </button>

          <div className="h-4 w-px bg-white/15 mx-1" />

          <button
            onClick={() => onNavigate(isTeacherAuthenticated ? 'teacherDashboard' : 'teacherGate')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'teacherDashboard' || currentView === 'teacherGate' || currentView === 'teacherStudent'
                ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-200 border border-teal-400/40 shadow-md'
                : 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-teal-300" />
            <span className="font-display">Teacher Portal</span>
            {isTeacherAuthenticated && (
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping ml-1" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
