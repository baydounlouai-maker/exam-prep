import { titleScene, flowScene, cycleScene, compareScene, recapScene } from '../../assets/js/video.js';

export default {
  title: 'The strategy process',
  lead: 'Two ways to make a strategy: a **4-stage process** with a feedback loop, or a **continuous cycle** that never stops.',
  video: {
    scenes: [
      titleScene({
        eyebrow: 'E-Business · Chapter 5', title: 'The strategy<br>process', sub: 'Lesson 3 · <span class="v-hl">Process models</span>', badge: '3',
        chips: ['Generic model', 'Dynamic model'],
        says: ['Lesson three: how do you actually make a digital business strategy?', 'There are two models to know: the generic strategy process, and the dynamic model.'],
      }),
      flowScene({
        name: 'The generic model', heading: 'Generic strategy process <span style="font-size:28px;font-weight:500;color:#4A4A63">· Figure 5.5</span>',
        steps: [
          { title: 'Strategic analysis', text: 'external environment · internal resources' },
          { title: 'Strategic objectives', text: 'vision · mission · objectives', tone: 'tint' },
          { title: 'Strategy definition', text: 'option generation · evaluation · selection', tone: 'cream' },
          { title: 'Strategy implementation', text: 'planning · execution · control', tone: 'sun' },
        ],
        loopBack: 'monitoring, evaluation and response',
        says: [
          'The generic strategy process model has four stages.',
          'First, strategic analysis: look at the external environment and your internal resources.',
          'Second, strategic objectives: the vision, the mission and measurable objectives.',
          'Third, strategy definition: generate options, evaluate them and select the best.',
          { say: 'Fourth, strategy implementation: planning, execution and control. A monitoring, evaluation and response loop feeds results back into analysis.', hold: 1.2 },
        ],
      }),
      cycleScene({
        name: 'The dynamic model', heading: 'Dynamic model <span style="font-size:28px;font-weight:500;color:#4A4A63">· Kalakota &amp; Robinson</span>',
        center: 'A continuous cycle,<br>driven by events',
        nodes: [
          { title: 'Knowledge building', text: '& capability evaluation', tone: 'tint' },
          { title: 'Digital business design', text: 'the business goals' },
          { title: 'Digital business blueprint', text: 'planning the applications', tone: 'cream' },
          { title: 'Applications development', text: '& deployment', tone: 'sun' },
        ],
        says: [
          'Kalakota and Robinson\'s dynamic model turns the process into a continuous cycle.',
          'It starts with knowledge building and capability evaluation. Outside events feed in here.',
          'Key insights pass to digital business design, which sets the business goals.',
          'Key objectives pass to the digital business blueprint, which plans the applications.',
          { say: 'Priorities pass to applications development and deployment, and feedback loops back to knowledge building.', hold: 1 },
        ],
      }),
      compareScene({
        name: 'Generic vs dynamic', heading: 'Generic <span class="v-hl">vs</span> dynamic',
        left: { tag: 'FIGURE 5.5', title: 'Generic model', items: ['A staged sequence', 'Analysis → objectives → definition → implementation', 'Monitoring loop at the end'] },
        right: { tag: 'FIGURE 5.6', title: 'Dynamic model', tone: 'indigo', items: ['A continuous cycle', 'Driven by external events', 'Strategy is revised all the time'] },
        footer: 'Digital markets move fast',
        says: [
          'So what\'s the difference?',
          'The generic model is a staged sequence, with a monitoring loop at the end.',
          'The dynamic model never stops: external events and feedback keep revising the strategy.',
          'That suits digital markets, which change fast.',
        ],
      }),
      recapScene({
        points: ['Generic: analysis → objectives → definition → implementation.', 'Definition = generate, evaluate, select options.', 'Dynamic model: a continuous cycle driven by events.'],
        says: ['Quick recap.', 'The generic model runs analysis, objectives, definition and implementation, with a feedback loop.', 'Strategy definition means generating, evaluating and selecting options.', 'The dynamic model is a continuous cycle driven by events and feedback.', 'Now try the activities and the mini quiz below.'],
      }),
    ],
    checkpoints: [
      { after: 1, q: 'Option generation, evaluation and selection belong to which stage?', opts: ['Strategic analysis', 'Strategy definition', 'Strategy implementation'], answer: 1, why: 'Stage 3, strategy definition, is about choosing between options.' },
    ],
  },
  blocks: [
    {
      type: 'order',
      title: 'The four stages',
      short: 'Four stages',
      prompt: 'Tap the stages of the generic model in order.',
      steps: ['**Strategic analysis**', '**Strategic objectives**', '**Strategy definition**', '**Strategy implementation**'],
      done: 'A monitoring, evaluation and response loop runs from implementation back to analysis.',
    },
    {
      type: 'sort',
      title: 'What happens in each stage?',
      short: 'Inside each stage',
      prompt: 'which stage does this belong to?',
      buckets: [
        { id: 'a', label: 'Analysis' },
        { id: 'o', label: 'Objectives' },
        { id: 'd', label: 'Definition' },
        { id: 'i', label: 'Implementation' },
      ],
      items: [
        { text: 'Scan the external environment', b: 'a' },
        { text: 'Assess internal resources', b: 'a' },
        { text: 'Write the vision and mission', b: 'o' },
        { text: 'Set measurable objectives', b: 'o' },
        { text: 'Generate strategic options', b: 'd' },
        { text: 'Evaluate and select an option', b: 'd' },
        { text: 'Plan and execute the projects', b: 'i' },
        { text: 'Control: track results against plan', b: 'i' },
      ],
    },
    {
      type: 'cycle',
      title: 'The dynamic cycle',
      short: 'Dynamic model',
      intro: 'Kalakota and Robinson (2000). Press play to send the strategy round the loop.',
      input: 'Input: **external events** → knowledge building',
      hint: 'A continuous cycle: strategy is revised all the time.',
      nodes: [
        { name: 'Knowledge building', detail: 'Evaluate capabilities. **Events** from outside feed in here.' },
        { name: 'Digital business design', detail: 'Set the **business goals**.' },
        { name: 'Digital business blueprint', detail: '**Plan** the applications.' },
        { name: 'Applications development', detail: '**Build and deploy** the applications.' },
      ],
      links: ['key insights', 'key objectives', 'priorities', 'feedback'],
    },
    {
      type: 'flips',
      title: 'Generic or dynamic?',
      short: 'Compare',
      cards: [
        { front: 'Generic model', back: 'A **staged sequence** with a monitoring loop. Easy to explain and plan.' },
        { front: 'Dynamic model', back: 'A **continuous cycle** driven by events. Better when markets change fast.' },
        { front: 'Not purely sequential', back: 'Even in the generic model, stages **inform each other** (two-way arrows).' },
      ],
    },
    {
      type: 'sticky',
      title: 'Case-study tip',
      text: 'Asked to "recommend a process" for a fast-moving start-up? Argue for the **dynamic** model. For a big, stable firm, the **generic** model with regular reviews is fine.',
    },
  ],
  quiz: [
    {
      prompt: 'What is the FIRST stage of the generic strategy process model?',
      opts: ['Strategic objectives', 'Strategic analysis', 'Strategy definition', 'Strategy implementation'],
      answer: 1,
      why: 'You analyse the environment and resources before setting objectives.',
    },
    {
      prompt: 'Planning, execution and control make up which stage?',
      opts: ['Strategic analysis', 'Strategic objectives', 'Strategy definition', 'Strategy implementation'],
      answer: 3,
      why: 'Implementation = planning, execution and control.',
    },
    {
      prompt: 'In the dynamic model, what passes from digital business design to the blueprint?',
      opts: ['Key insights', 'Key objectives', 'Priorities', 'Feedback'],
      answer: 1,
      why: 'Insights → design → objectives → blueprint → priorities → development → feedback.',
    },
    {
      prompt: 'What links strategy implementation back to strategic analysis in the generic model?',
      opts: ['A monitoring, evaluation and response loop', 'A SWOT analysis', 'The vision statement', 'Nothing: it ends there'],
      answer: 0,
      why: 'Results are monitored and fed back into the next round of analysis.',
    },
    {
      prompt: '<strong>Mini case:</strong> A food-delivery start-up changes its plans every few months as new rivals and regulations appear. Which model fits best?',
      opts: ['The generic sequential model', 'Kalakota and Robinson\'s dynamic model', 'The capability maturity model', 'The VMOST model'],
      answer: 1,
      why: 'A continuous cycle driven by events suits a fast-changing market.',
    },
  ],
};
