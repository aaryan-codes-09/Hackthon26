import React from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
  { key:'entries',   label:'🟦 Entry Points',           badge:'badge-cyan',   desc:'Application entry points — where execution begins' },
  { key:'core',      label:'🟣 Core Business Logic',    badge:'badge-violet', desc:'The heart of the application — main domain files' },
  { key:'utilities', label:'🟡 Utilities & Helpers',    badge:'badge-amber',  desc:'Shared helpers, formatters, and utility functions' },
  { key:'external',  label:'🔴 External Integrations',  badge:'badge-red',    desc:'Third-party services, APIs, and external dependencies' },
];

export default function ModulesTab({ modules = {} }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, padding:'24px 28px', overflowY:'auto' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>
        {SECTIONS.map((sec, si) => {
          const items = modules[sec.key] || [];
          return (
            <motion.div
              key={sec.key}
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: si * 0.08 }}
              style={{
                background:'var(--card)', border:'1px solid var(--border)',
                borderRadius:14, overflow:'hidden',
              }}
            >
              {/* Card header */}
              <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', background:'var(--card2)' }}>
                <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:4 }}>{sec.label}</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-2)' }}>{sec.desc}</div>
              </div>

              {/* Items */}
              <div style={{ padding:'14px 18px' }}>
                {items.length === 0
                  ? <div style={{ fontSize:'0.8rem', color:'var(--text-3)', fontStyle:'italic' }}>None detected</div>
                  : <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {items.map((file, i) => {
                        const name = file.split('/').pop();
                        return (
                          <motion.span
                            key={i}
                            initial={{ opacity:0, scale:0.9 }}
                            animate={{ opacity:1, scale:1 }}
                            transition={{ delay: si*0.08 + i*0.04 }}
                            title={file}
                            className={`badge ${sec.badge}`}
                            style={{ fontSize:'0.75rem', padding:'5px 12px', cursor:'default' }}
                          >
                            {name}
                          </motion.span>
                        );
                      })}
                    </div>
                }
              </div>

              {/* Count footer */}
              <div style={{ padding:'8px 18px', borderTop:'1px solid var(--border)', fontSize:'0.72rem', color:'var(--text-3)', fontFamily:'var(--mono)' }}>
                {items.length} file{items.length !== 1 ? 's' : ''}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
