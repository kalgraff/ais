/**
 * React hook for å hente og oppdatere AIS-data
 */

import { useState, useEffect, useCallback } from 'react';
import { barentsWatchAPI } from '../services/barentswatch';
import type { AISPosition, AISFilter } from '../types/ais';

interface UseAISDataResult {
  ships: AISPosition[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for å hente AIS-data med automatisk oppdatering
 * @param filter - Valgfritt filter for å begrense søket
 * @param autoRefreshInterval - Intervall for automatisk oppdatering i millisekunder (standard 30s)
 * @param enabled - Om datahentingen skal være aktivert (standard true)
 */
export function useAISData(
  filter?: AISFilter,
  autoRefreshInterval: number = 30000,
  enabled: boolean = true
): UseAISDataResult {
  const [ships, setShips] = useState<AISPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await barentsWatchAPI.getAISData(filter);
      setShips(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Ukjent feil');
      setError(errorMessage);
      console.error('Feil ved henting av AIS-data:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, enabled]);

  // Initial datahenting
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Automatisk oppdatering
  useEffect(() => {
    if (!enabled || !autoRefreshInterval) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchData();
    }, autoRefreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchData, autoRefreshInterval, enabled]);

  return {
    ships,
    loading,
    error,
    refetch: fetchData,
  };
}
