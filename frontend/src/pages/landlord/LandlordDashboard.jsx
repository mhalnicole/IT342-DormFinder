import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Building, PlusCircle, CheckCircle2, AlertTriangle, Users, BedDouble, Calendar,
  User, Phone, MapPin, Edit3, Save, X, KeyRound, Lock, AlertCircle
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

export default function LandlordDashboard() {
  const { user } = useAuth();
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    businessPermitNo: user?.profile?.businessPermitNo || 'BP-CEBU-2026-9041',
    officeAddress: user?.profile?.officeAddress || '142 N. Bacalso Ave, Sambag 1, Cebu City',
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
        await api.get('/landlord/dashboard');
        const profileRes = await api.get('/users/profile');
        if (profileRes && profileRes.success && profileRes.data) {
          const d = profileRes.data;
          setProfileForm({
            firstName: d.firstName || '',
            lastName: d.lastName || '',
            phoneNumber: d.phoneNumber || '',
            businessPermitNo: d.profileDetails?.businessPermitNo || '',
            officeAddress: d.profileDetails?.officeAddress || '',
          });
        }
      } catch (err) {
        console.error('Failed loading landlord data:', err);
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
        businessPermitNo: profileForm.businessPermitNo.trim(),
        officeAddress: profileForm.officeAddress.trim(),
      };
      const res = await api.put('/users/profile', payload);
      if (res && res.success) {
        setProfileSuccess('Landlord profile and credentials updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error((res && res.message) || 'Failed to update credentials.');
      }
    } catch (err) {
      setProfileError(err.message || 'Error saving landlord details.');
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
        setPasswordSuccess('Password successfully changed! Your previous password has been revoked.');
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

  const verified = user?.profile?.verificationStatus === 'VERIFIED';
  const tabs = [
    { key: 'overview', icon: <Building size={15}/>, label: 'Property & Room Inventory' },
    { key: 'profile',  icon: <User     size={15}/>, label: 'Credentials & Security'    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px', background: '#0a0d14' }}>
      <div className="obsidian-card slate-grid" style={{
        padding: '34px 38px', marginBottom: 28, background: '#19150d', border: '1px solid #3d2f16',
        display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <span className="pill-badge pill-amber" style={{ marginBottom: 14 }}>
            <Building size={13}/> Landlord Management Portal
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: 8 }}>
            Welcome back, <span style={{ color: '#f59e0b' }}>{profileForm.firstName || user?.firstName}!</span>
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 480, lineHeight: 1.6 }}>
            Manage room listings, monitor capacity vacancies, and confirm in-person inspection appointments.
          </p>
        </div>

        <div style={{ background: '#241b0b', border: '1px solid #4a3411', borderRadius: 14, padding: '16px 24px', textAlign: 'right', flexShrink: 0 }}>
          <span style={{ display: 'block', fontSize: 10.5, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            Accreditation Status
          </span>
          {verified
            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#10b981', fontWeight: 800, fontSize: 14 }}><CheckCircle2 size={16}/>Verified Landlord</span>
            : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontWeight: 800, fontSize: 14 }}><AlertTriangle size={16}/>Pending Review</span>}
          <div className="font-mono" style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4 }}>
            {profileForm.businessPermitNo || 'BP-CEBU-2026-9041'}
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
                ? { background: '#f59e0b', color: '#ffffff', border: 'none', boxShadow: '0 2px 10px rgba(245,158,11,0.3)' }
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
              icon={<Building size={22}/>}
              iconBg="rgba(245,158,11,0.12)"
              iconColor="#f59e0b"
              label="Listed Properties"
              value="0"
              sub="Registered buildings"
            />
            <StatCard
              icon={<BedDouble size={22}/>}
              iconBg="rgba(59,130,246,0.12)"
              iconColor="#3b82f6"
              label="Room Units / Beds"
              value="0"
              sub="Total capacity"
            />
            <StatCard
              icon={<Calendar size={22}/>}
              iconBg="rgba(16,185,129,0.12)"
              iconColor="#10b981"
              label="Viewing Requests"
              value="0"
              sub="Pending student visits"
              subColor="#10b981"
            />
            <StatCard
              icon={<Users size={22}/>}
              iconBg="rgba(245,158,11,0.12)"
              iconColor="#f59e0b"
              label="Tenant Inquiries"
              value="0"
              sub="Current semester"
            />
          </div>

          <div className="obsidian-card" style={{ padding: '28px 28px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
                  Property &amp; Room Inventory
                </h2>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>
                  Register and configure boarding houses, room rental rates, and photo galleries
                </p>
              </div>
              <button className="btn-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 13.5 }}>
                <PlusCircle size={16}/> Add New Property
              </button>
            </div>

            <div style={{ borderRadius: 12, padding: '52px 24px', textAlign: 'center', background: '#0a0d14', border: '1px dashed #202d46' }}>
              <div style={{ display: 'inline-flex', width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Building size={24} color="#f59e0b" />
              </div>
              <p style={{ fontWeight: 700, color: '#cbd5e1', fontSize: 14, marginBottom: 4 }}>No properties registered yet.</p>
              <p style={{ fontSize: 12.5, color: '#64748b', maxWidth: 420, margin: '0 auto' }}>
                Click "Add New Property" to publish your boarding house address near CIT-U, house rules, and monthly room rates.
              </p>
            </div>
          </div>

          <div className="obsidian-card" style={{ padding: '28px 28px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              Student Viewing Requests Inbox
            </h3>
            <div style={{ borderRadius: 12, padding: '36px 24px', textAlign: 'center', background: '#0a0d14', border: '1px solid #162034' }}>
              <Calendar size={28} style={{ color: '#64748b', margin: '0 auto 10px' }}/>
              <p style={{ color: '#94a3b8', fontSize: 13.5, marginBottom: 3, fontWeight: 600 }}>No pending inspection visits at this time.</p>
              <p style={{ fontSize: 12, color: '#64748b' }}>When students request a room visit, you will be notified here to confirm or reschedule the slot.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
          <div className="obsidian-card" style={{ padding: '32px 30px', background: '#111726' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid #1c273e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <User size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 900, color: '#f8fafc' }}>Landlord Credentials</h2>
                  <p style={{ fontSize: 12, color: '#64748b' }}>Office location and permit details</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setIsEditing(!isEditing); setProfileSuccess(''); setProfileError(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8,
                  background: isEditing ? '#1f2d48' : 'rgba(245,158,11,0.1)',
                  color: isEditing ? '#94a3b8' : '#f59e0b',
                  border: isEditing ? '1px solid #2a3d60' : '1px solid rgba(245,158,11,0.3)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}
              >
                {isEditing ? <><X size={14}/> Cancel</> : <><Edit3 size={14}/> Edit Info</>}
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

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>Business Permit Number</label>
                  <input
                    type="text"
                    value={profileForm.businessPermitNo}
                    onChange={e => setProfileForm({ ...profileForm, businessPermitNo: e.target.value })}
                    className="slate-input font-mono"
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 5 }}>Office / Management Address</label>
                  <input
                    type="text"
                    value={profileForm.officeAddress}
                    onChange={e => setProfileForm({ ...profileForm, officeAddress: e.target.value })}
                    className="slate-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-amber"
                  style={{ width: '100%', padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <Save size={15} />
                  <span>{savingProfile ? 'Saving...' : 'Save Credential Updates'}</span>
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { l: 'Landlord Name',        v: `${profileForm.firstName} ${profileForm.lastName}` },
                  { l: 'Email Address',        v: user?.email },
                  { l: 'Business Permit No.', v: profileForm.businessPermitNo || 'BP-CEBU-2026-9041', mono: true, vc: '#f59e0b' },
                  { l: 'Mobile Contact',       v: profileForm.phoneNumber || '+63 939 777 8888' },
                  { l: 'Office Address',       v: profileForm.officeAddress || '142 N. Bacalso Ave, Sambag 1, Cebu City' },
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
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
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
                className="btn-amber"
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
