// Every topic on the site. To add a topic: create its folder of pages and add an entry here.
// `href` is relative to the site root.

export const TOPICS = [
  {
    id: 'java-uml',
    title: 'Java UML diagrams',
    blurb: 'Class boxes, visibility, the six arrows and multiplicity.',
    lessons: [
      { id: 'class-box', n: '1', title: 'The class box', desc: 'Name, fields, methods: the three floors of every class.', href: 'java-uml/class-box.html' },
      { id: 'visibility', n: '2', title: 'Visibility symbols', desc: '+  -  #  ~ : who is allowed to touch what.', href: 'java-uml/visibility.html' },
      { id: 'relationships', n: '3', title: 'Relationships', desc: 'Six arrows, six meanings. Watch each one draw itself.', href: 'java-uml/relationships.html' },
      { id: 'multiplicity', n: '4', title: 'Multiplicity', desc: '1, 0..1, * : how many sit on each end of a line.', href: 'java-uml/multiplicity.html' },
      { id: 'quiz', n: '★', title: 'Boss quiz', desc: 'Ten mixed questions. Score 80% to clear the topic.', href: 'java-uml/quiz.html', boss: true },
    ],
  },
];

/** Placeholder cards shown under the live topics. */
export const COMING_SOON = ['Next topic', 'Another topic'];

export const topicById = (id) => TOPICS.find((t) => t.id === id);

/** Previous / next lesson inside a topic, for the buttons at the end of each lesson. */
export function lessonNeighbours(topicId, lessonId) {
  const lessons = topicById(topicId).lessons;
  const i = lessons.findIndex((l) => l.id === lessonId);
  return { prev: lessons[i - 1] || null, next: lessons[i + 1] || null, index: i, total: lessons.length };
}
