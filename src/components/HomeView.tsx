import React, { useState } from 'react';
import { AppView, ArchetypeDefinition } from '../types';
import { ConstellationRadar } from './ConstellationRadar';
import { WILSCrest, WILSLogo } from './WILSLogo';
import { ARCHETYPES, SCALES, SCALE_ORDER } from '../data/constellationData';
import {
  Compass,
  GraduationCap,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users2,
  BrainCircuit,
  Award,
  BookOpen
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  onQuickStartDemo?: () => void;
}

// Sample score profiles for hero preview
const PREVIEW_PROFILES: Record<string, { scores: any; archetype: ArchetypeDefinition }> = {
  architect: {
    scores: {
      social: { mean: 2.2, cat: 'L' },
      structure: { mean: 4.9, cat: 'H' },
      independence: { mean: 4.4, cat: 'H' },
      practice: { mean: 3.8, cat: 'H' },
      expression: { mean: 2.5, cat: 'L' },
      stress: { mean: 4.1, cat: 'H' }
    },
    archetype: ARCHETYPES[0]
  },
  catalyst: {
    scores: {
      social: { mean: 4.8, cat: 'H' },
      structure: { mean: 2.9, cat: 'M' },
      independence: { mean: 3.6, cat: 'M' },
      practice: { mean: 4.2, cat: 'H' },
      expression: { mean: 4.9, cat: 'H' },
      stress: { mean: 3.9, cat: 'H' }
    },
    archetype: ARCHETYPES[1]
  },
  navigator: {
    scores: {
      social: { mean: 1.9, cat: 'L' },
      structure: { mean: 3.8, cat: 'H' },
      independence: { mean: 5.0, cat: 'H' },
      practice: { mean: 4.5, cat: 'H' },
      expression: { mean: 2.4, cat: 'L' },
      stress: { mean: 4.2, cat: 'H' }
    },
    archetype: ARCHETYPES[2]
  },
  craftsman: {
    scores: {
      social: { mean: 3.4, cat: 'M' },
      structure: { mean: 3.6, cat: 'M' },
      independence: { mean: 3.8, cat: 'H' },
      practice: { mean: 5.0, cat: 'H' },
      expression: { mean: 3.5, cat: 'M' },
      stress: { mean: 3.8, cat: 'H' }
    },
    archetype: ARCHETYPES[3]
  }
};

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [selectedArchetypeKey, setSelectedArchetypeKey] = useState<'architect' | 'catalyst' | 'navigator' | 'craftsman'>('catalyst');
  const activeProfile = PREVIEW_PROFILES[selectedArchetypeKey];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-14 space-y-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left column: Text & CTA */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#f5b716]/10 border border-[#f5b716]/30 text-amber-300 text-xs font-mono tracking-wide uppercase">
            <WILSCrest size={18} />
            <span className="font-brand font-bold text-amber-300">Westview International Language School</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-brand tracking-tight text-white leading-[1.08]">
            Learner <br />
            <span className="bg-gradient-to-r from-[#f5b716] via-amber-200 to-purple-300 bg-clip-text text-transparent">
              Constellation
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
            WILS Psychometric Assessment for Grades 10–12. Answer 36 calibrated questions about how your mind works, focuses, recovers, and collaborates to map your unique learning constellation.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={() => onNavigate('studentForm')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#f5b716] via-[#f7c53d] to-[#d99b06] text-[#12092a] font-brand font-black text-base shadow-xl shadow-[#f5b716]/20 hover:shadow-[#f5b716]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Compass className="w-5 h-5 text-[#12092a]" />
              <span>Begin Student Assessment ✦</span>
            </button>

            <button
              onClick={() => onNavigate('lookup')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#231244]/80 hover:bg-[#30195c] text-slate-200 font-medium text-sm border border-[#f5b716]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Look Up Result Code</span>
            </button>
          </div>
        </div>

        {/* Right column: Interactive Constellation Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-[#1c0e38]/85 border border-[#f5b716]/25 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f5b716]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Archetype switcher tabs */}
            <div className="flex items-center justify-between gap-1 bg-[#120926] p-1 rounded-xl border border-white/10 mb-4 overflow-x-auto">
              <button
                id="preview-tab-catalyst"
                onClick={() => setSelectedArchetypeKey('catalyst')}
                className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-mono transition-all text-center cursor-pointer ${
                  selectedArchetypeKey === 'catalyst'
                    ? 'bg-[#f5b716]/25 text-[#f5b716] border border-[#f5b716]/50 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Catalyst
              </button>
              <button
                id="preview-tab-architect"
                onClick={() => setSelectedArchetypeKey('architect')}
                className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-mono transition-all text-center cursor-pointer ${
                  selectedArchetypeKey === 'architect'
                    ? 'bg-purple-500/25 text-purple-300 border border-purple-400/50 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Architect
              </button>
              <button
                id="preview-tab-navigator"
                onClick={() => setSelectedArchetypeKey('navigator')}
                className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-mono transition-all text-center cursor-pointer ${
                  selectedArchetypeKey === 'navigator'
                    ? 'bg-amber-400/25 text-amber-300 border border-amber-400/50 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Navigator
              </button>
              <button
                id="preview-tab-craftsman"
                onClick={() => setSelectedArchetypeKey('craftsman')}
                className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-mono transition-all text-center cursor-pointer ${
                  selectedArchetypeKey === 'craftsman'
                    ? 'bg-teal-400/25 text-teal-300 border border-teal-400/50 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Craftsman
              </button>
            </div>

            {/* Radar Canvas */}
            <div className="py-2">
              <ConstellationRadar scores={activeProfile.scores} size={300} interactive={true} />
            </div>

            {/* Archetype mini summary card */}
            <div className="mt-4 p-4 rounded-2xl bg-[#110824] border border-[#f5b716]/20 text-left space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-brand font-bold text-white text-base flex items-center gap-2">
                  <span>{activeProfile.archetype.symbol}</span>
                  {activeProfile.archetype.name}
                </span>
                <span className="text-[11px] font-mono text-amber-300 bg-[#f5b716]/15 px-2 py-0.5 rounded-full border border-[#f5b716]/30">
                  WILS Profile
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {activeProfile.archetype.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The 6 Scales Grid Showcase */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-[#f5b716] tracking-wider uppercase font-bold">
            Psychometric Foundations
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-brand text-white">
            The Six Dimensions of Learner Ecology
          </h2>
          <p className="text-sm text-slate-300">
            Every WILS student brings a unique configuration of cognitive strengths, environmental needs, and focus habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCALE_ORDER.map((scaleKey) => {
            const scale = SCALES[scaleKey];
            return (
              <div
                key={scaleKey}
                className="p-5 rounded-2xl bg-[#1c0e38]/70 border border-[#f5b716]/15 hover:border-[#f5b716]/40 transition-all space-y-3 group hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shadow-md"
                      style={{ backgroundColor: scale.color }}
                    />
                    <h3 className="font-brand font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      {scale.label}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                    6 Items
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{scale.description}</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Low: Processing</span>
                  <span className="text-amber-300 font-bold">High: Activated</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classroom Value Proposition Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#210f3f] via-[#2f155c] to-[#210f3f] border border-[#f5b716]/30 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#f5b716]/15 border border-[#f5b716]/35 flex items-center justify-center text-amber-300 mx-auto md:mx-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="font-brand font-bold text-white text-base">Metacognitive Clarity</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              WILS students identify their optimal study habits, stress triggers, and communication channels without judgment.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/35 flex items-center justify-center text-purple-300 mx-auto md:mx-0">
              <Users2 className="w-5 h-5" />
            </div>
            <h4 className="font-brand font-bold text-white text-base">Synergy-Based Study Pairs</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Educators generate balanced project teams and peer mentorship pairs powered by mathematical compatibility.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/35 flex items-center justify-center text-amber-300 mx-auto md:mx-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-brand font-bold text-white text-base">Instructional Differentiation</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant classroom strategy tips tailored to each student's focus areas and reflection support requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

