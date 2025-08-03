export interface TimelineEntryType {
  id: number;
  title: string;
  description: string;
  date: string;
  precision: 'year' | 'month' | 'day' | 'hour' | 'minute';
  createdAt: string;
  timetableId: number;
}

const API_URL = 'http://localhost:3001/api/entries';

export class TimelineEntry {
  static async list(timetableId: number): Promise<TimelineEntryType[]> {
    const params = new URLSearchParams({ timetableId: String(timetableId) });
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error('Failed to load entries');
    return res.json();
  }

  static async search(query: string, timetableId: number): Promise<TimelineEntryType[]> {
    const params = new URLSearchParams({ q: query, timetableId: String(timetableId) });
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/search?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error('Failed to search entries');
    return res.json();
  }

  static async create(data: Omit<TimelineEntryType, 'id' | 'createdAt'>): Promise<TimelineEntryType> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create entry');
    return res.json();
  }

  static async bulkCreate(entries: Omit<TimelineEntryType, 'id' | 'createdAt'>[], timetableId: number): Promise<TimelineEntryType[]> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ entries, timetableId })
    });
    if (!res.ok) throw new Error('Failed to import entries');
    return res.json();
  }

  static async delete(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error('Failed to delete entry');
  }
}
