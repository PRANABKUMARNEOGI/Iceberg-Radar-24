import React, { useState, useEffect } from 'react';
import Login from './Login';
import MapView from './MapView';
import Dashboard from './Dashboard';
import { 
  User, Search, Menu, Play, X, Settings, CloudSun, Filter, 
  Radio, Award, ChevronDown, Route, LogOut, LayoutDashboard 
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState('map'); // 'map' or 'dashboard'
  const [icebergs, setIcebergs] = useState([]);
  const [activeIceberg, setActiveIceberg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVideo, setShowVideo] = useState(true);
  const [showTrack, setShowTrack] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    fetchIcebergs();
  }, []);

  const fetchIcebergs = async (query = '') => {
    try {
      const res = await fetch(`http://localhost:8000/api/icebergs${query ? `?query=${query}` : ''}`);
      const data = await res.json();
      setIcebergs(data);
      if (data.length > 0 && !activeIceberg) {
        setActiveIceberg(data[0]);
      }
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    fetchIcebergs(q);
  };

  // IF USER IS IN DASHBOARD VIEW
  if (currentView === 'dashboard') {
    return <Dashboard onBack={() => setCurrentView('map')} icebergs={icebergs} />;
  }

  return (
    <div className="w-screen h-screen relative flex flex-col bg-slate-950 font-sans overflow-hidden select-none">
      
      {/* 1. TOP HEADER BAR */}
      <header className="absolute top-2 left-2 right-2 z-[2000] flex items-center justify-between gap-2">
        {!isAuthenticated ? (
          <button 
            onClick={() => setShowLoginModal(true)} 
            className="flex flex-col items-center justify-center px-2.5 py-1.5 text-white bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-slate-700/80 shadow-lg min-w-[50px] cursor-pointer"
          >
            <User className="w-4 h-4 text-white" />
            <span className="text-[9px] font-bold tracking-tight uppercase leading-tight mt-0.5">LOG IN</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-cyan-400 bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-cyan-500/50 shadow-lg text-xs font-bold cursor-pointer transition-all"
            >
              <LayoutDashboard className="w-4 h-4" /> DASHBOARD
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)} 
              className="flex flex-col items-center justify-center px-2.5 py-1.5 text-rose-400 bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-rose-500/50 shadow-lg min-w-[40px] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SEARCH BAR WITH BRANDING */}
        <div className="flex-1 bg-white rounded-full px-3 py-1.5 flex items-center gap-2 shadow-2xl max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1 w-full">
            <Radio className="w-4 h-4 text-cyan-600 shrink-0 animate-pulse" />
            <span className="font-black text-slate-900 text-xs tracking-tight">icebergradar24</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Iceberg ID..." 
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none ml-1 font-mono"
            />
          </div>
        </div>

        <button className="p-2.5 text-slate-300 bg-slate-900/90 rounded-xl border border-slate-700/80 shadow-lg cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* 2. FLOATING VIDEO PREVIEW BOX */}
      {showVideo && activeIceberg && (
        <div className="absolute top-14 right-2 z-[2000] w-64 rounded-xl overflow-hidden bg-slate-900/90 border border-slate-700/80 shadow-2xl">
          <div className="relative aspect-video bg-black flex items-center justify-center">
            <video 
              src={activeIceberg.video_url} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1.5 left-2 right-2 flex justify-between items-center bg-black/60 backdrop-blur-md px-2 py-1 rounded">
              <span className="text-[10px] text-white truncate font-medium">{activeIceberg.video_title || activeIceberg.name}</span>
              <button onClick={() => setShowVideo(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAP LAYER */}
      <MapView 
        icebergs={icebergs} 
        activeIceberg={activeIceberg} 
        onSelect={(ib) => { setActiveIceberg(ib); setIsSheetOpen(true); }} 
        showTrack={showTrack} 
      />

      {/* 4. FLOATING ACTION BUTTONS */}
      <div className="absolute right-3 bottom-24 z-[2000] flex flex-col gap-2">
        <button className="p-2.5 rounded-full bg-cyan-600 text-white shadow-xl hover:bg-cyan-500 cursor-pointer">
          <Radio className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 cursor-pointer">
          <Award className="w-5 h-5" />
        </button>
      </div>

      {/* 5. FLOATING BANNER */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[2000] w-auto">
        <div className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs">
          <span>{isAuthenticated ? 'Pro Telemetry Active' : 'Open in App'}</span>
          <X className="w-3.5 h-3.5 cursor-pointer opacity-70 hover:opacity-100" />
        </div>
      </div>

      {/* 6. BOTTOM NAVIGATION BAR */}
      <nav className="absolute bottom-0 left-0 right-0 z-[2000] bg-slate-900/95 border-t border-slate-800 px-6 py-1.5 flex justify-around items-center text-slate-400">
        <button className="flex flex-col items-center gap-0.5 hover:text-white cursor-pointer">
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">Settings</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 hover:text-white cursor-pointer">
          <CloudSun className="w-5 h-5" />
          <span className="text-[10px]">Weather</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 hover:text-white cursor-pointer">
          <Filter className="w-5 h-5" />
          <span className="text-[10px]">Filters</span>
        </button>
      </nav>

      {/* 7. EXPANDABLE TELEMETRY SHEET */}
      {activeIceberg && isSheetOpen && (
        <div className="absolute bottom-14 left-0 right-0 z-[3000] bg-slate-900/95 border-t border-cyan-500/40 rounded-t-3xl p-4 text-white space-y-3 max-h-[60vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-bold text-cyan-400">{activeIceberg.name}</h3>
              <p className="text-[10px] text-slate-400">{activeIceberg.region}</p>
            </div>
            <button onClick={() => setIsSheetOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={() => setShowTrack(!showTrack)} 
            className="w-full py-2 rounded-xl bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-center gap-2 font-bold cursor-pointer"
          >
            <Route className="w-4 h-4" /> {showTrack ? 'Hide Drift Path' : 'Show Drift Path'}
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-400">AREA</span>
              <div className="font-bold text-white">{activeIceberg.area_km2} km²</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-400">DRIFT SPEED</span>
              <div className="font-bold text-emerald-400">{activeIceberg.speed_kts} kts</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-400">EST. VOLUME</span>
              <div className="font-bold text-cyan-300">{activeIceberg.metrics?.volume_km3 || 'N/A'} km³</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-400">SEA LEVEL IMPACT</span>
              <div className="font-bold text-cyan-400">+{activeIceberg.metrics?.slr_microns || 0} µm</div>
            </div>
          </div>
        </div>
      )}

      {/* 8. LOGIN MODAL OVERLAY */}
      {showLoginModal && (
        <Login 
          onClose={() => setShowLoginModal(false)} 
          onSuccess={() => {
            setIsAuthenticated(true);
            setShowLoginModal(false);
            setCurrentView('dashboard'); // Transitions directly to full dashboard on login
          }} 
        />
      )}

    </div>
  );
}