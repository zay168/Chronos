export interface TimelineEntryType {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  importance: string;
  created_date: string;
}

const STORAGE_KEY = 'timelineEntries';

function loadEntries(): TimelineEntryType[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveEntries(entries: TimelineEntryType[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export class TimelineEntry {
  static async list(sortField: string = 'date', limit?: number): Promise<TimelineEntryType[]> {
    const entries = loadEntries();
    const desc = sortField.startsWith('-');
    const field = desc ? sortField.slice(1) : sortField;
    entries.sort((a, b) => {
      const av = a[field as keyof TimelineEntryType];
      const bv = b[field as keyof TimelineEntryType];
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
      return 0;
    });
    return limit ? entries.slice(0, limit) : entries;
  }

  static async create(data: Omit<TimelineEntryType, 'id' | 'created_date'>): Promise<TimelineEntryType> {
    const entries = loadEntries();
    const entry: TimelineEntryType = {
      ...data,
      id: Date.now().toString(),
      created_date: new Date().toISOString()
    };
    entries.push(entry);
    saveEntries(entries);
    return entry;
  }
}
