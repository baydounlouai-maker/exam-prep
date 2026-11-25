// Cheat sheet: searchable revision cards with a "Test me" mode that hides the answers.

import { initPage, $, esc } from '../assets/js/common.js';
import { CARDS } from './data/cheatsheet.js';
import { LESSONS } from './data/index.js';

initPage();

let query = '';
let lesson = 0; // 0 = all
let testing = false;

$('#filters').innerHTML = [`<button class="btn" type="button" aria-pressed="true" data-l="0">All</button>`]
  .concat(LESSONS.map((l, i) => `<button class="btn" type="button" aria-pressed="false" data-l="${i + 1}">${i + 1} · ${esc(l.title)}</button>`))
  .join('');

// Highlight the search term inside already-escaped text.
function hi(text) {
  const safe = esc(text);
  if (!query) return safe;
  const q = esc(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
}

function render() {
  const q = query.toLowerCase();
  const cards = CARDS.filter((c) => (!lesson || c.lesson === lesson)
    && (!q || c.title.toLowerCase().includes(q) || (c.fig || '').toLowerCase().includes(q) || c.rows.some(([a, b]) => `${a} ${b}`.toLowerCase().includes(q))));
  $('#count').textContent = `${cards.length} card${cards.length === 1 ? '' : 's'}${testing ? ' · tap a hidden answer to reveal it' : ''}`;
  $('#sheet').innerHTML = cards.length ? cards.map((c) => `<article class="cs">
      <div class="cs__head"><h2>${hi(c.title)}</h2><a class="cs__l" href="lesson.html?l=${c.lesson}">Lesson ${c.lesson} →</a></div>
      ${c.fig ? `<div class="cs__fig">${hi(c.fig)}</div>` : ''}
      <dl>${c.rows.map(([a, b]) => `<dt>${hi(a)}</dt><dd tabindex="${testing ? 0 : -1}">${hi(b)}</dd>`).join('')}</dl>
      ${c.tip ? `<div class="cs__tip">${hi(c.tip)}</div>` : ''}
    </article>`).join('') : '<p class="empty">Nothing matches. Try another word.</p>';
}

$('#q').addEventListener('input', (e) => { query = e.target.value.trim(); render(); });
$('#filters').addEventListener('click', (e) => {
  const b = e.target.closest('[data-l]');
  if (!b) return;
  lesson = Number(b.dataset.l);
  $('#filters').querySelectorAll('[data-l]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  render();
});
$('#test').addEventListener('click', (e) => {
  testing = !testing;
  e.currentTarget.setAttribute('aria-checked', String(testing));
  document.body.classList.toggle('testing', testing);
  render();
});
const reveal = (dd) => { if (testing && dd) dd.classList.toggle('is-shown'); };
$('#sheet').addEventListener('click', (e) => reveal(e.target.closest('dd')));
$('#sheet').addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('dd')) { e.preventDefault(); reveal(e.target); }
});

render();
