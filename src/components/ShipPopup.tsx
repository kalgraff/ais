/**
 * Popup-komponent for å vise skipsinformasjon med følge-knapp
 */

import type { AISPosition } from '../types/ais';
import {
  getShipTypeText,
  getCountryFromMMSI,
  formatSpeed,
  formatCourse,
  formatPosition,
  formatTimestamp,
} from '../utils/shipUtils';
import './ShipPopup.css';

interface ShipPopupProps {
  ship: AISPosition;
  isTracked?: boolean;
  onTrack: (mmsi: number) => void;
  onStopTracking?: () => void;
}

export function ShipPopup({ ship, isTracked = false, onTrack, onStopTracking }: ShipPopupProps) {
  const handleTrackClick = () => {
    if (isTracked && onStopTracking) {
      onStopTracking();
    } else {
      onTrack(ship.mmsi);
    }
  };

  return (
    <div className="ship-popup">
      <div className="ship-popup-content">
        {ship.name && (
          <div className="popup-row">
            <strong>Navn:</strong> {ship.name}
          </div>
        )}

        <div className="popup-row">
          <strong>MMSI:</strong> {ship.mmsi}
        </div>

        <div className="popup-row">
          <strong>Nasjonalitet:</strong> {getCountryFromMMSI(ship.mmsi)}
        </div>

        {(ship.shipType !== undefined || ship.name) && (
          <div className="popup-row">
            <strong>Type:</strong> {getShipTypeText(ship.shipType, ship.name)}
          </div>
        )}

        {ship.callSign && (
          <div className="popup-row">
            <strong>Kallesignal:</strong> {ship.callSign}
          </div>
        )}

        {ship.speedOverGround !== undefined && (
          <div className="popup-row">
            <strong>Fart:</strong> {formatSpeed(ship.speedOverGround)}
          </div>
        )}

        {ship.courseOverGround !== undefined && (
          <div className="popup-row">
            <strong>Kurs:</strong> {formatCourse(ship.courseOverGround)}
          </div>
        )}

        <div className="popup-row">
          <strong>Posisjon:</strong> {formatPosition(ship.latitude, ship.longitude)}
        </div>

        {ship.destination && (
          <div className="popup-row">
            <strong>Destinasjon:</strong> {ship.destination}
          </div>
        )}

        {ship.eta && (
          <div className="popup-row">
            <strong>ETA:</strong> {formatTimestamp(ship.eta)}
          </div>
        )}

        {ship.length && ship.width && (
          <div className="popup-row">
            <strong>Dimensjoner:</strong> {ship.length} × {ship.width} m
          </div>
        )}

        <div className="popup-row">
          <strong>Sist oppdatert:</strong> {formatTimestamp(ship.msgtime)}
        </div>
      </div>

      <button className={`track-button ${isTracked ? 'tracking' : ''}`} onClick={handleTrackClick}>
        {isTracked ? '⏸ Stopp følging' : '📍 Følg skip'}
      </button>
    </div>
  );
}
