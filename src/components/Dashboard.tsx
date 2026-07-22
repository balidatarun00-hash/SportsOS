/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, ShieldCheck, Trophy, Sparkles, Plus, Check, X, ShieldAlert, FileSliders, FilePlus, ChevronRight, Activity } from 'lucide-react';
import { Athlete, Tournament, Registration, EventType } from '../types';

interface DashboardProps {
  currentRole: 'athlete' | 'organizer';
  currentUser: Athlete;
  tournaments: Tournament[];
  registrations: Registration[];
  onApproveRegistration: (registrationId: string) => void;
  onDeclineRegistration: (registrationId: string) => void;
  onCreateTournament: (trn: Omit<Tournament, 'id' | 'registeredCount'>) => void;
  onUpdateAthleteStats: (label: string, value: string | number) => void;
  buttonStyle: 'chameleon' | 'elastic' | 'standard';
}

const PERFORMANCE_DATA = [
  { match: 'Game 1', PPG: 18, APG: 5.2, rating: 85 },
  { match: 'Game 2', PPG: 22, APG: 6.5, rating: 91 },
  { match: 'Game 3', PPG: 31, APG: 7.2, rating: 98 },
  { match: 'Game 4', PPG: 20, APG: 8.0, rating: 89 },
  { match: 'Game 5', PPG: 26, APG: 7.5, rating: 94 },
  { match: 'Game 6', PPG: 24.2, APG: 7.8, rating: 95 },
];

export default function Dashboard({
  currentRole,
  currentUser,
  tournaments,
  registrations,
  onApproveRegistration,
  onDeclineRegistration,
  onCreateTournament,
  onUpdateAthleteStats,
  buttonStyle,
}: DashboardProps) {
  


  // TOURNAMENT CREATOR STATE
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<EventType>('Tournament');
  const [newSport, setNewSport] = useState('Basketball');
  const [newLoc, setNewLoc] = useState('');
  const [newDate, setNewDate] = useState('Aug 12 - Aug 15, 2026');
  const [newFee, setNewFee] = useState('$50');
  const [newDeadline, setNewDeadline] = useState('Aug 05, 2026');
  const [newMax, setNewMax] = useState(100);
  const [newDesc, setNewDesc] = useState('');
  
  const [showCreatorSuccess, setShowCreatorSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);

  // Public Game & Team Match Invitations State
  const [invitations, setInvitations] = useState([
    {
      id: 'inv_1',
      challengerName: 'Phoenix Club Elite (3v3)',
      title: 'Mahaveer Pro Catch Invitation Duel',
      sport: 'Kabaddi',
      entryFee: '₹150',
      date: 'Oct 28, 2026',
      bracket: 'Senior Division',
      status: 'Pending' as 'Pending' | 'Accepted' | 'Rejected',
      message: 'Looking for a verified Defender Right Corner Chain to complete our core roster for the Saffron tournament series.'
    },
    {
      id: 'inv_2',
      challengerName: 'Warriors Youth Academy',
      title: 'Sub-Junior Cricket Friendly Scrimmage',
      sport: 'Cricket',
      entryFee: '₹99',
      date: 'Oct 30, 2026',
      bracket: 'Sub-Junior Division',
      status: 'Pending' as 'Pending' | 'Accepted' | 'Rejected',
      message: 'Seeking talented junior opening wicket-keeper batsman for friendly exhibition matches.'
    },
    {
      id: 'inv_3',
      challengerName: 'Redwood Hoop Syndicate',
      title: 'Basketball 3v3 Blacktop War Bracket',
      sport: 'Basketball',
      entryFee: '₹200',
      date: 'Nov 02, 2026',
      bracket: 'Junior Division',
      status: 'Pending' as 'Pending' | 'Accepted' | 'Rejected',
      message: 'High stake local grassroots showcase. Need active guard to run fast break dynamic plays.'
    },
    {
      id: 'inv_4',
      challengerName: 'Strikers United FC',
      title: 'Soccer Turf Blitz Tournament Match',
      sport: 'Soccer',
      entryFee: '₹120',
      date: 'Nov 05, 2026',
      bracket: 'Senior Division',
      status: 'Pending' as 'Pending' | 'Accepted' | 'Rejected',
      message: 'Need dynamic central midfielder playmaker to execute technical counter-attack strategies.'
    }
  ]);

  const registeredSports = new Set(
    registrations
      .filter((registration) => registration.athleteId === currentUser.id)
      .map((registration) => registration.athleteSport?.toLowerCase() || '')
      .filter(Boolean)
  );

  const relatedInvitations = invitations.filter((invitation) => {
    const invitationSport = invitation.sport.toLowerCase();
    const currentSport = currentUser.sport?.toLowerCase();
    return currentSport === invitationSport || registeredSports.has(invitationSport);
  });

  const selectedInvitation = invitations.find((invitation) => invitation.id === selectedInvitationId) || null;

  // Handle tournament design create
  const handleTournamentCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLoc.trim()) return;
    
    // Choose realistic random background matching sport
    const randomSportsImages: Record<string, string> = {
      'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
      'Soccer': 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80',
      'Track & Field': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80',
      'Tennis': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop&q=80',
      'Kabaddi': 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600&auto=format&fit=crop&q=80',
      'Cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80'
    };

    const bannerSelected = randomSportsImages[newSport] || 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=600&auto=format&fit=crop&q=80';

    onCreateTournament({
      title: newTitle,
      organizerName: 'National Sports Association Council',
      type: newType,
      sport: newSport,
      location: newLoc,
      date: newDate,
      duration: '3 Days',
      bannerUrl: bannerSelected,
      fee: newFee,
      description: newDesc || 'Elite SportsOS-sanctioned tournament focusing on grassroots opportunities and player scouting tracking.',
      status: 'Open',
      deadline: newDeadline,
      prizePool: 'SportsOS Medley Trophy',
      maxParticipants: Number(newMax),
      rules: ['Valid digital portfolio required', 'Arrive clad in official club uniforms'],
      schedule: ['Day 1: Official seeds pool', 'Day 2: Playoffs', 'Day 3: Medals & Award ceremony']
    });

    // Reset Form
    setNewTitle('');
    setNewLoc('');
    setNewDesc('');
    setShowCreatorSuccess(true);
    setTimeout(() => setShowCreatorSuccess(false), 5000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 dashboard-id-1" id="sports_dashboard_view">
      
      {/* Dynamic Header based on selected ROLE */}
      <div className="mb-10 text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[#1C77FF] text-xs font-black uppercase tracking-widest block mb-1">
            SportsOS Command Center
          </span>
          <h1 className="font-sans text-3xl font-black tracking-tight text-[#0B132Bi]">
            {currentRole === 'athlete' ? 'Athletic Command Terminal' : 'Tournament Scout Director Hub'}
          </h1>
          <p className="font-sans text-sm text-slate-500 mt-1">
            {currentRole === 'athlete'
              ? 'Maximize scout interest by tracking performance parameters and logging active rosters.'
              : 'Approve registrations, scout upcoming contenders, and orchestrate official state tournaments.'}
          </p>
        </div>

        {/* Quick stat indicators */}
        <div className="flex gap-4">
          <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-left select-none">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Current Identity Context</p>
            <p className="text-sm font-extrabold text-[#0B132B] uppercase tracking-wide mt-1">
              🏢 {currentRole === 'organizer' ? 'Official Organizer' : 'Elite Athlete Recruit'}
            </p>
          </div>
        </div>
      </div>

      {/* ==================== ATHLETE DASHBOARD VIEW ==================== */}
      {currentRole === 'athlete' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Stats & Charts (8 out of 12 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Live Analytics Line Graph */}
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left" id="card_performance_chart">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#1C77FF]">
                    Athletic Progression Loop
                  </span>
                  <h3 className="font-sans text-base font-extrabold text-[#0B132B] tracking-tight mt-1">
                    Telemetry Training Progress Trend
                  </h3>
                </div>
                
                {/* Visual Legend */}
                <div className="flex items-center gap-3 text-xxs font-mono font-bold uppercase text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#1C77FF]"></span> Points / PPG
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#10B981]"></span> Rating Avg
                  </span>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="h-[260px] w-full" id="chart_container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPPG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1C77FF" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#1C77FF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="match" tick={{ fontSize: 10, fill: '#64748B' }} stroke="#E2E8F0" />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} stroke="#E2E8F0" />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', borderColor: '#E2E8F0' }} />
                    <Area type="monotone" dataKey="PPG" stroke="#1C77FF" strokeWidth={3} fillOpacity={1} fill="url(#colorPPG)" />
                    <Area type="monotone" dataKey="rating" stroke="#10B981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorRating)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>



            {/* Public Game & Match Invitations list */}
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#1C77FF]">
                    Public Social Match Gate
                  </span>
                  <h3 className="font-sans text-base font-extrabold text-[#0B132B] tracking-tight mt-1">
                    Incoming Game & Draft Invitations
                  </h3>
                </div>
                <span className="bg-blue-50 text-[#1C77FF] text-[10px] font-bold px-2.5 py-1 rounded-md border border-blue-100">
                  {relatedInvitations.filter((i) => i.status === 'Pending').length} Pending
                </span>
              </div>

              <p className="text-slate-500 text-xs mb-4 leading-relaxed font-semibold">
                Accept or reject matches scheduled by public organizers in your registered athletic categories.
              </p>

              <div className="space-y-3">
                {relatedInvitations.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center text-xs text-slate-500">
                    No draft invitations are available for your registered sports yet.
                  </div>
                ) : (
                  relatedInvitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="group border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all text-left flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${
                            inv.sport === 'Kabaddi' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                            inv.sport === 'Cricket' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' :
                            inv.sport === 'Basketball' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                            'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {inv.sport} • {inv.bracket}
                          </span>
                          
                          <span className="text-[10px] text-slate-500 font-mono font-bold">
                            Entry: {inv.entryFee}
                          </span>
                        </div>
                        
                        <h4 className="font-sans text-sm font-black text-[#0B132B] mt-1">
                          {inv.title}
                        </h4>
                        <p className="font-sans text-xs text-slate-400 mt-0.5">
                          Organizer: <span className="text-slate-600 font-extrabold">{inv.challengerName}</span> • Date: {inv.date}
                        </p>
                        <p className="text-[11px] text-slate-505 italic mt-1 bg-white p-2.5 rounded-lg border border-slate-100">
                          "{inv.message}"
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
                        {inv.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => {
                                setSelectedInvitationId(inv.id);
                                setShowPaymentModal(true);
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" /> Accept
                            </button>
                            
                            <button
                              onClick={() => {
                                setInvitations(prev => prev.map(item => item.id === inv.id ? { ...item, status: 'Rejected' } : item));
                              }}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" /> Reject
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                              inv.status === 'Accepted'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-250/20'
                                : 'bg-rose-50 text-rose-600 border-rose-200'
                            }`}>
                              ● Invitation {inv.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {showPaymentModal && selectedInvitation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B132B]/70 px-4">
                  <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#1C77FF]">UPI Payment</p>
                        <h4 className="mt-1 text-sm font-black text-[#0B132B]">Pay entry fee for {selectedInvitation.title}</h4>
                      </div>
                      <button
                        onClick={() => {
                          setShowPaymentModal(false);
                          setSelectedInvitationId(null);
                        }}
                        className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                        <span>Amount</span>
                        <span>Payment mode</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-base font-black text-[#0B132B]">
                        <span>{selectedInvitation.entryFee}</span>
                        <span>UPI</span>
                      </div>
                      <p className="mt-3 text-xs text-slate-500">Use the UPI ID below to complete the payment and confirm your acceptance.</p>
                      <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                        sportsos@upi
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowPaymentModal(false);
                          setSelectedInvitationId(null);
                        }}
                        className="rounded-xl border border-slate-200 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setInvitations(prev => prev.map(item => item.id === selectedInvitation.id ? { ...item, status: 'Accepted' } : item));
                          setShowPaymentModal(false);
                          setSelectedInvitationId(null);
                        }}
                        className="rounded-xl bg-emerald-600 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-white"
                      >
                        Pay & Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* My registered Tournament Status cards */}
            <div className="space-y-4">
              <h3 className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280]">
                Roster Placement Enlistments ({registrations.filter((r) => r.athleteId === currentUser.id).length})
              </h3>

              <div className="space-y-3">
                {registrations
                  .filter((r) => r.athleteId === currentUser.id)
                  .map((reg) => (
                    <div
                      key={reg.id}
                      className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          SportsOS Secure Verification Ticket
                        </span>
                        <h4 className="font-sans text-sm font-bold text-[#0B132Bi]">
                          {reg.tournamentTitle}
                        </h4>
                        <p className="font-sans text-[10px] text-slate-400 font-semibold font-mono">
                          Applied: {reg.dateRegistered} • ID: OS-REG-{reg.id.split('_')[1]}
                        </p>
                      </div>

                      {/* Status indicator pill */}
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full ${
                          reg.status === 'Approved'
                            ? 'bg-emerald-50 text-[#10B981] border border-emerald-250/20'
                            : reg.status === 'Declined'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          ● {reg.status}
                        </span>

                        <div className="text-xs font-semibold text-slate-600">
                          {reg.status === 'Approved' ? 'Roster Ready ✓' : 'scout evaluation continuing...'}
                        </div>
                      </div>

                    </div>
                  ))}

                {registrations.filter((r) => r.athleteId === currentUser.id).length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-white">
                    <p className="font-sans text-xs text-slate-400 font-semibold mb-3">You have not registered for any active tournament rosters.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Suggested Campaigns & Actions (4 out of 12 cols) */}
          <div className="lg:col-span-4 space-y-6 text-left">
            
            {/* Quick Action links */}
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm space-y-4">
              <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280] block">
                Command Quick Launches
              </span>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                      <Trophy className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold text-[#0B132B]">Order laser testing</h4>
                      <p className="text-[10px] font-sans text-slate-400">Certify physical variables</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-50 text-[#1C77FF] rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold text-[#0B132B]">Promote profile link</h4>
                      <p className="text-[10px] font-sans text-slate-400 font-mono">sportsos.co/{currentUser.name.toLowerCase().replace(' ', '')}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Simulated Verified Scout Scan Alert panel */}
            <div className="rounded-2xl border border-emerald-250/20 bg-emerald-500/[0.02] p-5 shadow-sm text-left border-dashed space-y-3.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 h-20 w-20 bg-emerald-100/30 rounded-full blur-xl"></div>
              
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#10B981] animate-pulse" />
                <span className="font-mono text-[#10B981] text-[10px] uppercase font-bold tracking-widest">
                  Active Scout Telemetry Insights
                </span>
              </div>

              <div className="space-y-2">
                <p className="font-sans text-xs text-slate-600 leading-relaxed font-semibold">
                  "Your point guard stats were flagged in 12 algorithmic scout queries by Pac-12 scouts over the last 72 hours."
                </p>
                <p className="font-sans text-xxs text-slate-400 uppercase">
                  ✓ Keep APG above 7.0 to stay in Elite recruiting percentiles.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ==================== ORGANIZER DASHBOARD VIEW ==================== */}
      {currentRole === 'organizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Create Tournament panel (7 out of 12 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Create Tournament Form card */}
            <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm" id="card_tournament_designer">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-9 w-9 bg-[#0B132B] text-white rounded-xl flex items-center justify-center">
                  <FilePlus className="h-5 w-5 text-sky-400" />
                </div>
                <div>
                  <span className="font-mono text-[#1C77FF] text-[9px] uppercase font-bold tracking-widest">Organizer Campaign Planner</span>
                  <h3 className="font-sans text-base font-black text-[#0B132Bi] tracking-tight">
                    Establish Official Athletic Event
                  </h3>
                </div>
              </div>

              {showCreatorSuccess && (
                <div className="mb-5 flex items-center gap-2.5 border border-[#10B981]/25 bg-[#10B981]/5 rounded-xl p-3.5 text-xs font-semibold text-[#10B981]" id="alert_create_success">
                  <ShieldCheck className="h-5 w-5 stroke-[2]" />
                  <span>Success! Event created & catalog updated live. Check the Discover Events tab.</span>
                </div>
              )}

              <form onSubmit={handleTournamentCreate} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="font-sans text-xs font-bold text-slate-650">Event Title Name</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Metro Youth Summer Showcase"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-[#1C77FF] focus:outline-none placeholder:text-slate-400"
                    id="input_trn_title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5 text-left">
                    <label className="font-sans text-xs font-bold text-slate-650">Event Format Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <option value="Tournament">Tournament</option>
                      <option value="League">League</option>
                      <option value="Trial">Recruiter Trial</option>
                      <option value="Camp">Development Camp</option>
                      <option value="Championship">Championship</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="font-sans text-xs font-bold text-slate-650">Sport Discipline</label>
                    <select
                      value={newSport}
                      onChange={(e) => setNewSport(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#0B132B] focus:outline-none cursor-pointer"
                    >
                      <option value="Basketball">Basketball</option>
                      <option value="Soccer">Soccer</option>
                      <option value="Track & Field">Track & Field</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Kabaddi">Kabaddi</option>
                      <option value="Cricket">Cricket</option>
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5 text-left">
                    <label className="font-sans text-xs font-bold text-slate-650 font-mono text-[10px] uppercase tracking-wide">Roster Max size</label>
                    <input
                      type="number"
                      required
                      value={newMax}
                      onChange={(e) => setNewMax(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-[#1C77FF] focus:outline-none focus:ring-1 focus:ring-[#1C77FF]/30 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="font-sans text-xs font-bold text-slate-650">Entry Fee Cost</label>
                    <input
                      type="text"
                      required
                      value={newFee}
                      onChange={(e) => setNewFee(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-[#1C77FF] focus:outline-none focus:ring-1 focus:ring-[#1C77FF]/30 placeholder:text-slate-400"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5 text-left">
                    <label className="font-sans text-xs font-bold text-slate-650">Location Venue</label>
                    <input
                      type="text"
                      required
                      value={newLoc}
                      onChange={(e) => setNewLoc(e.target.value)}
                      placeholder="e.g. Austin Rec Center, TX"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-[#1C77FF] focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="font-sans text-xs font-bold text-slate-650">Deadline Cutoff</label>
                    <input
                      type="text"
                      required
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      placeholder="e.g. Jul 30, 2026"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-[#1C77FF] focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-xs font-bold text-[#0B132B]">Event Description & Scouting Priorities</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Provide details for athletes about how stats will be captured, scouts present, or accommodation specifics..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 p-3 text-xs focus:border-[#1C77FF] focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B132B] hover:bg-[#1C77FF] text-white py-3.5 text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-[#0B132B]/10 hover:shadow-blue-500/20"
                >
                  <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
                  Deploy Event Campaign
                </button>

              </form>

            </div>

          </div>

          {/* Right Column: review roster registrations (5 out of 12 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left" id="col_roster_decisions">
            
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#6B7280]">Secure Gatekeeper Desk</span>
                  <h3 className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#0B132B] mt-0.5">
                    Pending Roster Enlistments ({registrations.filter((r) => r.status === 'Pending').length})
                  </h3>
                </div>
              </div>

              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="rounded-xl border border-slate-100 p-3.5 bg-slate-50/50 hover:bg-white transition-all space-y-3 border-l-3"
                    style={{ borderLeftColor: reg.status === 'Approved' ? '#10B981' : reg.status === 'Declined' ? '#EF4444' : '#F59E0B' }}
                  >
                    
                    {/* Athlete summary bar */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={reg.athleteAvatar}
                          alt={reg.athleteName}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div className="text-left leading-tight">
                          <h4 className="font-sans text-xs font-black text-[#0B132Bi]">{reg.athleteName}</h4>
                          <p className="text-[10px] font-sans text-slate-500">{reg.athleteSport}</p>
                        </div>
                      </div>
                      
                      <span className={`text-[8px] uppercase font-bold tracking-widest font-mono px-2 py-0.5 rounded-full ${
                        reg.status === 'Approved' ? 'bg-emerald-50 text-[#10B981]' : reg.status === 'Declined' ? 'bg-rose-50 text-rose-650' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {reg.status}
                      </span>
                    </div>

                    {/* Target Event details */}
                    <div className="text-xxs font-sans text-slate-500 bg-white border border-slate-100 rounded-lg p-2 leading-relaxed">
                      Applied to: <span className="font-semibold text-slate-700">{reg.tournamentTitle}</span> <br />
                      Applied on: <span className="font-mono text-slate-400">{reg.dateRegistered}</span>
                    </div>

                    {reg.declaredSkills && Object.keys(reg.declaredSkills).length > 0 && (
                      <div className="text-xxs font-sans text-slate-600 bg-blue-50/20 border border-blue-100/50 rounded-lg p-2 space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-wider text-[#1C77FF]">Declared Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(reg.declaredSkills).map(([key, val]) => {
                            const cleanKey = key.replace('cricket', '').replace('kabaddi', '').replace('general', '');
                            let displayKey = cleanKey;
                            if (cleanKey === 'Role') displayKey = 'Role/Position';
                            if (cleanKey === 'Batting') displayKey = 'Batting Hand';
                            if (cleanKey === 'Bowling') displayKey = 'Bowling/Spin';
                            if (cleanKey === 'Style') displayKey = 'Special Signature';
                            if (cleanKey === 'Skill') displayKey = 'Specialty';
                            return (
                              <span key={key} className="bg-white px-1.5 py-0.5 rounded border border-slate-200 capitalize font-mono text-[9px] text-[#0B132Bi]">
                                <span className="text-slate-400 font-bold mr-1">{displayKey}:</span>{val}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Pending Decision controls */}
                    {reg.status === 'Pending' && (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100/60">
                        <button
                          onClick={() => onDeclineRegistration(reg.id)}
                          className="inline-flex items-center gap-1 text-xxs font-bold text-rose-500 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <X className="h-3 w-3 shrink-0" />
                          Decline
                        </button>

                        <button
                          onClick={() => onApproveRegistration(reg.id)}
                          className="inline-flex items-center gap-1 text-xxs font-bold text-[#10B981] hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg bg-emerald-50/50 uppercase tracking-wider transition-all cursor-pointer border border-[#10B981]/20"
                        >
                          <Check className="h-3 w-3 shrink-0 stroke-[2.5]" />
                          Approve entry
                        </button>
                      </div>
                    )}

                  </div>
                ))}

                {registrations.length === 0 && (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-slate-400">
                    <p className="text-xs font-semibold">No tournament registration requests have been recorded yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
