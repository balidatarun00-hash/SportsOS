/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Plus, MapPin, Award, Calendar, PenTool, UserCheck, ShieldAlert, Sparkles, X, Check, Activity, TrendingUp, Trophy, Play, RefreshCw, BarChart2, Users, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Athlete, Achievement, CareerTimelineEntry, Registration, Tournament, SkillRating, SkillHistoryEntry } from '../types';

export const DEFAULT_SKILLS_BY_SPORT: Record<string, SkillRating[]> = {
  'Basketball': [
    { name: 'Shooting Accuracy', rating: 90, type: 'sport-specific' },
    { name: 'Ball Dribbling', rating: 88, type: 'sport-specific' },
    { name: 'Passing IQ', rating: 85, type: 'sport-specific' },
    { name: 'Perimeter Defense', rating: 82, type: 'sport-specific' },
    { name: 'Speed & Agility', rating: 92, type: 'common' },
    { name: 'Stamina & Endurance', rating: 87, type: 'common' },
    { name: 'Teamwork & Chemistry', rating: 91, type: 'common' },
    { name: 'Discipline & Focus', rating: 94, type: 'common' }
  ],
  'Track & Field': [
    { name: 'Block Reaction Speed', rating: 94, type: 'sport-specific' },
    { name: 'Stride Efficiency', rating: 88, type: 'sport-specific' },
    { name: 'Lactate Threshold', rating: 91, type: 'sport-specific' },
    { name: 'Tactical Pacing', rating: 85, type: 'sport-specific' },
    { name: 'Speed & Agility', rating: 96, type: 'common' },
    { name: 'Stamina & Endurance', rating: 89, type: 'common' },
    { name: 'Teamwork & Chemistry', rating: 75, type: 'common' },
    { name: 'Discipline & Focus', rating: 95, type: 'common' }
  ],
  'Soccer': [
    { name: 'Progressive Passing', rating: 91, type: 'sport-specific' },
    { name: 'Ball Dribbling', rating: 82, type: 'sport-specific' },
    { name: 'Through Balls', rating: 85, type: 'sport-specific' },
    { name: 'Spatial Awareness', rating: 89, type: 'sport-specific' },
    { name: 'Speed & Agility', rating: 81, type: 'common' },
    { name: 'Stamina & Endurance', rating: 92, type: 'common' },
    { name: 'Teamwork & Chemistry', rating: 94, type: 'common' },
    { name: 'Discipline & Focus', rating: 90, type: 'common' }
  ],
  'Tennis': [
    { name: 'Serve Power', rating: 88, type: 'sport-specific' },
    { name: 'Top-spin Forehand', rating: 90, type: 'sport-specific' },
    { name: 'Backhand Slice', rating: 84, type: 'sport-specific' },
    { name: 'Court Coverage', rating: 87, type: 'sport-specific' },
    { name: 'Speed & Agility', rating: 89, type: 'common' },
    { name: 'Stamina & Endurance', rating: 88, type: 'common' },
    { name: 'Teamwork & Chemistry', rating: 72, type: 'common' },
    { name: 'Discipline & Focus', rating: 91, type: 'common' }
  ],
  'Cricket': [
    { name: 'Batting Power', rating: 84, type: 'sport-specific' },
    { name: 'Bowling Speed/Spin', rating: 78, type: 'sport-specific' },
    { name: 'Fielding Reflexes', rating: 82, type: 'sport-specific' },
    { name: 'Wicketkeeping Stance', rating: 75, type: 'sport-specific' },
    { name: 'Speed & Agility', rating: 80, type: 'common' },
    { name: 'Stamina & Endurance', rating: 83, type: 'common' },
    { name: 'Teamwork & Chemistry', rating: 88, type: 'common' },
    { name: 'Discipline & Focus', rating: 87, type: 'common' }
  ],
  'Kabaddi': [
    { name: 'Raid Speed & Agility', rating: 85, type: 'sport-specific' },
    { name: 'Ankle/Knee Lock Grip', rating: 81, type: 'sport-specific' },
    { name: 'Escape/Struggle Lunges', rating: 83, type: 'sport-specific' },
    { name: 'Defensive Corner Hold', rating: 80, type: 'sport-specific' },
    { name: 'Speed & Agility', rating: 86, type: 'common' },
    { name: 'Stamina & Endurance', rating: 89, type: 'common' },
    { name: 'Teamwork & Chemistry', rating: 85, type: 'common' },
    { name: 'Discipline & Focus', rating: 88, type: 'common' }
  ]
};

export const getOverallRating = (skills: SkillRating[]) => {
  if (!skills || skills.length === 0) return 85;
  const sum = skills.reduce((acc, curr) => acc + curr.rating, 0);
  return Math.round(sum / skills.length);
};

interface ProfilePanelProps {
  athlete: Athlete;
  onUpdateFullProfile: (updatedProfile: Athlete) => void;
  isOwnProfile: boolean;
  registrations?: Registration[];
  tournaments?: Tournament[];
}

export default function ProfilePanel({ athlete, onUpdateFullProfile, isOwnProfile, registrations = [], tournaments = [] }: ProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [hallSlideIndex, setHallSlideIndex] = useState(0);

  const displaySkills = athlete.individualSkills && athlete.individualSkills.length > 0
    ? athlete.individualSkills
    : (DEFAULT_SKILLS_BY_SPORT[athlete.sport] || DEFAULT_SKILLS_BY_SPORT['Basketball']);

  const overallRating = getOverallRating(displaySkills);

  // ================= SIMULATOR & LEDGER STATES =================
  const [selectedFieldSkill, setSelectedFieldSkill] = useState<string | null>(null);

  // Evaluation recording form states
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [evalType, setEvalType] = useState<'Trial' | 'Practice' | 'Tournament'>('Practice');
  const [evalEventName, setEvalEventName] = useState('');
  const [evalComments, setEvalComments] = useState('');
  const [evalSelectedSkill, setEvalSelectedSkill] = useState('');
  const [evalRatingChange, setEvalRatingChange] = useState<number>(3);
  const [successMessage, setSuccessMessage] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'All' | 'Trial' | 'Practice' | 'Tournament'>('All');

  // Slider adjustments states for instant simulation
  const [localSkills, setLocalSkills] = useState<SkillRating[]>([]);

  // Synchronize local skills whenever the athlete prop changes
  useEffect(() => {
    const currentSkills = athlete.individualSkills && athlete.individualSkills.length > 0
      ? athlete.individualSkills
      : (DEFAULT_SKILLS_BY_SPORT[athlete.sport] || DEFAULT_SKILLS_BY_SPORT['Basketball']);
    setLocalSkills(JSON.parse(JSON.stringify(currentSkills)));
  }, [athlete]);

  // Handle saving interactive slider tweaks
  const handleSaveSliderRatings = () => {
    onUpdateFullProfile({
      ...athlete,
      individualSkills: localSkills
    });
    setSuccessMessage('Simulator sliders locked to athlete passport successfully!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };



  const handleRecordEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalEventName.trim() || !evalComments.trim() || !evalSelectedSkill) return;

    // Clone and adjust active skill rating
    const skillToUpdate = localSkills.find(s => s.name === evalSelectedSkill);
    if (!skillToUpdate) return;

    const oldVal = skillToUpdate.rating;
    const newVal = Math.min(100, Math.max(0, oldVal + evalRatingChange));
    
    // Create new list of skills
    const updatedSkillsList = localSkills.map(s => {
      if (s.name === evalSelectedSkill) {
        return { ...s, rating: newVal };
      }
      return s;
    });

    // Create history entry
    const newHistoryEntry: SkillHistoryEntry = {
      id: `sh_user_${Date.now()}`,
      type: evalType,
      eventName: evalEventName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      skillsUpdated: [
        { name: evalSelectedSkill, change: evalRatingChange, newVal }
      ],
      comments: evalComments,
      overallRatingAfter: getOverallRating(updatedSkillsList)
    };

    const currentHistory = athlete.skillHistory || [];
    const updatedHistoryList = [newHistoryEntry, ...currentHistory];

    onUpdateFullProfile({
      ...athlete,
      individualSkills: updatedSkillsList,
      skillHistory: updatedHistoryList
    });

    setEvalEventName('');
    setEvalComments('');
    setIsAddingRecord(false);
    setSuccessMessage(`✓ Successfully committed verified ${evalType} evaluation record to ledger!`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const getSportImage = (sportName: string) => {
    const s = (sportName || 'Basketball').toLowerCase();
    if (s.includes('kabaddi')) return 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600&auto=format&fit=crop&q=80';
    if (s.includes('cricket')) return 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80';
    if (s.includes('soccer') || s.includes('football')) return 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80';
    if (s.includes('tennis')) return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop&q=80';
    if (s.includes('track')) return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80'; // Basketball / default
  };

  // Dynamic Sport-Specific Performance Profile
  const getSportPerformanceData = (sportName: string) => {
    const s = (sportName || 'Basketball').toLowerCase();
    if (s.includes('kabaddi')) {
      return {
        overallPercentage: 78,
        totalPercentage: 78,
        totalPoints: "1,140 Pts",
        pointsLabel: "Total Tackle/Raid Points",
        recentStatus: "Resting / Team Scrimmage Done (Tactical hold practice)",
        recentLabel: "Recent Activity Status",
        recentOpponent: "Match V4: Saffron Gladiators",
        bestRecords: [
          { title: "Champion Raider Streak", record: "12 Unbroken Raid Points", date: "May 2026", stat: "96% success" },
          { title: "Defensive Corner Hold", record: "6 Super Tackles in Single Match", date: "April 2026", stat: "100% hold-ratio" },
          { title: "Ankle Lock Mastery", record: "0.4s Reflex Response Time", date: "Jan 2026", stat: "92% precision" },
        ],
        pastPresentList: [
          { season: "Sponsor's League 2026", role: "Right-Corner Defender", points: "340 Points", percentage: "84%", status: "Active / Present" },
          { season: "National Youth Cup 2026", role: "Primary Raider", points: "120 Points", percentage: "86%", status: "Active / Present" },
          { season: "Pro Kabaddi Youth Cup 2025", role: "Primary Raider", points: "510 Points", percentage: "89%", status: "Completed / Past" },
          { season: "State Selection Trials 2025", role: "Left-In Cover", points: "150 Points", percentage: "80%", status: "Completed / Past" },
          { season: "Federation Cup Junior 2025", role: "All-Rounder", points: "220 Points", percentage: "83%", status: "Completed / Past" },
          { season: "All-India Inter-University 2024", role: "Raid Leader", points: "410 Points", percentage: "87%", status: "Completed / Past" },
          { season: "State Grassroots Trials 2024", role: "All-Rounder", points: "290 Points", percentage: "72%", status: "Completed / Past" },
          { season: "National School Games 2023", role: "Defender / Corner", points: "180 Points", percentage: "79%", status: "Completed / Past" },
          { season: "District Kabaddi League 2023", role: "Backup Raider", points: "140 Points", percentage: "75%", status: "Completed / Past" },
          { season: "Rural Grassroots Tour 2022", role: "Junior Raider", points: "95 Points", percentage: "68%", status: "Completed / Past" }
        ]
      };
    } else if (s.includes('cricket')) {
      return {
        overallPercentage: 85,
        totalPercentage: 85,
        totalPoints: "2,410 Runs",
        pointsLabel: "Total Career Runs Scored",
        recentStatus: "Nets Practice (Faced 80mph fast bowling simulation)",
        recentLabel: "Recent Training Routine",
        recentOpponent: "Friendly: Royal Colts",
        bestRecords: [
          { title: "Highest Individual score", record: "134* Runs (58 balls)", date: "May 2026", stat: "100% batting rate" },
          { title: "Fast-scoring streak", record: "6 Fours of Consecutive Deliveries", date: "March 2026", stat: "154.5 S/R" },
          { title: "Wicketkeeping precision", record: "4 Flash Stumpings, 0 Byes", date: "Feb 2026", stat: "98% reaction" },
        ],
        pastPresentList: [
          { season: "Mumbai Grassroots Colts 2026", role: "Opening Batter & Captain", points: "810 Runs", percentage: "91%", status: "Active / Present" },
          { season: "All-India Academy Cup 2026", role: "Opening Batsman", points: "420 Runs", percentage: "88%", status: "Active / Present" },
          { season: "West Zone Under-19 2025", role: "Middle-Order Batsman", points: "1,200 Runs", percentage: "86%", status: "Completed / Past" },
          { season: "State Junior Trophy 2025", role: "All-Rounder", points: "650 Runs, 15 Wkts", percentage: "89%", status: "Completed / Past" },
          { season: "District Colts League 2024", role: "Wicketkeeper / Bat", points: "400 Runs", percentage: "78%", status: "Completed / Past" },
          { season: "Under-16 Inter-School Cup 2024", role: "Captain / Off-Spinner", points: "540 Runs, 22 Wkts", percentage: "85%", status: "Completed / Past" },
          { season: "Challenger Series Under-16 2023", role: "Middle-Order Batsman", points: "310 Runs", percentage: "81%", status: "Completed / Past" },
          { season: "Mayor's Cup Cricket 2023", role: "All-Rounder", points: "280 Runs, 8 Wkts", percentage: "75%", status: "Completed / Past" },
          { season: "Inter-District Under-14 2022", role: "Top-Order Batter", points: "390 Runs", percentage: "79%", status: "Completed / Past" },
          { season: "Grassroots Academy League 2021", role: "Bowler / Lower Order", points: "120 Runs, 12 Wkts", percentage: "70%", status: "Completed / Past" }
        ]
      };
    } else if (s.includes('soccer') || s.includes('football')) {
      return {
        overallPercentage: 82,
        totalPercentage: 82,
        totalPoints: "42 Goals/Assists",
        pointsLabel: "Combined Attack Impact Points",
        recentStatus: "Completed turf scrimmages with 90% pass completions",
        recentLabel: "Recent Scrimmage Status",
        recentOpponent: "League V2: Strikers United FC",
        bestRecords: [
          { title: "Fastest Hat-trick scored", record: "3 Goals in 12 Mins", date: "June 2026", stat: "100% conversion" },
          { title: "Defensive Counter-drive", record: "16 Ball Interceptions in Midfield", date: "April 2026", stat: "88% dual-success" },
          { title: "Free Kick Mastery", record: "Curve Distance Angle Goal (28 Yards)", date: "Jan 2026", stat: "95% execution" },
        ],
        pastPresentList: [
          { season: "Collegiate Metro Cup 2026", role: "Playmaker Midfielder", points: "18 Assists", percentage: "84%", status: "Active / Present" },
          { season: "National Youth League 2026", role: "Central Attacking Mid", points: "8 Goals, 12 Assists", percentage: "87%", status: "Active / Present" },
          { season: "Youth Grassroots Trophy 2025", role: "Attacking Winger", points: "16 Goals", percentage: "88%", status: "Completed / Past" },
          { season: "Regional Academy Showcase 2025", role: "Playmaker", points: "4 Goals, 10 Assists", percentage: "82%", status: "Completed / Past" },
          { season: "District Academy Scrims 2024", role: "Sub Midfielder", points: "8 Assists", percentage: "74%", status: "Completed / Past" },
          { season: "State Junior Tournament 2024", role: "Winger", points: "11 Goals, 5 Assists", percentage: "81%", status: "Completed / Past" },
          { season: "High School Premier Cup 2023", role: "Forward", points: "14 Goals, 3 Assists", percentage: "83%", status: "Completed / Past" },
          { season: "All-Star Youth Invitation 2023", role: "Left Winger", points: "6 Goals, 4 Assists", percentage: "79%", status: "Completed / Past" },
          { season: "Inter-City Under-15 Cup 2022", role: "Striker", points: "12 Goals", percentage: "76%", status: "Completed / Past" },
          { season: "Grassroots Foundation League 2021", role: "Midfielder", points: "3 Goals, 5 Assists", percentage: "70%", status: "Completed / Past" }
        ]
      };
    } else {
      // Basketball / Other default
      return {
        overallPercentage: 88,
        totalPercentage: 88,
        totalPoints: "1,820 Points",
        pointsLabel: "Total Court Field Points",
        recentStatus: "Shooting drills (Practice field - completed 100 three-pointers)",
        recentLabel: "Recent Active Telemetry",
        recentOpponent: "Scrimmage: Redwood Hoop",
        bestRecords: [
          { title: "Career Field Points Peak", record: "42 Points in Single Match", date: "June 2026", stat: "92% field consistency" },
          { title: "Steal Matrix Records", record: "9 Defensive Steals in Gold Bracket", date: "May 2026", stat: "100% recovery" },
          { title: "Double-Double Streak", record: "14 Consecutive Matches Dual Double", date: "Mar 2026", stat: "88% efficiency" },
        ],
        pastPresentList: [
          { season: "Oakland Warriors Cup 2026", role: "Starting Point Guard", points: "620 Points", percentage: "89%", status: "Active / Present" },
          { season: "West Coast AAU Showcase 2026", role: "Lead Ballhandler", points: "320 Points, 140 Ast", percentage: "91%", status: "Active / Present" },
          { season: "Junior High State Bracket 2025", role: "Primary Guard", points: "850 Points", percentage: "92%", status: "Completed / Past" },
          { season: "Summer Varsity Showcase 2025", role: "Shooting Guard", points: "440 Points", percentage: "86%", status: "Completed / Past" },
          { season: "District Grassroots 2024", role: "Backup PG", points: "350 Points", percentage: "81%", status: "Completed / Past" },
          { season: "State Junior Finals 2024", role: "Point Guard", points: "480 Points", percentage: "84%", status: "Completed / Past" },
          { season: "Under-15 Developmental Cup 2023", role: "Combo Guard", points: "390 Points", percentage: "79%", status: "Completed / Past" },
          { season: "Metro Youth Invitational 2023", role: "Guard", points: "290 Points", percentage: "77%", status: "Completed / Past" },
          { season: "Regional School Showcase 2022", role: "Backup Guard", points: "180 Points", percentage: "73%", status: "Completed / Past" },
          { season: "Grassroots Rookies League 2021", role: "Junior Guard", points: "110 Points", percentage: "69%", status: "Completed / Past" }
        ]
      };
    }
  };

  const perfData = getSportPerformanceData(athlete.sport);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHallSlideIndex((prev) => (prev + 1) % Math.min(3, perfData.bestRecords.length));
    }, 4000);
    return () => window.clearInterval(interval);
  }, [perfData.bestRecords.length]);

  const hallSlides = perfData.bestRecords.slice(0, 3).map((rec, index) => ({
    ...rec,
    index,
  }));
  
  // Profile Editor Form State
  const [editName, setEditName] = useState(athlete.name);
  const [editSport, setEditSport] = useState(athlete.sport);
  const [editPos, setEditPos] = useState(athlete.position);
  const [editLoc, setEditLoc] = useState(athlete.location);
  const [editHeight, setEditHeight] = useState(athlete.height || '');
  const [editWeight, setEditWeight] = useState(athlete.weight || '');
  const [editBio, setEditBio] = useState(athlete.bio);
  const [editCollege, setEditCollege] = useState(athlete.college || '');
  const [editGrad, setEditGrad] = useState(athlete.graduatingYear || '');
  
  const [newSkillText, setNewSkillText] = useState('');
  const [tempSkills, setTempSkills] = useState<string[]>(athlete.skills);

  // Handle Save edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFullProfile({
      ...athlete,
      name: editName,
      sport: editSport,
      position: editPos,
      location: editLoc,
      height: editHeight,
      weight: editWeight,
      bio: editBio,
      college: editCollege,
      graduatingYear: editGrad,
      skills: tempSkills,
    });
    setIsEditing(false);
  };

  // Add skill tag
  const handleAddSkillTag = () => {
    if (!newSkillText.trim()) return;
    if (!tempSkills.includes(newSkillText.trim())) {
      setTempSkills([...tempSkills, newSkillText.trim()]);
    }
    setNewSkillText('');
  };

  // Remove skill tag
  const handleRemoveSkillTag = (tag: string) => {
    setTempSkills(tempSkills.filter(t => t !== tag));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 profile-panel-id-1" id="athlete_portfolio_view">
      
      {/* Cover Image & Primary Profile Header */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/60 bg-white shadow-md text-left mb-8">
        
        {/* Cover Background */}
        <div className="h-44 sm:h-56 bg-slate-900 relative">
          {athlete.coverImage ? (
            <img
              referrerPolicy="no-referrer"
              src={athlete.coverImage}
              alt="Athletic cover banner"
              className="w-full h-full object-cover opacity-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#0B132B] to-[#1C77FF]"></div>
          )}
          
          <div className="absolute top-4 right-4 flex gap-2">
            {isOwnProfile ? (
              <button
                onClick={() => {
                  setTempSkills(athlete.skills);
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/95 text-[#0B132B] hover:text-[#1C77FF] hover:bg-white px-4 py-2 text-xs font-bold transition-all shadow-md cursor-pointer uppercase tracking-wider"
                id="btn_open_portfolio_editor"
              >
                <PenTool className="h-4 w-4" />
                Customize Portfolio
              </button>
            ) : (
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-md cursor-pointer uppercase tracking-wider ${
                  isFollowing
                    ? 'bg-[#10B981] text-white'
                    : 'bg-white/95 text-[#0B132B] hover:bg-white'
                }`}
              >
                <UserCheck className="h-4 w-4" />
                {isFollowing ? 'Following Athlete ✓' : 'Scout / Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Primary Row info structure */}
        <div className="px-6 pb-6 pt-1 sm:pt-0 flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-16 sm:-mt-20 relative z-10">
          
          {/* Large dynamic avatar */}
          <div className="relative shrink-0">
            <img
              src={athlete.avatar}
              alt={athlete.name}
              className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover border-4 border-white shadow-xl bg-white"
              id="portfolio_avatar"
            />
            {athlete.verified && (
              <span
                className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#1C77FF] text-white border-2 border-white"
                title="Verified Recruit Profile"
              >
                <ShieldCheck className="h-4.5 w-4.5 stroke-[2.5]" />
              </span>
            )}
          </div>

          {/* Title and stats summary */}
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans text-2xl sm:text-3xl font-black text-[#0B132B] tracking-tight leading-none" id="portfolio_athlete_name">
                  {athlete.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {athlete.userRole === 'viewer' ? (
                  <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider">
                    Spectator / Scout Mode
                  </span>
                ) : (
                  <>
                    <span className="text-[10px] bg-blue-50 border border-blue-200 text-[#1C77FF] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider">
                      Active Competitor
                    </span>
                    {athlete.category && (
                      <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider capitalize">
                        Bracket: {athlete.category.replace('-', ' ')}
                      </span>
                    )}
                  </>
                )}
              </div>

              <p className="font-sans text-sm font-semibold text-[#1C77FF] mt-2">
                {athlete.userRole === 'viewer' ? 'Corporate Partner • Scouting View' : `${athlete.sport} • ${athlete.position}`}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-slate-400 capitalize">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {athlete.location}
                </span>
                {athlete.college && (
                  <span>🏫 {athlete.college} (Class of {athlete.graduatingYear})</span>
                )}
              </div>
            </div>

            {/* Micro social tracker counts */}
            <div className="flex items-center gap-4 border border-slate-100 bg-slate-50/50 p-2.5 rounded-xl text-xs font-mono font-bold text-slate-500">
              <div className="text-center">
                <span className="text-[#0B132B] font-extrabold block text-sm">{athlete.followersCount + (isFollowing ? 1 : 0)}</span>
                Followers
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-center">
                <span className="text-[#0B132B] font-extrabold block text-sm">{athlete.followingCount}</span>
                Scouts Scanning
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Main Grid Content Panels */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
        
        {/* Left column info panels (4 out of 12) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Athlete Bio */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left">
            <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280]">
              Scouting Bio Statement
            </span>
            <p className="font-sans text-xs text-slate-600 leading-relaxed mt-3" id="portfolio_athlete_bio">
              {athlete.bio}
            </p>
          </div>

          {/* Physical Dimensions Panel */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left">
            <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280] block mb-3">
              Certified Athlete Spec Sheet
            </span>

            <div className="grid grid-cols-2 gap-3.5 text-left font-sans">
              
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Height</span>
                <p className="font-black text-[#0B132B] text-sm mt-0.5">{athlete.height || 'N/A'}</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Weight</span>
                <p className="font-black text-[#0B132B] text-sm mt-0.5">{athlete.weight || 'N/A'}</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl col-span-2">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Academic Graduation Target</span>
                <p className="font-black text-[#0B132B] text-xs mt-0.5">{athlete.college || 'Highschool Preparatory'} • {athlete.graduatingYear}</p>
              </div>

            </div>
          </div>

          {/* Skill Tag table record format */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100">
              <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280]">
                Athletic Competency Records
              </span>
              <span className="text-[10px] font-mono text-slate-400">Total: {displaySkills.length} Parameters</span>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-slate-150">
              <table className="w-full text-left border-collapse" id="athlete_competency_records">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 font-mono border-b border-slate-150">
                    <th className="p-3">Skill Parameter</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Inspection Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-700">
                  {displaySkills.map((skill, index) => {
                    const status = skill.rating >= 90 ? "Elite Approved" : skill.rating >= 80 ? "Scouted Match-Ready" : "Certified Active";
                    const isSportSpecific = skill.type === 'sport-specific';
                    return (
                      <tr 
                        key={index} 
                        className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${selectedFieldSkill === skill.name ? 'bg-violet-50/80 border-l-2 border-violet-500' : ''}`}
                        onClick={() => setSelectedFieldSkill(skill.name === selectedFieldSkill ? null : skill.name)}
                      >
                        <td className="p-3 font-extrabold text-[#0B132B]">
                          ⚡ {skill.name}
                        </td>
                        <td className="p-3 text-slate-500 font-sans font-semibold capitalize">
                          {isSportSpecific ? 'Sport-Specific' : 'Common Skill'}
                        </td>
                        <td className="p-3 font-mono font-black text-blue-600">
                          {skill.rating}%
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            skill.rating >= 90 ? 'text-violet-600 bg-violet-50 border-violet-100' :
                            skill.rating >= 80 ? 'text-blue-600 bg-blue-50 border-blue-100' :
                            'text-emerald-600 bg-emerald-50 border-emerald-100'
                          }`}>
                            ✓ {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right column info panels (8 out of 12) */}
        <div className="md:col-span-8 space-y-6">



          {/* Skill Matrix Adjuster & Grade Calculator */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280]">
                  Granular Skill Adjustments Matrix
                </span>
                <h3 className="font-sans text-base font-black text-[#0B132B] mt-1">
                  Verified Performance Sliders
                </h3>
              </div>

              {/* Dynamic overall percentage gauge */}
              <div className="text-right flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl">
                <BarChart2 className="h-4 w-4 text-violet-500" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold leading-none uppercase">Unified Grade</span>
                  <span className="font-mono text-sm font-black text-[#0B132B]">{overallRating}%</span>
                </div>
              </div>
            </div>

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-bounce">
                <Check className="h-4 w-4 text-emerald-500" />
                {successMessage}
              </div>
            )}

            <p className="text-[11px] text-slate-500 mb-4 font-sans font-medium">
              Coaches can simulate performance shifts directly. Drag the sliders to re-calculate athletic capabilities in real-time. Lock modifications to register them permanently to the athlete's card.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localSkills.map((skill, index) => (
                <div key={skill.name} className="space-y-1.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <span className="text-violet-500">⚡</span>
                      {skill.name}
                    </span>
                    <span className="font-mono text-blue-600 font-extrabold">{skill.rating}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={skill.rating}
                    onChange={(e) => {
                      const updated = [...localSkills];
                      updated[index] = { ...skill, rating: parseInt(e.target.value) };
                      setLocalSkills(updated);
                    }}
                    className="w-full accent-violet-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold">
                    <span>Novice</span>
                    <span className="capitalize text-slate-500">{skill.type === 'sport-specific' ? 'Sport-Specific' : 'Common Spec'}</span>
                    <span>Elite Master</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-5">
              <button
                onClick={() => {
                  const resetSkills = athlete.individualSkills && athlete.individualSkills.length > 0
                    ? athlete.individualSkills
                    : (DEFAULT_SKILLS_BY_SPORT[athlete.sport] || DEFAULT_SKILLS_BY_SPORT['Basketball']);
                  setLocalSkills(JSON.parse(JSON.stringify(resetSkills)));
                }}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-bold uppercase rounded-xl transition-all cursor-pointer"
              >
                Reset Sliders
              </button>
              <button
                onClick={handleSaveSliderRatings}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer inline-flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                Commit Tweak Matrix
              </button>
            </div>
          </div>

          {/* Verified Ledger of Continuous Progress Events */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Continuous Evaluation Ledger
                </span>
                <h3 className="font-sans text-base font-black text-[#0B132B] mt-1">
                  Trials, Practices & Tournaments Tracker
                </h3>
              </div>

              {/* Add record button */}
              <button
                onClick={() => setIsAddingRecord(!isAddingRecord)}
                className="px-3.5 py-1.5 bg-[#0B132B] hover:bg-violet-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer inline-flex items-center gap-1"
              >
                {isAddingRecord ? (
                  <>
                    <X className="h-3.5 w-3.5" /> Close Form
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Log Evaluation
                  </>
                )}
              </button>
            </div>

            {/* Expanding Coach Form */}
            <AnimatePresence>
              {isAddingRecord && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleRecordEvaluationSubmit}
                  className="mb-5 p-4 border border-slate-150 bg-slate-50/50 rounded-xl space-y-4 overflow-hidden"
                >
                  <h4 className="text-xs font-black text-[#0B132B] uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-slate-150">
                    <Edit3 className="h-3.5 w-3.5 text-violet-500" />
                    Enter Official Scout / Coach Appraisal
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Event Type */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Evaluation Event Type</label>
                      <select
                        value={evalType}
                        onChange={(e) => setEvalType(e.target.value as any)}
                        className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-violet-500 focus:outline-none"
                      >
                        <option value="Practice">Academy Practice / Scrimmage</option>
                        <option value="Trial">Scout Invite Trials / Combines</option>
                        <option value="Tournament">Official Championship / Tournament Match</option>
                      </select>
                    </div>

                    {/* Event Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Event / Session Title</label>
                      <input
                        type="text"
                        value={evalEventName}
                        onChange={(e) => setEvalEventName(e.target.value)}
                        placeholder="e.g. State Division 1 Finals"
                        className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-violet-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Choose Skill to Reward */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Parameter Impacted</label>
                      <select
                        value={evalSelectedSkill}
                        onChange={(e) => setEvalSelectedSkill(e.target.value)}
                        className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-violet-500 focus:outline-none"
                        required
                      >
                        <option value="">-- Choose competency to level up --</option>
                        {localSkills.map(s => (
                          <option key={s.name} value={s.name}>{s.name} (Current: {s.rating}%)</option>
                        ))}
                      </select>
                    </div>

                    {/* Choose Rating change */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Rating Increment</label>
                      <select
                        value={evalRatingChange}
                        onChange={(e) => setEvalRatingChange(parseInt(e.target.value))}
                        className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-violet-500 focus:outline-none"
                      >
                        <option value={1}>+1% Progress Boost</option>
                        <option value={2}>+2% Solid Performance gain</option>
                        <option value={3}>+3% Outstanding Skill-up</option>
                        <option value={4}>+4% Supreme Domination gain</option>
                        <option value={5}>+5% God-Tier Combine Breakout</option>
                      </select>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Feedback / Scouting Observations</label>
                    <textarea
                      value={evalComments}
                      onChange={(e) => setEvalComments(e.target.value)}
                      placeholder="e.g. Demonstrated exceptional ball handling and defensive posture under high pressure..."
                      rows={2}
                      className="w-full bg-white rounded-xl border border-slate-200 p-2.5 text-xs focus:border-violet-500 focus:outline-none resize-none"
                      required
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingRecord(false)}
                      className="px-3.5 py-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Commit to Passport Ledger ✓
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              {(['All', 'Trial', 'Practice', 'Tournament'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHistoryFilter(filter)}
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    historyFilter === filter
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm'
                      : 'bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {filter}s
                </button>
              ))}
            </div>

            {/* History Ledger List Container */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {(() => {
                // Prepare default history ledger if empty
                const historyList = athlete.skillHistory && athlete.skillHistory.length > 0
                  ? athlete.skillHistory
                  : [
                      {
                        id: 'sh_def_1',
                        type: 'Tournament',
                        eventName: `${athlete.sport} Regional Finals`,
                        date: 'Jul 15, 2026',
                        skillsUpdated: [{ name: displaySkills[0]?.name || 'Performance', change: 4, newVal: Math.min(100, (displaySkills[0]?.rating || 85) + 4) }],
                        comments: 'Showed remarkable dominance in critical crunch-time play. Scouts noted highly disciplined spatial awareness and focus.',
                        overallRatingAfter: overallRating
                      },
                      {
                        id: 'sh_def_2',
                        type: 'Practice',
                        eventName: 'Elite Combine Scrimmage Session',
                        date: 'Jul 10, 2026',
                        skillsUpdated: [{ name: displaySkills[4]?.name || 'Endurance', change: 3, newVal: Math.min(100, (displaySkills[4]?.rating || 80) + 3) }],
                        comments: 'Sustained continuous full-court sprint drills without stamina drop. Showcased incredible endurance spikes and vocal teamwork.',
                        overallRatingAfter: Math.max(80, overallRating - 1)
                      },
                      {
                        id: 'sh_def_3',
                        type: 'Trial',
                        eventName: 'National Academy Scouting Combine',
                        date: 'Jul 02, 2026',
                        skillsUpdated: [{ name: displaySkills[1]?.name || 'Speed', change: 5, newVal: Math.min(100, (displaySkills[1]?.rating || 88) + 5) }],
                        comments: 'Broke pre-season records in reactive agility. Certified scouts gave the athlete supreme ratings for field adaptability.',
                        overallRatingAfter: Math.max(78, overallRating - 2)
                      }
                    ];

                // Filter list
                const filteredHistory = historyFilter === 'All'
                  ? historyList
                  : historyList.filter(h => h.type === historyFilter);

                if (filteredHistory.length === 0) {
                  return (
                    <div className="text-center p-8 border-2 border-dashed border-slate-150 bg-slate-50/50 rounded-xl">
                      <Trophy className="h-6 w-6 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-[11px] font-bold text-[#0B132B]">No ledger records matching your filter</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Click "Log Evaluation" above to add verified progress.</p>
                    </div>
                  );
                }

                return filteredHistory.map((historyItem) => {
                  const typeColors = {
                    Trial: 'bg-blue-50 text-blue-700 border border-blue-100',
                    Practice: 'bg-amber-50 text-amber-700 border border-amber-100',
                    Tournament: 'bg-violet-50 text-violet-700 border border-violet-100'
                  };

                  return (
                    <div key={historyItem.id} className="p-3 border border-slate-150 hover:border-slate-300 bg-white rounded-xl transition-all shadow-xs text-left space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg leading-none ${typeColors[historyItem.type as keyof typeof typeColors] || 'bg-slate-50 text-slate-500'}`}>
                            {historyItem.type}
                          </span>
                          <h4 className="text-xs font-black text-[#0B132B] line-clamp-1 leading-none">
                            {historyItem.eventName}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">{historyItem.date}</span>
                      </div>

                      <p className="text-[11px] font-sans text-slate-600 leading-relaxed font-medium">
                        "{historyItem.comments}"
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100/50 text-[10px] font-mono font-bold text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">Parameter Impacted:</span>
                          {historyItem.skillsUpdated.map((s, idx) => (
                            <span key={idx} className="text-[#0B132B] font-extrabold bg-slate-100 px-2 py-0.5 rounded">
                              {s.name} <span className="text-emerald-600">+{s.change}%</span> (new: {s.newVal}%)
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 font-sans">
                          <span>Unified Passport Grade After:</span>
                          <span className="font-mono text-violet-600 font-extrabold">{historyItem.overallRatingAfter}%</span>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Applied Games & Tournament Registrations list */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280]">
                Applied Games & REGISTRATIONS ({registrations.filter(r => r.athleteId === athlete.id).length})
              </span>
              <span className="text-[10px] bg-blue-50 text-[#1C77FF] px-2.5 py-0.5 rounded-full font-sans font-black uppercase tracking-wider">
                Platform Passport Active
              </span>
            </div>

            {registrations.filter(r => r.athleteId === athlete.id).length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed border-slate-150 rounded-xl bg-slate-50/50">
                <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#0B132B]">No active registrations listed in portfolio</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto">
                  Scan available tournaments/games under the "Live Tournaments" tab and click "Apply/Register" to join!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {registrations.filter(r => r.athleteId === athlete.id).map((reg) => {
                  const tObj = tournaments.find(t => t.id === reg.tournamentId);
                  return (
                    <div key={reg.id} className="relative group overflow-hidden border border-slate-200/80 hover:border-[#1C77FF] rounded-2xl bg-white p-4 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                            {tObj?.type || 'Championship'}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            reg.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            reg.status === 'Declined' ? 'bg-rose-50 text-rose-600 border border-rose-150' :
                            'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                          }`}>
                            ● {reg.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-[#0B132B] line-clamp-2 leading-tight group-hover:text-[#1C77FF] transition-colors">
                            {reg.tournamentTitle}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 font-mono">
                            Reg ID: #{reg.id.replace('reg_', '')}
                          </p>
                        </div>

                        {tObj && (
                          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-semibold font-sans">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{tObj.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{tObj.date} ({tObj.duration})</span>
                            </div>
                          </div>
                        )}

                        {reg.declaredSkills && Object.keys(reg.declaredSkills).length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 bg-slate-50/50 rounded-lg p-2">
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#1C77FF] block">Declared Skill Set</span>
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
                                  <span key={key} className="bg-slate-100 text-[9px] text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-205 capitalize block truncate max-w-full">
                                    <span className="text-slate-400 font-bold mr-1">{displayKey}:</span>{val}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-400 uppercase font-mono">Division Target</span>
                        <span className="text-[#0B132B] capitalize font-mono text-right">{tObj?.category || athlete.category || 'Senior'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Total Results of Points & Percentage Progress Section */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-md text-left transition-all hover:border-blue-300">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#1C77FF]">
                    Athletic Performance Gauge
                  </span>
                  <h3 className="font-sans text-base font-extrabold text-[#0B132B] tracking-tight mt-1">
                    Overall Progress & Total Results
                  </h3>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-100 uppercase">
                  Active Assessment
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                <div className="space-y-3.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
                      {perfData.pointsLabel}
                    </span>
                    <p className="text-2xl font-black text-[#0B132B]" id="overall_progress_total_points">
                      {perfData.totalPoints}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1 leading-none">
                      <span>OVERALL PROGRESSION RATING</span>
                      <span className="text-[#1C77FF] font-mono leading-none" id="overall_progress_percentage">{perfData.overallPercentage}% Progress</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${perfData.overallPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#1C77FF] font-extrabold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span>{perfData.recentLabel}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-[#0B132B] leading-tight" id="recent_gameplay_status">
                      {perfData.recentStatus}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold font-mono">
                      Last Matchup: <span className="text-slate-600 font-bold">{perfData.recentOpponent}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Past & Present Player Status Records List */}
            <div className="rounded-2xl border border-slate-200/85 bg-white p-5 shadow-md text-left transition-all hover:border-blue-300">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#1C77FF]">
                    Sports Chronology Status
                  </span>
                  <h3 className="font-sans text-base font-extrabold text-[#0B132B] tracking-tight mt-1">
                    Past & Present Player Status Logs
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-bold">
                  Certified Seasons
                </span>
              </div>

              <div 
                className="overflow-x-auto rounded-xl border border-slate-100 relative bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: `url(${getSportImage(athlete.sport)})` }}
              >
                <div className="bg-white/92 backdrop-blur-md p-1">
                  <table className="w-full text-left border-collapse" id="past_present_status_logs">
                    <thead>
                      <tr className="bg-slate-50/90 text-[9px] uppercase font-extrabold text-slate-500 font-mono border-b border-slate-100">
                        <th className="p-3">Season & Event</th>
                        <th className="p-3">Player Role Assignment</th>
                        <th className="p-3">Points / Scores</th>
                        <th className="p-3">Efficiency Ratio</th>
                        <th className="p-3 text-right">Activity State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60 text-xs text-slate-800 font-medium font-sans">
                      {perfData.pastPresentList.map((log, index) => (
                        <tr key={index} className="hover:bg-[#1C77FF]/10 bg-white/40 transition-all">
                          <td className="p-3 font-extrabold text-[#0B132B]">
                            📅 {log.season}
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {log.role}
                          </td>
                          <td className="p-3 font-mono font-black text-[#1C77FF]">
                            {log.points}
                          </td>
                          <td className="p-3 font-bold text-slate-800">
                            {log.percentage} Rating
                          </td>
                          <td className="p-3 text-right">
                            <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              log.status.includes("Present")
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-slate-100/90 text-slate-600 border border-slate-200/55"
                            }`}>
                              ● {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* High Score Peak Best Records & Top Talents */}
          <div className="rounded-2xl border border-slate-200/85 bg-white p-5 shadow-md text-left transition-all hover:border-amber-300">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#1C77FF]">
                  Hall of Fame Milestones
                </span>
                <h3 className="font-sans text-base font-extrabold text-[#0B132B] tracking-tight mt-1">
                  Peak Best Records & Hall of Fame Talents
                </h3>
              </div>
              <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-100">
                ⭐ ALL-TIME BESTS
              </span>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Swipe showcase • {hallSlideIndex + 1}/{hallSlides.length}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setHallSlideIndex((prev) => (prev - 1 + hallSlides.length) % hallSlides.length)}
                    className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setHallSlideIndex((prev) => (prev + 1) % hallSlides.length)}
                    className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative h-44 overflow-hidden">
                {hallSlides.map((rec, index) => {
                  const isActive = index === hallSlideIndex;
                  return (
                    <div
                      key={rec.title}
                      className={`absolute inset-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-500 ${
                        isActive ? 'translate-x-0 opacity-100' : index < hallSlideIndex ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
                      }`}
                    >
                      <div className="space-y-3">
                        <span className="inline-flex text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-100">
                          Record {index + 1}
                        </span>
                        <h4 className="text-sm font-black text-[#0B132B]">
                          {rec.title}
                        </h4>
                        <p className="font-mono text-lg font-black text-amber-600">
                          {rec.record}
                        </p>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] font-bold text-slate-400">
                          <span>{rec.date}</span>
                          <span className="text-[#10B981]">{rec.stat}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Certified Performance Statistics */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280]">
                Telemetry Certified Metrics
              </span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase tracking-wider">
                ✓ laser verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {athlete.stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-xl text-left"
                >
                  <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    {stat.label}
                  </span>
                  
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-sans text-lg font-black text-[#0B132Bi]">
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="text-slate-500 text-xs font-bold font-mono">{stat.unit}</span>
                    )}
                  </div>

                  {stat.change && (
                    <p className="font-sans text-[10px] text-emerald-600 mt-1 font-semibold">{stat.change}</p>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Verified Achievements List */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left">
            <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280] block mb-4">
              Verified Achievements & Badges ({athlete.achievements.length})
            </span>

            <div className="space-y-4">
              {athlete.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-start gap-3.5 p-3.5 bg-slate-50 hover:bg-slate-50 rounded-2xl border border-slate-100 relative group transition-all"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100/60 text-orange-600">
                    <Award className="h-6 w-6 stroke-[2.2]" />
                  </div>

                  <div className="flex-1 min-w-0 leading-tight">
                    <h4 className="font-sans text-xs sm:text-sm font-black text-[#0B132Bi] group-hover:text-[#1C77FF] transition-colors">
                      {ach.title}
                    </h4>
                    <p className="font-sans text-xxs text-slate-500 font-medium mt-1">
                      {ach.competition} • {ach.year}
                    </p>
                    
                    {ach.verifiedBy && (
                      <span className="inline-flex items-center gap-1 font-sans text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-2 uppercase tracking-wider border border-emerald-150/40">
                        ✓ Verified by: {ach.verifiedBy}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-black tracking-widest bg-amber-50 text-amber-600 px-2.5 py-1 rounded">
                      {ach.badgeType} Medal
                    </span>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Career Chronology Timeline */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm text-left">
            <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280] block mb-5">
              Verified Career chronology Timeline
            </span>

            <div className="relative border-l border-slate-200 pl-4 space-y-6">
              {athlete.timeline.map((entry) => (
                <div key={entry.id} className="relative group">
                  
                  {/* Circle locator index */}
                  <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-white border-2 border-[#1C77FF] group-hover:bg-[#1C77FF] transition-colors"></div>

                  <div className="leading-tight">
                    <span className="font-mono text-[10px] font-extrabold text-[#1C77FF] block mb-1">
                      {entry.year} • {entry.category.toUpperCase()}
                    </span>
                    <h4 className="font-sans text-xs font-black text-[#0B132Bi]">
                      {entry.title}
                    </h4>
                    <p className="font-sans text-xxs text-slate-500 leading-relaxed mt-1">
                      {entry.description}
                    </p>
                    
                    {entry.organization && (
                      <span className="block text-[9px] font-sans text-slate-400 font-bold mt-1 uppercase">
                        Organized By: {entry.organization}
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Slide-over Profile Customize Drawer */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-[#0B132B]/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto text-left relative flex flex-col justify-between">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-[#1C77FF]" />
                  <h2 className="font-sans text-lg font-black text-[#0B132Bi]">Customize Portfolio CV</h2>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B132B]">Athlete Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#1C77FF] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B132B]">Sport Discipline</label>
                    <input
                      type="text"
                      value={editSport}
                      onChange={(e) => setEditSport(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#1C77FF] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B132B]">Position/Roles</label>
                    <input
                      type="text"
                      value={editPos}
                      onChange={(e) => setEditPos(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#1C77FF] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B132B]">Location City</label>
                    <input
                      type="text"
                      value={editLoc}
                      onChange={(e) => setEditLoc(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#1C77FF] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B132B]">Graduating Class Year</label>
                    <input
                      type="text"
                      value={editGrad}
                      onChange={(e) => setEditGrad(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#1C77FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B132B]">Height (e.g. 6'3")</label>
                    <input
                      type="text"
                      value={editHeight}
                      onChange={(e) => setEditHeight(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#1C77FF] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0B132B]">Weight (e.g. 190 lbs)</label>
                    <input
                      type="text"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#1C77FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B132B]">Pre-Academic College/Prep Name</label>
                  <input
                    type="text"
                    value={editCollege}
                    onChange={(e) => setEditCollege(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#1C77FF] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B132B]">Scouting Bio Cover pitch</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-[#1C77FF] focus:outline-none resize-none"
                    required
                  />
                </div>

                {/* Tags management block */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label className="text-xs font-bold text-[#0B132B] block">Manage Athletic Competencies</label>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tempSkills.map((tag) => (
                      <span key={tag} className="bg-slate-50 border border-slate-200 text-slate-600 text-xxs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => handleRemoveSkillTag(tag)} className="text-rose-500 hover:text-rose-700 font-extrabold cursor-pointer">×</button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkillText}
                      onChange={(e) => setNewSkillText(e.target.value)}
                      placeholder="e.g. Speed Kickoffs"
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[#1C77FF]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkillTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkillTag}
                      className="bg-[#0B132B] hover:bg-[#1C77FF] text-white text-xs font-semibold px-4 py-1.5 rounded-xl cursor-pointer"
                    >
                      Add tag
                    </button>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-semibold uppercase text-slate-500 hover:text-[#0B132B] cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1C77FF] hover:bg-[#0B132B] text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-colors"
                  >
                    Lock Identity Portfolio
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
