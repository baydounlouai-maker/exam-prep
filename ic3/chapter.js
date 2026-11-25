// Renders one IC3 chapter (chapter.html?c=N) from its data file.

import { renderLesson } from '../assets/js/course.js';
import { CHAPTERS } from './data/index.js';

renderLesson({
  topic: 'ic3',
  items: CHAPTERS,
  param: 'c',
  idPrefix: 'ch',
  siteTitle: 'IC3',
  eyebrow: (n, total) => `IC3 · Chapter ${n} of ${total}`,
});
