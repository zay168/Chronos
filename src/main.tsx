import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../Layout';
import Admin from '../pages/admin';
import Schedule from '../pages/schedule';
import Settings from '../pages/settings';
import { SettingsProvider } from './SettingsContext';
import Login from '../pages/login';
import { AuthProvider, useAuth } from './AuthContext';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Layout currentPageName="Admin"><Admin /></Layout></ProtectedRoute>} />
            <Route path="/schedule" element={<Layout currentPageName="Schedule"><Schedule /></Layout>} />
            <Route path="/settings" element={<Layout currentPageName="Settings"><Settings /></Layout>} />
            <Route path="/" element={<Layout currentPageName="Schedule"><Schedule /></Layout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
