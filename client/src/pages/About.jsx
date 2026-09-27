import { student } from '../data/student.js';

export default function About() {
  return (
    <section className="section" style={{ paddingTop: 158 }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">About</span>
          <h2>About this tribute</h2>
          <p className="section-sub">A personal Teachers' Day project created by Faizan Ahmed, Class IX C.</p>
        </div>

        <div className="about-grid">
          <article className="about-card">
            <div className="about-icon" aria-hidden="true">📅</div>
            <h3>About the site</h3>
            <p>
              This website was created by Faizan Ahmed of Class IX C as a personal Teachers'
              Day tribute. It is not a school project, an official publication, or a
              commercial website — it is simply a student's way of thanking the people who
              teach him every day.
            </p>
          </article>

          <article className="about-card">
            <div className="about-icon" aria-hidden="true">💛</div>
            <h3>Who is included</h3>
            <p>
              Seven teachers and one Principal. No other staff, departments or people have
              been added.
            </p>
          </article>

          <article className="about-card">
            <div className="about-icon" aria-hidden="true">🌱</div>
            <h3>How it is organised</h3>
            <p>
              The site is organised like a small book. It opens with an introduction, then
              moves through the seven teachers in my class, then to a separate tribute for
              our Principal, Madam Nighat Maqsood, and finally to a page about the student
              who made it.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}