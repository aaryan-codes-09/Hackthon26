<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, GitBranch, Layers, Map, Zap, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeRepo } from '../utils/api';
import { useAnalysis, useAuth } from '../context/AnalysisContext';

const EXAMPLES = ['facebook/react', 'vercel/next.js', 'expressjs/express', 'fastapi/fastapi', 'django/django'];
=======
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
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e

const STEPS = [
  'Fetching repository structure…',
  'Parsing file dependencies…',
  'Classifying modules…',
  'Generating AI summaries…',
  'Building architecture graph…',
  'Finalising analysis…',
];

const FEATURES = [
<<<<<<< HEAD
  { icon: Map,       color: 'var(--cyan)',   title: 'Interactive Graph',     desc: 'Drag, zoom, and click nodes to explore dependencies visually' },
  { icon: Layers,    color: 'var(--violet)', title: 'Module Classification', desc: 'Auto-detects entry points, core logic, utilities & externals' },
  { icon: Sparkles,  color: 'var(--amber)',  title: 'AI Summaries',          desc: 'Plain-English explanation for every single file' },
  { icon: GitBranch, color: 'var(--green)',  title: 'Onboarding Path',       desc: 'Ordered reading list so new devs ramp up fast' },
  { icon: Shield,    color: 'var(--red)',    title: 'Risk Heatmap',          desc: 'High-impact files highlighted to show where changes are risky' },
  { icon: Clock,     color: 'var(--cyan)',   title: 'History',               desc: 'Every analysis saved — revisit any repo anytime' },
];

const STATS = [
  { num: '10s', label: 'Average analysis time' },
  { num: '28+', label: 'Files mapped per repo' },
  { num: 'AI',  label: 'Powered by Claude' },
  { num: '∞',   label: 'Repos you can analyze' },
];

export default function HomePage() {
  const [url,     setUrl]     = useState('');
  const [stepIdx, setStepIdx] = useState(-1);
  const { setAnalysis, setLoading, setError, loading } = useAnalysis();
  const { user } = useAuth();
  const navigate = useNavigate();

  const run = async (repo) => {
    const r = (repo || url).trim()
      .replace(/^https?:\/\/(www\.)?github\.com\//, '')
      .replace(/\/$/, '');
    if (!r || !r.includes('/')) { toast.error('Enter a valid repo: owner/name'); return; }

    setLoading(true); setStepIdx(0);
    const interval = setInterval(() => {
      setStepIdx(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const { data } = await analyzeRepo(r);
      clearInterval(interval);
=======
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
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
      setAnalysis(data);
      setLoading(false); setStepIdx(-1);
      navigate('/analysis');
    } catch (e) {
<<<<<<< HEAD
      clearInterval(interval);
      const msg = e.response?.data?.error || e.message || 'Network error — is the server running?';
      setError(msg);
      setLoading(false); setStepIdx(-1);
      toast.error(msg, { duration: 5000 });
=======
      setError(e.response?.data?.error || e.message);
      setLoading(false); setStepIdx(-1);
      toast.error('Analysis failed: ' + (e.response?.data?.error || e.message));
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
    }
  };

  return (
<<<<<<< HEAD
    <div style={{ flex: 1 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(60px, 10vh, 100px) 24px 80px',
        textAlign: 'center',
      }}>
        {/* BG glow blobs */}
        <div style={{ position:'absolute', top:'-10%', left:'15%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-5%', right:'10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize:'64px 64px', opacity:0.25, pointerEvents:'none' }} />

        <div style={{ position:'relative', maxWidth:760, margin:'0 auto' }}>
          {/* Pill */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(34,211,238,0.08)', border:'1px solid rgba(34,211,238,0.2)', borderRadius:20, padding:'5px 14px', marginBottom:28, fontSize:'0.76rem', color:'var(--cyan)', fontFamily:'var(--mono)' }}>
            <Sparkles size={11}/> PS3 · DevClash 2026 — Built with Claude AI
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 900,
            lineHeight: 1.06, letterSpacing: '-0.04em', marginBottom: 20,
          }}>
            Understand Any Codebase<br />
            <span className="gradient-text">In Seconds.</span>
          </h1>

          <p style={{ color:'var(--text-2)', fontSize:'clamp(1rem, 2vw, 1.15rem)', lineHeight:1.7, maxWidth:560, margin:'0 auto 44px' }}>
            Paste a GitHub URL. Get an interactive architecture graph, AI-generated file summaries, and a recommended developer onboarding path — powered by Claude.
          </p>

          {/* Search bar */}
          <div style={{
            display:'flex', gap:0, background:'rgba(13,18,32,0.9)',
            border:'1px solid var(--border2)', borderRadius:14, padding:'5px 5px 5px 20px',
            alignItems:'center', maxWidth:620, margin:'0 auto',
            boxShadow:'0 0 0 1px transparent', transition:'box-shadow 0.2s',
          }}
            onFocusCapture={e => e.currentTarget.style.boxShadow='0 0 0 2px rgba(34,211,238,0.3)'}
            onBlurCapture={e => e.currentTarget.style.boxShadow='0 0 0 1px transparent'}
          >
            <Search size={16} color="var(--text-3)" style={{ flexShrink:0 }} />
            <input
              value={url} onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && run()}
              placeholder="github.com/owner/repo  or  owner/repo"
              disabled={loading}
              style={{
                flex:1, background:'transparent', border:'none', outline:'none',
                color:'var(--text)', fontFamily:'var(--mono)', fontSize:'0.88rem',
                padding:'10px 14px',
              }}
            />
            <button onClick={() => run()} disabled={loading} className="btn btn-primary" style={{ borderRadius:10, padding:'11px 22px' }}>
              {loading
                ? <><MiniSpinner /> Analyzing…</>
                : <><ArrowRight size={15}/> Analyze</>
              }
            </button>
          </div>

          {/* Example chips */}
          <div style={{ display:'flex', gap:8, marginTop:16, flexWrap:'wrap', justifyContent:'center', alignItems:'center' }}>
            <span style={{ fontSize:'0.73rem', color:'var(--text-3)', fontFamily:'var(--mono)' }}>Try:</span>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => { setUrl(ex); run(ex); }} disabled={loading} style={{
                background:'var(--card)', border:'1px solid var(--border)',
                borderRadius:20, padding:'4px 12px', cursor:'pointer',
                color:'var(--text-2)', fontSize:'0.75rem', fontFamily:'var(--mono)',
                transition:'all 0.18s',
              }}
                onMouseEnter={e => { e.target.style.borderColor='var(--cyan)'; e.target.style.color='var(--cyan)'; }}
                onMouseLeave={e => { e.target.style.borderColor='var(--border)'; e.target.style.color='var(--text-2)'; }}
              >{ex}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOADING ───────────────────────────────────────────────────────── */}
      {loading && (
        <section style={{ padding:'0 24px 60px', maxWidth:560, margin:'0 auto' }}>
          <div style={{
            background:'rgba(13,18,32,0.9)', border:'1px solid var(--border2)',
            borderRadius:18, padding:'32px 28px', textAlign:'center',
          }}>
            <BigSpinner />
            <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:24, marginTop:20 }}>
              Analyzing repository with Claude AI…
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, textAlign:'left' }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:10,
                  fontFamily:'var(--mono)', fontSize:'0.78rem',
                  color: i < stepIdx ? 'var(--green)' : i === stepIdx ? 'var(--cyan)' : 'var(--text-3)',
                  transition:'color 0.4s',
                }}>
                  <span style={{ width:16, textAlign:'center' }}>
                    {i < stepIdx ? '✓' : i === stepIdx ? '⟳' : '·'}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      {!loading && (
        <section style={{ borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', background:'var(--surface)' }}>
          <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', textAlign:'center' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding:'22px 12px',
                borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize:'1.8rem', fontWeight:900, color:'var(--cyan)', fontFamily:'var(--mono)', letterSpacing:'-0.04em' }}>{s.num}</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-3)', marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      {!loading && (
        <section style={{ padding:'72px 24px 80px', maxWidth:960, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <h2 style={{ fontSize:'clamp(1.6rem, 4vw, 2.2rem)', fontWeight:800, letterSpacing:'-0.03em', marginBottom:12 }}>
              Everything you need to <span className="gradient-text">navigate any repo</span>
            </h2>
            <p style={{ color:'var(--text-2)', fontSize:'0.95rem', maxWidth:480, margin:'0 auto' }}>
              One tool. Instant clarity. No local setup required.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:16 }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{
                  background:'rgba(13,18,32,0.6)', border:'1px solid var(--border)',
                  borderRadius:16, padding:'26px 22px', position:'relative', overflow:'hidden',
                  transition:'border-color 0.2s, transform 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform='none'; }}
                >
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${f.color}, transparent)`, opacity:0.6 }} />
                  <div style={{
                    width:42, height:42, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center',
                    background:`${f.color}15`, border:`1px solid ${f.color}30`, marginBottom:16,
                  }}>
                    <Icon size={20} color={f.color} />
                  </div>
                  <div style={{ fontWeight:700, marginBottom:8, fontSize:'0.95rem' }}>{f.title}</div>
                  <div style={{ color:'var(--text-2)', fontSize:'0.83rem', lineHeight:1.6 }}>{f.desc}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      {!loading && !user && (
        <section style={{ padding:'0 24px 80px' }}>
          <div style={{
            maxWidth:680, margin:'0 auto', textAlign:'center',
            background:'linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(167,139,250,0.06) 100%)',
            border:'1px solid var(--border2)', borderRadius:20, padding:'48px 32px',
          }}>
            <Zap size={32} color="var(--cyan)" style={{ marginBottom:16 }} />
            <h3 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.03em', marginBottom:12 }}>
              Ready to explore?
            </h3>
            <p style={{ color:'var(--text-2)', marginBottom:28, lineHeight:1.7 }}>
              Create a free account to save your analysis history and revisit any repo.
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={() => navigate('/auth')} className="btn btn-primary">
                Get started free <ArrowRight size={15}/>
              </button>
              <button onClick={() => run('vercel/next.js')} className="btn btn-secondary">
                Try with Next.js →
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function MiniSpinner() {
  return <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(5,8,16,0.3)', borderTopColor:'#050810', animation:'spin 0.8s linear infinite' }} />;
}
function BigSpinner() {
  return (
    <div style={{ position:'relative', width:52, height:52, margin:'0 auto' }}>
      <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid transparent', borderTopColor:'var(--cyan)', animation:'spin 0.9s linear infinite' }} />
      <div style={{ position:'absolute', inset:8, borderRadius:'50%', border:'2px solid transparent', borderBottomColor:'var(--violet)', animation:'spin 1.3s linear infinite reverse' }} />
=======
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
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
    </div>
  );
}
