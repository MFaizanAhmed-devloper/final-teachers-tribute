import { useEffect, useState } from 'react';
import { sessionGet, sessionSet } from '../lib/storage.js';
import { student } from '../data/student.js';

const KEY = 'td_welcome_seen_v2';

export default function WelcomeScreen() {
  const [hidden, setHidden] = useState(() => sessionGet(KEY) === '1');
  const [removed, setRemoved] = useState(hidden);

  useEffect(() => {
    if (hidden) {
      const t = setTimeout(() => setRemoved(true), 100);
      return () => clearTimeout(t);
    }
    document.body.classList.add('locked');
    const auto = setTimeout(() => hide(), 3400);

    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') hide();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(auto);
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('locked');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  const hide = () => {
    setHidden(true);
    document.body.classList.remove('locked');
    sessionSet(KEY, '1');
    setTimeout(() => setRemoved(true), 1100);
  };

  if (removed) return null;

  return (
    <div
      className={`welcome ${hidden ? 'hidden' : ''}`}
      role="dialog"
      aria-label="Welcome"
      onClick={(e) => { if (!e.target.closest('.welcome__enter')) hide(); }}
    >
      <div className="welcome__grid" aria-hidden="true" />
      <div className="welcome__inner">
        <div className="welcome__mark" data-stagger="1" aria-hidden="true"><img className="book-icon" src="/tribute-logo.svg" alt="" /></div>
        <span className="welcome__eyebrow" data-stagger="2">{student.occasion} · {student.date}</span>
        <h1 className="welcome__title" data-stagger="3">{student.occasion}</h1>
        <p className="welcome__byline" data-stagger="4">
          A personal tribute by <b className="student-highlight">{student.name}</b> · {student.klass}
        </p>
        <div className="welcome__rule" data-stagger="4" aria-hidden="true" />
        <p className="welcome__byline" data-stagger="5"
           style={{ color: 'var(--muted)', fontSize: '.95rem', maxWidth: 520 }}>
          To every teacher who lit a path I hadn't yet seen —
          this page is my small, sincere thank-you.
        </p>
        <button
          className="welcome__enter"
          data-stagger="6"
          type="button"
          onClick={(e) => { e.stopPropagation(); hide(); }}
        >
          Enter the Tribute
          <svg viewBox="0 0 24 24" aria-hidden="true"
               style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none',
                        strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
        <p className="welcome__hint" data-stagger="6">or press Enter / click anywhere</p>
      </div>
      <div className="welcome__progress" aria-hidden="true"><i /></div>
    </div>
  );
}