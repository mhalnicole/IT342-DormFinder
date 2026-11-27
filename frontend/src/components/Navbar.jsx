import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LogOut, Shield, Building, GraduationCap, User } from 'lucide-react';

export default function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dash = role === 'ADMIN' ? '/admin/dashboard' : role === 'LANDLORD' ? '/landlord/dashboard' : '/student/dashboard';

  const roleMeta = {
    STUDENT:  { label: 'Student',       icon: <GraduationCap size={12}/>, cls: 'pill-emerald' },
    LANDLORD: { label: 'Landlord',      icon: <Building      size={12}/>, cls: 'pill-amber'   },
    ADMIN:    { label: 'Administrator', icon: <Shield        size={12}/>, cls: 'pill-blue'    },
  };
  const rm = roleMeta[role];

  return (
    <header style={{ background: '#0e1422', borderBottom: '1px solid #1f2b44' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between" style={{ height: '60px' }}>
        <Link to={isAuthenticated ? dash : '/login'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(16,185,129,0.35)' }}>
            <Home size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1 }}>
              <span style={{ fontWeight: 800, fontSize: 17, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                Dorm<span style={{ color: '#10b981' }}>Finder</span>
              </span>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: '#18243c', color: '#94a3b8', border: '1px solid #28395a', letterSpacing: '0.08em' }}>
                CIT-U
              </span>
            </div>
            <p style={{ fontSize: 10.5, color: '#64748b', marginTop: 3 }}>Student Housing &amp; Boarding Portal</p>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
                  padding: '5px 10px', borderRadius: 8, background: '#131b2e', border: '1px solid #1f2b44'
                }}
                className="hidden sm:flex"
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#f8fafc' }}>{user?.firstName} {user?.lastName}</span>
                  <span style={{ fontSize: 10.5, color: '#64748b' }}>{user?.email}</span>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <User size={15} />
                </div>
              </Link>

              {rm && <span className={`pill-badge ${rm.cls} hidden sm:inline-flex`}>{rm.icon}{rm.label}</span>}

              <Link
                to="/profile"
                className="sm:hidden"
                style={{
                  padding: '7px 10px', borderRadius: 8, background: '#182238', border: '1px solid #273656',
                  color: '#94a3b8', display: 'flex', alignItems: 'center', textDecoration: 'none'
                }}
              >
                <User size={15} />
              </Link>

              <button 
                onClick={handleLogout}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', 
                  borderRadius: 8, background: '#182238', border: '1px solid #273656', 
                  color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' 
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#ef4444'; e.currentTarget.style.color='#f87171'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#273656'; e.currentTarget.style.color='#94a3b8'; }}>
                <LogOut size={14} /><span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '8px 14px', color: '#94a3b8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color='#f8fafc'} onMouseLeave={e => e.target.style.color='#94a3b8'}>
                Sign In
              </Link>
              <Link to="/register" className="btn-emerald" style={{ padding: '8px 18px', fontSize: 13, textDecoration: 'none', display: 'inline-block' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
