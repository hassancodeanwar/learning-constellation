import React, { useState } from 'react';
import { AppView } from '../types';
import { CLASSES_BY_GRADE } from '../data/constellationData';
import { ArrowLeft, Compass, Sparkles, CheckCircle2, User, School } from 'lucide-react';

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
      setError('Please enter your full name or nickname.');
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
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-teal-300 transition-colors mb-6 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Home</span>
      </button>

      <div className="bg-[#191c44] border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Step 1 of 2: Setup
            </span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[11px] font-mono text-amber-300/80 hover:text-amber-300 hover:underline cursor-pointer"
            >
              ✦ Quick Demo Fill
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Who is charting tonight?
          </h2>
          <p className="text-sm text-slate-300">
            Enter your details so your teacher can assemble balanced study cohorts and you can view your personal constellation anytime.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Chen"
              className="w-full bg-[#11132e] border border-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 font-medium text-base outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Grade Field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-teal-400" />
                Grade Level
              </label>
              <select
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full bg-[#11132e] border border-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-xl px-4 py-3 text-white font-medium text-base outline-none transition-all cursor-pointer"
              >
                <option value="">Select Grade...</option>
                <option value="10">Grade 10 (Sophomore)</option>
                <option value="11">Grade 11 (Junior)</option>
                <option value="12">Grade 12 (Senior)</option>
                <option value="Other">Other / College</option>
              </select>
            </div>

            {/* Class Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                Class Cohort
              </label>
              {isCustomClass || grade === 'Other' ? (
                <input
                  type="text"
                  value={customClassName}
                  onChange={(e) => setCustomClassName(e.target.value)}
                  placeholder="e.g. AP-BIO-1"
                  className="w-full bg-[#11132e] border border-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-xl px-4 py-3 text-white font-medium text-base uppercase outline-none transition-all"
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
                  className="w-full bg-[#11132e] border border-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-xl px-4 py-3 text-white font-medium text-base outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">{grade ? 'Select Class...' : 'Pick grade first'}</option>
                  {classOptions.map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Custom Class Name...</option>
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
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              This is a reflective self-assessment with <strong>no wrong answers</strong> or score rankings. It takes approximately 3–4 minutes to complete.
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-display font-bold text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-slate-950" />
            <span>Begin Assessment ✦ 36 Questions</span>
          </button>
        </form>
      </div>
    </div>
  );
};
