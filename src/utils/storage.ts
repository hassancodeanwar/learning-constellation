import { StudentRecord, TraitScores, TraitKey, PairMatch } from '../types';
import { INITIAL_SEEDED_STUDENTS, SCALE_ORDER, SCALES, TEACHER_PASSCODE_DEFAULT, determineArchetype, calculateCategory } from '../data/constellationData';

const STORAGE_KEY_STUDENTS = 'learning_constellation_students_v1';
const STORAGE_KEY_PASSCODE = 'learning_constellation_passcode_v1';
const STORAGE_KEY_RECENT_CODES = 'learning_constellation_recent_codes_v1';

export function initializeStorage(): void {
  if (typeof window === 'undefined') return;
  
  const existing = localStorage.getItem(STORAGE_KEY_STUDENTS);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_SEEDED_STUDENTS));
  }

  const existingPass = localStorage.getItem(STORAGE_KEY_PASSCODE);
  if (!existingPass) {
    localStorage.setItem(STORAGE_KEY_PASSCODE, TEACHER_PASSCODE_DEFAULT);
  }
}

export function getAllStudents(): StudentRecord[] {
  if (typeof window === 'undefined') return INITIAL_SEEDED_STUDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_SEEDED_STUDENTS));
      return INITIAL_SEEDED_STUDENTS;
    }
    const parsed = JSON.parse(raw) as StudentRecord[];
    // Ensure timestamps and valid structures
    return parsed.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } catch (err) {
    console.error('Error loading students from localStorage:', err);
    return INITIAL_SEEDED_STUDENTS;
  }
}

export function saveStudent(student: StudentRecord): void {
  if (typeof window === 'undefined') return;
  const current = getAllStudents();
  const index = current.findIndex((s) => s.id.toLowerCase() === student.id.toLowerCase());
  
  let updated: StudentRecord[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = student;
  } else {
    updated = [student, ...current];
  }

  localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));
  addRecentCode(student.id);
}

export function deleteStudent(id: string): void {
  if (typeof window === 'undefined') return;
  const current = getAllStudents();
  const updated = current.filter((s) => s.id.toLowerCase() !== id.toLowerCase());
  localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));
}

export function findStudentByCode(code: string): StudentRecord | null {
  const all = getAllStudents();
  const clean = code.trim().toLowerCase();
  return all.find((s) => s.id.toLowerCase() === clean) || null;
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

      // Calculate Euclidean distance across all 6 traits
      let distSq = 0;
      SCALE_ORDER.forEach((k) => {
        const diff = sA.scores[k].mean - sB.scores[k].mean;
        distSq += diff * diff;
      });
      const dist = Math.sqrt(distSq);
      // Max possible distance in 6 dimensions with range 1..5 is sqrt(6 * 4^2) = sqrt(96) ~= 9.79
      const similarityPct = Math.max(10, Math.min(99, Math.round((1 - dist / 9.8) * 100)));

      // Determine synergy archetype
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

  // Sort by high compatibility
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
