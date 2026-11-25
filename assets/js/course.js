// Renders one data-driven lesson page: header, optional video, interactive blocks, mini quiz.
// Used by ic3/chapter.html and ebusiness/lesson.html.

import { initPage, esc, $ } from './common.js';
import { lessonQuiz } from './lesson.js';
import { WIDGETS, md } from './widgets.js';

/**
 * opts: {
 *   topic,        course id in topics.js (progress is saved under it)
 *   items,        array of lesson data objects { title, lead, blocks, quiz, video? }
 *   param,        URL parameter holding the lesson number (?c=2)
 *   idPrefix,     lesson id prefix in topics.js ('ch' → ch1, ch2…)
 *   eyebrow(n, total), siteTitle
 *   video(el, lesson)  optional: mounts a lesson video into #video
 * }
 */
export function renderLesson(opts) {
  const { topic, items, param = 'c', idPrefix = 'ch', eyebrow, siteTitle, video } = opts;
  initPage();

  const n = Math.min(items.length, Math.max(1, parseInt(new URLSearchParams(location.search).get(param), 10) || 1));
  const ch = items[n - 1];

  document.title = `${ch.title} · ${siteTitle} · Exam Lab`;
  $('#eyebrow').textContent = eyebrow(n, items.length);
  $('#title').textContent = ch.title;
  $('#lead').innerHTML = md(ch.lead);
  $('#dots').innerHTML = items.map((_, i) => `<span class="${i + 1 === n ? 'is-on' : i + 1 < n ? 'is-past' : ''}"></span>`).join('');

  const toc = [];
  const videoEl = document.getElementById('video');
  if (videoEl) {
    if (ch.video && video) {
      video(videoEl, ch);
      toc.push('<a href="#video">Video</a>');
    } else {
      videoEl.remove();
    }
  }

  const blocksEl = $('#blocks');
  let num = 0;
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

  lessonQuiz(topic, `${idPrefix}${n}`, ch.quiz);

  // Reading progress bar along the top edge.
  const bar = document.querySelector('.scroll-progress');
  if (bar) {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  return { lesson: ch, n };
}
