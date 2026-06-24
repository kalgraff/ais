/**
 * React hook for å hente marine data
 */

import { useState, useEffect } from 'react';
import { getMarineData } from '../services/marine';
import type { MarineDataPoint } from '../types/marine';

interface UseMarineDataResult {
  data: MarineDataPoint[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for å hente marine data for et grid av punkter
 */
export function useMarineData(
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  } | null,
  enabled: boolean = false
): UseMarineDataResult {
  const [data, setData] = useState<MarineDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !bounds) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData([]);
      return;
    }

    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const dataPoints: MarineDataPoint[] = [];
        const gridSize = 0.5; // 0.5 grader mellom punkter (~50km)

        // Begrens antall punkter for å ikke overbelaste API
        const latSteps = Math.min(8, Math.ceil((bounds.maxLat - bounds.minLat) / gridSize));
        const lonSteps = Math.min(8, Math.ceil((bounds.maxLon - bounds.minLon) / gridSize));

        const actualLatStep = (bounds.maxLat - bounds.minLat) / latSteps;
        const actualLonStep = (bounds.maxLon - bounds.minLon) / lonSteps;

        for (let i = 0; i <= latSteps; i++) {
          for (let j = 0; j <= lonSteps; j++) {
            if (isCancelled) return;

            const lat = bounds.minLat + i * actualLatStep;
            const lon = bounds.minLon + j * actualLonStep;

            const point = await getMarineData(lat, lon);
            if (point && !isCancelled) {
              dataPoints.push(point);
            }

            // Liten forsinkelse for å ikke overbelaste API
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        if (!isCancelled) {
          setData(dataPoints);
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMessage = err instanceof Error ? err : new Error('Ukjent feil');
          setError(errorMessage);
          console.error('Feil ved henting av marine data:', err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
    // Vi bruker individuelle properties istedenfor hele bounds objektet
    // for å unngå unødvendige re-renders når objektet får ny referanse
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, bounds?.minLat, bounds?.maxLat, bounds?.minLon, bounds?.maxLon]);

  return {
    data,
    loading,
    error,
  };
}
