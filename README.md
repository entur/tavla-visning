# 🖥️ Tavla Visning

Tavla Visning er sanntids avgangstavler for kollektivtrafikk (Entur), optimalisert for lett rendering på skjermer. Bygget med **Vite + React** (omskrevet fra en tidligere Next.js / Pages Router-versjon).

## 📦 Forutsetninger

- **Node** ≥ 22.13.0
- **pnpm** ≥ 10.26.0
- Den **lokale Tavla-databasen** fra det opprinnelige Next.js-repoet må kjøre på `localhost:3000`. Appen henter board-konfigurasjon derfra.

## 🚀 Komme i gang

1. Kjør opp [tavla-admin](https://github.com/entur/tavla) lokalt (`localhost:3000`).
2. Installer avhengigheter:
   ```bash
   pnpm install
   ```
3. Start utviklingsserveren:
   ```bash
   pnpm dev
   ```
4. Åpne en tavle i nettleseren med en `boardId` (UUID) fra databasen:
   ```
   localhost:5173/[boardId]
   ```

## 🛠️ Kommandoer

| Kommando       | Beskrivelse                                |
| -------------- | ------------------------------------------ |
| `pnpm dev`     | Start Vite-utviklingsserver (port 5173)    |
| `pnpm build`   | TypeScript-sjekk + produksjonsbygg         |
| `pnpm preview` | Forhåndsvis produksjonsbygget lokalt       |
| `pnpm lint`    | Lint med Biome                             |
| `pnpm format`  | Auto-formater med Biome (kjør før commit)  |
| `pnpm codegen` | Regenerer GraphQL-typer fra schema         |

Formatering håndheves automatisk via husky + lint-staged ved commit.

## 🧪 Smoketest

Smoketesten kjøres via **BrowserStack** og verifiserer at appen laster og rendrer korrekt på de eldre nettleserne som kjører på display-hardware: Chrome 49, Firefox 52, Safari 11 og Edge 80.

> **Merk:** Opera 36 testes ikke — nettleseren er ikke støttet på BrowserStack Automate.

### Forutsetninger

- BrowserStack-konto med Automate-tilgang
- `BROWSERSTACK_USERNAME` og `BROWSERSTACK_ACCESS_KEY` — hentes fra [BrowserStack Account Settings](https://automate.browserstack.com/dashboard/v2/profile)

### Kjøre testen

Fra prosjektets rotmappe (avhengigheter installeres med `pnpm install`):

```bash
BROWSERSTACK_USERNAME=ditt-brukernavn \
BROWSERSTACK_ACCESS_KEY=din-nøkkel \
pnpm smoketest
```

Som standard tester den mot `https://vis-tavla.dev.entur.no`. For å teste mot en annen URL (f.eks. en lokal build eksponert via en tunnel):

```bash
BROWSERSTACK_USERNAME=ditt-brukernavn \
BROWSERSTACK_ACCESS_KEY=din-nøkkel \
TEST_URL=https://din-tunnel-url.example.com \
pnpm smoketest
```

> **Merk:** Testen bruker stoppested Oslo S (`/stop/NSR:StopPlace:59872`), som ikke krever lokal Tavla-database — den henter direkte fra Entur GraphQL.

Resultater vises i BrowserStack Automate-dashboardet under prosjektet `tavla-visning`.

## 🧭 Videre lesing

- [`CLAUDE.md`](CLAUDE.md) — detaljert arkitektur, datakjede, sanntidsmekanismer, path-aliaser og kodestil.
- [`docs/EXPLORER_LINKS.md`](docs/EXPLORER_LINKS.md) — GraphQL Explorer-lenker for spørringene.
