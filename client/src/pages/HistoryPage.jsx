import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink, Clock, GitBranch, RefreshCw, Database, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchHistory, fetchAnalysis, deleteAnalysis } from '../utils/api';
import { useAnalysis } from '../context/AnalysisContext';

const LANG_COLOR = { JavaScript:'#f7df1e', TypeScript:'#3178c6', Python:'#3776ab', Go:'#00add8', Rust:'#ce422b', Java:'#007396' };

export default function HistoryPage() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [opening, setOpening] = useState(null);
  const { setAnalysis } = useAnalysis();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true); setError(null);
    try { const { data } = await fetchHistory(); setItems(data); }
    catch (e) { setError(e.response?.data?.error || e.message); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const open = async (id) => {
    setOpening(id);
    try {
      const { data } = await fetchAnalysis(id);
      setAnalysis(data); navigate('/analysis');
    } catch (e) { toast.error('Failed to load: ' + (e.response?.data?.error || e.message)); }
    setOpening(null);
  };

  const remove = async (e, id) => {
    e.stopPropagation();
    try { await deleteAnalysis(id); setItems(prev => prev.filter(i => i._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <main style={{ flex:1, padding:'40px 28px 80px', maxWidth:900, margin:'0 auto', width:'100%' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:36, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'rgba(34,211,238,0.1)', border:'1px solid rgba(34,211,238,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Clock size={18} color="var(--cyan)"/>
            </div>
            <h1 style={{ fontWeight:900, fontSize:'1.6rem', letterSpacing:'-0.03em' }}>Analysis History</h1>
          </div>
          <p style={{ color:'var(--text-2)', fontSize:'0.85rem' }}>
            Previously analysed repositories — stored in MongoDB
          </p>
        </div>
        <button onClick={load} style={ghostBtn}>
          <RefreshCw size={13}/> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding:'16px 20px', background:'var(--red-dim)', border:'1px solid rgba(251,113,133,0.3)', borderRadius:12, color:'var(--red)', fontSize:'0.85rem', marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
          <Database size={15}/> {error} — Make sure MongoDB is running.
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height:90, background:'var(--card)', borderRadius:14, border:'1px solid var(--border)', opacity: 1 - i*0.15, animation:'pulse 1.5s ease-in-out infinite' }}/>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && items.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 20px', animation:'fadeUp 0.4s ease' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:16 }}>📭</div>
          <h2 style={{ fontWeight:800, fontSize:'1.3rem', marginBottom:8 }}>No analyses yet</h2>
          <p style={{ color:'var(--text-2)', fontSize:'0.875rem', marginBottom:24 }}>
            Analyze a repository to see it here.
          </p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Start analyzing <ArrowRight size={14}/>
          </button>
        </div>
      )}

      {/* List */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {items.map((item, i) => {
          const langColor = LANG_COLOR[item.language] || 'var(--cyan)';
          const isOpening = opening === item._id;
          return (
            <div key={item._id}
              onClick={() => open(item._id)}
              style={{
                background:'var(--card)', border:'1px solid var(--border)',
                borderRadius:14, padding:'18px 20px',
                display:'flex', alignItems:'center', gap:16,
                cursor:'pointer', transition:'all 0.18s',
                animation:`fadeUp 0.35s ease ${i * 0.05}s both`,
                opacity: isOpening ? 0.7 : 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(34,211,238,0.4)'; e.currentTarget.style.background='var(--card2)'; e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--card)'; e.currentTarget.style.transform='none'; }}
            >
              {/* Avatar */}
              <div style={{
                width:46, height:46, borderRadius:12, flexShrink:0,
                background:`${langColor}18`, border:`1px solid ${langColor}40`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem',
              }}>📁</div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
                  <span style={{ fontWeight:700, fontSize:'0.95rem', color:'var(--cyan)' }}>{item.repoName}</span>
                  <a href={`https://github.com/${item.repoName}`} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()} style={{ color:'var(--text-3)', lineHeight:0, display:'flex' }}>
                    <ExternalLink size={11}/>
                  </a>
                  {item.language && (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:'var(--mono)', fontSize:'0.66rem', padding:'2px 8px', borderRadius:10, background:`${langColor}18`, color:langColor, border:`1px solid ${langColor}30` }}>
                      {item.language}
                    </span>
                  )}
                </div>
                <div style={{ fontSize:'0.8rem', color:'var(--text-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:7 }}>
                  {item.description || 'No description available'}
                </div>
                <div style={{ display:'flex', gap:14, fontSize:'0.71rem', color:'var(--text-3)', fontFamily:'var(--mono)', flexWrap:'wrap' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><GitBranch size={10}/>{item.totalFiles} files</span>
                  {item.linesOfCode && <span>{item.linesOfCode}</span>}
                  <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</span>
                </div>
              </div>

              {/* Open indicator */}
              {isOpening ? (
                <div style={{ width:18, height:18, borderRadius:'50%', border:'2px solid var(--cyan)', borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }}/>
              ) : (
                <ArrowRight size={15} color="var(--text-3)" style={{ flexShrink:0, opacity:0.5 }}/>
              )}

              {/* Delete */}
              <button onClick={e => remove(e, item._id)} style={{
                background:'transparent', border:'1px solid transparent',
                borderRadius:8, padding:'7px 9px', cursor:'pointer',
                color:'var(--text-3)', display:'flex', alignItems:'center',
                transition:'all 0.18s', flexShrink:0,
              }}
                onMouseEnter={e => { e.currentTarget.style.color='var(--red)'; e.currentTarget.style.borderColor='rgba(251,113,133,0.3)'; e.currentTarget.style.background='var(--red-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.color='var(--text-3)'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent'; }}
              >
                <Trash2 size={13}/>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer count */}
      {!loading && items.length > 0 && (
        <div style={{ marginTop:20, textAlign:'center', fontSize:'0.75rem', color:'var(--text-3)', fontFamily:'var(--mono)' }}>
          {items.length} repositor{items.length === 1 ? 'y' : 'ies'} in history
        </div>
      )}
    </main>
  );
}

const ghostBtn = {
  display:'flex', alignItems:'center', gap:7,
  padding:'8px 16px', borderRadius:10,
  border:'1px solid var(--border2)', background:'transparent',
  color:'var(--text-2)', cursor:'pointer',
  fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.8rem',
  transition:'all 0.18s',
};
