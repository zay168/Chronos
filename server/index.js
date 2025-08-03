import express from 'express';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.use('/api', (req, res, next) => {
  if (req.path === '/login') return next();
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
app.get('/api/timetables', async (_req, res) => {
  const timetables = await prisma.timetable.findMany();
  res.json(timetables);
});

app.post('/api/timetables', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }
  const timetable = await prisma.timetable.upsert({
    where: { name },
    update: {},
    create: { name }
  });
  res.json(timetable);
});

app.put('/api/timetables/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }
  try {
    const timetable = await prisma.timetable.update({
      where: { id },
      data: { name }
    });
    res.json(timetable);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(409).json({ error: 'Name must be unique' });
    } else {
      res.status(500).json({ error: 'Failed to update timetable' });
    }
  }
});

app.delete('/api/timetables/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.timelineEntry.deleteMany({ where: { timetableId: id } });
  await prisma.timetable.delete({ where: { id } });
  res.json({ success: true });
});

app.delete('/api/timetables', async (_req, res) => {
  await prisma.timelineEntry.deleteMany();
  await prisma.timetable.deleteMany();
  res.json({ success: true });
});

app.get('/api/entries/search', async (req, res) => {
  const query = req.query.q || '';
  const timetableId = Number(req.query.timetableId);
  const startDate = req.query.startDate ? new Date(String(req.query.startDate)) : undefined;
  const endDate = req.query.endDate ? new Date(String(req.query.endDate)) : undefined;
  const tags = typeof req.query.tags === 'string' && req.query.tags.length > 0
    ? String(req.query.tags).split(',')
    : [];
  const entries = await prisma.timelineEntry.findMany({
    where: {
      timetableId,
      ...(tags.length > 0 && { tags: { array_contains: tags } }),
      ...(startDate || endDate
        ? { date: { ...(startDate && { gte: startDate }), ...(endDate && { lte: endDate }) } }
        : {}),
      OR: [
        { title: { contains: String(query) } },
        { description: { contains: String(query) } }
      ]
    },
    orderBy: { date: 'asc' }
  });
  res.json(entries);
});

app.get('/api/entries', async (req, res) => {
  const timetableId = Number(req.query.timetableId);
  const entries = await prisma.timelineEntry.findMany({
    where: { timetableId },
    orderBy: { date: 'asc' }
  });
  res.json(entries);
});

app.post('/api/entries', async (req, res) => {
  const {
    title,
    description,
    date,
    precision,
    timetableId,
    tags = [],
    recurrenceRule,
    reminderAt,
  } = req.body;

  if (!title || !date || !precision || !timetableId) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  const entry = await prisma.timelineEntry.create({
    data: {
      title,
      description,
      date: new Date(date),
      precision,
      timetableId,
      tags,
      recurrenceRule: recurrenceRule || null,
      reminderAt: reminderAt ? new Date(reminderAt) : null,
    },
  });

  res.json(entry);
});

app.post('/api/entries/bulk', async (req, res) => {
  const { entries, timetableId } = req.body;
  if (!Array.isArray(entries) || !timetableId) {
    res.status(400).json({ error: 'Entries array or timetableId missing' });
    return;
  }
  const created = [];
  for (const e of entries) {
    if (!e.title || !e.date || !e.precision) continue;
    const entry = await prisma.timelineEntry.create({
      data: {
        title: e.title,
        description: e.description || '',
        date: new Date(e.date),
        precision: e.precision,
        timetableId,
        tags: e.tags || [],
        recurrenceRule: e.recurrenceRule || null,
        reminderAt: e.reminderAt ? new Date(e.reminderAt) : null,
      },
    });
    created.push(entry);
  }
  res.json(created);
});

app.post('/api/entries/:id/reminder', async (req, res) => {
  const id = Number(req.params.id);
  const { reminderAt } = req.body;
  const entry = await prisma.timelineEntry.update({
    where: { id },
    data: { reminderAt: reminderAt ? new Date(reminderAt) : null }
  });
  res.json(entry);
});

function getNextDate(date, rule) {
  const d = new Date(date);
  switch (rule) {
    case 'daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    default:
      throw new Error('Unsupported recurrence rule');
  }
  return d;
}

app.post('/api/entries/:id/generate', async (req, res) => {
  const id = Number(req.params.id);
  const { count = 1 } = req.body;
  const base = await prisma.timelineEntry.findUnique({ where: { id } });
  if (!base || !base.recurrenceRule) {
    res.status(400).json({ error: 'Entry not found or missing recurrence rule' });
    return;
  }
  const created = [];
  let date = new Date(base.date);
  for (let i = 0; i < count; i++) {
    date = getNextDate(date, base.recurrenceRule);
    const entry = await prisma.timelineEntry.create({
      data: {
        title: base.title,
        description: base.description,
        date,
        precision: base.precision,
        timetableId: base.timetableId,
        recurrenceRule: base.recurrenceRule,

      }
    });
    created.push(entry);
  }
  res.json(created);
});

app.put('/api/entries/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, date, precision } = req.body;
  if (!title || !date || !precision) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }
  const entry = await prisma.timelineEntry.update({
    where: { id },
    data: { title, description, date: new Date(date), precision }
  });
  res.json(entry);
});

app.delete('/api/entries/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.timelineEntry.delete({ where: { id } });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});

async function checkReminders() {
  const now = new Date();
  const due = await prisma.timelineEntry.findMany({
    where: {
      reminderAt: { lte: now }
    }
  });
  for (const entry of due) {
    console.log(`Reminder: ${entry.title} at ${entry.reminderAt}`);
    await prisma.timelineEntry.update({
      where: { id: entry.id },
      data: { reminderAt: null }
    });
  }
}

setInterval(checkReminders, 60000);
