import React from 'react';
import { Reveal } from '../components/Reveal';
import { Tilt } from '../components/Tilt';
import { experiences } from '../data/portfolioData';

export const ExperienceSection: React.FC = () => (
  <section id="experience" className="section">
    <div className="container">
      <Reveal>
        <header className="sec-header">
          <span className="sec-num">03</span>
          <h2>Career Path</h2>
          <span className="sec-line" />
        </header>
      </Reveal>
      <div className="exp-timeline">
        {experiences.map((exp, idx) => (
          <Reveal key={idx} delay={idx * 150}>
            <div className="exp-row">
              <div className="exp-marker">
                <div className="exp-ring"><div className="exp-dot" /></div>
                {idx < experiences.length - 1 && <div className="exp-line" />}
              </div>
              <Tilt className="exp-card-wrap">
                <div className="exp-card">
                  <div className="exp-top">
                    <span className="exp-period">{exp.period}</span>
                    <span className="exp-company">{exp.company}</span>
                  </div>
                  <h3 className="exp-role">{exp.role}</h3>
                  <p className="exp-desc">{exp.description}</p>
                  <div className="exp-pills">{exp.techs.map(t => <span key={t} className="pill">{t}</span>)}</div>
                </div>
              </Tilt>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
