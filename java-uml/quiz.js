import {
  initPage, $, esc, shuffle, burst, ICON, codeBlock, stageHTML, relById,
  optionsHTML, wireOptions, feedbackHTML, saveQuizScore, fillIcons,
} from '../assets/js/common.js';

initPage();

const TOPIC = 'java-uml';
const PASS = 80;

// dia: draw a relationship between two classes. code: show Java. Otherwise text only.
const QUESTIONS = [
  { prompt: 'Which relationship is this?', dia: { rel: 'inheritance', left: 'Cat', right: 'Animal' },
    opts: ['Association', 'Inheritance', 'Realization', 'Dependency'], answer: 1,
    why: 'Solid line + hollow triangle = extends.' },
  { prompt: 'Car builds its own Engine. Which relationship?',
    code: ['class Car {', '    private final Engine engine = new Engine();', '}'],
    opts: ['Aggregation', 'Composition', 'Dependency', 'Realization'], answer: 1,
    why: 'Created inside and dies with the Car: composition (filled diamond).' },
  { prompt: 'Which relationship is this?', dia: { rel: 'realization', left: 'Robot', right: 'Movable', stereo: '«interface»' },
    opts: ['Inheritance', 'Dependency', 'Realization', 'Aggregation'], answer: 2,
    why: 'Dashed line + hollow triangle = implements an interface.' },
  { prompt: 'In a class box, what does <code># balance : double</code> mean?',
    opts: ['A public field', 'A private field', 'A protected field', 'A package field'], answer: 2,
    why: '# = protected: the class and its subclasses (plus the same package in Java).' },
  { prompt: 'Which relationship is this?', dia: { rel: 'aggregation', left: 'Library', right: 'Book' },
    opts: ['Composition', 'Association', 'Aggregation', 'Inheritance'], answer: 2,
    why: 'Hollow diamond: a Library has Books, but Books can exist alone.' },
  { prompt: 'Which relationship is this?', dia: { rel: 'dependency', left: 'Report', right: 'Printer' },
    opts: ['Association', 'Dependency', 'Realization', 'Composition'], answer: 1,
    why: 'Dashed line + open arrow: uses it briefly (a parameter or local variable).' },
  { prompt: 'Customer keeps a reference to an Address that lives elsewhere. Simplest correct line?',
    code: ['class Customer {', '    private Address address;', '}'],
    opts: ['Association', 'Dependency', 'Composition', 'Realization'], answer: 0,
    why: 'A field pointing to another class = association.' },
  { prompt: 'How is a <em>static</em> method shown in a class box?',
    opts: ['In italics', 'Underlined', 'With «static» above it', 'With a $ sign'], answer: 1,
    why: 'static = underlined. Italics mean abstract.' },
  { prompt: 'Which multiplicity means "one or more"?', mono: true,
    opts: ['0..1', '1', '1..*', '*'], answer: 2,
    why: '1..* = at least one, no upper limit.' },
  { prompt: 'Write this method in UML:', code: ['public List<String> getTags() { … }'], mono: true,
    opts: ['+ getTags() : List&lt;String&gt;', '+ List&lt;String&gt; getTags()', '- getTags() : List&lt;String&gt;', 'getTags() + List&lt;String&gt;'], answer: 0,
    why: 'Visibility, name(params), then : ReturnType.' },
];

const quiz = $('#quiz');
let order = [];
let i = 0;
let score = 0;
let streak = 0;
let correct = 0;
let wrong = [];

function setHeader(answered = false) {
  const total = order.length;
  const done = i >= total;
  $('#counter').textContent = done ? 'Done!' : `Question ${i + 1} of ${total}`;
  const pct = done ? 100 : Math.round(((i + (answered ? 1 : 0)) / total) * 100);
  $('#bar span').style.width = pct + '%';
  $('#bar').setAttribute('aria-valuenow', String(pct));
  $('#score').textContent = `${score} pts`;
  const s = $('#streak');
  s.innerHTML = `${ICON.flame(18)} ${streak}`;
  s.setAttribute('aria-label', `Streak: ${streak}`);
  s.classList.toggle('is-hot', streak >= 2);
}

function start() {
  order = shuffle(QUESTIONS);
  i = 0; score = 0; streak = 0; correct = 0; wrong = [];
  show();
}

function show() {
  setHeader();
  if (i >= order.length) return results();
  const q = order[i];
  let media = '';
  if (q.dia) {
    const rel = relById(q.dia.rel);
    media = `<div class="diagram" role="img" aria-label="Diagram: ${esc(q.dia.left)} connected to ${esc(q.dia.right)}">${stageHTML(rel, q.dia)}</div>`;
  } else if (q.code) {
    media = codeBlock(q.code);
  }
  quiz.innerHTML = `<div class="card card--pad qcard rise">
    <h1 class="qtitle">${q.prompt}</h1>
    ${media}
    <div class="opts">${optionsHTML(q)}</div>
    <div data-fb></div>
  </div>`;

  wireOptions(quiz, q, (right) => {
    if (right) {
      correct++;
      score += 10 + streak * 5;
      streak++;
    } else {
      streak = 0;
      wrong.push(q);
    }
    setHeader(true);
    const last = i === order.length - 1;
    const title = right ? (streak >= 3 ? `On fire! ${streak} in a row.` : 'Nice one!') : 'Not quite.';
    const fb = quiz.querySelector('[data-fb]');
    fb.innerHTML = feedbackHTML(right, title, q.why, last ? 'See results' : 'Next question');
    if (right) burst(fb.querySelector('[data-burst]'));
    const next = fb.querySelector('[data-next]');
    next.focus({ preventScroll: true });
    next.addEventListener('click', () => { i++; show(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  });
}

function results() {
  const total = order.length;
  const pct = Math.round((correct / total) * 100);
  const best = saveQuizScore(TOPIC, pct);
  const passed = pct >= PASS;
  quiz.innerHTML = `<div class="card card--pad results rise">
    <div class="ring" role="img" aria-label="Score: ${correct} of ${total}" style="background:conic-gradient(var(--accent) ${pct}%, var(--tint) 0)">
      <div class="ring__inner">${correct}/${total}</div>
    </div>
    <h1 class="qtitle">${passed ? 'Topic cleared!' : 'Almost there. Review and retry.'}</h1>
    <p class="muted">${score} pts · best score ${best}%${passed ? '' : ` · you need ${PASS}%`}</p>
    ${wrong.length ? `<div class="mistakes"><strong>Review these:</strong>${wrong.map((q) =>
      `<div class="mistake"><strong>${q.opts[q.answer]}</strong> · ${esc(q.why)}</div>`).join('')}</div>` : ''}
    <div class="row" style="justify-content:center;gap:12px">
      <button class="btn btn--primary" type="button" id="again"><span data-icon="redo"></span> Try again</button>
      <a class="btn" href="relationships.html">Review arrows</a>
      <a class="btn btn--ghost" href="../index.html#topics">All topics</a>
    </div>
  </div>`;
  fillIcons(quiz);
  if (passed) burst(quiz.querySelector('.ring'));
  $('#again').addEventListener('click', start);
}

start();
