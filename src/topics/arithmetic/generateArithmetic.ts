export type Operation = "+" | "-" | "×" | "÷";

export interface ArithmeticQuestion {
  a: number;
  b: number;
  op: Operation;
  answer: number;
  hint: string[];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAddition(): ArithmeticQuestion {
  const a = randInt(10, 99);
  const b = randInt(10, 99);
  const answer = a + b;
  return {
    a,
    b,
    op: "+",
    answer,
    hint: [
      `${a} + ${b} = ?`,
      `נחבר: ${a} + ${b} = ${answer}`,
    ],
  };
}

function generateSubtraction(): ArithmeticQuestion {
  const answer = randInt(5, 80);
  const b = randInt(5, 50);
  const a = answer + b;
  return {
    a,
    b,
    op: "-",
    answer,
    hint: [
      `${a} - ${b} = ?`,
      `נחסיר: ${a} - ${b} = ${answer}`,
    ],
  };
}

function generateMultiplication(): ArithmeticQuestion {
  const a = randInt(2, 10);
  const b = randInt(2, 10);
  const answer = a * b;
  return {
    a,
    b,
    op: "×",
    answer,
    hint: [
      `${a} × ${b} = ?`,
      `נכפול: ${a} × ${b} = ${answer}`,
      `(כלומר ${a} פעמים ${b})`,
    ],
  };
}

function generateDivision(): ArithmeticQuestion {
  const b = randInt(2, 10);
  const answer = randInt(2, 10);
  const a = b * answer;
  return {
    a,
    b,
    op: "÷",
    answer,
    hint: [
      `${a} ÷ ${b} = ?`,
      `נחשוב: כמה פעמים ${b} נכנס ב-${a}?`,
      `${b} × ${answer} = ${a}`,
      `לכן ${a} ÷ ${b} = ${answer}`,
    ],
  };
}

const generators = [generateAddition, generateSubtraction, generateMultiplication, generateDivision];

export function generateQuestion(): ArithmeticQuestion {
  const gen = generators[Math.floor(Math.random() * generators.length)];
  return gen();
}

export function generateQuestions(count: number): ArithmeticQuestion[] {
  return Array.from({ length: count }, () => generateQuestion());
}
