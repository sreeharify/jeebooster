// ─────────────────────────────────────────────────────────────
//  IELTS Mock Test Data  — 2 sets per section, picked randomly
// ─────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════
//  LISTENING  (simulate reading a transcript since no audio)
// ══════════════════════════════════════════════════════════════
export const LISTENING_SETS = [
  {
    setId: 'L1',
    title: 'Listening Test — Set A',
    sections: [
      {
        section: 1,
        label: 'Section 1 — Everyday Conversation',
        context: 'Listen to a conversation between a student (Maya) and a university accommodation office officer.',
        transcript: `Officer: Good morning, Riverside University Accommodation Office. How can I help?
Maya: Hi, I'm calling about student housing for next year. My name is Maya Chen.
Officer: Of course, Maya. Are you a new or returning student?
Maya: I'm a returning student. I'm in my second year, studying Biology.
Officer: Great. We have two main options — the North Campus dormitories at £95 per week, or the South Campus apartments at £130 per week. The apartments are en-suite.
Maya: I'd prefer the South Campus if possible. Could I also ask about parking?
Officer: South Campus has a paid parking permit — it's £180 per academic year. The North Campus parking is free, but spaces are limited.
Maya: And what's the deadline for applications?
Officer: The deadline is the 15th of March. After that, you join a waiting list.
Maya: Perfect. One more question — is there a laundry facility?
Officer: Both campuses have laundry rooms. South Campus has card-operated machines on every floor.`,
        questions: [
          { id: 'L1_1', type: 'mcq', question: 'What year of study is Maya in?', options: ['First', 'Second', 'Third', 'Fourth'], correct: 'Second', explanation: 'Maya says "I\'m in my second year".' },
          { id: 'L1_2', type: 'mcq', question: 'What is the weekly cost of South Campus apartments?', options: ['£95', '£110', '£130', '£150'], correct: '£130', explanation: 'The officer says "South Campus apartments at £130 per week".' },
          { id: 'L1_3', type: 'mcq', question: 'What is special about the South Campus apartments?', options: ['They are free', 'They are en-suite', 'They include free parking', 'They are newer'], correct: 'They are en-suite', explanation: '"The apartments are en-suite" — the officer states this directly.' },
          { id: 'L1_4', type: 'mcq', question: 'How much does a South Campus parking permit cost per year?', options: ['£95', '£130', '£150', '£180'], correct: '£180', explanation: '"paid parking permit — it\'s £180 per academic year".' },
          { id: 'L1_5', type: 'mcq', question: 'What is the application deadline?', options: ['5th March', '15th March', '25th March', '5th April'], correct: '15th March', explanation: '"The deadline is the 15th of March."' },
        ]
      },
      {
        section: 2,
        label: 'Section 2 — Campus Tour Announcement',
        context: 'Listen to a student union representative giving a campus orientation talk.',
        transcript: `Welcome everyone to Westfield University! My name is James and I'll be your orientation guide today. Let me tell you about some key facilities on campus.

The Main Library is open Monday to Friday, 8am to 10pm, and weekends 9am to 6pm. You'll need your student card to access the upper floors, where the silent study zones are located.

The Sports Centre is on the east side of campus, a five-minute walk from the main entrance. Membership costs £40 per semester and includes access to the gym, swimming pool, and all group fitness classes.

For food, the Central Canteen serves hot meals between 11:30am and 2:30pm. There's also the Coffee Hub near the library, which is open until 9pm on weekdays.

One important thing — the IT Help Desk is on the ground floor of the Computing Building. If you have any problems with your university login or email, that's where you go. They're open 9am to 5pm, Monday to Friday.`,
        questions: [
          { id: 'L1_6', type: 'mcq', question: 'What do students need to access the upper library floors?', options: ['A password', 'A student card', 'Staff permission', 'A library card'], correct: 'A student card', explanation: '"You\'ll need your student card to access the upper floors".' },
          { id: 'L1_7', type: 'mcq', question: 'Where is the Sports Centre located?', options: ['North side', 'West side', 'East side', 'South side'], correct: 'East side', explanation: '"The Sports Centre is on the east side of campus".' },
          { id: 'L1_8', type: 'mcq', question: 'What is the Sports Centre membership cost per semester?', options: ['£20', '£30', '£40', '£50'], correct: '£40', explanation: '"Membership costs £40 per semester".' },
          { id: 'L1_9', type: 'mcq', question: 'Until what time is the Coffee Hub open on weekdays?', options: ['7pm', '8pm', '9pm', '10pm'], correct: '9pm', explanation: '"open until 9pm on weekdays".' },
          { id: 'L1_10', type: 'mcq', question: 'Where should students go for login or email problems?', options: ['The library', 'The student union', 'The IT Help Desk', 'The main office'], correct: 'The IT Help Desk', explanation: '"If you have any problems with your university login or email, that\'s where you go".' },
        ]
      },
    ]
  },
  {
    setId: 'L2',
    title: 'Listening Test — Set B',
    sections: [
      {
        section: 1,
        label: 'Section 1 — Booking a Service',
        context: 'Listen to a phone conversation between a customer and a bicycle repair shop.',
        transcript: `Staff: Hello, CycleWorks repair shop. Tom speaking.
Customer: Hi, I'd like to book my bike in for a service. My name is Sarah Patel.
Staff: Of course, Sarah. What type of bike is it?
Customer: It's a mountain bike. It's making a clicking noise when I change gears, and the front brake feels soft.
Staff: Right, sounds like it could be a gear cable issue and the brake pads might need replacing. Our standard service is £45 and includes a full inspection. Brake pad replacement is an extra £15.
Customer: That sounds fine. How long will it take?
Staff: We're quite busy at the moment. I can book you in for Thursday the 22nd — it would be ready by end of day Friday the 23rd.
Customer: That works for me. What's the address?
Staff: We're at 14 Bridge Street, just opposite the post office. Bring the bike any time after 9am on Thursday.
Customer: And do I need to bring anything else?
Staff: Just the bike! If you have your original receipt that's helpful for warranty checks, but not essential.`,
        questions: [
          { id: 'L2_1', type: 'mcq', question: "What problem does Sarah's bike have with braking?", options: ['Clicking noise', 'Soft front brake', 'Broken gear cable', 'Flat tyre'], correct: 'Soft front brake', explanation: '"the front brake feels soft" — Sarah describes two problems; this is the brake issue.' },
          { id: 'L2_2', type: 'mcq', question: 'How much does a standard service cost?', options: ['£30', '£45', '£55', '£60'], correct: '£45', explanation: '"Our standard service is £45".' },
          { id: 'L2_3', type: 'mcq', question: 'What is the total cost if brake pads are also replaced?', options: ['£45', '£55', '£60', '£65'], correct: '£60', explanation: '£45 standard + £15 brake pads = £60.' },
          { id: 'L2_4', type: 'mcq', question: 'When will the bike be ready for collection?', options: ['Thursday evening', 'Friday morning', 'End of day Friday', 'Saturday morning'], correct: 'End of day Friday', explanation: '"ready by end of day Friday the 23rd".' },
          { id: 'L2_5', type: 'mcq', question: 'Where is CycleWorks located?', options: ['14 Bridge Road', '14 Bridge Street', '41 Bridge Street', '14 Mill Street'], correct: '14 Bridge Street', explanation: '"We\'re at 14 Bridge Street, just opposite the post office".' },
        ]
      },
      {
        section: 2,
        label: 'Section 2 — Community Centre Announcement',
        context: 'Listen to a manager describing new classes at a community centre.',
        transcript: `Good evening and welcome to the Greenfield Community Centre monthly information session. I'm delighted to announce several new classes starting next month.

First, we're launching a Digital Skills for Seniors class every Tuesday morning from 10am to 12pm. This course is completely free and covers topics like internet safety, video calling, and using smartphones. Places are limited to 12 per session, so early registration is recommended.

We're also adding a new Creative Writing workshop on Thursday evenings from 7 to 9pm. The fee is £8 per session or £60 for the full 10-week programme — a saving of £20 if you pay upfront.

For families, our Saturday Morning Cooking class for children aged 7 to 12 starts on the 4th of next month. The cost is £6 per child per session, and parents are welcome to observe.

Finally, a reminder that our fitness classes — yoga, Pilates, and circuit training — are now bookable online through our website. You'll find the link on the noticeboard near reception.`,
        questions: [
          { id: 'L2_6', type: 'mcq', question: 'How much does the Digital Skills for Seniors class cost?', options: ['£5', '£10', 'Free', '£8'], correct: 'Free', explanation: '"This course is completely free".' },
          { id: 'L2_7', type: 'mcq', question: 'How many people can attend each Digital Skills session?', options: ['8', '10', '12', '15'], correct: '12', explanation: '"Places are limited to 12 per session".' },
          { id: 'L2_8', type: 'mcq', question: 'What is the saving if you pay upfront for the Creative Writing course?', options: ['£10', '£15', '£20', '£25'], correct: '£20', explanation: '10 sessions × £8 = £80, upfront = £60, saving = £20.' },
          { id: 'L2_9', type: 'mcq', question: 'What ages is the Saturday Cooking class for?', options: ['5–10', '7–12', '8–14', '10–16'], correct: '7–12', explanation: '"children aged 7 to 12".' },
          { id: 'L2_10', type: 'mcq', question: 'How can people now book fitness classes?', options: ['By phone', 'In person at reception', 'Through the website', 'By email'], correct: 'Through the website', explanation: '"now bookable online through our website".' },
        ]
      },
    ]
  },
]

// ══════════════════════════════════════════════════════════════
//  READING
// ══════════════════════════════════════════════════════════════
export const READING_SETS = [
  {
    setId: 'R1',
    title: 'Reading Test — Set A',
    passages: [
      {
        passageNum: 1,
        title: 'The Rise of Remote Work',
        text: `The global shift towards remote work, dramatically accelerated by the COVID-19 pandemic, has fundamentally altered conventional notions of the workplace. Prior to 2020, remote work was largely considered a privilege afforded to senior employees in technology-oriented industries. Within months, it became the operational norm for hundreds of millions of workers across sectors as diverse as finance, education, and healthcare.

Research conducted in the aftermath of this transition presents a nuanced picture. A study by Stanford University economist Nicholas Bloom found that productivity among remote workers increased by approximately 13% during the initial period of widespread home working. However, subsequent research has complicated this finding, suggesting that productivity gains are heavily dependent on the nature of the work performed and the quality of the home environment. Collaborative, creative, and mentoring activities, in particular, appear to suffer in remote settings.

The environmental implications of remote work have also attracted scholarly attention. Reduced commuting leads to lower carbon emissions in the transport sector, but this benefit is partially offset by increased domestic energy consumption as heating and electricity usage rises in homes during working hours. The net environmental impact thus varies considerably depending on regional energy sources and housing infrastructure.

Perhaps the most contested aspect of remote work concerns its social dimensions. Proponents argue that flexibility enhances work-life balance, particularly for caregivers and those with disabilities. Critics counter that the erosion of physical workplace boundaries can lead to longer working hours, social isolation, and the blurring of professional and personal identities. The long-term psychological effects remain an active area of research.`,
        questions: [
          { id: 'R1_1', type: 'tfng', statement: 'Remote work was common across all industries before 2020.', answer: 'False', explanation: 'The passage says it was "largely considered a privilege afforded to senior employees in technology-oriented industries" — not common across all industries.' },
          { id: 'R1_2', type: 'tfng', statement: "Bloom's research found a 13% productivity increase among remote workers.", answer: 'True', explanation: 'Directly stated: "productivity among remote workers increased by approximately 13%".' },
          { id: 'R1_3', type: 'tfng', statement: 'Remote work always results in a net reduction in carbon emissions.', answer: 'False', explanation: 'The passage says "the net environmental impact varies considerably" — it is NOT always a net reduction.' },
          { id: 'R1_4', type: 'tfng', statement: 'Remote work has been shown to improve social connections between colleagues.', answer: 'Not Given', explanation: 'The passage discusses social isolation as a concern but never claims it improves social connections.' },
          { id: 'R1_5', type: 'mcq', question: 'According to the passage, which type of work is MOST negatively affected by remote settings?', options: ['Administrative tasks', 'Collaborative and mentoring activities', 'Independent research', 'Data entry'], correct: 'Collaborative and mentoring activities', explanation: '"Collaborative, creative, and mentoring activities, in particular, appear to suffer in remote settings."' },
          { id: 'R1_6', type: 'mcq', question: 'What does the passage say about the environmental impact of remote work?', options: ['It always reduces carbon emissions', 'It always increases energy use', 'It varies depending on regional factors', 'It has no significant impact'], correct: 'It varies depending on regional factors', explanation: '"The net environmental impact thus varies considerably depending on regional energy sources and housing infrastructure."' },
          { id: 'R1_7', type: 'heading', question: 'Which heading best fits Paragraph 2?', options: ['The Origins of Remote Work', 'Mixed Evidence on Productivity', 'Environmental Benefits of Working From Home', 'The Future of the Office'], correct: 'Mixed Evidence on Productivity', explanation: 'Paragraph 2 discusses Bloom\'s productivity finding then complicates it with subsequent research — "mixed evidence".' },
        ]
      },
      {
        passageNum: 2,
        title: 'Biomimicry in Engineering',
        text: `Biomimicry — the practice of drawing inspiration from natural systems to solve human engineering challenges — has emerged as a significant strand of contemporary design thinking. Proponents argue that billions of years of evolutionary refinement have produced solutions of extraordinary elegance and efficiency, and that human engineers would do well to learn from nature's trial-and-error process.

One of the most celebrated examples is the Shinkansen bullet train in Japan. Engineers working on the train faced a problem: when the train emerged from a tunnel at high speed, it produced a loud sonic boom caused by the sudden change in air pressure. The solution came from an unlikely source — the kingfisher bird, which dives from air into water with minimal splash because of its aerodynamically optimised beak. By redesigning the front of the train to mimic the kingfisher's beak profile, engineers not only eliminated the sonic boom but also reduced energy consumption by 15% and increased the train's speed.

Termite mounds provide another compelling example. In Zimbabwe, architect Mick Pearce designed the Eastgate Centre shopping complex using passive ventilation principles observed in termite mounds, which maintain a near-constant internal temperature despite extreme external temperature fluctuations. The building requires no conventional air conditioning, resulting in energy savings of approximately 90% compared to similar buildings.

Not all biomimicry projects succeed, however. Critics point out that biological solutions have evolved to solve specific problems in specific environments, and translating them to engineering contexts involves substantial complexity. Furthermore, the functional requirements of human infrastructure often differ fundamentally from those driving biological evolution, making direct analogies potentially misleading.`,
        questions: [
          { id: 'R1_8', type: 'tfng', statement: 'The kingfisher redesign increased the Shinkansen\'s speed and reduced energy use.', answer: 'True', explanation: '"reduced energy consumption by 15% and increased the train\'s speed" — both stated.' },
          { id: 'R1_9', type: 'tfng', statement: 'The Eastgate Centre uses conventional air conditioning as a backup system.', answer: 'False', explanation: '"The building requires no conventional air conditioning".' },
          { id: 'R1_10', type: 'tfng', statement: 'Mick Pearce studied termite mounds for ten years before designing the Eastgate Centre.', answer: 'Not Given', explanation: 'The length of his study is never mentioned.' },
          { id: 'R1_11', type: 'mcq', question: 'What problem did the Shinkansen bullet train originally have?', options: ['It was too slow', 'It produced a sonic boom at tunnel exits', 'Its energy consumption was too high', 'It caused structural damage to tunnels'], correct: 'It produced a sonic boom at tunnel exits', explanation: '"when the train emerged from a tunnel at high speed, it produced a loud sonic boom".' },
          { id: 'R1_12', type: 'mcq', question: 'According to critics, what is a key limitation of biomimicry?', options: ['Nature does not produce efficient solutions', 'It is too expensive to implement', 'Biological solutions are context-specific and may not transfer well', 'Engineers lack the knowledge to apply it'], correct: 'Biological solutions are context-specific and may not transfer well', explanation: '"biological solutions have evolved to solve specific problems in specific environments, and translating them to engineering contexts involves substantial complexity".' },
          { id: 'R1_13', type: 'heading', question: 'Which heading best describes Paragraph 4?', options: ['The Success of Biomimicry', 'Limitations and Criticisms', 'How Termites Inspire Architecture', 'The History of Engineering Innovation'], correct: 'Limitations and Criticisms', explanation: 'Paragraph 4 presents critics\' concerns about the limitations of biomimicry.' },
        ]
      },
    ]
  },
  {
    setId: 'R2',
    title: 'Reading Test — Set B',
    passages: [
      {
        passageNum: 1,
        title: 'The Psychology of Decision-Making',
        text: `Classical economic theory long assumed that human beings are fundamentally rational agents who make decisions by carefully weighing available information to maximise their utility. This model, known as Homo Economicus, provided the theoretical foundation for much of twentieth-century economics. However, research conducted by psychologists Daniel Kahneman and Amos Tversky from the 1970s onwards demonstrated that human decision-making is systematically irrational in predictable ways.

Kahneman and Tversky identified numerous cognitive biases — systematic errors in thinking — that distort judgement. The anchoring effect, for instance, refers to the tendency to rely too heavily on the first piece of information encountered when making decisions. In a famous experiment, participants who were first shown a high random number subsequently gave higher estimates when asked unrelated numerical questions. The mere exposure to an irrelevant initial figure had measurably skewed their responses.

Loss aversion is another well-documented bias: the psychological pain of losing something is approximately twice as powerful as the pleasure of gaining something of equivalent value. This asymmetry has profound implications for financial behaviour, marketing, and public policy. Pension schemes, for example, can dramatically increase enrolment rates by framing non-participation as a loss rather than a mere failure to gain.

The implications of this research extend far beyond academic psychology. Governments and organisations increasingly employ "nudge theory" — the practice of designing choice environments to guide people towards better decisions without restricting their freedom of choice. The placement of healthier foods at eye level in canteens, or automatic enrolment in savings programmes with an opt-out option, are practical manifestations of these insights.`,
        questions: [
          { id: 'R2_1', type: 'tfng', statement: 'Classical economics assumed that people always make perfectly rational decisions.', answer: 'True', explanation: '"humans are fundamentally rational agents who make decisions by carefully weighing available information to maximise their utility" — this was the classical assumption.' },
          { id: 'R2_2', type: 'tfng', statement: 'Kahneman and Tversky\'s research showed human irrationality is random and unpredictable.', answer: 'False', explanation: '"human decision-making is systematically irrational in predictable ways" — the opposite of random.' },
          { id: 'R2_3', type: 'tfng', statement: 'The anchoring experiment used numbers that were relevant to the questions asked.', answer: 'False', explanation: '"an irrelevant initial figure" — the numbers were deliberately unrelated.' },
          { id: 'R2_4', type: 'tfng', statement: 'Nudge theory removes freedom of choice from individuals.', answer: 'False', explanation: '"without restricting their freedom of choice" — explicitly contradicted.' },
          { id: 'R2_5', type: 'mcq', question: 'According to the passage, how does loss aversion affect pension scheme enrolment?', options: ['It reduces willingness to save', 'Framing non-participation as a loss increases enrolment', 'It makes people save too much', 'It has no effect on financial behaviour'], correct: 'Framing non-participation as a loss increases enrolment', explanation: '"Pension schemes can dramatically increase enrolment rates by framing non-participation as a loss".' },
          { id: 'R2_6', type: 'mcq', question: 'What is the ratio of pain to pleasure described in loss aversion?', options: ['Equal', 'Pain is twice as strong as pleasure', 'Pleasure is twice as strong as pain', 'Pain is three times as strong'], correct: 'Pain is twice as strong as pleasure', explanation: '"the psychological pain of losing something is approximately twice as powerful as the pleasure of gaining something of equivalent value".' },
          { id: 'R2_7', type: 'heading', question: 'Which heading best fits Paragraph 4?', options: ['The History of Economic Theory', 'Practical Applications of Behavioural Insights', 'How Loss Aversion Affects Finance', 'Kahneman\'s Experiments'], correct: 'Practical Applications of Behavioural Insights', explanation: 'Paragraph 4 discusses real-world applications — nudge theory, canteen food placement, savings schemes.' },
        ]
      },
      {
        passageNum: 2,
        title: 'Ocean Acidification',
        text: `Since the Industrial Revolution, the world's oceans have absorbed approximately 30% of the carbon dioxide released by human activities. While this has buffered the atmosphere against even greater temperature increases, it has triggered a chemical process with potentially devastating consequences for marine ecosystems: ocean acidification.

When carbon dioxide dissolves in seawater, it forms carbonic acid, which subsequently releases hydrogen ions, increasing the water's acidity. Since pre-industrial times, the average ocean pH has dropped from 8.2 to approximately 8.1. While this may appear a modest change, it represents a 26% increase in acidity due to the logarithmic nature of the pH scale. Current projections suggest that pH could fall to 7.8 by the end of the century under high-emission scenarios.

The most vulnerable organisms are those that build shells or skeletons from calcium carbonate, a compound that dissolves more readily in acidic water. Coral reefs, pteropods (small sea snails), and various shellfish species face significant threats. Laboratory studies have demonstrated reduced shell growth, increased vulnerability to predation, and impaired reproduction in these organisms under elevated acidity conditions.

The economic implications are substantial. Coral reef ecosystems support fisheries that provide food security for over one billion people worldwide, and their tourism value is estimated in the hundreds of billions of dollars annually. The collapse of shellfish aquaculture industries in regions where acidification is already measurable represents a present-day economic reality rather than a future projection.`,
        questions: [
          { id: 'R2_8', type: 'tfng', statement: 'The oceans have absorbed about 30% of human CO₂ emissions.', answer: 'True', explanation: 'Directly stated in the opening sentence.' },
          { id: 'R2_9', type: 'tfng', statement: 'Ocean pH has remained stable since pre-industrial times.', answer: 'False', explanation: '"dropped from 8.2 to approximately 8.1" — it has changed.' },
          { id: 'R2_10', type: 'tfng', statement: 'A pH drop from 8.2 to 8.1 represents a 26% decrease in acidity.', answer: 'False', explanation: 'It represents a 26% INCREASE in acidity, not a decrease.' },
          { id: 'R2_11', type: 'tfng', statement: 'All marine species are equally threatened by ocean acidification.', answer: 'False', explanation: '"The most vulnerable organisms are those that build shells or skeletons from calcium carbonate" — not all species equally.' },
          { id: 'R2_12', type: 'mcq', question: 'How does CO₂ increase ocean acidity?', options: ['It directly heats the water', 'It forms carbonic acid which releases hydrogen ions', 'It reduces oxygen levels', 'It creates nitrogen compounds'], correct: 'It forms carbonic acid which releases hydrogen ions', explanation: '"carbon dioxide dissolves in seawater, it forms carbonic acid, which subsequently releases hydrogen ions".' },
          { id: 'R2_13', type: 'mcq', question: 'How many people rely on coral reef fisheries for food security?', options: ['100 million', '500 million', 'Over 1 billion', '2 billion'], correct: 'Over 1 billion', explanation: '"provide food security for over one billion people worldwide".' },
        ]
      },
    ]
  },
]

// ══════════════════════════════════════════════════════════════
//  WRITING  (task prompts + model answer guidance)
// ══════════════════════════════════════════════════════════════
export const WRITING_SETS = [
  {
    setId: 'W1',
    title: 'Writing Test — Set A',
    tasks: [
      {
        taskNum: 1,
        type: 'Academic Task 1',
        prompt: 'The graph below shows the percentage of households in the UK owning various electronic devices from 2005 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
        data: {
          description: 'Imagined data for practice:',
          points: [
            'Smartphones: rose from 5% in 2005 to 89% in 2020',
            'Laptops: rose from 30% to 72%',
            'Desktop computers: fell from 65% to 31%',
            'Tablets: grew from 0% (introduced 2010) to 54% in 2020',
          ]
        },
        minWords: 150,
        bandGuide: [
          { band: 6, desc: 'Describes some data but misses key trends. Basic vocabulary.' },
          { band: 7, desc: 'Covers main trends with accurate data. Clear overview. Minor vocabulary errors.' },
          { band: 8, desc: 'Well-structured, accurate data, clear comparisons, varied language.' },
          { band: 9, desc: 'Precise, sophisticated language. Perfect structure: overview → key trends → details.' },
        ],
        modelParagraph: 'Overall, smartphones experienced the most dramatic growth, rising from just 5% in 2005 to 89% by 2020, while desktop computer ownership declined significantly over the same period. Tablet ownership, though non-existent before 2010, grew rapidly to reach 54% by the end of the period.'
      },
      {
        taskNum: 2,
        type: 'Academic Task 2',
        prompt: 'Some people believe that universities should focus solely on providing academic knowledge and skills. Others believe that universities have a broader responsibility to prepare students for life and work. Discuss both views and give your own opinion. Write at least 250 words.',
        minWords: 250,
        bandGuide: [
          { band: 6, desc: 'Basic argument with some supporting points. Simple linking. Some errors.' },
          { band: 7, desc: 'Clear position, well-structured, both views addressed. Mostly accurate.' },
          { band: 8, desc: 'Sophisticated argument, cohesive, wide vocabulary, minimal errors.' },
          { band: 9, desc: 'Fully developed, nuanced, natural vocabulary and grammar throughout.' },
        ],
        modelParagraph: 'Those who advocate for a purely academic focus argue that universities possess a unique mandate to advance knowledge through rigorous intellectual enquiry. Diluting this mission with vocational or life skills training, they contend, risks reducing higher education to a form of expensive job preparation, undermining the intrinsic value of learning. Conversely, proponents of a broader university role highlight the considerable disconnect that frequently exists between academic programmes and workplace demands, arguing that institutions have a moral obligation to equip graduates for the realities of adult life.'
      }
    ]
  },
  {
    setId: 'W2',
    title: 'Writing Test — Set B',
    tasks: [
      {
        taskNum: 1,
        type: 'Academic Task 1',
        prompt: 'The chart below shows the proportion of people using different modes of transport to commute to work in a major city in 2000 and 2023. Summarise the information, selecting and reporting the main features. Write at least 150 words.',
        data: {
          description: 'Imagined data for practice:',
          points: [
            'Car: fell from 58% in 2000 to 38% in 2023',
            'Public transport: rose from 22% to 41%',
            'Cycling: increased from 5% to 13%',
            'Walking: remained stable at around 8%',
          ]
        },
        minWords: 150,
        bandGuide: [
          { band: 6, desc: 'Reports some figures but no clear overview. Limited range of vocabulary.' },
          { band: 7, desc: 'Main trends identified. Overview present. Mostly accurate comparisons.' },
          { band: 8, desc: 'All key trends covered accurately. Varied linking and vocabulary.' },
          { band: 9, desc: 'Concise overview, precise data, sophisticated paraphrasing, natural flow.' },
        ],
        modelParagraph: 'The most striking change was in car usage, which fell considerably from over half of all commuters in 2000 to just over a third by 2023. This decline was mirrored by a corresponding rise in public transport, which overtook car use to become the most popular commuting method by 2023.'
      },
      {
        taskNum: 2,
        type: 'Academic Task 2',
        prompt: 'In many countries, people are living longer than ever before. Some argue this creates serious problems for society, while others see it as a positive development. Discuss both views and give your own opinion. Write at least 250 words.',
        minWords: 250,
        bandGuide: [
          { band: 6, desc: 'Discusses the topic but limited development. Some errors in complex structures.' },
          { band: 7, desc: 'Both sides addressed with supporting examples. Clear conclusion.' },
          { band: 8, desc: 'Nuanced argument, sophisticated vocabulary, varied grammar, minor errors.' },
          { band: 9, desc: 'Insightful, fully developed, precise language, virtually no errors.' },
        ],
        modelParagraph: 'From a pessimistic standpoint, extended lifespans place considerable pressure on public healthcare systems and pension funds, as a growing proportion of elderly citizens must be supported by a proportionally smaller working-age population. This demographic shift, commonly referred to as the "ageing crisis", threatens the fiscal sustainability of welfare states across the developed world. On the other hand, optimists note that older populations bring substantial contributions in the form of accumulated experience, voluntary work, and childcare provision, and that technological advances in medicine may ultimately extend not just lifespan but healthspan — the period of active, productive life.'
      }
    ]
  },
]

// ══════════════════════════════════════════════════════════════
//  SPEAKING  (cue cards + part 1 questions)
// ══════════════════════════════════════════════════════════════
export const SPEAKING_SETS = [
  {
    setId: 'S1',
    title: 'Speaking Test — Set A',
    part1: {
      topic: 'Technology & Daily Life',
      questions: [
        { q: 'How often do you use technology in your daily life?', bandTip: 'Give a direct answer + extend with specific examples. "I use it constantly — from checking emails first thing in the morning to unwinding with streaming services at night."' },
        { q: 'Do you think young people today rely too much on technology?', bandTip: 'Show balance: agree partially, then nuance. Use "To some extent..." or "While I can see the argument..."' },
        { q: 'What technology do you think has made the biggest impact on society?', bandTip: 'Pick ONE specific technology and develop it with a reason + example. More impressive than listing several vaguely.' },
      ]
    },
    part2: {
      topic: 'Describe a time when technology helped you solve a problem.',
      cuePoints: ['What the problem was', 'What technology you used', 'How it helped you solve it', 'And explain how you felt about it'],
      modelOpening: "I'd like to talk about a time about two years ago when I was trying to navigate a completely unfamiliar city abroad and my phone battery had died..."
    },
    part3: {
      theme: 'Technology in Society',
      questions: [
        { q: 'Do you think technology has made people more or less connected to each other?', bandTip: 'Use concessive structure: "While digital platforms have undeniably expanded the reach of human connection, there is a compelling case that the depth and quality of those connections has diminished."' },
        { q: 'Should governments regulate how technology companies use personal data?', bandTip: 'Show awareness of complexity: individuals vs. corporations vs. state. Use "It strikes me that..." to signal a considered position.' },
        { q: 'How do you think artificial intelligence will change the workplace in the future?', bandTip: 'Speculate using: "It seems reasonable to anticipate...", "One can envisage a scenario in which..."' },
      ]
    }
  },
  {
    setId: 'S2',
    title: 'Speaking Test — Set B',
    part1: {
      topic: 'Environment & Nature',
      questions: [
        { q: 'How important is it to you to spend time in nature?', bandTip: 'Personal + reason + example. Don\'t just say "I like nature" — describe a specific memory or feeling.' },
        { q: 'Do you think people in cities are less connected to the natural world?', bandTip: 'Partially agree + nuance. Mention urban parks, awareness campaigns as counterexamples.' },
        { q: 'What do you do in your daily life to help the environment?', bandTip: 'Be honest and specific. Examiners appreciate genuine answers over impressive-sounding ones.' },
      ]
    },
    part2: {
      topic: 'Describe a natural place that has impressed you.',
      cuePoints: ['Where it is', 'When you visited or learned about it', 'What makes it special', 'And explain why it left an impression on you'],
      modelOpening: "The place that has most impressed me is a coastal nature reserve I visited with my family a few years ago. It was situated about three hours from where I grew up..."
    },
    part3: {
      theme: 'Environment & Society',
      questions: [
        { q: 'Who do you think bears the greatest responsibility for environmental protection — individuals, corporations, or governments?', bandTip: 'Avoid simplistic answers. Acknowledge all three levels then argue for your position: "While all three have a role to play, I would argue that..."' },
        { q: 'Do you think economic development and environmental protection are compatible goals?', bandTip: 'Use real examples: Bhutan\'s carbon-negative status, the EU\'s green industrial policy, etc.' },
        { q: 'How has your generation\'s attitude towards the environment changed compared to previous generations?', bandTip: 'Contrast using "Whereas previous generations..., my generation tends to..." Show awareness of social change.' },
      ]
    }
  },
]
