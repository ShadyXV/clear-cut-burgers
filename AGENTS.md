# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # tsc + vite build (type-checks first)
npm run preview   # Serve the production build locally
npm run lint      # ESLint — zero-warnings policy, will exit non-zero on any warning
npm run format    # Prettier — formats src/**/*.{ts,tsx,css,md}
```

There are no tests. `npm run build` is the primary correctness check (TypeScript strict mode).

## Architecture

Single-page React 19 app (Vite, Tailwind v4, Motion/React) using React Router. `src/main.tsx` mounts a `BrowserRouter` with routes for `/`, `/build`, `/checkout`, `/compare`, `/impact`, and `/deaths`.

### View routing

`App.tsx` derives its local `view` value from `location.pathname` and uses a `VIEW_DEPTH` map for animation direction. Slide direction is computed from depth comparison so forward navigation slides left-to-right and backward navigation slides right-to-left. `AnimatePresence mode="wait"` wraps the route outlet.

`CheckoutTransition` is intentionally placed **outside** the route `AnimatePresence` — it must persist as an overlay while the checkout route advances into compare or impact underneath it.

### Burger state

`burgerState` is a flat `Record<string, string | null>` with fixed slot keys defined in `src/data/ingredients.ts` as the `SlotKey` union type:

```
bunTop | topping1..6 | cheese1..2 | protein1..3 | sauceBottom | bunBottom
```

`BURGER_SLOTS` defines the ordered layer list (top→bottom) used by `BurgerStack` to render the visual. Each slot holds an ingredient ID string or `null` (slot is empty).

### Data layer (`src/data/`)

- `ingredients.ts` — `INGREDIENTS` record (id → `{name, category, thickness}`), `CATEGORIES` (category → id list), `BURGER_SLOTS` ordered array, `SlotKey` type
- `impact.ts` — `IMPACT_DATA` (ingredient id → `ImpactMetric`), `STAT_META` (display config per stat), `COMPARISON` (human-readable analogies). All values sourced from Poore & Nemecek (2018) and FAO.
- `animalDeaths.ts` — species → slaughter count data shown on the deaths screen
- `facts.ts` — rotating fact strings

### Component responsibilities

- `BurgerStack` — visual burger renderer; reads `BURGER_SLOTS` in order, animates ingredient swap with slide+rotate variants; `isAssembled` controls gap between layers (collapsed for checkout hero)
- `BurgerEditor` — category-tabbed editor; each category section is a standalone component (`BunSection`, `ProteinSection`, etc.) that receives `EditorProps`; primary selection uses `SwipeCarousel`, additional slots use `SlotDropdown`
- `SwipeCarousel` — horizontal swipe gesture picker for ingredients
- `IngredientLibrary.tsx` — all ingredient SVG artwork; `IngredientSvg` dispatches to per-ingredient components by id
- `ImpactScreen` — aggregates `IMPACT_DATA` for all non-null slots and renders stat bars + comparison text
- `AnimalDeathsScreen` — shows animal death counts with inline SVG icons from `AnimalIcons.tsx`
- `CheckoutTransition` — 4-phase cinematic sequence (arriving → bites → dissolve → blank) driven by a timer chain; burger is eaten by 4 SVG circles that stamp out chunks right-to-left

### Styling conventions

Dark theme: background `#09090b`, zinc palette, amber accent (`amber-500`). Tailwind utility classes throughout — no CSS modules, no styled-components. Tailwind v4 is loaded via the `@tailwindcss/vite` plugin (no `tailwind.config.js` file needed).

### Adding a new ingredient

1. Add an entry to `INGREDIENTS` in `src/data/ingredients.ts` with a unique id, category, and thickness (px)
2. Add the id to the matching `CATEGORIES[category]` array
3. Add an entry in `IMPACT_DATA` in `src/data/impact.ts`
4. Add an SVG component in `src/components/ingredients/IngredientLibrary.tsx` and wire it into the `IngredientSvg` dispatcher
