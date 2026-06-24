/**
 * Hovedapplikasjon for AIS-visning
 */

import { useState, useMemo, useEffect } from 'react';
import { ShipMap } from './components/ShipMap';
import { ShipTypeFilter } from './components/ShipTypeFilter';
import { MarineOverlayControl } from './components/MarineOverlayControl';
import { AutoRefreshControl } from './components/AutoRefreshControl';
import { ShipSearch } from './components/ShipSearch';
import { useAISData } from './hooks/useAISData';
import { useMarineData } from './hooks/useMarineData';
import type { AISFilter, AISPosition } from './types/ais';
import type { MarineOverlayOptions } from './types/marine';
import './App.css';

function App() {
  // Standard filter for norsk kyst, inkludert Svalbard og Jan Mayen
  const [filter] = useState<AISFilter>({
    minLatitude: 57.0,
    maxLatitude: 81.0,  // Utvidet nordover til Svalbard
    minLongitude: -10.0, // Utvidet vestover til Jan Mayen
    maxLongitude: 34.0,  // Utvidet østover til østre Svalbard
  });

  // Valgte skip-typer (starter med alle valgt)
  const [selectedTypes, setSelectedTypes] = useState<Set<number>>(new Set());

  // Marine overlay options
  const [marineOptions, setMarineOptions] = useState<MarineOverlayOptions>({
    showTemperature: false,
    showWaves: false,
    showCurrents: false,
  });

  // Auto-refresh options
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(60000); // 1 minutt som standard

  // Ship tracking
  const [trackedShipMMSI, setTrackedShipMMSI] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  const { ships: allShips, loading, error, refetch } = useAISData(
    filter,
    autoRefreshInterval,
    autoRefreshEnabled
  );

  // Finn det trackede skipet i oppdatert data
  const trackedShip = useMemo(() => {
    if (!trackedShipMMSI) return null;
    return allShips.find((ship) => ship.mmsi === trackedShipMMSI) || null;
  }, [allShips, trackedShipMMSI]);

  // Oppdater tracking state hvis skipet forsvinner
  useEffect(() => {
    if (trackedShipMMSI && !trackedShip) {
      setTrackedShipMMSI(null);
      setIsTracking(false);
    }
  }, [trackedShipMMSI, trackedShip]);

  const handleTrackShip = (ship: AISPosition | null) => {
    if (ship) {
      setTrackedShipMMSI(ship.mmsi);
      setIsTracking(true);
    } else {
      setTrackedShipMMSI(null);
      setIsTracking(false);
    }
  };

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
    let filteredShips: AISPosition[] = [];
    
    if (selectedTypes.size === 0) {
      filteredShips = []; // Vis ingen skip hvis ingen typer er valgt
    } else {
      filteredShips = allShips.filter((ship) => {
        const upperName = ship.name?.toUpperCase() || '';
        
        // Sjekk for bøyer (type -1 betyr navn-basert filtrering, inkludert feilstavinger)
        if (selectedTypes.has(-1)) {
          const isBuoy = upperName.includes('BUOY') || 
                         upperName.includes('BOUY') || 
                         upperName.includes('BØYE');
          if (isBuoy) return true;
        }
        
        // Sjekk for plattformer/rigger (type -2)
        if (selectedTypes.has(-2)) {
          const isPlatform = upperName.includes('PLATFORM') ||
                            upperName.includes('DEEPSEA') ||
                            upperName.includes('OCEAN RIG') ||
                            upperName.includes('NORNE');
          if (isPlatform) return true;
        }
        
        // Sjekk for akvakultur (type -3)
        if (selectedTypes.has(-3)) {
          const isAquaculture = upperName.includes('SOJ') ||
                               upperName.includes('SOY') ||
                               upperName.includes('FISHIES') ||
                               upperName.includes('FISH FARM') ||
                               upperName.includes('MERD') ||
                               upperName.includes('AKVA');
          if (isAquaculture) return true;
        }
        
        // Vanlig shipType filtrering
        return ship.shipType !== undefined && selectedTypes.has(ship.shipType);
      });
    }
    
    // Alltid inkluder tracked skip, selv om det ikke matcher filteret
    if (trackedShip && !filteredShips.find((s) => s.mmsi === trackedShip.mmsi)) {
      filteredShips = [...filteredShips, trackedShip];
    }
    
    return filteredShips;
  }, [allShips, selectedTypes, trackedShip]);

  // Tell antall skip per type
  const shipCounts = useMemo(() => {
    const counts = new Map<number, number>();
    
    // Tell spesielle navn-baserte kategorier
    let buoyCount = 0;
    let platformCount = 0;
    let aquacultureCount = 0;
    
    allShips.forEach((ship) => {
      const upperName = ship.name?.toUpperCase() || '';
      
      // Tell bøyer (inkludert feilstavinger)
      const isBuoy = upperName.includes('BUOY') || 
                     upperName.includes('BOUY') || 
                     upperName.includes('BØYE');
      if (isBuoy) {
        buoyCount++;
      }
      
      // Tell plattformer/rigger
      const isPlatform = upperName.includes('PLATFORM') ||
                        upperName.includes('DEEPSEA') ||
                        upperName.includes('OCEAN RIG') ||
                        upperName.includes('NORNE');
      if (isPlatform) {
        platformCount++;
      }
      
      // Tell akvakultur
      const isAquaculture = upperName.includes('SOJ') ||
                           upperName.includes('SOY') ||
                           upperName.includes('FISHIES') ||
                           upperName.includes('FISH FARM') ||
                           upperName.includes('MERD') ||
                           upperName.includes('AKVA');
      if (isAquaculture) {
        aquacultureCount++;
      }
      
      // Tell vanlige skip-typer
      if (ship.shipType !== undefined) {
        counts.set(ship.shipType, (counts.get(ship.shipType) || 0) + 1);
      }
    });
    
    // Legg til spesielle kategorier
    counts.set(-1, buoyCount);
    counts.set(-2, platformCount);
    counts.set(-3, aquacultureCount);
    
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
                autoFit={ships.length > 0 && !isTracking}
                marineData={marineData}
                marineOptions={marineOptions}
                trackedShip={trackedShip}
                isTracking={isTracking}
              />
              <ShipSearch
                ships={allShips}
                trackedShip={trackedShip}
                onTrackShip={handleTrackShip}
                isTracking={isTracking}
              />
              <AutoRefreshControl
                enabled={autoRefreshEnabled}
                interval={autoRefreshInterval}
                onToggle={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                onIntervalChange={setAutoRefreshInterval}
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
          {autoRefreshEnabled && (
            <>
              {' • '}
              Oppdateres automatisk hvert{' '}
              {autoRefreshInterval === 30000
                ? '30. sekund'
                : autoRefreshInterval === 60000
                  ? '60. sekund'
                  : autoRefreshInterval === 180000
                    ? '3. minutt'
                    : '5. minutt'}
            </>
          )}
        </p>
      </footer>
    </div>
  );
}

export default App;
