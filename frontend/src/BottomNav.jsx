import React, { useState } from 'react';
import { Settings, CloudSun, Filter, X } from 'lucide-react';

export default function BottomNav({ onOpenSettings, onOpenWeather, onOpenFilters }) {
  const [showAppBanner, setShowAppBanner] = useState(true);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex flex-col items-center">
      {/* 1. FLOATING 'OPEN IN APP' BANNER */}
      {showAppBanner && (
        <div className="mb-2 pointer-events-auto">
          <div className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg transition-colors cursor-pointer">
            <span onClick={() => alert("Redirecting to app...")}>Open in App</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAppBanner(false);
              }}
              className="hover:bg-amber-500/30 p-0.5 rounded-full transition-colors ml-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 2. BOTTOM TOOLBAR BAR */}
      <div className="w-full bg-[#131b2e] border-t border-slate-800/60 text-slate-300 pointer-events-auto flex items-center justify-around py-2 px-6 shadow-2xl">
        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors group cursor-pointer"
        >
          <Settings size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-medium tracking-wide">Settings</span>
        </button>

        {/* Weather Button */}
        <button
          onClick={onOpenWeather}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors group cursor-pointer"
        >
          <CloudSun size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-medium tracking-wide">Weather</span>
        </button>

        {/* Filters Button */}
        <button
          onClick={onOpenFilters}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors group cursor-pointer"
        >
          <Filter size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-medium tracking-wide">Filters</span>
        </button>
      </div>
    </div>
  );
}