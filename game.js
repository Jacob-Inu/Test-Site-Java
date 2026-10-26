'use strict';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SAVE_KEY = 'critterkeep-save-v2';
const TEAM_SIZE = 3;
const BREED_BOND = 30;
const BREED_COOLDOWN = 5; // steps
const BREED_COST = 25;
const SHOW_COOLDOWN = 3; // steps
const MAX_GENE = 31;
const MAX_BOND = 100;

const ELEMENTS = {
  Fire: '🔥', Leaf: '🍃', Earth: '⛰️', Storm: '⚡', Water: '💧', Normal: '⚪',
};

const ATTRS = ['charm', 'wits', 'vigor', 'grace'];
const ATTR_INFO = {
  charm: { name: 'Charm', icon: '💖', desc: 'wild creatures warm up to you faster' },
  wits:  { name: 'Wits',  icon: '🧠', desc: "reads a wild creature's personality" },
  vigor: { name: 'Vigor', icon: '💪', desc: 'finds more while exploring' },
  grace: { name: 'Grace', icon: '🕊️', desc: 'keeps wild creatures calm' },
};

// `warmth` scales how quickly the species opens up (rarer = shyer).
const SPECIES = {
  sproutle:  { name: 'Sproutle',  icon: '🌱', el: 'Leaf',   base: { charm: 45, wits: 35, vigor: 35, grace: 45 }, fav: 'honey',   warmth: 1.0,  pers: ['shy', 'gentle'],      desc: 'A sleepy seedling that naps in sunbeams.' },
  fluffkin:  { name: 'Fluffkin',  icon: '🐑', el: 'Normal', base: { charm: 50, wits: 35, vigor: 40, grace: 40 }, fav: 'berry',   warmth: 1.0,  pers: ['gentle', 'playful'],  desc: 'Mostly wool. Somewhere inside is a creature.' },
  emberpup:  { name: 'Emberpup',  icon: '🐕', el: 'Fire',   base: { charm: 45, wits: 40, vigor: 55, grace: 30 }, fav: 'fish',    warmth: 0.85, pers: ['playful', 'proud'],   desc: 'Its tail flickers when it is happy.' },
  puddlefin: { name: 'Puddlefin', icon: '🐟', el: 'Water',  base: { charm: 40, wits: 45, vigor: 40, grace: 50 }, fav: 'berry',   warmth: 0.9,  pers: ['curious', 'shy'],     desc: 'Can live in a teacup, but prefers a lake.' },
  mossback:  { name: 'Mossback',  icon: '🐢', el: 'Leaf',   base: { charm: 35, wits: 50, vigor: 45, grace: 45 }, fav: 'berry',   warmth: 0.9,  pers: ['gentle', 'grumpy'],   desc: 'A tiny garden grows on its shell.' },
  zapfly:    { name: 'Zapfly',    icon: '🦟', el: 'Storm',  base: { charm: 35, wits: 45, vigor: 50, grace: 45 }, fav: 'honey',   warmth: 0.85, pers: ['playful', 'curious'], desc: 'Buzzes excitedly before thunderstorms.' },
  pebblit:   { name: 'Pebblit',   icon: '🪨', el: 'Earth',  base: { charm: 30, wits: 40, vigor: 60, grace: 35 }, fav: 'trinket', warmth: 0.85, pers: ['grumpy', 'shy'],      desc: 'Often mistaken for an ordinary rock.' },
  golemite:  { name: 'Golemite',  icon: '🗿', el: 'Earth',  base: { charm: 35, wits: 60, vigor: 70, grace: 35 }, fav: 'trinket', warmth: 0.65, pers: ['grumpy', 'proud'],    desc: 'Older than the caves it sleeps in.' },
  cindrake:  { name: 'Cindrake',  icon: '🦎', el: 'Fire',   base: { charm: 50, wits: 50, vigor: 60, grace: 40 }, fav: 'fish',    warmth: 0.7,  pers: ['proud', 'grumpy'],    desc: 'Basks in warm lava. Secretly loves cuddles.' },
  stormhawk: { name: 'Stormhawk', icon: '🦅', el: 'Storm',  base: { charm: 55, wits: 45, vigor: 55, grace: 60 }, fav: 'fish',    warmth: 0.65, pers: ['proud', 'curious'],   desc: 'Rides the wind between the clouds.' },
  tidalurk:  { name: 'Tidalurk',  icon: '🐙', el: 'Water',  base: { charm: 40, wits: 65, vigor: 50, grace: 50 }, fav: 'trinket', warmth: 0.7,  pers: ['curious', 'shy'],     desc: 'Lurks in tide pools, hoarding shells.' },
  elderoak:  { name: 'Elderoak',  icon: '🌳', el: 'Leaf',   base: { charm: 55, wits: 70, vigor: 55, grace: 55 }, fav: 'honey',   warmth: 0.6,  pers: ['gentle', 'proud'],    desc: 'Said to remember the first forest.' },
  // Hybrids: only obtainable by breeding.
  steamhound:{ name: 'Steamhound',icon: '🐺', el: 'Fire',   base: { charm: 55, wits: 50, vigor: 65, grace: 50 }, fav: 'fish',    hybrid: true, desc: 'Born of fire and water. Hisses happily when wet.' },
  bloomwing: { name: 'Bloomwing', icon: '🦋', el: 'Storm',  base: { charm: 60, wits: 50, vigor: 50, grace: 65 }, fav: 'honey',   hybrid: true, desc: 'Scatters sparkling pollen on the breeze.' },
  magmaw:    { name: 'Magmaw',    icon: '🌋', el: 'Earth',  base: { charm: 45, wits: 55, vigor: 75, grace: 40 }, fav: 'trinket', hybrid: true, desc: 'A walking hot spring with a big heart.' },
  cloudram:  { name: 'Cloudram',  icon: '🐏', el: 'Normal', base: { charm: 65, wits: 50, vigor: 55, grace: 60 }, fav: 'berry',   hybrid: true, desc: 'Its fleece is a literal little cloud.' },
  mirewyrm:  { name: 'Mirewyrm',  icon: '🐉', el: 'Water',  base: { charm: 60, wits: 75, vigor: 60, grace: 65 }, fav: 'trinket', hybrid: true, desc: 'Ancient, wise serpent of the drowned groves.' },
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

// `unlock` is the number of distinct species befriended to open the area.
const AREAS = [
  { id: 'meadow',  name: 'Sunny Meadow',  unlock: 0,  table: [['sproutle', 5], ['fluffkin', 5], ['emberpup', 2]] },
  { id: 'lake',    name: 'Misty Lake',    unlock: 2,  table: [['puddlefin', 5], ['mossback', 3], ['zapfly', 3]] },
  { id: 'caves',   name: 'Echo Caves',    unlock: 4,  table: [['pebblit', 5], ['zapfly', 3], ['golemite', 1]] },
  { id: 'volcano', name: 'Ember Volcano', unlock: 6,  table: [['emberpup', 4], ['cindrake', 3], ['pebblit', 3]] },
  { id: 'coast',   name: 'Breezy Coast',  unlock: 8,  table: [['stormhawk', 3], ['tidalurk', 3], ['puddlefin', 3]] },
  { id: 'grove',   name: 'Ancient Grove', unlock: 10, table: [['elderoak', 2], ['mossback', 3], ['golemite', 2], ['cindrake', 2]] },
];

const APPROACHES = {
  talk:   { name: 'Talk softly',          icon: '💬' },
  hum:    { name: 'Hum a tune',           icon: '🎵' },
  play:   { name: 'Play a game',          icon: '🤸' },
  praise: { name: 'Pay a compliment',     icon: '🌟' },
  wait:   { name: 'Sit quietly',          icon: '🧘' },
  buddy:  { name: 'Introduce companion',  icon: '🤝' },
};

// How each personality reacts to each approach.
const PERSONALITIES = {
  shy:     { name: 'Shy',     intro: 'peeks at you from behind a bush.',            react: { wait: 'love',   hum: 'like',   talk: 'like',    praise: 'neutral', buddy: 'neutral', play: 'dislike' } },
  playful: { name: 'Playful', intro: 'bounces around you, bursting with energy.',   react: { play: 'love',   buddy: 'like', hum: 'like',     praise: 'neutral', talk: 'neutral',  wait: 'dislike' } },
  proud:   { name: 'Proud',   intro: 'lifts its chin and pretends not to see you.', react: { praise: 'love', talk: 'like', wait: 'neutral',  hum: 'neutral',    play: 'dislike',  buddy: 'dislike' } },
  gentle:  { name: 'Gentle',  intro: 'watches you with calm, patient eyes.',        react: { hum: 'love',    wait: 'like',  talk: 'like',     buddy: 'like',     praise: 'neutral', play: 'neutral' } },
  grumpy:  { name: 'Grumpy',  intro: 'huffs loudly in your direction.',             react: { wait: 'like',   buddy: 'neutral', hum: 'neutral', play: 'neutral', talk: 'dislike', praise: 'dislike' }, treatLover: true },
  curious: { name: 'Curious', intro: 'sniffs at your bag with great interest.',     react: { talk: 'love',   play: 'like',  buddy: 'like',    praise: 'neutral', hum: 'neutral',  wait: 'dislike' } },
};
const PERSONALITY_IDS = Object.keys(PERSONALITIES);

const REACTIONS = {
  love:    { aff: 24, nerves: -8, face: '💗', lines: ['{n}\'s eyes sparkle! It scoots closer.', '{n} chirps with delight!', '{n} wiggles happily.'] },
  like:    { aff: 14, nerves: 0,  face: '🙂', lines: ['{n} relaxes a little.', '{n} seems to enjoy that.', '{n} edges a bit nearer.'] },
  neutral: { aff: 5,  nerves: 6,  face: '😐', lines: ['{n} tilts its head, unsure.', '{n} doesn\'t quite know what to make of that.', '{n} blinks at you.'] },
  dislike: { aff: -6, nerves: 18, face: '😣', lines: ['{n} flinches and backs away!', '{n} looks uncomfortable.', '{n} gives you a wary glare.'] },
};

const TRAITS = {
  charming: { name: 'Charming', desc: '+15% Charm' },
  clever:   { name: 'Clever',   desc: '+15% Wits' },
  sturdy:   { name: 'Sturdy',   desc: '+15% Vigor' },
  graceful: { name: 'Graceful', desc: '+15% Grace' },
  lucky:    { name: 'Lucky',    desc: '+50% festival prizes' },
  fertile:  { name: 'Fertile',  desc: 'Eggs it parents hatch 2 steps sooner' },
  glimmer:  { name: 'Glimmer',  desc: 'Rare shimmering coat. Purely beautiful.' },
};
const COMMON_TRAITS = Object.keys(TRAITS).filter(t => t !== 'glimmer');
const ATTR_TRAIT = { charm: 'charming', wits: 'clever', vigor: 'sturdy', grace: 'graceful' };
const MAX_TRAITS = 3;

const TREATS = {
  berry:   { name: 'Sweetberry',    icon: '🫐', price: 8 },
  fish:    { name: 'Smoked Fish',   icon: '🍣', price: 8 },
  honey:   { name: 'Honeycomb',     icon: '🍯', price: 12 },
  trinket: { name: 'Shiny Trinket', icon: '💎', price: 20 },
};

// `ribbons` is the total first-place ribbons needed to enter.
const FESTIVALS = [
  { id: 'fair', name: 'Village Fair', ribbons: 0, rivals: [45, 85],   prizes: [20, 10, 5] },
  { id: 'show', name: 'Town Show',    ribbons: 2, rivals: [85, 130],  prizes: [60, 25, 10] },
  { id: 'gala', name: 'Grand Gala',   ribbons: 5, rivals: [130, 190], prizes: [150, 60, 20] },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const chance = p => Math.random() < p;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pairKey = (a, b) => [a, b].sort().join('+');
const HYBRID_BY_PAIR = Object.fromEntries(HYBRIDS.map(([a, b, h]) => [pairKey(a, b), h]));
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

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
const ui = { screen: 'start', enc: null, cid: null, breedA: null, breedB: null, areaId: null, fest: null, cat: null, confirm: null };

function newState() {
  return {
    version: 2,
    gold: 50,
    step: 0,
    nextId: 1,
    items: { berry: 3, fish: 2, honey: 1, trinket: 0 },
    creatures: [],
    eggs: [],
    seen: {},
    caught: {},
    ribbons: 0,
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
const lead = () => team()[0] || null;
const caughtCount = () => Object.keys(state.caught).length;
const has = (c, t) => c.traits.includes(t);

function randomGenes(lo, hi) {
  return Object.fromEntries(ATTRS.map(a => [a, randInt(lo, hi)]));
}

function randomPersonality(speciesId) {
  const s = SPECIES[speciesId];
  return s.pers && chance(0.8) ? pick(s.pers) : pick(PERSONALITY_IDS);
}

function makeCreature(speciesId, opts = {}) {
  return {
    id: opts.transient ? 0 : state.nextId++,
    sp: speciesId,
    name: SPECIES[speciesId].name,
    pers: opts.pers || randomPersonality(speciesId),
    bond: opts.bond || 0,
    genes: opts.genes || randomGenes(0, 15),
    traits: opts.traits || [],
    gen: opts.gen || 0,
    parents: opts.parents || null,
    ribbons: 0,
    team: false,
    bredAt: -999,
    shownAt: -999,
  };
}

// Attributes grow with genes and with your bond.
function stats(c) {
  const base = sp(c).base;
  const out = {};
  for (const a of ATTRS) {
    let v = (base[a] + c.genes[a] * 2) * (1 + c.bond / 200);
    if (has(c, ATTR_TRAIT[a])) v *= 1.15;
    out[a] = Math.floor(v);
  }
  return out;
}

function geneTotal(c) { return ATTRS.reduce((s, k) => s + c.genes[k], 0); }

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

function hearts(value, max, slots = 5) {
  const n = Math.round(value / max * slots);
  return `<span class="bar hp-hi">${'♥'.repeat(n)}</span><span class="bar muted">${'♡'.repeat(slots - n)}</span>`;
}

function addBond(c, amount) {
  const before = c.bond;
  c.bond = Math.min(MAX_BOND, c.bond + amount);
  if (before < BREED_BOND && c.bond >= BREED_BOND) log(`${displayName(c)} trusts you enough to start a family.`);
  if (before < MAX_BOND && c.bond >= MAX_BOND) log(`💞 ${displayName(c)} is your best friend for life!`);
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
    const baby = makeCreature(egg.sp, { genes: egg.genes, traits: egg.traits, gen: egg.gen, parents: egg.parents, pers: egg.pers, bond: 40 });
    const isNew = !state.caught[egg.sp];
    addToCollection(baby);
    log(`🥚 An egg hatched into ${displayName(baby)}! (genes ${geneGrade(baby)}, gen ${baby.gen})` +
        (isNew ? ` <span class="gold">New species discovered!</span>` : ''));
  }
}

function canBreed(c) {
  return c.bond >= BREED_BOND && state.step - c.bredAt >= BREED_COOLDOWN;
}

function breedStatus(c) {
  if (c.bond < BREED_BOND) return `needs bond ${BREED_BOND}`;
  const wait = BREED_COOLDOWN - (state.step - c.bredAt);
  if (wait > 0) return `resting ${plural(wait, 'step')}`;
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
  const genes = Object.fromEntries(ATTRS.map(k => [k, inheritGene(a.genes[k], b.genes[k])]));
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

  const species = offspringSpecies(a, b);
  const left = Math.max(2, 5 - (has(a, 'fertile') || has(b, 'fertile') ? 2 : 0));
  state.eggs.push({
    sp: species,
    pers: chance(0.7) ? pick([a.pers, b.pers]) : randomPersonality(species),
    genes, traits,
    gen: Math.max(a.gen, b.gen) + 1,
    parents: [a.name, b.name],
    left,
  });
  a.bredAt = b.bredAt = state.step;
  state.gold -= BREED_COST;
  log(`💞 ${displayName(a)} and ${displayName(b)} made a nest together. An egg will hatch in ${plural(left, 'step')}.`);
}

// ---------------------------------------------------------------------------
// Encounters: befriending wild creatures
// ---------------------------------------------------------------------------

function companionBonus() {
  const l = lead();
  if (!l) return { charm: 1, grace: 1, wits: 0 };
  const s = stats(l);
  return {
    charm: 1 + s.charm / 250,
    grace: Math.max(0.4, 1 - s.grace / 300),
    wits: Math.min(0.9, s.wits / 150),
  };
}

function teamVigor() { return team().reduce((s, c) => s + stats(c).vigor, 0); }

function explore(area) {
  ui.areaId = area.id;
  ui.screen = 'explore';
  advanceStep();
  const areaIdx = AREAS.indexOf(area);
  const roll = Math.random();

  if (roll < 0.15) {
    const found = 1 + teamVigor() / 300;
    if (chance(0.5)) {
      const g = Math.round(randInt(5, 12 + areaIdx * 4) * found);
      state.gold += g;
      log(`Your companions dig up <span class="gold">${g} gold</span> in ${area.name}.`);
    } else {
      const item = pick(['berry', 'berry', 'fish', 'fish', 'honey', 'trinket']);
      const n = chance(found - 1) ? 2 : 1;
      state.items[item] += n;
      log(`You forage ${n > 1 ? n + ' ' : 'a '}${TREATS[item].icon} ${TREATS[item].name}${n > 1 ? 's' : ''} in ${area.name}.`);
    }
    save();
    return render();
  }

  if (roll < 0.22 && team().length) {
    for (const c of team()) addBond(c, 2);
    log(pick([
      `You and your companions share a picnic in ${area.name}. Your bond grows.`,
      `Your companions chase butterflies together in ${area.name}. Your bond grows.`,
      `You watch the clouds with your companions in ${area.name}. Your bond grows.`,
    ]));
    save();
    return render();
  }

  const speciesId = weightedPick(area.table);
  const wild = makeCreature(speciesId, { transient: true, traits: rollWildTraits() });
  markSeen(speciesId);
  const bonus = companionBonus();
  ui.enc = {
    wild,
    areaIdx,
    aff: 0,
    nerves: 10 + areaIdx * 5 + (has(wild, 'glimmer') ? 10 : 0),
    counts: {},
    knowPers: chance(bonus.wits),
    knowFav: !!state.caught[speciesId] || chance(bonus.wits / 2),
    treatMenu: false,
    result: null,
  };
  ui.screen = 'encounter';
  const p = PERSONALITIES[wild.pers];
  log(`In ${area.name}, a wild ${displayName(wild)} ${p.intro}` +
      (has(wild, 'glimmer') ? ' <span class="gold">Its coat shimmers!</span>' : ''));
  if (ui.enc.knowPers && lead()) log(`${displayName(lead())} senses that it's <b>${p.name}</b>.`);
  save();
  render();
}

function affinityMult() {
  const e = ui.enc;
  return SPECIES[e.wild.sp].warmth * (1 - e.areaIdx * 0.05) * companionBonus().charm;
}

function applyReaction(kind, key, affOverride, nervesOverride) {
  const e = ui.enc, w = e.wild, r = REACTIONS[kind];
  const repeats = e.counts[key] || 0;
  e.counts[key] = repeats + 1;
  let aff = affOverride !== undefined ? affOverride : r.aff;
  let nerves = nervesOverride !== undefined ? nervesOverride : r.nerves;
  let line = pick(r.lines);
  if (aff > 0) {
    aff *= Math.pow(key.startsWith('treat') ? 0.8 : 0.6, repeats) * affinityMult();
    if (repeats >= 2) line += ' It seems a little bored of that, though.';
  }
  nerves += 3; // a little more tension every moment
  if (nerves > 0) nerves *= companionBonus().grace;
  e.aff = clamp(e.aff + Math.round(aff), 0, 100);
  e.nerves = clamp(e.nerves + Math.round(nerves), 0, 100);
  log(`${r.face} ${line.replace('{n}', displayName(w))}`);
  if (kind === 'love' && !e.knowPers) {
    e.knowPers = true;
    log(`You're starting to understand it: it's <b>${PERSONALITIES[w.pers].name}</b>.`);
  }
  checkEncounter();
}

function checkEncounter() {
  const e = ui.enc;
  if (e.aff >= 100) {
    e.result = 'won';
    log(`<span class="good">${displayName(e.wild)} nuzzles your hand. It wants to come home with you!</span>`);
  } else if (e.nerves >= 100) {
    e.result = 'fled';
    log(`<span class="warn">${displayName(e.wild)} gets overwhelmed and dashes away.</span>`);
  }
  save();
  render();
}

function approach(key) {
  const e = ui.enc;
  if (!e || e.result) return;
  const w = e.wild;
  if (key === 'buddy') {
    const l = lead();
    if (!l) return;
    let kind = PERSONALITIES[w.pers].react.buddy;
    if (sp(l).el === sp(w).el) kind = 'love';
    log(`${APPROACHES.buddy.icon} ${displayName(l)} says hello.`);
    return applyReaction(kind, key);
  }
  log(`${APPROACHES[key].icon} You ${APPROACHES[key].name.toLowerCase()}.`);
  applyReaction(PERSONALITIES[w.pers].react[key], key);
}

function offerTreat(id) {
  const e = ui.enc;
  if (!e || e.result || state.items[id] <= 0) return;
  const w = e.wild;
  state.items[id]--;
  e.treatMenu = false;
  const fav = SPECIES[w.sp].fav === id;
  const lover = PERSONALITIES[w.pers].treatLover ? 1.5 : 1;
  log(`${TREATS[id].icon} You offer a ${TREATS[id].name}.`);
  if (fav && !e.knowFav) {
    e.knowFav = true;
    log(`It's ${displayName(w)}'s favourite!`);
  }
  if (fav) applyReaction('love', 'treat-' + id, 30 * lover, -12);
  else applyReaction('like', 'treat-' + id, 10 * lover, -3);
}

function welcome() {
  const e = ui.enc, w = e.wild;
  const c = makeCreature(w.sp, { genes: w.genes, traits: w.traits, pers: w.pers, bond: 10 });
  const isNew = !state.caught[w.sp];
  addToCollection(c);
  const l = lead();
  if (l && l !== c) addBond(l, 3);
  for (const t of team()) if (t !== l && t !== c) addBond(t, 1);
  e.result = 'done';
  log(`🏡 ${displayName(c)} joins your family!` +
      (isNew ? ' <span class="gold">New species befriended!</span>' : '') +
      (c.team ? ' It tags along with your team.' : ' It settles in at camp.'));
  save();
  render();
}

function leaveEncounter() {
  const e = ui.enc;
  if (!e.result) log(`You wave goodbye to the wild ${displayName(e.wild)}.`);
  else if (e.result === 'won') log(`You let ${displayName(e.wild)} stay in the wild. It waves goodbye.`);
  e.result = e.result === 'won' ? 'done' : e.result || 'left';
  save();
  render();
}

// ---------------------------------------------------------------------------
// Festivals
// ---------------------------------------------------------------------------

function canShow(c) { return state.step - c.shownAt >= SHOW_COOLDOWN; }

function enterFestival(fest, attr, c) {
  advanceStep();
  c.shownAt = state.step;
  const score = stats(c)[attr] + randInt(0, 20);
  const rivals = [0, 1, 2].map(() => randInt(fest.rivals[0], fest.rivals[1]));
  const place = 1 + rivals.filter(r => r > score).length;
  log(`🎪 ${displayName(c)} performs in the ${ATTR_INFO[attr].name} contest at the ${fest.name}! Score ${score} vs rivals ${rivals.join(', ')}.`);
  addBond(c, 2);
  if (place <= 3) {
    let prize = fest.prizes[place - 1];
    if (has(c, 'lucky')) prize = Math.round(prize * 1.5);
    state.gold += prize;
    const medal = ['🥇 1st', '🥈 2nd', '🥉 3rd'][place - 1];
    log(`${medal} place! You win <span class="gold">${prize} gold</span>.` + (place === 1 ? ' 🎀 A ribbon!' : ''));
    if (place === 1) {
      c.ribbons++;
      state.ribbons++;
    }
  } else {
    log('No prize this time, but the crowd cheered warmly.');
  }
  save();
  render();
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function btn(action, text, opts = {}) {
  const cls = [opts.cls, opts.sel ? 'sel' : ''].filter(Boolean).join(' ');
  return `<button data-a="${action}"${opts.v !== undefined ? ` data-v="${esc(opts.v)}"` : ''}` +
         `${cls ? ` class="${cls}"` : ''}${opts.disabled ? ' disabled' : ''}>${text}</button>`;
}

function meter(value, cls) {
  const n = Math.round(value / 100 * 12);
  return `<span class="bar ${cls}">${'█'.repeat(n)}${'░'.repeat(12 - n)}</span> ${value}`;
}

function creatureLine(c) {
  return `${displayName(c)} <span class="muted">${ELEMENTS[sp(c).el]} · ${geneGrade(c)} · </span>${hearts(c.bond, MAX_BOND)}`;
}

function renderTop() {
  const el = document.getElementById('topbar');
  if (!state) { el.innerHTML = '<b>Critter Keep</b>'; return; }
  el.innerHTML = `<b>Critter Keep</b><span><span class="gold">${state.gold}g</span> · 🕒${state.step} · 📖${caughtCount()} · 🎀${state.ribbons}</span>`;
}

function renderLog() {
  document.getElementById('log').innerHTML = state ? state.log.slice(0, 8).map(m => `<p>${m}</p>`).join('') : '';
}

const backToCamp = () => `<div class="btns">${btn('go', '← Camp', { v: 'camp' })}</div>`;

const screens = {
  start() {
    const starters = ['sproutle', 'emberpup', 'puddlefin'];
    return `
      <h2>Welcome, Keeper!</h2>
      <p>Wander the wilds, win the trust of shy creatures, and raise a family of companions. Breed them to bring out their best qualities and discover rare hybrids.</p>
      <p>Choose your first companion:</p>
      <div class="list">${starters.map(id => {
        const s = SPECIES[id];
        return btn('chooseStarter', `${s.icon} <b>${s.name}</b> ${ELEMENTS[s.el]} ${s.el}<br><span class="muted">${s.desc}</span>`, { v: id });
      }).join('')}</div>`;
  },

  camp() {
    const t = team();
    return `
      <h2>🏕️ Camp</h2>
      <div class="card">
        <h3>Companions (${t.length}/${TEAM_SIZE})</h3>
        ${t.length ? t.map((c, i) => `<p>${i === 0 ? '👑 ' : ''}${creatureLine(c)}</p>`).join('') : '<p class="warn">Nobody is travelling with you. Pick companions from your family.</p>'}
        ${state.eggs.length ? `<h3>Eggs</h3>${state.eggs.map(e => `<p>🥚 hatches in ${plural(e.left, 'step')}</p>`).join('')}` : ''}
      </div>
      <div class="btns">
        ${btn('go', '🧭 Explore', { v: 'explore', cls: 'primary' })}
        ${btn('cuddle', '🧸 Spend time together')}
        ${btn('go', `🏡 Family (${state.creatures.length})`, { v: 'collection' })}
        ${btn('go', '💞 Nesting', { v: 'breed' })}
        ${btn('go', '🎪 Festivals', { v: 'festival' })}
        ${btn('go', '🛒 Market', { v: 'shop' })}
        ${btn('go', '📖 Creaturedex', { v: 'dex' })}
        ${btn('go', '⚙️ Options', { v: 'options' })}
      </div>`;
  },

  explore() {
    const n = caughtCount();
    return `
      <h2>🧭 Where to?</h2>
      <p class="muted">Each trip takes one step (🕒). Befriend more species to discover new places.</p>
      <div class="list">${AREAS.map(a => {
        const open = n >= a.unlock;
        return btn('explore', open ? `<b>${a.name}</b>` : `🔒 ${a.name} <span class="muted">befriend ${a.unlock} species</span>`,
          { v: a.id, disabled: !open, sel: a.id === ui.areaId });
      }).join('')}</div>
      ${backToCamp()}`;
  },

  encounter() {
    const e = ui.enc, w = e.wild, s = SPECIES[w.sp];
    const p = PERSONALITIES[w.pers];
    const l = lead();
    let html = `
      <h2>💬 Encounter</h2>
      <div class="card">
        <p>Wild ${displayName(w)} <span class="muted">${ELEMENTS[s.el]} ${s.el}</span>${w.traits.length ? ` <span class="muted">[${w.traits.map(t => TRAITS[t].name).join(', ')}]</span>` : ''}</p>
        <p class="muted">Personality: ${e.knowPers ? `<b>${p.name}</b>` : '???'} · Favourite treat: ${e.knowFav ? `${TREATS[s.fav].icon} ${TREATS[s.fav].name}` : '???'}</p>
        <p>Affection ${meter(e.aff, 'hp-hi')}</p>
        <p>Nerves&nbsp;&nbsp;&nbsp; ${meter(e.nerves, e.nerves > 70 ? 'hp-lo' : 'hp-mid')}</p>
      </div>
      ${l ? `<p class="muted">With you: ${displayName(l)} · 💖 ${stats(l).charm} 🧠 ${stats(l).wits} 🕊️ ${stats(l).grace}</p>` : ''}`;

    if (e.result === 'won') {
      html += `<div class="btns">
        ${btn('welcome', '🏡 Welcome to the family!', { cls: 'primary' })}
        ${btn('leave', '👋 Let it stay wild')}
      </div>`;
    } else if (e.result) {
      html += `<div class="btns">
        ${btn('explore', '🧭 Keep exploring', { v: ui.areaId, cls: 'primary' })}
        ${btn('go', '🏕️ Back to camp', { v: 'camp' })}
      </div>`;
    } else if (e.treatMenu) {
      html += `<h3>Offer a treat:</h3><div class="btns">
        ${Object.entries(TREATS).map(([id, t]) => btn('treat', `${t.icon} ${t.name} (${state.items[id]})`, { v: id, disabled: state.items[id] <= 0 })).join('')}
        ${btn('treatMenu', '← Back')}
      </div>`;
    } else {
      html += `<div class="btns">
        ${Object.entries(APPROACHES).map(([id, a]) => btn('approach', `${a.icon} ${a.name}`, { v: id, disabled: id === 'buddy' && !l })).join('')}
        ${btn('treatMenu', '🎁 Offer a treat')}
        ${btn('leave', '👋 Say goodbye')}
      </div>
      <p class="muted">Win its affection before its nerves run out. Watch how it reacts, and mix things up: nobody likes hearing the same line twice.</p>`;
    }
    return html;
  },

  collection() {
    return `
      <h2>🏡 Family (${state.creatures.length})</h2>
      <p class="muted">👑 marks your lead companion, whose qualities help on outings.</p>
      <div class="list">${team().concat(state.creatures.filter(c => !c.team)).map(c =>
        btn('view', `${c === lead() ? '👑 ' : c.team ? '⭐ ' : ''}${creatureLine(c)}<br><span class="muted">${PERSONALITIES[c.pers].name} · gen ${c.gen}${c.ribbons ? ` · 🎀${c.ribbons}` : ''}${c.traits.length ? ' · ' + c.traits.map(t => TRAITS[t].name).join(', ') : ''}</span>`, { v: c.id })
      ).join('')}</div>
      ${backToCamp()}`;
  },

  creature() {
    const c = getC(ui.cid);
    if (!c) { ui.screen = 'collection'; return screens.collection(); }
    const s = stats(c), species = sp(c);
    const confirming = ui.confirm === 'release';
    return `
      <h2>${displayName(c)}</h2>
      <div class="card">
        <p>${species.name} · ${ELEMENTS[species.el]} ${species.el}${species.hybrid ? ' · hybrid' : ''} · generation ${c.gen}</p>
        <p class="muted">${species.desc}</p>
        <p>Personality: <b>${PERSONALITIES[c.pers].name}</b> · Loves ${TREATS[species.fav].icon}</p>
        <p>Bond ${hearts(c.bond, MAX_BOND, 10)} <span class="muted">${c.bond}/${MAX_BOND}</span></p>
        <table>
          <tr><td></td><td>value</td><td>gene</td></tr>
          ${ATTRS.map(k => `<tr><td>${ATTR_INFO[k].icon} ${ATTR_INFO[k].name}</td><td>${s[k]}</td><td class="muted">${c.genes[k]}/${MAX_GENE}</td></tr>`).join('')}
        </table>
        <p>Gene grade: <b>${geneGrade(c)}</b> <span class="muted">(${geneTotal(c)}/${MAX_GENE * 4})</span></p>
        <p>Traits: ${c.traits.length ? c.traits.map(t => `<b>${TRAITS[t].name}</b> <span class="muted">(${TRAITS[t].desc})</span>`).join(', ') : '<span class="muted">none</span>'}</p>
        ${c.ribbons ? `<p>🎀 Ribbons: ${c.ribbons}</p>` : ''}
        ${c.parents ? `<p class="muted">Parents: ${c.parents.map(esc).join(' & ')}</p>` : ''}
        <p class="muted">Nesting: ${breedStatus(c)}</p>
      </div>
      ${confirming ? `
        <p class="warn">Find ${displayName(c)} a new loving home? The ranger will thank you with ${releaseValue(c)} gold.</p>
        <div class="btns">${btn('release', 'Yes, rehome', { cls: 'danger' })}${btn('confirm', 'Cancel')}</div>` : `
      <div class="btns">
        ${btn('toggleTeam', c.team ? 'Stay at camp' : 'Bring along', { disabled: !c.team && team().length >= TEAM_SIZE })}
        ${btn('makeLead', '👑 Make lead', { disabled: c === lead() })}
        ${btn('rename', '✏️ Rename')}
        ${btn('confirm', 'Rehome', { v: 'release', cls: 'danger', disabled: state.creatures.length <= 1 })}
        ${btn('go', '← Family', { v: 'collection' })}
      </div>`}`;
  },

  breed() {
    const a = getC(ui.breedA), b = getC(ui.breedB);
    let preview = '<p class="muted">Pick two creatures.</p>';
    if (a && b) {
      const hybrid = a.sp !== b.sp && HYBRID_BY_PAIR[pairKey(a.sp, b.sp)];
      const outcomes = a.sp === b.sp ? [sp(a).name] : [sp(a).name, sp(b).name];
      if (hybrid) outcomes.push(state.caught[hybrid] ? `${SPECIES[hybrid].icon} ${SPECIES[hybrid].name}` : '<span class="gold">??? (something new!)</span>');
      preview = `
        <p>Possible babies: ${outcomes.join(', ')}</p>
        <p class="muted">Babies inherit genes from both parents with small mutations, so pairing high-grade parents brings out better qualities. Traits have a 50% chance to pass on.</p>
        <p>Nest supplies: <span class="gold">${BREED_COST}g</span></p>`;
    }
    const sorted = [...state.creatures].sort((x, y) => canBreed(y) - canBreed(x) || geneTotal(y) - geneTotal(x));
    return `
      <h2>💞 Nesting Grove</h2>
      <p class="muted">Creatures need a bond of ${BREED_BOND}+ to feel safe nesting, and rest ${plural(BREED_COOLDOWN, 'step')} between clutches. Some species pairs can produce rare hybrids.</p>
      ${state.eggs.length ? `<div class="card"><h3>Incubating</h3>${state.eggs.map(e => `<p>🥚 from ${e.parents.map(esc).join(' & ')} · hatches in ${plural(e.left, 'step')}</p>`).join('')}</div>` : ''}
      <div class="list">${sorted.map(c =>
        btn('pickParent', `${creatureLine(c)} <span class="muted">· ${breedStatus(c)}</span>`, { v: c.id, disabled: !canBreed(c), sel: c.id === ui.breedA || c.id === ui.breedB })
      ).join('')}</div>
      <div class="card">${preview}</div>
      <div class="btns">
        ${btn('doBreed', '💞 Build a nest', { cls: 'primary', disabled: !(a && b) || state.gold < BREED_COST })}
        ${btn('go', '← Camp', { v: 'camp' })}
      </div>`;
  },

  festival() {
    const fest = FESTIVALS.find(f => f.id === ui.fest);
    if (!fest) {
      return `
        <h2>🎪 Festivals</h2>
        <p class="muted">Show off your creatures' talents in friendly contests. First place earns a 🎀 ribbon, and ribbons open bigger festivals.</p>
        <div class="list">${FESTIVALS.map(f => {
          const open = state.ribbons >= f.ribbons;
          return btn('pickFest', open
            ? `<b>${f.name}</b> <span class="muted">rivals score ${f.rivals[0]}–${f.rivals[1]} · 1st prize ${f.prizes[0]}g</span>`
            : `🔒 ${f.name} <span class="muted">needs ${f.ribbons} ribbons</span>`, { v: f.id, disabled: !open });
        }).join('')}</div>
        ${backToCamp()}`;
    }
    if (!ui.cat) {
      return `
        <h2>🎪 ${fest.name}</h2>
        <p>Which contest?</p>
        <div class="list">${ATTRS.map(a => btn('pickCat', `${ATTR_INFO[a].icon} <b>${ATTR_INFO[a].name}</b> contest`, { v: a })).join('')}</div>
        <div class="btns">${btn('pickFest', '← Festivals', { v: '' })}</div>`;
    }
    const sorted = [...state.creatures].sort((x, y) => stats(y)[ui.cat] - stats(x)[ui.cat]);
    return `
      <h2>🎪 ${fest.name}: ${ATTR_INFO[ui.cat].name}</h2>
      <p class="muted">Pick a performer. Each creature needs ${plural(SHOW_COOLDOWN, 'step')} of rest between shows. Entering takes one step.</p>
      <div class="list">${sorted.map(c => {
        const wait = SHOW_COOLDOWN - (state.step - c.shownAt);
        return btn('perform', `${displayName(c)} <span class="muted">${ATTR_INFO[ui.cat].icon} ${stats(c)[ui.cat]}${wait > 0 ? ` · resting ${plural(wait, 'step')}` : ''}</span>`, { v: c.id, disabled: !canShow(c) });
      }).join('')}</div>
      <div class="btns">${btn('pickCat', '← Contests', { v: '' })}</div>`;
  },

  shop() {
    return `
      <h2>🛒 Market</h2>
      <p>You have <span class="gold">${state.gold}g</span>. Every species has a favourite treat.</p>
      <div class="list">${Object.entries(TREATS).map(([id, t]) =>
        btn('buy', `${t.icon} <b>${t.name}</b> <span class="gold">${t.price}g</span> <span class="muted">· own ${state.items[id]}</span>`, { v: id, disabled: state.gold < t.price })
      ).join('')}</div>
      ${backToCamp()}`;
  },

  dex() {
    const ids = Object.keys(SPECIES);
    return `
      <h2>📖 Creaturedex</h2>
      <p class="muted">Befriended ${caughtCount()} / ${ids.length}</p>
      <div class="list">${ids.map(id => {
        const s = SPECIES[id];
        if (state.caught[id]) return `<div class="card">${s.icon} <b>${s.name}</b> ${ELEMENTS[s.el]} ${s.hybrid ? '<span class="muted">hybrid</span>' : ''} <span class="muted">· loves ${TREATS[s.fav].icon}</span><br><span class="muted">${s.desc}</span></div>`;
        if (state.seen[id]) return `<div class="card">${s.icon} ${s.name} <span class="muted">· met, not yet befriended</span></div>`;
        if (s.hybrid) {
          const [a, b] = HYBRIDS.find(h => h[2] === id);
          return `<div class="card">❓ ??? <span class="muted">· rumoured to hatch from ${ELEMENTS[SPECIES[a].el]} ${SPECIES[a].el} and ${ELEMENTS[SPECIES[b].el]} ${SPECIES[b].el} parents</span></div>`;
        }
        return '<div class="card">❓ ???</div>';
      }).join('')}</div>
      ${backToCamp()}`;
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

function releaseValue(c) { return Math.round(geneTotal(c) / 3) + (has(c, 'glimmer') ? 40 : 0) + c.traits.length * 5 + c.ribbons * 10; }

const actions = {
  go(screen) {
    ui.screen = screen;
    ui.confirm = null;
    ui.enc = null;
    ui.fest = ui.cat = null;
    render();
  },
  chooseStarter(id) {
    state = newState();
    const c = makeCreature(id, { genes: randomGenes(10, 18), bond: 20 });
    addToCollection(c);
    log(`${displayName(c)} bounds over and licks your hand. Your journey begins!`);
    ui.screen = 'camp';
    save();
    render();
  },
  explore(areaId) {
    const area = AREAS.find(a => a.id === areaId);
    if (!area || caughtCount() < area.unlock) return;
    ui.enc = null;
    explore(area);
  },
  approach(key) { approach(key); },
  treatMenu() { ui.enc.treatMenu = !ui.enc.treatMenu; render(); },
  treat(id) { offerTreat(id); },
  welcome() { if (ui.enc && ui.enc.result === 'won') welcome(); },
  leave() { leaveEncounter(); },
  cuddle() {
    if (!team().length) {
      log('Bring some companions along first.');
      return render();
    }
    advanceStep();
    for (const c of team()) addBond(c, randInt(2, 4));
    log(pick([
      '🧸 You brush your companions by the campfire. Your bond grows.',
      '🧸 You play tag around camp until everyone is tired. Your bond grows.',
      '🧸 You tell stories under the stars. Your bond grows.',
    ]));
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
  makeLead() {
    const c = getC(ui.cid);
    if (!c.team) {
      const others = team();
      if (others.length >= TEAM_SIZE) others[others.length - 1].team = false;
      c.team = true;
    }
    // The lead is the first team member in collection order.
    state.creatures = [c, ...state.creatures.filter(x => x !== c)];
    log(`${displayName(c)} will lead your outings.`);
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
    log(`${displayName(c)} went to a loving new home. The ranger thanks you with <span class="gold">${g} gold</span>.`);
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
  pickFest(id) { ui.fest = id || null; ui.cat = null; render(); },
  pickCat(attr) { ui.cat = attr || null; render(); },
  perform(id) {
    const fest = FESTIVALS.find(f => f.id === ui.fest), c = getC(Number(id));
    if (!fest || !c || !ui.cat || !canShow(c) || state.ribbons < fest.ribbons) return;
    enterFestival(fest, ui.cat, c);
  },
  buy(id) {
    const t = TREATS[id];
    if (state.gold < t.price) return;
    state.gold -= t.price;
    state.items[id]++;
    log(`Bought a ${t.icon} ${t.name}.`);
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
      if (!data || !Array.isArray(data.creatures) || data.version !== 2) throw new Error('bad save');
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
    Object.assign(ui, { screen: 'start', enc: null, cid: null, breedA: null, breedB: null, fest: null, cat: null, confirm: null });
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
