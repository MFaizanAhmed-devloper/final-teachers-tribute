import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { safeGet, safeSet } from '../lib/storage.js';

const LikesContext = createContext(null);
const KEY = 'td_likes_v1';

export function LikesProvider({ children }) {
  const [liked, setLiked] = useState(() => new Set(safeGet(KEY, [])));

  useEffect(() => { safeSet(KEY, Array.from(liked)); }, [liked]);

  const toggle = useCallback((id) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const has = useCallback((id) => liked.has(id), [liked]);

  return (
    <LikesContext.Provider value={{ liked, toggle, has, count: liked.size }}>
      {children}
    </LikesContext.Provider>
  );
}

export const useLikes = () => {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error('useLikes must be inside LikesProvider');
  return ctx;
};