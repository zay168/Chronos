import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { TimelineEntry } from '@/entities/TimelineEntry';
import { useSettings } from '@/src/SettingsContext';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface Props {
  timetableId: number | null;
}

export default function CalendarEditor({ timetableId }: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const { timeFormat } = useSettings();

  const formats = useMemo(() => {
    const fmt = timeFormat === '12h' ? 'hh:mm a' : 'HH:mm';
    return {
      timeGutterFormat: (date: Date, culture: string, localizer: any) =>
        localizer.format(date, fmt, culture),
      eventTimeRangeFormat: (
        { start, end }: { start: Date; end: Date },
        culture: string,
        localizer: any,
      ) =>
        `${localizer.format(start, fmt, culture)} - ${localizer.format(end, fmt, culture)}`,
    };
  }, [timeFormat]);

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
    await TimelineEntry.create({ title, description: '', date: start.toISOString(), precision: 'minute', timetableId });
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
        step={15}
        timeslots={4}
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        formats={formats}
      />
    </div>
  );
}
