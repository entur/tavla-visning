# 🖥️ Tavla Visning

> **Work in Progress (WIP)** — dette er en pågående omskriving av Tavla-visningen til **Vite**.  
> Prosjektet bygger videre på tidligere Next.js / Pages Router-versjonen, men er nå lettere, raskere og mer modulært.

## Hvordan kjøre applikasjonen

1. Start først den lokale databasen i den opprinnelige Tavla-løsningen.
2. Kopier `.env.development` til `.env.local` dersom du trenger lokale overstyringer, og sett `VITE_BACKEND_URL` til ønsket API.
3. Installer avhengigheter med `pnpm install`
4. Kjør applikasjonen med `pnpm run dev`
5. Finn en boardId du vil vise fra databasen. Eks: `localhost:5173/[id]`

## Miljøvariabler

- `VITE_BACKEND_URL` brukes av applikasjonen under bygging og kjøretid i nettleseren. Vite leser verdien fra `.env`, `.env.development`, `.env.production`, `.env.<mode>` og tilsvarende `.local`-filer.
- For lokal utvikling er `VITE_BACKEND_URL="http://localhost:3000"` satt i `.env.development`.
- `pnpm vite build --mode dev` laster `.env.dev` og bør brukes til dev-miljøet i Kubernetes.
- `pnpm vite build --mode staging` vil laste `.env.staging`, og `pnpm run build` (mode `production`) benytter `.env.production`.
- Docker-builds kan overstyre verdien med `docker build --build-arg VITE_BACKEND_URL="https://example" .`.
- GitHub Actions-workflows legger ved riktig `VITE_BACKEND_URL` via `build_args`; se `.github/workflows/` for detaljer.
- Endringer i `.env*` krever at utviklingsserveren startes på nytt før de trer i kraft.
