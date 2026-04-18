import axios from 'axios';

// Fix: always point at the Express server explicitly
// The CRA proxy sometimes fails — this ensures calls always hit port 5000
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 120_000, // 2 min — Claude can be slow on big repos
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('rn_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Auth
export const registerUser  = (data)       => api.post('/auth/register', data);
export const loginUser     = (data)       => api.post('/auth/login',    data);
export const fetchMe       = ()           => api.get('/auth/me');

// Core
export const analyzeRepo   = (repo)                      => api.post('/analyze', { repo });
export const fetchHistory  = ()                          => api.get('/history');
export const fetchAnalysis = (id)                        => api.get(`/history/${id}`);
export const deleteAnalysis= (id)                        => api.delete(`/history/${id}`);
export const askQuestion   = (question, analysisId, ctx) => api.post('/query', { question, analysisId, repoContext: ctx });
export const healthCheck   = ()                          => api.get('/health');
