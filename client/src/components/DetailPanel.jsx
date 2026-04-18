import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';

const TYPE_COLOR = { entry:'#00d9ff', core:'#8b5cf6', util:'#f59e0b', external:'#f43f5e', config:'#10d9a0' };
const TYPE_ICON  = { entry:'🚀', core:'⚙️', util:'🔧', external:'🌐', config:'📄' };
const TYPE_LABEL = { entry:'Entry Point', core:'Core Logic', util:'Utility', external:'External Integration', config:'Config' };

export default function DetailPanel({ node, open, onClose, files }) {
  const fileMap = Object.fromEntries((files||[]).map(f => [f.id, f]));
  const usedBy  = (files||[]).filter(f => (f.imports||[]).includes(node?.id));

  return (
    <AnimatePresence>
      {open && node && (
        <>
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const SectionTitle = ({ children }) => (
  <div style={{ fontSize:'0.68rem', color:'var(--text-3)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>
    {children}
  </div>
);

const Empty = ({ children }) => (
  <div style={{ fontSize:'0.8rem', color:'var(--text-3)', fontStyle:'italic' }}>{children}</div>
);
