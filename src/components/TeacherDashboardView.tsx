import React, { useState, useMemo } from 'react';
import { AppView, StudentRecord, TraitKey } from '../types';
import { ALL_CLASSES, SCALES, SCALE_ORDER, SUPPORT_TIPS, determineArchetype, computeStudentScores } from '../data/constellationData';
import { ConstellationRadar } from './ConstellationRadar';
import {
  computeClassAverages,
  calculateStudyPairs,
  exportCohortToCSV,
  deleteStudent,
  getTopAndFocusTraits,
  saveStudent,
  generateStudentCode
} from '../utils/storage';
import {
  Download,
  Users,
  Search,
  Plus,
  ArrowUpDown,
  Sparkles,
  LogOut,
  Trash2,
  GitCompare,
  Check,
  Award,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface TeacherDashboardViewProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onNavigate: (view: AppView) => void;
  onRefreshData: () => void;
  onLogout: () => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  students,
  onSelectStudent,
  onNavigate,
  onRefreshData,
  onLogout
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'topStrength' | 'stress'>('recent');
  const [activeTab, setActiveTab] = useState<'roster' | 'synergy' | 'analytics' | 'compare'>('roster');

  // Compare mode state
  const [compareStudentAId, setCompareStudentAId] = useState<string>('');
  const [compareStudentBId, setCompareStudentBId] = useState<string>('CLASS_AVG');

  // Filter students by selected class
  const classFilteredStudents = useMemo(() => {
    if (selectedClass === 'all') return students;
    return students.filter((s) => s.className.toUpperCase() === selectedClass.toUpperCase());
  }, [students, selectedClass]);

  // Compute cohort averages
  const cohortAverages = useMemo(() => {
    return computeClassAverages(classFilteredStudents);
  }, [classFilteredStudents]);

  // Calculate study pairs
  const studyPairs = useMemo(() => {
    return calculateStudyPairs(classFilteredStudents);
  }, [classFilteredStudents]);

  // Search & sort filtered roster
  const displayStudents = useMemo(() => {
    let list = [...classFilteredStudents];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.className.toLowerCase().includes(q) ||
          s.archetype?.name.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'topStrength') {
        const topA = getTopAndFocusTraits(a.scores).top;
        const topB = getTopAndFocusTraits(b.scores).top;
        return (b.scores[topB]?.mean ?? 0) - (a.scores[topA]?.mean ?? 0);
      }
      if (sortBy === 'stress') {
        return (b.scores.stress?.mean ?? 0) - (a.scores.stress?.mean ?? 0);
      }
      return (b.timestamp || 0) - (a.timestamp || 0);
    });

    return list;
  }, [classFilteredStudents, searchQuery, sortBy]);

  // Cohort archetype distribution
  const archetypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    classFilteredStudents.forEach((s) => {
      const name = s.archetype?.name || 'Celestial Harmonizer';
      counts[name] = (counts[name] || 0) + 1;
    });
    return counts;
  }, [classFilteredStudents]);

  const handleExport = () => {
    const label = selectedClass === 'all' ? 'All-Classes' : selectedClass;
    exportCohortToCSV(classFilteredStudents, label);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove this student response?')) {
      deleteStudent(id);
      onRefreshData();
    }
  };

  const handleAddSampleStudent = () => {
    const firstNames = ['Leo', 'Chloe', 'Julian', 'Amara', 'Gabriel', 'Zion', 'Harper'];
    const lastNames = ['Vance', 'Kovacs', 'Patel', 'Sterling', 'Brooks', 'Nakamura'];
    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const targetClass = selectedClass === 'all' ? '11A' : selectedClass;
    const targetGrade = targetClass.startsWith('10') ? '10' : targetClass.startsWith('12') ? '12' : '11';

    // Generate random answers with realistic variations
    const answers: Record<number, number> = {};
    for (let i = 1; i <= 36; i++) {
      answers[i] = Math.floor(Math.random() * 4) + 2; // 2..5
    }

    const scores = computeStudentScores(answers);
    const archetype = determineArchetype(scores);

    const newStudent: StudentRecord = {
      id: generateStudentCode(randomName),
      name: randomName,
      grade: targetGrade,
      className: targetClass,
      answers,
      reflection: 'Collaborative group workshops & study buddy pairings',
      scores,
      archetype,
      timestamp: Date.now()
    };

    saveStudent(newStudent);
    onRefreshData();
  };

  const studentA = students.find((s) => s.id === compareStudentAId);
  const studentB = students.find((s) => s.id === compareStudentBId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Staff Portal • Cohort Analytics</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white">
            Classroom Constellations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Psychometric overview, instructional accommodations, and synergy pairings for your classes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAddSampleStudent}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-mono text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Add random mock response"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Test Student</span>
          </button>

          <button
            onClick={handleExport}
            disabled={classFilteredStudents.length === 0}
            className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-xs font-mono text-teal-200 flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Portal</span>
          </button>
        </div>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedClass('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 cursor-pointer ${
            selectedClass === 'all'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-[#151739] text-slate-300 hover:bg-[#1f2355] border border-white/10'
          }`}
        >
          All Classes ({students.length})
        </button>

        {ALL_CLASSES.map((c) => {
          const count = students.filter((s) => s.className.toUpperCase() === c.toUpperCase()).length;
          return (
            <button
              key={c}
              onClick={() => setSelectedClass(c)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                selectedClass === c
                  ? 'bg-teal-400 text-slate-950 shadow-lg shadow-teal-400/20'
                  : 'bg-[#151739] text-slate-300 hover:bg-[#1f2355] border border-white/10'
              }`}
            >
              <span>Class {c}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedClass === c ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-display font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'roster'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-teal-400" />
          <span>Student Roster ({displayStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('synergy')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-display font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'synergy'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Study Pair Synergy Matcher</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-display font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'compare'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitCompare className="w-4 h-4 text-indigo-400" />
          <span>Compare Constellations</span>
        </button>
      </div>

      {/* TAB 1: ROSTER & COHORT OVERVIEW */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="p-5 rounded-2xl bg-[#171a42] border border-white/10 space-y-1">
              <div className="text-xs font-mono text-slate-400 uppercase">Surveyed Responses</div>
              <div className="text-3xl font-bold font-display text-amber-300">
                {classFilteredStudents.length}
              </div>
              <p className="text-[11px] text-slate-400">
                {selectedClass === 'all'
                  ? 'Total across all grades & classes'
                  : `Active cohort in Class ${selectedClass}`}
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-2xl bg-[#171a42] border border-white/10 space-y-1">
              <div className="text-xs font-mono text-slate-400 uppercase">Archetype Diversity</div>
              <div className="text-3xl font-bold font-display text-teal-300">
                {Object.keys(archetypeCounts).length} Types
              </div>
              <p className="text-[11px] text-slate-400">
                Diverse balance of architects, catalysts & navigators
              </p>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-2xl bg-[#171a42] border border-white/10 space-y-1">
              <div className="text-xs font-mono text-slate-400 uppercase">Available Pairs</div>
              <div className="text-3xl font-bold font-display text-indigo-300">
                {studyPairs.length} Synergies
              </div>
              <p className="text-[11px] text-slate-400">
                Ready for project team assignments
              </p>
            </div>
          </div>

          {/* Average Constellation Radar + Trait Breakdown Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#171a42] border border-white/15 rounded-3xl p-6 shadow-2xl">
            <div className="lg:col-span-6 flex flex-col items-center">
              <span className="text-xs font-mono text-amber-300 uppercase tracking-wider mb-2">
                Cohort Average Constellation {selectedClass !== 'all' && `(${selectedClass})`}
              </span>
              <ConstellationRadar scores={cohortAverages} size={300} interactive={true} />
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-white">
                  Class Profile Mean Scores
                </h3>
                <p className="text-xs text-slate-300">
                  Aggregated average across all 6 psychometric scales for the active cohort.
                </p>
              </div>

              <div className="space-y-2.5">
                {SCALE_ORDER.map((scaleKey) => {
                  const scale = SCALES[scaleKey];
                  const avg = cohortAverages[scaleKey];
                  const pct = Math.round(((avg?.mean ?? 3) / 5) * 100);

                  return (
                    <div key={scaleKey} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300">{scale.label}</span>
                        <span className="font-bold text-white">{avg?.mean?.toFixed(2)} / 5.0</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
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
          </div>

          {/* Roster Controls: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, code, archetype..."
                className="w-full bg-[#121430] border border-white/15 focus:border-teal-400 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-mono text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#121430] border border-white/15 text-xs font-mono text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="name">Student Name (A-Z)</option>
                <option value="topStrength">Primary Strength</option>
                <option value="stress">Resilience Score</option>
              </select>
            </div>
          </div>

          {/* Student Grid Cards */}
          {displayStudents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayStudents.map((student) => {
                const { top, focus } = getTopAndFocusTraits(student.scores);
                const topScale = SCALES[top];
                const focusScale = SCALES[focus];

                return (
                  <div
                    key={student.id}
                    onClick={() => onSelectStudent(student)}
                    className="p-5 rounded-2xl bg-[#171a42] hover:bg-[#1e2254] border border-white/10 hover:border-teal-400/50 transition-all cursor-pointer space-y-4 group relative overflow-hidden shadow-md hover:-translate-y-1"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                          {student.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                          <span>Class {student.className}</span>
                          <span>•</span>
                          <span className="text-teal-300 font-semibold">{student.id}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(student.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Remove student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Archetype badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200">
                      <span>{student.archetype?.symbol}</span>
                      <span className="font-semibold text-white">{student.archetype?.name}</span>
                    </div>

                    {/* Trait chips */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Strength:</span>
                        <span className="text-amber-300 font-bold">
                          {topScale.label} ({student.scores[top]?.mean?.toFixed(1)})
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Growth Focus:</span>
                        <span className="text-teal-300 font-bold">
                          {focusScale.label} ({student.scores[focus]?.mean?.toFixed(1)})
                        </span>
                      </div>
                    </div>

                    {/* Footer link */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-teal-300">
                      <span>View Full Profile</span>
                      <span>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#171a42] border border-white/10 text-center space-y-3">
              <div className="text-slate-400 font-mono text-sm">
                No students found matching your filter.
              </div>
              <button
                onClick={handleAddSampleStudent}
                className="px-4 py-2 rounded-xl bg-teal-400/20 text-teal-300 text-xs font-mono border border-teal-400/40 hover:bg-teal-400/30"
              >
                + Add Sample Student Response
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STUDY PAIR SYNERGY MATCHER */}
      {activeTab === 'synergy' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#171a42] border border-white/15 space-y-2">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Optimal Study Pairs & Collaboration Synergies</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Based on Euclidean multi-dimensional trait distances and complementary strengths (e.g., pairing structured planners with autonomous thinkers or vocal catalysts with quiet craftsmen).
            </p>
          </div>

          {studyPairs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyPairs.slice(0, 12).map((pair, idx) => (
                <div
                  key={`${pair.studentA.id}-${pair.studentB.id}-${idx}`}
                  className="p-5 rounded-2xl bg-[#171a42] border border-white/10 space-y-3 shadow-lg hover:border-amber-400/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      {pair.similarityPct}% Compatibility
                    </span>
                    <span className="text-xs font-mono text-teal-300">
                      {pair.synergyType}
                    </span>
                  </div>

                  {/* Student pair header */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div
                      onClick={() => onSelectStudent(pair.studentA)}
                      className="cursor-pointer hover:underline"
                    >
                      <div className="font-display font-bold text-white text-sm">
                        {pair.studentA.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {pair.studentA.archetype?.name}
                      </div>
                    </div>

                    <span className="text-slate-500 font-mono text-xs font-bold">&amp;</span>

                    <div
                      onClick={() => onSelectStudent(pair.studentB)}
                      className="text-right cursor-pointer hover:underline"
                    >
                      <div className="font-display font-bold text-white text-sm">
                        {pair.studentB.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {pair.studentB.archetype?.name}
                      </div>
                    </div>
                  </div>

                  {/* Synergy rationale */}
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#121430] p-3 rounded-xl border border-white/5">
                    ✦ {pair.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#171a42] border border-white/10 text-center space-y-3">
              <p className="text-slate-400 font-mono text-sm">
                Need at least 2 students in the selected class cohort to calculate study pairs.
              </p>
              <button
                onClick={handleAddSampleStudent}
                className="px-4 py-2 rounded-xl bg-teal-400/20 text-teal-300 text-xs font-mono border border-teal-400/40"
              >
                + Add Another Student
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPARE CONSTELLATIONS */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#171a42] border border-white/15 space-y-4">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-indigo-400" />
              <span>Side-by-Side Constellation Overlay</span>
            </h3>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">Primary Student</label>
                <select
                  value={compareStudentAId}
                  onChange={(e) => setCompareStudentAId(e.target.value)}
                  className="w-full bg-[#121430] border border-white/15 text-xs font-mono text-white rounded-xl p-3 outline-none"
                >
                  <option value="">Select Student A...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">Compare Against</label>
                <select
                  value={compareStudentBId}
                  onChange={(e) => setCompareStudentBId(e.target.value)}
                  className="w-full bg-[#121430] border border-white/15 text-xs font-mono text-white rounded-xl p-3 outline-none"
                >
                  <option value="CLASS_AVG">Class Cohort Average</option>
                  {students
                    .filter((s) => s.id !== compareStudentAId)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.className})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {studentA ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#171a42] border border-white/15 rounded-3xl p-6 shadow-2xl">
              <div className="lg:col-span-6 flex flex-col items-center">
                <ConstellationRadar
                  scores={studentA.scores}
                  compareScores={compareStudentBId === 'CLASS_AVG' ? cohortAverages : studentB?.scores}
                  compareLabel={compareStudentBId === 'CLASS_AVG' ? 'Class Average' : studentB?.name}
                  size={320}
                  interactive={true}
                />
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-bold font-display text-white">
                    Comparison Analysis: {studentA.name} vs{' '}
                    {compareStudentBId === 'CLASS_AVG' ? 'Cohort Average' : studentB?.name}
                  </h4>
                  <p className="text-xs text-slate-300">
                    Comparative variance across all 6 psychometric dimensions.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {SCALE_ORDER.map((scaleKey) => {
                    const scale = SCALES[scaleKey];
                    const valA = studentA.scores[scaleKey]?.mean ?? 3;
                    const valB =
                      compareStudentBId === 'CLASS_AVG'
                        ? cohortAverages[scaleKey]?.mean ?? 3
                        : studentB?.scores[scaleKey]?.mean ?? 3;
                    const diff = valA - valB;

                    return (
                      <div key={scaleKey} className="p-2.5 rounded-xl bg-[#121430] flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-200">{scale.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-300 font-bold">{valA.toFixed(2)}</span>
                          <span className="text-slate-500">vs</span>
                          <span className="text-slate-300 font-bold">{valB.toFixed(2)}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              diff > 0.3
                                ? 'bg-amber-400/20 text-amber-300'
                                : diff < -0.3
                                ? 'bg-rose-400/20 text-rose-300'
                                : 'bg-white/5 text-slate-400'
                            }`}
                          >
                            {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#171a42] border border-white/10 text-center text-slate-400 font-mono text-sm">
              Please select a primary student to initiate the comparative constellation overlay.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
