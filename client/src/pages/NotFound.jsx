import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="notfound">
      <div>
        <p className="eyebrow">404</p>
        <h1>This page isn't in the tribute yet.</h1>
        <p>
          The page you're looking for doesn't exist — but every teacher's tribute is still
          waiting for you on the teachers page.
        </p>
        <Link className="btn btn-primary" to="/">Return Home →</Link>
      </div>
    </section>
  );
}