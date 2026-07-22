/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Athlete, Tournament, Post, EventType, SkillRating, SkillHistoryEntry } from '../types';

export const INITIAL_ATHLETE: Athlete = {
  id: 'ath_1',
  name: 'Marcus Carter',
  sport: 'Basketball',
  position: 'Point Guard',
  location: 'Los Angeles, CA',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  coverImage: 'https://images.unsplash.com/photo-1504450758481-7338eaa75e61?w=1000&auto=format&fit=crop&q=80',
  bio: 'Explosive playmaking guard. Elite court vision, tight ball handling, and three-level scorer. Looking to transition from Academy level to Elite NCAA Division 1 programs. Team captain and absolute gym rat.',
  height: `6'3"`,
  weight: '195 lbs',
  college: 'Apex National Athletic Academy',
  graduatingYear: '2027',
  verified: true,
  followersCount: 1420,
  followingCount: 382,
  skills: ['Floor General', 'Pick & Roll Maestro', 'Perimeter Lockdowns', 'Catch & Shoot (39.5%)', 'Transition Play'],
  clubs: ['Apex Elite AAU', 'Metro LA Hawks'],
  stats: [
    { label: 'PPG', value: '24.2', change: '+3.1 vs last season' },
    { label: 'APG', value: '7.8', change: '+1.5 vs last season' },
    { label: 'RPG', value: '4.5', change: 'Stable' },
    { label: 'Max Vertical', value: '41', unit: ' in' },
    { label: '3PT%', value: '39.8', unit: '%' },
    { label: '3/4 Court Sprint', value: '3.12', unit: ' sec' }
  ],
  achievements: [
    {
      id: 'ach_101',
      title: 'AAU Summer National Tournament MVP',
      competition: 'Nike EYBL Championship',
      year: '2025',
      badgeType: 'Gold',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150&auto=format&fit=crop&q=80',
      verifiedBy: 'Elite Youth Basketball League'
    },
    {
      id: 'ach_102',
      title: 'All-State First Team Selection',
      competition: 'California High School Athletic Board',
      year: '2025',
      badgeType: 'Verified',
      image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=150&auto=format&fit=crop&q=80',
      verifiedBy: 'CIF State Council'
    },
    {
      id: 'ach_103',
      title: 'Slam Dunk Champion',
      competition: 'West Coast Showcase',
      year: '2024',
      badgeType: 'Special',
      image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=150&auto=format&fit=crop&q=80',
      verifiedBy: 'Aces High Sports'
    }
  ],
  timeline: [
    {
      id: 'time_1',
      year: '2025',
      title: 'Led Apex Elite AAU to National Championships',
      description: 'Averaged 26.5 points and 8.1 assists over a 12-game postseason run. Scouted by 15 Division 1 programs.',
      category: 'competition',
      organization: 'Apex Athletic Academy'
    },
    {
      id: 'time_2',
      year: '2025',
      title: 'Verified 41-inch Max Vertical Jump',
      description: 'Official athletic testing and video verification uploaded. Elite tier percentile for point guards.',
      category: 'milestone',
      organization: 'SportsOS Lab Verified'
    },
    {
      id: 'time_3',
      year: '2024',
      title: 'Recovered from Mild Ankle Sprain (Grade 1)',
      description: 'Completed a 4-week physical therapy protocol. Returned with improved strength, lateral speeds, and vertical metric values.',
      category: 'injury',
      organization: 'LA Sports Orthopedics'
    },
    {
      id: 'time_4',
      year: '2023',
      title: 'Admitted to Apex National Athletic Academy on Scholarship',
      description: 'Selected from 300+ national candidates for selective prep curriculum based on academic merit and athletic capacity.',
      category: 'academy',
      organization: 'Apex National Prep'
    }
  ],
  individualSkills: [
    { name: 'Shooting Accuracy', rating: 90, type: 'sport-specific' },
    { name: 'Ball Dribbling', rating: 88, type: 'sport-specific' },
    { name: 'Passing IQ', rating: 85, type: 'sport-specific' },
    { name: 'Perimeter Defense', rating: 82, type: 'sport-specific' },
    { name: 'Speed & Agility', rating: 92, type: 'common' },
    { name: 'Stamina & Endurance', rating: 87, type: 'common' },
    { name: 'Teamwork & Chemistry', rating: 91, type: 'common' },
    { name: 'Discipline & Focus', rating: 94, type: 'common' }
  ],
  skillHistory: [
    {
      id: 'sh_1_1',
      type: 'Trial',
      eventName: 'West Coast AAU Combine Assessment',
      date: 'Oct 15, 2025',
      skillsUpdated: [
        { name: 'Speed & Agility', change: 2, newVal: 90 },
        { name: 'Ball Dribbling', change: 1, newVal: 86 }
      ],
      comments: 'Logged elite tier reaction times and shuttle run speed splits. Precision handling remained steady throughout pressure.',
      overallRatingAfter: 87
    },
    {
      id: 'sh_1_2',
      type: 'Practice',
      eventName: 'Point Guard Playmaking Intense Drills',
      date: 'Jan 22, 2026',
      skillsUpdated: [
        { name: 'Passing IQ', change: 3, newVal: 85 },
        { name: 'Teamwork & Chemistry', change: 2, newVal: 89 }
      ],
      comments: 'Extremely fluid pick-and-roll delivery drills. Commanded secondary alignments excellently during simulated traps.',
      overallRatingAfter: 89
    },
    {
      id: 'sh_1_3',
      type: 'Tournament',
      eventName: 'Nike EYBL Championship Tournament',
      date: 'Jun 18, 2026',
      skillsUpdated: [
        { name: 'Shooting Accuracy', change: 3, newVal: 90 },
        { name: 'Teamwork & Chemistry', change: 2, newVal: 91 },
        { name: 'Discipline & Focus', change: 1, newVal: 94 }
      ],
      comments: 'Averaged 24.2 PPG. Commanded matches and maintained stellar calm under late-game press. Selected as overall tournament MVP.',
      overallRatingAfter: 91
    }
  ]
};

export const MOCK_ATHLETES: Athlete[] = [
  INITIAL_ATHLETE,
  {
    id: 'ath_2',
    name: 'Elena Rostov',
    sport: 'Track & Field',
    position: '400m / 200m Sprinter',
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1000&auto=format&fit=crop&q=80',
    bio: 'Olympic trials contender. National Junior Champion in 400m Sprint. Obsessed with starting block efficiency and linear power delivery.',
    height: `5'9"`,
    weight: '142 lbs',
    college: 'Texas Athletic Institute',
    graduatingYear: '2026',
    verified: true,
    followersCount: 2900,
    followingCount: 450,
    skills: ['Starting Block Acceleration', 'Stride Length Efficiency', 'Lactate Threshold Training', 'Tactical Pacing (400m)'],
    clubs: ['Austin Speed Club', 'Texas Speed Syndicate'],
    stats: [
      { label: '400m Personal Record', value: '49.88', unit: ' sec' },
      { label: '200m Personal Record', value: '22.45', unit: ' sec' },
      { label: 'Reaction Time', value: '0.134', unit: ' sec' },
      { label: 'Max Training Speed', value: '23.8', unit: ' mph' }
    ],
    achievements: [
      {
        id: 'ach_201',
        title: 'Gold Medal - 400m Dash',
        competition: 'National Junior Olympic Championships',
        year: '2025',
        badgeType: 'Gold',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=150&auto=format&fit=crop&q=80',
        verifiedBy: 'US Track & Field Youth Division'
      },
      {
        id: 'ach_202',
        title: 'Athlete of the Year Award',
        competition: 'Gatorade High School Track Awards',
        year: '2025',
        badgeType: 'Verified',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150&auto=format&fit=crop&q=80',
        verifiedBy: 'Gatorade Athletic Committee'
      }
    ],
    timeline: [
      {
        id: 'time_2_1',
        year: '2025',
        title: 'Broke 50-second Threshold in a 400m Dash Event',
        description: 'First junior record under 50 seconds in state history. Tracked live on certified electronic timers.',
        category: 'milestone',
        organization: 'National Junior Games'
      },
      {
        id: 'time_2_2',
        year: '2024',
        title: 'Joined Texas Speed Syndicate',
        description: 'Underwent professional training cycle focusing on linear power mechanics with Coach Dave Vance.',
        category: 'academy',
        organization: 'Texas Speed Syndicate'
      }
    ],
    individualSkills: [
      { name: 'Block Reaction Speed', rating: 94, type: 'sport-specific' },
      { name: 'Stride Efficiency', rating: 88, type: 'sport-specific' },
      { name: 'Lactate Threshold', rating: 91, type: 'sport-specific' },
      { name: 'Tactical Pacing', rating: 85, type: 'sport-specific' },
      { name: 'Speed & Agility', rating: 96, type: 'common' },
      { name: 'Stamina & Endurance', rating: 89, type: 'common' },
      { name: 'Teamwork & Chemistry', rating: 75, type: 'common' },
      { name: 'Discipline & Focus', rating: 95, type: 'common' }
    ],
    skillHistory: [
      {
        id: 'sh_2_1',
        type: 'Trial',
        eventName: 'USATF Junior National Combine',
        date: 'Nov 12, 2025',
        skillsUpdated: [
          { name: 'Block Reaction Speed', change: 3, newVal: 93 },
          { name: 'Speed & Agility', change: 1, newVal: 95 }
        ],
        comments: 'Laser sensors measured reaction at an elite 0.134s starting from blocks. Outstanding linear force.',
        overallRatingAfter: 89
      },
      {
        id: 'sh_2_2',
        type: 'Practice',
        eventName: 'Anaerobic Stride and Threshold Practice',
        date: 'Mar 10, 2026',
        skillsUpdated: [
          { name: 'Lactate Threshold', change: 2, newVal: 91 },
          { name: 'Stamina & Endurance', change: 1, newVal: 89 }
        ],
        comments: 'Outstanding interval runs maintaining 92% speed splits under oxygen debt conditions.',
        overallRatingAfter: 91
      },
      {
        id: 'sh_2_3',
        type: 'Tournament',
        eventName: 'Texas Track & Field Invitational',
        date: 'Jun 22, 2026',
        skillsUpdated: [
          { name: 'Block Reaction Speed', change: 1, newVal: 94 },
          { name: 'Tactical Pacing', change: 3, newVal: 85 },
          { name: 'Speed & Agility', change: 1, newVal: 96 }
        ],
        comments: 'Achieved an amazing personal record of 49.88s in the 400m sprint. Controlled acceleration beautifully.',
        overallRatingAfter: 93
      }
    ]
  },
  {
    id: 'ath_3',
    name: 'Liam Chen',
    sport: 'Soccer',
    position: 'Central Midfielder / Playmaker',
    location: 'Denver, CO',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?w=1000&auto=format&fit=crop&q=80',
    bio: 'Calm under pressure. Deep lying playmaker specializing in key passes, spatial awareness, and vertical transition passes. Former captain of Denver Elite FC.',
    height: `6'0"`,
    weight: '170 lbs',
    college: 'Colorado State Development F.C.',
    graduatingYear: '2027',
    verified: true,
    followersCount: 890,
    followingCount: 220,
    skills: ['Progressive Passing (91% Accuracy)', 'Through Ball Penetration', 'Spatial Scans / 360 Orientation', 'Stamina & Lung Capacity', 'Free Kicks'],
    clubs: ['Denver Elite F.C.', 'Real Colorado MLS Next'],
    stats: [
      { label: 'Pass Completion %', value: '89.5', unit: '%' },
      { label: 'Key Passes / 90min', value: '3.4' },
      { label: 'Assists', value: '14', change: 'Career High' },
      { label: 'Distance Covered', value: '7.1', unit: ' mi/game' }
    ],
    achievements: [
      {
        id: 'ach_301',
        title: 'MLS Next Cup Best Midfielder',
        competition: 'National MLS Next Finals',
        year: '2025',
        badgeType: 'Gold',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
        verifiedBy: 'MLS Next Scouting Council'
      },
      {
        id: 'ach_302',
        title: 'Silver Placement - State Cup',
        competition: 'Colorado Statewide Youth Soccer League',
        year: '2024',
        badgeType: 'Silver',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150&auto=format&fit=crop&q=80',
        verifiedBy: 'Colorado Youth Soccer'
      }
    ],
    timeline: [
      {
        id: 'time_3_1',
        year: '2025',
        title: 'Trialled with Real Salt Lake Academy',
        description: 'Spent 2 weeks in Salt Lake training with the MLS developmental squad. Highly rated scouting file.',
        category: 'academy',
        organization: 'Real Salt Lake'
      },
      {
        id: 'time_3_2',
        year: '2024',
        title: 'Won State Cup with Denver Elite F.C.',
        description: 'Captained the team. Assisting both goals in a 2-1 final victory. Awarded tournament Man of the Match.',
        category: 'competition',
        organization: 'Colorado Soccer'
      }
    ],
    individualSkills: [
      { name: 'Progressive Passing', rating: 91, type: 'sport-specific' },
      { name: 'Ball Dribbling', rating: 82, type: 'sport-specific' },
      { name: 'Through Balls', rating: 85, type: 'sport-specific' },
      { name: 'Spatial Awareness', rating: 89, type: 'sport-specific' },
      { name: 'Speed & Agility', rating: 81, type: 'common' },
      { name: 'Stamina & Endurance', rating: 92, type: 'common' },
      { name: 'Teamwork & Chemistry', rating: 94, type: 'common' },
      { name: 'Discipline & Focus', rating: 90, type: 'common' }
    ],
    skillHistory: [
      {
        id: 'sh_3_1',
        type: 'Trial',
        eventName: 'Real Salt Lake Academy Trials',
        date: 'Dec 02, 2025',
        skillsUpdated: [
          { name: 'Progressive Passing', change: 2, newVal: 89 },
          { name: 'Spatial Awareness', change: 2, newVal: 87 }
        ],
        comments: 'Demonstrated outstanding spatial orientation scans under heavy press. Passes successfully breached lines.',
        overallRatingAfter: 85
      },
      {
        id: 'sh_3_2',
        type: 'Practice',
        eventName: 'Midfield Transition & High-Intensity Drills',
        date: 'Mar 15, 2026',
        skillsUpdated: [
          { name: 'Teamwork & Chemistry', change: 2, newVal: 93 },
          { name: 'Stamina & Endurance', change: 1, newVal: 91 }
        ],
        comments: 'Led team tactical distribution schemes. Showed high work-rate and steady conditioning across 90-minute trials.',
        overallRatingAfter: 87
      },
      {
        id: 'sh_3_3',
        type: 'Tournament',
        eventName: 'Colorado Elite Metro Tournament Cup',
        date: 'Jul 04, 2026',
        skillsUpdated: [
          { name: 'Progressive Passing', change: 2, newVal: 91 },
          { name: 'Through Balls', change: 3, newVal: 85 },
          { name: 'Teamwork & Chemistry', change: 1, newVal: 94 }
        ],
        comments: 'Created 4 key passing situations leading to 2 critical goals. Awarded Match MVP in final playoffs.',
        overallRatingAfter: 89
      }
    ]
  },
  {
    id: 'ath_4',
    name: 'Chloe Vance',
    sport: 'Tennis',
    position: 'Singles Practitioner',
    location: 'Miami, FL',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1000&auto=format&fit=crop&q=80',
    bio: 'Heavy baseline top-spin generator. Intense competitive spirit. Actively climbing ITF Junior standings with 3 regional single titles.',
    height: `5'8"`,
    weight: '148 lbs',
    college: 'Evert Tennis Academy',
    graduatingYear: '2026',
    verified: false,
    followersCount: 740,
    followingCount: 154,
    skills: ['Extreme Top-Spin Forehand', 'Kick Serve (108 mph)', 'Deceptive Slice Backhand', 'Court Coverage speeds'],
    clubs: ['Evert Tennis Camp', 'Miami Grand Slam Club'],
    stats: [
      { label: 'Singles Record', value: '42 - 9' },
      { label: 'First Serve %', value: '64.5', unit: '%' },
      { label: 'Break Points Saved %', value: '72.1', unit: '%' },
      { label: 'Serve Speed Max', value: '112', unit: ' mph' }
    ],
    achievements: [
      {
        id: 'ach_401',
        title: 'Champion - Sunshine State Junior Open',
        competition: 'USTA Florida Grand Prix',
        year: '2025',
        badgeType: 'Gold',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=150&auto=format&fit=crop&q=80',
        verifiedBy: 'USTA Florida'
      },
      {
        id: 'ach_402',
        title: 'Finalist - clay court challenge',
        competition: 'National Clay Court Series',
        year: '2024',
        badgeType: 'Silver',
        image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=150&auto=format&fit=crop&q=80',
        verifiedBy: 'USTA National Committee'
      }
    ],
    timeline: [
      {
        id: 'time_4_1',
        year: '2025',
        title: 'Climbed to Top 30 ITF National Junior Rank',
        description: 'Earned 380 ranking points with persistent singles appearances and semi-final performances.',
        category: 'milestone',
        organization: 'International Tennis Federation'
      }
    ],
    individualSkills: [
      { name: 'Serve Power', rating: 88, type: 'sport-specific' },
      { name: 'Top-spin Forehand', rating: 90, type: 'sport-specific' },
      { name: 'Backhand Slice', rating: 84, type: 'sport-specific' },
      { name: 'Court Coverage', rating: 87, type: 'sport-specific' },
      { name: 'Speed & Agility', rating: 89, type: 'common' },
      { name: 'Stamina & Endurance', rating: 88, type: 'common' },
      { name: 'Teamwork & Chemistry', rating: 72, type: 'common' },
      { name: 'Discipline & Focus', rating: 91, type: 'common' }
    ],
    skillHistory: [
      {
        id: 'sh_4_1',
        type: 'Trial',
        eventName: 'Evert Academy Performance Combine',
        date: 'Oct 24, 2025',
        skillsUpdated: [
          { name: 'Serve Power', change: 3, newVal: 85 },
          { name: 'Top-spin Forehand', change: 2, newVal: 87 }
        ],
        comments: 'Grip rotation optimizations added 5mph to serve power. Heavy top-spin margins remained well within bounds.',
        overallRatingAfter: 82
      },
      {
        id: 'sh_4_2',
        type: 'Practice',
        eventName: 'Baseline Court Coverage Drills',
        date: 'Feb 18, 2026',
        skillsUpdated: [
          { name: 'Court Coverage', change: 2, newVal: 87 },
          { name: 'Stamina & Endurance', change: 1, newVal: 88 }
        ],
        comments: 'Excellent lateral recovery splits. Successfully retrieved deep corner placements continuously.',
        overallRatingAfter: 84
      },
      {
        id: 'sh_4_3',
        type: 'Tournament',
        eventName: 'Sunshine State Clay Court Junior Open',
        date: 'Jun 11, 2026',
        skillsUpdated: [
          { name: 'Top-spin Forehand', change: 3, newVal: 90 },
          { name: 'Discipline & Focus', change: 2, newVal: 91 }
        ],
        comments: 'Dominated clay battles. Commanded key points with heavy topspins. Maintained excellent match tactical focus.',
        overallRatingAfter: 87
      }
    ]
  }
];

const generate80Tournaments = (): Tournament[] => {
  const sports = ['Kabaddi', 'Cricket', 'Basketball', 'Soccer', 'Tennis'];
  const categories: ('sub-junior' | 'junior' | 'senior')[] = ['sub-junior', 'junior', 'senior'];
  const types: EventType[] = ['Championship', 'Tournament', 'League', 'Trial', 'Camp'];
  
  const sportImages: Record<string, string> = {
    'Kabaddi': 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600&auto=format&fit=crop&q=80',
    'Cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80',
    'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
    'Soccer': 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80',
    'Tennis': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop&q=80',
  };

  const indianCities = [
    'Mumbai, Maharashtra', 'Delhi NCR, India', 'Haryana Sports Hall, India', 'Bangalore Arena, KA', 
    'Chennai Turf Grounds, TN', 'Kolkata Meadows, WB', 'Hyderabad Stadium, TS', 'Pune Sports Complex, MH',
    'Ahmedabad Ground, GJ', 'Chandigarh Complex, PB', 'Jaipur Sand Arenas, RJ', 'Lucknow Turf, UP'
  ];

  const internationalCities = [
    'Los Angeles Basketball Complex, CA', 'Miami Clay Court Resort, FL', 'Austin Track Arena, TX', 
    'Denver Mile High Fields, CO', 'London Olympiad, UK', 'Sydney Harbour Fields, AU',
    'Brooklyn Net Complex, NY', 'Seattle Elite Turf, WA', 'Stuttgart Court Arena, DE'
  ];

  const organizers = [
    'Indian Pro Sports Commission', 'Global Athlete Scouts Coalition', 'National Junior Development Council',
    'SportsOS Certified Alliance', 'Metropolitan Youth Board', 'All-India Athletic Syndicate',
    'West Coast Athletic Alliance', 'Saffron Sports Council', 'Apex Talent Scouts Board'
  ];

  const scheduleOptions = [
    [
      '09:00 AM: Arrival & Uniform Distribution',
      '11:00 AM: Precision Drills (Lateral and Vertical checks)',
      '02:00 PM: Group Phase Initial Scrimmages',
      '04:30 PM: Daily Sports Medicine review'
    ],
    [
      'Day 1: Physical Weigh-In & Athletic Combine',
      'Day 2: Bracket Seed Pool Matches',
      'Day 3: Final Eliminators & Awards Ceremonies'
    ],
    [
      'Every Saturday 08:00 AM: Group Stage Fixtures',
      'Week 6: Quarterfinal Playoffs',
      'Week 7: Grand Championship Trophy Match'
    ]
  ];

  const ruleOptions = [
    [
      'Must complete academic registration and eligibility checks.',
      'SportsOS roster matching is strictly verified to ensure clear age alignments.',
      'Strict protective gear is required at all match schedules.'
    ],
    [
      'Participants must hold approved, clean sports physical records.',
      'Referees command full authority. Zero-tolerance for physical foul play.',
      'Required minimum weight brackets apply to matches.'
    ]
  ];

  const list: Tournament[] = [];

  for (let i = 1; i <= 80; i++) {
    const sport = sports[(i - 1) % sports.length];
    const category = categories[(i - 1) % categories.length];
    const type = types[(i - 1) % types.length];
    
    // Fee minimum 99 and maximum 299 depends on EVENT TYPE: Trial (99), Camp (149), Tournament (199), League (249), Championship (299)
    let baseFee = 199;
    if (type === 'Trial') {
      baseFee = 99;
    } else if (type === 'Camp') {
      baseFee = 149;
    } else if (type === 'Tournament') {
      baseFee = 199;
    } else if (type === 'League') {
      baseFee = 249;
    } else if (type === 'Championship') {
      baseFee = 299;
    }
    const fee = `₹${baseFee}`; 
    
    const isIndian = i % 2 === 0;
    const location = isIndian 
      ? indianCities[(i - 1) % indianCities.length] 
      : internationalCities[(i - 1) % internationalCities.length];

    const titlePrefixes: Record<string, string[]> = {
      'Kabaddi': ['Mahaveer Pro Catch', 'Super Tackle Raid Cup', 'Dangal Mat Panga', 'Bharat Defense Series', 'Panchayat Grassroots Trophy', 'Hindustan Raider League'],
      'Cricket': ['Premier T20 Smash', 'Saffron Academy Trials', 'Ranji Dream Showcase', 'Gully Powerplay Box Over', 'Willow Cup Series', 'National Red Leather League'],
      'Basketball': ['Metropolitan Hoop Contest', 'Dribble Master Camp', 'Hardwood Summer Heat', 'Precision Net Trials', 'Airborne Dunk Series', 'Elite Court Pro Showcase'],
      'Soccer': ['Golden Boot Challenge', 'Apex Turf Championship', 'Grass Scrimmage Trials', 'Futsal Blitz Academy', 'County Pitch Series', 'Next-Gen Pro Derby'],
      'Tennis': ['Clay Court Smash', 'Spun-Serve Matchplay', 'Line-Drive Tiebreaker Series', 'Summer Ace Championship', 'Baseline Rally Cup', 'Apex Net Camp'],
    };

    const prefixes = titlePrefixes[sport];
    const prefix = prefixes[(i - 1) % prefixes.length];
    const title = `${prefix} #${100 + i}`;

    const dateNum = 1 + (i % 25);
    const date = `Oct ${dateNum} - Oct ${dateNum + 2}, 2026`;
    const deadline = `Sep ${Math.max(1, dateNum - 5)}, 2026`;

    list.push({
      id: `trn_dynamic_${i}`,
      title,
      organizerName: organizers[(i - 1) % organizers.length],
      organizerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&auto=format&fit=crop&q=80',
      type,
      sport,
      location,
      date,
      duration: `${3 + (i % 3)} Days`,
      bannerUrl: sportImages[sport],
      fee,
      description: `A highly anticipated verified competitive ${sport.toLowerCase()} ${type.toLowerCase()} celebrating young talents in the ${category} category. Fully monitored with high-fidelity analytics and professional refereeing. Register now to enter the secure roster.`,
      status: i % 10 === 0 ? 'Ongoing' : 'Open',
      deadline,
      prizePool: i % 2 === 0 ? `₹${baseFee * 10} Scholar Grant & Medals` : 'Scholarship Draft Entry Spotlight',
      registeredCount: 15 + (i * 7 % 60),
      maxParticipants: 100 + (i * 5 % 50),
      rules: ruleOptions[i % ruleOptions.length],
      schedule: scheduleOptions[i % scheduleOptions.length],
      category
    });
  }

  return list;
};

export const INITIAL_TOURNAMENTS: Tournament[] = generate80Tournaments();

export const INITIAL_POSTS: Post[] = [
  {
    id: 'pst_101',
    athleteId: 'ath_1',
    authorName: 'Marcus Carter',
    authorTitle: 'Point Guard • Apex Prep Academy (Class of 2027)',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    content: `Thrilled to share that I've been named MVP at the California High School Tournament after our final game! Massive shoutout to my amazing Apex Prep team and coaches who helped push me to work every single morning in the dark. 🏀

Averaged 26.5 PPG and 8.1 APG during this weekend's showcase. For college recruiters, my verified game logs, official 41" vertical jump telemetry, and academic transcripts are fully active on my SportsOS portfolio. Let's build!

#BasketballRecruiting #AAUBasketball #FloorGeneral #ShowcaseMVP`,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
    category: 'achievement',
    likes: 184,
    commentsCount: 22,
    timestamp: '2 hours ago',
    isLikedByUser: false
  },
  {
    id: 'pst_102',
    authorName: 'Nike Player Development Council',
    authorTitle: 'Official SportsOS Organizer Organization',
    authorAvatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
    content: `🚨 SCOUTING ALERT: Athlete registration is officially OPEN for the upcoming Nike Next-Gen Soccer Trials in Denver on August 10!

This 1-day elite scouting trial is designed to connect exceptional grassroots talent directly with professional MLS developmental academy directors and European scouts. Spaced are limited to ensure 1-on-1 assessment and optimal telemetry tracking. 

Click to the discovery tab to secure your bib number today. Make sure your SportsOS athlete profile is fully updated before registering!

#NikeNextGen #MLSScouting #SoccerTrials #NextGenTalent`,
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    category: 'opportunity',
    likes: 312,
    commentsCount: 41,
    timestamp: '1 day ago',
    isLikedByUser: false
  },
  {
    id: 'pst_103',
    athleteId: 'ath_2',
    authorName: 'Elena Rostov',
    authorTitle: 'Sprinter • Texas Speed Syndicate (Class of 2026)',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: `New Personal Record on the books! Official electronic timer printed a 49.88s in my 400m dash final at the Texas Track & Field Showcase today. ⚡🏃‍♀️

It yields my first sub-50 second run and officially ranks my speed in the top 10 junior sprinters globally this season. To my coaches Dave Vance and everyone at Austin Speed Club: thank you for designing the optimal anaerobic sessions. 

Video analysis and complete biomechanical stats are being uploaded to SportsOS so take a look!

#SprintersLife #TrackAndField #SpeedSyndicate #400mSprint #OlympicHopes`,
    category: 'achievement',
    likes: 275,
    commentsCount: 19,
    timestamp: '18 hours ago',
    isLikedByUser: false
  },
  {
    id: 'pst_104',
    athleteId: 'ath_3',
    authorName: 'Liam Chen',
    authorTitle: 'Central Midfielder • Denver Elite FC (Class of 2027)',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    content: `Exciting week completing an official trial with the Real Salt Lake Academy squads! Invaluable experience adapting to elite pace-of-play and high intensity transition tactics. ⚽️

My match telemetry stats, including passing charts (91% total compliance) and GPS distance values (average 7.1 miles per 90), are now certified. Looking forward to the next steps!

#YouthSoccer #MLSAcademy #PlaymakerMode #SportsOSIdentity`,
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?w=600&auto=format&fit=crop&q=80',
    category: 'update',
    likes: 112,
    commentsCount: 8,
    timestamp: '3 days ago',
    isLikedByUser: false
  }
];
