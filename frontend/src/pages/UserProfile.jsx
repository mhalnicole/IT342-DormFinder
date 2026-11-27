import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Lock, Mail, Phone, BookOpen, GraduationCap, Building, Shield, CheckCircle2, AlertCircle, Save, KeyRound, ShieldAlert } from 'lucide-react';

export default function UserProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    course: '',
    yearLevel: 1,
    emergencyContact: '',
    businessPermitNo: '',
    officeAddress: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/users/profile');
        if (res && res.success && res.data) {
          const d = res.data;
          setProfileData({
            firstName: d.firstName || '',
            lastName: d.lastName || '',
            phoneNumber: d.phoneNumber || '',
            course: d.profileDetails?.course || '',
            yearLevel: d.profileDetails?.yearLevel || 1,
            emergencyContact: d.profileDetails?.emergencyContact || '',
            businessPermitNo: d.profileDetails?.businessPermitNo || '',
            officeAddress: d.profileDetails?.officeAddress || '',
          });
        }
      } catch (err) {
        setProfileError(err.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!profileData.firstName.trim() || !profileData.lastName.trim() || !profileData.phoneNumber.trim()) {
      setProfileError('First name, last name, and phone number are required.');
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        phoneNumber: profileData.phoneNumber.trim(),
        ...(user?.role === 'STUDENT' && {
          course: profileData.course.trim(),
          yearLevel: Number(profileData.yearLevel),
          emergencyContact: profileData.emergencyContact.trim(),
        }),
        ...(user?.role === 'LANDLORD' && {
          businessPermitNo: profileData.businessPermitNo.trim(),
          officeAddress: profileData.officeAddress.trim(),
        }),
      };

      const res = await api.put('/users/profile', payload);
      if (res && res.success) {
        setProfileSuccess('Your profile information was updated successfully!');
      } else {
        throw new Error((res && res.message) || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError(err.message || 'Error updating profile. Please verify your inputs.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!passwordData.currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.put('/users/change-password', passwordData);
      if (res && res.success) {
        setPasswordSuccess('Password changed successfully! Please use your new password next time you sign in.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error((res && res.message) || 'Failed to change password.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const roleLabels = {
    STUDENT: { label: 'College Student', color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', icon: <GraduationCap size={16} /> },
    LANDLORD: { label: 'Boarding House Landlord', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', icon: <Building size={16} /> },
    ADMIN: { label: 'Housing Administrator', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', icon: <Shield size={16} /> },
  };

  const currentRole = roleLabels[user?.role] || roleLabels.STUDENT;

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 20px', background: '#0a0d14' }}>
      <div className="obsidian-card" style={{ padding: '28px 32px', marginBottom: 28, background: '#111726', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: currentRole.bg, border: `1px solid ${currentRole.border}`, color: currentRole.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc' }}>
                {profileData.firstName} {profileData.lastName}
              </h1>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: currentRole.bg, color: currentRole.color, border: `1px solid ${currentRole.border}`, fontSize: 11, fontWeight: 700 }}>
                {currentRole.icon} {currentRole.label}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
              {user?.email} · CIT-University Housing Portal
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, padding: 4, borderRadius: 12, background: '#111726', border: '1px solid #1c273e', width: 'fit-content' }}>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 9,
            fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease',
            ...(activeTab === 'profile'
              ? { background: '#10b981', color: '#ffffff', border: 'none' }
              : { background: 'transparent', color: '#64748b', border: 'none' })
          }}
        >
          <User size={15} /> Profile Information
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 9,
            fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease',
            ...(activeTab === 'security'
              ? { background: '#10b981', color: '#ffffff', border: 'none' }
              : { background: 'transparent', color: '#64748b', border: 'none' })
          }}
        >
          <KeyRound size={15} /> Security &amp; Password
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="obsidian-card" style={{ padding: '32px 30px', background: '#111726' }}>
          <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #1c273e' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
              Personal Details &amp; Credentials
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              Update your personal details, contact number, and academic or business attributes.
            </p>
          </div>

          {profileSuccess && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 13 }}>
              <CheckCircle2 size={16} />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13 }}>
              <AlertCircle size={16} />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={profileData.firstName}
                  onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                  className="slate-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={profileData.lastName}
                  onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="slate-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                  Email Address (Primary Identity)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="slate-input"
                  style={{ opacity: 0.6, cursor: 'not-allowed', background: '#0a0d14' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                  Mobile Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    required
                    value={profileData.phoneNumber}
                    onChange={e => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    placeholder="+63 9XX XXX XXXX"
                    className="slate-input slate-input-icon"
                  />
                </div>
              </div>
            </div>

            {user?.role === 'STUDENT' && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #1c273e' }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                  Academic Enrollment Attributes
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                      Academic Program / Course
                    </label>
                    <input
                      type="text"
                      value={profileData.course}
                      onChange={e => setProfileData({ ...profileData, course: e.target.value })}
                      placeholder="e.g., BS Information Technology"
                      className="slate-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                      Year Level
                    </label>
                    <select
                      value={profileData.yearLevel}
                      onChange={e => setProfileData({ ...profileData, yearLevel: e.target.value })}
                      className="slate-input"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                      <option value={5}>5th Year</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                    Emergency Contact Number
                  </label>
                  <input
                    type="text"
                    value={profileData.emergencyContact}
                    onChange={e => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                    placeholder="+63 9XX XXX XXXX (Parent / Guardian)"
                    className="slate-input"
                  />
                </div>
              </div>
            )}

            {user?.role === 'LANDLORD' && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #1c273e' }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                  Boarding House Business Accreditation
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                      Business Permit Number
                    </label>
                    <input
                      type="text"
                      value={profileData.businessPermitNo}
                      onChange={e => setProfileData({ ...profileData, businessPermitNo: e.target.value })}
                      placeholder="e.g., BP-CEBU-2026-XXXX"
                      className="slate-input font-mono"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                      Office / Property Address
                    </label>
                    <input
                      type="text"
                      value={profileData.officeAddress}
                      onChange={e => setProfileData({ ...profileData, officeAddress: e.target.value })}
                      placeholder="e.g., 142 N. Bacalso Ave, Sambag 1, Cebu City"
                      className="slate-input"
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={savingProfile}
                className="btn-emerald"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', fontSize: 13.5, opacity: savingProfile ? 0.7 : 1 }}
              >
                <Save size={16} />
                <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="obsidian-card" style={{ padding: '32px 30px', background: '#111726' }}>
          <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #1c273e' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
              Change Account Password
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              Verify your current password and specify a new secure password. Your old password will be immediately invalidated.
            </p>
          </div>

          {passwordSuccess && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 13 }}>
              <CheckCircle2 size={16} />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13 }}>
              <AlertCircle size={16} />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ maxWidth: 480 }}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                Current Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="slate-input slate-input-icon"
                />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                New Password (Minimum 8 characters)
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="slate-input slate-input-icon"
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className="slate-input slate-input-icon"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="btn-emerald"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', fontSize: 13.5, opacity: savingPassword ? 0.7 : 1 }}
            >
              <KeyRound size={16} />
              <span>{savingPassword ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
