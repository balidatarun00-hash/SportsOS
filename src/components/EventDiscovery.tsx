/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calendar, MapPin, Users, DollarSign, Award, Clock, ShieldAlert, Check, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { Tournament, Athlete, EventType } from '../types';
import InvalidGamesTicker from './InvalidGamesTicker';

interface EventDiscoveryProps {
  tournaments: Tournament[];
  currentUser: Athlete;
  registeredTournamentIds: string[];
  onRegister: (tournamentId: string, comments: string, declaredSkills?: Record<string, string>) => void;
  onCancelRegistration?: (tournamentId: string) => void;
}

export default function EventDiscovery({
  tournaments,
  currentUser,
  registeredTournamentIds,
  onRegister,
  onCancelRegistration,
}: EventDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeTab, setActiveTypeTab] = useState<EventType | 'All'>('All');
  const [activeSportTab, setActiveSportTab] = useState<string>('All');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'All' | 'sub-junior' | 'junior' | 'senior'>('All');
  
  // Selected tournament details modal
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [registerStage, setRegisterStage] = useState<'details' | 'form' | 'success'>('details');
  const [scoutComments, setScoutComments] = useState('');

  // Game skills registration fields
  const [cricketRole, setCricketRole] = useState('batter');
  const [cricketBatting, setCricketBatting] = useState('right-hand-batsman');
  const [cricketBowling, setCricketBowling] = useState('off-spin');

  const [kabaddiRole, setKabaddiRole] = useState('Raider');
  const [kabaddiStyle, setKabaddiStyle] = useState('Toe Touch');

  const [generalRole, setGeneralRole] = useState('All-Rounder');
  const [generalSkill, setGeneralSkill] = useState('Balanced Playmaker');

  // Extract unique sports
  const sportsList = ['All', ...Array.from(new Set(tournaments.map((t) => t.sport)))];
  
  // Event types
  const eventTypes: (EventType | 'All')[] = ['All', 'Tournament', 'League', 'Trial', 'Camp', 'Championship'];

  // Filter tournaments
  const filteredTournaments = tournaments.filter((trn) => {
    const matchesSearch = trn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trn.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trn.organizerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTypeTab === 'All' || trn.type === activeTypeTab;
    const matchesSport = activeSportTab === 'All' || trn.sport === activeSportTab;
    const matchesCategory = activeCategoryTab === 'All' || trn.category === activeCategoryTab;
    return matchesSearch && matchesType && matchesSport && matchesCategory;
  });

  // Handle confirm registration
  const handleConfirmRegistration = () => {
    if (!selectedTournament) return;
    
    const skillsToSubmit: Record<string, string> = {};
    if (selectedTournament.sport === 'Cricket') {
      skillsToSubmit.cricketRole = cricketRole;
      skillsToSubmit.cricketBatting = cricketBatting;
      skillsToSubmit.cricketBowling = cricketBowling;
    } else if (selectedTournament.sport === 'Kabaddi') {
      skillsToSubmit.kabaddiRole = kabaddiRole;
      skillsToSubmit.kabaddiStyle = kabaddiStyle;
    } else {
      skillsToSubmit.generalRole = generalRole;
      skillsToSubmit.generalSkill = generalSkill;
    }

    onRegister(selectedTournament.id, scoutComments, skillsToSubmit);
    setRegisterStage('success');
  };

  // Close Register Modal
  const closeRegisterModal = () => {
    setSelectedTournament(null);
    setRegisterStage('details');
    setScoutComments('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 event-discovery-id-1" id="event_discovery_view">
      
      {/* Search Header banner */}
      <div className="mb-10 text-left">
        <h1 className="font-sans text-3xl font-black tracking-tight text-[#0B132Bi]">
          Discover Athletic Opportunities
        </h1>
        <p className="font-sans text-sm text-slate-500 mt-1 max-w-2xl">
          Register for championships, recruitment trials, regional leagues, and developmental camps. All stats tracked instantly update your verified portfolio.
        </p>
      </div>

      {/* Advanced Filter Panel */}
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left mb-8 space-y-4">
        
        {/* Search Input and Sport Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter title, organizer or location..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-[#1C77FF] focus:outline-none focus:ring-1 focus:ring-[#1C77FF]/30 placeholder:text-slate-400"
            />
          </div>

          <div className="md:col-span-8 flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="font-sans text-xs text-slate-400 font-bold tracking-wider uppercase shrink-0">
              Filter Sport:
            </span>
            {sportsList.map((sport) => (
              <button
                key={sport}
                onClick={() => setActiveSportTab(sport)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg tracking-wide shrink-0 transition-all cursor-pointer btn-touch-bounce ${
                  activeSportTab === sport
                    ? sport === 'Kabaddi' 
                      ? 'btn-moving-sunset text-white shadow-md' 
                      : sport === 'Cricket' 
                      ? 'btn-moving-cyberpunk text-white shadow-md font-bold' 
                      : 'bg-[#1C77FF] text-white shadow-md'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#0B132B]'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

        </div>

        {/* Event Type selector border */}
        <div className="border-t border-slate-100 pt-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="font-sans text-xs text-slate-400 font-bold tracking-wider uppercase shrink-0">
            Event Type:
          </span>
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveTypeTab(type)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg tracking-wide shrink-0 transition-all cursor-pointer ${
                activeTypeTab === type
                  ? 'bg-[#0B132B] text-white'
                  : 'text-slate-500 hover:text-[#0B132B] bg-slate-50 hover:bg-slate-100'
              }`}
            >
              {type === 'All' ? 'All Formats' : type}
            </button>
          ))}
        </div>

        {/* Age Brackets Competitive selector border */}
        <div className="border-t border-slate-100 pt-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="font-sans text-xs text-slate-400 font-bold tracking-wider uppercase shrink-0">
            Age Bracket:
          </span>
          {(['All', 'sub-junior', 'junior', 'senior'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryTab(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg tracking-wide shrink-0 transition-all capitalize cursor-pointer ${
                activeCategoryTab === cat
                  ? 'bg-[#1C77FF] text-white shadow-sm shadow-blue-400/20'
                  : 'text-slate-500 hover:text-[#0B132B] bg-slate-50 hover:bg-slate-100'
              }`}
            >
              {cat === 'All' ? 'All Brackets' : cat.replace('-', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tournaments_catalogue_grid">
        {filteredTournaments.map((trn) => {
          const isRegistered = registeredTournamentIds.includes(trn.id);
          const percentSpotsUsed = (trn.registeredCount / trn.maxParticipants) * 100;
          
          return (
            <div
              key={trn.id}
              className="bg-white rounded-2xl border border-slate-150 overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40 transition-all text-left relative group duration-300"
            >
              
              {/* Event Image Banner */}
              <div className="h-44 relative overflow-hidden bg-slate-900 shrink-0">
                <img
                  referrerPolicy="no-referrer"
                  src={trn.bannerUrl}
                  alt={trn.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-700"
                />
                
                {/* Format Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className={`text-[10px] tracking-wider uppercase font-black px-2.5 py-1 rounded bg-[#0b132bd9] text-white backdrop-blur-xs`}>
                    {trn.type}
                  </span>
                  
                  <span className="text-[10px] tracking-wider uppercase font-black px-2.5 py-1 rounded bg-[#1c77ffd9] text-white backdrop-blur-xs">
                    {trn.sport}
                  </span>

                  {trn.category && (
                    <span className="text-[10px] tracking-wider uppercase font-black px-2.5 py-1 rounded bg-amber-500 text-white backdrop-blur-xs capitalize">
                      {trn.category.replace('-', ' ')}
                    </span>
                  )}
                </div>

                {/* Pricing Overlay */}
                <div className="absolute bottom-3 right-3 rounded bg-white/95 text-[#0B132B] border border-slate-100 px-2 py-0.5 text-xs font-extrabold tracking-wide">
                  Entry: {trn.fee}
                </div>
              </div>

              {/* Event Metrics & Contents */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                
                <div className="space-y-2">
                  <h3 className="font-sans text-base font-black text-[#0B132B] tracking-tight group-hover:text-[#1C77FF] transition-colors line-clamp-1">
                    {trn.title}
                  </h3>
                  
                  <p className="font-sans text-[11px] font-semibold text-slate-400 line-clamp-1 flex items-center gap-1.5">
                    {trn.organizerName}
                  </p>

                  <div className="pt-2 text-xxs font-bold text-slate-500 uppercase space-y-2 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#1C77FF]" />
                      <span>{trn.date} ({trn.duration})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#1C77FF]" />
                      <span className="truncate">{trn.location}</span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-slate-500 line-clamp-2 pt-2">
                    {trn.description}
                  </p>
                </div>

                {/* Footer and status metrics */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
                  
                  {/* Slots Bar tracker */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xxs font-bold uppercase text-slate-500 font-mono">
                      <span>Roster Quota</span>
                      <span>
                        {trn.registeredCount} / {trn.maxParticipants} slots taken
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          percentSpotsUsed >= 95 ? 'bg-rose-500' : percentSpotsUsed >= 75 ? 'bg-amber-400' : 'bg-[#1C77FF]'
                        }`}
                        style={{ width: `${Math.min(percentSpotsUsed, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-sans text-xxs text-amber-600 font-extrabold uppercase tracking-wider">
                      Deadline: {trn.deadline}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedTournament(trn);
                        // Check if already registered
                        if (isRegistered) {
                          setRegisterStage('success');
                        } else {
                          setRegisterStage('details');
                        }
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase select-none cursor-pointer tracking-wider transition-all btn-touch-pulse btn-shimmer-highlight ${
                        isRegistered
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default font-extrabold'
                          : trn.sport === 'Kabaddi'
                          ? 'btn-moving-sunset text-white shadow-md text-[10px]'
                          : trn.sport === 'Cricket'
                          ? 'btn-moving-cyberpunk text-white shadow-md text-[10px]'
                          : 'bg-[#0B132B] hover:bg-[#1C77FF] btn-moving-sapphire text-white shadow-md text-[10px]'
                      }`}
                    >
                      {isRegistered ? 'Approved Active' : 'CLICK'}
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}

        {filteredTournaments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center bg-white col-span-3">
            <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="font-sans text-sm font-bold text-slate-500">No athletic events matches current filter rules.</p>
            <p className="font-sans text-xs text-slate-400 mt-1">Try broadening your search text or selecting "All Formats".</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <InvalidGamesTicker />
      </div>

      {/* Elegant Register / inspection Overlay Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0B132B]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-100 shadow-2xl flex flex-col p-6 text-left">
            
            {/* Close Toggle */}
            <button
              onClick={closeRegisterModal}
              className="absolute right-5 top-5 p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>

            {/* Modal Stage 1: Details and Rules info */}
            {registerStage === 'details' && (
              <div className="space-y-4">
                
                <div className="flex gap-2 mb-1">
                  <span className="text-[10px] uppercase font-black tracking-wider bg-slate-100 text-[#0B132B] px-2.5 py-0.5 rounded">
                    {selectedTournament.type}
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-wider bg-blue-50 text-[#1C77FF] px-2.5 py-0.5 rounded">
                    {selectedTournament.sport}
                  </span>
                </div>

                <h2 className="font-sans text-xl font-black text-[#0B132B] tracking-tight leading-tight">
                  {selectedTournament.title}
                </h2>

                <p className="font-sans text-xxs font-bold text-[#1C77FF] uppercase tracking-wide">
                  Organized by: {selectedTournament.organizerName}
                </p>

                {/* Banner representation */}
                <div className="h-36 rounded-2xl overflow-hidden relative">
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedTournament.bannerUrl}
                    alt={selectedTournament.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 text-[#0B132B] px-3 py-1 rounded text-xs font-black">
                    Fee: {selectedTournament.fee}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 text-xs font-mono font-bold text-slate-500 uppercase">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-sans tracking-wide">Event Location</span>
                    <p className="font-sans font-bold text-slate-700 text-xs truncate">{selectedTournament.location}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-sans tracking-wide">Prize Pool / Reward</span>
                    <p className="font-sans font-bold text-slate-700 text-xs truncate">{selectedTournament.prizePool || 'Certification Placement'}</p>
                  </div>
                </div>

                {/* Rules & Requirements block */}
                <div className="space-y-2">
                  <span className="font-sans text-xs font-extrabold text-[#0B132B] uppercase tracking-widest block">
                    Tournament Requirements & Rules
                  </span>
                  <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-600">
                    {selectedTournament.rules?.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    )) || (
                      <>
                        <li>Must hold an active, verified SportsOS athlete portfolio credential.</li>
                        <li>Maintain clean local sports medicine clearance credentials.</li>
                        <li>Registration fee must be collected before deadline.</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Timeline block */}
                {selectedTournament.schedule && (
                  <div className="space-y-2">
                    <span className="font-sans text-xs font-extrabold text-[#0B132B] uppercase tracking-widest block">
                      Chronology / Schedule
                    </span>
                    <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-[140px] overflow-y-auto">
                      {selectedTournament.schedule.map((sch, i) => (
                        <p key={i} className="text-xxs font-sans text-slate-500">
                          ⚡ <span className="font-semibold text-slate-700">{sch}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions bottom */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="font-sans text-xxs font-bold text-rose-500 uppercase">
                      Deadline: {selectedTournament.deadline}
                    </span>
                    <span className="font-sans text-xxs text-slate-400">
                      Roster has {selectedTournament.maxParticipants - selectedTournament.registeredCount} spots remaining
                    </span>
                  </div>

                  <button
                    onClick={() => setRegisterStage('form')}
                    className="inline-flex items-center gap-2 rounded-xl text-white px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer btn-moving-gradient btn-touch-pulse btn-shimmer-highlight shadow-lg"
                  >
                    CLICK
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

              </div>
            )}

            {/* Modal Stage 2: Submit credentials to scouts form */}
            {registerStage === 'form' && (
              <div className="space-y-5">
                <span className="font-mono text-[#1C77FF] text-xs font-black uppercase tracking-widest block">
                  Verify Credentials • Roster Entry
                </span>

                <h2 className="font-sans text-lg font-black text-[#0B132Bi]">
                  Apply with SportsOS Athlete ID
                </h2>

                {/* Quick Profile Readout */}
                <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-12 w-12 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-sans text-sm font-black text-[#0B132B]">{currentUser.name}</h3>
                    <p className="font-sans text-xs text-slate-500">{currentUser.sport} • {currentUser.position}</p>
                    <p className="font-sans text-[10px] font-semibold text-[#1C77FF] mt-0.5">
                      ✓ Profile metrics will be shared directly with {selectedTournament.organizerName}.
                    </p>
                  </div>
                </div>

                {/* Dynamic Sport-Specific Game & Athletic Skills Declaration dropdowns */}
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 text-left space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-black text-[#1C77FF] tracking-wider mb-1">
                    <span>🎯 Declare Athlete Skills & Roles</span>
                  </div>

                  {selectedTournament.sport === 'Cricket' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Playing Role</label>
                        <select
                          value={cricketRole}
                          onChange={(e) => setCricketRole(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C77FF] cursor-pointer"
                        >
                          <option value="batter">Batter</option>
                          <option value="bowler">Bowler</option>
                          <option value="batter+wicket keeping">Batter + Wicket keeping</option>
                          <option value="all-rounder">All-Rounder</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Batting Hand</label>
                        <select
                          value={cricketBatting}
                          onChange={(e) => setCricketBatting(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C77FF] cursor-pointer"
                        >
                          <option value="right-hand-batsman">Right Hand Batsman</option>
                          <option value="left-hand-batsman">Left Hand Batsman</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Bowling / Spin Style</label>
                        <select
                          value={cricketBowling}
                          onChange={(e) => setCricketBowling(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C77FF] cursor-pointer"
                        >
                          <option value="spin">Spin</option>
                          <option value="fast pacer">Fast Pacer</option>
                          <option value="medium pacer">Medium Pacer</option>
                          <option value="off spin">Off Spin</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedTournament.sport === 'Kabaddi' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Kabaddi Position</label>
                        <select
                          value={kabaddiRole}
                          onChange={(e) => setKabaddiRole(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C77FF] cursor-pointer"
                        >
                          <option value="Raider">Raider (Attacking)</option>
                          <option value="Defender">Defender (Corner/Hold)</option>
                          <option value="All-Rounder">All-Rounder</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Signature Action Grip</label>
                        <select
                          value={kabaddiStyle}
                          onChange={(e) => setKabaddiStyle(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C77FF] cursor-pointer"
                        >
                          <option value="Toe Touch">Toe Touch / Raid</option>
                          <option value="Hand Touch">Hand Touch</option>
                          <option value="Dubki">Dubki Escape</option>
                          <option value="Ankle Hold">Ankle Hold Precision</option>
                          <option value="Thigh Hold">Thigh Hold Grip</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedTournament.sport !== 'Cricket' && selectedTournament.sport !== 'Kabaddi' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Primary Playing Role</label>
                        <select
                          value={generalRole}
                          onChange={(e) => setGeneralRole(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C77FF] cursor-pointer"
                        >
                          <option value="All-Rounder">All-Rounder Matchplay</option>
                          <option value="Attacking Offense">Attacking Forward/Offense</option>
                          <option value="Defensive Anchor">Defensive Anchor/Guard</option>
                          <option value="Playmaker">Playmaker Lead / Wing</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Athletic Specialty</label>
                        <select
                          value={generalSkill}
                          onChange={(e) => setGeneralSkill(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C77FF] cursor-pointer"
                        >
                          <option value="Balanced Playmaker">Balanced Playmaker</option>
                          <option value="High Velocity Stamina">High Velocity Stamina</option>
                          <option value="Tactical Corner Hold">Tactical Corner Play</option>
                          <option value="High-Impact Scrimmage">High-Impact Scrimmage Score</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-left">
                  <label className="font-sans text-xs font-bold text-[#0B132B]">
                    Note to Tournament Organizer & Scout Panel
                  </label>
                  <textarea
                    value={scoutComments}
                    onChange={(e) => setScoutComments(e.target.value)}
                    placeholder="Mention key career targets, dietary or flight details, or specific recruiters you wish to interview with..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 p-3 text-xs focus:border-[#1C77FF] focus:outline-none focus:ring-1 focus:ring-[#1C77FF]/30 placeholder:text-slate-400"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-1.5 text-slate-500">
                  <p className="text-xxs font-semibold">✔️ By submitting, you confirm authorization to share your certified physical dimensions (Height, Weight), academic graduating class status, and stats timeline.</p>
                </div>

                {/* Form Bottom action buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setRegisterStage('details')}
                    className="px-4 py-2 text-xs font-semibold uppercase text-slate-500 hover:text-[#0B132B] hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    Back to Details
                  </button>

                  <button
                    onClick={handleConfirmRegistration}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-md transition-all border-0"
                    style={{ backgroundColor: '#10B981' }}
                  >
                    SUBMIT
                  </button>
                </div>

              </div>
            )}

            {/* Modal Stage 3: Registration Success screen */}
            {registerStage === 'success' && (
              <div className="text-center py-8 space-y-4">
                
                <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center border border-emerald-200">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>

                <h2 className="font-sans text-xl font-black text-[#0B132Bi]">
                  You are Officially Registered!
                </h2>

                <p className="font-sans text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your certified SportsOS athlete credential has been successfully appended to the tournament roster of <span className="font-semibold text-slate-800">{selectedTournament.title}</span>.
                </p>

                <div className="bg-emerald-50 max-w-sm mx-auto p-3.5 rounded-xl text-[11px] font-medium text-emerald-800 border border-emerald-150">
                  ⚡ Registration ID: OS-REG-{selectedTournament.id.split('_')[1]}-{currentUser.id.split('_')[1]}
                </div>

                <p className="font-mono text-[10px] text-slate-400">
                  Status: Approved & Registered
                </p>

                <div className="pt-6 flex justify-center gap-3">
                  <button
                    onClick={closeRegisterModal}
                    className="px-6 py-3 rounded-xl text-white text-xs font-black uppercase tracking-wider cursor-pointer btn-moving-gradient btn-shimmer-highlight btn-touch-pulse shadow-md transition-all"
                  >
                    Done Reviewing
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
