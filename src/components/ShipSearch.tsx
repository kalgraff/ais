/**
 * Søkekomponent for å finne og følge spesifikke skip
 */

import { useState, useMemo } from 'react';
import type { AISPosition } from '../types/ais';
import { getShipTypeText, getCountryFromMMSI } from '../utils/shipUtils';
import './ShipSearch.css';

interface ShipSearchProps {
  ships: AISPosition[];
  trackedShip: AISPosition | null;
  onTrackShip: (ship: AISPosition | null) => void;
  isTracking?: boolean;
}

export function ShipSearch({ ships, trackedShip, onTrackShip, isTracking: externalIsTracking }: ShipSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isTracking = externalIsTracking ?? false;

  // Søk i skip-data
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    
    return ships
      .filter((ship) => {
        // Søk på navn
        if (ship.name?.toLowerCase().includes(query)) {
          return true;
        }
        // Søk på MMSI
        if (ship.mmsi.toString().includes(query)) {
          return true;
        }
        // Søk på kallesignal
        if (ship.callSign?.toLowerCase().includes(query)) {
          return true;
        }
        // Søk på destinasjon
        if (ship.destination?.toLowerCase().includes(query)) {
          return true;
        }
        // Søk på skip-type
        const shipType = getShipTypeText(ship.shipType, ship.name).toLowerCase();
        if (shipType.includes(query)) {
          return true;
        }
        // Søk på nasjonalitet (både med og uten emoji)
        const nationality = getCountryFromMMSI(ship.mmsi).toLowerCase();
        if (nationality.includes(query)) {
          return true;
        }
        return false;
      })
      .slice(0, 20); // Begrens til 20 resultater
  }, [ships, searchQuery]);

  const handleSelectShip = (ship: AISPosition) => {
    onTrackShip(ship);
  };

  const handleStopTracking = () => {
    onTrackShip(null);
  };

  return (
    <div className="ship-search">
      <div className="search-header">
        <button
          className="search-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
          <span className="search-title">🔍 Søk skip</span>
          {trackedShip && (
            <span className="tracking-badge">
              📍 {isTracking ? 'Følger' : 'Valgt'}
            </span>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="search-content">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Søk etter navn, MMSI, type, nasjonalitet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery('')}
                title="Tøm søk"
              >
                ✕
              </button>
            )}
          </div>

          {trackedShip && (
            <div className="tracked-ship-info">
              <div className="tracked-header">
                <span className="tracked-label">
                  {isTracking ? '📍 Følger:' : '✓ Valgt:'}
                </span>
                <button
                  className="stop-tracking-btn"
                  onClick={handleStopTracking}
                  title="Fjern valg"
                >
                  ✕
                </button>
              </div>
              <div className="tracked-details">
                <div className="tracked-name">{trackedShip.name || 'Ukjent'}</div>
                <div className="tracked-meta">
                  MMSI: {trackedShip.mmsi} • {getCountryFromMMSI(trackedShip.mmsi)}
                </div>
                <div className="tracked-type">
                  {getShipTypeText(trackedShip.shipType, trackedShip.name)}
                </div>
              </div>
              <button
                className={`tracking-toggle ${isTracking ? 'active' : ''}`}
                onClick={handleStopTracking}
              >
                {isTracking ? '⏸ Stopp følging' : '✓ Valgt'}
              </button>
            </div>
          )}

          {searchQuery && (
            <div className="search-results">
              {searchResults.length > 0 ? (
                <>
                  <div className="results-header">
                    {searchResults.length} resultat{searchResults.length !== 1 ? 'er' : ''}
                  </div>
                  <div className="results-list">
                    {searchResults.map((ship) => (
                      <div
                        key={ship.mmsi}
                        className={`result-item ${trackedShip?.mmsi === ship.mmsi ? 'selected' : ''}`}
                      >
                        <div className="result-info">
                          <div className="result-name">{ship.name || 'Ukjent'}</div>
                          <div className="result-meta">
                            MMSI: {ship.mmsi} • {getCountryFromMMSI(ship.mmsi)}
                          </div>
                          <div className="result-type">
                            {getShipTypeText(ship.shipType, ship.name)}
                          </div>
                        </div>
                        <button
                          className="track-button"
                          onClick={() => handleSelectShip(ship)}
                          disabled={trackedShip?.mmsi === ship.mmsi}
                        >
                          {trackedShip?.mmsi === ship.mmsi ? '✓ Valgt' : '📍 Følg'}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-results">
                  Ingen skip funnet for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
