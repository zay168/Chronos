export interface TimelineEntryType {
  id: number;
  title: string;
  description: string;
  date: string;
  precision: 'year' | 'month' | 'day' | 'hour';
  createdAt: string;
}

const API_URL = 'http://localhost:3001/api/entries';

export class TimelineEntry {
  static async list(): Promise<TimelineEntryType[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to load entries');
    return res.json();
  }

  static async search(query: string): Promise<TimelineEntryType[]> {
    const params = new URLSearchParams({ q: query });
    const res = await fetch(`${API_URL}/search?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to search entries');
    return res.json();
  }

  static async create(data: Omit<TimelineEntryType, 'id' | 'createdAt'>): Promise<TimelineEntryType> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create entry');
    return res.json();
  }

  static async bulkCreate(entries: Omit<TimelineEntryType, 'id' | 'createdAt'>[]): Promise<TimelineEntryType[]> {
    const res = await fetch(`${API_URL}/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries })
    });
    if (!res.ok) throw new Error('Failed to import entries');
    return res.json();
  }
}
