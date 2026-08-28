import React, { useEffect, useState } from 'react';
import { AppView, StudentRecord, TraitKey } from '../types';
import { ConstellationRadar } from './ConstellationRadar';
import { WILSCrest } from './WILSLogo';
import { SCALES, SCALE_ORDER, SUPPORT_TIPS } from '../data/constellationData';
import { getTopAndFocusTraits } from '../utils/storage';
import { generateStudentPDF } from '../utils/pdfExport';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  Share2,
  Printer,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Target,
  Users2,
  BookOpen,
  FileDown,
  Loader2
} from 'lucide-react';

interface ResultsViewProps {
  student: StudentRecord;
  onNavigate: (view: AppView) => void;
  onRetake: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  student,
  onNavigate,
  onRetake
}) => {
  const [copied, setCopied] = useState(false);
  const [shareNotice, setShareNotice] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { top, focus } = getTopAndFocusTraits(student.scores);
  const topScale = SCALES[top];
  const focusScale = SCALES[focus];
  const supportTip = SUPPORT_TIPS[focus];

  // Fire celebratory starburst confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f5b716', '#a855f7', '#ffffff', '#ffd700']
      });
    } catch {
      // Ignore if confetti unavailable
    }
  }, []);

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(student.id);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = student.id;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    const text = `I just charted my WILS Learning Constellation! My archetype is "${student.archetype.name}" (Student ID: ${student.id}).`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WILS Learning Constellation',
          text,
          url: window.location.href
        });
      } catch {
        // Fallback
      }
    } else {
      handleCopyCode();
      setShareNotice('Result summary copied to clipboard!');
      setTimeout(() => setShareNotice(''), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await generateStudentPDF(student, 'results-radar-container');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5b716]/15 border border-[#f5b716]/30 text-amber-300 text-xs font-mono uppercase tracking-wider">
          <WILSCrest size={16} />
          <span>{student.name} • Class {student.className}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-brand text-white tracking-tight">
          Your WILS Constellation is Charted
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Here is your verified Westview cognitive star map, learning archetype, and targeted focus strategies for this academic term.
        </p>

        {/* Quick action bar */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          <button
            id="header-download-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f5b716] via-[#f7c53d] to-[#d99b06] text-[#12092a] font-brand font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#12092a]" />
                <span>Generating WILS Dossier...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-[#12092a]" />
                <span>Download Official PDF Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Radar & Archetype Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Radar Card */}
        <div
          id="results-radar-container"
          className="lg:col-span-6 bg-[#1c0e38]/90 border border-[#f5b716]/25 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-3 left-4 text-[11px] font-mono text-[#f5b716]">
            WILS Celestial Radar Map
          </div>
          <div className="py-4">
            <ConstellationRadar scores={student.scores} size={320} interactive={true} />
          </div>
          <div className="text-center text-xs font-mono text-slate-400 mt-2">
            Hover over any star node to inspect dimension scores
          </div>
        </div>

        {/* Archetype Card */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#241249] via-[#1c0e38] to-[#140a28] border border-[#f5b716]/35 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between space-y-5 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#f5b716]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300 bg-[#f5b716]/15 px-3 py-1 rounded-full border border-[#f5b716]/30 flex items-center gap-1.5">
                <span>{student.archetype.symbol}</span>
                WILS Learning Archetype
              </span>
              <span className="text-xs font-mono text-slate-300">
                Grade {student.grade}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-brand text-white">
              {student.archetype.name}
            </h2>

            <p className="text-xs font-mono text-amber-300 font-semibold">
              {student.archetype.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {student.archetype.description}
            </p>
          </div>

          {/* Superpower & Study Tactic */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-[#120926]/70 border border-[#f5b716]/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-[#f5b716]" />
                <span>Primary Superpower</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {student.archetype.superpower}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#120926]/70 border border-purple-400/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
                <Lightbulb className="w-3.5 h-3.5 text-purple-300" />
                <span>Optimal Study Strategy</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {student.archetype.studyStrategy}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trait Breakdown Bar Charts */}
      <div className="bg-[#1c0e38]/90 border border-[#f5b716]/25 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold font-brand text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Dimension Score Breakdown</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Scale: 1.0 (Low) – 5.0 (High)</span>
        </div>

        <div className="space-y-3.5">
          {SCALE_ORDER.map((scaleKey) => {
            const scale = SCALES[scaleKey];
            const score = student.scores[scaleKey];
            const pct = Math.round(((score?.mean ?? 3) / 5) * 100);

            const catLabel =
              score?.cat === 'H' ? 'High Strength' : score?.cat === 'M' ? 'Moderate' : 'Growth Focus';
            const catBadgeClass =
              score?.cat === 'H'
                ? 'bg-[#f5b716]/20 text-[#f5b716] border-[#f5b716]/40'
                : score?.cat === 'M'
                ? 'bg-purple-400/15 text-purple-300 border-purple-400/30'
                : 'bg-rose-400/15 text-rose-300 border-rose-400/30';

            return (
              <div key={scaleKey} className="p-3.5 rounded-2xl bg-[#120926] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: scale.color }}
                    />
                    <span className="font-semibold font-brand text-white">{scale.label}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${catBadgeClass}`}>
                      {catLabel}
                    </span>
                    <span className="font-bold text-white text-xs">
                      {score?.mean?.toFixed(2)} / 5.0
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full bg-[#20123f] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: scale.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strength & Growth Pair Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Top Strength */}
        <div className="p-6 rounded-3xl bg-[#1c0e38]/90 border border-[#f5b716]/35 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-[#f5b716]/15 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-[#f5b716]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#f5b716]" />
              Primary Strength
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {student.scores[top]?.mean?.toFixed(2)} / 5.0
            </span>
          </div>
          <h4 className="text-lg font-bold font-brand text-white">{topScale.label}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {topScale.highDescription}
          </p>
          <div className="pt-2 text-xs font-mono text-amber-300 border-t border-white/10">
            ✦ Lean heavily into this strength during group projects & exam preparation.
          </div>
        </div>

        {/* Growth Focus */}
        <div className="p-6 rounded-3xl bg-[#1c0e38]/90 border border-purple-400/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-purple-400/15 text-purple-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-purple-400/30 flex items-center gap-1">
              <Target className="w-3 h-3 text-purple-300" />
              Growth Focus Area
            </span>
            <span className="text-xs font-mono font-bold text-purple-300">
              {student.scores[focus]?.mean?.toFixed(2)} / 5.0
            </span>
          </div>
          <h4 className="text-lg font-bold font-brand text-white">{focusScale.label}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {supportTip.student}
          </p>
          <div className="pt-2 text-xs font-mono text-purple-200 border-t border-white/10">
            ✦ Classroom accommodation: {supportTip.classroom}
          </div>
        </div>
      </div>

      {/* Student Code Box Card */}
      <div
        id="student-code-card"
        className="relative bg-gradient-to-r from-[#210f3f] via-[#2f155c] to-[#210f3f] border border-[#f5b716]/40 hover:border-[#f5b716]/60 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl backdrop-blur-xl transition-all overflow-hidden"
      >
        {/* Subtle decorative glow orb */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#f5b716]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5b716]/15 border border-[#f5b716]/30 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#f5b716] animate-pulse" />
            Save Your Unique Constellation Code
          </span>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Use this permanent WILS code to revisit your learning radar, compare traits with classmates, or download your official PDF report.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div
            id="student-code-box"
            onClick={handleCopyCode}
            className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-3.5 bg-[#0e071e]/90 border-2 border-dashed border-[#f5b716]/60 hover:border-[#f5b716] px-6 py-3 rounded-2xl cursor-pointer group transition-all shadow-inner"
            title="Click to copy code"
          >
            <span className="font-mono text-2xl sm:text-3xl font-bold tracking-widest text-[#f5b716] group-hover:text-amber-200 transition-colors select-all">
              {student.id}
            </span>
            <div className="p-2 rounded-xl bg-[#f5b716]/20 group-hover:bg-[#f5b716]/30 text-[#f5b716] transition-colors">
              {copied ? <Check className="w-5 h-5 text-amber-300 animate-bounce" /> : <Copy className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {(copied || shareNotice) && (
          <p className="text-xs font-mono text-amber-300 flex items-center justify-center gap-1.5 transition-all">
            <Check className="w-4 h-4 text-amber-400" />
            <span>{shareNotice || 'Unique code copied to clipboard!'}</span>
          </p>
        )}

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            id="download-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="px-4 py-2.5 rounded-xl bg-[#f5b716]/20 hover:bg-[#f5b716]/30 border border-[#f5b716]/40 text-amber-200 hover:text-amber-100 font-semibold text-xs font-mono flex items-center gap-1.5 transition-all hover:scale-105 active:scale-100 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 text-[#f5b716] animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-[#f5b716]" />
            )}
            <span>{isGeneratingPdf ? 'Exporting PDF...' : 'Download PDF'}</span>
          </button>

          <button
            id="copy-code-btn"
            onClick={handleCopyCode}
            className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 hover:text-purple-100 font-semibold text-xs font-mono flex items-center gap-1.5 transition-all hover:scale-105 active:scale-100 cursor-pointer shadow-sm"
          >
            <Copy className="w-3.5 h-3.5 text-purple-300" />
            <span>{copied ? 'Copied ✓' : 'Copy Code'}</span>
          </button>

          <button
            id="share-chart-btn"
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs font-mono flex items-center gap-1.5 transition-all hover:scale-105 active:scale-100 cursor-pointer shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Share Summary</span>
          </button>

          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs font-mono flex items-center gap-1.5 transition-all hover:scale-105 active:scale-100 cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-200" />
            <span>Print Dossier</span>
          </button>

          <button
            id="retake-quiz-btn"
            onClick={onRetake}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white font-semibold text-xs font-mono flex items-center gap-1.5 transition-all hover:scale-105 active:scale-100 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-300" />
            <span>Retake Survey</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation Pathways */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Return to Home
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('lookup')}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
          >
            Look up another code
          </button>

          <button
            onClick={() => onNavigate('teacherGate')}
            className="px-5 py-2.5 rounded-xl bg-[#f5b716]/20 hover:bg-[#f5b716]/30 border border-[#f5b716]/40 text-amber-200 font-brand font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Faculty Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};


