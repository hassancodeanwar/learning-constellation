import React from 'react';
import { AppView } from '../types';
import { WILSCrest } from './WILSLogo';
import { Search, GraduationCap, Compass, BookOpen } from 'lucide-react';

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
    <header className="relative z-30 border-b border-[#f5b716]/20 bg-[#120a2a]/85 backdrop-blur-xl sticky top-0 px-3 sm:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* WILS Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="p-1 rounded-xl bg-[#261345]/80 border border-[#f5b716]/30 shadow-lg group-hover:scale-105 group-hover:border-[#f5b716]/70 transition-all duration-300">
            <WILSCrest size={38} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-brand font-black text-sm sm:text-base text-white tracking-wider leading-none uppercase">
                WESTVIEW
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#f5b716]/15 text-[#f5b716] border border-[#f5b716]/35 hidden sm:inline-block">
                WILS Cairo
              </span>
            </div>
            <p className="text-[10.5px] font-brand tracking-widest text-amber-300/90 uppercase hidden sm:block mt-0.5">
              International Language School
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2.5">
          <button
            onClick={() => onNavigate('studentForm')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'studentForm' || currentView === 'quiz'
                ? 'bg-[#f5b716] text-[#120a2a] font-bold shadow-md shadow-[#f5b716]/20'
                : 'text-slate-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className={`w-4 h-4 ${currentView === 'studentForm' || currentView === 'quiz' ? 'text-[#120a2a]' : 'text-amber-400'}`} />
            <span className="hidden xs:inline">Take Assessment</span>
            <span className="xs:hidden">Quiz</span>
          </button>

          <button
            onClick={() => onNavigate('lookup')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'lookup'
                ? 'bg-purple-600/30 text-amber-300 border border-[#f5b716]/40'
                : 'text-slate-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>Look Up</span>
          </button>

          <button
            onClick={() => onNavigate('aboutScales')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'aboutScales'
                ? 'bg-purple-600/30 text-amber-300 border border-[#f5b716]/40'
                : 'text-slate-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">The 6 Scales</span>
          </button>

          <div className="h-4 w-px bg-white/15 mx-0.5 sm:mx-1" />

          <button
            onClick={() => onNavigate(isTeacherAuthenticated ? 'teacherDashboard' : 'teacherGate')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'teacherDashboard' || currentView === 'teacherGate' || currentView === 'teacherStudent'
                ? 'bg-gradient-to-r from-purple-700/60 to-[#f5b716]/30 text-amber-200 border border-[#f5b716]/50 shadow-md'
                : 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10 hover:border-[#f5b716]/30'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span className="font-brand font-bold text-xs sm:text-sm">Staff Portal</span>
            {isTeacherAuthenticated && (
              <span className="w-2 h-2 rounded-full bg-[#f5b716] animate-ping ml-1" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

