import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function Unauthorized() {
  const { role } = useAuth();
  const dash = role === 'ADMIN' ? '/admin/dashboard' : role === 'LANDLORD' ? '/landlord/dashboard' : '/student/dashboard';

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#0a0d14' }}>
      <div className="obsidian-card" style={{ textAlign: 'center', maxWidth: 440, padding: '44px 36px', background: '#111726' }}>
        
        {/* Icon */}
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <ShieldAlert size={36} color="#ef4444"/>
        </div>

        <span className="pill-badge pill-coral" style={{ marginBottom: 14 }}>
          HTTP 403 Forbidden
        </span>

        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Access Restricted
        </h1>
        <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.65, marginBottom: 28 }}>
          You do not possess the required user role authorization to access this protected application resource.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link
            to={dash}
            className="btn-emerald"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', fontSize: 13.5, textDecoration: 'none' }}
          >
            <ArrowLeft size={16}/> Return to Dashboard
          </Link>
          <Link
            to="/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', fontSize: 13.5, fontWeight: 700, textDecoration: 'none',
              background: '#182238', border: '1px solid #283756', color: '#94a3b8', borderRadius: 10
            }}
          >
            <Home size={16}/> Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
