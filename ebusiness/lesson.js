// Renders one E-Business lesson (lesson.html?l=N): video, interactive blocks, mini quiz.

import { renderLesson } from '../assets/js/course.js';
import { mountVideo } from '../assets/js/video.js';
import { LESSONS } from './data/index.js';

renderLesson({
  topic: 'ebusiness',
  items: LESSONS,
  param: 'l',
  idPrefix: 'l',
  siteTitle: 'E-Business',
  eyebrow: (n, total) => `E-Business · Ch 5 Digital business strategy · Lesson ${n} of ${total}`,
  video: (el, lesson) => mountVideo(el, {
    scenes: lesson.video.scenes,
    checkpoints: lesson.video.checkpoints,
    label: `Lesson video: ${lesson.title}`,
    onQuiz: () => document.getElementById(lesson.blocks.length ? 'blocks' : 'check').scrollIntoView({ behavior: 'smooth' }),
  }),
});
