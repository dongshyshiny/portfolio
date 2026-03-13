import { useState, useEffect, useRef } from 'react';

export const useInView = (threshold = 0.12) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(e.target);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
};
