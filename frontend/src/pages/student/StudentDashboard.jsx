import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  GraduationCap, Calendar, Heart, MapPin, Search, Clock, ShieldCheck,
  User, Compass, Edit3, Save, X, KeyRound, Lock, CheckCircle2, AlertCircle, Phone
} from 'lucide-react';

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

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    course: user?.profile?.course || 'BS Information Technology',
    yearLevel: user?.profile?.yearLevel || 3,
    emergencyContact: user?.profile?.emergencyContact || '+63 919 555 6666',
  });
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        await api.get('/student/dashboard');
        const profileRes = await api.get('/users/profile');
        if (profileRes && profileRes.success && profileRes.data) {
          const d = profileRes.data;
          setProfileForm({
            firstName: d.firstName || '',
            lastName: d.lastName || '',
            phoneNumber: d.phoneNumber || '',
            course: d.profileDetails?.course || '',
            yearLevel: d.profileDetails?.yearLevel || 1,
            emergencyContact: d.profileDetails?.emergencyContact || '',
          });
        }
      } catch (err) {
        console.error('Failed loading student data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!profileForm.firstName.trim() || !profileForm.lastName.trim() || !profileForm.phoneNumber.trim()) {
      setProfileError('First name, last name, and phone number are required.');
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phoneNumber: profileForm.phoneNumber.trim(),
        course: profileForm.course.trim(),
        yearLevel: Number(profileForm.yearLevel),
        emergencyContact: profileForm.emergencyContact.trim(),
      };
      const res = await api.put('/users/profile', payload);
      if (res && res.success) {
        setProfileSuccess('Student profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error((res && res.message) || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError(err.message || 'Error saving profile modifications.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.put('/users/change-password', passwordForm);
      if (res && res.success) {
        setPasswordSuccess('Password successfully updated! Your old password is no longer valid.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error((res && res.message) || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Error changing password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const tabs = [
    { key: 'overview', icon: <Compass size={15}/>, label: 'Overview & Search' },
    { key: 'profile',  icon: <User    size={15}/>, label: 'Student Profile & Security' },
  ];
  const nearby = ['Sambag 1 (0.3 km)', 'Sambag 2 (0.6 km)', 'Punta Princesa (1.2 km)', 'Basak San Nicolas (0.8 km)'];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px', background: '#0a0d14' }}>
      <div className="obsidian-card slate-grid" style={{
        padding: '34px 38px', marginBottom: 28, background: '#0e1628', border: '1px solid #1f3050',
        display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <span className="pill-badge pill-emerald" style={{ marginBottom: 14 }}>
            <GraduationCap size={13}/> Student Tenant Portal
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: 8 }}>
            Welcome back, <span style={{ color: '#10b981' }}>{profileForm.firstName || user?.firstName}!</span>
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 480, lineHeight: 1.6 }}>
            Explore accredited boarding houses, verify amenities, and schedule in-person room inspections near CIT-U campus.
          </p>
        </div>

        <div style={{ background: '#131e34', border: '1px solid #24385e', borderRadius: 14, padding: '16px 24px', textAlign: 'right', flexShrink: 0 }}>
          <span style={{ display: 'block', fontSize: 10.5, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Enrolled Student ID
          </span>
          <span className="font-mono" style={{ fontSize: 20, fontWeight: 800, color: '#10b981', letterSpacing: '0.04em' }}>
            {user?.profile?.studentIdNumber || '23-0065-102'}
          </span>
          <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 3, fontWeight: 600 }}>
            {profileForm.course || 'BSIT'} · Year {profileForm.yearLevel || 3}
          </div>
        </div>
      </div>

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

      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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

      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
          <div className="obsidian-card" style={{ padding: '32px 30px', background: '#111726' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid #1c273e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <User size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 900, color: '#f8fafc' }}>Student Profile</h2>
                  <p style={{ fontSize: 12, color: '#64748b' }}>View and modify enrollment data</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setIsEditing(!isEditing); setProfileSuccess(''); setProfileError(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8,
                  background: isEditing ? '#1f2d48' : 'rgba(16,185,129,0.1)',
                  color: isEditing ? '#94a3b8' : '#10b981',
                  border: isEditing ? '1px solid #2a3d60' : '1px solid rgba(16,185,129,0.3)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}
              >
                {isEditing ? <><X size={14}/> Cancel</> : <><Edit3 size={14}/> Edit Profile</>}
              </button>
            </div>

            {profileSuccess && (
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 12.5 }}>
                <CheckCircle2 size={15} /> <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 12.5 }}>
                <AlertCircle size={15} /> <span>{profileError}</span>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleProfileSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>First Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.firstName}
                      onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="slate-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>Last Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.lastName}
                      onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="slate-input"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>Mobile Contact</label>
                  <input
                    type="text"
                    required
                    value={profileForm.phoneNumber}
                    onChange={e => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                    className="slate-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>Academic Program</label>
                    <input
                      type="text"
                      value={profileForm.course}
                      onChange={e => setProfileForm({ ...profileForm, course: e.target.value })}
                      className="slate-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>Year Level</label>
                    <select
                      value={profileForm.yearLevel}
                      onChange={e => setProfileForm({ ...profileForm, yearLevel: Number(e.target.value) })}
                      className="slate-input"
                    >
                      {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>Emergency Contact</label>
                  <input
                    type="text"
                    value={profileForm.emergencyContact}
                    onChange={e => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                    className="slate-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-emerald"
                  style={{ width: '100%', padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <Save size={15} />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { l: 'Full Name',         v: `${profileForm.firstName} ${profileForm.lastName}` },
                  { l: 'Email Address',     v: user?.email },
                  { l: 'Student ID Number', v: user?.profile?.studentIdNumber || '23-0065-102', mono: true, vc: '#10b981' },
                  { l: 'Mobile Contact',    v: profileForm.phoneNumber || '+63 928 333 4444' },
                  { l: 'Academic Program',  v: profileForm.course || 'BS Information Technology' },
                  { l: 'Year Level',        v: `Year ${profileForm.yearLevel || 3}` },
                  { l: 'Emergency Contact', v: profileForm.emergencyContact || '+63 919 555 6666' },
                ].map((r, i, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < arr.length - 1 ? '1px solid #162034' : 'none' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{r.l}</span>
                    <span className={r.mono ? 'font-mono' : ''} style={{ fontSize: 13, fontWeight: 700, color: r.vc || '#f8fafc' }}>{r.v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="obsidian-card" style={{ padding: '32px 30px', background: '#111726' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid #1c273e' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <KeyRound size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 900, color: '#f8fafc' }}>Change Password</h2>
                <p style={{ fontSize: 12, color: '#64748b' }}>Update account access password</p>
              </div>
            </div>

            {passwordSuccess && (
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 12.5 }}>
                <CheckCircle2 size={15} /> <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 12.5 }}>
                <AlertCircle size={15} /> <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="slate-input slate-input-icon"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="slate-input slate-input-icon"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Repeat new password"
                    className="slate-input slate-input-icon"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="btn-emerald"
                style={{ width: '100%', padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <KeyRound size={15} />
                <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
