/**
 * Kartkomponent for å vise skip med AIS-data
 */

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { AISPosition } from '../types/ais';
import type { MarineDataPoint, MarineOverlayOptions } from '../types/marine';
import { generateShipInfo, getShipColor } from '../utils/shipUtils';
import { MarineDataLayer } from './MarineDataLayer';
import { useEffect } from 'react';

interface ShipMapProps {
  ships: AISPosition[];
  center?: [number, number];
  zoom?: number;
  autoFit?: boolean;
  marineData?: MarineDataPoint[];
  marineOptions?: MarineOverlayOptions;
  trackedShip?: AISPosition | null;
  isTracking?: boolean;
}

/**
 * Komponent for å tilpasse kartvisning basert på skip
 */
function MapController({
  ships,
  autoFit,
  trackedShip,
  isTracking,
}: {
  ships: AISPosition[];
  autoFit: boolean;
  trackedShip?: AISPosition | null;
  isTracking?: boolean;
}) {
  const map = useMap();

  // Håndter tracking av skip
  useEffect(() => {
    if (trackedShip && isTracking) {
      map.setView([trackedShip.latitude, trackedShip.longitude], 12, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [trackedShip, isTracking, map]);

  // Håndter auto-fit for alle skip (kun når ikke tracking)
  useEffect(() => {
    if (!autoFit || ships.length === 0 || isTracking) return;

    // Beregn bounds for alle skip
    const bounds = new LatLngBounds(
      ships.map((ship) => [ship.latitude, ship.longitude])
    );

    // Tilpass kartet til å vise alle skip
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [ships, autoFit, isTracking, map]);

  return null;
}

/**
 * Opprett en tilpasset ikon for skip basert på type
 */
function createShipIcon(ship: AISPosition): Icon {
  const color = getShipColor(ship.shipType, ship.name);
  
  // Opprett SVG-ikon som en data URL
  const svgIcon = `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2"/>
      <path d="M 12 8 L 12 16 M 8 12 L 16 12" stroke="white" stroke-width="2"/>
    </svg>
  `;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

/**
 * Hovedkomponent for kartvisning av skip
 */
export function ShipMap({
  ships,
  center = [69.6489, 18.9551], // Tromsø som standard
  zoom = 6,
  autoFit = true,
  marineData = [],
  marineOptions = { showTemperature: false, showWaves: false, showCurrents: false },
  trackedShip = null,
  isTracking = false,
}: ShipMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController 
        ships={ships} 
        autoFit={autoFit} 
        trackedShip={trackedShip}
        isTracking={isTracking}
      />

      {/* Marine data overlay */}
      {marineData.length > 0 && (
        <MarineDataLayer
          data={marineData}
          showTemperature={marineOptions.showTemperature}
          showWaves={marineOptions.showWaves}
          showCurrents={marineOptions.showCurrents}
        />
      )}

      {/* Skip markers */}
      {ships.map((ship) => (
        <Marker
          key={ship.mmsi}
          position={[ship.latitude, ship.longitude]}
          icon={createShipIcon(ship)}
        >
          <Popup>
            <div
              style={{
                minWidth: '250px',
                maxWidth: '400px',
              }}
              dangerouslySetInnerHTML={{ __html: generateShipInfo(ship) }}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
