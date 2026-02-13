import { useEffect, useRef, useState } from "react";

export default function useAnimatedNumber(value: number, duration = 400) {
    const [display, setDisplay] = useState(value);
    const prevRef = useRef(value);

    useEffect(() => {
        const start = prevRef.current;
        const end = value;

        if (start === end) return;

        let startTime: number | null = null;

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);

            const current = Math.floor(start + (end - start) * progress);
            setDisplay(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                prevRef.current = end;
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return display;
}
