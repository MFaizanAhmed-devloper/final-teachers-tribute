import { useEffect, useState, useCallback } from 'react';

let externalShow = null;
export const showToast = (msg) => { externalShow?.(msg); };

export default function Toast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  const show = useCallback((message) => {
    setMsg(message);
    setVisible(true);
    clearTimeout(show._t);
    show._t = setTimeout(() => setVisible(false), 2600);
  }, []);

  useEffect(() => {
    externalShow = show;
    return () => { externalShow = null; };
  }, [show]);

  return (
    <div className={`toast ${visible ? 'show' : ''}`} role="status" aria-live="polite">
      {msg}
    </div>
  );
}