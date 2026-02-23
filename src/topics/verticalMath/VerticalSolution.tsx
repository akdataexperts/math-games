interface VerticalSolutionProps {
  a: number;
  b: number;
  op: "+" | "-";
  answer: number;
}

interface ColumnStep {
  label: string;
  digitA: number;
  digitB: number;
  carryIn: number;
  result: number;
  carryOut: number;
  hebrewLabel: string;
  mathExpr: string;
}

function getAdditionSteps(a: number, b: number): ColumnStep[] {
  const aStr = String(a);
  const bStr = String(b);
  const maxLen = Math.max(aStr.length, bStr.length);
  const aPad = aStr.padStart(maxLen, "0");
  const bPad = bStr.padStart(maxLen, "0");

  const placeNames = ["יחידות", "עשרות", "מאות", "אלפים"];
  const steps: ColumnStep[] = [];
  let carry = 0;

  for (let i = maxLen - 1; i >= 0; i--) {
    const dA = parseInt(aPad[i]);
    const dB = parseInt(bPad[i]);
    const sum = dA + dB + carry;
    const result = sum % 10;
    const carryOut = Math.floor(sum / 10);
    const col = maxLen - 1 - i;
    const label = placeNames[col] ?? `טור ${col + 1}`;

    let hebrewLabel: string;
    let mathExpr: string;
    if (carry > 0 && carryOut > 0) {
      hebrewLabel = `${label}: כותבים ${result}, נשיאה ${carryOut}`;
      mathExpr = `${dA} + ${dB} + ${carry} = ${sum}`;
    } else if (carry > 0) {
      hebrewLabel = `${label}:`;
      mathExpr = `${dA} + ${dB} + ${carry} = ${sum}`;
    } else if (carryOut > 0) {
      hebrewLabel = `${label}: כותבים ${result}, נשיאה ${carryOut}`;
      mathExpr = `${dA} + ${dB} = ${sum}`;
    } else {
      hebrewLabel = `${label}:`;
      mathExpr = `${dA} + ${dB} = ${sum}`;
    }

    steps.push({ label, digitA: dA, digitB: dB, carryIn: carry, result, carryOut, hebrewLabel, mathExpr });
    carry = carryOut;
  }

  if (carry > 0) {
    steps.push({
      label: placeNames[steps.length] ?? "טור נוסף",
      digitA: 0, digitB: 0, carryIn: carry, result: carry, carryOut: 0,
      hebrewLabel: `${placeNames[steps.length] ?? "טור נוסף"}: כותבים ${carry} (נשיאה)`,
      mathExpr: "",
    });
  }

  return steps;
}

function getSubtractionSteps(a: number, b: number): ColumnStep[] {
  const aStr = String(a);
  const bStr = String(b);
  const maxLen = Math.max(aStr.length, bStr.length);
  const aPad = aStr.padStart(maxLen, "0");
  const bPad = bStr.padStart(maxLen, "0");

  const placeNames = ["יחידות", "עשרות", "מאות", "אלפים"];
  const steps: ColumnStep[] = [];
  let borrow = 0;

  for (let i = maxLen - 1; i >= 0; i--) {
    const dA = parseInt(aPad[i]);
    const dB = parseInt(bPad[i]);
    let currentA = dA - borrow;
    const col = maxLen - 1 - i;
    const label = placeNames[col] ?? `טור ${col + 1}`;

    let newBorrow = 0;
    let result: number;
    let hebrewLabel: string;
    let mathExpr: string;

    if (currentA < dB) {
      newBorrow = 1;
      currentA += 10;
      result = currentA - dB;

      if (borrow > 0) {
        hebrewLabel = `${label}: אחרי פריטה קודמת, ${dA - borrow} קטן מ-${dB}, פריטה!`;
        mathExpr = `${currentA} - ${dB} = ${result}`;
      } else {
        hebrewLabel = `${label}: ${dA} קטן מ-${dB}, פריטה!`;
        mathExpr = `${currentA} - ${dB} = ${result}`;
      }
    } else {
      result = currentA - dB;
      if (borrow > 0) {
        hebrewLabel = `${label}: אחרי פריטה`;
        mathExpr = `${currentA} - ${dB} = ${result}`;
      } else {
        hebrewLabel = `${label}:`;
        mathExpr = `${dA} - ${dB} = ${result}`;
      }
    }

    steps.push({ label, digitA: dA, digitB: dB, carryIn: borrow, result, carryOut: newBorrow, hebrewLabel, mathExpr });
    borrow = newBorrow;
  }

  return steps;
}

export default function VerticalSolution({ a, b, op, answer }: VerticalSolutionProps) {
  const steps = op === "+" ? getAdditionSteps(a, b) : getSubtractionSteps(a, b);

  const aStr = String(a);
  const bStr = String(b);
  const ansStr = String(answer);
  const maxLen = Math.max(aStr.length, bStr.length, ansStr.length);
  const aPad = aStr.padStart(maxLen, "0").split("");
  const bPad = bStr.padStart(maxLen, "0").split("");
  const ansPad = ansStr.padStart(maxLen, "0").split("");

  // Build carry row for addition
  const carries: number[] = new Array(maxLen).fill(0);
  if (op === "+") {
    let carry = 0;
    for (let i = maxLen - 1; i >= 0; i--) {
      const sum = parseInt(aPad[i]) + parseInt(bPad[i]) + carry;
      carry = Math.floor(sum / 10);
      if (i > 0 && carry > 0) {
        carries[i - 1] = carry;
      }
    }
  }

  // Build borrow markers for subtraction
  const borrows: boolean[] = new Array(maxLen).fill(false);
  if (op === "-") {
    let borrow = 0;
    for (let i = maxLen - 1; i >= 0; i--) {
      const dA = parseInt(aPad[i]) - borrow;
      const dB = parseInt(bPad[i]);
      if (dA < dB) {
        borrow = 1;
        if (i > 0) borrows[i - 1] = true;
      } else {
        borrow = 0;
      }
    }
  }

  const cellClass = "flex h-10 w-10 items-center justify-center text-2xl font-bold";

  return (
    <div className="animate-pop-in mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-sm">
      <div className="mb-3 text-lg font-bold text-amber-300 text-right">💡 פתרון בשיטת המאונך:</div>

      {/* Visual vertical layout */}
      <div className="mx-auto mb-5 w-fit rounded-xl bg-black/20 px-6 py-4" dir="ltr">
        {/* Carry row (addition only) */}
        {op === "+" && carries.some((c) => c > 0) && (
          <div className="flex justify-end">
            <div className={cellClass} /> {/* spacer for op column */}
            {carries.map((c, i) => (
              <div key={`carry-${i}`} className={`${cellClass} text-base text-orange-400`}>
                {c > 0 ? c : ""}
              </div>
            ))}
          </div>
        )}

        {/* Number A */}
        <div className="flex justify-end">
          <div className={cellClass} /> {/* spacer for op column */}
          {aPad.map((d, i) => (
            <div key={`a-${i}`} className={`${cellClass} text-white ${borrows[i] ? "relative" : ""}`}>
              {borrows[i] && (
                <span className="absolute -top-1 left-0 text-xs text-red-400">−1</span>
              )}
              {d}
            </div>
          ))}
        </div>

        {/* Operator + Number B */}
        <div className="flex justify-end">
          <div className={`${cellClass} text-white/60`}>{op}</div>
          {bPad.map((d, i) => (
            <div key={`b-${i}`} className={`${cellClass} text-white`}>
              {d}
            </div>
          ))}
        </div>

        {/* Separator line */}
        <div className="my-1 border-b-2 border-white/40" style={{ width: `${(maxLen + 1) * 40}px` }} />

        {/* Answer */}
        <div className="flex justify-end">
          <div className={cellClass} /> {/* spacer */}
          {ansPad.map((d, i) => (
            <div key={`ans-${i}`} className={`${cellClass} font-bold text-green-400`}>
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Step by step text explanation */}
      <div className="space-y-2 text-right">
        <div className="text-sm font-medium text-amber-200">שלב אחר שלב:</div>
        {steps.map((step, i) => (
          <div
            key={i}
            className="rounded-lg bg-white/5 px-3 py-2 text-base text-amber-100"
          >
            <span className="ml-2 inline-block rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
              {i + 1}
            </span>
            {step.hebrewLabel}
            {step.mathExpr && (
              <span className="mr-1 font-mono font-bold text-white" dir="ltr">
                {step.mathExpr}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
