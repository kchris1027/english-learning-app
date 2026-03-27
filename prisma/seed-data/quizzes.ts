import { PrismaClient } from "@prisma/client";

export async function seedQuizzes(prisma: PrismaClient) {
  console.log("  📝 Seeding quizzes...");

  // --- 1. Placement Test (10 questions, mixed difficulty) ---
  await prisma.quiz.create({
    data: {
      title: "Placement Test",
      description:
        "Determine your current English level with a mix of vocabulary and grammar questions ranging from beginner to advanced.",
      type: "placement",
      level: null,
      modules: JSON.stringify(["vocabulary", "grammar"]),
      timeLimit: 900,
      questionCount: 10,
      passingScore: 60,
      questions: {
        create: [
          {
            module: "vocabulary",
            type: "multiple-choice",
            question: 'What does the word "abandon" mean?',
            options: JSON.stringify([
              "To keep something safe",
              "To give up completely",
              "To build from scratch",
              "To move quickly",
            ]),
            answer: "To give up completely",
            explanation:
              '"Abandon" means to cease to support or look after; to give up completely.',
            points: 1,
            sortOrder: 1,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'Choose the word that best completes the sentence: "The scientist made a significant _____ in cancer research."',
            options: JSON.stringify([
              "breakthrough",
              "breakup",
              "breakdown",
              "breakout",
            ]),
            answer: "breakthrough",
            explanation:
              '"Breakthrough" means an important discovery or development, especially in science.',
            points: 1,
            sortOrder: 2,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question: 'Which word is a synonym of "meticulous"?',
            options: JSON.stringify([
              "Careless",
              "Thorough",
              "Rapid",
              "Generous",
            ]),
            answer: "Thorough",
            explanation:
              '"Meticulous" means showing great attention to detail; very careful and precise, similar to "thorough."',
            points: 1,
            sortOrder: 3,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              "Choose the correct sentence:",
            options: JSON.stringify([
              "She don't like coffee.",
              "She doesn't likes coffee.",
              "She doesn't like coffee.",
              "She not like coffee.",
            ]),
            answer: "She doesn't like coffee.",
            explanation:
              'With third-person singular subjects, we use "doesn\'t" + base form of the verb.',
            points: 1,
            sortOrder: 4,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              "Select the correct form: \"If I _____ you, I would accept the offer.\"",
            options: JSON.stringify(["am", "was", "were", "be"]),
            answer: "were",
            explanation:
              'In second conditional (hypothetical) sentences, we use "were" for all subjects: "If I were you..."',
            points: 1,
            sortOrder: 5,
          },
          {
            module: "vocabulary",
            type: "true-false",
            question:
              '"Ubiquitous" means something that is found everywhere.',
            options: JSON.stringify(["True", "False"]),
            answer: "True",
            explanation:
              '"Ubiquitous" means present, appearing, or found everywhere.',
            points: 1,
            sortOrder: 6,
          },
          {
            module: "grammar",
            type: "fill-blank",
            question:
              'Complete the sentence: "By the time we arrived, the movie _____." (already / start)',
            options: null,
            answer: "had already started",
            explanation:
              'The past perfect tense ("had already started") is used for an action completed before another past action.',
            points: 1,
            sortOrder: 7,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'What does the idiom "break the ice" mean?',
            options: JSON.stringify([
              "To destroy something frozen",
              "To initiate conversation in an awkward situation",
              "To solve a difficult problem",
              "To arrive very early",
            ]),
            answer: "To initiate conversation in an awkward situation",
            explanation:
              '"Break the ice" means to do or say something to relieve tension or start conversation in a social setting.',
            points: 1,
            sortOrder: 8,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              '"The report _____ by the team before the deadline." Choose the correct passive form.',
            options: JSON.stringify([
              "was completed",
              "completed",
              "has completing",
              "were completed",
            ]),
            answer: "was completed",
            explanation:
              'The singular subject "report" requires "was completed" in the past passive voice.',
            points: 1,
            sortOrder: 9,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              'Which sentence uses the present perfect correctly?',
            options: JSON.stringify([
              "I have went to Paris last year.",
              "I have been to Paris three times.",
              "I have go to Paris before.",
              "I been to Paris already.",
            ]),
            answer: "I have been to Paris three times.",
            explanation:
              'Present perfect uses "have/has" + past participle. "Have been" is the correct form of "go" in present perfect for experiences.',
            points: 1,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 2. Beginner Review (8 questions) ---
  await prisma.quiz.create({
    data: {
      title: "Beginner Review",
      description:
        "Review basic English vocabulary and grammar fundamentals. Ideal for learners who are just getting started.",
      type: "review",
      level: "beginner",
      modules: JSON.stringify(["vocabulary", "grammar"]),
      timeLimit: 600,
      questionCount: 8,
      passingScore: 60,
      questions: {
        create: [
          {
            module: "vocabulary",
            type: "multiple-choice",
            question: 'What is the opposite of "happy"?',
            options: JSON.stringify(["Angry", "Sad", "Tired", "Excited"]),
            answer: "Sad",
            explanation:
              'The opposite (antonym) of "happy" is "sad." Both describe basic emotions.',
            points: 1,
            sortOrder: 1,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'Which word means "a place where you can borrow books"?',
            options: JSON.stringify([
              "Hospital",
              "Library",
              "Restaurant",
              "Museum",
            ]),
            answer: "Library",
            explanation:
              "A library is a building or room containing collections of books for people to read or borrow.",
            points: 1,
            sortOrder: 2,
          },
          {
            module: "vocabulary",
            type: "true-false",
            question: '"Beautiful" and "ugly" are synonyms.',
            options: JSON.stringify(["True", "False"]),
            answer: "False",
            explanation:
              '"Beautiful" and "ugly" are antonyms (opposites), not synonyms.',
            points: 1,
            sortOrder: 3,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'Choose the correct word: "I need to _____ some groceries from the store."',
            options: JSON.stringify(["buy", "bye", "by", "bi"]),
            answer: "buy",
            explanation:
              '"Buy" means to purchase something. "Bye" is a farewell, "by" is a preposition, and "bi" is a prefix.',
            points: 1,
            sortOrder: 4,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              'Choose the correct form: "She _____ to school every day."',
            options: JSON.stringify(["go", "goes", "going", "gone"]),
            answer: "goes",
            explanation:
              'For third-person singular (she/he/it), we add "-s" or "-es" to the base verb in the simple present tense.',
            points: 1,
            sortOrder: 5,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              'Which sentence is correct?',
            options: JSON.stringify([
              "There is three cats.",
              "There are three cats.",
              "There be three cats.",
              "There have three cats.",
            ]),
            answer: "There are three cats.",
            explanation:
              'We use "there are" with plural nouns. "There is" is used with singular nouns.',
            points: 1,
            sortOrder: 6,
          },
          {
            module: "grammar",
            type: "fill-blank",
            question:
              'Fill in the blank: "I _____ a student." (be)',
            options: null,
            answer: "am",
            explanation:
              'With the first-person subject "I," the correct form of "be" is "am."',
            points: 1,
            sortOrder: 7,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              '"They _____ playing football yesterday." Choose the correct past continuous form.',
            options: JSON.stringify(["was", "were", "are", "is"]),
            answer: "were",
            explanation:
              'With the plural subject "they," we use "were" to form the past continuous tense.',
            points: 1,
            sortOrder: 8,
          },
        ],
      },
    },
  });

  // --- 3. Intermediate Review (10 questions) ---
  await prisma.quiz.create({
    data: {
      title: "Intermediate Review",
      description:
        "Test your intermediate English skills with questions on word meanings, synonyms, context clues, tense usage, passive voice, and conditionals.",
      type: "review",
      level: "intermediate",
      modules: JSON.stringify(["vocabulary", "grammar"]),
      timeLimit: 720,
      questionCount: 10,
      passingScore: 65,
      questions: {
        create: [
          {
            module: "vocabulary",
            type: "multiple-choice",
            question: 'What does the word "resilient" mean?',
            options: JSON.stringify([
              "Easily broken",
              "Able to recover quickly from difficulties",
              "Very expensive",
              "Difficult to understand",
            ]),
            answer: "Able to recover quickly from difficulties",
            explanation:
              '"Resilient" describes someone or something that can withstand or recover quickly from challenging conditions.',
            points: 1,
            sortOrder: 1,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'Which word is closest in meaning to "conceal"?',
            options: JSON.stringify(["Reveal", "Hide", "Repair", "Celebrate"]),
            answer: "Hide",
            explanation:
              '"Conceal" means to keep something secret or to hide it from view.',
            points: 1,
            sortOrder: 2,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              '"The politician tried to _____ the controversy by changing the subject." Choose the best word.',
            options: JSON.stringify([
              "amplify",
              "deflect",
              "embrace",
              "illustrate",
            ]),
            answer: "deflect",
            explanation:
              '"Deflect" means to cause something to change direction or to divert attention away from something.',
            points: 1,
            sortOrder: 3,
          },
          {
            module: "vocabulary",
            type: "true-false",
            question:
              '"Ambiguous" means having a clear and definite meaning.',
            options: JSON.stringify(["True", "False"]),
            answer: "False",
            explanation:
              '"Ambiguous" means open to more than one interpretation; not having a clear meaning — the opposite of what the statement claims.',
            points: 1,
            sortOrder: 4,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'In the sentence "The unprecedented crisis required immediate action," what does "unprecedented" mean?',
            options: JSON.stringify([
              "Expected and normal",
              "Never done or known before",
              "Happening repeatedly",
              "Slightly unusual",
            ]),
            answer: "Never done or known before",
            explanation:
              '"Unprecedented" means never having happened or existed in the past.',
            points: 1,
            sortOrder: 5,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              '"She _____ for two hours when the phone rang." Choose the correct tense.',
            options: JSON.stringify([
              "studied",
              "has studied",
              "had been studying",
              "was study",
            ]),
            answer: "had been studying",
            explanation:
              "The past perfect continuous (had been studying) describes an action that was ongoing before another past event.",
            points: 1,
            sortOrder: 6,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              'Convert to passive voice: "The chef prepared a delicious meal."',
            options: JSON.stringify([
              "A delicious meal prepared by the chef.",
              "A delicious meal was prepared by the chef.",
              "A delicious meal is prepared by the chef.",
              "A delicious meal has prepared by the chef.",
            ]),
            answer: "A delicious meal was prepared by the chef.",
            explanation:
              'Passive voice in simple past: subject + "was/were" + past participle + "by" + agent.',
            points: 1,
            sortOrder: 7,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              '"If it _____ tomorrow, we will cancel the picnic." Choose the correct form.',
            options: JSON.stringify(["rains", "will rain", "rained", "rain"]),
            answer: "rains",
            explanation:
              "In first conditional sentences (real future possibility), we use the simple present in the if-clause and will + base verb in the main clause.",
            points: 1,
            sortOrder: 8,
          },
          {
            module: "grammar",
            type: "fill-blank",
            question:
              'Complete the sentence: "The windows _____ every week by the cleaning staff." (clean — passive, simple present)',
            options: null,
            answer: "are cleaned",
            explanation:
              'Simple present passive for plural subjects: "are" + past participle.',
            points: 1,
            sortOrder: 9,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              '"If I had known about the meeting, I _____ attended." Choose the correct form.',
            options: JSON.stringify([
              "will have",
              "would have",
              "would",
              "had",
            ]),
            answer: "would have",
            explanation:
              'Third conditional (past hypothetical): "If + past perfect, would have + past participle." This expresses a regret about the past.',
            points: 1,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 4. Advanced Review (10 questions) ---
  await prisma.quiz.create({
    data: {
      title: "Advanced Review",
      description:
        "Challenge your advanced English with nuanced vocabulary, formal register, idioms, reported speech, and subtle grammatical distinctions.",
      type: "review",
      level: "advanced",
      modules: JSON.stringify(["vocabulary", "grammar"]),
      timeLimit: 720,
      questionCount: 10,
      passingScore: 70,
      questions: {
        create: [
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'What is the nuanced difference between "envy" and "jealousy"?',
            options: JSON.stringify([
              "They are completely identical in meaning",
              "Envy is wanting what someone else has; jealousy is fear of losing what you have",
              "Jealousy is positive; envy is negative",
              "Envy applies only to objects; jealousy applies only to people",
            ]),
            answer:
              "Envy is wanting what someone else has; jealousy is fear of losing what you have",
            explanation:
              "While often used interchangeably, envy refers to desiring something someone else possesses, whereas jealousy involves the fear of losing something you already have to a rival.",
            points: 1,
            sortOrder: 1,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'Which word best fits formal academic writing? "The results _____ the initial hypothesis."',
            options: JSON.stringify([
              "backed up",
              "corroborated",
              "helped out",
              "went along with",
            ]),
            answer: "corroborated",
            explanation:
              '"Corroborated" is the formal, academic term meaning to confirm or give support to a statement or theory. The other options are too informal for academic writing.',
            points: 1,
            sortOrder: 2,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'What does the idiom "a double-edged sword" mean?',
            options: JSON.stringify([
              "A very sharp weapon",
              "Something that has both advantages and disadvantages",
              "A situation with no solution",
              "An argument between two people",
            ]),
            answer:
              "Something that has both advantages and disadvantages",
            explanation:
              '"A double-edged sword" refers to something that can have both favorable and unfavorable consequences.',
            points: 1,
            sortOrder: 3,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              '"The CEO\'s _____ remarks at the press conference caused the stock price to plummet." Choose the most fitting word.',
            options: JSON.stringify([
              "eloquent",
              "incendiary",
              "mundane",
              "ambivalent",
            ]),
            answer: "incendiary",
            explanation:
              '"Incendiary" means tending to cause strong negative reactions or controversy. "Eloquent" means well-spoken, "mundane" means ordinary, and "ambivalent" means having mixed feelings.',
            points: 1,
            sortOrder: 4,
          },
          {
            module: "vocabulary",
            type: "true-false",
            question:
              'The phrase "to play devil\'s advocate" means to genuinely support an evil position.',
            options: JSON.stringify(["True", "False"]),
            answer: "False",
            explanation:
              "To play devil's advocate means to argue a position you don't necessarily agree with, for the sake of discussion or to explore an alternative viewpoint.",
            points: 1,
            sortOrder: 5,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              'Convert to reported speech: She said, "I will finish the project by Friday."',
            options: JSON.stringify([
              "She said that she will finish the project by Friday.",
              "She said that she would finish the project by Friday.",
              "She said that she finished the project by Friday.",
              "She said that she is finishing the project by Friday.",
            ]),
            answer:
              "She said that she would finish the project by Friday.",
            explanation:
              'In reported speech, "will" shifts to "would" and pronouns change accordingly. The tense shifts back one step.',
            points: 1,
            sortOrder: 6,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              '"Had the team _____ harder, they might have won the championship." Choose the correct form.',
            options: JSON.stringify([
              "practiced",
              "practicing",
              "practice",
              "to practice",
            ]),
            answer: "practiced",
            explanation:
              'This is an inverted third conditional: "Had + subject + past participle" replaces "If + subject + had + past participle."',
            points: 1,
            sortOrder: 7,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              'Which sentence correctly uses a mixed conditional?',
            options: JSON.stringify([
              "If I studied medicine, I would be a doctor now.",
              "If I had studied medicine, I would be a doctor now.",
              "If I had studied medicine, I would have been a doctor now.",
              "If I studied medicine, I would have been a doctor now.",
            ]),
            answer:
              "If I had studied medicine, I would be a doctor now.",
            explanation:
              'A mixed conditional combines a past condition (if + past perfect) with a present result (would + base verb): "If I had studied medicine, I would be a doctor now."',
            points: 1,
            sortOrder: 8,
          },
          {
            module: "grammar",
            type: "fill-blank",
            question:
              'Rewrite in reported speech: He asked, "Where do you live?" → He asked me where I _____.',
            options: null,
            answer: "lived",
            explanation:
              'In reported speech for questions, "do you live" becomes "I lived" — the tense shifts from present simple to past simple, and the word order becomes declarative.',
            points: 1,
            sortOrder: 9,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              '"It is essential that every student _____ the exam on time." Choose the correct subjunctive form.',
            options: JSON.stringify([
              "takes",
              "take",
              "took",
              "will take",
            ]),
            answer: "take",
            explanation:
              'After expressions of necessity like "it is essential that," the subjunctive mood requires the base form of the verb (without -s), regardless of the subject.',
            points: 1,
            sortOrder: 10,
          },
        ],
      },
    },
  });

  // --- 5. Comprehensive Mock Exam (20 questions) ---
  await prisma.quiz.create({
    data: {
      title: "Comprehensive Mock Exam",
      description:
        "A full-length practice exam covering vocabulary, grammar, reading comprehension, and listening. Tests all skill areas at mixed difficulty levels.",
      type: "mock",
      level: null,
      modules: JSON.stringify([
        "vocabulary",
        "grammar",
        "reading",
        "listening",
      ]),
      timeLimit: 1800,
      questionCount: 20,
      passingScore: 60,
      questions: {
        create: [
          // --- Vocabulary (6 questions) ---
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'What does "elaborate" mean when used as a verb?',
            options: JSON.stringify([
              "To simplify something",
              "To develop or present in detail",
              "To remove entirely",
              "To disagree strongly",
            ]),
            answer: "To develop or present in detail",
            explanation:
              'As a verb, "elaborate" means to add more detail or to explain something more fully.',
            points: 1,
            sortOrder: 1,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              '"The new policy had a _____ effect on employee morale." Choose the word that means significantly harmful.',
            options: JSON.stringify([
              "negligible",
              "detrimental",
              "beneficial",
              "trivial",
            ]),
            answer: "detrimental",
            explanation:
              '"Detrimental" means tending to cause harm. "Negligible" means insignificant, "beneficial" means helpful, and "trivial" means unimportant.',
            points: 1,
            sortOrder: 2,
          },
          {
            module: "vocabulary",
            type: "true-false",
            question:
              '"Pragmatic" describes someone who deals with things in a practical rather than theoretical way.',
            options: JSON.stringify(["True", "False"]),
            answer: "True",
            explanation:
              '"Pragmatic" means dealing with things sensibly and realistically, based on practical rather than theoretical considerations.',
            points: 1,
            sortOrder: 3,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'Which pair of words are antonyms?',
            options: JSON.stringify([
              "Scarce — Abundant",
              "Ancient — Archaic",
              "Vivid — Bright",
              "Rapid — Swift",
            ]),
            answer: "Scarce — Abundant",
            explanation:
              '"Scarce" means in short supply, while "abundant" means existing in large quantities — they are opposites. The other pairs are synonyms.',
            points: 1,
            sortOrder: 4,
          },
          {
            module: "vocabulary",
            type: "fill-blank",
            question:
              'Complete the sentence: "Her _____ attention to detail ensured the project was flawless." (a word meaning very careful and precise)',
            options: null,
            answer: "meticulous",
            explanation:
              '"Meticulous" means showing great attention to detail; very careful and precise.',
            points: 1,
            sortOrder: 5,
          },
          {
            module: "vocabulary",
            type: "multiple-choice",
            question:
              'What does "to turn a blind eye" mean?',
            options: JSON.stringify([
              "To have poor eyesight",
              "To pretend not to notice something",
              "To look at something carefully",
              "To change one's perspective",
            ]),
            answer: "To pretend not to notice something",
            explanation:
              '"To turn a blind eye" means to deliberately ignore something that you know is wrong or happening.',
            points: 1,
            sortOrder: 6,
          },
          // --- Grammar (6 questions) ---
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              '"Neither the teacher nor the students _____ aware of the schedule change." Choose the correct verb.',
            options: JSON.stringify(["was", "were", "is", "has been"]),
            answer: "were",
            explanation:
              'With "neither...nor," the verb agrees with the noun closest to it. "Students" is plural, so we use "were."',
            points: 1,
            sortOrder: 7,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              'Identify the error: "Each of the employees need to submit their report by Monday."',
            options: JSON.stringify([
              '"Each" should be "Every"',
              '"need" should be "needs"',
              '"their" should be "his"',
              "There is no error",
            ]),
            answer: '"need" should be "needs"',
            explanation:
              '"Each" is a singular pronoun and requires the singular verb "needs." Note that using "their" as a gender-neutral singular pronoun is acceptable in modern English.',
            points: 1,
            sortOrder: 8,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              '"I wish I _____ more time to prepare for the presentation." Choose the correct form.',
            options: JSON.stringify(["have", "had", "would have", "am having"]),
            answer: "had",
            explanation:
              'After "wish" expressing a desire about the present, we use the past simple ("had") to indicate the hypothetical nature of the wish.',
            points: 1,
            sortOrder: 9,
          },
          {
            module: "grammar",
            type: "fill-blank",
            question:
              'Complete: "Not only _____ she speak French, but she also speaks Japanese." (auxiliary verb)',
            options: null,
            answer: "does",
            explanation:
              '"Not only" at the beginning of a clause triggers subject-auxiliary inversion. The correct auxiliary for third-person singular present is "does."',
            points: 1,
            sortOrder: 10,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              'Which sentence uses a relative clause correctly?',
            options: JSON.stringify([
              "The book who I borrowed was fascinating.",
              "The book which I borrowed was fascinating.",
              "The book whom I borrowed was fascinating.",
              "The book whose I borrowed was fascinating.",
            ]),
            answer: "The book which I borrowed was fascinating.",
            explanation:
              '"Which" (or "that") is the correct relative pronoun for things. "Who" and "whom" are for people, and "whose" indicates possession.',
            points: 1,
            sortOrder: 11,
          },
          {
            module: "grammar",
            type: "multiple-choice",
            question:
              '"By next June, she _____ at this company for ten years." Choose the correct future perfect form.',
            options: JSON.stringify([
              "works",
              "will work",
              "will have worked",
              "is working",
            ]),
            answer: "will have worked",
            explanation:
              'The future perfect tense ("will have worked") describes an action that will be completed before a specific point in the future.',
            points: 1,
            sortOrder: 12,
          },
          // --- Reading (4 questions based on a passage) ---
          {
            module: "reading",
            type: "multiple-choice",
            question:
              '[Passage] "The Great Barrier Reef, located off the coast of Australia, is the world\'s largest coral reef system. Stretching over 2,300 kilometers, it is home to thousands of species of marine life. However, rising ocean temperatures due to climate change have caused widespread coral bleaching, threatening the reef\'s biodiversity. Scientists are working on innovative solutions, including coral farming and gene editing, to help the reef recover."\n\nWhat is the main idea of this passage?',
            options: JSON.stringify([
              "Australia is famous for its beaches",
              "The Great Barrier Reef is threatened but scientists are trying to save it",
              "Coral farming is a profitable business",
              "Climate change only affects ocean temperatures",
            ]),
            answer:
              "The Great Barrier Reef is threatened but scientists are trying to save it",
            explanation:
              "The passage describes the threat to the Great Barrier Reef from climate change and the scientific efforts to restore it.",
            points: 1,
            sortOrder: 13,
          },
          {
            module: "reading",
            type: "multiple-choice",
            question:
              '[Same passage as Q13] What does "coral bleaching" most likely refer to?',
            options: JSON.stringify([
              "Corals becoming more colorful",
              "Corals losing their color and becoming white due to stress",
              "Corals growing faster than usual",
              "Corals being cleaned by marine life",
            ]),
            answer:
              "Corals losing their color and becoming white due to stress",
            explanation:
              'In context, "bleaching" (becoming white/pale) happens when rising temperatures stress the coral, causing it to expel the algae that give it color.',
            points: 1,
            sortOrder: 14,
          },
          {
            module: "reading",
            type: "multiple-choice",
            question:
              '[Passage] "Remote work has become the norm for many companies worldwide. While employees enjoy the flexibility of working from home, some struggle with isolation and blurred boundaries between work and personal life. Companies are experimenting with hybrid models—combining office days with remote days—to balance productivity and employee well-being."\n\nAccording to the passage, what is a challenge of remote work?',
            options: JSON.stringify([
              "Employees earn less money",
              "Employees feel isolated and have difficulty separating work from personal life",
              "Companies cannot monitor employee performance",
              "Remote work reduces productivity in all cases",
            ]),
            answer:
              "Employees feel isolated and have difficulty separating work from personal life",
            explanation:
              'The passage explicitly mentions "isolation and blurred boundaries between work and personal life" as challenges of remote work.',
            points: 1,
            sortOrder: 15,
          },
          {
            module: "reading",
            type: "true-false",
            question:
              '[Same passage as Q15] The passage suggests that hybrid models are meant to completely replace remote work.',
            options: JSON.stringify(["True", "False"]),
            answer: "False",
            explanation:
              'The passage says hybrid models "combine office days with remote days" — they integrate remote work rather than replace it.',
            points: 1,
            sortOrder: 16,
          },
          // --- Listening (4 questions based on transcripts) ---
          {
            module: "listening",
            type: "multiple-choice",
            question:
              '[Transcript] "Good morning, everyone. Welcome to today\'s workshop on effective communication. Over the next two hours, we\'ll cover three key topics: active listening, nonverbal cues, and giving constructive feedback. Please feel free to ask questions at any time."\n\nHow long is the workshop expected to last?',
            options: JSON.stringify([
              "One hour",
              "Two hours",
              "Three hours",
              "Half a day",
            ]),
            answer: "Two hours",
            explanation:
              'The speaker clearly states "over the next two hours."',
            points: 1,
            sortOrder: 17,
          },
          {
            module: "listening",
            type: "multiple-choice",
            question:
              "[Same transcript as Q17] Which of the following is NOT a topic covered in the workshop?",
            options: JSON.stringify([
              "Active listening",
              "Nonverbal cues",
              "Public speaking techniques",
              "Giving constructive feedback",
            ]),
            answer: "Public speaking techniques",
            explanation:
              "The three topics mentioned are active listening, nonverbal cues, and giving constructive feedback. Public speaking techniques is not mentioned.",
            points: 1,
            sortOrder: 18,
          },
          {
            module: "listening",
            type: "multiple-choice",
            question:
              '[Transcript] "Attention shoppers: our store will be closing in fifteen minutes. Please bring your final selections to the checkout area. Don\'t forget about our weekend sale — all winter coats are thirty percent off through Sunday. Thank you for shopping with us today."\n\nWhat is on sale?',
            options: JSON.stringify([
              "Summer dresses",
              "Winter coats",
              "All clothing items",
              "Shoes and accessories",
            ]),
            answer: "Winter coats",
            explanation:
              'The announcement specifically states "all winter coats are thirty percent off."',
            points: 1,
            sortOrder: 19,
          },
          {
            module: "listening",
            type: "fill-blank",
            question:
              '[Same transcript as Q19] Complete the detail: The store will be closing in _____ minutes.',
            options: null,
            answer: "fifteen",
            explanation:
              'The announcement states "our store will be closing in fifteen minutes."',
            points: 1,
            sortOrder: 20,
          },
        ],
      },
    },
  });

  console.log("  ✓ Quizzes done: 5 quizzes, 58 questions\n");
}
