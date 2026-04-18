import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser, registerUser } from '../utils/api';
import { useAuth } from '../context/AnalysisContext';

export default function AuthPage() {
  const [mode,     setMode]     = useState('login'); // 'login' | 'register'
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = mode === 'register'
        ? { name, email, password }
        : { email, password };
      const fn = mode === 'register' ? registerUser : loginUser;
      const { data } = await fn(payload);
      login(data.token, data.user);
      toast.success(mode === 'register' ? `Welcome, ${data.user.name}!` : 'Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setEmail('demo@reponav.dev');
    setPassword('demo123');
    setLoading(true);
    try {
      const { data } = await loginUser({ email: 'demo@reponav.dev', password: 'demo123' });
      login(data.token, data.user);
      toast.success('Welcome to the demo!');
      navigate('/');
    } catch {
      // Even if server is down, allow demo
      login('demo_token', { id: 'demo', name: 'Demo User', email: 'demo@reponav.dev', avatar: '' });
      toast.success('Demo mode — backend offline');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 16px',
      background: 'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(34,211,238,0.06) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 80% 90%, rgba(167,139,250,0.07) 0%, transparent 55%), var(--bg)',
    }}>
      {/* BG grid */}
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize:'64px 64px', opacity:0.3, pointerEvents:'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1, animation: 'fadeUp 0.5s ease' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--cyan-glow)', fontSize: '1.5rem',
            animation: 'glow-pulse 3s ease-in-out infinite',
          }}>🗺</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Repo<span style={{ color: 'var(--cyan)' }}>Nav</span>
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', marginTop: 6 }}>
            Understand any codebase in seconds
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(13,18,32,0.85)', backdropFilter: 'blur(24px)',
          border: '1px solid var(--border2)', borderRadius: 20,
          padding: '32px 32px 28px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}>

          {/* Tab toggle */}
          <div style={{ display: 'flex', background: 'var(--card)', borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '9px', border: 'none', cursor: 'pointer',
                borderRadius: 8, fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.875rem',
                background: mode === m ? 'var(--card2)' : 'transparent',
                color: mode === m ? 'var(--cyan)' : 'var(--text-3)',
                border: mode === m ? '1px solid var(--border2)' : '1px solid transparent',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}>{m}</button>
            ))}
          </div>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  className="input" type="text" placeholder="Ada Lovelace"
                  value={name} onChange={e => setName(e.target.value)} required
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email</label>
              <input
                className="input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input" type={showPass ? 'text' : 'password'}
                  placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  required style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)',
                  display: 'flex', alignItems: 'center',
                }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
              {loading ? <Spinner /> : <>{mode === 'register' ? 'Create account' : 'Sign in'} <ArrowRight size={16}/></>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button onClick={demoLogin} disabled={loading} className="btn btn-secondary" style={{ width: '100%', padding: '12px' }}>
            <Sparkles size={15} color="var(--amber)" /> Try demo — no account needed
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.78rem', color: 'var(--text-3)' }}>
          <GitBranch size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          PS3 · DevClash 2026 · Built with Claude AI
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.8rem', fontWeight: 600,
  color: 'var(--text-2)', marginBottom: 8, letterSpacing: '0.02em',
};

function Spinner() {
  return <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(5,8,16,0.3)', borderTopColor: '#050810', animation: 'spin 0.8s linear infinite' }} />;
}
