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

function buildAddHint(a: number, b: number, answer: number, hasCarry: boolean): string[] {
  const lines: string[] = [`${a} + ${b} = ?`];
  if (hasCarry) {
    lines.push("שימו לב: יש המרה (נשאה)!");
    const aOnes = a % 10, bOnes = b % 10;
    const onesSum = aOnes + bOnes;
    if (onesSum >= 10) {
      lines.push(`יחידות: ${aOnes} + ${bOnes} = ${onesSum} → כותבים ${onesSum % 10} ומעבירים 1`);
    }
  }
  lines.push(`התשובה: ${a} + ${b} = ${answer}`);
  return lines;
}

function buildSubHint(a: number, b: number, answer: number, hasBorrow: boolean): string[] {
  const lines: string[] = [`${a} - ${b} = ?`];
  if (hasBorrow) {
    lines.push("שימו לב: יש פריטה (הלוואה)!");
    const aOnes = a % 10, bOnes = b % 10;
    if (aOnes < bOnes) {
      lines.push(`יחידות: ${aOnes} < ${bOnes} → לוקחים 1 מהעשרות`);
      lines.push(`${aOnes + 10} - ${bOnes} = ${aOnes + 10 - bOnes}`);
    }
  }
  lines.push(`התשובה: ${a} - ${b} = ${answer}`);
  return lines;
}

// --- Vertical mode: 3-digit numbers (100-999) ---

function genVerticalAddNoCarry(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(100, 899);
    b = randInt(100, 899);
  } while (checkCarryAdd(a, b) || a + b > 999);
  const answer = a + b;
  return { a, b, op: "+", answer, mode: "vertical", hasCarry: false, hint: buildAddHint(a, b, answer, false) };
}

function genVerticalAddWithCarry(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(100, 899);
    b = randInt(100, 899);
  } while (!checkCarryAdd(a, b) || a + b > 9999);
  const answer = a + b;
  return { a, b, op: "+", answer, mode: "vertical", hasCarry: true, hint: buildAddHint(a, b, answer, true) };
}

function genVerticalSubNoBorrow(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(200, 999);
    b = randInt(100, a - 100);
  } while (checkBorrow(a, b));
  const answer = a - b;
  return { a, b, op: "-", answer, mode: "vertical", hasCarry: false, hint: buildSubHint(a, b, answer, false) };
}

function genVerticalSubWithBorrow(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(200, 999);
    b = randInt(100, a - 10);
  } while (!checkBorrow(a, b));
  const answer = a - b;
  return { a, b, op: "-", answer, mode: "vertical", hasCarry: true, hint: buildSubHint(a, b, answer, true) };
}

// --- Horizontal mode: 2-digit numbers (up to 99) ---

function genHorizontalAddNoCarry(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(10, 89);
    b = randInt(10, 89);
  } while (checkCarryAdd(a, b) || a + b > 99);
  const answer = a + b;
  return { a, b, op: "+", answer, mode: "horizontal", hasCarry: false, hint: buildAddHint(a, b, answer, false) };
}

function genHorizontalAddWithCarry(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(10, 89);
    b = randInt(10, 89);
  } while (!checkCarryAdd(a, b) || a + b > 99);
  const answer = a + b;
  return { a, b, op: "+", answer, mode: "horizontal", hasCarry: true, hint: buildAddHint(a, b, answer, true) };
}

function genHorizontalSubNoBorrow(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(20, 99);
    b = randInt(10, a - 5);
  } while (checkBorrow(a, b));
  const answer = a - b;
  return { a, b, op: "-", answer, mode: "horizontal", hasCarry: false, hint: buildSubHint(a, b, answer, false) };
}

function genHorizontalSubWithBorrow(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(20, 99);
    b = randInt(10, a - 5);
  } while (!checkBorrow(a, b));
  const answer = a - b;
  return { a, b, op: "-", answer, mode: "horizontal", hasCarry: true, hint: buildSubHint(a, b, answer, true) };
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
