/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Heart, MessageSquare, Plus, Filter, ShieldCheck, Mail, ArrowRight, Award } from 'lucide-react';
import { Post, Athlete } from '../types';

interface AthleteNetworkProps {
  posts: Post[];
  athletes: Athlete[];
  currentUser: Athlete;
  onLikePost: (postId: string) => void;
  onAddPost: (content: string, category: 'achievement' | 'update' | 'signing' | 'opportunity') => void;
  onViewAthlete: (athleteId: string) => void;
  buttonStyle: 'chameleon' | 'elastic' | 'standard';
}

export default function AthleteNetwork({
  posts,
  athletes,
  currentUser,
  onLikePost,
  onAddPost,
  onViewAthlete,
  buttonStyle,
}: AthleteNetworkProps) {
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'achievement' | 'update' | 'signing' | 'opportunity'>('update');
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState<string>('All');
  const [activeFeedCategory, setActiveFeedCategory] = useState<string>('All');

  // Comment types & state setup
  interface Comment {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
    gameStatus: string;
  }

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({
    pst_101: [
      {
        id: 'c_1',
        authorName: 'Elena Rostov',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'Outstanding performance Marcus! That 41" vertical is insane, keep soaring!',
        timestamp: '1 hour ago',
        gameStatus: '🟢 Active in Season'
      },
      {
        id: 'c_2',
        authorName: 'Liam Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        content: 'Fully deserved MVP! Your pick-and-roll plays are legendary.',
        timestamp: '45 mins ago',
        gameStatus: '🟡 In Training Camp'
      }
    ],
    pst_102: [
      {
        id: 'c_3',
        authorName: 'Liam Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        content: "Just submitted my registration. Can't wait to compete in Denver!",
        timestamp: '12 hours ago',
        gameStatus: '🟢 Active in Season'
      }
    ],
    pst_103: [
      {
        id: 'c_4',
        authorName: 'Marcus Carter',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'Sub-50s is world-class Elena! Unbelievable pacing.',
        timestamp: '14 hours ago',
        gameStatus: '🟢 Active in Season'
      }
    ]
  });

  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    pst_101: true // Keep first post expanded by default so they see comments immediately!
  });
  const [newCommentTexts, setNewCommentTexts] = useState<Record<string, string>>({});
  const [commentStatuses, setCommentStatuses] = useState<Record<string, string>>({});

  // Get active button style helper class
  const getButtonClass = (variant: 'primary' | 'secondary' = 'primary') => {
    if (buttonStyle === 'chameleon') {
      return `transition-all duration-300 ease-in-out cursor-pointer text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl border border-red-200 bg-[#FEF2F2] text-[#DC2626] hover:bg-[#ECFDF5] hover:border-[#A7F3D0] hover:text-[#059669] flex items-center justify-center gap-1.5`;
    }
    if (buttonStyle === 'elastic') {
      return `transition-all duration-200 cursor-pointer text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl text-white bg-[#1C77FF] hover:bg-blue-600 active:scale-92 hover:scale-105 shadow-md flex items-center justify-center gap-1.5`;
    }
    return `text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl text-white bg-[#0B132B] hover:bg-[#1C77FF] transition-colors flex items-center justify-center gap-1.5 cursor-pointer`;
  };

  // Toggle comments expand
  const handleToggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Submit comment
  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const txt = newCommentTexts[postId] || '';
    if (!txt.trim()) return;

    const chosenStatus = commentStatuses[postId] || '🟢 Active in Season';
    const newComment: Comment = {
      id: `c_user_${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: txt,
      timestamp: 'Just now',
      gameStatus: chosenStatus
    };

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    // Reset input
    setNewCommentTexts(prev => ({ ...prev, [postId]: '' }));
  };

  // Handle post submit
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onAddPost(newPostContent, newPostCategory);
    setNewPostContent('');
  };

  // Get list of unique sports for filter
  const sports = ['All', ...Array.from(new Set(athletes.map((a) => a.sport)))];

  // Filter athletes
  const filteredAthletes = athletes.filter((athlete) => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          athlete.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          athlete.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === 'All' || athlete.sport === sportFilter;
    return matchesSearch && matchesSport;
  });

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (activeFeedCategory === 'All') return true;
    return post.category === activeFeedCategory.toLowerCase();
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 athlete-network-id-1" id="athlete_network_view">
      
      {/* Banner / Title Header */}
      <div className="mb-10 text-left">
        <h1 className="font-sans text-3xl font-black tracking-tight text-[#0B132B]">
          Athlete Opportunity Network
        </h1>
        <p className="font-sans text-sm text-slate-500 mt-1 max-w-2xl">
          Connect with grassroots talents, track collegiate signings, celebrate verified records, and interact with professional tournament scouts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Feed & Share Update (8 cols out of 12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Create Post Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm text-left" id="card_create_post">
            <span className="font-sans text-xs font-bold text-[#0B132B] uppercase tracking-wider block mb-4">
              Share an Athletic Milestone
            </span>

            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div className="flex gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-10 w-10 rounded-full object-cover shrink-0 ring-2 ring-slate-100"
                />
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Announce a training PR, safe recovery, tournament placement, or recruitment interest..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm focus:border-[#1C77FF] focus:outline-none focus:ring-1 focus:ring-[#1C77FF]/30 placeholder:text-slate-400"
                  id="input_post_content"
                />
              </div>

              {/* Form Options */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-3.5 gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs text-slate-400 font-semibold">Category:</span>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value as any)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
                    id="select_post_category"
                  >
                    <option value="update">Training Update</option>
                    <option value="achievement">Verified Achievement</option>
                    <option value="signing">Signing Commitment</option>
                    <option value="opportunity">Recruiter Opportunity</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className={`${getButtonClass()} disabled:bg-slate-200 disabled:text-slate-400 disabled:border-transparent disabled:cursor-not-allowed px-5`}
                  id="btn_submit_post"
                >
                  <Plus className="h-4 w-4" />
                  Publish Post
                </button>
              </div>
            </form>
          </div>

          {/* Feed Filter Pills */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="feed_filters_container">
            <span className="font-sans text-sm font-black text-[#0B132Bi]">
              Recent Stream
            </span>
            
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
              {['All', 'Update', 'Achievement', 'Signing', 'Opportunity'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFeedCategory(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg tracking-wide transition-all cursor-pointer ${
                    activeFeedCategory === cat
                      ? 'bg-[#0B132B] text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List of Posts */}
          <div className="space-y-4" id="posts_list">
            {filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-white">
                <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="font-sans text-sm font-bold text-slate-500">No postings matching this category selection.</p>
                <p className="font-sans text-xs text-slate-400 mt-1">Be the first to update the athletic community by drafting a card above!</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200/85 p-5 shadow-sm text-left transition-all"
                >
                  {/* Post Author */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar with click directly triggers profile inspection */}
                      <button
                        onClick={() => post.athleteId && onViewAthlete(post.athleteId)}
                        className="relative cursor-pointer text-left focus:outline-none shrink-0"
                      >
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 hover:ring-[#1C77FF] transition-all"
                        />
                      </button>

                      <div className="text-left leading-tight">
                        <button
                          onClick={() => post.athleteId && onViewAthlete(post.athleteId)}
                          className="font-sans text-sm font-black text-[#0B132B] hover:text-[#1C77FF] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {post.authorName}
                          {post.category === 'achievement' && (
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          )}
                        </button>
                        <p className="font-sans text-[11px] text-slate-400 font-medium">
                          {post.authorTitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-sans text-[10px] text-slate-400">{post.timestamp}</span>
                      
                      {/* Category Badge */}
                      <span className={`text-[9px] uppercase font-bold tracking-widest mt-1.5 px-2 py-0.5 rounded-full ${
                        post.category === 'achievement'
                          ? 'bg-emerald-50 text-[#10B981]'
                          : post.category === 'signing'
                          ? 'bg-purple-50 text-purple-600'
                          : post.category === 'opportunity'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="font-sans text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
                    {post.content}
                  </div>

                  {/* Optional Image */}
                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden mb-4 max-h-[350px] border border-slate-100">
                      <img
                        referrerPolicy="no-referrer"
                        src={post.imageUrl}
                        alt="Accomplishment Asset"
                        className="w-full h-full object-cover hover:scale-101 transition-transform duration-550"
                      />
                    </div>
                  )}

                  {/* Likes / Comments Controls */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-3.5 pb-2">
                    
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        post.isLikedByUser
                          ? 'text-rose-500 bg-rose-50/50'
                          : 'text-[#6B7280] hover:text-rose-500 hover:bg-slate-50'
                      }`}
                    >
                      <Heart className={`h-4.5 w-4.5 ${post.isLikedByUser ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{post.likes} Likes</span>
                    </button>

                    <button
                      onClick={() => handleToggleComments(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1C77FF] hover:bg-blue-50/50 rounded-lg transition-all cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{(commentsMap[post.id] || []).length} Comments</span>
                    </button>

                  </div>

                  {/* Collapsible Comments Section */}
                  {expandedComments[post.id] && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                      {/* Comments Feed List */}
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {(commentsMap[post.id] || []).map((comment) => (
                          <div key={comment.id} className="flex gap-2.5 items-start text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100/60">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-sans font-extrabold text-slate-800 truncate">{comment.authorName}</span>
                                <span className="text-[10px] text-slate-400 font-mono shrink-0">{comment.timestamp}</span>
                              </div>
                              
                              {/* Athlete Commenter Game Status Badge */}
                              <div className="my-1 inline-flex items-center text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white text-slate-500 border border-slate-100/80 shadow-xs">
                                {comment.gameStatus}
                              </div>

                              <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))}

                        {(!commentsMap[post.id] || commentsMap[post.id].length === 0) && (
                          <p className="text-[11px] text-slate-400 text-center font-medium italic py-3 bg-slate-50/30 rounded-xl border border-dashed border-slate-100">
                            No comments yet. Initiate the discussion!
                          </p>
                        )}
                      </div>

                      {/* Comment Draft Input Form */}
                      <form onSubmit={(e) => handleAddComment(post.id, e)} className="space-y-2.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <div className="flex gap-2">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          
                          <textarea
                            rows={2}
                            value={newCommentTexts[post.id] || ''}
                            onChange={(e) => setNewCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Type a message, support quote, or recruitment query..."
                            className="flex-1 text-xs resize-none rounded-lg border border-slate-200 bg-white p-2 focus:border-[#1C77FF] focus:outline-none placeholder:text-slate-400"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-slate-100 pt-2 bg-transparent">
                          {/* Game Status selection */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">My Status:</span>
                            <select
                              value={commentStatuses[post.id] || '🟢 Active in Season'}
                              onChange={(e) => setCommentStatuses(prev => ({ ...prev, [post.id]: e.target.value }))}
                              className="text-[10px] font-black text-slate-600 bg-white rounded-lg border border-slate-200 px-2 py-1 outline-none cursor-pointer"
                            >
                              <option value="🟢 Active in Season">🟢 Active in Season</option>
                              <option value="🟡 In Training Camp">🟡 In Training Camp</option>
                              <option value="🔵 Off-Season Recovery">🔵 Off-Season Recovery</option>
                              <option value="🟣 Scouting / Open Offers">🟣 Scouting / Open Offers</option>
                              <option value="🔴 Injured / Rehab">🔴 Injured / Rehab</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            disabled={!(newCommentTexts[post.id] || '').trim()}
                            className={`${getButtonClass()} disabled:bg-slate-200 disabled:text-slate-400 disabled:border-transparent disabled:cursor-not-allowed px-4 py-1.5`}
                          >
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Athlete Directory Scaffold (4 cols out of 12) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Athlete Search Filters card */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm">
            <span className="font-sans text-xs font-extrabold text-[#0B132B] uppercase tracking-wider block mb-4">
              Scout Athlete Directory
            </span>

            <div className="space-y-3.5">
              
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter name, guard, sprinter..."
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs focus:border-[#1C77FF] focus:outline-none focus:ring-1 focus:ring-[#1C77FF]/30 placeholder:text-slate-400"
                />
              </div>

              {/* Sport filter selectors */}
              <div className="flex flex-wrap gap-1.5">
                {sports.map((sp) => (
                  <button
                    key={sp}
                    onClick={() => setSportFilter(sp)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                      sportFilter === sp
                        ? 'bg-[#1C77FF] text-white'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#0B132B]'
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Athletes List */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#6B7280]">
                Active Recruit Files ({filteredAthletes.length})
              </span>
            </div>

            <div className="space-y-3">
              {filteredAthletes.map((athlete) => (
                <div
                  key={athlete.id}
                  className="rounded-xl border border-slate-100 hover:border-[#1C77FF]/35 bg-white p-4 shadow-sm transition-all hover:shadow-md text-left flex items-start gap-3 relative overflow-hidden group"
                >
                  {/* Athlete Avatar representation */}
                  <div className="relative shrink-0">
                    <img
                      src={athlete.avatar}
                      alt={athlete.name}
                      className="h-11 w-11 rounded-full object-cover border border-slate-100"
                    />
                    {athlete.verified && (
                      <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#1C77FF] text-white">
                        <ShieldCheck className="h-2.5 w-2.5 stroke-[2.5]" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 justify-between">
                      <h4 className="font-sans text-sm font-bold text-[#0B132B] truncate group-hover:text-[#1C77FF] transition-colors">
                        {athlete.name}
                      </h4>
                      <span className="font-sans text-[10px] text-[#6B7280] font-semibold">
                        {athlete.sport}
                      </span>
                    </div>

                    <p className="font-sans text-[11px] text-slate-500 font-medium truncate">
                      {athlete.position} • {athlete.location}
                    </p>

                    {/* Simple stats teaser row */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-amber-500" />
                        <span className="font-sans text-[10px] font-bold text-slate-500">
                          {athlete.achievements.length} Verified Trophies
                        </span>
                      </div>

                      {/* Click triggers detail modal view via prop */}
                      <button
                        onClick={() => onViewAthlete(athlete.id)}
                        className="inline-flex items-center gap-0.5 text-xxs font-black text-[#1C77FF] uppercase tracking-wider group-hover:translate-x-0.5 transition-transform cursor-pointer"
                      >
                        Profile CV
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}

              {filteredAthletes.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                  <p className="font-sans text-xs text-slate-400 font-semibold">No athlete files found.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
