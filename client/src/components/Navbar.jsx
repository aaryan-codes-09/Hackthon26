import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GitBranch, Clock, Zap, LogOut, User, ChevronDown } from 'lucide-react';
import { healthCheck } from '../utils/api';
import { useAuth } from '../context/AnalysisContext';

export default function Navbar() {
  const loc      = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [online,      setOnline]      = useState(null);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    healthCheck().then(() => setOnline(true)).catch(() => setOnline(false));
  }, []);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const active = (p) => loc.pathname === p;

  const navLink = (to, icon, label) => (
    <Link to={to} style={{
      display:'flex', alignItems:'center', gap:6,
      padding:'7px 13px', borderRadius:8, textDecoration:'none',
      fontSize:'0.85rem', fontWeight:500,
      color: active(to) ? 'var(--cyan)' : 'var(--text-2)',
      background: active(to) ? 'rgba(34,211,238,0.09)' : 'transparent',
      transition:'all 0.18s',
    }}
      onMouseEnter={e => { if (!active(to)) e.currentTarget.style.color='var(--text)'; }}
      onMouseLeave={e => { if (!active(to)) e.currentTarget.style.color='var(--text-2)'; }}
    >
      {icon} {label}
    </Link>
  );

  const avatar = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 28px', height:62,
      background:'rgba(5,8,15,0.88)',
      backdropFilter:'blur(20px)',
      borderBottom:'1px solid var(--border)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
        <div style={{
          width:34, height:34, borderRadius:10,
          background:'linear-gradient(135deg, var(--cyan), var(--violet))',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1rem', boxShadow:'var(--cyan-glow)', flexShrink:0,
        }}>🗺</div>
        <span style={{ fontWeight:800, fontSize:'1.15rem', letterSpacing:'-0.03em', color:'var(--text)' }}>
          Repo<span style={{ color:'var(--cyan)' }}>Nav</span>
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display:'flex', gap:2 }}>
        {navLink('/',         <Zap size={13}/>,       'Analyze')}
        {navLink('/analysis', <GitBranch size={13}/>, 'Graph')}
        {navLink('/history',  <Clock size={13}/>,     'History')}
      </div>

      {/* Right side */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {/* Server status */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{
            width:7, height:7, borderRadius:'50%',
            background: online === null ? '#64748b' : online ? 'var(--green)' : 'var(--red)',
            boxShadow: online ? '0 0 6px var(--green)' : 'none',
            animation: online ? 'pulse 2s infinite' : 'none',
          }} />
          <span style={{ fontSize:'0.72rem', color:'var(--text-3)', fontFamily:'var(--mono)' }}>
            {online === null ? 'connecting' : online ? 'online' : 'offline'}
          </span>
        </div>

        {/* User menu or login */}
        {user ? (
          <div ref={menuRef} style={{ position:'relative' }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{
              display:'flex', alignItems:'center', gap:8,
              background:'var(--card)', border:'1px solid var(--border2)',
              borderRadius:10, padding:'6px 12px 6px 6px', cursor:'pointer',
              transition:'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--border2)'}
            >
              <div style={{
                width:28, height:28, borderRadius:8,
                background:'linear-gradient(135deg, var(--cyan), var(--violet))',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.8rem', fontWeight:700, color:'#050810',
              }}>{avatar}</div>
              <span style={{ fontSize:'0.83rem', fontWeight:600, color:'var(--text)', maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</span>
              <ChevronDown size={13} color="var(--text-3)" />
            </button>

            {menuOpen && (
              <div style={{
                position:'absolute', top:'calc(100% + 8px)', right:0,
                background:'var(--card)', border:'1px solid var(--border2)',
                borderRadius:12, minWidth:180, overflow:'hidden',
                boxShadow:'0 16px 48px rgba(0,0,0,0.4)',
              }}>
                <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ fontSize:'0.83rem', fontWeight:600 }}>{user.name}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-3)', marginTop:2, fontFamily:'var(--mono)' }}>{user.email}</div>
                </div>
                <button onClick={() => { logout(); setMenuOpen(false); navigate('/auth'); }} style={{
                  display:'flex', alignItems:'center', gap:10, width:'100%',
                  padding:'11px 16px', background:'none', border:'none', cursor:'pointer',
                  color:'var(--red)', fontSize:'0.85rem', fontWeight:500, fontFamily:'var(--sans)',
                  transition:'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(251,113,133,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background='none'}
                >
                  <LogOut size={14}/> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'7px 16px', borderRadius:8, textDecoration:'none',
            background:'var(--cyan)', color:'#050810',
            fontSize:'0.83rem', fontWeight:700, transition:'filter 0.18s',
          }}
            onMouseEnter={e => e.currentTarget.style.filter='brightness(1.1)'}
            onMouseLeave={e => e.currentTarget.style.filter='none'}
          >
            <User size={13}/> Sign in
          </Link>
        )}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </nav>
  );
}
