import React from 'react';

export default function InvalidGamesTicker() {
  const items = [
    { name: 'Rugby', emoji: '🏉', status: 'Scope Restricted' },
    { name: 'Baseball', emoji: '⚾', status: 'Platform Restricted' },
    { name: 'Hockey', emoji: '🏑', status: 'Scope Restricted' },
    { name: 'Volleyball', emoji: '🏐', status: 'Platform Restricted' },
    { name: 'Golf', emoji: '🏌️', status: 'Scope Restricted' },
    { name: 'Boxing', emoji: '🥊', status: 'Platform Restricted' },
    { name: 'Swimming', emoji: '🏊', status: 'Scope Restricted' },
    { name: 'Badminton', emoji: '🏸', status: 'Platform Restricted' },
    { name: 'Table Tennis', emoji: '🏓', status: 'Scope Restricted' },
    { name: 'American Football', emoji: '🏈', status: 'Platform Restricted' },
    { name: 'Ice Hockey', emoji: '🏒', status: 'Scope Restricted' },
    { name: 'Gymnastics', emoji: '🤸', status: 'Platform Restricted' },
  ];
  
  // Duplicate the array for a seamless infinite loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="w-full bg-[#0F172A]/75 backdrop-blur-md border border-red-500/10 rounded-2xl p-3 overflow-hidden shadow-inner relative" id="invalid_games_ribbon">
      {/* Decorative indicator lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Ticker badge */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 border border-red-500/30 rounded-lg text-[10px] font-black uppercase text-red-400 tracking-wider z-10 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
          Restricted Sports
        </div>
        
        {/* Infinite Left-to-Right Scrolling Container */}
        <div className="flex-1 w-full overflow-hidden relative">
          <div className="flex gap-4 animate-marquee-ltr select-none whitespace-nowrap py-1">
            {duplicatedItems.map((game, index) => (
              <div 
                key={`${game.name}-${index}`}
                className="inline-flex items-center gap-2 bg-[#1E293B]/70 border border-slate-800/80 rounded-xl px-3 py-1.5 text-slate-300 shadow-sm hover:border-red-500/25 transition-colors"
              >
                <span className="text-sm">{game.emoji}</span>
                <span className="text-xs font-bold font-sans">{game.name}</span>
                <span className="text-[9px] uppercase font-black tracking-widest text-red-400/85 bg-red-950/45 px-1.5 py-0.5 rounded border border-red-950/60">
                  {game.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
