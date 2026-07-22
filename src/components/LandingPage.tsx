/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Award, Zap, Compass, Users, Sparkles, Trophy, Goal, RefreshCw } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: (tab: 'network' | 'discovery' | 'dashboard' | 'profile') => void;
  onExploreEvents: () => void;
}

export default function LandingPage({ onGetStarted, onExploreEvents }: LandingPageProps) {
  const [activeSportsTeaser, setActiveSportsTeaser] = useState<'basketball' | 'soccer' | 'track'>('basketball');

  const sportsMetricsTeasers = {
    basketball: {
      sport: 'Basketball',
      athlete: 'Devon Hughes (Class of 2027)',
      position: 'Shooting Guard',
      stats: [
        { label: '3PT Percentage', value: '41.2%', verified: true },
        { label: 'Max Vertical Spacing', value: '38.5 in', verified: true },
        { label: 'Wingtips Coverage', value: `6'8"`, verified: false },
        { label: 'Lane Agility Time', value: '10.8 s', verified: true },
      ],
      achievement: 'AAU Regional Finals All-Star Scoring Lead',
    },
    soccer: {
      sport: 'Football (Soccer)',
      athlete: 'Matteo Silva (Class of 2026)',
      position: 'Winger / Forward',
      stats: [
        { label: 'Top Running Speed', value: '21.8 mph', verified: true },
        { label: 'Expected Assists/90', value: '0.64', verified: true },
        { label: 'Pass Accuracy (Final Third)', value: '84%', verified: true },
        { label: 'Aerobic VO2 Max Estimate', value: '64 ml/kg', verified: false },
      ],
      achievement: 'MLS Next Developmental Golden Boot Invitee',
    },
    track: {
      sport: 'Track & Field',
      athlete: 'Sariyah Brooks (Class of 2026)',
      position: '100m • 200m Sprint',
      stats: [
        { label: '100m Sprint Record', value: '11.14 s', verified: true },
        { label: 'Reaction Time from Blocks', value: '0.122 s', verified: true },
        { label: 'Average Peak Acceleration', value: '1.25 Gs', verified: true },
        { label: 'Stride Rate frequency', value: '4.8 strides/s', verified: false },
      ],
      achievement: 'State Junior Cup Sprint Champion Winner',
    },
  };

  const selectedTeaser = sportsMetricsTeasers[activeSportsTeaser];

  return (
    <div className="bg-[#F8FAFC] pb-20 landing-id-1 overflow-hidden">
      
      {/* Premium Hero Section */}
      <section className="relative pt-12 md:pt-24 pb-16 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="sec_landing_hero">
        
        {/* Subtle Decorative Background Accents */}
        <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-100/30 blur-3xl"></div>
        <div className="absolute bottom-12 left-1/3 -z-10 h-96 w-96 rounded-full bg-sky-100/40 blur-3xl"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Wording Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1C77FF]/10 text-[#1C77FF] px-3.5 py-1 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm border border-blue-200/40">
              <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
              The Athlete Opportunity Protocol
            </div>

            {/* Core Hero Headline */}
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B132B] tracking-tight leading-[1.08] mb-6">
              One Profile.<br />
              Every Tournament.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C77FF] via-[#38BDF8] to-[#1C77FF] bg-300% animate-gradient-shift">
                Your Entire Sports Journey.
              </span>
            </h1>

            {/* Core Supporting Text */}
            <p className="font-sans text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mb-8">
              Build your athlete identity, discover opportunities, showcase achievements, and grow your sports career from grassroots competitions to elite tournaments.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => onGetStarted('profile')}
                id="btn_hero_create_profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B132B] hover:bg-[#1C77FF] text-white px-6 py-4 text-sm font-semibold tracking-wide shadow-lg shadow-[#0B132B]/10 hover:shadow-blue-500/25 transition-all text-center cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShieldCheck className="h-5 w-5 text-sky-300" />
                Build Your Verified Profile
              </button>

              <button
                onClick={() => onGetStarted('discovery')}
                id="btn_hero_explore_tournaments"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 text-[#0B132B] hover:text-[#1C77FF] px-6 py-4 text-sm font-semibold tracking-wide border border-slate-200 shadow-sm transition-all text-center cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Compass className="h-5 w-5" />
                Discover Open Events
              </button>
            </div>

            {/* Live Metrics Trust Elements */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-slate-200/60 pt-8 w-full">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                <span className="text-[#10B981] font-sans text-base">●</span> 12,400+ Verified Athletes
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                <span className="text-[#1C77FF] font-sans text-base">●</span> 180+ Regional Association Tournaments
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                <span className="text-amber-500 font-sans text-base">●</span> 65+ Colleague/Scout Teams Joined
              </div>
            </div>

          </div>

          {/* Interactive Live Athlete Mock Widget Column */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 p-6 flex flex-col relative overflow-hidden transition-all hover:border-slate-300">
              
              {/* Card Header Teaser Toggles */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <span className="font-mono text-[10px] uppercase font-extrabold tracking-widest text-[#1C77FF]">
                  SportsOS Dynamic Portfolio Preview
                </span>
                
                {/* Micro Pill Toggles */}
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                  {(['basketball', 'soccer', 'track'] as const).map((sportKey) => (
                    <button
                      key={sportKey}
                      onClick={() => setActiveSportsTeaser(sportKey)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                        activeSportsTeaser === sportKey
                          ? 'bg-white text-[#0B132B] shadow-sm font-semibold'
                          : 'text-[#6B7280] hover:text-[#0B132B]'
                      }`}
                    >
                      {sportKey === 'soccer' ? 'Soccer' : sportKey === 'track' ? 'Track' : 'B-Ball'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fake Active Athlete Info */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center font-extrabold text-[#0B132B] border-2 border-white ring-2 ring-[#1C77FF] overflow-hidden">
                    {/* Just visual dynamic dummy icon based on choice */}
                    <span className="text-xl">
                      {activeSportsTeaser === 'basketball' ? '🏀' : activeSportsTeaser === 'soccer' ? '⚽' : '⚡'}
                    </span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C77FF] text-white">
                    <ShieldCheck className="h-3 w-3 stroke-[2.5]" />
                  </span>
                </div>
                
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-sans text-sm font-black text-[#0B132B] tracking-tight">
                      {selectedTeaser.athlete}
                    </h3>
                  </div>
                  <p className="font-sans text-xs text-slate-500 font-medium">
                    {selectedTeaser.sport} • {selectedTeaser.position}
                  </p>
                  <p className="font-sans text-[10px] font-semibold text-[#1C77FF] mt-0.5 bg-blue-50 px-1.5 py-0.5 rounded w-max">
                    SportsOS Profile Active & Verified
                  </p>
                </div>
              </div>

              {/* Dynamic Telemetry Box */}
              <div className="rounded-xl bg-slate-50/80 border border-slate-100 p-4 mb-4">
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#6B7280] block mb-3 text-left">
                  Certified Athletic Telemetry
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  {selectedTeaser.stats.map((stat, i) => (
                    <div key={i} className="flex flex-col items-start bg-white border border-slate-100 rounded-lg p-2.5">
                      <div className="flex items-center gap-1">
                        <span className="font-sans text-xxs text-slate-400 uppercase tracking-wider font-semibold">
                          {stat.label}
                        </span>
                        {stat.verified && (
                          <div className="bg-emerald-50 text-emerald-600 rounded p-0.5" title="Telemetry verified by Association laser sensors">
                            <ShieldCheck className="h-2.5 w-2.5" />
                          </div>
                        )}
                      </div>
                      <span className="font-sans text-sm font-extrabold text-[#0B132B] mt-1">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlight Achievement banner */}
              <div className="flex items-center gap-2.5 border border-[#10B981]/25 bg-[#10B981]/5 rounded-xl p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/15 text-[#10B981]">
                  <Trophy className="h-4.5 w-4.5 stroke-[2]" />
                </div>
                <div className="text-left">
                  <p className="font-sans text-[10px] font-bold text-[#10B981] uppercase tracking-wider">
                    Featured Verified Accomplishment
                  </p>
                  <p className="font-sans text-xs font-semibold text-[#0B132B] line-clamp-1">
                    {selectedTeaser.achievement}
                  </p>
                </div>
              </div>

              {/* Mini CTA button on preview */}
              <button
                onClick={() => onGetStarted('profile')}
                className="mt-4 w-full bg-[#1C77FF] hover:bg-[#0B132B] text-white py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
              >
                Inquire & View Portfolio
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* The Single Source of Truth - Beautiful Core Problem Pitch */}
      <section className="bg-white border-y border-slate-100 py-16 px-4 sm:px-6 lg:px-8" id="sec_landing_pitch">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-mono text-[#1C77FF] text-xs font-black uppercase tracking-widest mb-3">
              The Fragmentation Problem
            </h2>
            <p className="font-sans text-3xl font-extrabold text-[#0B132B] tracking-tight leading-tight mb-4">
              Today sports data belongs to tournaments. <br />
              With SportsOS, your sports data finally belongs to <span className="text-[#1660CF]">you</span>.
            </p>
            <p className="font-sans text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
              Athletes compete across multiple schools, youth leagues, state tournaments, and trials. Yet, their stats, game tapes, and milestones are scattered on old websites or lost in physical scoresheets. SportsOS is the central network that unifies your sporting pedigree.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Box 1 */}
            <div className="flex flex-col items-start text-left p-6 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all hover:shadow-lg hover:shadow-slate-100/45 duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1C77FF] mb-5">
                <Users className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="font-sans text-base font-bold text-[#0B132B] mb-2">
                One Athlete Identity
              </h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                A professional, unified portfolio summarizing your physical dimensions, skills, video reels, verified awards, and academic info in one place.
              </p>
            </div>

            {/* Box 2 */}
            <div className="flex flex-col items-start text-left p-6 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all hover:shadow-lg hover:shadow-slate-100/45 duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-[#38BDF8] mb-5">
                <Compass className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="font-sans text-base font-bold text-[#0B132B] mb-2">
                Unified Discoverability
              </h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Browse localized or national tournaments, trials, camps, and leagues. Learn deadlines, check registration caps, and apply with your profile credential.
              </p>
            </div>

            {/* Box 3 */}
            <div className="flex flex-col items-start text-left p-6 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all hover:shadow-lg hover:shadow-slate-100/45 duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-[#10B981] mb-5">
                <ShieldCheck className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="font-sans text-base font-bold text-[#0B132B] mb-2">
                Verified Career Timeline
              </h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Build a secure blockchain-inspired record of your athletic timeline. Every entry is authorized and verified directly by the event organizers.
              </p>
            </div>

            {/* Box 4 */}
            <div className="flex flex-col items-start text-left p-6 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all hover:shadow-lg hover:shadow-slate-100/45 duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-5">
                <Zap className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="font-sans text-base font-bold text-[#0B132B] mb-2">
                Direct Scouting Channels
              </h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                College coaches and elite academy scouts gain telemetry-first filters to find matching talent profiles based on certified performance statistics.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Platform Overview Step Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="sec_landing_journey">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          
          {/* Left Visual Illustration with simple SVG design */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#1C77FF]/5 rounded-3xl -rotate-1 transform -z-10"></div>
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
              <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#6B7280]">
                Ecosystem Architecture Unified
              </span>
              
              <div className="mt-8 space-y-4">
                
                {/* Node 1 */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/50 transition-all hover:scale-101">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B132B] text-white text-xs font-mono">
                    01
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-[#0B132B]">
                      Athlete submits SportsOS ID
                    </h4>
                    <p className="font-sans text-xxs text-slate-500">
                      Register to State Cup with your verified QR code and verified telemetry.
                    </p>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="flex items-center gap-4 bg-[#1C77FF]/5 p-4 rounded-xl border border-[#1C77FF]/25 transition-all hover:scale-101">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1C77FF] text-white text-xs font-mono">
                    02
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-[#1C77FF]">
                      Organizer tracks telemetry live
                    </h4>
                    <p className="font-sans text-xxs text-sky-700/80">
                      Game points, sprints, and metrics are typed in and certified straight into the system.
                    </p>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100 transition-all hover:scale-101">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white text-xs font-mono">
                    03
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-emerald-800">
                      Portfolio updates dynamically
                    </h4>
                    <p className="font-sans text-xxs text-emerald-700">
                      Achievements and stats are permanently locked into the athletic profile timeline.
                    </p>
                  </div>
                </div>

              </div>
              
              {/* Simple illustrative chart teaser */}
              <div className="mt-6 flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="font-sans text-xxs font-semibold text-slate-500">Recruiter Profile Scans</span>
                <div className="flex gap-1">
                  <div className="bg-slate-200 h-6 w-1.5 rounded-full"></div>
                  <div className="bg-slate-200 h-8 w-1.5 rounded-full"></div>
                  <div className="bg-slate-300 h-10 w-1.5 rounded-full"></div>
                  <div className="bg-[#1C77FF] h-14 w-1.5 rounded-full"></div>
                  <div className="bg-sky-400 h-12 w-1.5 rounded-full"></div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Text Block */}
          <div className="flex flex-col items-start justify-center">
            <span className="font-mono text-[#1C77FF] text-xs font-black uppercase tracking-widest mb-3">
              Premium Athlete Platform
            </span>
            <h2 className="font-sans text-3xl font-black text-[#0B132B] tracking-tight leading-tight mb-5">
              The LinkedIn for Elite Athletes & Sports Recruits
            </h2>
            <p className="font-sans text-sm text-slate-500 leading-relaxed mb-6">
              Gone are the days of sending blurry video copies and excel-sheet rosters over email. SportsOS presents a digital ecosystem where your physical statistics and tournament timelines are verified directly by trusted regional associations.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 mt-0.5 items-center justify-center rounded-full bg-emerald-50 text-[#10B981] shrink-0">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-[#0B132B]">
                    Showcase Real Credentials
                  </h4>
                  <p className="font-sans text-xs text-slate-500">
                    Verify metrics with Laser timers & electronic scoresheets to win recruitment slots.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 mt-0.5 items-center justify-center rounded-full bg-[#1C77FF]/10 text-[#1C77FF] shrink-0">
                  <Goal className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-[#0B132B]">
                    Recruit Without Guesswork
                  </h4>
                  <p className="font-sans text-xs text-slate-500">
                    Filter by sport-specific metrics to find perfect prospects, verified and active.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onGetStarted('dashboard')}
              id="btn_landing_action_center"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0B132B] hover:bg-[#1C77FF] text-white px-5 py-3 text-sm font-bold tracking-wide transition-all"
            >
              Enter Personal Sports Command Center
            </button>

          </div>

        </div>
      </section>

    </div>
  );
}
