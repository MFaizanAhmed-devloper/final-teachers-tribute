import { useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getTeacherById, getAdjacentTeachers } from '../data/teachers.js';
import Avatar from '../components/Avatar.jsx';
import PrintSheet from '../components/PrintSheetComponent.jsx';
import { useLikes } from '../context/LikesContext.jsx';
import { showToast } from '../components/Toast.jsx';
import { student } from '../data/student.js';

export default function TeacherTribute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const teacher = getTeacherById(id);
  const { prev, next } = useMemo(() => getAdjacentTeachers(id), [id]);
  const { has, toggle } = useLikes();

  useEffect(() => {
    if (!teacher) navigate('/404', { replace: true });
    document.title = teacher
      ? `${teacher.name} — Teachers' Day 2026 Tribute`
      : 'Teachers\' Day 2026';
    return () => { document.title = "Teachers' Day 2026 | A Tribute by Faizan Ahmed"; };
  }, [teacher, navigate]);

  if (!teacher) return null;

  const idx = teacher.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const [a, b, c] = teacher.accent || ['rgba(242,193,78,.14)', 'rgba(123,108,255,.10)', 'rgba(63,208,201,.10)'];
  const liked = has(teacher.id);
  const likes = teacher.likes + (liked ? 1 : 0);

  const onLike = () => {
    toggle(teacher.id);
    showToast(liked ? 'Appreciation removed.' : `You appreciated ${teacher.name} 💛`);
  };

  return (
    <article
      className="tribute"
      style={{ '--ta': a, '--tb': b, '--tc': c }}
    >
      <div className="container tribute-inner">
        <div className="tribute-label">✦ A Tribute of Gratitude ✦</div>

        <div className="tribute-hero">
          <Avatar name={teacher.name} photo={teacher.photo} index={idx} size="xl" />
          <h1>{teacher.name}</h1>
          <p className="tribute-role">{teacher.designation}</p>
          <p className="tribute-subject">{teacher.subject}</p>
          <div className="tribute-meta">
            <span>{teacher.dept}</span>
            <span>Teachers' Day 2026</span>
          </div>
        </div>

        {teacher.quote && (
          <blockquote className="tribute-quote">"{teacher.quote}"</blockquote>
        )}

        <section className="tribute-section">
          <h2>Dear {teacher.name}</h2>
          {teacher.tribute.map((p, i) => <p key={i}>{p}</p>)}
        </section>

        {!teacher.featured && (
          <section className="tribute-section tribute-section--accent">
            <h2>What I Appreciate</h2>
            <ul>
              {teacher.appreciation.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        )}

        {!teacher.featured && (
          <section className="tribute-section">
            <h2>What I Learned</h2>
            <p>
              From you I learned more than just {teacher.subject.toLowerCase()} — I learned how
              to approach a problem calmly, how to be honest about what I don't know, and how
              to keep going when something feels hard.
            </p>
          </section>
        )}

        {!teacher.featured && (
          <section className="tribute-thanks">
            <h2>Thank You</h2>
            <p>
              For every lesson, every correction, every moment you chose to keep believing in
              your students — thank you. You have made a difference that will outlast this year.
            </p>
          </section>
        )}

        <div className="tribute-sign">
          <p>With Respect,</p>
          <b>{student.name}</b>
          <small>{student.klass} · {student.occasion}</small>
        </div>

        <div className="tribute-actions no-print">
          {!teacher.featured && (
            <button
              type="button"
              className={`btn ${liked ? 'btn-ghost' : 'btn-primary'}`}
              onClick={onLike}
              aria-pressed={liked}
            >
              <span aria-hidden="true">♥</span>
              {liked ? 'Appreciated' : 'Appreciate'} · {likes}
            </button>
          )}

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => window.print()}
          >
            🖨 Print This Tribute
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              const url = window.location.href;
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: `${teacher.name} — Teachers' Day Tribute`,
                    url
                  });
                  return;
                } catch { /* fall through */ }
              }
              try {
                await navigator.clipboard.writeText(url);
                showToast('Link copied to clipboard ✓');
              } catch {
                showToast(url);
              }
            }}
          >
            🔗 Share
          </button>
        </div>

        <nav className="tribute-nav no-print" aria-label="Teacher navigation">
          {prev
            ? <Link className="btn btn-ghost btn-sm" to={`/teachers/${prev.id}`}>← Previous: {prev.name}</Link>
            : <Link className="btn btn-ghost btn-sm" to="/teachers">← All Teachers</Link>}

          <Link className="btn btn-ghost btn-sm" to="/teachers">All Teachers</Link>

          {next
            ? <Link className="btn btn-ghost btn-sm" to={`/teachers/${next.id}`}>Next: {next.name} →</Link>
            : <Link className="btn btn-ghost btn-sm" to="/teachers">Back to All →</Link>}
        </nav>
      </div>

      <PrintSheet teacher={teacher} />
    </article>
  );
}