/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventType = 'Tournament' | 'League' | 'Trial' | 'Camp' | 'Championship';

export interface SkillRating {
  name: string;
  rating: number; // 0 to 100
  type: 'sport-specific' | 'common';
}

export interface SkillHistoryEntry {
  id: string;
  type: 'Trial' | 'Practice' | 'Tournament';
  eventName: string;
  date: string;
  skillsUpdated: { name: string; change: number; newVal: number }[];
  comments: string;
  overallRatingAfter: number;
}

export interface Athlete {
  id: string;
  name: string;
  sport: string;
  position: string;
  location: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  height?: string;
  weight?: string;
  college?: string;
  graduatingYear?: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  stats: AthleteStat[];
  achievements: Achievement[];
  timeline: CareerTimelineEntry[];
  skills: string[];
  clubs: string[];
  // Auth and custom category fields
  category?: 'sub-junior' | 'junior' | 'senior';
  userRole?: 'player' | 'viewer';
  email?: string;
  phone?: string;
  address?: string;
  dob?: string;
  individualSkills?: SkillRating[];
  skillHistory?: SkillHistoryEntry[];
}

export interface AthleteStat {
  label: string;
  value: string | number;
  unit?: string;
  change?: string; // e.g. "+12% vs last season"
}

export interface Achievement {
  id: string;
  title: string;
  competition: string;
  year: string;
  badgeType: 'Gold' | 'Silver' | 'Bronze' | 'Special' | 'Verified';
  image?: string;
  verifiedBy?: string; // Academy/Organizer Name
}

export interface CareerTimelineEntry {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'competition' | 'award' | 'injury' | 'academy' | 'milestone';
  organization?: string;
}

export interface Tournament {
  id: string;
  title: string;
  organizerName: string;
  organizerAvatar?: string;
  type: EventType;
  sport: string;
  location: string;
  date: string;
  duration: string;
  bannerUrl: string;
  fee: string; // e.g. "$40" or "Free"
  description: string;
  status: 'Open' | 'Closed' | 'Ongoing';
  deadline: string;
  prizePool?: string;
  registeredCount: number;
  maxParticipants: number;
  rules?: string[];
  schedule?: string[];
  category?: 'sub-junior' | 'junior' | 'senior';
}

export interface Registration {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteSport: string;
  athleteAvatar: string;
  tournamentId: string;
  tournamentTitle: string;
  status: 'Pending' | 'Approved' | 'Declined';
  dateRegistered: string;
  comments?: string;
  declaredSkills?: Record<string, string>;
}

export interface Post {
  id: string;
  athleteId?: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  category: 'achievement' | 'update' | 'signing' | 'opportunity';
  timestamp: string;
  isLikedByUser: boolean;
}

export interface AppState {
  currentRole: 'athlete' | 'organizer';
  currentUserProfile: Athlete;
  tournaments: Tournament[];
  registrations: Registration[];
  posts: Post[];
  athletes: Athlete[];
  activeTab: 'landing' | 'network' | 'discovery' | 'dashboard' | 'profile';
  selectedAthleteId?: string; // For looking at other athletes' portfolios
  selectedTournamentId?: string; // For inspecting individual events
}
