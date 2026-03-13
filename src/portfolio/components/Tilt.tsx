import React, { useRef } from 'react';

export const Tilt: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02, 1.02, 1.02)`;
    const shine = el.querySelector('.card-shine') as HTMLElement;
    if (shine) {
      shine.style.opacity = '1';
      shine.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.06) 0%, transparent 60%)`;
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    const shine = el.querySelector('.card-shine') as HTMLElement;
    if (shine) shine.style.opacity = '0';
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="card-shine" />
      {children}
    </div>
  );
};
