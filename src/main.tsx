import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../Layout';
import Admin from '../pages/admin';
import Timeline from '../pages/timeline';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Layout currentPageName="Admin"><Admin /></Layout>} />
        <Route path="/timeline" element={<Layout currentPageName="Timeline"><Timeline /></Layout>} />
        <Route path="/" element={<Layout currentPageName="Timeline"><Timeline /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
