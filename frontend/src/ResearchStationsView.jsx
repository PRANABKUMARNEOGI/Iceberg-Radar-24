import React, { useState } from 'react';
import { MapPin, Globe, Compass, Activity, Thermometer, Radio, ExternalLink } from 'lucide-react';

const STATIONS_DATA = [
  {
    id: 'mcmurdo',
    name: 'McMurdo Station',
    operator: 'United States (USAP)',
    coordinates: '77°51′S 166°40′E',
    lat: -77.85,
    lng: 166.66,
    type: 'Year-Round Coastal Hub',
    population: 'Up to 1,200 (Summer)',
    purpose: 'Primary logistics hub for US Antarctic Program; astrophysics, marine biology, geology, and oceanography.',
    status: 'Active Telemetry'
  },
  {
    id: 'southpole',
    name: 'Amundsen-Scott South Pole Station',
    operator: 'United States (NSF)',
    coordinates: '90°00′S 0°00′E',
    lat: -90.0,
    lng: 0.0,
    type: 'Inland Continental (South Pole)',
    population: '150 (Summer) / 45 (Winter)',
    purpose: 'Deep space astrophysics, cosmic microwave background radiation analysis, atmospheric chemistry, and glaciology.',
    status: 'Active Telemetry'
  },
  {
    id: 'halley',
    name: 'Halley VI Research Station',
    operator: 'United Kingdom (BAS)',
    coordinates: '75°35′S 26°11′W',
    lat: -75.58,
    lng: -26.18,
    type: 'Floating Brunt Ice Shelf',
    population: '70 (Summer)',
    purpose: 'Atmospheric research, space weather monitoring, ozone layer detection, and polar space climate.',
    status: 'Automated Sensor Array'
  },
  {
    id: 'vostok',
    name: 'Vostok Station',
    operator: 'Russia (AARI)',
    coordinates: '78°28′S 106°48′E',
    lat: -78.46,
    lng: 106.8,
    type: 'Inland High Ice Sheet',
    population: '30 (Summer) / 15 (Winter)',
    purpose: 'Deep ice core drilling, paleoclimatology, subglacial Lake Vostok exploration, and extreme cold physiology.',
    status: 'Active Telemetry'
  },
  {
    id: 'bharati',
    name: 'Bharati Station',
    operator: 'India (NCPOR)',
    coordinates: '69°24′S 76°11′E',
    lat: -69.4,
    lng: 76.18,
    type: 'Year-Round Coastal (Larsemann Hills)',
    population: '47 (Summer) / 25 (Winter)',
    purpose: 'Oceanographic studies, continental breakup geology, atmospheric sciences, and satellite telemetry reception.',
    status: 'Active Telemetry'
  },
  {
    id: 'maitri',
    name: 'Maitri Station',
    operator: 'India (NCPOR)',
    coordinates: '70°45′S 11°44′E',
    lat: -70.76,
    lng: 11.73,
    type: 'Year-Round (Schirmacher Oasis)',
    population: '65 (Summer) / 25 (Winter)',
    purpose: 'Geological mapping, geomagnetism, meteorology, environmental monitoring, and human biology.',
    status: 'Active Telemetry'
  },
  {
    id: 'concordia',
    name: 'Concordia Station',
    operator: 'France & Italy (IPEV / PNRA)',
    coordinates: '75°06′S 123°20′E',
    lat: -75.1,
    lng: 123.33,
    type: 'High Plateau (Dome C)',
    population: '70 (Summer) / 16 (Winter)',
    purpose: 'High-altitude astronomy, ESA human spaceflight isolation simulations, atmospheric dynamics, and glaciology.',
    status: 'Active Telemetry'
  },
  {
    id: 'rothera',
    name: 'Rothera Research Station',
    operator: 'United Kingdom (BAS)',
    coordinates: '67°34′S 68°07′W',
    lat: -67.56,
    lng: -68.12,
    type: 'Antarctic Peninsula',
    population: '160 (Summer) / 22 (Winter)',
    purpose: 'Biological and marine science hub for the Antarctic Peninsula; glacier dynamics and climate change impact.',
    status: 'Active Telemetry'
  }
];

export default function ResearchStationsView({ onLocateOnMap }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStations = STATIONS_DATA.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          station.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          station.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'coastal') return matchesSearch && (station.type.includes('Coastal') || station.type.includes('Peninsula'));
    if (filter === 'inland') return matchesSearch && (station.type.includes('Inland') || station.type.includes('Plateau') || station.type.includes('Pole'));
    return matchesSearch;
  });

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 overflow-y-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
            <Radio size={14} className="animate-pulse" />
            <span>International Polar Network</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Antarctic Scientific Research Stations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active year-round and seasonal polar outposts conducting cryosphere, climate, and deep-space telemetry.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
          {['all', 'coastal', 'inland'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg capitalize transition font-medium cursor-pointer ${
                filter === type
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type} Outposts
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search stations by name, country operator, or research focus..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition"
        />
      </div>

      {/* Grid of Station Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((station) => (
          <div
            key={station.id}
            className="bg-[#131b2e] border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl transition-all group flex flex-col justify-between space-y-4"
          >
            {/* Top Metadata */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                  {station.operator}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {station.status}
                </span>
              </div>

              <h2 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                {station.name}
              </h2>

              <div className="flex items-center gap-3 text-slate-400 text-xs mt-2 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-cyan-400" />
                  {station.coordinates}
                </span>
                <span className="flex items-center gap-1">
                  <Globe size={12} className="text-slate-500" />
                  {station.population}
                </span>
              </div>

              <div className="mt-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
                  Station Type
                </p>
                <p className="text-xs font-medium text-slate-200">{station.type}</p>
              </div>

              <div className="mt-3">
                <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
                  Primary Research Purpose
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {station.purpose}
                </p>
              </div>
            </div>

            {/* Locate Action Button */}
            <button
              onClick={() => onLocateOnMap && onLocateOnMap(station)}
              className="w-full bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-slate-800 hover:border-cyan-400 text-cyan-400 text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg group-hover:shadow-cyan-500/10"
            >
              <Compass size={14} />
              <span>Target Coordinate on Telemetry Map</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}