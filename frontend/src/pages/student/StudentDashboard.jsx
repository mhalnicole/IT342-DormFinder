import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { GraduationCap, Calendar, Heart, MapPin, Search, Clock, ShieldCheck, User, Compass, Hash, BookOpen, Phone } from 'lucide-react';

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

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab]     = useState('overview');

  useEffect(() => {
    api.get('/student/dashboard').catch(console.error).finally(() => setLoading(false));
  }, []);

  const tabs = [
    { key: 'overview', icon: <Compass size={15}/>, label: 'Overview & Search' },
    { key: 'profile',  icon: <User    size={15}/>, label: 'Student Profile'   },
  ];
  const nearby = ['Sambag 1 (0.3 km)', 'Sambag 2 (0.6 km)', 'Punta Princesa (1.2 km)', 'Basak San Nicolas (0.8 km)'];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px', background: '#0a0d14' }}>

      {/* ── Banner ── */}
      <div className="obsidian-card slate-grid" style={{
        padding: '34px 38px', marginBottom: 28, background: '#0e1628', border: '1px solid #1f3050',
        display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <span className="pill-badge pill-emerald" style={{ marginBottom: 14 }}>
            <GraduationCap size={13}/> Student Tenant Portal
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: 8 }}>
            Welcome back, <span style={{ color: '#10b981' }}>{user?.firstName}!</span>
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 480, lineHeight: 1.6 }}>
            Explore accredited boarding houses, verify amenities, and schedule in-person room inspections near CIT-U campus.
          </p>
        </div>

        {/* Student ID badge box */}
        <div style={{ background: '#131e34', border: '1px solid #24385e', borderRadius: 14, padding: '16px 24px', textAlign: 'right', flexShrink: 0 }}>
          <span style={{ display: 'block', fontSize: 10.5, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Enrolled Student ID
          </span>
          <span className="font-mono" style={{ fontSize: 20, fontWeight: 800, color: '#10b981', letterSpacing: '0.04em' }}>
            {user?.profile?.studentIdNumber || '23-0065-102'}
          </span>
          <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 3, fontWeight: 600 }}>
            {user?.profile?.course || 'BSIT'} · Year {user?.profile?.yearLevel || 3}
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, padding: 4, borderRadius: 12, background: '#111726', border: '1px solid #1c273e', width: 'fit-content' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 9,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease',
              ...(activeTab === t.key
                ? { background: '#10b981', color: '#ffffff', border: 'none', boxShadow: '0 2px 10px rgba(16,185,129,0.3)' }
                : { background: 'transparent', color: '#64748b', border: 'none' })
            }}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* 4 Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
            <StatCard
              icon={<Calendar size={22}/>}
              iconBg="rgba(16,185,129,0.12)"
              iconColor="#10b981"
              label="Viewing Requests"
              value="0"
              sub="Scheduled inspections"
            />
            <StatCard
              icon={<Heart size={22}/>}
              iconBg="rgba(244,63,94,0.12)"
              iconColor="#f43f5e"
              label="Saved Listings"
              value="0"
              sub="Bookmarked dorms"
            />
            <StatCard
              icon={<MapPin size={22}/>}
              iconBg="rgba(59,130,246,0.12)"
              iconColor="#3b82f6"
              label="CIT-U Proximity Target"
              value="0.45 km"
              sub="Walking distance radius"
              subColor="#3b82f6"
            />
            <StatCard
              icon={<ShieldCheck size={22}/>}
              iconBg="rgba(16,185,129,0.12)"
              iconColor="#10b981"
              label="Account Verification"
              value="Verified"
              sub="Active STUDENT Account"
              subColor="#10b981"
            />
          </div>

          {/* Search Listings Box */}
          <div className="obsidian-card" style={{ padding: '28px 28px' }}>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
                Search Boarding Houses &amp; Dorms Near CIT-U
              </h2>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>
                Filter room classifications (Single, Bedspace, Shared) and neighborhood proximity along N. Bacalso Avenue.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }}/>
                <input
                  type="text"
                  placeholder="Enter street, landmark, or barangay (e.g., Sambag 1, Sambag 2)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="slate-input slate-input-icon"
                  style={{ padding: '12px 14px 12px 42px', fontSize: 13.5 }}
                />
              </div>
              <button className="btn-emerald" style={{ padding: '0 28px', fontSize: 14 }}>Search</button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Accredited zones:</span>
              {nearby.map(n => (
                <button
                  key={n}
                  onClick={() => setSearchQuery(n.split(' (')[0])}
                  style={{
                    padding: '5px 14px', borderRadius: 20, background: '#162034', border: '1px solid #233454',
                    color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color='#10b981'; e.currentTarget.style.borderColor='rgba(16,185,129,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.borderColor='#233454'; }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Viewing Appointments Queue */}
          <div className="obsidian-card" style={{ padding: '28px 28px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              In-Person Inspection Appointments
            </h3>
            <div style={{ borderRadius: 12, padding: '44px 24px', textAlign: 'center', background: '#0a0d14', border: '1px dashed #202d46' }}>
              <div style={{ display: 'inline-flex', width: 48, height: 48, borderRadius: 12, background: 'rgba(16,185,129,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Clock size={24} color="#10b981" />
              </div>
              <p style={{ fontWeight: 700, color: '#cbd5e1', fontSize: 14, marginBottom: 4 }}>No scheduled room viewings yet.</p>
              <p style={{ fontSize: 12.5, color: '#64748b' }}>Search active dormitory listings above and click "Schedule Room Viewing" to set an inspection slot.</p>
            </div>
          </div>

        </div>
      )}

      {/* ── Tab: Student Profile ── */}
      {activeTab === 'profile' && (
        <div className="obsidian-card" style={{ padding: '32px 34px', maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26, paddingBottom: 20, borderBottom: '1px solid #1c273e' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <User size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc' }}>Student Profile Information</h2>
              <p style={{ fontSize: 12, color: '#64748b' }}>CIT-University verified enrollment record</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { l: 'Full Name',         v: `${user?.firstName} ${user?.lastName}` },
              { l: 'Email Address',     v: user?.email },
              { l: 'Student ID Number', v: user?.profile?.studentIdNumber || '23-0065-102', mono: true, vc: '#10b981' },
              { l: 'Mobile Contact',    v: user?.phoneNumber || '+63 928 333 4444' },
              { l: 'Academic Program',  v: user?.profile?.course || 'BS Information Technology' },
              { l: 'Year Level',        v: `Year ${user?.profile?.yearLevel || 3}` },
              { l: 'Emergency Contact', v: user?.profile?.emergencyContact || '+63 919 555 6666' },
            ].map((r, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #162034' : 'none' }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{r.l}</span>
                <span className={r.mono ? 'font-mono' : ''} style={{ fontSize: 13.5, fontWeight: 700, color: r.vc || '#f8fafc' }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
