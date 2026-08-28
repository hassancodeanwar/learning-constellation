import React, { useState, useEffect } from 'react';
import { AppView, Question } from '../types';
import { QUESTIONS, REFLECTION_OPTIONS, SCALES } from '../data/constellationData';
import { WILSCrest } from './WILSLogo';
import { ArrowLeft, Check, Sparkles, HelpCircle } from 'lucide-react';

interface QuizViewProps {
  studentData: { name: string; grade: string; className: string };
  onFinishQuiz: (answers: Record<number, number>, reflection: string) => void;
  onNavigate: (view: AppView) => void;
}

const LIKERT_OPTIONS = [
  { val: 1, label: 'Strongly Disagree', short: 'Str. Disagree', badgeColor: 'hover:border-rose-400/50 hover:bg-rose-500/10' },
  { val: 2, label: 'Disagree', short: 'Disagree', badgeColor: 'hover:border-orange-400/50 hover:bg-orange-500/10' },
  { val: 3, label: 'Neutral', short: 'Neutral', badgeColor: 'hover:border-slate-400/50 hover:bg-slate-500/10' },
  { val: 4, label: 'Agree', short: 'Agree', badgeColor: 'hover:border-amber-400/50 hover:bg-amber-500/10' },
  { val: 5, label: 'Strongly Agree', short: 'Str. Agree', badgeColor: 'hover:border-[#f5b716]/60 hover:bg-[#f5b716]/15' }
];

export const QuizView: React.FC<QuizViewProps> = ({
  studentData,
  onFinishQuiz,
  onNavigate
}) => {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedReflection, setSelectedReflection] = useState<string>('');
  const [customReflection, setCustomReflection] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = QUESTIONS.length + 1; // 36 questions + 1 reflection
  const isReflectionStep = qIndex >= QUESTIONS.length;
  const currentQuestion: Question | undefined = QUESTIONS[qIndex];
  const currentScale = currentQuestion ? SCALES[currentQuestion.scale] : null;
  const progressPct = Math.round(((qIndex + 1) / totalSteps) * 100);

  // Keyboard shortcut listener (1..5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReflectionStep || isSubmitting) return;
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 5 && currentQuestion) {
        handleAnswer(keyNum);
      } else if (e.key === 'ArrowLeft' && qIndex > 0) {
        setQIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [qIndex, isReflectionStep, isSubmitting, currentQuestion]);

  const handleAnswer = (val: number) => {
    if (!currentQuestion) return;
    const newAnswers = { ...answers, [currentQuestion.id]: val };
    setAnswers(newAnswers);

    // Auto advance
    if (qIndex < QUESTIONS.length) {
      setQIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (qIndex > 0) {
      setQIndex((prev) => prev - 1);
    }
  };

  const handleComplete = (reflectionVal: string) => {
    setIsSubmitting(true);
    const finalReflection = reflectionVal === 'Other' && customReflection.trim() ? customReflection.trim() : reflectionVal;
    setTimeout(() => {
      onFinishQuiz(answers, finalReflection);
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Top bar with back link & step info */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            if (qIndex > 0) handlePrev();
            else onNavigate('studentForm');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-amber-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>{qIndex > 0 ? 'Previous Question' : 'Exit to Setup'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-300">
            {studentData.name} ({studentData.className})
          </span>
          <span className="text-xs font-mono font-bold text-[#120926] bg-[#f5b716] px-2.5 py-0.5 rounded-full shadow-sm">
            {qIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2.5 w-full bg-[#120926] rounded-full overflow-hidden mb-6 border border-[#f5b716]/20 relative">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-[#f5b716] to-[#fce282] rounded-full transition-all duration-300 ease-out shadow-sm"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Main Question Card or Reflection Card */}
      {!isReflectionStep && currentQuestion && currentScale ? (
        <div className="bg-[#1c0e38]/90 border border-[#f5b716]/30 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl space-y-7 relative overflow-hidden transition-all">
          {/* Active Dimension Header */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#120926] border border-[#f5b716]/25 text-xs font-mono">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: currentScale.color }}
              />
              <span className="text-amber-300 font-brand font-bold">{currentScale.label}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
              Press 1–5 on keyboard
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-2 py-2">
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white leading-snug">
              "{currentQuestion.text}"
            </h2>
            <p className="text-xs text-slate-300">
              Select how accurately this statement describes your normal study or problem-solving behavior.
            </p>
          </div>

          {/* Likert Response Buttons */}
          <div className="space-y-2.5">
            {LIKERT_OPTIONS.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => handleAnswer(opt.val)}
                  className={`w-full text-left p-4 rounded-2xl border font-medium text-sm sm:text-base flex items-center justify-between transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#f5b716]/25 border-[#f5b716] text-amber-200 shadow-md translate-x-1'
                      : `bg-[#120926] border-[#f5b716]/20 text-slate-200 ${opt.badgeColor} hover:translate-x-0.5`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-[#f5b716] text-[#120926] shadow font-black'
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      {opt.val}
                    </span>
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#f5b716]" />}
                </button>
              );
            })}
          </div>

          {/* Footer guidance */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>1 = Strongly Disagree</span>
            <span className="text-amber-300 font-bold">5 = Strongly Agree</span>
          </div>
        </div>
      ) : (
        /* Final Reflection Step */
        <div className="bg-[#1c0e38]/90 border border-[#f5b716]/30 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5b716]/15 border border-[#f5b716]/30 text-amber-300 text-xs font-mono uppercase tracking-wider font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#f5b716]" />
            <span>WILS Final Reflection</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-brand text-white">
              This semester, what support would help you most?
            </h2>
            <p className="text-sm text-slate-300">
              Your teachers at Westview will use this feedback to tailor project pathways and study guidance.
            </p>
          </div>

          <div className="space-y-2.5">
            {REFLECTION_OPTIONS.map((opt) => {
              const isSelected = selectedReflection === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedReflection(opt);
                    if (opt !== 'Other') {
                      handleComplete(opt);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-2xl border font-medium text-sm sm:text-base flex items-center justify-between transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#f5b716]/25 border-[#f5b716] text-amber-200 shadow-md'
                      : 'bg-[#120926] border-[#f5b716]/20 text-slate-200 hover:border-[#f5b716]/50 hover:bg-[#251249]'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <Check className="w-5 h-5 text-[#f5b716]" />}
                </button>
              );
            })}
          </div>

          {selectedReflection === 'Other' && (
            <div className="space-y-2 pt-2">
              <input
                type="text"
                value={customReflection}
                onChange={(e) => setCustomReflection(e.target.value)}
                placeholder="Type your preferred learning support here..."
                className="w-full bg-[#120926] border border-[#f5b716]/40 focus:ring-2 focus:ring-[#f5b716]/30 rounded-2xl px-4 py-3.5 text-white text-sm outline-none shadow-inner"
                autoFocus
              />
              <button
                onClick={() => handleComplete('Other')}
                disabled={!customReflection.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#f5b716] to-[#d99b06] text-[#12092a] font-brand font-black text-sm transition-all disabled:opacity-40 cursor-pointer shadow-lg"
              >
                Generate My WILS Constellation ✦
              </button>
            </div>
          )}

          {isSubmitting && (
            <div className="p-4 rounded-2xl bg-[#f5b716]/15 border border-[#f5b716]/30 text-amber-300 text-xs font-mono text-center animate-pulse">
              Charting your Westview learning constellation...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

