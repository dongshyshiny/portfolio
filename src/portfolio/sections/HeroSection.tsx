import React, { useMemo } from 'react';
import { Reveal } from '../components/Reveal';
import { Tilt } from '../components/Tilt';
import { TypeWriter } from '../components/TypeWriter';
import { typewriterWords, socials } from '../data/portfolioData';

interface Props {
  scrollTo: (id: string) => void;
}

export const HeroSection: React.FC<Props> = ({ scrollTo }) => {
  const words = useMemo(() => typewriterWords, []);

  return (
    <section id="hero" className="hero">
      <div className="hero-grid-bg" />
      <div className="hero-radial" />
      <div className="hero-inner">
        <div className="hero-left">
          <Reveal>
            <div className="hero-chip">
              <span className="chip-pulse" />
              <span>Open to opportunities</span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="hero-heading">
              Hi, I'm{' '}
              <span className="hero-name-glow">Dong Nguyen</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <h2 className="hero-typewriter">
              <TypeWriter words={words} className="tw-text" />
            </h2>
          </Reveal>
          <Reveal delay={360}>
            <p className="hero-desc">
              I build <span className="em-gradient">pixel-perfect</span>, accessible,
              high-performance web & mobile products that users love.
            </p>
          </Reveal>
          <Reveal delay={480}>
            <div className="hero-btns">
              <a onClick={() => scrollTo('projects')} className="btn-glow">
                <span className="btn-glow-bg" />
                <span className="btn-glow-text">Explore Work</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
              <a onClick={() => scrollTo('contact')} className="btn-outline-glow">
                Get In Touch
              </a>
            </div>
          </Reveal>
          <Reveal delay={600}>
            <div className="hero-socials">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="social-icon" title={s.label}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="hero-right">
          <Reveal delay={300}>
            <Tilt className="terminal-tilt">
              <div className="terminal">
                <div className="terminal-chrome">
                  <div className="terminal-dots"><i /><i /><i /></div>
                  <span className="terminal-file">portfolio.ts</span>
                  <div className="terminal-actions"><span /><span /></div>
                </div>
                <pre className="terminal-code">
<span className="syn-kw">const</span> <span className="syn-fn">developer</span> <span className="syn-op">=</span> {'{'}{'\n'}
{'  '}<span className="syn-key">name</span><span className="syn-op">:</span> <span className="syn-str">"Dong Nguyen"</span>,{'\n'}
{'  '}<span className="syn-key">role</span><span className="syn-op">:</span> <span className="syn-str">"Dev Lead"</span>,{'\n'}
{'  '}<span className="syn-key">stack</span><span className="syn-op">:</span> [{'\n'}
{'    '}<span className="syn-str">"React"</span>,{'\n'}
{'    '}<span className="syn-str">"React Native"</span>,{'\n'}
{'    '}<span className="syn-str">"Node.js"</span>,{'\n'}
{'    '}<span className="syn-str">"Java"</span>{'\n'}
{'  '}],{'\n'}
{'  '}<span className="syn-key">passion</span><span className="syn-op">:</span> <span className="syn-str">"Crafting digital{'\n'}    experiences"</span>{'\n'}
{'}'};
                </pre>
                <div className="terminal-glow" />
              </div>
            </Tilt>
          </Reveal>
        </div>
      </div>
      <div className="scroll-cue" onClick={() => scrollTo('about')}>
        <div className="scroll-track"><div className="scroll-thumb" /></div>
        <span>Scroll</span>
      </div>
    </section>
  );
};
