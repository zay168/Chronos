import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
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
  const entries = await prisma.timelineEntry.findMany({
    where: {
      timetableId,
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
  const { title, description, date, precision, timetableId } = req.body;
  if (!title || !date || !precision || !timetableId) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }
  const entry = await prisma.timelineEntry.create({
    data: { title, description, date: new Date(date), precision, timetableId }
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
      }
    });
    created.push(entry);
  }
  res.json(created);
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
