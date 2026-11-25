// Animated lesson "videos": a YouTube-style player whose frames are live HTML/SVG animation.
// Every frame is a pure function of the playhead time, so scrubbing, chapters and speed changes are exact.
//
// A video is a list of scenes: { title, html, beats: [{ say, hold? }] }.
// Inside a scene's html, any element with data-fx animates in at a beat:
//   data-at="2"      start at beat 2 of this scene (default 0)
//   data-d="0.4"     extra delay in seconds
//   data-dur="1.2"   animation length (default 0.55 s)
//   data-fx="rise | left | fade | pop | grow | draw | count | glow"
//   data-out="4"     fade out when beat 4 starts
//   data-to="1000"   end value for count (or the fraction to draw for draw)
// data-loop="spin | bob | dash | coins" adds continuous motion.
// The scene templates further down build common layouts from plain data.

import { esc } from './common.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (p) => 1 - Math.pow(1 - p, 3);
const easeBack = (p) => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
const fmt = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

const ICON_PLAY = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
const ICON_PAUSE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1.2"/><rect x="14" y="4" width="5" height="16" rx="1.2"/></svg>';

/**
 * Mount a video into `root`.
 * opts: { scenes, checkpoints?: [{ after: sceneIndex, q, opts, answer, why }], label, onQuiz? }
 */
export function mountVideo(root, opts) {
  const { scenes: SCENES, checkpoints: CHECKPOINTS = [], label = 'Lesson video', onQuiz } = opts;

  // ---------- Timeline ----------
  const words = (s) => s.trim().split(/\s+/).length;
  const beatDur = (b) => Math.max(2.4, words(b.say) / 2.45 + 0.9) + (b.hold || 0);
  const cues = [];
  let T = 0;
  SCENES.forEach((sc, si) => {
    sc.start = T;
    T += 0.5;
    sc.bt = sc.beats.map((b) => {
      const start = T;
      const d = beatDur(b);
      cues.push({ start, end: start + d, text: b.say, scene: si });
      T += d;
      return start;
    });
    T += 0.7;
    sc.end = T;
  });
  const TOTAL = T;
  CHECKPOINTS.forEach((c) => { c.time = SCENES[c.after].end - 0.25; c.done = false; });

  // ---------- DOM ----------
  root.innerHTML = `
    <div class="vp show">
      <div class="vp__screen" role="region" aria-label="${esc(label)}. Use the controls, or read the transcript below.">
        <div class="vp__stage">${SCENES.map((sc, i) => `<div class="vp__layer" data-scene="${i}"><div class="vp__cam"><div class="v-grid"></div>${sc.html}</div></div>`).join('')}</div>
        <div class="vp__cap" aria-hidden="true"><span></span></div>
        <div class="vp__flash" aria-hidden="true"></div>
        <button class="vp__big" type="button" aria-label="Play video"><svg width="40" height="40" viewBox="0 0 24 24" fill="#14142B" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg></button>
        <div class="vp__cp" hidden role="dialog" aria-label="Quick check"></div>
        <div class="vp__end" hidden>
          <div class="vp__endcard">
            <div class="vp__endtitle">Video complete</div>
            <div style="opacity:.85">Next: play with the ideas below, then take the mini quiz.</div>
            <div class="vp__row">
              <button class="vp__btn" type="button" data-replay>Replay</button>
              <button class="vp__btn vp__btn--sun" type="button" data-next>Keep going ↓</button>
            </div>
          </div>
        </div>
      </div>
      <div class="vp__chrome">
        <div class="vp__bar" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="${Math.round(TOTAL)}" aria-valuenow="0">
          <div class="vp__segs"></div><div class="vp__knob"></div><div class="vp__tip"></div>
        </div>
        <div class="vp__ctrls">
          <button class="vp__c" type="button" data-play aria-label="Play (k)">${ICON_PLAY}</button>
          <button class="vp__c vp__hide-sm" type="button" data-back aria-label="Back 5 seconds">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg></button>
          <button class="vp__c vp__hide-sm" type="button" data-fwd aria-label="Forward 5 seconds">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg></button>
          <button class="vp__c" type="button" data-voice aria-pressed="false" aria-label="Narration voice (v)" hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg></button>
          <div class="vp__time"><span data-now>0:00</span><span style="opacity:.6">/</span><span>${fmt(TOTAL)}</span><span class="vp__chap" data-chap></span></div>
          <div class="vp__spacer"></div>
          <button class="vp__c" type="button" data-cc aria-pressed="true" aria-label="Captions (c)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M10 10.5a2.5 2.5 0 1 0 0 3M17 10.5a2.5 2.5 0 1 0 0 3" stroke-linecap="round"/></svg></button>
          <button class="vp__c vp__c--text" type="button" data-speed aria-haspopup="true" aria-expanded="false" aria-label="Playback speed">1×</button>
          <button class="vp__c" type="button" data-fs aria-label="Full screen (f)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>
        </div>
        <div class="vp__menu" role="menu" hidden><span>Playback speed</span></div>
      </div>
    </div>
    <div class="vp-tabs" role="tablist" aria-label="Video details">
      <button class="vp-tab" type="button" role="tab" aria-selected="true" data-view="chapters">Chapters</button>
      <button class="vp-tab" type="button" role="tab" aria-selected="false" data-view="transcript">Transcript</button>
    </div>
    <div class="vp-panel" role="tabpanel"></div>
    <div class="vp-keys">Shortcuts: <kbd>K</kbd> play · <kbd>←</kbd><kbd>→</kbd> 5 s · <kbd>C</kbd> captions · <kbd>V</kbd> voice · <kbd>F</kbd> full screen · <kbd>0</kbd>–<kbd>9</kbd> jump</div>`;

  const q = (s) => root.querySelector(s);
  const player = q('.vp'), screen = q('.vp__screen'), stage = q('.vp__stage');
  const layers = [...stage.querySelectorAll('.vp__layer')];
  const capEl = q('.vp__cap'), capText = capEl.querySelector('span');
  const bar = q('.vp__bar'), segsEl = q('.vp__segs'), knob = q('.vp__knob'), tip = q('.vp__tip');
  const playBtn = q('[data-play]'), big = q('.vp__big'), endEl = q('.vp__end'), cpEl = q('.vp__cp');
  const menu = q('.vp__menu'), panel = q('.vp-panel');

  // Parse animated elements once per scene.
  const sceneEls = layers.map((layer, si) => [...layer.querySelectorAll('[data-fx]')].map((el) => {
    const sc = SCENES[si];
    const at = Number(el.dataset.at || 0);
    const o = {
      el,
      fx: el.dataset.fx,
      start: (sc.bt[at] ?? sc.start) + Number(el.dataset.d || 0),
      dur: Number(el.dataset.dur || (el.dataset.fx === 'count' ? 2 : 0.55)),
      out: el.dataset.out !== undefined ? sc.bt[Number(el.dataset.out)] : null,
      to: Number(el.dataset.to || 1),
    };
    if (o.fx === 'draw') {
      o.len = el.getTotalLength();
      el.style.strokeDasharray = `${o.len} ${o.len}`;
    }
    return o;
  }));
  const loops = layers.map((layer) => [...layer.querySelectorAll('[data-loop]')]);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sceneAt = (tt) => { for (let i = SCENES.length - 1; i >= 0; i--) if (tt >= SCENES[i].start) return i; return 0; };
  const cueAt = (tt) => cues.find((c) => tt >= c.start && tt < c.end) || null;

  let t = 0, playing = false, speed = 1, ccOn = true, voiceOn = false, started = false;
  let last = 0, lastCue = null, dragging = false;

  function render(tt) {
    const si = sceneAt(tt);
    layers.forEach((layer, i) => {
      const sc = SCENES[i];
      const on = i === si;
      layer.style.visibility = on ? 'visible' : 'hidden';
      if (!on) return;
      const lt = tt - sc.start;
      layer.style.opacity = clamp(lt / 0.35);
      layer.firstElementChild.style.transform = reduce ? '' : `scale(${1 + 0.03 * clamp(lt / (sc.end - sc.start))})`;
      for (const o of sceneEls[i]) {
        const p = clamp((tt - o.start) / o.dur);
        const e = easeOut(p);
        let op = p > 0 ? 1 : 0;
        let tf = '';
        switch (o.fx) {
          case 'rise': op = e; tf = `translateY(${(1 - e) * 26}px)`; break;
          case 'left': op = e; tf = `translateX(${(1 - e) * -40}px)`; break;
          case 'fade': op = e; break;
          case 'pop': { op = clamp(p * 2); const s = p >= 1 ? 1 : 0.55 + 0.45 * easeBack(p); tf = `scale(${s})`; break; }
          case 'grow': tf = `scaleX(${e})`; break;
          case 'glow': op = 1; o.el.setAttribute('opacity', (0.28 * e).toFixed(3)); break;
          case 'draw': o.el.style.strokeDashoffset = o.len * (1 - e * o.to); break;
          case 'count': o.el.textContent = Math.round(e * o.to).toLocaleString('en-GB'); break;
          default: break;
        }
        if (o.out !== null) op *= 1 - clamp((tt - o.out) / 0.35);
        o.el.style.opacity = op;
        if (o.fx !== 'glow') o.el.style.transform = tf;
      }
      for (const el of loops[i]) {
        const kind = el.dataset.loop;
        if (kind === 'spin') el.style.transform = `rotate(${lt * 260}deg)`;
        else if (kind === 'bob') el.style.transform = `translateY(${Math.sin(lt * 7) * 2.5}px)`;
        else if (kind === 'dash') el.style.strokeDashoffset = String(lt * 160);
        else if (kind === 'coins') {
          const from = sc.bt[Number(el.dataset.from || 1)] + 0.6, to = sc.bt[Number(el.dataset.until || 3)];
          const dist = Number(el.dataset.dist || 680);
          [...el.children].forEach((c, k) => {
            const live = tt > from && tt < to;
            const f = ((tt - from) * 0.42 + k / el.children.length) % 1;
            c.style.transform = `translateX(${f * dist}px)`;
            c.style.opacity = live ? String(Math.min(1, Math.sin(f * Math.PI) * 2.2)) : '0';
          });
        }
      }
    });
    const cue = cueAt(tt);
    capText.textContent = cue ? cue.text : '';
    capEl.style.display = ccOn && cue && started ? '' : 'none';
  }

  // ---------- Playback ----------
  function setPlaying(v) {
    if (v && !cpEl.hidden) return;
    if (v && t >= TOTAL - 0.05) { t = 0; CHECKPOINTS.forEach((c) => { c.done = false; }); }
    playing = v;
    started = started || v;
    big.hidden = started;
    endEl.hidden = true;
    playBtn.innerHTML = v ? ICON_PAUSE : ICON_PLAY;
    playBtn.setAttribute('aria-label', v ? 'Pause (k)' : 'Play (k)');
    const f = q('.vp__flash');
    f.innerHTML = v ? ICON_PLAY : ICON_PAUSE;
    f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    if (!v) stopVoice(); else lastCue = null;
    poke();
    if (v) { last = performance.now(); requestAnimationFrame(tick); }
  }

  function tick(now) {
    if (!playing) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const prev = t;
    t = Math.min(TOTAL, t + dt * speed);
    const cp = CHECKPOINTS.find((c) => !c.done && prev < c.time && t >= c.time);
    if (cp) { t = cp.time; update(); openCheckpoint(cp); return; }
    update();
    if (t >= TOTAL) {
      playing = false;
      playBtn.innerHTML = ICON_PLAY;
      endEl.hidden = false;
      showControls(true);
      return;
    }
    requestAnimationFrame(tick);
  }

  function seek(nt) {
    t = clamp(nt, 0, TOTAL);
    cpEl.hidden = true;
    CHECKPOINTS.forEach((c) => { if (c.time > t) c.done = false; });
    if (!started) { started = true; big.hidden = true; }
    endEl.hidden = !(t >= TOTAL);
    stopVoice();
    lastCue = null;
    update();
  }

  function update() {
    render(t);
    SCENES.forEach((sc, i) => { segFills[i].style.width = `${clamp((t - sc.start) / (sc.end - sc.start)) * 100}%`; });
    knob.style.left = `${(t / TOTAL) * 100}%`;
    const si = sceneAt(t);
    bar.setAttribute('aria-valuenow', String(Math.round(t)));
    bar.setAttribute('aria-valuetext', `${fmt(t)} of ${fmt(TOTAL)}, ${SCENES[si].title}`);
    q('[data-now]').textContent = fmt(t);
    q('[data-chap]').textContent = `· ${SCENES[si].title}`;
    syncPanel();
    if (playing && voiceOn) {
      const cue = cueAt(t);
      if (cue && cue !== lastCue) speak(cue.text);
      lastCue = cue;
    }
  }

  // ---------- Checkpoint questions ----------
  function openCheckpoint(cp) {
    playing = false;
    stopVoice();
    playBtn.innerHTML = ICON_PLAY;
    showControls(true);
    cpEl.hidden = false;
    cpEl.innerHTML = `<div class="vp__cpcard">
      <span class="vp__cptag">Quick check</span>
      <div class="vp__cpq"></div>
      <div class="vp__opts">${cp.opts.map((_, i) => `<button class="vp__opt" type="button" data-i="${i}"><b>${'ABCD'[i]}</b><span></span></button>`).join('')}</div>
      <div class="vp__fb" hidden><span><strong></strong> <span></span></span><button class="vp__btn vp__btn--sun" type="button" data-go>Continue ▶</button></div>
    </div>`;
    cpEl.querySelector('.vp__cpq').textContent = cp.q;
    cpEl.querySelectorAll('.vp__opt span').forEach((s, i) => { s.textContent = cp.opts[i]; });
    const opts = [...cpEl.querySelectorAll('.vp__opt')];
    opts.forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const pick = Number(b.dataset.i);
      const right = pick === cp.answer;
      opts.forEach((x, i) => { x.disabled = true; x.classList.add(i === cp.answer ? 'right' : i === pick ? 'wrong' : 'dim'); });
      const fb = cpEl.querySelector('.vp__fb');
      fb.hidden = false;
      fb.querySelector('strong').textContent = right ? 'Correct!' : 'Not quite.';
      fb.querySelector('strong + span').textContent = cp.why;
      const go = fb.querySelector('[data-go]');
      go.focus({ preventScroll: true });
      go.addEventListener('click', (ev) => { ev.stopPropagation(); cp.done = true; cpEl.hidden = true; setPlaying(true); });
    }));
    opts[0].focus({ preventScroll: true });
  }
  cpEl.addEventListener('click', (e) => e.stopPropagation());

  // ---------- Voice (the browser's own speech engine) ----------
  const canSpeak = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance === 'function';
  function speak(text) {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = clamp(speed, 0.6, 1.8);
      u.lang = 'en-GB';
      speechSynthesis.speak(u);
    } catch { /* speech not available */ }
  }
  function stopVoice() { if (canSpeak) { try { speechSynthesis.cancel(); } catch { /* ignore */ } } }
  if (canSpeak) q('[data-voice]').hidden = false;

  // ---------- Seek bar with chapter segments ----------
  const segFills = SCENES.map((sc) => {
    const s = document.createElement('div');
    s.className = 'vp__seg';
    s.style.flex = `${sc.end - sc.start} 1 0`;
    s.innerHTML = '<i></i>';
    segsEl.appendChild(s);
    return s.firstChild;
  });
  CHECKPOINTS.forEach((c) => {
    const m = document.createElement('span');
    m.className = 'vp__mark';
    m.style.left = `${(c.time / TOTAL) * 100}%`;
    bar.appendChild(m);
  });
  const timeFromX = (x) => { const r = bar.getBoundingClientRect(); return clamp((x - r.left) / r.width) * TOTAL; };
  function showTip(x) {
    const r = bar.getBoundingClientRect();
    const tt = timeFromX(x);
    const si = sceneAt(tt);
    tip.innerHTML = `<b>${esc(SCENES[si].title)}</b>${fmt(tt)}`;
    tip.style.left = `${clamp(x - r.left, 50, r.width - 50)}px`;
    [...segsEl.children].forEach((s, i) => s.classList.toggle('hover', i === si));
  }
  bar.addEventListener('pointerdown', (e) => { dragging = true; bar.classList.add('drag'); bar.setPointerCapture(e.pointerId); seek(timeFromX(e.clientX)); showTip(e.clientX); });
  bar.addEventListener('pointermove', (e) => { showTip(e.clientX); if (dragging) seek(timeFromX(e.clientX)); poke(); });
  const endDrag = () => { dragging = false; bar.classList.remove('drag'); };
  bar.addEventListener('pointerup', endDrag);
  bar.addEventListener('pointercancel', endDrag);
  bar.addEventListener('pointerleave', () => [...segsEl.children].forEach((s) => s.classList.remove('hover')));
  bar.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { seek(t + 5); e.preventDefault(); e.stopPropagation(); }
    if (e.key === 'ArrowLeft') { seek(t - 5); e.preventDefault(); e.stopPropagation(); }
  });

  // ---------- Controls ----------
  big.addEventListener('click', (e) => { e.stopPropagation(); setPlaying(true); });
  screen.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    if (matchMedia('(hover: none)').matches && !player.classList.contains('show')) { showControls(true); return; }
    setPlaying(!playing);
  });
  playBtn.addEventListener('click', () => setPlaying(!playing));
  q('[data-back]').addEventListener('click', () => seek(t - 5));
  q('[data-fwd]').addEventListener('click', () => seek(t + 5));
  q('[data-replay]').addEventListener('click', (e) => { e.stopPropagation(); seek(0); setPlaying(true); });
  q('[data-next]').addEventListener('click', (e) => { e.stopPropagation(); if (onQuiz) onQuiz(); });

  function toggleCC() { ccOn = !ccOn; q('[data-cc]').setAttribute('aria-pressed', String(ccOn)); render(t); }
  function toggleVoice() {
    voiceOn = !voiceOn;
    q('[data-voice]').setAttribute('aria-pressed', String(voiceOn));
    if (!voiceOn) stopVoice();
    else if (playing) { const c = cueAt(t); if (c) speak(c.text); lastCue = c; }
  }
  q('[data-cc]').addEventListener('click', toggleCC);
  q('[data-voice]').addEventListener('click', toggleVoice);

  const speedBtn = q('[data-speed]');
  [0.5, 0.75, 1, 1.25, 1.5, 2].forEach((s) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'menuitemradio'); b.dataset.s = s;
    b.textContent = s === 1 ? 'Normal' : `${s}×`;
    b.setAttribute('aria-checked', String(s === 1));
    b.addEventListener('click', () => {
      speed = s;
      speedBtn.textContent = `${s}×`;
      menu.querySelectorAll('[data-s]').forEach((x) => x.setAttribute('aria-checked', String(Number(x.dataset.s) === s)));
      closeMenu();
      if (playing && voiceOn) { const c = cueAt(t); if (c) speak(c.text); }
    });
    menu.appendChild(b);
  });
  function closeMenu() { menu.hidden = true; speedBtn.setAttribute('aria-expanded', 'false'); }
  speedBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.hidden;
    menu.hidden = !open;
    speedBtn.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('[aria-checked="true"]').focus();
  });
  document.addEventListener('click', (e) => { if (!menu.hidden && !(e.target instanceof Element && e.target.closest('.vp__menu'))) closeMenu(); });

  q('[data-fs]').addEventListener('click', () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else { const r = player.requestFullscreen?.(); if (r && r.catch) r.catch(() => {}); }
    } catch { /* full screen not allowed */ }
  });
  document.addEventListener('fullscreenchange', fit);

  let hideTimer = 0;
  function showControls(stay) {
    player.classList.add('show');
    player.classList.remove('idle');
    clearTimeout(hideTimer);
    if (!stay && playing) hideTimer = setTimeout(() => {
      if (playing && menu.hidden && !dragging) { player.classList.remove('show'); player.classList.add('idle'); }
    }, 2600);
  }
  function poke() { showControls(!playing); }
  player.addEventListener('pointermove', () => poke());
  player.addEventListener('focusin', () => showControls(true));

  // YouTube-style keys; ignored while typing or when focus is in another interactive widget's text field.
  document.addEventListener('keydown', (e) => {
    const tg = e.target instanceof Element ? e.target : document.body;
    if (tg.closest('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
    const inPlayer = root.contains(tg) || tg === document.body;
    if (!inPlayer) return;
    const k = e.key.toLowerCase();
    if (k === ' ' || k === 'k') { if (tg.closest('button') && k === ' ') return; setPlaying(!playing); e.preventDefault(); }
    else if (k === 'arrowright' || k === 'l') { seek(t + 5); poke(); e.preventDefault(); }
    else if (k === 'arrowleft' || k === 'j') { seek(t - 5); poke(); e.preventDefault(); }
    else if (k === 'c') toggleCC();
    else if (k === 'v' && canSpeak) toggleVoice();
    else if (k === 'f') q('[data-fs]').click();
    else if (/^[0-9]$/.test(k)) seek((Number(k) / 10) * TOTAL);
  });

  // ---------- Chapters / transcript ----------
  let view = 'chapters';
  let lastActive = -1;
  function buildPanel() {
    const list = view === 'chapters'
      ? SCENES.map((sc) => ({ t: sc.start, title: sc.title }))
      : cues.map((c) => ({ t: c.start, title: c.text }));
    panel.innerHTML = '';
    list.forEach((row) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'vp-item';
      b.innerHTML = `<span class="vp-item__t">${fmt(row.t)}</span><span class="vp-item__body"><span${view === 'chapters' ? ' style="font-weight:600"' : ''}></span>${view === 'chapters' ? '<span class="vp-item__bar"><i></i></span>' : ''}</span>`;
      b.querySelector('.vp-item__body > span').textContent = row.title;
      b.addEventListener('click', () => { seek(row.t + 0.01); if (!playing) setPlaying(true); });
      panel.appendChild(b);
    });
    lastActive = -1;
    syncPanel();
  }
  function syncPanel() {
    const items = panel.children;
    let active;
    if (view === 'chapters') {
      active = sceneAt(t);
      SCENES.forEach((sc, i) => {
        const fill = items[i]?.querySelector('.vp-item__bar i');
        if (fill) fill.style.width = `${clamp((t - sc.start) / (sc.end - sc.start)) * 100}%`;
      });
    } else {
      active = cues.findIndex((c) => t >= c.start && t < c.end);
    }
    if (active === lastActive) return;
    lastActive = active;
    [...items].forEach((el, i) => el.classList.toggle('is-on', i === active));
    if (view === 'transcript' && active >= 0 && items[active] && playing) {
      panel.scrollTo({ top: items[active].offsetTop - panel.clientHeight / 3, behavior: 'smooth' });
    }
  }
  root.querySelectorAll('.vp-tab').forEach((tab) => tab.addEventListener('click', () => {
    view = tab.dataset.view;
    root.querySelectorAll('.vp-tab').forEach((x) => x.setAttribute('aria-selected', String(x === tab)));
    buildPanel();
  }));

  // ---------- Fit the 1280×720 stage ----------
  function fit() { stage.style.transform = `scale(${screen.clientWidth / 1280})`; }
  new ResizeObserver(fit).observe(screen);
  fit();

  // Poster: the finished title card.
  buildPanel();
  const sc0 = SCENES[0];
  render(Math.min(sc0.end - 0.8, sc0.bt[sc0.bt.length - 1] + 4));
  q('[data-now]').textContent = '0:00';
  return { duration: TOTAL };
}

/* =====================================================================
   Scene templates. Each returns { title, html, beats }.
   `says` is the narration: one line per beat, in the order listed.
   ===================================================================== */

const line = (s) => (typeof s === 'string' ? { say: s } : s);
const tone = (x) => (x ? ` v-${x}` : '');

/** Title card. says: [intro, overview]. Chips appear on beat 1. */
export function titleScene({ eyebrow, title, sub, badge, chips = [], says, name = 'Intro' }) {
  return {
    title: name,
    beats: says.map(line),
    html: `
      <div class="v-abs" style="left:110px;top:140px" data-fx="rise"><span class="v-pill"><span class="v-dot"></span>${esc(eyebrow)}</span></div>
      <h2 class="v-abs v-h v-h--xl" style="left:104px;top:214px;width:880px" data-d="0.25" data-fx="rise">${title}</h2>
      <div class="v-abs v-lbl" style="left:110px;top:458px;font-size:30px;color:#14142B" data-d="0.6" data-fx="rise">${sub}</div>
      ${badge ? `<div class="v-abs" style="left:1000px;top:120px;width:200px;height:200px;border-radius:50%;border:4px solid #14142B;background:#FFB020;box-shadow:8px 8px 0 #14142B;display:flex;align-items:center;justify-content:center;font:700 ${String(badge).length > 2 ? 64 : 110}px/1 'Space Grotesk',sans-serif" data-d="0.4" data-fx="pop">${esc(badge)}</div>` : ''}
      <div class="v-abs" style="left:110px;top:560px;display:flex;gap:18px;flex-wrap:wrap;width:1080px">
        ${chips.map((c, i) => `<span class="v-chip${i % 3 === 1 ? ' v-tint' : i % 3 === 2 ? ' v-sun' : ''}" data-at="1" data-d="${(1.4 + i * 0.8).toFixed(1)}" data-fx="pop">${esc(c)}</span>`).join('')}
      </div>`,
  };
}

/** Cards that appear one per beat. says: [intro, one line per item]. cols: cards per row. */
export function cardsScene({ name, heading, items, says, cols = items.length, height }) {
  const gap = 22;
  const w = Math.floor((1080 - gap * (cols - 1)) / cols);
  const rows = Math.ceil(items.length / cols);
  const h = height || Math.floor((470 - gap * (rows - 1)) / rows);
  return {
    title: name,
    beats: says.map(line),
    html: `
      <h2 class="v-abs v-h v-h--md" style="left:100px;top:62px;width:1080px" data-fx="rise">${heading}</h2>
      <div class="v-abs" style="left:100px;top:178px;display:grid;grid-template-columns:repeat(${cols},${w}px);gap:${gap}px">
        ${items.map((it, i) => `<div class="v-card${tone(it.tone)}" style="padding:24px 26px;height:${h}px;display:flex;flex-direction:column;gap:12px;overflow:hidden" data-at="${i + 1}" data-fx="pop">
          ${it.tag ? `<span class="v-mono" style="font-size:18px;font-weight:600;color:${it.tone === 'indigo' ? '#E8E7FD' : '#4F46E5'}">${esc(it.tag)}</span>` : ''}
          <div class="v-t"${h < 150 ? ' style="font-size:26px"' : ''}>${it.title}</div>
          ${it.text ? `<div class="v-s"${it.tone === 'indigo' ? ' style="color:#E8E7FD"' : ''}>${it.text}</div>` : ''}
        </div>`).join('')}
      </div>`,
  };
}

/** Rows that slide in one per beat, numbered or ticked. says: [intro, one line per row]. */
export function rowsScene({ name, heading, items, says, mark = 'num' }) {
  const h = Math.min(96, Math.floor((480 - 16 * (items.length - 1)) / items.length));
  return {
    title: name,
    beats: says.map(line),
    html: `
      <h2 class="v-abs v-h v-h--md" style="left:100px;top:62px;width:1080px" data-fx="rise">${heading}</h2>
      <div class="v-abs" style="left:100px;top:170px;width:1080px;display:flex;flex-direction:column;gap:16px">
        ${items.map((it, i) => `<div class="v-card${tone(it.tone)}" style="display:flex;gap:22px;align-items:center;padding:0 26px;height:${h}px" data-at="${i + 1}" data-fx="left">
          <span class="v-num"${mark === 'tick' ? ' style="background:#4F46E5;color:#fff"' : ''}>${mark === 'tick' ? '✓' : i + 1}</span>
          <span style="display:flex;flex-direction:column;min-width:0"><span class="v-big"${h < 80 ? ' style="font-size:25px"' : ''}>${it.title}</span>${it.text ? `<span class="v-s" style="font-size:19px">${it.text}</span>` : ''}</span>
        </div>`).join('')}
      </div>`,
  };
}

/** A 2×2 matrix. quads in reading order of `order`; says: [intro (axes), one line per quadrant]. */
export function quadScene({ name, heading, x, y, quads, order = ['tl', 'tr', 'bl', 'br'], says }) {
  const pos = { tl: [0, 0], tr: [1, 0], bl: [0, 1], br: [1, 1] };
  return {
    title: name,
    beats: says.map(line),
    html: `
      <h2 class="v-abs v-h" style="left:100px;top:36px;font-size:44px;width:1080px" data-fx="rise">${heading}</h2>
      <div class="v-abs" style="left:290px;top:110px;width:880px;height:452px;border-left:5px solid #14142B;border-bottom:5px solid #14142B" data-d="0.3" data-fx="fade"></div>
      <div class="v-abs v-ax" style="left:120px;top:112px;width:150px;text-align:right" data-d="0.6" data-fx="fade">${esc(y.hi)}</div>
      <div class="v-abs v-ax" style="left:120px;top:526px;width:150px;text-align:right" data-d="0.6" data-fx="fade">${esc(y.lo)}</div>
      <div class="v-abs" style="left:96px;top:290px;width:180px;text-align:right;font:700 24px/1.2 'Space Grotesk',sans-serif" data-d="0.8" data-fx="fade">${esc(y.label)} ↑</div>
      <div class="v-abs v-ax" style="left:300px;top:572px" data-d="0.6" data-fx="fade">${esc(x.lo)}</div>
      <div class="v-abs v-ax" style="left:900px;top:572px;width:270px;text-align:right" data-d="0.6" data-fx="fade">${esc(x.hi)}</div>
      <div class="v-abs" style="left:520px;top:568px;width:420px;text-align:center;font:700 24px/1.2 'Space Grotesk',sans-serif" data-d="0.8" data-fx="fade">${esc(x.label)} →</div>
      ${order.map((k, i) => {
        const [cx, cy] = pos[k];
        const qd = quads[k];
        return `<div class="v-card${tone(qd.tone)}" style="position:absolute;left:${312 + cx * 432}px;top:${122 + cy * 218}px;width:410px;height:200px;padding:20px 24px;display:flex;flex-direction:column;gap:8px;overflow:hidden" data-at="${i + 1}" data-fx="pop">
          <div class="v-t" style="font-size:29px">${qd.title}</div>
          ${qd.text ? `<div class="v-s" style="font-size:19px${qd.tone === 'indigo' ? ';color:#E8E7FD' : ''}">${qd.text}</div>` : ''}
        </div>`;
      }).join('')}`,
  };
}

/** Steps joined by arrows, left to right. says: [intro, one line per step]. */
export function flowScene({ name, heading, steps, says, loopBack = '' }) {
  const n = steps.length;
  const gap = 46;
  const w = Math.floor((1080 - gap * (n - 1)) / n);
  return {
    title: name,
    beats: says.map(line),
    html: `
      <h2 class="v-abs v-h v-h--md" style="left:100px;top:62px;width:1080px" data-fx="rise">${heading}</h2>
      ${steps.map((s, i) => `
        <div class="v-card${tone(s.tone)}" style="position:absolute;left:${100 + i * (w + gap)}px;top:220px;width:${w}px;height:300px;padding:22px;display:flex;flex-direction:column;gap:12px;overflow:hidden" data-at="${i + 1}" data-fx="pop">
          <span class="v-num" style="width:50px;height:50px;font-size:24px">${i + 1}</span>
          <div class="v-t" style="font-size:${w < 220 ? 24 : 28}px">${s.title}</div>
          ${s.text ? `<div class="v-s" style="font-size:${w < 220 ? 17 : 19}px">${s.text}</div>` : ''}
        </div>
        ${i < n - 1 ? `<svg class="v-abs" style="left:${100 + i * (w + gap) + w}px;top:350px" width="${gap}" height="40" viewBox="0 0 ${gap} 40" aria-hidden="true"><path d="M6 20 H${gap - 10} M${gap - 20} 10 L${gap - 8} 20 L${gap - 20} 30" fill="none" stroke="#14142B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" data-at="${i + 2}" data-dur="0.4" data-fx="draw"/></svg>` : ''}
      `).join('')}
      ${loopBack ? `<svg class="v-abs" style="left:100px;top:530px" width="1080" height="90" viewBox="0 0 1080 90" aria-hidden="true">
          <path d="M${1080 - w / 2} 6 V54 H${w / 2} V14" fill="none" stroke="#4F46E5" stroke-width="5" stroke-dasharray="14 10" stroke-linecap="round" data-at="${n}" data-d="0.8" data-dur="1.4" data-fx="fade"/>
          <path d="M${w / 2 - 12} 26 L${w / 2} 8 L${w / 2 + 12} 26" fill="none" stroke="#4F46E5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" data-at="${n}" data-d="1.8" data-fx="fade"/>
        </svg>
        <div class="v-abs v-lbl" style="left:${100 + w}px;top:596px;width:${1080 - 2 * w}px;text-align:center;color:#4F46E5" data-at="${n}" data-d="1.2" data-fx="fade">${esc(loopBack)}</div>` : ''}`,
  };
}

/** A continuous cycle of nodes around a ring. says: [intro, one line per node, (extra)]. */
export function cycleScene({ name, heading, nodes, says, center = '' }) {
  const n = nodes.length;
  const cx = 640, cy = 390, rx = 400, ry = 180;
  return {
    title: name,
    beats: says.map(line),
    html: `
      <h2 class="v-abs v-h v-h--md" style="left:100px;top:50px;width:1080px" data-fx="rise">${heading}</h2>
      <svg class="v-abs" style="left:0;top:0" width="1280" height="720" viewBox="0 0 1280 720" aria-hidden="true">
        <ellipse cx="${cx}" cy="${cy}" rx="${rx - 40}" ry="${ry - 20}" fill="none" stroke="#14142B" stroke-width="4" stroke-dasharray="16 12" data-loop="dash" data-d="0.3" data-fx="fade"/>
      </svg>
      ${center ? `<div class="v-abs" style="left:${cx - 180}px;top:${cy - 40}px;width:360px;text-align:center;font:700 30px/1.2 'Space Grotesk',sans-serif;color:#4F46E5" data-d="0.6" data-fx="pop">${center}</div>` : ''}
      ${nodes.map((nd, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
        return `<div class="v-card${tone(nd.tone)}" style="position:absolute;left:${Math.round(x - 160)}px;top:${Math.round(y - 58)}px;width:320px;min-height:116px;padding:14px 18px;display:flex;gap:12px;align-items:center" data-at="${i + 1}" data-fx="pop">
          <span class="v-num" style="width:46px;height:46px;font-size:22px">${i + 1}</span>
          <span style="display:flex;flex-direction:column"><span class="v-t" style="font-size:24px">${nd.title}</span>${nd.text ? `<span class="v-s" style="font-size:17px">${nd.text}</span>` : ''}</span>
        </div>`;
      }).join('')}`,
  };
}

/** Two columns compared. says: [intro, left, right, (extras)]. */
export function compareScene({ name, heading, left, right, says, footer = '' }) {
  const col = (c, at, x) => `<div class="v-card${tone(c.tone)}" style="position:absolute;left:${x}px;top:170px;width:520px;height:${footer ? 380 : 450}px;padding:28px 30px;display:flex;flex-direction:column;gap:14px" data-at="${at}" data-fx="pop">
      <span class="v-mono" style="font-size:20px;font-weight:600;color:${c.tone === 'indigo' ? '#E8E7FD' : '#4F46E5'}">${esc(c.tag || '')}</span>
      <div class="v-t" style="font-size:36px">${c.title}</div>
      <div style="display:flex;flex-direction:column;gap:10px">${c.items.map((it, k) => `<div class="v-s" style="font-size:22px;${c.tone === 'indigo' ? 'color:#fff;' : 'color:#14142B;'}" data-at="${at}" data-d="${0.5 + k * 0.5}" data-fx="left">• ${it}</div>`).join('')}</div>
    </div>`;
  return {
    title: name,
    beats: says.map(line),
    html: `
      <h2 class="v-abs v-h v-h--md" style="left:100px;top:62px;width:1080px" data-fx="rise">${heading}</h2>
      ${col(left, 1, 100)}${col(right, 2, 660)}
      ${footer ? `<div class="v-abs v-sticker" style="left:330px;top:586px;font-size:30px" data-at="3" data-fx="pop">${footer}</div>` : ''}`,
  };
}

/** A pyramid / stack, top layer first. says: [intro, one line per layer]. */
export function stackScene({ name, heading, layers, says }) {
  const n = layers.length;
  const h = Math.min(92, Math.floor((480 - 12 * (n - 1)) / n));
  return {
    title: name,
    beats: says.map(line),
    html: `
      <h2 class="v-abs v-h v-h--md" style="left:100px;top:56px;width:1080px" data-fx="rise">${heading}</h2>
      ${layers.map((l, i) => {
        const w = 640 + i * Math.floor(440 / Math.max(1, n - 1));
        return `<div class="v-card${tone(l.tone)}" style="position:absolute;left:${640 - w / 2}px;top:${166 + i * (h + 12)}px;width:${w}px;height:${h}px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:18px" data-at="${i + 1}" data-fx="rise">
          <span class="v-t" style="font-size:${h < 80 ? 24 : 28}px;white-space:nowrap">${l.title}</span>
          ${l.text ? `<span class="v-s" style="font-size:${h < 80 ? 17 : 19}px;text-align:right${l.tone === 'indigo' ? ';color:#E8E7FD' : ''}">${l.text}</span>` : ''}
        </div>`;
      }).join('')}`,
  };
}

/** Closing recap. says: ['Quick recap.', one per point, 'Now try…']. */
export function recapScene({ points, says }) {
  const s = rowsScene({ name: 'Recap', heading: 'Recap', items: points.map((p) => ({ title: p })), says, mark: 'tick' });
  s.html += `<div class="v-abs v-sticker" style="left:800px;top:600px;font-size:32px" data-at="${points.length + 1}" data-fx="pop">Mini quiz next ↓</div>`;
  return s;
}
