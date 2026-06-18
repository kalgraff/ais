/**
 * Hovedapplikasjon for AIS-visning
 */

import { useState, useMemo } from 'react';
import { ShipMap } from './components/ShipMap';
import { ShipTypeFilter } from './components/ShipTypeFilter';
import { MarineOverlayControl } from './components/MarineOverlayControl';
import { useAISData } from './hooks/useAISData';
import { useMarineData } from './hooks/useMarineData';
import type { AISFilter } from './types/ais';
import type { MarineOverlayOptions } from './types/marine';
import './App.css';

function App() {
  // Standard filter for norsk kyst (kan justeres)
  const [filter] = useState<AISFilter>({
    minLatitude: 57.0,
    maxLatitude: 71.5,
    minLongitude: 4.0,
    maxLongitude: 32.0,
  });

  // Valgte skip-typer (starter med alle valgt)
  const [selectedTypes, setSelectedTypes] = useState<Set<number>>(new Set());

  // Marine overlay options
  const [marineOptions, setMarineOptions] = useState<MarineOverlayOptions>({
    showTemperature: false,
    showWaves: false,
    showCurrents: false,
  });

  const { ships: allShips, loading, error, refetch } = useAISData(filter, 60000);

  // Hent marine data kun hvis minst ett overlay er aktivt
  const marineEnabled = marineOptions.showTemperature || marineOptions.showWaves || marineOptions.showCurrents;
  const { data: marineData, loading: marineLoading } = useMarineData(
    filter
      ? {
          minLat: filter.minLatitude!,
          maxLat: filter.maxLatitude!,
          minLon: filter.minLongitude!,
          maxLon: filter.maxLongitude!,
        }
      : null,
    marineEnabled
  );

  // Filtrer skip basert på valgte typer
  const ships = useMemo(() => {
    if (selectedTypes.size === 0) {
      return allShips; // Vis alle hvis ingen er valgt
    }
    return allShips.filter((ship) => {
      // Sjekk for bøyer (type -1 betyr navn-basert filtrering)
      if (selectedTypes.has(-1)) {
        const isBuoy = ship.name?.toUpperCase().includes('BUOY') || 
                       ship.name?.toUpperCase().includes('BØYE');
        if (isBuoy) return true;
      }
      
      // Vanlig shipType filtrering
      return ship.shipType !== undefined && selectedTypes.has(ship.shipType);
    });
  }, [allShips, selectedTypes]);

  // Tell antall skip per type
  const shipCounts = useMemo(() => {
    const counts = new Map<number, number>();
    
    // Tell bøyer (spesiell type -1)
    let buoyCount = 0;
    
    allShips.forEach((ship) => {
      // Tell bøyer
      const isBuoy = ship.name?.toUpperCase().includes('BUOY') || 
                     ship.name?.toUpperCase().includes('BØYE');
      if (isBuoy) {
        buoyCount++;
      }
      
      // Tell vanlige skip-typer
      if (ship.shipType !== undefined) {
        counts.set(ship.shipType, (counts.get(ship.shipType) || 0) + 1);
      }
    });
    
    // Legg til bøyer-telling
    counts.set(-1, buoyCount);
    
    return counts;
  }, [allShips]);

  // Toggle skip-typer
  const handleToggleTypes = (types: number[]) => {
    setSelectedTypes((prev) => {
      const newSet = new Set(prev);
      
      // Hvis alle typer er valgt, fjern dem. Ellers legg til.
      const allSelected = types.every((type) => newSet.has(type));
      
      if (allSelected) {
        types.forEach((type) => newSet.delete(type));
      } else {
        types.forEach((type) => newSet.add(type));
      }
      
      return newSet;
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚢 AIS Skip-sporing</h1>
        <div className="header-info">
          <span className="ship-count">
            {loading ? 'Laster...' : ships.length !== allShips.length 
              ? `${ships.length} av ${allShips.length} skip`
              : `${ships.length} skip`
            }
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
            <>
              <ShipMap 
                ships={ships} 
                autoFit={ships.length > 0}
                marineData={marineData}
                marineOptions={marineOptions}
              />
              <MarineOverlayControl
                options={marineOptions}
                onOptionsChange={setMarineOptions}
                isLoading={marineLoading}
              />
              <ShipTypeFilter
                selectedTypes={selectedTypes}
                onToggleType={handleToggleTypes}
                shipCounts={shipCounts}
              />
            </>
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
          Oppdateres automatisk hvert 60. sekund
        </p>
      </footer>
    </div>
  );
}

export default App;
