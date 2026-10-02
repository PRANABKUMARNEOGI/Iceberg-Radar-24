import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Menu,
  Play,
  Pause,
  X,
  Radio,
  Award,
  Settings, 
  CloudSun, 
  Filter, 
  Wind, 
  Thermometer, 
  Eye, 
  Compass, 
  Check,
  Shield,
  Building2,
  Users,
  Flag,
  Navigation
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom Marker Icon for Research Stations
const stationIcon = new L.DivIcon({
  className: 'custom-station-marker',
  html: `
    <div style="
      background-color: #ef4444;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      box-shadow: 0 0 12px rgba(239, 68, 68, 0.8);
      cursor: pointer;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <path d="M9 22v-4h6v4"></path>
        <path d="M8 6h.01"></path>
        <path d="M16 6h.01"></path>
        <path d="M12 6h.01"></path>
        <path d="M12 10h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M16 10h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M8 10h.01"></path>
        <path d="M8 14h.01"></path>
      </svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// ANTARCTIC RESEARCH STATIONS DATASET
const ANTARCTIC_RESEARCH_STATIONS = [
  {
    id: 'mcmurdo',
    name: 'McMurdo Station',
    country: 'United States 🇺🇸',
    lat: -77.846,
    lng: 166.668,
    type: 'Year-Round',
    crew: '1,000 (Summer) / 250 (Winter)',
    elevation: '24 m',
    temp: '-18°C',
    details: 'Largest community in Antarctica, serving as the logistics hub for the US Antarctic Program.'
  },
  {
    id: 'amundsen_scott',
    name: 'Amundsen-Scott South Pole Station',
    country: 'United States 🇺🇸',
    lat: -90.000,
    lng: 0.000,
    type: 'Year-Round',
    crew: '150 (Summer) / 45 (Winter)',
    elevation: '2,835 m',
    temp: '-49°C',
    details: 'Located at the Geographic South Pole; focuses on astrophysics and atmospheric science.'
  },
  {
    id: 'concordia',
    name: 'Concordia Station',
    country: 'France 🇫🇷 / Italy 🇮🇹',
    lat: -75.100,
    lng: 123.333,
    type: 'Year-Round',
    crew: '80 (Summer) / 16 (Winter)',
    elevation: '3,233 m',
    temp: '-51°C',
    details: 'Joint French-Italian research facility located on Dome C, focused on glaciology and space analogues.'
  },
  {
    id: 'maitri',
    name: 'Maitri Research Station',
    country: 'India 🇮🇳',
    lat: -70.766,
    lng: 11.733,
    type: 'Year-Round',
    crew: '65 (Summer) / 25 (Winter)',
    elevation: '130 m',
    temp: '-12°C',
    details: "India's second permanent Antarctic research station located at Schirmacher Oasis."
  },
  {
    id: 'bharati',
    name: 'Bharati Station',
    country: 'India 🇮🇳',
    lat: -69.407,
    lng: 76.191,
    type: 'Year-Round',
    crew: '72 (Summer) / 47 (Winter)',
    elevation: '35 m',
    temp: '-9°C',
    details: "India's third Antarctic research facility located near Prydz Bay with advanced oceanographic labs."
  },
  {
    id: 'palmer',
    name: 'Palmer Station',
    country: 'United States 🇺🇸',
    lat: -64.774,
    lng: -64.053,
    type: 'Year-Round',
    crew: '45 (Summer) / 12 (Winter)',
    elevation: '10 m',
    temp: '-3°C',
    details: 'Located on Anvers Island; primary biological and marine ecosystems monitoring station.'
  },
  {
    id: 'vostok',
    name: 'Vostok Station',
    country: 'Russia 🇷🇺',
    lat: -78.464,
    lng: 106.837,
    type: 'Year-Round',
    crew: '30 (Summer) / 15 (Winter)',
    elevation: '3,488 m',
    temp: '-65°C',
    details: 'Record holder for lowest naturally measured temperature (-89.2°C); sits above subglacial Lake Vostok.'
  },
  {
    id: 'halley_vi',
    name: 'Halley VI Research Station',
    country: 'United Kingdom 🇬🇧',
    lat: -75.583,
    lng: -26.200,
    type: 'Seasonal / Ski-Legged',
    crew: '70 (Summer) / Automated Winter',
    elevation: '30 m',
    temp: '-28°C',
    details: 'Modular station built on hydraulic ski legs; famously discovered the ozone hole in 1985.'
  }
];

function MapResizeFix() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function MapView({ icebergs = [], onSelectIceberg }) {
  const defaultCenter = [-65.0, -64.0];
  
  // Interactive UI State
  const [showAppBanner, setShowAppBanner] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'settings' | 'weather' | 'filters' | null
  const [showMenu, setShowMenu] = useState(false);
  
  // Sentinel Radar Loop Card State
  const [showRadarCard, setShowRadarCard] = useState(true);
  const [isPlayingRadar, setIsPlayingRadar] = useState(false);

  // Floating Action Buttons State
  const [isLiveRadioActive, setIsLiveRadioActive] = useState(true);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Research Stations Feature Toggle & Selection
  const [showStations, setShowStations] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);

  // Map Settings
  const [mapStyle, setMapStyle] = useState('satellite');
  const [tempUnit, setTempUnit] = useState('C');
  const [showRadarOverlay, setShowRadarOverlay] = useState(true);

  // Filters State
  const [selectedSize, setSelectedSize] = useState('all');
  const [minArea, setMinArea] = useState(100);

  const tileUrls = {
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-slate-950 font-sans select-none">
      <style>{`
        .leaflet-bottom.leaflet-left {
          margin-bottom: 75px !important;
          margin-left: 16px !important;
        }
      `}</style>

      {/* 1. SATELLITE MAP CANVAS */}
      <MapContainer
        center={defaultCenter}
        zoom={3}
        minZoom={2}
        maxZoom={12}
        zoomControl={false}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
      >
        <MapResizeFix />
        <ZoomControl position="bottomleft" />

        <TileLayer
          key={mapStyle}
          url={tileUrls[mapStyle]}
          attribution="&copy; ESRI / OpenStreetMap"
          noWrap={true}
          bounds={[[-90, -180], [90, 180]]}
        />

        {/* Iceberg Markers */}
        {icebergs.map((iceberg, idx) => (
          <Marker
            key={iceberg.id || iceberg.name || idx}
            position={[iceberg.lat || -65.0, iceberg.lng || -64.0]}
            eventHandlers={{
              click: () => onSelectIceberg && onSelectIceberg(iceberg)
            }}
          >
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <h3 className="font-bold text-sm">{iceberg.name || 'Iceberg Telemetry'}</h3>
                <p className="text-xs text-slate-600">
                  Lat: {iceberg.lat} | Lng: {iceberg.lng}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* RESEARCH STATION MARKERS */}
        {showStations && ANTARCTIC_RESEARCH_STATIONS.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={stationIcon}
            eventHandlers={{
              click: () => setSelectedStation(station)
            }}
          >
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Antarctic Research Base</p>
                <h3 className="font-bold text-sm">{station.name}</h3>
                <p className="text-xs text-slate-600">{station.country}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 2. OVERLAYS VIA PORTAL */}
      {typeof document !== 'undefined' && createPortal(
        <OverlayControls
          showAppBanner={showAppBanner}
          setShowAppBanner={setShowAppBanner}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          showRadarCard={showRadarCard}
          setShowRadarCard={setShowRadarCard}
          isPlayingRadar={isPlayingRadar}
          setIsPlayingRadar={setIsPlayingRadar}
          isLiveRadioActive={isLiveRadioActive}
          setIsLiveRadioActive={setIsLiveRadioActive}
          showBookmarks={showBookmarks}
          setShowBookmarks={setShowBookmarks}
          showStations={showStations}
          setShowStations={setShowStations}
          selectedStation={selectedStation}
          setSelectedStation={setSelectedStation}
          mapStyle={mapStyle}
          setMapStyle={setMapStyle}
          tempUnit={tempUnit}
          setTempUnit={setTempUnit}
          showRadarOverlay={showRadarOverlay}
          setShowRadarOverlay={setShowRadarOverlay}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          minArea={minArea}
          setMinArea={setMinArea}
        />,
        document.body
      )}
    </div>
  );
}

// Separated Component to keep overlay UI isolated and clean
function OverlayControls({
  showAppBanner,
  setShowAppBanner,
  activeModal,
  setActiveModal,
  showMenu,
  setShowMenu,
  showRadarCard,
  setShowRadarCard,
  isPlayingRadar,
  setIsPlayingRadar,
  isLiveRadioActive,
  setIsLiveRadioActive,
  showBookmarks,
  setShowBookmarks,
  showStations,
  setShowStations,
  selectedStation,
  setSelectedStation,
  mapStyle,
  setMapStyle,
  tempUnit,
  setTempUnit,
  showRadarOverlay,
  setShowRadarOverlay,
  selectedSize,
  setSelectedSize,
  minArea,
  setMinArea
}) {
  return (
    <>
      {/* TOP RIGHT HAMBURGER MENU BUTTON */}
      <div className="fixed top-4 right-4 z-[99999] pointer-events-auto">
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white p-2.5 rounded-2xl shadow-2xl backdrop-blur-md transition-all cursor-pointer flex items-center justify-center active:scale-95"
        >
          {showMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* TOP LEFT RADAR LOOP CARD */}
      {showRadarCard && (
        <div className="fixed top-4 left-4 z-[99998] pointer-events-auto w-[260px] sm:w-[300px]">
          <div className="bg-black/95 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-white font-sans space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-slate-200">
                Sentinel-1 SAR Radar Loop
              </span>
              <button
                type="button"
                onClick={() => setShowRadarCard(false)}
                className="text-slate-400 hover:text-white p-0.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative w-full h-[140px] bg-black rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
              {isPlayingRadar ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 space-y-2">
                  <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                    Streaming Telemetry...
                  </span>
                </div>
              ) : (
                <div className="text-slate-600 text-[11px] font-mono">Radar Paused</div>
              )}

              <button
                type="button"
                onClick={() => setIsPlayingRadar(!isPlayingRadar)}
                className="absolute w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700/80 hover:bg-cyan-500 hover:text-slate-950 text-white flex items-center justify-center shadow-xl transition-all transform hover:scale-110 cursor-pointer z-10"
              >
                {isPlayingRadar ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM RIGHT FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-20 right-4 z-[99998] pointer-events-auto flex flex-col gap-3 items-center">
        {/* Cyan Signal Button */}
        <button
          type="button"
          onClick={() => setIsLiveRadioActive(!isLiveRadioActive)}
          className={`w-12 h-12 rounded-full shadow-2xl border flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
            isLiveRadioActive 
              ? 'bg-cyan-500 border-cyan-300 text-slate-950 shadow-cyan-500/30' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Radio size={22} className={isLiveRadioActive ? 'animate-pulse' : ''} />
        </button>

        {/* Green Ribbon Button */}
        <button
          type="button"
          onClick={() => setShowBookmarks(!showBookmarks)}
          className={`w-12 h-12 rounded-full shadow-2xl border flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
            showBookmarks
              ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-emerald-500/30'
              : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
          }`}
        >
          <Award size={22} />
        </button>
      </div>

      {/* BOTTOM TOOLBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[99999] flex flex-col items-center pointer-events-none font-sans">
        {showAppBanner && (
          <div className="mb-2 pointer-events-auto">
            <div 
              onClick={() => alert("Redirecting to mobile app...")}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg transition-colors cursor-pointer select-none"
            >
              <span>Open in App</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAppBanner(false);
                }}
                className="hover:bg-amber-500/30 p-0.5 rounded-full transition-colors ml-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="w-full bg-[#131b2e] border-t border-slate-800/80 text-slate-300 pointer-events-auto flex items-center justify-around py-2.5 px-6 shadow-2xl select-none">
          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'settings' ? null : 'settings')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeModal === 'settings' ? 'text-amber-400' : 'hover:text-white'
            }`}
          >
            <Settings size={20} />
            <span className="text-[11px] font-medium tracking-wide">Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'weather' ? null : 'weather')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeModal === 'weather' ? 'text-amber-400' : 'hover:text-white'
            }`}
          >
            <CloudSun size={20} />
            <span className="text-[11px] font-medium tracking-wide">Weather</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal(activeModal === 'filters' ? null : 'filters')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeModal === 'filters' ? 'text-amber-400' : 'hover:text-white'
            }`}
          >
            <Filter size={20} />
            <span className="text-[11px] font-medium tracking-wide">Filters</span>
          </button>
        </div>
      </div>

      {/* HAMBURGER MENU DRAWER */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-md flex justify-end"
          onClick={() => setShowMenu(false)}
        >
          <div 
            className="w-72 bg-[#131b2e] h-full border-l border-slate-800 p-5 text-white space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Shield className="text-cyan-400" size={20} />
                <span className="font-bold text-sm tracking-wider uppercase font-mono">Radar Menu</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMenu(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs font-medium">
              <button 
                type="button"
                onClick={() => { setShowStations(!showStations); }}
                className={`w-full text-left py-2.5 px-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                  showStations ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-red-400" />
                  <span>Research Stations</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-800">
                  {ANTARCTIC_RESEARCH_STATIONS.length} Base
                </span>
              </button>

              <button 
                type="button"
                onClick={() => { setShowRadarCard(true); setShowMenu(false); }}
                className="w-full text-left py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 flex items-center gap-2 transition"
              >
                <Play size={14} className="text-cyan-400" />
                Show Radar Loop Card
              </button>

              <button 
                type="button"
                onClick={() => { setActiveModal('settings'); setShowMenu(false); }}
                className="w-full text-left py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 flex items-center gap-2 transition"
              >
                <Settings size={14} className="text-amber-400" />
                System Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESEARCH STATION DETAIL MODAL */}
      {selectedStation && (
        <div 
          className="fixed inset-0 z-[100000] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 font-sans"
          onClick={() => setSelectedStation(null)}
        >
          <div 
            className="bg-[#131b2e] border border-red-500/40 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative select-none animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 font-bold flex items-center gap-1">
                  <Building2 size={12} /> Antarctic Research Base
                </span>
                <h2 className="text-xl font-bold mt-1">{selectedStation.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStation(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Flag size={14} className="text-amber-400" /> Operating Nation</span>
                <span className="font-bold text-sm text-amber-300">{selectedStation.country}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1"><Users size={12} className="text-cyan-400" /> Crew Capacity</span>
                  <p className="font-bold text-xs">{selectedStation.crew}</p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1"><Thermometer size={12} className="text-red-400" /> Base Temp</span>
                  <p className="font-bold text-xs">{selectedStation.temp}</p>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1"><Navigation size={12} className="text-emerald-400" /> Coordinates & Elevation</span>
                <p className="font-mono text-xs text-slate-300">
                  Lat: {selectedStation.lat}° | Lng: {selectedStation.lng}° | Alt: {selectedStation.elevation}
                </p>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {selectedStation.details}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS / WEATHER / FILTERS MODALS */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-[#131b2e] border border-slate-800 text-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl relative select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-lg font-bold capitalize flex items-center gap-2">
                {activeModal === 'settings' && <Settings className="text-amber-400" size={20} />}
                {activeModal === 'weather' && <CloudSun className="text-cyan-400" size={20} />}
                {activeModal === 'filters' && <Filter className="text-emerald-400" size={20} />}
                {activeModal}
              </h2>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* SETTINGS PANEL */}
            {activeModal === 'settings' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Base Map Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'satellite', label: 'Satellite' },
                      { id: 'dark', label: 'Dark Canvas' },
                      { id: 'street', label: 'Street' }
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setMapStyle(style.id)}
                        className={`py-2 px-3 text-xs rounded-xl border flex items-center justify-center gap-1 transition cursor-pointer ${
                          mapStyle === style.id
                            ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        {mapStyle === style.id && <Check size={12} />}
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Research Stations Toggle */}
                <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-300 flex items-center gap-2">
                    <Building2 size={16} className="text-red-400" /> Show Research Stations
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStations(!showStations)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      showStations ? 'bg-red-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-slate-950 rounded-full transition-transform ${
                        showStations ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-300">Temperature Unit</span>
                  <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setTempUnit('C')}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        tempUnit === 'C' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      °C
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempUnit('F')}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        tempUnit === 'F' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      °F
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WEATHER PANEL */}
            {activeModal === 'weather' && (
              <div className="space-y-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Thermometer className="text-amber-400" size={20} />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Surface Air Temp</p>
                      <p className="text-sm font-bold">{tempUnit === 'C' ? '-14.2 °C' : '6.44 °F'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-md font-mono">
                    Antarctic Shelf
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                    <Wind className="text-cyan-400" size={18} />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Wind Drift</p>
                      <p className="text-xs font-bold">28 knots SW</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                    <Eye className="text-emerald-400" size={18} />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Visibility</p>
                      <p className="text-xs font-bold">12.5 km</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                  <Compass className="text-indigo-400" size={18} />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">Sea Current Velocity</p>
                    <p className="text-xs font-bold">1.4 knots North-East</p>
                  </div>
                </div>
              </div>
            )}

            {/* FILTERS PANEL */}
            {activeModal === 'filters' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Iceberg Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['all', 'massive', 'tabular'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 text-xs rounded-xl border capitalize transition cursor-pointer ${
                          selectedSize === size
                            ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Research Stations Filter Toggle */}
                <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-300 flex items-center gap-2">
                    <Building2 size={16} className="text-red-400" /> Research Station Layer
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStations(!showStations)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      showStations ? 'bg-red-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-slate-950 rounded-full transition-transform ${
                        showStations ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}