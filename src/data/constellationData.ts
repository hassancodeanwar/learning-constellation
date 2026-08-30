import { Question, ScaleDefinition, TraitKey, ArchetypeDefinition, TraitScores, StudentRecord } from '../types';

export const CLASSES_BY_GRADE: Record<string, string[]> = {
  "10": ["10A", "10B"],
  "11": ["11A", "11B"],
  "12": ["12A", "12B", "12C", "12D"],
};

export const ALL_CLASSES = ["10A", "10B", "11A", "11B", "12A", "12B", "12C", "12D"];

export const SCALE_ORDER: TraitKey[] = ["social", "structure", "independence", "practice", "expression", "stress"];

export const SCALES: Record<TraitKey, ScaleDefinition> = {
  social: {
    key: "social",
    label: "Social Energy",
    shortLabel: "Social",
    description: "How interaction with peers recharges or drains your cognitive stamina.",
    lowDescription: "Prefers solitary processing, independent thinking time, and low-stimulus environments.",
    highDescription: "Thrives in collaborative dialogue, group study, and shared discovery.",
    items: [1, 2, 3, 4, 5, 6],
    color: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.4)"
  },
  structure: {
    key: "structure",
    label: "Structure Preference",
    shortLabel: "Structure",
    description: "Need for defined rubrics, sequential milestones, and clear expectations.",
    lowDescription: "Fluid and flexible; comfortable with open-ended or evolving prompts.",
    highDescription: "High clarity seeker; excels with clear rubrics, checklists, and explicit targets.",
    items: [7, 8, 9, 10, 11, 12],
    color: "#818cf8",
    glowColor: "rgba(129, 140, 248, 0.4)"
  },
  independence: {
    key: "independence",
    label: "Independence",
    shortLabel: "Autonomy",
    description: "Drive to self-direct inquiry, formulate personal methods, and troubleshoot solo.",
    lowDescription: "Appreciates step-by-step guidance, frequent check-ins, and shared direction.",
    highDescription: "Self-driven explorer; prefers choosing own approach and problem-solving first.",
    items: [13, 14, 15, 16, 17, 18],
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.4)"
  },
  practice: {
    key: "practice",
    label: "Learning by Practice",
    shortLabel: "Practice",
    description: "Preference for hands-on application, problem sets, and experiential testing.",
    lowDescription: "Grasps concepts through abstract theory, big-picture discussion, or reading.",
    highDescription: "Kinesthetic & iterative; learns best by doing, modeling, and real examples.",
    items: [19, 20, 21, 22, 23, 24],
    color: "#2dd4bf",
    glowColor: "rgba(45, 212, 191, 0.4)"
  },
  expression: {
    key: "expression",
    label: "Expression Comfort",
    shortLabel: "Expression",
    description: "Readiness to share vocal thoughts, ask in-flight questions, and present ideas.",
    lowDescription: "Prefers written reflection, asynchronous messaging, or think-pair-share.",
    highDescription: "Vocal and spontaneous contributor; comfortable verbalizing live hypotheses.",
    items: [25, 26, 27, 28, 29, 30],
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.4)"
  },
  stress: {
    key: "stress",
    label: "Stress Response",
    shortLabel: "Resilience",
    description: "Psychological recovery speed, emotional regulation under pressure, and persistence.",
    lowDescription: "More sensitive to cognitive overload; benefits from pacing buffers and resets.",
    highDescription: "Steady under deadline pressure; adapts quickly when plans go off course.",
    items: [31, 32, 33, 34, 35, 36],
    reverse: [35],
    color: "#f87171",
    glowColor: "rgba(248, 113, 113, 0.4)"
  }
};

export const QUESTIONS: Question[] = [
  { id: 1, text: "I feel energized and focused after discussing ideas with peers.", scale: "social" },
  { id: 2, text: "Group work helps me understand difficult topics much better than studying alone.", scale: "social" },
  { id: 3, text: "I enjoy collaborative study sessions even when I have a busy workload.", scale: "social" },
  { id: 4, text: "I find myself speaking up and contributing more when working in a small team.", scale: "social" },
  { id: 5, text: "Learning feels smoother and more engaging when classmates are involved.", scale: "social" },
  { id: 6, text: "I like debating and testing ideas with others, even when I'm not leading the group.", scale: "social" },
  { id: 7, text: "Having clear, step-by-step milestones makes it easy for me to start tasks.", scale: "structure" },
  { id: 8, text: "I feel much less stressed when project expectations and rubrics are thoroughly explained.", scale: "structure" },
  { id: 9, text: "I work best when I know exactly what an 'exemplary' finished assignment looks like.", scale: "structure" },
  { id: 10, text: "I perform significantly better when timelines and interim deadlines are established.", scale: "structure" },
  { id: 11, text: "When instructional materials are well-organized, my confidence skyrockets.", scale: "structure" },
  { id: 12, text: "I make a habit of reading all directions thoroughly before taking my first step.", scale: "structure" },
  { id: 13, text: "I feel comfortable figuring things out on my own without waiting for explicit guidance.", scale: "independence" },
  { id: 14, text: "I enjoy choosing my own unique pathway and methodology to approach a project.", scale: "independence" },
  { id: 15, text: "I prefer experimenting and trying my own solution before asking for feedback.", scale: "independence" },
  { id: 16, text: "If I get stuck on a difficult problem, I can usually deploy alternate strategies independently.", scale: "independence" },
  { id: 17, text: "I prefer working through confusion on my own before reaching out for help.", scale: "independence" },
  { id: 18, text: "I maintain steady momentum and manage my study time without needing external reminders.", scale: "independence" },
  { id: 19, text: "I learn concepts fastest by doing practice exercises and solving concrete problems.", scale: "practice" },
  { id: 20, text: "I understand abstract theories much better once I see how they apply to real scenarios.", scale: "practice" },
  { id: 21, text: "Hands-on activities, lab experiments, or simulations help me retain knowledge long-term.", scale: "practice" },
  { id: 22, text: "I discover new insights through trial, error, and iterative testing.", scale: "practice" },
  { id: 23, text: "I grasp new material much faster when instructors provide tangible real-world analogies.", scale: "practice" },
  { id: 24, text: "My confidence builds rapidly after I work through several similar practice problems.", scale: "practice" },
  { id: 25, text: "I feel comfortable and enthusiastic sharing my raw thoughts during class discussions.", scale: "expression" },
  { id: 26, text: "I don't hesitate to raise my hand and ask questions immediately when something is unclear.", scale: "expression" },
  { id: 27, text: "I can articulate my internal reasoning and logic clearly to others on the spot.", scale: "expression" },
  { id: 28, text: "I am willing to participate and hypothesize aloud even when I am not 100% sure I am right.", scale: "expression" },
  { id: 29, text: "I feel at ease presenting projects or speaking in front of an audience.", scale: "expression" },
  { id: 30, text: "When given the opportunity, I enjoy defending my perspective with evidence.", scale: "expression" },
  { id: 31, text: "When academic tasks become difficult or frustrating, I maintain my focus and keep going.", scale: "stress" },
  { id: 32, text: "I bounce back quickly after receiving a disappointing grade or critical feedback.", scale: "stress" },
  { id: 33, text: "I remain composed under tight exam or project submission deadlines.", scale: "stress" },
  { id: 34, text: "When a strategy fails, I pivot with curiosity rather than feeling discouraged.", scale: "stress" },
  { id: 35, text: "Stress and unexpected changes make it hard for me to concentrate on my work.", scale: "stress", reverse: true },
  { id: 36, text: "Even when I feel behind schedule, I can calmly organize and execute my next steps.", scale: "stress" }
];

export const REFLECTION_OPTIONS = [
  "More worked examples and sample models",
  "Step-by-step checklists and clear milestones",
  "More hands-on practice problems & iterative drills",
  "Dedicated quiet focus time to work solo",
  "Collaborative group workshops & study buddy pairings",
  "Frequent micro-check-ins and actionable feedback",
  "Alternative flexible project pathways"
];

export const SUPPORT_TIPS: Record<TraitKey, { classroom: string; student: string }> = {
  social: {
    classroom: "Offer flexible participation channels: pair-shares, quiet written check-ins, or small pod rotations before whole-class discussions.",
    student: "Pair up with an accountability buddy or use the '1 comment + 1 clarifying question' routine during collaborative workshops."
  },
  structure: {
    classroom: "Provide transparent rubrics, explicit timeboxes, and clear definitions of 'done' with visible exemplar benchmarks.",
    student: "Create a 'First 10 Minutes' task plan: break every big assignment into 3 micro-steps before diving in."
  },
  independence: {
    classroom: "Practice intentional scaffolding: 'Try first → peek at hint card → consult partner → ask teacher' to foster autonomous grit.",
    student: "When stuck, use the 5-minute rule: write down 'Here is what I tried, here is where I stopped' before asking for help."
  },
  practice: {
    classroom: "Anchor lectures with the 'I do, We do, You do' cadence, accompanied by interactive simulations and real-world case studies.",
    student: "Convert abstract lecture notes into 3 practice questions or flashcards within 24 hours of class."
  },
  expression: {
    classroom: "Lower vocal barrier to entry using digital polling, anonymous question parking lots, and structured think-pair-share.",
    student: "Draft your talking points in bullet form on paper first before speaking aloud to ground your ideas."
  },
  stress: {
    classroom: "Normalize revision cycles and error analysis; teach a 3-step restart protocol (Breathe → Isolate next step → Re-engage).",
    student: "When overwhelmed, adopt the 'Rule of One': ignore the entire mountain and execute just one 15-minute focused sprint."
  }
};

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    id: "stellar-architect",
    name: "The Stellar Architect",
    subtitle: "High Structure & Systematic Precision",
    symbol: "📐 ✦",
    description: "You excel at turning complex, ambiguous challenges into clean, structured systems. You have an innate eye for clarity, milestones, and high-standard craftsmanship.",
    superpower: "Deconstructs massive ambiguous projects into foolproof, sequenced roadmaps.",
    studyStrategy: "Build visual Kanban milestones and use detailed rubrics as self-audit checklists.",
    collaboratorTip: "Provide the team with the master outline and track progress benchmarks.",
    triggerTraits: { primary: "structure", secondary: "independence" }
  },
  {
    id: "solar-catalyst",
    name: "The Solar Catalyst",
    subtitle: "High Social Energy & Vocal Expression",
    symbol: "☀️ ✧",
    description: "You are the heartbeat of the learning room. You synthesize ideas through conversation, energize collaborative circles, and bring enthusiasm to complex topics.",
    superpower: "Unlocks breakthrough understanding through dynamic dialogue and rapid group brainstorming.",
    studyStrategy: "Form active study groups, teach concepts aloud to peers, and debate problem sets.",
    collaboratorTip: "Facilitate group discussions and encourage quieter teammates to share their insights.",
    triggerTraits: { primary: "social", secondary: "expression" }
  },
  {
    id: "void-navigator",
    name: "The Void Navigator",
    subtitle: "High Independence & Deep Focus",
    symbol: "🌌 ✦",
    description: "An autonomous, self-propelled thinker who thrives when given the freedom to explore deeply without micromanagement. You find elegant solutions through solo focus.",
    superpower: "Unmatched deep-work endurance and self-directed problem-solving grit.",
    studyStrategy: "Create isolated deep-work sprints using the Pomodoro technique with zero notifications.",
    collaboratorTip: "Take on complex individual sub-modules and deliver polished components back to the team.",
    triggerTraits: { primary: "independence", secondary: "practice" }
  },
  {
    id: "nebula-craftsman",
    name: "The Nebula Craftsman",
    subtitle: "High Practice & Iterative Experimentation",
    symbol: "🔬 ✧",
    description: "You bridge theory and reality through hands-on experimentation. Abstract concepts click instantly once you get to build, manipulate, test, and break things.",
    superpower: "Transforms abstract theoretical models into tangible, functioning real-world applications.",
    studyStrategy: "Prioritize solving real exam sets, creating physical/digital models, and iterative trial drills.",
    collaboratorTip: "Build prototypes and worked examples that demonstrate theoretical proofs to your peers.",
    triggerTraits: { primary: "practice", secondary: "stress" }
  },
  {
    id: "pulsar-resilient",
    name: "The Pulsar Resilient",
    subtitle: "High Stress Resilience & Adaptive Poise",
    symbol: "⚡ ✦",
    description: "Steady under pressure, unbothered by setbacks, and relentlessly adaptable. When an exam curveballs or a project breaks, you calmly reset and pivot toward victory.",
    superpower: "Maintains clear, rational perspective and rapid recovery during high-stakes deadlines.",
    studyStrategy: "Simulate strict timed testing environments and treat errors as invaluable calibration data.",
    collaboratorTip: "Serve as the team's anchor during crunch time, keeping panic low and focus sharp.",
    triggerTraits: { primary: "stress", secondary: "structure" }
  },
  {
    id: "celestial-harmonizer",
    name: "The Celestial Harmonizer",
    subtitle: "Balanced Multi-Spectrum Synthesizer",
    symbol: "🪐 ✧",
    description: "A versatile learner who adapts fluidly between solitary research, hands-on labs, and collaborative debates depending on what the challenge demands.",
    superpower: "Fluid cognitive agility — effortlessly shifts styles to match any academic terrain.",
    studyStrategy: "Alternate between independent conceptual mapping and collaborative peer quiz sessions.",
    collaboratorTip: "Act as the bridge in group projects between conceptual architects and hands-on builders.",
    triggerTraits: { primary: "social" }
  }
];

export function determineArchetype(scores: TraitScores): ArchetypeDefinition {
  const sorted = [...SCALE_ORDER].sort((a, b) => scores[b].mean - scores[a].mean);
  const top1 = sorted[0];
  const top2 = sorted[1];

  if (top1 === "structure" || (top2 === "structure" && scores.structure.mean >= 3.8)) return ARCHETYPES[0];
  if ((top1 === "social" || top1 === "expression") && (scores.social.mean >= 3.7 || scores.expression.mean >= 3.7)) return ARCHETYPES[1];
  if (top1 === "independence" || (top2 === "independence" && scores.independence.mean >= 3.8)) return ARCHETYPES[2];
  if (top1 === "practice" || (top2 === "practice" && scores.practice.mean >= 3.8)) return ARCHETYPES[3];
  if (top1 === "stress" && scores.stress.mean >= 3.8) return ARCHETYPES[4];
  return ARCHETYPES[5];
}

export function calculateCategory(mean: number): 'L' | 'M' | 'H' {
  if (mean <= 2.5) return 'L';
  if (mean <= 3.6) return 'M';
  return 'H';
}

export function computeStudentScores(answers: Record<number, number>): TraitScores {
  const scores = {} as TraitScores;
  SCALE_ORDER.forEach((scaleKey) => {
    const scaleDef = SCALES[scaleKey];
    let sum = 0;
    scaleDef.items.forEach((itemId) => {
      let val = answers[itemId] ?? 3;
      if (scaleDef.reverse && scaleDef.reverse.includes(itemId)) val = 6 - val;
      sum += val;
    });
    const mean = Math.round((sum / scaleDef.items.length) * 100) / 100;
    scores[scaleKey] = { mean, cat: calculateCategory(mean) };
  });
  return scores;
}

export const TEACHER_PASSCODE_DEFAULT = "constellation26";
