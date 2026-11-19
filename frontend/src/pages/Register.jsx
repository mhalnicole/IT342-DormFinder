import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, GraduationCap, Building, Mail, Lock, Phone, AlertCircle, User, Hash, BookOpen, ChevronDown, ArrowRight } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    firstName:'', lastName:'', email:'', phoneNumber:'', password:'', confirmPassword:'',
    studentIdNumber:'', course:'BSIT', yearLevel:1, emergencyContact:'',
    businessPermitNo:'', officeAddress:'',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const handle = e => { const {name,value} = e.target; setFormData(p=>({...p,[name]:value})); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!formData.firstName||!formData.lastName||!formData.email||!formData.password) { setError('Please fill in all mandatory account fields.'); return; }
    if (formData.password.length<6) { setError('Password must be at least 6 characters in length.'); return; }
    if (formData.password!==formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (role==='STUDENT'&&!formData.studentIdNumber) { setError('Student ID Number is required for enrollment validation.'); return; }
    if (role==='LANDLORD'&&!formData.officeAddress) { setError('Boarding house physical address is required.'); return; }
    setLoading(true);
    try {
      const payload = { role, firstName:formData.firstName, lastName:formData.lastName, email:formData.email, phoneNumber:formData.phoneNumber, password:formData.password,
        ...(role==='STUDENT' ? {studentIdNumber:formData.studentIdNumber,course:formData.course,yearLevel:parseInt(formData.yearLevel),emergencyContact:formData.emergencyContact}
                             : {businessPermitNo:formData.businessPermitNo,officeAddress:formData.officeAddress}) };
      const d = await register(payload);
      navigate(d.role==='LANDLORD' ? '/landlord/dashboard' : '/student/dashboard');
    } catch (err) { setError(err.message||'Registration failed. Please check your data.'); }
    finally { setLoading(false); }
  };

  const isSt = role==='STUDENT';

  const Lbl = ({children}) => (
    <label style={{ display:'block',fontSize:11,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:6 }}>
      {children}
    </label>
  );

  return (
    <div style={{ minHeight:'calc(100vh - 60px)', background:'#0a0d14', display:'flex', alignItems:'center', justifyContent:'center', padding:'36px 16px' }}>
      <div style={{ width:'100%', maxWidth:580 }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ display:'inline-flex',width:50,height:50,borderRadius:14,alignItems:'center',justifyContent:'center',marginBottom:12,background:isSt?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)',border:`1px solid ${isSt?'rgba(16,185,129,0.3)':'rgba(245,158,11,0.3)'}` }}>
            <UserPlus size={24} style={{ color:isSt?'#10b981':'#f59e0b' }} />
          </div>
          <h1 style={{ fontSize:26,fontWeight:900,color:'#f8fafc',letterSpacing:'-0.02em',marginBottom:6 }}>Create your account</h1>
          <p style={{ fontSize:13.5,color:'#94a3b8' }}>Join DormFinder to discover or list accredited housing near CIT-U</p>
        </div>

        {/* Card */}
        <div className="obsidian-card" style={{ padding:'32px 30px', background:'#111726' }}>

          {/* Role selector switcher */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:26,padding:4,borderRadius:12,background:'#0a0d14',border:'1px solid #1c273e' }}>
            <button
              type="button"
              onClick={()=>{setRole('STUDENT');setError('');}}
              style={{
                display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'10px 14px',borderRadius:9,
                fontSize:13,fontWeight:700,cursor:'pointer',transition:'all 0.15s ease',
                ...(isSt ? {background:'#10b981',color:'#ffffff',border:'none',boxShadow:'0 2px 10px rgba(16,185,129,0.3)'}
                         : {background:'transparent',color:'#64748b',border:'none'})
              }}
            >
              <GraduationCap size={16}/> College Student
            </button>
            <button
              type="button"
              onClick={()=>{setRole('LANDLORD');setError('');}}
              style={{
                display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'10px 14px',borderRadius:9,
                fontSize:13,fontWeight:700,cursor:'pointer',transition:'all 0.15s ease',
                ...(!isSt ? {background:'#f59e0b',color:'#ffffff',border:'none',boxShadow:'0 2px 10px rgba(245,158,11,0.3)'}
                          : {background:'transparent',color:'#64748b',border:'none'})
              }}
            >
              <Building size={16}/> Boarding House Landlord
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div style={{ marginBottom:20,display:'flex',alignItems:'flex-start',gap:10,padding:'12px 14px',borderRadius:10,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#f87171',fontSize:13 }}>
              <AlertCircle size={16} style={{ flexShrink:0,marginTop:1 }}/><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Names */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14 }}>
              <div>
                <Lbl>First Name *</Lbl>
                <div style={{ position:'relative' }}>
                  <User size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handle} placeholder="Juan" className="slate-input slate-input-icon" />
                </div>
              </div>
              <div>
                <Lbl>Last Name *</Lbl>
                <div style={{ position:'relative' }}>
                  <User size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handle} placeholder="Dela Cruz" className="slate-input slate-input-icon" />
                </div>
              </div>
            </div>

            {/* Email + Phone */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14 }}>
              <div>
                <Lbl>Email Address *</Lbl>
                <div style={{ position:'relative' }}>
                  <Mail size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                  <input type="email" name="email" required value={formData.email} onChange={handle} placeholder="juan@cit.edu" className="slate-input slate-input-icon" />
                </div>
              </div>
              <div>
                <Lbl>Mobile Number</Lbl>
                <div style={{ position:'relative' }}>
                  <Phone size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                  <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handle} placeholder="+63 912 345 6789" className="slate-input slate-input-icon" />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20 }}>
              <div>
                <Lbl>Password * (min 6 chars)</Lbl>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                  <input type="password" name="password" required value={formData.password} onChange={handle} placeholder="••••••••" className="slate-input slate-input-icon" />
                </div>
              </div>
              <div>
                <Lbl>Confirm Password *</Lbl>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                  <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handle} placeholder="••••••••" className="slate-input slate-input-icon" />
                </div>
              </div>
            </div>

            {/* Role specific divider */}
            <div style={{ margin:'22px 0 16px', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ flex:1, height:1, background:'#1c273e' }} />
              <span style={{ fontSize:10.5, fontWeight:800, color:isSt?'#10b981':'#f59e0b', textTransform:'uppercase', letterSpacing:'0.09em' }}>
                {isSt ? 'CIT-U Student Enrollment Info' : 'Landlord Accreditation & Office'}
              </span>
              <div style={{ flex:1, height:1, background:'#1c273e' }} />
            </div>

            {/* Student fields */}
            {isSt && (
              <div style={{ marginBottom:20 }}>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:12 }}>
                  <div>
                    <Lbl>Student ID *</Lbl>
                    <div style={{ position:'relative' }}>
                      <Hash size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                      <input type="text" name="studentIdNumber" required value={formData.studentIdNumber} onChange={handle} placeholder="23-0065-102" className="slate-input slate-input-icon" />
                    </div>
                  </div>
                  <div>
                    <Lbl>Academic Program</Lbl>
                    <div style={{ position:'relative' }}>
                      <BookOpen size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                      <select name="course" value={formData.course} onChange={handle} className="slate-input slate-input-icon" style={{ appearance:'none',cursor:'pointer' }}>
                        {['BSIT','BSCS','BSCE','BSME','BSN','BSBA'].map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={13} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                    </div>
                  </div>
                  <div>
                    <Lbl>Year Level</Lbl>
                    <div style={{ position:'relative' }}>
                      <select name="yearLevel" value={formData.yearLevel} onChange={handle} className="slate-input" style={{ appearance:'none',cursor:'pointer' }}>
                        {[1,2,3,4].map(y=><option key={y} value={y}>{y}{y===1?'st':y===2?'nd':y===3?'rd':'th'} Year</option>)}
                      </select>
                      <ChevronDown size={13} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                    </div>
                  </div>
                </div>
                <div>
                  <Lbl>Emergency Contact (Parent / Guardian)</Lbl>
                  <div style={{ position:'relative' }}>
                    <Phone size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#64748b',pointerEvents:'none' }}/>
                    <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handle} placeholder="+63 919 555 6666" className="slate-input slate-input-icon" />
                  </div>
                </div>
              </div>
            )}

            {/* Landlord fields */}
            {!isSt && (
              <div style={{ marginBottom:20 }}>
                <div style={{ marginBottom:14 }}>
                  <Lbl>Business Permit / Barangay Clearance No.</Lbl>
                  <input type="text" name="businessPermitNo" value={formData.businessPermitNo} onChange={handle} placeholder="e.g., BP-CEBU-2026-9041" className="slate-input" />
                </div>
                <div>
                  <Lbl>Boarding House / Office Address *</Lbl>
                  <input type="text" name="officeAddress" required value={formData.officeAddress} onChange={handle} placeholder="e.g., 142 N. Bacalso Ave, Sambag 1, Cebu City" className="slate-input" />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={isSt ? 'btn-emerald' : 'btn-amber'}
              style={{ width:'100%',padding:'12px 20px',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:loading?0.6:1 }}
            >
              {loading ? 'Creating Account...' : <><span>Complete {isSt?'Student':'Landlord'} Registration</span><ArrowRight size={16}/></>}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center',marginTop:24,fontSize:13,color:'#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#10b981',fontWeight:700,textDecoration:'none' }}>Sign in here →</Link>
        </p>
      </div>
    </div>
  );
}
