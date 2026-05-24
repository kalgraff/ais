/**
 * AIS-data typer basert på BarentsWatch API
 */

export interface AISPosition {
  mmsi: number; // Maritime Mobile Service Identity - unik identifikator
  name?: string; // Skipets navn
  shipType?: number; // Type skip (kode)
  shipTypeText?: string; // Type skip (tekst)
  latitude: number; // Breddegrad
  longitude: number; // Lengdegrad
  speedOverGround?: number; // Fart over bakken i knop
  courseOverGround?: number; // Kurs over bakken i grader
  trueHeading?: number; // Faktisk heading i grader
  navigationalStatus?: number; // Navigasjonsstatus (kode)
  navigationalStatusText?: string; // Navigasjonsstatus (tekst)
  rateOfTurn?: number; // Rotasjonshastighet
  destination?: string; // Destinasjon
  eta?: string; // Estimert ankomsttid
  draught?: number; // Dypgang i meter
  positionFixingDevice?: number; // Type posisjonssystem
  dataSourceType?: string; // Datakilde
  msgtime: string; // Tidspunkt for melding (ISO 8601)
  callSign?: string; // Kallesignal
  imo?: number; // IMO-nummer
  length?: number; // Lengde i meter
  width?: number; // Bredde i meter
  dimensionA?: number; // Dimensjon A (til GPS fra baugen)
  dimensionB?: number; // Dimensjon B (til GPS fra akterenden)
  dimensionC?: number; // Dimensjon C (til GPS fra babord)
  dimensionD?: number; // Dimensjon D (til GPS fra styrbord)
}

export interface AISFilter {
  minLatitude?: number;
  maxLatitude?: number;
  minLongitude?: number;
  maxLongitude?: number;
  shipTypes?: number[];
  mmsi?: number[];
}

export interface BarentsWatchAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AISApiResponse {
  items: AISPosition[];
  totalCount: number;
}

export const ShipType = {
  NotAvailable: 0,
  Reserved1: 1,
  Reserved2: 2,
  Reserved3: 3,
  Reserved4: 4,
  Reserved5: 5,
  Reserved6: 6,
  Reserved7: 7,
  Reserved8: 8,
  Reserved9: 9,
  Reserved10: 10,
  Reserved11: 11,
  Reserved12: 12,
  Reserved13: 13,
  Reserved14: 14,
  Reserved15: 15,
  Reserved16: 16,
  Reserved17: 17,
  Reserved18: 18,
  Reserved19: 19,
  WingInGround: 20,
  WingInGroundHazardousCategoryA: 21,
  WingInGroundHazardousCategoryB: 22,
  WingInGroundHazardousCategoryC: 23,
  WingInGroundHazardousCategoryD: 24,
  Fishing: 30,
  Towing: 31,
  TowingLarge: 32,
  DredgingOrUnderwaterOps: 33,
  DivingOps: 34,
  MilitaryOps: 35,
  Sailing: 36,
  PleasureCraft: 37,
  HighSpeedCraft: 40,
  HighSpeedCraftHazardousCategoryA: 41,
  HighSpeedCraftHazardousCategoryB: 42,
  HighSpeedCraftHazardousCategoryC: 43,
  HighSpeedCraftHazardousCategoryD: 44,
  PilotVessel: 50,
  SearchAndRescueVessel: 51,
  Tug: 52,
  PortTender: 53,
  AntiPollutionEquipment: 54,
  LawEnforcement: 55,
  MedicalTransport: 58,
  PassengerShip: 60,
  PassengerShipHazardousCategoryA: 61,
  PassengerShipHazardousCategoryB: 62,
  PassengerShipHazardousCategoryC: 63,
  PassengerShipHazardousCategoryD: 64,
  Cargo: 70,
  CargoHazardousCategoryA: 71,
  CargoHazardousCategoryB: 72,
  CargoHazardousCategoryC: 73,
  CargoHazardousCategoryD: 74,
  Tanker: 80,
  TankerHazardousCategoryA: 81,
  TankerHazardousCategoryB: 82,
  TankerHazardousCategoryC: 83,
  TankerHazardousCategoryD: 84,
  Other: 90,
} as const;

export type ShipType = (typeof ShipType)[keyof typeof ShipType];
