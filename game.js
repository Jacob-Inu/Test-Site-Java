'use strict';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SAVE_KEY = 'critterkeep-save-v1';
const TEAM_SIZE = 3;
const BREED_LEVEL = 5;
const BREED_COOLDOWN = 5; // steps
const BREED_COST = 25;
const MAX_GENE = 31;
const MAX_LEVEL = 50;

// Each element is strong against exactly one other, forming a cycle.
const ELEMENTS = {
  Fire:   { icon: '🔥', strong: 'Leaf' },
  Leaf:   { icon: '🍃', strong: 'Earth' },
  Earth:  { icon: '⛰️', strong: 'Storm' },
  Storm:  { icon: '⚡', strong: 'Water' },
  Water:  { icon: '💧', strong: 'Fire' },
  Normal: { icon: '⚪', strong: null },
};

const SPECIES = {
  sproutle:  { name: 'Sproutle',  icon: '🌱', el: 'Leaf',   base: { hp: 45, atk: 40, def: 45, spd: 35 }, catch: 0.55, desc: 'A sleepy seedling that naps in sunbeams.' },
  fluffkin:  { name: 'Fluffkin',  icon: '🐑', el: 'Normal', base: { hp: 50, atk: 38, def: 42, spd: 40 }, catch: 0.6,  desc: 'Mostly wool. Somewhere inside is a creature.' },
  emberpup:  { name: 'Emberpup',  icon: '🐕', el: 'Fire',   base: { hp: 42, atk: 50, def: 36, spd: 50 }, catch: 0.4,  desc: 'Its tail flickers when it is happy.' },
  puddlefin: { name: 'Puddlefin', icon: '🐟', el: 'Water',  base: { hp: 46, atk: 42, def: 40, spd: 50 }, catch: 0.5,  desc: 'Can survive in a teacup, prefers a lake.' },
  mossback:  { name: 'Mossback',  icon: '🐢', el: 'Leaf',   base: { hp: 60, atk: 40, def: 60, spd: 20 }, catch: 0.4,  desc: 'A tiny garden grows on its shell.' },
  zapfly:    { name: 'Zapfly',    icon: '🦟', el: 'Storm',  base: { hp: 36, atk: 52, def: 30, spd: 62 }, catch: 0.45, desc: 'Buzzes loudly before thunderstorms.' },
  pebblit:   { name: 'Pebblit',   icon: '🪨', el: 'Earth',  base: { hp: 55, atk: 46, def: 62, spd: 20 }, catch: 0.45, desc: 'Often mistaken for an ordinary rock.' },
  golemite:  { name: 'Golemite',  icon: '🗿', el: 'Earth',  base: { hp: 72, atk: 62, def: 72, spd: 18 }, catch: 0.2,  desc: 'Older than the caves it sleeps in.' },
  cindrake:  { name: 'Cindrake',  icon: '🦎', el: 'Fire',   base: { hp: 52, atk: 64, def: 46, spd: 52 }, catch: 0.25, desc: 'Basks in lava. Do not pet.' },
  stormhawk: { name: 'Stormhawk', icon: '🦅', el: 'Storm',  base: { hp: 50, atk: 62, def: 42, spd: 72 }, catch: 0.2,  desc: 'Rides lightning between the clouds.' },
  tidalurk:  { name: 'Tidalurk',  icon: '🐙', el: 'Water',  base: { hp: 64, atk: 56, def: 54, spd: 40 }, catch: 0.25, desc: 'Lurks in tide pools, hoarding shells.' },
  elderoak:  { name: 'Elderoak',  icon: '🌳', el: 'Leaf',   base: { hp: 78, atk: 58, def: 66, spd: 24 }, catch: 0.15, desc: 'Said to remember the first forest.' },
  // Hybrids: only obtainable by breeding.
  steamhound:{ name: 'Steamhound',icon: '🐺', el: 'Fire',   base: { hp: 58, atk: 62, def: 50, spd: 62 }, hybrid: true, desc: 'Born of fire and water. Hisses when wet.' },
  bloomwing: { name: 'Bloomwing', icon: '🦋', el: 'Storm',  base: { hp: 50, atk: 60, def: 46, spd: 70 }, hybrid: true, desc: 'Scatters charged pollen on the breeze.' },
  magmaw:    { name: 'Magmaw',    icon: '🌋', el: 'Earth',  base: { hp: 74, atk: 70, def: 70, spd: 26 }, hybrid: true, desc: 'A walking volcano with a short temper.' },
  cloudram:  { name: 'Cloudram',  icon: '🐏', el: 'Normal', base: { hp: 66, atk: 60, def: 56, spd: 60 }, hybrid: true, desc: 'Its fleece is a literal thundercloud.' },
  mirewyrm:  { name: 'Mirewyrm',  icon: '🐉', el: 'Water',  base: { hp: 82, atk: 70, def: 66, spd: 44 }, hybrid: true, desc: 'Ancient serpent of the drowned groves.' },
};

// Breeding these two species (in either order) can produce the hybrid.
const HYBRIDS = [
  ['emberpup', 'puddlefin', 'steamhound'],
  ['sproutle', 'zapfly', 'bloomwing'],
  ['pebblit', 'cindrake', 'magmaw'],
  ['fluffkin', 'stormhawk', 'cloudram'],
  ['tidalurk', 'elderoak', 'mirewyrm'],
];
const HYBRID_CHANCE = 0.6;

// `unlock` is the number of distinct species caught to open the area.
const AREAS = [
  { id: 'meadow',  name: 'Sunny Meadow',  lv: [1, 4],   unlock: 0,  table: [['sproutle', 5], ['fluffkin', 5], ['emberpup', 2]] },
  { id: 'lake',    name: 'Misty Lake',    lv: [3, 7],   unlock: 2,  table: [['puddlefin', 5], ['mossback', 3], ['zapfly', 3]] },
  { id: 'caves',   name: 'Echo Caves',    lv: [6, 10],  unlock: 4,  table: [['pebblit', 5], ['zapfly', 3], ['golemite', 1]] },
  { id: 'volcano', name: 'Ember Volcano', lv: [9, 14],  unlock: 6,  table: [['emberpup', 4], ['cindrake', 3], ['pebblit', 3]] },
  { id: 'coast',   name: 'Storm Coast',   lv: [13, 18], unlock: 8,  table: [['stormhawk', 3], ['tidalurk', 3], ['puddlefin', 3]] },
  { id: 'grove',   name: 'Ancient Grove', lv: [17, 24], unlock: 10, table: [['elderoak', 2], ['mossback', 3], ['golemite', 2], ['cindrake', 2]] },
];

const TRAITS = {
  hardy:   { name: 'Hardy',   desc: '+15% DEF' },
  fierce:  { name: 'Fierce',  desc: '+15% ATK' },
  swift:   { name: 'Swift',   desc: '+15% SPD' },
  robust:  { name: 'Robust',  desc: '+15% HP' },
  lucky:   { name: 'Lucky',   desc: '+50% gold when it wins a battle' },
  fertile: { name: 'Fertile', desc: 'Eggs it parents hatch 2 steps sooner' },
  glimmer: { name: 'Glimmer', desc: 'Rare shimmering coat. Purely beautiful (and valuable).' },
};
const COMMON_TRAITS = Object.keys(TRAITS).filter(t => t !== 'glimmer');
const MAX_TRAITS = 3;

const SHOP = [
  { id: 'orb',      name: 'Capture Orb', price: 10, desc: 'Standard capture device.' },
  { id: 'greatorb', name: 'Great Orb',   price: 30, desc: '1.75x capture chance.' },
  { id: 'potion',   name: 'Potion',      price: 15, desc: 'Restores 50% HP.' },
];
const ITEM_NAMES = Object.fromEntries(SHOP.map(i => [i.id, i.name]));

const STATS = ['hp', 'atk', 'def', 'spd'];
const STAT_TRAIT = { hp: 'robust', atk: 'fierce', def: 'hardy', spd: 'swift' };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const chance = p => Math.random() < p;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pairKey = (a, b) => [a, b].sort().join('+');
const HYBRID_BY_PAIR = Object.fromEntries(HYBRIDS.map(([a, b, h]) => [pairKey(a, b), h]));

function weightedPick(table) {
  const total = table.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [v, w] of table) {
    if ((r -= w) < 0) return v;
  }
  return table[table.length - 1][0];
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let state = null; // persisted
const ui = { screen: 'start', battle: null, cid: null, breedA: null, breedB: null, areaId: null, confirm: null };

function newState() {
  return {
    version: 1,
    gold: 60,
    step: 0,
    nextId: 1,
    items: { orb: 5, greatorb: 0, potion: 2 },
    creatures: [],
    eggs: [],
    seen: {},
    caught: {},
    log: [],
  };
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupt or unavailable */ }
  return null;
}

function log(msg) {
  state.log.unshift(msg);
  state.log.length = Math.min(state.log.length, 40);
}

// ---------------------------------------------------------------------------
// Creatures
// ---------------------------------------------------------------------------

const sp = c => SPECIES[c.sp];
const getC = id => state.creatures.find(c => c.id === id);
const team = () => state.creatures.filter(c => c.team);
const healthyTeam = () => team().filter(c => c.hp > 0);
const caughtCount = () => Object.keys(state.caught).length;
const has = (c, t) => c.traits.includes(t);

function randomGenes(lo, hi) {
  return Object.fromEntries(STATS.map(s => [s, randInt(lo, hi)]));
}

function makeCreature(speciesId, level, opts = {}) {
  const c = {
    id: opts.transient ? 0 : state.nextId++,
    sp: speciesId,
    name: SPECIES[speciesId].name,
    level,
    xp: 0,
    genes: opts.genes || randomGenes(0, 15),
    traits: opts.traits || [],
    gen: opts.gen || 0,
    parents: opts.parents || null,
    team: false,
    bredAt: -999,
    hp: 1,
  };
  c.hp = stats(c).hp;
  return c;
}

function stats(c) {
  const base = sp(c).base;
  const mult = 0.5 + c.level / 10;
  const out = {};
  for (const s of STATS) {
    let v = (base[s] + c.genes[s]) * mult;
    if (s === 'hp') v = v * 2 + 10;
    if (has(c, STAT_TRAIT[s])) v *= 1.15;
    out[s] = Math.floor(v);
  }
  return out;
}

function geneTotal(c) { return STATS.reduce((s, k) => s + c.genes[k], 0); }

function geneGrade(c) {
  const t = geneTotal(c);
  if (t >= 100) return 'S';
  if (t >= 80) return 'A';
  if (t >= 60) return 'B';
  if (t >= 40) return 'C';
  return 'D';
}

function displayName(c) {
  return (has(c, 'glimmer') ? '✨' : '') + sp(c).icon + ' ' + esc(c.name);
}

function xpNeeded(c) { return c.level * 12; }

function gainXp(c, amount) {
  if (c.level >= MAX_LEVEL) return;
  c.xp += amount;
  while (c.level < MAX_LEVEL && c.xp >= xpNeeded(c)) {
    c.xp -= xpNeeded(c);
    const oldMax = stats(c).hp;
    c.level++;
    c.hp += stats(c).hp - oldMax;
    log(`${displayName(c)} grew to level ${c.level}!`);
    if (c.level === BREED_LEVEL) log(`${displayName(c)} is now old enough to breed.`);
  }
}

function rollWildTraits() {
  const traits = [];
  if (chance(0.25)) traits.push(pick(COMMON_TRAITS));
  if (chance(0.03)) traits.push('glimmer');
  return traits;
}

function markSeen(id) { state.seen[id] = true; }
function markCaught(id) { state.seen[id] = true; state.caught[id] = true; }

function addToCollection(c) {
  if (team().length < TEAM_SIZE) c.team = true;
  state.creatures.push(c);
  markCaught(c.sp);
}

// ---------------------------------------------------------------------------
// Steps, eggs, breeding
// ---------------------------------------------------------------------------

function advanceStep() {
  state.step++;
  for (const egg of state.eggs) egg.left--;
  const ready = state.eggs.filter(e => e.left <= 0);
  state.eggs = state.eggs.filter(e => e.left > 0);
  for (const egg of ready) {
    const baby = makeCreature(egg.sp, 1, { genes: egg.genes, traits: egg.traits, gen: egg.gen, parents: egg.parents });
    const isNew = !state.caught[egg.sp];
    addToCollection(baby);
    log(`🥚 An egg hatched into ${displayName(baby)}! (genes ${geneGrade(baby)}, gen ${baby.gen})` +
        (isNew ? ` <span class="gold">New species discovered!</span>` : ''));
  }
}

function canBreed(c) {
  return c.level >= BREED_LEVEL && state.step - c.bredAt >= BREED_COOLDOWN;
}

function breedStatus(c) {
  if (c.level < BREED_LEVEL) return `needs Lv ${BREED_LEVEL}`;
  const wait = BREED_COOLDOWN - (state.step - c.bredAt);
  if (wait > 0) return `resting ${wait} step${wait > 1 ? 's' : ''}`;
  return 'ready';
}

function inheritGene(a, b) {
  const r = Math.random();
  const v = r < 0.4 ? a : r < 0.8 ? b : Math.round((a + b) / 2);
  return clamp(v + randInt(-2, 4), 0, MAX_GENE);
}

function offspringSpecies(a, b) {
  if (a.sp === b.sp) return a.sp;
  const hybrid = HYBRID_BY_PAIR[pairKey(a.sp, b.sp)];
  if (hybrid && chance(HYBRID_CHANCE)) return hybrid;
  return pick([a.sp, b.sp]);
}

function breed(a, b) {
  const genes = Object.fromEntries(STATS.map(s => [s, inheritGene(a.genes[s], b.genes[s])]));
  const traits = [];
  for (const t of new Set([...a.traits, ...b.traits])) {
    const odds = has(a, t) && has(b, t) ? 0.75 : 0.5;
    if (chance(odds)) traits.push(t);
  }
  if (chance(0.1)) {
    const fresh = COMMON_TRAITS.filter(t => !traits.includes(t));
    if (fresh.length) traits.push(pick(fresh));
  }
  if (!traits.includes('glimmer') && chance(0.02)) traits.push('glimmer');
  while (traits.length > MAX_TRAITS) traits.splice(randInt(0, traits.length - 1), 1);

  const left = Math.max(2, 5 - (has(a, 'fertile') || has(b, 'fertile') ? 2 : 0));
  state.eggs.push({
    sp: offspringSpecies(a, b),
    genes, traits,
    gen: Math.max(a.gen, b.gen) + 1,
    parents: [a.name, b.name],
    left,
  });
  a.bredAt = b.bredAt = state.step;
  state.gold -= BREED_COST;
  log(`💞 ${displayName(a)} and ${displayName(b)} produced an egg! It will hatch in ${left} steps.`);
}

// ---------------------------------------------------------------------------
// Battle
// ---------------------------------------------------------------------------

function typeMult(att, def) {
  if (ELEMENTS[att].strong === def) return 1.5;
  if (ELEMENTS[def].strong === att) return 0.67;
  return 1;
}

function label(c) {
  return c === ui.battle.enemy ? `the wild ${displayName(c)}` : displayName(c);
}

function hit(attacker, defender, special) {
  const as = stats(attacker), ds = stats(defender);
  const tm = special ? typeMult(sp(attacker).el, sp(defender).el) : 1;
  const crit = chance(1 / 16);
  const raw = (as.atk * as.atk) / (as.atk + ds.def) * 0.8 * (special ? 1.4 : 1) * tm * (crit ? 1.5 : 1) * (0.85 + Math.random() * 0.15);
  const dmg = Math.max(1, Math.round(raw));
  defender.hp = Math.max(0, defender.hp - dmg);
  let msg = special
    ? `${label(attacker)} unleashes a ${ELEMENTS[sp(attacker).el].icon} ${sp(attacker).el} blast for ${dmg} damage!`
    : `${label(attacker)} strikes for ${dmg} damage.`;
  msg = msg.replace(/^the /, 'The ');
  if (crit) msg += ' Critical hit!';
  if (tm > 1) msg += ' <span class="good">It\'s super effective!</span>';
  if (tm < 1) msg += ' <span class="warn">Not very effective...</span>';
  log(msg);
}

function startEncounter(area) {
  if (!healthyTeam().length) {
    log('<span class="warn">Your team is exhausted. Rest at camp first.</span>');
    return render();
  }
  ui.areaId = area.id;
  advanceStep();

  if (chance(0.12)) {
    if (chance(0.5)) {
      const g = randInt(5, 12 + area.lv[0]);
      state.gold += g;
      log(`You found <span class="gold">${g} gold</span> on the path in ${area.name}.`);
    } else {
      const item = pick(['orb', 'orb', 'potion', 'greatorb']);
      state.items[item]++;
      log(`You found a ${ITEM_NAMES[item]} in ${area.name}!`);
    }
    ui.screen = 'explore';
    save();
    return render();
  }

  const speciesId = weightedPick(area.table);
  const enemy = makeCreature(speciesId, randInt(area.lv[0], area.lv[1]), { transient: true, traits: rollWildTraits() });
  markSeen(speciesId);
  const lead = healthyTeam()[0];
  ui.battle = { enemy, activeId: lead.id, specials: {}, enemySpecials: 3, over: false, mustSwap: false, swapping: false };
  ui.screen = 'battle';
  log(`In ${area.name}, a wild ${displayName(enemy)} (Lv ${enemy.level}) appears!` +
      (has(enemy, 'glimmer') ? ' <span class="gold">It shimmers strangely...</span>' : '') +
      ` Go, ${displayName(lead)}!`);
  save();
  render();
}

function specialsLeft(id) {
  const b = ui.battle;
  if (b.specials[id] === undefined) b.specials[id] = 3;
  return b.specials[id];
}

function enemyTurn() {
  const b = ui.battle, me = getC(b.activeId);
  const useSpecial = b.enemySpecials > 0 && chance(0.35);
  if (useSpecial) b.enemySpecials--;
  hit(b.enemy, me, useSpecial);
}

// Returns true when the round should stop (battle over or forced swap).
function checkEnd() {
  const b = ui.battle;
  if (b.over) return true;
  const me = getC(b.activeId), foe = b.enemy;
  if (foe.hp <= 0) {
    win();
    return true;
  }
  if (me.hp <= 0) {
    log(`<span class="bad">${displayName(me)} fainted!</span>`);
    if (healthyTeam().length) {
      b.mustSwap = true;
    } else {
      lose();
    }
    return true;
  }
  return false;
}

function win() {
  const b = ui.battle, me = getC(b.activeId), foe = b.enemy;
  b.over = true;
  let gold = foe.level * 3 + randInt(0, 5);
  if (has(me, 'lucky')) gold = Math.round(gold * 1.5);
  state.gold += gold;
  log(`The wild ${displayName(foe)} fainted. You earn <span class="gold">${gold} gold</span>.`);
  gainXp(me, foe.level * 8 + 5);
  for (const c of healthyTeam()) if (c !== me) gainXp(c, Math.floor(foe.level * 3));
}

function lose() {
  const b = ui.battle;
  b.over = true;
  const lost = Math.floor(state.gold * 0.1);
  state.gold -= lost;
  log(`<span class="bad">Your whole team fainted.</span> You hurry back to camp, dropping ${lost} gold.`);
}

// `priority` actions (items, swaps, running) always resolve before the enemy acts.
function round(action, priority) {
  const b = ui.battle, me = getC(b.activeId);
  const playerFirst = priority || stats(me).spd >= stats(b.enemy).spd;
  if (playerFirst) {
    action();
    if (!checkEnd()) { enemyTurn(); checkEnd(); }
  } else {
    enemyTurn();
    if (!checkEnd()) { action(); checkEnd(); }
  }
  save();
  render();
}

function tryCapture(orb) {
  const b = ui.battle, foe = b.enemy;
  state.items[orb]--;
  const hpFrac = foe.hp / stats(foe).hp;
  const p = clamp(SPECIES[foe.sp].catch * (1.5 - hpFrac) * (orb === 'greatorb' ? 1.75 : 1), 0.02, 0.95);
  log(`You throw a ${ITEM_NAMES[orb]}...`);
  if (chance(p)) {
    b.over = true;
    const isNew = !state.caught[foe.sp];
    const c = makeCreature(foe.sp, foe.level, { genes: foe.genes, traits: foe.traits });
    c.hp = Math.max(1, foe.hp);
    addToCollection(c);
    log(`<span class="good">Gotcha! ${displayName(c)} was captured!</span>` +
        (isNew ? ' <span class="gold">New species!</span>' : '') +
        (c.team ? ' It joins your team.' : ' It was sent to your collection.'));
  } else {
    log(`The wild ${displayName(foe)} broke free!`);
  }
}

const battleActions = {
  attack() { round(() => hit(getC(ui.battle.activeId), ui.battle.enemy, false)); },
  special() {
    const id = ui.battle.activeId;
    if (specialsLeft(id) <= 0) return;
    ui.battle.specials[id]--;
    round(() => hit(getC(id), ui.battle.enemy, true));
  },
  orb() { if (state.items.orb > 0) round(() => tryCapture('orb'), true); },
  greatorb() { if (state.items.greatorb > 0) round(() => tryCapture('greatorb'), true); },
  potion() {
    const me = getC(ui.battle.activeId);
    if (state.items.potion <= 0 || me.hp >= stats(me).hp) return;
    round(() => usePotion(me), true);
  },
  run() {
    round(() => {
      const b = ui.battle;
      const p = clamp(0.5 + (stats(getC(b.activeId)).spd - stats(b.enemy).spd) / 100, 0.2, 0.95);
      if (chance(p)) {
        b.over = true;
        log('You got away safely.');
      } else {
        log("Couldn't escape!");
      }
    }, true);
  },
  swapMenu() { ui.battle.swapping = !ui.battle.swapping; render(); },
  swapTo(id) {
    const b = ui.battle, c = getC(Number(id));
    if (!c || c.hp <= 0 || c.id === b.activeId) return;
    const doSwap = () => { b.activeId = c.id; log(`Go, ${displayName(c)}!`); };
    b.swapping = false;
    if (b.mustSwap) {
      // Replacing a fainted creature is free.
      b.mustSwap = false;
      doSwap();
      save();
      render();
    } else {
      round(doSwap, true);
    }
  },
};

function usePotion(c) {
  const max = stats(c).hp;
  const heal = Math.min(max - c.hp, Math.ceil(max / 2));
  c.hp += heal;
  state.items.potion--;
  log(`${displayName(c)} recovered ${heal} HP.`);
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function btn(action, text, opts = {}) {
  const cls = [opts.cls, opts.sel ? 'sel' : ''].filter(Boolean).join(' ');
  return `<button data-a="${action}"${opts.v !== undefined ? ` data-v="${esc(opts.v)}"` : ''}` +
         `${cls ? ` class="${cls}"` : ''}${opts.disabled ? ' disabled' : ''}>${text}</button>`;
}

function hpBar(c) {
  const max = stats(c).hp;
  const frac = c.hp / max;
  const n = Math.round(frac * 12);
  const cls = frac > 0.5 ? 'hp-hi' : frac > 0.2 ? 'hp-mid' : 'hp-lo';
  return `<span class="bar ${cls}">${'█'.repeat(n)}${'░'.repeat(12 - n)}</span> ${c.hp}/${max}`;
}

function creatureLine(c) {
  return `${displayName(c)} <span class="muted">Lv ${c.level} ${ELEMENTS[sp(c).el].icon} · ${geneGrade(c)}</span>`;
}

function renderTop() {
  const el = document.getElementById('topbar');
  if (!state) { el.innerHTML = '<b>Critter Keep</b>'; return; }
  el.innerHTML = `<b>Critter Keep</b><span><span class="gold">${state.gold}g</span> · step ${state.step} · 📖 ${caughtCount()}</span>`;
}

function renderLog() {
  document.getElementById('log').innerHTML = state ? state.log.slice(0, 8).map(m => `<p>${m}</p>`).join('') : '';
}

const screens = {
  start() {
    const starters = ['sproutle', 'emberpup', 'puddlefin'];
    return `
      <h2>Welcome, Keeper!</h2>
      <p>Explore the wilds, capture creatures, and breed them to create stronger offspring and rare hybrids.</p>
      <p>Choose your first companion:</p>
      <div class="list">${starters.map(id => {
        const s = SPECIES[id];
        return btn('chooseStarter', `${s.icon} <b>${s.name}</b> ${ELEMENTS[s.el].icon} ${s.el}<br><span class="muted">${s.desc}</span>`, { v: id });
      }).join('')}</div>`;
  },

  camp() {
    const t = team();
    return `
      <h2>🏕️ Camp</h2>
      <div class="card">
        <h3>Team (${t.length}/${TEAM_SIZE})</h3>
        ${t.length ? t.map(c => `<p>${creatureLine(c)}<br>${hpBar(c)}</p>`).join('') : '<p class="warn">No one on your team! Add creatures from your collection.</p>'}
        ${state.eggs.length ? `<h3>Eggs</h3>${state.eggs.map(e => `<p>🥚 hatches in ${e.left} step${e.left > 1 ? 's' : ''}</p>`).join('')}` : ''}
      </div>
      <div class="btns">
        ${btn('go', '🧭 Explore', { v: 'explore', cls: 'primary' })}
        ${btn('rest', '💤 Rest (heal all)')}
        ${btn('go', `📦 Collection (${state.creatures.length})`, { v: 'collection' })}
        ${btn('go', '💞 Breeding', { v: 'breed' })}
        ${btn('go', '🛒 Shop', { v: 'shop' })}
        ${btn('go', '📖 Creaturedex', { v: 'dex' })}
        ${btn('go', '⚙️ Options', { v: 'options' })}
      </div>`;
  },

  explore() {
    const n = caughtCount();
    return `
      <h2>🧭 Where to?</h2>
      <p class="muted">Each trip takes one step. Catch more species to open new areas.</p>
      <div class="list">${AREAS.map(a => {
        const open = n >= a.unlock;
        return btn('explore', open
          ? `<b>${a.name}</b> <span class="muted">Lv ${a.lv[0]}–${a.lv[1]}</span>`
          : `🔒 ${a.name} <span class="muted">catch ${a.unlock} species</span>`, { v: a.id, disabled: !open, sel: a.id === ui.areaId });
      }).join('')}</div>
      <div class="btns">${btn('go', '← Camp', { v: 'camp' })}</div>`;
  },

  battle() {
    const b = ui.battle, me = getC(b.activeId), foe = b.enemy;
    let html = `
      <h2>⚔️ Battle</h2>
      <div class="card">
        <p>Wild ${creatureLine(foe)}${foe.traits.length ? ` <span class="muted">[${foe.traits.map(t => TRAITS[t].name).join(', ')}]</span>` : ''}<br>${hpBar(foe)}</p>
      </div>
      <div class="card">
        <p>${creatureLine(me)}<br>${hpBar(me)}</p>
      </div>`;

    if (b.over) {
      html += `<div class="btns">
        ${btn('explore', '🧭 Explore again', { v: ui.areaId, cls: 'primary', disabled: !healthyTeam().length })}
        ${btn('go', '🏕️ Back to camp', { v: 'camp' })}
      </div>`;
    } else if (b.mustSwap || b.swapping) {
      html += `<h3>${b.mustSwap ? 'Choose your next creature:' : 'Swap to:'}</h3><div class="list">
        ${team().filter(c => c.id !== b.activeId).map(c =>
          btn('swapTo', `${creatureLine(c)}<br>${hpBar(c)}`, { v: c.id, disabled: c.hp <= 0 })).join('')}
      </div>
      ${b.mustSwap ? '' : `<div class="btns">${btn('swapMenu', '← Back')}</div>`}`;
    } else {
      const left = specialsLeft(me.id);
      const canSwap = healthyTeam().some(c => c.id !== me.id);
      html += `<div class="btns">
        ${btn('battle', '🗡️ Attack', { v: 'attack', cls: 'primary' })}
        ${btn('battle', `${ELEMENTS[sp(me).el].icon} Special (${left})`, { v: 'special', disabled: left <= 0 })}
        ${btn('battle', `🔴 Orb (${state.items.orb})`, { v: 'orb', disabled: state.items.orb <= 0 })}
        ${btn('battle', `🟣 Great Orb (${state.items.greatorb})`, { v: 'greatorb', disabled: state.items.greatorb <= 0 })}
        ${btn('battle', `🧪 Potion (${state.items.potion})`, { v: 'potion', disabled: state.items.potion <= 0 || me.hp >= stats(me).hp })}
        ${btn('battle', '🔁 Swap', { v: 'swapMenu', disabled: !canSwap })}
        ${btn('battle', '🏃 Run', { v: 'run' })}
      </div>
      <p class="muted">Tip: weaken a creature before throwing an orb. Specials use your element: ${sp(me).el} beats ${ELEMENTS[sp(me).el].strong || 'nothing in particular'}.</p>`;
    }
    return html;
  },

  collection() {
    const list = [...state.creatures].sort((a, b) => (b.team - a.team) || (b.level - a.level));
    return `
      <h2>📦 Collection (${state.creatures.length})</h2>
      <div class="list">${list.map(c =>
        btn('view', `${c.team ? '⭐ ' : ''}${creatureLine(c)}<br><span class="muted">HP ${c.hp}/${stats(c).hp} · gen ${c.gen}${c.traits.length ? ' · ' + c.traits.map(t => TRAITS[t].name).join(', ') : ''}</span>`, { v: c.id })
      ).join('')}</div>
      <div class="btns">${btn('go', '← Camp', { v: 'camp' })}</div>`;
  },

  creature() {
    const c = getC(ui.cid);
    if (!c) { ui.screen = 'collection'; return screens.collection(); }
    const s = stats(c), species = sp(c);
    const confirming = ui.confirm === 'release';
    return `
      <h2>${displayName(c)}</h2>
      <div class="card">
        <p>${species.name} · ${ELEMENTS[species.el].icon} ${species.el}${species.hybrid ? ' · hybrid' : ''} · generation ${c.gen}</p>
        <p class="muted">${species.desc}</p>
        <p>Level ${c.level}${c.level < MAX_LEVEL ? ` <span class="muted">(${c.xp}/${xpNeeded(c)} xp)</span>` : ''}</p>
        <p>${hpBar(c)}</p>
        <table>
          <tr><td></td><td>stat</td><td>gene</td></tr>
          ${STATS.map(k => `<tr><td>${k.toUpperCase()}</td><td>${s[k]}</td><td class="muted">${c.genes[k]}/${MAX_GENE}</td></tr>`).join('')}
        </table>
        <p>Gene grade: <b>${geneGrade(c)}</b> <span class="muted">(${geneTotal(c)}/${MAX_GENE * 4})</span></p>
        <p>Traits: ${c.traits.length ? c.traits.map(t => `<b>${TRAITS[t].name}</b> <span class="muted">(${TRAITS[t].desc})</span>`).join(', ') : '<span class="muted">none</span>'}</p>
        ${c.parents ? `<p class="muted">Parents: ${c.parents.map(esc).join(' & ')}</p>` : ''}
        <p class="muted">Breeding: ${breedStatus(c)}</p>
      </div>
      ${confirming ? `
        <p class="warn">Release ${displayName(c)} into the wild? You'll receive ${releaseValue(c)} gold as thanks from the ranger.</p>
        <div class="btns">${btn('release', 'Yes, release', { cls: 'danger' })}${btn('confirm', 'Cancel')}</div>` : `
      <div class="btns">
        ${btn('toggleTeam', c.team ? 'Remove from team' : 'Add to team', { disabled: !c.team && team().length >= TEAM_SIZE })}
        ${btn('potionOut', `🧪 Potion (${state.items.potion})`, { disabled: state.items.potion <= 0 || c.hp >= s.hp })}
        ${btn('rename', '✏️ Rename')}
        ${btn('confirm', 'Release', { v: 'release', cls: 'danger', disabled: state.creatures.length <= 1 })}
        ${btn('go', '← Collection', { v: 'collection' })}
      </div>`}`;
  },

  breed() {
    const a = getC(ui.breedA), b = getC(ui.breedB);
    let preview = '<p class="muted">Pick two parents.</p>';
    if (a && b) {
      const hybrid = a.sp !== b.sp && HYBRID_BY_PAIR[pairKey(a.sp, b.sp)];
      const outcomes = a.sp === b.sp ? [sp(a).name] : [sp(a).name, sp(b).name];
      if (hybrid) outcomes.push(state.caught[hybrid] ? `${SPECIES[hybrid].icon} ${SPECIES[hybrid].name}` : '<span class="gold">??? (something new!)</span>');
      preview = `
        <p>Possible offspring: ${outcomes.join(', ')}</p>
        <p class="muted">Genes are inherited from both parents with small mutations, so pairing high-grade parents produces better babies. Traits have a 50% chance to pass on.</p>
        <p>Cost: <span class="gold">${BREED_COST}g</span></p>`;
    }
    const sorted = [...state.creatures].sort((x, y) => canBreed(y) - canBreed(x) || y.level - x.level);
    return `
      <h2>💞 Breeding Den</h2>
      <p class="muted">Creatures must be level ${BREED_LEVEL}+ and rest ${BREED_COOLDOWN} steps between clutches. Some species pairs can produce rare hybrids.</p>
      ${state.eggs.length ? `<div class="card"><h3>Incubating</h3>${state.eggs.map(e => `<p>🥚 from ${e.parents.map(esc).join(' & ')} · hatches in ${e.left} step${e.left > 1 ? 's' : ''}</p>`).join('')}</div>` : ''}
      <div class="list">${sorted.map(c =>
        btn('pickParent', `${creatureLine(c)} <span class="muted">· ${breedStatus(c)}</span>`, { v: c.id, disabled: !canBreed(c), sel: c.id === ui.breedA || c.id === ui.breedB })
      ).join('')}</div>
      <div class="card">${preview}</div>
      <div class="btns">
        ${btn('doBreed', '💞 Breed', { cls: 'primary', disabled: !(a && b) || state.gold < BREED_COST })}
        ${btn('go', '← Camp', { v: 'camp' })}
      </div>`;
  },

  shop() {
    return `
      <h2>🛒 Trading Post</h2>
      <p>You have <span class="gold">${state.gold}g</span>.</p>
      <div class="list">${SHOP.map(i =>
        btn('buy', `<b>${i.name}</b> <span class="gold">${i.price}g</span> <span class="muted">· own ${state.items[i.id]} · ${i.desc}</span>`, { v: i.id, disabled: state.gold < i.price })
      ).join('')}</div>
      <div class="btns">${btn('go', '← Camp', { v: 'camp' })}</div>`;
  },

  dex() {
    const ids = Object.keys(SPECIES);
    return `
      <h2>📖 Creaturedex</h2>
      <p class="muted">Caught ${caughtCount()} / ${ids.length}</p>
      <div class="list">${ids.map(id => {
        const s = SPECIES[id];
        if (state.caught[id]) return `<div class="card">${s.icon} <b>${s.name}</b> ${ELEMENTS[s.el].icon} ${s.hybrid ? '<span class="muted">hybrid</span>' : ''}<br><span class="muted">${s.desc}</span></div>`;
        if (state.seen[id]) return `<div class="card">${s.icon} ${s.name} <span class="muted">· seen, not caught</span></div>`;
        if (s.hybrid) {
          const [a, b] = HYBRIDS.find(h => h[2] === id);
          return `<div class="card">❓ ??? <span class="muted">· rumoured to hatch from ${ELEMENTS[SPECIES[a].el].icon} ${SPECIES[a].el} and ${ELEMENTS[SPECIES[b].el].icon} ${SPECIES[b].el} parents</span></div>`;
        }
        return '<div class="card">❓ ???</div>';
      }).join('')}</div>
      <div class="btns">${btn('go', '← Camp', { v: 'camp' })}</div>`;
  },

  options() {
    return `
      <h2>⚙️ Options</h2>
      <p class="muted">The game saves automatically in this browser. Use export/import to move a save between devices.</p>
      <div class="btns">${btn('exportSave', '📤 Export save')}${btn('importSave', '📥 Import save')}</div>
      <textarea id="savebox" placeholder="Exported save code appears here. Paste a code here, then press Import."></textarea>
      ${ui.confirm === 'reset' ? `
        <p class="warn">Erase all progress and start over?</p>
        <div class="btns">${btn('reset', 'Yes, erase everything', { cls: 'danger' })}${btn('confirm', 'Cancel')}</div>` : `
        <div class="btns">${btn('confirm', '🗑️ New game', { v: 'reset', cls: 'danger' })}${btn('go', '← Camp', { v: 'camp' })}</div>`}`;
  },
};

function render() {
  renderTop();
  document.getElementById('view').innerHTML = screens[ui.screen]();
  renderLog();
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function releaseValue(c) { return c.level * 2 + (has(c, 'glimmer') ? 40 : 0) + c.traits.length * 5; }

const actions = {
  go(screen) {
    ui.screen = screen;
    ui.confirm = null;
    if (screen !== 'battle') ui.battle = null;
    render();
  },
  chooseStarter(id) {
    state = newState();
    const c = makeCreature(id, 3, { genes: randomGenes(10, 18) });
    addToCollection(c);
    log(`${displayName(c)} bounds over to you. Your journey begins!`);
    ui.screen = 'camp';
    save();
    render();
  },
  explore(areaId) {
    const area = AREAS.find(a => a.id === areaId);
    if (area && caughtCount() >= area.unlock) startEncounter(area);
  },
  battle(v) { battleActions[v](); },
  swapTo(id) { battleActions.swapTo(id); },
  swapMenu() { battleActions.swapMenu(); },
  rest() {
    for (const c of state.creatures) c.hp = stats(c).hp;
    advanceStep();
    log('💤 Your creatures rest by the fire and recover fully.');
    save();
    render();
  },
  view(id) { ui.cid = Number(id); ui.confirm = null; ui.screen = 'creature'; render(); },
  toggleTeam() {
    const c = getC(ui.cid);
    if (!c.team && team().length >= TEAM_SIZE) return;
    c.team = !c.team;
    save();
    render();
  },
  potionOut() {
    const c = getC(ui.cid);
    if (state.items.potion > 0 && c.hp < stats(c).hp) usePotion(c);
    save();
    render();
  },
  rename() {
    const c = getC(ui.cid);
    const name = prompt('New name:', c.name);
    if (name && name.trim()) {
      c.name = name.trim().slice(0, 16);
      save();
    }
    render();
  },
  confirm(what) { ui.confirm = what || null; render(); },
  release() {
    const c = getC(ui.cid);
    if (!c || state.creatures.length <= 1) return;
    const g = releaseValue(c);
    state.creatures = state.creatures.filter(x => x !== c);
    state.gold += g;
    log(`You released ${displayName(c)}. The ranger gives you <span class="gold">${g} gold</span>.`);
    if (ui.breedA === c.id) ui.breedA = null;
    if (ui.breedB === c.id) ui.breedB = null;
    ui.confirm = null;
    ui.screen = 'collection';
    save();
    render();
  },
  pickParent(id) {
    id = Number(id);
    if (ui.breedA === id) ui.breedA = null;
    else if (ui.breedB === id) ui.breedB = null;
    else if (ui.breedA === null) ui.breedA = id;
    else if (ui.breedB === null) ui.breedB = id;
    else { ui.breedA = ui.breedB; ui.breedB = id; }
    render();
  },
  doBreed() {
    const a = getC(ui.breedA), b = getC(ui.breedB);
    if (!a || !b || !canBreed(a) || !canBreed(b) || state.gold < BREED_COST) return;
    breed(a, b);
    ui.breedA = ui.breedB = null;
    save();
    render();
  },
  buy(id) {
    const item = SHOP.find(i => i.id === id);
    if (state.gold < item.price) return;
    state.gold -= item.price;
    state.items[id]++;
    log(`Bought a ${item.name}.`);
    save();
    render();
  },
  exportSave() {
    const box = document.getElementById('savebox');
    box.value = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    box.select();
  },
  importSave() {
    const code = document.getElementById('savebox').value.trim();
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(code))));
      if (!data || !Array.isArray(data.creatures)) throw new Error('bad save');
      state = data;
      log('Save imported.');
      save();
      ui.screen = 'camp';
    } catch (e) {
      alert("That save code doesn't look right.");
    }
    render();
  },
  reset() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
    state = null;
    Object.assign(ui, { screen: 'start', battle: null, cid: null, breedA: null, breedB: null, confirm: null });
    render();
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('button[data-a]');
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.a];
  if (fn) fn(el.dataset.v);
});

state = load();
ui.screen = state && state.creatures.length ? 'camp' : 'start';
render();
