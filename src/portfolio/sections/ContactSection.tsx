import React, { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { Tilt } from '../components/Tilt';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open mailto with form data
    const subject = encodeURIComponent(`Contact from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.open(`mailto:dong.nguyen@example.com?subject=${subject}&body=${body}`);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <Reveal>
          <header className="sec-header">
            <span className="sec-num">05</span>
            <h2>Let's Connect</h2>
            <span className="sec-line" />
          </header>
        </Reveal>

        <div className="contact-layout">
          {/* Left - Info */}
          <Reveal delay={100} className="contact-info-col">
            <h3 className="contact-info-title">Get in touch</h3>
            <p className="contact-info-desc">
              Have a project in mind or want to collaborate? I'd love to hear from you.
              Let's create something extraordinary together.
            </p>

            <div className="contact-info-list">
              {[
                {
                  icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg>,
                  label: 'Email',
                  value: 'dong.nguyen@example.com',
                  href: 'mailto:dong.nguyen@example.com',
                },
                {
                  icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
                  label: 'Phone',
                  value: '+84 xxx xxx xxx',
                  href: 'tel:+84xxxxxxxxx',
                },
                {
                  icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
                  label: 'Location',
                  value: 'Ha Noi, Viet Nam',
                },
              ].map(item => (
                <div key={item.label} className="contact-info-item">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <span className="contact-info-label">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="contact-info-value">{item.value}</a>
                    ) : (
                      <span className="contact-info-value">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-socials">
              {[
                { href: 'https://github.com/dongnguyen', label: 'GitHub', path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                { href: 'https://linkedin.com/in/dongnguyen', label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-icon" title={s.label}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Right - Form */}
          <Reveal delay={200}>
            <Tilt>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="btn-glow btn-submit" disabled={submitted}>
                  <span className="btn-glow-bg" />
                  <span className="btn-glow-text">{submitted ? 'Sent!' : 'Send Message'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {submitted
                      ? <polyline points="20 6 9 17 4 12" />
                      : <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    }
                  </svg>
                </button>
              </form>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
