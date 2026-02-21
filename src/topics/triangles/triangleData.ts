export type AngleType = "acute" | "right" | "obtuse";
export type SideType = "equilateral" | "isosceles" | "scalene";
export type ClassifyMode = "angles" | "sides";

export interface TriangleQuestion {
  points: [number, number][];
  sides: [number, number, number];
  angles: [number, number, number];
  angleType: AngleType;
  sideType: SideType;
}

export const ANGLE_LABELS: Record<AngleType, string> = {
  acute: "משולש חד-זווית",
  right: "משולש ישר-זווית",
  obtuse: "משולש קהה-זווית",
};

export const SIDE_LABELS: Record<SideType, string> = {
  equilateral: "משולש שווה-צלעות",
  isosceles: "משולש שווה-שוקיים",
  scalene: "משולש שונה-צלעות",
};

export const ANGLE_HINTS: Record<AngleType, string[]> = {
  acute: [
    "משולש חד-זווית הוא משולש שכל הזוויות שלו קטנות מ-90°",
    "שלוש הזוויות חדות (פחות מ-90°)",
  ],
  right: [
    "משולש ישר-זווית הוא משולש שיש בו זווית אחת של 90° בדיוק",
    "שימו לב לסימון הריבוע בזווית",
  ],
  obtuse: [
    "משולש קהה-זווית הוא משולש שיש בו זווית אחת גדולה מ-90°",
    "אחת הזוויות רחבה (יותר מ-90°)",
  ],
};

export const SIDE_HINTS: Record<SideType, string[]> = {
  equilateral: [
    "משולש שווה-צלעות: כל שלוש הצלעות שוות באורכן",
    "שימו לב: כל הצלעות באותו אורך",
  ],
  isosceles: [
    "משולש שווה-שוקיים: שתי צלעות שוות באורכן",
    "שימו לב: יש שתי צלעות באותו אורך",
  ],
  scalene: [
    "משולש שונה-צלעות: כל הצלעות באורך שונה",
    "שימו לב: אין שתי צלעות שוות",
  ],
};

const TRIANGLES: TriangleQuestion[] = [
  // Equilateral (all 60°)
  {
    points: [[150, 30], [50, 200], [250, 200]],
    sides: [7, 7, 7],
    angles: [60, 60, 60],
    angleType: "acute",
    sideType: "equilateral",
  },
  {
    points: [[150, 20], [40, 210], [260, 210]],
    sides: [9, 9, 9],
    angles: [60, 60, 60],
    angleType: "acute",
    sideType: "equilateral",
  },
  // Right isosceles
  {
    points: [[50, 200], [50, 50], [200, 200]],
    sides: [6, 6, 8],
    angles: [90, 45, 45],
    angleType: "right",
    sideType: "isosceles",
  },
  // Right scalene
  {
    points: [[50, 200], [50, 50], [250, 200]],
    sides: [5, 8, 9],
    angles: [90, 32, 58],
    angleType: "right",
    sideType: "scalene",
  },
  {
    points: [[40, 210], [40, 60], [220, 210]],
    sides: [6, 7, 10],
    angles: [90, 40, 50],
    angleType: "right",
    sideType: "scalene",
  },
  // Acute isosceles
  {
    points: [[150, 30], [60, 190], [240, 190]],
    sides: [8, 8, 6],
    angles: [70, 70, 40],
    angleType: "acute",
    sideType: "isosceles",
  },
  {
    points: [[150, 40], [70, 200], [230, 200]],
    sides: [10, 10, 7],
    angles: [65, 65, 50],
    angleType: "acute",
    sideType: "isosceles",
  },
  // Acute scalene
  {
    points: [[120, 30], [40, 200], [250, 180]],
    sides: [7, 8, 9],
    angles: [50, 60, 70],
    angleType: "acute",
    sideType: "scalene",
  },
  // Obtuse isosceles
  {
    points: [[150, 60], [50, 180], [250, 180]],
    sides: [8, 8, 12],
    angles: [40, 40, 100],
    angleType: "obtuse",
    sideType: "isosceles",
  },
  // Obtuse scalene
  {
    points: [[80, 50], [30, 200], [270, 200]],
    sides: [6, 9, 12],
    angles: [30, 35, 115],
    angleType: "obtuse",
    sideType: "scalene",
  },
  {
    points: [[100, 40], [20, 190], [260, 210]],
    sides: [5, 10, 11],
    angles: [25, 45, 110],
    angleType: "obtuse",
    sideType: "scalene",
  },
  {
    points: [[120, 50], [40, 210], [280, 190]],
    sides: [7, 11, 13],
    angles: [28, 52, 100],
    angleType: "obtuse",
    sideType: "scalene",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getTriangleQuestions(count: number): TriangleQuestion[] {
  const shuffled = shuffle(TRIANGLES);
  const result: TriangleQuestion[] = [];
  while (result.length < count) {
    result.push(...shuffled);
  }
  return result.slice(0, count);
}
