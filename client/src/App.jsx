import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnalysisProvider, useAuth } from './context/AnalysisContext';
import Navbar       from './components/Navbar';
import HomePage     from './pages/HomePage';
import AuthPage     from './pages/AuthPage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage  from './pages/HistoryPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/auth"    element={<AuthPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/history"  element={
          <ProtectedRoute><HistoryPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0d1220', color: '#e2e8f0',
            border: '1px solid #243452', borderRadius: 10,
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#0d1220' } },
          error:   { iconTheme: { primary: '#fb7185', secondary: '#0d1220' } },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AnalysisProvider>
      <AppRoutes />
    </AnalysisProvider>
  );
}
