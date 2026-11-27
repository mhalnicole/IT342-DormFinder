import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, KeyRound, ArrowLeft, GraduationCap, Building, Shield } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!email) {
      setError('Please provide your registered account email.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response && response.success && response.data) {
        setResult(response.data);
      } else {
        throw new Error((response && response.message) || 'Password reset request failed.');
      }
    } catch (err) {
      setError(err.message || 'Unable to process reset request. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  const demos = [
    { label: 'Student', icon: <GraduationCap size={13} />, email: 'student@cit.edu' },
    { label: 'Landlord', icon: <Building size={13} />, email: 'landlord@dormfinder.com' },
    { label: 'Admin', icon: <Shield size={13} />, email: 'admin@dormfinder.com' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#0a0d14' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ marginBottom: 24 }}>
          <Link
            to="/login"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}
            onMouseEnter={e => e.currentTarget.style.color = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: 16 }}>
            <KeyRound size={22} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Reset your password
          </h1>
          <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.5 }}>
            Enter your registered DormFinder email address and we will generate a secure, single-use password reset link.
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13 }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        {result ? (
          <div className="obsidian-card" style={{ padding: '28px 24px', background: '#111726', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#10b981' }}>
              <CheckCircle2 size={26} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
              Reset Link Generated!
            </h3>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
              {result.message}
            </p>

            <div style={{ background: '#0a0d14', border: '1px solid #1f2d48', borderRadius: 10, padding: '14px 16px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                Active Single-Use Token
              </div>
              <div className="font-mono" style={{ fontSize: 12, color: '#10b981', wordBreak: 'break-all' }}>
                {result.token}
              </div>
            </div>

            <button
              onClick={() => navigate(`/reset-password?token=${encodeURIComponent(result.token)}`)}
              className="btn-emerald"
              style={{ width: '100%', padding: '12px 20px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <span>Proceed to Reset Password</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="obsidian-card" style={{ padding: '28px 26px', background: '#111726' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
                  Registered Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g., student@cit.edu"
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
                {loading ? 'Generating Token...' : (
                  <>
                    <span>Generate Reset Instructions</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: '#1c273e' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Test Accounts</span>
              <div style={{ flex: 1, height: 1, background: '#1c273e' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {demos.map(d => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => { setEmail(d.email); setError(''); }}
                  style={{
                    padding: '8px 6px', borderRadius: 8, background: '#18243c', border: '1px solid #273858',
                    color: '#94a3b8', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 4, transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#273858'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  {d.icon}
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
