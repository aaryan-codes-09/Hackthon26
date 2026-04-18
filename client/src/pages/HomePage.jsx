import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Sparkles, GitBranch, Layers, Map } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeRepo } from '../utils/api';
import { useAnalysis } from '../context/AnalysisContext';

const EXAMPLES = [
  'facebook/react', 'vercel/next.js', 'expressjs/express',
  'fastapi/fastapi', 'django/django', 'vuejs/vue',
];

const STEPS = [
  'Fetching repository structure…',
  'Parsing file dependencies…',
  'Classifying modules…',
  'Generating AI summaries…',
  'Building architecture graph…',
  'Finalising analysis…',
];

const FEATURES = [
  { icon: <Map size={22}/>,       title: 'Interactive Graph',     desc: 'Visual dependency map you can drag, zoom, and click' },
  { icon: <Layers size={22}/>,    title: 'Module Classification', desc: 'Auto-detect entry points, core logic, utils & externals' },
  { icon: <Sparkles size={22}/>,  title: 'AI Summaries',          desc: 'Plain-language explanation for every file' },
  { icon: <GitBranch size={22}/>, title: 'Onboarding Path',       desc: 'Ordered reading list for new developers' },
];

export default function HomePage() {
  const [url,       setUrl]       = useState('');
  const [stepIdx,   setStepIdx]   = useState(-1);
  const { setAnalysis, setLoading, setError, loading } = useAnalysis();
  const navigate = useNavigate();

  const run = async (repo) => {
    const r = (repo || url).trim().replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');
    if (!r || !r.includes('/')) { toast.error('Enter a valid repo: owner/name'); return; }

    setLoading(true); setStepIdx(0);
    for (let i = 1; i <= STEPS.length; i++) {
      await new Promise(res => setTimeout(res, 700));
      setStepIdx(i);
    }

    try {
      const { data } = await analyzeRepo(r);
      setAnalysis(data);
      setLoading(false); setStepIdx(-1);
      navigate('/analysis');
    } catch (e) {
      setError(e.response?.data?.error || e.message);
      setLoading(false); setStepIdx(-1);
      toast.error('Analysis failed: ' + (e.response?.data?.error || e.message));
    }
  };

  return (
    <main style={{ flex: 1, padding: '60px 32px 80px', maxWidth: 900, margin: '0 auto', width: '100%' }}>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge badge-cyan" style={{ marginBottom: 18, display: 'inline-flex' }}>
            <Sparkles size={11}/> PS3 · DevClash 2026 · MERN Stack
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 16 }}>
            Understand Any Codebase<br />
            <span className="gradient-text">In Seconds.</span>
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Paste a GitHub repo URL. Get an interactive architecture graph, AI-generated file summaries, and a recommended onboarding path — instantly.
          </p>
        </div>
      </motion.div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
        <div style={{
          display: 'flex', gap: 10, background: 'var(--card)', border: '1px solid var(--border2)',
          borderRadius: 16, padding: '6px 6px 6px 20px', alignItems: 'center',
          boxShadow: '0 0 0 0 transparent', transition: 'box-shadow 0.2s',
        }}
          onFocus={() => {}} // could add glow on focus
        >
          <Search size={17} color="var(--text-3)" style={{ flexShrink: 0 }} />
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="github.com/owner/repo  or  owner/repo"
            disabled={loading}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: '0.9rem',
              padding: '10px 0',
            }}
          />
          <button
            onClick={() => run()}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'var(--card2)' : 'linear-gradient(135deg, var(--cyan), #3b82f6)',
              color: loading ? 'var(--text-3)' : '#060a0f',
              fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '0.9rem',
              boxShadow: loading ? 'none' : 'var(--glow-cyan)',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Analyzing…' : <><ArrowRight size={16} /> Analyze</>}
          </button>
        </div>

        {/* Example chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>Try:</span>
          {EXAMPLES.map(ex => (
            <button key={ex} onClick={() => { setUrl(ex); run(ex); }} disabled={loading} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '4px 12px', cursor: 'pointer',
              color: 'var(--text-2)', fontSize: '0.78rem', fontFamily: 'var(--mono)',
              transition: 'all 0.18s',
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--cyan)'; e.target.style.color = 'var(--cyan)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-2)'; }}
            >{ex}</button>
          ))}
        </div>
      </motion.div>

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              marginTop: 40, background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '32px', textAlign: 'center',
            }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <Spinner />
            </div>
            <div style={{ fontWeight: 700, marginBottom: 20 }}>Analyzing repository with Claude AI…</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{
                  fontFamily: 'var(--mono)', fontSize: '0.78rem',
                  color: i < stepIdx ? 'var(--green)' : i === stepIdx ? 'var(--cyan)' : 'var(--text-3)',
                  transition: 'color 0.3s',
                }}>
                  {i < stepIdx ? '✓ ' : i === stepIdx ? '⟳ ' : '  '}{step}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature cards */}
      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, marginTop: 60 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08 }}
              style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '22px 20px', position: 'relative', overflow: 'hidden',
              }}>
              <div style={{ color: 'var(--cyan)', marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.95rem' }}>{f.title}</div>
              <div style={{ color: 'var(--text-2)', fontSize: '0.82rem', lineHeight: 1.55 }}>{f.desc}</div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, var(--cyan), var(--violet))`, opacity: 0.5 }} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}

function Spinner() {
  return (
    <div style={{ position: 'relative', width: 52, height: 52 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '2px solid transparent', borderTopColor: 'var(--cyan)',
        animation: 'spin 0.9s linear infinite',
      }} />
      <div style={{
        position: 'absolute', inset: 9, borderRadius: '50%',
        border: '2px solid transparent', borderBottomColor: 'var(--violet)',
        animation: 'spin 1.3s linear infinite reverse',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
