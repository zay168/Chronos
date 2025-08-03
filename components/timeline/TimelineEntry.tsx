import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useSettings } from "@/src/SettingsContext";

export default function TimelineEntry({ entry, position, isLeft }) {
  const { timeFormat } = useSettings();

  const formatEntryDate = (dateStr: string, precision: string) => {
    const date = parseISO(dateStr);
    switch (precision) {
      case 'year':
        return format(date, 'yyyy');
      case 'month':
        return format(date, 'MMMM yyyy');
      case 'day':
        return format(date, 'MMMM d, yyyy');
      case 'hour':
        return format(date, timeFormat === '12h' ? 'MMMM d, yyyy hh:00 a' : 'MMMM d, yyyy HH:00');
      case 'minute':
        return format(date, timeFormat === '12h' ? 'MMMM d, yyyy hh:mm a' : 'MMMM d, yyyy HH:mm');
      default:
        return format(date, 'MMMM d, yyyy');
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.6,
        delay: position * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className={`absolute ${isLeft ? 'right-1/2 pr-8' : 'left-1/2 pl-8'} w-1/2`}
      style={{ top: `${position * 180 + 60}px` }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-slate-800/90 dark:border-slate-700/60">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 dark:text-slate-100">{entry.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-3 dark:text-slate-300">
                {entry.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Calendar className="w-3 h-3" />
                {formatEntryDate(entry.date, entry.precision)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div
        className={`absolute top-8 ${isLeft ? '-right-2' : '-left-2'} w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-lg z-10`}
      />
    </motion.div>
  );
}
