// IC3 mock exam: every chapter's mini quiz plus extra questions, 25 drawn at random.

import { initPage } from '../assets/js/common.js';
import { startExam } from '../assets/js/exam.js';
import { CHAPTERS } from './data/index.js';

initPage();

// Extra questions that only appear in the mock exam (n = chapter number).
const EXTRA = [
  { n: 1, prompt: 'Which Windows feature lets you choose SEVERAL options in a dialog box?', opts: ['Radio buttons', 'Check boxes', 'Drop-down list', 'Command button'], answer: 1, why: 'Check boxes allow many choices; radio buttons only one.' },
  { n: 1, prompt: 'What are Linux versions called?', opts: ['Editions', 'Distributions', 'Service packs', 'Builds'], answer: 1, why: 'Ubuntu, Knoppix and Gentoo are Linux distributions.' },
  { n: 1, prompt: 'Which touch gesture does the same job as a right-click?', opts: ['Tap', 'Double-tap', 'Long press', 'Swipe'], answer: 2, why: 'Press and hold shows a shortcut menu.' },
  { n: 2, prompt: 'How many KB are in 1 MB?', opts: ['100', '1000', '1024', '8'], answer: 2, why: 'Storage units climb by 1024.' },
  { n: 2, prompt: 'Which computer usually has the GREATEST storage capacity?', opts: ['Chromebook', 'Tablet', 'Server', 'Smart phone'], answer: 2, why: 'Servers store data for many other computers.' },
  { n: 2, prompt: 'What identifies a GSM phone to its carrier network?', opts: ['The SIM card', 'The lock screen', 'A widget', 'Bluetooth'], answer: 0, why: 'The SIM card holds your subscriber identity.' },
  { n: 2, prompt: 'Which part converts AC power from the wall into DC?', opts: ['CPU', 'Power supply', 'Motherboard', 'RAM'], answer: 1, why: 'The power supply feeds low-voltage DC to the parts.' },
  { n: 3, prompt: 'Which two frequency bands does Wi-Fi use?', opts: ['88 MHz and 206 MHz', '2.4 GHz and 5 GHz', '800 MHz and 1.2 GHz', '1 GHz and 3 GHz'], answer: 1, why: 'Wireless LANs use 2.4 GHz and 5 GHz.' },
  { n: 3, prompt: 'Which of these is a PRIVATE network?', opts: ['The Internet', 'Your company\'s LAN', 'The telephone network', 'Your carrier\'s cell network'], answer: 1, why: 'LANs are private; WANs are public.' },
  { n: 3, prompt: 'Your modem has one port and no Wi-Fi. What lets your laptop, tablet and phone share the connection?', opts: ['A wireless broadband router', 'A network printer', 'A satellite dish', 'A second modem'], answer: 0, why: 'A wireless router shares one Internet connection with many devices.' },
  { n: 4, prompt: 'Which key renames a selected file?', opts: ['F1', 'F2', 'F4', 'F9'], answer: 1, why: 'F2 = rename.' },
  { n: 4, prompt: 'Where are files you download from the Internet saved by default?', opts: ['Desktop', 'Documents', 'Downloads', 'Pictures'], answer: 2, why: 'The Downloads folder.' },
  { n: 4, prompt: 'Which folder shares files with every user account on the same PC?', opts: ['Public', 'Documents', 'Downloads', 'Recycle Bin'], answer: 0, why: 'Files in Public are available to all users.' },
  { n: 5, prompt: 'What warns you before a program makes admin-level changes?', opts: ['EULA', 'UAC', 'SMS', 'CRM'], answer: 1, why: 'User Account Control.' },
  { n: 5, prompt: 'What did SMS messages originally limit you to?', opts: ['16 characters', '160 characters', '160 KB', '16 MB'], answer: 1, why: 'Classic SMS = 160 characters.' },
  { n: 6, prompt: 'Which access levels can you give someone on a shared Google Drive file?', opts: ['Can delete, edit, comment', 'Can edit, comment, view', 'Can share, edit, view', 'Can copy, download, comment'], answer: 1, why: 'Editor, commenter or viewer.' },
  { n: 6, prompt: 'What are the two parts of a Learning Management System?', opts: ['Email and content', 'Server and user interface', 'Content and assessment', 'Database and printer'], answer: 1, why: 'The server runs in the cloud; the interface runs in your browser.' },
  { n: 7, prompt: 'Claudia joins Wi-Fi at the airport. How should she label it?', opts: ['Home network', 'Work network', 'Public network', 'Private network'], answer: 2, why: 'Always mark hotspots as Public.' },
  { n: 7, prompt: 'Which protocol shows a site is secure for paying online?', opts: ['HTTP', 'HTTPS', 'FTP', 'SMTP'], answer: 1, why: 'HTTPS encrypts the connection; look for the lock icon.' },
  { n: 7, prompt: 'A restore point does NOT include…', opts: ['Your personal files', 'Program files', 'Registry settings', 'System files'], answer: 0, why: 'Restore points cover system files, programs and the registry, not your documents.' },
  { n: 7, prompt: 'With differential backups, what do you need to restore on Saturday?', opts: ['Only Friday\'s backup', 'The full backup + the last differential', 'The full backup + every differential', 'Only the full backup'], answer: 1, why: 'Each differential already holds every change since the full backup.' },
  { n: 7, prompt: 'Tricking a guard into letting you into a building is called…', opts: ['Phishing', 'Social engineering', 'Hacking', 'Spyware'], answer: 1, why: 'Social engineering targets people, not computers.' },
];

const bank = [
  ...CHAPTERS.flatMap((ch, i) => ch.quiz.map((q) => ({ ...q, chapter: `Ch ${i + 1} · ${ch.title}` }))),
  ...EXTRA.map(({ n, ...q }) => ({ ...q, chapter: `Ch ${n} · ${CHAPTERS[n - 1].title}` })),
];

startExam({
  topic: 'ic3',
  questions: bank,
  count: 25,
  pass: 70,
  lessonId: 'exam',
  review: { href: 'chapter.html?c=1', label: 'Review chapters' },
});
