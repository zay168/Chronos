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

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    res.status(409).json({ error: 'Username already exists' });
    return;
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { username, password: hashed } });
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

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
  if (req.path === '/login' || req.path === '/signup') return next();
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
app.get('/api/timetables', async (req, res) => {
  const userId = req.user?.userId;
  const timetables = await prisma.timetable.findMany({ where: { userId } });
  res.json(timetables);
});

app.post('/api/timetables', async (req, res) => {
  const { name } = req.body;
  const userId = req.user?.userId;
  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }
  const timetable = await prisma.timetable.upsert({
    where: { name_userId: { name, userId } },
    update: {},
    create: { name, userId }
  });
  res.json(timetable);
});

app.put('/api/timetables/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const userId = req.user?.userId;
  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }
  try {
    const updated = await prisma.timetable.updateMany({
      where: { id, userId },
      data: { name }
    });
    if (updated.count === 0) {
      res.status(404).json({ error: 'Timetable not found' });
      return;
    }
    const timetable = await prisma.timetable.findUnique({ where: { id } });
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
  const userId = req.user?.userId;
  await prisma.timelineEntry.deleteMany({ where: { timetableId: id, timetable: { userId } } });
  const result = await prisma.timetable.deleteMany({ where: { id, userId } });
  if (result.count === 0) {
    res.status(404).json({ error: 'Timetable not found' });
    return;
  }
  res.json({ success: true });
});

app.delete('/api/timetables', async (req, res) => {
  const userId = req.user?.userId;
  await prisma.timelineEntry.deleteMany({ where: { timetable: { userId } } });
  await prisma.timetable.deleteMany({ where: { userId } });
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
  const userId = req.user?.userId;
  const entries = await prisma.timelineEntry.findMany({
    where: {
      timetableId,
      timetable: { userId },
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
  const userId = req.user?.userId;
  const entries = await prisma.timelineEntry.findMany({
    where: { timetableId, timetable: { userId } },
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
  const userId = req.user?.userId;
  const timetable = await prisma.timetable.findFirst({ where: { id: timetableId, userId } });
  if (!timetable) {
    res.status(404).json({ error: 'Timetable not found' });
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
  const userId = req.user?.userId;
  const timetable = await prisma.timetable.findFirst({ where: { id: timetableId, userId } });
  if (!timetable) {
    res.status(404).json({ error: 'Timetable not found' });
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
  const userId = req.user?.userId;
  const updated = await prisma.timelineEntry.updateMany({
    where: { id, timetable: { userId } },
    data: { reminderAt: reminderAt ? new Date(reminderAt) : null }
  });
  if (updated.count === 0) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }
  const entry = await prisma.timelineEntry.findUnique({ where: { id } });
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
  const userId = req.user?.userId;
  const base = await prisma.timelineEntry.findFirst({ where: { id, timetable: { userId } } });
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
  const userId = req.user?.userId;
  if (!title || !date || !precision) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }
  const updated = await prisma.timelineEntry.updateMany({
    where: { id, timetable: { userId } },
    data: { title, description, date: new Date(date), precision }
  });
  if (updated.count === 0) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }
  const entry = await prisma.timelineEntry.findUnique({ where: { id } });
  res.json(entry);
});

app.delete('/api/entries/:id', async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user?.userId;
  const result = await prisma.timelineEntry.deleteMany({ where: { id, timetable: { userId } } });
  if (result.count === 0) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }
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
