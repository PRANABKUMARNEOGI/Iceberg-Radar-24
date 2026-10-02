import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import jsPDF from 'jspdf';
import { 
  ArrowLeft, Radar, Activity, Globe, Compass, 
  Layers, AlertTriangle, Cpu, ShieldCheck, MapPin, 
  Anchor, Box, Plane, Footprints, Flame, Camera, 
  BookOpen, ChevronRight, Sparkles, Leaf, Fish, UserCheck,
  X, CheckCircle2, CreditCard, Calendar, Clock, DollarSign, Shield,
  Star, MessageSquare, ThumbsUp, Send, Filter, Info
} from 'lucide-react';
import AiVoiceAssistant from './AiVoiceAssistant';
import { Building2 } from 'lucide-react';
import ResearchStationsView from './ResearchStationsView';
// Implemented or placeholder components for imported dependencies
const FloraFaunaCard = ({ item, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between"
  >
    <div>
      <div className="h-44 overflow-hidden relative">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
          {item.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
          {item.name}
        </h3>
        <p className="text-xs italic text-cyan-500/80 mb-2">{item.latinName}</p>
        <p className="text-xs text-slate-400 line-clamp-2">{item.summary}</p>
      </div>
    </div>
    <div className="p-4 pt-0">
      <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-xl transition-all border border-cyan-500/20">
        View Species Profile
      </button>
    </div>
  </div>
);

const CryoAiAssistantCard = ({ onOpen }) => (
  <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl">
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-white">Cryo-AI Polar Assistant</h4>
        <p className="text-[10px] text-slate-400">Ask real-time questions about Antarctic climate & species</p>
      </div>
    </div>
    <button 
      onClick={onOpen}
      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
    >
      Voice Query
    </button>
  </div>
);

// --- ENHANCED ACCURATE 3D ICEBERG MODEL ---
function Iceberg3DViewer({ peakHeight = 52, keelDepth = 240, icebergId = 'A-76A' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 25, 160);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    sunLight.position.set(60, 90, 60);
    scene.add(sunLight);

    const deepOceanLight = new THREE.DirectionalLight(0x0284c7, 1.5);
    deepOceanLight.position.set(-60, -90, -60);
    scene.add(deepOceanLight);

    // Water Grid Plane
    const waterGeo = new THREE.PlaneGeometry(220, 220, 24, 24);
    const waterMat = new THREE.MeshBasicMaterial({ 
      color: 0x0284c7, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.25 
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = 0;
    scene.add(waterMesh);

    // Dynamic Iceberg Mesh Generation
    const scaleFactor = 0.25;
    const totalVisualHeight = (peakHeight + keelDepth) * scaleFactor;
    const surfaceYOffset = (peakHeight * scaleFactor) - (totalVisualHeight / 2);

    const cylinderGeo = new THREE.CylinderGeometry(22, 14, totalVisualHeight, 28, 32);
    const pos = cylinderGeo.attributes.position;

    const seed = icebergId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    for (let i = 0; i < pos.count; i++) {
      let vx = pos.getX(i);
      let vy = pos.getY(i);
      let vz = pos.getZ(i);

      const normalizedY = (vy + totalVisualHeight / 2) / totalVisualHeight;

      if (normalizedY < 0.8) {
        const keelBulge = Math.sin(normalizedY * Math.PI) * 12;
        const noisyX = Math.sin(vy * 0.15 + seed) * 4;
        const noisyZ = Math.cos(vy * 0.15 + seed) * 4;
        vx += (vx > 0 ? 1 : -1) * keelBulge + noisyX;
        vz += (vz > 0 ? 1 : -1) * keelBulge + noisyZ;
      } else {
        const topRuggedness = (Math.sin(vx * 0.4) + Math.cos(vz * 0.4)) * 3;
        vy += topRuggedness;
      }

      pos.setX(i, vx);
      pos.setY(i, vy);
      pos.setZ(i, vz);
    }
    cylinderGeo.computeVertexNormals();

    const icebergMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.2,
      metalness: 0.1,
      flatShading: true,
      transparent: true,
      opacity: 0.92,
    });

    const icebergMesh = new THREE.Mesh(cylinderGeo, icebergMat);
    icebergMesh.position.y = surfaceYOffset;
    scene.add(icebergMesh);

    const wireGeo = new THREE.WireframeGeometry(cylinderGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    icebergMesh.add(wireframe);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      icebergMesh.rotation.y += 0.003;
      waterMesh.rotation.z += 0.0008;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container) container.innerHTML = '';
    };
  }, [peakHeight, keelDepth, icebergId]);

  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950">
      <div ref={mountRef} className="w-full h-full" />
      
      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
        <Box className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
        <span>DYNAMIC BATHYMETRY MODEL</span>
      </div>

      <div className="absolute top-8 right-4 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 p-2 rounded-lg text-emerald-400 font-mono text-[10px]">
        <div className="font-bold flex items-center gap-1">▲ HIGHEST PINNACLE</div>
        <div className="text-white text-xs font-black">+{peakHeight} m <span className="text-[9px] text-slate-400">(Freeboard Height)</span></div>
      </div>

      <div className="absolute bottom-8 right-4 bg-rose-950/80 backdrop-blur-md border border-rose-500/50 p-2 rounded-lg text-rose-400 font-mono text-[10px]">
        <div className="font-bold flex items-center gap-1">▼ DEEPEST DRAFT KEEL</div>
        <div className="text-white text-xs font-black">-{keelDepth} m <span className="text-[9px] text-slate-400">(Subsurface Depth)</span></div>
      </div>

      <div className="absolute top-1/2 left-3 -translate-y-1/2 bg-cyan-950/80 border border-cyan-500/50 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-400">
        WATERLINE (0m)
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD LAYOUT COMPONENT ---
export default function Dashboard({ onBack, icebergs = [] }) {
  const [activeMenu, setActiveMenu] = useState('telemetry');
  const [selectedIceberg, setSelectedIceberg] = useState(icebergs[0] || null);
  const [liveIcebergs, setLiveIcebergs] = useState(icebergs.length > 0 ? icebergs : [
    { id: 'a76a', name: 'Iceberg A-76A', lat: -65.25, lng: -64.10, speed_kts: 1.4, area_km2: 3200 },
    { id: 'd28a', name: 'Iceberg D-28A', lat: -68.40, lng: -60.20, speed_kts: 0.9, area_km2: 1450 }
  ]);

  // 👇 PASTE THE LIVE DRIFT HOOK RIGHT HERE
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveIcebergs(prev =>
        prev.map(ib => ({
          ...ib,
          lat: Number((ib.lat + (Math.random() - 0.5) * 0.02).toFixed(4)),
          lng: Number((ib.lng + (Math.random() - 0.5) * 0.03).toFixed(4)),
          speed_kts: Number((1.0 + Math.random() * 1.5).toFixed(1))
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  // Modal States
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedFloraFauna, setSelectedFloraFauna] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedScientist, setSelectedScientist] = useState(null);

  // Booking Form States
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Standard Suite');

  // Review System States
  const [reviewCategory, setReviewCategory] = useState('all');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewType, setNewReviewType] = useState('Expedition');

  // Carbon Calculator State
  const [age, setAge] = useState(25);
  const [flightsPerYear, setFlightsPerYear] = useState(2);
  const [carKmPerYear, setCarKmPerYear] = useState(10000);

  useEffect(() => {
    if (icebergs.length > 0 && !selectedIceberg) {
      setSelectedIceberg(icebergs[0]);
    }
  }, [icebergs]);

  // Telemetry metrics
  const currentPeakHeight = selectedIceberg?.metrics?.freeboard_m || selectedIceberg?.freeboard_m || 48;
  const currentKeelDepth = selectedIceberg?.metrics?.draft_m || selectedIceberg?.draft_m || 220;

  // Carbon Calculations
  const annualFlightCO2 = flightsPerYear * 1.2;
  const annualCarCO2 = (carKmPerYear / 1000) * 0.19;
  const annualBaseCO2 = 4.5;
  const annualTotal = annualFlightCO2 + annualCarCO2 + annualBaseCO2;
  const lifetimeCO2 = Math.round(annualTotal * age);
  const iceMeltTons = Math.round(lifetimeCO2 * 3.0);

  const navMenuItems = [
    { id: 'telemetry', label: 'Telemetry & 3D Topography', icon: Activity, desc: 'Real-time radar & 3D keel depth' },
    {
    id: 'stations',
    label: 'Antarctic Research Stations',
    desc: 'Outpost locations, operators & purpose',
    icon: Building2
  },
  {
    id: 'travel',
    label: 'Travel Packages to Antarctica',
    desc: 'Polar cruises & kayak safaris',
    icon: Plane
  },
  {
    id: 'history',
    label: 'History & Scientists',
    icon: BookOpen,
    desc: 'Explorers, research & stations'
  },
  {
    id: 'flora_fauna',
    label: 'Flora & Fauna of Antarctica',
    icon: Fish,
    desc: 'Penguins, seals & polar plants'
  },
  {
    id: 'places',
    label: 'Places to Visit',
    icon: Camera,
    desc: 'Landmarks, bays & iceberg alleys'
  },
  {
    id: 'reviews',
    label: 'Guest & App Reviews',
    icon: Star,
    desc: 'Ratings & visitor feedback'
  },
  {
    id: 'carbon',
    label: 'Lifetime Carbon Footprint',
    icon: Flame,
    desc: 'Calculate your glacial ice impact'
  }
];

  // DATA: Flora & Fauna Details
  const floraFaunaData = [
    {
      id: 'emperor-penguin',
      name: 'Emperor Penguin',
      latinName: 'Aptenodytes forsteri',
      category: 'Fauna (Avian)',
      image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80',
      summary: 'Endures winter blizzards on pack ice to breed at -50°C.',
      habitat: 'Fast ice attached to Antarctic coastline',
      population: 'approx. 595,000 adult individuals',
      diet: 'Antarctic krill, silverfish, and squid',
      adaptation: 'Four layers of dense scale-like feathers and reciprocal heat-exchange circulatory system in flippers.',
      facts: [
        'The tallest and heaviest of all living penguin species.',
        'Males incubate single eggs on top of their feet for 65+ consecutive winter days without eating.',
        'Can dive to depths of up to 564 meters (1,850 ft) for over 20 minutes.'
      ]
    },
    {
      id: 'weddell-seal',
      name: 'Weddell Seal',
      latinName: 'Leptonychotes weddellii',
      category: 'Fauna (Mammal)',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      summary: 'Deep-diving mammal capable of diving 600m under ice shelves.',
      habitat: 'Fast ice and coastal ice packs of Antarctica',
      population: 'approx. 800,000',
      diet: 'Dissostichus mawsoni (Antarctic toothfish), cephalopods, and krill',
      adaptation: 'Uses specialized incisor and canine teeth to saw breathing holes through thick sea ice.',
      facts: [
        'Has the southernmost distribution of any mammal on Earth.',
        'Can remain underwater for up to 80 minutes by collapsing its lungs and storing oxygen in muscle tissue.',
        'Communicates using complex trills, buzzes, and chirps underwater that sound like sci-fi sound effects.'
      ]
    },
    {
      id: 'antarctic-krill',
      name: 'Antarctic Krill',
      latinName: 'Euphausia superba',
      category: 'Fauna (Crustacean)',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      summary: 'Total biomass > 400M tons; underpins all polar ocean food webs.',
      habitat: 'Southern Ocean surface layer down to 350 meters',
      population: 'Estimated 500 trillion individuals',
      diet: 'Microscopic phytoplankton and ice algae',
      adaptation: 'Can shrink in size and undergo "starvation rejuvenation" during dark polar winters.',
      facts: [
        'Forms massive swarming schools spanning kilometers with densities of 30,000 individuals per cubic meter.',
        'Emits bioluminescent light from specialized organs located near its eyes and legs.',
        'The cornerstone organism supporting whales, seals, penguins, and seabirds in the Southern Ocean.'
      ]
    },
    {
      id: 'antarctic-hairgrass',
      name: 'Antarctic Hairgrass',
      latinName: 'Deschampsia antarctica',
      category: 'Flora (Vascular Plant)',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      summary: 'One of only two native vascular flowering plant species in Antarctica.',
      habitat: 'Exposed rocky slopes of Antarctic Peninsula and South Shetland Islands',
      population: 'Expanding rapidly due to warming coastal summers',
      diet: 'Photosynthesis with high UV-resistance mechanisms',
      adaptation: 'Synthesizes specialized antifreeze proteins that prevent ice crystals from damaging cell walls.',
      facts: [
        'Survives freezing temperatures down to -30°C while maintaining photosynthesis capability at 0°C.',
        'Thrives in nitrogen-rich soils surrounding penguin colonies.',
        'Serves as a key indicator plant for climate monitoring along the peninsula.'
      ]
    }
  ];

  // DATA: Places to Visit
  const placesData = [
    {
      id: 'lemaire-channel',
      name: 'Lemaire Channel ("Kodak Gap")',
      coordinates: '65°04\'S 63°57\'W',
      category: 'Glacial Passage',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      description: 'A narrow 11-km passage flanked by sheer 700m ice cliffs and towering glaciers.',
      highlights: ['Floating icebergs', 'Humpback whale pods', 'Crabeater seal ice-floe resting sites'],
      bestTime: 'December - February',
      safetyRating: 'High Ice Hazard - Requires Icebreaker Escort'
    },
    {
      id: 'deception-island',
      name: 'Deception Island Caldera',
      coordinates: '62°57\'S 60°38\'W',
      category: 'Active Volcanic Caldera',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      description: 'A ring-shaped active volcanic island featuring natural geothermal black sand beaches.',
      highlights: ['Whalers Bay historical ruins', 'Geothermal thermal springs', 'Chinstrap penguin colonies'],
      bestTime: 'November - March',
      safetyRating: 'Volcanic & Seismic Monitoring Active'
    },
    {
      id: 'paradise-harbour',
      name: 'Paradise Harbour & Almirante Brown',
      coordinates: '64°53\'S 62°52\'W',
      category: 'Glacial Bay',
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
      description: 'Serene bay framed by reflection-like waters and calvings from colossal tidewater glaciers.',
      highlights: ['Zodiac cruising among blue icebergs', 'Argentine research base vantage point', 'Snow petrel nesting sites'],
      bestTime: 'December - January',
      safetyRating: 'Stable Anchorage & Low Wind Shelter'
    }
  ];

  // DATA: Scientists
  const scientistContributions = [
    {
      id: 'james-ross',
      name: 'Dr. James Clark Ross',
      years: '1800 - 1862',
      station: 'McMurdo Station Area & Ross Dependency',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      research: 'Discovered the Ross Sea, Great Ice Barrier (Ross Ice Shelf), and Mount Erebus.',
      contribution: 'Pioneered early magnetic surveys and charted coastlines where the US established McMurdo Base (1955).',
      timeline: ['1839: Departed HMS Erebus & Terror', '1841: Charted Ross Ice Shelf edge', '1842: Reached farthest south record']
    },
    {
      id: 'joseph-farman',
      name: 'Dr. Joseph Farman & BAS Team',
      years: '1985 Scientific Breakthrough',
      station: 'Halley Research Station (British Antarctic Survey)',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      research: 'Discovered the Antarctic Ozone Hole using atmospheric spectrometer measurements.',
      contribution: 'Transformed Halley Station into a world-pivotal observatory, directly inspiring the Montreal Protocol.',
      timeline: ['1957: Dobson spectrophotometer installed', '1982: 40% depletion detected', '1985: Landmark Nature paper published']
    },
    {
      id: 'douglas-mawson',
      name: 'Dr. Douglas Mawson',
      years: '1882 - 1958',
      station: 'Mawson Station (Australian Antarctic Division)',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      research: 'Geological mapping, meteorology, and magnetic poles discovery in East Antarctica.',
      contribution: 'Led the Australasian Expedition; Cape Denison huts formed the baseline for Mawson Station (1954).',
      timeline: ['1911: Australasian Expedition launch', '1912: Far Eastern Sledging Party', '1954: Mawson Station established']
    }
  ];

  // DATA: Travel Packages
  const travelPackages = [
    {
      id: 'peninsula-odyssey',
      title: 'Antarctic Peninsula Odyssey',
      category: 'Classic Peninsula',
      duration: '11 Days',
      departs: 'Ushuaia, Argentina',
      price: 8950,
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
      description: 'Sail Drake Passage, explore Paradise Harbour, and witness massive gentoo penguin colonies.',
      itinerary: [
        { day: 'Day 1-2', title: 'Embarkation & Drake Passage', details: 'Board polar icebreaker in Ushuaia. Sail past Cape Horn through the iconic Drake Passage with oceanic seabird watching.' },
        { day: 'Day 3-4', title: 'South Shetland Islands', details: 'Zodiac landings at Half Moon Island and Deception Island volcanic caldera. Observe Chinstrap penguins.' },
        { day: 'Day 5-7', title: 'Antarctic Peninsula & Paradise Harbour', details: 'Weave through icebergs in Paradise Bay and Lemaire Channel. Guided shore walks on mainland ice sheet.' },
        { day: 'Day 8-9', title: 'Wilhelmina Bay & Iceberg Navigation', details: 'Search for humpback whales feeding amidst tabular iceberg fields. Optional polar plunge.' },
        { day: 'Day 10-11', title: 'Return Passage & Disembarkation', details: 'Return via Drake Passage with recap lectures by marine biologists. Disembark in Ushuaia.' }
      ]
    },
    {
      id: 'weddell-kayaking',
      title: 'Weddell Sea Iceberg Kayaking',
      category: 'Iceberg Safari',
      duration: '8 Days',
      departs: 'Punta Arenas, Chile',
      price: 13200,
      image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=600&q=80',
      description: 'Fly directly to King George Island and kayak alongside gigantic tabular icebergs with marine biologists.',
      itinerary: [
        { day: 'Day 1', title: 'Flight to King George Island', details: 'Fly across Drake Passage on specialized flight to Antarctic research outpost landing strip.' },
        { day: 'Day 2-3', title: 'Weddell Sea Entry', details: 'Board specialized expedition ship into Weddell Sea, home to colossal tabular icebergs.' },
        { day: 'Day 4-6', title: 'Sea Kayaking Expeditions', details: 'Daily guided kayak runs through glacial archways and sea ice leads alongside Weddell seal pods.' },
        { day: 'Day 7-8', title: 'Paulet Island & Return Flight', details: 'Visit Adélie penguin colonies on Paulet Island before taking flight back to Chile.' }
      ]
    },
    {
      id: 'ross-sea-circuit',
      title: 'South Georgia & Monster Iceberg Circuit',
      category: 'Ross Sea Expedition',
      duration: '19 Days',
      departs: 'Ushuaia, Argentina',
      price: 21500,
      image: 'https://images.unsplash.com/photo-1516571748831-5d81767bfa88?auto=format&fit=crop&w=600&q=80',
      description: 'Track colossal icebergs breaking off Ross Ice Shelf, visit Shackleton’s grave, and see King Penguins.',
      itinerary: [
        { day: 'Day 1-3', title: 'South Atlantic Crossing', details: 'Sail northeast from Argentina toward sub-Antarctic wildlife havens.' },
        { day: 'Day 4-8', title: 'South Georgia Island Sanctuary', details: 'Walk among 100,000 King Penguins at Salisbury Plain and pay homage at Shackleton’s final resting site.' },
        { day: 'Day 9-14', title: 'Monster Iceberg Alley & Ross Shelf', details: 'Track massive icebergs (A-76A, A-23A) floating through deep currents. Helicopter flights over Ross Shelf.' },
        { day: 'Day 15-19', title: 'Antarctic Continent & Return', details: 'Shore visits at historical huts (Scott & Shackleton) before returning to South America.' }
      ]
    }
  ];

  // DATA: Initial Reviews State
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: 'Captain Eleanor Vance',
      rating: 5,
      date: '2026-09-14',
      type: 'Expedition',
      badge: 'Verified Explorer',
      title: 'Unbelievable 3D Topography accuracy and smooth voyage!',
      comment: 'The 3D keel depth telemetry matched our sonar readings in Paradise Harbour almost perfectly! Kayaking among tabular icebergs in Weddell Sea was a bucket-list dream fulfilled.',
      likes: 24
    },
    {
      id: 2,
      author: 'Dr. Marcus Thorne',
      rating: 5,
      date: '2026-08-28',
      type: 'Portal App',
      badge: 'Glaciology Researcher',
      title: 'Crucial app tool for tracking drift trajectories',
      comment: 'As a climate analyst, having real-time sea level rise microns and mass volume calculations right on my tablet made our fieldwork presentation seamless. Phenomenal UI!',
      likes: 19
    },
    {
      id: 3,
      author: 'Sophia & Liam Martinez',
      rating: 5,
      date: '2026-08-02',
      type: 'Wildlife',
      badge: 'Verified Guest',
      title: 'Emperor Penguins & Lemaire Channel were breathtaking',
      comment: 'The itinerary details provided in the card popup were spot on. We saw hundreds of Emperor penguins and humpback whales right alongside our Zodiac. Unforgettable trip!',
      likes: 31
    }
  ]);
 
  const handleBookingSubmit = (e) => {
  e.preventDefault();
  
  const bookingRef = 'ANT-' + Math.floor(100000 + Math.random() * 900000);
  
  // Generate and download PDF ticket
  generatePDFTicket(bookingRef);
  
  // Show success screen
  setBookingSuccess(true);
};


  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText) return;

    const newEntry = {
      id: Date.now(),
      author: newReviewAuthor,
      rating: Number(newReviewRating),
      date: new Date().toISOString().split('T')[0],
      type: newReviewType,
      badge: 'Verified User',
      title: `${newReviewType} Review`,
      comment: newReviewText,
      likes: 0
    };

    setReviewsList([newEntry, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setNewReviewRating(5);
  };

  const filteredReviews = reviewCategory === 'all' 
    ? reviewsList 
    : reviewsList.filter(r => r.type.toLowerCase() === reviewCategory.toLowerCase());
    // Step 4: PDF Ticket Generator Function
  const generatePDFTicket = (bookingRef) => {
    const doc = new jsPDF();

    // Dark Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');

    // Branding / Header Text
    doc.setTextColor(6, 182, 212); // cyan-500
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('POLAR EXPEDITIONS PASS', 15, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`BOOKING REF: #${bookingRef}`, 15, 30);
    doc.text(`ISSUED: ${new Date().toLocaleDateString()}`, 140, 30);

    // Expedition Title Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedPackage?.title || 'Antarctic Peninsula Odyssey', 15, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(
      `${selectedPackage?.duration || '11 Days'} • Departs: ${
        selectedPackage?.departs || 'Ushuaia, Argentina'
      }`,
      15,
      62
    );

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 68, 195, 68);

    // Ticket Details Table
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Passenger Name:', 15, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(fullName || 'Guest Passenger', 65, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('Email Address:', 15, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(email || 'N/A', 65, 90);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method:', 15, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentMethod.toUpperCase(), 65, 100);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment Status:', 15, 110);
    doc.setTextColor(16, 185, 129); // Green
    doc.text('CONFIRMED / PAID', 65, 110);

    // Download PDF
    doc.save(`Boarding_Pass_${bookingRef}.pdf`);
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* HEADER */}
      <header className="px-6 py-3.5 bg-slate-900/90 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-cyan-400 text-xs font-bold transition-all border border-cyan-500/20 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Live Map View
          </button>
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="font-black tracking-widest text-sm text-cyan-400 uppercase">
              Cryosphere Telemetry & Expedition Portal
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> SYSTEM ONLINE
        </span>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: NAVIGATION & TARGET SELECTOR */}
        <aside className="w-80 bg-slate-900/80 border-r border-slate-800 p-4 flex flex-col gap-3 shrink-0 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
            Portal Control Options
          </div>

          <div className="space-y-1.5">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' 
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{item.label}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* ICEBERG SELECTION LIST (TELEMETRY TAB) */}
    {/* ICEBERG SELECTION LIST (TELEMETRY TAB) */}
{activeMenu === 'telemetry' && (
  <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
      Active Radar Targets ({liveIcebergs.length})
    </span>
    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
      {liveIcebergs.map((ib) => {
        const isSelected = selectedIceberg?.id === ib.id;
        return (
          <div
            key={ib.id}
            onClick={() => setSelectedIceberg(ib)}
            className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex justify-between items-center ${
              isSelected
                ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-cyan-300">{ib.name}</div>
              <div className="text-[9px] text-slate-500 font-mono">
                {ib.lat}° S, {ib.lng}° W
              </div>
            </div>
            <span className="text-cyan-400 font-mono text-[10px]">{ib.speed_kts} kts</span>
          </div>
        );
      })}
    </div>
  </div>
)}
        </aside>

        {/* RIGHT HAND SIDE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-5 bg-slate-950">

  {/* 👇 ADD THIS CHECK RIGHT HERE */}
  {activeMenu === 'stations' && (
    <ResearchStationsView 
      onLocateOnMap={(station) => {
        if (onBack) onBack(station);
      }} 
    />
  )}

  {/* TELEMETRY & 3D MODEL */}
  {activeMenu === 'telemetry' && selectedIceberg && (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-900/80 border border-cyan-500/30 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> Surface Area
                  </span>
                  <div className="text-xl font-mono font-black mt-1 text-white">{selectedIceberg.area_km2} <span className="text-xs text-slate-400 font-normal">km²</span></div>
                </div>

                <div className="bg-slate-900/80 border border-emerald-500/30 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" /> Drift Speed
                  </span>
                  <div className="text-xl font-mono font-black mt-1 text-emerald-400">{selectedIceberg.speed_kts} <span className="text-xs text-slate-400 font-normal">kts</span></div>
                </div>

                <div className="bg-slate-900/80 border border-cyan-500/30 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> Mass / Vol.
                  </span>
                  <div className="text-xl font-mono font-black mt-1 text-cyan-300">{selectedIceberg.metrics?.volume_km3 || selectedIceberg.volume_km3 || '112.4'} <span className="text-xs text-slate-400 font-normal">km³</span></div>
                </div>

                <div className="bg-slate-900/80 border border-amber-500/30 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> SLR Impact
                  </span>
                  <div className="text-xl font-mono font-black mt-1 text-amber-300">+{selectedIceberg.metrics?.slr_microns || selectedIceberg.slr_microns || 58.2} <span className="text-xs text-slate-400 font-normal">µm</span></div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 xl:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Box className="w-4 h-4 text-cyan-400" /> 3D Keel & Pinnacle Topography: {selectedIceberg.name}
                  </h3>
                  <Iceberg3DViewer peakHeight={currentPeakHeight} keelDepth={currentKeelDepth} icebergId={selectedIceberg.id} />
                </div>

                <div className="col-span-12 xl:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" /> Nearest Coastal Settlements
                  </h3>

                  <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                    {[
                      { name: "Ushuaia", country: "Argentina", dist: 420, eta: "12 Days" },
                      { name: "Puerto Williams", country: "Chile", dist: 445, eta: "14 Days" },
                      { name: "Stanley", country: "Falkland Islands", dist: 610, eta: "21 Days" }
                    ].map((town, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-200">{town.name}</div>
                          <div className="text-[10px] text-slate-400">{town.country}</div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-xs font-bold text-cyan-400">{town.dist} NM</div>
                          <div className="text-[9px] text-amber-400">ETA: {town.eta}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <CryoAiAssistantCard onOpen={() => setIsAssistantOpen(true)} />

                </div>
              </div>
            </div>
          )}

          {/* TRAVEL PACKAGES */}
          {activeMenu === 'travel' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plane className="w-5 h-5 text-cyan-400" /> Antarctic Travel & Expedition Packages
                </h2>
                <p className="text-xs text-slate-400 mt-1">Book eco-certified polar icebreaker voyages and iceberg kayaking excursions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {travelPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all">
                    <div>
                      <div className="h-44 overflow-hidden relative">
                        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                          {pkg.category}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="text-base font-bold text-white">{pkg.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{pkg.description}</p>
                        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
                          <span className="text-slate-400"><Clock className="w-3.5 h-3.5 inline mr-1" />{pkg.duration}</span>
                          <span className="text-emerald-400 font-bold">${pkg.price.toLocaleString()} USD</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button 
                        onClick={() => setSelectedPackage(pkg)}
                        className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Book Expedition
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HISTORY & SCIENTISTS */}
          {activeMenu === 'history' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" /> Historical Explorers & Polar Scientists
                </h2>
                <p className="text-xs text-slate-400 mt-1">Pioneers who shaped our understanding of the icy continent.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {scientistContributions.map((sci) => (
                  <div key={sci.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={sci.image} alt={sci.name} className="w-12 h-12 rounded-full object-cover border border-cyan-500/40" />
                        <div>
                          <h3 className="text-sm font-bold text-white">{sci.name}</h3>
                          <span className="text-[10px] font-mono text-cyan-400">{sci.years}</span>
                        </div>
                      </div>
                      <div className="text-xs text-amber-300 font-medium bg-amber-950/30 border border-amber-500/20 p-2 rounded-lg">
                        {sci.station}
                      </div>
                      <p className="text-xs text-slate-300">{sci.research}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedScientist(sci)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-xl transition-all border border-cyan-500/20 cursor-pointer"
                    >
                      Read Full Contribution
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FLORA & FAUNA */}
          {activeMenu === 'flora_fauna' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Fish className="w-5 h-5 text-cyan-400" /> Unique Ecosystem: Antarctic Flora & Fauna
                </h2>
                <p className="text-xs text-slate-400 mt-1">Discover species thriving in Earth's most extreme biome.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {floraFaunaData.map((item) => (
                  <FloraFaunaCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => setSelectedFloraFauna(item)} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* PLACES TO VISIT */}
          {activeMenu === 'places' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-cyan-400" /> Antarctic Landmarks & Glacial Bays
                </h2>
                <p className="text-xs text-slate-400 mt-1">Iconic destinations across the frozen continent.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {placesData.map((place) => (
                  <div key={place.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="h-44 overflow-hidden relative">
                        <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                          {place.coordinates}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="text-base font-bold text-white">{place.name}</h3>
                        <p className="text-xs text-slate-400">{place.description}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button 
                        onClick={() => setSelectedPlace(place)}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-xl transition-all border border-cyan-500/20 cursor-pointer"
                      >
                        Explore Location
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {activeMenu === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Guest & Explorer Reviews
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Verified feedback from research expeditions and tourists.</p>
                </div>

                <div className="flex gap-2">
                  {['all', 'expedition', 'portal app', 'wildlife'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setReviewCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        reviewCategory === cat 
                          ? 'bg-cyan-500 text-slate-950' 
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {filteredReviews.map((rev) => (
                    <div key={rev.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{rev.author}</span>
                          <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">{rev.badge}</span>
                        </div>
                        <span className="text-xs text-slate-500">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                        ))}
                      </div>
                      <h4 className="text-xs font-bold text-cyan-300">{rev.title}</h4>
                      <p className="text-xs text-slate-300">{rev.comment}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddReview} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3 h-fit">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" /> Submit Review
                  </h3>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Name / Title</label>
                    <input 
                      type="text" 
                      value={newReviewAuthor} 
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Dr. Alex Mercer"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Category</label>
                    <select 
                      value={newReviewType}
                      onChange={(e) => setNewReviewType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Expedition">Expedition</option>
                      <option value="Portal App">Portal App</option>
                      <option value="Wildlife">Wildlife</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Rating</label>
                    <select 
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-cyan-500"
                    >
                      <option value={5}>5 Stars - Outstanding</option>
                      <option value={4}>4 Stars - Great</option>
                      <option value={3}>3 Stars - Average</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Review Comments</label>
                    <textarea 
                      rows={3}
                      value={newReviewText} 
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white mt-1 focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer">
                    Post Review
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* CARBON CALCULATOR */}
          {activeMenu === 'carbon' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-500" /> Glacial Ice Melt Impact Calculator
                </h2>
                <p className="text-xs text-slate-400 mt-1">Estimate your lifetime footprint and corresponding Antarctic ice loss contribution.</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-300">Your Age</span>
                      <span className="text-cyan-400 font-mono">{age} years</span>
                    </div>
                    <input 
                      type="range" min="15" max="80" value={age} 
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-300">Flights Per Year</span>
                      <span className="text-cyan-400 font-mono">{flightsPerYear} flights</span>
                    </div>
                    <input 
                      type="range" min="0" max="20" value={flightsPerYear} 
                      onChange={(e) => setFlightsPerYear(Number(e.target.value))}
                      className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-300">Car Travel (km / year)</span>
                      <span className="text-cyan-400 font-mono">{carKmPerYear.toLocaleString()} km</span>
                    </div>
                    <input 
                      type="range" min="0" max="50000" step="1000" value={carKmPerYear} 
                      onChange={(e) => setCarKmPerYear(Number(e.target.value))}
                      className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="p-4 bg-slate-950/80 border border-rose-500/30 rounded-xl">
                    <span className="text-[10px] font-bold text-rose-400 uppercase">Estimated Lifetime CO₂</span>
                    <div className="text-2xl font-mono font-black text-white mt-1">{lifetimeCO2} <span className="text-xs font-normal text-slate-400">Tons</span></div>
                  </div>
                  <div className="p-4 bg-slate-950/80 border border-cyan-500/30 rounded-xl">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">Est. Antarctic Ice Melted</span>
                    <div className="text-2xl font-mono font-black text-cyan-300 mt-1">{iceMeltTons} <span className="text-xs font-normal text-slate-400">Tons</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: TRAVEL BOOKING */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-xl w-full p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedPackage(null)} 
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-xl font-bold text-white">Expedition Booking Confirmed!</h3>
                <p className="text-xs text-slate-400">Your reservation details have been submitted to polar expedition control.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{selectedPackage.category}</span>
                  <h3 className="text-lg font-bold text-white">{selectedPackage.title}</h3>
                  <p className="text-xs text-slate-400">{selectedPackage.duration} • Departs: {selectedPackage.departs}</p>
                </div>

                <div className="space-y-2 border-t border-b border-slate-800 py-3">
                  <h4 className="text-xs font-bold text-slate-200">Expedition Itinerary Overview:</h4>
                  {selectedPackage.itinerary.map((item, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-bold text-cyan-400">{item.day}: {item.title}</span>
                      <p className="text-[11px] text-slate-400">{item.details}</p>
                    </div>
                  ))}
                </div>

                {/* Passenger Info & Email Inputs */}
  <div className="grid grid-cols-2 gap-2 pt-2">
    <div>
      <label className="text-[10px] text-slate-400 font-semibold uppercase">Passenger Name</label>
      <input
        type="text"
        placeholder="Full Name"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
      />
    </div>
    <div>
      <label className="text-[10px] text-slate-400 font-semibold uppercase">Email ID (For Ticket)</label>
      <input
        type="email"
        placeholder="name@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
      />
    </div>
  </div>

  {/* Payment Method Selector */}
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Method</label>
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => setPaymentMethod('card')}
        className={`py-2 text-xs font-semibold rounded-lg border transition ${
          paymentMethod === 'card'
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
            : 'bg-slate-800 border-slate-700 text-slate-400'
        }`}
      >
        💳 Card
      </button>
      <button
        type="button"
        onClick={() => setPaymentMethod('upi')}
        className={`py-2 text-xs font-semibold rounded-lg border transition ${
          paymentMethod === 'upi'
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
            : 'bg-slate-800 border-slate-700 text-slate-400'
        }`}
      >
        📱 UPI / QR
      </button>
      <button
        type="button"
        onClick={() => setPaymentMethod('netbanking')}
        className={`py-2 text-xs font-semibold rounded-lg border transition ${
          paymentMethod === 'netbanking'
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
            : 'bg-slate-800 border-slate-700 text-slate-400'
        }`}
      >
        🏦 Net Banking
      </button>
    </div>
  </div>

  {/* Dynamic Payment Option Form */}
  <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
    {paymentMethod === 'card' && (
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Card Number"
          required
          className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="MM/YY"
            required
            className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="CVV"
            required
            className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    )}

    {paymentMethod === 'upi' && (
      <div className="text-center space-y-2">
        <p className="text-[11px] text-slate-400">Enter UPI ID (e.g. username@upi) or Scan QR</p>
        <input
          type="text"
          placeholder="username@upi"
          required
          className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
        />
      </div>
    )}

    {paymentMethod === 'netbanking' && (
      <select className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500">
        <option>HDFC Bank</option>
        <option>State Bank of India</option>
        <option>ICICI Bank</option>
        <option>Axis Bank</option>
      </select>
    )}
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full py-2.5 font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition text-sm shadow-lg shadow-cyan-500/20"
  >
    Confirm Booking & Download PDF Ticket
  </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: FLORA & FAUNA */}
      {selectedFloraFauna && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 space-y-4 relative">
            <button onClick={() => setSelectedFloraFauna(null)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800">
              <X className="w-5 h-5" />
            </button>
            <div className="h-48 overflow-hidden rounded-xl">
              <img src={selectedFloraFauna.image} alt={selectedFloraFauna.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase">{selectedFloraFauna.category}</span>
              <h3 className="text-lg font-bold text-white">{selectedFloraFauna.name}</h3>
              <p className="text-xs italic text-cyan-500">{selectedFloraFauna.latinName}</p>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>Habitat:</strong> {selectedFloraFauna.habitat}</p>
              <p><strong>Diet:</strong> {selectedFloraFauna.diet}</p>
              <p><strong>Evolutionary Adaptation:</strong> {selectedFloraFauna.adaptation}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-cyan-400 mb-1">Key Facts:</h4>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                {selectedFloraFauna.facts.map((fact, idx) => <li key={idx}>{fact}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PLACES */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 space-y-4 relative">
            <button onClick={() => setSelectedPlace(null)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800">
              <X className="w-5 h-5" />
            </button>
            <div className="h-48 overflow-hidden rounded-xl">
              <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400">{selectedPlace.coordinates}</span>
              <h3 className="text-lg font-bold text-white">{selectedPlace.name}</h3>
            </div>
            <p className="text-xs text-slate-300">{selectedPlace.description}</p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p><strong>Best Time to Visit:</strong> {selectedPlace.bestTime}</p>
              <p><strong>Safety / Ice Status:</strong> {selectedPlace.safetyRating}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-cyan-400 mb-1">Destination Highlights:</h4>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                {selectedPlace.highlights.map((h, idx) => <li key={idx}>{h}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SCIENTISTS */}
      {selectedScientist && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 space-y-4 relative">
            <button onClick={() => setSelectedScientist(null)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <img src={selectedScientist.image} alt={selectedScientist.name} className="w-16 h-16 rounded-full object-cover border border-cyan-500/40" />
              <div>
                <h3 className="text-lg font-bold text-white">{selectedScientist.name}</h3>
                <p className="text-xs text-cyan-400 font-mono">{selectedScientist.years}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>Associated Station / Region:</strong> {selectedScientist.station}</p>
              <p><strong>Core Research:</strong> {selectedScientist.research}</p>
              <p><strong>Historical Legacy:</strong> {selectedScientist.contribution}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-cyan-400 mb-1">Expedition Timeline:</h4>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                {selectedScientist.timeline.map((t, idx) => <li key={idx}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}