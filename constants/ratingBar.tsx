"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface RatingBarProps {
  value?: number;
  max?: number;
}

export default function RatingBar({
  value = 4.2,
  max = 5,
}: RatingBarProps) {
  const [progress, setProgress] = useState(0);

  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  useEffect(() => {
    const t = setTimeout(() => setProgress(percent), 160);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div className="mt-2 space-y-2">
      {/* TOP ROW */}
      <div className="flex items-center gap-2">
        <Star
          size={14}
          className="fill-[var(--linen-400)] stroke-[var(--primary)]"
        />

        <span className="text-[12px] font-semibold text-[var(--text-inverse)]">
          {value.toFixed(1)}
        </span>

        <span className="text-[11px] text-[var(--linen-200)]">
          / {max}
        </span>
      </div>

      {/* LINEN BAR */}
      <div className="relative h-[6px] w-full rounded-full bg-[var(--linen-200)] overflow-hidden">
        <div
          className="
            absolute left-0 top-0 h-full
            rounded-full
            bg-[var(--primary)]
            transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          "
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* MICRO LABEL */}
      <p className="text-[8px] tracking-wide font-medium uppercase text-[var(--secondary)]">
        Customer Rating
      </p>
    </div>
  );
}
