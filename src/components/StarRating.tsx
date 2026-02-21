interface StarRatingProps {
  stars: number;
}

export default function StarRating({ stars }: StarRatingProps) {
  return (
    <div className="flex justify-center gap-3">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`inline-block text-5xl ${
            i <= stars ? "animate-star-pop" : "opacity-20"
          }`}
          style={{ animationDelay: `${(i - 1) * 0.2}s` }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
