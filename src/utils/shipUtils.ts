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
 * Hent land basert på MMSI Maritime Identification Digits (MID)
 * De første 3 sifrene i MMSI identifiserer landet
 */
export function getCountryFromMMSI(mmsi: number): string {
  const mid = Math.floor(mmsi / 1000000); // Hent første 3 sifre

  // Maritime Identification Digits (MID) mapping
  const midToCountry: Record<number, string> = {
    201: '🇩🇪 Tyskland',
    202: '🇬🇧 Storbritannia',
    203: '🇦🇹 Østerrike',
    204: '🇵🇹 Portugal',
    205: '🇧🇪 Belgia',
    206: '🇫🇷 Frankrike',
    207: '🇲🇨 Monaco',
    208: '🇫🇷 Frankrike',
    209: '🇨🇾 Kypros',
    210: '🇨🇾 Kypros',
    211: '🇩🇪 Tyskland',
    212: '🇨🇾 Kypros',
    213: '🇬🇪 Georgia',
    214: '🇪🇸 Spania',
    215: '🇲🇹 Malta',
    216: '🇦🇲 Armenia',
    218: '🇩🇪 Tyskland',
    219: '🇩🇰 Danmark',
    220: '🇩🇰 Danmark',
    224: '🇪🇸 Spania',
    225: '🇪🇸 Spania',
    226: '🇫🇷 Frankrike',
    227: '🇫🇷 Frankrike',
    228: '🇫🇷 Frankrike',
    229: '🇲🇹 Malta',
    230: '🇫🇮 Finland',
    231: '🇫🇴 Færøyene',
    232: '🇬🇧 Storbritannia',
    233: '🇬🇧 Storbritannia',
    234: '🇬🇧 Storbritannia',
    235: '🇬🇧 Storbritannia',
    236: '🇬🇮 Gibraltar',
    237: '🇬🇷 Hellas',
    238: '🇭🇷 Kroatia',
    239: '🇬🇷 Hellas',
    240: '🇬🇷 Hellas',
    241: '🇬🇷 Hellas',
    242: '🇲🇦 Marokko',
    243: '🇭🇺 Ungarn',
    244: '🇳🇱 Nederland',
    245: '🇳🇱 Nederland',
    246: '🇳🇱 Nederland',
    247: '🇮🇹 Italia',
    248: '🇲🇹 Malta',
    249: '🇲🇹 Malta',
    250: '🇮🇪 Irland',
    251: '🇮🇸 Island',
    252: '🇱🇮 Liechtenstein',
    253: '🇱🇺 Luxembourg',
    254: '🇲🇨 Monaco',
    255: '🇵🇹 Madeira',
    256: '🇲🇹 Malta',
    257: '🇳🇴 Norge',
    258: '🇳🇴 Norge',
    259: '🇳🇴 Norge',
    261: '🇵🇱 Polen',
    262: '🇲🇪 Montenegro',
    263: '🇵🇹 Portugal',
    264: '🇷🇴 Romania',
    265: '🇸🇪 Sverige',
    266: '🇸🇪 Sverige',
    267: '🇸🇰 Slovakia',
    268: '🇸🇲 San Marino',
    269: '🇨🇭 Sveits',
    270: '🇨🇿 Tsjekkia',
    271: '🇹🇷 Tyrkia',
    272: '🇺🇦 Ukraina',
    273: '🇷🇺 Russland',
    274: '🇲🇰 Nord-Makedonia',
    275: '🇱🇻 Latvia',
    276: '🇪🇪 Estland',
    277: '🇱🇹 Litauen',
    278: '🇸🇮 Slovenia',
    279: '🇷🇸 Serbia',
    301: '🇦🇮 Anguilla',
    303: '🇺🇸 USA (Alaska)',
    304: '🇦🇬 Antigua og Barbuda',
    305: '🇦🇬 Antigua og Barbuda',
    306: '🇳🇱 Curaçao',
    307: '🇦🇼 Aruba',
    308: '🇧🇸 Bahamas',
    309: '🇧🇸 Bahamas',
    310: '🇧🇲 Bermuda',
    311: '🇧🇸 Bahamas',
    312: '🇧🇿 Belize',
    314: '🇧🇧 Barbados',
    316: '🇨🇦 Canada',
    319: '🇰🇾 Caymanøyene',
    321: '🇨🇷 Costa Rica',
    323: '🇨🇺 Cuba',
    325: '🇩🇲 Dominica',
    327: '🇩🇴 Den dominikanske republikk',
    329: '🇬🇵 Guadeloupe',
    330: '🇬🇩 Grenada',
    331: '🇬🇱 Grønland',
    332: '🇬🇹 Guatemala',
    334: '🇭🇳 Honduras',
    336: '🇭🇹 Haiti',
    338: '🇺🇸 USA',
    339: '🇯🇲 Jamaica',
    341: '🇰🇳 Saint Kitts og Nevis',
    343: '🇱🇨 Saint Lucia',
    345: '🇲🇽 Mexico',
    347: '🇲🇶 Martinique',
    348: '🇲🇸 Montserrat',
    350: '🇳🇮 Nicaragua',
    351: '🇵🇦 Panama',
    352: '🇵🇦 Panama',
    353: '🇵🇦 Panama',
    354: '🇵🇦 Panama',
    355: '🇵🇦 Panama',
    356: '🇵🇦 Panama',
    357: '🇵🇦 Panama',
    358: '🇵🇷 Puerto Rico',
    359: '🇸🇻 El Salvador',
    361: '🇵🇲 Saint Pierre og Miquelon',
    362: '🇹🇹 Trinidad og Tobago',
    364: '🇹🇨 Turks- og Caicosøyene',
    366: '🇺🇸 USA',
    367: '🇺🇸 USA',
    368: '🇺🇸 USA',
    369: '🇺🇸 USA',
    370: '🇵🇦 Panama',
    371: '🇵🇦 Panama',
    372: '🇵🇦 Panama',
    373: '🇵🇦 Panama',
    374: '🇵🇦 Panama',
    375: '🇻🇨 Saint Vincent og Grenadinene',
    376: '🇻🇨 Saint Vincent og Grenadinene',
    377: '🇻🇨 Saint Vincent og Grenadinene',
    378: '🇻🇮 Jomfruøyene (britiske)',
    379: '🇻🇮 Jomfruøyene (amerikanske)',
    401: '🇦🇫 Afghanistan',
    403: '🇸🇦 Saudi-Arabia',
    405: '🇧🇩 Bangladesh',
    408: '🇧🇭 Bahrain',
    410: '🇧🇹 Bhutan',
    412: '🇨🇳 Kina',
    413: '🇨🇳 Kina',
    414: '🇨🇳 Kina',
    416: '🇹🇼 Taiwan',
    417: '🇱🇰 Sri Lanka',
    419: '🇮🇳 India',
    422: '🇮🇷 Iran',
    423: '🇦🇿 Aserbajdsjan',
    425: '🇮🇶 Irak',
    428: '🇮🇱 Israel',
    431: '🇯🇵 Japan',
    432: '🇯🇵 Japan',
    434: '🇹🇲 Turkmenistan',
    436: '🇰🇿 Kasakhstan',
    437: '🇺🇿 Usbekistan',
    438: '🇯🇴 Jordan',
    440: '🇰🇷 Sør-Korea',
    441: '🇰🇷 Sør-Korea',
    443: '🇵🇸 Palestina',
    445: '🇰🇵 Nord-Korea',
    447: '🇰🇼 Kuwait',
    450: '🇱🇧 Libanon',
    451: '🇰🇬 Kirgisistan',
    453: '🇲🇴 Macao',
    455: '🇲🇻 Maldivene',
    457: '🇲🇳 Mongolia',
    459: '🇳🇵 Nepal',
    461: '🇴🇲 Oman',
    463: '🇵🇰 Pakistan',
    466: '🇶🇦 Qatar',
    468: '🇸🇾 Syria',
    470: '🇦🇪 De forente arabiske emirater',
    471: '🇦🇪 De forente arabiske emirater',
    472: '🇹🇯 Tadsjikistan',
    473: '🇾🇪 Jemen',
    475: '🇾🇪 Jemen',
    477: '🇭🇰 Hong Kong',
    478: '🇧🇦 Bosnia-Hercegovina',
    501: '🇦🇶 Antarktis',
    503: '🇦🇺 Australia',
    506: '🇲🇲 Myanmar',
    508: '🇧🇳 Brunei',
    510: '🇫🇲 Mikronesiaføderasjonen',
    511: '🇵🇼 Palau',
    512: '🇳🇿 New Zealand',
    514: '🇰🇭 Kambodsja',
    515: '🇰🇭 Kambodsja',
    516: '🇨🇽 Christmasøya',
    518: '🇨🇰 Cookøyene',
    520: '🇫🇯 Fiji',
    523: '🇨🇨 Kokosøyene',
    525: '🇮🇩 Indonesia',
    529: '🇰🇮 Kiribati',
    531: '🇱🇦 Laos',
    533: '🇲🇾 Malaysia',
    536: '🇲🇵 Nord-Marianene',
    538: '🇲🇭 Marshalløyene',
    540: '🇳🇨 Ny-Caledonia',
    542: '🇳🇷 Nauru',
    544: '🇳🇺 Niue',
    546: '🇵🇫 Fransk Polynesia',
    548: '🇵🇭 Filippinene',
    553: '🇵🇬 Papua Ny-Guinea',
    555: '🇵🇳 Pitcairnøyene',
    557: '🇸🇧 Salomonøyene',
    559: '🇦🇸 Amerikansk Samoa',
    561: '🇼🇸 Samoa',
    563: '🇸🇬 Singapore',
    564: '🇸🇬 Singapore',
    565: '🇸🇬 Singapore',
    566: '🇸🇬 Singapore',
    567: '🇹🇭 Thailand',
    570: '🇹🇴 Tonga',
    572: '🇹🇻 Tuvalu',
    574: '🇻🇳 Vietnam',
    576: '🇻🇺 Vanuatu',
    577: '🇻🇺 Vanuatu',
    578: '🇼🇫 Wallis og Futuna',
    601: '🇿🇦 Sør-Afrika',
    603: '🇦🇴 Angola',
    605: '🇩🇿 Algerie',
    607: '🇸🇹 São Tomé og Príncipe',
    608: '🇧🇼 Botswana',
    609: '🇧🇮 Burundi',
    610: '🇨🇲 Kamerun',
    611: '🇨🇫 Den sentralafrikanske republikk',
    612: '🇹🇩 Tsjad',
    613: '🇨🇲 Kamerun',
    615: '🇨🇬 Kongo-Brazzaville',
    616: '🇰🇲 Komorene',
    617: '🇨🇻 Kapp Verde',
    618: '🇸🇳 Senegal',
    619: '🇨🇮 Elfenbenskysten',
    620: '🇰🇲 Komorene',
    621: '🇩🇯 Djibouti',
    622: '🇪🇬 Egypt',
    624: '🇪🇹 Etiopia',
    625: '🇪🇷 Eritrea',
    626: '🇬🇦 Gabon',
    627: '🇬🇭 Ghana',
    629: '🇬🇲 Gambia',
    630: '🇬🇼 Guinea-Bissau',
    631: '🇬🇶 Ekvatorial-Guinea',
    632: '🇬🇳 Guinea',
    633: '🇧🇫 Burkina Faso',
    634: '🇰🇪 Kenya',
    635: '🇱🇷 Liberia',
    636: '🇱🇷 Liberia',
    637: '🇱🇷 Liberia',
    638: '🇸🇸 Sør-Sudan',
    642: '🇱🇾 Libya',
    644: '🇱🇸 Lesotho',
    645: '🇲🇺 Mauritius',
    647: '🇲🇬 Madagaskar',
    649: '🇲🇱 Mali',
    650: '🇲🇿 Mosambik',
    654: '🇲🇷 Mauritania',
    655: '🇲🇼 Malawi',
    656: '🇳🇪 Niger',
    657: '🇳🇬 Nigeria',
    659: '🇳🇦 Namibia',
    660: '🇷🇪 Réunion',
    661: '🇷🇼 Rwanda',
    662: '🇸🇩 Sudan',
    663: '🇸🇳 Senegal',
    664: '🇸🇨 Seychellene',
    665: '🇸🇭 Saint Helena',
    666: '🇸🇴 Somalia',
    667: '🇸🇱 Sierra Leone',
    668: '🇸🇹 São Tomé og Príncipe',
    669: '🇸🇿 Eswatini',
    670: '🇹🇩 Tsjad',
    671: '🇹🇬 Togo',
    672: '🇹🇳 Tunisia',
    674: '🇹🇿 Tanzania',
    675: '🇺🇬 Uganda',
    676: '🇨🇩 Kongo-Kinshasa',
    677: '🇹🇿 Tanzania',
    678: '🇿🇲 Zambia',
    679: '🇿🇼 Zimbabwe',
    701: '🇦🇷 Argentina',
    710: '🇧🇷 Brasil',
    720: '🇧🇴 Bolivia',
    725: '🇨🇱 Chile',
    730: '🇨🇴 Colombia',
    735: '🇪🇨 Ecuador',
    740: '🇬🇧 Falklandsøyene',
    745: '🇬🇾 Guyana',
    750: '🇵🇾 Paraguay',
    755: '🇵🇪 Peru',
    760: '🇸🇷 Surinam',
    765: '🇺🇾 Uruguay',
    770: '🇻🇪 Venezuela',
  };

  return midToCountry[mid] || '🌍 Ukjent';
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
  parts.push(`<strong>Nasjonalitet:</strong> ${getCountryFromMMSI(ship.mmsi)}`);

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
