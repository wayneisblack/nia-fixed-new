"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A horizontal bar that animates its fill from 0 to `percent` once visible.
 * Used for progress bars, funnel bars, and skill-frequency bars. */
export function AnimatedBar({
  percent,
  className = "",
  trackClassName = "h-2.5 w-full overflow-hidden rounded-full bg-zinc-100",
  fillClassName = "h-full rounded-full bg-black",
  delay = 0,
}: {
  percent: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduced] = useState(prefersReducedMotion);
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setAnimatedWidth(percent), delay);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [percent, delay, reduced]);

  const width = reduced ? percent : animatedWidth;

  return (
    <div ref={ref} className={className}>
      <div className={trackClassName}>
        <div
          className={fillClassName}
          style={{ width: `${width}%`, transition: reduced ? "none" : "width 900ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </div>
    </div>
  );
}
