import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Film, Tv, Home, Heart, Search, X, Menu, Clapperboard } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Home', icon: <Home size={15} />, exact: true },
  { to: '/movies', label: 'Movies', icon: <Film size={15} /> },
  { to: '/tvshows', label: 'TV Shows', icon: <Tv size={15} /> },
  { to: '/favorites', label: 'Favorites', icon: <Heart size={15} /> },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* Logo */}
          <NavLink to="/" className="navbar__logo">
            <div className="navbar__logo-icon">
              <Clapperboard size={18} color="#0a0a0f" strokeWidth={2.5} />
            </div>
            <span className="navbar__logo-text">Cine<span>Vault</span></span>
          </NavLink>

          {/* Nav Links */}
          <nav className="navbar__nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'active' : ''}`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Search */}
          <div className="navbar__right">
            <form onSubmit={handleSearch} className="navbar__search">
              <input
                ref={inputRef}
                type="text"
                className={`navbar__search-input ${searchOpen ? 'open' : ''}`}
                placeholder="Search movies, shows..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => { if (!query) setSearchOpen(false); }}
              />
              <button
                type={searchOpen ? 'submit' : 'button'}
                className={`navbar__icon-btn ${searchOpen ? 'active' : ''}`}
                onClick={() => !searchOpen && setSearchOpen(true)}
                aria-label="Search"
              >
                {searchOpen && query ? <Search size={18} /> : searchOpen && !query ? <X size={18} onClick={() => { setSearchOpen(false); setQuery(''); }} /> : <Search size={18} />}
              </button>
            </form>

            {/* Mobile hamburger */}
            <button
              className="navbar__hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} color="var(--clr-text)" /> : <Menu size={22} color="var(--clr-text-muted)" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <nav className={`navbar__mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) =>
              `navbar__mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--r-sm)',
              padding: '10px 16px',
              color: 'var(--clr-text)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'var(--clr-gold)',
              color: '#0a0a0f',
              fontWeight: 600,
              padding: '10px 20px',
              borderRadius: 'var(--r-sm)',
              fontSize: '0.9rem',
            }}
          >
            Go
          </button>
        </form>
      </nav>
    </>
  );
};

export default Navbar;
