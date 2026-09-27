const BASE = '/api';

export async function fetchLikes(voterId) {
  const res = await fetch(`${BASE}/likes?voterId=${encodeURIComponent(voterId)}`);
  if (!res.ok) throw new Error('Could not load likes.');
  return res.json();
}

export async function setTeacherLike(teacherId, voterId, liked) {
  const res = await fetch(`${BASE}/likes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teacherId, voterId, liked })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Could not update like.');
  return data;
}

export async function fetchNotes() {
  try {
    const res = await fetch(`${BASE}/notes`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    // Fallback: if the API is unreachable, use localStorage
    try {
      const raw = localStorage.getItem('td_wall_fallback');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
}

export async function createNote(payload) {
  try {
    const res = await fetch(`${BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to post note.');
    return data;
  } catch (err) {
    // Fallback to localStorage for offline/file:// usage
    const note = {
      id: 'local-' + Date.now(),
      ...payload,
      time: Date.now(),
      ownerToken: 'local'
    };
    try {
      const raw = localStorage.getItem('td_wall_fallback');
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(note);
      localStorage.setItem('td_wall_fallback', JSON.stringify(arr));
    } catch { /* ignore */ }
    return note;
  }
}

export async function deleteNote(id, ownerToken) {
  try {
    const res = await fetch(`${BASE}/notes/${id}`, {
      method: 'DELETE',
      headers: { 'x-owner-token': ownerToken }
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to delete.');
    }
    return true;
  } catch {
    try {
      const raw = localStorage.getItem('td_wall_fallback');
      const arr = raw ? JSON.parse(raw) : [];
      const filtered = arr.filter(n => n.id !== id);
      localStorage.setItem('td_wall_fallback', JSON.stringify(filtered));
      return true;
    } catch { return false; }
  }
}
