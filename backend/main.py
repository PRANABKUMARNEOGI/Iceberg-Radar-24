from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Iceberg Radar 24 API", version="1.0.0")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

class Metrics(BaseModel):
    volume_km3: float
    slr_microns: float

class Iceberg(BaseModel):
    id: str
    name: str
    region: str
    lat: float
    lng: float
    area_km2: float
    speed_kts: float
    video_url: str
    video_title: Optional[str] = None
    track: List[List[float]]
    metrics: Metrics

# Mock Database
ICEBERGS_DB: List[dict] = [
    {
        "id": "A-76A",
        "name": "Iceberg A-76A",
        "region": "Drake Passage, Southern Ocean",
        "lat": -58.5,
        "lng": -62.3,
        "area_km2": 3200.0,
        "speed_kts": 1.4,
        "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "video_title": "Sentinel-1 SAR Radar Loop",
        "track": [
            [-62.0, -58.0],
            [-60.5, -60.1],
            [-58.5, -62.3]
        ],
        "metrics": {
            "volume_km3": 135.2,
            "slr_microns": 84.5
        }
    },
    {
        "id": "A-23A",
        "name": "Iceberg A-23a",
        "region": "Weddell Sea Outer Drift",
        "lat": -61.2,
        "lng": -45.1,
        "area_km2": 3900.0,
        "speed_kts": 2.1,
        "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "video_title": "MODIS Thermal Infrared",
        "track": [
            [-64.1, -42.0],
            [-62.8, -43.5],
            [-61.2, -45.1]
        ],
        "metrics": {
            "volume_km3": 160.8,
            "slr_microns": 102.1
        }
    },
    {
        "id": "B-15Y",
        "name": "Iceberg B-15Y",
        "region": "Ross Sea Sector",
        "lat": -71.8,
        "lng": 175.4,
        "area_km2": 540.0,
        "speed_kts": 0.8,
        "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "video_title": "CryoSat-2 Altimetry Mesh",
        "track": [
            [-73.0, 172.1],
            [-72.4, 173.8],
            [-71.8, 175.4]
        ],
        "metrics": {
            "volume_km3": 22.4,
            "slr_microns": 14.2
        }
    },
    {
        "id": "D-28",
        "name": "Iceberg D-28 (Molar)",
        "region": "Amery Ice Shelf Basin",
        "lat": -65.4,
        "lng": 81.2,
        "area_km2": 1580.0,
        "speed_kts": 1.1,
        "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        "video_title": "Envisat Optical Telemetry",
        "track": [
            [-67.0, 78.5],
            [-66.1, 79.9],
            [-65.4, 81.2]
        ],
        "metrics": {
            "volume_km3": 68.9,
            "slr_microns": 43.1
        }
    }
]

# API Routes
@app.get("/")
def read_root():
    return {"status": "online", "message": "Iceberg Radar 24 Telemetry API running"}

@app.post("/api/login")
def login(credentials: LoginRequest):
    # Operator Login Verification
    if credentials.username == "admin" and credentials.password == "password":
        return {"status": "success", "token": "operator-session-token-x92"}
    raise HTTPException(status_code=401, detail="Invalid Operator ID or Access Code")

@app.get("/api/icebergs", response_model=List[Iceberg])
def get_icebergs(query: Optional[str] = None):
    if not query:
        return ICEBERGS_DB
    
    q = query.lower().strip()
    filtered = [
        ib for ib in ICEBERGS_DB 
        if q in ib["id"].lower() or q in ib["name"].lower() or q in ib["region"].lower()
    ]
    return filtered