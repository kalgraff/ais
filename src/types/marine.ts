/**
 * Marine weather data typer for Open-Meteo API
 */

export interface MarineDataPoint {
  latitude: number;
  longitude: number;
  seaSurfaceTemperature?: number; // °C
  waveHeight?: number; // meters
  waveDirection?: number; // degrees
  wavePeriod?: number; // seconds
  currentVelocity?: number; // km/h
  currentDirection?: number; // degrees
}

export interface MarineWeatherResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    wave_height?: number[];
    wave_direction?: number[];
    wave_period?: number[];
    ocean_current_velocity?: number[];
    ocean_current_direction?: number[];
    sea_surface_temperature?: number[];
  };
}

export interface MarineOverlayOptions {
  showTemperature: boolean;
  showWaves: boolean;
  showCurrents: boolean;
}
