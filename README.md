<<<<<<< HEAD
# AIS Skip-sporing i sanntid

Vis skip i sanntid på et kart med data fra BarentsWatch sitt AIS API.

## Om prosjektet

Dette prosjektet viser maritim trafikk i sanntid ved å hente AIS-data (Automatic Identification System) fra BarentsWatch sitt API og visualisere skipene på et interaktivt kart.

## Teknologier

- **React 19** med TypeScript
- **Vite** som bygge-verktøy
- **Leaflet** for kartvisning
- **BarentsWatch AIS API** for skip-data

## Kom i gang

### Forutsetninger

- Node.js (anbefalt versjon 18 eller nyere)
- npm eller yarn
- API-nøkkel fra BarentsWatch (hent fra [https://www.barentswatch.no/minside/devaccess/ais](https://www.barentswatch.no/minside/devaccess/ais))

### Installasjon

1. Klon repositoryet:
```bash
git clone https://github.com/kalgraff/ais.git
cd ais
```

2. Installer avhengigheter:
```bash
npm install
```

3. Opprett en `.env` fil basert på `.env.example`:
```bash
cp .env.example .env
```

4. Legg til din BarentsWatch API-nøkkel i `.env`:
```
VITE_BARENTSWATCH_CLIENT_ID=din-client-id
VITE_BARENTSWATCH_CLIENT_SECRET=din-client-secret
```

### Kjør utviklingsserver

```bash
npm run dev
```

Åpne [http://localhost:5173](http://localhost:5173) for å se applikasjonen.

### Bygg for produksjon

```bash
npm run build
```

## Funksjonalitet

- ✅ Vis skip i sanntid på interaktivt kart
- ✅ Vise skipsinformasjon (navn, type, posisjon, fart, retning)
- ✅ Filtrering av skip basert på type eller område
- ✅ Søk etter spesifikke skip
- ✅ Automatisk oppdatering av skip-posisjoner

## API-dokumentasjon

Dette prosjektet bruker BarentsWatch sitt AIS API. For mer informasjon om API-et, se:
- [BarentsWatch AIS API](https://www.barentswatch.no/minside/devaccess/ais)

## Lisens

MIT

## Bidra

Pull requests er velkomne! For større endringer, vennligst åpne et issue først for å diskutere hva du vil endre.
=======
# ais
Hente ut AIS-data til en nettside
>>>>>>> bce5e4ce1a62938400b654f495361fc8c8bac095
