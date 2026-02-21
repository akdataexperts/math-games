import { useState, useMemo, useCallback } from "react";
import Layout from "../../components/Layout";
import ProgressBar from "../../components/ProgressBar";
import StarRating from "../../components/StarRating";
import Celebration from "../../components/Celebration";
import HintBox from "../../components/HintBox";
import { getStars, getRandomEncouragement, getRandomWrongMessage } from "../../types";
import { generateQuestions, type DistributionQuestion } from "./generateDistribution";

const TOTAL = 10;

type Step = "split" | "multiply" | "sum" | "feedback";

interface DistributionGameProps {
  onBack: () => void;
}

export default function DistributionGame({ onBack }: DistributionGameProps) {
  const [phase, setPhase] = useState<"intro" | "playing" | "summary">("intro");
  const [questions, setQuestions] = useState<DistributionQuestion[]>(() => generateQuestions(TOTAL));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const [step, setStep] = useState<Step>("split");
  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [tensProductInput, setTensProductInput] = useState("");
  const [onesProductInput, setOnesProductInput] = useState("");
  const [sumInput, setSumInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [hadError, setHadError] = useState(false);

  const q = useMemo(() => questions[current], [questions, current]);
  const stars = useMemo(() => getStars(score, TOTAL), [score]);

  const resetInputs = useCallback(() => {
    setStep("split");
    setTensInput("");
    setOnesInput("");
    setTensProductInput("");
    setOnesProductInput("");
    setSumInput("");
    setIsCorrect(null);
    setFeedbackMsg("");
    setHadError(false);
  }, []);

  const checkSplit = useCallback(() => {
    const t = parseInt(tensInput, 10);
    const o = parseInt(onesInput, 10);
    if (t === q.tens && o === q.ones) {
      setStep("multiply");
    } else {
      setHadError(true);
      setFeedbackMsg(`לא בדיוק... ${q.twoDigit} = ${q.tens} + ${q.ones}`);
      setTensInput(String(q.tens));
      setOnesInput(String(q.ones));
      setTimeout(() => {
        setFeedbackMsg("");
        setStep("multiply");
      }, 2000);
    }
  }, [tensInput, onesInput, q]);

  const checkMultiply = useCallback(() => {
    const tp = parseInt(tensProductInput, 10);
    const op = parseInt(onesProductInput, 10);
    if (tp === q.tensProduct && op === q.onesProduct) {
      setStep("sum");
    } else {
      setHadError(true);
      setFeedbackMsg(`${q.tens} × ${q.oneDigit} = ${q.tensProduct} | ${q.ones} × ${q.oneDigit} = ${q.onesProduct}`);
      setTensProductInput(String(q.tensProduct));
      setOnesProductInput(String(q.onesProduct));
      setTimeout(() => {
        setFeedbackMsg("");
        setStep("sum");
      }, 2000);
    }
  }, [tensProductInput, onesProductInput, q]);

  const checkSum = useCallback(() => {
    const s = parseInt(sumInput, 10);
    const correct = s === q.answer;
    if (correct && !hadError) {
      setScore((prev) => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    setIsCorrect(correct && !hadError);
    setFeedbackMsg(correct && !hadError ? getRandomEncouragement() : hadError ? "עברנו על השלבים יחד" : getRandomWrongMessage());
    setStep("feedback");
  }, [sumInput, q, hadError]);

  const handleNext = useCallback(() => {
    if (current + 1 >= TOTAL) {
      setPhase("summary");
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } else {
      setCurrent((c) => c + 1);
      resetInputs();
    }
  }, [current, resetInputs]);

  const handleRestart = useCallback(() => {
    setQuestions(generateQuestions(TOTAL));
    setCurrent(0);
    setScore(0);
    resetInputs();
    setPhase("intro");
  }, [resetInputs]);

  if (phase === "intro") {
    return (
      <Layout title="כפל באמצעות פילוג" onBack={onBack}>
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-float mb-6 text-8xl">✂️</div>
          <h2 className="mb-4 text-3xl font-bold">כפל באמצעות פילוג</h2>
          <p className="mb-4 text-lg text-white/70">
            נפרק מספרים לעשרות ויחידות ונכפול בשלבים
          </p>
          <div className="mb-8 rounded-2xl bg-white/10 p-5 text-center" dir="ltr">
            <p className="text-lg text-white/80">:לדוגמה</p>
            <p className="mt-2 text-xl font-bold text-blue-300">14 × 7</p>
            <p className="text-lg text-white/60">= (10 × 7) + (4 × 7)</p>
            <p className="text-lg text-white/60">= 70 + 28</p>
            <p className="text-xl font-bold text-green-300">= 98</p>
          </div>
          <button
            onClick={() => { setPhase("playing"); resetInputs(); }}
            className="animate-pulse-glow rounded-2xl bg-gradient-to-l from-blue-500 to-cyan-600 px-10 py-4 text-xl font-bold shadow-lg transition hover:scale-105"
          >
            !בואו נתחיל 🚀
          </button>
        </div>
      </Layout>
    );
  }

  if (phase === "summary") {
    return (
      <Layout title="כפל באמצעות פילוג" onBack={onBack}>
        <Celebration active={showCelebration} />
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-pop-in mb-6 rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold">!סיימת</h2>
            <StarRating stars={stars} />
            <p className="mt-4 text-2xl">
              {score} מתוך {TOTAL} תשובות נכונות
            </p>
            <p className="mt-2 text-lg text-white/60">
              {stars === 3 ? "!מושלם" : stars === 2 ? "!כל הכבוד" : "!תמשיך לתרגל"}
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="rounded-xl bg-gradient-to-l from-blue-500 to-cyan-600 px-8 py-3 font-bold transition hover:scale-105"
            >
              🔄 שחק שוב
            </button>
            <button
              onClick={onBack}
              className="rounded-xl bg-white/10 px-8 py-3 font-bold transition hover:bg-white/20"
            >
              חזרה לתפריט
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="כפל באמצעות פילוג" onBack={onBack}>
      <Celebration active={showCelebration} />
      <div className="mx-auto max-w-lg">
        <ProgressBar current={current} total={TOTAL} />

        <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
          {/* Problem display */}
          <div className="mb-6 text-center text-4xl font-bold" dir="ltr">
            {q.twoDigit} × {q.oneDigit} = ?
          </div>

          {/* Step 1: Split */}
          {step === "split" && (
            <div className="animate-pop-in space-y-4 text-center">
              <p className="text-lg text-white/80">
                פרקו את {q.twoDigit} לעשרות ויחידות:
              </p>
              <div className="flex items-center justify-center gap-3" dir="ltr">
                <input
                  type="number"
                  value={tensInput}
                  onChange={(e) => setTensInput(e.target.value)}
                  className="w-20 rounded-xl border-2 border-blue-400/40 bg-blue-500/10 px-3 py-2 text-center text-xl text-white outline-none focus:border-blue-400"
                  placeholder="?"
                  autoFocus
                />
                <span className="text-2xl">+</span>
                <input
                  type="number"
                  value={onesInput}
                  onChange={(e) => setOnesInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkSplit()}
                  className="w-20 rounded-xl border-2 border-green-400/40 bg-green-500/10 px-3 py-2 text-center text-xl text-white outline-none focus:border-green-400"
                  placeholder="?"
                />
              </div>
              {feedbackMsg && (
                <p className="text-sm text-amber-300">{feedbackMsg}</p>
              )}
              <button
                onClick={checkSplit}
                disabled={!tensInput || !onesInput}
                className="rounded-xl bg-gradient-to-l from-blue-500 to-cyan-600 px-8 py-2 font-bold transition hover:scale-105 disabled:opacity-40"
              >
                ✓ המשך
              </button>
            </div>
          )}

          {/* Step 2: Multiply each part */}
          {step === "multiply" && (
            <div className="animate-pop-in space-y-4 text-center">
              <p className="text-lg text-white/80">כעת חשבו כל חלק בנפרד:</p>
              <div className="space-y-3" dir="ltr">
                <div className="flex items-center justify-center gap-3">
                  <span className="w-24 text-left text-lg text-blue-300">{q.tens} × {q.oneDigit} =</span>
                  <input
                    type="number"
                    value={tensProductInput}
                    onChange={(e) => setTensProductInput(e.target.value)}
                    className="w-20 rounded-xl border-2 border-blue-400/40 bg-blue-500/10 px-3 py-2 text-center text-xl text-white outline-none focus:border-blue-400"
                    placeholder="?"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="w-24 text-left text-lg text-green-300">{q.ones} × {q.oneDigit} =</span>
                  <input
                    type="number"
                    value={onesProductInput}
                    onChange={(e) => setOnesProductInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && checkMultiply()}
                    className="w-20 rounded-xl border-2 border-green-400/40 bg-green-500/10 px-3 py-2 text-center text-xl text-white outline-none focus:border-green-400"
                    placeholder="?"
                  />
                </div>
              </div>
              {feedbackMsg && (
                <p className="text-sm text-amber-300">{feedbackMsg}</p>
              )}
              <button
                onClick={checkMultiply}
                disabled={!tensProductInput || !onesProductInput}
                className="rounded-xl bg-gradient-to-l from-blue-500 to-cyan-600 px-8 py-2 font-bold transition hover:scale-105 disabled:opacity-40"
              >
                ✓ המשך
              </button>
            </div>
          )}

          {/* Step 3: Sum */}
          {step === "sum" && (
            <div className="animate-pop-in space-y-4 text-center">
              <p className="text-lg text-white/80">חברו את שני החלקים:</p>
              <div className="flex items-center justify-center gap-3 text-xl" dir="ltr">
                <span className="text-blue-300">{q.tensProduct}</span>
                <span>+</span>
                <span className="text-green-300">{q.onesProduct}</span>
                <span>=</span>
                <input
                  type="number"
                  value={sumInput}
                  onChange={(e) => setSumInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkSum()}
                  className="w-24 rounded-xl border-2 border-yellow-400/40 bg-yellow-500/10 px-3 py-2 text-center text-xl text-white outline-none focus:border-yellow-400"
                  placeholder="?"
                  autoFocus
                />
              </div>
              <button
                onClick={checkSum}
                disabled={!sumInput}
                className="rounded-xl bg-gradient-to-l from-blue-500 to-cyan-600 px-8 py-2 font-bold transition hover:scale-105 disabled:opacity-40"
              >
                ✓ בדוק
              </button>
            </div>
          )}

          {/* Step 4: Feedback */}
          {step === "feedback" && (
            <div className="animate-pop-in space-y-4 text-center">
              <p className={`text-2xl font-bold ${isCorrect ? "text-green-400" : "text-amber-300"}`}>
                {feedbackMsg}
              </p>
              <div className="rounded-xl bg-white/5 p-4 text-lg" dir="ltr">
                <p>
                  {q.twoDigit} × {q.oneDigit}
                </p>
                <p className="text-white/60">
                  = (<span className="text-blue-300">{q.tens}</span> + <span className="text-green-300">{q.ones}</span>) × {q.oneDigit}
                </p>
                <p className="text-white/60">
                  = <span className="text-blue-300">{q.tensProduct}</span> + <span className="text-green-300">{q.onesProduct}</span>
                </p>
                <p className="font-bold text-yellow-300">= {q.answer}</p>
              </div>
              <button
                onClick={handleNext}
                className="rounded-xl bg-gradient-to-l from-blue-500 to-cyan-600 px-10 py-3 text-lg font-bold transition hover:scale-105"
              >
                {current + 1 >= TOTAL ? "📊 סיכום" : "→ הבא"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
