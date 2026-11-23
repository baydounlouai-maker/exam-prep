# Exam Lab

Exam prep in small, clickable pieces: short animated lessons, hands-on exercises and quizzes. No walls of text.

**Live site:** https://baydounlouai-maker.github.io/exam-prep/

## Courses

| # | Course | Lessons |
|---|--------|---------|
| 1 | Java UML diagrams | The class box · Visibility symbols · Relationships · Multiplicity · Boss quiz |
| 2 | IC3 GS5 · Computing Fundamentals | Ch 1 Operating Systems · Ch 2 Hardware · Ch 3 Networks & Mobile · Ch 4 File Management · Ch 5 Software · Ch 6 Cloud Computing · Ch 7 Security & Maintenance · Mock exam |

Every lesson ends with a mini quiz. Finishing it marks the lesson done. The Java boss quiz clears at 80%; the IC3 mock exam draws 25 random questions and passes at 70% (like 700/1000).
Answer order is shuffled every time. Progress is saved in your browser (localStorage), so it stays on that device only.

## Run it locally

It's plain HTML, CSS and JavaScript modules with no build step. Serve the folder with any static server (modules don't load from `file://`):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Project layout

```
index.html               Home page (course list + progress)
assets/css/style.css     Shared styles and theme tokens (light + dark)
assets/js/common.js      Shared helpers: progress, theme, icons, Java highlighting, UML arrows, quiz runner
assets/js/lesson.js      End-of-lesson mini quiz
assets/js/exam.js        End-of-course exam (streaks, score ring, review list)
assets/js/topics.js      List of courses and lessons (edit this to add a course)
assets/js/home.js        Home page logic
java-uml/                Course 1: one hand-built .html + .js per lesson, plus the boss quiz
ic3/                     Course 2: data-driven chapters
  chapter.html/.js       One page renders any chapter: chapter.html?c=1 … ?c=7
  widgets.js, ic3.css    Reusable interactive blocks (see below)
  data/ch1.js … ch7.js   Chapter content and mini quizzes
  exam.html/.js          Mock exam
```

## Adding a course

The quickest way is the data-driven style used by `ic3/`:

1. Copy `ic3/` to a new folder and replace `data/ch*.js` with your chapters.
2. Each chapter is `{ title, lead, blocks: [...], quiz: [...] }`. Block types available in `widgets.js`:
   `explorer` (pick a chip, see details), `flips` (flip cards), `sort` (tap the right bucket),
   `order` (tap steps in sequence), `bars` (animated comparison), `stack` (layers),
   `path` (hops between boxes), `tree` (folder tree → path), `wildcard`, `units`, `backup`, `password`, `sticky`.
3. Add the course and its lessons to `TOPICS` in `assets/js/topics.js`. The home page picks it up automatically.

## Deploy

GitHub Pages serves the `main` branch from the repository root. Pushing to `main` publishes the site.
