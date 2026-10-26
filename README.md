# Critter Keep

A small text-based creature collection and breeding game that runs in any web browser, on PC and on Android phones alike. No installs or build step: it's plain HTML, CSS and JavaScript.

## Play

- **PC:** open `index.html` in a browser.
- **Android / anywhere:** host the folder (e.g. GitHub Pages: *Settings → Pages → Deploy from branch*), open the URL in Chrome, then use *⋮ → Add to Home screen* to launch it like an app.

Progress saves automatically in the browser. Use **Options → Export/Import** to move a save between devices.

## How it works

- **Explore** areas to meet wild creatures. Battle them, or weaken them and throw an orb to capture them.
- **Elements** form a cycle: 🔥 Fire > 🍃 Leaf > ⛰️ Earth > ⚡ Storm > 💧 Water > 🔥 Fire. Specials use your creature's element.
- **Genes** (0–31 per stat) set each creature's potential, summarised as a grade from D to S. Wild creatures have low genes.
- **Breeding** (level 5+, 25 gold) lays an egg that hatches after a few steps. Babies inherit and slightly mutate their parents' genes, so selective breeding produces stronger creatures over generations.
- **Traits** such as Fierce, Swift, Lucky, Fertile and the rare cosmetic ✨Glimmer can be passed down.
- **Hybrids**: certain species pairs can hatch rare hybrid species found nowhere in the wild. The Creaturedex hints at them.
- **New areas** open as you catch more distinct species.

## Files

- `index.html` – page shell
- `style.css` – mobile-friendly styling
- `game.js` – all game data and logic (species, areas, breeding rules are in tables at the top, easy to tweak)
