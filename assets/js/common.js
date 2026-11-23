// Shared helpers for every page: progress, theme, icons, code highlighting, UML drawing.

const PROGRESS_KEY = 'examlab:progress:v1';
const THEME_KEY = 'examlab:theme';

/* ---------- Progress (per browser, localStorage) ---------- */

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch {
    // Private mode or storage blocked: progress just isn't remembered.
  }
}

export function markLessonDone(topic, lesson) {
  const data = loadProgress();
  const t = (data[topic] ||= {});
  (t.done ||= {})[lesson] = true;
  saveProgress(data);
}

export function isLessonDone(topic, lesson) {
  return !!loadProgress()[topic]?.done?.[lesson];
}

export function saveQuizScore(topic, pct, pass = 80, lessonId = 'quiz') {
  const data = loadProgress();
  const t = (data[topic] ||= {});
  t.quizBest = Math.max(t.quizBest || 0, pct);
  if (pct >= pass) (t.done ||= {})[lessonId] = true;
  saveProgress(data);
  return t.quizBest;
}

export function quizBest(topic) {
  return loadProgress()[topic]?.quizBest ?? null;
}

export function resetTopic(topic) {
  const data = loadProgress();
  delete data[topic];
  saveProgress(data);
}

/* ---------- Icons (inline stroke SVG) ---------- */

const svg = (d, size = 18, extra = '') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;

export const ICON = {
  right: (s) => svg('<path d="M5 12h14M13 6l6 6-6 6"/>', s),
  left: (s) => svg('<path d="M19 12H5M11 6l-6 6 6 6"/>', s),
  check: (s) => svg('<path d="M20 6 9 17l-5-5"/>', s, 'stroke-width="3"'),
  x: (s) => svg('<path d="M6 6l12 12M18 6 6 18"/>', s, 'stroke-width="3"'),
  bulb: (s) => svg('<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>', s, 'stroke-width="2"'),
  lock: (s) => svg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', s, 'stroke-width="2"'),
  bolt: (s) => svg('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>', s),
  moon: (s) => svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>', s, 'stroke-width="2"'),
  sun: (s) => svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', s, 'stroke-width="2"'),
  eye: (s) => svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', s, 'stroke-width="2"'),
  hand: (s) => svg('<path d="M9 11V5a2 2 0 0 1 4 0v6"/><path d="M13 10a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v3a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L4 15a2 2 0 0 1 3.4-2L9 15"/>', s, 'stroke-width="2"'),
  redo: (s) => svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>', s),
  flame: (s = 18) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#FFB020" stroke="#14142B" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"/></svg>`,
};

/** Fill every `<span data-icon="name" data-size="20">` with its icon. */
export function fillIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    const make = ICON[el.dataset.icon];
    if (make) el.innerHTML = make(Number(el.dataset.size) || 18);
  });
}

/** Run on every page: theme toggle + static icons. */
export function initPage() {
  initTheme();
  fillIcons();
}

/* ---------- Theme toggle ---------- */

export function initTheme() {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  const root = document.documentElement;
  const current = () =>
    root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const sync = () => {
    const dark = current() === 'dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    btn.innerHTML = dark ? ICON.sun(20) : ICON.moon(20);
  };
  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
    sync();
  });
  sync();
}

/* ---------- Small utilities ---------- */

export const $ = (sel, el = document) => el.querySelector(sel);
export const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A copy of a multiple-choice question with its options in random order. */
export function shuffleOptions(q) {
  const idx = shuffle(q.opts.map((_, i) => i));
  return { ...q, opts: idx.map((i) => q.opts[i]), answer: idx.indexOf(q.answer) };
}

/** Re-run a CSS animation on an element by toggling a class. */
export function replay(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

/** Little dot burst around an element (used for correct answers). */
export function burst(el) {
  const colors = ['#4F46E5', '#FFB020', '#FFFFFF'];
  const b = document.createElement('span');
  b.className = 'burst';
  b.setAttribute('aria-hidden', 'true');
  for (let k = 0; k < 10; k++) {
    const i = document.createElement('i');
    i.style.transform = `rotate(${k * 36}deg)`;
    i.style.setProperty('--c', colors[k % 3]);
    b.appendChild(i);
  }
  el.appendChild(b);
  setTimeout(() => b.remove(), 900);
}

/* ---------- Java highlighting ---------- */

const KEYWORDS = new Set([
  'public', 'private', 'protected', 'class', 'interface', 'extends', 'implements',
  'static', 'final', 'abstract', 'new', 'return', 'void', 'this',
]);
const PRIMITIVES = new Set(['int', 'double', 'boolean', 'char', 'long', 'float']);

export function highlightJava(src) {
  return src
    .split(/(@\w+|\b\w+\b)/)
    .map((t) => {
      if (!t) return '';
      if (t.startsWith('@')) return `<span class="tk-an">${esc(t)}</span>`;
      if (KEYWORDS.has(t)) return `<span class="tk-kw">${esc(t)}</span>`;
      if (PRIMITIVES.has(t) || /^[A-Z]/.test(t)) return `<span class="tk-ty">${esc(t)}</span>`;
      return esc(t);
    })
    .join('');
}

/** A dark code card. `lines` is an array of strings. */
export function codeBlock(lines, { file = '', numbered = false } = {}) {
  const bar = file
    ? `<div class="code__bar"><span class="code__dot"></span><span class="code__dot"></span>${esc(file)}</div>`
    : '';
  const body = numbered
    ? lines.map((l, i) => `<div class="ln" data-line="${i}"><span class="ln-no">${i + 1}</span><span>${highlightJava(l) || ' '}</span></div>`).join('')
    : lines.map((l) => highlightJava(l) || ' ').join('\n');
  return `<div class="code">${bar}<pre class="${numbered ? 'numbered' : ''}"><code>${body}</code></pre></div>`;
}

/* ---------- Multiple-choice runner (quick checks + quiz) ---------- */

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/** Markup for one question's options. `opts` may contain trusted HTML (we write them). */
export function optionsHTML(q) {
  return q.opts
    .map((o, i) => `<button class="opt" type="button" data-opt="${i}"><span class="opt__letter">${LETTERS[i]}</span><span class="opt__text${q.mono ? ' mono' : ''}">${o}</span></button>`)
    .join('');
}

/**
 * Wire answer buttons inside `root`. Calls onAnswer(isRight) once; returns nothing.
 * Marks right / wrong / dimmed options and appends the check or cross icon.
 */
export function wireOptions(root, q, onAnswer) {
  const buttons = [...root.querySelectorAll('.opt')];
  let locked = false;
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (locked) return;
      locked = true;
      const pick = Number(btn.dataset.opt);
      const right = pick === q.answer;
      buttons.forEach((b, i) => {
        b.setAttribute('aria-disabled', 'true');
        if (i === q.answer) {
          b.classList.add('is-right');
          b.insertAdjacentHTML('beforeend', `<span class="opt__mark" role="img" aria-label="Correct answer">${ICON.check(24)}</span>`);
        } else if (i === pick) {
          b.classList.add('is-wrong');
          b.insertAdjacentHTML('beforeend', `<span class="opt__mark" role="img" aria-label="Your answer, incorrect">${ICON.x(24)}</span>`);
        } else {
          b.classList.add('is-dim');
        }
      });
      onAnswer(right, pick);
    });
  });
}

/** Feedback strip shown after answering. */
export function feedbackHTML(right, title, why, buttonLabel) {
  return `<div class="feedback ${right ? 'is-right' : 'is-wrong'}" role="status">
    <div class="feedback__body">
      <div class="badge-icon" data-burst>${right ? ICON.check(22) : '<strong style="font-size:22px">!</strong>'}</div>
      <div><span class="feedback__title">${esc(title)}</span><span>${esc(why)}</span></div>
    </div>
    ${buttonLabel ? `<button class="btn btn--primary" type="button" data-next>${esc(buttonLabel)}</button>` : ''}
  </div>`;
}

/**
 * A short sequence of multiple-choice questions inside `root`.
 * q = { prompt, code?, opts[], answer, why, mono? }. onFinish(correct, total) returns end-screen HTML.
 */
export function runCheck(root, questions, { onProgress = () => {}, onFinish }) {
  let i = 0;
  let correct = 0;
  const show = () => {
    onProgress(i, questions.length);
    if (i >= questions.length) {
      root.innerHTML = `<div class="rise">${onFinish(correct, questions.length)}</div>`;
      fillIcons(root);
      return;
    }
    const q = shuffleOptions(questions[i]);
    root.innerHTML = `<div class="stack rise" style="gap:18px">
      <p style="font-size:19px;font-weight:600">${q.prompt}</p>
      ${q.code ? codeBlock(q.code) : ''}
      <div class="opts">${optionsHTML(q)}</div>
      <div data-fb></div>
    </div>`;
    wireOptions(root, q, (right) => {
      if (right) correct++;
      const last = i === questions.length - 1;
      root.querySelector('[data-fb]').innerHTML = feedbackHTML(right, right ? 'Nice one!' : 'Not quite.', q.why, last ? 'Finish' : 'Next');
      if (right) burst(root.querySelector('[data-burst]'));
      const next = root.querySelector('[data-next]');
      next.focus({ preventScroll: true });
      next.addEventListener('click', () => { i++; show(); });
    });
  };
  show();
}

/* ---------- UML drawing ---------- */

/**
 * A relationship line in a 400×60 box. Left end = source / whole, right end = target / parent.
 * end: 'open' | 'triangle' | 'diamond-hollow' | 'diamond-filled'
 */
export function arrowSVG(end, { dashed = false, mini = false, animate = true } = {}) {
  const diamond = end.startsWith('diamond');
  const x1 = diamond ? 42 : 6;
  const x2 = end === 'triangle' ? 368 : diamond ? 394 : 392;
  const sw = mini ? 7 : 3;
  const dash = dashed ? (mini ? '22 16' : '9 7') : 'none';
  const a = (cls) => (animate ? ` class="${cls}"` : '');
  let head = '';
  if (end === 'open') {
    head = `<polyline${a('anim-head')} points="${mini ? '368,10 394,30 368,50' : '372,15 395,30 372,45'}" fill="none" stroke-width="${sw}"/>`;
  } else if (end === 'triangle') {
    head = `<polygon class="hollow${animate ? ' anim-head' : ''}" points="${mini ? '362,8 396,30 362,52' : '368,13 396,30 368,47'}" stroke-width="${sw}"/>`;
  } else {
    const fill = end === 'diamond-filled' ? 'solid' : 'hollow';
    head = `<polygon class="${fill}${animate ? ' anim-dia' : ''}" points="${mini ? '4,30 23,14 42,30 23,46' : '4,30 23,19 42,30 23,41'}" stroke-width="${sw}"/>`;
  }
  return `<svg class="arrow" viewBox="0 0 400 60" aria-hidden="true" focusable="false"><line${a('anim-line')} x1="${x1}" y1="30" x2="${x2}" y2="30" stroke-width="${sw}" stroke-dasharray="${dash}"/>${head}</svg>`;
}

/** A small class box with just a name (and optional «stereotype»). */
export function miniClass(name, stereo = '') {
  return `<div class="uml uml--box"><div class="uml__name">${stereo ? `<span class="uml__stereo">${esc(stereo)}</span>` : ''}<span>${esc(name)}</span></div><div class="uml__sec uml__sec--empty"></div></div>`;
}

/** Two classes joined by a relationship. `word` floats above the line; `mult` = [left, right]. */
export function stageHTML(rel, { left, right, stereo = '', word = '', mult = null } = {}) {
  const wordHTML = word ? `<div class="stage__word"><span>${esc(word)}</span></div>` : '';
  const multHTML = mult
    ? `<span class="mult mult--l">${esc(mult[0])}</span><span class="mult mult--r">${esc(mult[1])}</span>`
    : '';
  return `<div class="stage">
    ${miniClass(left)}
    <div class="stage__link">${wordHTML}${arrowSVG(rel.end, { dashed: rel.dashed })}${multHTML}</div>
    ${miniClass(right, stereo)}
  </div>`;
}

/* ---------- The six relationships (shared by lessons and quiz) ---------- */

export const RELATIONSHIPS = [
  {
    id: 'association', name: 'Association', end: 'open', dashed: false,
    left: 'Teacher', right: 'Course',
    say: ['A Teacher ', 'knows', ' their Courses.'],
    line: 'Solid', head: 'Open arrow (optional)',
    hint: 'A field that points to another class.',
    code: ['class Teacher {', '    private List<Course> courses;', '}'],
    mult: ['1', '0..*'],
  },
  {
    id: 'inheritance', name: 'Inheritance', end: 'triangle', dashed: false,
    left: 'Dog', right: 'Animal',
    say: ['A Dog ', 'is an', ' Animal.'],
    line: 'Solid', head: 'Hollow triangle at the parent',
    hint: 'extends = solid line, triangle points at the parent.',
    code: ['class Dog extends Animal {', '    @Override', '    void speak() { … }', '}'],
  },
  {
    id: 'realization', name: 'Realization', end: 'triangle', dashed: true,
    left: 'Duck', right: 'Flyable', stereo: '«interface»',
    say: ['A Duck ', 'can do', ' what Flyable promises.'],
    line: 'Dashed', head: 'Hollow triangle at the interface',
    hint: 'implements = the dashed twin of inheritance.',
    code: ['interface Flyable { void fly(); }', '', 'class Duck implements Flyable {', '    public void fly() { … }', '}'],
  },
  {
    id: 'dependency', name: 'Dependency', end: 'open', dashed: true,
    left: 'Printer', right: 'Document',
    say: ['A Printer ', 'uses', ' a Document, briefly.'],
    line: 'Dashed', head: 'Open arrow',
    hint: 'Only a parameter or local variable. No field.',
    code: ['class Printer {', '    void print(Document d) { … }', '}'],
  },
  {
    id: 'aggregation', name: 'Aggregation', end: 'diamond-hollow', dashed: false,
    left: 'Team', right: 'Player',
    say: ['A Team ', 'has', ' Players who can exist alone.'],
    line: 'Solid', head: 'Hollow diamond at the whole',
    hint: 'Parts are passed in, so they outlive the whole.',
    code: ['class Team {', '    private List<Player> players;', '    Team(List<Player> p) { players = p; }', '}'],
    mult: ['0..1', '*'],
  },
  {
    id: 'composition', name: 'Composition', end: 'diamond-filled', dashed: false,
    left: 'House', right: 'Room',
    say: ['A House ', 'owns', ' its Rooms. No house, no rooms.'],
    line: 'Solid', head: 'Filled diamond at the whole',
    hint: 'Parts are created inside, so they die with the whole.',
    code: ['class House {', '    private final List<Room> rooms = new ArrayList<>();', '    House() { rooms.add(new Room()); }', '}'],
    mult: ['1', '1..*'],
  },
];

export const relById = (id) => RELATIONSHIPS.find((r) => r.id === id);
