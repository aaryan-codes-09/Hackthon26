<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthCtx     = createContext(null);
const AnalysisCtx = createContext(null);

export function AnalysisProvider({ children }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [queries,  setQueries]  = useState([]);

  // Auth state
  const [user,        setUser]        = useState(() => {
    try { return JSON.parse(localStorage.getItem('rn_user') || 'null'); } catch { return null; }
  });
  const [authLoading, setAuthLoading] = useState(false);

  const login = (token, userData) => {
    localStorage.setItem('rn_token', token);
    localStorage.setItem('rn_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('rn_token');
    localStorage.removeItem('rn_user');
    setUser(null);
  };

  const addQuery = (q, a) => setQueries(prev => [...prev, { question: q, answer: a, ts: Date.now() }]);

  return (
    <AuthCtx.Provider value={{ user, login, logout, authLoading, setAuthLoading }}>
      <AnalysisCtx.Provider value={{ analysis, setAnalysis, loading, setLoading, error, setError, queries, addQuery }}>
        {children}
      </AnalysisCtx.Provider>
    </AuthCtx.Provider>
  );
}

export const useAnalysis = () => useContext(AnalysisCtx);
export const useAuth     = () => useContext(AuthCtx);
=======
import React, { createContext, useContext, useState } from 'react';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [analysis, setAnalysis]     = useState(null);
  const [loading,  setLoading]      = useState(false);
  const [error,    setError]        = useState(null);
  const [queries,  setQueries]      = useState([]);

  const addQuery = (q, a) => setQueries(prev => [{ q, a, id: Date.now() }, ...prev]);
  const clearAnalysis = () => { setAnalysis(null); setError(null); setQueries([]); };

  return (
    <AnalysisContext.Provider value={{
      analysis, setAnalysis,
      loading,  setLoading,
      error,    setError,
      queries,  addQuery,
      clearAnalysis,
    }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export const useAnalysis = () => useContext(AnalysisContext);
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
