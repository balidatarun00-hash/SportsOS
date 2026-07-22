import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCw, Tv, Users, Target, Activity, Flame, Radio } from 'lucide-react';
import { Athlete } from '../types';

interface LiveMatchesProps {
  currentUser: Athlete;
  buttonStyle: 'chameleon' | 'elastic' | 'standard';
}

interface Match {
  id: string;
  sport: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  status: string; // e.g. "Live - Second Half", "Live - Q4"
  timeRemaining: string;
  venue: string;
  highlights: string[];
  stats: { label: string; valA: string | number; valB: string | number }[];
}

export default function LiveMatches({ currentUser, buttonStyle }: LiveMatchesProps) {
  const userSport = currentUser.sport || 'Basketball';
  const [selectedSport, setSelectedSport] = useState<string>(userSport);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tickerMessage, setTickerMessage] = useState<string>('Live feed connected to SportsOS Orbit Satellite.');

  // Sport specific live matches database
  const [matches, setMatches] = useState<Match[]>([
    // KABADDI
    {
      id: 'm_kabaddi_1',
      sport: 'Kabaddi',
      teamA: 'U Mumba Raiders',
      teamB: 'Bengaluru Bulls',
      scoreA: 34,
      scoreB: 31,
      status: 'Live - 2nd Half',
      timeRemaining: '04:12',
      venue: 'Sree Kanteerava Indoor Stadium',
      highlights: [
        'Super Raid by Right-In attacker (3 points secured)',
        'Thumping ankle hold by Right-Corner Defender',
        'Technical timeout called by Bengaluru coach'
      ],
      stats: [
        { label: 'Raid Points', valA: 18, valB: 15 },
        { label: 'Tackle Points', valA: 12, valB: 11 },
        { label: 'All Outs Inflicted', valA: 1, valB: 1 },
        { label: 'Empty Raids', valA: 4, valB: 6 }
      ]
    },
    {
      id: 'm_kabaddi_2',
      sport: 'Kabaddi',
      teamA: 'Puneri Paltan',
      teamB: 'Haryana Steelers',
      scoreA: 22,
      scoreB: 25,
      status: 'Live - 1st Half',
      timeRemaining: '01:45',
      venue: 'Chhatrapati Shivaji Sports Complex',
      highlights: [
        'Haryana defense executes a superb chain tackle',
        'Empty raid by Pune captain to reset positioning',
        'Bonus point claimed by Pune raider on left corner'
      ],
      stats: [
        { label: 'Raid Points', valA: 10, valB: 12 },
        { label: 'Tackle Points', valA: 8, valB: 10 },
        { label: 'All Outs Inflicted', valA: 0, valB: 0 },
        { label: 'Empty Raids', valA: 5, valB: 3 }
      ]
    },
    // CRICKET
    {
      id: 'm_cricket_1',
      sport: 'Cricket',
      teamA: 'Mumbai Colts Academy',
      teamB: 'West Zone Challengers',
      scoreA: 172, // for 3 wickets
      scoreB: 168, // all out (or target)
      status: 'Live - Innings 2',
      timeRemaining: 'Overs 18.2 / 20',
      venue: 'Wankhede Stadium, Mumbai',
      highlights: [
        'Massive six hit straight down the ground by opener',
        'Inswinging yorker rattles the off-stump of key batsman',
        'Wicket! Caught at deep mid-wicket trying to clear boundary'
      ],
      stats: [
        { label: 'Run Rate', valA: '9.38', valB: '8.40' },
        { label: 'Sixes Hit', valA: 9, valB: 6 },
        { label: 'Extras conceded', valA: 8, valB: 12 },
        { label: 'Partnership', valA: '68 (32b)', valB: '41 (28b)' }
      ]
    },
    // SOCCER
    {
      id: 'm_soccer_1',
      sport: 'Soccer',
      teamA: 'Denver Elite FC',
      teamB: 'Salt Lake Academy',
      scoreA: 2,
      scoreB: 1,
      status: 'Live - 2nd Half',
      timeRemaining: '78:45',
      venue: 'Rio Tinto Arena Complex',
      highlights: [
        'Stunning curler into top-right corner from 25 yards out',
        'Yellow card issued for tactical foul near midfield',
        'Great finger-tip save by Salt Lake goalkeeper'
      ],
      stats: [
        { label: 'Shots on Goal', valA: 8, valB: 5 },
        { label: 'Possession %', valA: 54, valB: 46 },
        { label: 'Fouls Committed', valA: 11, valB: 14 },
        { label: 'Corner Kicks', valA: 6, valB: 3 }
      ]
    },
    // BASKETBALL
    {
      id: 'm_basketball_1',
      sport: 'Basketball',
      teamA: 'Apex Prep Academy',
      teamB: 'Oakland Hoop Syndicate',
      scoreA: 96,
      scoreB: 92,
      status: 'Live - Q4',
      timeRemaining: '02:15',
      venue: 'Apex National Dome',
      highlights: [
        'Marcus Carter intercepts ball and executes fast break layup',
        'Stepback three pointer hit by Oakland point guard',
        'Shot clock violation avoided by tight perimeter defense'
      ],
      stats: [
        { label: 'Field Goal %', valA: '48.5%', valB: '45.2%' },
        { label: '3PT Shots Made', valA: 12, valB: 10 },
        { label: 'Total Rebounds', valA: 38, valB: 41 },
        { label: 'Turnovers', valA: 9, valB: 14 }
      ]
    },
    {
      id: 'm_basketball_2',
      sport: 'Basketball',
      teamA: 'LA Prospects',
      teamB: 'Seattle Future Stars',
      scoreA: 78,
      scoreB: 84,
      status: 'Live - Q3',
      timeRemaining: '06:50',
      venue: 'Staples Center Annex',
      highlights: [
        'Posterizing transition dunk by Seattle power forward',
        'Blocking foul called under the basket',
        'Timeout called by LA Prospects head coach'
      ],
      stats: [
        { label: 'Field Goal %', valA: '41.2%', valB: '49.1%' },
        { label: '3PT Shots Made', valA: 7, valB: 9 },
        { label: 'Total Rebounds', valA: 31, valB: 35 },
        { label: 'Turnovers', valA: 12, valB: 10 }
      ]
    },
    // TRACK & FIELD (Exhibition Live Heat)
    {
      id: 'm_track_1',
      sport: 'Track & Field',
      teamA: 'Heat 3: Austin Sprinters',
      teamB: 'State Selection Sprinters',
      scoreA: 1, // Lane placement
      scoreB: 2,
      status: 'Live - Warmup / Marshalling',
      timeRemaining: 'Heats Starting',
      venue: 'Texas Athletic Dome',
      highlights: [
        'Athletes currently adjusting starting blocks on Lane 4 and 5',
        'Elena Rostov matches top reaction times in warmup simulations',
        'Wind assistance recorded at 1.2 m/s headwind'
      ],
      stats: [
        { label: 'Average Reaction Time', valA: '0.128s', valB: '0.135s' },
        { label: 'Top Practice Speeds', valA: '24.1mph', valB: '23.8mph' },
        { label: 'Pre-seed ranking', valA: '1st', valB: '3rd' },
        { label: 'Wind assistance', valA: '+1.2m/s', valB: '+1.2m/s' }
      ]
    }
  ]);

  // Sync selected sport when userSport changes
  useEffect(() => {
    setSelectedSport(userSport);
  }, [userSport]);

  // Filter matches matching selected sport
  const filteredMatches = matches.filter(
    (m) => m.sport.toLowerCase().includes(selectedSport.toLowerCase()) || 
           (selectedSport.toLowerCase() === 'track & field' && m.sport.toLowerCase() === 'track & field')
  );

  // If no exact matches, default to first available
  const displayMatches = filteredMatches.length > 0 ? filteredMatches : matches.filter(m => m.sport === 'Basketball');

  // Simulate Score Progression & Action Ticker
  const handleSimulateUpdate = () => {
    setIsRefreshing(true);
    setTickerMessage('Synthesizing radar satellite tracking data for live matches...');
    
    setTimeout(() => {
      setMatches((prev) =>
        prev.map((m) => {
          // Only increment live scores for non-warmup games
          if (m.status.includes('Live') && !m.status.includes('Warmup')) {
            const incrementA = Math.floor(Math.random() * (m.sport === 'Basketball' ? 5 : m.sport === 'Cricket' ? 8 : m.sport === 'Soccer' ? 1 : 3));
            const incrementB = Math.floor(Math.random() * (m.sport === 'Basketball' ? 5 : m.sport === 'Cricket' ? 6 : m.sport === 'Soccer' ? 1 : 2));
            
            // Randomly update highlights with exciting alerts
            const extraHighlights = [...m.highlights];
            if (Math.random() > 0.4) {
              if (m.sport === 'Basketball') {
                extraHighlights.unshift(`Momentum shift! Quick counter-play results in score at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}`);
              } else if (m.sport === 'Cricket') {
                extraHighlights.unshift(`Spectacular boundary hit raises the tension level!`);
              } else if (m.sport === 'Kabaddi') {
                extraHighlights.unshift(`All-out danger! Match tempo increases rapidly.`);
              } else {
                extraHighlights.unshift(`Unbelievable defensive block maintains the tight score differential.`);
              }
              if (extraHighlights.length > 4) extraHighlights.pop();
            }

            return {
              ...m,
              scoreA: m.scoreA + incrementA,
              scoreB: m.scoreB + incrementB,
              highlights: extraHighlights
            };
          }
          return m;
        })
      );
      setIsRefreshing(false);
      setTickerMessage('Scores successfully verified by SportsOS decentralized referee engine!');
    }, 1200);
  };

  // Helper to determine active button class depending on style mode
  const getButtonClass = (variant: 'primary' | 'secondary' = 'primary') => {
    if (buttonStyle === 'chameleon') {
      return `transition-all duration-300 ease-in-out cursor-pointer text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl border border-red-200 bg-[#FEF2F2] text-[#DC2626] hover:bg-[#ECFDF5] hover:border-[#A7F3D0] hover:text-[#059669] flex items-center justify-center gap-2`;
    }
    
    if (buttonStyle === 'elastic') {
      return `transition-all duration-200 cursor-pointer text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl text-white bg-[#1C77FF] hover:bg-blue-600 active:scale-92 hover:scale-105 shadow-md flex items-center justify-center gap-2`;
    }
    
    return `text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl text-white bg-[#0B132B] hover:bg-[#1C77FF] transition-colors flex items-center justify-center gap-2 cursor-pointer`;
  };

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left relative overflow-hidden" id="live_matches_arena">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-rose-500 animate-pulse" />
            <span className="font-mono text-xs uppercase font-extrabold text-rose-500 tracking-widest">
              Live Arena Telemetry
            </span>
          </div>
          <h3 className="font-sans text-base font-extrabold text-[#0B132B] tracking-tight mt-1">
            Registered Sport Match Tracker
          </h3>
          <p className="text-slate-400 text-[11px] font-medium">
            Currently tracking real-time events for your declared skill division: <span className="text-[#1C77FF] font-bold">{selectedSport}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSimulateUpdate}
            disabled={isRefreshing}
            className={getButtonClass('primary')}
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Refresh Telemetry'}
          </button>
        </div>
      </div>

      {/* Sport Selector Pills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {['Basketball', 'Soccer', 'Kabaddi', 'Cricket', 'Track & Field'].map((sp) => (
          <button
            key={sp}
            onClick={() => setSelectedSport(sp)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              selectedSport.toLowerCase() === sp.toLowerCase()
                ? 'bg-[#1C77FF] text-white'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#0B132B]'
            }`}
          >
            {sp === userSport ? `★ ${sp} (Registered)` : sp}
          </button>
        ))}
      </div>

      {/* Match Stream Area */}
      <div className="space-y-4">
        {displayMatches.map((match) => (
          <div 
            key={match.id}
            className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all text-left"
          >
            {/* Match Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] uppercase font-black tracking-widest bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">
                {match.venue}
              </span>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-mono text-[10px] font-extrabold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                  {match.status}
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {match.timeRemaining}
                </span>
              </div>
            </div>

            {/* Scoreboard Board Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Teams & Score */}
              <div className="md:col-span-6 flex items-center justify-around bg-white border border-slate-100 p-3 rounded-xl shadow-inner text-center">
                <div className="w-24">
                  <p className="font-sans text-xs font-black text-[#0B132B] truncate">{match.teamA}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Team A</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl font-black text-[#0B132B] font-mono tracking-tight">{match.scoreA}</span>
                  <span className="text-xs font-bold text-slate-300 font-mono">-</span>
                  <span className="text-xl sm:text-2xl font-black text-[#0B132B] font-mono tracking-tight">{match.scoreB}</span>
                </div>

                <div className="w-24">
                  <p className="font-sans text-xs font-black text-[#0B132B] truncate">{match.teamB}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Team B</p>
                </div>
              </div>

              {/* Match Stats Progress */}
              <div className="md:col-span-6 bg-white border border-slate-100 p-3.5 rounded-xl text-left space-y-2">
                <p className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-widest border-b border-slate-50 pb-1 flex items-center gap-1">
                  <Activity className="h-3 w-3 text-[#1C77FF]" /> Performance Metrics
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xxs font-sans text-slate-600 font-semibold">
                  {match.stats.map((st, sidx) => (
                    <div key={sidx} className="flex justify-between items-center bg-slate-50 px-2 py-1.5 rounded-lg">
                      <span className="text-slate-400 truncate max-w-[65px]">{st.label}</span>
                      <span className="font-mono font-black text-[#0B132B]">
                        {st.valA} <span className="text-slate-300 font-normal">/</span> {st.valB}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Highlights Feed */}
            <div className="mt-4 bg-slate-900/[0.03] border border-slate-100 p-3 rounded-xl">
              <p className="text-[9px] uppercase font-extrabold text-slate-400 font-mono tracking-wider mb-2 flex items-center gap-1">
                <Flame className="h-3 w-3 text-amber-500 animate-pulse" /> Live Event Highlights Sequence
              </p>
              <ul className="space-y-1.5">
                {match.highlights.map((highlight, hidx) => (
                  <li key={hidx} className="flex items-start gap-2 text-xxs font-sans font-medium text-slate-600">
                    <span className="text-blue-500 mt-0.5 shrink-0">◈</span>
                    <span className="text-left leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

      {/* Action Ticker Footer */}
      <div className="mt-4 bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex items-center gap-2">
        <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse shrink-0" />
        <span className="text-[10px] text-slate-500 font-sans font-bold select-none italic truncate">
          {tickerMessage}
        </span>
      </div>
    </div>
  );
}
