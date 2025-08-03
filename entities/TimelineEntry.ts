export interface TimelineEntryType {
  id: number;
  title: string;
  description: string;
  date: string;
  precision: 'year' | 'month' | 'day' | 'hour' | 'minute';
  createdAt: string;
  timetableId: number;
  tags: string[];
}

const API_URL = 'http://localhost:3001/api/entries';

export class TimelineEntry {
  static async list(timetableId: number): Promise<TimelineEntryType[]> {
    const params = new URLSearchParams({ timetableId: String(timetableId) });
    const res = await fetch(`${API_URL}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load entries');
    return res.json();
  }

  static async search({
    query = '',
    timetableId,
    startDate,
    endDate,
    tags,
  }: {
    query?: string;
    timetableId: number;
    startDate?: string;
    endDate?: string;
    tags?: string[];
  }): Promise<TimelineEntryType[]> {
    const params = new URLSearchParams({ timetableId: String(timetableId) });
    if (query) params.set('q', query);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (tags && tags.length) params.set('tags', tags.join(','));
    const res = await fetch(`${API_URL}/search?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to search entries');
    return res.json();
  }

  static async create(data: Omit<TimelineEntryType, 'id' | 'createdAt'> & { tags?: string[] }): Promise<TimelineEntryType> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, tags: data.tags || [] })
    });
    if (!res.ok) throw new Error('Failed to create entry');
    return res.json();
  }

  static async bulkCreate(entries: (Omit<TimelineEntryType, 'id' | 'createdAt'> & { tags?: string[] })[], timetableId: number): Promise<TimelineEntryType[]> {
    const res = await fetch(`${API_URL}/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries, timetableId })
    });
    if (!res.ok) throw new Error('Failed to import entries');
    return res.json();
  }

  static async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete entry');
  }
}
