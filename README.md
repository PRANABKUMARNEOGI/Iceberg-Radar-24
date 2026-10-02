# 🧊 Antarctic Peninsula Odyssey

> A full-stack, real-time polar telemetry, research monitoring, and expedition simulation platform featuring live iceberg drift tracking, 3D topography visualization, and a Cryo-AI assistant.

---

## 🚀 Live Production Links
* **Frontend (Vercel):** [https://iceberg-radar-24.vercel.app](https://iceberg-radar-24.vercel.app)
* **Backend API (Render):** [https://iceberg-radar-24.onrender.com](https://iceberg-radar-24.onrender.com)

---

## 🌟 Key Features

* **Live Telemetry & Coordinate Drifting:** Real-time tracking of massive Antarctic icebergs (such as A-76A and D-28A) using WGS84 coordinate feeds (`EPSG:4326`).
* **3D Topography & Keel Modeling:** Interactive 3D bathymetry projections visualizing subsurface depth drafts and surface heights.
* **Research Station Directory:** Comprehensive database of active polar outposts, operators, and scientific missions across the Antarctic continent.
* **Cryo-AI Assistant:** Integrated real-time assistant for answering contextual inquiries regarding polar climate shifts and expedition safety.
* **Expedition Booking Portal:** Interactive booking flow featuring historical context, local flora/fauna directories, and carbon footprint tracking.

---

## 🛠️ Technology Stack

* **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Three.js (3D Rendering), jsPDF.
* **Backend:** Python, FastAPI, Uvicorn, Pydantic.
* **Deployment & Hosting:** Vercel (Frontend CDN) & Render (Python Cloud Web Service).

---

## 📁 Repository Structure

```text
Iceberg-radar/
├── backend/                # FastAPI Python backend
│   ├── main.py             # Application entry point & API endpoints
│   ├── calculations.py     # Telemetry & drift calculation modules
│   └── requirements.txt    # Python dependencies
├── frontend/               # React + Vite client application
│   ├── src/                # Components, views, and assets
│   └── package.json        # Frontend dependencies & scripts
└── README.md
```

## 🚀 Local Development Setup
To run this project locally on your machine, follow these steps:

1. Clone the Repository
```
git clone [https://github.com/PRANABKUMARNEOGI/Iceberg-Radar-24.git](https://github.com/PRANABKUMARNEOGI/Iceberg-Radar-24.git)
cd Iceberg-Radar-24
```
2. Run the Backend
Bash
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

3. Run the Frontend
Open a new terminal window:

Bash
```
cd frontend
npm install
npm run dev
```
##📜 License
This project is developed as an open-source research and expedition simulation platform.
