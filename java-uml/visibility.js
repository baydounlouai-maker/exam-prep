import { initPage, $, $$, esc, shuffle, highlightJava, burst, replay } from '../assets/js/common.js';
import { lessonQuiz } from '../assets/js/lesson.js';

initPage();

const TOPIC = 'java-uml';
const LESSON = 'visibility';

const SYMBOLS = [
  { sym: '+', word: 'public', who: 'Everyone', zones: ['self', 'pkg', 'sub', 'world'], note: 'public: anyone, anywhere.' },
  { sym: '-', word: 'private', who: 'Only this class', zones: ['self'], note: 'private: only code inside Account itself.' },
  { sym: '#', word: 'protected', who: 'Subclasses (+ same package)', zones: ['self', 'pkg', 'sub'], note: 'protected: Account, its subclasses, and (in Java) its package.' },
  { sym: '~', word: 'package', who: 'Same package only', zones: ['self', 'pkg'], note: 'package: same package only. Java\'s default when you write no keyword.' },
];

/* ---------- Flip cards ---------- */

$('#flips').innerHTML = SYMBOLS.map((s) => `
  <button class="flip" type="button" aria-pressed="false" aria-label="Symbol ${esc(s.sym)}. Flip to reveal.">
    <span class="flip__inner">
      <span class="flip__face"><span class="flip__sym">${esc(s.sym)}</span><span class="flip__hint">tap to flip</span></span>
      <span class="flip__face flip__face--back"><span class="flip__word">${esc(s.word)}</span><span>${esc(s.who)}</span></span>
    </span>
  </button>`).join('');

$$('.flip').forEach((card, i) => {
  card.addEventListener('click', () => {
    const on = card.getAttribute('aria-pressed') !== 'true';
    card.setAttribute('aria-pressed', String(on));
    const s = SYMBOLS[i];
    card.setAttribute('aria-label', on ? `${s.sym} means ${s.word}: ${s.who}` : `Symbol ${s.sym}. Flip to reveal.`);
  });
});

/* ---------- Access zones ---------- */

const ORDER = ['-', '~', '#', '+'];
$('#picker').innerHTML = ORDER.map((sym) => {
  const s = SYMBOLS.find((x) => x.sym === sym);
  return `<button class="btn sym-btn" type="button" aria-pressed="false" data-sym="${esc(sym)}"><span class="mono">${esc(sym)}</span>${esc(s.word)}</button>`;
}).join('');

function pickZone(sym) {
  const s = SYMBOLS.find((x) => x.sym === sym);
  $$('.sym-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sym === sym)));
  $$('[data-zone]').forEach((z) => z.classList.toggle('is-on', s.zones.includes(z.dataset.zone)));
  const symEl = $('#zone-sym');
  symEl.textContent = sym;
  symEl.classList.add('is-hl');
  replay(symEl.closest('.uml__row'), 'is-flash');
  const note = $('#zones-note');
  note.textContent = s.note;
  replay(note, 'rise');
}

$('#picker').addEventListener('click', (e) => {
  const b = e.target.closest('[data-sym]');
  if (b) pickZone(b.dataset.sym);
});
pickZone('-');

/* ---------- Speed round ---------- */

const ITEMS = [
  { java: 'private int count;', sym: '-', uml: '- count : int' },
  { java: 'public void run() { … }', sym: '+', uml: '+ run() : void' },
  { java: 'protected String id;', sym: '#', uml: '# id : String' },
  { java: 'double rate;', sym: '~', uml: '~ rate : double' },
  { java: 'public static final int MAX = 10;', sym: '+', uml: '+ MAX : int = 10', style: 'underline', extra: 'static → underlined' },
  { java: 'private List<Item> items;', sym: '-', uml: '- items : List<Item>' },
  { java: 'void reset() { … }', sym: '~', uml: '~ reset() : void' },
  { java: 'protected abstract void draw();', sym: '#', uml: '# draw() : void', style: 'italic', extra: 'abstract → italics' },
];

const sorter = $('#sorter');
const scoreChip = $('#sorter-score');
let deck = [];
let pos = 0;
let score = 0;

function startRound() {
  deck = shuffle(ITEMS);
  pos = 0;
  score = 0;
  showItem();
}

function showItem() {
  scoreChip.textContent = `${score} / ${deck.length}`;
  if (pos >= deck.length) {
    const perfect = score === deck.length;
    sorter.innerHTML = `<div class="row row--between rise" style="gap:20px">
      <div class="stack" style="gap:4px">
        <span class="feedback__title">${perfect ? 'Flawless!' : `${score} of ${deck.length}`}</span>
        <span class="muted">${perfect ? 'You know your symbols.' : 'Play again until it\'s automatic.'}</span>
      </div>
      <div class="row" style="gap:10px">
        <button class="btn" type="button" data-again>Play again</button>
        <a class="btn btn--primary" href="#check">Mini quiz</a>
      </div>
    </div>`;
    sorter.querySelector('[data-again]').addEventListener('click', startRound);
    return;
  }
  const item = deck[pos];
  sorter.innerHTML = `<div class="stack rise" style="gap:18px">
    <span class="muted">${pos + 1} of ${deck.length} · which symbol does UML use?</span>
    <div class="sorter__line">${highlightJava(item.java)}</div>
    <div class="sorter__btns">${ORDER.map((sym) => {
      const s = SYMBOLS.find((x) => x.sym === sym);
      return `<button class="btn" type="button" data-sym="${esc(sym)}" aria-label="${esc(s.word)}"><span class="mono">${esc(sym)}</span>${esc(s.word)}</button>`;
    }).join('')}</div>
    <div data-fb></div>
  </div>`;

  let locked = false;
  sorter.querySelectorAll('[data-sym]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (locked) return;
      locked = true;
      const right = btn.dataset.sym === item.sym;
      if (right) score++;
      sorter.querySelectorAll('[data-sym]').forEach((b) => {
        b.setAttribute('aria-disabled', 'true');
        if (b.dataset.sym === item.sym) b.classList.add('is-right');
        else if (b === btn) b.classList.add('is-wrong');
      });
      const umlStyle = item.style === 'underline' ? 'text-decoration:underline;text-underline-offset:3px'
        : item.style === 'italic' ? 'font-style:italic' : '';
      sorter.querySelector('[data-fb]').innerHTML = `<div class="feedback ${right ? 'is-right' : 'is-wrong'}" role="status">
        <div class="feedback__body">
          <div class="badge-icon" data-burst><strong style="font-size:22px">${right ? '✓' : '!'}</strong></div>
          <div><span class="feedback__title">${right ? 'Yes!' : 'Nope.'}</span>
          <span>In UML: <span class="uml-out" style="${umlStyle}">${esc(item.uml)}</span>${item.extra ? ` <span class="muted">(${esc(item.extra)})</span>` : ''}</span></div>
        </div>
        <button class="btn btn--primary" type="button" data-next>${pos === deck.length - 1 ? 'Finish' : 'Next'}</button>
      </div>`;
      scoreChip.textContent = `${score} / ${deck.length}`;
      if (right) burst(sorter.querySelector('[data-burst]'));
      const next = sorter.querySelector('[data-next]');
      next.focus({ preventScroll: true });
      next.addEventListener('click', () => { pos++; showItem(); });
    });
  });
}

startRound();

/* ---------- Mini quiz ---------- */

lessonQuiz(TOPIC, LESSON, [
  {
    prompt: 'A field is marked <code>~</code> in UML. Which Java line matches?',
    mono: true,
    opts: ['private int x;', 'int x;', 'protected int x;', 'public int x;'],
    answer: 1,
    why: 'No keyword = package-private = ~.',
  },
  {
    prompt: 'Which symbol lets subclasses use a member, but hides it from unrelated classes in other packages?',
    mono: true,
    opts: ['+', '-', '#', '~'],
    answer: 2,
    why: '# protected: the class, its subclasses and (in Java) its package.',
  },
  {
    prompt: 'Good OOP style: fields are usually…',
    opts: ['+ public', '- private', '# protected', '~ package'],
    answer: 1,
    why: 'Encapsulation: hide fields (-), expose methods (+).',
  },
]);
