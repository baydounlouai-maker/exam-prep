import { initPage, ICON, esc, loadProgress, resetTopic, fillIcons } from './common.js';
import { TOPICS, COMING_SOON } from './topics.js';

initPage();

const list = document.getElementById('topic-list');

function renderTopics() {
  const progress = loadProgress();
  list.innerHTML = '';

  TOPICS.forEach((topic, ti) => {
    const done = progress[topic.id]?.done || {};
    const doneCount = topic.lessons.filter((l) => done[l.id]).length;
    const pct = Math.round((doneCount / topic.lessons.length) * 100);
    const best = progress[topic.id]?.quizBest;
    let pick = topic.lessons.findIndex((l) => !done[l.id]);
    if (pick < 0) pick = topic.lessons.length - 1;

    const card = document.createElement('article');
    card.className = 'card card--pad topic rise';
    card.innerHTML = `
      <div class="row row--between" style="align-items:flex-start;gap:20px">
        <div class="stack" style="gap:8px;min-width:0">
          <span class="tag">Course ${ti + 1}</span>
          <h3 class="topic__title">${esc(topic.title)}</h3>
          <span class="muted">${esc(topic.blurb)}</span>
        </div>
        <div class="stack" style="gap:8px;min-width:220px">
          <div class="row row--between" style="font-size:14px;font-weight:600"><span>Progress</span><span>${pct}%${best != null ? ` · best quiz ${best}%` : ''}</span></div>
          <div class="bar" role="progressbar" aria-label="${esc(topic.title)} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span></span></div>
          ${pct > 0 ? '<button class="btn btn--ghost" type="button" data-reset style="align-self:flex-end;min-height:36px;padding:4px 10px;font-size:14px">Reset progress</button>' : ''}
        </div>
      </div>
      <div class="path" role="group" aria-label="Lessons"></div>
      <div class="peek" aria-live="polite"></div>`;
    list.appendChild(card);

    // Animate the bar after paint.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.querySelector('.bar span').style.width = Math.max(pct, 3) + '%';
    }));

    const path = card.querySelector('.path');
    const peek = card.querySelector('.peek');

    const renderPeek = () => {
      const l = topic.lessons[pick];
      peek.innerHTML = `
        <div class="stack rise" style="gap:2px;min-width:0">
          <span class="peek__title">${esc(l.title)}</span>
          <span class="muted">${esc(l.desc)}</span>
        </div>
        <a class="btn btn--primary" href="${esc(l.href)}">${done[l.id] ? 'Review' : 'Open'} ${ICON.right(16)}</a>`;
      path.querySelectorAll('.node').forEach((n, i) => n.setAttribute('aria-pressed', String(i === pick)));
    };

    topic.lessons.forEach((l, i) => {
      const step = document.createElement('div');
      step.className = 'path__step';
      step.innerHTML = `
        <button class="node${l.boss ? ' node--boss' : ''}${done[l.id] ? ' is-done' : ''}" type="button" aria-pressed="false"
          aria-label="Lesson ${esc(l.n)}: ${esc(l.title)}${done[l.id] ? ' (done)' : ''}">${esc(l.n)}${done[l.id] ? `<span class="node__tick">${ICON.check(12)}</span>` : ''}</button>
        ${i < topic.lessons.length - 1 ? '<span class="connector" aria-hidden="true"></span>' : ''}`;
      step.querySelector('.node').addEventListener('click', () => { pick = i; renderPeek(); });
      path.appendChild(step);
    });
    renderPeek();

    card.querySelector('[data-reset]')?.addEventListener('click', () => {
      if (confirm(`Reset your progress for ${topic.title}?`)) {
        resetTopic(topic.id);
        renderTopics();
      }
    });

  });

  fillIcons(list);
}

renderTopics();

document.getElementById('topic-count').textContent =
  `${TOPICS.length} courses · more on the way`;

document.getElementById('soon-list').innerHTML = COMING_SOON.map((name, i) => `
  <div class="soon__card">
    ${ICON.lock(28)}
    <div><strong>Course ${TOPICS.length + i + 1} · ${esc(name)}</strong><span style="font-size:14px">Coming soon</span></div>
  </div>`).join('');
