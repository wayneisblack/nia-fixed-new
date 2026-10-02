"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in milliseconds before the reveal animation starts. */
  delay?: number;
  className?: string;
  /** Element tag to render as. Defaults to "div". */
  as?: "div" | "section" | "article" | "figure" | "li";
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Lazy initializers read matchMedia once, synchronously, before first
  // paint — no setState-in-effect needed for the reduced-motion case.
  const [reducedMotion] = useState(prefersReducedMotion);
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const node = ref.current;
    if (!node) return;

    // Re-toggles on every crossing (not just the first), so the effect fires
    // whether the user scrolls down, scrolls back up, jumps via keyboard,
    // drags the scrollbar, or lands here from an anchor link.
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px -15% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={reducedMotion ? undefined : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
