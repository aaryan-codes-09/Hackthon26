import React from 'react';
import { motion } from 'framer-motion';

const TYPE_ICON  = { entry:'🚀', core:'⚙️', util:'🔧', external:'🌐', config:'📄' };

export default function OnboardingTab({ path = [], files = [], onSelect }) {
  const fileMap = Object.fromEntries(files.map(f => [f.id, f]));

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, padding:'24px 28px', overflowY:'auto' }}>
      <div style={{ maxWidth: 720, margin:'0 auto' }}>
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontWeight:800, fontSize:'1.15rem', marginBottom:6 }}>🚀 Recommended Onboarding Path</h2>
          <p style={{ color:'var(--text-2)', fontSize:'0.875rem', lineHeight:1.6 }}>
            Read these files in order to get a working mental model of the codebase as fast as possible.
          </p>
        </div>

        <div style={{ position:'relative' }}>
          {/* Vertical line */}
          <div style={{ position:'absolute', left:18, top:28, bottom:28, width:2, background:'linear-gradient(to bottom, var(--cyan), var(--violet))', opacity:0.25, borderRadius:2 }} />

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {path.map((step, i) => {
              const node = fileMap[step.fileId] || {};
              return (
                <motion.div
                  key={step.fileId || i}
                  initial={{ opacity:0, x:-12 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => node && onSelect(node)}
                  style={{
                    display:'flex', gap:16, padding:'16px 18px',
                    background:'var(--card)', border:'1px solid var(--border)',
                    borderRadius:12, cursor:'pointer', position:'relative',
                    transition:'all 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--cyan)'; e.currentTarget.style.background='var(--card2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--card)'; }}
                >
                  {/* Step number */}
                  <div style={{
                    width:36, height:36, borderRadius:'50%', flexShrink:0,
                    background:`linear-gradient(135deg, var(--cyan), var(--violet))`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:800, fontSize:'0.85rem', color:'#060a0f',
                    boxShadow:'0 0 12px rgba(0,217,255,0.3)',
                  }}>{i + 1}</div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'var(--mono)', fontSize:'0.82rem', color:'var(--cyan)', marginBottom:5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {TYPE_ICON[node.type]||'📄'} {step.filename}
                    </div>
                    <div style={{ fontSize:'0.83rem', color:'var(--text-2)', lineHeight:1.55 }}>{step.reason}</div>
                  </div>

                  {/* Badge */}
                  {node.type && (
                    <span className={`badge badge-${node.type==='entry'?'cyan':node.type==='core'?'violet':node.type==='util'?'amber':node.type==='external'?'red':'green'}`}
                      style={{ alignSelf:'flex-start', flexShrink:0 }}>
                      {node.type}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
