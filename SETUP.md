# Oppsett av AIS-prosjektet

## Steg 1: Få API-tilgang fra BarentsWatch

1. Gå til [BarentsWatch Min Side](https://www.barentswatch.no/minside/devaccess/ais)
2. Logg inn med ditt BarentsWatch-bruker (eller opprett en ny bruker)
3. Gå til "API-tilgang" eller "Developer Access"
4. Søk om tilgang til AIS API
5. Når du har fått godkjent tilgang, vil du få:
   - **Client ID** (f.eks. `your-client-id-here`)
   - **Client Secret** (f.eks. `your-client-secret-here`)

## Steg 2: Konfigurer miljøvariabler

1. Kopier `.env.example` til `.env`:
   ```bash
   cp .env.example .env
   ```

2. Åpne `.env` og legg inn dine credentials:
   ```
   VITE_BARENTSWATCH_CLIENT_ID=your-actual-client-id
   VITE_BARENTSWATCH_CLIENT_SECRET=your-actual-client-secret
   VITE_BARENTSWATCH_API_URL=https://www.barentswatch.no/bwapi
   ```

## Steg 3: Installer avhengigheter og kjør

```bash
# Installer avhengigheter
npm install

# Kjør utviklingsserver
npm run dev
```

Applikasjonen åpnes på [http://localhost:5173](http://localhost:5173)

## Feilsøking

### Problem: "BarentsWatch API credentials mangler"

**Løsning:** Sjekk at `.env` filen eksisterer og inneholder korrekte credentials.

### Problem: "Autentisering feilet: 401"

**Løsning:** 
- Sjekk at Client ID og Client Secret er riktige
- Sjekk at du har aktiv API-tilgang hos BarentsWatch
- Verifiser at credentials ikke har utløpt

### Problem: "Ingen skip vises på kartet"

**Løsning:**
- Sjekk at API-kallet returnerer data (se nettverksfanen i utviklerverktøy)
- Prøv å zoome ut på kartet
- Vent opptil 30 sekunder for automatisk oppdatering
- Trykk på "🔄 Oppdater"-knappen

### Problem: Kartet viser ikke riktig område

**Løsning:** Juster `filter` i `src/App.tsx`:

```typescript
const [filter] = useState<AISFilter>({
  minLatitude: 57.0,   // Sør-Norge
  maxLatitude: 71.5,   // Nord-Norge
  minLongitude: 4.0,   // Vestlandet
  maxLongitude: 32.0,  // Finnmark
});
```

## API-begrensninger

BarentsWatch API har følgende begrensninger:
- Rate limiting: Maks antall requests per minutt (sjekk din API-plan)
- Data-oppdatering: AIS-data oppdateres med noen minutters forsinkelse
- Geografisk område: API-et dekker primært norske og tilstøtende farvann

## Nyttige lenker

- [BarentsWatch API-dokumentasjon](https://www.barentswatch.no/minside/devaccess/ais)
- [Leaflet-dokumentasjon](https://leafletjs.com/)
- [React Leaflet-dokumentasjon](https://react-leaflet.js.org/)
