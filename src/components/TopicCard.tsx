interface TopicCardProps {
  icon: string;
  name: string;
  description: string;
  gradient: string;
  onClick: () => void;
}

export default function TopicCard({
  icon,
  name,
  description,
  gradient,
  onClick,
}: TopicCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-3xl bg-gradient-to-br ${gradient} p-6 text-right shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95`}
    >
      <div className="mb-3 text-5xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-1 text-xl font-bold text-white">{name}</h3>
      <p className="text-sm text-white/80">{description}</p>
    </button>
  );
}
