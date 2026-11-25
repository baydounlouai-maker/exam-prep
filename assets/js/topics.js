// Every course on the site. To add a course: create its folder of pages and add an entry here.
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
      { id: 'quiz', n: '★', title: 'Boss quiz', desc: 'Ten mixed questions. Score 80% to clear the course.', href: 'java-uml/quiz.html', boss: true },
    ],
  },
  {
    id: 'ic3',
    title: 'IC3 · Computing Fundamentals',
    blurb: 'Chapters 1–7: operating systems, hardware, networks, files, software, cloud and security.',
    lessons: [
      { id: 'ch1', n: '1', title: 'Operating Systems', desc: 'What the OS does, power options, settings and updates.', href: 'ic3/chapter.html?c=1' },
      { id: 'ch2', n: '2', title: 'Hardware', desc: 'Bits and bytes, what\'s inside the box, devices and computer types.', href: 'ic3/chapter.html?c=2' },
      { id: 'ch3', n: '3', title: 'Networks & Mobile', desc: 'LAN vs WAN, routers and modems, Wi-Fi, broadband and cellular.', href: 'ic3/chapter.html?c=3' },
      { id: 'ch4', n: '4', title: 'File Management', desc: 'Drives, paths, permissions, shortcuts, extensions and wildcards.', href: 'ic3/chapter.html?c=4' },
      { id: 'ch5', n: '5', title: 'Software', desc: 'Licences, installing and removing, app stores and messaging.', href: 'ic3/chapter.html?c=5' },
      { id: 'ch6', n: '6', title: 'Cloud Computing', desc: 'SaaS, PaaS, IaaS, cloud drives, sharing, LMS and CRM.', href: 'ic3/chapter.html?c=6' },
      { id: 'ch7', n: '7', title: 'Security & Maintenance', desc: 'Passwords, malware, firewalls, phishing and backups.', href: 'ic3/chapter.html?c=7' },
      { id: 'exam', n: '★', title: 'Mock exam', desc: '25 random questions from all seven chapters. 70% to pass.', href: 'ic3/exam.html', boss: true },
    ],
  },
  {
    id: 'ebusiness',
    title: 'E-Business · Digital business strategy',
    blurb: 'Chaffey Chapter 5: video lessons, the key models, and case-study practice.',
    extras: [{ label: 'Cheat sheet', href: 'ebusiness/cheatsheet.html' }],
    lessons: [
      { id: 'l1', n: '1', title: 'Strategy & disruption', desc: 'Porter, definitions of strategy, disruptive innovation, growth and platforms.', href: 'ebusiness/lesson.html?l=1' },
      { id: 'l2', n: '2', title: 'Where digital strategy fits', desc: 'The strategy hierarchy, sell-side vs buy-side, and what goes wrong without one.', href: 'ebusiness/lesson.html?l=2' },
      { id: 'l3', n: '3', title: 'The strategy process', desc: 'The generic 4-stage model and the dynamic cycle.', href: 'ebusiness/lesson.html?l=3' },
      { id: 'l4', n: '4', title: 'Where are we now?', desc: 'Situation analysis, the stage model, capability maturity, drivers and barriers.', href: 'ebusiness/lesson.html?l=4' },
      { id: 'l5', n: '5', title: 'Analysis matrices', desc: 'Portfolio analysis, SWOT/TOWS, Perrott and competitive threats.', href: 'ebusiness/lesson.html?l=5' },
      { id: 'l6', n: '6', title: 'Setting objectives', desc: 'VMOST, SMART, conversion modelling and KPIs.', href: 'ebusiness/lesson.html?l=6' },
      { id: 'l7', n: '7', title: 'Choosing & implementing', desc: 'Eight decisions, P1–P4 priorities, Ansoff growth and bricks to clicks.', href: 'ebusiness/lesson.html?l=7' },
      { id: 'final', n: '★', title: 'Case-study final', desc: 'Unseen-style cases: diagnose, apply the models, write and self-mark. 60% to pass.', href: 'ebusiness/case.html', boss: true },
    ],
  },
];

/** Placeholder cards shown under the live courses. */
export const COMING_SOON = ['Next course'];

export const topicById = (id) => TOPICS.find((t) => t.id === id);

/** Previous / next lesson inside a course, for the buttons at the end of each lesson. */
export function lessonNeighbours(topicId, lessonId) {
  const lessons = topicById(topicId).lessons;
  const i = lessons.findIndex((l) => l.id === lessonId);
  return { prev: lessons[i - 1] || null, next: lessons[i + 1] || null, index: i, total: lessons.length };
}
