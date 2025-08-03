import React, { useState, useEffect, useRef } from "react";
import { TimelineEntry } from "@/entities/TimelineEntry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import TimelineEntryComponent from "../components/timeline/TimelineEntry";
import TimelineLine from "../components/timeline/TimelineLine";
import { Calendar, TrendingUp } from "lucide-react";
import TimetableManager from "../components/admin/TimetableManager";

export default function Schedule() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [timetableId, setTimetableId] = useState<number | null>(null);

  useEffect(() => {
    if (timetableId) {
      loadEntries();
    } else {
      // No timetable selected: ensure we aren't stuck in loading state
      setEntries([]);
      setIsLoading(false);
    }
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, [timetableId]);

  const loadEntries = async () => {
    if (!timetableId) return;
    setIsLoading(true);
    try {
      const data = await TimelineEntry.list(timetableId);
      setEntries(data);
    } catch (error) {
      console.error("Error loading schedule entries:", error);
    }
    setIsLoading(false);
  };

  const searchEntries = async (query: string) => {
    if (!timetableId) return;
    setIsLoading(true);
    try {
      const data = await TimelineEntry.search(query, timetableId);
      setEntries(data);
    } catch (error) {
      console.error('Error searching schedule entries:', error);
    }
    setIsLoading(false);
  };

  const handleSearch = () => {
    if (search.trim() === '') {
      loadEntries();
    } else {
      searchEntries(search.trim());
    }
  };

  const scheduleHeight = entries.length > 0 ? entries.length * 180 + 120 : 400;
  const buffer = 5;
  const startIndex = Math.max(0, Math.floor(scrollTop / 180) - buffer);
  const endIndex = Math.min(
    entries.length,
    Math.ceil((scrollTop + containerHeight) / 180) + buffer
  );
  const visibleEntries = entries.slice(startIndex, endIndex);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, [entries]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-300 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-slate-200/60 mb-6">
            <Calendar className="w-6 h-6 text-amber-500" />
            <span className="text-slate-600 font-medium">Daily Schedule</span>
          </div>
          
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-amber-800 bg-clip-text text-transparent mb-4">
              Your Day Plan
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Plan your week and view each day with an intuitive schedule and clear visualizations
            </p>

          <div className="max-w-md mx-auto mt-8">
            <TimetableManager value={timetableId} onChange={setTimetableId} />
          </div>

          {entries.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-slate-600">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">{entries.length} Schedule Entries</span>
              </div>
            </div>
          )}

          <div className="max-w-md mx-auto mt-8 flex gap-2">
            <Input
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-slate-300 flex-1"
            />
            <Button
              onClick={handleSearch}
              className="bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
            >
              Search
            </Button>
          </div>
        </motion.div>

        {entries.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-8">
              <Calendar className="w-12 h-12 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Schedule Awaits</h2>
            <p className="text-slate-600 text-lg max-w-md mx-auto mb-8">
              Use the selector above to create a timetable, then add your first entry in the Admin Panel.
            </p>
          </motion.div>
        ) : (
          <div
            ref={containerRef}
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
            className="relative overflow-y-auto"
            style={{ height: '80vh' }}
          >
            <div className="relative" style={{ height: `${scheduleHeight}px` }}>
              <TimelineLine height={scheduleHeight} />

              {visibleEntries.map((entry, index) => (
                <TimelineEntryComponent
                  key={entry.id}
                  entry={entry}
                  position={startIndex + index}
                  isLeft={(startIndex + index) % 2 === 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}