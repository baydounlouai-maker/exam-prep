import { initPage, $, $$, esc, arrowSVG, stageHTML, codeBlock, ICON, RELATIONSHIPS, relById } from '../assets/js/common.js';
import { lessonQuiz } from '../assets/js/lesson.js';

initPage();

const TOPIC = 'java-uml';
const LESSON = 'relationships';

const seen = new Set();
let current = relById(location.hash.slice(1)) ? location.hash.slice(1) : 'inheritance';
let showMult = false;

$('#picker').innerHTML = RELATIONSHIPS.map((r) => `
  <button class="rel-chip" type="button" role="tab" aria-selected="false" aria-controls="stage" data-rel="${r.id}">
    ${arrowSVG(r.end, { dashed: r.dashed, mini: true, animate: false })}
    ${esc(r.name)}
    <span class="rel-chip__seen" hidden>${ICON.check(14)}</span>
  </button>`).join('');

function render() {
  const r = relById(current);
  seen.add(current);

  $$('.rel-chip').forEach((c) => {
    c.setAttribute('aria-selected', String(c.dataset.rel === current));
    c.querySelector('.rel-chip__seen').hidden = !seen.has(c.dataset.rel) || c.dataset.rel === current;
  });
  $('#seen-chip').textContent = seen.size === RELATIONSHIPS.length ? 'Seen all 6 ✓' : `Seen ${seen.size} / ${RELATIONSHIPS.length}`;

  const multNote = showMult && !r.mult
    ? '<span class="muted" style="margin-top:-14px">No multiplicity on this arrow: it links types, not objects.</span>'
    : '';

  $('#stage').innerHTML = `
    <div class="stack rise" style="gap:22px">
      <div class="card stage-card">
        <div role="img" aria-label="${esc(r.name)}: ${esc(r.left)} to ${esc(r.right)}, ${esc(r.line.toLowerCase())} line, ${esc(r.head.toLowerCase())}">
          ${stageHTML(r, { left: r.left, right: r.right, stereo: r.stereo, word: r.say[1], mult: showMult ? r.mult : null })}
        </div>
        <div class="row row--between">
          <p class="say">${esc(r.say[0])}<span class="hl">${esc(r.say[1])}</span>${esc(r.say[2])}</p>
          <button class="switch" type="button" role="switch" aria-checked="${showMult}" id="mult-switch">
            <span class="switch__track"><span class="switch__knob"></span></span>
            Show multiplicity
          </button>
        </div>
        ${multNote}
      </div>
      <div class="facts">
        ${codeBlock(r.code, { file: 'In Java' })}
        <div class="panel">
          <h3 style="font-size:20px">How to draw it</h3>
          <div class="fact"><span class="fact__k">Line</span><span>${esc(r.line)}</span></div>
          <div class="fact"><span class="fact__k">End</span><span>${esc(r.head)}</span></div>
          <div class="fact"><span class="fact__k">Hint</span><span>${esc(r.hint)}</span></div>
        </div>
      </div>
    </div>`;

  $('#mult-switch').addEventListener('click', () => {
    showMult = !showMult;
    render();
    $('#mult-switch').focus();
  });
}

$('#picker').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-rel]');
  if (!chip) return;
  current = chip.dataset.rel;
  history.replaceState(null, '', '#' + current);
  render();
});

// Arrow keys move between chips, like a real tab list.
$('#picker').addEventListener('keydown', (e) => {
  if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
  const ids = RELATIONSHIPS.map((r) => r.id);
  const i = ids.indexOf(current);
  current = ids[(i + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length];
  render();
  $(`[data-rel="${current}"]`).focus();
  e.preventDefault();
});

render();

/* ---------- Mini quiz ---------- */

lessonQuiz(TOPIC, LESSON, [
  {
    prompt: 'A dashed line with a hollow triangle means the class…',
    opts: ['extends a class', 'implements an interface', 'uses something briefly', 'owns its parts'],
    answer: 1,
    why: 'Dashed + triangle = realization = implements.',
  },
  {
    prompt: 'Items are created inside the Order and die with it. Which relationship?',
    code: ['class Order {', '    private final List<Item> items = new ArrayList<>();', '    void add(String name) { items.add(new Item(name)); }', '}'],
    opts: ['Aggregation', 'Composition', 'Association', 'Dependency'],
    answer: 1,
    why: 'The whole creates and owns the parts: composition, filled diamond.',
  },
  {
    prompt: 'Where does the diamond go?',
    opts: ['At the part', 'At the whole', 'In the middle of the line', 'Either end, it doesn\'t matter'],
    answer: 1,
    why: 'Always at the whole (the "has" side).',
  },
]);
