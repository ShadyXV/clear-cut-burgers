# Clean Cut Burgers

Clean Cut Burgers is a small React app about building a burger and seeing what is behind it.

<img width="3528" height="1960" alt="Screenshot 2026-05-22 at 23 46 58" src="https://github.com/user-attachments/assets/20cbb725-1c04-4856-943f-7c1642477d9e" />


You pick the bun, protein, cheese, toppings, and sauce. The app then shows the estimated climate, water, land, methane, tree, and feed impact for the ingredients you chose. If the burger uses animal products, it can also show a live counter based on global slaughter data.

The point is not to make a perfect nutrition or climate calculator. It is a visual way to compare choices and make the hidden costs of a burger easier to notice.

## What It Does

- Build a burger from a fixed list of ingredients.
- Swap ingredients with a swipe-style picker and slot dropdowns.
- Animate the burger as it moves from the builder into the results screens.
- Show impact totals for the selected ingredients.
- Compare different impact types, like CO2, water, land use, methane, trees, and feed.
- Show animal death counters for meat-based choices.
- Offer a plant-based switch when the current burger uses animal ingredients.

## Data

The app uses local data files in `src/data/`.

- `ingredients.ts` defines the burger ingredients and slots.
- `impact.ts` stores the impact values used by the results screen.
- `animalDeaths.ts` stores the animal death counter data.
- `facts.ts` stores the short rotating facts.

These values are meant for comparison inside the app, not as exact totals for every real-world burger.

## Data Sources

The app uses public food and agriculture datasets as a starting point:

- Poore & Nemecek (2018), published in *Science*
- FAO global slaughter statistics
- Our World in Data food and environment datasets
- Water Footprint Network

The numbers in the app are simplified so they work in a small interactive demo. They should be read as estimates, not exact measurements for every ingredient in every place.

## Tech Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Motion for animations
- Zustand for burger state
- React Router for the app screens
- Lucide React for icons

## Run Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Format the source files:

```bash
npm run format
```

## Notes

This is a single-page app. Most of the app behavior is in `src/App.tsx`, the burger data is in `src/data/`, and the visual pieces are in `src/components/`.

There are no automated tests right now. `npm run build` is the main check for TypeScript and production build errors.
