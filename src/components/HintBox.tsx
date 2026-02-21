interface HintBoxProps {
  lines: string[];
}

export default function HintBox({ lines }: HintBoxProps) {
  return (
    <div className="animate-pop-in mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-right backdrop-blur-sm">
      <div className="mb-2 text-lg font-bold text-amber-300">💡 הסבר:</div>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <p key={i} className="text-base text-amber-100">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
