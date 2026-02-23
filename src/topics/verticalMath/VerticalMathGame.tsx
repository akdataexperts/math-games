import { useState, useMemo, useCallback } from "react";
import Layout from "../../components/Layout";
import ProgressBar from "../../components/ProgressBar";
import StarRating from "../../components/StarRating";
import Celebration from "../../components/Celebration";
import VerticalSolution from "./VerticalSolution";
import { getStars, getRandomEncouragement, getRandomWrongMessage } from "../../types";
import { generateQuestions, type VerticalMathQuestion } from "./generateVerticalMath";

const TOTAL = 10;

interface VerticalMathGameProps {
  onBack: () => void;
}

function VerticalDisplay({ a, b, op, answer, showAnswer }: {
  a: number;
  b: number;
  op: string;
  answer: number;
  showAnswer: boolean;
}) {
  const aStr = String(a);
  const bStr = String(b);
  const ansStr = String(answer);
  const maxLen = Math.max(aStr.length, bStr.length, ansStr.length);

  const padA = aStr.padStart(maxLen + 1, "\u00A0");
  const padB = (op + bStr).padStart(maxLen + 1, "\u00A0");
  const padAns = ansStr.padStart(maxLen + 1, "\u00A0");

  return (
    <div className="mx-auto w-fit rounded-2xl bg-white/5 px-8 py-5 font-mono text-3xl tracking-widest" dir="ltr">
      <div className="text-white">{padA}</div>
      <div className="text-white">{padB}</div>
      <div className="my-1 border-b-2 border-white/40" />
      {showAnswer ? (
        <div className="font-bold text-yellow-300">{padAns}</div>
      ) : (
        <div className="text-white/30">{"?".padStart(maxLen + 1, "\u00A0")}</div>
      )}
    </div>
  );
}

export default function VerticalMathGame({ onBack }: VerticalMathGameProps) {
  const [phase, setPhase] = useState<"intro" | "playing" | "feedback" | "summary">("intro");
  const [questions, setQuestions] = useState<VerticalMathQuestion[]>(() => generateQuestions(TOTAL));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const question = useMemo(() => questions[current], [questions, current]);
  const stars = useMemo(() => getStars(score, TOTAL), [score]);

  const handleSubmit = useCallback(() => {
    const userAnswer = parseInt(input, 10);
    if (isNaN(userAnswer)) return;

    const correct = userAnswer === question.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
      setFeedbackMsg(getRandomEncouragement());
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setFeedbackMsg(getRandomWrongMessage());
    }
    setPhase("feedback");
  }, [input, question]);

  const handleNext = useCallback(() => {
    if (current + 1 >= TOTAL) {
      setPhase("summary");
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } else {
      setCurrent((c) => c + 1);
      setInput("");
      setIsCorrect(null);
      setFeedbackMsg("");
      setPhase("playing");
    }
  }, [current]);

  const handleRestart = useCallback(() => {
    setQuestions(generateQuestions(TOTAL));
    setCurrent(0);
    setScore(0);
    setInput("");
    setIsCorrect(null);
    setFeedbackMsg("");
    setPhase("intro");
  }, []);

  if (phase === "intro") {
    return (
      <Layout title="חיבור וחיסור במאונך" onBack={onBack}>
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-float mb-6 text-8xl">📝</div>
          <h2 className="mb-4 text-3xl font-bold">חיבור וחיסור</h2>
          <p className="mb-4 text-lg text-white/70">
            תרגילים במאונך ובמאוזן - עם ובלי המרה
          </p>
          <div className="mb-8 flex justify-center gap-6">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="font-mono text-xl" dir="ltr">
                <div>&nbsp;345</div>
                <div>+278</div>
                <div className="border-t border-white/30">????</div>
              </div>
              <p className="mt-1 text-xs text-white/50">במאונך</p>
            </div>
            <div className="flex items-center rounded-2xl bg-white/10 p-4">
              <div className="text-xl" dir="ltr">345 + 278 = ?</div>
              <p className="mr-2 text-xs text-white/50">במאוזן</p>
            </div>
          </div>
          <button
            onClick={() => setPhase("playing")}
            className="animate-pulse-glow rounded-2xl bg-gradient-to-l from-teal-500 to-cyan-600 px-10 py-4 text-xl font-bold shadow-lg transition hover:scale-105"
          >
            !בואו נתחיל 🚀
          </button>
        </div>
      </Layout>
    );
  }

  if (phase === "summary") {
    return (
      <Layout title="חיבור וחיסור במאונך" onBack={onBack}>
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
              className="rounded-xl bg-gradient-to-l from-teal-500 to-cyan-600 px-8 py-3 font-bold transition hover:scale-105"
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
    <Layout title="חיבור וחיסור במאונך" onBack={onBack}>
      <Celebration active={showCelebration} />
      <div className="mx-auto max-w-lg">
        <ProgressBar current={current} total={TOTAL} />

        <div
          className={`rounded-3xl bg-white/10 p-8 text-center backdrop-blur-sm transition-all ${
            isCorrect === true ? "ring-4 ring-green-400" : isCorrect === false ? "animate-shake ring-4 ring-red-400" : ""
          }`}
        >
          {/* Mode badge */}
          <div className="mb-3 flex justify-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              question.mode === "vertical" ? "bg-teal-500/20 text-teal-300" : "bg-cyan-500/20 text-cyan-300"
            }`}>
              {question.mode === "vertical" ? "📐 במאונך" : "↔️ במאוזן"}
            </span>
            {question.mode === "vertical" && question.hasCarry && (
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
                {question.op === "+" ? "⚡ עם המרה" : "⚡ עם פריטה"}
              </span>
            )}
          </div>

          {/* Question display */}
          {question.mode === "vertical" ? (
            <div className="mb-6">
              <VerticalDisplay
                a={question.a}
                b={question.b}
                op={question.op}
                answer={question.answer}
                showAnswer={phase === "feedback"}
              />
            </div>
          ) : (
            <div className="mb-6 text-4xl font-bold tracking-wider" dir="ltr">
              {question.a} {question.op} {question.b} = ?
            </div>
          )}

          {phase === "playing" && (
            <div>
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="mb-4 w-40 rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-center text-2xl text-white outline-none transition focus:border-teal-400"
                placeholder="?"
                autoFocus
                dir="ltr"
              />
              <br />
              <button
                onClick={handleSubmit}
                disabled={!input}
                className="rounded-xl bg-gradient-to-l from-teal-500 to-cyan-600 px-10 py-3 text-lg font-bold transition hover:scale-105 disabled:opacity-40"
              >
                ✓ בדוק
              </button>
            </div>
          )}

          {phase === "feedback" && (
            <div className="animate-pop-in">
              <p
                className={`mb-4 text-2xl font-bold ${
                  isCorrect ? "text-green-400" : "text-red-400"
                }`}
              >
                {feedbackMsg}
              </p>
              {!isCorrect && question.mode === "horizontal" && (
                <p className="mb-2 text-2xl text-white/90">
                  <span className="font-bold text-yellow-300" dir="ltr">{question.a} {question.op} {question.b} = {question.answer}</span>
                </p>
              )}
              <button
                onClick={handleNext}
                className="mt-4 rounded-xl bg-gradient-to-l from-teal-500 to-cyan-600 px-10 py-3 text-lg font-bold transition hover:scale-105"
              >
                {current + 1 >= TOTAL ? "📊 סיכום" : "→ הבא"}
              </button>
            </div>
          )}
        </div>

        {phase === "feedback" && !isCorrect && question.mode === "vertical" && (
          <VerticalSolution
            a={question.a}
            b={question.b}
            op={question.op}
            answer={question.answer}
          />
        )}
      </div>
    </Layout>
  );
}
