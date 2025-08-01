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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
