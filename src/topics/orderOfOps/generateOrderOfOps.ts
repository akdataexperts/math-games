export interface OrderOfOpsQuestion {
  expression: string;
  answer: number;
  steps: string[];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genType1(): OrderOfOpsQuestion {
  // a + b × c
  const b = randInt(2, 9);
  const c = randInt(2, 9);
  const a = randInt(1, 20);
  const product = b * c;
  const answer = a + product;
  return {
    expression: `${a} + ${b} × ${c}`,
    answer,
    steps: [
      `קודם כפל: ${b} × ${c} = ${product}`,
      `אחר כך חיבור: ${a} + ${product} = ${answer}`,
    ],
  };
}

function genType2(): OrderOfOpsQuestion {
  // a × b - c
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const product = a * b;
  const c = randInt(1, product - 1);
  const answer = product - c;
  return {
    expression: `${a} × ${b} - ${c}`,
    answer,
    steps: [
      `קודם כפל: ${a} × ${b} = ${product}`,
      `אחר כך חיסור: ${product} - ${c} = ${answer}`,
    ],
  };
}

function genType3(): OrderOfOpsQuestion {
  // a + b × c - d
  const b = randInt(2, 8);
  const c = randInt(2, 8);
  const a = randInt(1, 15);
  const product = b * c;
  const sum = a + product;
  const d = randInt(1, Math.min(sum - 1, 15));
  const answer = sum - d;
  return {
    expression: `${a} + ${b} × ${c} - ${d}`,
    answer,
    steps: [
      `קודם כפל: ${b} × ${c} = ${product}`,
      `חיבור: ${a} + ${product} = ${sum}`,
      `חיסור: ${sum} - ${d} = ${answer}`,
    ],
  };
}

function genType4(): OrderOfOpsQuestion {
  // (a + b) × c
  const a = randInt(2, 10);
  const b = randInt(2, 10);
  const c = randInt(2, 6);
  const paren = a + b;
  const answer = paren * c;
  return {
    expression: `(${a} + ${b}) × ${c}`,
    answer,
    steps: [
      `קודם סוגריים: ${a} + ${b} = ${paren}`,
      `אחר כך כפל: ${paren} × ${c} = ${answer}`,
    ],
  };
}

function genType5(): OrderOfOpsQuestion {
  // a × (b - c)
  const c = randInt(1, 8);
  const b = randInt(c + 2, 15);
  const a = randInt(2, 7);
  const paren = b - c;
  const answer = a * paren;
  return {
    expression: `${a} × (${b} - ${c})`,
    answer,
    steps: [
      `קודם סוגריים: ${b} - ${c} = ${paren}`,
      `אחר כך כפל: ${a} × ${paren} = ${answer}`,
    ],
  };
}

function genType6(): OrderOfOpsQuestion {
  // a ÷ b + c × d
  const b = randInt(2, 8);
  const quotient = randInt(2, 10);
  const a = b * quotient;
  const c = randInt(2, 7);
  const d = randInt(2, 7);
  const product = c * d;
  const answer = quotient + product;
  return {
    expression: `${a} ÷ ${b} + ${c} × ${d}`,
    answer,
    steps: [
      `כפל וחילוק קודם (משמאל לימין):`,
      `${a} ÷ ${b} = ${quotient}`,
      `${c} × ${d} = ${product}`,
      `חיבור: ${quotient} + ${product} = ${answer}`,
    ],
  };
}

const generators = [genType1, genType2, genType3, genType4, genType5, genType6];

export function generateQuestion(): OrderOfOpsQuestion {
  const gen = generators[Math.floor(Math.random() * generators.length)];
  return gen();
}

export function generateQuestions(count: number): OrderOfOpsQuestion[] {
  return Array.from({ length: count }, () => generateQuestion());
}
