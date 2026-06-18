/**
 * Hjelpefunksjoner for å håndtere skipsinformasjon
 */

import type { AISPosition } from '../types/ais';
import { ShipType } from '../types/ais';

/**
 * Konverter skipstypekode til lesbar tekst
 */
export function getShipTypeText(shipType?: number, name?: string): string {
  // Sjekk om det er en bøye basert på navn (inkludert feilstavinger)
  if (name) {
    const upperName = name.toUpperCase();
    if (upperName.includes('BUOY') || upperName.includes('BOUY') || upperName.includes('BØYE')) {
      return 'Bøye';
    }
    // Sjekk om det er en plattform/rigg
    if (
      upperName.includes('PLATFORM') ||
      upperName.includes('DEEPSEA') ||
      upperName.includes('OCEAN RIG') ||
      upperName.includes('NORNE')
    ) {
      return 'Plattform/Rigg';
    }
    // Sjekk om det er akvakultur/fiskeoppdrett
    if (
      upperName.includes('SOJ') ||
      upperName.includes('SOY') ||
      upperName.includes('FISHIES') ||
      upperName.includes('FISH FARM') ||
      upperName.includes('MERD') ||
      upperName.includes('AKVA')
    ) {
      return 'Akvakultur';
    }
  }

  if (shipType === undefined) return 'Ukjent';

  switch (shipType) {
    case ShipType.Fishing:
      return 'Fiskebåt';
    case ShipType.Towing:
    case ShipType.TowingLarge:
      return 'Slepebåt';
    case ShipType.Sailing:
      return 'Seilbåt';
    case ShipType.PleasureCraft:
      return 'Fritidsbåt';
    case ShipType.PassengerShip:
    case ShipType.PassengerShipHazardousCategoryA:
    case ShipType.PassengerShipHazardousCategoryB:
    case ShipType.PassengerShipHazardousCategoryC:
    case ShipType.PassengerShipHazardousCategoryD:
      return 'Passasjerskip';
    case ShipType.Cargo:
    case ShipType.CargoHazardousCategoryA:
    case ShipType.CargoHazardousCategoryB:
    case ShipType.CargoHazardousCategoryC:
    case ShipType.CargoHazardousCategoryD:
      return 'Lasteskip';
    case ShipType.Tanker:
    case ShipType.TankerHazardousCategoryA:
    case ShipType.TankerHazardousCategoryB:
    case ShipType.TankerHazardousCategoryC:
    case ShipType.TankerHazardousCategoryD:
      return 'Tankskip';
    case ShipType.HighSpeedCraft:
    case ShipType.HighSpeedCraftHazardousCategoryA:
    case ShipType.HighSpeedCraftHazardousCategoryB:
    case ShipType.HighSpeedCraftHazardousCategoryC:
    case ShipType.HighSpeedCraftHazardousCategoryD:
      return 'Hurtigbåt';
    case ShipType.PilotVessel:
      return 'Losbåt';
    case ShipType.SearchAndRescueVessel:
      return 'Redningsskøyte';
    case ShipType.Tug:
      return 'Taubåt';
    case ShipType.PortTender:
      return 'Havnebåt';
    case ShipType.MedicalTransport:
      return 'Ambulansebåt';
    case ShipType.DredgingOrUnderwaterOps:
      return 'Mudringsfartøy';
    case ShipType.DivingOps:
      return 'Dykkerfartøy';
    case ShipType.MilitaryOps:
      return 'Militært fartøy';
    default:
      return 'Annet fartøy';
  }
}

/**
 * Formater fart for visning
 */
export function formatSpeed(speed?: number): string {
  if (speed === undefined || speed === null) return 'N/A';
  return `${speed.toFixed(1)} knop`;
}

/**
 * Formater kurs for visning
 */
export function formatCourse(course?: number): string {
  if (course === undefined || course === null) return 'N/A';
  return `${course.toFixed(0)}°`;
}

/**
 * Formater posisjon for visning
 */
export function formatPosition(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'Ø' : 'V';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

/**
 * Formater tidspunkt for visning
 */
export function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return 'Ukjent tid';
  }
}

/**
 * Beregn farge basert på skipstype og navn
 */
export function getShipColor(shipType?: number, name?: string): string {
  // Sjekk om det er en bøye basert på navn (inkludert feilstavinger)
  if (name) {
    const upperName = name.toUpperCase();
    if (upperName.includes('BUOY') || upperName.includes('BOUY') || upperName.includes('BØYE')) {
      return '#FF6F00'; // Oransje for bøyer
    }
    // Sjekk om det er en plattform/rigg
    if (
      upperName.includes('PLATFORM') ||
      upperName.includes('DEEPSEA') ||
      upperName.includes('OCEAN RIG') ||
      upperName.includes('NORNE')
    ) {
      return '#8B4513'; // Brun for plattformer
    }
    // Sjekk om det er akvakultur/fiskeoppdrett
    if (
      upperName.includes('SOJ') ||
      upperName.includes('SOY') ||
      upperName.includes('FISHIES') ||
      upperName.includes('FISH FARM') ||
      upperName.includes('MERD') ||
      upperName.includes('AKVA')
    ) {
      return '#00CED1'; // Turkis for akvakultur
    }
  }

  if (shipType === undefined) return '#808080';

  switch (shipType) {
    case ShipType.Fishing:
      return '#4CAF50'; // Grønn
    case ShipType.PassengerShip:
    case ShipType.PassengerShipHazardousCategoryA:
    case ShipType.PassengerShipHazardousCategoryB:
    case ShipType.PassengerShipHazardousCategoryC:
    case ShipType.PassengerShipHazardousCategoryD:
      return '#2196F3'; // Blå
    case ShipType.Cargo:
    case ShipType.CargoHazardousCategoryA:
    case ShipType.CargoHazardousCategoryB:
    case ShipType.CargoHazardousCategoryC:
    case ShipType.CargoHazardousCategoryD:
      return '#FF9800'; // Oransje
    case ShipType.Tanker:
    case ShipType.TankerHazardousCategoryA:
    case ShipType.TankerHazardousCategoryB:
    case ShipType.TankerHazardousCategoryC:
    case ShipType.TankerHazardousCategoryD:
      return '#F44336'; // Rød
    case ShipType.Sailing:
    case ShipType.PleasureCraft:
      return '#9C27B0'; // Lilla
    default:
      return '#607D8B'; // Grå
  }
}

/**
 * Generer detaljert informasjon om et skip for popup
 */
export function generateShipInfo(ship: AISPosition): string {
  const parts: string[] = [];

  if (ship.name) {
    parts.push(`<strong>Navn:</strong> ${ship.name}`);
  }

  parts.push(`<strong>MMSI:</strong> ${ship.mmsi}`);

  if (ship.shipType !== undefined || ship.name) {
    parts.push(`<strong>Type:</strong> ${getShipTypeText(ship.shipType, ship.name)}`);
  }

  if (ship.callSign) {
    parts.push(`<strong>Kallesignal:</strong> ${ship.callSign}`);
  }

  if (ship.speedOverGround !== undefined) {
    parts.push(`<strong>Fart:</strong> ${formatSpeed(ship.speedOverGround)}`);
  }

  if (ship.courseOverGround !== undefined) {
    parts.push(`<strong>Kurs:</strong> ${formatCourse(ship.courseOverGround)}`);
  }

  parts.push(`<strong>Posisjon:</strong> ${formatPosition(ship.latitude, ship.longitude)}`);

  if (ship.destination) {
    parts.push(`<strong>Destinasjon:</strong> ${ship.destination}`);
  }

  if (ship.eta) {
    parts.push(`<strong>ETA:</strong> ${formatTimestamp(ship.eta)}`);
  }

  if (ship.length && ship.width) {
    parts.push(`<strong>Dimensjoner:</strong> ${ship.length} × ${ship.width} m`);
  }

  parts.push(`<strong>Sist oppdatert:</strong> ${formatTimestamp(ship.msgtime)}`);

  return parts.join('<br>');
}
