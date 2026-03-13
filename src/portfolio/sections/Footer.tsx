import React from 'react';

interface Props {
  scrollTo: (id: string) => void;
}

export const Footer: React.FC<Props> = ({ scrollTo }) => (
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
);
