import { useEffect, useState } from "react";

// Counts from 0 up to `value` once (ease-out). `format` turns the running number into text.
export default function CountUp({ value, format = (v) => String(Math.round(v)), duration = 900 }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf;

    if (reduce) {
      raf = requestAnimationFrame(() => setShown(value)); // no animation: show the final value
      return () => cancelAnimationFrame(raf);
    }

    let start;
    const tick = (now) => {
      if (start === undefined) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setShown(value * (1 - Math.pow(1 - progress, 3))); // ease-out cubic
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{format(shown)}</>;
}
