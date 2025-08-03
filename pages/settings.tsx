import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { useSettings } from '@/src/SettingsContext';
import { useTranslation } from '@/src/i18n';

export default function Settings() {
  const { darkMode, setDarkMode, timeFormat, setTimeFormat, language, setLanguage } = useSettings();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-8">
      <Card className="max-w-xl mx-auto bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-lg dark:bg-slate-800/90 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">{t('settings.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="text-slate-700 dark:text-slate-200">{t('settings.darkMode')}</Label>
            <input
              id="dark-mode"
              type="checkbox"
              checked={darkMode}
              onChange={e => setDarkMode(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="time-format" className="text-slate-700 dark:text-slate-200">{t('settings.timeFormat')}</Label>
            <Select
              value={timeFormat}
              onValueChange={v => setTimeFormat(v as '24h' | '12h')}
            >
              <SelectItem value="24h">{t('settings.timeFormat24')}</SelectItem>
              <SelectItem value="12h">{t('settings.timeFormat12')}</SelectItem>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="language" className="text-slate-700 dark:text-slate-200">{t('settings.language')}</Label>
            <Select
              value={language}
              onValueChange={v => setLanguage(v as 'en' | 'fr')}
            >
              <SelectItem value="en">{t('settings.english')}</SelectItem>
              <SelectItem value="fr">{t('settings.french')}</SelectItem>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

