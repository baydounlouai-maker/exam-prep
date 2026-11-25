// Interactive building blocks for data-driven lessons. Each widget takes (block, el)
// where `block` is plain data from a course's data files and `el` is the element to fill.

import { esc, shuffle, burst, replay, ICON, feedbackHTML } from './common.js';

/** Tiny markup for lesson text: **bold** and `code`. Everything else is escaped. */
export function md(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

/** Run `fn` once, the first time `el` scrolls into view. */
function whenVisible(el, fn) {
  if (!('IntersectionObserver' in window)) return fn();
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      fn();
    }
  }, { threshold: 0.35 });
  io.observe(el);
}

/* ---------- Explorer: pick a chip, see an animated detail card ---------- */

function explorer(block, el) {
  const items = block.items;
  el.innerHTML = `<div class="xp">
    <div class="xp__chips" role="tablist" aria-label="${esc(block.title)}">
      ${items.map((it, i) => `<button class="xp__chip" type="button" role="tab" aria-selected="false" data-i="${i}">
        <span>${esc(it.name)}</span>${it.tag ? `<span class="xp__tag">${esc(it.tag)}</span>` : ''}
        <span class="xp__seen" hidden>${ICON.check(12)}</span></button>`).join('')}
    </div>
    <div class="card xp__panel" aria-live="polite"></div>
  </div>`;
  const panel = el.querySelector('.xp__panel');
  const seen = new Set();
  const show = (i) => {
    const it = items[i];
    seen.add(i);
    el.querySelectorAll('.xp__chip').forEach((c, k) => {
      c.setAttribute('aria-selected', String(k === i));
      c.querySelector('.xp__seen').hidden = !seen.has(k) || k === i;
    });
    panel.innerHTML = `
      <div class="xp__head rise">
        <h3 class="xp__big">${esc(it.name)}</h3>
        ${it.tag ? `<span class="chip">${esc(it.tag)}</span>` : ''}
      </div>
      <ul class="xp__points">${it.points.map((p, k) => `<li style="animation-delay:${0.06 + k * 0.08}s">${md(p)}</li>`).join('')}</ul>
      ${it.note ? `<p class="xp__note rise" style="animation-delay:${0.1 + it.points.length * 0.08}s">${md(it.note)}</p>` : ''}`;
  };
  el.querySelector('.xp__chips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) show(Number(b.dataset.i));
  });
  show(0);
}

/* ---------- Flip cards: guess, then tap ---------- */

function flips(block, el) {
  el.innerHTML = `<div class="flips${block.wide ? ' flips--wide' : ''}">${block.cards.map((c) => `
    <button class="flip" type="button" aria-pressed="false" aria-label="${esc(c.front)}. Flip to reveal.">
      <span class="flip__inner">
        <span class="flip__face">
          <span class="${c.front.length <= 3 ? 'flip__sym' : 'flip__term'}">${esc(c.front)}</span>
          <span class="flip__hint">tap to flip</span>
        </span>
        <span class="flip__face flip__face--back"><span class="flip__def">${md(c.back)}</span></span>
      </span>
    </button>`).join('')}</div>`;
  el.querySelectorAll('.flip').forEach((card, i) => {
    card.addEventListener('click', () => {
      const on = card.getAttribute('aria-pressed') !== 'true';
      card.setAttribute('aria-pressed', String(on));
      const c = block.cards[i];
      card.setAttribute('aria-label', on ? `${c.front}: ${c.back.replace(/\*\*|`/g, '')}` : `${c.front}. Flip to reveal.`);
    });
  });
}

/* ---------- Sort: tap the right bucket for each item ---------- */

function sort(block, el) {
  const { buckets } = block;
  let deck = [];
  let pos = 0;
  let score = 0;

  const start = () => { deck = shuffle(block.items); pos = 0; score = 0; next(); };

  const next = () => {
    if (pos >= deck.length) {
      const perfect = score === deck.length;
      el.innerHTML = `<div class="card card--pad game-end rise">
        <div class="stack" style="gap:4px">
          <span class="feedback__title">${perfect ? 'Flawless!' : `${score} of ${deck.length}`}</span>
          <span class="muted">${perfect ? 'You sorted every one.' : 'Go again until it\'s automatic.'}</span>
        </div>
        <button class="btn" type="button" data-again>${ICON.redo(16)} Play again</button>
      </div>`;
      el.querySelector('[data-again]').addEventListener('click', start);
      return;
    }
    const item = deck[pos];
    el.innerHTML = `<div class="card card--pad sorter">
      <div class="row row--between"><span class="muted">${pos + 1} of ${deck.length}${block.prompt ? ` · ${esc(block.prompt)}` : ''}</span><span class="chip">${score} ✓</span></div>
      <div class="sorter__item rise">${md(item.text)}</div>
      <div class="sorter__btns" style="--n:${buckets.length}">${buckets.map((b) =>
        `<button class="btn sorter__btn" type="button" data-b="${esc(b.id)}">${esc(b.label)}${b.hint ? `<span class="sorter__hint">${esc(b.hint)}</span>` : ''}</button>`).join('')}</div>
      <div data-fb></div>
    </div>`;
    let locked = false;
    el.querySelectorAll('[data-b]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (locked) return;
        locked = true;
        const right = btn.dataset.b === item.b;
        if (right) score++;
        el.querySelector('.chip').textContent = `${score} ✓`;
        el.querySelectorAll('[data-b]').forEach((x) => {
          x.setAttribute('aria-disabled', 'true');
          if (x.dataset.b === item.b) x.classList.add('is-right');
          else if (x === btn) x.classList.add('is-wrong');
        });
        const label = buckets.find((b) => b.id === item.b).label;
        const fb = el.querySelector('[data-fb]');
        fb.innerHTML = feedbackHTML(right, right ? 'Yes!' : `Nope: ${label}.`, item.why || '', pos === deck.length - 1 ? 'Finish' : 'Next');
        if (right) burst(fb.querySelector('[data-burst]'));
        const nb = fb.querySelector('[data-next]');
        nb.focus({ preventScroll: true });
        nb.addEventListener('click', () => { pos++; next(); });
      });
    });
  };
  start();
}

/* ---------- Order: tap the steps in sequence ---------- */

function order(block, el) {
  const start = () => {
    const pool = shuffle(block.steps.map((s, i) => ({ s, i })));
    let want = 0;
    let slips = 0;
    el.innerHTML = `<div class="card card--pad orderer">
      <p class="muted">${esc(block.prompt || 'Tap the steps in the right order.')}</p>
      <ol class="orderer__done" aria-live="polite"></ol>
      <div class="orderer__pool">${pool.map((p) => `<button class="btn orderer__step" type="button" data-i="${p.i}">${md(p.s)}</button>`).join('')}</div>
      <div data-fb></div>
    </div>`;
    const done = el.querySelector('.orderer__done');
    el.querySelectorAll('.orderer__step').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (Number(btn.dataset.i) !== want) {
          slips++;
          replay(btn, 'is-wrong');
          return;
        }
        btn.remove();
        done.insertAdjacentHTML('beforeend', `<li class="rise"><span class="orderer__n">${want + 1}</span>${md(block.steps[want])}</li>`);
        want++;
        if (want === block.steps.length) {
          const fb = el.querySelector('[data-fb]');
          const perfect = slips === 0;
          fb.innerHTML = `<div class="feedback ${perfect ? 'is-right' : 'is-wrong'}" role="status">
            <div class="feedback__body"><div class="badge-icon" data-burst>${perfect ? ICON.check(22) : '<strong style="font-size:22px">!</strong>'}</div>
            <div><span class="feedback__title">${perfect ? 'Perfect order!' : `Done, with ${slips} slip${slips === 1 ? '' : 's'}.`}</span><span>${md(block.done || 'That\'s the sequence.')}</span></div></div>
            <button class="btn" type="button" data-again>${ICON.redo(16)} Again</button></div>`;
          if (perfect) burst(fb.querySelector('[data-burst]'));
          fb.querySelector('[data-again]').addEventListener('click', start);
        }
      });
    });
  };
  start();
}

/* ---------- Bars: animated speed / size comparison ---------- */

function bars(block, el) {
  const max = block.max || Math.max(...block.items.map((i) => i.value));
  el.innerHTML = `<div class="card card--pad bars">
    ${block.items.map((it) => `<div class="bars__row">
      <span class="bars__label">${esc(it.label)}</span>
      <div class="bars__track"><span class="bars__fill" data-w="${(it.value / max) * 100}"></span></div>
      <span class="bars__val">${esc(it.display || `${it.value} ${block.unit || ''}`)}</span>
      ${it.note ? `<span class="bars__note">${md(it.note)}</span>` : ''}
    </div>`).join('')}
    <div class="row"><button class="btn" type="button" data-race>${ICON.bolt(16)} ${esc(block.button || 'Race again')}</button>${block.foot ? `<span class="muted">${md(block.foot)}</span>` : ''}</div>
  </div>`;
  const fills = [...el.querySelectorAll('.bars__fill')];
  const race = () => {
    fills.forEach((f) => { f.style.transition = 'none'; f.style.width = '0'; });
    void el.offsetWidth;
    fills.forEach((f, k) => {
      f.style.transition = `width 1.1s cubic-bezier(.2,.8,.2,1) ${k * 0.12}s`;
      f.style.width = Math.max(Number(f.dataset.w), 1.5) + '%';
    });
  };
  el.querySelector('[data-race]').addEventListener('click', race);
  whenVisible(el, race);
}

/* ---------- Stack: layers that drop into place ---------- */

function stack(block, el) {
  el.innerHTML = `<div class="card card--pad stackw">
    <div class="stackw__layers">${block.layers.map((l, i) => `
      <button class="stackw__layer" type="button" aria-pressed="false" data-i="${i}" style="--d:${i * 0.15}s;--w:${100 - i * 6}%">
        <span class="stackw__name">${esc(l.name)}</span><span class="stackw__eg">${esc(l.eg || '')}</span>
      </button>${i < block.layers.length - 1 ? '<span class="stackw__link" aria-hidden="true"></span>' : ''}`).join('')}
    </div>
    <p class="stackw__detail" aria-live="polite">${md(block.hint || 'Tap a layer.')}</p>
  </div>`;
  const detail = el.querySelector('.stackw__detail');
  el.querySelectorAll('.stackw__layer').forEach((b) => {
    b.addEventListener('click', () => {
      el.querySelectorAll('.stackw__layer').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      detail.innerHTML = md(block.layers[Number(b.dataset.i)].detail);
      replay(detail, 'rise');
    });
  });
}

/* ---------- Units: bits → bytes → KB … ladder with a converter ---------- */

const UNIT_SETS = {
  storage: {
    label: 'Storage (×1024)',
    units: [
      { u: 'bit', f: 1 / 8 }, { u: 'Byte', f: 1 }, { u: 'KB', f: 1024 }, { u: 'MB', f: 1024 ** 2 }, { u: 'GB', f: 1024 ** 3 }, { u: 'TB', f: 1024 ** 4 },
    ],
    steps: ['×8', '×1024', '×1024', '×1024', '×1024'],
    note: '**8 bits = 1 Byte.** One character (like the letter A) takes 1 Byte.',
  },
  speed: {
    label: 'CPU speed (×1000)',
    units: [{ u: 'Hz', f: 1 }, { u: 'KHz', f: 1e3 }, { u: 'MHz', f: 1e6 }, { u: 'GHz', f: 1e9 }],
    steps: ['×1000', '×1000', '×1000'],
    note: 'Hertz = cycles per second. A **3.2 GHz** CPU ticks 3.2 billion times a second.',
  },
};

function fmt(n) {
  if (n === 0) return '0';
  if (n >= 1e15 || n < 1e-6) return n.toExponential(2).replace('e+', ' × 10^');
  if (n < 1) return String(Number(n.toPrecision(3)));
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function units(block, el) {
  let mode = 'storage';
  el.innerHTML = `<div class="card card--pad unitsw">
    <div class="row" role="group" aria-label="Unit family">
      ${Object.entries(UNIT_SETS).map(([k, s]) => `<button class="btn unitsw__mode" type="button" aria-pressed="false" data-mode="${k}">${esc(s.label)}</button>`).join('')}
    </div>
    <div class="unitsw__ladder" aria-hidden="true"></div>
    <p class="unitsw__note"></p>
    <div class="unitsw__conv">
      <label class="unitsw__field"><span>Convert</span><input type="number" min="0" step="any" value="1" inputmode="decimal"></label>
      <label class="unitsw__field"><span>from</span><select></select></label>
    </div>
    <div class="unitsw__out" aria-live="polite"></div>
  </div>`;
  const ladder = el.querySelector('.unitsw__ladder');
  const input = el.querySelector('input');
  const select = el.querySelector('select');
  const out = el.querySelector('.unitsw__out');

  const convert = () => {
    const set = UNIT_SETS[mode];
    const from = set.units.find((x) => x.u === select.value);
    const v = Math.max(0, Number(input.value) || 0) * from.f;
    out.innerHTML = set.units.map((x) => `<div class="unitsw__cell${x.u === from.u ? ' is-from' : ''}"><span class="mono">${fmt(v / x.f)}</span><span>${x.u}</span></div>`).join('');
  };
  const setMode = (m) => {
    mode = m;
    const set = UNIT_SETS[m];
    el.querySelectorAll('.unitsw__mode').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
    ladder.innerHTML = set.units.map((x, i) => `<span class="unitsw__rung" style="animation-delay:${i * 0.1}s">${x.u}</span>${i < set.steps.length ? `<span class="unitsw__step" style="animation-delay:${i * 0.1 + 0.05}s">${set.steps[i]} →</span>` : ''}`).join('');
    el.querySelector('.unitsw__note').innerHTML = md(set.note);
    select.innerHTML = set.units.map((x) => `<option>${x.u}</option>`).join('');
    select.value = m === 'storage' ? 'GB' : 'GHz';
    convert();
  };
  el.querySelectorAll('.unitsw__mode').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  input.addEventListener('input', convert);
  select.addEventListener('change', convert);
  setMode('storage');
}

/* ---------- Wildcards: * and ? playground ---------- */

function wildcardToRegex(pattern) {
  const body = pattern.split('').map((ch) => {
    if (ch === '*') return '.*';
    if (ch === '?') return '.';
    return ch.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }).join('');
  return new RegExp(`^${body}$`, 'i');
}

function wildcard(block, el) {
  el.innerHTML = `<div class="card card--pad wild">
    <label class="wild__input"><span class="mono">Search:</span><input type="text" value="${esc(block.presets[0].p)}" spellcheck="false" autocomplete="off" aria-label="Wildcard pattern"></label>
    <div class="row wild__presets">${block.presets.map((p) => `<button class="btn" type="button" data-p="${esc(p.p)}">${esc(p.p)}</button>`).join('')}</div>
    <p class="wild__explain" aria-live="polite"></p>
    <div class="wild__files">${block.files.map((f) => `<span class="wild__file mono">${esc(f)}</span>`).join('')}</div>
  </div>`;
  const input = el.querySelector('input');
  const files = [...el.querySelectorAll('.wild__file')];
  const explain = el.querySelector('.wild__explain');
  const run = () => {
    const p = input.value.trim();
    const preset = block.presets.find((x) => x.p === p);
    let n = 0;
    files.forEach((f) => {
      const hit = p !== '' && wildcardToRegex(p).test(f.textContent);
      if (hit) n++;
      if (hit && !f.classList.contains('is-hit')) replay(f, 'is-pop');
      f.classList.toggle('is-hit', hit);
    });
    explain.innerHTML = `${preset ? md(preset.say) + ' · ' : ''}<strong>${n}</strong> match${n === 1 ? '' : 'es'}`;
    el.querySelectorAll('[data-p]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === p)));
  };
  input.addEventListener('input', run);
  el.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => { input.value = b.dataset.p; run(); }));
  run();
}

/* ---------- Backups: full vs differential vs incremental ---------- */

const BACKUP_KINDS = {
  full: {
    label: 'Full',
    days: [['F', '50 GB'], ['F', '50 GB'], ['F', '50 GB'], ['F', '50 GB'], ['F', '50 GB']],
    restore: [4],
    say: 'Copies **everything** every time. To restore you need only the **last** full backup.',
    speed: ['Backup: slowest', 'Restore: fastest'],
  },
  diff: {
    label: 'Differential',
    days: [['F', '50 GB'], ['D1', '50 MB'], ['D2', '70 MB'], ['D3', '100 MB'], ['D4', '200 MB']],
    restore: [0, 4],
    say: 'Copies what changed **since the last full** backup, so each one grows. Restore = **full + the last differential**.',
    speed: ['Backup: slower', 'Restore: faster'],
  },
  inc: {
    label: 'Incremental',
    days: [['F', '50 GB'], ['I1', '50 MB'], ['I2', '20 MB'], ['I3', '10 MB'], ['I4', '20 MB']],
    restore: [0, 1, 2, 3, 4],
    say: 'Copies what changed **since the last backup of any kind**, so each one is small. Restore = **full + every incremental**.',
    speed: ['Backup: faster', 'Restore: slower'],
  },
};
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function backup(block, el) {
  el.innerHTML = `<div class="card card--pad bk">
    <div class="row" role="group" aria-label="Backup type">${Object.entries(BACKUP_KINDS).map(([k, b]) =>
      `<button class="btn bk__mode" type="button" aria-pressed="false" data-k="${k}">${b.label}</button>`).join('')}</div>
    <div class="bk__week"></div>
    <div class="bk__out" aria-live="polite"></div>
  </div>`;
  const week = el.querySelector('.bk__week');
  const out = el.querySelector('.bk__out');
  let timers = [];
  let played = false;

  const play = (k) => {
    played = true;
    timers.forEach(clearTimeout);
    timers = [];
    const b = BACKUP_KINDS[k];
    el.querySelectorAll('.bk__mode').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.k === k)));
    week.innerHTML = DAYS.map((d, i) => `<div class="bk__day"><span class="bk__dname">${d}</span><span class="bk__box${b.days[i][0] === 'F' ? ' bk__box--full' : ''}" data-i="${i}"><strong>${b.days[i][0]}</strong><small>${b.days[i][1]}</small></span></div>`).join('')
      + '<div class="bk__day"><span class="bk__dname">Sat</span><span class="bk__crash" hidden>Crash!</span></div>';
    out.innerHTML = '';
    const boxes = [...week.querySelectorAll('.bk__box')];
    boxes.forEach((bx, i) => timers.push(setTimeout(() => bx.classList.add('is-in'), 250 + i * 280)));
    const crashAt = 250 + boxes.length * 280 + 200;
    timers.push(setTimeout(() => {
      const c = week.querySelector('.bk__crash');
      c.hidden = false;
      replay(c, 'is-pop');
    }, crashAt));
    timers.push(setTimeout(() => {
      b.restore.forEach((i) => boxes[i].classList.add('is-need'));
      boxes.forEach((bx, i) => { if (!b.restore.includes(i)) bx.classList.add('is-skip'); });
      const need = b.restore.map((i) => b.days[i][0]).join(' + ');
      out.innerHTML = `<div class="rise stack" style="gap:10px">
        <p style="font-size:18px">To restore on Saturday you need: <span class="hl mono">${need}</span></p>
        <p>${md(b.say)}</p>
        <div class="row">${b.speed.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>
      </div>`;
    }, crashAt + 600));
  };
  el.querySelectorAll('.bk__mode').forEach((x) => x.addEventListener('click', () => play(x.dataset.k)));
  whenVisible(el, () => { if (!played) play('full'); });
  out.innerHTML = '<p class="muted">Pick a backup type to watch the week play out.</p>';
}

/* ---------- Password strength meter (nothing leaves the page) ---------- */

function password(block, el) {
  const RULES = [
    { id: 'len8', label: '8+ characters', test: (p) => p.length >= 8 },
    { id: 'len15', label: '15+ characters (best)', test: (p) => p.length >= 15 },
    { id: 'upper', label: 'A capital letter', test: (p) => /[A-Z]/.test(p) },
    { id: 'lower', label: 'A small letter', test: (p) => /[a-z]/.test(p) },
    { id: 'num', label: 'A number', test: (p) => /\d/.test(p) },
    { id: 'sym', label: 'A symbol like ! $ - #', test: (p) => /[^A-Za-z0-9]/.test(p) },
    { id: 'word', label: 'No "password", 123 or birth year', test: (p) => p.length > 0 && !/pa?s+w(o|0)r?d|123|qwerty|(19|20)\d\d/i.test(p) },
  ];
  const LEVELS = [
    { min: 0, label: 'Too weak', color: 'var(--bad-line)' },
    { min: 3, label: 'Weak', color: 'var(--bad-line)' },
    { min: 5, label: 'OK', color: 'var(--sun)' },
    { min: 6, label: 'Strong', color: 'var(--accent)' },
    { min: 7, label: 'Very strong', color: 'var(--accent)' },
  ];
  el.innerHTML = `<div class="card card--pad pw">
    <div class="pw__row">
      <input class="pw__input mono" type="password" autocomplete="off" spellcheck="false" placeholder="Type a practice password" aria-label="Practice password">
      <button class="btn" type="button" data-show>Show</button>
    </div>
    <div class="pw__meter" aria-hidden="true"><span></span></div>
    <p class="pw__level" aria-live="polite">Start typing.</p>
    <ul class="pw__rules">${RULES.map((r) => `<li data-r="${r.id}"><span class="pw__tick">${ICON.check(14)}</span>${esc(r.label)}</li>`).join('')}</ul>
    <div class="row">${block.samples.map((s) => `<button class="btn" type="button" data-sample="${esc(s)}">Try <span class="mono">${esc(s)}</span></button>`).join('')}</div>
    <p class="muted" style="font-size:14px">Practice only: nothing you type is saved or sent anywhere. Don't type a real password.</p>
  </div>`;
  const input = el.querySelector('.pw__input');
  const fill = el.querySelector('.pw__meter span');
  const level = el.querySelector('.pw__level');
  const run = () => {
    const p = input.value;
    let n = 0;
    RULES.forEach((r) => {
      const ok = r.test(p);
      if (ok) n++;
      const li = el.querySelector(`[data-r="${r.id}"]`);
      if (ok && !li.classList.contains('is-ok')) replay(li, 'is-pop');
      li.classList.toggle('is-ok', ok);
    });
    const lv = p ? [...LEVELS].reverse().find((l) => n >= l.min) : null;
    fill.style.width = p ? `${(n / RULES.length) * 100}%` : '0';
    fill.style.background = lv ? lv.color : 'transparent';
    level.textContent = lv ? `${lv.label} · ${n} of ${RULES.length} checks` : 'Start typing.';
  };
  input.addEventListener('input', run);
  el.querySelector('[data-show]').addEventListener('click', (e) => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    e.currentTarget.textContent = show ? 'Hide' : 'Show';
  });
  el.querySelectorAll('[data-sample]').forEach((b) => b.addEventListener('click', () => {
    input.value = b.dataset.sample;
    input.type = 'text';
    el.querySelector('[data-show]').textContent = 'Hide';
    run();
  }));
}

/* ---------- Path: a request hopping from your device to the Internet ---------- */

function path(block, el) {
  el.innerHTML = `<div class="card card--pad hop">
    <div class="hop__row">${block.nodes.map((n, i) => `
      <button class="hop__node" type="button" data-i="${i}" aria-pressed="false"><span class="hop__dot"></span><span>${esc(n.name)}</span></button>
      ${i < block.nodes.length - 1 ? '<span class="hop__wire" aria-hidden="true"><i></i></span>' : ''}`).join('')}
    </div>
    <div class="row"><button class="btn btn--primary" type="button" data-go>${ICON.right(16)} ${esc(block.button || 'Send a request')}</button>
    <span class="muted">or tap any box</span></div>
    <p class="hop__say" aria-live="polite">${md(block.hint || '')}</p>
  </div>`;
  const nodes = [...el.querySelectorAll('.hop__node')];
  const wires = [...el.querySelectorAll('.hop__wire')];
  const say = el.querySelector('.hop__say');
  let timers = [];
  const pick = (i) => {
    nodes.forEach((n, k) => n.setAttribute('aria-pressed', String(k === i)));
    say.innerHTML = `<strong>${esc(block.nodes[i].name)}:</strong> ${md(block.nodes[i].role)}`;
    replay(say, 'rise');
  };
  nodes.forEach((n, i) => n.addEventListener('click', () => pick(i)));
  el.querySelector('[data-go]').addEventListener('click', () => {
    timers.forEach(clearTimeout);
    timers = [];
    nodes.forEach((n) => n.classList.remove('is-lit'));
    wires.forEach((w) => w.classList.remove('is-on', 'is-back'));
    const T = 420;
    nodes.forEach((n, i) => {
      timers.push(setTimeout(() => { n.classList.add('is-lit'); pick(i); if (wires[i]) wires[i].classList.add('is-on'); }, i * T));
    });
    const back = nodes.length * T + 300;
    timers.push(setTimeout(() => {
      wires.forEach((w) => { w.classList.remove('is-on'); w.classList.add('is-back'); });
      say.innerHTML = md(block.done || 'The answer travels back the same way: that\'s a **download**.');
      replay(say, 'rise');
    }, back));
    timers.push(setTimeout(() => nodes.forEach((n) => n.classList.remove('is-lit')), back + 1400));
  });
}

/* ---------- Tree: click a file to see its full path ---------- */

function tree(block, el) {
  const render = (node, trail) => {
    const here = [...trail, node.name];
    if (!node.children) {
      return `<li><button class="tree__file" type="button" data-path="${esc(JSON.stringify(here))}">${esc(node.name)}</button></li>`;
    }
    return `<li><span class="tree__folder">${esc(node.name)}</span><ul>${node.children.map((c) => render(c, here)).join('')}</ul></li>`;
  };
  el.innerHTML = `<div class="card card--pad treew">
    <div class="treew__path" aria-live="polite"><span class="muted">Tap a file to see its path.</span></div>
    <ul class="tree">${block.roots.map((r) => render(r, [])).join('')}</ul>
  </div>`;
  const out = el.querySelector('.treew__path');
  el.querySelectorAll('.tree__file').forEach((b) => b.addEventListener('click', () => {
    el.querySelectorAll('.tree__file').forEach((x) => x.classList.toggle('is-on', x === b));
    const parts = JSON.parse(b.dataset.path);
    out.innerHTML = parts.map((p, i) => `<span class="treew__seg" style="animation-delay:${i * 0.12}s">${esc(p)}</span>${i < parts.length - 1 ? '<span class="treew__sep" style="animation-delay:' + (i * 0.12 + 0.06) + 's">\\</span>' : ''}`).join('');
  }));
}

/* ---------- Sticky note ---------- */

function sticky(block, el) {
  el.innerHTML = `<div class="sticky"><strong>${esc(block.title)}</strong><span>${md(block.text)}</span></div>`;
}

/* ---------- Matrix: a 2×2 grid you reveal, then a "place it" game ---------- */

const QUADS = ['tl', 'tr', 'bl', 'br'];

function matrix(block, el) {
  const { x, y, quads } = block;
  const place = block.place || [];
  el.innerHTML = `<div class="card card--pad mx">
    <div class="mx__wrap">
      <div class="mx__y" aria-hidden="true"><span>${esc(y.hi)}</span><b>${esc(y.label)} ↑</b><span>${esc(y.lo)}</span></div>
      <div class="mx__grid" role="group" aria-label="${esc(`${y.label} against ${x.label}`)}">
        ${QUADS.map((k) => `<button class="mx__q mx__q--${quads[k].tone || 'plain'}" type="button" data-q="${k}" aria-expanded="false">
          <span class="mx__cover">?<small>tap to reveal</small></span>
          <span class="mx__face"><strong>${md(quads[k].title)}</strong>${quads[k].text ? `<span>${md(quads[k].text)}</span>` : ''}</span>
        </button>`).join('')}
      </div>
      <span></span>
      <div class="mx__x" aria-hidden="true"><span>${esc(x.lo)}</span><b>${esc(x.label)} →</b><span>${esc(x.hi)}</span></div>
    </div>
    <div class="row mx__bar">
      <button class="btn" type="button" data-all>Reveal all</button>
      ${place.length ? `<button class="btn btn--primary" type="button" data-play>${ICON.bolt(16)} Place the examples (${place.length})</button>` : ''}
    </div>
    <div class="mx__game" aria-live="polite"></div>
  </div>`;
  const qs = [...el.querySelectorAll('.mx__q')];
  const game = el.querySelector('.mx__game');
  let mode = 'reveal';
  let deck = [];
  let pos = 0;
  let score = 0;
  let locked = false;

  const open = (b) => { if (!b.classList.contains('is-open')) { b.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); } };
  el.querySelector('[data-all]').addEventListener('click', () => qs.forEach(open));

  const showItem = () => {
    qs.forEach((b) => b.classList.remove('is-right', 'is-wrong'));
    if (pos >= deck.length) {
      mode = 'reveal';
      el.querySelector('.mx').classList.remove('is-playing');
      game.innerHTML = `<div class="game-end rise"><div class="stack" style="gap:4px"><span class="feedback__title">${score === deck.length ? 'All placed!' : `${score} of ${deck.length}`}</span><span class="muted">${score === deck.length ? 'You know this matrix.' : 'Play again to lock it in.'}</span></div></div>`;
      return;
    }
    locked = false;
    game.innerHTML = `<div class="mx__ask rise"><span class="muted">${pos + 1} of ${deck.length} · tap the box where this belongs</span><strong>${md(deck[pos].text)}</strong></div>`;
  };
  const answer = (b) => {
    if (locked) return;
    locked = true;
    const item = deck[pos];
    const right = b.dataset.q === item.q;
    if (right) score++;
    const target = qs.find((qq) => qq.dataset.q === item.q);
    target.classList.add('is-right');
    if (!right) b.classList.add('is-wrong');
    const where = quads[item.q].title.replace(/\*\*/g, '');
    game.insertAdjacentHTML('beforeend', feedbackHTML(right, right ? 'Yes!' : `It goes in: ${where}`, item.why || '', pos === deck.length - 1 ? 'Finish' : 'Next'));
    if (right) burst(game.querySelector('[data-burst]'));
    const nb = game.querySelector('[data-next]');
    nb.focus({ preventScroll: true });
    nb.addEventListener('click', () => { pos++; showItem(); });
  };
  qs.forEach((b) => b.addEventListener('click', () => {
    if (mode === 'play') answer(b);
    else { b.classList.toggle('is-open'); b.setAttribute('aria-expanded', String(b.classList.contains('is-open'))); }
  }));
  const playBtn = el.querySelector('[data-play]');
  if (playBtn) playBtn.addEventListener('click', () => {
    qs.forEach(open);
    mode = 'play';
    el.querySelector('.mx').classList.add('is-playing');
    deck = shuffle(place);
    pos = 0;
    score = 0;
    showItem();
    el.querySelector('.mx__grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ---------- Funnel: conversion modelling with sliders ---------- */

function funnel(block, el) {
  const { stages, start, rates } = block;
  el.innerHTML = `<div class="card card--pad fun">
    <div class="fun__rows">
      ${stages.map((s, i) => `
        <div class="fun__stage"><span class="fun__name">${esc(s)}</span><div class="fun__track"><span class="fun__fill"></span></div><span class="fun__val mono" data-v="${i}"></span></div>
        ${i < rates.length ? `<label class="fun__rate"><span>${esc(rates[i].label)}</span><input type="range" min="1" max="100" step="1" value="${rates[i].value}" data-r="${i}" aria-label="${esc(rates[i].label)} percentage"><b class="mono" data-p="${i}"></b></label>` : ''}`).join('')}
    </div>
    <p class="fun__sum" aria-live="polite"></p>
    ${block.foot ? `<p class="muted">${md(block.foot)}</p>` : ''}
  </div>`;
  const fills = [...el.querySelectorAll('.fun__fill')];
  const inputs = [...el.querySelectorAll('input')];
  const run = () => {
    let v = start;
    const vals = [v];
    inputs.forEach((inp, i) => {
      el.querySelector(`[data-p="${i}"]`).textContent = `${inp.value}%`;
      v = v * (Number(inp.value) / 100);
      vals.push(v);
    });
    const max = Math.log10(start + 1);
    vals.forEach((val, i) => {
      el.querySelector(`[data-v="${i}"]`).textContent = Math.round(val).toLocaleString('en-GB');
      fills[i].style.width = `${Math.max(2, (Math.log10(val + 1) / max) * 100)}%`;
    });
    const overall = (vals[vals.length - 1] / start) * 100;
    el.querySelector('.fun__sum').innerHTML = `${md(block.result || 'Outcomes')}: <strong class="mono">${Math.round(vals[vals.length - 1]).toLocaleString('en-GB')}</strong> · overall conversion <strong class="mono">${overall < 1 ? overall.toFixed(2) : overall.toFixed(1)}%</strong>`;
  };
  inputs.forEach((i) => i.addEventListener('input', run));
  run();
}

/* ---------- Cycle: nodes around a loop, played in order ---------- */

function cycle(block, el) {
  const n = block.nodes.length;
  el.innerHTML = `<div class="card card--pad cyc">
    <div class="cyc__ring">
      <span class="cyc__track" aria-hidden="true"></span>
      <p class="cyc__center" aria-live="polite">${md(block.hint || 'Press play or tap a step.')}</p>
      ${block.nodes.map((nd, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        return `<button class="cyc__node" type="button" data-i="${i}" aria-pressed="false" style="left:${50 + 40 * Math.cos(a)}%;top:${50 + 40 * Math.sin(a)}%"><span class="cyc__n">${i + 1}</span>${esc(nd.name)}</button>`;
      }).join('')}
    </div>
    <div class="row"><button class="btn btn--primary" type="button" data-go>${ICON.redo(16)} Play the loop</button>${block.input ? `<span class="chip">${md(block.input)}</span>` : ''}</div>
  </div>`;
  const nodes = [...el.querySelectorAll('.cyc__node')];
  const center = el.querySelector('.cyc__center');
  let timers = [];
  const pick = (i, linkText) => {
    nodes.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    const nd = block.nodes[i];
    center.innerHTML = `<strong>${esc(nd.name)}</strong><span>${md(nd.detail)}</span>${linkText ? `<em>passes on → ${esc(linkText)}</em>` : ''}`;
    replay(center, 'rise');
  };
  nodes.forEach((b, i) => b.addEventListener('click', () => { timers.forEach(clearTimeout); pick(i, block.links?.[i]); }));
  el.querySelector('[data-go]').addEventListener('click', () => {
    timers.forEach(clearTimeout);
    timers = [];
    const steps = [...block.nodes.keys(), 0];
    steps.forEach((i, k) => timers.push(setTimeout(() => {
      pick(i, k < n ? block.links?.[i] : '');
      nodes[i].classList.remove('is-pulse'); void nodes[i].offsetWidth; nodes[i].classList.add('is-pulse');
    }, k * 1700)));
  });
}

export const WIDGETS = { explorer, flips, sort, order, bars, stack, units, wildcard, backup, password, path, tree, sticky, matrix, funnel, cycle };
