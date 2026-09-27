import { useMemo, useState } from 'react';
import { teachers } from '../data/teachers.js';
import TeacherCard from '../components/TeacherCard.jsx';

export default function Teachers() {
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('All');
  const teacherList = teachers.filter(t => !t.featured);

  const departments = useMemo(
    () => ['All', ...new Set(teacherList.map(t => t.dept))],
    []
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teachers.filter(t => {
      const okDept = dept === 'All' || t.dept === dept;
      const hay = `${t.name} ${t.subject} ${t.designation} ${t.dept}`.toLowerCase();
      return !t.featured && okDept && (q === '' || hay.includes(q));
    });
  }, [query, dept]);

  return (
    <section className="section" style={{ paddingTop: 158 }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Seven teachers</span>
          <h2>My Teachers</h2>
          <p className="section-sub">
            Seven teachers, each with a page of her own. Our Principal, Maam Nighat Maqsood,
            has a separate tribute below.
          </p>
        </div>

        <div className="toolbar">
          <div className="search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              type="search"
              placeholder="Search by name, subject or role…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search teachers"
            />
          </div>
          <div className="chips" role="tablist" aria-label="Filter by department">
            {departments.map(d => (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={dept === d}
                className={`chip ${dept === d ? 'active' : ''}`}
                onClick={() => setDept(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <p className="empty">No teachers match your search. Try a different name or department.</p>
        ) : (
          <div className="grid">
            {list.map((t, i) => (
              <TeacherCard key={t.id} teacher={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}