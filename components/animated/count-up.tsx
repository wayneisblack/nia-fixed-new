"use client";

import { useEffect, useRef, useState } from "react";

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Animates a number counting up to `value` whenever `value` changes.
 * Triggers once the element is in view, and renders the final value
 * immediately (no state, no effect) for prefers-reduced-motion users. */
export function CountUp({
  value,
  duration = 900,
  formatter = (n: number) => Math.round(n).toLocaleString(),
  className,
}: {
  value: number;
  duration?: number;
  formatter?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fromRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const [reduced] = useState(prefersReducedMotion);
  const [animatedDisplay, setAnimatedDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !started) return;

    const from = fromRef.current;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = easeOutExpo(progress);
      setAnimatedDisplay(from + (value - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, started, reduced]);

  // Reduced-motion users see the final value directly — no state/effect needed.
  const display = reduced ? value : animatedDisplay;

  return (
    <span ref={ref} className={className}>
      {formatter(display)}
    </span>
  );
}
