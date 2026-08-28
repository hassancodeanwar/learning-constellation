import React, { useState } from 'react';
import { AppView, StudentRecord } from '../types';
import { findStudentByCode } from '../utils/storage';
import { WILSCrest } from './WILSLogo';
import { ArrowLeft, Search, Sparkles, CircleAlert as AlertCircle } from 'lucide-react';

interface LookupViewProps {
  onNavigate: (view: AppView) => void;
  onStudentFound: (student: StudentRecord) => void;
}

export const LookupView: React.FC<LookupViewProps> = ({
  onNavigate,
  onStudentFound
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchCode: string) => {
    const clean = searchCode.trim();
    if (!clean) {
      setError('Please enter a student results code (e.g. AJ-4821).');
      return;
    }

    setError('');
    setIsSearching(true);

    const found = await findStudentByCode(clean);
    setIsSearching(false);

    if (found) {
      onStudentFound(found);
    } else {
      setError(`No WILS constellation found for code "${clean.toUpperCase()}". Please check your spelling.`);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-16 space-y-6">
      {/* Back link */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-300 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Home</span>
      </button>

      {/* Main card */}
      <div className="bg-[#1c0e38]/90 border border-[#f5b716]/30 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#f5b716]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5b716]/15 border border-[#f5b716]/30 text-amber-300 text-xs font-mono uppercase tracking-wider font-bold">
            <WILSCrest size={16} />
            <span>WILS Constellation Retrieval</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-brand text-white">
            Find Your Results
          </h2>
          <p className="text-sm text-slate-300">
            Enter the unique results code issued when you completed your Westview learning assessment.
          </p>
        </div>

        {/* Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(code);
          }}
          className="space-y-4"
        >
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. AJ-4821"
              className="w-full bg-[#120926] border border-[#f5b716]/30 focus:border-[#f5b716] focus:ring-2 focus:ring-[#f5b716]/20 rounded-2xl px-5 py-4 text-[#f5b716] font-mono text-xl tracking-widest uppercase outline-none transition-all placeholder-slate-600 shadow-inner"
              autoFocus
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-gradient-to-r from-[#f5b716] via-[#f7c53d] to-[#d99b06] text-[#12092a] font-brand font-bold text-sm flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg hover:scale-105 active:scale-100"
            >
              <Search className="w-4 h-4 text-[#12092a]" />
              <span>{isSearching ? 'Searching...' : 'Find'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

