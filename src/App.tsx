/**
 * Hovedapplikasjon for AIS-visning
 */

import { useState } from 'react';
import { ShipMap } from './components/ShipMap';
import { useAISData } from './hooks/useAISData';
import type { AISFilter } from './types/ais';
import './App.css';

function App() {
  // Standard filter for norsk kyst (kan justeres)
  const [filter] = useState<AISFilter>({
    minLatitude: 57.0,
    maxLatitude: 71.5,
    minLongitude: 4.0,
    maxLongitude: 32.0,
  });

  const { ships, loading, error, refetch } = useAISData(filter, 30000);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚢 AIS Skip-sporing</h1>
        <div className="header-info">
          <span className="ship-count">
            {loading ? 'Laster...' : `${ships.length} skip`}
          </span>
          <button onClick={refetch} className="refresh-button" disabled={loading}>
            🔄 Oppdater
          </button>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <strong>Feil:</strong> {error.message}
            <button onClick={refetch} className="retry-button">
              Prøv igjen
            </button>
          </div>
        )}

        <div className="map-container">
          {loading && ships.length === 0 ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Henter skip-data...</p>
            </div>
          ) : (
            <ShipMap ships={ships} autoFit={ships.length > 0} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Data fra{' '}
          <a
            href="https://www.barentswatch.no"
            target="_blank"
            rel="noopener noreferrer"
          >
            BarentsWatch
          </a>
          {' • '}
          Oppdateres automatisk hvert 30. sekund
        </p>
      </footer>
    </div>
  );
}

export default App;
