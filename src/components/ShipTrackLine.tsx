/**
 * Komponent for å vise skipets bevegelseshistorikk på kartet
 */

import { Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';

interface TrackPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
  course?: number;
}

interface ShipTrackLineProps {
  trackHistory: TrackPoint[];
  color?: string;
}

export function ShipTrackLine({ trackHistory, color = '#FF4081' }: ShipTrackLineProps) {
  if (trackHistory.length < 2) {
    return null; // Trenger minst 2 punkter for å tegne en linje
  }

  const positions: LatLngTuple[] = trackHistory.map((point) => [
    point.latitude,
    point.longitude,
  ]);

  return (
    <>
      {/* Hovedlinje for ruten */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: color,
          weight: 3,
          opacity: 0.7,
          dashArray: '10, 10',
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />

      {/* Skyggelinje for dybde */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#000000',
          weight: 5,
          opacity: 0.2,
          dashArray: '10, 10',
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />

      {/* Markører for hvert posisjonspunkt */}
      {trackHistory.map((point, index) => {
        // Vis kun hver 5. posisjon for å unngå rot (bortsett fra første og siste)
        if (index !== 0 && index !== trackHistory.length - 1 && index % 5 !== 0) {
          return null;
        }

        const isFirst = index === 0;
        const isLast = index === trackHistory.length - 1;

        return (
          <CircleMarker
            key={`${point.latitude}-${point.longitude}-${index}`}
            center={[point.latitude, point.longitude]}
            radius={isFirst || isLast ? 6 : 4}
            pathOptions={{
              fillColor: isFirst ? '#4CAF50' : isLast ? color : '#FFFFFF',
              fillOpacity: 1,
              color: isFirst ? '#2E7D32' : isLast ? '#C2185B' : color,
              weight: 2,
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
              <div style={{ fontSize: '0.85rem' }}>
                <div>
                  <strong>
                    {isFirst ? '🟢 Start' : isLast ? '📍 Nåværende' : `📌 Punkt ${index + 1}`}
                  </strong>
                </div>
                <div>
                  {new Date(point.timestamp).toLocaleString('nb-NO', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                {point.speed !== undefined && (
                  <div>Fart: {point.speed.toFixed(1)} knop</div>
                )}
                {point.course !== undefined && (
                  <div>Kurs: {point.course.toFixed(0)}°</div>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}
