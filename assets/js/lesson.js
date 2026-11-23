// The mini quiz at the end of every lesson. Finishing it marks the lesson done.

import { runCheck, markLessonDone, isLessonDone, esc } from './common.js';
import { lessonNeighbours } from './topics.js';

/**
 * Expects #check-body (quiz area) and #check-count (progress label) on the page.
 * Lesson pages live one folder below the root, so topic hrefs get a "../" prefix.
 */
export function lessonQuiz(topic, lesson, questions) {
  const body = document.getElementById('check-body');
  const count = document.getElementById('check-count');
  const { next } = lessonNeighbours(topic, lesson);
  const already = isLessonDone(topic, lesson);

  runCheck(body, questions, {
    onProgress: (i, total) => {
      count.textContent = (i < total ? `${i + 1} / ${total}` : 'Done') + (already ? ' · completed before' : '');
    },
    onFinish: (correct, total) => {
      markLessonDone(topic, lesson);
      const perfect = correct === total;
      return `<div class="row row--between" style="gap:20px">
        <div class="stack" style="gap:4px">
          <span class="feedback__title">${perfect ? 'Perfect! Lesson done.' : `${correct} / ${total}. Lesson done.`}</span>
          <span class="muted">${perfect ? 'On to the next one.' : 'Scroll up and replay the parts you missed.'}</span>
        </div>
        <div class="row" style="gap:10px">
          <button class="btn" type="button" data-retry><span data-icon="redo"></span> Retry quiz</button>
          ${next ? `<a class="btn btn--primary" href="../${esc(next.href)}">Next: ${esc(next.title)} <span data-icon="right"></span></a>` : ''}
        </div>
      </div>`;
    },
  });

  if (!body.dataset.wired) {
    body.dataset.wired = '1';
    body.addEventListener('click', (e) => {
      if (e.target.closest('[data-retry]')) lessonQuiz(topic, lesson, questions);
    });
  }
}
