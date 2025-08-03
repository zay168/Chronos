import React, { useState, useEffect } from 'react';
import { Timetable, TimetableType } from '@/entities/Timetable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Props {
  value: number | null;
  onChange: (id: number | null) => void;
}

export default function TimetableManager({ value, onChange }: Props) {
  const [timetables, setTimetables] = useState<TimetableType[]>([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await Timetable.list();
    setTimetables(data);
    if (!value && data.length > 0) onChange(data[0].id);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const t = await Timetable.create(newName.trim());
    setNewName('');
    await load();
    onChange(t.id);
  };

  const handleDelete = async (id?: number) => {
    await Timetable.delete(id);
    await load();
    if (id && value === id) {
      onChange(null);
    }
  };

  return (
    <div className="space-y-2">
      <Select value={value ? String(value) : undefined} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className="border-slate-200">
          <SelectValue placeholder="Select timetable" />
        </SelectTrigger>
        <SelectContent>
          {timetables.map((t) => (
            <SelectItem key={t.id} value={String(t.id)}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New timetable" className="border-slate-200 flex-1" />
        <Button onClick={handleCreate} className="bg-amber-500 text-white border-amber-600">Create</Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => handleDelete(value ?? undefined)} disabled={!value} className="flex-1 bg-red-500 text-white border-red-600 disabled:opacity-50">Delete</Button>
        <Button onClick={() => handleDelete()} className="flex-1 bg-red-500 text-white border-red-600">Delete All</Button>
      </div>
    </div>
  );
}
