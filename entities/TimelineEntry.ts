export interface TimelineEntryType {
  id: number;
  title: string;
  description: string;
  date: string;
  precision: 'year' | 'month' | 'day' | 'hour' | 'minute';
  recurrenceRule?: string | null;
  reminderAt?: string | null;
  createdAt: string;
  timetableId: number;
  tags: string[];
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

  static async search(query: string, timetableId: number): Promise<TimelineEntryType[]> {
    const params = new URLSearchParams({ q: query, timetableId: String(timetableId) });
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/search?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) throw new Error('Failed to search entries');
    return res.json();
  }


  static async create(data: Omit<TimelineEntryType, 'id' | 'createdAt'> & { tags?: string[] }): Promise<TimelineEntryType> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, tags: data.tags || [] })

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


  static async bulkCreate(entries: (Omit<TimelineEntryType, 'id' | 'createdAt'> & { tags?: string[] })[], timetableId: number): Promise<TimelineEntryType[]> {

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

  static async update(id: number, data: Pick<TimelineEntryType, 'title' | 'description' | 'date' | 'precision'>): Promise<TimelineEntryType> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update entry');
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

  static async scheduleReminder(id: number, reminderAt: string | null): Promise<TimelineEntryType> {
    const res = await fetch(`${API_URL}/${id}/reminder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reminderAt })
    });
    if (!res.ok) throw new Error('Failed to schedule reminder');
    return res.json();
  }

  static async generateRecurring(id: number, count: number): Promise<TimelineEntryType[]> {
    const res = await fetch(`${API_URL}/${id}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    });
    if (!res.ok) throw new Error('Failed to generate recurrence');
    return res.json();
  }
}
