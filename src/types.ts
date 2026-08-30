export type TraitKey = 'social' | 'structure' | 'independence' | 'practice' | 'expression' | 'stress';

export type TraitLevel = 'L' | 'M' | 'H';

export interface TraitScore {
  mean: number;
  cat: TraitLevel;
}

export type TraitScores = Record<TraitKey, TraitScore>;

export interface Question {
  id: number;
  text: string;
  scale: TraitKey;
  reverse?: boolean;
}

export interface ScaleDefinition {
  key: TraitKey;
  label: string;
  shortLabel: string;
  description: string;
  lowDescription: string;
  highDescription: string;
  items: number[];
  reverse?: number[];
  color: string;
  glowColor: string;
}

export interface ArchetypeDefinition {
  id: string;
  name: string;
  subtitle: string;
  symbol: string;
  description: string;
  superpower: string;
  studyStrategy: string;
  collaboratorTip: string;
  triggerTraits: {
    primary: TraitKey;
    secondary?: TraitKey;
  };
}

export interface StudentRecord {
  id: string;
  name: string;
  grade: string;
  className: string;
  answers: Record<number, number>;
  reflection: string;
  scores: TraitScores;
  archetype: ArchetypeDefinition;
  timestamp: number;
  notes?: string;
}

export interface PairMatch {
  studentA: StudentRecord;
  studentB: StudentRecord;
  similarityPct: number;
  synergyType: 'Balanced Synergy' | 'Shared Momentum' | 'Peer Mentorship' | 'Creative Dynamic';
  description: string;
}

export type AppView =
  | 'home'
  | 'studentForm'
  | 'quiz'
  | 'results'
  | 'lookup'
  | 'teacherGate'
  | 'teacherDashboard'
  | 'teacherStudent'
  | 'aboutScales';
