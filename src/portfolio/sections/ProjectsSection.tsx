import React, { useState, useEffect, useCallback } from 'react';
import { Reveal } from '../components/Reveal';
import { Tilt } from '../components/Tilt';
import { projects, projectFilterOptions, Project } from '../data/portfolioData';

const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    document.documentElement.classList.add('modal-open');
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.documentElement.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="modal-banner" style={{ background: project.gradient }}>
          <img src={project.image} alt={project.title} className="modal-banner-img" />
          <div className="modal-banner-overlay" />
          <div className="modal-banner-info">
            <span className="proj-company-badge">{project.company}</span>
            <h2>{project.title}</h2>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-meta">
            <div className="modal-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <span>{project.role}</span>
            </div>
            <div className="modal-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              <span>{project.period}</span>
            </div>
            {project.url && (
              <a href={project.url} target="_blank" rel="noreferrer" className="modal-meta-item modal-meta-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                <span>Visit Website</span>
              </a>
            )}
          </div>

          <p className="modal-desc">{project.description}</p>

          <div className="modal-section">
            <h3>Tech Stack</h3>
            <div className="modal-pills">
              {project.techs.map(t => <span key={t} className="pill">{t}</span>)}
            </div>
          </div>

          <div className="modal-section">
            <h3>Features</h3>
            <ul className="modal-features">
              {project.features.map((f, i) => (
                <li key={i}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {project.highlights && project.highlights.length > 0 && (
            <div className="modal-section">
              <h3>Highlights</h3>
              <div className="modal-highlights">
                {project.highlights.map((h, i) => (
                  <div key={i} className="modal-highlight-item">
                    <span className="modal-highlight-icon">&#9733;</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-scroll-hint">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
        </div>
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects.filter(p => filter === 'All' || p.company === filter);

  const handleClose = useCallback(() => setSelectedProject(null), []);

  return (
    <>
      <section id="projects" className="section section-dark">
        <div className="container">
          <Reveal>
            <header className="sec-header">
              <span className="sec-num">04</span>
              <h2>Featured Work</h2>
              <span className="sec-line" />
            </header>
          </Reveal>
          <div className="proj-filter">
            {projectFilterOptions.map(f => (
              <button
                key={f}
                className={`proj-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="proj-grid">
            {filtered.map((p, idx) => (
              <Reveal key={p.title} delay={idx * 100}>
                <Tilt className="proj-tilt">
                  <div className="proj-card" onClick={() => setSelectedProject(p)}>
                    <div className="proj-banner" style={{ background: p.gradient }}>
                      <img src={p.image} alt={p.title} className="proj-banner-img" loading="lazy" />
                      <div className="proj-banner-overlay" />
                      <div className="proj-pattern" />
                      <span className="proj-company-badge">{p.company}</span>
                    </div>
                    <div className="proj-body">
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                      <div className="proj-pills">{p.techs.map(t => <span key={t} className="pill">{t}</span>)}</div>
                    </div>
                    <div className="proj-card-footer">
                      <span className="proj-view-detail">
                        View Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
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

      {selectedProject && <ProjectModal project={selectedProject} onClose={handleClose} />}
    </>
  );
};
