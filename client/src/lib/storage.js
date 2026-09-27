export const safeGet = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

export const safeSet = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
};

export const sessionGet = (key) => {
  try { return sessionStorage.getItem(key); } catch { return null; }
};

export const sessionSet = (key, value) => {
  try { sessionStorage.setItem(key, value); } catch { /* ignore */ }
};