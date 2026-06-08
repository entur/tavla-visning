# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Keeping This File Up to Date

**Treat `CLAUDE.md` as part of the change, not an afterthought.** When a change touches something documented here, update this file in the same PR. Concretely, update it when you:

- Add, rename, or move a **path alias** (keep in sync with `vite.config.ts` and `tsconfig.app.json`) → update **Path Aliases**
- Add or remove a **GraphQL endpoint** in `src/Shared/assets/env.ts` → update **GraphQL**
- Change a **real-time interval** (polling, heartbeat, SSE, daily reload) → update **Real-Time Mechanisms**
- Add a **display scenario** under `src/Board/scenarios/` or change the **data flow** → update **Architecture**
- Move or rename a **key file** listed under **Key Files** (verify the link still resolves)
- Change **tooling, commands, or build setup** (Biome, husky, codegen, legacy targets, deploy) → update **Commands** / **Build Notes**
- Change **code-style or styling conventions** (lint rules, theming, font scaling) → update **Code Style** / **Styling**

When something documented here moves, the cheapest verification is to check that every linked path under **Key Files** still exists. Keep `README.md` in sync too — it links here and shares the onboarding steps.

## Project Overview

Tavla Visning is a real-time public transport departure board display system for Entur (Norway). It's a Vite + React migration from a legacy Next.js implementation, optimized for lightweight rendering on display screens.

## Commands

```bash
pnpm dev          # Start Vite dev server (localhost:5173)
pnpm build        # TypeScript check + production build
pnpm lint         # Biome lint
pnpm format       # Biome auto-format (run before committing)
pnpm codegen      # Regenerate GraphQL types from schema
```

Formatting is enforced via husky + lint-staged on pre-commit.

## Local Development Requirement

**You must run the legacy Tavla database locally** (from the original Next.js repo) before this app will function. The app fetches board configurations from `localhost:3000`. Navigate to `localhost:5173/[boardId]` with a UUID from that database to test a board.

## Architecture

### Data Flow

```
URL (boardId) → Page.tsx
  → useGetBoard()     fetches BoardDB config from localhost:3000
  → Board component   maps tiles to SingleTile / CombinedTile
  → useTileData()     fetches departures via GraphQL (SWR, 30s polling)
  → BoardTile         renders header + table + situations
```

Board configs also arrive via `postMessage` for embedded iframe displays. Trusted origins: `tavla.entur.no`, `tavla.dev.entur.no`, localhost.

### Key Display Scenarios (`src/Board/scenarios/`)

- **Board** — responsive grid of tiles; font size scales with tile count
- **SingleTile** — one stop place or set of quays
- **CombinedTile** — multiple stops merged into one display
- **Table** — column-based departure list using `DeparturesContext`

### Real-Time Mechanisms

- **30s polling** via SWR in `useQuery` for departure data
- **`useRefresh()`** — SSE subscription to backend for board config changes
- **`useHeartbeat()`** — sends keep-alive every 60s for analytics
- **24h reload** — `Page.tsx` forces full page refresh daily

### GraphQL

Three endpoints configured in `src/Shared/assets/env.ts`:
- `journey-planner` — departures (default)
- `mobility` — scooters/bikes
- `vehicles` — vehicle tracking

Query using typed document nodes from codegen:

```typescript
import { GetQuayQuery, type TDepartureFragment } from '@/Shared/graphql'
import { useQuery } from '@/Shared/hooks/useQuery'

const { data, isLoading } = useQuery(
  GetQuayQuery,
  { quayId: 'NSR:Quay:123', whitelistedLines: [] },
  { poll: true, endpoint: 'journey-planner' }
)
```

Fragments in `src/Shared/graphql/fragments/`, queries in `src/Shared/graphql/queries/`. After editing `.graphql` files, run `pnpm codegen` and update `docs/EXPLORER_LINKS.md` with new Explorer link by re-running the same Python script logic used to create it: merge each query with its fragments recursively, URL-encode as `query`+`operationName`+`variables` parameters, and write the updated file.

### Service Alert (Situation) Handling

Situations must be deduplicated across quays/lines. Use `combineSituations()` and `getAccumulatedTileSituations()` from `src/Board/scenarios/Board/utils.ts`. Situations cycle via `useCycler()`.

## Path Aliases

Always use aliases for cross-module imports — never relative paths:

```
@/          → src/
@shared/    → src/Shared/
@board/     → src/Board/
@components/ → src/Shared/components/
@hooks/     → src/Shared/hooks/
@utils/     → src/Shared/utils/
@types/     → src/Shared/types/
@graphql/   → src/Shared/graphql/
```

## Code Style

- Biome for lint + format (no ESLint, no Prettier)
- Single quotes, semicolons only when needed, 2-space indent, 100-char line width
- `import type` for type-only imports
- React components: PascalCase directories with an `index.tsx` entry (e.g., `Header/index.tsx`)
- Hooks: camelCase with `use` prefix

## Styling

- Tailwind utility classes only — no CSS modules
- CSS variables for theming: `var(--main-background-color)`, `var(--main-text-color)` (see `src/styles/globals.css`)
- Data attributes control theme: `data-theme="dark|light"`, `data-transport-palette="default|blue-bus|green-bus"`
- Font scaling via `getFontScale()` from `src/Board/scenarios/Board/utils.ts` with `text-em-*` classes

## Key Files

- [`src/Page.tsx`](src/Page.tsx) — entry component, routing, theme application, 24h reload
- [`src/Board/scenarios/Board/index.tsx`](src/Board/scenarios/Board/index.tsx) — grid layout, tile type selection
- [`src/Board/hooks/useTileData.ts`](src/Board/hooks/useTileData.ts) — all tile data fetching logic
- [`src/Shared/hooks/useGetBoard.ts`](src/Shared/hooks/useGetBoard.ts) — board config with postMessage support
- [`src/Shared/hooks/useQuery.ts`](src/Shared/hooks/useQuery.ts) — SWR wrapper for GraphQL
- [`src/Shared/assets/env.ts`](src/Shared/assets/env.ts) — endpoint URLs
- [`src/Shared/types/db-types/boards.ts`](src/Shared/types/db-types/boards.ts) — `BoardDB` and `TileDB` types
- [`vite.config.ts`](vite.config.ts) — path aliases, legacy browser targets, CSP headers

## Pull Requests

PR-beskrivelser skal skrives på **norsk** og følge malen i [`.github/pull_request_template.md`](.github/pull_request_template.md):

```markdown
### 🥅 Bakgrunn

### ✨ Løsning

-

### 📸 Bilder

| Før   | Etter |
| ----- | ----- |
| bilde | bilde |

### ✅ Sjekkliste

- [ ] Testet i Chrome, Firefox og Safari
- [ ] Testet i BrowserStack
- [ ] Oppdatert dokumentasjon (hvis relevant)
```

Fyll ut **Bakgrunn** og **Løsning**. La **Bilder**-tabellen og **Sjekkliste** stå urørt — disse fylles ut av et menneske.

## Build Notes

Legacy browser support (Chrome 49+ on display hardware) via `@vitejs/plugin-legacy` — ES2015 output with core-js, regenerator-runtime, and whatwg-fetch polyfills. Deployment uses Docker + Helm charts in `helm/tavla-visning/`.
