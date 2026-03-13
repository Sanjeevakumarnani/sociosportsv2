import React, { useRef, useEffect, useState } from 'react';
import {
  X, User, Mail, Phone, MapPin, Award, ChevronDown,
  CheckCircle, Loader2, ArrowRight, ArrowLeft, Camera,
  Briefcase, Globe, ShieldCheck, Trophy, Sparkles
} from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface SportsPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIdentity?: Identity;
}

type RegistrationStep = 'METHOD' | 'PHONE' | 'OTP' | 'EMAIL_REG' | 'PASSWORD' | 'IDENTITY' | 'DETAILS' | 'PROFILE' | 'WELCOME';
type Identity = 'GENERAL' | 'TRAINER' | 'ATHLETE' | null;

const SportsPersonModal: React.FC<SportsPersonModalProps> = ({ isOpen, onClose, defaultIdentity = null }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useFocusTrap(modalRef, isOpen, onClose);

  const [step, setStep] = useState<RegistrationStep>('PHONE');
  const [identity, setIdentity] = useState<Identity>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadedImageResponse, setUploadedImageResponse] = useState<any>(null);
  const [sportsId, setSportsId] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [userExistsInModal, setUserExistsInModal] = useState('');

  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    fullName: '',
    email: '',
    password: '',
    profession: '',
    location: '',
    sport: '',
    experience: '',
  });

  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleClose = () => {
    setFormData({
      phone: '', otp: '', fullName: '', email: '',
      password: '', profession: '', location: '', sport: '', experience: ''
    });
    setStep('PHONE');
    setIdentity(null);
    setProfileImage(null);
    setUploadedImageResponse(null);
    setPasswordErrors([]);
    setUserExistsInModal('');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Generate ID logic moved to identity selection for correct prefix
      if (defaultIdentity) {
        setIdentity(defaultIdentity);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Update ID when identity changes
  useEffect(() => {
    if (!identity && !defaultIdentity) return;

    const currentIdentity = identity || defaultIdentity;
    let prefix = 'SS';

    if (currentIdentity === 'ATHLETE') prefix = 'AT';
    else if (currentIdentity === 'TRAINER') prefix = 'CO';

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setSportsId(`${prefix}${randomNum}`);
  }, [identity, defaultIdentity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const phoneDigits = (formData.phone || '').replace(/\D/g, '').trim();

  const handleSendOTP = async () => {
    if (!phoneDigits || phoneDigits.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    try {
      await api.userLogin(phoneDigits);
      toast.success('Code sent! Please check your phone.');
      setStep('OTP');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (formData.otp.length < 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.userLoginWithOtp(phoneDigits, formData.otp);
      if (res?.token) {
        setUserExistsInModal('User already exists. Use a different number.');
        return;
      }
      setUserExistsInModal('');
      setStep('IDENTITY');
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.commonUpload(file, 'user');
      setUploadedImageResponse(res);
      setProfileImage(res?.Location ?? res?.url ?? res?.path ?? null);
      toast.success('Photo uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
    if (!/[0-9]/.test(password)) errors.push('At least one number');
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) errors.push('At least one special character (!@#$%^&*...)');
    if (password.length < 8) errors.push('At least 8 characters');
    return errors;
  };

  const handleFinish = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error('Please fill in your name and email');
      return;
    }
    setIsLoading(true);
    try {
      // Register user account if password was provided
      if (formData.password) {
        try {
          const response = await api.register({
            email: formData.email,
            password: formData.password,
            name: formData.fullName,
            role: identity as any
          });
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        } catch (regError: any) {
          // Non-blocking: if user already exists or registration fails, still proceed
          console.warn('Account registration step:', regError.message);
        }
      }

      // User/create with upload response in images array (same as Build your identity)
      let photos: any[] = [];
      if (uploadedImageResponse) {
        const rawArray = Array.isArray(uploadedImageResponse) ? uploadedImageResponse : [uploadedImageResponse];
        photos = rawArray.map((u: any) => {
          const primaryUrl = u?.Location ?? u?.url ?? u?.path ?? u?.src ?? '';
          return {
            ...u,
            Location: u?.Location ?? primaryUrl,
            url: u?.url ?? primaryUrl,
          };
        });
      }

      await api.userCreate({
        first_name: formData.fullName,
        phonenumber: phoneDigits,
        email: formData.email,
        dob: '2000-01-01',
        user_type: identity === 'ATHLETE' ? 'Sportsman/Athlete' : identity === 'TRAINER' ? 'Trainer' : 'General',
        professional_title: formData.profession || undefined,
        photos: photos.length > 0 ? photos : undefined,
      });

      // Optional: only run if backend has these endpoints; do not block success
      try {
        await api.createInquiry({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: `New ${identity} Registration`,
          message: `Identity: ${identity} | Profession: ${formData.profession} | Location: ${formData.location} | ID: ${sportsId}`
        });
      } catch (e) {
        console.warn('createInquiry skipped:', (e as Error).message);
      }
      try {
        await api.finishRegistration({
          email: formData.email,
          name: formData.fullName,
          sportsId,
          role: identity as any
        });
      } catch (e) {
        console.warn('finishRegistration skipped:', (e as Error).message);
      }
      try {
        const createdProfile = await api.sportsProfiles.create({
          sportsId,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone || '',
          role: identity as any,
          sport: undefined,
          profession: identity === 'TRAINER' ? formData.profession : undefined,
          location: formData.location,
          image: profileImage
        });
        const realId =
          (createdProfile as any)?.sportsId ??
          (createdProfile as any)?.sports_id ??
          (createdProfile as any)?.member_id ??
          (createdProfile as any)?.id;
        if (realId) {
          setSportsId(String(realId));
        }
      } catch (e) {
        console.warn('sportsProfiles.create skipped:', (e as Error).message);
      }

      setStep('WELCOME');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setFormData({
      phone: '', otp: '', fullName: '', email: '',
      password: '', profession: '', location: '', sport: '', experience: ''
    });
    setStep('PHONE');
    setIdentity(null);
    setProfileImage(null);
    setUploadedImageResponse(null);
    setPasswordErrors([]);
    handleClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'METHOD':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Join the Movement</h2>
              <p className="text-[var(--text-secondary)]">Enter your mobile number to get started</p>
            </div>

            <button
              onClick={() => setStep('PHONE')}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10 group"
            >
              <Phone className="w-5 h-5 text-[var(--accent-orange)] group-hover:scale-110 transition-transform" />
              Continue with Mobile (OTP)
            </button>
          </motion.div>
        );

      case 'EMAIL_REG':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button onClick={() => setStep('METHOD')} className="flex items-center gap-1 text-[var(--accent-orange)] text-sm font-medium mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to methods
            </button>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Email Registration</h2>
              <p className="text-[var(--text-secondary)]">Create an account with your email</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1 mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--accent-orange)] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1 mb-1.5 block">Set Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => {
                    handleChange(e);
                    setPasswordErrors(validatePassword(e.target.value));
                  }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border text-white focus:outline-none transition-all ${formData.password && passwordErrors.length === 0
                    ? 'border-green-500/60 focus:border-green-400'
                    : formData.password && passwordErrors.length > 0
                      ? 'border-red-500/60 focus:border-red-400'
                      : 'border-white/10 focus:border-[var(--accent-orange)]'
                    }`}
                />
                {/* Password requirements checklist */}
                <div className="mt-3 space-y-1.5">
                  {[
                    { label: 'At least 8 characters', test: formData.password.length >= 8 },
                    { label: 'One uppercase letter (A-Z)', test: /[A-Z]/.test(formData.password) },
                    { label: 'One number (0-9)', test: /[0-9]/.test(formData.password) },
                    { label: 'One special character (!@#$%...)', test: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${!formData.password ? 'bg-white/10' : req.test ? 'bg-green-500' : 'bg-red-500/60'
                        }`}>
                        {req.test && formData.password && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-xs transition-colors ${!formData.password ? 'text-white/30' : req.test ? 'text-green-400' : 'text-red-400'
                        }`}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!formData.email || !formData.password) {
                  toast.error('Please enter email and password');
                  return;
                }
                const errors = validatePassword(formData.password);
                if (errors.length > 0) {
                  toast.error('Password must have: ' + errors.join(', '));
                  return;
                }
                setPasswordErrors([]);
                setStep('IDENTITY');
              }}
              className="w-full btn-primary py-4 text-lg font-bold"
            >
              Continue
            </button>
          </motion.div>
        );

      // --- PASSWORD step commented out: after OTP success go directly to IDENTITY ---
      // case 'PASSWORD':
      //   return (
      //     <motion.div
      //       initial={{ opacity: 0, x: 20 }}
      //       animate={{ opacity: 1, x: 0 }}
      //       exit={{ opacity: 0, x: -20 }}
      //       className="space-y-6"
      //     >
      //       <div className="text-center mb-8">
      //         <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Set Your Password</h2>
      //         <p className="text-[var(--text-secondary)]">Create a secure password for your SocioSports ID</p>
      //       </div>
      //       <div>
      //         <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1 mb-1.5 block">Password</label>
      //         <input
      //           type="password"
      //           name="password"
      //           value={formData.password}
      //           onChange={(e) => {
      //             handleChange(e);
      //             setPasswordErrors(validatePassword(e.target.value));
      //           }}
      //           placeholder="••••••••"
      //           className={...}
      //         />
      //         <div className="mt-3 space-y-1.5"> ... password requirements ... </div>
      //       </div>
      //       <button onClick={() => { validatePassword; setStep('IDENTITY'); }}>Set & Continue</button>
      //     </motion.div>
      //   );
      case 'PASSWORD':
        return null; // password step disabled; after OTP we go to IDENTITY

      case 'PHONE':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Registration</h2>
              <p className="text-[var(--text-secondary)]">Enter your mobile number to get started</p>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-white/10 pr-3">
                <span className="text-white font-bold">🇮🇳 +91</span>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                maxLength={10}
                inputMode="numeric"
                placeholder="Phone Number"
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData(prev => ({ ...prev, phone: digitsOnly }));
                }}
                className="w-full pl-24 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-lg focus:outline-none focus:border-[var(--accent-orange)] transition-all"
              />
            </div>
            <button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'} <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        );

      case 'OTP':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button
              onClick={() => { setStep('PHONE'); setUserExistsInModal(''); }}
              className="flex items-center gap-1 text-[var(--accent-orange)] text-sm font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Change Number
            </button>
            {userExistsInModal && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                <p className="text-amber-200 text-sm font-medium">{userExistsInModal}</p>
              </div>
            )}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Verify OTP</h2>
              <p className="text-[var(--text-secondary)]">Enter the code sent to {formData.phone}</p>
              <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest">(Logged to server console)</p>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  ref={el => { otpInputs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  className="w-full aspect-square text-center text-xl font-bold rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)]"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && i < 5) otpInputs.current[i + 1]?.focus();
                    const newOtp = formData.otp.split('');
                    newOtp[i] = val;
                    setFormData(prev => ({ ...prev, otp: newOtp.join('') }));
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOTP}
              disabled={isLoading}
              className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
            </button>
          </motion.div>
        );

      case 'IDENTITY':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Choose Your Identity</h2>
              <p className="text-[var(--text-secondary)]">How would you like to use SocioSports?</p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  id: 'ATHLETE',
                  label: 'Sportsman / Athlete',
                  icon: Trophy,
                  desc: 'Compete, track performance and grow',
                  gradient: 'from-orange-500/20 to-red-500/20',
                  accent: 'orange'
                },
                {
                  id: 'TRAINER',
                  label: 'Trainer / Coach',
                  icon: Award,
                  desc: 'Manage athletes and grow your brand',
                  gradient: 'from-purple-500/20 to-pink-500/20',
                  accent: 'purple'
                },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setIdentity(role.id as Identity)}
                  className={`flex items-center gap-5 p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${identity === role.id
                    ? `bg-gradient-to-r ${role.gradient} border-[var(--accent-orange)] shadow-[0_0_30px_rgba(249,115,22,0.15)]`
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                    }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${identity === role.id ? 'bg-[var(--accent-orange)] text-white' : 'bg-white/10 text-white/50'
                    }`}>
                    <role.icon className="w-7 h-7" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white text-lg font-black tracking-tight">{role.label}</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{role.desc}</p>
                  </div>

                  {identity === role.id && (
                    <div className="absolute top-4 right-4 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_10px_var(--accent-orange)]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              disabled={!identity}
              onClick={() => setStep('DETAILS')}
              className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50"
            >
              Continue
            </button>
          </motion.div>
        );

      case 'DETAILS':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Basic Details
              </h2>
              <p className="text-[var(--text-secondary)]">A few more things to set up your profile</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--accent-orange)] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1 mb-1.5 block">Email Address (For ID Delivery)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--accent-orange)] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1 mb-1.5 block">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="e.g. Athlete, Coach, Sports Enthusiast"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--accent-orange)] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1 mb-1.5 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--accent-orange)] focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep('IDENTITY')}
                className="w-1/3 py-4 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep('PROFILE')}
                className="flex-1 btn-primary py-4 text-lg font-bold"
              >
                Continue
              </button>
            </div>
          </motion.div>
        );

      case 'PROFILE':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 text-center"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Upload Your Profile</h2>
              <p className="text-[var(--text-secondary)]">PNG/JPEG below 5MB</p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all hover:border-[var(--accent-orange)]/50 cursor-pointer"
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-white/20" />
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[var(--accent-orange)] text-white flex items-center justify-center shadow-lg transform transition-transform active:scale-90"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finish & Go Live'}
                </button>
                <button onClick={() => setStep('DETAILS')} className="text-white/40 text-sm font-medium hover:text-white transition-colors">
                  Go Back
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'WELCOME':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 relative">
              <CheckCircle className="w-10 h-10 text-green-400" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>

            <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Welcome {identity === 'TRAINER' ? 'Coach' : 'Champion'}!
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-sm mx-auto leading-relaxed">
              Your digital identity is ready and your Sports ID has been sent to your mail: <strong>{formData.email}</strong>
            </p>

            <div className="flex flex-col gap-3 max-w-sm mx-auto mb-8">
              <a
                href="https://play.google.com/store/apps/details?id=com.sociobeats&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all border border-white/10"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 hidden" alt="" />
                <span className="text-xl">Download on Play Store</span>
              </a>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Complete your profile on the app</p>
            </div>

            <div className="relative max-w-sm mx-auto mb-8 p-6 rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md">
              <div className="absolute top-0 right-0 p-4">
                <ShieldCheck className="w-6 h-6 text-[var(--accent-orange)]" />
              </div>
              <div className="flex items-center justify-between gap-4 text-left mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden border border-white/20">
                  <img src={profileImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=256'} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-black uppercase text-[10px] tracking-widest opacity-50">Unique Sports ID</h4>
                    <p className="text-xl font-black text-[var(--accent-orange)] tracking-widest">
                      {sportsId}
                    </p>
                  </div>
                  <div className="p-1 bg-white rounded-lg shadow-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${sportsId}&bgcolor=ffffff&color=0f141f`}
                      alt="Scan"
                      className="w-8 h-8"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div className="text-left">
                  <p className="text-[10px] uppercase text-white/40">Member Name</p>
                  <p className="text-sm font-bold text-white">{formData.fullName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase text-white/40">Identity</p>
                  <p className="text-sm font-bold text-white">{identity}</p>
                </div>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="btn-primary px-10 py-4 text-lg"
            >
              Start Exploring
            </button>
          </motion.div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        #sports-person-modal {
            --text-primary: #FFFFFF !important;
            --text-secondary: #A9B3C7 !important;
            --bg-primary: #0B0F17 !important;
            --bg-secondary: #141B2A !important;
            color: white !important;
        }
        #sports-person-modal .text-white {
            color: white !important;
        }
        #sports-person-modal .text-white/90 { color: rgba(255, 255, 255, 0.9) !important; }
        #sports-person-modal .text-white/80 { color: rgba(255, 255, 255, 0.8) !important; }
        #sports-person-modal .text-white/70 { color: rgba(255, 255, 255, 0.7) !important; }
        #sports-person-modal .text-white/60 { color: rgba(255, 255, 255, 0.6) !important; }
        #sports-person-modal .text-white/50 { color: rgba(255, 255, 255, 0.5) !important; }
        #sports-person-modal .text-white/40 { color: rgba(255, 255, 255, 0.4) !important; }
        #sports-person-modal .text-white/30 { color: rgba(255, 255, 255, 0.3) !important; }
        #sports-person-modal .text-white/20 { color: rgba(255, 255, 255, 0.2) !important; }
        
        #sports-person-modal .bg-white/5 { background-color: rgba(255, 255, 255, 0.05) !important; }
        #sports-person-modal .bg-white/10 { background-color: rgba(255, 255, 255, 0.1) !important; }
        #sports-person-modal .bg-white/20 { background-color: rgba(255, 255, 255, 0.2) !important; }

        #sports-person-modal .border-white/5 { border-color: rgba(255, 255, 255, 0.05) !important; }
        #sports-person-modal .border-white/10 { border-color: rgba(255, 255, 255, 0.1) !important; }
        #sports-person-modal .border-white/20 { border-color: rgba(255, 255, 255, 0.2) !important; }

        #sports-person-modal input,
        #sports-person-modal select,
        #sports-person-modal textarea {
            color: white !important;
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
        }
        #sports-person-modal input:focus,
        #sports-person-modal select:focus,
        #sports-person-modal textarea:focus {
            border-color: var(--accent-orange) !important;
        }
        #sports-person-modal input::placeholder,
        #sports-person-modal textarea::placeholder {
            color: rgba(255, 255, 255, 0.4) !important;
        }
        #sports-person-modal option {
            background-color: #1a1a2e !important;
            color: white !important;
        }
        #sports-person-modal input:-webkit-autofill,
        #sports-person-modal input:-webkit-autofill:hover, 
        #sports-person-modal input:-webkit-autofill:focus, 
        #sports-person-modal input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #131823 inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={resetAndClose}
      />

      <motion.div
        ref={modalRef}
        id="sports-person-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 27, 42, 0.9) 0%, rgba(11, 15, 23, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent-orange)] to-green-500"
            initial={{ width: '0%' }}
            animate={{
              width: step === 'PHONE' ? '12%' :
                step === 'OTP' ? '25%' :
                  step === 'IDENTITY' ? '50%' :
                    step === 'DETAILS' ? '62%' :
                      step === 'PROFILE' ? '75%' : '100%'
            }}
          />
        </div>

        <button
          onClick={resetAndClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        <div className="px-8 py-10 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SportsPersonModal;
