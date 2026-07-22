/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, User, Check, Users, Shield, ArrowRight, Sparkles, 
  Star, Smartphone
} from 'lucide-react';
import { Athlete } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: Partial<Athlete>) => void;
  onCancel?: () => void;
  showCloseButton?: boolean;
}

export default function AuthScreen({ onLoginSuccess, onCancel, showCloseButton = false }: AuthScreenProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [loginMethod, setLoginMethod] = useState<'gmail' | 'phone'>('gmail');
  
  const [clickedSparks, setClickedSparks] = useState(false);

  // Helper to trigger the vibrant dynamic spark burst overlays on click
  const handleLoginButtonClick = () => {
    setClickedSparks(true);
    setTimeout(() => {
      setClickedSparks(false);
    }, 2500);
  };
  
  // Form fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [sport, setSport] = useState('Basketball');
  const [role, setRole] = useState<'player' | 'viewer'>('player');
  const [category, setCategory] = useState<'sub-junior' | 'junior' | 'senior'>('junior');
  
  // Custom interactive details fields requested by user
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('2008-06-15'); // default brings them to Under-19 Junior Category
  const [userCustomPhone, setUserCustomPhone] = useState(''); // Backup phone if email used

  // Helper to compute age from Date of Birth and determine eligibility details
  const getAgeEligibility = (dobString: string) => {
    if (!dobString) return { age: 17, category: 'junior' as const, eligibilityList: [] };
    const today = new Date();
    const birth = new Date(dobString);
    let computedAge = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      computedAge--;
    }

    let computedCategory: 'sub-junior' | 'junior' | 'senior' = 'junior';
    let eligibilityList: string[] = [];

    if (computedAge < 14) {
      computedCategory = 'sub-junior';
      eligibilityList = [
        '🏡 Roots Grassroots Academies Cup',
        '🛑 Safe Fall Non-contact Formats',
        '🎖️ Under-14 Local District League',
        '🧬 Youth Dimension Physical Telemetry'
      ];
    } else if (computedAge < 19) {
      computedCategory = 'junior';
      eligibilityList = [
        '🎓 Academic Scout Division Recruiting',
        '🔥 Under-19 High School Draft Pools',
        '🏃 Collegiate Sports Scholarship Trials',
        '📈 Enhanced Speed & Reflex Metrics'
      ];
    } else {
      computedCategory = 'senior';
      eligibilityList = [
        '🏆 Pro League Draft Admission Gate',
        '💎 Open Premium Cash Prize Cups',
        '🌌 Elite Sports Corporate Contracts',
        '🌐 Global Representation Registry'
      ];
    }

    return { age: computedAge, category: computedCategory, eligibilityList };
  };

  const currentEligibility = getAgeEligibility(dob);

  // Verification simulation
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-validate/simulate code delivery
  const handleInitiateAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (loginMethod === 'gmail') {
      if (!email || !email.includes('@')) {
        setErrorMessage('Please enter a valid Gmail / Email address.');
        return;
      }
    } else {
      if (!phone || phone.length < 8) {
        setErrorMessage('Please enter a valid phone number (min 8 digits).');
        return;
      }
    }

    if (authMode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name to set up a profile.');
        return;
      }
      if (!address.trim()) {
        setErrorMessage('Please enter your residential city / address.');
        return;
      }
    }

    setIsLoading(true);
    
    // Simulate API calls
    setTimeout(() => {
      setIsLoading(false);
      setShowOtp(true);
      const destination = loginMethod === 'gmail' ? email : phone;
      setOtpSentMessage(`We sent a 6-digit confirmation code to ${destination}`);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6 || isNaN(Number(otpCode))) {
      setErrorMessage('Please enter a valid 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      // Dynamic profile construction based on credentials
      const cleanName = authMode === 'signup' ? name : (email ? email.split('@')[0] : 'User_' + phone.slice(-4));
      const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      
      const avatarUrl = role === 'player' 
        ? (genderAndAvatarMap[formattedName] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80')
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';

      const finalCategory = role === 'player' ? category : undefined;

      const userProfile: Partial<Athlete> = {
        id: `ath_user_${Date.now()}`,
        name: formattedName,
        sport: role === 'player' ? sport : 'General Spectator',
        position: role === 'player' ? `Competitive ${sport}` : 'Scout / Fan',
        location: address || 'California, US',
        avatar: avatarUrl,
        bio: role === 'player' 
          ? `Verified ${finalCategory} ${sport} athlete. Living at ${address || 'SportsOS Area'}. Passionate about training hard, maximizing output metrics, and connecting with competitive tournament brackets.`
          : 'Enthusiastic sports spectator tracking live statistics and academy event schedules.',
        verified: role === 'player', // Verified immediately upon phone/gmail confirmation
        followersCount: role === 'player' ? 12 : 2,
        followingCount: 30,
        skills: role === 'player' ? ['Fast Reflexes', 'Tactical Play', 'Team Coordination'] : [],
        clubs: role === 'player' ? ['SportsOS Academy'] : [],
        stats: role === 'player' ? [
          { label: 'Level Rating', value: finalCategory === 'sub-junior' ? 'Grassroots' : finalCategory === 'junior' ? 'Division Recruit' : 'Championship Tier' },
          { label: 'Scouters Alerted', value: '1' },
          { label: 'Activity Score', value: '100', unit: '%' }
        ] : [],
        achievements: [],
        timeline: [
          {
            id: `time_${Date.now()}`,
            year: new Date().getFullYear().toString(),
            title: `Joined SportsOS Platform as ${role === 'player' ? 'Player' : 'Viewer'}`,
            description: `Successfully authenticated using ${loginMethod === 'gmail' ? 'Gmail SSO' : 'Phone SMS OTP'} of ${finalCategory ? finalCategory.toUpperCase() : 'General SPECTATOR'}. Resident profile registered at ${address || 'Local sports branch'}.`,
            category: 'milestone'
          }
        ],
        // Customized fields
        userRole: role,
        category: finalCategory,
        email: loginMethod === 'gmail' ? email : undefined,
        phone: loginMethod === 'phone' ? phone : (userCustomPhone || undefined),
        address: address || undefined,
        dob: dob || undefined
      };

      onLoginSuccess(userProfile);
    }, 1500);
  };

  const genderAndAvatarMap: Record<string, string> = {
    'Elena': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'Liam': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    'Marcus': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'Chloe': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
  };

  return (
    <div className="flex items-center justify-center w-full" id="auth_container">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-100 overflow-hidden flex flex-col p-6 sm:p-8" id="auth_card">
        {/* Dynamic Authentication Form Container */}
        <div className="w-full flex flex-col justify-center" id="auth_main_form">
          
          {/* Close button for fallback/cancellation */}
          {showCloseButton && onCancel && (
            <div className="flex justify-end -mt-3 mb-1">
              <button 
                onClick={onCancel}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!showOtp ? (
              <motion.div
                key="input-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Mode Selectors */}
                <div className="flex border-b border-slate-100 pb-px mb-4">
                  <button
                    onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
                    className={`pb-2.5 pr-6 text-sm font-semibold relative transition-colors ${
                      authMode === 'signin' ? 'text-[#1C77FF]' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Sign In
                    {authMode === 'signin' && (
                      <motion.div layoutId="authUnderline" className="absolute bottom-0 left-0 right-6 h-0.5 bg-[#1C77FF]" />
                    )}
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
                    className={`pb-2.5 px-3 text-sm font-semibold relative transition-colors ${
                      authMode === 'signup' ? 'text-[#1C77FF]' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    New Account
                    {authMode === 'signup' && (
                      <motion.div layoutId="authUnderline" className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1C77FF]" />
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                    {authMode === 'signin' ? 'Welcome back to SportsOS' : 'Create your credentials'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select your preferred secure lookup method below.
                  </p>
                </div>

                {/* Sign In Options */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('gmail'); setErrorMessage(''); }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      loginMethod === 'gmail' ? 'bg-white text-[#1C77FF] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Gmail / Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('phone'); setErrorMessage(''); }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      loginMethod === 'phone' ? 'bg-white text-[#1C77FF] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    Phone SMS
                  </button>
                </div>

                {/* Inputs */}
                <form onSubmit={handleInitiateAuth} className="space-y-4">
                  
                  {/* Signup-only Name Field */}
                  {authMode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Liam Chen"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs tracking-wide focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1C77FF]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Gmail SSO Input */}
                  {loginMethod === 'gmail' ? (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gmail Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.name@gmail.com"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs tracking-wide focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1C77FF]"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Phone Number Input */
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobile Phone Number</label>
                      <div className="flex gap-2">
                        <select className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#1C77FF]">
                          <option>+1 (USA)</option>
                          <option>+91 (IND)</option>
                          <option>+44 (UK)</option>
                          <option>+61 (AUS)</option>
                        </select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(555) 0192-384"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs tracking-wide focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1C77FF]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Signup-only Address & DoB fields */}
                  {authMode === 'signup' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date of Birth</label>
                          <input
                            type="date"
                            required
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1C77FF]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#1C77FF] uppercase tracking-wider block">Age Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                            className="w-full px-3 py-2 bg-blue-50 border border-[#1C77FF]/40 text-[#1C77FF] rounded-lg text-xs font-black cursor-pointer focus:outline-none"
                          >
                            <option value="sub-junior">Sub-Junior</option>
                            <option value="junior">Junior</option>
                            <option value="senior">Senior</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Residential City</label>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g. Mumbai, India"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1C77FF]"
                          />
                        </div>
                      </div>

                      {/* Backup alternate fields to present different formats depending on details */}
                      {loginMethod === 'gmail' ? (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Backup Phone / SMS Number</label>
                          <input
                            type="tel"
                            required
                            value={userCustomPhone}
                            onChange={(e) => setUserCustomPhone(e.target.value)}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1C77FF]"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Backup Email Address</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. your.name@gmail.com"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1C77FF]"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Signup Role & Grade Specific Selectors */}
                  {authMode === 'signup' && (
                    <div className="space-y-4 pt-1.5 border-t border-slate-100 mt-2">
                      
                      {/* Role selection player vs viewer */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Choose Platform Role (Select One)</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setRole('player')}
                            className={`p-3.5 rounded-xl border text-left transition-all btn-touch-bounce cursor-pointer relative overflow-hidden ${
                              role === 'player' 
                                ? 'border-emerald-500 bg-emerald-50/70 text-emerald-700 shadow-md ring-2 ring-emerald-500/20' 
                                : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-500'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-extrabold text-xs block">Active Player</span>
                              {role === 'player' && <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>}
                            </div>
                            <span className="text-[10px] opacity-80 leading-tight block">Physical stats, verified sport age bracket telemetry.</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRole('viewer')}
                            className={`p-3.5 rounded-xl border text-left transition-all btn-touch-bounce cursor-pointer relative overflow-hidden ${
                              role === 'viewer' 
                                ? 'border-amber-500 bg-amber-50/70 text-amber-700 shadow-md ring-2 ring-amber-500/20' 
                                : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50 text-slate-500'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-extrabold text-xs block">Viewer / Scout</span>
                              {role === 'viewer' && <span className="h-2 w-2 rounded-full bg-amber-500 ring-4 ring-amber-100"></span>}
                            </div>
                            <span className="text-[10px] opacity-80 leading-tight block">Follow recruits, observe timelines, scan events.</span>
                          </button>
                        </div>
                      </div>

                      {/* Grade Category & Sport (Only applicable to players) */}
                      {role === 'player' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3 pt-2"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Sport</label>
                              <select 
                                value={sport}
                                onChange={(e) => setSport(e.target.value)}
                                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1C77FF] text-slate-700 cursor-pointer"
                              >
                                <option>Basketball</option>
                                <option>Soccer</option>
                                <option>Kabaddi</option>
                                <option>Cricket</option>
                                <option>Track & Field</option>
                                <option>Tennis</option>
                                <option>Football</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#1C77FF] uppercase tracking-wider block">Age Category</label>
                              <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="w-full px-2.5 py-2 bg-blue-50 border border-[#1C77FF]/40 text-[#1C77FF] rounded-lg text-xs font-black capitalize cursor-pointer focus:outline-none"
                              >
                                <option value="sub-junior">Sub-Junior</option>
                                <option value="junior">Junior</option>
                                <option value="senior">Senior</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  )}

                  {/* Error Prompt */}
                  {errorMessage && (
                    <p className="text-xs font-semibold text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 animate-pulse">
                      {errorMessage}
                    </p>
                  )}

                  {/* Submit Trigger */}
                  <button
                    type="submit"
                    onClick={handleLoginButtonClick}
                    disabled={isLoading}
                    className="w-full py-3 text-black rounded-xl text-xs font-black transition-all relative overflow-hidden btn-electric-violet btn-touch-pulse btn-shimmer-highlight shadow-lg hover:shadow-xl shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider whitespace-nowrap"
                  >
                    {/* Floating Spark Particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <span className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full blur-xs opacity-85 left-1/4 top-1/2 spark-particle-1" />
                      <span className="absolute w-2 h-2 bg-purple-200 rounded-full blur-xs opacity-75 left-1/2 top-2/3 spark-particle-2" />
                      <span className="absolute w-1 h-1 bg-white rounded-full left-2/3 top-1/3 spark-particle-3" />
                      <span className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full blur-xs opacity-95 left-3/4 top-1/2 spark-particle-4" />
                      <span className="absolute w-1 h-1 bg-violet-200 rounded-full left-1/3 top-1/4 spark-particle-2" />
                      <span className="absolute w-2 h-2 bg-yellow-200 rounded-full blur-xxs opacity-65 left-3/5 top-3/4 spark-particle-1" />
                      {clickedSparks && (
                        <>
                          <span className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-xs left-1/5 top-1/3 spark-particle-3 animate-ping" />
                          <span className="absolute w-2.5 h-2.5 bg-purple-300 rounded-full blur-xs left-2/5 top-1/2 spark-particle-1" />
                          <span className="absolute w-2 h-2 bg-white rounded-full left-3/5 top-1/4 spark-particle-4" />
                          <span className="absolute w-2.5 h-2.5 bg-amber-400 rounded-full blur-xs left-4/5 top-2/3 spark-particle-2" />
                          <span className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full left-1/2 top-1/5 spark-particle-3" />
                        </>
                      )}
                    </div>
                    {isLoading ? (
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-300 border-t-black animate-spin"></span>
                    ) : (
                      <>
                        LOGIN/SIGN-IN
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                </form>
              </motion.div>
            ) : (
              /* OTP verification Code Entry stage */
              <motion.form
                key="otp-stage"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                    <Shield className="h-4.5 w-4.5 text-[#1C77FF]" />
                    Verification Needed
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {otpSentMessage}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Simulation 6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 123456"
                    className="w-full tracking-widest text-center px-4 py-3 bg-slate-50 font-mono text-lg font-bold border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1C77FF]"
                  />
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 mt-2">
                    <span className="text-[10px] text-blue-700 block font-semibold">
                      💡 Simulator Guideline:
                    </span>
                    <span className="text-[10px] text-blue-600">
                      Type <strong className="font-extrabold text-[#1C77FF]">123456</strong> to successfully verify, approve credentials, and load SportsOS.
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs font-semibold text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    {errorMessage}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowOtp(false); setOtpCode(''); setErrorMessage(''); }}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all btn-touch-bounce cursor-pointer flex items-center justify-center"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    onClick={handleLoginButtonClick}
                    disabled={isLoading}
                    className="flex-1 py-3 text-black rounded-xl text-xs font-black transition-all relative overflow-hidden btn-electric-violet btn-touch-pulse btn-shimmer-highlight shadow-lg flex items-center justify-center gap-1 cursor-pointer uppercase tracking-wider whitespace-nowrap"
                  >
                    {/* Floating Spark Particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <span className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full blur-xs opacity-85 left-1/4 top-1/2 spark-particle-1" />
                      <span className="absolute w-2 h-2 bg-purple-200 rounded-full blur-xs opacity-75 left-1/2 top-2/3 spark-particle-2" />
                      <span className="absolute w-1 h-1 bg-white rounded-full left-2/3 top-1/3 spark-particle-3" />
                      <span className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full blur-xs opacity-95 left-3/4 top-1/2 spark-particle-4" />
                      <span className="absolute w-1 h-1 bg-violet-200 rounded-full left-1/3 top-1/4 spark-particle-2" />
                      <span className="absolute w-2 h-2 bg-yellow-200 rounded-full blur-xxs opacity-65 left-3/5 top-3/4 spark-particle-1" />
                      {clickedSparks && (
                        <>
                          <span className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-xs left-1/5 top-1/3 spark-particle-3 animate-ping" />
                          <span className="absolute w-2.5 h-2.5 bg-purple-300 rounded-full blur-xs left-2/5 top-1/2 spark-particle-1" />
                          <span className="absolute w-2 h-2 bg-white rounded-full left-3/5 top-1/4 spark-particle-4" />
                          <span className="absolute w-2.5 h-2.5 bg-amber-400 rounded-full blur-xs left-4/5 top-2/3 spark-particle-2" />
                          <span className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full left-1/2 top-1/5 spark-particle-3" />
                        </>
                      )}
                    </div>
                    {isLoading ? (
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-300 border-t-black animate-spin"></span>
                    ) : (
                      'LOGIN/SIGN-IN'
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
