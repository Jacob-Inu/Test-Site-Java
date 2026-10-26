# Critter Keep

A cozy, text-based creature collection and breeding game with no combat. You win wild creatures over through conversation, like a dating sim, then raise a family of companions. It runs in any web browser, on PC and on Android phones alike, with no installs or build step: it's plain HTML, CSS and JavaScript.

## Play

- **PC:** open `index.html` in a browser.
- **Android / anywhere:** host the folder (e.g. GitHub Pages: *Settings → Pages → Deploy from branch*), open the URL in Chrome, then use *⋮ → Add to Home screen* to launch it like an app.

Progress saves automatically in the browser. Use **Options → Export/Import** to move a save between devices.

## How it works

- **Encounters:** every wild creature has a hidden personality (Shy, Playful, Proud, Gentle, Grumpy, Curious). Talk, hum, play, compliment, sit quietly, introduce your companion or offer treats, and read its reactions. Fill its **Affection** before its **Nerves** run out. Repeating yourself gets boring, so vary your approach.
- **Treats:** every species has a favourite. Once you've befriended a species, the Creaturedex remembers what it loves.
- **Your lead companion** helps on outings. **Charm** wins hearts faster, **Grace** keeps creatures calm, **Wits** reads personalities, and **Vigor** forages more.
- **Bond** grows as you spend time together, and it raises your creatures' qualities. Creatures need bond 30+ to nest.
- **Genes** (0–31 per quality) set each creature's potential, graded D to S. Babies inherit and slightly mutate their parents' genes, so careful pairing produces better creatures over generations.
- **Traits** such as Charming, Clever, Lucky, Fertile and the rare ✨Glimmer can be passed down.
- **Hybrids:** certain species pairs can hatch rare species found nowhere in the wild. The Creaturedex hints at them.
- **Festivals:** enter Charm, Wits, Vigor or Grace contests to win gold and 🎀 ribbons. Ribbons open bigger festivals.
- **New areas** open as you befriend more distinct species.

## Files

- `index.html` – page shell
- `style.css` – mobile-friendly styling
- `game.js` – all game data and logic (species, personalities, areas and breeding rules are tables at the top, easy to tweak)
