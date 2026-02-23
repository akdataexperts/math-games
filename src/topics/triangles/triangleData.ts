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

function dist(a: [number, number], b: [number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}

function angleDeg(a: [number, number], vertex: [number, number], b: [number, number]): number {
  const v1x = a[0] - vertex[0];
  const v1y = a[1] - vertex[1];
  const v2x = b[0] - vertex[0];
  const v2y = b[1] - vertex[1];
  const dot = v1x * v2x + v1y * v2y;
  const len1 = Math.sqrt(v1x ** 2 + v1y ** 2);
  const len2 = Math.sqrt(v2x ** 2 + v2y ** 2);
  const cosA = Math.max(-1, Math.min(1, dot / (len1 * len2)));
  return Math.round(Math.acos(cosA) * (180 / Math.PI));
}

function classifyAngles(angles: [number, number, number]): AngleType {
  if (angles.some((a) => a === 90)) return "right";
  if (angles.some((a) => a > 90)) return "obtuse";
  return "acute";
}

function classifySides(sides: [number, number, number]): SideType {
  const [a, b, c] = sides;
  if (a === b && b === c) return "equilateral";
  if (a === b || b === c || a === c) return "isosceles";
  return "scalene";
}

/**
 * Build a triangle question from 3 points.
 * Side lengths are shown as simple integers for readability:
 * we compute pixel distances, find ratios, and map to small integers.
 */
function buildTriangle(pts: [[number, number], [number, number], [number, number]]): TriangleQuestion {
  const [p0, p1, p2] = pts;

  // sides[i] = edge opposite to vertex i
  // side opposite p0 = p1↔p2, opposite p1 = p0↔p2, opposite p2 = p0↔p1
  const rawSides: [number, number, number] = [dist(p1, p2), dist(p0, p2), dist(p0, p1)];

  // angles[i] = angle at vertex i
  const angles: [number, number, number] = [
    angleDeg(p1, p0, p2),
    angleDeg(p0, p1, p2),
    angleDeg(p0, p2, p1),
  ];

  // Normalize angles to sum to 180
  const angleSum = angles[0] + angles[1] + angles[2];
  if (angleSum !== 180) {
    const diff = 180 - angleSum;
    const minIdx = angles.indexOf(Math.min(...angles));
    angles[minIdx] += diff;
  }

  // Map pixel distances to simple display integers (scale to range ~3-12)
  const minRaw = Math.min(...rawSides);
  const scale = 5 / minRaw;
  const sides: [number, number, number] = [
    Math.round(rawSides[0] * scale),
    Math.round(rawSides[1] * scale),
    Math.round(rawSides[2] * scale),
  ];

  // For isosceles/equilateral, force equal sides to be truly equal after rounding
  const sideType = classifySidesFromRaw(rawSides);
  if (sideType === "equilateral") {
    const avg = Math.round((sides[0] + sides[1] + sides[2]) / 3);
    sides[0] = sides[1] = sides[2] = avg;
  } else if (sideType === "isosceles") {
    forceIsosceles(rawSides, sides);
  }

  return {
    points: [p0, p1, p2],
    sides,
    angles,
    angleType: classifyAngles(angles),
    sideType: classifySides(sides),
  };
}

function classifySidesFromRaw(raw: [number, number, number]): SideType {
  const tolerance = 0.05;
  const [a, b, c] = raw;
  const max = Math.max(a, b, c);
  const ra = a / max, rb = b / max, rc = c / max;
  if (Math.abs(ra - rb) < tolerance && Math.abs(rb - rc) < tolerance) return "equilateral";
  if (Math.abs(ra - rb) < tolerance || Math.abs(rb - rc) < tolerance || Math.abs(ra - rc) < tolerance) return "isosceles";
  return "scalene";
}

function forceIsosceles(raw: [number, number, number], sides: [number, number, number]) {
  const tolerance = 0.05;
  const max = Math.max(...raw);
  const ratios = raw.map((r) => r / max);
  if (Math.abs(ratios[0] - ratios[1]) < tolerance) {
    const avg = Math.round((sides[0] + sides[1]) / 2);
    sides[0] = sides[1] = avg;
  }
  if (Math.abs(ratios[1] - ratios[2]) < tolerance) {
    const avg = Math.round((sides[1] + sides[2]) / 2);
    sides[1] = sides[2] = avg;
  }
  if (Math.abs(ratios[0] - ratios[2]) < tolerance) {
    const avg = Math.round((sides[0] + sides[2]) / 2);
    sides[0] = sides[2] = avg;
  }
}

// Triangles defined only by their coordinates.
// Sides and angles are computed automatically so they always match the visual.
const TRIANGLE_POINTS: [[number, number], [number, number], [number, number]][] = [
  // Equilateral
  [[150, 25], [50, 198], [250, 198]],
  [[150, 20], [44, 203], [256, 203]],

  // Right isosceles (right angle at bottom-left)
  [[50, 200], [50, 50], [200, 200]],

  // Right scalene (right angle at bottom-left)
  [[50, 200], [50, 60], [240, 200]],
  [[40, 210], [40, 70], [210, 210]],

  // Right scalene (right angle at bottom-right)
  [[250, 200], [250, 50], [60, 200]],

  // Acute isosceles (tall, narrow)
  [[150, 20], [80, 200], [220, 200]],
  [[150, 30], [75, 195], [225, 195]],

  // Acute scalene
  [[100, 30], [40, 200], [230, 195]],
  [[130, 25], [50, 195], [245, 200]],

  // Obtuse isosceles (wide, flat)
  [[150, 100], [30, 210], [270, 210]],
  [[150, 110], [40, 205], [260, 205]],

  // Obtuse scalene
  [[70, 40], [30, 210], [270, 200]],
  [[90, 50], [20, 200], [260, 210]],
  [[60, 55], [35, 205], [280, 195]],
];

const TRIANGLES: TriangleQuestion[] = TRIANGLE_POINTS.map(buildTriangle);

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
    result.push(...shuffle(TRIANGLES));
  }
  return result.slice(0, count);
}
