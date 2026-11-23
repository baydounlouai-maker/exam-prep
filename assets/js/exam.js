// The end-of-course exam: random order, streaks, points, score ring and a review list.
// The page provides #quiz, #streak, #score, #counter and #bar (see java-uml/quiz.html).

import {
  $, esc, shuffle, shuffleOptions, burst, ICON, codeBlock, stageHTML, relById,
  optionsHTML, wireOptions, feedbackHTML, saveQuizScore, fillIcons,
} from './common.js';

/**
 * opts: {
 *   topic, questions, count?   (how many to draw; default all),
 *   pass?                      (percent to clear; default 80),
 *   lessonId?                  (lesson marked done on a pass; default 'quiz'),
 *   review: { href, label },   (button on the results screen)
 *   home                       (link back to the course list)
 * }
 * A question may carry `dia` (UML relationship drawing) or `code` (Java lines).
 */
export function startExam(opts) {
  const { topic, questions, count = questions.length, pass = 80, lessonId = 'quiz', review, home = '../index.html#courses' } = opts;
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
    order = shuffle(questions).slice(0, count).map(shuffleOptions);
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
      ${q.chapter ? `<span class="tag">${esc(q.chapter)}</span>` : ''}
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
    const best = saveQuizScore(topic, pct, pass, lessonId);
    const passed = pct >= pass;
    quiz.innerHTML = `<div class="card card--pad results rise">
      <div class="ring" role="img" aria-label="Score: ${correct} of ${total}" style="background:conic-gradient(var(--accent) ${pct}%, var(--tint) 0)">
        <div class="ring__inner">${correct}/${total}</div>
      </div>
      <h1 class="qtitle">${passed ? 'Course cleared!' : 'Almost there. Review and retry.'}</h1>
      <p class="muted">${pct}% · ${score} pts · best ${best}%${passed ? '' : ` · you need ${pass}%`}</p>
      ${wrong.length ? `<div class="mistakes"><strong>Review these:</strong>${wrong.map((q) =>
        `<div class="mistake">${q.chapter ? `<span class="tag" style="margin-right:6px">${esc(q.chapter)}</span>` : ''}<strong>${q.opts[q.answer]}</strong> · ${esc(q.why)}</div>`).join('')}</div>` : ''}
      <div class="row" style="justify-content:center;gap:12px">
        <button class="btn btn--primary" type="button" id="again"><span data-icon="redo"></span> Try again</button>
        ${review ? `<a class="btn" href="${esc(review.href)}">${esc(review.label)}</a>` : ''}
        <a class="btn btn--ghost" href="${esc(home)}">All courses</a>
      </div>
    </div>`;
    fillIcons(quiz);
    if (passed) burst(quiz.querySelector('.ring'));
    $('#again').addEventListener('click', start);
  }

  start();
}
