import React, { useEffect, useState } from "react";

interface AnimatedRatingProgressBarProps {
  average?: number;
  max?: number;
  threshold?: number;
  height?: string;
  showLabel?: boolean;
}

export default function AnimatedRatingProgressBar({
  average = 4.2,
  max = 5,
  threshold = 3.5,
  height = "h-1.5",
  showLabel = true,
}: AnimatedRatingProgressBarProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const percent = Math.max(0, Math.min(100, (average / max) * 100));

  useEffect(() => {
    const t = setTimeout(() => setAnimatedPercent(percent), 100);
    return () => clearTimeout(t);
  }, [percent]);

  const band =
    average >= threshold + 0.5
      ? "good"
      : average >= threshold
      ? "borderline"
      : "bad";

  const barColorClass =
    band === "good"
      ? "from-emerald-400 via-emerald-500 to-emerald-600"
      : band === "borderline"
      ? "from-yellow-300 via-yellow-400 to-yellow-500"
      : "from-rose-400 via-rose-500 to-rose-600";

  return (
    <div className="w-full group relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span
            className={`text-xs font-bold tracking-wide ${
              band === "good"
                ? "text-emerald-600"
                : band === "borderline"
                ? "text-yellow-600"
                : "text-rose-600"
            }`}
          >
            {band === "good"
              ? "Excellent"
              : band === "borderline"
              ? "Average"
              : "Low rated"}
          </span>
        )}

        <span className="text-xs font-bold text-white">
          {average.toFixed(1)} / 5
        </span>
      </div>

      {/* Bar */}
      <div
        className={`relative bg-gray-200/70 rounded-full overflow-hidden ${height}
          transition-transform duration-300 group-hover:scale-[1.02]`}
      >
        {/* Fill */}
        <div
          className={`absolute left-0 top-0 h-full bg-linear-to-r ${barColorClass}
            transition-all duration-1000 ease-out`}
          style={{ width: `${animatedPercent}%` }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-linear-to-r from-white/10 via-white/30 to-white/10" />
        </div>
      </div>
    </div>
  );
}
