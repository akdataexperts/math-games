export type TopicId = "arithmetic" | "distribution" | "triangles" | "orderOfOps" | "decimalStructure" | "verticalMath";

export type GamePhase = "intro" | "playing" | "feedback" | "summary";

export interface Topic {
  id: TopicId;
  name: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface GameState {
  phase: GamePhase;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  answers: boolean[];
}

export type Page = { type: "home" } | { type: "game"; topicId: TopicId };

export const TOPICS: Topic[] = [
  {
    id: "arithmetic",
    name: "ארבע פעולות חשבון",
    description: "חיבור, חיסור, כפל וחילוק",
    icon: "🧮",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "distribution",
    name: "כפל באמצעות פילוג",
    description: "כפל מספרים דו-ספרתיים עד 200",
    icon: "✂️",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "triangles",
    name: "מיון משולשים",
    description: "סיווג לפי זוויות וצלעות",
    icon: "📐",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "orderOfOps",
    name: "סדר פעולות חשבון",
    description: "סוגריים, כפל וחילוק לפני חיבור וחיסור",
    icon: "📋",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "decimalStructure",
    name: "המבנה העשרוני",
    description: "אלפים, מאות, עשרות ויחידות עד 10,000",
    icon: "🔢",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "verticalMath",
    name: "חיבור וחיסור במאונך",
    description: "תרגילים במאונך ובמאוזן עם ובלי המרה",
    icon: "📝",
    gradient: "from-teal-500 to-cyan-600",
  },
];

export const ENCOURAGEMENTS = [
  "!מעולה",
  "!כל הכבוד",
  "!יופי",
  "!נכון מאוד",
  "!אלוף",
  "!בדיוק",
  "!מדהים",
];

export const WRONG_MESSAGES = [
  "לא נורא, ננסה שוב!",
  "כמעט! בוא נראה את הפתרון",
  "קרוב! הנה ההסבר",
];

export function getRandomEncouragement(): string {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

export function getRandomWrongMessage(): string {
  return WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
}

export function getStars(score: number, total: number): number {
  const pct = (score / total) * 100;
  if (pct >= 90) return 3;
  if (pct >= 60) return 2;
  return 1;
}
