# Tavla Visning - AI Coding Assistant Instructions

## Project Overview
Tavla Visning is a **real-time public transport display system** for showing departure boards in Norway (built for Entur). This is a **Vite + React migration** from a previous Next.js implementation, focusing on lightweight, fast rendering for display screens showing live transit data.

## Architecture & Data Flow

### Three-Tier Data Architecture
1. **Backend Database** (localhost:3000 in dev) → Fetches `BoardDB` configuration via `/api/board?id=`
2. **Entur GraphQL APIs** → Live transit data from multiple endpoints (journey-planner, mobility, vehicles)
3. **React Display Layer** → Renders tiles with auto-refresh and postMessage communication for iframes

**Key Flow**: `Page.tsx` → `useGetBoard()` → `Board` component → Tile components (QuayTile/StopPlaceTile/CombinedTile) → `useTileData()` → GraphQL queries with SWR

### Critical Startup Requirement
**You MUST run the legacy Tavla database locally** (from the original Next.js project) for this app to function. The app fetches board configurations from `localhost:3000` in development. Without it, boards won't load.

## Path Aliases (Vite Config)
Always use these imports - never relative paths for cross-module imports:
```typescript
@/              → src/
@shared/        → src/Shared/
@board/         → src/Board/
@components/    → src/Shared/components/
@hooks/         → src/Shared/hooks/
@utils/         → src/Shared/utils/
@types/         → src/Shared/types/
@graphql/       → src/Shared/graphql/
```

## Code Style (Biome)
- **Single quotes**, semicolons only when needed (`semicolons: "asNeeded"`)
- **Line width: 100 characters**
- **Tab width: 2 spaces**
- Run `pnpm format` before committing (enforced via husky + lint-staged)
- Biome handles both linting and formatting - no ESLint or Prettier

## Styling with Tailwind
- **CSS variables for themes**: `var(--main-background-color)`, `var(--main-text-color)` (see [src/styles/globals.css](src/styles/globals.css))
- **Data attributes for theming**: `data-theme="dark|light"`, `data-transport-palette="default|blue-bus|green-bus"`, `data-color-mode`
- **Custom font sizing**: Board components use `getFontScale()` from [src/Board/scenarios/Board/utils.ts](src/Board/scenarios/Board/utils.ts) with text-em-* classes
- **No CSS modules** - all styling via Tailwind utility classes
- **Responsive grid system**: Dynamic columns with `grid-template-columns: repeat(var(--cols), minmax(0, 1fr))` for board tiles

## GraphQL Patterns

### Type-Safe Queries with Codegen
All queries use typed document nodes from [src/Shared/graphql/index.ts](src/Shared/graphql/index.ts) (generated code):
```typescript
import { GetQuayQuery, StopPlaceQuery, type TDepartureFragment } from '@/Shared/graphql'
import { useQuery } from '@/Shared/hooks/useQuery'

const { data, isLoading } = useQuery(
  GetQuayQuery,
  { quayId: 'NSR:Quay:123', whitelistedLines: [] },
  { poll: true, endpoint: 'journey-planner' }
)
```

### Multi-Endpoint Support
Queries specify endpoints via `TEndpointNames` ('journey-planner' | 'mobility' | 'vehicles') defined in [src/Shared/assets/env.ts](src/Shared/assets/env.ts). Default is 'journey-planner' for most transit queries.

### GraphQL File Structure
- **Fragments**: [src/Shared/graphql/fragments/](src/Shared/graphql/fragments/) (departure.graphql, situation.graphql, lines.graphql)
- **Queries**: [src/Shared/graphql/queries/](src/Shared/graphql/queries/) (quay.graphql, stopPlace.graphql, walkingDistance.graphql)
- Fragment composition: `...departure`, `...situation` spread in queries

## Component Patterns

### Tile System
Tiles are the core display unit. All tiles implement:
- **Data fetching** via `useTileData()` hook (returns `BaseTileData` with estimatedCalls, situations, loading states)
- **Situation cycling** via `useCycler()` for rotating through service alerts
- **Error boundaries** with `<DataFetchingFailed />` and `<TileLoader />` states

**Tile Types** (see [src/Board/scenarios/Board/index.tsx](src/Board/scenarios/Board/index.tsx)):
- `QuayTile` - Single quay/platform departures
- `StopPlaceTile` - Entire stop place (multiple quays)
- `CombinedTile` - Multiple tiles merged into one display

### Table Component Structure
The `Table` component ([src/Board/scenarios/Table/index.tsx](src/Board/scenarios/Table/index.tsx)) uses **column-based rendering**:
```tsx
<DeparturesContext.Provider value={departures}>
  {columns.includes('line') && <Line />}
  {columns.includes('destination') && <Destination />}
  {columns.includes('time') && <ExpectedTime />}
</DeparturesContext.Provider>
```
Each column component reads from `DeparturesContext` and renders all rows for that column.

## State Management & Data Fetching

### SWR for Real-Time Updates
- **30-second polling** for departure data (`refreshInterval: 30000`)
- **Revalidate on focus/reconnect** enabled for stale displays
- **Keep previous data** during revalidation to prevent flicker
- See [src/Shared/hooks/useQuery.ts](src/Shared/hooks/useQuery.ts) for configuration

### Board Configuration Flow
`useGetBoard()` ([src/Shared/hooks/useGetBoard.ts](src/Shared/hooks/useGetBoard.ts)) handles:
1. Fetching board from backend API
2. Listening for postMessage updates from parent iframe (for embedded displays)
3. Trusted origins: `tavla.entur.no`, `tavla.dev.entur.no`, localhost

### Auto-Refresh Mechanism
- **24-hour reload**: `Page.tsx` sets timeout to force full page refresh daily
- **useRefresh()**: Polls backend for board config changes
- **useHeartbeat()**: Sends keep-alive signals to backend

## Development Workflow

### Prerequisites
```bash
# Set Node.js version
nvm use 22

# Start legacy Tavla database first (from separate repo)
# Then install dependencies
pnpm install
```

### Running the App
```bash
pnpm dev              # Start Vite dev server (localhost:5173)
pnpm build            # TypeScript check + Vite production build
pnpm preview          # Preview production build
pnpm lint             # Run Biome linting
pnpm format           # Auto-format with Biome
```

### Testing a Board
Navigate to `localhost:5173/[boardId]` where `boardId` is a UUID from your local database. Without a valid board ID, the app redirects to production Tavla.

## Build Configuration

### Legacy Browser Support
Uses `@vitejs/plugin-legacy` to target **Chrome 49+** (for older display hardware):
- **ES2015 output** with polyfills
- **Regenerator runtime** for async/await
- **Core-js** and **whatwg-fetch** polyfills loaded in [src/main.tsx](src/main.tsx)

### Docker Deployment
The project includes [Dockerfile](Dockerfile) and Helm charts in [helm/tavla-visning/](helm/tavla-visning/) for Kubernetes deployment (dev/staging/prod environments).

## Common Patterns to Follow

### Type Imports
Use `import type` for type-only imports to optimize bundle size:
```typescript
import type { BoardDB } from '@/Shared/types/db-types/boards'
import type { TDepartureFragment } from '@/Shared/graphql'
```

### Departure Data Transformations
- Filter departures in hooks, not components
- Use `isNotNullOrUndefined()` / `fieldsNotNull()` checks from [src/Shared/utils/typeguards.ts](src/Shared/utils/typeguards.ts)
- Apply `offset` (time offset in minutes) via `useQuery` options for future departures

### Situation Handling
Service alerts (situations) require de-duplication across quays/lines:
```typescript
const uniqueSituations = combineSituations([
  ...stopPlaceSituations,
  ...quaySituations
])
```
See [src/Board/scenarios/Board/utils.ts](src/Board/scenarios/Board/utils.ts) for `combineSituations()` and `getAccumulatedTileSituations()`.

## File Naming Conventions
- React components: PascalCase with `index.tsx` (e.g., `Header/index.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useTileData.ts`)
- Types: db-types in [src/Shared/types/db-types/](src/Shared/types/db-types/), GraphQL types in [src/Shared/types/graphql-schema.ts](src/Shared/types/graphql-schema.ts)
- GraphQL files: `.graphql` extension with query/fragment names matching exports

## Key Files to Reference
- [src/Page.tsx](src/Page.tsx) - Main board page with routing and theme application
- [src/Board/scenarios/Board/index.tsx](src/Board/scenarios/Board/index.tsx) - Grid layout and tile rendering logic
- [src/Shared/hooks/useGetBoard.ts](src/Shared/hooks/useGetBoard.ts) - Board config fetching with postMessage support
- [src/Board/hooks/useTileData.ts](src/Board/hooks/useTileData.ts) - Centralized data fetching for tiles
- [vite.config.ts](vite.config.ts) - Path aliases and build configuration
