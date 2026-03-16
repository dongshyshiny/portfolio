import React, { useState, useEffect, useCallback } from 'react';
import './Portfolio.css';

import { Particles } from './components/Particles';
import { ScrollProgress } from './components/ScrollProgress';
import { LoadingScreen } from './components/LoadingScreen';
import { navItems } from './data/portfolioData';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { SkillsSection } from './sections/SkillsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './sections/Footer';

const Portfolio: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const ids = ['contact', 'projects', 'experience', 'skills', 'about', 'hero'];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 300) { setActiveSection(id); break; }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouse = useCallback((e: React.MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY }), []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  return (
    <>
      <LoadingScreen />
      <div className="portfolio" onMouseMove={handleMouse}>
        {/* Background layers */}
        <Particles />
        <div className="noise-overlay" />
        <div className="aurora-bg">
          <div className="aurora aurora-1" />
          <div className="aurora aurora-2" />
          <div className="aurora aurora-3" />
        </div>
        <div className="gradient-orbs">
          <div className="g-orb g-orb-1" />
          <div className="g-orb g-orb-2" />
          <div className="g-orb g-orb-3" />
        </div>
        <div className="cursor-spotlight" style={{ left: mousePos.x, top: mousePos.y }} />

        {/* Scroll Progress */}
        <ScrollProgress />

        {/* Nav */}
        <nav className={`nav ${scrolled ? 'nav-blur' : ''}`}>
          <div className="nav-inner">
            <a className="nav-logo" onClick={() => scrollTo('hero')}>
              <span className="logo-gradient">{'<DN />'}</span>
            </a>
            <button className={`hamburger ${menuOpen ? 'is-active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
              <span /><span /><span />
            </button>
            <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
              {navItems.map((item) => (
                <li key={item}>
                  <a onClick={() => scrollTo(item)} className={activeSection === item ? 'active' : ''}>
                    <span className="nav-text">{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                  </a>
                </li>
              ))}
              <li><a onClick={() => scrollTo('contact')} className="nav-hire">Let's Talk</a></li>
            </ul>
          </div>
        </nav>

        {/* Sections */}
        <HeroSection scrollTo={scrollTo} />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
        <Footer scrollTo={scrollTo} />
      </div>
    </>
  );
};

export default Portfolio;
