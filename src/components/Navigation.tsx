/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, User, Users, Compass, LayoutDashboard, Orbit, RefreshCw } from 'lucide-react';
import { Athlete } from '../types';

interface NavigationProps {
  currentTab: 'landing' | 'network' | 'discovery' | 'dashboard' | 'profile';
  currentRole: 'athlete' | 'organizer';
  currentUser: Athlete;
  onTabChange: (tab: 'landing' | 'network' | 'discovery' | 'dashboard' | 'profile') => void;
  onRoleToggle: () => void;
  isLoggedIn: boolean;
  onLogOut: () => void;
  onTriggerAuth: () => void;
  buttonStyle: 'chameleon' | 'elastic' | 'standard';
  onButtonStyleChange: (style: 'chameleon' | 'elastic' | 'standard') => void;
}

export default function Navigation({
  currentTab,
  currentRole,
  currentUser,
  onTabChange,
  onRoleToggle,
  isLoggedIn,
  onLogOut,
  onTriggerAuth,
  buttonStyle,
  onButtonStyleChange,
}: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/85 backdrop-blur-lg nav-id-1">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <button
          onClick={() => onTabChange('landing')}
          className="flex items-center gap-2 group transition-all"
          id="nav_brand_logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B132B] text-white shadow-md shadow-blue-500/10 transition-transform group-hover:scale-105">
            <Orbit className="h-5 w-5 text-[#38BDF8] stroke-[2.5]" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-sans text-xl font-extrabold tracking-tight text-[#0B132B]">
              Sports<span className="text-[#1C77FF]">OS</span>
            </span>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-400">
              Identity Network
            </span>
          </div>
        </button>

        {/* Global Nav tabs */}
        <nav className="hidden md:flex items-center gap-1" id="nav_menu_links">
          <button
            id="nav_link_landing"
            onClick={() => onTabChange('landing')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'landing'
                ? 'text-[#1C77FF] bg-blue-50/50'
                : 'text-[#6B7280] hover:text-[#0B132B] hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          
          <button
            id="nav_link_network"
            onClick={() => onTabChange('network')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'network'
                ? 'text-[#1C77FF] bg-blue-50/50 font-semibold'
                : 'text-[#6B7280] hover:text-[#0B132B] hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            Athlete Network
          </button>

          <button
            id="nav_link_discovery"
            onClick={() => onTabChange('discovery')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'discovery'
                ? 'text-[#1C77FF] bg-blue-50/50 font-semibold'
                : 'text-[#6B7280] hover:text-[#0B132B] hover:bg-slate-50'
            }`}
          >
            <Compass className="h-4 w-4" />
            Discover Events
          </button>

          <button
            id="nav_link_dashboard"
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'dashboard'
                ? 'text-[#1C77FF] bg-blue-50/50 font-semibold'
                : 'text-[#6B7280] hover:text-[#0B132B] hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Command Center
          </button>

          <button
            id="nav_link_profile"
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'profile'
                ? 'text-[#1C77FF] bg-blue-50/50 font-semibold'
                : 'text-[#6B7280] hover:text-[#0B132B] hover:bg-slate-50'
            }`}
          >
            <User className="h-4 w-4" />
            My Portfolio
          </button>
        </nav>

        {/* Right side Profile dropdown / Role switcher */}
        <div className="flex items-center gap-3" id="nav_right_actions">
          
          {/* Quick Role Toggle Option */}
          <button
            onClick={onRoleToggle}
            id="btn_nav_role_toggle"
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
              currentRole === 'organizer'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-sm'
                : 'bg-blue-50 text-[#1C77FF] border-blue-200 hover:bg-blue-100 shadow-sm'
            }`}
            title="Toggle user context to experience both application dimensions"
          >
            <RefreshCw className="h-3.5 w-3.5 animate-spin-slow text-current" />
            <span className="hidden sm:inline">Role: {currentRole}</span>
          </button>

          {/* Button Visual Style & Theme switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 p-1 rounded-xl" id="nav_button_style_picker">
            <span className="font-mono text-[9px] text-slate-400 font-extrabold uppercase px-1 hidden sm:inline">Btn Style:</span>
            {(['chameleon', 'elastic', 'standard'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onButtonStyleChange(mode)}
                className={`px-2 py-0.5 text-[9px] font-black rounded-lg capitalize transition-all cursor-pointer ${
                  buttonStyle === mode
                    ? mode === 'chameleon'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200/50 shadow-sm'
                      : mode === 'elastic'
                      ? 'bg-blue-100 text-[#1C77FF] border border-blue-200/50 shadow-sm'
                      : 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Quick Profile shortcut */}
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

          {isLoggedIn ? (
            <>
              <button
                onClick={() => onTabChange('profile')}
                className="flex items-center gap-2 text-left group"
                id="btn_header_profile"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-[#1C77FF] transition-all"
                  />
                  {currentUser.verified && (
                    <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#1C77FF] text-white">
                      <ShieldCheck className="h-3 w-3 stroke-[2.5]" />
                    </span>
                  )}
                </div>
                <div className="hidden lg:flex flex-col leading-tight">
                  <span className="font-sans text-xs font-semibold text-[#0B132B] group-hover:text-[#1C77FF] transition-colors">
                    {currentUser.name}
                  </span>
                  <span className="font-sans text-[10px] text-[#6B7280] capitalize">
                    {currentUser.userRole === 'viewer' ? 'Viewer / Scout' : `${currentUser.sport} • ${currentUser.category || 'junior'}`}
                  </span>
                </div>
              </button>

              <button
                onClick={onLogOut}
                className="ml-1 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 bg-red-50/70 hover:bg-red-100 px-2 py-1 rounded-md border border-red-100 transition-all cursor-pointer"
                id="btn_header_logout"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={onTriggerAuth}
              className="text-xs font-bold uppercase tracking-wider text-white bg-[#1C77FF] hover:bg-blue-600 px-4 py-1.5 rounded-full shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              id="btn_header_login"
            >
              Sign In
            </button>
          )}

        </div>
      </div>

      {/* Global Tabs Navigation on Mobile */}
      <div className="md:hidden border-t border-slate-100 bg-white flex justify-around py-2 px-1">
        <button
          onClick={() => onTabChange('landing')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-medium transition-all ${
            currentTab === 'landing' ? 'text-[#1C77FF]' : 'text-[#6B7280]'
          }`}
        >
          <Orbit className="h-4.5 w-4.5 mb-0.5" />
          Overview
        </button>
        <button
          onClick={() => onTabChange('network')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-medium transition-all ${
            currentTab === 'network' ? 'text-[#1C77FF]' : 'text-[#6B7280]'
          }`}
        >
          <Users className="h-4.5 w-4.5 mb-0.5" />
          Network
        </button>
        <button
          onClick={() => onTabChange('discovery')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-medium transition-all ${
            currentTab === 'discovery' ? 'text-[#1C77FF]' : 'text-[#6B7280]'
          }`}
        >
          <Compass className="h-4.5 w-4.5 mb-0.5" />
          Events
        </button>
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-medium transition-all ${
            currentTab === 'dashboard' ? 'text-[#1C77FF]' : 'text-[#6B7280]'
          }`}
        >
          <LayoutDashboard className="h-4.5 w-4.5 mb-0.5" />
          Command
        </button>
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-medium transition-all ${
            currentTab === 'profile' ? 'text-[#1C77FF]' : 'text-[#6B7280]'
          }`}
        >
          <User className="h-4.5 w-4.5 mb-0.5" />
          Portfolio
        </button>
      </div>
    </header>
  );
}
