import { useEffect, useRef, useState } from "react";

export const AnimatedCounter = ({ value, duration = 1500 }: { value: number; duration?: number }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(current);
      ref.current = current;
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{display.toLocaleString()}</span>;
};
