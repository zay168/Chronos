import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { useSettings } from '@/src/SettingsContext';

export default function Settings() {
  const { darkMode, setDarkMode, timeFormat, setTimeFormat } = useSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-8">
      <Card className="max-w-xl mx-auto bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-lg dark:bg-slate-800/90 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="text-slate-700 dark:text-slate-200">Dark mode</Label>
            <input
              id="dark-mode"
              type="checkbox"
              checked={darkMode}
              onChange={e => setDarkMode(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="time-format" className="text-slate-700 dark:text-slate-200">Time format</Label>
            <Select
              value={timeFormat}
              onValueChange={v => setTimeFormat(v as '24h' | '12h')}
            >
              <SelectItem value="24h">24-hour</SelectItem>
              <SelectItem value="12h">12-hour</SelectItem>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
