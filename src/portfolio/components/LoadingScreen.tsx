import React, { useState, useEffect } from 'react';

export const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1800);
    const remove = setTimeout(() => setLoading(false), 2400);
    return () => { clearTimeout(timer); clearTimeout(remove); };
  }, []);

  if (!loading) return null;

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <span className="loading-bracket">{'<'}</span>
          <span className="loading-name">DN</span>
          <span className="loading-bracket">{' />'}</span>
        </div>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  );
};
