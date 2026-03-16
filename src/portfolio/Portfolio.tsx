import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './Portfolio.css';
import {
  navItems, typewriterWords as twWords, skills, experiences,
  projects, projectFilterOptions, socials, type Project,
} from './data/portfolioData';

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

/* Project Modal */
const ProjectModal: React.FC<{ project: Project | null; onClose: () => void }> = ({ project, onClose }) => {
  useEffect(() => {
    if (project) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  if (!project) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div className="modal-banner" style={{ background: project.gradient }}>
          <div className="proj-pattern" />
          <div className="modal-banner-content">
            <span className="modal-company-tag">{project.company}</span>
            <h2>{project.title}</h2>
            <p className="modal-role">{project.role} &middot; {project.period}</p>
          </div>
        </div>
        <div className="modal-body">
          <p className="modal-desc">{project.description}</p>
          <div className="modal-section">
            <h3>Key Features</h3>
            <ul className="modal-features">
              {project.features.map((f, i) => <li key={i}><span className="feature-dot" />{f}</li>)}
            </ul>
          </div>
          {project.highlights && (
            <div className="modal-section">
              <h3>Highlights</h3>
              <div className="modal-highlights">
                {project.highlights.map((h, i) => <span key={i} className="highlight-badge">{h}</span>)}
              </div>
            </div>
          )}
          <div className="modal-section">
            <h3>Technologies</h3>
            <div className="modal-techs">{project.techs.map(t => <span key={t} className="pill">{t}</span>)}</div>
          </div>
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer" className="btn-glow modal-link">
              <span className="btn-glow-bg" />
              <span className="btn-glow-text">Visit Website</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10" /></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/* ====== Main ====== */
const Portfolio: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [projectFilter, setProjectFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { pos, handleMove } = useMouseParallax();

  const typewriterWords = useMemo(() => [...twWords, 'UI Architect'], []);

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

  const filteredProjects = projectFilter === 'All' ? projects : projects.filter(p => p.company === projectFilter);

  /* Stats with counter */
  const { ref: statsObsRef, isVisible: statsVisible } = useInView(0.3);
  const stat1 = useCountUp(10, 1500, statsVisible);
  const stat2 = useCountUp(20, 1800, statsVisible);
  const stat3 = useCountUp(10, 1600, statsVisible);
  const stat4 = useCountUp(99, 2000, statsVisible);

  return (
    <div className="portfolio" onMouseMove={handleMove}>
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
                  <span className="nav-text">{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                  {activeSection === item && <span className="nav-dot" />}
                </a>
              </li>
            ))}
            <li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a onClick={() => scrollTo('contact')} className="nav-hire"><span className="nav-hire-pulse" />Let's Talk</a>
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
            <Reveal><div className="hero-chip"><span className="chip-pulse" /><span>Available for hire</span><span className="chip-arrow">&rarr;</span></div></Reveal>
            <Reveal delay={120}><h1 className="hero-heading"><span className="hero-line-1">Hi, I'm</span><span className="hero-name-glow">Dong Nguyen</span></h1></Reveal>
            <Reveal delay={240}><h2 className="hero-typewriter"><span className="hero-role-prefix">I'm a </span><TypeWriter words={typewriterWords} className="tw-text" /></h2></Reveal>
            <Reveal delay={360}>
              <p className="hero-desc">
                I craft <span className="em-gradient">pixel-perfect</span>, accessible, high-performance web & mobile products that users love.
                <span className="hero-desc-highlight"> 10+ years of building at scale.</span>
              </p>
            </Reveal>
            <Reveal delay={480}>
              <div className="hero-btns">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => scrollTo('projects')} className="btn-glow"><span className="btn-glow-bg" /><span className="btn-glow-text">Explore Work</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg><span className="btn-shine" /></a>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => scrollTo('contact')} className="btn-outline-glow"><span className="btn-outline-border" />Get In Touch</a>
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
          <span>Scroll</span>
        </div>
      </section>

      <TechMarquee />

      {/* ===== ABOUT ===== */}
      <section id="about" className="section">
        <div className="container">
          <Reveal><header className="sec-header"><span className="sec-num">01</span><h2>About Me</h2><span className="sec-line" /></header></Reveal>
          <div className="about-layout">
            <Reveal delay={100} className="about-bio">
              <p>I'm a passionate <strong>Lead Frontend Developer</strong> with <strong>10+ years</strong> of experience. I've worked at companies ranging from WordPress theme development at <strong>Foobla</strong>, print-on-demand e-commerce at <strong>Merchize</strong>, banking fintech at <strong>InfoPlus</strong>, to leading contact center platform at <strong>Alohub</strong>.</p>
              <p>My expertise spans <strong>React</strong>, <strong>React Native</strong>, <strong>TypeScript</strong>, <strong>Node.js</strong>, and <strong>Java</strong>, with strong skills in CI/CD, database design, and cloud deployment.</p>
              <p>As a team lead, I focus on code quality, best practices, and mentoring developers to deliver high-quality products on time.</p>
              <div className="about-tags">
                {['Leadership', 'Architecture', 'Code Review', 'Mentoring', 'Agile', 'SIP/VoIP', 'CI/CD'].map(t => (
                  <span key={t} className="about-tag">{t}</span>
                ))}
              </div>
            </Reveal>
            <div className="about-numbers" ref={(el) => { (statsObsRef as any).current = el; }}>
              {[
                { value: stat1, suffix: '+', label: 'Years Experience', icon: '📅' },
                { value: stat2, suffix: '+', label: 'Projects Delivered', icon: '🚀' },
                { value: stat3, suffix: '+', label: 'Team Members Led', icon: '👥' },
                { value: stat4, suffix: '%', label: 'Client Satisfaction', icon: '⭐' },
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
          <Reveal><header className="sec-header"><span className="sec-num">02</span><h2>Tech Stack</h2><span className="sec-line" /></header></Reveal>
          <div className="skills-mosaic">
            {skills.map((g, i) => (
              <Reveal key={g.category} delay={i * 80} direction={i < 3 ? 'left' : 'right'}>
                <Tilt>
                  <div className="skill-tile" style={{ '--accent': g.color } as React.CSSProperties}>
                    <div className="skill-tile-head"><span className="skill-emoji">{g.icon}</span><h3>{g.category}</h3></div>
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
          <Reveal><header className="sec-header"><span className="sec-num">03</span><h2>Career Path</h2><span className="sec-line" /></header></Reveal>
          <div className="exp-timeline">
            {experiences.map((exp, idx) => (
              <Reveal key={idx} delay={idx * 150} direction={idx % 2 === 0 ? 'left' : 'right'}>
                <div className={`exp-row ${idx === 0 ? 'exp-current' : ''}`}>
                  <div className="exp-marker">
                    <div className={`exp-ring ${idx === 0 ? 'exp-ring-active' : ''}`}>
                      <div className="exp-dot" />
                      {idx === 0 && <div className="exp-ring-pulse" />}
                    </div>
                    {idx < experiences.length - 1 && <div className="exp-line" />}
                  </div>
                  <Tilt className="exp-card-wrap">
                    <div className="exp-card">
                      <div className="exp-top">
                        <span className="exp-period">{exp.period}</span>
                        <span className={`exp-company ${idx === 0 ? 'exp-company-active' : ''}`}>{exp.company}</span>
                        {idx === 0 && <span className="exp-badge">Current</span>}
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

      {/* ===== PROJECTS ===== */}
      <section id="projects" className="section section-dark">
        <div className="container">
          <Reveal><header className="sec-header"><span className="sec-num">04</span><h2>Featured Work</h2><span className="sec-line" /></header></Reveal>
          <Reveal delay={50}>
            <div className="proj-filters">
              {projectFilterOptions.map(f => (
                <button key={f} className={`proj-filter-btn ${projectFilter === f ? 'active' : ''}`} onClick={() => setProjectFilter(f)}>
                  {f}
                  {projectFilter === f && <span className="filter-count">{f === 'All' ? projects.length : projects.filter(p => p.company === f).length}</span>}
                </button>
              ))}
            </div>
          </Reveal>
          <div className="proj-grid">
            {filteredProjects.map((p, idx) => (
              <Reveal key={p.title} delay={idx * 100} direction="scale">
                <Tilt>
                  <div className="proj-card" onClick={() => setSelectedProject(p)}>
                    <div className="proj-banner" style={{ background: p.gradient }}>
                      <div className="proj-pattern" />
                      <span className="proj-company-label">{p.company}</span>
                      <span className="proj-idx">0{idx + 1}</span>
                    </div>
                    <div className="proj-body">
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                      <div className="proj-pills">{p.techs.slice(0, 4).map(t => <span key={t} className="pill">{t}</span>)}</div>
                      <span className="proj-link">
                        View Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10" /></svg>
                      </span>
                    </div>
                    <div className="proj-border-glow" />
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section">
        <div className="container">
          <Reveal><header className="sec-header"><span className="sec-num">05</span><h2>Let's Connect</h2><span className="sec-line" /></header></Reveal>
          <Reveal delay={100}>
            <div className="contact-center">
              <p className="contact-lead">Have a project in mind or want to collaborate? I'd love to hear from you. Let's create something extraordinary together.</p>
              <div className="contact-grid">
                {[
                  { href: 'mailto:dong.nguyen@example.com', title: 'Email', sub: 'dong.nguyen@example.com', svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg> },
                  { href: 'https://github.com/dongnguyen', title: 'GitHub', sub: 'github.com/dongnguyen', svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d={socials[0].path} /></svg> },
                  { href: 'https://linkedin.com/in/dongnguyen', title: 'LinkedIn', sub: 'linkedin.com/in/dongnguyen', svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d={socials[1].path} /></svg> },
                ].map(c => (
                  <a key={c.title} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="contact-tile">
                    <Tilt><div className="contact-tile-inner"><div className="contact-icon">{c.svg}</div><h3>{c.title}</h3><p>{c.sub}</p><div className="contact-tile-glow" /></div></Tilt>
                  </a>
                ))}
              </div>
              <a href="mailto:dong.nguyen@example.com" className="btn-glow btn-glow-lg">
                <span className="btn-glow-bg" /><span className="btn-glow-text">Say Hello</span>
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
          <p>Designed & Built by <span className="footer-name">Dong Nguyen</span> &copy; {new Date().getFullYear()}</p>
          <div className="footer-links">
            <a href="https://github.com/dongnguyen" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/dongnguyen" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="mailto:dong.nguyen@example.com">Email</a>
          </div>
        </div>
      </footer>

      <button className={`back-to-top ${scrolled ? 'visible' : ''}`} onClick={() => scrollTo('hero')} aria-label="Back to top">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" /></svg>
      </button>
    </div>
  );
};

export default Portfolio;
