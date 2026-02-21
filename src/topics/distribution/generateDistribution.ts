export interface DistributionQuestion {
  twoDigit: number;
  oneDigit: number;
  tens: number;
  ones: number;
  tensProduct: number;
  onesProduct: number;
  answer: number;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(): DistributionQuestion {
  let twoDigit: number;
  let oneDigit: number;

  do {
    twoDigit = randInt(11, 29);
    oneDigit = randInt(2, 9);
  } while (twoDigit * oneDigit > 200);

  const tens = Math.floor(twoDigit / 10) * 10;
  const ones = twoDigit % 10;

  return {
    twoDigit,
    oneDigit,
    tens,
    ones,
    tensProduct: tens * oneDigit,
    onesProduct: ones * oneDigit,
    answer: twoDigit * oneDigit,
  };
}

export function generateQuestions(count: number): DistributionQuestion[] {
  return Array.from({ length: count }, () => generateQuestion());
}
