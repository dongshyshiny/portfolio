import React, { useRef, useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
}

export const MagneticButton: React.FC<Props> = ({ children, className = '', onClick, href, strength = 0.3 }) => {
  const ref = useRef<HTMLElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }, [strength]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0, 0)';
  }, []);

  const Tag = href ? 'a' : 'button';
  const props: any = {
    ref,
    className: `magnetic ${className}`,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick,
    ...(href ? { href } : {}),
  };

  return <Tag {...props}>{children}</Tag>;
};
