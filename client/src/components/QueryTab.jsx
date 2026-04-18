import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Where is authentication handled?',
  'What is the main data flow?',
  'Which files are most risky to change?',
  'Show me the payment flow',
  'What external services does this use?',
  'Where are database models defined?',
];

export default function QueryTab({ queries = [], onAsk, repoName }) {
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [queries]);

  const ask = async (q) => {
    const question = (q || input).trim();
    if (!question || loading) return;
    setInput('');
    setLoading(true);
    try { await onAsk(question); }
    catch (_) {}
    setLoading(false);
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Conversation area */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 28px', display:'flex', flexDirection:'column', gap:16 }}>
        {queries.length === 0 && !loading && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'48px 20px' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>💬</div>
            <h3 style={{ fontWeight:700, marginBottom:8 }}>Ask anything about {repoName}</h3>
            <p style={{ color:'var(--text-2)', fontSize:'0.875rem', lineHeight:1.6, maxWidth:440, margin:'0 auto 28px' }}>
              Ask questions in plain English and get AI-powered answers that reference actual files in the codebase.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => ask(s)} style={{
                  background:'var(--card)', border:'1px solid var(--border)',
                  borderRadius:20, padding:'7px 16px', cursor:'pointer',
                  color:'var(--text-2)', fontSize:'0.8rem', fontFamily:'var(--sans)',
                  transition:'all 0.18s',
                }}
                  onMouseEnter={e => { e.target.style.borderColor='var(--violet)'; e.target.style.color='var(--violet)'; }}
                  onMouseLeave={e => { e.target.style.borderColor='var(--border)'; e.target.style.color='var(--text-2)'; }}
                >{s}</button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {[...queries].reverse().map((item) => (
            <motion.div key={item.id}
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ display:'flex', flexDirection:'column', gap:10 }}
            >
              {/* Question */}
              <div style={{ alignSelf:'flex-end', maxWidth:'75%' }}>
                <div style={{
                  background:'linear-gradient(135deg, var(--cyan), #3b82f6)',
                  color:'#060a0f', padding:'10px 16px', borderRadius:'14px 14px 4px 14px',
                  fontSize:'0.875rem', fontWeight:600, lineHeight:1.5,
                }}>
                  {item.q}
                </div>
              </div>
              {/* Answer */}
              <div style={{ alignSelf:'flex-start', maxWidth:'85%' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:'var(--violet-dim)', border:'1px solid rgba(139,92,246,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                    <Sparkles size={13} color="var(--violet)"/>
                  </div>
                  <div style={{
                    background:'var(--card)', border:'1px solid var(--border)',
                    padding:'12px 16px', borderRadius:'4px 14px 14px 14px',
                    fontSize:'0.875rem', lineHeight:1.7, color:'var(--text)',
                  }}>
                    {item.a}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ alignSelf:'flex-start', display:'flex', gap:8, alignItems:'center', padding:'10px 16px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:12 }}>
            <ThinkingDots/>
            <span style={{ fontSize:'0.8rem', color:'var(--text-2)' }}>Claude is thinking…</span>
          </motion.div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* Input bar */}
      <div style={{ padding:'14px 28px', borderTop:'1px solid var(--border)', background:'var(--surface)' }}>
        {/* Suggestion chips when there are already queries */}
        {queries.length > 0 && (
          <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
            {SUGGESTIONS.slice(0,4).map(s => (
              <button key={s} onClick={() => ask(s)} disabled={loading} style={{
                background:'var(--card)', border:'1px solid var(--border)', borderRadius:14,
                padding:'4px 10px', cursor:'pointer', color:'var(--text-3)',
                fontSize:'0.72rem', fontFamily:'var(--sans)', transition:'all 0.15s',
              }}
                onMouseEnter={e => { e.target.style.color='var(--cyan)'; e.target.style.borderColor='var(--cyan)'; }}
                onMouseLeave={e => { e.target.style.color='var(--text-3)'; e.target.style.borderColor='var(--border)'; }}
              >{s}</button>
            ))}
          </div>
        )}

        <div style={{ display:'flex', gap:10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask()}
            placeholder={`Ask about ${repoName}…`}
            disabled={loading}
            style={{
              flex:1, background:'var(--card)', border:'1px solid var(--border2)',
              borderRadius:12, outline:'none', color:'var(--text)',
              fontFamily:'var(--sans)', fontSize:'0.9rem', padding:'12px 16px',
              transition:'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor='var(--violet)'}
            onBlur={e => e.target.style.borderColor='var(--border2)'}
          />
          <button
            onClick={() => ask()}
            disabled={loading || !input.trim()}
            style={{
              padding:'0 20px', borderRadius:12, border:'none', cursor: loading||!input.trim() ? 'not-allowed' : 'pointer',
              background: loading||!input.trim() ? 'var(--card)' : 'rgba(139,92,246,0.25)',
              color: loading||!input.trim() ? 'var(--text-3)' : 'var(--violet)',
              border:`1px solid ${loading||!input.trim() ? 'var(--border)' : 'rgba(139,92,246,0.4)'}`,
              transition:'all 0.18s', display:'flex', alignItems:'center', gap:7,
              fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.875rem',
            }}
          >
            <Send size={14}/> Ask
          </button>
        </div>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div style={{ display:'flex', gap:4 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:6, height:6, borderRadius:'50%', background:'var(--violet)',
          animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`,
        }}/>
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.8);opacity:0.5}40%{transform:scale(1.2);opacity:1}}`}</style>
    </div>
  );
}
