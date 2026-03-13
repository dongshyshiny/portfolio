import React from 'react';
import { Reveal } from '../components/Reveal';
import { Tilt } from '../components/Tilt';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';

export const AboutSection: React.FC = () => {
  const { ref: statsObsRef, isVisible: statsVisible } = useInView(0.3);

  const stat1 = useCountUp(11, 1500, statsVisible);
  const stat2 = useCountUp(20, 1800, statsVisible);
  const stat3 = useCountUp(10, 1600, statsVisible);
  const stat4 = useCountUp(99, 2000, statsVisible);

  const stats = [
    { value: stat1, suffix: '+', label: 'Years Experience', icon: '📅' },
    { value: stat2, suffix: '+', label: 'Projects Delivered', icon: '🚀' },
    { value: stat3, suffix: '+', label: 'Team Members Led', icon: '👥' },
    { value: stat4, suffix: '%', label: 'Client Satisfaction', icon: '⭐' },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal>
          <header className="sec-header">
            <span className="sec-num">01</span>
            <h2>About Me</h2>
            <span className="sec-line" />
          </header>
        </Reveal>
        <div className="about-layout">
          <Reveal delay={100} className="about-bio">
            <p>I'm a passionate <strong>Lead Frontend Developer</strong> with over <strong>10 years of experience</strong> building web and mobile applications across diverse industries — from e-commerce and fintech to SaaS platforms.</p>
            <p>My career journey spans from crafting <strong>WordPress themes</strong> on ThemeForest, to building <strong>print-on-demand e-commerce</strong> platforms, developing <strong>banking backoffice systems</strong>, and now leading frontend & mobile development for a <strong>contact center/CRM platform</strong>.</p>
            <p>My expertise covers <strong>React</strong>, <strong>React Native</strong>, <strong>TypeScript</strong>, <strong>Node.js</strong>, and <strong>Java</strong>, with strong skills in CI/CD, state management, and team leadership.</p>
            <div className="about-tags">
              {['Leadership', 'Architecture', 'Code Review', 'Mentoring', 'Agile'].map(t => (
                <span key={t} className="about-tag">{t}</span>
              ))}
            </div>
          </Reveal>
          <div className="about-numbers" ref={statsObsRef}>
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100 + 200}>
                <Tilt>
                  <div className="num-card">
                    <span className="num-icon">{s.icon}</span>
                    <span className="num-value">{s.value}{s.suffix}</span>
                    <span className="num-label">{s.label}</span>
                    <div className="num-shimmer" />
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
