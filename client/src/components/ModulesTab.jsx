import React from 'react';
<<<<<<< HEAD
import { Rocket, Cpu, Wrench, Globe } from 'lucide-react';

const SECTIONS = [
  { key:'entries',   Icon:Rocket,  color:'var(--cyan)',   badge:'badge-cyan',   label:'Entry Points',          desc:'Where execution begins' },
  { key:'core',      Icon:Cpu,     color:'var(--violet)', badge:'badge-violet', label:'Core Business Logic',   desc:'Heart of the application' },
  { key:'utilities', Icon:Wrench,  color:'var(--amber)',  badge:'badge-amber',  label:'Utilities & Helpers',   desc:'Shared helper functions' },
  { key:'external',  Icon:Globe,   color:'var(--red)',    badge:'badge-red',    label:'External Integrations', desc:'Third-party services & APIs' },
];

export default function ModulesTab({ modules = {} }) {
  const total = SECTIONS.reduce((s, sec) => s + (modules[sec.key]||[]).length, 0);

  return (
    <div style={{ flex:1, padding:'24px 28px', overflowY:'auto' }}>

      {/* Summary bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:'var(--border)', borderRadius:12, overflow:'hidden', marginBottom:24 }}>
        {SECTIONS.map(sec => {
          const count = (modules[sec.key]||[]).length;
          const pct = total > 0 ? Math.round(count/total*100) : 0;
          return (
            <div key={sec.key} style={{ background:'var(--card)', padding:'14px 16px', textAlign:'center' }}>
              <div style={{ fontSize:'1.5rem', fontWeight:900, color:sec.color, fontFamily:'var(--mono)', lineHeight:1 }}>{count}</div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-3)', marginTop:4 }}>{sec.label.split(' ')[0]}</div>
              <div style={{ height:3, background:'var(--border)', borderRadius:2, marginTop:8, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${pct}%`, background:sec.color, borderRadius:2, transition:'width 0.6s ease' }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px,1fr))', gap:14 }}>
        {SECTIONS.map((sec, si) => {
          const items = modules[sec.key] || [];
          const { Icon, color } = sec;
          return (
            <div key={sec.key} style={{
              background:'var(--card)', border:'1px solid var(--border)',
              borderRadius:14, overflow:'hidden',
              animation:`fadeUp 0.35s ease ${si*0.07}s both`,
            }}>
              {/* Card header */}
              <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', background:'var(--card2)', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:`${color}14`, border:`1px solid ${color}28`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={16} color={color}/>
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:2 }}>{sec.label}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-3)' }}>{sec.desc}</div>
                </div>
                <div style={{ marginLeft:'auto', fontFamily:'var(--mono)', fontSize:'0.75rem', color, fontWeight:700 }}>{items.length}</div>
              </div>

              {/* Items */}
              <div style={{ padding:'14px 18px', minHeight:60 }}>
                {items.length === 0
                  ? <div style={{ fontSize:'0.8rem', color:'var(--text-3)', fontStyle:'italic' }}>None detected</div>
                  : <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                      {items.map((file, i) => {
                        const name = file.split('/').pop();
                        return (
                          <span key={i} title={file} className={`badge ${sec.badge}`}
                            style={{ fontSize:'0.72rem', padding:'4px 11px', cursor:'default', animation:`fadeUp 0.25s ease ${si*0.07 + i*0.03}s both` }}>
                            {name}
                          </span>
=======
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
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
                        );
                      })}
                    </div>
                }
              </div>

<<<<<<< HEAD
              {/* Footer */}
              <div style={{ padding:'8px 18px', borderTop:'1px solid var(--border)', background:'var(--card2)', fontSize:'0.68rem', color:'var(--text-3)', fontFamily:'var(--mono)' }}>
                {items.length} file{items.length !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
=======
              {/* Count footer */}
              <div style={{ padding:'8px 18px', borderTop:'1px solid var(--border)', fontSize:'0.72rem', color:'var(--text-3)', fontFamily:'var(--mono)' }}>
                {items.length} file{items.length !== 1 ? 's' : ''}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
  );
}
