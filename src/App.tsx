/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_ATHLETE, MOCK_ATHLETES, INITIAL_TOURNAMENTS, INITIAL_POSTS } from './data/mockData';
import { Athlete, Tournament, Registration, Post } from './types';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import AthleteNetwork from './components/AthleteNetwork';
import EventDiscovery from './components/EventDiscovery';
import Dashboard from './components/Dashboard';
import ProfilePanel from './components/ProfilePanel';
import AuthScreen from './components/AuthScreen';
import AIBackground from './components/AIBackground';
import InvalidGamesTicker from './components/InvalidGamesTicker';
import { ShieldCheck, Sparkles, Trophy, Users, RefreshCw, X } from 'lucide-react';

const LOCAL_STORAGE_KEY_PREFIX = 'sportsos_v1_';

export default function App() {
  
  // ================= STATE DECLARATIONS =================
  const [currentTab, setCurrentTab] = useState<'landing' | 'network' | 'discovery' | 'dashboard' | 'profile'>('landing');
  const [currentRole, setCurrentRole] = useState<'athlete' | 'organizer'>('athlete');
  const [currentUserProfile, setCurrentUserProfile] = useState<Athlete>(INITIAL_ATHLETE);
  const [athletes, setAthletes] = useState<Athlete[]>(MOCK_ATHLETES);
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Selected visual inspect parameters
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | undefined>(undefined);
  const [showRoleNotification, setShowRoleNotification] = useState(false);
  const [buttonStyle, setButtonStyle] = useState<'chameleon' | 'elastic' | 'standard'>('chameleon');

  // ================= PERSISTENCE LOAD =================
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}role`);
      const storedUser = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}user`);
      const storedAthletes = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}athletes`);
      const storedTournaments = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}tournaments`);
      const storedRegistrations = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}registrations`);
      const storedPosts = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}posts`);
      const storedLoggedIn = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}isLoggedIn`);

      if (storedRole) setCurrentRole(storedRole as any);
      if (storedUser) setCurrentUserProfile(JSON.parse(storedUser));
      if (storedAthletes) setAthletes(JSON.parse(storedAthletes));
      if (storedTournaments) setTournaments(JSON.parse(storedTournaments));
      if (storedPosts) setPosts(JSON.parse(storedPosts));
      if (storedLoggedIn) setIsLoggedIn(storedLoggedIn === 'true');

      if (storedRegistrations) {
        setRegistrations(JSON.parse(storedRegistrations));
      } else {
        // Initialize with high quality seed registrations
        const initialRegs: Registration[] = [
          {
            id: 'reg_101',
            athleteId: 'ath_2',
            athleteName: 'Elena Rostov',
            athleteSport: 'Track & Field',
            athleteAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            tournamentId: 'trn_101',
            tournamentTitle: 'West Coast Showcase Tournament',
            status: 'Pending',
            dateRegistered: 'Jun 20, 2026',
          },
          {
            id: 'reg_102',
            athleteId: 'ath_3',
            athleteName: 'Liam Chen',
            athleteSport: 'Soccer',
            athleteAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
            tournamentId: 'trn_102',
            tournamentTitle: 'Nike Next-Gen Soccer Trials',
            status: 'Pending',
            dateRegistered: 'Jun 21, 2026',
          },
          {
            id: 'reg_103',
            athleteId: 'ath_1',
            athleteName: 'Marcus Carter',
            athleteSport: 'Basketball',
            athleteAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
            tournamentId: 'trn_101',
            tournamentTitle: 'West Coast Showcase Tournament',
            status: 'Approved',
            dateRegistered: 'Jun 18, 2026',
          },
          {
            id: 'reg_104',
            athleteId: 'ath_1',
            athleteName: 'Marcus Carter',
            athleteSport: 'Basketball',
            athleteAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
            tournamentId: 'trn_103',
            tournamentTitle: 'State Junior Athletics Championship',
            status: 'Pending',
            dateRegistered: 'Jun 22, 2026',
          }
        ];
        setRegistrations(initialRegs);
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}registrations`, JSON.stringify(initialRegs));
      }

    } catch (e) {
      console.error('Failed to load local storage context', e);
    }
  }, []);

  // ================= PERSISTENCE SAVE =================
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}role`, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUserProfile));
  }, [currentUserProfile]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}athletes`, JSON.stringify(athletes));
  }, [athletes]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}tournaments`, JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}registrations`, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}posts`, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}isLoggedIn`, String(isLoggedIn));
  }, [isLoggedIn]);

  // ================= AUTH HANDLERS =================
  const handleLoginSuccess = (userPayload: Partial<Athlete>) => {
    setIsLoggedIn(true);
    
    // Construct fully compliant athlete object
    const newAthleteProfile: Athlete = {
      id: userPayload.id || `ath_user_${Date.now()}`,
      name: userPayload.name || 'Anonymous User',
      sport: userPayload.sport || 'Basketball',
      position: userPayload.position || 'Recruit Player',
      location: userPayload.location || 'Los Angeles, CA',
      avatar: userPayload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1504450758481-7338eaa75e61?w=1000&auto=format&fit=crop&q=80',
      bio: userPayload.bio || 'New verified SportsOS digital identity passport holder.',
      height: userPayload.height || `6'1"`,
      weight: userPayload.weight || '180 lbs',
      college: userPayload.college || 'Evert Prep Academy',
      graduatingYear: userPayload.graduatingYear || '2028',
      verified: userPayload.verified ?? true,
      followersCount: userPayload.followersCount ?? 0,
      followingCount: userPayload.followingCount ?? 0,
      skills: userPayload.skills || ['Agility', 'Speed Burst'],
      clubs: userPayload.clubs || ['SportsOS Academy'],
      stats: userPayload.stats || [
        { label: 'Activity Score', value: '100', unit: '%' }
      ],
      achievements: userPayload.achievements || [],
      timeline: userPayload.timeline || [],
      category: userPayload.category,
      userRole: userPayload.userRole,
      email: userPayload.email,
      phone: userPayload.phone
    };

    setCurrentUserProfile(newAthleteProfile);
    
    // Merge into the global athletes collection
    setAthletes(prev => {
      const exists = prev.some(a => a.id === newAthleteProfile.id);
      if (exists) {
        return prev.map(a => a.id === newAthleteProfile.id ? newAthleteProfile : a);
      }
      return [newAthleteProfile, ...prev];
    });

    // Make user active profile immediately visible
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setCurrentTab('landing'); // Send to Landing Pitch on Log out
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerAuth = () => {
    setCurrentTab('profile'); // When clicking Join / Sign-in send to target flow where gateway occurs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // ================= MUTATORS / HANDLERS =================
  
  // Like Post
  const handleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const liked = !post.isLikedByUser;
          return {
            ...post,
            isLikedByUser: liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  // Add social Post
  const handleAddPost = (content: string, category: 'update' | 'achievement' | 'signing' | 'opportunity') => {
    const isRecruiter = currentRole === 'organizer';
    const newPost: Post = {
      id: `p_${Date.now()}`,
      athleteId: isRecruiter ? undefined : currentUserProfile.id,
      authorName: isRecruiter ? 'Nike Player Development Council' : currentUserProfile.name,
      authorTitle: isRecruiter
        ? 'Official SportsOS Organizer Organization'
        : `${currentUserProfile.position} • ${currentUserProfile.college || 'Prep recruit'}`,
      authorAvatar: isRecruiter
        ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=50&auto=format&fit=crop&q=80'
        : currentUserProfile.avatar,
      content,
      category,
      likes: 0,
      commentsCount: 0,
      timestamp: 'Just now',
      isLikedByUser: false,
    };

    setPosts([newPost, ...posts]);
  };

  // Create Tournament Registration Enlistment
  const handleRegisterAthlete = (tournamentId: string, comments: string, declaredSkills?: Record<string, string>) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    // Check if registration already exists
    const exists = registrations.find(r => r.athleteId === currentUserProfile.id && r.tournamentId === tournamentId);
    if (exists) return;

    const newReg: Registration = {
      id: `reg_${Date.now()}`,
      athleteId: currentUserProfile.id,
      athleteName: currentUserProfile.name,
      athleteSport: currentUserProfile.sport,
      athleteAvatar: currentUserProfile.avatar,
      tournamentId,
      tournamentTitle: tournament.title,
      status: 'Pending',
      dateRegistered: 'Today',
      comments,
      declaredSkills,
    };

    setRegistrations([newReg, ...registrations]);

    // Update Spots in Tournament List
    setTournaments(prevTrns =>
      prevTrns.map(t => {
        if (t.id === tournamentId) {
          return {
            ...t,
            registeredCount: Math.min(t.registeredCount + 1, t.maxParticipants),
          };
        }
        return t;
      })
    );
  };

  // Approve athlete entry (Organizer function)
  const handleApproveRegistration = (registrationId: string) => {
    setRegistrations(prevRegs =>
      prevRegs.map(reg => {
        if (reg.id === registrationId) {
          return { ...reg, status: 'Approved' };
        }
        return reg;
      })
    );
  };

  // Decline athlete entry
  const handleDeclineRegistration = (registrationId: string) => {
    setRegistrations(prevRegs =>
      prevRegs.map(reg => {
        if (reg.id === registrationId) {
          return { ...reg, status: 'Declined' };
        }
        return reg;
      })
    );
  };

  // Create new athletic Campaign Event (Organizer function)
  const handleCreateTournament = (newTrn: Omit<Tournament, 'id' | 'registeredCount'>) => {
    const freshTournament: Tournament = {
      ...newTrn,
      id: `trn_${Date.now()}`,
      registeredCount: 0,
    };

    setTournaments([freshTournament, ...tournaments]);
  };

  // Update physical specs sliders
  const handleUpdateAthleteStats = (label: string, value: string | number) => {
    const updatedStats = currentUserProfile.stats.map(s => {
      if (s.label === label) {
        return { ...s, value };
      }
      return s;
    });

    const updatedProfile = {
      ...currentUserProfile,
      stats: updatedStats,
    };

    setCurrentUserProfile(updatedProfile);
    
    // Sync directories
    setAthletes(prevAthletes =>
      prevAthletes.map(ath => (ath.id === currentUserProfile.id ? updatedProfile : ath))
    );
  };

  // Update Full customized profile CV
  const handleUpdateFullProfile = (updatedProfile: Athlete) => {
    setCurrentUserProfile(updatedProfile);
    
    // Sync with other athletes directory list
    setAthletes(prevAthletes =>
      prevAthletes.map(ath => (ath.id === currentUserProfile.id ? updatedProfile : ath))
    );
  };

  // View specific athlete from directories
  const handleViewAthlete = (athleteId: string) => {
    setSelectedAthleteId(athleteId);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle client context roles to explore both perspectives of the platform
  const handleRoleToggle = () => {
    const nextRole = currentRole === 'athlete' ? 'organizer' : 'athlete';
    setCurrentRole(nextRole);
    setShowRoleNotification(true);
    setTimeout(() => setShowRoleNotification(false), 3500);
  };

  const getActiveProfileData = () => {
    if (selectedAthleteId) {
      const match = athletes.find(a => a.id === selectedAthleteId);
      if (match) return match;
    }
    return currentUserProfile;
  };

  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen bg-transparent text-white flex flex-col justify-center items-center relative p-4 sm:p-8 overflow-x-hidden min-h-screen" 
        id="sportsos_auth_gateway"
      >
        <AIBackground />

        {/* Floating Sports Elements drifting dynamically using keyframe classes defined in index.css */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          {/* Floating Sports Elements drifting dynamically using keyframe classes defined in index.css */}
          <span className="absolute top-[12%] left-[8%] text-5xl opacity-40 animate-float-slow bg-white/5 p-4 rounded-3xl">⚽</span>
          <span className="absolute top-[28%] right-[8%] text-5.5xl opacity-45 animate-float-medium bg-white/5 p-4 rounded-3xl">🏀</span>
          <span className="absolute bottom-[22%] left-[6%] text-5xl opacity-40 animate-float-fast bg-white/5 p-4 rounded-3xl">🎾</span>
          <span className="absolute bottom-[15%] right-[12%] text-6xl opacity-50 animate-float-slow bg-white/5 p-4 rounded-3xl">🏏</span>
          <span className="absolute top-[42%] left-[48%] text-4.5xl opacity-40 animate-float-medium bg-white/5 p-4 rounded-3xl font-bold">🏆</span>
          <span className="absolute bottom-[8%] left-[40%] text-5xl opacity-45 animate-float-slow bg-white/5 p-4 rounded-3xl">🤼</span>
          <span className="absolute top-[22%] right-[32%] text-4xl opacity-40 animate-float-slow bg-white/5 p-4 rounded-3xl">🥇</span>
          <span className="absolute top-[64%] left-[12%] text-4.5xl opacity-35 animate-float-medium bg-white/5 p-4 rounded-3xl">🥈</span>
          
          {/* Retro sports headings behind the core visual pane */}
          <div className="absolute top-[48%] right-[18%] text-4xl opacity-[0.08] animate-float-fast font-black tracking-widest text-slate-100 uppercase">SportsOS</div>
          <div className="absolute bottom-[38%] left-[15%] text-5xl opacity-[0.06] animate-float-slow font-black text-[#1C77FF] uppercase">KABADDI COURT</div>
          <div className="absolute top-[72%] right-[20%] text-4xl opacity-[0.07] animate-float-medium font-black text-emerald-400 uppercase">CRICKET FIELD</div>
        </div>

        {/* Centered Auth Panel */}
        <div className="w-full max-w-xl z-10 flex flex-col items-center">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1C77FF]/15 border border-[#1C77FF]/35 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest mb-4 animate-pulse">
              ⚡ SportsOS Athlete Portal
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              WELCOME
            </h1>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-md mx-auto">
              Sign in or set up your profile to join premium athletic tournaments, declare performance skills, and follow telemetry tracking.
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="bg-white text-slate-800 rounded-3xl p-1.5 shadow-2xl border border-slate-100 relative">
              <AuthScreen 
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
            
            <InvalidGamesTicker />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]/90 backdrop-blur-sm text-[#111827] antialiased selection:bg-[#1C77FF] selection:text-white flex flex-col justify-between" id="sportsos_root">
      <AIBackground />
      
      {/* Universal Navigation bar */}
      <Navigation
        currentTab={currentTab}
        currentRole={currentRole}
        currentUser={currentUserProfile}
        onTabChange={(tab) => {
          if (tab === 'profile') {
            setSelectedAthleteId(undefined); // default back to looking at yourself
          }
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRoleToggle={handleRoleToggle}
        isLoggedIn={isLoggedIn}
        onLogOut={handleLogOut}
        onTriggerAuth={handleTriggerAuth}
        buttonStyle={buttonStyle}
        onButtonStyleChange={setButtonStyle}
      />

      {/* Main Interactive Screen with slide animations */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab + (selectedAthleteId || '') + currentRole}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full"
          >
            {!isLoggedIn && currentTab !== 'landing' ? (
              <div className="max-w-7xl mx-auto py-12 px-4 text-center">
                <div className="max-w-md mx-auto mb-6 text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1C77FF] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full inline-block">
                    🔒 Verification Required
                  </span>
                  <h2 className="text-2xl font-black text-[#0B132B] mt-3 tracking-tight">
                    Authorized Access Only
                  </h2>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Verify your Gmail or mobile phone number to log in or configure a brand new Player/Viewer account on SportsOS.
                  </p>
                </div>
                <AuthScreen
                  onLoginSuccess={handleLoginSuccess}
                />
              </div>
            ) : (
              <>
                {currentTab === 'landing' && (
                  <LandingPage
                    onGetStarted={(tab) => {
                      setCurrentTab(tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onExploreEvents={() => {
                      setCurrentTab('discovery');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {currentTab === 'network' && (
                  <AthleteNetwork
                    posts={posts}
                    athletes={athletes}
                    currentUser={currentUserProfile}
                    onLikePost={handleLikePost}
                    onAddPost={handleAddPost}
                    onViewAthlete={handleViewAthlete}
                    buttonStyle={buttonStyle}
                  />
                )}

                {currentTab === 'discovery' && (
                  <EventDiscovery
                    tournaments={tournaments}
                    currentUser={currentUserProfile}
                    registeredTournamentIds={registrations
                      .filter(r => r.athleteId === currentUserProfile.id)
                      .map(r => r.tournamentId)}
                    onRegister={handleRegisterAthlete}
                  />
                )}

                {currentTab === 'dashboard' && (
                  <Dashboard
                    currentRole={currentRole}
                    currentUser={currentUserProfile}
                    tournaments={tournaments}
                    registrations={registrations}
                    onApproveRegistration={handleApproveRegistration}
                    onDeclineRegistration={handleDeclineRegistration}
                    onCreateTournament={handleCreateTournament}
                    onUpdateAthleteStats={handleUpdateAthleteStats}
                    buttonStyle={buttonStyle}
                  />
                )}

                {currentTab === 'profile' && (
                  <ProfilePanel
                    athlete={getActiveProfileData()}
                    onUpdateFullProfile={handleUpdateFullProfile}
                    isOwnProfile={!selectedAthleteId || selectedAthleteId === currentUserProfile.id}
                    registrations={registrations}
                    tournaments={tournaments}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Interactive Role Change Banner Pop-up */}
      <AnimatePresence>
        {showRoleNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-[#0B132B] text-white p-4 shadow-2xl border border-slate-750 flex items-start gap-3.5"
            id="role_alert_toast"
          >
            <div className="h-8 w-8 rounded-full bg-[#1C77FF]/20 text-[#1C77FF] flex items-center justify-center shrink-0">
              <RefreshCw className="h-4.5 w-4.5 animate-spin-slow" />
            </div>
            
            <div className="text-left flex-1">
              <h4 className="font-sans text-xs font-black uppercase tracking-widest text-[#38BDF8]">
                Identity Shift Activated
              </h4>
              <p className="font-sans text-xs text-slate-300 mt-1 pb-1">
                Switched environment context to <span className="font-bold text-white capitalize">{currentRole} Mode</span>. Explore the dashboard to witness the altered features!
              </p>
            </div>

            <button
              onClick={() => setShowRoleNotification(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Sports Technology Footer */}
      <footer className="border-t border-slate-100 bg-[#0B132B] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 tracking-wide font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono font-bold uppercase tracking-wider">
          
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-black text-white">
              Sports<span className="text-[#1C77FF]">OS</span>
            </span>
            <span className="text-slate-650">•</span>
            <span className="text-slate-500 font-sans text-xxs font-normal uppercase tracking-widest">Digital Opportunity Network</span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <button onClick={() => setCurrentTab('landing')} className="hover:text-white transition-colors cursor-pointer">Overview Pitch</button>
            <button onClick={() => { setSelectedAthleteId(undefined); setCurrentTab('profile'); }} className="hover:text-white transition-colors cursor-pointer">Athlete Spec</button>
            <button onClick={() => setCurrentTab('discovery')} className="hover:text-white transition-colors cursor-pointer">Live Tournaments</button>
            <button onClick={() => setCurrentTab('network')} className="hover:text-white transition-colors cursor-pointer">Opportunity Flow</button>
          </div>

          <p className="text-slate-500 text-[10px]">
            © {new Date().getFullYear()} SportsOS inc. All athletic telemetry certified.
          </p>

        </div>
      </footer>

    </div>
  );
}
