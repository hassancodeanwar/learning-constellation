import React, { useState } from 'react';
import { StudentRecord, TraitKey } from '../types';
import { ConstellationRadar } from './ConstellationRadar';
import { SCALES, SCALE_ORDER, SUPPORT_TIPS } from '../data/constellationData';
import { getTopAndFocusTraits, saveStudent } from '../utils/storage';
import { generateStudentPDF } from '../utils/pdfExport';
import {
  ArrowLeft,
  Printer,
  Sparkles,
  BookOpen,
  Target,
  Lightbulb,
  MessageSquare,
  Save,
  Check,
  FileDown,
  Loader2
} from 'lucide-react';

interface TeacherStudentModalProps {
  student: StudentRecord;
  onBack: () => void;
  onUpdateStudent: (updated: StudentRecord) => void;
}

export const TeacherStudentModal: React.FC<TeacherStudentModalProps> = ({
  student,
  onBack,
  onUpdateStudent
}) => {
  const [notes, setNotes] = useState(student.notes || '');
  const [savedNotes, setSavedNotes] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { top, focus } = getTopAndFocusTraits(student.scores);
  const topScale = SCALES[top];
  const focusScale = SCALES[focus];
  const focusTip = SUPPORT_TIPS[focus];

  const handleSaveNotes = async () => {
    const updated: StudentRecord = { ...student, notes };
    await saveStudent(updated);
    onUpdateStudent(updated);
    setSavedNotes(true);
    setTimeout(() => setSavedNotes(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await generateStudentPDF(student, 'teacher-student-radar');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Back link & actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-teal-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Teacher Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="px-3.5 py-1.5 rounded-xl bg-teal-400/20 hover:bg-teal-400/30 border border-teal-400/40 text-xs font-mono text-teal-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-300" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-teal-300" />
            )}
            <span>{isGeneratingPdf ? 'Building PDF...' : 'Download PDF Report'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Student Banner Header */}
      <div className="bg-[#171a42] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-teal-300">
            <span>Grade {student.grade}</span>
            <span>•</span>
            <span>Class {student.className}</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white">{student.name}</h1>
          <p className="text-xs font-mono text-slate-400">
            Learner Archetype: <span className="text-amber-300 font-semibold">{student.archetype?.name}</span>
          </p>
        </div>

        <div className="text-left sm:text-right space-y-1">
          <div className="font-mono text-xl font-bold text-amber-300 bg-amber-400/10 px-4 py-2 rounded-2xl border border-amber-400/20 inline-block">
            {student.id}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Surveyed {new Date(student.timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Radar & Scores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div
          id="teacher-student-radar"
          className="lg:col-span-6 bg-[#171a42] border border-white/15 rounded-3xl p-6 flex flex-col items-center justify-center"
        >
          <span className="text-xs font-mono text-slate-400 mb-2">Student Constellation</span>
          <ConstellationRadar scores={student.scores} size={300} interactive={true} />
        </div>

        <div className="lg:col-span-6 bg-[#171a42] border border-white/15 rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Trait Dimension Scores</span>
          </h3>

          <div className="space-y-3">
            {SCALE_ORDER.map((scaleKey) => {
              const scale = SCALES[scaleKey];
              const score = student.scores[scaleKey];
              const pct = Math.round(((score?.mean ?? 3) / 5) * 100);

              return (
                <div key={scaleKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{scale.label}</span>
                    <span className="font-bold text-white">
                      {score?.mean?.toFixed(2)} / 5.0
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: scale.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* Classroom Strategies & Accommodations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strength Leverage */}
        <div className="p-6 rounded-3xl bg-[#171a42] border border-amber-400/30 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>Top Strength: {topScale.label}</span>
          </div>
          <h4 className="text-base font-bold font-display text-white">
            Classroom Role Recommendation
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {student.archetype?.collaboratorTip}
          </p>
        </div>

        {/* Focus Area Accommodation */}
        <div className="p-6 rounded-3xl bg-[#171a42] border border-teal-400/30 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-300">
            <Lightbulb className="w-4 h-4" />
            <span>Focus Area: {focusScale.label}</span>
          </div>
          <h4 className="text-base font-bold font-display text-white">
            Targeted Instructional Accommodation
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {focusTip.classroom}
          </p>
        </div>
      </div>

      {/* Student's Self-Selected Reflection */}
      {student.reflection && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171a40] via-[#1c2052] to-[#171a40] border border-white/15 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-teal-300 font-semibold">
            <MessageSquare className="w-4 h-4" />
            <span>Student’s Requested Support This Semester</span>
          </div>
          <blockquote className="text-base sm:text-lg font-display text-white italic pl-3 border-l-2 border-amber-400">
            "{student.reflection}"
          </blockquote>
        </div>
      )}

      {/* Teacher Private Notes */}
      <div className="p-6 rounded-3xl bg-[#171a42] border border-white/15 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Staff / Teacher Private Notes & Observations
          </label>
          {savedNotes && (
            <span className="text-xs font-mono text-teal-300 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add confidential teacher notes regarding learning modifications, group dynamics, or IEP accommodations..."
          rows={3}
          className="w-full bg-[#11132e] border border-white/15 focus:border-teal-400 rounded-2xl p-4 text-xs sm:text-sm font-mono text-white outline-none"
        />

        <button
          onClick={handleSaveNotes}
          className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-display font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Notes</span>
        </button>
      </div>
    </div>
  );
};
