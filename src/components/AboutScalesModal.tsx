import React, { useState } from 'react';
import { AppView } from '../types';
import { SCALES, SCALE_ORDER, ARCHETYPES } from '../data/constellationData';
import { ArrowLeft, BookOpen, Sparkles, HelpCircle, Compass, CheckCircle2 } from 'lucide-react';

interface AboutScalesModalProps {
  onNavigate: (view: AppView) => void;
}

export const AboutScalesModal: React.FC<AboutScalesModalProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'scales' | 'archetypes' | 'faq'>('scales');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-teal-300 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Home</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Educational Framework
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Psychometrics & Learner Archetypes
        </h1>
        <p className="text-sm text-slate-300">
          How Learning Constellation translates 36 calibrated survey questions into actionable cognitive profiles.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center justify-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('scales')}
          className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer ${
            activeTab === 'scales'
              ? 'bg-teal-400/20 text-teal-300 border border-teal-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          The 6 Dimensions
        </button>

        <button
          onClick={() => setActiveTab('archetypes')}
          className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer ${
            activeTab === 'archetypes'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Learner Archetypes (6)
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer ${
            activeTab === 'faq'
              ? 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pedagogical FAQ
        </button>
      </div>

      {/* TAB 1: 6 DIMENSIONS */}
      {activeTab === 'scales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SCALE_ORDER.map((scaleKey) => {
              const scale = SCALES[scaleKey];
              return (
                <div
                  key={scaleKey}
                  className="p-6 rounded-3xl bg-[#171a42] border border-white/15 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow"
                        style={{ backgroundColor: scale.color }}
                      />
                      <h3 className="text-xl font-bold font-display text-white">{scale.label}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                      Items {scale.items.join(', ')}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {scale.description}
                  </p>

                  <div className="grid grid-cols-1 gap-2.5 pt-2 border-t border-white/10 text-xs">
                    <div className="p-3 rounded-xl bg-[#11132e] border border-white/5 space-y-1">
                      <span className="font-mono text-slate-400 font-bold block text-[10px] uppercase">
                        Low Score Tendency (1.0 – 2.5)
                      </span>
                      <p className="text-slate-300 leading-relaxed">{scale.lowDescription}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#11132e] border border-white/5 space-y-1">
                      <span className="font-mono text-amber-300 font-bold block text-[10px] uppercase">
                        High Score Tendency (3.7 – 5.0)
                      </span>
                      <p className="text-slate-300 leading-relaxed">{scale.highDescription}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ARCHETYPES */}
      {activeTab === 'archetypes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARCHETYPES.map((arch) => (
            <div
              key={arch.id}
              className="p-6 rounded-3xl bg-[#171a42] border border-white/15 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{arch.symbol}</span>
                  <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    Archetype
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-white">{arch.name}</h3>
                <p className="text-xs font-mono text-amber-300">{arch.subtitle}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{arch.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                <div className="p-2.5 rounded-xl bg-[#11132e] space-y-0.5">
                  <span className="font-mono text-amber-300 font-semibold text-[10px] uppercase block">
                    Superpower
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{arch.superpower}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#11132e] space-y-0.5">
                  <span className="font-mono text-teal-300 font-semibold text-[10px] uppercase block">
                    Study Strategy
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{arch.studyStrategy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FAQ */}
      {activeTab === 'faq' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-6 rounded-2xl bg-[#171a42] border border-white/15 space-y-2">
            <h4 className="font-display font-bold text-white text-base">
              Are there good or bad scores on this assessment?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No. Every point on the spectrum represents a valid cognitive approach. A student who prefers solitary processing (low social score) is not "worse" than a student who prefers vocal debates; both need suitable environments to thrive.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#171a42] border border-white/15 space-y-2">
            <h4 className="font-display font-bold text-white text-base">
              How are the study pair synergies calculated?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The algorithm evaluates Euclidean distance across all 6 traits combined with complementary trait archetypes (e.g. pairing a high-structure planner with a high-independence explorer) to recommend pairings that balance project execution.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#171a42] border border-white/15 space-y-2">
            <h4 className="font-display font-bold text-white text-base">
              How does item reverse scoring work?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Item 35 ("Stress makes it harder for me to focus") is reverse-scored (where a response of 5 becomes 1, and 1 becomes 5) to accurately contribute to the overall Stress Resilience construct.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
