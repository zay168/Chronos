import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { TimelineEntry } from '@/entities/TimelineEntry';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface Props {
  timetableId: number | null;
}

export default function CalendarEditor({ timetableId }: Props) {
  const [events, setEvents] = useState<any[]>([]);

  const load = async () => {
    if (!timetableId) return;
    const data = await TimelineEntry.list(timetableId);
    setEvents(data.map(e => ({ id: e.id, title: e.title, start: new Date(e.date), end: new Date(e.date) })));
  };

  useEffect(() => {
    load();
  }, [timetableId]);

  const handleSelectSlot = async ({ start }: { start: Date }) => {
    if (!timetableId) return;
    const title = window.prompt('Event title');
    if (!title) return;
    await TimelineEntry.create({ title, description: '', date: start.toISOString(), precision: 'hour', timetableId });
    await load();
  };

  const handleSelectEvent = async (event: any) => {
    if (window.confirm('Delete this event?')) {
      await TimelineEntry.delete(event.id);
      await load();
    }
  };

  return (
    <div className="mt-8">
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        selectable
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
}
