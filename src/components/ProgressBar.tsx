interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = ((current) / total) * 100;

  return (
    <div className="mb-6">
      <div className="mb-2 text-center text-sm font-medium text-white/70">
        שאלה {current + 1} מתוך {total}
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-l from-purple-400 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
