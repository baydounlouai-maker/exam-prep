// Case-study final: read a fictional case, then work through exam-style tasks.

import {
  initPage, $, esc, ICON, burst, shuffleOptions, optionsHTML, wireOptions, feedbackHTML, saveQuizScore, fillIcons,
} from '../assets/js/common.js';
import { CASES } from './data/cases.js';
import { LESSONS } from './data/index.js';

initPage();

const EXAM_MINUTES = 40;
const PASS = 60;

let chosen = null;
let examMode = false;
let current = null;  // the case being worked on
let results = [];    // { score, max } per task
let ti = 0;          // task index
let timerId = 0;
let deadline = 0;
let briefListener = null; // the evidence task's click handler on the brief

const roundHalf = (n) => Math.round(n * 2) / 2;

/* ---------- Picker ---------- */

$('#picks').innerHTML = CASES.map((c) => {
  const marks = c.tasks.reduce((a, t) => a + t.marks, 0);
  return `<button class="pick" type="button" aria-pressed="false" data-id="${c.id}">
    <span class="tag">${esc(c.sector)}</span>
    <span class="pick__name">${esc(c.name)}</span>
    <span class="muted">${esc(c.tagline)}</span>
    <span class="muted" style="font-size:14px">${c.tasks.length} tasks · ${marks} marks</span>
  </button>`;
}).join('');

$('#picks').addEventListener('click', (e) => {
  const b = e.target.closest('[data-id]');
  if (!b) return;
  chosen = b.dataset.id;
  $('#picks').querySelectorAll('.pick').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  $('#start').disabled = false;
});
$('#examMode').addEventListener('click', (e) => {
  examMode = !examMode;
  e.currentTarget.setAttribute('aria-checked', String(examMode));
});
$('#start').addEventListener('click', () => startCase(chosen));

/* ---------- Case ---------- */

function startCase(id) {
  current = CASES.find((c) => c.id === id);
  results = current.tasks.map((t) => ({ score: null, max: t.marks }));
  ti = 0;
  $('#pick').hidden = true;
  $('#results').hidden = true;
  $('#exam').hidden = false;
  renderBrief();
  showTask();
  updateMarks();
  clearInterval(timerId);
  const timer = $('#timer');
  timer.hidden = !examMode;
  timer.classList.remove('is-late');
  if (examMode) {
    deadline = Date.now() + EXAM_MINUTES * 60000;
    const tick = () => {
      const left = Math.round((deadline - Date.now()) / 1000);
      if (left <= 0) {
        timer.textContent = 'Time\'s up';
        timer.classList.add('is-late');
        clearInterval(timerId);
        return;
      }
      timer.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')} left`;
    };
    tick();
    timerId = setInterval(tick, 1000);
  }
  window.scrollTo({ top: 0 });
}

function renderBrief() {
  $('#brief').innerHTML = `<details open>
    <summary><span>Case: ${esc(current.name)}</span><span class="brief__tag">${esc(current.sector)}</span></summary>
    ${current.brief.map((sec) => `<h3>${esc(sec.h)}</h3><p>${sec.s.map((s) => `<button class="sent" type="button" data-sid="${s.id}" disabled>${esc(s.t)}</button>`).join(' ')}</p>`).join('')}
  </details>`;
}

function updateMarks() {
  const got = results.reduce((a, r) => a + (r.score || 0), 0);
  const max = results.reduce((a, r) => a + r.max, 0);
  const m = $('#marks');
  m.hidden = false;
  m.textContent = `${got} / ${max} marks`;
}

function taskHead(t) {
  return `<div class="task__meta">
      <span class="chip">Task ${ti + 1} of ${current.tasks.length}</span>
      <span class="tag">${esc(t.model)}</span>
      <span class="muted" style="font-size:14px">${t.marks} mark${t.marks === 1 ? '' : 's'}</span>
    </div>
    <div class="dots" aria-hidden="true">${current.tasks.map((_, i) => `<span class="${i === ti ? 'is-on' : results[i].score !== null ? 'is-past' : ''}"></span>`).join('')}</div>
    <p class="task__q">${esc(t.prompt)}</p>`;
}

function navHTML(done) {
  const last = ti === current.tasks.length - 1;
  return `<div class="task__nav">
    <button class="btn btn--ghost" type="button" data-skip ${done ? 'hidden' : ''}>Skip (0 marks)</button>
    <span></span>
    <button class="btn btn--primary" type="button" data-next ${done ? '' : 'hidden'}>${last ? 'See results' : 'Next task'} ${ICON.right(16)}</button>
  </div>`;
}

function wireNav(el) {
  el.querySelector('[data-skip]').addEventListener('click', () => { record(0); go(); });
  el.querySelector('[data-next]').addEventListener('click', go);
}
function showNext(el) {
  el.querySelector('[data-skip]').hidden = true;
  const n = el.querySelector('[data-next]');
  n.hidden = false;
  n.focus({ preventScroll: true });
}
function record(score) {
  results[ti].score = score;
  updateMarks();
}
function go() {
  if (ti < current.tasks.length - 1) { ti++; showTask(); $('#task').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  else finish();
}

function setPicking(on) {
  const brief = $('#brief');
  if (!on && briefListener) { brief.removeEventListener('click', briefListener); briefListener = null; }
  brief.classList.toggle('is-picking', on);
  brief.querySelectorAll('.sent').forEach((s) => {
    s.disabled = !on;
    s.setAttribute('aria-pressed', 'false');
    s.classList.remove('is-hit', 'is-miss', 'is-bad');
  });
}

function showTask() {
  const t = current.tasks[ti];
  const el = $('#task');
  setPicking(false);
  if (t.type === 'mcq') mcqTask(t, el);
  else if (t.type === 'evidence') evidenceTask(t, el);
  else if (t.type === 'sort') sortTask(t, el);
  else writtenTask(t, el);
  fillIcons(el);
}

/* ---------- Task types ---------- */

function mcqTask(t, el) {
  const q = shuffleOptions(t);
  el.innerHTML = `${taskHead(t)}<div class="opts" style="grid-template-columns:1fr">${optionsHTML(q)}</div><div data-fb></div>${navHTML(false)}`;
  wireNav(el);
  wireOptions(el, q, (right) => {
    record(right ? t.marks : 0);
    const fb = el.querySelector('[data-fb]');
    fb.innerHTML = feedbackHTML(right, right ? `Correct · +${t.marks}` : 'Not quite · 0', t.why, '');
    if (right) burst(fb.querySelector('[data-burst]'));
    showNext(el);
  });
}

function evidenceTask(t, el) {
  const need = t.answer.length;
  el.innerHTML = `${taskHead(t)}
    <p class="muted">Tap sentences in the case brief${matchMedia('(max-width: 860px)').matches ? ' (above)' : ' (left)'}. Selected: <strong data-count>0</strong> of ${need}.</p>
    <div class="row"><button class="btn btn--primary" type="button" data-check disabled>Check my evidence</button></div>
    <div data-fb></div>${navHTML(false)}`;
  wireNav(el);
  setPicking(true);
  const brief = $('#brief');
  const sel = new Set();
  const count = el.querySelector('[data-count]');
  const check = el.querySelector('[data-check]');
  const onPick = (e) => {
    const s = e.target.closest('.sent');
    if (!s || s.disabled) return;
    const id = s.dataset.sid;
    if (sel.has(id)) sel.delete(id);
    else sel.add(id);
    s.setAttribute('aria-pressed', String(sel.has(id)));
    count.textContent = sel.size;
    check.disabled = sel.size === 0;
  };
  briefListener = onPick;
  brief.addEventListener('click', onPick);
  check.addEventListener('click', () => {
    brief.removeEventListener('click', onPick);
    briefListener = null;
    const hits = [...sel].filter((id) => t.answer.includes(id)).length;
    const wrong = sel.size - hits;
    const score = roundHalf(Math.max(0, (hits - wrong) / need) * t.marks);
    record(score);
    brief.querySelectorAll('.sent').forEach((s) => {
      const id = s.dataset.sid;
      s.disabled = true;
      s.setAttribute('aria-pressed', 'false');
      if (t.answer.includes(id)) s.classList.add(sel.has(id) ? 'is-hit' : 'is-miss');
      else if (sel.has(id)) s.classList.add('is-bad');
    });
    brief.classList.remove('is-picking');
    const full = score === t.marks;
    const fb = el.querySelector('[data-fb]');
    fb.innerHTML = feedbackHTML(full, `${hits} of ${need} found${wrong ? `, ${wrong} not relevant` : ''} · +${score}`, `${t.why} Green = the evidence; outlined = what you missed.`, '');
    if (full) burst(fb.querySelector('[data-burst]'));
    check.hidden = true;
    showNext(el);
  });
}

function sortTask(t, el) {
  const picks = new Array(t.items.length).fill(null);
  el.innerHTML = `${taskHead(t)}
    <div class="stack" style="gap:10px">${t.items.map((it, i) => `<div class="srow" data-row="${i}">
      <span style="font-weight:600">${esc(it.text)}</span>
      <div class="srow__btns" role="group" aria-label="${esc(it.text)}">${t.buckets.map((b) => `<button class="btn" type="button" aria-pressed="false" data-b="${b.id}">${esc(b.label)}</button>`).join('')}</div>
    </div>`).join('')}</div>
    <div class="row"><button class="btn btn--primary" type="button" data-check disabled>Check</button><span class="muted" data-left>${t.items.length} left</span></div>
    <div data-fb></div>${navHTML(false)}`;
  wireNav(el);
  const check = el.querySelector('[data-check]');
  el.querySelectorAll('.srow').forEach((row) => {
    const i = Number(row.dataset.row);
    row.querySelectorAll('[data-b]').forEach((b) => b.addEventListener('click', () => {
      if (check.hidden) return;
      picks[i] = b.dataset.b;
      row.querySelectorAll('[data-b]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const left = picks.filter((p) => p === null).length;
      el.querySelector('[data-left]').textContent = left ? `${left} left` : 'Ready';
      check.disabled = left > 0;
    }));
  });
  check.addEventListener('click', () => {
    let right = 0;
    t.items.forEach((it, i) => {
      const row = el.querySelector(`[data-row="${i}"]`);
      const ok = picks[i] === it.b;
      if (ok) right++;
      row.classList.add(ok ? 'is-right' : 'is-wrong');
      row.querySelectorAll('[data-b]').forEach((x) => { x.disabled = true; });
      if (!ok) {
        const label = t.buckets.find((b) => b.id === it.b).label;
        row.insertAdjacentHTML('beforeend', `<span class="srow__fix">Answer: ${esc(label)}${it.why ? ` · ${esc(it.why)}` : ''}</span>`);
      }
    });
    const score = roundHalf((right / t.items.length) * t.marks);
    record(score);
    check.hidden = true;
    el.querySelector('[data-left]').hidden = true;
    const full = right === t.items.length;
    const fb = el.querySelector('[data-fb]');
    fb.innerHTML = feedbackHTML(full, `${right} of ${t.items.length} correct · +${score}`, full ? 'Every one in the right place.' : 'Check the corrections above.', '');
    if (full) burst(fb.querySelector('[data-burst]'));
    showNext(el);
  });
}

function writtenTask(t, el) {
  el.innerHTML = `${taskHead(t)}
    <p class="muted">Write as you would in the exam: name the model, apply it to the case facts, and end with a recommendation.</p>
    <label class="sr-only" for="answer-${current.id}">Your answer</label>
    <textarea class="answer" id="answer-${current.id}" placeholder="Start writing…"></textarea>
    <div class="row row--between"><span class="muted" data-words>0 words</span><button class="btn btn--primary" type="button" data-submit>Submit and see the model answer</button></div>
    <div data-mark></div>${navHTML(false)}`;
  wireNav(el);
  const ta = el.querySelector('textarea');
  ta.addEventListener('input', () => {
    const n = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
    el.querySelector('[data-words]').textContent = `${n} word${n === 1 ? '' : 's'}`;
  });
  el.querySelector('[data-submit]').addEventListener('click', (e) => {
    e.currentTarget.hidden = true;
    ta.readOnly = true;
    const box = el.querySelector('[data-mark]');
    box.innerHTML = `<div class="stack rise" style="gap:14px">
      <h3 style="font-size:20px">Model answer</h3>
      <div class="model">${esc(t.model)}</div>
      <h3 style="font-size:20px">Mark yourself honestly: tick what YOUR answer did</h3>
      <div class="checks">${t.checklist.map((c, i) => `<label><input type="checkbox" data-c="${i}"><span>${esc(c)}</span></label>`).join('')}</div>
      <div class="row row--between"><span class="chip" data-self>0 / ${t.marks} marks</span><button class="btn btn--primary" type="button" data-save>Save my mark</button></div>
    </div>`;
    const boxes = [...box.querySelectorAll('input')];
    const calc = () => roundHalf((boxes.filter((b) => b.checked).length / boxes.length) * t.marks);
    boxes.forEach((b) => b.addEventListener('change', () => { box.querySelector('[data-self]').textContent = `${calc()} / ${t.marks} marks`; }));
    box.querySelector('[data-save]').addEventListener('click', (ev) => {
      ev.currentTarget.hidden = true;
      boxes.forEach((b) => { b.disabled = true; });
      record(calc());
      showNext(el);
    });
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ---------- Results ---------- */

function finish() {
  clearInterval(timerId);
  setPicking(false);
  const got = results.reduce((a, r) => a + (r.score || 0), 0);
  const max = results.reduce((a, r) => a + r.max, 0);
  const pct = Math.round((got / max) * 100);
  const best = saveQuizScore('ebusiness', pct, PASS, 'final');
  const passed = pct >= PASS;
  const late = $('#timer').classList.contains('is-late');
  const weak = current.tasks
    .map((t, i) => ({ t, r: results[i] }))
    .filter(({ r }) => (r.score || 0) < r.max * 0.6);
  const revise = [...new Set(weak.map(({ t }) => t.lesson))].sort();

  $('#exam').hidden = true;
  const res = $('#results');
  res.hidden = false;
  res.innerHTML = `<div class="card card--pad results rise">
    <div class="ring" role="img" aria-label="Score ${got} of ${max}" style="background:conic-gradient(var(--accent) ${pct}%, var(--tint) 0)"><div class="ring__inner" style="font-size:30px">${pct}%</div></div>
    <h1 class="qtitle">${passed ? 'Strong case answer!' : 'Good practice. Review and try another case.'}</h1>
    <p class="muted">${esc(current.name)} · ${got} / ${max} marks · best ${best}%${late ? ' · finished after the time limit' : ''}</p>
    <table class="breakdown">
      <thead><tr><th>Task</th><th>Model</th><th>Marks</th></tr></thead>
      <tbody>${current.tasks.map((t, i) => `<tr><td>${i + 1}</td><td>${esc(t.model)}</td><td>${results[i].score || 0} / ${t.marks}</td></tr>`).join('')}</tbody>
    </table>
    ${revise.length ? `<div class="stack" style="gap:8px;align-items:center"><strong>Revise these lessons:</strong><div class="row" style="justify-content:center">${revise.map((n) => `<a class="btn" href="lesson.html?l=${n}">Lesson ${n} · ${esc(LESSONS[n - 1].title)}</a>`).join('')}</div></div>` : ''}
    <div class="row" style="justify-content:center;gap:12px">
      <button class="btn btn--primary" type="button" data-other>${ICON.redo(16)} Try another case</button>
      <a class="btn" href="cheatsheet.html">Cheat sheet</a>
      <a class="btn btn--ghost" href="../index.html#courses">All courses</a>
    </div>
  </div>`;
  if (passed) burst(res.querySelector('.ring'));
  res.querySelector('[data-other]').addEventListener('click', () => {
    res.hidden = true;
    $('#pick').hidden = false;
    $('#timer').hidden = true;
    $('#marks').hidden = true;
    window.scrollTo({ top: 0 });
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
