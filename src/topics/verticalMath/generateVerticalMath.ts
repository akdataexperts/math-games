export type MathMode = "horizontal" | "vertical";
export type MathOp = "+" | "-";

export interface VerticalMathQuestion {
  a: number;
  b: number;
  op: MathOp;
  answer: number;
  mode: MathMode;
  hasCarry: boolean;
  hint: string[];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkCarryAdd(a: number, b: number): boolean {
  const aStr = String(a);
  const bStr = String(b);
  const maxLen = Math.max(aStr.length, bStr.length);
  const aPad = aStr.padStart(maxLen, "0");
  const bPad = bStr.padStart(maxLen, "0");
  let carry = 0;
  for (let i = maxLen - 1; i >= 0; i--) {
    const sum = parseInt(aPad[i]) + parseInt(bPad[i]) + carry;
    if (sum >= 10) return true;
    carry = 0;
  }
  return false;
}

function checkBorrow(a: number, b: number): boolean {
  const aStr = String(a);
  const bStr = String(b);
  const maxLen = Math.max(aStr.length, bStr.length);
  const aPad = aStr.padStart(maxLen, "0");
  const bPad = bStr.padStart(maxLen, "0");
  for (let i = maxLen - 1; i >= 0; i--) {
    if (parseInt(aPad[i]) < parseInt(bPad[i])) return true;
  }
  return false;
}

function buildHorizontalHint(a: number, b: number, op: MathOp, answer: number): string[] {
  return [`התשובה: ${a} ${op} ${b} = ${answer}`];
}

// --- Vertical mode: 3-digit numbers (100-999) ---

function genVerticalAddNoCarry(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(100, 899);
    b = randInt(100, 899);
  } while (checkCarryAdd(a, b) || a + b > 999);
  const answer = a + b;
  return { a, b, op: "+", answer, mode: "vertical", hasCarry: false, hint: [] };
}

function genVerticalAddWithCarry(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(100, 899);
    b = randInt(100, 899);
  } while (!checkCarryAdd(a, b) || a + b > 9999);
  const answer = a + b;
  return { a, b, op: "+", answer, mode: "vertical", hasCarry: true, hint: [] };
}

function genVerticalSubNoBorrow(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(200, 999);
    b = randInt(100, a - 100);
  } while (checkBorrow(a, b));
  const answer = a - b;
  return { a, b, op: "-", answer, mode: "vertical", hasCarry: false, hint: [] };
}

function genVerticalSubWithBorrow(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(200, 999);
    b = randInt(100, a - 10);
  } while (!checkBorrow(a, b));
  const answer = a - b;
  return { a, b, op: "-", answer, mode: "vertical", hasCarry: true, hint: [] };
}

// --- Horizontal mode: 2-digit numbers (up to 99) ---

function genHorizontalAddNoCarry(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(10, 89);
    b = randInt(10, 89);
  } while (checkCarryAdd(a, b) || a + b > 99);
  const answer = a + b;
  return { a, b, op: "+", answer, mode: "horizontal", hasCarry: false, hint: buildHorizontalHint(a, b, "+", answer) };
}

function genHorizontalAddWithCarry(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(10, 89);
    b = randInt(10, 89);
  } while (!checkCarryAdd(a, b) || a + b > 99);
  const answer = a + b;
  return { a, b, op: "+", answer, mode: "horizontal", hasCarry: true, hint: buildHorizontalHint(a, b, "+", answer) };
}

function genHorizontalSubNoBorrow(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(20, 99);
    b = randInt(10, a - 5);
  } while (checkBorrow(a, b));
  const answer = a - b;
  return { a, b, op: "-", answer, mode: "horizontal", hasCarry: false, hint: buildHorizontalHint(a, b, "-", answer) };
}

function genHorizontalSubWithBorrow(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(20, 99);
    b = randInt(10, a - 5);
  } while (!checkBorrow(a, b));
  const answer = a - b;
  return { a, b, op: "-", answer, mode: "horizontal", hasCarry: true, hint: buildHorizontalHint(a, b, "-", answer) };
}

const generators = [
  genVerticalAddNoCarry, genVerticalAddWithCarry,
  genVerticalSubNoBorrow, genVerticalSubWithBorrow,
  genHorizontalAddNoCarry, genHorizontalAddWithCarry,
  genHorizontalSubNoBorrow, genHorizontalSubWithBorrow,
];

export function generateQuestion(): VerticalMathQuestion {
  return generators[Math.floor(Math.random() * generators.length)]();
}

export function generateQuestions(count: number): VerticalMathQuestion[] {
  return Array.from({ length: count }, () => generateQuestion());
}
