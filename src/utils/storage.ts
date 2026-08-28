import { StudentRecord, TraitScores, TraitKey, PairMatch, ArchetypeDefinition } from '../types';
import { SCALE_ORDER, SCALES, TEACHER_PASSCODE_DEFAULT, determineArchetype, calculateCategory } from '../data/constellationData';
import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY_PASSCODE = 'learning_constellation_passcode_v1';
const STORAGE_KEY_RECENT_CODES = 'learning_constellation_recent_codes_v1';

// ---- DB row shape ----
interface StudentRow {
  id: string;
  name: string;
  grade: string;
  class_name: string;
  answers: Record<number, number>;
  reflection: string;
  scores: TraitScores;
  archetype: ArchetypeDefinition;
  notes: string | null;
  timestamp: number;
}

function rowToRecord(row: StudentRow): StudentRecord {
  return {
    id: row.id,
    name: row.name,
    grade: row.grade,
    className: row.class_name,
    answers: row.answers ?? {},
    reflection: row.reflection ?? '',
    scores: row.scores ?? ({} as TraitScores),
    archetype: row.archetype ?? determineArchetype(row.scores ?? ({} as TraitScores)),
    notes: row.notes ?? undefined,
    timestamp: row.timestamp,
  };
}

function recordToRow(student: StudentRecord): Omit<StudentRow, 'created_at' | 'updated_at'> {
  return {
    id: student.id,
    name: student.name,
    grade: student.grade,
    class_name: student.className,
    answers: student.answers,
    reflection: student.reflection,
    scores: student.scores,
    archetype: student.archetype,
    notes: student.notes ?? null,
    timestamp: student.timestamp,
  };
}

/**
 * Kept for backwards compatibility with App.tsx (called on mount).
 * The Supabase database is pre-seeded, so no local initialization is needed.
 */
export function initializeStorage(): void {
  // Ensure the passcode exists in localStorage for the teacher gate
  if (typeof window === 'undefined') return;
  const existingPass = localStorage.getItem(STORAGE_KEY_PASSCODE);
  if (!existingPass) {
    localStorage.setItem(STORAGE_KEY_PASSCODE, TEACHER_PASSCODE_DEFAULT);
  }
}

export async function getAllStudents(): Promise<StudentRecord[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching students from Supabase:', error);
    return [];
  }

  return (data as StudentRow[]).map(rowToRecord);
}

export async function saveStudent(student: StudentRecord): Promise<void> {
  const row = recordToRow(student);
  const { error } = await supabase
    .from('students')
    .upsert(row, { onConflict: 'id' });

  if (error) {
    console.error('Error saving student to Supabase:', error);
    return;
  }
  addRecentCode(student.id);
}

export async function deleteStudent(id: string): Promise<void> {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting student from Supabase:', error);
  }
}

export async function findStudentByCode(code: string): Promise<StudentRecord | null> {
  const clean = code.trim().toLowerCase();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .ilike('id', clean)
    .maybeSingle();

  if (error) {
    console.error('Error finding student by code:', error);
    return null;
  }

  if (!data) return null;
  return rowToRecord(data as StudentRow);
}

export function getTeacherPasscode(): string {
  if (typeof window === 'undefined') return TEACHER_PASSCODE_DEFAULT;
  return localStorage.getItem(STORAGE_KEY_PASSCODE) || TEACHER_PASSCODE_DEFAULT;
}

export function setTeacherPasscode(newPass: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PASSCODE, newPass);
}

export function generateStudentCode(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  let initials = 'STU';
  if (parts.length >= 2) {
    initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0].substring(0, 2).toUpperCase();
  }
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${initials}-${rand}`;
}

export function getRecentCodes(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENT_CODES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentCode(code: string): void {
  if (typeof window === 'undefined') return;
  try {
    const recents = getRecentCodes().filter((c) => c.toLowerCase() !== code.toLowerCase());
    recents.unshift(code.toUpperCase());
    localStorage.setItem(STORAGE_KEY_RECENT_CODES, JSON.stringify(recents.slice(0, 5)));
  } catch {
    // Ignore storage errors
  }
}

export function getTopAndFocusTraits(scores: TraitScores): { top: TraitKey; focus: TraitKey } {
  let top: TraitKey = 'social';
  let focus: TraitKey = 'social';

  SCALE_ORDER.forEach((key) => {
    if (scores[key].mean > scores[top].mean) top = key;
    if (scores[key].mean < scores[focus].mean) focus = key;
  });

  return { top, focus };
}

export function computeClassAverages(students: StudentRecord[]): TraitScores {
  const avg = {} as TraitScores;

  if (students.length === 0) {
    SCALE_ORDER.forEach((k) => {
      avg[k] = { mean: 3.0, cat: 'M' };
    });
    return avg;
  }

  SCALE_ORDER.forEach((k) => {
    const sum = students.reduce((acc, s) => acc + (s.scores[k]?.mean || 3), 0);
    const mean = Math.round((sum / students.length) * 100) / 100;
    avg[k] = {
      mean,
      cat: calculateCategory(mean)
    };
  });

  return avg;
}

export function calculateStudyPairs(students: StudentRecord[]): PairMatch[] {
  if (students.length < 2) return [];

  const matches: PairMatch[] = [];

  for (let i = 0; i < students.length; i++) {
    for (let j = i + 1; j < students.length; j++) {
      const sA = students[i];
      const sB = students[j];

      let distSq = 0;
      SCALE_ORDER.forEach((k) => {
        const diff = sA.scores[k].mean - sB.scores[k].mean;
        distSq += diff * diff;
      });
      const dist = Math.sqrt(distSq);
      const similarityPct = Math.max(10, Math.min(99, Math.round((1 - dist / 9.8) * 100)));

      let synergyType: PairMatch['synergyType'] = 'Balanced Synergy';
      let description = 'Complementary problem-solving approaches that expand each other’s perspectives.';

      if (similarityPct >= 80) {
        synergyType = 'Shared Momentum';
        description = 'High intrinsic alignment in pace, structure, and communication rhythm.';
      } else if (
        (sA.scores.structure.mean >= 4.0 && sB.scores.independence.mean >= 4.0) ||
        (sB.scores.structure.mean >= 4.0 && sA.scores.independence.mean >= 4.0)
      ) {
        synergyType = 'Balanced Synergy';
        description = 'One student provides clear organization while the other accelerates autonomous inquiry.';
      } else if (
        (sA.scores.practice.mean >= 4.2 && sB.scores.expression.mean >= 4.2) ||
        (sB.scores.practice.mean >= 4.2 && sA.scores.expression.mean >= 4.2)
      ) {
        synergyType = 'Creative Dynamic';
        description = 'Strong synthesis between hands-on experiential building and articulate presentation.';
      } else if (
        (sA.scores.stress.mean >= 4.2 && sB.scores.stress.mean <= 3.0) ||
        (sB.scores.stress.mean >= 4.2 && sA.scores.stress.mean <= 3.0)
      ) {
        synergyType = 'Peer Mentorship';
        description = 'High resilience anchor offers calm grounding during complex problem sets.';
      }

      matches.push({
        studentA: sA,
        studentB: sB,
        similarityPct,
        synergyType,
        description
      });
    }
  }

  return matches.sort((a, b) => b.similarityPct - a.similarityPct);
}

export function exportCohortToCSV(students: StudentRecord[], classLabel: string): void {
  const header = [
    'Student Code',
    'Full Name',
    'Grade',
    'Class',
    'Archetype',
    ...SCALE_ORDER.map((k) => `${SCALES[k].label} (Score)`),
    ...SCALE_ORDER.map((k) => `${SCALES[k].label} (Level)`),
    'Requested Support Reflection',
    'Recorded Date'
  ];

  const escapeCSV = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;

  const rows = students.map((s) => {
    const dateStr = s.timestamp ? new Date(s.timestamp).toLocaleDateString() : '';
    const scores = SCALE_ORDER.map((k) => (s.scores[k]?.mean ?? 3).toFixed(2));
    const levels = SCALE_ORDER.map((k) => s.scores[k]?.cat ?? 'M');

    return [
      s.id,
      s.name,
      s.grade,
      s.className,
      s.archetype?.name || determineArchetype(s.scores).name,
      ...scores,
      ...levels,
      s.reflection || '',
      dateStr
    ].map(escapeCSV).join(',');
  });

  const csvContent = [header.map(escapeCSV).join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `constellation-cohort-${classLabel.replace(/\s+/g, '-').toLowerCase()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
