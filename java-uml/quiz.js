import { initPage } from '../assets/js/common.js';
import { startExam } from '../assets/js/exam.js';

initPage();

// dia: draw a relationship between two classes. code: show Java. Otherwise text only.
const QUESTIONS = [
  { prompt: 'Which relationship is this?', dia: { rel: 'inheritance', left: 'Cat', right: 'Animal' },
    opts: ['Association', 'Inheritance', 'Realization', 'Dependency'], answer: 1,
    why: 'Solid line + hollow triangle = extends.' },
  { prompt: 'Car builds its own Engine. Which relationship?',
    code: ['class Car {', '    private final Engine engine = new Engine();', '}'],
    opts: ['Aggregation', 'Composition', 'Dependency', 'Realization'], answer: 1,
    why: 'Created inside and dies with the Car: composition (filled diamond).' },
  { prompt: 'Which relationship is this?', dia: { rel: 'realization', left: 'Robot', right: 'Movable', stereo: '«interface»' },
    opts: ['Inheritance', 'Dependency', 'Realization', 'Aggregation'], answer: 2,
    why: 'Dashed line + hollow triangle = implements an interface.' },
  { prompt: 'In a class box, what does <code># balance : double</code> mean?',
    opts: ['A public field', 'A private field', 'A protected field', 'A package field'], answer: 2,
    why: '# = protected: the class and its subclasses (plus the same package in Java).' },
  { prompt: 'Which relationship is this?', dia: { rel: 'aggregation', left: 'Library', right: 'Book' },
    opts: ['Composition', 'Association', 'Aggregation', 'Inheritance'], answer: 2,
    why: 'Hollow diamond: a Library has Books, but Books can exist alone.' },
  { prompt: 'Which relationship is this?', dia: { rel: 'dependency', left: 'Report', right: 'Printer' },
    opts: ['Association', 'Dependency', 'Realization', 'Composition'], answer: 1,
    why: 'Dashed line + open arrow: uses it briefly (a parameter or local variable).' },
  { prompt: 'Customer keeps a reference to an Address that lives elsewhere. Simplest correct line?',
    code: ['class Customer {', '    private Address address;', '}'],
    opts: ['Association', 'Dependency', 'Composition', 'Realization'], answer: 0,
    why: 'A field pointing to another class = association.' },
  { prompt: 'How is a <em>static</em> method shown in a class box?',
    opts: ['In italics', 'Underlined', 'With «static» above it', 'With a $ sign'], answer: 1,
    why: 'static = underlined. Italics mean abstract.' },
  { prompt: 'Which multiplicity means "one or more"?', mono: true,
    opts: ['0..1', '1', '1..*', '*'], answer: 2,
    why: '1..* = at least one, no upper limit.' },
  { prompt: 'Write this method in UML:', code: ['public List<String> getTags() { … }'], mono: true,
    opts: ['+ getTags() : List&lt;String&gt;', '+ List&lt;String&gt; getTags()', '- getTags() : List&lt;String&gt;', 'getTags() + List&lt;String&gt;'], answer: 0,
    why: 'Visibility, name(params), then : ReturnType.' },
];

startExam({
  topic: 'java-uml',
  questions: QUESTIONS,
  pass: 80,
  review: { href: 'relationships.html', label: 'Review arrows' },
});
