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
