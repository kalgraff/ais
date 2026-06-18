/**
 * Script for å analysere skip i "Andre / Ukjent" kategorien
 * Krever Node.js 18+ (innebygd fetch)
 */

const CLIENT_ID = process.env.VITE_BARENTSWATCH_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_BARENTSWATCH_CLIENT_SECRET;

// Ship types som tilhører "Andre / Ukjent"
const UNKNOWN_TYPES = [0, 99]; // Other, NotAvailable

async function authenticate() {
  const response = await fetch('https://id.barentswatch.no/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'ais',
    }),
  });

  if (!response.ok) {
    throw new Error(`Auth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function getAISData(token) {
  const filter = {
    minLatitude: 57.0,
    maxLatitude: 81.0,
    minLongitude: -10.0,
    maxLongitude: 34.0,
  };

  const url = new URL('https://live.ais.barentswatch.no/v1/latest/combined');
  url.searchParams.append('minLatitude', filter.minLatitude);
  url.searchParams.append('maxLatitude', filter.maxLatitude);
  url.searchParams.append('minLongitude', filter.minLongitude);
  url.searchParams.append('maxLongitude', filter.maxLongitude);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API failed: ${response.status}`);
  }

  return await response.json();
}

function analyzeBuoyPattern(name) {
  const upper = name.toUpperCase();
  return upper.includes('BUOY') || upper.includes('BOUY') || upper.includes('BØYE');
}

function analyzeNamePatterns(ships) {
  const unknownShips = ships.filter(
    (ship) =>
      (UNKNOWN_TYPES.includes(ship.shipType) || ship.shipType === undefined) &&
      !analyzeBuoyPattern(ship.name || '')
  );

  console.log(`\n📊 Total skip: ${ships.length}`);
  console.log(`❓ Skip i "Andre / Ukjent": ${unknownShips.length}\n`);

  // Analyser mønstre i navn
  const patterns = {
    lighthouse: [],
    platform: [],
    weather: [],
    research: [],
    ais: [],
    aquaculture: [],
    cable: [],
    crane: [],
    other: [],
  };

  unknownShips.forEach((ship) => {
    const name = ship.name || 'UNKNOWN';
    const upper = name.toUpperCase();

    if (upper.includes('LIGHT') || upper.includes('FYR') || upper.includes('BEACON')) {
      patterns.lighthouse.push(name);
    } else if (
      upper.includes('PLATFORM') ||
      upper.includes('DEEPSEA') ||
      upper.includes('OCEAN RIG') ||
      upper.includes('NORNE') ||
      upper.includes('OLJE')
    ) {
      patterns.platform.push(name);
    } else if (upper.includes('WEATHER') || upper.includes('METEO') || upper.includes('MET')) {
      patterns.weather.push(name);
    } else if (
      upper.includes('RESEARCH') ||
      upper.includes('SURVEY') ||
      upper.includes('FORSKNING') ||
      upper.includes('EXPLORER')
    ) {
      patterns.research.push(name);
    } else if (upper.includes('AIS') || upper.includes('ATON')) {
      patterns.ais.push(name);
    } else if (
      upper.includes('SOJ') ||
      upper.includes('SOY') ||
      upper.includes('FISHIES') ||
      upper.includes('FISH FARM') ||
      upper.includes('MERD') ||
      upper.includes('AKVA')
    ) {
      patterns.aquaculture.push(name);
    } else if (upper.includes('CABLE') || upper.includes('NEXANS')) {
      patterns.cable.push(name);
    } else if (upper.includes('CRANE') || upper.includes('KRAN')) {
      patterns.crane.push(name);
    } else {
      patterns.other.push(name);
    }
  });

  // Print resultater
  console.log('🔦 FYRLYKTER / BEACON:');
  console.log(`  Antall: ${patterns.lighthouse.length}`);
  if (patterns.lighthouse.length > 0) {
    console.log('  Eksempler:', patterns.lighthouse.slice(0, 5));
  }

  console.log('\n🏗️ PLATTFORMER / RIGGER:');
  console.log(`  Antall: ${patterns.platform.length}`);
  if (patterns.platform.length > 0) {
    console.log('  Eksempler:', patterns.platform.slice(0, 5));
  }

  console.log('\n🌤️ VÆRSTASJONER:');
  console.log(`  Antall: ${patterns.weather.length}`);
  if (patterns.weather.length > 0) {
    console.log('  Eksempler:', patterns.weather.slice(0, 5));
  }

  console.log('\n🔬 FORSKNINGSFARTØY:');
  console.log(`  Antall: ${patterns.research.length}`);
  if (patterns.research.length > 0) {
    console.log('  Eksempler:', patterns.research.slice(0, 5));
  }

  console.log('\n📡 AIS / ATON STASJONER:');
  console.log(`  Antall: ${patterns.ais.length}`);
  if (patterns.ais.length > 0) {
    console.log('  Eksempler:', patterns.ais.slice(0, 5));
  }

  console.log('\n🐟 AKVAKULTUR / FISKEOPPDRETT:');
  console.log(`  Antall: ${patterns.aquaculture.length}`);
  if (patterns.aquaculture.length > 0) {
    console.log('  Eksempler:', patterns.aquaculture.slice(0, 10));
  }

  console.log('\n🔌 KABELLEGGING:');
  console.log(`  Antall: ${patterns.cable.length}`);
  if (patterns.cable.length > 0) {
    console.log('  Eksempler:', patterns.cable.slice(0, 5));
  }

  console.log('\n🏗️ KRANER:');
  console.log(`  Antall: ${patterns.crane.length}`);
  if (patterns.crane.length > 0) {
    console.log('  Eksempler:', patterns.crane.slice(0, 5));
  }

  console.log('\n❓ ANDRE (ingen klart mønster):');
  console.log(`  Antall: ${patterns.other.length}`);
  if (patterns.other.length > 0) {
    console.log('  Første 50 eksempler:', patterns.other.slice(0, 50));
  }

  return patterns;
}

async function main() {
  try {
    console.log('🔐 Autentiserer...');
    const token = await authenticate();

    console.log('📡 Henter AIS data...');
    const ships = await getAISData(token);

    console.log('🔍 Analyserer mønstre...');
    const patterns = analyzeNamePatterns(ships);

    console.log('\n✅ Analyse fullført!');
  } catch (error) {
    console.error('❌ Feil:', error.message);
    process.exit(1);
  }
}

main();
