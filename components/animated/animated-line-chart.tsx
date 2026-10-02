"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AnimatedLineChart({
  values,
  labels,
  height = 160,
  formatValue = (v: number) => String(Math.round(v)),
}: {
  values: number[];
  labels: string[];
  height?: number;
  formatValue?: (v: number) => string;
}) {
  const width = 480;
  const padding = 24;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return [x, y] as const;
  });

  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaPath = `${path} L ${points[points.length - 1][0]} ${height - padding} L ${points[0][0]} ${height - padding} Z`;

  const pathRef = useRef<SVGPathElement>(null);
  const [reduced] = useState(prefersReducedMotion);
  const [inView, setInView] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const node = wrapRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => setInView(true));
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const drawn = reduced || inView;

  // Path length used to drive the stroke-dasharray draw-in animation.
  const [pathLength, setPathLength] = useState(0);
  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, [path]);

  return (
    <div ref={wrapRef} className="relative mt-4 w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <path
          d={areaPath}
          fill="rgba(10,10,10,0.06)"
          style={{ opacity: drawn ? 1 : 0, transition: reduced ? "none" : "opacity 600ms ease 500ms" }}
        />
        <path
          ref={pathRef}
          d={path}
          fill="none"
          stroke="#0a0a0a"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: drawn ? 0 : pathLength,
            transition: reduced ? "none" : "stroke-dashoffset 1100ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        {points.map(([x, y], i) => (
          <g key={i}>
            {/* Wider invisible hit target for easier hovering */}
            <rect
              x={x - (width / values.length) / 2}
              y={0}
              width={width / values.length}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
            />
            <circle
              cx={x}
              cy={y}
              r={hoverIndex === i ? 5.5 : 3.5}
              fill="#0a0a0a"
              style={{
                opacity: drawn ? 1 : 0,
                transition: reduced ? "none" : `opacity 300ms ease ${300 + i * 60}ms, r 180ms ease`,
              }}
            />
            {hoverIndex === i ? <circle cx={x} cy={y} r={9} fill="none" stroke="#0a0a0a" strokeWidth={1} opacity={0.25} /> : null}
          </g>
        ))}
        {labels.map((label, i) => (
          <text key={label} x={points[i][0]} y={height - 4} fontSize="9" textAnchor="middle" fill="#a1a1aa">
            {label}
          </text>
        ))}
      </svg>

      {hoverIndex !== null ? (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-zinc-950 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity"
          style={{
            left: `${(points[hoverIndex][0] / width) * 100}%`,
            top: `${(points[hoverIndex][1] / height) * 100}%`,
            marginTop: "-8px",
          }}
        >
          {formatValue(values[hoverIndex])}
        </div>
      ) : null}
    </div>
  );
}
