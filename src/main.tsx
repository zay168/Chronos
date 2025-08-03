import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../Layout';
import Admin from '../pages/admin';
import Schedule from '../pages/schedule';
import Settings from '../pages/settings';
import { SettingsProvider } from './SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Layout currentPageName="Admin"><Admin /></Layout>} />
          <Route path="/schedule" element={<Layout currentPageName="Schedule"><Schedule /></Layout>} />
          <Route path="/settings" element={<Layout currentPageName="Settings"><Settings /></Layout>} />
          <Route path="/" element={<Layout currentPageName="Schedule"><Schedule /></Layout>} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
