"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface RatingBarProps {
  value?: number;
  max?: number
}

export default function RatingBar({
  value = 4.2,
  max = 5,
}: RatingBarProps) {
  const [progress, setProgress] = useState(0);

  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  useEffect(() => {
    const t = setTimeout(() => setProgress(percent), 120);
    return () => clearTimeout(t);
  }, [percent]);

  const tone =
    value >= 4.3 ? "good" : value >= 3.6 ? "mid" : "low";

  const gradient =
    tone === "good"
      ? "from-emerald-400 to-emerald-500"
      : tone === "mid"
        ? "from-amber-300 to-amber-400"
        : "from-rose-400 to-rose-500";

  return (
    <div className="mt-2 space-y-1">
      {/* Top row */}
      <div className="flex items-center gap-1 text-[11px] text-white/90">
        <Star size={16} className="fill-yellow-400 stroke-yellow-400" />
        <span className="font-medium pt-1">{value.toFixed(1)}</span>
        <span className="opacity-60 pt-1">/ {max}</span>
      </div>

      {/* Bar */}
      <div className="relative h-1 w-full rounded-full bg-white/20 overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full
          bg-linear-to-r ${gradient}
          transition-[width] duration-700 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
