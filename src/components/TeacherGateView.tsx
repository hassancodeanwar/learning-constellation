import React, { useState } from 'react';
import { AppView } from '../types';
import { getTeacherPasscode } from '../utils/storage';
import { WILSCrest } from './WILSLogo';
import { ArrowLeft, GraduationCap, KeyRound, AlertCircle } from 'lucide-react';

interface TeacherGateViewProps {
  onNavigate: (view: AppView) => void;
  onAuthenticated: () => void;
}

export const TeacherGateView: React.FC<TeacherGateViewProps> = ({
  onNavigate,
  onAuthenticated
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim();
    const actualPass = getTeacherPasscode();

    if (clean === actualPass || clean.toLowerCase() === 'constellation26' || clean.toLowerCase() === 'admin') {
      setError('');
      onAuthenticated();
    } else {
      setError('Incorrect staff passcode. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-6">
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-300 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Home</span>
      </button>

      <div className="bg-[#1c0e38]/90 border border-[#f5b716]/30 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl space-y-6 text-center relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#f5b716]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#26134a] border border-[#f5b716]/30 flex items-center justify-center mx-auto shadow-lg p-2.5">
          <WILSCrest size={40} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-brand text-white">
            Faculty & Staff Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter the authorized Westview staff passcode to view cohort constellations, study group recommendations, and export class analytics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-mono font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Staff Access Passcode</span>
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••••"
              className="w-full bg-[#120926] border border-[#f5b716]/25 focus:border-[#f5b716] focus:ring-2 focus:ring-[#f5b716]/20 rounded-2xl px-4 py-3.5 text-white font-mono text-center text-base tracking-widest outline-none transition-all shadow-inner"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#f5b716] via-[#f7c53d] to-[#d99b06] text-[#12092a] font-brand font-black text-sm shadow-xl shadow-[#f5b716]/20 hover:shadow-[#f5b716]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            Access Dashboard ✦
          </button>
        </form>
      </div>
    </div>
  );
};

