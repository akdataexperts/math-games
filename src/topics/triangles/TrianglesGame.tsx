import { useState, useMemo, useCallback } from "react";
import Layout from "../../components/Layout";
import ProgressBar from "../../components/ProgressBar";
import StarRating from "../../components/StarRating";
import Celebration from "../../components/Celebration";
import HintBox from "../../components/HintBox";
import TriangleSVG from "./TriangleSVG";
import {
  getTriangleQuestions,
  ANGLE_LABELS,
  SIDE_LABELS,
  ANGLE_HINTS,
  SIDE_HINTS,
  type TriangleQuestion,
  type ClassifyMode,
  type AngleType,
  type SideType,
} from "./triangleData";
import { getStars, getRandomEncouragement, getRandomWrongMessage } from "../../types";

const TOTAL = 10;

interface TrianglesGameProps {
  onBack: () => void;
}

export default function TrianglesGame({ onBack }: TrianglesGameProps) {
  const [phase, setPhase] = useState<"intro" | "playing" | "feedback" | "summary">("intro");
  const [questions, setQuestions] = useState<TriangleQuestion[]>(() => getTriangleQuestions(TOTAL));
  const [modes, setModes] = useState<ClassifyMode[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const q = useMemo(() => questions[current], [questions, current]);
  const mode = useMemo(() => modes[current], [modes, current]);
  const stars = useMemo(() => getStars(score, TOTAL), [score]);

  const correctAnswer = useMemo(() => {
    if (!mode || !q) return "";
    return mode === "angles" ? q.angleType : q.sideType;
  }, [mode, q]);

  const options = useMemo(() => {
    if (!mode) return [];
    if (mode === "angles") {
      return Object.entries(ANGLE_LABELS).map(([key, label]) => ({ key, label }));
    }
    return Object.entries(SIDE_LABELS).map(([key, label]) => ({ key, label }));
  }, [mode]);

  const hintLines = useMemo(() => {
    if (!mode || !q) return [];
    if (mode === "angles") {
      return ANGLE_HINTS[q.angleType];
    }
    return SIDE_HINTS[q.sideType];
  }, [mode, q]);

  const startGame = useCallback(() => {
    const qs = getTriangleQuestions(TOTAL);
    const ms = qs.map(() => (Math.random() < 0.5 ? "angles" : "sides") as ClassifyMode);
    setQuestions(qs);
    setModes(ms);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setIsCorrect(null);
    setFeedbackMsg("");
    setPhase("playing");
  }, []);

  const handleSelect = useCallback(
    (key: string) => {
      if (phase !== "playing") return;
      setSelected(key);

      const correct = key === correctAnswer;
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
    },
    [phase, correctAnswer]
  );

  const handleNext = useCallback(() => {
    if (current + 1 >= TOTAL) {
      setPhase("summary");
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setIsCorrect(null);
      setFeedbackMsg("");
      setPhase("playing");
    }
  }, [current]);

  if (phase === "intro") {
    return (
      <Layout title="מיון משולשים" onBack={onBack}>
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-float mb-6 text-8xl">📐</div>
          <h2 className="mb-4 text-3xl font-bold">מיון משולשים</h2>
          <p className="mb-4 text-lg text-white/70">
            סיווג משולשים לפי זוויות ולפי צלעות
          </p>
          <div className="mb-8 space-y-3 rounded-2xl bg-white/10 p-5 text-right text-base text-white/80">
            <p><strong>לפי זוויות:</strong> חד-זווית, ישר-זווית, קהה-זווית</p>
            <p><strong>לפי צלעות:</strong> שווה-צלעות, שווה-שוקיים, שונה-צלעות</p>
          </div>
          <button
            onClick={startGame}
            className="animate-pulse-glow rounded-2xl bg-gradient-to-l from-green-500 to-emerald-600 px-10 py-4 text-xl font-bold shadow-lg transition hover:scale-105"
          >
            !בואו נתחיל 🚀
          </button>
        </div>
      </Layout>
    );
  }

  if (phase === "summary") {
    return (
      <Layout title="מיון משולשים" onBack={onBack}>
        <Celebration active={showCelebration} />
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-pop-in mb-6 rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold">!סיימת</h2>
            <StarRating stars={stars} />
            <p className="mt-4 text-2xl">
              {score} מתוך {TOTAL} תשובות נכונות
            </p>
            <p className="mt-2 text-lg text-white/60">
              {stars === 3 ? "!מומחה למשולשים" : stars === 2 ? "!כל הכבוד" : "!תמשיך לתרגל"}
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={startGame}
              className="rounded-xl bg-gradient-to-l from-green-500 to-emerald-600 px-8 py-3 font-bold transition hover:scale-105"
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
    <Layout title="מיון משולשים" onBack={onBack}>
      <Celebration active={showCelebration} />
      <div className="mx-auto max-w-lg">
        <ProgressBar current={current} total={TOTAL} />

        <div
          className={`rounded-3xl bg-white/10 p-6 backdrop-blur-sm transition-all ${
            isCorrect === true ? "ring-4 ring-green-400" : isCorrect === false ? "animate-shake ring-4 ring-red-400" : ""
          }`}
        >
          <p className="mb-4 text-center text-lg font-medium text-white/80">
            {mode === "angles" ? "סווגו את המשולש לפי הזוויות:" : "סווגו את המשולש לפי הצלעות:"}
          </p>

          <TriangleSVG
            triangle={q}
            showAngles={mode === "angles"}
            highlightResult={isCorrect !== null}
          />

          <div className="mt-5 grid gap-3">
            {options.map(({ key, label }) => {
              let btnClass = "rounded-xl border-2 px-6 py-3 text-lg font-bold transition";

              if (phase === "feedback") {
                if (key === correctAnswer) {
                  btnClass += " border-green-400 bg-green-500/20 text-green-300";
                } else if (key === selected && !isCorrect) {
                  btnClass += " border-red-400 bg-red-500/20 text-red-300";
                } else {
                  btnClass += " border-white/10 bg-white/5 text-white/40";
                }
              } else {
                btnClass +=
                  " border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 active:scale-95";
              }

              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  disabled={phase === "feedback"}
                  className={btnClass}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {phase === "feedback" && (
            <div className="animate-pop-in mt-5 text-center">
              <p
                className={`mb-3 text-2xl font-bold ${
                  isCorrect ? "text-green-400" : "text-red-400"
                }`}
              >
                {feedbackMsg}
              </p>
              {!isCorrect && (
                <p className="mb-2 text-lg text-white/90">
                  התשובה הנכונה:{" "}
                  <span className="font-bold text-yellow-300">
                    {mode === "angles"
                      ? ANGLE_LABELS[correctAnswer as AngleType]
                      : SIDE_LABELS[correctAnswer as SideType]}
                  </span>
                </p>
              )}
              <button
                onClick={handleNext}
                className="mt-3 rounded-xl bg-gradient-to-l from-green-500 to-emerald-600 px-10 py-3 text-lg font-bold transition hover:scale-105"
              >
                {current + 1 >= TOTAL ? "📊 סיכום" : "→ הבא"}
              </button>
            </div>
          )}
        </div>

        {phase === "feedback" && !isCorrect && <HintBox lines={hintLines} />}
      </div>
    </Layout>
  );
}
