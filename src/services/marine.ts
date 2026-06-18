/**
 * Open-Meteo Marine Weather API client
 */

import type { MarineWeatherResponse, MarineDataPoint } from '../types/marine';

const MARINE_API_URL = 'https://marine-api.open-meteo.com/v1/marine';

/**
 * Hent marine data for et spesifikt punkt
 */
export async function getMarineData(
  latitude: number,
  longitude: number
): Promise<MarineDataPoint | null> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toFixed(4),
      longitude: longitude.toFixed(4),
      hourly: [
        'wave_height',
        'wave_direction',
        'wave_period',
        'ocean_current_velocity',
        'ocean_current_direction',
        'sea_surface_temperature',
      ].join(','),
      timezone: 'Europe/Oslo',
      forecast_days: '1',
    });

    const response = await fetch(`${MARINE_API_URL}?${params.toString()}`);

    if (!response.ok) {
      console.error('Marine API error:', response.status, response.statusText);
      return null;
    }

    const data: MarineWeatherResponse = await response.json();

    // Hent siste tilgjengelige data (første time)
    const hourly = data.hourly;
    const index = 0;

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      seaSurfaceTemperature: hourly.sea_surface_temperature?.[index],
      waveHeight: hourly.wave_height?.[index],
      waveDirection: hourly.wave_direction?.[index],
      wavePeriod: hourly.wave_period?.[index],
      currentVelocity: hourly.ocean_current_velocity?.[index],
      currentDirection: hourly.ocean_current_direction?.[index],
    };
  } catch (error) {
    console.error('Feil ved henting av marine data:', error);
    return null;
  }
}

/**
 * Hent marine data for et grid av punkter (for overlay)
 */
export async function getMarineDataGrid(
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  },
  gridSize: number = 0.5 // grader mellom punkter
): Promise<MarineDataPoint[]> {
  const dataPoints: MarineDataPoint[] = [];

  // Generer grid av punkter
  for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += gridSize) {
    for (let lon = bounds.minLon; lon <= bounds.maxLon; lon += gridSize) {
      const data = await getMarineData(lat, lon);
      if (data) {
        dataPoints.push(data);
      }
      // Liten forsinkelse for å ikke overbelaste API
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return dataPoints;
}

/**
 * Formater temperatur for visning
 */
export function formatTemperature(temp?: number): string {
  if (temp === undefined || temp === null) return 'N/A';
  return `${temp.toFixed(1)}°C`;
}

/**
 * Formater bølgehøyde for visning
 */
export function formatWaveHeight(height?: number): string {
  if (height === undefined || height === null) return 'N/A';
  return `${height.toFixed(1)}m`;
}

/**
 * Formater strømhastighet for visning
 */
export function formatCurrentVelocity(velocity?: number): string {
  if (velocity === undefined || velocity === null) return 'N/A';
  return `${velocity.toFixed(1)} km/h`;
}

/**
 * Få farge basert på temperatur (for heatmap)
 */
export function getTemperatureColor(temp?: number): string {
  if (temp === undefined || temp === null) return 'rgba(128, 128, 128, 0.3)';

  // Fargegradering fra blå (kaldt) til rød (varmt)
  if (temp < 2) return 'rgba(0, 0, 139, 0.4)'; // Mørk blå
  if (temp < 5) return 'rgba(0, 100, 255, 0.4)'; // Blå
  if (temp < 8) return 'rgba(0, 200, 255, 0.4)'; // Lys blå
  if (temp < 10) return 'rgba(0, 255, 200, 0.4)'; // Cyan
  if (temp < 12) return 'rgba(0, 255, 100, 0.4)'; // Grønn
  if (temp < 14) return 'rgba(200, 255, 0, 0.4)'; // Gul-grønn
  if (temp < 16) return 'rgba(255, 200, 0, 0.4)'; // Gul
  if (temp < 18) return 'rgba(255, 100, 0, 0.4)'; // Oransje
  return 'rgba(255, 0, 0, 0.4)'; // Rød
}

/**
 * Få retningsvektor for visning av strømmer/bølger
 */
export function getDirectionVector(direction?: number): { dx: number; dy: number } {
  if (direction === undefined || direction === null) {
    return { dx: 0, dy: 0 };
  }

  // Konverter fra meteorologisk retning (hvor det kommer fra) til kartesisk
  const radians = ((direction + 180) % 360) * (Math.PI / 180);
  return {
    dx: Math.sin(radians),
    dy: -Math.cos(radians),
  };
}
