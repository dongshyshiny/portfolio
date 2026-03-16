import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './Portfolio.css';
import {
  navItems, skills, experiences,
  projects, projectFilterOptions, socials, type Project,
} from './data/portfolioData';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { I18nProvider, useI18n, LOCALE_LABELS } from './i18n';

/* ====== Hooks ====== */
const useInView = (threshold = 0.12) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.unobserve(e.target); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
};

const useCountUp = (end: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
};

const useMouseParallax = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = useCallback((e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setPos({ x, y });
  }, []);
  return { pos, handleMove };
};

/* ====== Components ====== */
const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number; direction?: 'up' | 'left' | 'right' | 'scale' }> = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className={`reveal reveal-${direction} ${isVisible ? 'revealed' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const Tilt: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.03, 1.03, 1.03)`;
    const shine = el.querySelector('.card-shine') as HTMLElement;
    if (shine) { shine.style.opacity = '1'; shine.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.08) 0%, transparent 60%)`; }
  };
  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    const shine = el.querySelector('.card-shine') as HTMLElement;
    if (shine) shine.style.opacity = '0';
  };
  return (
    <div ref={ref} className={`tilt-card ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div className="card-shine" />
      {children}
    </div>
  );
};

const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let mouse = { x: -1000, y: -1000 };
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const onMouse = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouse);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number }[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.5 ? 260 : 190,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 150) { p.vx += (mdx / mDist) * 0.15; p.vy += (mdy / mDist) * 0.15; }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `hsla(${p.hue}, 70%, 60%, ${0.08 * (1 - dist / 130)})`; ctx.lineWidth = 0.6; ctx.stroke(); }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouse); };
  }, []);
  return <canvas ref={canvasRef} className="particles-canvas" />;
};

const TypeWriter: React.FC<{ words: string[]; className?: string }> = ({ words, className }) => {
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
        if (text.length === 0) { setDeleting(false); setIndex((i) => (i + 1) % words.length); }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words]);
  return <span className={className}>{text}<span className="typewriter-cursor">|</span></span>;
};

const TechMarquee: React.FC = () => {
  const techs = ['React', 'React Native', 'TypeScript', 'Node.js', 'Java', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'GraphQL', 'Redis', 'Next.js', 'Firebase', 'GitHub Actions', 'Nginx'];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...techs, ...techs].map((t, i) => <span key={i} className="marquee-item">{t}</span>)}
      </div>
    </div>
  );
};

/* Theme toggle icons */
const SunIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const MoonIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const SystemIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;

/* App Store icons */
const AppleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>;
const PlayStoreIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.834 1.64a1 1 0 010 1.74l-2.834 1.64-2.532-2.533 2.532-2.487zM5.864 3.458L16.8 9.79l-2.302 2.302-8.634-8.634z"/></svg>;

/* Project Modal */
type TranslatedProject = Project & { _title?: string; _description?: string; _role?: string; _features?: string[]; _highlights?: string[] };

const ProjectModal: React.FC<{ project: TranslatedProject | null; onClose: () => void; labels: { keyFeatures: string; highlightsLabel: string; technologies: string; visitWebsite: string; downloadApp: string } }> = ({ project, onClose, labels }) => {
  useEffect(() => {
    if (project) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (top) window.scrollTo(0, parseInt(top, 10) * -1);
    }
    return () => {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (top) window.scrollTo(0, parseInt(top, 10) * -1);
    };
  }, [project]);

  if (!project) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div className="modal-banner" style={{ background: project.gradient }}>
          {project.image && <img src={project.image} alt={project._title || project.title} className="modal-banner-img" />}
          <div className="proj-pattern" />
          <div className="modal-banner-content">
            <span className="modal-company-tag">{project.company}</span>
            <h2>{project._title || project.title}</h2>
            <p className="modal-role">{project._role || project.role} &middot; {project.period}</p>
          </div>
        </div>
        <div className="modal-body">
          <p className="modal-desc">{project._description || project.description}</p>
          <div className="modal-section">
            <h3>{labels.keyFeatures}</h3>
            <ul className="modal-features">
              {(project._features || project.features).map((f, i) => <li key={i}><span className="feature-dot" />{f}</li>)}
            </ul>
          </div>
          {(project._highlights || project.highlights) && (
            <div className="modal-section">
              <h3>{labels.highlightsLabel}</h3>
              <div className="modal-highlights">
                {(project._highlights || project.highlights)!.map((h, i) => <span key={i} className="highlight-badge">{h}</span>)}
              </div>
            </div>
          )}
          <div className="modal-section">
            <h3>{labels.technologies}</h3>
            <div className="modal-techs">{project.techs.map(t => <span key={t} className="pill">{t}</span>)}</div>
          </div>
          {(project.appStoreUrl || project.playStoreUrl) && (
            <div className="modal-section">
              <h3>{labels.downloadApp}</h3>
              <div className="modal-store-links">
                {project.appStoreUrl && (
                  <a href={project.appStoreUrl} target="_blank" rel="noreferrer" className="store-badge">
                    <AppleIcon />
                    <div className="store-badge-text"><span className="store-badge-small">Download on the</span><span className="store-badge-big">App Store</span></div>
                  </a>
                )}
                {project.playStoreUrl && (
                  <a href={project.playStoreUrl} target="_blank" rel="noreferrer" className="store-badge">
                    <PlayStoreIcon />
                    <div className="store-badge-text"><span className="store-badge-small">GET IT ON</span><span className="store-badge-big">Google Play</span></div>
                  </a>
                )}
              </div>
            </div>
          )}
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer" className="btn-glow modal-link">
              <span className="btn-glow-bg" />
              <span className="btn-glow-text">{labels.visitWebsite}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10" /></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/* ====== Main Inner (needs context) ====== */
const PortfolioInner: React.FC = () => {
  const { resolved, mode, cycle: cycleTheme } = useTheme();
  const { t, locale, cycle: cycleLang } = useI18n();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [projectFilter, setProjectFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<TranslatedProject | null>(null);
  const { pos, handleMove } = useMouseParallax();

  // Nav labels from i18n
  const navLabels: Record<string, string> = useMemo(() => ({
    about: t.nav.about,
    skills: t.nav.skills,
    experience: t.nav.experience,
    projects: t.nav.projects,
    contact: t.nav.contact,
  }), [t]);

  // Merge translated experience data
  const localExperiences = useMemo(() =>
    experiences.map((exp, i) => ({
      ...exp,
      role: t.experience.items[i]?.role || exp.role,
      description: t.experience.items[i]?.description || exp.description,
    })),
    [t]
  );

  // Merge translated project data
  const localProjects = useMemo(() =>
    projects.map((proj, i) => ({
      ...proj,
      _title: t.projects.items[i]?.title || proj.title,
      _description: t.projects.items[i]?.description || proj.description,
      _role: t.projects.items[i]?.role || proj.role,
      _features: t.projects.items[i]?.features || proj.features,
      _highlights: t.projects.items[i]?.highlights || proj.highlights,
    })),
    [t]
  );

  const filteredProjects = projectFilter === 'All' ? localProjects : localProjects.filter(p => p.company === projectFilter);

  // Filter label: translate "All"
  const filterLabel = (f: string) => f === 'All' ? t.projects.filterAll : f;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
      const ids = ['contact', 'projects', 'experience', 'skills', 'about', 'hero'];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 300) { setActiveSection(id); break; }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  /* Stats with counter */
  const { ref: statsObsRef, isVisible: statsVisible } = useInView(0.3);
  const stat1 = useCountUp(10, 1500, statsVisible);
  const stat2 = useCountUp(20, 1800, statsVisible);
  const stat3 = useCountUp(10, 1600, statsVisible);
  const stat4 = useCountUp(99, 2000, statsVisible);

  const themeIcon = mode === 'dark' ? <MoonIcon /> : mode === 'light' ? <SunIcon /> : <SystemIcon />;
  const themeLabel = mode === 'dark' ? 'Dark' : mode === 'light' ? 'Light' : 'Auto';

  return (
    <div className={`portfolio ${resolved === 'light' ? 'theme-light' : ''}`} onMouseMove={handleMove}>
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />
      <Particles />
      <div className="noise-overlay" />
      <div className="gradient-orbs">
        <div className="g-orb g-orb-1" style={{ transform: `translate(${pos.x * 20}px, ${pos.y * 20}px)` }} />
        <div className="g-orb g-orb-2" style={{ transform: `translate(${pos.x * -15}px, ${pos.y * -15}px)` }} />
        <div className="g-orb g-orb-3" style={{ transform: `translate(${pos.x * 10}px, ${pos.y * 10}px)` }} />
      </div>

      {/* Nav */}
      <nav className={`nav ${scrolled ? 'nav-blur' : ''}`}>
        <div className="nav-inner">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="nav-logo" onClick={() => scrollTo('hero')}><span className="logo-gradient">{'<DN />'}</span></a>
          <button className={`hamburger ${menuOpen ? 'is-active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
          <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => scrollTo(item)} className={activeSection === item ? 'active' : ''}>
                  <span className="nav-text">{navLabels[item] || item}</span>
                  {activeSection === item && <span className="nav-dot" />}
                </a>
              </li>
            ))}
            <li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a onClick={() => scrollTo('contact')} className="nav-hire"><span className="nav-hire-pulse" />{t.nav.letsTalk}</a>
            </li>
            <li className="nav-toggles">
              <button className="toggle-btn" onClick={cycleTheme} title={`Theme: ${themeLabel}`}>
                {themeIcon}
              </button>
              <button className="toggle-btn" onClick={cycleLang} title={`Language: ${locale.toUpperCase()}`}>
                {LOCALE_LABELS[locale]}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section id="hero" className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-radial" />
        <div className="hero-shapes">
          <div className="h-shape h-shape-1" style={{ transform: `translate(${pos.x * 30}px, ${pos.y * 30}px)` }} />
          <div className="h-shape h-shape-2" style={{ transform: `translate(${pos.x * -25}px, ${pos.y * -25}px)` }} />
          <div className="h-shape h-shape-3" style={{ transform: `translate(${pos.x * 15}px, ${pos.y * -20}px)` }} />
        </div>
        <div className="hero-inner">
          <div className="hero-left">
            <Reveal><div className="hero-chip"><span className="chip-pulse" /><span>{t.hero.availableForHire}</span><span className="chip-arrow">&rarr;</span></div></Reveal>
            <Reveal delay={120}><h1 className="hero-heading"><span className="hero-line-1">{t.hero.greeting}</span><span className="hero-name-glow">{t.hero.name}</span></h1></Reveal>
            <Reveal delay={240}><h2 className="hero-typewriter"><span className="hero-role-prefix">{t.hero.rolePrefix}</span><TypeWriter words={t.hero.typewriterWords} className="tw-text" /></h2></Reveal>
            <Reveal delay={360}>
              <p className="hero-desc">
                {t.hero.description}<span className="em-gradient">{t.hero.descHighlight.split('.')[0]}.</span>
                <span className="hero-desc-highlight"> {t.hero.descHighlight.split('.').slice(1).join('.').trim()}</span>
              </p>
            </Reveal>
            <Reveal delay={480}>
              <div className="hero-btns">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => scrollTo('projects')} className="btn-glow"><span className="btn-glow-bg" /><span className="btn-glow-text">{t.hero.exploreWork}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg><span className="btn-shine" /></a>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => scrollTo('contact')} className="btn-outline-glow"><span className="btn-outline-border" />{t.hero.getInTouch}</a>
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
            <Reveal delay={300} direction="scale">
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
{'  '}<span className="syn-key">role</span><span className="syn-op">:</span> <span className="syn-str">"Lead Frontend Dev"</span>,{'\n'}
{'  '}<span className="syn-key">exp</span><span className="syn-op">:</span> <span className="syn-str">"10+ years"</span>,{'\n'}
{'  '}<span className="syn-key">companies</span><span className="syn-op">:</span> [{'\n'}
{'    '}<span className="syn-str">"Alohub"</span>, <span className="syn-str">"InfoPlus"</span>,{'\n'}
{'    '}<span className="syn-str">"Merchize"</span>, <span className="syn-str">"Foobla"</span>{'\n'}
{'  '}],{'\n'}
{'  '}<span className="syn-key">passion</span><span className="syn-op">:</span> <span className="syn-str">"Crafting digital{'\n'}    experiences"</span>{'\n'}
{'}'};
                  </pre>
                  <div className="terminal-line-numbers">
                    {Array.from({ length: 11 }, (_, i) => <span key={i}>{i + 1}</span>)}
                  </div>
                  <div className="terminal-glow" />
                </div>
              </Tilt>
            </Reveal>
          </div>
        </div>
        <div className="scroll-cue" onClick={() => scrollTo('about')}>
          <div className="scroll-track"><div className="scroll-thumb" /></div>
          <span>{t.hero.scroll}</span>
        </div>
      </section>

      <TechMarquee />

      {/* ===== ABOUT ===== */}
      <section id="about" className="section">
        <div className="container">
          <Reveal><header className="sec-header"><span className="sec-num">01</span><h2>{t.about.title}</h2><span className="sec-line" /></header></Reveal>
          <div className="about-layout">
            <Reveal delay={100} className="about-bio">
              {t.about.bio.map((html, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
              ))}
              <div className="about-tags">
                {t.about.tags.map(tag => (
                  <span key={tag} className="about-tag">{tag}</span>
                ))}
              </div>
            </Reveal>
            <div className="about-numbers" ref={(el) => { (statsObsRef as any).current = el; }}>
              {[
                { value: stat1, suffix: '+', label: t.about.stats[0]?.label, icon: '📅' },
                { value: stat2, suffix: '+', label: t.about.stats[1]?.label, icon: '🚀' },
                { value: stat3, suffix: '+', label: t.about.stats[2]?.label, icon: '👥' },
                { value: stat4, suffix: '%', label: t.about.stats[3]?.label, icon: '⭐' },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 100 + 200} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <Tilt><div className="num-card"><span className="num-icon">{s.icon}</span><span className="num-value">{s.value}{s.suffix}</span><span className="num-label">{s.label}</span><div className="num-shimmer" /><div className="num-border-glow" /></div></Tilt>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SKILLS ===== */}
      <section id="skills" className="section section-dark">
        <div className="container">
          <Reveal><header className="sec-header"><span className="sec-num">02</span><h2>{t.skills.title}</h2><span className="sec-line" /></header></Reveal>
          <div className="skills-mosaic">
            {skills.map((g, i) => (
              <Reveal key={g.category} delay={i * 80} direction={i < 3 ? 'left' : 'right'}>
                <Tilt>
                  <div className="skill-tile" style={{ '--accent': g.color } as React.CSSProperties}>
                    <div className="skill-tile-head"><span className="skill-emoji">{g.icon}</span><h3>{t.skills.categories[g.category] || g.category}</h3></div>
                    <div className="skill-chips">{g.items.map((item) => <span key={item} className="skill-chip">{item}</span>)}</div>
                    <div className="skill-tile-accent" /><div className="skill-tile-border" />
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section id="experience" className="section">
        <div className="container">
          <Reveal><header className="sec-header"><span className="sec-num">03</span><h2>{t.experience.title}</h2><span className="sec-line" /></header></Reveal>
          <div className="exp-timeline">
            {localExperiences.map((exp, idx) => (
              <Reveal key={idx} delay={idx * 150} direction={idx % 2 === 0 ? 'left' : 'right'}>
                <div className={`exp-row ${idx === 0 ? 'exp-current' : ''}`}>
                  <div className="exp-marker">
                    <div className={`exp-ring ${idx === 0 ? 'exp-ring-active' : ''}`}>
                      <div className="exp-dot" />
                      {idx === 0 && <div className="exp-ring-pulse" />}
                    </div>
                    {idx < localExperiences.length - 1 && <div className="exp-line" />}
                  </div>
                  <Tilt className="exp-card-wrap">
                    <div className="exp-card">
                      <div className="exp-top">
                        <span className="exp-period">{exp.period}</span>
                        <span className={`exp-company ${idx === 0 ? 'exp-company-active' : ''}`}>{exp.company}</span>
                        {idx === 0 && <span className="exp-badge">{t.experience.currentBadge}</span>}
                      </div>
                      <h3 className="exp-role">{exp.role}</h3>
                      <p className="exp-desc">{exp.description}</p>
                      <div className="exp-pills">{exp.techs.map(tc => <span key={tc} className="pill">{tc}</span>)}</div>
                    </div>
                  </Tilt>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS ===== */}
      <section id="projects" className="section section-dark">
        <div className="container">
          <Reveal><header className="sec-header"><span className="sec-num">04</span><h2>{t.projects.title}</h2><span className="sec-line" /></header></Reveal>
          <Reveal delay={50}>
            <div className="proj-filters">
              {projectFilterOptions.map(f => (
                <button key={f} className={`proj-filter-btn ${projectFilter === f ? 'active' : ''}`} onClick={() => setProjectFilter(f)}>
                  {filterLabel(f)}
                  {projectFilter === f && <span className="filter-count">{f === 'All' ? localProjects.length : localProjects.filter(p => p.company === f).length}</span>}
                </button>
              ))}
            </div>
          </Reveal>
          <div className="proj-grid">
            {filteredProjects.map((p, idx) => (
              <Reveal key={p.title} delay={idx * 100} direction="scale">
                <Tilt>
                  <div className="proj-card" onClick={() => setSelectedProject(p)}>
                    <div className="proj-card-header">
                      <div className="proj-card-dots"><i /><i /><i /></div>
                      <span className="proj-card-filename">{p.company.toLowerCase().replace(/\s+/g, '-')}.tsx</span>
                      {p.company === 'Alohub' && <span className="proj-active-dot" />}
                    </div>
                    <div className="proj-banner" style={{ background: p.gradient }}>
                      {p.image && <img src={p.image} alt={p._title} className="proj-banner-img" />}
                      <div className="proj-pattern" />
                      <span className="proj-company-label">{p.company}</span>
                      <span className="proj-idx">0{idx + 1}</span>
                    </div>
                    <div className="proj-body">
                      <h3><span className="proj-title-bracket">&lt;</span>{p._title}<span className="proj-title-bracket">/&gt;</span></h3>
                      <p>{p._description}</p>
                      <div className="proj-pills">
                        {p.techs.slice(0, 3).map(tc => <span key={tc} className="pill">{tc}</span>)}
                        {p.techs.length > 3 && <span className="proj-extra-count">+{p.techs.length - 3}</span>}
                      </div>
                      <div className="proj-actions">
                        <span className="proj-link">
                          {t.projects.viewDetails}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10" /></svg>
                        </span>
                        {(p.appStoreUrl || p.playStoreUrl) && (
                          <div className="proj-store-icons">
                            {p.appStoreUrl && <a href={p.appStoreUrl} target="_blank" rel="noreferrer" className="proj-store-icon" title="App Store" onClick={e => e.stopPropagation()}><AppleIcon /></a>}
                            {p.playStoreUrl && <a href={p.playStoreUrl} target="_blank" rel="noreferrer" className="proj-store-icon" title="Google Play" onClick={e => e.stopPropagation()}><PlayStoreIcon /></a>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="proj-scanline" />
                    <div className="proj-border-glow" />
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        labels={{ keyFeatures: t.projects.keyFeatures, highlightsLabel: t.projects.highlightsLabel, technologies: t.projects.technologies, visitWebsite: t.projects.visitWebsite, downloadApp: t.projects.downloadApp }}
      />

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section">
        <div className="container">
          <Reveal><header className="sec-header"><span className="sec-num">05</span><h2>{t.contact.title}</h2><span className="sec-line" /></header></Reveal>
          <Reveal delay={100}>
            <div className="contact-center">
              <p className="contact-lead">{t.contact.lead}</p>
              <div className="contact-grid">
                {[
                  { href: 'mailto:dongshyshiny@gmail.com', title: 'Email', sub: 'dongshyshiny@gmail.com', svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg> },
                  { href: 'https://github.com/dongshyshiny', title: 'GitHub', sub: 'github.com/dongshyshiny', svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d={socials[0].path} /></svg> },
                  { href: 'https://www.linkedin.com/in/dong-nguyen-577965213/', title: 'LinkedIn', sub: 'linkedin.com/in/dong-nguyen', svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d={socials[1].path} /></svg> },
                ].map(c => (
                  <a key={c.title} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="contact-tile">
                    <Tilt><div className="contact-tile-inner"><div className="contact-icon">{c.svg}</div><h3>{c.title}</h3><p>{c.sub}</p><div className="contact-tile-glow" /></div></Tilt>
                  </a>
                ))}
              </div>
              <a href="mailto:dongshyshiny@gmail.com" className="btn-glow btn-glow-lg">
                <span className="btn-glow-bg" /><span className="btn-glow-text">{t.contact.sayHello}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                <span className="btn-shine" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-glow" />
        <div className="container footer-row">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="nav-logo" onClick={() => scrollTo('hero')}><span className="logo-gradient">{'<DN />'}</span></a>
          <p>{t.footer.designedBy} <span className="footer-name">Dong Nguyen</span> &copy; {new Date().getFullYear()}</p>
          <div className="footer-links">
            <a href="https://github.com/dongshyshiny" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/dong-nguyen-577965213/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="mailto:dongshyshiny@gmail.com">Email</a>
          </div>
        </div>
      </footer>

      <button className={`back-to-top ${scrolled ? 'visible' : ''}`} onClick={() => scrollTo('hero')} aria-label="Back to top">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" /></svg>
      </button>
    </div>
  );
};

/* ====== Root with Providers ====== */
const Portfolio: React.FC = () => (
  <ThemeProvider>
    <I18nProvider>
      <PortfolioInner />
    </I18nProvider>
  </ThemeProvider>
);

export default Portfolio;
