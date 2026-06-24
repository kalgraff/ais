# AIS Skip-sporing i sanntid

Vis skip i sanntid på et kart med data fra BarentsWatch sitt AIS API.

## 🚢 Om prosjektet

Dette prosjektet viser maritim trafikk i sanntid ved å hente AIS-data (Automatic Identification System) fra BarentsWatch sitt API og visualisere skipene på et interaktivt kart. Dekker hele Norge inkludert Svalbard og Jan Mayen, med omfattende søke- og trackingfunksjonalitet.

## 🌟 Funksjoner

### Kartvisning og geografisk dekning
- ✅ **Interaktivt kart** med OpenStreetMap
- ✅ **Utvidet dekningsområde** - Norge, Svalbard og Jan Mayen (57°N til 81°N, -10°Ø til 34°Ø)
- ✅ **Marine data overlay** - Sjøtemperatur, bølgehøyde, havstrømmer
- ✅ **Synlige data-labels** - Se temperatur, bølger og strømmer direkte på kartet

### Skip-data og informasjon
- ✅ **Sanntids AIS-data** fra BarentsWatch
- ✅ **Detaljert skipsinformasjon**:
  - Navn, MMSI, Nasjonalitet (beregnet fra MMSI)
  - Skip-type, Kallesignal
  - Fart, Kurs, Posisjon
  - Destinasjon, ETA, Dimensjoner
  - Sist oppdatert tidspunkt

### Skip-type filtrering
- ✅ **16 skip-kategorier** med telling og farger:
  - Bøyer (inkludert feilstaving "BOUY")
  - Plattformer/Rigger
  - Akvakultur/Fiskeoppdrett
  - Fiskebåter, Lasteskip, Tankskip
  - Passasjerskip/Ferjer, Hurtigbåter
  - Slepe- og Taubåter, Fritidsbåter
  - Losbåter, Redningsskøyter, Havnebåter
  - Spesialfartøy, Militære fartøy
  - Ambulansebåter, Politi/Kystvakt
  - Ekranoplan (WIG), Andre/Ukjent
- ✅ **Velg alle/Fjern alle** funksjoner
- ✅ **Live telling** av skip per kategori

### Søk og tracking
- ✅ **Avansert søkefunksjon**:
  - Søk på: Navn, MMSI, Kallesignal, Destinasjon
  - Søk på: Type (f.eks. "militært", "tankskip")
  - Søk på: Nasjonalitet (f.eks. "norge", "storbritannia")
- ✅ **Skip tracking**:
  - Start tracking fra søkeresultater ELLER direkte fra kart-popup
  - Automatisk sentrering på valgt skip
  - Stor, pulserende markør med tracking-pil
  - Kontinuerlig oppdatering av posisjon
  - Vises alltid, uavhengig av filter
  - "Følg skip" / "Stopp følging" knapp i popup-boks
- ✅ **Bevegelseshistorikk**:
  - Stiplet linje viser skipets bevegelse
  - Markører for start (grønn), nåværende (rosa), mellompunkter
  - Tooltips viser tid, fart og kurs
  - Lagres lokalt mens tracking er aktiv

### Automatisk oppdatering
- ✅ **Toggle for auto-refresh** - Slå på/av
- ✅ **Valgbare intervaller**:
  - 30 sekunder
  - 1 minutt (standard)
  - 3 minutter
  - 5 minutter
- ✅ **Manuell oppdatering** - Refresh-knapp i header

### Brukergrensesnitt
- ✅ **Responsivt design** - Fungerer på desktop, tablet og mobil
- ✅ **Organisert layout**:
  - Søk: Øverst til venstre
  - Auto-refresh: Nederst til venstre
  - Marine overlay: Nederst til høyre
  - Skip-type filter: Øverst til høyre
- ✅ **Utvidbare kontroller** - Alle paneler kan foldes inn/ut
- ✅ **Live statistikk** - Viser antall skip (filtrert/totalt)
- ✅ **Fargekodet markører** - Forskjellige farger per skip-type

## 🛠️ Teknologier

- **React 19** med TypeScript
- **Vite 8** som bygge-verktøy
- **Leaflet / React-Leaflet** for kartvisning
- **BarentsWatch AIS API** for skip-data
- **Open-Meteo Marine Weather API** for marine data
- **Styled Components** for CSS-in-JS

## 📦 Kom i gang

### Forutsetninger

- Node.js 18 eller nyere
- npm eller yarn
- BarentsWatch API-nøkler (hent fra [BarentsWatch Developer Portal](https://www.barentswatch.no/minside/devaccess/ais))

### Installasjon

1. **Klon repositoryet:**
```bash
git clone https://github.com/kalgraff/ais.git
cd ais
```

2. **Installer avhengigheter:**
```bash
npm install
```

3. **Opprett `.env` fil:**
```bash
cp .env.example .env
```

4. **Legg til dine API-nøkler i `.env`:**
```env
VITE_BARENTSWATCH_CLIENT_ID=din-client-id-her
VITE_BARENTSWATCH_CLIENT_SECRET=din-client-secret-her
```

5. **Start utviklingsserver:**
```bash
npm run dev
```

6. **Åpne nettleseren:**
Gå til [http://localhost:5173](http://localhost:5173)

### Bygg for produksjon

```bash
npm run build
npm run preview
```

## 🔍 Brukseksempler

### Søk etter skip
```
"HMS SUTHERLAND"    → Søk på navn
"234639000"         → Søk på MMSI
"militært"          → Finn alle militære fartøy
"norge"             → Finn alle norske skip
"tankskip"          → Finn alle tankskip
```

### Tracking av skip

**Metode 1: Fra søk**
1. Søk etter et skip i søkefeltet (øverst til venstre)
2. Klikk "📍 Følg" på søkeresultatet
3. Kartet sentrerer seg på skipet
4. Bevegelseshistorikk vises som en linje
5. Klikk "⏸ Stopp følging" for å avslutte

**Metode 2: Direkte fra kartet**
1. Klikk på et skip-markør i kartet
2. Klikk "📍 Følg skip" nederst i popup-boksen
3. Skipet blir tracked med animert markør
4. Klikk "⏸ Stopp følging" i popup for å avslutte

### Marine data
1. Klikk på "🌊 Havdata" nederst til høyre
2. Velg hva du vil se:
   - 🌡️ Sjøtemperatur
   - 🌊 Bølgehøyde og retning
   - 💨 Havstrømmer
3. Data-labels vises direkte på kartet

## 📊 Datakilder

- **Skip-data**: [BarentsWatch AIS API](https://www.barentswatch.no/minside/devaccess/ais)
- **Marine data**: [Open-Meteo Marine Weather API](https://open-meteo.com/en/docs/marine-weather-api)
- **Kart**: [OpenStreetMap](https://www.openstreetmap.org/)

## 🗺️ Geografisk dekning

| Område | Koordinater |
|--------|-------------|
| **Nord** | 81.0°N (Svalbard) |
| **Sør** | 57.0°N (Sørnorge) |
| **Vest** | -10.0°Ø (Jan Mayen) |
| **Øst** | 34.0°Ø (Østre Svalbard) |

## 🎨 Skip-type farger

| Type | Farge | Emoji |
|------|-------|-------|
| Bøyer | Oransje | 🟠 |
| Plattformer | Brun | 🛢️ |
| Akvakultur | Turkis | 🐟 |
| Fiskebåter | Grønn | 🎣 |
| Lasteskip | Oransje | 📦 |
| Tankskip | Rød | 🛢️ |
| Passasjerskip | Blå | ⛴️ |
| Militære fartøy | Mørk grå | 🛡️ |

## 🚀 Utviklingsverktøy

### Analyser "Andre/Ukjent" kategorien
```bash
npm run analyze
```
Dette scriptet henter live data og analyserer hvilke skip som havner i "Andre/Ukjent" kategorien, og foreslår nye kategorier basert på navnemønstre.

## 📝 API-dokumentasjon

### BarentsWatch AIS API
- **Autentisering**: OAuth 2.0 Client Credentials
- **Endpoint**: `https://live.ais.barentswatch.no/v1/latest/combined`
- **Rate limiting**: Sjekk BarentsWatch sine retningslinjer
- **Dokumentasjon**: [BarentsWatch Developer Portal](https://developer.barentswatch.no/docs/appreg/)

### Open-Meteo Marine API
- **Endpoint**: `https://marine-api.open-meteo.com/v1/marine`
- **Ingen API-nøkkel påkrevd**
- **Dokumentasjon**: [Open-Meteo Marine API Docs](https://open-meteo.com/en/docs/marine-weather-api)

## 🤝 Bidra

Pull requests er velkomne! For større endringer:
1. Åpne et issue først for å diskutere endringen
2. Fork prosjektet
3. Opprett en feature branch
4. Commit dine endringer
5. Push til branchen
6. Åpne en Pull Request

## 📄 Lisens

MIT License - se [LICENSE](LICENSE) fil for detaljer

## 🙏 Takk til

- [BarentsWatch](https://www.barentswatch.no/) for AIS API
- [Open-Meteo](https://open-meteo.com/) for marine værsdata
- [OpenStreetMap](https://www.openstreetmap.org/) for kartdata
- [Leaflet](https://leafletjs.com/) for kartbibliotek

## 📧 Kontakt

For spørsmål eller tilbakemeldinger, opprett et issue på GitHub.

---

**Laget med ❤️ for maritim trafikkovervåking**
