# Exam Lab

Exam prep in small, clickable pieces: short animated lessons, hands-on exercises and quizzes. No walls of text.

**Live site:** https://baydounlouai-maker.github.io/exam-prep/

## Topics

| # | Topic | Lessons |
|---|-------|---------|
| 1 | Java UML diagrams | The class box · Visibility symbols · Relationships · Multiplicity · Boss quiz |

Every lesson ends with a 3-question mini quiz. Finishing it marks the lesson done. The boss quiz clears the topic at 80%.
Progress is saved in your browser (localStorage), so it stays on that device only.

## Run it locally

It's plain HTML, CSS and JavaScript modules with no build step. Serve the folder with any static server (modules don't load from `file://`):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Project layout

```
index.html               Home page (topic list + progress)
assets/css/style.css     Shared styles and theme tokens (light + dark)
assets/js/common.js      Shared helpers: progress, theme, icons, Java highlighting, UML arrows, quiz runner
assets/js/lesson.js      End-of-lesson mini quiz
assets/js/topics.js      List of topics and lessons (edit this to add a topic)
assets/js/home.js        Home page logic
java-uml/                Topic 1: one .html + .js per lesson, plus quiz
```

## Adding a topic

1. Make a folder, e.g. `sql-joins/`, with one page per lesson. Copy a lesson from `java-uml/` as a starting point.
2. End each lesson with `lessonQuiz(topicId, lessonId, questions)` from `assets/js/lesson.js`.
3. Add the topic and its lessons to `TOPICS` in `assets/js/topics.js`. The home page picks it up automatically.

## Deploy

GitHub Pages serves the `main` branch from the repository root. Pushing to `main` publishes the site.
