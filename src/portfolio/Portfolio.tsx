import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './Portfolio.css';

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

/* ====== Components ====== */
const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className={`reveal ${isVisible ? 'revealed' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
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
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02, 1.02, 1.02)`;
    const shine = el.querySelector('.card-shine') as HTMLElement;
    if (shine) { shine.style.opacity = '1'; shine.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.06) 0%, transparent 60%)`; }
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
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
        ctx.fill();
        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
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

/* ====== Main ====== */
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

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  const typewriterWords = useMemo(() => ['React Developer', 'Mobile Engineer', 'Team Leader', 'Problem Solver'], []);

  const skills = [
    { category: 'Frontend', icon: '🎨', items: ['React', 'React Native', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Redux', 'Next.js'], color: '#a78bfa' },
    { category: 'Mobile', icon: '📱', items: ['React Native', 'iOS', 'Android', 'Expo', 'App Store & Play Store'], color: '#c084fc' },
    { category: 'Backend', icon: '⚡', items: ['Node.js', 'Express.js', 'Java', 'Spring Boot', 'REST API', 'GraphQL'], color: '#22d3ee' },
    { category: 'Database', icon: '🗄️', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase'], color: '#34d399' },
    { category: 'DevOps & CI/CD', icon: '🚀', items: ['Docker', 'GitHub Actions', 'Jenkins', 'AWS', 'Nginx', 'Linux'], color: '#fbbf24' },
    { category: 'Tools', icon: '🛠️', items: ['Git', 'Jira', 'Figma', 'VS Code', 'Postman', 'Swagger'], color: '#fb7185' },
  ];

  const experiences = [
    { role: 'Dev Lead - Frontend & Mobile', company: 'Alohub', period: '2022 — Present', description: 'Lead a team of frontend and mobile developers. Architect and develop React & React Native applications. Implement CI/CD pipelines and code review processes.', techs: ['React', 'React Native', 'TypeScript', 'Node.js', 'Docker'] },
    { role: 'Senior Frontend Developer', company: 'Tech Company', period: '2020 — 2022', description: 'Developed and maintained large-scale web applications. Mentored junior developers and established coding standards.', techs: ['React', 'JavaScript', 'Java', 'PostgreSQL'] },
    { role: 'Mobile Developer', company: 'Startup', period: '2018 — 2020', description: 'Built cross-platform mobile applications from scratch using React Native. Integrated with REST APIs and third-party services.', techs: ['React Native', 'Node.js', 'MongoDB', 'Firebase'] },
  ];

  const projects = [
    { title: 'Alohub Info CMS', description: 'Admin management platform for banking & payment collection services. Configure contracts, ECC, ACC and various admin features for bank operations and payment processing.', techs: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'], gradient: 'linear-gradient(135deg, #7c3aed, #2563eb)' },
    { title: 'Alohub Mobile App', description: 'Cross-platform mobile app with SIP-based calling, real-time call notifications on lock screen, push notifications, and seamless VoIP integration for banking communication.', techs: ['React Native', 'SIP/VoIP', 'Push Notifications', 'TypeScript'], gradient: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' },
    { title: 'E-Commerce Marketplace', description: 'Full-stack e-commerce platform with real-time inventory, order tracking, and payment integration.', techs: ['Next.js', 'Node.js', 'MongoDB', 'AWS'], gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
    { title: 'CI/CD Pipeline Automation', description: 'Automated build, test, and deployment pipeline for multiple projects using GitHub Actions and Docker.', techs: ['Docker', 'GitHub Actions', 'Jenkins', 'Nginx'], gradient: 'linear-gradient(135deg, #10b981, #3b82f6)' },
  ];

  const navItems = ['about', 'skills', 'experience', 'projects', 'contact'];

  /* Stats with counter */
  const statsRef = useRef<HTMLDivElement>(null);
  const { ref: statsObsRef, isVisible: statsVisible } = useInView(0.3);

  const stat1 = useCountUp(5, 1500, statsVisible);
  const stat2 = useCountUp(20, 1800, statsVisible);
  const stat3 = useCountUp(10, 1600, statsVisible);
  const stat4 = useCountUp(99, 2000, statsVisible);

  return (
    <div className="portfolio" onMouseMove={handleMouse}>
      {/* Background layers */}
      <Particles />
      <div className="noise-overlay" />
      <div className="gradient-orbs">
        <div className="g-orb g-orb-1" />
        <div className="g-orb g-orb-2" />
        <div className="g-orb g-orb-3" />
      </div>
      <div className="cursor-spotlight" style={{ left: mousePos.x, top: mousePos.y }} />

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
                  {activeSection === item && <span className="nav-dot" />}
                </a>
              </li>
            ))}
            <li><a onClick={() => scrollTo('contact')} className="nav-hire">Let's Talk</a></li>
          </ul>
        </div>
      </nav>

      {/* ===== HERO ===== */}
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
                <TypeWriter words={typewriterWords} className="tw-text" />
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
                {[
                  { href: 'https://github.com/dongnguyen', label: 'GitHub', path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                  { href: 'https://linkedin.com/in/dongnguyen', label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { href: 'mailto:dong.nguyen@example.com', label: 'Email', path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
                ].map((s) => (
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

      {/* ===== ABOUT ===== */}
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
              <p>I'm a passionate <strong>Dev Lead</strong> specializing in <strong>Frontend</strong> and <strong>Mobile</strong> development with over 5 years of experience building scalable web and mobile applications.</p>
              <p>My expertise spans across <strong>React</strong>, <strong>React Native</strong>, <strong>Node.js</strong>, and <strong>Java</strong>, with solid knowledge in database design, CI/CD pipelines, and cloud deployment.</p>
              <p>As a team lead, I focus on code quality, best practices, and mentoring developers to deliver high-quality products on time.</p>
              <div className="about-tags">
                {['Leadership', 'Architecture', 'Code Review', 'Mentoring', 'Agile'].map(t => (
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

      {/* ===== SKILLS ===== */}
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

      {/* ===== EXPERIENCE ===== */}
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

      {/* ===== PROJECTS ===== */}
      <section id="projects" className="section section-dark">
        <div className="container">
          <Reveal>
            <header className="sec-header">
              <span className="sec-num">04</span>
              <h2>Featured Work</h2>
              <span className="sec-line" />
            </header>
          </Reveal>
          <div className="proj-grid">
            {projects.map((p, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <Tilt>
                  <div className="proj-card">
                    <div className="proj-banner" style={{ background: p.gradient }}>
                      <div className="proj-pattern" />
                      <span className="proj-idx">0{idx + 1}</span>
                    </div>
                    <div className="proj-body">
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                      <div className="proj-pills">{p.techs.map(t => <span key={t} className="pill">{t}</span>)}</div>
                      <a className="proj-link" href="#" onClick={e => e.preventDefault()}>
                        View Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10" /></svg>
                      </a>
                    </div>
                    <div className="proj-border-glow" />
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section">
        <div className="container">
          <Reveal>
            <header className="sec-header">
              <span className="sec-num">05</span>
              <h2>Let's Connect</h2>
              <span className="sec-line" />
            </header>
          </Reveal>
          <Reveal delay={100}>
            <div className="contact-center">
              <p className="contact-lead">
                Have a project in mind or want to collaborate? I'd love to hear from you.
                Let's create something extraordinary together.
              </p>
              <div className="contact-grid">
                {[
                  { href: 'mailto:dong.nguyen@example.com', title: 'Email', sub: 'dong.nguyen@example.com', svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg> },
                  { href: 'https://github.com/dongnguyen', title: 'GitHub', sub: 'github.com/dongnguyen', svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg> },
                  { href: 'https://linkedin.com/in/dongnguyen', title: 'LinkedIn', sub: 'linkedin.com/in/dongnguyen', svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
                ].map(c => (
                  <a key={c.title} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="contact-tile">
                    <Tilt>
                      <div className="contact-tile-inner">
                        <div className="contact-icon">{c.svg}</div>
                        <h3>{c.title}</h3>
                        <p>{c.sub}</p>
                      </div>
                    </Tilt>
                  </a>
                ))}
              </div>
              <a href="mailto:dong.nguyen@example.com" className="btn-glow btn-glow-lg">
                <span className="btn-glow-bg" />
                <span className="btn-glow-text">Say Hello</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-row">
          <a className="nav-logo" onClick={() => scrollTo('hero')}><span className="logo-gradient">{'<DN />'}</span></a>
          <p>&copy; {new Date().getFullYear()} Dong Nguyen &mdash; Built with React + TypeScript</p>
          <div className="footer-links">
            <a href="https://github.com/dongnguyen" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/dongnguyen" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="mailto:dong.nguyen@example.com">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
