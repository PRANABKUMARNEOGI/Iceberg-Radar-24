import math
from typing import Dict, Any

# Constants
ICE_DENSITY = 917.0        # kg/m^3
WATER_DENSITY = 1027.0     # kg/m^3
OCEAN_AREA_KM2 = 361900000.0  # Total global ocean area in km^2

def calculate_iceberg_metrics(area_km2: float, freeboard_m: float) -> Dict[str, Any]:
    """
    Calculates total ice thickness, keel depth, volume, mass, and sea level rise potential.
    """
    # Archimedian balance ratio
    thickness_m = freeboard_m / (1.0 - (ICE_DENSITY / WATER_DENSITY))
    keel_m = thickness_m - freeboard_m
    
    # Volume & Mass Calculations
    volume_km3 = area_km2 * (thickness_m / 1000.0)
    mass_gt = volume_km3 * (ICE_DENSITY / 1000.0)  # 1 km^3 of ice = ~0.917 Gigatons
    
    # Sea Level Rise contribution
    slr_mm = ((volume_km3 * (ICE_DENSITY / 1000.0)) / OCEAN_AREA_KM2) * 1e6
    slr_microns = slr_mm * 1000.0

    return {
        "thickness_m": round(thickness_m, 1),
        "keel_m": round(keel_m, 1),
        "volume_km3": round(volume_km3, 2),
        "mass_gt": round(mass_gt, 2),
        "slr_mm": round(slr_mm, 6),
        "slr_microns": round(slr_microns, 2)
    }