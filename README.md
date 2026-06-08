# 🖥️ Tavla Visning

Tavla Visning er sanntids avgangstavler for kollektivtrafikk (Entur), optimalisert for lett rendering på skjermer. Bygget med **Vite + React** (omskrevet fra en tidligere Next.js / Pages Router-versjon).

## 📦 Forutsetninger

- **Node** ≥ 22.13.0
- **pnpm** ≥ 10.26.0
- Den **lokale Tavla-databasen** fra det opprinnelige Next.js-repoet må kjøre på `localhost:3000`. Appen henter board-konfigurasjon derfra.

## 🚀 Komme i gang

1. Start den lokale databasen i det opprinnelige Tavla-repoet (`localhost:3000`).
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

## 🧭 Videre lesing

- [`CLAUDE.md`](CLAUDE.md) — detaljert arkitektur, datakjede, sanntidsmekanismer, path-aliaser og kodestil.
- [`docs/EXPLORER_LINKS.md`](docs/EXPLORER_LINKS.md) — GraphQL Explorer-lenker for spørringene.
