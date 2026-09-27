import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { useLikes } from '../context/LikesContext.jsx';
import { showToast } from './Toast.jsx';

export default function TeacherCard({ teacher, index }) {
  const { has, toggle } = useLikes();
  const hasTributeHeart = teacher.id === 'miss-saima' || teacher.id === 'miss-samina';
  const liked = has(teacher.id);
  const likes = teacher.likes + (liked ? 1 : 0);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(teacher.id);
    showToast(liked ? 'Appreciation removed.' : `You appreciated ${teacher.name} 💛`);
  };

  const onMove = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <article
      className={`card ${teacher.featured ? 'is-featured' : ''}`}
      onMouseMove={onMove}
    >
      <div className="card-top">
        <Avatar name={teacher.name} photo={teacher.photo} index={index} />
        {hasTributeHeart && <span className="teacher-heart">♥</span>}
        <span className={`badge ${teacher.featured ? 'gold' : ''}`}>
          {teacher.featured ? '★ ' : ''}{teacher.designation}
        </span>
      </div>

      <h3>{teacher.name}</h3>
      <p className="subject">{teacher.subject}</p>
      <p className="short">{teacher.short}</p>

      <div className="card-actions">
        <Link className="btn btn-primary btn-sm" to={`/teachers/${teacher.id}`}>
          View Tribute
        </Link>
        <button
          type="button"
          className={`heart ${liked ? 'liked' : ''}`}
          aria-pressed={liked}
          aria-label={`Appreciate ${teacher.name}`}
          onClick={handleLike}
        >
          <span className="heart-icon" aria-hidden="true">♥</span>
          <span>{likes}</span>
        </button>
      </div>
    </article>
  );
}