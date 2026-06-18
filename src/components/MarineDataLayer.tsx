/**
 * Leaflet layer for å vise marine data
 */

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MarineDataPoint } from '../types/marine';
import {
  getTemperatureColor,
  formatTemperature,
  formatWaveHeight,
  formatCurrentVelocity,
  getDirectionVector,
} from '../services/marine';

interface MarineDataLayerProps {
  data: MarineDataPoint[];
  showTemperature: boolean;
  showWaves: boolean;
  showCurrents: boolean;
}

export function MarineDataLayer({
  data,
  showTemperature,
  showWaves,
  showCurrents,
}: MarineDataLayerProps) {
  const map = useMap();

  useEffect(() => {
    const layers: L.Layer[] = [];

    data.forEach((point) => {
      // Temperatur-sirkler
      if (showTemperature && point.seaSurfaceTemperature !== undefined) {
        const circle = L.circle([point.latitude, point.longitude], {
          radius: 10000, // 10km radius
          fillColor: getTemperatureColor(point.seaSurfaceTemperature),
          fillOpacity: 0.4,
          color: getTemperatureColor(point.seaSurfaceTemperature).replace('0.4', '0.6'),
          weight: 1,
        });

        circle.bindPopup(`
          <div style="min-width: 150px;">
            <strong>🌡️ Sjøtemperatur</strong><br>
            <strong>Temperatur:</strong> ${formatTemperature(point.seaSurfaceTemperature)}<br>
            <strong>Posisjon:</strong> ${point.latitude.toFixed(2)}°N, ${point.longitude.toFixed(2)}°Ø
          </div>
        `);

        circle.addTo(map);
        layers.push(circle);
      }

      // Bølge-piler
      if (showWaves && point.waveHeight !== undefined && point.waveDirection !== undefined) {
        const { dx, dy } = getDirectionVector(point.waveDirection);
        const endLat = point.latitude + dy * 0.2;
        const endLon = point.longitude + dx * 0.2;

        // Skalér pilstørrelse basert på bølgehøyde
        const arrowSize = Math.max(0.05, Math.min(0.3, point.waveHeight * 0.1));
        
        const polyline = L.polyline(
          [
            [point.latitude, point.longitude],
            [endLat, endLon],
          ],
          {
            color: '#1976D2',
            weight: 3,
            opacity: 0.7,
          }
        );

        // Legg til pilhode
        const arrowHead = L.polyline(
          [
            [endLat, endLon],
            [endLat - dy * arrowSize + dx * arrowSize, endLon - dx * arrowSize - dy * arrowSize],
            [endLat, endLon],
            [endLat - dy * arrowSize - dx * arrowSize, endLon - dx * arrowSize + dy * arrowSize],
          ],
          {
            color: '#1976D2',
            weight: 3,
            opacity: 0.7,
          }
        );

        polyline.bindPopup(`
          <div style="min-width: 150px;">
            <strong>🌊 Bølger</strong><br>
            <strong>Høyde:</strong> ${formatWaveHeight(point.waveHeight)}<br>
            <strong>Retning:</strong> ${point.waveDirection.toFixed(0)}°<br>
            ${point.wavePeriod ? `<strong>Periode:</strong> ${point.wavePeriod.toFixed(1)}s<br>` : ''}
            <strong>Posisjon:</strong> ${point.latitude.toFixed(2)}°N, ${point.longitude.toFixed(2)}°Ø
          </div>
        `);

        polyline.addTo(map);
        arrowHead.addTo(map);
        layers.push(polyline, arrowHead);
      }

      // Strøm-piler
      if (showCurrents && point.currentVelocity !== undefined && point.currentDirection !== undefined) {
        const { dx, dy } = getDirectionVector(point.currentDirection);
        const endLat = point.latitude + dy * 0.15;
        const endLon = point.longitude + dx * 0.15;

        // Skalér pilstørrelse basert på strømhastighet
        const arrowSize = Math.max(0.05, Math.min(0.25, point.currentVelocity * 0.02));

        const polyline = L.polyline(
          [
            [point.latitude, point.longitude],
            [endLat, endLon],
          ],
          {
            color: '#00897B',
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 5',
          }
        );

        // Legg til pilhode
        const arrowHead = L.polyline(
          [
            [endLat, endLon],
            [endLat - dy * arrowSize + dx * arrowSize, endLon - dx * arrowSize - dy * arrowSize],
            [endLat, endLon],
            [endLat - dy * arrowSize - dx * arrowSize, endLon - dx * arrowSize + dy * arrowSize],
          ],
          {
            color: '#00897B',
            weight: 2,
            opacity: 0.6,
          }
        );

        polyline.bindPopup(`
          <div style="min-width: 150px;">
            <strong>💨 Havstrøm</strong><br>
            <strong>Hastighet:</strong> ${formatCurrentVelocity(point.currentVelocity)}<br>
            <strong>Retning:</strong> ${point.currentDirection.toFixed(0)}°<br>
            <strong>Posisjon:</strong> ${point.latitude.toFixed(2)}°N, ${point.longitude.toFixed(2)}°Ø
          </div>
        `);

        polyline.addTo(map);
        arrowHead.addTo(map);
        layers.push(polyline, arrowHead);
      }
    });

    // Cleanup: fjern layers når komponenten unmounter eller data endres
    return () => {
      layers.forEach((layer) => map.removeLayer(layer));
    };
  }, [map, data, showTemperature, showWaves, showCurrents]);

  return null; // Komponenten renderer ikke JSX, bare Leaflet layers
}
