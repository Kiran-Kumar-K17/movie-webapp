import React from 'react';
import { NavLink } from 'react-router-dom';
import { Clapperboard, Github, Twitter, Instagram, Film, Tv, Search, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  const navGroups = [
    {
      heading: 'Browse',
      links: [
        { to: '/movies', label: 'Movies', icon: <Film size={13} /> },
        { to: '/tvshows', label: 'TV Shows', icon: <Tv size={13} /> },
        { to: '/search', label: 'Search', icon: <Search size={13} /> },
        { to: '/favorites', label: 'Favorites', icon: <Heart size={13} /> },
      ],
    },
  ];

  const socials = [
    { href: 'https://github.com', icon: <Github size={18} />, label: 'GitHub' },
    { href: 'https://twitter.com', icon: <Twitter size={18} />, label: 'Twitter' },
    { href: 'https://instagram.com', icon: <Instagram size={18} />, label: 'Instagram' },
  ];

  return (
    <footer className="footer">
      <div className="footer__top-border" />

      <div className="footer__inner container">
        {/* Brand */}
        <div className="footer__brand">
          <NavLink to="/" className="footer__logo">
            <div className="footer__logo-icon">
              <Clapperboard size={16} color="#0a0a0f" strokeWidth={2.5} />
            </div>
            <span className="footer__logo-text">
              Cine<span>Vault</span>
            </span>
          </NavLink>
          <p className="footer__tagline">Your cinematic universe.</p>
          <div className="footer__socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-btn"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav Columns */}
        {navGroups.map((group) => (
          <div key={group.heading} className="footer__nav-group">
            <h3 className="footer__nav-heading">{group.heading}</h3>
            <ul className="footer__nav-list">
              {group.links.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="footer__nav-link">
                    {link.icon}
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Info column */}
        <div className="footer__info-group">
          <h3 className="footer__nav-heading">About</h3>
          <p className="footer__info-text">
            Powered by{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__tmdb-link"
            >
              TMDb
            </a>
            . This product uses the TMDb API but is not endorsed or certified by TMDb.
          </p>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copyright">
            © {year} <span>CineVault</span>. All rights reserved.
          </p>
          <p className="footer__made-with">
            Crafted with ♥ for cinema lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
