import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { student } from '../data/student.js';

const LINKS = [
  { to: '/',          label: 'Home',        id: 'home' },
  { to: '/teachers',  label: 'My Teachers', id: 'teachers' },
  { to: '/principal', label: 'Principal',   id: 'principal' },
  { to: '/student',   label: 'My Page',     id: 'student' },
  { to: '/about',     label: 'About',       id: 'about' }
];

export default function MetaNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    document.body.classList.toggle('locked', open);
    return () => document.body.classList.remove('locked');
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className={`nav-backdrop ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      <header className={`nav-shell ${scrolled ? 'scrolled' : ''}`}>
        <nav className="nav-bar" aria-label="Primary">
          <Link className="brand" to="/" aria-label="Teachers' Day Tribute home">
            <span className="brand__orb" aria-hidden="true"><img className="book-icon" src="/tribute-logo.svg" alt="" /></span>
            <span className="brand__text">
              <strong>Teachers' Day</strong>
              <small>2026 · Tribute</small>
            </span>
          </Link>

          <ul className="nav-links">
            {LINKS.map(l => (
              <li key={l.id}>
                <NavLink to={l.to} end={l.to === '/'}>{l.label}</NavLink>
              </li>
            ))}
          </ul>

          <Link className="presence" to="/student" aria-label="Faizan Ahmed — Class IX C">
            <span className="presence__avatar" aria-hidden="true">{student.initials}</span>
            <span className="presence__meta">
              <strong>{student.name}</strong>
              <span>{student.klass} · Online</span>
            </span>
          </Link>

          <button
            className="nav-burger"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="nav-panel"
            onClick={() => setOpen(v => !v)}
            type="button"
          >
            <span /><span /><span />
          </button>

          <div id="nav-panel" className={`nav-panel ${open ? 'open' : ''}`} role="menu">
            <ul>
              {LINKS.map((l, i) => (
                <li key={l.id}>
                  <NavLink to={l.to} end={l.to === '/'}>
                    {l.label}
                    <span>{String(i + 1).padStart(2, '0')}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="nav-panel__foot">
              <Link className="presence" to="/student">
                <span className="presence__avatar" aria-hidden="true">{student.initials}</span>
                <span className="presence__meta">
                  <strong>{student.name}</strong>
                  <span>{student.klass}</span>
                </span>
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}