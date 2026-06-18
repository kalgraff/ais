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
      if (
        showTemperature &&
        point.seaSurfaceTemperature !== undefined &&
        point.seaSurfaceTemperature !== null
      ) {
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

        // Legg til tekst-label med temperatur
        const tempLabel = L.marker([point.latitude, point.longitude], {
          icon: L.divIcon({
            className: 'temp-label',
            html: `<div style="
              background: rgba(255, 255, 255, 0.95);
              color: #333;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              border: 2px solid ${getTemperatureColor(point.seaSurfaceTemperature).replace('0.4', '0.8')};
            ">🌡️ ${point.seaSurfaceTemperature.toFixed(1)}°C</div>`,
            iconSize: [60, 24],
            iconAnchor: [30, 12],
          }),
        });

        tempLabel.addTo(map);
        layers.push(tempLabel);
      }

      // Bølge-piler
      if (
        showWaves &&
        point.waveHeight !== undefined &&
        point.waveHeight !== null &&
        point.waveDirection !== undefined &&
        point.waveDirection !== null
      ) {
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
            <strong>Retning:</strong> ${point.waveDirection?.toFixed(0) ?? 'N/A'}°<br>
            ${point.wavePeriod ? `<strong>Periode:</strong> ${point.wavePeriod.toFixed(1)}s<br>` : ''}
            <strong>Posisjon:</strong> ${point.latitude.toFixed(2)}°N, ${point.longitude.toFixed(2)}°Ø
          </div>
        `);

        polyline.addTo(map);
        arrowHead.addTo(map);
        layers.push(polyline, arrowHead);

        // Legg til tekst-label med bølgehøyde
        const waveLabel = L.marker([point.latitude, point.longitude], {
          icon: L.divIcon({
            className: 'wave-label',
            html: `<div style="
              background: rgba(25, 118, 210, 0.9);
              color: white;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              border: 1px solid rgba(255,255,255,0.3);
            ">${point.waveHeight.toFixed(1)}m</div>`,
            iconSize: [40, 20],
            iconAnchor: [20, 10],
          }),
        });

        waveLabel.addTo(map);
        layers.push(waveLabel);
      }

      // Strøm-piler
      if (
        showCurrents &&
        point.currentVelocity !== undefined &&
        point.currentVelocity !== null &&
        point.currentDirection !== undefined &&
        point.currentDirection !== null
      ) {
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
            <strong>Retning:</strong> ${point.currentDirection?.toFixed(0) ?? 'N/A'}°<br>
            <strong>Posisjon:</strong> ${point.latitude.toFixed(2)}°N, ${point.longitude.toFixed(2)}°Ø
          </div>
        `);

        polyline.addTo(map);
        arrowHead.addTo(map);
        layers.push(polyline, arrowHead);

        // Legg til tekst-label med strømhastighet
        const currentLabel = L.marker([point.latitude, point.longitude], {
          icon: L.divIcon({
            className: 'current-label',
            html: `<div style="
              background: rgba(0, 137, 123, 0.9);
              color: white;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              border: 1px solid rgba(255,255,255,0.3);
            ">${point.currentVelocity.toFixed(1)} km/h</div>`,
            iconSize: [60, 20],
            iconAnchor: [30, 10],
          }),
        });

        currentLabel.addTo(map);
        layers.push(currentLabel);
      }
    });

    // Cleanup: fjern layers når komponenten unmounter eller data endres
    return () => {
      layers.forEach((layer) => map.removeLayer(layer));
    };
  }, [map, data, showTemperature, showWaves, showCurrents]);

  return null; // Komponenten renderer ikke JSX, bare Leaflet layers
}
