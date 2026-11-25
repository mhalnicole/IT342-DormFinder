import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, ArrowRight, GraduationCap, Building, Shield, CheckCircle2, KeyRound } from 'lucide-react';

export default function Login() {
  const location = useLocation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    try {
      const d = await login(email, password);
      if      (d.role === 'ADMIN')    navigate('/admin/dashboard');
      else if (d.role === 'LANDLORD') navigate('/landlord/dashboard');
      else                            navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fill = (e, p) => { setEmail(e); setPassword(p); setError(''); };

  const demos = [
    { label: 'Student',  icon: <GraduationCap size={14}/>, e: 'student@cit.edu',         p: 'Student@123',  c: '#34d399', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)' },
    { label: 'Landlord', icon: <Building      size={14}/>, e: 'landlord@dormfinder.com', p: 'Landlord@123', c: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)' },
    { label: 'Admin',    icon: <Shield        size={14}/>, e: 'admin@dormfinder.com',    p: 'Admin@123',    c: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', background: '#0a0d14' }}>
      <div className="hidden lg:flex slate-grid" style={{
        flex: '0 0 44%', position: 'relative', overflow: 'hidden', padding: '64px 52px',
        flexDirection: 'column', justifyContent: 'space-between',
        background: '#0d1320', borderRight: '1px solid #1c273e'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
              <LogIn size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                Dorm<span style={{ color: '#10b981' }}>Finder</span>
              </span>
              <span style={{ display: 'block', fontSize: 11, color: '#64748b', fontWeight: 600 }}>CIT-University Housing Network</span>
            </div>
          </div>

          <div style={{ marginBottom: 44 }}>
            <span className="pill-badge pill-emerald" style={{ marginBottom: 16 }}>
              Student Accommodation Discovery
            </span>
            <h1 style={{ fontSize: 36, fontWeight: 900, color: '#f8fafc', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Safe, accredited dorms near campus.
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14.5, lineHeight: 1.7, maxWidth: 380 }}>
              Connecting CIT-U students with verified boarding house landlords along N. Bacalso Avenue and Sambag districts.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { title: 'Verified Accreditation', desc: 'Pre-screened boarding houses and active business permits' },
              { title: 'Inspection Scheduling', desc: 'Direct appointment requests with immediate landlord response' },
              { title: 'Campus Proximity Target', desc: 'Distance calculation strictly within walking radius of CIT-U' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0, marginTop: 2 }}>
                  <CheckCircle2 size={15} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{f.title}</div>
                  <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 1 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: 12, background: '#121a2c', border: '1px solid #1f2d48' }}>
          <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.6 }}>
            "Simplifying the student housing search with transparent rates, verified vacancy, and direct viewing scheduling."
          </p>
          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginTop: 8 }}>CIT-U Systems Integration &amp; Architecture (IT342)</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#0a0d14' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: 6 }}>Sign in</h2>
            <p style={{ fontSize: 14, color: '#94a3b8' }}>Access your role-based student or landlord portal</p>
          </div>

          {successMsg && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 13 }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13 }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="obsidian-card" style={{ padding: '28px 26px', background: '#111726' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@cit.edu"
                    className="slate-input slate-input-icon"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    style={{ fontSize: 12, color: '#10b981', fontWeight: 600, textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="slate-input slate-input-icon"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-emerald"
                style={{ width: '100%', padding: '12px 20px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Authenticating...' : <><span>Sign In to Account</span><ArrowRight size={16}/></>}
              </button>
            </form>

            <div style={{ margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: '#1c273e' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Demo Accounts</span>
              <div style={{ flex: 1, height: 1, background: '#1c273e' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {demos.map(d => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => fill(d.e, d.p)}
                  style={{
                    padding: '10px 8px', borderRadius: 10, background: d.bg, border: `1px solid ${d.border}`,
                    color: d.c, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 6, transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
                >
                  {d.icon}
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#64748b' }}>
            Need an account?{' '}
            <Link to="/register" style={{ color: '#10b981', fontWeight: 700, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.textDecoration='underline'}
              onMouseLeave={e => e.target.style.textDecoration='none'}>
              Register here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
