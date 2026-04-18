import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GitBranch, Clock, Zap } from 'lucide-react';
import { healthCheck } from '../utils/api';

const s = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', height: '64px',
    background: 'rgba(6,10,15,0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    textDecoration: 'none', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.03em',
  },
  logoIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1rem', boxShadow: 'var(--glow-cyan)',
  },
  links: { display: 'flex', gap: '4px' },
  link: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', borderRadius: 8,
    textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
    color: 'var(--text-2)', transition: 'all 0.18s',
  },
  linkActive: { color: 'var(--cyan)', background: 'var(--cyan-dim)' },
  dot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
};

export default function Navbar() {
  const loc = useLocation();
  const [online, setOnline] = useState(null);

  useEffect(() => {
    healthCheck()
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  const linkStyle = (path) => ({
    ...s.link,
    ...(loc.pathname === path ? s.linkActive : {}),
  });

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>
        <div style={s.logoIcon}>🗺</div>
        <span>Repo<span style={{ color: 'var(--cyan)' }}>Nav</span></span>
      </Link>

      <div style={s.links}>
        <Link to="/" style={linkStyle('/')}>
          <Zap size={14} /> Analyze
        </Link>
        <Link to="/analysis" style={linkStyle('/analysis')}>
          <GitBranch size={14} /> Graph
        </Link>
        <Link to="/history" style={linkStyle('/history')}>
          <Clock size={14} /> History
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          ...s.dot,
          background: online === null ? '#64748b' : online ? 'var(--green)' : 'var(--red)',
          boxShadow: online ? '0 0 6px var(--green)' : 'none',
          animation: online ? 'pulse 2s infinite' : 'none',
        }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
          {online === null ? 'connecting' : online ? 'server ok' : 'offline'}
        </span>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </nav>
  );
}
