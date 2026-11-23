// Renders one IC3 chapter (chapter.html?c=N) from its data file.

import { initPage, esc, $ } from '../assets/js/common.js';
import { lessonQuiz } from '../assets/js/lesson.js';
import { WIDGETS, md } from './widgets.js';
import { CHAPTERS } from './data/index.js';

initPage();

const n = Math.min(CHAPTERS.length, Math.max(1, parseInt(new URLSearchParams(location.search).get('c'), 10) || 1));
const ch = CHAPTERS[n - 1];

document.title = `${ch.title} · IC3 · Exam Lab`;
$('#eyebrow').textContent = `IC3 · Chapter ${n} of ${CHAPTERS.length}`;
$('#title').textContent = ch.title;
$('#lead').innerHTML = md(ch.lead);
$('#dots').innerHTML = CHAPTERS.map((_, i) => `<span class="${i + 1 === n ? 'is-on' : i + 1 < n ? 'is-past' : ''}"></span>`).join('');

const blocksEl = $('#blocks');
let num = 0;
const toc = [];
ch.blocks.forEach((block, i) => {
  const section = document.createElement('section');
  section.className = 'block';
  if (block.type === 'sticky') {
    WIDGETS.sticky(block, section);
    blocksEl.appendChild(section);
    return;
  }
  num++;
  section.id = `b${i}`;
  section.innerHTML = `
    <div class="block__head">
      <span class="block__num" aria-hidden="true">${num}</span>
      <div><h2>${esc(block.title)}</h2>${block.intro ? `<p class="muted">${md(block.intro)}</p>` : ''}</div>
    </div>
    <div class="block__body"></div>`;
  blocksEl.appendChild(section);
  WIDGETS[block.type](block, section.querySelector('.block__body'));
  toc.push(`<a href="#b${i}">${esc(block.short || block.title)}</a>`);
});
toc.push('<a href="#check">Mini quiz</a>');
$('#toc').innerHTML = toc.join('');

lessonQuiz('ic3', `ch${n}`, ch.quiz);

// Reading progress bar along the top edge.
const bar = document.querySelector('.scroll-progress');
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();
