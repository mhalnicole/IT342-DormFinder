import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Shield, Users, GraduationCap, Building, Database, RefreshCw, CheckCircle, XCircle, Search } from 'lucide-react';

const StatCard = ({ icon, label, value, sub, subColor, iconBg, iconColor }) => (
  <div className="obsidian-card obsidian-card-hover" style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <span style={{ display: 'block', fontSize: 10.5, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</span>
      <div style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>{value}</div>
      <span style={{ fontSize: 11.5, color: subColor || '#94a3b8', marginTop: 3, display: 'block', fontWeight: 600 }}>{sub}</span>
    </div>
  </div>
);

const rolePills = {
  ADMIN:    { cls: 'pill-blue',    label: 'ADMIN' },
  LANDLORD: { cls: 'pill-amber',   label: 'LANDLORD' },
  STUDENT:  { cls: 'pill-emerald', label: 'STUDENT' },
};

export default function AdminDashboard() {
  const { user }  = useAuth();
  const [metrics, setMetrics]         = useState({ totalUsers:0, totalStudents:0, totalLandlords:0 });
  const [usersList, setUsersList]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [actionMsg, setActionMsg]     = useState('');
  const [searchTerm, setSearchTerm]   = useState('');

  const load = async () => {
    setLoading(true); setActionMsg('');
    try {
      const [mR, uR] = await Promise.all([api.get('/admin/dashboard'), api.get('/admin/users')]);
      if (mR?.success) setMetrics(mR.data);
      if (uR?.success) setUsersList(uR.data);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id, active) => {
    try {
      const r = await api.patch(`/admin/users/${id}/toggle-status`);
      if (r?.success) {
        setActionMsg(`User #${id} has been ${active ? 'deactivated' : 'reactivated'} successfully.`);
        load();
      }
    } catch(e){ alert(e.message || 'Failed to update user status.'); }
  };

  const filtered = usersList.filter(u => {
    const q = searchTerm.toLowerCase();
    return u.email.toLowerCase().includes(q) || u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px', background: '#0a0d14' }}>

      {/* ── Banner ── */}
      <div className="obsidian-card slate-grid" style={{
        padding: '34px 38px', marginBottom: 28, background: '#0e182e', border: '1px solid #1e3560',
        display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <span className="pill-badge pill-blue" style={{ marginBottom: 14 }}>
            <Shield size={13}/> System Administrator Portal
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: 8 }}>
            CIT-U Housing <span style={{ color: '#3b82f6' }}>Administration</span>
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 480, lineHeight: 1.6 }}>
            Monitor active platform accounts, verify landlord credentials, and govern system compliance in MariaDB.
          </p>
        </div>
        <button
          onClick={load}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10,
            background: '#16284a', border: '1px solid #294882', color: '#60a5fa', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background='#1f3764'}
          onMouseLeave={e => e.currentTarget.style.background='#16284a'}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/> Refresh Records
        </button>
      </div>

      {/* Action Notification */}
      {actionMsg && (
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderRadius: 10, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 13.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={16}/>{actionMsg}</div>
          <button onClick={() => setActionMsg('')} style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontWeight: 800 }}>✕</button>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, marginBottom: 26 }}>
        <StatCard
          icon={<Users size={22}/>}
          iconBg="rgba(59,130,246,0.12)"
          iconColor="#3b82f6"
          label="Total User Accounts"
          value={metrics.totalUsers}
          sub="Database persistent"
        />
        <StatCard
          icon={<GraduationCap size={22}/>}
          iconBg="rgba(16,185,129,0.12)"
          iconColor="#10b981"
          label="Student Accounts"
          value={metrics.totalStudents}
          sub="Role: STUDENT"
          subColor="#10b981"
        />
        <StatCard
          icon={<Building size={22}/>}
          iconBg="rgba(245,158,11,0.12)"
          iconColor="#f59e0b"
          label="Landlord Accounts"
          value={metrics.totalLandlords}
          sub="Role: LANDLORD"
          subColor="#f59e0b"
        />
        <StatCard
          icon={<Database size={22}/>}
          iconBg="rgba(16,185,129,0.12)"
          iconColor="#10b981"
          label="Database Link"
          value="MariaDB 10.4"
          sub="localhost:3306"
          subColor="#10b981"
        />
      </div>

      {/* User Accounts Management Table */}
      <div className="obsidian-card" style={{ overflow: 'hidden' }}>
        
        {/* Table Top Bar */}
        <div style={{ padding: '20px 26px', borderBottom: '1px solid #1c273e', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', marginBottom: 2 }}>User Accounts Governance</h2>
            <p style={{ fontSize: 12, color: '#64748b' }}>Live persistent directory of all registered accounts stored in MariaDB</p>
          </div>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }}/>
            <input
              type="text"
              placeholder="Search name, email, or role..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="slate-input slate-input-icon"
              style={{ fontSize: 13, padding: '9px 12px 9px 36px' }}
            />
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#0d1320', borderBottom: '1px solid #1c273e' }}>
              <tr>
                {['ID', 'User Details', 'Contact', 'Role', 'Profile Info', 'Status', 'Action'].map((h, i) => (
                  <th key={h} style={{ padding: '12px 20px', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', textAlign: i === 6 ? 'right' : 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((u, idx) => {
                const p = rolePills[u.role] || rolePills.STUDENT;
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #151d2e', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: '#64748b' }}>#{u.id}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: 13.5, marginBottom: 2 }}>{u.firstName} {u.lastName}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: 12.5 }}>{u.phoneNumber || '—'}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className={`pill-badge ${p.cls}`}>{p.label}</span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: 12.5, maxWidth: 200 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{u.additionalInfo || '—'}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {u.active
                        ? <span className="pill-badge pill-emerald"><CheckCircle size={11}/> Active</span>
                        : <span className="pill-badge pill-coral"><XCircle size={11}/> Disabled</span>}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      {u.role !== 'ADMIN' ? (
                        <button
                          onClick={() => toggle(u.id, u.active)}
                          style={{
                            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease',
                            ...(u.active
                              ? { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }
                              : { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' })
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity='0.75'}
                          onMouseLeave={e => e.currentTarget.style.opacity='1'}
                        >
                          {u.active ? 'Deactivate' : 'Reactivate'}
                        </button>
                      ) : (
                        <span style={{ fontSize: 11.5, color: '#64748b', fontStyle: 'italic' }}>Protected</span>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontSize: 13 }}>
                    {loading ? 'Loading user directory from MariaDB...' : 'No accounts matching search criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
