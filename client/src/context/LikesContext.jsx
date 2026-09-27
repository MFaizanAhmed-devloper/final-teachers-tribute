import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { safeGet, safeSet } from '../lib/storage.js';
import { fetchLikes, setTeacherLike } from '../lib/api.js';

const LikesContext = createContext(null);
const KEY = 'td_likes_v1';
const VOTER_KEY = 'td_voter_v1';

const getVoterId = () => {
  const existing = safeGet(VOTER_KEY, '');
  if (existing) return existing;
  const id = crypto.randomUUID();
  safeSet(VOTER_KEY, id);
  return id;
};

export function LikesProvider({ children }) {
  const [liked, setLiked] = useState(() => new Set(safeGet(KEY, [])));
  const [counts, setCounts] = useState({});
  const [pending, setPending] = useState(() => new Set());
  const [voterId] = useState(getVoterId);

  useEffect(() => { safeSet(KEY, Array.from(liked)); }, [liked]);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchLikes(voterId);
      setCounts(data.counts || {});
      setLiked(new Set(data.liked || []));
    } catch { /* Keep the current optimistic state while offline. */ }
  }, [voterId]);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const toggle = useCallback(async (id) => {
    if (pending.has(id)) return;
    const nextLiked = !liked.has(id);
    const previousCount = counts[id] || 0;

    setPending(prev => new Set(prev).add(id));
    setLiked(prev => {
      const next = new Set(prev);
      if (nextLiked) next.add(id); else next.delete(id);
      return next;
    });
    setCounts(prev => ({ ...prev, [id]: Math.max(0, previousCount + (nextLiked ? 1 : -1)) }));

    try {
      const result = await setTeacherLike(id, voterId, nextLiked);
      setCounts(prev => ({ ...prev, [id]: result.count }));
    } catch {
      setLiked(prev => {
        const next = new Set(prev);
        if (nextLiked) next.delete(id); else next.add(id);
        return next;
      });
      setCounts(prev => ({ ...prev, [id]: previousCount }));
      throw new Error('Like could not be saved.');
    } finally {
      setPending(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [counts, liked, pending, voterId]);

  const has = useCallback((id) => liked.has(id), [liked]);

  return (
    <LikesContext.Provider value={{ liked, counts, pending, toggle, has, count: liked.size }}>
      {children}
    </LikesContext.Provider>
  );
}

export const useLikes = () => {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error('useLikes must be inside LikesProvider');
  return ctx;
};
