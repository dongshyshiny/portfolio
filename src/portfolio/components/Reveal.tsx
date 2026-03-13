import React from 'react';
import { useInView } from '../hooks/useInView';

export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const { ref, isVisible } = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'revealed' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
