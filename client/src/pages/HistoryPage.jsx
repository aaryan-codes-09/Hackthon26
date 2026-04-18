import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ExternalLink, Clock, GitBranch, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchHistory, fetchAnalysis, deleteAnalysis } from '../utils/api';
import { useAnalysis } from '../context/AnalysisContext';

export default function HistoryPage() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const { setAnalysis } = useAnalysis();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await fetchHistory();
      setItems(data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const open = async (id) => {
    try {
      const { data } = await fetchAnalysis(id);
      setAnalysis(data);
      navigate('/analysis');
    } catch (e) {
      toast.error('Failed to load: ' + (e.response?.data?.error || e.message));
    }
  };

  const remove = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteAnalysis(id);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <main style={{ flex:1, padding:'40px 32px', maxWidth:860, margin:'0 auto', width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 style={{ fontWeight:900, fontSize:'1.6rem', letterSpacing:'-0.03em', marginBottom:4 }}>
            <Clock size={20} style={{ verticalAlign:'middle', marginRight:8, color:'var(--cyan)' }}/>
            Analysis History
          </h1>
          <p style={{ color:'var(--text-2)', fontSize:'0.875rem' }}>
            Repositories you've analyzed — stored in MongoDB
          </p>
        </div>
        <button onClick={load} style={btnStyle} title="Refresh">
          <RefreshCw size={14}/> Refresh
        </button>
      </div>

      {loading && (
        <div style={{ display:'flex', gap:12, flexDirection:'column' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height:88, background:'var(--card)', borderRadius:14, border:'1px solid var(--border)', animation:'shimmer 1.5s infinite' }}/>
          ))}
          <style>{`@keyframes shimmer{0%,100%{opacity:0.6}50%{opacity:1}}`}</style>
        </div>
      )}

      {error && (
        <div style={{ padding:'20px 24px', background:'var(--red-dim)', border:'1px solid rgba(244,63,94,0.3)', borderRadius:12, color:'var(--red)', fontSize:'0.875rem' }}>
          ⚠ {error} — Make sure MongoDB is running.
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'64px 20px' }}>
          <div style={{ fontSize:'3rem', marginBottom:12 }}>📭</div>
          <h2 style={{ fontWeight:800, marginBottom:8 }}>No history yet</h2>
          <p style={{ color:'var(--text-2)', fontSize:'0.875rem' }}>Analyze a repository to see it here.</p>
          <button onClick={() => navigate('/')} style={{ ...btnStyle, marginTop:18 }}>
            Start Analyzing →
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, x:-20 }}
              transition={{ delay: i*0.06 }}
              onClick={() => open(item._id)}
              style={{
                background:'var(--card)', border:'1px solid var(--border)',
                borderRadius:14, padding:'18px 22px',
                display:'flex', alignItems:'center', gap:16,
                cursor:'pointer', transition:'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--cyan)'; e.currentTarget.style.background='var(--card2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--card)'; }}
            >
              {/* Icon */}
              <div style={{ width:44, height:44, borderRadius:12, background:'var(--cyan-dim)', border:'1px solid rgba(0,217,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'1.2rem' }}>
                📁
              </div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                  <span style={{ fontWeight:700, fontSize:'0.95rem', color:'var(--cyan)' }}>
                    {item.repoName}
                  </span>
                  <a href={`https://github.com/${item.repoName}`} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()} style={{ color:'var(--text-3)', lineHeight:0 }}>
                    <ExternalLink size={12}/>
                  </a>
                  {item.language && <span className="badge badge-cyan" style={{ fontSize:'0.66rem' }}>{item.language}</span>}
                </div>
                <div style={{ fontSize:'0.8rem', color:'var(--text-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:6 }}>
                  {item.description || 'No description'}
                </div>
                <div style={{ display:'flex', gap:12, fontSize:'0.72rem', color:'var(--text-3)', fontFamily:'var(--mono)' }}>
                  <span><GitBranch size={11} style={{ verticalAlign:'middle', marginRight:3 }}/>{item.totalFiles} files</span>
                  <span>{item.linesOfCode}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Delete */}
              <button onClick={e => remove(e, item._id)} style={{
                background:'transparent', border:'1px solid transparent', borderRadius:8,
                padding:'7px 10px', cursor:'pointer', color:'var(--text-3)',
                display:'flex', alignItems:'center', transition:'all 0.18s', flexShrink:0,
              }}
                onMouseEnter={e => { e.currentTarget.style.color='var(--red)'; e.currentTarget.style.borderColor='rgba(244,63,94,0.4)'; e.currentTarget.style.background='var(--red-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.color='var(--text-3)'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent'; }}
              >
                <Trash2 size={14}/>
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </main>
  );
}

const btnStyle = {
  display:'flex', alignItems:'center', gap:7,
  padding:'8px 16px', borderRadius:10, border:'1px solid var(--border)',
  background:'var(--card)', color:'var(--text-2)', cursor:'pointer',
  fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.8rem',
  transition:'all 0.18s',
};
