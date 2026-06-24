# Oppsett av AIS-prosjektet

## 📋 Steg 1: Få API-tilgang fra BarentsWatch

1. Gå til [BarentsWatch Min Side](https://www.barentswatch.no/minside/devaccess/ais)
2. Logg inn med ditt BarentsWatch-bruker (eller opprett en ny bruker)
3. Gå til "API-tilgang" eller "Developer Access"
4. Søk om tilgang til AIS API
5. Når du har fått godkjent tilgang, vil du få:
   - **Client ID** (format: `brukernavn@domene.no:AppNavn`)
   - **Client Secret** (en lang alfanumerisk streng)

### Eksempel på Client ID format
```
ove@kalgraff.no:AIS-web
```

**Viktig:** Når du bruker Client ID i API-kall, må du URL-enkode `@` og `:` tegn:
```
ove%40kalgraff.no%3AAIS-web
```

## 🔧 Steg 2: Konfigurer miljøvariabler

1. **Kopier `.env.example` til `.env`:**
   ```bash
   cp .env.example .env
   ```

2. **Åpne `.env` og legg inn dine credentials:**
   ```env
   VITE_BARENTSWATCH_CLIENT_ID=din@email.no:DinApp
   VITE_BARENTSWATCH_CLIENT_SECRET=din-lange-hemmelige-nøkkel-her
   ```

3. **Ikke commit `.env` til Git!**  
   Filen er allerede i `.gitignore` for å unngå å eksponere hemmeligheter.

## 🚀 Steg 3: Installer avhengigheter og kjør

```bash
# Installer avhengigheter
npm install

# Kjør utviklingsserver
npm run dev
```

Applikasjonen åpnes på [http://localhost:5173](http://localhost:5173)

## 🗺️ Geografisk dekningsområde

Applikasjonen henter AIS-data for følgende område:

```typescript
{
  minLatitude: 57.0,   // Sør-Norge (Lindesnes)
  maxLatitude: 81.0,   // Svalbard (Nordaustlandet)
  minLongitude: -10.0, // Jan Mayen
  maxLongitude: 34.0   // Østre Svalbard
}
```

Dette dekker:
- ✅ Hele Norge (Lindesnes til Nordkapp)
- ✅ Svalbard
- ✅ Jan Mayen
- ✅ Deler av Barentshavet
- ✅ Nordsjøen

### Tilpass dekningsområdet

For å endre geografisk område, rediger `filter` i `src/App.tsx`:

```typescript
const [filter] = useState<AISFilter>({
  minLatitude: 57.0,    // Sør-grense
  maxLatitude: 81.0,    // Nord-grense
  minLongitude: -10.0,  // Vest-grense
  maxLongitude: 34.0,   // Øst-grense
});
```

## 🐛 Feilsøking

### Problem: "BarentsWatch API credentials mangler"

**Løsning:**
- Sjekk at `.env` filen eksisterer i rot-mappen
- Sjekk at variablene starter med `VITE_` (påkrevd av Vite)
- Restart utviklingsserveren etter å ha endret `.env`

### Problem: "Autentisering feilet: 401"

**Løsning:**
- Sjekk at Client ID og Client Secret er **eksakt** som i BarentsWatch
- Verifiser at du har aktiv API-tilgang hos BarentsWatch
- Sjekk at credentials ikke har utløpt
- Prøv å generere nye credentials fra BarentsWatch

### Problem: "Autentisering feilet: 404"

**Løsning:**
- Dette betyr at autentiserings-URL er feil
- Korrekt URL er: `https://id.barentswatch.no/connect/token`
- Sjekk at `src/services/barentswatch.ts` bruker riktig endpoint

### Problem: "Ingen skip vises på kartet"

**Løsning:**
1. **Sjekk API-kall:**
   - Åpne nettleseren sin utviklerverktøy (F12)
   - Gå til "Network"-fanen
   - Se etter kall til `/api/v1/latest/combined`
   - Sjekk at responsen inneholder skip-data

2. **Sjekk filtrering:**
   - Klikk på "🚢 Skipstyper" øverst til høyre
   - Klikk "Velg alle" for å vise alle skip-typer
   - Sjekk om skip dukker opp

3. **Zoom og område:**
   - Prøv å zoome ut på kartet
   - Sjekk at kartet dekker norske farvann

4. **Vent på auto-refresh:**
   - Data oppdateres automatisk hvert 60. sekund
   - Klikk "🔄 Oppdater" for manuell oppdatering

### Problem: "CORS error" i konsollen

**Løsning:**
- Dette skal håndteres av Vite proxy i utviklingsmiljø
- Sjekk at `vite.config.ts` inneholder proxy-konfigurasjonen
- Sjekk at du bruker `/auth` og `/api` prefix i URL-ene
- I produksjon må du sette opp en backend-proxy

### Problem: Marine data (bølger/strømmer) vises ikke

**Løsning:**
1. Klikk på "🌊 Havdata" nederst til høyre
2. Sjekk av for ønsket data (🌡️ Temperatur, 🌊 Bølger, 💨 Strømmer)
3. Zoom inn på kartet - data vises bare på høyere zoom-nivåer
4. Data-punkter er spredt med ca. 20-30 km avstand

### Problem: Søk finner ikke skip

**Løsning:**
1. Sjekk at du søker på riktig informasjon:
   - **Navn**: "OCEANIA" (hele eller deler av navnet)
   - **MMSI**: "257105000" (9-sifret nummer)
   - **Type**: "tankskip", "militært", "fiske"
   - **Nasjonalitet**: "norge", "storbritannia"
2. Søket er **ikke** case-sensitivt
3. Skipet må være innenfor dekningsområdet
4. Prøv å søke på MMSI hvis navnet ikke fungerer

### Problem: Tracking fungerer ikke

**Løsning:**
1. Søk etter et skip
2. Klikk "📍 Følg" i søkeresultatet
3. Skipet må være innenfor dekningsområdet
4. Skipet må sende aktive AIS-data
5. Klikk "⏸ Stopp følging" for å avslutte tracking
6. Bevegelseshistorikk lagres kun lokalt mens tracking er aktiv

## ⚙️ API-begrensninger

### BarentsWatch AIS API
- **Rate limiting**: Maks antall requests per minutt (avhenger av din API-plan)
- **Data-oppdatering**: AIS-data har noen minutters forsinkelse
- **Geografisk område**: Dekker primært norske og tilstøtende farvann
- **Autentisering**: OAuth 2.0 token utløper etter 1 time (håndteres automatisk)

### Open-Meteo Marine API
- **Gratis**: Ingen API-nøkkel påkrevd
- **Rate limiting**: 10,000 forespørsler per dag for gratis tier
- **Data-oppløsning**: 
  - Bølger: 5 km rutenett
  - Temperatur: 5 km rutenett
  - Strømmer: 5 km rutenett
- **Data-oppdatering**: Hver 6. time

## 🔍 Analysere "Andre/Ukjent" kategorien

Hvis du vil se hvilke skip som havner i "Andre/Ukjent" og foreslå nye kategorier:

```bash
npm run analyze
```

Dette scriptet:
1. Henter live AIS-data fra BarentsWatch
2. Filtrerer skip i "Andre/Ukjent" kategorien (type 0)
3. Analyserer navnemønstre (BUOY, PLATFORM, AKVA, etc.)
4. Viser statistikk og eksempler

## 📊 Utviklingsverktøy

### TypeScript type-sjekk
```bash
npm run type-check
```

### Bygg for produksjon
```bash
npm run build
npm run preview
```

### Lint koden
```bash
npm run lint
```

## 🌐 Produksjonsdeploy

For produksjon må du:

1. **Sette opp en backend-proxy** for BarentsWatch API (for å unngå CORS og beskytte credentials)
2. **Ikke eksponere `.env` variabler** direkte til klienten i produksjon
3. **Implementere rate limiting** for API-kall
4. **Cache AIS-data** på server-side for å redusere API-kall

### Anbefalt arkitektur for produksjon:

```
Browser → [Din backend] → [BarentsWatch API]
           ↓
        [Cache/Redis]
           ↓
        [Database]
```

## 📚 Nyttige lenker

- **BarentsWatch:**
  - [Min Side (API-nøkler)](https://www.barentswatch.no/minside/devaccess/ais)
  - [API-dokumentasjon](https://developer.barentswatch.no/docs/appreg/)
  - [AIS Live API](https://live.ais.barentswatch.no/)

- **Kartbibliotek:**
  - [Leaflet dokumentasjon](https://leafletjs.com/)
  - [React Leaflet dokumentasjon](https://react-leaflet.js.org/)
  - [OpenStreetMap](https://www.openstreetmap.org/)

- **Marine data:**
  - [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api)

- **React/TypeScript:**
  - [React 19 dokumentasjon](https://react.dev/)
  - [TypeScript dokumentasjon](https://www.typescriptlang.org/docs/)
  - [Vite dokumentasjon](https://vitejs.dev/)

## 💡 Tips for best praksis

1. **Ikke commit `.env`** - Hemmeligheter skal aldri være i Git
2. **Bruk `.env.example`** som template for nye utviklere
3. **Test API-tilgang** før du begynner å kode
4. **Sjekk rate limits** - ikke overbelast API-et
5. **Cache data** lokalt når mulig
6. **Håndter offline-modus** - vis en melding hvis API er nede
7. **Log feil** - bruk console.error for debugging
8. **Optimaliser map-rendering** - ikke vis alle skip hvis det er tusenvis

## 🆘 Fortsatt problemer?

Hvis du fortsatt har problemer:

1. Sjekk console i nettleseren (F12) for feilmeldinger
2. Sjekk network-fanen for API-kall
3. Verifiser at alle npm-pakker er installert: `npm install`
4. Prøv å slette `node_modules` og reinstaller: `rm -rf node_modules && npm install`
5. Restart utviklingsserveren
6. Opprett et issue på GitHub med detaljert feilbeskrivelse

---

**Lykke til med skipssporing! 🚢⚓**
