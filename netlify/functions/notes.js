let notes = [];

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Owner-Token',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
};

const response = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body)
});

const clean = (value, max) => String(value ?? '').trim().slice(0, max);

export const handler = async (request) => {
  if (request.httpMethod === 'OPTIONS') return { statusCode: 204, headers };

  const pathParts = request.path.split('/').filter(Boolean);
  const id = pathParts.at(-1) === 'notes' ? null : pathParts.at(-1);

  if (request.httpMethod === 'GET') {
    return response(200, [...notes].sort((a, b) => b.time - a.time));
  }

  if (request.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(request.body || '{}');
    } catch {
      return response(400, { error: 'Invalid JSON.' });
    }

    const name = clean(body.name, 40);
    const to = clean(body.to, 80) || 'All Teachers';
    const message = clean(body.message, 240);
    if (name.length < 2) return response(400, { error: 'Name must be at least 2 characters.' });
    if (message.length < 5) return response(400, { error: 'Message must be at least 5 characters.' });

    const note = {
      id: crypto.randomUUID(),
      name,
      to,
      message,
      time: Date.now(),
      ownerToken: crypto.randomUUID()
    };
    notes = [...notes, note];
    return response(201, note);
  }

  if (request.httpMethod === 'DELETE' && id) {
    const token = request.headers['x-owner-token'] || request.headers['X-Owner-Token'] || '';
    const note = notes.find(item => item.id === id);
    if (!note) return response(404, { error: 'Note not found.' });
    if (note.ownerToken !== token) return response(403, { error: 'Not allowed.' });
    notes = notes.filter(item => item.id !== id);
    return response(200, { ok: true });
  }

  return response(405, { error: 'Method not allowed.' });
};
