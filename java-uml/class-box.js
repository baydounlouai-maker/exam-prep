import { initPage, codeBlock, $, $$, esc } from '../assets/js/common.js';
import { lessonQuiz } from '../assets/js/lesson.js';

initPage();

const TOPIC = 'java-uml';
const LESSON = 'class-box';

const CODE = [
  'public class Student {',
  '    private String name;',
  '    private int age;',
  '    protected double gpa;',
  '    private static int count;',
  '',
  '    public Student(String name) { … }',
  '    public String getName() { … }',
  '    void enroll(Course c) { … }',
  '}',
];

// Which code lines and which part of the UML box each step lights up.
const STEPS = [
  { label: 'Class name', lines: [0, 9], part: 'name', tip: 'Top floor = the class name. Abstract class? Write it in italics.' },
  { label: 'Attributes', lines: [1, 2, 3, 4], part: 'field', tip: 'Middle floor = fields, written  name : Type.' },
  { label: 'Operations', lines: [6, 7, 8], part: 'method', tip: 'Bottom floor = constructors and methods:  name(params) : ReturnType.' },
  { label: 'Visibility', lines: [1, 2, 3, 4, 6, 7, 8], vis: true, tip: 'The symbol in front says who can see it. No keyword in Java means ~ package.' },
  { label: 'Static', lines: [4], static: true, tip: 'static members are underlined. That\'s the whole rule.' },
];

$('#code').outerHTML = codeBlock(CODE, { file: 'Student.java', numbered: true });

const tabs = $('#tabs');
const dots = $('#dots');
let step = 0;
const seen = new Set();

tabs.innerHTML = STEPS.map((s, i) =>
  `<button class="tab" type="button" role="tab" aria-selected="false" data-step="${i}"><span class="tab__num">${i + 1}</span>${esc(s.label)}</button>`
).join('');
dots.innerHTML = STEPS.map(() => '<span></span>').join('');

function render() {
  const s = STEPS[step];
  seen.add(step);

  $$('.ln').forEach((ln) => {
    const on = s.lines.includes(Number(ln.dataset.line));
    ln.classList.toggle('is-hl', on);
    ln.classList.toggle('is-dim', !on);
  });
  $$('[data-part]').forEach((p) => p.classList.toggle('is-hl', p.dataset.part === s.part));
  $$('.uml .vis').forEach((v) => v.classList.toggle('is-hl', !!s.vis));
  const staticRow = $('[data-static]');
  staticRow.classList.toggle('is-hl', !!s.static);
  if (s.static) {
    staticRow.classList.remove('is-flash');
    void staticRow.offsetWidth;
    staticRow.classList.add('is-flash');
  }

  $$('.tab').forEach((t, i) => {
    t.setAttribute('aria-selected', String(i === step));
    t.classList.toggle('is-done', seen.has(i));
  });
  $$('#dots span').forEach((d, i) => {
    d.classList.toggle('is-on', i === step);
    d.classList.toggle('is-past', i < step);
  });

  const tip = $('#tip-text');
  tip.textContent = s.tip;
  tip.parentElement.classList.remove('rise');
  void tip.offsetWidth;
  tip.parentElement.classList.add('rise');

  $('#prev').disabled = step === 0;
  $('#next').textContent = step === STEPS.length - 1 ? 'Mini quiz' : 'Next';
}

tabs.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-step]');
  if (!btn) return;
  step = Number(btn.dataset.step);
  render();
});
$('#prev').addEventListener('click', () => { step = Math.max(0, step - 1); render(); });
$('#next').addEventListener('click', () => {
  if (step === STEPS.length - 1) {
    $('#check').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  step++;
  render();
});
render();

/* ---------- Mini quiz ---------- */

const QUESTIONS = [
  {
    prompt: 'Turn this field into UML:',
    code: ['private double price;'],
    mono: true,
    opts: ['- price : double', '+ price : double', '- double price', 'price : double'],
    answer: 0,
    why: 'private → "-", then name : Type.',
  },
  {
    prompt: 'And this method?',
    code: ['public boolean isEmpty() { … }'],
    mono: true,
    opts: ['+ boolean isEmpty()', '+ isEmpty() : boolean', '- isEmpty() : boolean', '+ isEmpty : boolean'],
    answer: 1,
    why: 'public → "+", return type goes after the colon.',
  },
  {
    prompt: 'How do you draw this one?',
    code: ['public static int total() { … }'],
    mono: true,
    opts: ['<i>+ total() : int</i>', '+ static total() : int', '<u>+ total() : int</u>', '+ total() : static int'],
    answer: 2,
    why: 'static = underlined. Italics are for abstract.',
  },
];

lessonQuiz(TOPIC, LESSON, QUESTIONS);
