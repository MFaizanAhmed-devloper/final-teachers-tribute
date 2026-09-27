import Avatar, { initialsOf, pairFor } from './Avatar.jsx';
import { student } from '../data/student.js';

/* Rendered inside the tribute page but only visible during print. */
export default function PrintSheet({ teacher }) {
  if (!teacher) return null;
  const index = 0;
  const [a1, a2] = pairFor(index);

  return (
    <div className="print-only">
      <div className="print-sheet">
        <div className="pr-head">
          <p className="pr-eyebrow">Teachers' Day 2026</p>
          <h1 className="pr-title">A Tribute of Gratitude</h1>
          <p className="pr-byline">
            A personal tribute by {student.name} · {student.klass}
          </p>
          <p className="pr-date">{student.date}</p>
        </div>

        <div className="pr-identity">
          {teacher.photo ? (
            <img className="pr-photo" src={teacher.photo} alt="" />
          ) : (
            <div className="pr-photo pr-photo--initials" style={{ '--a1': a1, '--a2': a2 }}>
              <span>{initialsOf(teacher.name)}</span>
            </div>
          )}
          <div>
            <p className="pr-role">{teacher.designation}</p>
            <h2 className="pr-name">{teacher.name}</h2>
            <p className="pr-subject">{teacher.subject}</p>
          </div>
        </div>

        {teacher.quote && <div className="pr-quote">"{teacher.quote}"</div>}

        <div className="pr-section">
          <h3>Dear {teacher.name}</h3>
          {teacher.tribute.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="pr-thanks">
          <p className="pr-with">With Respect,</p>
          <p className="pr-from">{student.name}</p>
          <p className="pr-class">{student.klass} · Teachers' Day 2026</p>
        </div>

        <p className="pr-foot">
          Teachers' Day 2026 · A Personal Tribute by {student.name} · {student.klass}
        </p>
      </div>
    </div>
  );
}