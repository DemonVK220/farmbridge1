import React, { useState } from 'react';
import {
  Sprout, User, Phone, Mail, ShieldCheck, ArrowRight, Smartphone, AlertCircle,
  Lock, Building2, Users, Truck, CheckCircle2, FileText, UserPlus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, setCurrentView, currentUser } = useApp();
  const { setLanguage } = useLanguage();
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [method, setMethod] = useState<'otp' | 'email'>('otp');
  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('');
  const [landAcres, setLandAcres] = useState(1);
  const [cropsGrown, setCropsGrown] = useState('');
  const [organization, setOrganization] = useState('');
  const [gstin, setGstin] = useState('');
  const [informedConsent, setInformedConsent] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const demoOtp = '4821';
  const [error, setError] = useState<string | null>(null);

  const roleOptions: { id: UserRole; label: string; desc: string; icon: any }[] = [
    { id: 'customer', label: 'Household Buyer', desc: 'Buy produce for your family', icon: User },
    { id: 'farmer', label: 'Farmer', desc: 'Sell your harvest directly', icon: Sprout },
    { id: 'business', label: 'Business Buyer', desc: 'Bulk procurement & RFQs', icon: Building2 },
    { id: 'fpo', label: 'FPO / Group', desc: 'Aggregate member supply', icon: Users },
    { id: 'delivery', label: 'Delivery Partner', desc: 'Handle last-mile logistics', icon: Truck },
  ];

  if (currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto"><CheckCircle2 className="w-9 h-9" /></div>
        <h2 className="text-2xl font-bold font-serif text-stone-900">Already Signed In</h2>
        <p className="text-xs text-stone-500">You are signed in as <strong>{currentUser.name}</strong> ({currentUser.phone}).</p>
        <div className="flex justify-center gap-2 pt-2">
          <button onClick={() => setCurrentView('profile')} className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl cursor-pointer">Open Profile</button>
          <button onClick={() => setCurrentView('home')} className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl cursor-pointer">Back Home</button>
        </div>
      </div>
    );
  }

  const isRegister = authMode === 'register';
  const requiresFarmerFields = isRegister && role === 'farmer';
  const requiresBusinessFields = isRegister && (role === 'business' || role === 'fpo');

  const validateRegisterExtras = (): boolean => {
    if (requiresFarmerFields) {
      if (!village.trim() || !district.trim() || !stateName.trim() || !cropsGrown.trim()) {
        setError('Please fill village, district, state, and crops grown for farmer registration.');
        return false;
      }
      if (!informedConsent) {
        setError('You must acknowledge the informed consent statement to register as a farmer.');
        return false;
      }
    }
    if (requiresBusinessFields && !organization.trim()) {
      setError('Please enter your organisation / business name.');
      return false;
    }
    return true;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter your full name and a valid 10-digit mobile number.');
      return;
    }
    if (isRegister && !validateRegisterExtras()) return;
    setOtpSent(true);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp !== demoOtp && otp !== '1234') {
      setError(`Incorrect demo OTP. Use ${demoOtp} to continue.`);
      return;
    }
    const user = login({ name, phone, email, role });
    setLanguage(user.preferredLanguage);
    setCurrentView(
      role === 'farmer' ? 'farmer_dashboard'
      : role === 'business' ? 'business_dashboard'
      : role === 'fpo' ? 'fpo_dashboard'
      : role === 'delivery' ? 'delivery_dashboard'
      : 'customer_dashboard'
    );
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.includes('@') || password.length < 6) {
      setError('Please enter name, a valid email, and password of at least 6 characters.');
      return;
    }
    if (isRegister && !validateRegisterExtras()) return;
    const user = login({ name, phone: '+91 90000 00000', email, role });
    setLanguage(user.preferredLanguage);
    setCurrentView('customer_dashboard');
  };

  const switchMode = (newMode: 'signin' | 'register') => {
    setAuthMode(newMode);
    setError(null);
    setOtpSent(false);
    setOtp('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-3xl p-8 border border-emerald-800 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-8 h-8 text-emerald-400" />
              <span className="font-extrabold text-2xl font-serif">FarmBridge.in</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-white">{isRegister ? 'Join India’s Transparent Farm Marketplace' : 'Sign In to Buy or Sell Directly'}</h2>
            <p className="text-xs text-emerald-100 leading-relaxed">No commission. No hidden charges. Verified farmers, lab-tested batches, transparent mandi comparisons — all at ₹0 platform fee.</p>
            <div className="space-y-2 pt-2 border-t border-emerald-800 text-xs">
              <p className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />5-Level Evidence Verification</p>
              <p className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />Batch QR Traceability Passport</p>
              <p className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />₹0 Platform Fee Forever</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Demo Authentication Notice</strong>
              <p className="leading-relaxed mt-0.5">This is a functional prototype. Sign-in uses simulated OTP verification. In production this connects to a real SMS gateway and OAuth providers.</p>
            </div>
          </div>
          {isRegister && requiresFarmerFields && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-2">
              <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">What happens after farmer registration?</strong>
                <p className="leading-relaxed mt-0.5">You start at <strong>Level 1 (Phone Verified)</strong>. Levels 2–5 require evidence uploads, local verification, certificates, and NABL lab reports — all optional to progress.</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
          <div className="flex gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
            <button type="button" onClick={() => switchMode('signin')} className={`flex-1 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${authMode === 'signin' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'}`}>
              <Lock className="w-3.5 h-3.5" /> Sign In
            </button>
            <button type="button" onClick={() => switchMode('register')} className={`flex-1 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${authMode === 'register' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'}`}>
              <UserPlus className="w-3.5 h-3.5" /> Create Account
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" disabled title="Requires Google OAuth credentials" className="flex items-center justify-center gap-2 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-500 disabled:opacity-60 disabled:cursor-not-allowed">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              <span>Google</span>
            </button>
            <button type="button" disabled title="Requires Facebook OAuth credentials" className="flex items-center justify-center gap-2 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-500 disabled:opacity-60 disabled:cursor-not-allowed">
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              <span>Facebook</span>
            </button>
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
            <div className="relative inline-block px-3 bg-white text-[10px] font-bold uppercase tracking-wider text-stone-400">Or continue with OTP / Email</div>
          </div>

          <div>
            <h1 className="text-2xl font-bold font-serif text-stone-900">{isRegister ? 'Create your FarmBridge account' : 'Welcome back to FarmBridge'}</h1>
            <p className="text-xs text-stone-500 mt-1">{isRegister ? 'Choose your role. Registration is free at every level.' : 'Sign in to access your dashboard, orders, and saved items.'}</p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">I am signing up as:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {roleOptions.map((r) => {
                const Icon = r.icon;
                return (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${role === r.id ? 'border-emerald-700 bg-emerald-50/70 ring-2 ring-emerald-600/20' : 'border-stone-200 bg-stone-50 hover:bg-white'}`}>
                    <Icon className={`w-4 h-4 mb-1 ${role === r.id ? 'text-emerald-800' : 'text-stone-500'}`} />
                    <span className={`block text-xs font-bold ${role === r.id ? 'text-emerald-950' : 'text-stone-800'}`}>{r.label}</span>
                    <span className="text-[10px] text-stone-500 leading-tight block mt-0.5">{r.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
            <button type="button" onClick={() => { setMethod('otp'); setOtpSent(false); setError(null); }} className={`flex-1 py-2 rounded-xl transition-colors cursor-pointer ${method === 'otp' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'}`}>
              <Smartphone className="w-3.5 h-3.5 inline mr-1" /> Phone OTP
            </button>
            <button type="button" onClick={() => { setMethod('email'); setError(null); }} className={`flex-1 py-2 rounded-xl transition-colors cursor-pointer ${method === 'email' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'}`}>
              <Mail className="w-3.5 h-3.5 inline mr-1" /> Email
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" /><span>{error}</span>
            </div>
          )}

          {method === 'otp' && (
            <form onSubmit={otpSent ? handleVerify : handleSendOtp} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ananya Sharma" disabled={otpSent}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:opacity-60" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Phone Number</label>
                <div className="flex gap-2">
                  <span className="px-3 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700 font-medium">+91</span>
                  <input type="tel" required maxLength={10} value={phone.replace(/\D/g, '').slice(0, 10)} onChange={(e) => setPhone(e.target.value)} placeholder="98401 23456" disabled={otpSent}
                    className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:opacity-60" />
                </div>
              </div>

              {isRegister && requiresFarmerFields && !otpSent && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Village</label>
                      <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="e.g. Pennagaram" className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">District</label>
                      <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Dharmapuri" className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">State</label>
                      <input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="e.g. Tamil Nadu" className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Cultivated Land (Acres)</label>
                      <input type="number" step={0.1} min={0.1} value={landAcres} onChange={(e) => setLandAcres(Number(e.target.value))} className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Crops Grown</label>
                      <input type="text" value={cropsGrown} onChange={(e) => setCropsGrown(e.target.value)} placeholder="Tomatoes, Ragi, Moringa" className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                    </div>
                  </div>
                  <label className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl cursor-pointer">
                    <input type="checkbox" checked={informedConsent} onChange={(e) => setInformedConsent(e.target.checked)} className="mt-0.5 accent-emerald-800" />
                    <span className="text-[11px] text-emerald-950 leading-relaxed">
                      <strong>Informed Consent:</strong> I confirm I am a real farmer (or authorised FPO representative), and I agree to FarmBridge's verification and anti-resale policies.
                    </span>
                  </label>
                </>
              )}

              {isRegister && requiresBusinessFields && !otpSent && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Organisation / FPO Name <span className="text-red-600">*</span></label>
                    <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="e.g. Dakshin Kitchens Pvt Ltd" className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">GSTIN <span className="text-stone-400 font-normal">(optional)</span></label>
                    <input type="text" value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="29ABCDE1234F1Z5" className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                  </div>
                </>
              )}

              {otpSent && (
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">OTP sent (simulated)</strong>
                      <span className="text-[11px]">For demo, use <strong className="font-mono">{demoOtp}</strong> or <strong className="font-mono">1234</strong>.</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Enter 4-Digit OTP</label>
                    <input type="text" required maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="••••"
                      className="w-full px-3.5 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xl text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-2xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2">
                <span>{otpSent ? (isRegister ? 'Verify & Create Account' : 'Verify & Sign In') : 'Send OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {otpSent && <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="w-full text-xs text-stone-500 hover:text-stone-800 underline">Change phone number</button>}
            </form>
          )}

          {method === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rohan Kumar" className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full px-3.5 py-2.5 pr-12 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-500 hover:text-emerald-800 text-[10px] font-bold uppercase">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-2xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2">
                {isRegister ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              </button>
              {!isRegister && <button type="button" className="w-full text-xs text-stone-500 hover:text-stone-800 underline">Forgot password?</button>}
            </form>
          )}

          <div className="pt-3 border-t border-stone-200 text-center text-[11px] text-stone-500 leading-relaxed">
            By continuing, you agree to FarmBridge's{' '}
            <button onClick={() => setCurrentView('legal_terms')} className="text-emerald-800 font-semibold underline">Terms</button>{' '}and{' '}
            <button onClick={() => setCurrentView('legal_privacy')} className="text-emerald-800 font-semibold underline">Privacy Policy</button>.
          </div>
        </div>
      </div>
    </div>
  );
};