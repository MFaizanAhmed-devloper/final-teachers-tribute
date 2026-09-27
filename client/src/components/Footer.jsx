import { Link } from 'react-router-dom';
import { student } from '../data/student.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer no-print">
      <div className="container footer-inner">
        <p className="heart-line">Made with respect and gratitude.</p>
        <p>
          Teachers' Day 2026 · A personal tribute by {student.name} · {student.klass}
        </p>
        <p style={{ fontSize: '.82rem', opacity: .8 }}>{student.date}</p>
        <nav className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/teachers">My Teachers</Link>
          <Link to="/principal">Principal</Link>
          <Link to="/student">My Page</Link>
          <Link to="/about">About</Link>
        </nav>
        <p style={{ fontSize: '.78rem', opacity: .65 }}>
          © {year} Teachers' Day Tribute.
        </p>
      </div>
    </footer>
  );
} 