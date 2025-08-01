import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/entries', async (req, res) => {
  const entries = await prisma.timelineEntry.findMany({
    orderBy: { date: 'asc' }
  });
  res.json(entries);
});

app.post('/api/entries', async (req, res) => {
  const { title, description, date, precision } = req.body;
  if (!title || !date || !precision) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }
  const entry = await prisma.timelineEntry.create({
    data: { title, description, date: new Date(date), precision }
  });
  res.json(entry);
});

app.post('/api/entries/bulk', async (req, res) => {
  const { entries } = req.body;
  if (!Array.isArray(entries)) {
    res.status(400).json({ error: 'Entries array missing' });
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
      }
    });
    created.push(entry);
  }
  res.json(created);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
