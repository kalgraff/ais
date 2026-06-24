/**
 * BarentsWatch API-klient for å hente AIS-data
 */

import type {
  AISPosition,
  AISFilter,
  BarentsWatchAuthResponse,
} from '../types/ais';

// Bruk proxy i development, direkte URL i production
const AUTH_URL = import.meta.env.DEV 
  ? '/auth/connect/token' 
  : 'https://id.barentswatch.no/connect/token';
const AIS_API_URL = import.meta.env.DEV 
  ? '/api/v1' 
  : 'https://live.ais.barentswatch.no/v1';
const CLIENT_ID = import.meta.env.VITE_BARENTSWATCH_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_BARENTSWATCH_CLIENT_SECRET;

class BarentsWatchAPI {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Autentiser mot BarentsWatch API og hent access token
   */
  private async authenticate(): Promise<void> {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error(
        'BarentsWatch API credentials mangler. Sjekk .env filen din.'
      );
    }

    // Sjekk om vi allerede har et gyldig token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return;
    }

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          scope: 'ais',
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Autentisering feilet: ${response.status} ${response.statusText}`
        );
      }

      const data: BarentsWatchAuthResponse = await response.json();
      this.accessToken = data.access_token;
      // Sett utløpstid til 5 minutter før faktisk utløp for sikkerhet
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
    } catch (error) {
      console.error('Autentisering feilet:', error);
      throw error;
    }
  }

  /**
   * Hent AIS-data for alle skip innenfor et geografisk område
   */
  async getAISData(filter?: AISFilter): Promise<AISPosition[]> {
    await this.authenticate();

    if (!this.accessToken) {
      throw new Error('Ingen access token tilgjengelig');
    }

    try {
      // Bygg query parameters
      const params = new URLSearchParams();

      if (filter) {
        if (filter.minLatitude !== undefined) {
          params.append('minLatitude', filter.minLatitude.toString());
        }
        if (filter.maxLatitude !== undefined) {
          params.append('maxLatitude', filter.maxLatitude.toString());
        }
        if (filter.minLongitude !== undefined) {
          params.append('minLongitude', filter.minLongitude.toString());
        }
        if (filter.maxLongitude !== undefined) {
          params.append('maxLongitude', filter.maxLongitude.toString());
        }
        if (filter.shipTypes && filter.shipTypes.length > 0) {
          filter.shipTypes.forEach((type) => {
            params.append('shipTypes', type.toString());
          });
        }
        if (filter.mmsi && filter.mmsi.length > 0) {
          filter.mmsi.forEach((mmsi) => {
            params.append('mmsi', mmsi.toString());
          });
        }
      }

      const queryString = params.toString();
      const url = `${AIS_API_URL}/latest/combined${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token utløpt, forsøk re-autentisering
          this.accessToken = null;
          this.tokenExpiry = 0;
          return this.getAISData(filter);
        }
        throw new Error(`API-kall feilet: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // API returnerer en array direkte, ikke et objekt med items
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Feil ved henting av AIS-data:', error);
      throw error;
    }
  }

  /**
   * Hent AIS-data for et spesifikt skip basert på MMSI
   */
  async getShipByMMSI(mmsi: number): Promise<AISPosition | null> {
    const ships = await this.getAISData({ mmsi: [mmsi] });
    return ships.length > 0 ? ships[0] : null;
  }

  /**
   * Hent AIS-data for skip innenfor et bestemt område (bounding box)
   */
  async getShipsInArea(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
  ): Promise<AISPosition[]> {
    return this.getAISData({
      minLatitude: minLat,
      maxLatitude: maxLat,
      minLongitude: minLon,
      maxLongitude: maxLon,
    });
  }
}

// Eksporter singleton-instans
export const barentsWatchAPI = new BarentsWatchAPI();
