import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nanoid } from 'nanoid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'notes.json');
const PORT = process.env.PORT || 5174;

const app = express();
app.use(cors());
app.use(express.json({ limit: '32kb' }));

/* ---------- Storage helpers ---------- */
async function readNotes() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeNotes(notes) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2), 'utf8');
}

const clean = (s, max) => String(s ?? '').trim().slice(0, max);

/* ---------- API ---------- */
app.get('/api/notes', async (_req, res) => {
  const notes = await readNotes();
  res.json(notes.sort((a, b) => b.time - a.time));
});

app.post('/api/notes', async (req, res) => {
  const { name, to, message } = req.body || {};
  const n = clean(name, 40);
  const t = clean(to, 80) || 'All Teachers';
  const m = clean(message, 240);

  if (n.length < 2) return res.status(400).json({ error: 'Name must be at least 2 characters.' });
  if (m.length < 5) return res.status(400).json({ error: 'Message must be at least 5 characters.' });

  const note = {
    id: nanoid(10),
    name: n,
    to: t,
    message: m,
    time: Date.now(),
    ownerToken: nanoid(16) // returned to client so only it can delete
  };

  const notes = await readNotes();
  notes.push(note);
  await writeNotes(notes);

  const { ownerToken, ...publicNote } = note;
  res.status(201).json({ ...publicNote, ownerToken });
});

app.delete('/api/notes/:id', async (req, res) => {
  const token = req.header('x-owner-token') || '';
  const notes = await readNotes();
  const idx = notes.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found.' });
  if (notes[idx].ownerToken !== token) return res.status(403).json({ error: 'Not allowed.' });

  notes.splice(idx, 1);
  await writeNotes(notes);
  res.json({ ok: true });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

/* ---------- Static serving in production ---------- */
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`\n  ✦ Teachers' Day API running on http://localhost:${PORT}\n`);
});