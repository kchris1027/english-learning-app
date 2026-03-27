import { PrismaClient } from "@prisma/client";

export async function seedReading(prisma: PrismaClient) {
  console.log("  📖 Seeding reading articles...");

  // --- Article 1 ---
  await prisma.readingArticle.create({
    data: {
      title: "A Day at the Coffee Shop",
      slug: "a-day-at-the-coffee-shop",
      level: "beginner",
      category: "story",
      wordCount: 210,
      estimatedTime: 3,
      keyVocabulary: JSON.stringify(["cozy", "aroma", "pastry", "regular", "barista"]),
      summary: "A short story about Emma's relaxing Saturday routine at her favorite neighborhood coffee shop.",
      content: `Every Saturday morning, Emma walks to her favorite coffee shop on Maple Street. The small shop is called "The Daily Grind," and it has been in the neighborhood for over ten years. Emma loves the cozy atmosphere and the friendly staff.

When she arrives, the barista already knows her order: a medium latte with oat milk and a blueberry muffin. The aroma of freshly ground coffee beans fills the air, and soft jazz music plays in the background. Emma always chooses the same table by the window, where she can watch people walk by on the sidewalk.

She usually brings a book with her and reads for about an hour. Sometimes she chats with other regular customers. There is an older man named George who comes every Saturday too. He always orders black coffee and reads the newspaper. They often talk about the weather or share book recommendations.

After finishing her latte and muffin, Emma sometimes orders a small pastry to take home. She thanks the barista, waves goodbye to George, and walks back home feeling relaxed and happy. This simple Saturday routine is one of her favorite parts of the week. It helps her slow down and enjoy the little things in life.`,
      questions: {
        create: [
          {
            type: "comprehension",
            question: "What does Emma order at the coffee shop?",
            options: JSON.stringify([
              "A black coffee and a croissant",
              "A medium latte with oat milk and a blueberry muffin",
              "A cappuccino and a chocolate cake",
              "A green tea and a bagel",
            ]),
            answer: "B",
            explanation: "The article states: 'the barista already knows her order: a medium latte with oat milk and a blueberry muffin.'",
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "What does Emma usually do at the coffee shop?",
            options: JSON.stringify([
              "She works on her laptop",
              "She reads a book",
              "She writes in her journal",
              "She draws pictures",
            ]),
            answer: "B",
            explanation: "The article says: 'She usually brings a book with her and reads for about an hour.'",
            sortOrder: 2,
          },
          {
            type: "comprehension",
            question: "Who is George?",
            options: JSON.stringify([
              "Emma's coworker",
              "The coffee shop owner",
              "An older regular customer who comes every Saturday",
              "Emma's neighbor",
            ]),
            answer: "C",
            explanation: "The article describes George as 'an older man' who 'comes every Saturday too' and is one of the regular customers.",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // --- Article 2 ---
  await prisma.readingArticle.create({
    data: {
      title: "The Rise of Remote Work",
      slug: "the-rise-of-remote-work",
      level: "intermediate",
      category: "business",
      wordCount: 285,
      estimatedTime: 4,
      keyVocabulary: JSON.stringify(["pandemic", "flexibility", "productivity", "collaborate", "hybrid"]),
      summary: "An exploration of how the COVID-19 pandemic transformed work culture, examining the benefits and challenges of remote work.",
      content: `The COVID-19 pandemic fundamentally changed the way millions of people work. Before 2020, remote work was relatively uncommon, limited mainly to freelancers and a few progressive tech companies. However, when lockdowns forced offices to close, businesses had no choice but to adapt. Almost overnight, kitchen tables became desks, and video calls replaced conference rooms.

Surveys show that most employees appreciate the flexibility that remote work provides. Workers save time and money by eliminating long commutes, and many report higher productivity when working from home. Parents, in particular, value the ability to be closer to their children during the day. Companies have also benefited from reduced overhead costs such as office rent and utilities.

However, remote work is not without its challenges. Many employees struggle with feelings of isolation and find it difficult to separate work from personal life. Communication can suffer when teams rely entirely on digital tools, and spontaneous collaboration—the kind that happens naturally in an office—is harder to replicate online. Some managers also worry about accountability and whether employees are truly engaged.

As a result, many organizations have adopted a hybrid model, where employees split their time between working from home and coming into the office. This approach attempts to combine the best of both worlds: the flexibility of remote work with the social benefits of in-person interaction. While the future of work continues to evolve, one thing is clear—the traditional nine-to-five office routine will never be quite the same again.`,
      questions: {
        create: [
          {
            type: "comprehension",
            question: "What was the main cause of the shift to remote work?",
            options: JSON.stringify([
              "New technology made it possible",
              "Employees demanded it",
              "The COVID-19 pandemic forced offices to close",
              "Companies wanted to save money",
            ]),
            answer: "C",
            explanation: "The article explains that 'when lockdowns forced offices to close, businesses had no choice but to adapt.'",
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "Which of the following is mentioned as a benefit of remote work?",
            options: JSON.stringify([
              "Better internet connections",
              "Saving time and money by eliminating commutes",
              "More vacation days",
              "Free office equipment",
            ]),
            answer: "B",
            explanation: "The article states that 'Workers save time and money by eliminating long commutes.'",
            sortOrder: 2,
          },
          {
            type: "vocabulary",
            question: "What does the word 'hybrid' mean in the context of this article?",
            options: JSON.stringify([
              "Completely remote",
              "A combination of two different approaches",
              "Traditional office work",
              "Working only on weekends",
            ]),
            answer: "B",
            explanation: "'Hybrid model' refers to splitting time between working from home and the office—a combination of two approaches.",
            sortOrder: 3,
          },
          {
            type: "inference",
            question: "What can be inferred about the author's view of the future of work?",
            options: JSON.stringify([
              "Everyone will return to offices",
              "Remote work will completely replace offices",
              "Work culture has permanently changed and will continue evolving",
              "Companies will stop using video calls",
            ]),
            answer: "C",
            explanation: "The author concludes that 'the traditional nine-to-five office routine will never be quite the same again' and 'the future of work continues to evolve,' suggesting permanent change.",
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // --- Article 3 ---
  await prisma.readingArticle.create({
    data: {
      title: "The Mysteries of the Deep Ocean",
      slug: "the-mysteries-of-the-deep-ocean",
      level: "advanced",
      category: "science",
      wordCount: 350,
      estimatedTime: 5,
      keyVocabulary: JSON.stringify(["bioluminescence", "hydrothermal", "extremophile", "abyss", "ecosystem"]),
      summary: "A deep dive into the unexplored world of the deep ocean, covering bioluminescence, hydrothermal vents, and the extremophiles that thrive in Earth's most hostile environments.",
      content: `The deep ocean remains one of the least explored frontiers on Earth. While humans have mapped the surface of Mars in considerable detail, more than eighty percent of the ocean floor has never been surveyed. Below the sunlit zone, which extends to roughly two hundred meters, lies a vast, dark world that is home to some of the most extraordinary creatures on the planet.

One of the most fascinating phenomena of the deep sea is bioluminescence—the ability of living organisms to produce their own light through chemical reactions. An estimated seventy-five percent of deep-sea creatures possess this ability. Anglerfish use a glowing lure to attract prey, while certain species of jellyfish emit brilliant flashes to startle predators. Scientists believe bioluminescence serves multiple purposes, including communication, camouflage, and hunting.

Perhaps the most remarkable discovery in deep-sea exploration has been hydrothermal vents. Found along mid-ocean ridges, these underwater geysers release superheated water rich in minerals, reaching temperatures of over 400 degrees Celsius. Despite these extreme conditions, the vents support thriving ecosystems. Tube worms, giant clams, and unique species of shrimp cluster around the vents, deriving energy not from sunlight but from chemosynthesis—a process in which bacteria convert chemical compounds into usable energy.

The organisms that inhabit these environments are known as extremophiles, and they have fundamentally challenged our understanding of where life can exist. Their existence raises intriguing questions about the possibility of life on other planets and moons, such as Jupiter's Europa, where subsurface oceans may harbor similar conditions.

As technology advances and submersibles become more sophisticated, scientists continue to make groundbreaking discoveries in the deep ocean. Each expedition reveals species previously unknown to science, reminding us that our own planet still holds countless secrets waiting to be uncovered.`,
      questions: {
        create: [
          {
            type: "comprehension",
            question: "What percentage of the ocean floor has never been surveyed?",
            options: JSON.stringify([
              "About 50 percent",
              "About 60 percent",
              "More than 80 percent",
              "Nearly 95 percent",
            ]),
            answer: "C",
            explanation: "The article states that 'more than eighty percent of the ocean floor has never been surveyed.'",
            sortOrder: 1,
          },
          {
            type: "vocabulary",
            question: "What is 'bioluminescence'?",
            options: JSON.stringify([
              "The ability to see in the dark",
              "The ability of organisms to produce their own light",
              "A type of deep-sea plant",
              "A chemical found in ocean water",
            ]),
            answer: "B",
            explanation: "The article defines bioluminescence as 'the ability of living organisms to produce their own light through chemical reactions.'",
            sortOrder: 2,
          },
          {
            type: "inference",
            question: "Why do scientists study extremophiles in the context of space exploration?",
            options: JSON.stringify([
              "They want to send these organisms to other planets",
              "Extremophiles prove that Mars once had oceans",
              "Their existence suggests life could exist in similar extreme conditions on other worlds",
              "They need extremophiles to fuel spacecraft",
            ]),
            answer: "C",
            explanation: "The article states that extremophiles 'raise intriguing questions about the possibility of life on other planets and moons' with similar extreme conditions.",
            sortOrder: 3,
          },
          {
            type: "vocabulary",
            question: "What does 'chemosynthesis' refer to in this article?",
            options: JSON.stringify([
              "Converting sunlight into energy",
              "A chemical reaction that produces light",
              "A process in which bacteria convert chemical compounds into usable energy",
              "The heating of ocean water by volcanoes",
            ]),
            answer: "C",
            explanation: "The article explicitly defines chemosynthesis as 'a process in which bacteria convert chemical compounds into usable energy.'",
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // --- Article 4 ---
  await prisma.readingArticle.create({
    data: {
      title: "How to Build Good Habits",
      slug: "how-to-build-good-habits",
      level: "intermediate",
      category: "self-help",
      wordCount: 300,
      estimatedTime: 4,
      keyVocabulary: JSON.stringify(["cue", "routine", "reward", "consistency", "willpower"]),
      summary: "Practical advice on habit formation, debunking the 21-day myth and explaining the science behind building lasting habits.",
      content: `We all have habits we want to develop—exercising regularly, reading more, or eating healthier. But why do some habits stick while others fade after just a few days? Understanding the science of habit formation can help us build routines that last.

At the core of every habit is a simple loop consisting of three parts: a cue, a routine, and a reward. The cue is a trigger that tells your brain to start the behavior—perhaps it is a specific time of day or a particular location. The routine is the behavior itself, and the reward is the positive outcome that reinforces the habit. For example, if you want to develop a reading habit, your cue might be finishing dinner, the routine is reading for twenty minutes, and the reward is the satisfaction of learning something new.

Many people believe it takes exactly twenty-one days to form a new habit, but research from University College London suggests the average is closer to sixty-six days, and it can vary widely depending on the person and the complexity of the habit. The key factor is not a specific number of days but consistency. Missing one day is not a disaster, but missing two in a row can break the momentum.

One of the most effective strategies is to start small. Instead of committing to an hour at the gym, begin with just ten minutes. Instead of reading fifty pages a day, start with five. Small wins build confidence and make the habit feel manageable. Over time, you can gradually increase the difficulty.

It is also helpful to pair a new habit with an existing one—a technique called habit stacking. For instance, if you already make coffee every morning, you can stack a five-minute meditation session right after brewing your coffee. This connects the new behavior to an established routine, making it easier to remember and maintain.`,
      questions: {
        create: [
          {
            type: "comprehension",
            question: "What are the three parts of the habit loop?",
            options: JSON.stringify([
              "Goal, action, result",
              "Cue, routine, reward",
              "Motivation, behavior, outcome",
              "Plan, execute, review",
            ]),
            answer: "B",
            explanation: "The article explains: 'At the core of every habit is a simple loop consisting of three parts: a cue, a routine, and a reward.'",
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "According to the article, how long does it actually take to form a habit?",
            options: JSON.stringify([
              "Exactly 21 days",
              "About 30 days",
              "An average of 66 days, varying by person",
              "At least 100 days",
            ]),
            answer: "C",
            explanation: "The article cites research from University College London showing 'the average is closer to sixty-six days, and it can vary widely.'",
            sortOrder: 2,
          },
          {
            type: "comprehension",
            question: "What is 'habit stacking'?",
            options: JSON.stringify([
              "Trying to build many habits at the same time",
              "Pairing a new habit with an existing routine",
              "Gradually increasing the difficulty of a habit",
              "Writing down your habits in a stack of notes",
            ]),
            answer: "B",
            explanation: "The article defines habit stacking as pairing 'a new habit with an existing one' to make it easier to remember and maintain.",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // --- Article 5 ---
  await prisma.readingArticle.create({
    data: {
      title: "The Science of Sleep",
      slug: "the-science-of-sleep",
      level: "intermediate",
      category: "science",
      wordCount: 355,
      estimatedTime: 5,
      keyVocabulary: JSON.stringify(["circadian rhythm", "melatonin", "cognitive", "insomnia", "REM"]),
      summary: "An informative look at sleep stages, why sleep matters for health and cognition, and practical tips for better sleep.",
      content: `Sleep is one of the most essential functions of the human body, yet it is often the first thing people sacrifice when life gets busy. Scientists have spent decades studying sleep and have discovered that it is far more complex and important than most people realize.

Sleep occurs in cycles, each lasting roughly ninety minutes. Within each cycle, the brain moves through several stages. The first stages are light sleep, where the body begins to relax and heart rate slows. This is followed by deep sleep, also known as slow-wave sleep, during which the body repairs tissues, strengthens the immune system, and consolidates memories. The final stage is REM sleep, short for Rapid Eye Movement, which is when most dreaming occurs. During REM sleep, the brain is highly active, processing emotions and forming creative connections.

Our sleep patterns are governed by the circadian rhythm, an internal clock that responds to light and darkness. As evening approaches, the brain releases melatonin, a hormone that signals the body to prepare for sleep. Exposure to bright screens before bed can suppress melatonin production, making it harder to fall asleep. This is one reason why experts recommend avoiding phones and computers at least thirty minutes before bedtime.

Sleep deprivation has serious consequences. Even one night of poor sleep can impair cognitive function, reduce reaction time, and affect mood. Chronic lack of sleep has been linked to obesity, heart disease, diabetes, and weakened immunity. Despite these risks, studies show that roughly one in three adults does not get the recommended seven to nine hours of sleep per night.

Improving sleep quality does not require drastic changes. Simple habits can make a significant difference: maintaining a consistent sleep schedule, keeping the bedroom cool and dark, limiting caffeine after noon, and establishing a relaxing bedtime routine. For those suffering from persistent insomnia, cognitive behavioral therapy has proven more effective than medication for long-term improvement.`,
      questions: {
        create: [
          {
            type: "comprehension",
            question: "What happens during deep sleep (slow-wave sleep)?",
            options: JSON.stringify([
              "Most dreaming occurs",
              "The body repairs tissues and consolidates memories",
              "The brain releases melatonin",
              "Heart rate increases significantly",
            ]),
            answer: "B",
            explanation: "The article states that during deep sleep, 'the body repairs tissues, strengthens the immune system, and consolidates memories.'",
            sortOrder: 1,
          },
          {
            type: "vocabulary",
            question: "What is the 'circadian rhythm'?",
            options: JSON.stringify([
              "A type of sleep disorder",
              "The pattern of dreaming during REM sleep",
              "An internal clock that responds to light and darkness",
              "A breathing technique for relaxation",
            ]),
            answer: "C",
            explanation: "The article defines the circadian rhythm as 'an internal clock that responds to light and darkness.'",
            sortOrder: 2,
          },
          {
            type: "comprehension",
            question: "Why do experts recommend avoiding screens before bedtime?",
            options: JSON.stringify([
              "Screens emit harmful radiation",
              "Bright screens can suppress melatonin production",
              "Screens cause nightmares",
              "Electronic devices overheat the bedroom",
            ]),
            answer: "B",
            explanation: "The article explains that 'exposure to bright screens before bed can suppress melatonin production, making it harder to fall asleep.'",
            sortOrder: 3,
          },
          {
            type: "inference",
            question: "Based on the article, what would be the most effective long-term solution for someone with chronic insomnia?",
            options: JSON.stringify([
              "Taking sleeping pills every night",
              "Drinking warm milk before bed",
              "Cognitive behavioral therapy",
              "Exercising right before bedtime",
            ]),
            answer: "C",
            explanation: "The article states that 'cognitive behavioral therapy has proven more effective than medication for long-term improvement' for persistent insomnia.",
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // --- Article 6 ---
  await prisma.readingArticle.create({
    data: {
      title: "Street Food Around the World",
      slug: "street-food-around-the-world",
      level: "beginner",
      category: "culture",
      wordCount: 245,
      estimatedTime: 3,
      keyVocabulary: JSON.stringify(["vendor", "cuisine", "savory", "portable", "authentic"]),
      summary: "A delicious tour of famous street foods from different countries and cultures around the globe.",
      content: `Street food is one of the best ways to experience a country's culture. In cities around the world, vendors sell delicious meals from small stalls and carts, often at very affordable prices. Each country has its own unique street food traditions.

In Mexico, tacos are the most popular street food. Soft corn tortillas are filled with seasoned meat, onions, cilantro, and salsa. You can find taco stands on almost every corner in Mexican cities, and each region has its own special variety.

Thailand is famous for pad thai, a stir-fried noodle dish made with shrimp or chicken, eggs, peanuts, and a sweet-sour sauce. Street vendors in Bangkok cook pad thai in large woks right in front of customers, and the aroma fills the entire street.

In Turkey, kebabs are a beloved street food. Doner kebab features thinly sliced meat cooked on a vertical rotisserie, served in warm bread with fresh vegetables and yogurt sauce. Visitors to Istanbul often say it is the best thing they have ever eaten.

France may be known for fine dining, but its street food is equally wonderful. Crepes—thin, delicate pancakes—are sold at small stands throughout Paris. They can be sweet, filled with chocolate and strawberries, or savory, with cheese and ham.

Japan offers takoyaki, which are crispy ball-shaped snacks filled with octopus. They are cooked in special molds and topped with sauce and bonito flakes. Visitors to Osaka must try them.

Street food brings people together. It is affordable, authentic, and full of flavor. Trying local street food is one of the best parts of traveling.`,
      questions: {
        create: [
          {
            type: "comprehension",
            question: "What is pad thai?",
            options: JSON.stringify([
              "A type of Mexican taco",
              "A stir-fried noodle dish from Thailand",
              "A French pancake",
              "A Japanese snack with octopus",
            ]),
            answer: "B",
            explanation: "The article describes pad thai as 'a stir-fried noodle dish made with shrimp or chicken, eggs, peanuts, and a sweet-sour sauce' from Thailand.",
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "What is special about doner kebab?",
            options: JSON.stringify([
              "It is always vegetarian",
              "It features meat cooked on a vertical rotisserie",
              "It is only found in France",
              "It is a dessert",
            ]),
            answer: "B",
            explanation: "The article states that doner kebab 'features thinly sliced meat cooked on a vertical rotisserie.'",
            sortOrder: 2,
          },
          {
            type: "comprehension",
            question: "According to the article, why is street food a great way to experience a culture?",
            options: JSON.stringify([
              "It is expensive and exclusive",
              "It is only available in restaurants",
              "It is affordable, authentic, and full of flavor",
              "It is the same in every country",
            ]),
            answer: "C",
            explanation: "The article concludes that street food 'is affordable, authentic, and full of flavor' and calls it 'one of the best ways to experience a country's culture.'",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // --- Article 7 ---
  await prisma.readingArticle.create({
    data: {
      title: "How Social Media Changes Our Brains",
      slug: "how-social-media-changes-our-brains",
      level: "intermediate",
      category: "technology",
      wordCount: 350,
      estimatedTime: 5,
      keyVocabulary: JSON.stringify(["dopamine", "attention span", "algorithm", "digital wellbeing", "neuroplasticity"]),
      summary: "An examination of how social media platforms affect our brain chemistry, attention, self-perception, and strategies for healthier digital habits.",
      content: `Social media has become an integral part of modern life. The average person spends nearly two and a half hours per day scrolling through platforms like Instagram, TikTok, and X. While these platforms help us stay connected and informed, growing research suggests they are also changing the way our brains work.

Every time you receive a like, comment, or new follower, your brain releases a small burst of dopamine—the same chemical associated with eating delicious food or winning a game. This creates a feedback loop: the more rewards you receive, the more you want to check your phone. Social media companies understand this well. Their algorithms are specifically designed to keep you engaged for as long as possible by showing content that triggers emotional reactions.

One of the most discussed effects is the shrinking of attention spans. Researchers at the Technical University of Denmark found that the collective global attention span has been narrowing over the past two decades. Short-form video content, which delivers entertainment in fifteen to sixty seconds, trains the brain to expect constant stimulation. As a result, many people find it increasingly difficult to focus on longer tasks like reading a book or sitting through a meeting.

Social comparison is another significant concern. When we scroll through carefully curated photos and highlight reels, we unconsciously compare our everyday lives to other people's best moments. Studies have linked heavy social media use to increased rates of anxiety, depression, and low self-esteem, particularly among teenagers.

However, social media is not inherently harmful. The key lies in how we use it. Experts recommend several strategies for better digital wellbeing: setting daily time limits, turning off non-essential notifications, curating your feed to include inspiring and educational content, and scheduling regular digital detox periods. Being mindful about social media use can help us enjoy its benefits while protecting our mental health.`,
      questions: {
        create: [
          {
            type: "vocabulary",
            question: "What role does 'dopamine' play in social media use?",
            options: JSON.stringify([
              "It makes people feel sleepy",
              "It creates a rewarding feeling that encourages checking the phone more",
              "It helps people remember passwords",
              "It blocks harmful content from appearing",
            ]),
            answer: "B",
            explanation: "The article explains that dopamine creates a 'feedback loop: the more rewards you receive, the more you want to check your phone.'",
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "What did researchers at the Technical University of Denmark find?",
            options: JSON.stringify([
              "Social media makes people smarter",
              "The global collective attention span has been narrowing",
              "People spend less time on social media than before",
              "Short videos improve concentration",
            ]),
            answer: "B",
            explanation: "The article states that researchers found 'the collective global attention span has been narrowing over the past two decades.'",
            sortOrder: 2,
          },
          {
            type: "inference",
            question: "Why might teenagers be more affected by social comparison on social media?",
            options: JSON.stringify([
              "They have faster internet connections",
              "They spend less time on social media",
              "They are still forming their identity and self-esteem",
              "They only use one platform",
            ]),
            answer: "C",
            explanation: "While the article notes teens are particularly affected, it implies this is because they are at a developmental stage where identity and self-esteem are still forming, making them more vulnerable to comparison.",
            sortOrder: 3,
          },
          {
            type: "comprehension",
            question: "Which of the following is NOT a recommended strategy for digital wellbeing?",
            options: JSON.stringify([
              "Setting daily time limits",
              "Turning off non-essential notifications",
              "Deleting all social media accounts permanently",
              "Scheduling regular digital detox periods",
            ]),
            answer: "C",
            explanation: "The article recommends moderation strategies like time limits, notification management, and digital detox periods—not complete deletion of accounts.",
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // --- Article 8 ---
  await prisma.readingArticle.create({
    data: {
      title: "The Benefits of Learning a Second Language",
      slug: "the-benefits-of-learning-a-second-language",
      level: "beginner",
      category: "education",
      wordCount: 250,
      estimatedTime: 3,
      keyVocabulary: JSON.stringify(["bilingual", "cognitive", "fluent", "immersion", "motivation"]),
      summary: "A beginner-friendly article about why learning a second language is beneficial for the brain, career, and cultural understanding.",
      content: `Learning a second language is one of the most valuable skills you can develop. Whether you are studying English, Spanish, Mandarin, or any other language, the benefits go far beyond just being able to talk to more people.

Research shows that bilingual people have stronger brains. Learning a new language exercises the brain like a muscle. It improves memory, helps with problem-solving, and can even delay the onset of diseases like Alzheimer's. Studies have found that people who speak two or more languages perform better on tasks that require focus and multitasking.

A second language also opens doors in your career. In today's global economy, companies value employees who can communicate with international clients and partners. Speaking another language can lead to better job opportunities, higher salaries, and the chance to work or study abroad.

Perhaps the most rewarding benefit is cultural understanding. Language is deeply connected to culture. When you learn a new language, you also learn about the customs, traditions, and perspectives of another group of people. This builds empathy and helps you see the world from different viewpoints.

So how can you get started? The most important thing is consistency. Even fifteen minutes of practice each day can make a big difference over time. Use apps, watch movies in your target language, listen to podcasts, and try to find a conversation partner. Do not worry about making mistakes—they are a natural and important part of the learning process.

The journey of learning a language is challenging but incredibly rewarding. Every new word you learn is a step toward a bigger, more connected world.`,
      questions: {
        create: [
          {
            type: "comprehension",
            question: "How does learning a second language affect the brain?",
            options: JSON.stringify([
              "It makes the brain tired",
              "It improves memory and problem-solving skills",
              "It only helps with language tasks",
              "It has no effect on the brain",
            ]),
            answer: "B",
            explanation: "The article states that learning a language 'improves memory, helps with problem-solving, and can even delay the onset of diseases like Alzheimer's.'",
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "Why is a second language valuable for your career?",
            options: JSON.stringify([
              "Companies only hire bilingual people",
              "It helps you communicate with international clients and can lead to better opportunities",
              "You can only work abroad if you speak two languages",
              "It replaces the need for other skills",
            ]),
            answer: "B",
            explanation: "The article says that speaking another language 'can lead to better job opportunities, higher salaries, and the chance to work or study abroad.'",
            sortOrder: 2,
          },
          {
            type: "comprehension",
            question: "According to the article, what is the most important thing when learning a new language?",
            options: JSON.stringify([
              "Moving to another country",
              "Studying for many hours at once",
              "Being consistent with daily practice",
              "Avoiding all mistakes",
            ]),
            answer: "C",
            explanation: "The article emphasizes that 'the most important thing is consistency. Even fifteen minutes of practice each day can make a big difference.'",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // --- Article 9 ---
  await prisma.readingArticle.create({
    data: {
      title: "Climate Change: What Can We Do?",
      slug: "climate-change-what-can-we-do",
      level: "advanced",
      category: "environment",
      wordCount: 400,
      estimatedTime: 6,
      keyVocabulary: JSON.stringify(["greenhouse effect", "carbon footprint", "renewable energy", "sustainability", "biodiversity"]),
      summary: "A comprehensive look at the science of climate change, its current impacts, and actionable steps individuals and governments can take to address it.",
      content: `Climate change is widely regarded as the most pressing environmental challenge of our time. The scientific consensus is overwhelming: human activities, particularly the burning of fossil fuels, are releasing unprecedented amounts of carbon dioxide and other greenhouse gases into the atmosphere, trapping heat and raising global temperatures.

The greenhouse effect itself is a natural process—without it, Earth would be too cold to support life. However, human industrial activity has intensified this effect dramatically. Since the pre-industrial era, global average temperatures have risen by approximately 1.1 degrees Celsius. While this number may sound small, its consequences are enormous. Glaciers are retreating, sea levels are rising, and extreme weather events such as hurricanes, droughts, and wildfires are becoming more frequent and severe. Biodiversity is also suffering, with many species unable to adapt quickly enough to changing habitats.

At the individual level, there are many meaningful actions people can take to reduce their carbon footprint. Switching to public transportation, cycling, or electric vehicles reduces emissions from daily travel. Adopting a plant-based diet, even partially, can significantly lower the environmental impact of food production, as livestock farming is one of the largest sources of methane emissions. Reducing energy consumption at home—through better insulation, LED lighting, and smart thermostats—also contributes to meaningful change. Being a conscious consumer by choosing sustainable products and reducing waste further amplifies the impact.

However, individual actions alone are not sufficient to address a problem of this magnitude. Systemic change requires bold policy decisions. Governments must invest heavily in renewable energy infrastructure, including solar, wind, and hydroelectric power. Carbon pricing mechanisms, such as carbon taxes or cap-and-trade systems, can create economic incentives for businesses to reduce emissions. International cooperation is essential, as climate change is a global problem that transcends national borders.

Education and awareness play a critical role as well. When citizens understand the science behind climate change and the urgency of the situation, they are more likely to support ambitious policies and make sustainable choices in their own lives. The transition to a low-carbon economy will require effort, innovation, and sacrifice, but the alternative—a destabilized climate with catastrophic consequences—is far more costly. The time to act is not tomorrow; it is now.`,
      questions: {
        create: [
          {
            type: "comprehension",
            question: "By how much have global average temperatures risen since the pre-industrial era?",
            options: JSON.stringify([
              "About 0.5 degrees Celsius",
              "Approximately 1.1 degrees Celsius",
              "Nearly 2.0 degrees Celsius",
              "More than 3.0 degrees Celsius",
            ]),
            answer: "B",
            explanation: "The article states that 'global average temperatures have risen by approximately 1.1 degrees Celsius' since the pre-industrial era.",
            sortOrder: 1,
          },
          {
            type: "vocabulary",
            question: "What does 'carbon footprint' mean in this context?",
            options: JSON.stringify([
              "The mark left by carbon on the ground",
              "A fossil found in carbon-rich soil",
              "The total amount of greenhouse gases produced by a person's activities",
              "A new unit of measurement for temperature",
            ]),
            answer: "C",
            explanation: "Carbon footprint refers to the total greenhouse gas emissions caused by an individual's activities, which the article discusses ways to 'reduce.'",
            sortOrder: 2,
          },
          {
            type: "inference",
            question: "Why does the article argue that individual actions alone are insufficient?",
            options: JSON.stringify([
              "Because individuals do not care about the environment",
              "Because the scale of the problem requires systemic policy changes and international cooperation",
              "Because renewable energy is too expensive for individuals",
              "Because only governments produce greenhouse gases",
            ]),
            answer: "B",
            explanation: "The article states that 'individual actions alone are not sufficient to address a problem of this magnitude' and calls for 'bold policy decisions' and 'international cooperation.'",
            sortOrder: 3,
          },
          {
            type: "comprehension",
            question: "Which of the following is mentioned as a carbon pricing mechanism?",
            options: JSON.stringify([
              "Green subsidies",
              "Carbon taxes or cap-and-trade systems",
              "Free public transportation",
              "Banning all fossil fuels immediately",
            ]),
            answer: "B",
            explanation: "The article specifically mentions 'carbon taxes or cap-and-trade systems' as carbon pricing mechanisms.",
            sortOrder: 4,
          },
          {
            type: "inference",
            question: "What is the author's tone in the final paragraph?",
            options: JSON.stringify([
              "Hopeless and pessimistic",
              "Indifferent and neutral",
              "Urgent and action-oriented",
              "Humorous and sarcastic",
            ]),
            answer: "C",
            explanation: "The final paragraph conveys urgency with phrases like 'the alternative... is far more costly' and 'the time to act is not tomorrow; it is now.'",
            sortOrder: 5,
          },
        ],
      },
    },
  });

  // --- Article 10 ---
  await prisma.readingArticle.create({
    data: {
      title: "A Brief History of the Internet",
      slug: "a-brief-history-of-the-internet",
      level: "intermediate",
      category: "technology",
      wordCount: 350,
      estimatedTime: 5,
      keyVocabulary: JSON.stringify(["ARPANET", "protocol", "browser", "bandwidth", "encryption"]),
      summary: "A concise history of the internet from its Cold War origins to the modern era of social media and mobile connectivity.",
      content: `The internet is so deeply woven into everyday life that it is hard to imagine a world without it. Yet this technology that connects billions of people is only about half a century old. Its story begins not with social media or shopping websites, but with a military research project during the Cold War.

In the late 1960s, the United States Department of Defense created ARPANET, a network designed to allow computers at different universities and research centers to share information. The first message was sent on October 29, 1969, from UCLA to Stanford Research Institute. The system crashed after transmitting just two letters—"L" and "O" of the word "LOGIN"—but the concept had been proven. Over the next two decades, ARPANET grew slowly, connecting more institutions and developing the communication protocols, such as TCP/IP, that still form the backbone of the internet today.

The real revolution came in 1991 when Tim Berners-Lee, a British scientist working at CERN in Switzerland, introduced the World Wide Web. The web made it possible for anyone to create and access pages of information using a simple browser. Early browsers like Mosaic and Netscape Navigator made the internet accessible to ordinary people, and by the mid-1990s, millions were going online for the first time.

The early 2000s brought Web 2.0—a shift from static web pages to interactive platforms. Social media sites like MySpace, Facebook, and YouTube allowed users to create and share content rather than just consume it. E-commerce exploded, with companies like Amazon and eBay transforming how people shop.

The next major shift was mobile. When Apple launched the iPhone in 2007, it sparked a revolution in how people access the internet. Today, more than half of all web traffic comes from smartphones. With the rise of cloud computing, streaming services, artificial intelligence, and the Internet of Things, the internet continues to evolve at a breathtaking pace. What began as a small network connecting a handful of computers has become the most transformative technology in human history.`,
      questions: {
        create: [
          {
            type: "comprehension",
            question: "What was ARPANET?",
            options: JSON.stringify([
              "A social media platform",
              "A military network for sharing information between computers",
              "The first web browser",
              "A programming language",
            ]),
            answer: "B",
            explanation: "The article describes ARPANET as 'a network designed to allow computers at different universities and research centers to share information,' created by the Department of Defense.",
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "Who introduced the World Wide Web?",
            options: JSON.stringify([
              "Steve Jobs",
              "Bill Gates",
              "Tim Berners-Lee",
              "Mark Zuckerberg",
            ]),
            answer: "C",
            explanation: "The article states that 'Tim Berners-Lee, a British scientist working at CERN in Switzerland, introduced the World Wide Web' in 1991.",
            sortOrder: 2,
          },
          {
            type: "vocabulary",
            question: "What does 'Web 2.0' refer to in this article?",
            options: JSON.stringify([
              "A faster version of the internet",
              "The shift from static web pages to interactive platforms where users create content",
              "A new programming language for websites",
              "The second version of the World Wide Web browser",
            ]),
            answer: "B",
            explanation: "The article defines Web 2.0 as 'a shift from static web pages to interactive platforms' where users could 'create and share content rather than just consume it.'",
            sortOrder: 3,
          },
          {
            type: "inference",
            question: "What can be inferred about the future of the internet based on the article?",
            options: JSON.stringify([
              "The internet will stop growing",
              "People will return to using desktop computers only",
              "The internet will continue to evolve rapidly with new technologies",
              "Social media will disappear completely",
            ]),
            answer: "C",
            explanation: "The article's closing mentions AI, cloud computing, and IoT, and states the internet 'continues to evolve at a breathtaking pace,' suggesting ongoing rapid change.",
            sortOrder: 4,
          },
        ],
      },
    },
  });

  console.log("  ✓ Reading done: 10 articles, ~40 questions\n");
}
