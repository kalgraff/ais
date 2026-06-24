/**
 * Visuell indikator som viser at et skip følges
 */

import type { AISPosition } from '../types/ais';
import { getShipTypeText, getCountryFromMMSI, formatSpeed } from '../utils/shipUtils';
import './TrackingIndicator.css';

interface TrackingIndicatorProps {
  ship: AISPosition;
  onStopTracking: () => void;
  trackHistoryLength: number;
}

export function TrackingIndicator({ ship, onStopTracking, trackHistoryLength }: TrackingIndicatorProps) {
  return (
    <div className="tracking-indicator">
      <div className="tracking-indicator-header">
        <span className="tracking-pulse">📍</span>
        <span className="tracking-title">FØLGER</span>
      </div>
      <div className="tracking-ship-info">
        <div className="tracking-ship-name">{ship.name || 'Ukjent skip'}</div>
        <div className="tracking-ship-details">
          {ship.mmsi} • {getCountryFromMMSI(ship.mmsi)}
        </div>
        <div className="tracking-ship-type">
          {getShipTypeText(ship.shipType, ship.name)}
          {ship.speedOverGround !== undefined && ship.speedOverGround !== null && (
            <span className="tracking-speed"> • {formatSpeed(ship.speedOverGround)}</span>
          )}
        </div>
        {trackHistoryLength > 0 && (
          <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.85 }}>
            📊 {trackHistoryLength} posisjon{trackHistoryLength !== 1 ? 'er' : ''} i spor
            {trackHistoryLength === 1 && ' (venter på bevegelse)'}
          </div>
        )}
      </div>
      <button className="tracking-stop-button" onClick={onStopTracking}>
        ⏸ Stopp følging
      </button>
    </div>
  );
}
