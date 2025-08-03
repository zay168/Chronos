import React, { createContext, useContext, useEffect, useState } from 'react';

type TimeFormat = '24h' | '12h';
interface SettingsContextValue {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      return stored ? stored === 'true' : false;
    }
    return false;
  });

  const [timeFormat, setTimeFormatState] = useState<TimeFormat>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('timeFormat');
      return stored === '12h' ? '12h' : '24h';
    }
    return '24h';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('timeFormat', timeFormat);
  }, [timeFormat]);

  const setDarkMode = (value: boolean) => setDarkModeState(value);
  const setTimeFormat = (format: TimeFormat) => setTimeFormatState(format);

  return (
    <SettingsContext.Provider value={{ darkMode, setDarkMode, timeFormat, setTimeFormat }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};

