import { Link } from 'react-router-dom';
import { teachers } from '../data/teachers.js';
import TeacherCard from '../components/TeacherCard.jsx';
import { useEffect, useRef, useState } from 'react';

function useCountUp(target, run) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return val;
}

function Stat({ value, suffix = '', label, to, run }) {
  const n = useCountUp(value, run);
  return (
    <Link className="stat" to={to}>
      <strong>{n.toLocaleString()}{suffix}</strong>
      <span>{label}</span>
    </Link>
  );
}

export default function Home() {
  const statsRef = useRef(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setRun(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRun(true); io.disconnect(); }
    }, { threshold: 0.3 });
    if (statsRef.current) io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  const featured = teachers.filter(t => !t.featured).slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="container hero-inner">
          <span className="pill">✦ 5 October 2026 · World Teachers' Day</span>
          <h1>
            For the teachers who make<br />
            <span className="gradient-text">learning meaningful.</span>
          </h1>
          <p className="lede">
            A personal Teachers' Day tribute from <b className="student-highlight">Faizan Ahmed</b>, Class IX C.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/teachers">Meet My Teachers →</Link>
            <Link className="btn btn-ghost" to="/student">Open the Tribute</Link>
          </div>
          <div className="stats" ref={statsRef}>
            <Stat value={7} label="Teachers" to="/teachers" run={run} />
            <Stat value={1} label="Principal" to="/principal" run={run} />
            <Stat value={1} label="Student" to="/student" run={run} />
            <Stat value={1} label="Tribute" to="/teachers" run={run} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Introduction</span>
            <h2>Before you turn the page</h2>
          </div>
          <div className="why">
            <p>
              Teachers' Day is a day to say out loud what we usually only think. This site is
              my way of saying it properly.
            </p>
            <p>
              Each of my seven teachers has a page of her own. Some sections are still waiting
              for my words — those are marked clearly, so I can write them in my own time
              rather than fill them with something that is not true.
            </p>
            <div className="why__sign">
              <b className="student-highlight">Faizan Ahmed</b>
              <span>Class IX C · Creator of this tribute</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Seven teachers</span>
            <h2>Every teacher has her own chapter.</h2>
            <p className="section-sub">
              Seven tributes, written one by one — and a separate page for our Principal.
            </p>
          </div>
          <div className="grid">
            {featured.map((t, i) => (
              <TeacherCard key={t.id} teacher={t} index={i} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link className="btn btn-primary" to="/teachers">See all teachers →</Link>
          </div>
        </div>
      </section>
    </>
  );
}