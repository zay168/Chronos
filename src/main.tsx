import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../Layout';
import Admin from '../pages/admin';
import Schedule from '../pages/schedule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Layout currentPageName="Admin"><Admin /></Layout>} />
        <Route path="/schedule" element={<Layout currentPageName="Schedule"><Schedule /></Layout>} />
        <Route path="/" element={<Layout currentPageName="Schedule"><Schedule /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
