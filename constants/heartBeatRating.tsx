interface HeartbeatProps {
  rating: number; // 1–5
}

export default function Heartbeat({ rating }: HeartbeatProps) {
  const color =
    rating >= 4 ? "#16a34a" : rating >= 3 ? "#facc15" : "#dc2626";

  // Dynamically scale width (min 40px, max 120px)
  const width = 40 + (rating - 1) * 20; // 1→40, 5→120

  return (
    <div className="flex items-center gap-1">
      <svg
        width={width}
        height="30"
        viewBox="0 0 120 30"
        fill="none"
        stroke={color}
        strokeWidth="3"
        className="animate-[pulse_1s_ease-in-out_infinite]"
      >
        <polyline
          points="0,15 10,15 18,22 25,8 32,15 45,15 52,20 60,15 70,15 80,10 92,15"
          fill="none"
        />

        <path
          d="M100 15 
             C100 10,110 10,110 15 
             C110 20,100 22,100 26 
             C100 22,90 20,90 15 
             C90 10,100 10,100 15Z"
          fill={color}
        />
      </svg>

      <span className="text-sm font-semibold" style={{ color }}>
        {rating}/5
      </span>
    </div>
  );
}
