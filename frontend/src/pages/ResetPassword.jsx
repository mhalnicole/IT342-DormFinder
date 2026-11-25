import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Lock, KeyRound, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get('token') || '';

  const [token, setToken] = useState(initialToken);
  const [tokenStatus, setTokenStatus] = useState({ checking: false, verified: false, message: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token.trim()) {
      setTokenStatus({ checking: false, verified: false, message: 'Please provide a valid reset token.' });
      return;
    }

    let isMounted = true;
    async function checkToken() {
      setTokenStatus({ checking: true, verified: false, message: 'Verifying reset token...' });
      try {
        const res = await api.get(`/auth/verify-reset-token?token=${encodeURIComponent(token.trim())}`);
        if (isMounted) {
          if (res && res.success) {
            setTokenStatus({ checking: false, verified: true, message: 'Token verified and ready for password reset.' });
            setError('');
          } else {
            setTokenStatus({ checking: false, verified: false, message: res.message || 'Token is invalid or expired.' });
          }
        }
      } catch (err) {
        if (isMounted) {
          setTokenStatus({ checking: false, verified: false, message: err.message || 'Token is invalid, expired, or already used.' });
        }
      }
    }

    checkToken();
    return () => { isMounted = false; };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('A valid reset token is required.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        token: token.trim(),
        newPassword,
        confirmPassword,
      });

      if (response && response.success) {
        navigate('/login', {
          state: { message: 'Password reset successfully! You can now sign in with your new password.' },
        });
      } else {
        throw new Error((response && response.message) || 'Password reset failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. The token may have expired or been used.');
    } finally {
      setLoading(false);
    }
  };

  const isMinLength = newPassword.length >= 8;
  const isMatching = newPassword && confirmPassword && newPassword === confirmPassword;

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
            <ArrowLeft size={16} /> Return to Sign In
          </Link>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: 16 }}>
            <KeyRound size={22} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Set New Password
          </h1>
          <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.5 }}>
            Create a secure new password for your DormFinder account.
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13 }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        <div className="obsidian-card" style={{ padding: '28px 26px', background: '#111726' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Reset Token
                </label>
                {tokenStatus.verified && (
                  <span style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                    <ShieldCheck size={13} /> Token Verified
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="Paste token or enter reset code"
                className="slate-input font-mono"
                style={{ fontSize: 12.5 }}
              />
              {!tokenStatus.verified && tokenStatus.message && (
                <p style={{ fontSize: 11.5, color: tokenStatus.checking ? '#94a3b8' : '#f87171', marginTop: 5 }}>
                  {tokenStatus.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="slate-input slate-input-icon"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="slate-input slate-input-icon"
                />
              </div>
            </div>

            <div style={{ background: '#0a0d14', border: '1px solid #1c273e', borderRadius: 8, padding: '10px 14px', marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: isMinLength ? '#10b981' : '#64748b', marginBottom: 4 }}>
                <CheckCircle2 size={13} style={{ opacity: isMinLength ? 1 : 0.4 }} />
                <span>At least 8 characters long</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: isMatching ? '#10b981' : '#64748b' }}>
                <CheckCircle2 size={13} style={{ opacity: isMatching ? 1 : 0.4 }} />
                <span>Passwords match</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !tokenStatus.verified}
              className="btn-emerald"
              style={{ width: '100%', padding: '12px 20px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (loading || !tokenStatus.verified) ? 0.6 : 1 }}
            >
              {loading ? 'Updating Password...' : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
