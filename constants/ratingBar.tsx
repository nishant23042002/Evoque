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

  /* =======================
     STAR CALCULATION
  ======================= */
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="mt-2 space-y-2">
      {/* STAR ROW */}
      <div className="flex items-center gap-1">
        {/* FULL STARS */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={14}
            className="fill-primary stroke-primary"
          />
        ))}

        {/* HALF STAR */}
        {hasHalfStar && (
          <div className="relative w-[14px] h-[14px]">
            <Star
              size={14}
              className="absolute inset-0 fill-(--linen-300) stroke-primary"
            />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star
                size={14}
                className="fill-primary stroke-primary"
              />
            </div>
          </div>
        )}

        {/* EMPTY STARS */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={14}
            className="stroke-(--linen-300)"
          />
        ))}

        {/* VALUE */}
        <span className="ml-1 text-[12px] font-semibold text-(--text-inverse)">
          {value.toFixed(1)}
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className="relative h-1.5 w-full rounded-full bg-(--linen-200) overflow-hidden">
        <div
          className="
            absolute left-0 top-0 h-full
            rounded-full
            bg-primary
            transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          "
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* LABEL */}
      <p className="text-[8px] tracking-wide font-medium uppercase text-secondary">
        Customer Rating
      </p>
    </div>
  );
}
