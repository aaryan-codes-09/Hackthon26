import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Navigation, Package, MessageSquare, ArrowLeft, ExternalLink, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAnalysis } from '../context/AnalysisContext';
import { askQuestion } from '../utils/api';
import DetailPanel from '../components/DetailPanel';
import OnboardingTab from '../components/OnboardingTab';
import ModulesTab from '../components/ModulesTab';
import QueryTab from '../components/QueryTab';

const TYPE_COLOR = { entry: '#00d9ff', core: '#8b5cf6', util: '#f59e0b', external: '#f43f5e', config: '#10d9a0' };
const TYPE_ICON  = { entry: '🚀', core: '⚙️', util: '🔧', external: '🌐', config: '📄' };
const TYPE_LABEL = { entry: 'Entry', core: 'Core', util: 'Util', external: 'Ext', config: 'Config' };

export default function AnalysisPage() {
  const { analysis, queries, addQuery } = useAnalysis();
  const navigate = useNavigate();
  const [tab,          setTab]          = useState('graph');
  const [selectedNode, setSelectedNode] = useState(null);
  const [panelOpen,    setPanelOpen]    = useState(false);
  const canvasRef = useRef(null);
  const cam       = useRef({ x: 0, y: 0, scale: 1 });
  const drag      = useRef({ active: false, startX: 0, startY: 0 });
  const rafRef    = useRef(null);

  if (!analysis) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 }}>
        <div style={{ fontSize: '3rem' }}>🏗</div>
        <h2 style={{ fontWeight: 800 }}>No analysis yet</h2>
        <p style={{ color: 'var(--text-2)' }}>Go to the home page and analyze a repository first.</p>
        <button onClick={() => navigate('/')} style={btnStyle}>← Analyze a repo</button>
      </div>
    );
  }

  const { repoName, files = [], onboardingPath = [], modules = {}, archSummary, stats = {}, linesOfCode, totalFiles, totalModules, language } = analysis;

  /* ── Canvas Graph ───────────────────────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    const { x: ox, y: oy, scale } = cam.current;
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);

    // edges
    const edgeMap = {};
    files.forEach(f => { edgeMap[f.id] = f; });
    files.forEach(f => {
      (f.imports || []).forEach(tid => {
        const to = edgeMap[tid]; if (!to) return;
        const x1 = f.x||200, y1 = f.y||200, x2 = to.x||200, y2 = to.y||200;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        const cpx = (x1+x2)/2, cpy = (y1+y2)/2 - 30;
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
        ctx.strokeStyle = 'rgba(26,40,64,0.9)';
        ctx.lineWidth = 1.5; ctx.stroke();
        // arrowhead
        const ang = Math.atan2(y2-cpy, x2-cpx);
        ctx.beginPath();
        ctx.moveTo(x2,y2);
        ctx.lineTo(x2-9*Math.cos(ang-0.4), y2-9*Math.sin(ang-0.4));
        ctx.lineTo(x2-9*Math.cos(ang+0.4), y2-9*Math.sin(ang+0.4));
        ctx.closePath();
        ctx.fillStyle = 'rgba(36,53,80,0.9)'; ctx.fill();
      });
    });

    // nodes
    files.forEach(n => {
      const x = n.x||200, y = n.y||200;
      const col = TYPE_COLOR[n.type] || '#64748b';
      const r = n.highImpact ? 26 : 20;
      const isSel = selectedNode?.id === n.id;

      if (n.highImpact) {
        const g = ctx.createRadialGradient(x,y,r,x,y,r+12);
        g.addColorStop(0,'rgba(245,158,11,0.2)'); g.addColorStop(1,'transparent');
        ctx.beginPath(); ctx.arc(x,y,r+12,0,Math.PI*2);
        ctx.fillStyle = g; ctx.fill();
      }
      if (isSel) {
        ctx.beginPath(); ctx.arc(x,y,r+7,0,Math.PI*2);
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
      }
      // circle
      const bg = ctx.createRadialGradient(x-3,y-4,0,x,y,r);
      bg.addColorStop(0, col+'33'); bg.addColorStop(1, col+'18');
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle = bg; ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = isSel ? 2.5 : 1.5; ctx.stroke();
      // emoji
      ctx.font = `${n.highImpact?15:12}px serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(TYPE_ICON[n.type]||'📄', x, y);
      // label
      ctx.font = `600 9px Outfit,sans-serif`;
      ctx.fillStyle = isSel ? col : '#94a3b8';
      const label = n.name.length>14 ? n.name.slice(0,13)+'…' : n.name;
      ctx.fillText(label, x, y+r+11);
    });

    ctx.restore();
  }, [files, selectedNode]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  const handleMouseDown = (e) => {
    drag.current = { active: true, startX: e.clientX - cam.current.x, startY: e.clientY - cam.current.y };
  };
  const handleMouseMove = (e) => {
    if (!drag.current.active) return;
    cam.current.x = e.clientX - drag.current.startX;
    cam.current.y = e.clientY - drag.current.startY;
    draw();
  };
  const handleMouseUp = (e) => {
    drag.current.active = false;
  };
  const handleWheel = (e) => {
    e.preventDefault();
    cam.current.scale = Math.min(3, Math.max(0.25, cam.current.scale - e.deltaY * 0.001));
    draw();
  };
  const handleClick = (e) => {
    if (Math.abs(e.movementX) > 3 || Math.abs(e.movementY) > 3) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left - cam.current.x) / cam.current.scale;
    const my = (e.clientY - rect.top  - cam.current.y) / cam.current.scale;
    const hit = files.find(n => Math.hypot((n.x||200)-mx,(n.y||200)-my) < 28);
    if (hit) { setSelectedNode(hit); setPanelOpen(true); draw(); }
  };

  // re-draw when selectedNode changes
  useEffect(() => { draw(); }, [selectedNode]);

  /* ── Query handler ──────────────────────────────────────────────────────── */
  const handleQuery = async (question) => {
    const ctx = { repoName: analysis.repoName, files: analysis.files, modules: analysis.modules, archSummary };
    try {
      const { data } = await askQuestion(question, analysis._id, ctx);
      addQuery(question, data.answer);
      return data.answer;
    } catch (e) {
      const msg = e.response?.data?.error || e.message;
      toast.error('Query failed: ' + msg);
      throw e;
    }
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  const TABS = [
    { id:'graph',      icon:<Map size={14}/>,           label:'Graph' },
    { id:'onboarding', icon:<Navigation size={14}/>,    label:'Onboarding' },
    { id:'modules',    icon:<Package size={14}/>,       label:'Modules', count: totalModules },
    { id:'query',      icon:<MessageSquare size={14}/>, label:'Ask AI',  count: queries.length || null },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

      {/* Header bar */}
      <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:'var(--text-2)', cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontSize:'0.85rem' }}>
          <ArrowLeft size={14}/> Back
        </button>
        <div style={{ width: 1, height: 22, background: 'var(--border)' }} />
        <div style={{ fontWeight: 800, fontSize: '1rem', display:'flex', alignItems:'center', gap:8 }}>
          📁 <a href={`https://github.com/${repoName}`} target="_blank" rel="noopener noreferrer"
            style={{ color:'var(--cyan)', textDecoration:'none', display:'flex', alignItems:'center', gap:5 }}>
            {repoName} <ExternalLink size={12}/>
          </a>
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {language && <span className="badge badge-cyan">{language}</span>}
          <span className="badge badge-violet">{totalFiles} files</span>
          <span className="badge badge-amber">{linesOfCode}</span>
        </div>
      </div>

      {/* Stat row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:1, borderBottom:'1px solid var(--border)', background:'var(--border)' }}>
        {[
          { label:'Entry Points', val: stats.entryPoints, color:'var(--cyan)' },
          { label:'Core Modules', val: stats.coreModules, color:'var(--violet)' },
          { label:'Utilities',    val: stats.utilities,   color:'var(--amber)' },
          { label:'Integrations', val: stats.externalIntegrations, color:'var(--red)' },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--card)', padding:'14px 20px' }}>
            <div style={{ fontSize:'0.68rem', color:'var(--text-3)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:'1.6rem', fontWeight:900, color: s.color, lineHeight:1 }}>{s.val ?? '—'}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:0, borderBottom:'1px solid var(--border)', padding:'0 28px', background:'var(--surface)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'13px 18px', border:'none', background:'none', cursor:'pointer',
            color: tab===t.id ? 'var(--cyan)' : 'var(--text-2)',
            fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.875rem',
            borderBottom: `2px solid ${tab===t.id ? 'var(--cyan)' : 'transparent'}`,
            transition:'all 0.18s', position:'relative', top:1,
          }}>
            {t.icon} {t.label}
            {t.count ? <span style={{ fontSize:'0.68rem', background:'var(--cyan-dim)', color:'var(--cyan)', padding:'1px 6px', borderRadius:10, fontFamily:'var(--mono)' }}>{t.count}</span> : null}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>

        {/* GRAPH TAB */}
        {tab === 'graph' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ flex:1, display:'flex', flexDirection:'column' }}>
            {/* AI summary */}
            {archSummary && (
              <div style={{ margin:'16px 28px 0', background:'var(--violet-dim)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:12, padding:'14px 18px', fontSize:'0.85rem', lineHeight:1.65, color:'var(--text)', position:'relative' }}>
                <span style={{ position:'absolute', top:-10, left:14, background:'var(--card)', padding:'0 8px', fontSize:'0.65rem', color:'var(--violet)', fontFamily:'var(--mono)', letterSpacing:'0.08em' }}>✦ AI ARCHITECTURE SUMMARY</span>
                {archSummary}
              </div>
            )}

            {/* Legend */}
            <div style={{ display:'flex', gap:16, padding:'12px 28px', flexWrap:'wrap', alignItems:'center' }}>
              {Object.entries(TYPE_COLOR).map(([type, col]) => (
                <div key={type} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.75rem', color:'var(--text-2)', fontFamily:'var(--mono)' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:col }}/>
                  {TYPE_LABEL[type]}
                </div>
              ))}
              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.75rem', color:'var(--amber)', fontFamily:'var(--mono)' }}>
                <Zap size={11}/> high-impact
              </div>
              <span style={{ marginLeft:'auto', fontSize:'0.72rem', color:'var(--text-3)', fontFamily:'var(--mono)' }}>drag · scroll zoom · click node</span>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              style={{ flex:1, background:'var(--bg)', cursor:'grab', display:'block', minHeight:380 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleClick}
              onWheel={handleWheel}
            />

            {/* File list below */}
            <div style={{ padding:'16px 28px', borderTop:'1px solid var(--border)', background:'var(--surface)', maxHeight:220, overflowY:'auto' }}>
              <div style={{ fontSize:'0.75rem', color:'var(--text-3)', fontFamily:'var(--mono)', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.1em' }}>All Files</div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {files.map(f => (
                  <div key={f.id} onClick={() => { setSelectedNode(f); setPanelOpen(true); }}
                    style={{
                      display:'flex', alignItems:'center', gap:10, padding:'6px 10px', borderRadius:8, cursor:'pointer',
                      background: selectedNode?.id===f.id ? 'var(--cyan-dim)' : 'transparent',
                      transition:'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background= selectedNode?.id===f.id ? 'var(--cyan-dim)' : 'transparent'}
                  >
                    <span>{TYPE_ICON[f.type]||'📄'}</span>
                    <span style={{ flex:1, fontFamily:'var(--mono)', fontSize:'0.78rem', color:'var(--text-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.path||f.name}</span>
                    <span className={`badge badge-${f.type==='entry'?'cyan':f.type==='core'?'violet':f.type==='util'?'amber':f.type==='external'?'red':'green'}`}>{TYPE_LABEL[f.type]}</span>
                    {f.highImpact && <span style={{ fontSize:'0.8rem' }}>⚡</span>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'onboarding' && <OnboardingTab path={onboardingPath} files={files} onSelect={n=>{setSelectedNode(n); setPanelOpen(true);}} />}
        {tab === 'modules'    && <ModulesTab modules={modules} />}
        {tab === 'query'      && <QueryTab queries={queries} onAsk={handleQuery} repoName={repoName} />}
      </div>

      {/* Detail panel */}
      <DetailPanel node={selectedNode} open={panelOpen} onClose={()=>setPanelOpen(false)} files={files} />
    </div>
  );
}

const btnStyle = {
  padding:'10px 22px', borderRadius:10, border:'1px solid var(--border)',
  background:'var(--card)', color:'var(--text)', cursor:'pointer',
  fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.875rem',
};
