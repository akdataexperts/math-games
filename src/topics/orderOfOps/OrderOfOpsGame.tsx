import { useState, useMemo, useCallback } from "react";
import Layout from "../../components/Layout";
import ProgressBar from "../../components/ProgressBar";
import StarRating from "../../components/StarRating";
import Celebration from "../../components/Celebration";
import HintBox from "../../components/HintBox";
import { getStars, getRandomEncouragement, getRandomWrongMessage } from "../../types";
import { generateQuestions, type OrderOfOpsQuestion } from "./generateOrderOfOps";

const TOTAL = 10;

interface OrderOfOpsGameProps {
  onBack: () => void;
}

export default function OrderOfOpsGame({ onBack }: OrderOfOpsGameProps) {
  const [phase, setPhase] = useState<"intro" | "playing" | "feedback" | "summary">("intro");
  const [questions, setQuestions] = useState<OrderOfOpsQuestion[]>(() => generateQuestions(TOTAL));
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
      <Layout title="סדר פעולות חשבון" onBack={onBack}>
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-float mb-6 text-8xl">📋</div>
          <h2 className="mb-4 text-3xl font-bold">סדר פעולות חשבון</h2>
          <p className="mb-4 text-lg text-white/70">
            חשוב לפתור בסדר הנכון!
          </p>
          <div className="mb-8 space-y-2 rounded-2xl bg-white/10 p-5 text-right text-base text-white/80">
            <p className="font-bold text-amber-300">הכללים:</p>
            <p>1. קודם כל פותרים סוגריים ( )</p>
            <p>2. אחר כך כפל × וחילוק ÷</p>
            <p>3. לבסוף חיבור + וחיסור -</p>
          </div>
          <button
            onClick={() => setPhase("playing")}
            className="animate-pulse-glow rounded-2xl bg-gradient-to-l from-orange-500 to-red-600 px-10 py-4 text-xl font-bold shadow-lg transition hover:scale-105"
          >
            !בואו נתחיל 🚀
          </button>
        </div>
      </Layout>
    );
  }

  if (phase === "summary") {
    return (
      <Layout title="סדר פעולות חשבון" onBack={onBack}>
        <Celebration active={showCelebration} />
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-pop-in mb-6 rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold">!סיימת</h2>
            <StarRating stars={stars} />
            <p className="mt-4 text-2xl">
              {score} מתוך {TOTAL} תשובות נכונות
            </p>
            <p className="mt-2 text-lg text-white/60">
              {stars === 3 ? "!מושלם! אתה יודע את סדר הפעולות" : stars === 2 ? "!כל הכבוד" : "!תמשיך לתרגל"}
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="rounded-xl bg-gradient-to-l from-orange-500 to-red-600 px-8 py-3 font-bold transition hover:scale-105"
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
    <Layout title="סדר פעולות חשבון" onBack={onBack}>
      <Celebration active={showCelebration} />
      <div className="mx-auto max-w-lg">
        <ProgressBar current={current} total={TOTAL} />

        <div
          className={`rounded-3xl bg-white/10 p-8 text-center backdrop-blur-sm transition-all ${
            isCorrect === true ? "ring-4 ring-green-400" : isCorrect === false ? "animate-shake ring-4 ring-red-400" : ""
          }`}
        >
          <p className="mb-2 text-sm text-white/50">חשבו את התוצאה:</p>
          <div className="mb-6 text-4xl font-bold tracking-wider" dir="ltr">
            {question.expression} = ?
          </div>

          {phase === "playing" && (
            <div>
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="mb-4 w-40 rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-center text-2xl text-white outline-none transition focus:border-orange-400"
                placeholder="?"
                autoFocus
                dir="ltr"
              />
              <br />
              <button
                onClick={handleSubmit}
                disabled={!input}
                className="rounded-xl bg-gradient-to-l from-orange-500 to-red-600 px-10 py-3 text-lg font-bold transition hover:scale-105 disabled:opacity-40"
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
              {!isCorrect && (
                <p className="mb-2 text-xl text-white/90">
                  התשובה הנכונה: <span className="font-bold text-yellow-300">{question.answer}</span>
                </p>
              )}
              <button
                onClick={handleNext}
                className="mt-4 rounded-xl bg-gradient-to-l from-orange-500 to-red-600 px-10 py-3 text-lg font-bold transition hover:scale-105"
              >
                {current + 1 >= TOTAL ? "📊 סיכום" : "→ הבא"}
              </button>
            </div>
          )}
        </div>

        {phase === "feedback" && !isCorrect && (
          <HintBox lines={[
            "הסדר הנכון: סוגריים ← כפל/חילוק ← חיבור/חיסור",
            ...question.steps,
          ]} />
        )}
      </div>
    </Layout>
  );
}
