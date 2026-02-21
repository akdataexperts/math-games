export type DecimalQuestionType = "decompose" | "compose" | "digitValue" | "compare";

export interface DecimalQuestion {
  type: DecimalQuestionType;
  number: number;
  thousands: number;
  hundreds: number;
  tens: number;
  ones: number;
  prompt: string;
  answer: number;
  answerLabel?: string;
  options?: { value: number; label: string }[];
  hint: string[];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function decompose(n: number) {
  return {
    thousands: Math.floor(n / 1000),
    hundreds: Math.floor((n % 1000) / 100),
    tens: Math.floor((n % 100) / 10),
    ones: n % 10,
  };
}

function genDecompose(): DecimalQuestion {
  const n = randInt(1000, 9999);
  const d = decompose(n);
  const parts = [
    ["אלפים", d.thousands],
    ["מאות", d.hundreds],
    ["עשרות", d.tens],
    ["יחידות", d.ones],
  ] as const;
  const idx = randInt(0, 3);
  const [placeName] = parts[idx];
  const answer = parts[idx][1];

  return {
    type: "decompose",
    number: n,
    ...d,
    prompt: `כמה ${placeName} יש במספר ${n.toLocaleString()}?`,
    answer,
    hint: [
      `${n.toLocaleString()} = ${d.thousands} אלפים, ${d.hundreds} מאות, ${d.tens} עשרות, ${d.ones} יחידות`,
      `מספר ה${placeName}: ${answer}`,
    ],
  };
}

function genCompose(): DecimalQuestion {
  const th = randInt(1, 9);
  const h = randInt(0, 9);
  const t = randInt(0, 9);
  const o = randInt(0, 9);
  const n = th * 1000 + h * 100 + t * 10 + o;

  return {
    type: "compose",
    number: n,
    thousands: th,
    hundreds: h,
    tens: t,
    ones: o,
    prompt: `${th} אלפים, ${h} מאות, ${t} עשרות ו-${o} יחידות = ?`,
    answer: n,
    hint: [
      `${th} אלפים = ${th * 1000}`,
      `${h} מאות = ${h * 100}`,
      `${t} עשרות = ${t * 10}`,
      `${o} יחידות = ${o}`,
      `${th * 1000} + ${h * 100} + ${t * 10} + ${o} = ${n}`,
    ],
  };
}

function genDigitValue(): DecimalQuestion {
  const n = randInt(1000, 9999);
  const d = decompose(n);
  const digits = [
    { digit: d.thousands, value: d.thousands * 1000, place: "אלפים" },
    { digit: d.hundreds, value: d.hundreds * 100, place: "מאות" },
    { digit: d.tens, value: d.tens * 10, place: "עשרות" },
    { digit: d.ones, value: d.ones, place: "יחידות" },
  ];

  // Pick a non-zero digit for meaningful questions
  const nonZero = digits.filter((x) => x.digit > 0);
  const chosen = nonZero.length > 0
    ? nonZero[randInt(0, nonZero.length - 1)]
    : digits[0];

  return {
    type: "digitValue",
    number: n,
    ...d,
    prompt: `מה הערך של הספרה ${chosen.digit} במספר ${n.toLocaleString()}?`,
    answer: chosen.value,
    hint: [
      `הספרה ${chosen.digit} נמצאת במקום ה${chosen.place}`,
      `ערכה: ${chosen.digit} × ${chosen.value / chosen.digit} = ${chosen.value}`,
    ],
  };
}

function genCompare(): DecimalQuestion {
  const a = randInt(1000, 9999);
  let b: number;
  do {
    b = randInt(1000, 9999);
  } while (b === a);

  const bigger = Math.max(a, b);

  return {
    type: "compare",
    number: a,
    ...decompose(a),
    prompt: `איזה מספר גדול יותר?`,
    answer: bigger,
    options: [
      { value: a, label: a.toLocaleString() },
      { value: b, label: b.toLocaleString() },
    ],
    hint: [
      `נשווה ספרה ספרה מהשמאל:`,
      `${a.toLocaleString()} ${a > b ? ">" : "<"} ${b.toLocaleString()}`,
      `לכן ${bigger.toLocaleString()} גדול יותר`,
    ],
  };
}

const generators = [genDecompose, genCompose, genDigitValue, genCompare];

export function generateQuestion(): DecimalQuestion {
  return generators[Math.floor(Math.random() * generators.length)]();
}

export function generateQuestions(count: number): DecimalQuestion[] {
  return Array.from({ length: count }, () => generateQuestion());
}
