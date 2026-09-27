import { teachers } from '../data/teachers.js';
import TeacherCard from '../components/TeacherCard.jsx';

export default function Principal() {
  const featured = teachers.filter(t => t.featured);
  return (
    <section className="section" style={{ paddingTop: 158 }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">A tribute to our Principal</span>
          <h2>Maam Nighat Maqsood</h2>
          <p className="section-sub">
            Our Principal, remembered with respect and gratitude.
          </p>
        </div>
        <div className="grid">
          {featured.map((t, i) => (
            <TeacherCard key={t.id} teacher={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}