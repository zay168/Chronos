import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

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
  const { title, description, date, precision, timetableId, recurrenceRule, reminderAt } = req.body;
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
      recurrenceRule: recurrenceRule || null,
      reminderAt: reminderAt ? new Date(reminderAt) : null,
    }
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
        recurrenceRule: e.recurrenceRule || null,
        reminderAt: e.reminderAt ? new Date(e.reminderAt) : null,
      }
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
