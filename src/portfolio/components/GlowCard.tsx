import React, { useRef, useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const GlowCard: React.FC<Props> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--glow-x', `${x}px`);
    el.style.setProperty('--glow-y', `${y}px`);
  }, []);

  return (
    <div ref={ref} className={`glow-card ${className}`} onMouseMove={handleMove}>
      <div className="glow-card-border" />
      <div className="glow-card-content">
        {children}
      </div>
    </div>
  );
};
