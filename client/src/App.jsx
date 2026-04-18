import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnalysisProvider } from './context/AnalysisContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <AnalysisProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/analysis"  element={<AnalysisPage />} />
          <Route path="/history"   element={<HistoryPage />} />
        </Routes>
      </div>
    </AnalysisProvider>
  );
}
