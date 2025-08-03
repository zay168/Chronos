import React, { useState, useEffect } from 'react';
import { Timetable, TimetableType } from '@/entities/Timetable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTranslation } from '@/src/i18n';

interface Props {
  value: number | null;
  onChange: (id: number | null) => void;
}

export default function TimetableManager({ value, onChange }: Props) {
  const [timetables, setTimetables] = useState<TimetableType[]>([]);
  const [newName, setNewName] = useState('');
  const [renameName, setRenameName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ id?: number; countdown: number } | null>(null);
  const { t } = useTranslation();

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

  const handleRename = async () => {
    if (!value || !renameName.trim()) return;
    await Timetable.update(value, renameName.trim());
    await load();
  };

  const handleDelete = async (id?: number) => {
    await Timetable.delete(id);
    await load();
    if (id && value === id) {
      onChange(null);
    }
  };

  useEffect(() => {
    if (!confirmDelete) return;
    if (confirmDelete.countdown <= 0) {
      handleDelete(confirmDelete.id);
      setConfirmDelete(null);
      return;
    }
    const timer = setTimeout(() => {
      setConfirmDelete((c) => (c ? { ...c, countdown: c.countdown - 1 } : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  useEffect(() => {
    const current = timetables.find((t) => t.id === value);
    setRenameName(current ? current.name : '');
  }, [value, timetables]);

  const initiateDelete = (id?: number) => {
    setConfirmDelete({ id, countdown: 5 });
  };

  return (
    <div className="space-y-2">
      <Select value={value ? String(value) : undefined} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className="border-slate-200">
          <SelectValue placeholder={t('timetableManager.selectPlaceholder')} />
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
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={t('timetableManager.newPlaceholder')} className="border-slate-200 flex-1" />
        <Button onClick={handleCreate} className="bg-amber-500 text-white border-amber-600">{t('timetableManager.create')}</Button>
      </div>
      <div className="flex gap-2">
        <Input value={renameName} onChange={(e) => setRenameName(e.target.value)} placeholder={t('timetableManager.renamePlaceholder')} className="border-slate-200 flex-1" />
        <Button onClick={handleRename} disabled={!value} className="bg-blue-500 text-white border-blue-600 disabled:opacity-50">{t('timetableManager.rename')}</Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => initiateDelete(value ?? undefined)} disabled={!value} className="flex-1 bg-red-500 text-white border-red-600 disabled:opacity-50">{t('timetableManager.delete')}</Button>
        <Button onClick={() => initiateDelete()} className="flex-1 bg-red-500 text-white border-red-600">{t('timetableManager.deleteAll')}</Button>
      </div>
      {confirmDelete && (
        <div className="flex items-center gap-2 text-sm text-red-700">
          <span>{t('timetableManager.deletingIn')} {confirmDelete.countdown}...</span>
          <Button onClick={async () => { await handleDelete(confirmDelete.id); setConfirmDelete(null); }} className="bg-red-500 text-white border-red-600">{t('timetableManager.confirmNow')}</Button>
          <Button onClick={() => setConfirmDelete(null)} className="border-slate-200">{t('timetableManager.cancel')}</Button>
        </div>
      )}
    </div>
  );
}
