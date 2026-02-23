export type MathOp = "+" | "-";

export interface VerticalMathQuestion {
  a: number;
  b: number;
  op: MathOp;
  answer: number;
  hasCarry: boolean;
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

function genAddNoCarry(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(100, 899);
    b = randInt(100, 899);
  } while (checkCarryAdd(a, b) || a + b > 999);
  return { a, b, op: "+", answer: a + b, hasCarry: false };
}

function genAddWithCarry(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(100, 899);
    b = randInt(100, 899);
  } while (!checkCarryAdd(a, b) || a + b > 9999);
  return { a, b, op: "+", answer: a + b, hasCarry: true };
}

function genSubNoBorrow(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(200, 999);
    b = randInt(100, a - 100);
  } while (checkBorrow(a, b));
  return { a, b, op: "-", answer: a - b, hasCarry: false };
}

function genSubWithBorrow(): VerticalMathQuestion {
  let a: number, b: number;
  do {
    a = randInt(200, 999);
    b = randInt(100, a - 10);
  } while (!checkBorrow(a, b));
  return { a, b, op: "-", answer: a - b, hasCarry: true };
}

const generators = [genAddNoCarry, genAddWithCarry, genSubNoBorrow, genSubWithBorrow];

export function generateQuestion(): VerticalMathQuestion {
  return generators[Math.floor(Math.random() * generators.length)]();
}

export function generateQuestions(count: number): VerticalMathQuestion[] {
  return Array.from({ length: count }, () => generateQuestion());
}
