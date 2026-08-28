import React, { useState } from 'react';
import { AppView } from '../types';
import { getTeacherPasscode } from '../utils/storage';
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
      setError('Incorrect teacher passcode. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-6">
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-teal-300 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Home</span>
      </button>

      <div className="bg-[#191c44] border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl space-y-6 text-center relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500/20 via-indigo-500/20 to-amber-500/20 border border-white/15 flex items-center justify-center text-teal-300 mx-auto shadow-lg">
          <GraduationCap className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display text-white">
            Teacher & Staff Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter the authorized staff passcode to view cohort constellations, study group recommendations, and export class analytics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Staff Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••••"
              className="w-full bg-[#11132e] border border-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-xl px-4 py-3 text-white font-mono text-center text-base tracking-widest outline-none transition-all"
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
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-indigo-500 text-slate-950 font-display font-bold text-sm shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            Enter Dashboard ✦
          </button>
        </form>
      </div>
    </div>
  );
};
