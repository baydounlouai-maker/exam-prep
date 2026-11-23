import { initPage, $, $$, esc, burst, replay, miniClass, feedbackHTML } from '../assets/js/common.js';
import { lessonQuiz } from '../assets/js/lesson.js';

initPage();

const TOPIC = 'java-uml';
const LESSON = 'multiplicity';

/* ---------- Value explorer ---------- */

// pips: s = solid (definitely there), m = maybe (optional), f = faded solid, '…' = and so on
const VALUES = [
  { v: '1', title: 'Exactly one', desc: 'Always there. Never missing, never two.', pips: ['s'] },
  { v: '0..1', title: 'Zero or one', desc: 'Optional. Like a middle name.', pips: ['m'] },
  { v: '*', title: 'Any number', desc: 'Zero, one or lots. Same as 0..*.', pips: ['m', 'f', 'f', '…'] },
  { v: '1..*', title: 'One or more', desc: 'At least one, no upper limit.', pips: ['s', 'f', 'f', '…'] },
  { v: '2..4', title: 'A range', desc: 'Between 2 and 4. Any n..m works the same way.', pips: ['s', 's', 'm', 'm'] },
];

$('#mchips').innerHTML = VALUES.map((x) =>
  `<button class="btn mchip" type="button" aria-pressed="false" data-v="${esc(x.v)}" aria-label="${esc(x.v)}: ${esc(x.title)}">${esc(x.v)}</button>`
).join('');

function showValue(v) {
  const x = VALUES.find((y) => y.v === v);
  $$('.mchip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
  const pips = x.pips.map((p, i) => {
    const delay = `style="animation-delay:${i * 0.12}s"`;
    if (p === '…') return `<span class="pips__more" ${delay}>…</span>`;
    const cls = p === 'm' ? 'pip pip--maybe' : p === 'f' ? 'pip pip--fade' : 'pip';
    return `<span class="${cls}" ${delay}></span>`;
  }).join('');
  $('#meaning').innerHTML = `
    <div class="meaning__big rise">${esc(x.v)}</div>
    <div class="meaning__text rise rise-1">
      <h3>${esc(x.title)}</h3>
      <p class="muted" style="font-size:18px">${esc(x.desc)}</p>
      <div class="pips" aria-hidden="true">${pips}</div>
    </div>`;
}

$('#mchips').addEventListener('click', (e) => {
  const b = e.target.closest('[data-v]');
  if (b) showValue(b.dataset.v);
});
showValue('1');

/* ---------- Reading direction ---------- */

function read(dir) {
  const right = dir === 'right';
  $('#m-right').classList.toggle('is-on', right);
  $('#m-left').classList.toggle('is-on', !right);
  const t = $('#traveller');
  t.classList.remove('go-right', 'go-left');
  void t.offsetWidth;
  t.classList.add(right ? 'go-right' : 'go-left');
  const s = $('#reader-sentence');
  s.innerHTML = right
    ? 'One Person owns <span class="hl">0..*</span> Cars.'
    : 'Each Car belongs to <span class="hl">exactly 1</span> Person.';
  replay(s, 'rise');
}
$('#read-right').addEventListener('click', () => read('right'));
$('#read-left').addEventListener('click', () => read('left'));
read('right');

/* ---------- Puzzles ---------- */

const OPTIONS = ['1', '0..1', '*', '1..*'];
const PUZZLES = [
  { left: 'Person', right: 'Passport', answer: ['1', '0..1'], why: 'A person has 0..1 passports. Each passport belongs to exactly 1 person.' },
  { left: 'Order', right: 'OrderLine', answer: ['1', '1..*'], why: 'An order has at least one line. Each line sits in exactly 1 order.' },
  { left: 'Student', right: 'Course', answer: ['*', '*'], why: 'Many students per course, many courses per student.' },
];

const puzzle = $('#puzzle');
let pi = 0;
let solved = 0;

function showPuzzle() {
  $('#puzzle-count').textContent = pi < PUZZLES.length ? `${pi + 1} / ${PUZZLES.length}` : `${solved} / ${PUZZLES.length}`;
  if (pi >= PUZZLES.length) {
    puzzle.innerHTML = `<div class="row row--between rise" style="gap:20px">
      <div class="stack" style="gap:4px">
        <span class="feedback__title">${solved === PUZZLES.length ? 'All three, first try!' : `${solved} of ${PUZZLES.length} first try`}</span>
        <span class="muted">Remember: the number counts the class it sits next to.</span>
      </div>
      <div class="row" style="gap:10px">
        <button class="btn" type="button" data-again>Again</button>
        <a class="btn btn--primary" href="#check">Mini quiz</a>
      </div>
    </div>`;
    puzzle.querySelector('[data-again]').addEventListener('click', () => { pi = 0; solved = 0; showPuzzle(); });
    return;
  }
  const p = PUZZLES[pi];
  const picks = [null, null];
  const segHTML = (side) => `<div class="seg" role="group" aria-label="Multiplicity next to ${esc(side === 0 ? p.left : p.right)}">
    ${OPTIONS.map((o) => `<button class="btn" type="button" aria-pressed="false" data-side="${side}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;

  puzzle.innerHTML = `<div class="stack rise" style="gap:30px">
    <div class="stage" role="img" aria-label="${esc(p.left)} associated with ${esc(p.right)}">
      ${miniClass(p.left)}
      <div class="stage__link">
        <svg class="arrow" viewBox="0 0 400 60" aria-hidden="true"><line class="anim-line" x1="6" y1="30" x2="394" y2="30" stroke-width="3"></line></svg>
        <span class="mult mult--l" data-label="0">?</span>
        <span class="mult mult--r" data-label="1">?</span>
      </div>
      ${miniClass(p.right)}
    </div>
    <div class="ends">
      <div class="end"><span class="end__label">Next to ${esc(p.left)}: how many ${esc(p.left)}s per ${esc(p.right)}?</span>${segHTML(0)}</div>
      <div class="end"><span class="end__label">Next to ${esc(p.right)}: how many ${esc(p.right)}s per ${esc(p.left)}?</span>${segHTML(1)}</div>
    </div>
    <div class="row"><button class="btn btn--primary" type="button" data-check disabled>Check</button></div>
    <div data-fb></div>
  </div>`;

  const check = puzzle.querySelector('[data-check]');
  let firstTry = true;

  puzzle.querySelectorAll('[data-side]').forEach((b) => {
    b.addEventListener('click', () => {
      const side = Number(b.dataset.side);
      picks[side] = b.dataset.v;
      puzzle.querySelectorAll(`[data-side="${side}"]`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const label = puzzle.querySelector(`[data-label="${side}"]`);
      label.textContent = b.dataset.v;
      label.classList.remove('is-right', 'is-wrong');
      check.disabled = picks.includes(null);
      puzzle.querySelector('[data-fb]').innerHTML = '';
    });
  });

  check.addEventListener('click', () => {
    const ok = picks.map((v, i) => v === p.answer[i]);
    ok.forEach((good, i) => {
      const label = puzzle.querySelector(`[data-label="${i}"]`);
      label.classList.remove('is-right', 'is-wrong');
      void label.offsetWidth;
      label.classList.add(good ? 'is-right' : 'is-wrong');
    });
    const right = ok.every(Boolean);
    if (right && firstTry) solved++;
    if (!right) firstTry = false;
    const fb = puzzle.querySelector('[data-fb]');
    fb.innerHTML = right
      ? feedbackHTML(true, 'Spot on!', p.why, pi === PUZZLES.length - 1 ? 'Finish' : 'Next pair')
      : feedbackHTML(false, 'Not yet.', 'Fix the red end and check again. Tip: ask "how many of THIS class?"', '');
    if (right) {
      burst(fb.querySelector('[data-burst]'));
      check.disabled = true;
      puzzle.querySelectorAll('[data-side]').forEach((x) => { x.disabled = true; });
      const next = fb.querySelector('[data-next]');
      next.focus({ preventScroll: true });
      next.addEventListener('click', () => { pi++; showPuzzle(); });
    }
  });
}

showPuzzle();

/* ---------- Mini quiz ---------- */

lessonQuiz(TOPIC, LESSON, [
  {
    prompt: 'What does <code>0..1</code> mean?',
    opts: ['Exactly one', 'Zero or one (optional)', 'Zero to many', 'At least one'],
    answer: 1,
    why: '0..1 = optional: there may be one, or none.',
  },
  {
    prompt: '<code>Library 1 ——— * Book</code>. How many libraries does one book belong to?',
    opts: ['Exactly 1', 'Zero or more', 'At least 1', 'Can\'t tell'],
    answer: 0,
    why: 'Read the number next to Library: 1.',
  },
  {
    prompt: 'A Playlist has this field. Which multiplicity goes at the Song end?',
    code: ['class Playlist {', '    private List<Song> songs;', '}'],
    mono: true,
    opts: ['1', '0..1', '*', '1..1'],
    answer: 2,
    why: 'A List can hold any number of songs, even zero: *.',
  },
]);
