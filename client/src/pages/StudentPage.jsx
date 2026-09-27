import { student } from '../data/student.js';
import Avatar from '../components/Avatar.jsx';

export default function StudentPage() {
  return (
    <section className="section" style={{ paddingTop: 158 }}>
      <div className="container">
        <div className="section-head">
          <Avatar name={student.name} photo={student.photo} size="lg" />
          <span className="eyebrow">The Student Behind the Tribute</span>
          <h2>{student.name}</h2>
          <p className="section-sub">{student.klass} · {student.occasion}</p>
          <p className="section-sub">{student.intro}</p>
        </div>

        <div className="why" style={{ marginBottom: 40 }}>
          <p>{student.about}</p>
          <p>{student.note}</p>
          <div className="why__sign">
            <b>{student.name}</b>
            <span>{student.klass} · {student.occasion}</span>
          </div>
        </div>

        <div className="about-grid">
          <article className="about-card">
            <div className="about-icon" aria-hidden="true">📝</div>
            <h3>Why I Created This Website</h3>
            <p>
              {student.whyCreated}
            </p>
          </article>

          <article className="about-card">
            <div className="about-icon" aria-hidden="true">🌱</div>
            <h3>My Journey</h3>
            <p>
              I am a curious learner who values discipline, effort, and respect. I am also
              interested in IT fields, and this tribute brought those interests together.
            </p>
          </article>

          <article className="about-card">
            <div className="about-icon" aria-hidden="true">💛</div>
            <h3>A Promise</h3>
            <p>
              To carry the values my teachers gave me far beyond these corridors and to
              keep learning with curiosity, discipline, effort, and respect.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}