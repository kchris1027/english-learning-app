import { PrismaClient } from "@prisma/client";

export async function seedGrammar(prisma: PrismaClient) {
  console.log("  📝 Seeding grammar...");

  // --- 1. Present Simple Tense (beginner) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Present Simple Tense",
      slug: "present-simple",
      description:
        "Learn to talk about habits, routines, and general facts using the present simple tense.",
      level: "beginner",
      sortOrder: 1,
      content: `## Present Simple Tense

The **present simple** tense is one of the most fundamental tenses in English. We use it to describe **habits**, **routines**, **permanent situations**, and **general facts**. For example: *"I drink coffee every morning"* or *"The Earth revolves around the Sun."*

### Formation

For most subjects the verb stays in its base form:
- **I / You / We / They** + base verb → *"They work in London."*
- **He / She / It** + verb + **-s** (or **-es**) → *"She works in London."*

Spelling note: verbs ending in **-ch, -sh, -ss, -x, -o** add **-es** (*watches, goes*). Verbs ending in consonant + **y** change to **-ies** (*studies*).

### Negatives and Questions

Negatives use **do not (don't)** / **does not (doesn't)** + base verb:
- *"I don't like spicy food."*  •  *"He doesn't play tennis."*

Questions use **Do / Does** + subject + base verb:
- *"Do you speak French?"*  •  *"Does she live here?"*

### Common Time Expressions

always, usually, often, sometimes, rarely, never, every day/week/month, on Mondays`,
      tips: `### Common Mistakes to Avoid

1. **Don't forget the -s** for third-person singular: ✗ *He go* → ✓ *He goes*.
2. **Don't add -s after doesn't**: ✗ *She doesn't goes* → ✓ *She doesn't go*.
3. **Don't use present simple for actions happening right now** — use present continuous instead: ✗ *I eat lunch now* → ✓ *I am eating lunch now.*
4. **Don't confuse with present continuous** for temporary situations: *"I live in Paris"* (permanent) vs *"I'm living in Paris this year"* (temporary).`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "She ___ (go) to school every day.",
            options: JSON.stringify(["goes", "go", "going", "gone"]),
            answer: "goes",
            explanation:
              "Third-person singular (she) requires the -s ending: goes.",
            difficulty: 1,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "They ___ (not / like) cold weather.",
            options: JSON.stringify([
              "don't like",
              "doesn't like",
              "not like",
              "aren't like",
            ]),
            answer: "don't like",
            explanation:
              "'They' is plural, so we use 'don't' (do not) + base verb.",
            difficulty: 1,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question:
              "Which sentence is correct?\nA) He don't work on Sundays.\nB) He doesn't works on Sundays.\nC) He doesn't work on Sundays.\nD) He not work on Sundays.",
            options: JSON.stringify(["A", "B", "C", "D"]),
            answer: "C",
            explanation:
              "With 'he' we use 'doesn't' + base verb (no -s on the main verb).",
            difficulty: 1,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question: "___ your sister speak Spanish?",
            options: JSON.stringify(["Do", "Does", "Is", "Are"]),
            answer: "Does",
            explanation:
              "'Your sister' is third-person singular, so the auxiliary is 'Does'.",
            difficulty: 1,
            sortOrder: 4,
          },
          {
            type: "fill-blank",
            question: "Water ___ (boil) at 100 degrees Celsius.",
            options: JSON.stringify(["boils", "boil", "is boiling", "boiled"]),
            answer: "boils",
            explanation:
              "General scientific facts use the present simple. 'Water' is third-person singular → boils.",
            difficulty: 1,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question:
              "My parents ___ (not / live) in the city. They prefer the countryside.",
            options: JSON.stringify([
              "don't live",
              "doesn't live",
              "aren't live",
              "not live",
            ]),
            answer: "don't live",
            explanation:
              "'My parents' is plural (they), so the negative is formed with 'don't' + base verb.",
            difficulty: 1,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question: "The train ___ (leave) at 8:30 every morning.",
            options: JSON.stringify(["leaves", "leave", "is leaving", "left"]),
            answer: "leaves",
            explanation:
              "Timetables and schedules use present simple. 'The train' is third-person singular → leaves.",
            difficulty: 1,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question:
              "Which sentence uses the present simple correctly?\nA) She is know the answer.\nB) She knows the answer.\nC) She knowing the answer.\nD) She know the answer.",
            options: JSON.stringify(["A", "B", "C", "D"]),
            answer: "B",
            explanation:
              "'Know' is a stative verb used in present simple. Third-person singular (she) → knows.",
            difficulty: 1,
            sortOrder: 8,
          },
          {
            type: "rewrite",
            question:
              'Rewrite as a question: "You play the guitar." → ___ you ___ the guitar?',
            options: null,
            answer: "Do you play the guitar?",
            explanation:
              "To form a question in present simple with 'you', add 'Do' before the subject and keep the base verb.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "fill-blank",
            question: "He ___ (watch) TV every evening after dinner.",
            options: JSON.stringify([
              "watches",
              "watchs",
              "watch",
              "is watching",
            ]),
            answer: "watches",
            explanation:
              "Verbs ending in -ch add -es for third-person singular: watch → watches.",
            difficulty: 1,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 2. Past Simple Tense (beginner) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Past Simple Tense",
      slug: "past-simple",
      description:
        "Describe completed actions and events in the past using regular and irregular verbs.",
      level: "beginner",
      sortOrder: 2,
      content: `## Past Simple Tense

The **past simple** tense describes actions or situations that **started and finished** at a specific time in the past. It is the go-to tense for storytelling, recounting events, and talking about completed actions.

### Regular Verbs

Add **-ed** to the base form: *work → worked*, *play → played*.

Spelling rules:
- Verb ending in **-e** → add **-d**: *live → lived*
- Consonant + **y** → change to **-ied**: *study → studied*
- Short vowel + single consonant → double the consonant: *stop → stopped*

### Irregular Verbs

Many common verbs have unpredictable past forms that must be memorised: *go → went*, *have → had*, *see → saw*, *take → took*, *eat → ate*, *buy → bought*, *think → thought*.

### Negatives and Questions

Use **did not (didn't)** + base verb for negatives:
- *"I didn't see the movie."*

Use **Did** + subject + base verb for questions:
- *"Did you finish your homework?"*

### Common Time Expressions

yesterday, last night/week/year, ago, in 2020, when I was young`,
      tips: `### Common Mistakes to Avoid

1. **Don't add -ed after didn't**: ✗ *She didn't watched* → ✓ *She didn't watch*.
2. **Don't use the past form after Did**: ✗ *Did you went?* → ✓ *Did you go?*
3. **Don't confuse with present perfect**: use past simple when a specific past time is mentioned — *"I saw her yesterday"* (not *"I have seen her yesterday"*).
4. **Learn irregular verbs in groups** — many follow patterns: *think/thought, buy/bought, bring/brought*.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "She ___ (visit) her grandmother last weekend.",
            options: JSON.stringify([
              "visited",
              "visits",
              "visiting",
              "visit",
            ]),
            answer: "visited",
            explanation:
              "Last weekend indicates past time. 'Visit' is regular → visited.",
            difficulty: 1,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "They ___ (not / go) to the party yesterday.",
            options: JSON.stringify([
              "didn't go",
              "didn't went",
              "don't go",
              "weren't go",
            ]),
            answer: "didn't go",
            explanation:
              "Negatives in past simple: didn't + base verb. Never use the past form after didn't.",
            difficulty: 1,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question: "Which is the correct past form of 'buy'?",
            options: JSON.stringify(["buyed", "bought", "buied", "boughted"]),
            answer: "bought",
            explanation:
              "'Buy' is an irregular verb. Its past simple form is 'bought'.",
            difficulty: 1,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question: "___ you see the new film last night?",
            options: JSON.stringify(["Do", "Did", "Were", "Have"]),
            answer: "Did",
            explanation:
              "Questions about a specific past time use 'Did' + subject + base verb.",
            difficulty: 1,
            sortOrder: 4,
          },
          {
            type: "rewrite",
            question:
              "Rewrite in the past simple: \"I eat breakfast at 7 a.m. every day.\" → Yesterday, I ___ breakfast at 7 a.m.",
            options: null,
            answer: "ate",
            explanation:
              "'Eat' is irregular — its past simple form is 'ate'. The sentence moves from a habitual present to a specific past event.",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "rewrite",
            question:
              'Rewrite as a negative sentence: "Tom played football on Saturday." → Tom ___.',
            options: null,
            answer: "didn't play football on Saturday",
            explanation:
              "To make a past simple negative, use 'didn't' + base verb: didn't play.",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question: "We ___ (have) a wonderful holiday in Spain two years ago.",
            options: JSON.stringify(["had", "have", "has", "having"]),
            answer: "had",
            explanation:
              "'Two years ago' signals past simple. 'Have' is irregular → had.",
            difficulty: 1,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question:
              "Which sentence is correct?\nA) She didn't knew the answer.\nB) She didn't know the answer.\nC) She not knew the answer.\nD) She doesn't knew the answer.",
            options: JSON.stringify(["A", "B", "C", "D"]),
            answer: "B",
            explanation:
              "Past simple negative = didn't + base verb (know), not the past form (knew).",
            difficulty: 1,
            sortOrder: 8,
          },
          {
            type: "fill-blank",
            question: "The children ___ (run) in the park all afternoon yesterday.",
            options: JSON.stringify(["ran", "runned", "run", "running"]),
            answer: "ran",
            explanation:
              "'Run' is irregular: run → ran → run. 'Yesterday' confirms past simple.",
            difficulty: 1,
            sortOrder: 9,
          },
          {
            type: "rewrite",
            question:
              'Make a question: "She finished her homework." → ___ she ___ her homework?',
            options: null,
            answer: "Did she finish her homework?",
            explanation:
              "Past simple questions: Did + subject + base verb. 'Finished' returns to 'finish' after 'Did'.",
            difficulty: 2,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 3. Future Tenses (beginner) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Future Tenses",
      slug: "future-tenses",
      description:
        "Express plans, predictions, and spontaneous decisions using will, going to, and present continuous.",
      level: "beginner",
      sortOrder: 3,
      content: `## Future Tenses

English has several ways to talk about the future, each with a different nuance. The three most common structures are **will**, **be going to**, and the **present continuous** used for future arrangements.

### Will

Use **will + base verb** for:
- **Spontaneous decisions**: *"I'll help you carry that."*
- **Predictions based on opinion**: *"I think it will rain tomorrow."*
- **Promises and offers**: *"I will call you tonight."*

### Be Going To

Use **am/is/are + going to + base verb** for:
- **Plans and intentions**: *"We are going to visit Paris this summer."*
- **Predictions based on evidence**: *"Look at those clouds — it's going to rain."*

### Present Continuous for Future

Use **am/is/are + -ing** for definite **arrangements** already planned:
- *"I'm meeting Sarah at 6 p.m."* (It's already arranged.)

### Key Differences

| will | going to | present continuous |
|------|----------|--------------------|
| instant decision | prior plan | fixed arrangement |
| opinion-based prediction | evidence-based prediction | — |`,
      tips: `### Common Mistakes to Avoid

1. **Don't use 'will' for pre-made plans**: ✗ *"I will meet John at 3 — we arranged it yesterday."* → ✓ *"I'm going to meet / I'm meeting John at 3."*
2. **Don't use the present simple for personal plans**: ✗ *"I go to the cinema tonight."* → ✓ *"I'm going to the cinema tonight."*
3. **Will vs going to for predictions**: *"It will be sunny"* (opinion) vs *"It's going to be sunny"* (you see blue sky).
4. **Don't say "I will to go"**: ✗ will to go → ✓ will go.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question:
              '"The phone is ringing!" — "I ___ (answer) it." (spontaneous decision)',
            options: JSON.stringify([
              "'ll answer",
              "'m going to answer",
              "answer",
              "answered",
            ]),
            answer: "'ll answer",
            explanation:
              "A spontaneous decision made at the moment of speaking uses 'will' (contracted: 'll).",
            difficulty: 1,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question:
              "Look at those dark clouds! It ___ (rain). (evidence-based prediction)",
            options: JSON.stringify([
              "is going to rain",
              "will rain",
              "rains",
              "rained",
            ]),
            answer: "is going to rain",
            explanation:
              "When there is visible evidence for a prediction, we use 'be going to'.",
            difficulty: 1,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question:
              'She has already bought the tickets. She ___ to London next Monday.',
            options: JSON.stringify([
              "will fly",
              "is going to fly",
              "flies",
              "flew",
            ]),
            answer: "is going to fly",
            explanation:
              "A pre-made plan or intention is expressed with 'be going to'.",
            difficulty: 1,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question:
              "I think robots ___ most household chores in 50 years. (opinion-based prediction)",
            options: JSON.stringify([
              "will do",
              "are going to do",
              "do",
              "are doing",
            ]),
            answer: "will do",
            explanation:
              "Personal opinions about the future (often with 'I think') typically use 'will'.",
            difficulty: 2,
            sortOrder: 4,
          },
          {
            type: "rewrite",
            question:
              'Rewrite using "going to": "I plan to study medicine at university."',
            options: null,
            answer: "I am going to study medicine at university",
            explanation:
              "Since this is a pre-existing intention/plan, we express it with 'be going to + base verb'.",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "rewrite",
            question:
              "Rewrite using \"will\": \"I promise — I return your book tomorrow.\"",
            options: null,
            answer: "I will return your book tomorrow",
            explanation:
              "Promises about the future use 'will': I will return / I'll return.",
            difficulty: 1,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question:
              "I ___ (meet) Jane for lunch tomorrow — we booked the restaurant yesterday. (fixed arrangement)",
            options: JSON.stringify([
              "'m meeting",
              "will meet",
              "meet",
              "met",
            ]),
            answer: "'m meeting",
            explanation:
              "A definite arrangement already made uses the present continuous for the future.",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question:
              '"Don\'t worry about the dishes." — "It\'s OK, I ___ them." (spontaneous offer)',
            options: JSON.stringify([
              "'ll do",
              "'m going to do",
              "'m doing",
              "do",
            ]),
            answer: "'ll do",
            explanation:
              "Spontaneous offers made at the moment of speaking use 'will'.",
            difficulty: 1,
            sortOrder: 8,
          },
          {
            type: "fill-blank",
            question:
              "Be careful! You ___ (fall) off that ladder! (evidence-based warning)",
            options: JSON.stringify([
              "are going to fall",
              "will fall",
              "fall",
              "are falling",
            ]),
            answer: "are going to fall",
            explanation:
              "When you can see evidence that something is about to happen, use 'be going to'.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "multiple-choice",
            question:
              "The concert ___ at 8 p.m. tonight. (timetable/schedule)",
            options: JSON.stringify([
              "starts",
              "will start",
              "is going to start",
              "is starting",
            ]),
            answer: "starts",
            explanation:
              "Timetables and official schedules use the present simple, even when referring to the future.",
            difficulty: 2,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 4. Comparatives and Superlatives (beginner) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Comparatives and Superlatives",
      slug: "comparatives-superlatives",
      description:
        "Compare people, places, and things using -er/-est, more/most, and irregular forms.",
      level: "beginner",
      sortOrder: 4,
      content: `## Comparatives and Superlatives

In English, **comparatives** are used to compare **two** things, while **superlatives** compare **three or more** things (or single out the extreme).

### Short Adjectives (1 syllable, some 2-syllable)

Add **-er** for comparative and **-est** for superlative:
- *tall → taller → tallest*
- *big → bigger → biggest* (double the consonant after a short vowel)
- *happy → happier → happiest* (y → ier / iest)

### Long Adjectives (2+ syllables)

Use **more** / **most** before the adjective:
- *beautiful → more beautiful → most beautiful*
- *expensive → more expensive → most expensive*

### Irregular Forms

| Adjective | Comparative | Superlative |
|-----------|-------------|-------------|
| good | better | best |
| bad | worse | worst |
| far | farther / further | farthest / furthest |
| little | less | least |
| much/many | more | most |

### Equality: as … as

Use **as + adjective + as** to say two things are equal:
- *"She is as tall as her brother."*
- Negative: *"This test isn't as hard as the last one."*`,
      tips: `### Common Mistakes to Avoid

1. **Don't double-mark**: ✗ *more bigger* → ✓ *bigger*. Never combine 'more' with '-er'.
2. **Don't forget 'than'** in comparisons: ✗ *She is taller her sister* → ✓ *She is taller than her sister*.
3. **Don't use superlative for two things**: ✗ *Of the two books, this is the best* → ✓ *Of the two books, this is the better one*.
4. **Irregular forms must be memorised**: ✗ *gooder / goodest* → ✓ *better / best*.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "Mount Everest is the ___ (high) mountain in the world.",
            options: JSON.stringify([
              "highest",
              "higher",
              "most high",
              "more high",
            ]),
            answer: "highest",
            explanation:
              "'High' is a short adjective → superlative = highest. We use 'the' before superlatives.",
            difficulty: 1,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "This exercise is ___ (difficult) than the last one.",
            options: JSON.stringify([
              "more difficult",
              "difficulter",
              "most difficult",
              "the more difficult",
            ]),
            answer: "more difficult",
            explanation:
              "'Difficult' has three syllables, so we use 'more' + adjective for the comparative.",
            difficulty: 1,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question:
              "My handwriting is ___ in the class. Nobody can read it!",
            options: JSON.stringify([
              "the worst",
              "the worse",
              "worse",
              "worst",
            ]),
            answer: "the worst",
            explanation:
              "'Bad' → worse (comparative) → worst (superlative). With 'in the class' we need the superlative + 'the'.",
            difficulty: 2,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question: "Tom runs as ___ as his older brother.",
            options: JSON.stringify(["fast", "faster", "fastest", "more fast"]),
            answer: "fast",
            explanation:
              "The 'as … as' structure uses the base form of the adjective/adverb, not the comparative.",
            difficulty: 2,
            sortOrder: 4,
          },
          {
            type: "fill-blank",
            question:
              "Of all the students, Maria speaks English the ___ (good).",
            options: JSON.stringify(["best", "better", "goodest", "most good"]),
            answer: "best",
            explanation:
              "'Good' is irregular: good → better → best. 'Of all the students' signals superlative.",
            difficulty: 1,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question:
              "Living in the countryside is ___ (peaceful) than living in the city.",
            options: JSON.stringify([
              "more peaceful",
              "peacefuler",
              "most peaceful",
              "the more peaceful",
            ]),
            answer: "more peaceful",
            explanation:
              "'Peaceful' has three syllables → use 'more' for the comparative.",
            difficulty: 1,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question: "An elephant is ___ (heavy) than a horse.",
            options: JSON.stringify([
              "heavier",
              "more heavy",
              "heaviest",
              "most heavy",
            ]),
            answer: "heavier",
            explanation:
              "'Heavy' ends in consonant + y (2 syllables) → heavier. We drop the -y and add -ier.",
            difficulty: 1,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question: "Which sentence is correct?",
            options: JSON.stringify([
              "She is the most intelligent student in the class.",
              "She is the more intelligent student in the class.",
              "She is the intelligentest student in the class.",
              "She is most intelligent student in the class.",
            ]),
            answer: "She is the most intelligent student in the class.",
            explanation:
              "'Intelligent' is a long adjective → superlative uses 'the most'. Don't forget 'the' before superlatives.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "rewrite",
            question:
              'Rewrite using "as ... as": "John is tall. His father is tall too." → John is ___.',
            options: null,
            answer: "as tall as his father",
            explanation:
              "When two things are equal, use 'as + adjective + as': John is as tall as his father.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "fill-blank",
            question:
              "Today is ___ (hot) day we've had this summer.",
            options: JSON.stringify([
              "the hottest",
              "the hotest",
              "the most hot",
              "hotter",
            ]),
            answer: "the hottest",
            explanation:
              "'Hot' is a short adjective ending in short vowel + consonant → double the 't': hottest. Superlative requires 'the'.",
            difficulty: 1,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 5. Prepositions of Time and Place (beginner) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Prepositions of Time and Place",
      slug: "prepositions-time-place",
      description:
        "Master in, on, and at for describing when and where things happen.",
      level: "beginner",
      sortOrder: 5,
      content: `## Prepositions of Time and Place

Prepositions are small words with a big impact. The three most important ones — **in**, **on**, and **at** — are used for both time and place, but with different rules for each.

### Prepositions of Time

| Preposition | Use | Examples |
|-------------|-----|----------|
| **in** | months, years, seasons, parts of the day | *in March, in 2024, in winter, in the morning* |
| **on** | days, dates, specific day parts | *on Monday, on 5 July, on Christmas Day, on Friday evening* |
| **at** | clock times, fixed expressions | *at 9 o'clock, at noon, at night, at the weekend* |

Other useful prepositions: **by** (deadline), **until** (up to a point), **during** (within a period), **for** (duration).

### Prepositions of Place

| Preposition | Use | Examples |
|-------------|-----|----------|
| **in** | enclosed spaces, cities, countries | *in the box, in London, in Japan* |
| **on** | surfaces, streets, floors | *on the table, on Oak Street, on the second floor* |
| **at** | specific points, addresses, events | *at the bus stop, at 42 Main St, at the party* |

### Common Fixed Expressions

*at home, at work, at school, in bed, in hospital, on holiday, on the phone, at the weekend, in the end, on time, in time*`,
      tips: `### Common Mistakes to Avoid

1. **Don't say "in Monday"**: ✗ *in Monday* → ✓ *on Monday*. Days always take 'on'.
2. **Night is special**: ✗ *in the night* → ✓ *at night*. But *in the evening* is correct.
3. **Don't confuse 'on time' and 'in time'**: *on time* = punctual; *in time* = with enough time to spare.
4. **No preposition with 'last/next/this/every'**: ✗ *on last Monday* → ✓ *last Monday*.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "The meeting is ___ 3 o'clock.",
            options: JSON.stringify(["at", "in", "on", "by"]),
            answer: "at",
            explanation:
              "Clock times always use 'at': at 3 o'clock, at noon, at midnight.",
            difficulty: 1,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "My birthday is ___ July.",
            options: JSON.stringify(["in", "on", "at", "during"]),
            answer: "in",
            explanation: "Months use 'in': in July, in December, in March.",
            difficulty: 1,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question: "We have a test ___ Friday morning.",
            options: JSON.stringify(["on", "in", "at", "during"]),
            answer: "on",
            explanation:
              "Specific days (and day + part of day) use 'on': on Friday, on Friday morning.",
            difficulty: 1,
            sortOrder: 3,
          },
          {
            type: "fill-blank",
            question: "The keys are ___ the table.",
            options: JSON.stringify(["on", "in", "at", "by"]),
            answer: "on",
            explanation:
              "Objects resting on a surface use 'on': on the table, on the shelf.",
            difficulty: 1,
            sortOrder: 4,
          },
          {
            type: "multiple-choice",
            question: "She arrived ___ the airport two hours early.",
            options: JSON.stringify(["at", "in", "on", "to"]),
            answer: "at",
            explanation:
              "We use 'at' for specific points/locations: at the airport, at the station, at the bus stop.",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question:
              "I usually go jogging ___ the morning, but today I went ___ night.",
            options: JSON.stringify([
              "in / at",
              "at / in",
              "on / at",
              "in / in",
            ]),
            answer: "in / at",
            explanation:
              "Parts of the day use 'in' (in the morning/afternoon/evening), but 'night' is a special case that uses 'at' (at night).",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question: "She lives ___ a small apartment ___ the third floor.",
            options: JSON.stringify([
              "in / on",
              "on / in",
              "at / on",
              "in / at",
            ]),
            answer: "in / on",
            explanation:
              "'In' is used for enclosed spaces (apartment). 'On' is used for floors: on the third floor.",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question: "The film starts ___ 7:30 ___ Saturday evening.",
            options: JSON.stringify([
              "at / on",
              "on / at",
              "in / on",
              "at / in",
            ]),
            answer: "at / on",
            explanation:
              "Clock times use 'at'. A specific day + part of day uses 'on': on Saturday evening.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "fill-blank",
            question: "I'll see you ___ two weeks.",
            options: JSON.stringify(["in", "on", "at", "after"]),
            answer: "in",
            explanation:
              "'In' is used for future time periods: in two weeks, in a few days, in an hour.",
            difficulty: 1,
            sortOrder: 9,
          },
          {
            type: "rewrite",
            question:
              "Fill in all three prepositions: \"We met ___ a café ___ Park Street ___ a rainy afternoon.\"",
            options: null,
            answer: "at / on / on",
            explanation:
              "'At' for a specific point/place (a café). 'On' for streets (Park Street). 'On' for specific day descriptions (a rainy afternoon).",
            difficulty: 2,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 6. Articles (A, An, The) (beginner) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Articles (A, An, The)",
      slug: "articles",
      description:
        "Understand when to use a, an, the, or no article with nouns.",
      level: "beginner",
      sortOrder: 6,
      content: `## Articles: A, An, The

Articles are determiners placed before nouns. English has **two indefinite articles** (*a* and *an*) and **one definite article** (*the*). Knowing which to use — or when to use none at all — is essential for natural-sounding English.

### Indefinite Articles: A / An

Use **a** or **an** when mentioning something **for the first time** or talking about **any one** of a type:
- *"I saw a cat in the garden."* (any cat, first mention)
- *"She is an engineer."* (one of many engineers)

**A** comes before consonant **sounds**; **an** comes before vowel **sounds**:
- *a book, a university* (the 'u' sounds like /juː/)
- *an apple, an hour* (the 'h' is silent)

### Definite Article: The

Use **the** when both speaker and listener know **which specific one**:
- *"I saw a cat. The cat was black."* (second mention — now specific)
- *"Please close the door."* (there's only one door in context)
- *"The sun rises in the east."* (unique things)

### Zero Article (no article)

No article is needed for:
- **Plural/uncountable nouns in general**: *"Dogs are loyal."* *"Water is essential."*
- **Languages, meals, sports**: *"She speaks French."* *"Lunch is ready."*
- **Most countries and cities**: *"I live in Japan."*`,
      tips: `### Common Mistakes to Avoid

1. **Vowel sounds, not vowel letters**: ✗ *a honest man* → ✓ *an honest man* (silent h). ✗ *an university* → ✓ *a university* (/juː/ is a consonant sound).
2. **Don't use 'the' for general statements**: ✗ *The life is beautiful* → ✓ *Life is beautiful*.
3. **Don't forget 'the' for superlatives**: ✗ *She is tallest in class* → ✓ *She is the tallest in the class*.
4. **Country names**: Most have no article, but some do: *the UK, the USA, the Netherlands*.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "She is ___ honest person.",
            options: JSON.stringify(["an", "a", "the", "—"]),
            answer: "an",
            explanation:
              "'Honest' starts with a silent 'h', so the vowel sound /ɒ/ requires 'an'.",
            difficulty: 1,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "Please pass me ___ salt.",
            options: JSON.stringify(["the", "a", "an", "—"]),
            answer: "the",
            explanation:
              "Both speaker and listener know which salt (the one on the table), so 'the' is used.",
            difficulty: 1,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question: "___ water is essential for life.",
            options: JSON.stringify(["(no article)", "A", "An", "The"]),
            answer: "(no article)",
            explanation:
              "When speaking about something in general (uncountable), we use no article.",
            difficulty: 2,
            sortOrder: 3,
          },
          {
            type: "fill-blank",
            question:
              "I bought ___ new laptop yesterday. ___ laptop has a great screen.",
            options: JSON.stringify([
              "a / The",
              "the / A",
              "a / A",
              "the / The",
            ]),
            answer: "a / The",
            explanation:
              "First mention uses 'a' (indefinite). Second mention uses 'the' (now specific and known).",
            difficulty: 2,
            sortOrder: 4,
          },
          {
            type: "multiple-choice",
            question: "He wants to be ___ engineer when he grows up.",
            options: JSON.stringify(["an", "a", "the", "(no article)"]),
            answer: "an",
            explanation:
              "'Engineer' starts with a vowel sound /e/, so we use 'an'. It refers to any engineer (indefinite).",
            difficulty: 1,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question: "___ Amazon is ___ longest river in South America.",
            options: JSON.stringify([
              "The / the",
              "A / the",
              "The / a",
              "— / the",
            ]),
            answer: "The / the",
            explanation:
              "River names use 'the'. Superlatives ('longest') also require 'the'.",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "multiple-choice",
            question: "She goes to ___ university in London.",
            options: JSON.stringify(["a", "an", "the", "(no article)"]),
            answer: "a",
            explanation:
              "'University' starts with the consonant sound /juː/, so we use 'a', not 'an'.",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "fill-blank",
            question: "___ children love playing in ___ park near our house.",
            options: JSON.stringify([
              "The / the",
              "— / the",
              "The / a",
              "A / the",
            ]),
            answer: "The / the",
            explanation:
              "'The children' refers to specific children (ours). 'The park' is a specific known park near the house.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "rewrite",
            question:
              "Choose the correct option: \"I had ___ egg and ___ slice of toast for breakfast.\"",
            options: null,
            answer: "an egg and a slice",
            explanation:
              "'Egg' starts with a vowel sound → 'an'. 'Slice' starts with a consonant sound → 'a'.",
            difficulty: 1,
            sortOrder: 9,
          },
          {
            type: "multiple-choice",
            question: "Which sentence is correct?",
            options: JSON.stringify([
              "I love music.",
              "I love the music.",
              "I love a music.",
              "I love an music.",
            ]),
            answer: "I love music.",
            explanation:
              "When talking about music in general (not a specific piece), we use no article: 'I love music.'",
            difficulty: 1,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 7. Present Perfect Tense (intermediate) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Present Perfect Tense",
      slug: "present-perfect",
      description:
        "Connect past experiences and events to the present using have/has + past participle.",
      level: "intermediate",
      sortOrder: 7,
      content: `## Present Perfect Tense

The **present perfect** tense links the past to the present. It is formed with **have / has + past participle** (the third form of the verb).

### When to Use It

1. **Life experiences** (time not specified): *"I have visited Japan."*
2. **Changes over time**: *"Technology has changed our lives."*
3. **Unfinished actions** (started in the past, continue now): *"She has lived here for ten years."*
4. **Recent events with present relevance**: *"I've lost my keys — I can't get in!"*

### Since vs For

- **Since** marks a **starting point**: *since 2020, since Monday, since I was a child*
- **For** marks a **duration**: *for three years, for a long time, for ages*

### Regular and Irregular Past Participles

- Regular: add **-ed** → *worked, played, visited*
- Irregular: must be memorised → *go → gone, see → seen, write → written, eat → eaten, take → taken*

### Negatives and Questions

- *"I haven't finished yet."*
- *"Has she ever been to London?"*`,
      tips: `### Common Mistakes to Avoid

1. **Don't use with specific past times**: ✗ *I have seen her yesterday* → ✓ *I saw her yesterday*. (Use past simple for specific past times.)
2. **Don't confuse since and for**: ✗ *I've lived here since five years* → ✓ *I've lived here for five years*.
3. **Learn irregular past participles**: ✗ *I have went* → ✓ *I have gone*. ✗ *She has ate* → ✓ *She has eaten*.
4. **Been vs Gone**: *"She has been to Paris"* = she visited and returned. *"She has gone to Paris"* = she is there now.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "I ___ (never / see) such a beautiful sunset.",
            options: JSON.stringify([
              "have never seen",
              "never saw",
              "have never saw",
              "am never seeing",
            ]),
            answer: "have never seen",
            explanation:
              "Life experiences without a specific time use present perfect: have + never + past participle (seen).",
            difficulty: 2,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "She has worked here ___ 2018.",
            options: JSON.stringify(["since", "for", "from", "during"]),
            answer: "since",
            explanation:
              "'2018' is a specific starting point, so we use 'since'. Use 'for' with a duration (e.g., for six years).",
            difficulty: 2,
            sortOrder: 2,
          },
          {
            type: "fill-blank",
            question: "We have known each other ___ a long time.",
            options: JSON.stringify(["for", "since", "during", "until"]),
            answer: "for",
            explanation:
              "'A long time' is a duration, so we use 'for'. Use 'since' with a point in time.",
            difficulty: 2,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question: "Which past participle is correct? write → ___",
            options: JSON.stringify([
              "written",
              "wrote",
              "writed",
              "wrotten",
            ]),
            answer: "written",
            explanation:
              "The three forms of 'write' are: write – wrote (past simple) – written (past participle).",
            difficulty: 2,
            sortOrder: 4,
          },
          {
            type: "multiple-choice",
            question:
              '"She ___ to Paris three times." Which is correct?',
            options: JSON.stringify([
              "has been",
              "has gone",
              "have been",
              "went",
            ]),
            answer: "has been",
            explanation:
              "'Has been to' means she visited and returned. 'Has gone to' would mean she is still there. Third-person singular uses 'has'.",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question: "They ___ (just / finish) their homework. Let's go out!",
            options: JSON.stringify([
              "have just finished",
              "just finished",
              "had just finished",
              "are just finishing",
            ]),
            answer: "have just finished",
            explanation:
              "'Just' with present perfect indicates a very recent event with present relevance: have/has + just + past participle.",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "multiple-choice",
            question:
              "Which sentence is correct?\nA) I have visited Rome last summer.\nB) I visited Rome last summer.\nC) I have visit Rome last summer.\nD) I did visited Rome last summer.",
            options: JSON.stringify(["A", "B", "C", "D"]),
            answer: "B",
            explanation:
              "'Last summer' is a specific past time — use past simple, not present perfect.",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "fill-blank",
            question:
              "___ you ever ___ (eat) sushi?",
            options: JSON.stringify([
              "Have / eaten",
              "Did / eaten",
              "Have / ate",
              "Do / eat",
            ]),
            answer: "Have / eaten",
            explanation:
              "Present perfect questions about life experience: Have + subject + ever + past participle. 'Eat' → eaten.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "rewrite",
            question:
              'Rewrite using present perfect: "I lost my keys. I can\'t find them." → I ___ my keys.',
            options: null,
            answer: "have lost",
            explanation:
              "The present relevance (can't find them now) calls for present perfect: I have lost my keys.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "fill-blank",
            question: "He ___ (not / finish) his project yet.",
            options: JSON.stringify([
              "hasn't finished",
              "didn't finish",
              "not finished",
              "haven't finished",
            ]),
            answer: "hasn't finished",
            explanation:
              "'Yet' at the end of a sentence signals present perfect negative. 'He' takes 'hasn't' + past participle.",
            difficulty: 2,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 8. Modal Verbs (intermediate) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Modal Verbs",
      slug: "modal-verbs",
      description:
        "Express ability, permission, obligation, advice, and possibility using modal verbs.",
      level: "intermediate",
      sortOrder: 8,
      content: `## Modal Verbs

**Modal verbs** are auxiliary verbs that add meaning to the main verb. They express ideas like ability, permission, obligation, advice, and possibility. Common modals include: **can, could, may, might, must, shall, should, will, would, ought to**.

### Key Modals and Their Meanings

| Modal | Meaning | Example |
|-------|---------|---------|
| **can** | ability / permission | *"I can swim."* / *"Can I sit here?"* |
| **could** | past ability / polite request | *"I could read at age 4."* / *"Could you help me?"* |
| **may** | permission (formal) / possibility | *"May I leave early?"* / *"It may rain."* |
| **might** | weak possibility | *"She might come to the party."* |
| **must** | strong obligation / logical deduction | *"You must wear a seatbelt."* / *"He must be tired."* |
| **have to** | external obligation | *"I have to finish this report by Friday."* |
| **should** | advice / expectation | *"You should see a doctor."* |

### Must vs Have to

- **Must** = the speaker feels it is important (internal): *"I must study harder."*
- **Have to** = an external rule or requirement: *"We have to wear uniforms at school."*
- **Mustn't** = prohibition: *"You mustn't park here."*
- **Don't have to** = no obligation (it's optional): *"You don't have to come if you're busy."*

### Grammar Rules

Modal verbs are always followed by the **base form** of the verb (no 'to', no '-s', no '-ing'):
- ✓ *She can speak French.* — ✗ *She can speaks / She can to speak.*`,
      tips: `### Common Mistakes to Avoid

1. **Don't add -s to modals**: ✗ *He cans / He musts* → ✓ *He can / He must*.
2. **Don't add 'to' after most modals**: ✗ *I can to swim* → ✓ *I can swim*. (Exception: *ought to*)
3. **Mustn't ≠ don't have to**: *mustn't* = forbidden; *don't have to* = not necessary. These are very different!
4. **May vs Can for permission**: 'May' is more formal; 'can' is common in everyday speech. Both are acceptable.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question:
              "You ___ park here. It's a no-parking zone. (prohibition)",
            options: JSON.stringify([
              "mustn't",
              "don't have to",
              "shouldn't",
              "can't to",
            ]),
            answer: "mustn't",
            explanation:
              "A no-parking zone is a prohibition/rule. 'Mustn't' expresses that something is forbidden.",
            difficulty: 2,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question:
              'You ___ wear a suit — it\'s a casual event. (no obligation)',
            options: JSON.stringify([
              "don't have to",
              "mustn't",
              "can't",
              "shouldn't",
            ]),
            answer: "don't have to",
            explanation:
              "'Don't have to' means it is not necessary — you have a choice. 'Mustn't' would mean it is forbidden.",
            difficulty: 2,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question: "She ___ speak three languages fluently. (ability)",
            options: JSON.stringify(["can", "must", "should", "may"]),
            answer: "can",
            explanation:
              "'Can' expresses current ability: she is able to speak three languages.",
            difficulty: 1,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question:
              "You look exhausted. You ___ get some rest. (advice)",
            options: JSON.stringify(["should", "must", "can", "might"]),
            answer: "should",
            explanation:
              "'Should' is used to give advice or make recommendations.",
            difficulty: 1,
            sortOrder: 4,
          },
          {
            type: "fill-blank",
            question:
              "He has been studying all day. He ___ be very tired. (logical deduction)",
            options: JSON.stringify(["must", "should", "can", "might"]),
            answer: "must",
            explanation:
              "'Must' for deduction means we are almost certain based on evidence: studying all day → must be tired.",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "multiple-choice",
            question: "Which sentence is grammatically correct?",
            options: JSON.stringify([
              "She can swim very well.",
              "She can to swim very well.",
              "She cans swim very well.",
              "She can swimming very well.",
            ]),
            answer: "She can swim very well.",
            explanation:
              "Modal verbs are followed directly by the base form — no 'to', no '-s', no '-ing'.",
            difficulty: 1,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question:
              "___ I borrow your pen, please? (polite request)",
            options: JSON.stringify(["Could", "Must", "Should", "Will"]),
            answer: "Could",
            explanation:
              "'Could' is used for polite requests. It's softer and more polite than 'can'.",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question:
              "It ___ rain later — take an umbrella just in case. (weak possibility)",
            options: JSON.stringify(["might", "must", "should", "can"]),
            answer: "might",
            explanation:
              "'Might' expresses a weak or uncertain possibility — it's not certain but it's possible.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "rewrite",
            question:
              "Rewrite using a modal: \"It is necessary for students to wear uniforms.\" → Students ___ wear uniforms.",
            options: null,
            answer: "have to",
            explanation:
              "'Have to' expresses an external obligation or requirement. The rule comes from the school, not the speaker.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "fill-blank",
            question:
              "When I was young, I ___ run very fast, but now I can't. (past ability)",
            options: JSON.stringify(["could", "can", "must", "should"]),
            answer: "could",
            explanation:
              "'Could' expresses general past ability — something you were able to do before but perhaps not now.",
            difficulty: 2,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 9. Relative Clauses (intermediate) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Relative Clauses",
      slug: "relative-clauses",
      description:
        "Combine sentences and add detail using who, which, that, whose, where, and when.",
      level: "intermediate",
      sortOrder: 9,
      content: `## Relative Clauses

A **relative clause** is a part of a sentence that gives more information about a noun. It begins with a **relative pronoun**: *who, which, that, whose, where,* or *when*.

### Relative Pronouns

| Pronoun | Use | Example |
|---------|-----|---------|
| **who** | people | *The woman **who** lives next door is a doctor.* |
| **which** | things / animals | *The book **which** I bought is fascinating.* |
| **that** | people or things | *The car **that** he drives is expensive.* |
| **whose** | possession | *The student **whose** essay won is in my class.* |
| **where** | places | *The café **where** we met has closed.* |
| **when** | times | *I remember the day **when** we first met.* |

### Defining vs Non-defining Clauses

**Defining** (no commas): essential information — *"The man who called you is my boss."* (which man? — the one who called)

**Non-defining** (with commas): extra information — *"My boss, who is from Italy, speaks four languages."* (we already know who — extra detail)

Note: **that** cannot be used in non-defining clauses.

### Omitting the Relative Pronoun

When the pronoun is the **object** of the clause, it can be omitted in defining clauses:
- *"The film (that/which) we watched was great."* — 'that/which' can be dropped.
- But NOT: *"The woman who lives next door…"* — 'who' is the **subject**, so it must stay.`,
      tips: `### Common Mistakes to Avoid

1. **Don't use 'what' as a relative pronoun**: ✗ *The book what I read* → ✓ *The book that/which I read*.
2. **Don't use 'that' in non-defining clauses**: ✗ *Paris, that is the capital of France, …* → ✓ *Paris, which is the capital of France, …*
3. **Don't forget commas for non-defining clauses**: ✗ *My mother who is a teacher works hard* → ✓ *My mother, who is a teacher, works hard.*
4. **Don't add an extra pronoun**: ✗ *The man who I saw him* → ✓ *The man who I saw*.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "The girl ___ won the race is my cousin.",
            options: JSON.stringify(["who", "which", "whose", "where"]),
            answer: "who",
            explanation:
              "We use 'who' for people. Here 'who' is the subject of 'won'.",
            difficulty: 2,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question:
              "This is the restaurant ___ we had dinner last Friday.",
            options: JSON.stringify(["where", "which", "who", "when"]),
            answer: "where",
            explanation:
              "For places, we use 'where' (= in which). The restaurant is a place.",
            difficulty: 2,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question:
              "The student ___ homework was the best received a prize.",
            options: JSON.stringify(["whose", "who", "which", "that"]),
            answer: "whose",
            explanation:
              "'Whose' shows possession — the student's homework. It replaces 'his/her'.",
            difficulty: 2,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question: "Which sentence uses a NON-defining relative clause?",
            options: JSON.stringify([
              "My brother, who lives in London, is visiting us.",
              "The man who called you is here.",
              "I need a car that is reliable.",
              "The book that you lent me was great.",
            ]),
            answer: "My brother, who lives in London, is visiting us.",
            explanation:
              "Non-defining clauses use commas and give extra (non-essential) information. We already know which brother.",
            difficulty: 3,
            sortOrder: 4,
          },
          {
            type: "rewrite",
            question:
              'Combine into one sentence using a relative pronoun: "I have a friend. She speaks five languages."',
            options: null,
            answer: "I have a friend who speaks five languages.",
            explanation:
              "Use 'who' to replace 'she' and join the sentences: 'I have a friend who speaks five languages.'",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question:
              "The film ___ we watched last night was really boring.",
            options: JSON.stringify(["that", "who", "whose", "where"]),
            answer: "that",
            explanation:
              "'That' or 'which' is used for things. Here 'that' is the object of 'watched' in a defining clause.",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "multiple-choice",
            question:
              "London, ___ is the capital of England, has a population of over 8 million.",
            options: JSON.stringify(["which", "that", "who", "where"]),
            answer: "which",
            explanation:
              "Non-defining clauses (with commas) about things use 'which'. 'That' cannot be used in non-defining clauses.",
            difficulty: 3,
            sortOrder: 7,
          },
          {
            type: "fill-blank",
            question:
              "I remember the summer ___ we first met.",
            options: JSON.stringify(["when", "where", "which", "who"]),
            answer: "when",
            explanation:
              "'When' is used for times. 'The summer' is a time reference, so 'when' is correct.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "rewrite",
            question:
              'Combine using a relative pronoun: "That is the house. I grew up in it."',
            options: null,
            answer: "That is the house where I grew up.",
            explanation:
              "'Where' replaces 'in it' to refer to a place: That is the house where I grew up.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "multiple-choice",
            question: "Which sentence is grammatically INCORRECT?",
            options: JSON.stringify([
              "The book what I read was interesting.",
              "The book that I read was interesting.",
              "The book which I read was interesting.",
              "The book I read was interesting.",
            ]),
            answer: "The book what I read was interesting.",
            explanation:
              "'What' is not used as a relative pronoun. Use 'that', 'which', or omit the pronoun (since it's the object).",
            difficulty: 3,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 10. Passive Voice (intermediate) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Passive Voice",
      slug: "passive-voice",
      description:
        "Shift focus from the doer to the action using the passive voice construction.",
      level: "intermediate",
      sortOrder: 10,
      content: `## Passive Voice

The **passive voice** changes the focus of a sentence from the person doing the action (agent) to the person or thing **receiving** the action. It is formed with **be + past participle**.

### Active vs Passive

- **Active**: *"The chef prepared the meal."* (focus on the chef)
- **Passive**: *"The meal was prepared by the chef."* (focus on the meal)

### Formation by Tense

| Tense | Active | Passive |
|-------|--------|---------|
| Present simple | *They make cars.* | *Cars are made.* |
| Past simple | *She wrote the report.* | *The report was written.* |
| Present perfect | *They have built a bridge.* | *A bridge has been built.* |
| Future (will) | *They will announce the results.* | *The results will be announced.* |

### When to Use Passive

1. The **agent is unknown**: *"My bike was stolen."*
2. The agent is **obvious or unimportant**: *"The building was constructed in 1920."*
3. In **formal/academic writing**: *"The experiment was conducted over six months."*
4. To emphasise the **action or result**: *"English is spoken worldwide."*

### The "by" Agent

Add **by + agent** only when the doer is important information:
- *"The novel was written by George Orwell."*`,
      tips: `### Common Mistakes to Avoid

1. **Don't overuse passive voice**: Active sentences are usually clearer and more direct. Use passive when there's a good reason.
2. **Keep the correct tense of "be"**: The tense shifts to the 'be' verb — ✗ *The letter is wrote* → ✓ *The letter was written*.
3. **Use past participle, not past simple**: ✗ *The window was broke* → ✓ *The window was broken*.
4. **Intransitive verbs cannot be passive**: ✗ *The accident was happened* → ✓ *The accident happened*. (Happen has no object.)`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "The Mona Lisa ___ (paint) by Leonardo da Vinci.",
            options: JSON.stringify([
              "was painted",
              "is painted",
              "painted",
              "has painted",
            ]),
            answer: "was painted",
            explanation:
              "Historical fact → past simple passive: was + past participle (painted).",
            difficulty: 2,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question:
              "English ___ (speak) in many countries around the world.",
            options: JSON.stringify([
              "is spoken",
              "speaks",
              "was spoken",
              "has spoken",
            ]),
            answer: "is spoken",
            explanation:
              "A general fact about the present → present simple passive: is + past participle (spoken).",
            difficulty: 2,
            sortOrder: 2,
          },
          {
            type: "rewrite",
            question:
              'Rewrite in the passive voice: "Someone stole my bicycle."',
            options: null,
            answer: "My bicycle was stolen",
            explanation:
              "The object 'my bicycle' becomes the subject. Past simple passive: was + stolen. 'By someone' is omitted because the agent is unknown.",
            difficulty: 2,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question:
              "A new hospital ___ in our town next year. (future passive)",
            options: JSON.stringify([
              "will be built",
              "will built",
              "is built",
              "was built",
            ]),
            answer: "will be built",
            explanation:
              "Future passive = will + be + past participle: will be built.",
            difficulty: 2,
            sortOrder: 4,
          },
          {
            type: "rewrite",
            question:
              'Rewrite in the passive voice: "They have cancelled the meeting."',
            options: null,
            answer: "The meeting has been cancelled",
            explanation:
              "Present perfect passive: has/have + been + past participle. 'The meeting' becomes the subject.",
            difficulty: 3,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question:
              "This bridge ___ (design) by a famous architect in 1890.",
            options: JSON.stringify([
              "was designed",
              "designed",
              "is designed",
              "has been designed",
            ]),
            answer: "was designed",
            explanation:
              "The specific past date 'in 1890' tells us to use past simple passive: was + past participle.",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "multiple-choice",
            question: "Millions of emails ___ every day around the world.",
            options: JSON.stringify([
              "are sent",
              "is sent",
              "were sent",
              "are sending",
            ]),
            answer: "are sent",
            explanation:
              "A general present fact + plural subject → present simple passive: are + past participle (sent).",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "rewrite",
            question:
              'Rewrite in the passive: "The teacher is explaining the lesson."',
            options: null,
            answer: "The lesson is being explained by the teacher",
            explanation:
              "Present continuous passive = is/are + being + past participle. 'By the teacher' is included since we know the agent.",
            difficulty: 3,
            sortOrder: 8,
          },
          {
            type: "fill-blank",
            question:
              "The results ___ (announce) tomorrow morning.",
            options: JSON.stringify([
              "will be announced",
              "will announce",
              "are announced",
              "have been announced",
            ]),
            answer: "will be announced",
            explanation:
              "'Tomorrow' signals the future. Future passive: will + be + past participle (announced).",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "multiple-choice",
            question: "Which sentence CANNOT be made passive?",
            options: JSON.stringify([
              "The accident happened at noon.",
              "The police arrested the thief.",
              "They make cheese in France.",
              "She wrote a beautiful poem.",
            ]),
            answer: "The accident happened at noon.",
            explanation:
              "'Happen' is intransitive — it has no object, so it cannot be made passive.",
            difficulty: 3,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 11. Conditional Sentences (advanced) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Conditional Sentences",
      slug: "conditionals",
      description:
        "Express real and unreal conditions using zero, first, second, and third conditionals.",
      level: "advanced",
      sortOrder: 11,
      content: `## Conditional Sentences

Conditional sentences describe situations and their results. They typically have an **if-clause** (condition) and a **main clause** (result). There are four main types.

### Zero Conditional — General Facts

**If + present simple, present simple**
- *"If you heat water to 100°C, it boils."*
- Used for scientific facts and things that are always true.

### First Conditional — Real Future Possibilities

**If + present simple, will + base verb**
- *"If it rains tomorrow, I will take an umbrella."*
- Used for real, likely situations in the future.

### Second Conditional — Unreal Present / Hypothetical

**If + past simple, would + base verb**
- *"If I had a million dollars, I would travel the world."*
- Used for imaginary or unlikely situations **now or in the future**.
- Special rule: use **were** (not *was*) for all subjects in formal English: *"If I were you, I would apologise."*

### Third Conditional — Unreal Past / Regrets

**If + past perfect, would have + past participle**
- *"If I had studied harder, I would have passed the exam."*
- Used for imaginary situations in the **past** — things that did NOT happen.`,
      tips: `### Common Mistakes to Avoid

1. **Don't use 'will' in the if-clause** (1st conditional): ✗ *If it will rain* → ✓ *If it rains*.
2. **Don't mix conditional types**: each type has a specific tense pattern. Don't say ✗ *If I would have money, I will buy it*.
3. **Use 'were' in second conditional**: ✗ *If I was rich* → ✓ *If I were rich* (formal). 'Was' is increasingly accepted in informal speech.
4. **Third conditional is about the past**: Don't use it for future possibilities — ✗ *If I had studied tomorrow* → ✓ *If I study tomorrow* (1st conditional).`,
      exercises: {
        create: [
          {
            type: "multiple-choice",
            question:
              "If I ___ you, I would accept the offer. (2nd conditional)",
            options: JSON.stringify(["were", "am", "was", "would be"]),
            answer: "were",
            explanation:
              "In the second conditional, we use 'were' for all subjects (including I/he/she) in the if-clause.",
            difficulty: 3,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question:
              "If she ___ (study) harder, she would have passed the exam. (3rd conditional)",
            options: JSON.stringify([
              "had studied",
              "studied",
              "has studied",
              "would study",
            ]),
            answer: "had studied",
            explanation:
              "Third conditional if-clause uses past perfect: If + had + past participle.",
            difficulty: 3,
            sortOrder: 2,
          },
          {
            type: "fill-blank",
            question:
              "If you heat ice, it ___ . (zero conditional — a fact)",
            options: JSON.stringify(["melts", "will melt", "melted", "melt"]),
            answer: "melts",
            explanation:
              "Zero conditional uses present simple in both clauses for general truths: if + present, present.",
            difficulty: 2,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question:
              "If it rains tomorrow, I ___ an umbrella. (1st conditional)",
            options: JSON.stringify([
              "will take",
              "would take",
              "took",
              "take",
            ]),
            answer: "will take",
            explanation:
              "First conditional (real future): If + present simple, will + base verb.",
            difficulty: 2,
            sortOrder: 4,
          },
          {
            type: "multiple-choice",
            question:
              'Which conditional type does this sentence use? "If I had known, I would have helped."',
            options: JSON.stringify([
              "Third conditional",
              "Second conditional",
              "First conditional",
              "Zero conditional",
            ]),
            answer: "Third conditional",
            explanation:
              "If + past perfect (had known), would have + past participle (helped) = third conditional (unreal past).",
            difficulty: 3,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question:
              "If you ___ (mix) red and blue, you get purple. (zero conditional)",
            options: JSON.stringify(["mix", "mixed", "will mix", "would mix"]),
            answer: "mix",
            explanation:
              "Zero conditional uses present simple in both clauses for facts that are always true.",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question:
              "If I ___ (win) the lottery, I would buy a house by the sea. (2nd conditional)",
            options: JSON.stringify(["won", "win", "will win", "had won"]),
            answer: "won",
            explanation:
              "Second conditional if-clause uses past simple. 'Win' → 'won'. This describes an unlikely/hypothetical situation.",
            difficulty: 3,
            sortOrder: 7,
          },
          {
            type: "rewrite",
            question:
              'Complete the third conditional: "I didn\'t bring my umbrella, so I got wet." → If I ___ my umbrella, I ___.',
            options: null,
            answer: "had brought my umbrella, I wouldn't have got wet",
            explanation:
              "Third conditional: If + past perfect (had brought), would(n't) have + past participle (got wet). It expresses regret about a past action.",
            difficulty: 4,
            sortOrder: 8,
          },
          {
            type: "multiple-choice",
            question:
              "If she ___ the bus, she'll be late for work. (1st conditional)",
            options: JSON.stringify([
              "misses",
              "will miss",
              "missed",
              "had missed",
            ]),
            answer: "misses",
            explanation:
              "First conditional: If + present simple (misses), will + base verb. Don't use 'will' in the if-clause.",
            difficulty: 3,
            sortOrder: 9,
          },
          {
            type: "rewrite",
            question:
              "Rewrite using the second conditional: \"I don't have a car, so I take the bus.\" → If I ___.",
            options: null,
            answer: "If I had a car, I wouldn't take the bus",
            explanation:
              "Second conditional for unreal present: If + past simple (had), would + base verb. It imagines the opposite of reality.",
            difficulty: 3,
            sortOrder: 10,
          },
          {
            type: "fill-blank",
            question:
              "If they ___ (not / cancel) the flight, we would have arrived on time. (3rd conditional)",
            options: JSON.stringify([
              "hadn't cancelled",
              "didn't cancel",
              "wouldn't cancel",
              "haven't cancelled",
            ]),
            answer: "hadn't cancelled",
            explanation:
              "Third conditional negative if-clause: If + hadn't + past participle. The event already happened.",
            difficulty: 4,
            sortOrder: 11,
          },
          {
            type: "multiple-choice",
            question:
              "Which sentence is a mixed conditional (past condition → present result)?",
            options: JSON.stringify([
              "If I had taken that job, I would be living in New York now.",
              "If I take that job, I will live in New York.",
              "If I took that job, I would live in New York.",
              "If it rains, the ground gets wet.",
            ]),
            answer:
              "If I had taken that job, I would be living in New York now.",
            explanation:
              "Mixed conditional: If + past perfect (had taken) → would + be + -ing (present result). Past decision affecting the present.",
            difficulty: 4,
            sortOrder: 12,
          },
        ],
      },
    },
  });

  // --- 12. Reported Speech (advanced) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Reported Speech",
      slug: "reported-speech",
      description:
        "Transform direct quotations into indirect speech with proper tense and pronoun shifts.",
      level: "advanced",
      sortOrder: 12,
      content: `## Reported Speech (Indirect Speech)

**Reported speech** is used to tell someone what another person said, without quoting their exact words. It involves changes to **tenses**, **pronouns**, and **time/place references**.

### Direct vs Reported Speech

- **Direct**: *She said, "I am tired."*
- **Reported**: *She said (that) she was tired.*

### Tense Backshift Rules

When the reporting verb is in the past (*said, told, asked*), the tense in the reported clause usually shifts back:

| Direct Speech | Reported Speech |
|--------------|-----------------|
| present simple → | past simple |
| present continuous → | past continuous |
| past simple → | past perfect |
| present perfect → | past perfect |
| will → | would |
| can → | could |
| may → | might |

### Pronoun and Reference Changes

- *I → he/she*, *my → his/her*, *we → they*
- *here → there*, *this → that*, *today → that day*, *tomorrow → the next day*, *yesterday → the day before*, *now → then*

### Reporting Questions

- Yes/No questions: *"Do you like tea?"* → *She asked if/whether I liked tea.*
- Wh-questions: *"Where do you live?"* → *He asked where I lived.* (no question mark, normal word order)`,
      tips: `### Common Mistakes to Avoid

1. **Don't forget tense backshift**: ✗ *He said he is happy* → ✓ *He said he was happy*. (When the reporting verb is past.)
2. **Don't use question word order in reported questions**: ✗ *She asked where do I live* → ✓ *She asked where I lived*.
3. **Don't forget pronoun changes**: ✗ *He said "I am tired" → He said I was tired* → ✓ *He said he was tired*.
4. **Time references shift**: *today → that day, tomorrow → the next day, yesterday → the day before*.`,
      exercises: {
        create: [
          {
            type: "rewrite",
            question:
              'Rewrite in reported speech: Tom said, "I am learning English."',
            options: null,
            answer: "Tom said (that) he was learning English",
            explanation:
              "'I' changes to 'he'; present continuous 'am learning' backshifts to past continuous 'was learning'.",
            difficulty: 3,
            sortOrder: 1,
          },
          {
            type: "rewrite",
            question:
              'Rewrite in reported speech: She asked, "Do you like coffee?"',
            options: null,
            answer: "She asked if/whether I liked coffee",
            explanation:
              "Yes/No questions use 'if' or 'whether'. 'Do you like' backshifts to 'liked' with normal word order.",
            difficulty: 3,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question:
              'He said, "I will call you tomorrow." → He said he ___ call me ___.',
            options: JSON.stringify([
              "would / the next day",
              "will / the next day",
              "would / tomorrow",
              "will / tomorrow",
            ]),
            answer: "would / the next day",
            explanation:
              "'Will' backshifts to 'would'; 'tomorrow' changes to 'the next day' in reported speech.",
            difficulty: 3,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question:
              'She asked, "Where do you live?" → She asked ___.',
            options: JSON.stringify([
              "where I lived",
              "where do I live",
              "where did I live",
              "where I live",
            ]),
            answer: "where I lived",
            explanation:
              "Reported Wh-questions use normal word order (not question order) and backshift the tense: 'do you live' → 'I lived'.",
            difficulty: 3,
            sortOrder: 4,
          },
          {
            type: "rewrite",
            question:
              'Rewrite in reported speech: He said, "I can drive."',
            options: null,
            answer: "He said (that) he could drive",
            explanation:
              "'I' changes to 'he'; 'can' backshifts to 'could' in reported speech.",
            difficulty: 3,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question: 'She told me she ___ (be) busy the day before.',
            options: JSON.stringify([
              "had been",
              "was",
              "is",
              "has been",
            ]),
            answer: "had been",
            explanation:
              "'The day before' signals reported speech. The original 'was busy yesterday' backshifts to past perfect 'had been'.",
            difficulty: 3,
            sortOrder: 6,
          },
          {
            type: "rewrite",
            question:
              'Rewrite in reported speech: "I have finished my homework," she said.',
            options: null,
            answer: "She said (that) she had finished her homework",
            explanation:
              "'I' → 'she'; 'my' → 'her'; present perfect 'have finished' backshifts to past perfect 'had finished'.",
            difficulty: 3,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question:
              'He asked me, "Can you help me?" → He asked me ___.',
            options: JSON.stringify([
              "if I could help him",
              "can I help him",
              "if I can help him",
              "could I help him",
            ]),
            answer: "if I could help him",
            explanation:
              "Yes/No questions use 'if/whether' + normal word order. 'Can' → 'could'; 'you' → 'I'; 'me' → 'him'.",
            difficulty: 3,
            sortOrder: 8,
          },
          {
            type: "fill-blank",
            question:
              'She said, "I bought this dress here yesterday." → She said she ___ that dress ___ the day before.',
            options: JSON.stringify([
              "had bought / there",
              "bought / there",
              "had bought / here",
              "has bought / there",
            ]),
            answer: "had bought / there",
            explanation:
              "'Bought' (past simple) → 'had bought' (past perfect). 'This' → 'that'. 'Here' → 'there'. 'Yesterday' → 'the day before'.",
            difficulty: 4,
            sortOrder: 9,
          },
          {
            type: "rewrite",
            question:
              'Rewrite in reported speech: The teacher said, "You must study for the exam."',
            options: null,
            answer: "The teacher said (that) we/I had to study for the exam",
            explanation:
              "'Must' can backshift to 'had to' in reported speech. 'You' changes based on context (we/I).",
            difficulty: 4,
            sortOrder: 10,
          },
          {
            type: "multiple-choice",
            question:
              'She said, "I am going to travel next week." → She said she ___.',
            options: JSON.stringify([
              "was going to travel the following week",
              "is going to travel next week",
              "was going to travel next week",
              "had been going to travel the following week",
            ]),
            answer: "was going to travel the following week",
            explanation:
              "'Am going to' → 'was going to'. 'Next week' → 'the following week'. Both tense and time reference shift.",
            difficulty: 4,
            sortOrder: 11,
          },
          {
            type: "fill-blank",
            question:
              'He asked, "What time does the train leave?" → He asked what time the train ___.',
            options: JSON.stringify(["left", "leaves", "had left", "was leaving"]),
            answer: "left",
            explanation:
              "Reported Wh-question: normal word order + tense backshift. 'Does the train leave' → 'the train left'.",
            difficulty: 3,
            sortOrder: 12,
          },
        ],
      },
    },
  });

  // --- 13. Present Continuous Tense (beginner) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Present Continuous Tense",
      slug: "present-continuous",
      description:
        "Describe actions happening right now, temporary situations, and future arrangements using am/is/are + -ing.",
      level: "beginner",
      sortOrder: 13,
      content: `## Present Continuous Tense

The **present continuous** (also called present progressive) describes actions that are **happening right now**, **temporary situations**, and **future arrangements**. It is formed with **am/is/are + verb-ing**.

### When to Use It

1. **Actions happening now**: *"I am reading a book."*
2. **Temporary situations**: *"She is staying with friends this week."*
3. **Future arrangements**: *"We are meeting at 7 p.m. tomorrow."*
4. **Changing/developing situations**: *"The weather is getting colder."*

### Formation

- **I** + am + verb-ing → *"I am working."*
- **He / She / It** + is + verb-ing → *"She is sleeping."*
- **You / We / They** + are + verb-ing → *"They are playing."*

### Spelling Rules for -ing

- Most verbs: add **-ing** → *play → playing, read → reading*
- Verbs ending in **-e**: drop the -e, add -ing → *make → making, write → writing*
- Short verbs (CVC pattern): double the final consonant → *sit → sitting, run → running, swim → swimming*
- Verbs ending in **-ie**: change to -ying → *die → dying, lie → lying, tie → tying*

### Stative Verbs — NOT Used with Continuous

Some verbs describe **states**, not actions, and are rarely used in the continuous form:
- **Mental states**: know, believe, understand, remember, forget, think (= opinion)
- **Emotions**: love, hate, like, want, need, prefer
- **Senses**: see, hear, smell, taste (involuntary)
- **Possession**: have (= own), belong, own, possess`,
      tips: `### Common Mistakes to Avoid

1. **Don't use continuous with stative verbs**: ✗ *I am knowing the answer* → ✓ *I know the answer*.
2. **Don't forget the -ing spelling rules**: ✗ *She is makeing dinner* → ✓ *She is making dinner* (drop the -e).
3. **Don't confuse with present simple**: Present simple = habits/routines (*"I work every day"*). Present continuous = right now / temporary (*"I am working today"*).
4. **Double consonant rule**: ✗ *He is siting down* → ✓ *He is sitting down* (sit → sitting).
5. **Don't forget the auxiliary 'be'**: ✗ *She working now* → ✓ *She is working now*.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "Look! The children ___ (play) in the garden.",
            options: JSON.stringify([
              "are playing",
              "play",
              "plays",
              "is playing",
            ]),
            answer: "are playing",
            explanation:
              "'Look!' signals an action happening right now. 'The children' is plural → are + playing.",
            difficulty: 1,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "She ___ (make) dinner right now. Can I call back later?",
            options: JSON.stringify([
              "is making",
              "makes",
              "is makeing",
              "making",
            ]),
            answer: "is making",
            explanation:
              "'Right now' signals present continuous. 'Make' drops the -e before -ing: making. She → is making.",
            difficulty: 1,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question: "Which sentence uses the present continuous correctly?",
            options: JSON.stringify([
              "He is sitting on the bench.",
              "He is siting on the bench.",
              "He sitting on the bench.",
              "He is sit on the bench.",
            ]),
            answer: "He is sitting on the bench.",
            explanation:
              "'Sit' has a short vowel + single consonant → double the 't': sitting. Don't forget 'is' before -ing.",
            difficulty: 1,
            sortOrder: 3,
          },
          {
            type: "fill-blank",
            question: "I ___ (not / watch) TV at the moment. I ___ (study).",
            options: JSON.stringify([
              "am not watching / am studying",
              "don't watch / study",
              "am not watch / am study",
              "not watching / studying",
            ]),
            answer: "am not watching / am studying",
            explanation:
              "Negative present continuous: am/is/are + not + verb-ing. 'At the moment' confirms present continuous.",
            difficulty: 1,
            sortOrder: 4,
          },
          {
            type: "multiple-choice",
            question:
              "Which sentence is INCORRECT?\nA) I am loving this song.\nB) I love this song.\nC) She is reading a book.\nD) They are waiting for the bus.",
            options: JSON.stringify(["A", "B", "C", "D"]),
            answer: "A",
            explanation:
              "'Love' is a stative verb (emotion) and is not normally used in the continuous form. Say 'I love this song.'",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question:
              "We ___ (meet) the clients at 10 a.m. tomorrow. It's all arranged.",
            options: JSON.stringify([
              "are meeting",
              "meet",
              "will meet",
              "met",
            ]),
            answer: "are meeting",
            explanation:
              "Present continuous is used for definite future arrangements that are already planned.",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question: "Be quiet! The baby ___ (sleep).",
            options: JSON.stringify([
              "is sleeping",
              "sleeps",
              "sleep",
              "slept",
            ]),
            answer: "is sleeping",
            explanation:
              "'Be quiet!' indicates an action in progress right now. The baby → is + sleeping.",
            difficulty: 1,
            sortOrder: 7,
          },
          {
            type: "rewrite",
            question:
              "Rewrite using present continuous: \"The weather gets warmer.\" (emphasise change) → The weather ___.",
            options: null,
            answer: "is getting warmer",
            explanation:
              "For changing or developing situations, use present continuous: 'The weather is getting warmer.'",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "multiple-choice",
            question:
              "___ she ___ with her parents this month? (temporary stay)",
            options: JSON.stringify([
              "Is / staying",
              "Does / stay",
              "Is / stay",
              "Does / staying",
            ]),
            answer: "Is / staying",
            explanation:
              "Present continuous question: Is/Are + subject + verb-ing. Temporary situations use present continuous.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "fill-blank",
            question:
              "The leaves ___ (die) because nobody watered the plant.",
            options: JSON.stringify([
              "are dying",
              "are dieing",
              "are diying",
              "die",
            ]),
            answer: "are dying",
            explanation:
              "Verbs ending in -ie change to -ying: die → dying. The leaves (plural) → are dying.",
            difficulty: 2,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 14. Past Continuous Tense (intermediate) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Past Continuous Tense",
      slug: "past-continuous",
      description:
        "Describe actions in progress at a specific past time, interrupted actions, and parallel past events.",
      level: "intermediate",
      sortOrder: 14,
      content: `## Past Continuous Tense

The **past continuous** (also called past progressive) describes actions that were **in progress at a specific moment in the past**. It is formed with **was/were + verb-ing**.

### When to Use It

1. **Action in progress at a specific past time**: *"At 8 p.m. last night, I was watching a film."*
2. **Interrupted actions** (with past simple): *"I was reading when the phone rang."*
3. **Parallel actions** (two things happening at the same time): *"While I was cooking, she was setting the table."*
4. **Setting the scene in a story**: *"The sun was shining and birds were singing."*

### Formation

- **I / He / She / It** + was + verb-ing
- **You / We / They** + were + verb-ing

### When / While

- **When** + past simple (short, completed action): *"When the doorbell rang, I was having a shower."*
- **While** + past continuous (longer, background action): *"While I was sleeping, someone knocked on the door."*

### Past Simple vs Past Continuous

- **Past simple** = completed action: *"I read a book."* (I finished it.)
- **Past continuous** = action in progress: *"I was reading a book."* (It was in progress — maybe I didn't finish.)`,
      tips: `### Common Mistakes to Avoid

1. **Don't use past continuous for completed actions**: ✗ *I was reading the whole book yesterday* → ✓ *I read the whole book yesterday* (completed action = past simple).
2. **Don't use continuous with stative verbs**: ✗ *I was knowing the answer* → ✓ *I knew the answer*.
3. **When vs While**: 'When' typically introduces the short action (past simple); 'while' introduces the longer action (past continuous).
4. **Don't forget was/were**: ✗ *She reading when I arrived* → ✓ *She was reading when I arrived*.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "I ___ (read) a book when the phone rang.",
            options: JSON.stringify([
              "was reading",
              "read",
              "am reading",
              "were reading",
            ]),
            answer: "was reading",
            explanation:
              "The reading was in progress when the phone interrupted. I → was + reading.",
            difficulty: 2,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question:
              "At 10 p.m. last night, they ___ (watch) a film.",
            options: JSON.stringify([
              "were watching",
              "watched",
              "was watching",
              "are watching",
            ]),
            answer: "were watching",
            explanation:
              "A specific time in the past signals an action in progress. They → were + watching.",
            difficulty: 2,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question:
              "While she ___ dinner, the fire alarm went off.",
            options: JSON.stringify([
              "was cooking",
              "cooked",
              "is cooking",
              "cooks",
            ]),
            answer: "was cooking",
            explanation:
              "'While' introduces the longer action in past continuous. The fire alarm (past simple) interrupted it.",
            difficulty: 2,
            sortOrder: 3,
          },
          {
            type: "fill-blank",
            question:
              "The children ___ (play) outside while their parents ___ (prepare) lunch.",
            options: JSON.stringify([
              "were playing / were preparing",
              "played / prepared",
              "were playing / prepared",
              "was playing / was preparing",
            ]),
            answer: "were playing / were preparing",
            explanation:
              "Two parallel actions happening at the same time in the past both use past continuous.",
            difficulty: 2,
            sortOrder: 4,
          },
          {
            type: "multiple-choice",
            question:
              "Which sentence correctly describes an interrupted action?",
            options: JSON.stringify([
              "I was walking home when it started to rain.",
              "I walked home when it was starting to rain.",
              "I was walking home when it was starting to rain.",
              "I walked home when it started to rain.",
            ]),
            answer: "I was walking home when it started to rain.",
            explanation:
              "The longer action (walking) uses past continuous; the sudden interruption (started) uses past simple.",
            difficulty: 3,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question: "He ___ (not / sleep) when I got home. He ___ (study).",
            options: JSON.stringify([
              "wasn't sleeping / was studying",
              "didn't sleep / studied",
              "wasn't sleeping / studied",
              "weren't sleeping / were studying",
            ]),
            answer: "wasn't sleeping / was studying",
            explanation:
              "Both describe what was in progress at the moment I arrived. Negative: wasn't + verb-ing.",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "rewrite",
            question:
              'Combine: "The sun was shining. We decided to go for a walk." → ___.',
            options: null,
            answer: "The sun was shining, so we decided to go for a walk",
            explanation:
              "The sun shining (past continuous) sets the scene; the decision (past simple) is the completed action.",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question: "___ you ___ when the earthquake happened?",
            options: JSON.stringify([
              "Were / sleeping",
              "Did / sleep",
              "Was / sleeping",
              "Are / sleeping",
            ]),
            answer: "Were / sleeping",
            explanation:
              "Past continuous question: Were + you + verb-ing? The earthquake (past simple) interrupted the action.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "fill-blank",
            question:
              "It ___ (rain) heavily, so we ___ (decide) to stay indoors.",
            options: JSON.stringify([
              "was raining / decided",
              "rained / decided",
              "was raining / was deciding",
              "rained / was deciding",
            ]),
            answer: "was raining / decided",
            explanation:
              "The rain was the ongoing background situation (past continuous). The decision was a completed action (past simple).",
            difficulty: 3,
            sortOrder: 9,
          },
          {
            type: "fill-blank",
            question:
              "This time last year, I ___ (live) in Tokyo.",
            options: JSON.stringify([
              "was living",
              "lived",
              "am living",
              "have lived",
            ]),
            answer: "was living",
            explanation:
              "'This time last year' sets a specific past moment. The action (living) was in progress at that time → past continuous.",
            difficulty: 2,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 15. Present Perfect Continuous (intermediate) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Present Perfect Continuous",
      slug: "present-perfect-continuous",
      description:
        "Express actions that started in the past and continue to the present, with emphasis on duration.",
      level: "intermediate",
      sortOrder: 15,
      content: `## Present Perfect Continuous

The **present perfect continuous** emphasises the **duration** of an activity that started in the past and continues up to now (or has just stopped with visible results). It is formed with **have/has + been + verb-ing**.

### When to Use It

1. **Action started in the past, still continuing**: *"I have been waiting for 30 minutes."*
2. **Recent action with visible evidence**: *"You're out of breath — have you been running?"*
3. **Emphasis on how long**: *"She has been studying English for three years."*

### Formation

- **I / You / We / They** + have been + verb-ing
- **He / She / It** + has been + verb-ing

### Present Perfect Simple vs Continuous

| Present Perfect Simple | Present Perfect Continuous |
|----------------------|---------------------------|
| Focus on **result/completion** | Focus on **duration/process** |
| *"I've read three books this month."* (result: 3 books) | *"I've been reading all day."* (emphasis: long time) |
| *"She has written the report."* (it's finished) | *"She has been writing the report."* (still working) |

### For and Since

Both are commonly used with this tense:
- **For** + duration: *"I've been working here for five years."*
- **Since** + starting point: *"He's been playing piano since he was six."*`,
      tips: `### Common Mistakes to Avoid

1. **Don't use with stative verbs**: ✗ *I have been knowing him for years* → ✓ *I have known him for years* (use present perfect simple).
2. **Don't confuse result vs duration**: Use simple for results (*"I've painted three rooms"*), continuous for duration (*"I've been painting all day"*).
3. **Don't forget 'been'**: ✗ *She has working all day* → ✓ *She has been working all day*.
4. **For vs Since**: ✗ *I've been studying since three hours* → ✓ *I've been studying for three hours*.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question:
              "She ___ (study) English for three years.",
            options: JSON.stringify([
              "has been studying",
              "has studied",
              "is studying",
              "studied",
            ]),
            answer: "has been studying",
            explanation:
              "'For three years' + emphasis on the ongoing duration → present perfect continuous: has been studying.",
            difficulty: 2,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "It ___ (rain) since morning. The streets are flooded.",
            options: JSON.stringify([
              "has been raining",
              "has rained",
              "is raining",
              "was raining",
            ]),
            answer: "has been raining",
            explanation:
              "The rain started in the past (since morning) and continues now, with visible results (flooded streets). Duration emphasis → present perfect continuous.",
            difficulty: 2,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question:
              "You look tired. ___ you ___ hard today?",
            options: JSON.stringify([
              "Have / been working",
              "Did / work",
              "Are / working",
              "Have / worked",
            ]),
            answer: "Have / been working",
            explanation:
              "Visible evidence (looking tired) + asking about recent activity → present perfect continuous question.",
            difficulty: 2,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question:
              "Which sentence emphasises DURATION rather than result?",
            options: JSON.stringify([
              "I've been reading all afternoon.",
              "I've read two chapters.",
              "I read the whole book.",
              "I'm reading a book now.",
            ]),
            answer: "I've been reading all afternoon.",
            explanation:
              "Present perfect continuous ('have been reading') emphasises how long the action has been going on, not the completed result.",
            difficulty: 3,
            sortOrder: 4,
          },
          {
            type: "fill-blank",
            question: "They ___ (wait) for the bus for over an hour.",
            options: JSON.stringify([
              "have been waiting",
              "are waiting",
              "waited",
              "have waited",
            ]),
            answer: "have been waiting",
            explanation:
              "'For over an hour' shows duration, and the waiting is presumably still happening → present perfect continuous.",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question:
              "He ___ (play) the piano since he was six years old.",
            options: JSON.stringify([
              "has been playing",
              "is playing",
              "has played",
              "was playing",
            ]),
            answer: "has been playing",
            explanation:
              "'Since he was six' marks the starting point of an ongoing activity. Duration emphasis → present perfect continuous.",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "multiple-choice",
            question:
              "Which sentence is INCORRECT?",
            options: JSON.stringify([
              "I have been knowing her for years.",
              "I have been working here for years.",
              "She has been teaching since 2015.",
              "They have been travelling all summer.",
            ]),
            answer: "I have been knowing her for years.",
            explanation:
              "'Know' is a stative verb and cannot be used in the continuous form. Say: 'I have known her for years.'",
            difficulty: 3,
            sortOrder: 7,
          },
          {
            type: "rewrite",
            question:
              "Choose the better form: \"I (read) three books this month.\" (focus on result)",
            options: null,
            answer: "I have read three books this month",
            explanation:
              "When the focus is on the result (how many), use present perfect simple, not continuous.",
            difficulty: 3,
            sortOrder: 8,
          },
          {
            type: "fill-blank",
            question:
              "Your eyes are red. ___ you ___ (cry)?",
            options: JSON.stringify([
              "Have / been crying",
              "Did / cry",
              "Are / crying",
              "Were / crying",
            ]),
            answer: "Have / been crying",
            explanation:
              "Visible evidence (red eyes) of a recent/ongoing activity → present perfect continuous question.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "multiple-choice",
            question:
              "We ___ all day and we're exhausted. (emphasis on duration)",
            options: JSON.stringify([
              "have been walking",
              "have walked",
              "walked",
              "are walking",
            ]),
            answer: "have been walking",
            explanation:
              "The exhaustion is evidence, and 'all day' emphasises the duration → present perfect continuous.",
            difficulty: 2,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 16. Gerunds and Infinitives (intermediate) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Gerunds and Infinitives",
      slug: "gerunds-infinitives",
      description:
        "Master which verbs are followed by -ing (gerund) and which by to + verb (infinitive), including verbs that change meaning.",
      level: "intermediate",
      sortOrder: 16,
      content: `## Gerunds and Infinitives

A **gerund** is the -ing form of a verb used as a noun (*swimming, reading*). An **infinitive** is *to + base verb* (*to swim, to read*). Many verbs are followed by one or the other — and some take both with different meanings.

### Verbs Followed by Gerund (-ing)

These verbs are always followed by the gerund:
*enjoy, avoid, suggest, mind, finish, keep, consider, admit, deny, practice, risk, imagine, miss, delay, can't help, give up*

- *"I enjoy **reading** before bed."*
- *"She avoided **making** eye contact."*

### Verbs Followed by Infinitive (to + verb)

These verbs are always followed by the infinitive:
*want, need, decide, hope, plan, agree, offer, refuse, learn, promise, expect, seem, afford, manage, pretend, tend*

- *"She decided **to leave** early."*
- *"They agreed **to help** us."*

### Verbs That Take Both (with Different Meanings)

| Verb | + Gerund | + Infinitive |
|------|----------|-------------|
| **stop** | *stop doing* = quit the action | *stop to do* = pause in order to do |
| **remember** | *remember doing* = recall a past action | *remember to do* = not forget a future task |
| **forget** | *forget doing* = not recall a past event | *forget to do* = not remember a task |
| **try** | *try doing* = experiment | *try to do* = make an effort |
| **regret** | *regret doing* = feel sorry about past | *regret to do* = feel sorry about what you must say |

### Gerund as Subject

The gerund can be the subject of a sentence:
- *"**Swimming** is great exercise."*
- *"**Learning** a language takes time."*`,
      tips: `### Common Mistakes to Avoid

1. **Don't use infinitive after 'enjoy'**: ✗ *I enjoy to read* → ✓ *I enjoy reading*.
2. **Don't use gerund after 'want'**: ✗ *I want going home* → ✓ *I want to go home*.
3. **Remember the meaning change with 'stop'**: *"He stopped smoking"* (quit) ≠ *"He stopped to smoke"* (paused to have a cigarette).
4. **After prepositions, always use gerund**: ✗ *I'm interested in to learn* → ✓ *I'm interested in learning*.
5. **Don't confuse 'used to' and 'be used to'**: *"I used to smoke"* (past habit, + infinitive). *"I'm used to working late"* (accustomed to, + gerund).`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "She enjoys ___ (read) novels before bed.",
            options: JSON.stringify([
              "reading",
              "to read",
              "read",
              "to reading",
            ]),
            answer: "reading",
            explanation:
              "'Enjoy' is always followed by the gerund (-ing form): enjoy reading.",
            difficulty: 2,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "They decided ___ (move) to a bigger city.",
            options: JSON.stringify([
              "to move",
              "moving",
              "move",
              "to moving",
            ]),
            answer: "to move",
            explanation:
              "'Decide' is followed by the infinitive (to + verb): decided to move.",
            difficulty: 2,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question:
              "He stopped ___ (smoke). He hasn't had a cigarette in months.",
            options: JSON.stringify([
              "smoking",
              "to smoke",
              "smoke",
              "to smoking",
            ]),
            answer: "smoking",
            explanation:
              "'Stop + gerund' means to quit doing something. He stopped smoking = he no longer smokes.",
            difficulty: 2,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question:
              "She was driving and stopped ___ (buy) some water at a shop.",
            options: JSON.stringify([
              "to buy",
              "buying",
              "buy",
              "to buying",
            ]),
            answer: "to buy",
            explanation:
              "'Stop + infinitive' means to pause what you're doing in order to do something else. She stopped to buy = she paused her driving to buy water.",
            difficulty: 3,
            sortOrder: 4,
          },
          {
            type: "fill-blank",
            question: "I can't help ___ (laugh) when he tells jokes.",
            options: JSON.stringify([
              "laughing",
              "to laugh",
              "laugh",
              "to laughing",
            ]),
            answer: "laughing",
            explanation:
              "'Can't help' is always followed by the gerund: can't help laughing = can't stop myself from laughing.",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question: "Do you mind ___ (close) the window?",
            options: JSON.stringify([
              "closing",
              "to close",
              "close",
              "to closing",
            ]),
            answer: "closing",
            explanation:
              "'Mind' is always followed by the gerund: Do you mind closing...?",
            difficulty: 2,
            sortOrder: 6,
          },
          {
            type: "multiple-choice",
            question: "I remember ___ (lock) the door. I'm sure of it.",
            options: JSON.stringify([
              "locking",
              "to lock",
              "lock",
              "to locking",
            ]),
            answer: "locking",
            explanation:
              "'Remember + gerund' = recall a past action that already happened. 'I remember locking the door' = I recall doing it.",
            difficulty: 3,
            sortOrder: 7,
          },
          {
            type: "fill-blank",
            question:
              "Please remember ___ (send) that email before you leave.",
            options: JSON.stringify([
              "to send",
              "sending",
              "send",
              "to sending",
            ]),
            answer: "to send",
            explanation:
              "'Remember + infinitive' = don't forget to do a future task. Please remember to send = don't forget.",
            difficulty: 3,
            sortOrder: 8,
          },
          {
            type: "fill-blank",
            question:
              "She's interested in ___ (learn) Japanese.",
            options: JSON.stringify([
              "learning",
              "to learn",
              "learn",
              "to learning",
            ]),
            answer: "learning",
            explanation:
              "After prepositions (in, of, about, at, etc.), always use the gerund: interested in learning.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "multiple-choice",
            question: "Which sentence is correct?",
            options: JSON.stringify([
              "He agreed to help us move.",
              "He agreed helping us move.",
              "He agreed help us move.",
              "He agreed to helping us move.",
            ]),
            answer: "He agreed to help us move.",
            explanation:
              "'Agree' is followed by the infinitive: agreed to help.",
            difficulty: 2,
            sortOrder: 10,
          },
          {
            type: "rewrite",
            question:
              "Complete: \"___ (swim) is great exercise.\" (gerund as subject)",
            options: null,
            answer: "Swimming is great exercise.",
            explanation:
              "When a verb is the subject of a sentence, use the gerund: Swimming is great exercise.",
            difficulty: 2,
            sortOrder: 11,
          },
          {
            type: "multiple-choice",
            question:
              "I tried ___ (fix) the computer, but it was too complicated. (experimented)",
            options: JSON.stringify([
              "fixing",
              "to fix",
              "fix",
              "to fixing",
            ]),
            answer: "fixing",
            explanation:
              "'Try + gerund' means to experiment or do something to see what happens. I tried fixing it = I experimented with fixing it.",
            difficulty: 3,
            sortOrder: 12,
          },
        ],
      },
    },
  });

  // --- 17. Countable and Uncountable Nouns (beginner) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Countable and Uncountable Nouns",
      slug: "countable-uncountable",
      description:
        "Distinguish between countable and uncountable nouns and use the correct quantifiers.",
      level: "beginner",
      sortOrder: 17,
      content: `## Countable and Uncountable Nouns

In English, nouns are either **countable** (can be counted: one book, two books) or **uncountable** (cannot be counted individually: water, music).

### Countable Nouns

Countable nouns have singular and plural forms:
- *one apple → two apples*
- *a chair → three chairs*
- *a child → five children*

They can be used with **a/an** (singular) and **numbers**: *"I ate an apple."* *"She has three dogs."*

### Uncountable Nouns

Uncountable nouns have **no plural form** and cannot be used with a/an or numbers directly:
- *water, milk, bread, rice, sugar, money, music, information, advice, news, furniture, luggage, equipment, research, knowledge, progress, homework, weather, traffic*

To quantify them, use expressions like: *a glass of water, a piece of advice, a slice of bread, a bit of news*

### Quantifiers

| Quantifier | Countable | Uncountable |
|-----------|-----------|-------------|
| **many** | ✓ *many books* | ✗ |
| **much** | ✗ | ✓ *much water* |
| **a few** | ✓ *a few friends* | ✗ |
| **a little** | ✗ | ✓ *a little sugar* |
| **some / any** | ✓ *some eggs* | ✓ *some milk* |
| **a lot of** | ✓ *a lot of people* | ✓ *a lot of time* |

### Common Tricky Uncountable Nouns

These words look like they should be countable but are NOT: *information, advice, news, homework, furniture, luggage, equipment, research, knowledge, progress*.

- ✗ *informations, advices, furnitures, luggages*
- ✓ *a piece of information, some advice, items of furniture*`,
      tips: `### Common Mistakes to Avoid

1. **Information is uncountable**: ✗ *I need some informations* → ✓ *I need some information* (or *a piece of information*).
2. **Advice is uncountable**: ✗ *She gave me an advice* → ✓ *She gave me some advice* (or *a piece of advice*).
3. **Don't confuse few/little**: *few* = countable (*few books*); *little* = uncountable (*little time*). *A few / a little* = some (positive). *Few / little* without "a" = almost none (negative).
4. **News is singular**: ✗ *The news are bad* → ✓ *The news is bad*.`,
      exercises: {
        create: [
          {
            type: "multiple-choice",
            question: "Which noun is UNCOUNTABLE?",
            options: JSON.stringify([
              "information",
              "book",
              "apple",
              "chair",
            ]),
            answer: "information",
            explanation:
              "'Information' is uncountable. You cannot say 'one information' or 'two informations'. Use 'a piece of information'.",
            difficulty: 1,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "There isn't ___ milk in the fridge.",
            options: JSON.stringify(["much", "many", "few", "a few"]),
            answer: "much",
            explanation:
              "'Milk' is uncountable, so we use 'much' (not 'many'). 'Many' is for countable nouns.",
            difficulty: 1,
            sortOrder: 2,
          },
          {
            type: "fill-blank",
            question: "She doesn't have ___ friends in her new city.",
            options: JSON.stringify(["many", "much", "a little", "little"]),
            answer: "many",
            explanation:
              "'Friends' is countable, so we use 'many' (not 'much'). 'Much' is for uncountable nouns.",
            difficulty: 1,
            sortOrder: 3,
          },
          {
            type: "multiple-choice",
            question: "Which sentence is correct?",
            options: JSON.stringify([
              "Can you give me some advice?",
              "Can you give me an advice?",
              "Can you give me some advices?",
              "Can you give me few advices?",
            ]),
            answer: "Can you give me some advice?",
            explanation:
              "'Advice' is uncountable — no plural, no 'a/an'. Use 'some advice' or 'a piece of advice'.",
            difficulty: 1,
            sortOrder: 4,
          },
          {
            type: "fill-blank",
            question: "We only have ___ sugar left. We need to buy more.",
            options: JSON.stringify(["a little", "a few", "many", "few"]),
            answer: "a little",
            explanation:
              "'Sugar' is uncountable → use 'a little' (a small amount). 'A few' is for countable nouns.",
            difficulty: 1,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question: "I have ___ questions about the homework.",
            options: JSON.stringify(["a few", "a little", "much", "little"]),
            answer: "a few",
            explanation:
              "'Questions' is countable → use 'a few' (some, not many). 'A little' is for uncountable nouns.",
            difficulty: 1,
            sortOrder: 6,
          },
          {
            type: "multiple-choice",
            question: "The news ___ shocking this morning.",
            options: JSON.stringify(["is", "are", "were", "have been"]),
            answer: "is",
            explanation:
              "'News' looks plural but is actually an uncountable singular noun. It takes a singular verb: 'The news is...'",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "fill-blank",
            question: "We need to buy some ___ for the new apartment.",
            options: JSON.stringify([
              "furniture",
              "furnitures",
              "a furniture",
              "furnishing",
            ]),
            answer: "furniture",
            explanation:
              "'Furniture' is uncountable — it has no plural form. Say 'some furniture' or 'pieces of furniture'.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "multiple-choice",
            question: "How ___ luggage do you have?",
            options: JSON.stringify(["much", "many", "few", "number of"]),
            answer: "much",
            explanation:
              "'Luggage' is uncountable, so we use 'How much'. For countable nouns, we'd use 'How many'.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "rewrite",
            question:
              "Correct the error: \"She gave me a lot of useful informations.\"",
            options: null,
            answer: "She gave me a lot of useful information.",
            explanation:
              "'Information' is uncountable and has no plural form. Remove the 's': a lot of useful information.",
            difficulty: 1,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 18. Subject-Verb Agreement (intermediate) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Subject-Verb Agreement",
      slug: "subject-verb-agreement",
      description:
        "Ensure subjects and verbs agree in number, including tricky cases with collective nouns, compound subjects, and special constructions.",
      level: "intermediate",
      sortOrder: 18,
      content: `## Subject-Verb Agreement

In English, the **subject and verb must agree in number**: a singular subject takes a singular verb, and a plural subject takes a plural verb.

### Basic Rule

- **Singular**: *"The dog **runs** fast."*
- **Plural**: *"The dogs **run** fast."*

### Tricky Cases

**Collective nouns** (team, family, class, group, audience, government):
- Usually **singular** in American English: *"The team **is** winning."*
- Can be **plural** in British English when emphasising individuals: *"The team **are** arguing among themselves."*

**Either...or / Neither...nor** — the verb agrees with the **nearest subject**:
- *"Neither the teacher nor the students **were** late."*
- *"Either the students or the teacher **was** late."*

**Each / Every** — always singular:
- *"**Each** student **has** a textbook."*
- *"**Every** child **deserves** love."*

**There is / There are**:
- *"There **is** a book on the table."* (singular)
- *"There **are** three books on the table."* (plural)

### Nouns That Look Plural but Are Singular

*news, mathematics, physics, economics, politics (as a subject), athletics, the United States, measles*
- *"The news **is** surprising."*
- *"Mathematics **is** my favourite subject."*

### Compound Subjects

- **And** = plural: *"Tom **and** Jerry **are** friends."*
- Exception: when they refer to **one thing**: *"Bread and butter **is** my favourite breakfast."*`,
      tips: `### Common Mistakes to Avoid

1. **Don't be tricked by words between subject and verb**: ✗ *The list of items are on the table* → ✓ *The list of items **is** on the table* (subject = list, singular).
2. **Each/Every are always singular**: ✗ *Every students need a book* → ✓ *Every student needs a book*.
3. **There is/are must match the noun that follows**: ✗ *There is many people here* → ✓ *There are many people here*.
4. **News is singular**: ✗ *The news are bad* → ✓ *The news is bad*.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "The list of items ___ on the desk.",
            options: JSON.stringify(["is", "are", "were", "have been"]),
            answer: "is",
            explanation:
              "The subject is 'the list' (singular), not 'items'. 'Of items' is a prepositional phrase that doesn't change the subject.",
            difficulty: 2,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "Each of the students ___ a textbook.",
            options: JSON.stringify(["has", "have", "are having", "had"]),
            answer: "has",
            explanation:
              "'Each' is always singular, even when followed by 'of the students'. → Each ... has.",
            difficulty: 2,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question: "Neither the teacher nor the students ___ ready.",
            options: JSON.stringify(["were", "was", "is", "has been"]),
            answer: "were",
            explanation:
              "With 'neither...nor', the verb agrees with the nearest subject: 'the students' is plural → were.",
            difficulty: 3,
            sortOrder: 3,
          },
          {
            type: "fill-blank",
            question: "There ___ a lot of traffic on the highway this morning.",
            options: JSON.stringify(["is", "are", "were", "have been"]),
            answer: "is",
            explanation:
              "'Traffic' is uncountable and singular → There is. Don't be misled by 'a lot of'.",
            difficulty: 2,
            sortOrder: 4,
          },
          {
            type: "multiple-choice",
            question: "Mathematics ___ my favourite subject.",
            options: JSON.stringify(["is", "are", "were", "have been"]),
            answer: "is",
            explanation:
              "'Mathematics' looks plural but is a singular noun (it's one subject). → Mathematics is.",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question: "Tom and Jerry ___ best friends.",
            options: JSON.stringify(["are", "is", "was", "has been"]),
            answer: "are",
            explanation:
              "Two subjects joined by 'and' form a plural subject → are.",
            difficulty: 1,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question: "Every student in the class ___ passed the exam.",
            options: JSON.stringify(["has", "have", "are", "had"]),
            answer: "has",
            explanation:
              "'Every' always takes a singular verb, regardless of the noun that follows. → Every student has passed.",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question: "The news about the elections ___ surprising.",
            options: JSON.stringify(["is", "are", "were", "have been"]),
            answer: "is",
            explanation:
              "'News' is always singular even though it ends in -s. → The news is surprising.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "fill-blank",
            question: "There ___ several reasons for the delay.",
            options: JSON.stringify(["are", "is", "was", "has been"]),
            answer: "are",
            explanation:
              "'Reasons' is plural → There are several reasons. The verb must match the noun after 'there is/are'.",
            difficulty: 2,
            sortOrder: 9,
          },
          {
            type: "rewrite",
            question:
              "Correct the error: \"Either the manager or his assistants is attending the meeting.\"",
            options: null,
            answer: "Either the manager or his assistants are attending the meeting.",
            explanation:
              "With 'either...or', the verb agrees with the nearest subject: 'his assistants' is plural → are attending.",
            difficulty: 3,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 19. Conjunctions and Connectors (intermediate) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Conjunctions and Connectors",
      slug: "conjunctions-connectors",
      description:
        "Link ideas, clauses, and sentences using coordinating, subordinating, and correlative conjunctions.",
      level: "intermediate",
      sortOrder: 19,
      content: `## Conjunctions and Connectors

Conjunctions are words that **join** clauses, sentences, or words together. They help create logical connections between ideas.

### Coordinating Conjunctions (FANBOYS)

**F**or, **A**nd, **N**or, **B**ut, **O**r, **Y**et, **S**o

These join two **equal** (independent) clauses:
- *"I was tired, **but** I kept working."*
- *"She studied hard, **so** she passed the exam."*
- *"He doesn't like tea **or** coffee."*

### Subordinating Conjunctions

These introduce a **dependent clause** that cannot stand alone:
- **Cause/Reason**: *because, since, as*
- **Contrast**: *although, though, even though, while, whereas*
- **Time**: *when, while, before, after, until, since, as soon as*
- **Condition**: *if, unless, provided that*

*"**Although** it was raining, we went for a walk."*
*"I'll wait **until** you're ready."*

### Correlative Conjunctions

These come in pairs:
- **both … and**: *"She speaks **both** French **and** German."*
- **either … or**: *"You can have **either** tea **or** coffee."*
- **neither … nor**: *"He **neither** called **nor** wrote."*
- **not only … but also**: *"She is **not only** smart **but also** kind."*

### Transition Words

For connecting ideas across sentences:
- **Addition**: moreover, furthermore, in addition, also
- **Contrast**: however, nevertheless, on the other hand
- **Result**: therefore, consequently, as a result, thus
- **Example**: for example, for instance, such as`,
      tips: `### Common Mistakes to Avoid

1. **Don't start with 'because' and leave the sentence incomplete**: ✗ *Because I was tired.* (fragment) → ✓ *Because I was tired, I went to bed early.*
2. **But vs However**: 'But' joins clauses with a comma. 'However' starts a new sentence or follows a semicolon: *"I was tired; however, I kept working."*
3. **Despite / In spite of + noun/gerund**: ✗ *Despite it was raining* → ✓ *Despite the rain* or *Although it was raining*.
4. **Either...or (not neither...or)**: ✗ *Neither tea or coffee* → ✓ *Neither tea nor coffee*.`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "She was tired, ___ she continued working.",
            options: JSON.stringify(["but", "so", "because", "and"]),
            answer: "but",
            explanation:
              "'But' shows contrast: she was tired (expectation: stop) but continued working (opposite).",
            difficulty: 2,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "I couldn't sleep ___ there was too much noise outside.",
            options: JSON.stringify(["because", "but", "so", "although"]),
            answer: "because",
            explanation:
              "'Because' introduces a reason/cause: the noise was the reason I couldn't sleep.",
            difficulty: 1,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question: "___ it was raining heavily, we decided to go out.",
            options: JSON.stringify([
              "Although",
              "Because",
              "So",
              "Therefore",
            ]),
            answer: "Although",
            explanation:
              "'Although' introduces a contrast: despite the rain, we still went out.",
            difficulty: 2,
            sortOrder: 3,
          },
          {
            type: "fill-blank",
            question:
              "She speaks ___ French ___ German fluently.",
            options: JSON.stringify([
              "both / and",
              "either / or",
              "neither / nor",
              "not only / and",
            ]),
            answer: "both / and",
            explanation:
              "'Both...and' means she speaks the two languages: French AND German.",
            difficulty: 2,
            sortOrder: 4,
          },
          {
            type: "multiple-choice",
            question:
              "He studied hard; ___, he didn't pass the exam.",
            options: JSON.stringify([
              "however",
              "therefore",
              "moreover",
              "furthermore",
            ]),
            answer: "however",
            explanation:
              "'However' shows unexpected contrast. Despite studying hard, he still didn't pass.",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question:
              "I'll wait here ___ you come back.",
            options: JSON.stringify(["until", "although", "because", "but"]),
            answer: "until",
            explanation:
              "'Until' means up to the point when: I'll wait from now until you return.",
            difficulty: 1,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question:
              "You can have ___ tea ___ coffee. Which do you prefer?",
            options: JSON.stringify([
              "either / or",
              "both / and",
              "neither / nor",
              "not only / but also",
            ]),
            answer: "either / or",
            explanation:
              "'Either...or' presents two alternatives: one or the other.",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question: "Which transition word shows a RESULT?",
            options: JSON.stringify([
              "therefore",
              "however",
              "although",
              "furthermore",
            ]),
            answer: "therefore",
            explanation:
              "'Therefore' means 'as a result' or 'for that reason'. It shows cause and effect.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "rewrite",
            question:
              "Join the sentences: \"She is very talented. She is very hardworking.\" (use not only...but also)",
            options: null,
            answer: "She is not only very talented but also very hardworking.",
            explanation:
              "'Not only...but also' connects two complementary qualities: talented AND hardworking.",
            difficulty: 3,
            sortOrder: 9,
          },
          {
            type: "fill-blank",
            question:
              "___ I finish my homework, I'll watch TV.",
            options: JSON.stringify([
              "After",
              "Although",
              "Because",
              "However",
            ]),
            answer: "After",
            explanation:
              "'After' introduces a time relationship: first homework, then TV.",
            difficulty: 1,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 20. Question Tags (beginner) ---
  await prisma.grammarTopic.create({
    data: {
      title: "Question Tags",
      slug: "question-tags",
      description:
        "Form mini-questions at the end of statements to confirm or check information.",
      level: "beginner",
      sortOrder: 20,
      content: `## Question Tags

A **question tag** is a short question added to the end of a statement. It's used to **confirm information** or **seek agreement**.

### The Basic Rule

- **Positive statement → negative tag**: *"You are coming, **aren't you**?"*
- **Negative statement → positive tag**: *"She doesn't like it, **does she**?"*

### Formation

The tag uses the **same auxiliary/modal verb** as the main clause, with the **opposite** polarity:

| Main Clause | Tag |
|-------------|-----|
| *She **is** a teacher* | *isn't she?* |
| *They **have** finished* | *haven't they?* |
| *He **can** swim* | *can't he?* |
| *You **don't** like it* | *do you?* |
| *She **won't** come* | *will she?* |

For **simple tenses** without an auxiliary, use **do/does/did**:
- *"You like coffee, **don't you**?"*
- *"She works here, **doesn't she**?"*
- *"They went home, **didn't they**?"*

### Special Cases

- **I am → aren't I**: *"I'm right, **aren't I**?"* (not "amn't I")
- **Let's → shall we**: *"Let's go, **shall we**?"*
- **Imperatives → will you / won't you**: *"Close the door, **will you**?"*
- **There is/are → isn't/aren't there**: *"There are many people, **aren't there**?"*
- **Nobody/nothing/never** (negative meaning) → **positive tag**: *"Nobody called, **did they**?"*`,
      tips: `### Common Mistakes to Avoid

1. **Don't use the same polarity**: ✗ *She is coming, is she?* → ✓ *She is coming, isn't she?* (Exception: rising intonation for surprise.)
2. **Match the auxiliary**: ✗ *She can swim, doesn't she?* → ✓ *She can swim, can't she?*
3. **I am → aren't I**: ✗ *I'm right, amn't I?* → ✓ *I'm right, aren't I?*
4. **Negative words need positive tags**: *"He never arrives on time, **does he**?"* ('Never' is already negative.)
5. **With 'nobody/nothing', use plural pronoun 'they' in the tag**: *"Nobody likes that, **do they**?"*`,
      exercises: {
        create: [
          {
            type: "fill-blank",
            question: "She is coming to the party, ___?",
            options: JSON.stringify([
              "isn't she",
              "is she",
              "doesn't she",
              "won't she",
            ]),
            answer: "isn't she",
            explanation:
              "Positive statement with 'is' → negative tag 'isn't she'. The auxiliary matches the main clause.",
            difficulty: 1,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "They don't live here, ___?",
            options: JSON.stringify([
              "do they",
              "don't they",
              "are they",
              "did they",
            ]),
            answer: "do they",
            explanation:
              "Negative statement with 'don't' → positive tag 'do they'.",
            difficulty: 1,
            sortOrder: 2,
          },
          {
            type: "multiple-choice",
            question: "You like coffee, ___?",
            options: JSON.stringify([
              "don't you",
              "do you",
              "aren't you",
              "isn't it",
            ]),
            answer: "don't you",
            explanation:
              "Positive statement in present simple (no auxiliary) → use 'do/don't' for the tag. Positive → negative: don't you.",
            difficulty: 1,
            sortOrder: 3,
          },
          {
            type: "fill-blank",
            question: "He can swim, ___?",
            options: JSON.stringify([
              "can't he",
              "can he",
              "doesn't he",
              "isn't he",
            ]),
            answer: "can't he",
            explanation:
              "The main clause has 'can' (positive) → the tag uses 'can't' (negative). Match the modal verb.",
            difficulty: 1,
            sortOrder: 4,
          },
          {
            type: "multiple-choice",
            question: "I'm right, ___?",
            options: JSON.stringify([
              "aren't I",
              "am I not",
              "isn't I",
              "don't I",
            ]),
            answer: "aren't I",
            explanation:
              "Special case: 'I am' uses 'aren't I' in the question tag (not 'amn't I', which doesn't exist).",
            difficulty: 2,
            sortOrder: 5,
          },
          {
            type: "fill-blank",
            question: "They went to the cinema, ___?",
            options: JSON.stringify([
              "didn't they",
              "did they",
              "weren't they",
              "don't they",
            ]),
            answer: "didn't they",
            explanation:
              "Positive past simple (no auxiliary) → use 'didn't' for the tag: didn't they.",
            difficulty: 1,
            sortOrder: 6,
          },
          {
            type: "fill-blank",
            question: "Let's go for a walk, ___?",
            options: JSON.stringify([
              "shall we",
              "will we",
              "do we",
              "let us",
            ]),
            answer: "shall we",
            explanation:
              "Special case: 'Let's...' always uses 'shall we' as the question tag.",
            difficulty: 2,
            sortOrder: 7,
          },
          {
            type: "multiple-choice",
            question: "Nobody called this morning, ___?",
            options: JSON.stringify([
              "did they",
              "didn't they",
              "did he",
              "didn't he",
            ]),
            answer: "did they",
            explanation:
              "'Nobody' has a negative meaning, so the tag is positive. Use 'they' as the pronoun for 'nobody'.",
            difficulty: 2,
            sortOrder: 8,
          },
          {
            type: "fill-blank",
            question: "She won't be late, ___?",
            options: JSON.stringify([
              "will she",
              "won't she",
              "is she",
              "does she",
            ]),
            answer: "will she",
            explanation:
              "Negative 'won't' → positive tag 'will she'. The auxiliary matches.",
            difficulty: 1,
            sortOrder: 9,
          },
          {
            type: "rewrite",
            question:
              "Add the correct question tag: \"There are a lot of people here, ___?\"",
            options: null,
            answer: "aren't there",
            explanation:
              "Positive 'there are' → negative tag 'aren't there'. The 'there' structure uses 'there' in the tag.",
            difficulty: 2,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  console.log("  ✓ Grammar done: 20 topics, ~220 exercises\n");
}
