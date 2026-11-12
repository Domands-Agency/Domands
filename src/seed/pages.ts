import { both, call, faqs, link, quiz, steps, table, wa, type Doc } from './helpers'

const cta = (heading: string, line = '', buttons = both()) => ({ blockType: 'cta', heading, line, buttons })

/** Price rows: [label, price, time, serviceSlug?] */
const priceGroups: [string, [string, string, string, string?][]][] = [
  [
    'Websites',
    [
      ['Launch Website (5 pages)', '35,000', '2 weeks', 'website-design'],
      ['Business Website (up to 12 pages)', '75,000', '3–4 weeks', 'website-design'],
      ['Website Redesign', '35,000', '2–5 weeks', 'website-design'],
      ['Landing Page', '18,000', '1 week', 'landing-pages'],
      ['Website Care Plan', '6,000/month', 'Monthly', 'website-design'],
    ],
  ],
  [
    'Online shops and systems',
    [
      ['Shopify Online Store', '60,000', '2–3 weeks', 'ecommerce-website'],
      ['Custom Online Shop with M-Pesa', '165,000', '6–8 weeks', 'ecommerce-website'],
      ['M-Pesa Payments on your website', '20,000', '1 week', 'web-systems'],
      ['Booking & Appointments system', '45,000', '2–3 weeks', 'web-systems'],
      ['Event Registration & Ticketing', '85,000', '3–4 weeks', 'web-systems'],
    ],
  ],
  [
    'Marketing',
    [
      ['Google Ads Management', '20,000/month', 'Monthly', 'digital-advertising'],
      ['Social Media Ads', '25,000/month', 'Monthly', 'digital-advertising'],
      ['Email & SMS Marketing', '16,000/month', 'Monthly', 'digital-advertising'],
      ['Social Media Management', '25,000/month', 'Monthly', 'social-media-management'],
      ['WhatsApp Business Setup', '8,000', '2–3 days', 'whatsapp-marketing'],
      ['WhatsApp Chatbot', '45,000', '3 weeks', 'whatsapp-marketing'],
      ['WhatsApp Marketing', '18,000/month', 'Monthly', 'whatsapp-marketing'],
    ],
  ],
  [
    'Get found',
    [
      ['SEO Audit', '15,000', '1 week', 'seo'],
      ['Local SEO Setup (Google Maps)', '18,000', '1–2 weeks', 'seo'],
      ['SEO Monthly', '35,000/month', 'Monthly', 'seo'],
      ['AI Search Optimisation (AEO)', '30,000', '2–3 weeks', 'seo'],
    ],
  ],
  [
    'Brand and content',
    [
      ['Logo Design', '12,000', '1 week', 'branding'],
      ['Visual Identity System', '45,000', '3 weeks', 'branding'],
      ['Full Brand Identity', '120,000', '5–6 weeks', 'branding'],
      ['Company Profile Design', '25,000', '2 weeks', 'branding'],
      ['Blog Article', '6,000', '3–5 days', 'content-creation'],
      ['Short-form Video', '8,000', '2–3 days', 'content-creation'],
      ['Content Retainer', '38,000/month', 'Monthly', 'content-creation'],
    ],
  ],
  [
    'Strategy and events',
    [
      ['Strategy Workshop', '20,000', '1 week', 'marketing-strategy'],
      ['Digital Marketing Strategy', '60,000', '3–4 weeks', 'marketing-strategy'],
      ['Webinar Setup', '20,000', '1 week', 'events-webinars'],
      ['Full Webinar Package', '65,000', '3–4 weeks', 'events-webinars'],
    ],
  ],
]

export const pages: Doc[] = [
  {
    slug: 'home',
    title: 'Home',
    seo: {
      title: 'Domands Creative | Websites, Branding & Digital Marketing in Kenya',
      description: 'Websites from KES 35,000, brands, WhatsApp and social media marketing for Kenyan businesses. Clear prices, real timelines. Get in touch today.',
    },
    layout: [
      {
        blockType: 'hero',
        heading: 'Websites, brands and marketing that bring in customers.',
        sub: 'We build your website, shape your brand and run your marketing, with clear prices, real timelines and M-Pesa built in when you need it.',
        buttons: [wa(), quiz('Check your digital health in 3 minutes')],
        note: '[Number] Kenyan businesses served · [Client logo strip]',
      },
      {
        blockType: 'list',
        source: 'services',
        heading: 'Everything your business needs to grow online, from one team.',
        footerButtons: [link('See all services and prices →', '/services/')],
      },
      {
        blockType: 'cards',
        heading: 'Why businesses choose Domands',
        columns: '4',
        cards: [
          { title: 'Prices you can plan around.', text: 'Every service has a published starting price. You know the cost before we start.' },
          { title: 'Built for how Kenya buys.', text: 'M-Pesa payments, WhatsApp enquiries and Google Maps listings are part of the work, not extras.' },
          { title: 'One team, not five suppliers.', text: 'Your website, brand and marketing come from the same people, so everything matches.' },
          { title: 'Reports in plain language.', text: 'Every month you see what happened, what it cost and what we do next.' },
        ],
      },
      {
        blockType: 'steps',
        heading: 'How we work',
        steps: steps([
          ['Talk', 'A 20-minute call or WhatsApp chat about your goals.'],
          ['Plan', 'A written scope with price and timeline, before you pay anything.'],
          ['Build', 'We design, build and check in at agreed milestones.'],
          ['Launch and grow', 'We go live, train your team and keep improving.'],
        ]),
      },
      { blockType: 'list', source: 'industries', heading: 'We know your industry.' },
      {
        blockType: 'list',
        source: 'case-studies',
        heading: "Work we're proud of.",
        limit: 3,
        empty: '[Three case-study cards: client name, project, one result in numbers] · [Client quote with name, role, business]',
      },
      {
        blockType: 'cards',
        heading: 'Not sure where to start?',
        columns: '2',
        cards: [
          {
            title: 'Digital Health Check',
            text: 'Answer 11 quick questions and see where your business is strong online, and what to fix first.',
            buttons: [quiz('Take the 3-minute check')],
          },
          {
            title: 'Free strategy call',
            text: 'Each week one of our founders gives a free 45-minute strategy call to one business. No sales pitch.',
            buttons: [link("Book this week's call", '/free-strategy-call/')],
          },
        ],
      },
      {
        blockType: 'list',
        source: 'posts',
        heading: 'Practical advice for growing online.',
        limit: 3,
        empty: 'Our first articles are on the way: [How much does a website cost in Kenya in 2026?] · [How private clinics in Kenya get found on Google Maps] · [WhatsApp Business app or API?]',
        footerButtons: [link('All insights →', '/insights/')],
      },
      cta("Let's build something that brings in customers.", 'Tell us about your business on WhatsApp. We reply within [one working day].'),
    ],
  },

  {
    slug: 'services',
    title: 'Our services',
    seo: {
      title: 'Digital Marketing & Website Services in Kenya | Domands Creative',
      description: 'Websites, e-commerce, branding, SEO, WhatsApp and social media services with published prices in KES. See what each costs and how long it takes.',
    },
    layout: [
      {
        blockType: 'hero',
        heading: 'Our services',
        sub: 'Twelve services, one team. Every service has a starting price and a typical timeline, so you can plan before you talk to us. Not sure which you need? Take the 3-minute Digital Health Check or get in touch.',
        buttons: [quiz('Take the 3-minute check'), wa()],
      },
      { blockType: 'list', source: 'services-grouped' },
      {
        blockType: 'content',
        style: 'band',
        body: 'Most clients start with one service and add more as they grow. A typical first year: a website, a Google Maps listing, then monthly social media or ads.',
        buttons: [link('See every price on one page', '/pricing/')],
      },
      cta('Not sure which to start with?', "Tell us what you're trying to achieve and we'll recommend the two or three services that will move it most."),
    ],
  },

  {
    slug: 'industries',
    title: 'Built for your industry',
    seo: {
      title: 'Industries We Serve | Domands Creative, Kenya',
      description: 'Websites and marketing built for Kenyan technology companies, financial services, professional firms, healthcare providers and schools.',
    },
    layout: [
      {
        blockType: 'hero',
        heading: 'Built for your industry',
        sub: 'Every industry has its own customers, rules and busy seasons. We focus on five, so the advice and the work fit how your sector actually runs.',
        buttons: both(),
      },
      { blockType: 'list', source: 'industries' },
      cta('Not on the list?', 'We work with businesses of every kind. Tell us about yours.', [wa()]),
    ],
  },

  {
    slug: 'pricing',
    title: 'Our prices',
    seo: {
      title: 'Website & Digital Marketing Prices in Kenya | Domands Creative',
      description: "How much does a website cost in Kenya? See Domands' starting prices for websites, e-commerce, branding, SEO, WhatsApp and social media, in KES.",
    },
    layout: [
      {
        blockType: 'hero',
        heading: 'Our prices',
        sub: 'No guessing. These are our starting prices for a standard scope. Your exact price depends on what you need, and we confirm it in writing before you pay anything.',
        buttons: [wa(undefined, 'Hi Domands, I saw your pricing page and have a question about a service.'), call()],
      },
      {
        blockType: 'priceTable',
        groups: priceGroups.map(([title, rows]) => ({ title, rows: rows.map(([label, price, time, service]) => ({ label, price, time, service })) })),
      },
      {
        blockType: 'cards',
        heading: 'How payment works',
        columns: '2',
        cards: [
          {
            title: 'Deposits and balance',
            text: '- A deposit starts the work: 60% for a Launch Website, 50% for most projects, 40% for online shops and custom systems. The balance is due at launch [confirm].\n- Monthly services are paid at the start of each month.\n- Pay by M-Pesa or bank transfer. [Confirm: VAT status.]\n- Rush delivery in about half the time: +30% of the price.',
          },
          {
            title: 'Not included in any price',
            text: 'Domains, hosting, software subscriptions, ad spend, printing and payment provider fees. We pass these on at cost, with no mark-up.',
          },
        ],
      },
      {
        blockType: 'faq',
        heading: 'Pricing FAQs',
        faqs: faqs([
          ['Why "from" prices?', 'Most projects fit the standard scope. If yours needs more pages, products or features, we tell you the exact price before you commit.'],
          ['Do you offer discounts?', "We don't run discounts. If budget is tight, we'll suggest a smaller starting scope and grow from there."],
          ['Can I pay in instalments?', 'The deposit and balance split is standard; [ask us about longer projects].'],
        ]),
      },
      cta('Not sure what you need?', 'Take the [Digital Health Check](/quiz/) or get in touch.'),
    ],
  },

  {
    slug: 'contact',
    title: 'Contact',
    seo: {
      title: 'Contact Domands Creative | WhatsApp, Call or Email',
      description: 'Talk to Domands Creative about your website, brand or marketing. Get in touch, book a call or send us a message. We reply within one working day.',
    },
    layout: [
      {
        blockType: 'hero',
        heading: "Let's talk about your business",
        sub: "Tell us what you're trying to achieve. We'll reply within [one working day] with honest advice on what to do next, even if that isn't us.",
      },
      {
        blockType: 'cards',
        heading: 'Three ways to reach us',
        columns: '3',
        cards: [
          { title: 'Quick enquiry', text: 'Leave your name and number, then carry on in WhatsApp if you like.', buttons: [wa()] },
          { title: 'Call', text: 'Book a 20-minute call at a time that suits you.', buttons: [call()] },
          { title: 'Email', text: 'For documents, briefs and tenders.\n\n[info@domandsagency.com](mailto:info@domandsagency.com)' },
        ],
      },
      { blockType: 'form', form: 'contact', heading: 'Or send us a message', anchor: 'form' },
      {
        blockType: 'content',
        style: 'band',
        heading: 'Where we work',
        body: "We're a fully remote team, working with businesses across Kenya by WhatsApp, phone and video call.\n\n**Open:** Monday to Friday, 8:00 am to 5:00 pm.\n\nNot sure what you need? Take the [3-minute Digital Health Check](/quiz/).",
      },
    ],
  },

  {
    slug: 'thank-you',
    title: 'Thank you',
    seo: { title: 'Thanks, we have your message | Domands Creative', noindex: true },
    layout: [
      {
        blockType: 'hero',
        heading: "Thanks, we've got your message.",
        sub: "One of the team will reply within [one working day]. If it's urgent, message us on WhatsApp.",
        buttons: [wa()],
      },
      {
        blockType: 'list',
        source: 'posts',
        heading: 'While you wait',
        limit: 2,
        empty: '[Two most relevant articles]',
        footerButtons: [link('See our work →', '/work/')],
      },
    ],
  },

  {
    slug: 'about',
    title: 'About',
    seo: {
      title: 'About Domands Creative | A Kenyan Digital Agency',
      description: 'Domands Creative is a Kenyan digital agency run by three founders, building websites, brands and marketing for Kenyan businesses with clear prices.',
    },
    layout: [
      {
        blockType: 'hero',
        heading: 'We help Kenyan businesses grow online',
        sub: 'Domands Creative is a digital agency run by three founders. We build websites, brands and marketing for Kenyan businesses, and we price everything clearly so you can plan before you commit.',
        buttons: both(),
      },
      {
        blockType: 'content',
        heading: 'Why we started',
        body: "[Two or three sentences in the founders' own words: what you saw businesses struggling with, and why you started Domands.]",
      },
      {
        blockType: 'cards',
        heading: 'How we work',
        columns: '3',
        cards: [
          { title: 'Clear prices.', text: 'Every service has a published starting price, and your exact price is in writing before you pay.' },
          { title: 'Built for Kenya.', text: 'M-Pesa, WhatsApp and Google Maps are part of the plan from day one.' },
          { title: 'One team.', text: 'The people you meet are the people doing the work.' },
          { title: 'Honest advice.', text: "If something won't help your business, we say so, even when it means a smaller project." },
          { title: 'Plain reporting.', text: 'Every month you see what happened and what comes next.' },
        ],
      },
      { blockType: 'list', source: 'founders', heading: 'The founders' },
      {
        blockType: 'content',
        style: 'band',
        heading: 'Giving back',
        body: 'Each week a founder gives a [free strategy call](/free-strategy-call/) to one business, and each quarter one startup gets a free starter kit through [Launchpad](/launchpad/).',
      },
      cta("Let's talk about your business."),
    ],
  },

  {
    slug: 'work',
    title: 'Our work',
    seo: { title: 'Our Work | Websites, Brands & Campaigns by Domands Creative', description: "A few of the businesses we've helped, what we did and what changed." },
    layout: [
      { blockType: 'hero', heading: 'Our work', sub: "A few of the businesses we've helped, what we did and what changed." },
      {
        blockType: 'list',
        source: 'case-studies',
        empty: 'Case studies are being written with our clients\' permission. [3 case studies at launch: client name · industry · one-line result · services used]',
      },
      cta('Want a result like this?'),
    ],
  },

  {
    slug: 'insights',
    title: 'Insights',
    seo: {
      title: 'Insights | Practical Digital Marketing Advice for Kenyan Businesses',
      description: 'Plain-language guides on websites, SEO, WhatsApp, social media and ads for Kenyan businesses, with real prices and examples.',
    },
    layout: [
      {
        blockType: 'hero',
        heading: 'Insights',
        sub: 'Practical advice on growing your business online, written by the Domands team, with real prices, timelines and examples.',
      },
      {
        blockType: 'list',
        source: 'posts',
        limit: 30,
        empty: 'The first articles are on the way:\n\n- [How much does a website cost in Kenya in 2026?]\n- [Shopify or WooCommerce for a Kenyan shop?]\n- [How to appear in ChatGPT and Google AI answers]\n- [WhatsApp Business app or API?]\n- [How much to spend on Facebook and Google ads in Kenya]\n- [What a brand identity includes, and what it costs]',
      },
      {
        blockType: 'form',
        form: 'newsletter',
        heading: 'One useful idea for your business each month.',
        intro: 'No spam.',
        anchor: 'newsletter',
      },
      {
        blockType: 'content',
        body: 'Not sure what to fix first? Take the [3-minute Digital Health Check](/quiz/).',
      },
    ],
  },

  {
    slug: 'free-strategy-call',
    title: 'Free strategy call',
    seo: {
      title: 'Free 45-Minute Marketing Strategy Call | Domands Creative, Kenya',
      description: 'Each week one Domands founder gives a free 45-minute strategy call to one business. Get three clear priorities and a one-page action plan. No sales pitch.',
    },
    layout: [
      {
        blockType: 'hero',
        heading: 'One free strategy call, every week',
        sub: 'Each week, one of our founders sits down with one business owner for 45 minutes. You leave with three clear priorities and a one-page plan. No sales pitch.',
        buttons: [{ action: 'anchor', href: '#form', label: "Book this week's call" }],
        note: 'One slot a week. Next available: [date].',
      },
      {
        blockType: 'cards',
        heading: 'What you get',
        columns: '4',
        cards: [
          { text: 'A 45-minute video or phone call with a Domands founder.' },
          { text: 'A quick review of your website, Google listing and social pages before the call.' },
          { text: 'Three priorities that will make the biggest difference to your business online.' },
          { text: 'Within 2 working days: a one-page action plan and free guides for your priorities.' },
        ],
      },
      {
        blockType: 'content',
        heading: "Who it's for",
        body: 'Business owners and managers in Kenya who want honest advice on where to focus their marketing. One call per business.\n\n### Why it\'s free\n\nWe run this call to keep sharpening how we diagnose businesses and explain advice. If you later want help putting the plan into action, we\'re here. If not, the plan is yours to use.',
      },
      {
        blockType: 'steps',
        heading: 'How it works',
        steps: steps([
          ['Book', "Pick the week's slot and answer four short questions about your business."],
          ['We prepare', 'A founder looks at your online presence before the call.'],
          ['Talk', "45 minutes on where you are, what's holding you back and what to do first."],
          ['Get your plan', 'A one-page action plan in your inbox or WhatsApp within 2 working days.'],
        ]),
      },
      {
        blockType: 'form',
        form: 'strategy-call',
        heading: "Request this week's slot",
        anchor: 'form',
        after: "If this week's call is already booked, we'll offer you a slot in the coming weeks. Want instant advice? Take the [3-minute Digital Health Check](/quiz/).",
      },
      {
        blockType: 'faq',
        heading: 'FAQs',
        faqs: faqs([
          ['Is it really free?', 'Yes. No payment, no obligation.'],
          ['Will you try to sell to me?', 'No. The plan lists what you can do yourself first. Our services appear only as an option.'],
          ['Who will I speak to?', 'One of the three Domands founders.'],
          ['Can I book more than one call?', 'One free call per business. For ongoing advice, see [Strategy & Consulting](/marketing-strategy/).'],
        ]),
      },
    ],
  },

  {
    slug: 'launchpad',
    title: 'Domands Launchpad',
    seo: {
      title: 'Domands Launchpad | A Free Digital Starter Kit for One Kenyan Startup Each Quarter',
      description: 'Each quarter, Domands Creative gives one early-stage Kenyan business a free website, logo, WhatsApp setup and Google listing worth KES 73,000. Apply now.',
    },
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'One business every quarter',
        heading: 'Domands Launchpad',
        sub: 'Every quarter, we give one early-stage Kenyan business everything it needs to launch online, free. Worth KES 73,000.',
        buttons: [{ action: 'anchor', href: '#form', label: 'Apply now' }],
        note: 'Applications open until [date] · [or: Applications for the next quarter open on (date)]',
      },
      {
        blockType: 'table',
        heading: 'What the chosen business gets',
        ...table(
          ['Part', "What's included", 'Value (KES)'],
          [
            ['[Launch Website](/website-design/)', 'A 5-page website, contact form, map and how-to video', '35,000'],
            ['[Logo Design](/branding/)', 'Three concepts, two rounds of changes, all files', '12,000'],
            ['[WhatsApp Business Setup](/whatsapp-marketing/)', 'Profile, catalogue, quick replies and greetings', '8,000'],
            ['[Local SEO Setup](/seo/)', 'Google Business Profile, directory listings, review plan', '18,000'],
            ['Monthly check-ins', 'A 30-minute call each month for three months', '—'],
            { strong: ['Total', '', '73,000'] },
          ],
        ),
        after: 'You pay only for your domain and hosting.',
      },
      {
        blockType: 'cards',
        columns: '2',
        cards: [
          {
            title: 'Who can apply',
            text: '- A Kenyan business trading for less than [2 years], registered or in the process of registering.\n- A founder who can give about 2 hours a week during the program and send content on time.\n- A business with a real product or service and customers, or a clear plan to reach them.',
          },
          {
            title: 'What we ask in return',
            text: '- Permission to share your story: a case study with your name, logo and results.\n- One short testimonial and a short video about your experience.\n- A "Built with Domands Launchpad" credit in your website footer.',
          },
        ],
      },
      {
        blockType: 'steps',
        heading: 'How it works',
        steps: steps([
          ['Apply (weeks 1–4)', 'A short form about your business and what you need.'],
          ['Shortlist (week 5)', 'We invite three businesses to a 20-minute call.'],
          ['Announcement (week 6)', 'We announce the chosen business and start work.'],
          ['Build (weeks 6–12)', 'Website, logo, WhatsApp and Google listing, with monthly check-ins.'],
          ['Launch story (week 13)', 'We share your results and open the next round.'],
        ]),
      },
      {
        blockType: 'form',
        form: 'launchpad',
        heading: 'Apply for Launchpad',
        anchor: 'form',
        after: "We'll let every applicant know by [date]. While you wait, take the [Digital Health Check](/quiz/).",
      },
      {
        blockType: 'content',
        heading: 'Past Launchpad businesses',
        body: '[Cards for each past cohort business, with their result, once the first round is complete]',
      },
      {
        blockType: 'faq',
        heading: 'FAQs',
        faqs: faqs([
          ['Is it really free?', 'Yes. The four services are free; you pay only for your domain and hosting.'],
          ['How do you choose?', 'We look for a business where a strong online start will make the biggest difference, and a founder ready to put in the time.'],
          ['Can I apply again?', 'Yes, in a later round.'],
          ['Can NGOs apply?', '[Confirm: yes / businesses only.]'],
        ]),
      },
    ],
  },

  {
    slug: 'privacy',
    title: 'Privacy notice',
    seo: { title: 'Privacy notice | Domands Creative', description: 'How Domands Creative collects, uses and protects personal data under Kenya’s Data Protection Act, 2019.' },
    layout: [
      { blockType: 'hero', heading: 'Privacy notice', sub: 'Last updated: [date]' },
      {
        blockType: 'content',
        style: 'narrow',
        body: `[Draft for legal review: have a Kenyan advocate review this notice and confirm ODPC registration before publishing.]

### 1. Who we are
Domands Creative ("we", "us") is a fully remote digital agency in Kenya. We are the data controller for personal data collected through this website. Contact: info@domandsagency.com, +254 763 801 784, [postal address]. [ODPC registration number, if applicable.]

### 2. What we collect
- Details you give us: your name, phone or WhatsApp number, email, business name and the information you share in forms, the Digital Health Check, call bookings or Launchpad applications.
- Messages you send us on WhatsApp, email or social media.
- Technical data: your device, browser, pages visited and how you arrived, collected through cookies and analytics.

### 3. Why we use it, and our lawful basis`,
      },
      {
        blockType: 'table',
        ...table(
          ['Purpose', 'Lawful basis'],
          [
            ['Replying to enquiries and preparing quotes', 'Steps taken at your request before a contract'],
            ["Delivering services you've bought", 'Performance of a contract'],
            ['Sending your Digital Health Check report and occasional tips', 'Your consent, which you can withdraw at any time'],
            ['Measuring and improving our website and ads', 'Our legitimate interests, or your consent where cookies require it'],
            ['Keeping financial and tax records', 'Legal obligation'],
          ],
        ),
      },
      {
        blockType: 'content',
        style: 'narrow',
        body: `### 4. Who we share it with
Only the service providers that help us run Domands, such as our website host, email and CRM tools, analytics, WhatsApp and booking tools [list providers], each bound to protect your data. We never sell your personal data.

### 5. Transfers outside Kenya
Some of these providers store data outside Kenya. Where they do, we rely on the safeguards the Data Protection Act requires [confirm mechanism].

### 6. How long we keep it
Enquiries that don't become projects: [12 months]. Client records: for the length of the contract plus [7 years] for tax purposes. Marketing contacts: until you unsubscribe.

### 7. Your rights
Under Kenya's Data Protection Act, 2019, you can ask to be informed about how we use your data, access it, correct it, have it deleted, object to its use (including for marketing), and receive it in a portable format. Contact us at info@domandsagency.com. If you're unhappy with our response, you can complain to the Office of the Data Protection Commissioner.

### 8. Cookies
We use essential cookies to run the site and, with your consent, analytics and advertising cookies to measure and improve it. You can change your choice any time through the cookie banner.

### 9. Security
We use access controls, encrypted connections and reputable providers to protect your data, and we limit access to the people who need it.

### 10. Children
Our services are for businesses. We don't knowingly collect data from anyone under 18.

### 11. Changes
We'll post any changes here with a new "last updated" date.`,
      },
    ],
  },

  {
    slug: 'terms',
    title: 'Terms of service',
    seo: { title: 'Terms of service | Domands Creative', description: 'The terms that apply to every service Domands Creative provides.' },
    layout: [
      { blockType: 'hero', heading: 'Terms of service', sub: 'Last updated: [date]' },
      {
        blockType: 'content',
        style: 'narrow',
        body: `[Draft for legal review: have a Kenyan advocate review these terms before publishing. Each project still has its own signed quote or agreement; these terms fill the gaps.]

### 1. About these terms
These terms apply to every service Domands Creative provides, alongside the written quote or agreement for your project. If they conflict, the quote or agreement wins.

### 2. Quotes and scope
Website prices are starting prices for a standard scope. Your quote sets out exactly what is included, the price and the timeline. Work outside that scope is quoted separately or billed at KES [2,000] per hour, with your approval first.

### 3. Payment
Work starts once the deposit clears: 60% for Launch Websites, logos and other small projects; 50% for most projects; 40% for online shops and custom systems. The balance is due [at launch / on delivery]. Monthly services are paid in advance. Invoices are payable within [7] days. We may pause work on overdue accounts.

### 4. Third-party costs
Domains, hosting, software subscriptions, ad spend, payment and messaging fees, and printing are paid by you, directly or passed through at cost.

### 5. Your responsibilities
You provide content, access and approvals on time, and confirm you have the right to use any material you send us. Delays in content or approval move the timeline.

### 6. Changes and revisions
Each project includes the rounds of changes in its quote. Extra rounds are KES 5,000 each.

### 7. Rush delivery
Delivery in about half the usual time costs 30% more, where our schedule allows.

### 8. Ownership
Once you have paid in full, you own the final website, designs and content we created for you. We keep the right to show the work in our portfolio unless you ask us not to. Third-party themes, plugins, fonts and stock assets stay under their own licences.

### 9. Monthly services
Monthly plans continue until either side gives [30 days'] written notice.

### 10. Results
We commit to doing the work professionally and reporting honestly. We can't guarantee specific rankings, leads or sales, because these depend on factors outside our control.

### 11. Liability
Our total liability for any project is limited to the fees you paid for it. We are not liable for indirect losses, or for outages and changes by third-party platforms such as Google, Meta, Safaricom or hosting providers.

### 12. Confidentiality and data
We keep your business information confidential and handle personal data as set out in our [Privacy notice](/privacy/).

### 13. Ending a project
Either side may end a project in writing. You pay for work completed up to that point; deposits cover work already started and are [non-refundable / refundable minus work done].

### 14. Governing law
These terms are governed by the laws of Kenya. Disputes are first discussed in good faith, then [mediation], then the courts of Kenya.`,
      },
    ],
  },
]
