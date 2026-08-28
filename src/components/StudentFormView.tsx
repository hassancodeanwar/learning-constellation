import React, { useState } from 'react';
import { AppView } from '../types';
import { CLASSES_BY_GRADE } from '../data/constellationData';
import { WILSCrest } from './WILSLogo';
import { ArrowLeft, Compass, Sparkles, CheckCircle2, User, School, GraduationCap } from 'lucide-react';

interface StudentFormViewProps {
  onNavigate: (view: AppView) => void;
  onStartQuiz: (studentData: { name: string; grade: string; className: string }) => void;
  initialData?: { name: string; grade: string; className: string };
}

export const StudentFormView: React.FC<StudentFormViewProps> = ({
  onNavigate,
  onStartQuiz,
  initialData = { name: '', grade: '', className: '' }
}) => {
  const [name, setName] = useState(initialData.name);
  const [grade, setGrade] = useState(initialData.grade);
  const [className, setClassName] = useState(initialData.className);
  const [isCustomClass, setIsCustomClass] = useState(false);
  const [customClassName, setCustomClassName] = useState('');
  const [error, setError] = useState('');

  const classOptions = grade && CLASSES_BY_GRADE[grade] ? CLASSES_BY_GRADE[grade] : [];

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    setIsCustomClass(false);
    setClassName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    const finalClass = isCustomClass ? customClassName.trim().toUpperCase() : className;

    if (!finalName) {
      setError('Please enter your full name or preferred name.');
      return;
    }
    if (!grade) {
      setError('Please select your current grade level.');
      return;
    }
    if (!finalClass) {
      setError('Please select or specify your class cohort.');
      return;
    }

    setError('');
    onStartQuiz({
      name: finalName,
      grade,
      className: finalClass
    });
  };

  const handleQuickDemoFill = () => {
    const demoNames = ['Maya Rodriguez', 'Lucas Thorne', 'Aria Sterling', 'Noah Campbell', 'Elena Vance'];
    const chosenName = demoNames[Math.floor(Math.random() * demoNames.length)];
    setName(chosenName);
    setGrade('11');
    setClassName('11A');
    setError('');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-300 transition-colors mb-6 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Home</span>
      </button>

      <div className="bg-[#1c0e38]/90 border border-[#f5b716]/30 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#f5b716]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5b716]/15 border border-[#f5b716]/30 text-amber-300 text-xs font-mono tracking-wide uppercase">
              <WILSCrest size={18} />
              <span>WILS Student Registry</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[11px] font-mono text-amber-300/90 hover:text-amber-300 hover:underline cursor-pointer"
            >
              ✦ Sample Fill
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-brand text-white">
            Begin Your Student Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter your details to generate your individualized Westview International Language School learning constellation.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Name or Preferred Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Chen"
              className="w-full bg-[#120926] border border-[#f5b716]/25 focus:border-[#f5b716] focus:ring-2 focus:ring-[#f5b716]/20 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 font-medium text-base outline-none transition-all shadow-inner"
              autoFocus
            />
          </div>

          {/* Grade Field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-amber-400" />
                <span>Grade Level</span>
              </label>
              <select
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full bg-[#120926] border border-[#f5b716]/25 focus:border-[#f5b716] focus:ring-2 focus:ring-[#f5b716]/20 rounded-2xl px-4 py-3.5 text-white font-medium text-sm outline-none transition-all cursor-pointer"
              >
                <option value="">Select Grade...</option>
                <option value="10">Grade 10 (Sophomore)</option>
                <option value="11">Grade 11 (Junior)</option>
                <option value="12">Grade 12 (Senior)</option>
                <option value="Other">Other Section</option>
              </select>
            </div>

            {/* Class Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Class Cohort</span>
              </label>
              {isCustomClass || grade === 'Other' ? (
                <input
                  type="text"
                  value={customClassName}
                  onChange={(e) => setCustomClassName(e.target.value)}
                  placeholder="e.g. 11-ADV"
                  className="w-full bg-[#120926] border border-[#f5b716]/25 focus:border-[#f5b716] focus:ring-2 focus:ring-[#f5b716]/20 rounded-2xl px-4 py-3.5 text-white font-medium text-sm uppercase outline-none transition-all"
                />
              ) : (
                <select
                  value={className}
                  disabled={!grade}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setIsCustomClass(true);
                      setClassName('');
                    } else {
                      setClassName(e.target.value);
                    }
                  }}
                  className="w-full bg-[#120926] border border-[#f5b716]/25 focus:border-[#f5b716] focus:ring-2 focus:ring-[#f5b716]/20 rounded-2xl px-4 py-3.5 text-white font-medium text-sm outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">{grade ? 'Select Class...' : 'Pick grade first'}</option>
                  {classOptions.map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Custom Class Section...</option>
                </select>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              This is a reflective self-assessment with <strong>no wrong answers</strong> or score rankings. It takes approximately 3–4 minutes to complete.
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#f5b716] via-[#f7c53d] to-[#d99b06] text-[#12092a] font-brand font-black text-base shadow-xl shadow-[#f5b716]/20 hover:shadow-[#f5b716]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-[#12092a]" />
            <span>Begin Assessment ✦ 36 Questions</span>
          </button>
        </form>
      </div>
    </div>
  );
};

