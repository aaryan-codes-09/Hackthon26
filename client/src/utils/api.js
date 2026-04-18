import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const analyzeRepo   = (repo)                       => api.post('/analyze', { repo });
export const fetchHistory  = ()                           => api.get('/history');
export const fetchAnalysis = (id)                         => api.get(`/history/${id}`);
export const deleteAnalysis= (id)                         => api.delete(`/history/${id}`);
export const askQuestion   = (question, analysisId, ctx)  => api.post('/query', { question, analysisId, repoContext: ctx });
export const healthCheck   = ()                           => api.get('/health');
