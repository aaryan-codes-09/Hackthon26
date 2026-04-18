import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD
import { X, Zap, ArrowUpRight, ArrowDownRight, FileCode } from 'lucide-react';

const TYPE_COLOR = { entry:'var(--cyan)', core:'var(--violet)', util:'var(--amber)', external:'var(--red)', config:'var(--green)' };
const TYPE_ICON  = { entry:'🚀', core:'⚙️', util:'🔧', external:'🌐', config:'📄' };
const TYPE_LABEL = { entry:'Entry Point', core:'Core Logic', util:'Utility', external:'External', config:'Config' };
const TYPE_BADGE = { entry:'cyan', core:'violet', util:'amber', external:'red', config:'green' };
=======
import { X, Zap } from 'lucide-react';

const TYPE_COLOR = { entry:'#00d9ff', core:'#8b5cf6', util:'#f59e0b', external:'#f43f5e', config:'#10d9a0' };
const TYPE_ICON  = { entry:'🚀', core:'⚙️', util:'🔧', external:'🌐', config:'📄' };
const TYPE_LABEL = { entry:'Entry Point', core:'Core Logic', util:'Utility', external:'External Integration', config:'Config' };
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e

export default function DetailPanel({ node, open, onClose, files }) {
  const fileMap = Object.fromEntries((files||[]).map(f => [f.id, f]));
  const usedBy  = (files||[]).filter(f => (f.imports||[]).includes(node?.id));
<<<<<<< HEAD
  const col     = TYPE_COLOR[node?.type] || 'var(--cyan)';
=======
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e

  return (
    <AnimatePresence>
      {open && node && (
        <>
<<<<<<< HEAD
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, backdropFilter:'blur(2px)' }}
          />

          <motion.div
            initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
            transition={{ type:'spring', damping:30, stiffness:300 }}
            style={{
              position:'fixed', right:0, top:0, bottom:0, width:380,
              background:'var(--surface)', borderLeft:'1px solid var(--border)',
              zIndex:201, overflowY:'auto', display:'flex', flexDirection:'column',
              boxShadow:'-20px 0 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Colored top bar */}
            <div style={{ height:3, background:`linear-gradient(90deg, ${col}, transparent)` }}/>

            {/* Header */}
            <div style={{ padding:'20px 22px 16px', borderBottom:'1px solid var(--border)', position:'sticky', top:0, background:'var(--surface)', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:`${col}18`, border:`1px solid ${col}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>
                      {TYPE_ICON[node.type]||'📄'}
                    </div>
                    <span className={`badge badge-${TYPE_BADGE[node.type]||'cyan'}`}>{TYPE_LABEL[node.type]||node.type}</span>
                    {node.highImpact && (
                      <span style={{ display:'inline-flex', alignItems:'center', gap:3, background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:10, padding:'2px 8px', fontSize:'0.66rem', color:'var(--amber)', fontFamily:'var(--mono)' }}>
                        <Zap size={9}/> high-impact
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight:800, fontSize:'1rem', marginBottom:4, lineHeight:1.2 }}>{node.name}</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:'0.7rem', color:'var(--text-3)', wordBreak:'break-all' }}>{node.path}</div>
                </div>
                <button onClick={onClose} style={{
                  background:'var(--card)', border:'1px solid var(--border)',
                  borderRadius:8, width:30, height:30, cursor:'pointer',
                  color:'var(--text-2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  transition:'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--card2)'; e.currentTarget.style.color='var(--text)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='var(--card)'; e.currentTarget.style.color='var(--text-2)'; }}
                >
                  <X size={13}/>
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:22, flex:1 }}>

              {/* High impact warning */}
              {node.highImpact && (
                <div style={{ padding:'12px 14px', borderRadius:10, background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', display:'flex', gap:10 }}>
                  <Zap size={14} color="var(--amber)" style={{ flexShrink:0, marginTop:1 }}/>
                  <span style={{ fontSize:'0.8rem', color:'var(--amber)', lineHeight:1.55 }}>
                    This file is depended on by multiple modules. Changes here carry elevated risk and may have cascading effects.
                  </span>
                </div>
              )}

              {/* AI Summary */}
              <div>
                <SectionLabel>AI Summary</SectionLabel>
                <div style={{
                  background:'rgba(167,139,250,0.07)', border:'1px solid rgba(167,139,250,0.18)',
                  borderRadius:10, padding:'14px 15px', position:'relative',
                  fontSize:'0.84rem', lineHeight:1.7, color:'var(--text)',
                }}>
                  <span style={{ position:'absolute', top:-9, left:12, background:'var(--surface)', padding:'0 6px', fontSize:'0.6rem', color:'var(--violet)', fontFamily:'var(--mono)', letterSpacing:'0.1em' }}>✦ AI</span>
                  {node.summary || 'No summary available for this file.'}
                </div>
              </div>

              {/* Imports */}
              <div>
                <SectionLabel>
                  <ArrowUpRight size={12} style={{ verticalAlign:'middle', marginRight:3 }}/>
                  Imports from <Chip>{(node.imports||[]).length}</Chip>
                </SectionLabel>
                {(node.imports||[]).length === 0
                  ? <Empty>No internal dependencies</Empty>
                  : <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {(node.imports||[]).map(id => (
                        <span key={id} style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:'var(--mono)', fontSize:'0.72rem', padding:'4px 10px', borderRadius:6, background:'var(--green-dim)', border:'1px solid rgba(52,211,153,0.2)', color:'var(--green)' }}>
                          <FileCode size={9}/>{fileMap[id]?.name || id}
                        </span>
                      ))}
                    </div>
                }
              </div>

              {/* Used by */}
              <div>
                <SectionLabel>
                  <ArrowDownRight size={12} style={{ verticalAlign:'middle', marginRight:3 }}/>
                  Used by <Chip>{usedBy.length}</Chip>
                </SectionLabel>
                {usedBy.length === 0
                  ? <Empty>Not imported by any other file</Empty>
                  : <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {usedBy.map(f => (
                        <span key={f.id} style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:'var(--mono)', fontSize:'0.72rem', padding:'4px 10px', borderRadius:6, background:'var(--red-dim)', border:'1px solid rgba(251,113,133,0.2)', color:'var(--red)' }}>
                          <FileCode size={9}/>{f.name}
                        </span>
                      ))}
                    </div>
                }
              </div>

              {/* Quick stats */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <StatCard label="Total imports" value={(node.imports||[]).length} color="var(--green)"/>
                <StatCard label="Dependents" value={usedBy.length} color="var(--red)"/>
              </div>
=======
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:200 }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type:'spring', damping:28, stiffness:280 }}
            style={{
              position:'fixed', right:0, top:0, bottom:0, width:360,
              background:'var(--surface)', borderLeft:'1px solid var(--border)',
              zIndex:201, overflowY:'auto', padding:24,
              display:'flex', flexDirection:'column', gap:20,
              boxShadow:'-12px 0 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
              <div>
                <div style={{ fontSize:'1.3rem', marginBottom:4 }}>{TYPE_ICON[node.type]||'📄'}</div>
                <div style={{ fontWeight:800, fontSize:'1rem', lineHeight:1.2, marginBottom:6 }}>{node.name}</div>
                <div style={{ fontFamily:'var(--mono)', fontSize:'0.72rem', color:'var(--text-2)', wordBreak:'break-all' }}>{node.path}</div>
              </div>
              <button onClick={onClose} style={{
                background:'rgba(255,255,255,0.06)', border:'1px solid var(--border)',
                borderRadius:8, width:32, height:32, cursor:'pointer', color:'var(--text-2)',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>
                <X size={14}/>
              </button>
            </div>

            {/* Category */}
            <div>
              <SectionTitle>Category</SectionTitle>
              <span className={`badge badge-${node.type==='entry'?'cyan':node.type==='core'?'violet':node.type==='util'?'amber':node.type==='external'?'red':'green'}`}
                style={{ fontSize:'0.8rem', padding:'5px 12px' }}>
                {TYPE_LABEL[node.type]||node.type}
              </span>
              {node.highImpact && (
                <div style={{ marginTop:10, padding:'10px 14px', borderRadius:10, background:'var(--amber-dim)', border:'1px solid rgba(245,158,11,0.25)', display:'flex', alignItems:'flex-start', gap:8 }}>
                  <Zap size={14} color="var(--amber)" style={{ flexShrink:0, marginTop:1 }}/>
                  <span style={{ fontSize:'0.8rem', color:'var(--amber)', lineHeight:1.5 }}>
                    High-impact file — depended on by multiple modules. Changes here carry elevated risk.
                  </span>
                </div>
              )}
            </div>

            {/* AI Summary */}
            <div>
              <SectionTitle>AI Summary</SectionTitle>
              <div style={{
                background:'var(--violet-dim)', border:'1px solid rgba(139,92,246,0.2)',
                borderRadius:10, padding:'12px 14px',
                fontSize:'0.83rem', lineHeight:1.65, color:'var(--text)',
                fontFamily:'var(--mono)', position:'relative',
              }}>
                <span style={{ position:'absolute', top:-9, left:12, background:'var(--surface)', padding:'0 6px', fontSize:'0.62rem', color:'var(--violet)', letterSpacing:'0.08em' }}>✦ AI</span>
                {node.summary || 'No summary available.'}
              </div>
            </div>

            {/* Imports */}
            <div>
              <SectionTitle>Imports from ({(node.imports||[]).length})</SectionTitle>
              {(node.imports||[]).length === 0
                ? <Empty>No dependencies</Empty>
                : <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {(node.imports||[]).map(id => (
                      <span key={id} style={{
                        fontFamily:'var(--mono)', fontSize:'0.72rem',
                        padding:'3px 9px', borderRadius:5,
                        background:'var(--green-dim)', border:'1px solid rgba(16,217,160,0.25)',
                        color:'var(--green)',
                      }}>
                        {fileMap[id]?.name || id}
                      </span>
                    ))}
                  </div>
              }
            </div>

            {/* Used by */}
            <div>
              <SectionTitle>Used by ({usedBy.length})</SectionTitle>
              {usedBy.length === 0
                ? <Empty>Not imported by other files</Empty>
                : <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {usedBy.map(f => (
                      <span key={f.id} style={{
                        fontFamily:'var(--mono)', fontSize:'0.72rem',
                        padding:'3px 9px', borderRadius:5,
                        background:'var(--red-dim)', border:'1px solid rgba(244,63,94,0.25)',
                        color:'var(--red)',
                      }}>
                        {f.name}
                      </span>
                    ))}
                  </div>
              }
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

<<<<<<< HEAD
const SectionLabel = ({ children }) => (
  <div style={{ fontSize:'0.68rem', color:'var(--text-3)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10, display:'flex', alignItems:'center', gap:4 }}>
    {children}
  </div>
);
const Chip = ({ children }) => (
  <span style={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:10, padding:'0 6px', fontFamily:'var(--mono)', fontSize:'0.65rem', color:'var(--text-2)' }}>{children}</span>
);
const Empty = ({ children }) => (
  <div style={{ fontSize:'0.8rem', color:'var(--text-3)', fontStyle:'italic', padding:'8px 0' }}>{children}</div>
);
const StatCard = ({ label, value, color }) => (
  <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px' }}>
    <div style={{ fontSize:'1.6rem', fontWeight:900, color, lineHeight:1, marginBottom:4, fontFamily:'var(--mono)' }}>{value}</div>
    <div style={{ fontSize:'0.7rem', color:'var(--text-3)' }}>{label}</div>
  </div>
=======
const SectionTitle = ({ children }) => (
  <div style={{ fontSize:'0.68rem', color:'var(--text-3)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>
    {children}
  </div>
);

const Empty = ({ children }) => (
  <div style={{ fontSize:'0.8rem', color:'var(--text-3)', fontStyle:'italic' }}>{children}</div>
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
);
