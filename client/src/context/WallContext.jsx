import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchNotes, createNote, deleteNote } from '../lib/api.js';

const WallContext = createContext(null);

export function WallProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNotes();
      setNotes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const post = useCallback(async (payload) => {
    const note = await createNote(payload);
    setNotes(prev => [note, ...prev]);
    return note;
  }, []);

  const remove = useCallback(async (id, ownerToken) => {
    await deleteNote(id, ownerToken);
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const canDelete = useCallback((note) => {
    if (!note) return false;
    const stored = safeGetOwners();
    return note.ownerToken && stored.includes(note.ownerToken);
  }, []);

  const rememberOwn = useCallback((note) => {
    if (note?.ownerToken) {
      const arr = safeGetOwners();
      if (!arr.includes(note.ownerToken)) {
        arr.push(note.ownerToken);
        safeSetOwners(arr);
      }
    }
  }, []);

  return (
    <WallContext.Provider value={{ notes, loading, error, post, remove, reload, canDelete, rememberOwn }}>
      {children}
    </WallContext.Provider>
  );
}

const OWN_KEY = 'td_owners_v1';
const safeGetOwners = () => { try { return JSON.parse(localStorage.getItem(OWN_KEY) || '[]'); } catch { return []; } };
const safeSetOwners = (arr) => { try { localStorage.setItem(OWN_KEY, JSON.stringify(arr)); } catch {} };

export const useWall = () => {
  const ctx = useContext(WallContext);
  if (!ctx) throw new Error('useWall must be inside WallProvider');
  return ctx;
};