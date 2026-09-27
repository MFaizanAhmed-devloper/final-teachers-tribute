const HEARTS = [
  { left: '7%', delay: '0s', duration: '14s', size: '1.1rem' },
  { left: '18%', delay: '4s', duration: '17s', size: '.8rem' },
  { left: '31%', delay: '9s', duration: '15s', size: '1.4rem' },
  { left: '46%', delay: '2s', duration: '19s', size: '.9rem' },
  { left: '61%', delay: '7s', duration: '16s', size: '1.2rem' },
  { left: '74%', delay: '11s', duration: '18s', size: '.75rem' },
  { left: '87%', delay: '5s', duration: '14s', size: '1.3rem' }
];

export default function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {HEARTS.map((heart, index) => (
        <span
          className="floating-heart"
          key={index}
          style={{
            '--heart-left': heart.left,
            '--heart-delay': heart.delay,
            '--heart-duration': heart.duration,
            '--heart-size': heart.size
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
