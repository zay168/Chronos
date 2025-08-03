export interface TimetableType {
  id: number;
  name: string;
}

const API_URL = 'http://localhost:3001/api/timetables';

export class Timetable {
  static async list(): Promise<TimetableType[]> {
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error('Failed to load timetables');
    return res.json();
  }

  static async create(name: string): Promise<TimetableType> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error('Failed to create timetable');
    return res.json();
  }

  static async delete(id?: number): Promise<void> {
    const url = id ? `${API_URL}/${id}` : API_URL;
    const token = localStorage.getItem('token');
    const res = await fetch(url, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error('Failed to delete timetable');
  }
}
