import type { ReactNode } from "react";

export function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`step-fade ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
