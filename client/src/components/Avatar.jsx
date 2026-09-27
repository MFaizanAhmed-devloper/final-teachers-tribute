import { useState } from 'react';

const HONORIFICS = ['madam', 'sir', 'mr', 'mrs', 'ms', 'miss', 'dr', 'prof'];
const PAIRS = [
  ['#ffd479', '#f0a92e'], ['#a5b4fc', '#6366f1'], ['#7dd3fc', '#0ea5e9'],
  ['#86efac', '#10b981'], ['#fda4af', '#e11d48'], ['#c4b5fd', '#8b5cf6'],
  ['#5eead4', '#14b8a6'], ['#fdba74', '#f97316']
];

export function initialsOf(name = '') {
  const parts = String(name)
    .split(/\s+/)
    .filter(w => w && !HONORIFICS.includes(w.toLowerCase().replace(/\./g, '')));
  return parts.slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'T';
}

export const pairFor = (index) => PAIRS[Math.abs(index) % PAIRS.length];

export const pairForText = (text = '') => {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 9973;
  return PAIRS[h % PAIRS.length];
};

export default function Avatar({ name, photo, index = 0, size = 'md', alt }) {
  const [failed, setFailed] = useState(false);
  const [a1, a2] = pairFor(index);
  const cls = size === 'xl' ? 'avatar avatar-xl'
             : size === 'lg' ? 'avatar avatar-lg'
             : 'avatar';

  const showPhoto = photo && !failed;

  return (
    <div className={cls} style={{ '--a1': a1, '--a2': a2 }} aria-hidden="true">
      {!showPhoto && <span>{initialsOf(name)}</span>}
      {showPhoto && (
        <img
          src={photo}
          alt={alt || name}
          loading="eager"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}