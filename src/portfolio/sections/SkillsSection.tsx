import React from 'react';
import { Reveal } from '../components/Reveal';
import { Tilt } from '../components/Tilt';
import { skills } from '../data/portfolioData';

export const SkillsSection: React.FC = () => (
  <section id="skills" className="section section-dark">
    <div className="container">
      <Reveal>
        <header className="sec-header">
          <span className="sec-num">02</span>
          <h2>Tech Stack</h2>
          <span className="sec-line" />
        </header>
      </Reveal>
      <div className="skills-mosaic">
        {skills.map((g, i) => (
          <Reveal key={g.category} delay={i * 80}>
            <Tilt>
              <div className="skill-tile" style={{ '--accent': g.color } as React.CSSProperties}>
                <div className="skill-tile-head">
                  <span className="skill-emoji">{g.icon}</span>
                  <h3>{g.category}</h3>
                </div>
                <div className="skill-chips">
                  {g.items.map((item) => <span key={item} className="skill-chip">{item}</span>)}
                </div>
                <div className="skill-tile-accent" />
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
