import React, { useState, useRef, useEffect } from 'react';
<<<<<<< HEAD
import { Send, Sparkles, Bot } from 'lucide-react';
=======
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e

const SUGGESTIONS = [
  'Where is authentication handled?',
  'What is the main data flow?',
<<<<<<< HEAD
  'Which files are riskiest to change?',
  'What external services does this use?',
  'Where are database models defined?',
  'Show me the API routing logic',
=======
  'Which files are most risky to change?',
  'Show me the payment flow',
  'What external services does this use?',
  'Where are database models defined?',
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
];

export default function QueryTab({ queries = [], onAsk, repoName }) {
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

<<<<<<< HEAD
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [queries]);
=======
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [queries]);
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e

  const ask = async (q) => {
    const question = (q || input).trim();
    if (!question || loading) return;
<<<<<<< HEAD
    setInput(''); setLoading(true);
    try { await onAsk(question); } catch (_) {}
=======
    setInput('');
    setLoading(true);
    try { await onAsk(question); }
    catch (_) {}
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
    setLoading(false);
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

<<<<<<< HEAD
      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>

        {/* Empty state */}
        {queries.length === 0 && !loading && (
          <div style={{ textAlign:'center', padding:'52px 20px', animation:'fadeUp 0.4s ease' }}>
            <div style={{ width:60, height:60, borderRadius:16, background:'rgba(167,139,250,0.1)', border:'1px solid rgba(167,139,250,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <Bot size={28} color="var(--violet)"/>
            </div>
            <h3 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:8 }}>Ask anything about {repoName}</h3>
            <p style={{ color:'var(--text-2)', fontSize:'0.85rem', lineHeight:1.65, maxWidth:420, margin:'0 auto 28px' }}>
              Ask in plain English — get AI answers that reference actual files.
=======
      {/* Conversation area */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 28px', display:'flex', flexDirection:'column', gap:16 }}>
        {queries.length === 0 && !loading && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'48px 20px' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>💬</div>
            <h3 style={{ fontWeight:700, marginBottom:8 }}>Ask anything about {repoName}</h3>
            <p style={{ color:'var(--text-2)', fontSize:'0.875rem', lineHeight:1.6, maxWidth:440, margin:'0 auto 28px' }}>
              Ask questions in plain English and get AI-powered answers that reference actual files in the codebase.
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => ask(s)} style={{
                  background:'var(--card)', border:'1px solid var(--border)',
<<<<<<< HEAD
                  borderRadius:20, padding:'7px 15px', cursor:'pointer',
                  color:'var(--text-2)', fontSize:'0.79rem', fontFamily:'var(--sans)',
                  transition:'all 0.18s',
                }}
                  onMouseEnter={e => { e.target.style.borderColor='var(--violet)'; e.target.style.color='var(--violet)'; e.target.style.background='rgba(167,139,250,0.07)'; }}
                  onMouseLeave={e => { e.target.style.borderColor='var(--border)'; e.target.style.color='var(--text-2)'; e.target.style.background='var(--card)'; }}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation */}
        {[...queries].reverse().map((item, i) => (
          <div key={i} style={{ display:'flex', flexDirection:'column', gap:12, animation:'fadeUp 0.3s ease' }}>
            {/* User bubble */}
            <div style={{ alignSelf:'flex-end', maxWidth:'74%' }}>
              <div style={{
                background:'linear-gradient(135deg, var(--cyan), #3b82f6)',
                color:'#050810', padding:'11px 16px',
                borderRadius:'14px 14px 4px 14px',
                fontSize:'0.875rem', fontWeight:600, lineHeight:1.5,
                boxShadow:'0 4px 20px rgba(34,211,238,0.15)',
              }}>
                {item.question || item.q}
              </div>
            </div>
            {/* AI bubble */}
            <div style={{ alignSelf:'flex-start', maxWidth:'84%', display:'flex', gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:'rgba(167,139,250,0.12)', border:'1px solid rgba(167,139,250,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                <Sparkles size={14} color="var(--violet)"/>
              </div>
              <div style={{
                background:'var(--card)', border:'1px solid var(--border)',
                padding:'13px 16px', borderRadius:'4px 14px 14px 14px',
                fontSize:'0.875rem', lineHeight:1.75, color:'var(--text)',
              }}>
                {item.answer || item.a}
              </div>
            </div>
          </div>
        ))}

        {/* Thinking */}
        {loading && (
          <div style={{ alignSelf:'flex-start', display:'flex', gap:10, alignItems:'center', animation:'fadeUp 0.3s ease' }}>
            <div style={{ width:30, height:30, borderRadius:8, background:'rgba(167,139,250,0.12)', border:'1px solid rgba(167,139,250,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Sparkles size={14} color="var(--violet)"/>
            </div>
            <div style={{ display:'flex', gap:5, alignItems:'center', padding:'10px 16px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:'4px 14px 14px 14px' }}>
              <ThinkingDots/>
              <span style={{ fontSize:'0.8rem', color:'var(--text-2)', marginLeft:6 }}>Claude is thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{ padding:'12px 28px 18px', borderTop:'1px solid var(--border)', background:'var(--surface)' }}>
        {queries.length > 0 && (
          <div style={{ display:'flex', gap:7, marginBottom:10, flexWrap:'wrap' }}>
            {SUGGESTIONS.slice(0,4).map(s => (
              <button key={s} onClick={() => ask(s)} disabled={loading} style={{
                background:'transparent', border:'1px solid var(--border)', borderRadius:14,
                padding:'4px 10px', cursor:'pointer', color:'var(--text-3)',
                fontSize:'0.71rem', fontFamily:'var(--sans)', transition:'all 0.15s',
              }}
                onMouseEnter={e => { e.target.style.color='var(--violet)'; e.target.style.borderColor='rgba(167,139,250,0.4)'; }}
=======
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
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
                onMouseLeave={e => { e.target.style.color='var(--text-3)'; e.target.style.borderColor='var(--border)'; }}
              >{s}</button>
            ))}
          </div>
        )}
<<<<<<< HEAD
        <div style={{ display:'flex', gap:10 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && ask()}
            placeholder={`Ask about ${repoName}…`} disabled={loading}
            style={{
              flex:1, background:'var(--card)', border:'1px solid var(--border2)',
              borderRadius:12, outline:'none', color:'var(--text)',
              fontFamily:'var(--sans)', fontSize:'0.88rem', padding:'12px 16px',
=======

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
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
              transition:'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor='var(--violet)'}
            onBlur={e => e.target.style.borderColor='var(--border2)'}
          />
<<<<<<< HEAD
          <button onClick={() => ask()} disabled={loading || !input.trim()} style={{
            padding:'0 20px', borderRadius:12, border:'none', cursor: loading||!input.trim() ? 'not-allowed' : 'pointer',
            background: !loading && input.trim() ? 'rgba(167,139,250,0.2)' : 'var(--card)',
            color: !loading && input.trim() ? 'var(--violet)' : 'var(--text-3)',
            border:`1px solid ${!loading && input.trim() ? 'rgba(167,139,250,0.35)' : 'var(--border)'}`,
            display:'flex', alignItems:'center', gap:7,
            fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.875rem', transition:'all 0.2s',
          }}>
=======
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
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
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
<<<<<<< HEAD
        <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'var(--violet)', animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }}/>
=======
        <div key={i} style={{
          width:6, height:6, borderRadius:'50%', background:'var(--violet)',
          animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`,
        }}/>
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.8);opacity:0.5}40%{transform:scale(1.2);opacity:1}}`}</style>
    </div>
  );
}
