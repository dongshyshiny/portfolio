import React, { useState, useEffect } from 'react';

export const TypeWriter: React.FC<{ words: string[]; className?: string }> = ({ words, className }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.substring(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDeleting(true), 2000);
      } else {
        setText(current.substring(0, text.length - 1));
        if (text.length === 0) {
          setDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words]);

  return (
    <span className={className}>
      {text}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};
