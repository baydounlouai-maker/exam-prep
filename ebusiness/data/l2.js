import { titleScene, stackScene, compareScene, cardsScene, rowsScene, recapScene } from '../../assets/js/video.js';

export default {
  title: 'Where digital strategy fits',
  lead: 'Digital business strategy sits **inside** the company\'s other strategies, on the **sell-side** and the **buy-side**.',
  video: {
    scenes: [
      titleScene({
        eyebrow: 'E-Business · Chapter 5', title: 'Where digital<br>strategy fits', sub: 'Lesson 2 · <span class="v-hl">Sell-side, buy-side</span>', badge: '2',
        chips: ['Hierarchy', 'Sell-side', 'Buy-side'],
        says: ['Lesson two: where does digital business strategy fit in a company?', 'We\'ll look at the strategy hierarchy, then the sell-side and the buy-side.'],
      }),
      stackScene({
        name: 'The strategy hierarchy', heading: 'Forms of <span class="v-hl">organisational strategy</span>',
        layers: [
          { title: 'Corporate strategy', text: 'sits at the top and drives the rest', tone: 'indigo' },
          { title: 'Business unit strategies', text: 'one per business unit' },
          { title: 'Regional strategies', text: 'one per market or region' },
          { title: 'Functional strategies', text: 'marketing, IS, supply chain…', tone: 'tint' },
        ],
        says: [
          'Most organisations plan strategy in levels.',
          'Corporate strategy sits at the top and drives everything below it.',
          'It shapes the strategy of each business unit,',
          'each region,',
          'and each function, such as marketing, information systems or the supply chain.',
        ],
      }),
      compareScene({
        name: 'Sell-side vs buy-side', heading: 'Two sides of <span class="v-hl">e-commerce strategy</span>',
        left: { tag: 'SELL-SIDE · marketing / CRM', title: 'A channel strategy', tone: 'cream', items: ['Driven by online contribution targets', 'Hit leads and sales targets', 'Pick products, audiences, partners'] },
        right: { tag: 'BUY-SIDE · supply chain (SCM)', title: 'Efficiency + service', tone: 'tint', items: ['Driven by operational efficiency KPIs', 'Automate internal processes', 'Link to suppliers\' purchasing systems'] },
        footer: 'Channels thrive on differentials',
        says: [
          'E-commerce strategy has two sides.',
          'Sell-side is a channel strategy, also called digital marketing or CRM strategy. Targets for online contribution drive it: leads, sales, conversion and retention.',
          'Buy-side is supply chain management strategy. Operational efficiency KPIs drive it: automate processes and link up with suppliers, while improving customer service.',
          { say: 'A channel thrives on differentials, reasons to use it like price or convenience, but you must manage channel integration.', hold: 0.8 },
        ],
      }),
      cardsScene({
        name: 'How the strategies connect', heading: 'Digital strategy <span class="v-hl">connects</span> them all', cols: 2, height: 200,
        items: [
          { tag: '↓ objectives · ↑ constraints & opportunities', title: 'Corporate strategy', text: 'Passes objectives down. Digital strategy feeds back what\'s possible.', tone: 'indigo' },
          { tag: 'BUY-SIDE', title: 'Supply chain (SCM) strategy', text: 'Buy-side e-commerce.' },
          { tag: 'SELL-SIDE', title: 'Marketing / CRM strategy', text: 'Sell-side e-commerce.', tone: 'cream' },
          { tag: 'SUPPORTS ALL', title: 'Information systems strategy', text: 'The technology underneath everything.', tone: 'tint' },
        ],
        says: [
          'So how does digital business strategy connect to the rest?',
          'With corporate strategy it\'s a two-way link: objectives come down, and digital strategy feeds back constraints and opportunities.',
          'It links to supply chain strategy, the buy-side,',
          'to marketing and CRM strategy, the sell-side,',
          'and information systems strategy supports them all.',
        ],
      }),
      rowsScene({
        name: 'No strategy?', heading: 'What if there\'s <span class="v-hl">no</span> digital strategy?',
        items: [
          { title: 'Missed opportunities', text: 'lost online sales, less efficient purchasing' },
          { title: 'Falling behind competitors', text: 'and finding it hard to catch up (think Tesco or Dell online)' },
          { title: 'Poor customer experience', text: 'from channels that don\'t join up' },
        ],
        says: [
          'What happens when a company has no digital business strategy?',
          'It misses opportunities: extra sales on the sell-side and cheaper buying on the buy-side.',
          'It falls behind competitors online, and catching up gets hard.',
          'And customers get a poor experience from channels that aren\'t integrated.',
        ],
      }),
      recapScene({
        points: ['Corporate strategy drives business unit, regional and functional strategies.', 'Sell-side = channel strategy (targets). Buy-side = SCM (efficiency).', 'No digital strategy: missed chances, falling behind, poor experience.'],
        says: ['Quick recap.', 'Corporate strategy drives the business unit, regional and functional strategies.', 'Sell-side is a channel strategy driven by targets. Buy-side is supply chain strategy driven by efficiency.', 'And without a digital strategy you miss chances, fall behind and frustrate customers.', 'Now try the activities and the mini quiz below.'],
      }),
    ],
    checkpoints: [
      { after: 2, q: 'What should drive a BUY-SIDE e-commerce strategy?', opts: ['Online sales targets', 'Operational efficiency KPIs', 'Social media followers'], answer: 1, why: 'Buy-side = supply chain: efficiency KPIs, plus customer service quality.' },
    ],
  },
  blocks: [
    {
      type: 'stack',
      title: 'The strategy hierarchy',
      short: 'Hierarchy',
      intro: 'Tap each level.',
      hint: 'Corporate strategy drives the levels below it.',
      layers: [
        { name: 'Corporate strategy', eg: 'the whole organisation', detail: 'Sits at the **top** and drives every other strategy.' },
        { name: 'Business unit strategies', eg: 'one per unit', detail: 'Each business unit plans how it supports corporate goals.' },
        { name: 'Regional strategies', eg: 'one per market', detail: 'Adapts the plan to each **region or country**.' },
        { name: 'Functional strategies', eg: 'marketing, IS, SCM…', detail: 'Each function (marketing, information systems, supply chain) has its own strategy. **Digital business strategy** works across them.' },
      ],
    },
    {
      type: 'sort',
      title: 'Sell-side or buy-side?',
      short: 'Sell vs buy',
      intro: '**Sell-side** faces customers (marketing/CRM). **Buy-side** faces suppliers (supply chain management).',
      prompt: 'which side of the strategy?',
      buckets: [{ id: 's', label: 'Sell-side', hint: 'customers' }, { id: 'b', label: 'Buy-side', hint: 'suppliers' }],
      items: [
        { text: 'Hit online leads and sales targets', b: 's' },
        { text: 'Decide which products to sell through the online channel', b: 's' },
        { text: 'Communicate the benefits of buying online', b: 's' },
        { text: 'Improve acquisition, conversion and retention', b: 's', why: 'Channel targets: acquisition, conversion, retention, service, profitability.' },
        { text: 'Automate internal processes', b: 'b' },
        { text: 'Link internal systems with suppliers\' purchasing systems', b: 'b' },
        { text: 'Create a roadmap of supply chain applications', b: 'b' },
        { text: 'Choose which suppliers collaborate through the channel', b: 'b' },
      ],
    },
    {
      type: 'explorer',
      title: 'How digital strategy connects',
      short: 'Connections',
      intro: 'Tap each link (based on Figure 5.3).',
      items: [
        { name: 'Corporate strategy', tag: 'two-way', points: ['Passes **objectives** down to digital strategy', 'Digital strategy feeds back **constraints and opportunities**'] },
        { name: 'Supply chain (SCM)', tag: 'buy-side', points: ['Buy-side e-commerce lives here', 'Goal: **efficiency** plus better customer service'] },
        { name: 'Marketing / CRM', tag: 'sell-side', points: ['Sell-side e-commerce lives here', 'Goal: hit **online contribution** targets'] },
        { name: 'Information systems', tag: 'supports all', points: ['The technology base that **supports** every other strategy'] },
      ],
    },
    {
      type: 'flips',
      title: 'No digital strategy? Three costs',
      short: 'No strategy',
      cards: [
        { front: 'Missed opportunities', back: 'Lost **sales** on the sell-side and less **efficient buying** on the buy-side.' },
        { front: 'Falling behind', back: 'Competitors deliver online services first, and it gets **hard to catch up** (e.g. Tesco, Dell).' },
        { front: 'Poor experience', back: 'Customers suffer when channels **aren\'t integrated**.' },
      ],
    },
    {
      type: 'sticky',
      title: 'Case-study tip',
      text: 'If a case says the website, stores and call centre "don\'t talk to each other", that\'s a **channel integration** problem and a sign of **no digital business strategy**.',
    },
  ],
  quiz: [
    {
      prompt: 'Which strategy sits at the top and drives the others?',
      opts: ['Functional strategy', 'Corporate strategy', 'Regional strategy', 'Digital marketing strategy'],
      answer: 1,
      why: 'Corporate strategy drives business unit, regional and functional strategies.',
    },
    {
      prompt: 'Sell-side e-commerce strategy is best described as…',
      opts: ['A supply chain strategy', 'A channel strategy', 'An HR strategy', 'A financial strategy'],
      answer: 1,
      why: 'It\'s a channel strategy, driven by online contribution targets.',
    },
    {
      prompt: '<strong>Mini case:</strong> SteelCo wants to cut purchasing costs by linking its stock system to suppliers\' ordering systems. Which side is this?',
      opts: ['Sell-side', 'Buy-side', 'Neither', 'Corporate strategy only'],
      answer: 1,
      why: 'Linking with suppliers to gain efficiency is buy-side (SCM) strategy.',
    },
    {
      prompt: 'Between corporate strategy and digital business strategy, what flows UP from digital strategy?',
      opts: ['Objectives', 'Constraints and opportunities', 'Budgets', 'Job descriptions'],
      answer: 1,
      why: 'Objectives come down; constraints and opportunities go back up.',
    },
    {
      prompt: '<strong>Mini case:</strong> A retailer\'s online prices differ from its stores and online orders can\'t be returned in store. Customers complain. What\'s the main issue?',
      opts: ['Too many differentials', 'Poor channel integration', 'A sustaining innovation', 'Too much automation'],
      answer: 1,
      why: 'Channels that don\'t join up give a poor customer experience.',
    },
  ],
};
