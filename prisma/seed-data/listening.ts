import { PrismaClient } from "@prisma/client";

export async function seedListening(prisma: PrismaClient) {
  console.log("  🎧 Seeding listening content...");

  // --- Content 1 ---
  await prisma.listeningContent.create({
    data: {
      title: "Ordering at a Restaurant",
      slug: "ordering-at-a-restaurant",
      audioUrl: "/audio/listening-1.mp3",
      level: "beginner",
      category: "conversation",
      durationSec: 60,
      speakerCount: 2,
      transcript: `Waiter: Good evening! Welcome to The Garden Bistro. Here is your menu. Can I get you something to drink while you decide?

Customer: Thank you. I'll have a glass of water and an iced tea, please.

Waiter: Sure thing. Are you ready to order, or do you need a few more minutes?

Customer: I think I'm ready. I'd like the grilled chicken salad as a starter, and for the main course, I'll have the salmon with roasted vegetables.

Waiter: Excellent choice. How would you like your salmon? We can do it grilled or pan-seared.

Customer: Pan-seared, please.

Waiter: And would you like any dessert today? Our chocolate lava cake is very popular.

Customer: That sounds great. I'll have that after the main course.

Waiter: Perfect. So that's one grilled chicken salad, one pan-seared salmon with roasted vegetables, and one chocolate lava cake. I'll bring your drinks right away.

Customer: Thank you very much.`,
      exercises: {
        create: [
          {
            type: "comprehension",
            question: "What does the customer order as a starter?",
            answer: "Grilled chicken salad",
            options: JSON.stringify([
              "Tomato soup",
              "Grilled chicken salad",
              "Caesar salad",
              "Garlic bread",
            ]),
            hint: "Listen to what the customer says after 'I'd like the...'",
            startTimeSec: 12,
            endTimeSec: 25,
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "How does the customer want the salmon cooked?",
            answer: "Pan-seared",
            options: JSON.stringify([
              "Grilled",
              "Baked",
              "Pan-seared",
              "Fried",
            ]),
            hint: "The waiter offers two options for the salmon.",
            startTimeSec: 25,
            endTimeSec: 40,
            sortOrder: 2,
          },
          {
            type: "true-false",
            question: "The customer orders a glass of wine to drink.",
            answer: "false",
            options: null,
            hint: "Listen carefully to the drink order at the beginning.",
            startTimeSec: 0,
            endTimeSec: 12,
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // --- Content 2 ---
  await prisma.listeningContent.create({
    data: {
      title: "Museum Audio Guide",
      slug: "museum-audio-guide",
      audioUrl: "/audio/listening-2.mp3",
      level: "intermediate",
      category: "tour",
      durationSec: 90,
      speakerCount: 1,
      transcript: `Welcome to Gallery Seven of the National Art Museum. You are now standing in front of one of our most treasured works: "Starry Night Over the Harbor," painted by Dutch artist Pieter van Hoek in 1887.

This painting is remarkable for several reasons. First, notice the use of light. Van Hoek was fascinated by how moonlight reflects on water, and he spent over six months working on this single canvas to capture the effect. The swirling patterns in the sky were influenced by Japanese woodblock prints, which were very popular in Europe at the time.

The painting measures two meters by one and a half meters and was originally commissioned by a wealthy merchant in Amsterdam. However, the merchant rejected the work because he found the style too unconventional. Van Hoek was devastated and nearly destroyed the painting. Fortunately, a fellow artist convinced him to keep it.

The painting changed hands several times before it was acquired by this museum in 1952. It has since become one of our most visited works, attracting over half a million visitors each year.

As you look at the painting, pay attention to the small boat in the lower right corner. Art historians believe this represents the artist himself, navigating the turbulent waters of his career. Please proceed to the next gallery when you are ready.`,
      exercises: {
        create: [
          {
            type: "comprehension",
            question: "In what year was the painting created?",
            answer: "1887",
            options: JSON.stringify(["1867", "1877", "1887", "1897"]),
            hint: "The year is mentioned early in the description.",
            startTimeSec: 0,
            endTimeSec: 20,
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "Why did the merchant who commissioned the painting reject it?",
            answer: "He found the style too unconventional",
            options: JSON.stringify([
              "It was too small",
              "He found the style too unconventional",
              "It was not finished on time",
              "The colors were too dark",
            ]),
            hint: "Listen to the section about the painting's history.",
            startTimeSec: 40,
            endTimeSec: 65,
            sortOrder: 2,
          },
          {
            type: "fill-blank",
            question: "Art historians believe the small boat represents the _____ himself.",
            answer: "artist",
            options: null,
            hint: "Who might identify with a small boat navigating turbulent waters?",
            startTimeSec: 70,
            endTimeSec: 90,
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // --- Content 3 ---
  await prisma.listeningContent.create({
    data: {
      title: "Climate Change Podcast",
      slug: "climate-change-podcast",
      audioUrl: "/audio/listening-3.mp3",
      level: "advanced",
      category: "podcast",
      durationSec: 120,
      speakerCount: 1,
      transcript: `Welcome back to "Green Futures," the podcast where we explore the science and solutions behind our planet's biggest environmental challenges. I'm your host, Dr. Sarah Chen, and today we're diving into a topic that affects every person on Earth: the accelerating pace of climate change.

Last month, the World Meteorological Organization released a report showing that the past decade was the warmest on record. Global average temperatures have risen by over one degree Celsius since pre-industrial times, and the rate of warming is increasing. What does this mean in practical terms? Well, for starters, we're seeing more intense hurricanes, longer droughts, and rising sea levels that threaten coastal communities around the world.

But here's what many people don't realize: the effects of climate change are not distributed equally. Developing nations, which have contributed the least to global emissions, are often the most vulnerable. Small island nations in the Pacific are literally losing land to rising seas, while regions in sub-Saharan Africa face severe food insecurity due to unpredictable rainfall.

So what can be done? The Paris Agreement set a target of limiting warming to one point five degrees Celsius, but most experts agree we are not on track to meet that goal. Transitioning to renewable energy is essential—solar and wind power are now cheaper than fossil fuels in many markets. But technology alone won't save us. We need systemic changes in agriculture, transportation, and urban planning.

On a personal level, every action counts. Reducing meat consumption, using public transit, and supporting climate-conscious businesses all make a difference. But perhaps the most powerful thing any individual can do is vote for leaders who take climate science seriously and push for meaningful policy change.

That's all for today. Next week, we'll be talking to a marine biologist about the future of coral reefs. Until then, stay curious and stay green.`,
      exercises: {
        create: [
          {
            type: "comprehension",
            question: "According to the podcast, what did the World Meteorological Organization report?",
            answer: "The past decade was the warmest on record",
            options: JSON.stringify([
              "Carbon emissions decreased last year",
              "The past decade was the warmest on record",
              "Global sea levels have stabilized",
              "Hurricane frequency has decreased",
            ]),
            hint: "Listen to the beginning of the podcast for recent data.",
            startTimeSec: 15,
            endTimeSec: 40,
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "Which regions does the speaker say are most vulnerable to climate change?",
            answer: "Developing nations, especially small island nations and sub-Saharan Africa",
            options: JSON.stringify([
              "North America and Europe",
              "Developed industrial nations",
              "Developing nations, especially small island nations and sub-Saharan Africa",
              "Antarctica and the Arctic only",
            ]),
            hint: "The speaker discusses climate inequality.",
            startTimeSec: 40,
            endTimeSec: 65,
            sortOrder: 2,
          },
          {
            type: "fill-blank",
            question: "The Paris Agreement set a target of limiting warming to _____ degrees Celsius.",
            answer: "one point five",
            options: null,
            hint: "Listen for the specific temperature target mentioned.",
            startTimeSec: 65,
            endTimeSec: 80,
            sortOrder: 3,
          },
          {
            type: "comprehension",
            question: "According to the speaker, what is the most powerful thing an individual can do about climate change?",
            answer: "Vote for leaders who take climate science seriously",
            options: JSON.stringify([
              "Stop driving cars completely",
              "Move to a different country",
              "Vote for leaders who take climate science seriously",
              "Stop using electricity at home",
            ]),
            hint: "Listen to the section about personal actions near the end.",
            startTimeSec: 90,
            endTimeSec: 115,
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // --- Content 4 ---
  await prisma.listeningContent.create({
    data: {
      title: "Hotel Check-in",
      slug: "hotel-check-in",
      audioUrl: "/audio/listening-4.mp3",
      level: "beginner",
      category: "conversation",
      durationSec: 45,
      speakerCount: 2,
      transcript: `Receptionist: Good afternoon! Welcome to the Riverside Hotel. How can I help you?

Guest: Hi, I have a reservation under the name David Park.

Receptionist: Let me check. Yes, I see it here. You've booked a double room for three nights, checking out on Thursday. Is that correct?

Guest: Yes, that's right.

Receptionist: Wonderful. Your room is number 412 on the fourth floor. Here is your key card. The elevator is just down the hall to your left.

Guest: Thank you. Is breakfast included?

Receptionist: Yes, breakfast is served in the restaurant on the ground floor from seven to ten in the morning.

Guest: Great. And is there free wifi in the room?

Receptionist: Absolutely. The network name is "Riverside-Guest" and the password is on the card inside your key folder. You'll also find information about our gym and swimming pool there.

Guest: Perfect. One more thing—is there a good restaurant nearby for dinner?

Receptionist: Yes, there's an Italian restaurant called Bella Cucina about a five-minute walk from here. Guests love it. I can make a reservation for you if you'd like.

Guest: That would be great. A table for two at seven o'clock, please.

Receptionist: Done. Enjoy your stay, Mr. Park!

Guest: Thank you so much.`,
      exercises: {
        create: [
          {
            type: "comprehension",
            question: "How many nights is David staying at the hotel?",
            answer: "Three nights",
            options: JSON.stringify([
              "Two nights",
              "Three nights",
              "Four nights",
              "Five nights",
            ]),
            hint: "Listen to the receptionist confirming the reservation details.",
            startTimeSec: 5,
            endTimeSec: 15,
            sortOrder: 1,
          },
          {
            type: "true-false",
            question: "Breakfast is served from six to nine in the morning.",
            answer: "false",
            options: null,
            hint: "Pay attention to the exact breakfast hours mentioned.",
            startTimeSec: 15,
            endTimeSec: 25,
            sortOrder: 2,
          },
          {
            type: "comprehension",
            question: "What restaurant does the receptionist recommend?",
            answer: "An Italian restaurant called Bella Cucina",
            options: JSON.stringify([
              "A Chinese restaurant called Golden Dragon",
              "An Italian restaurant called Bella Cucina",
              "A French restaurant called Le Petit",
              "A Japanese restaurant called Sakura",
            ]),
            hint: "Listen to the end of the conversation about dinner.",
            startTimeSec: 30,
            endTimeSec: 45,
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // --- Content 5 ---
  await prisma.listeningContent.create({
    data: {
      title: "Job Interview",
      slug: "job-interview",
      audioUrl: "/audio/listening-5.mp3",
      level: "intermediate",
      category: "conversation",
      durationSec: 90,
      speakerCount: 2,
      transcript: `Interviewer: Thank you for coming in today, Sarah. Please have a seat. Let's start by having you tell me a little about yourself.

Sarah: Thank you for having me. I graduated from the University of Melbourne with a degree in marketing three years ago. Since then, I've been working as a marketing coordinator at a mid-sized tech company, where I managed social media campaigns and helped increase our online engagement by forty percent.

Interviewer: That's impressive. What would you say is your greatest strength?

Sarah: I'd say my greatest strength is my ability to analyze data and turn it into actionable strategies. I'm very detail-oriented, but I also enjoy the creative side of marketing—coming up with campaign ideas and visual concepts.

Interviewer: And what about areas where you'd like to improve?

Sarah: Honestly, public speaking used to be a challenge for me. I'd get nervous presenting to large groups. But over the past year, I joined a Toastmasters club and have been actively working on it. I now present quarterly results to our team of thirty people, and I'm much more confident.

Interviewer: That's great to hear. Now, why are you interested in this position at our company?

Sarah: I've been following your company for a while, and I'm really excited about your approach to sustainable marketing. I read about your campaign for the EcoLine product launch, and I thought it was brilliant how you combined storytelling with environmental messaging. I want to be part of a team that uses marketing as a force for good.

Interviewer: Thank you, Sarah. We'll be in touch within the next week. Do you have any questions for me?

Sarah: Yes, actually. Could you tell me more about the team I'd be working with and what a typical day looks like?

Interviewer: Of course. You'd be joining a team of eight...`,
      exercises: {
        create: [
          {
            type: "comprehension",
            question: "What is Sarah's current job title?",
            answer: "Marketing coordinator",
            options: JSON.stringify([
              "Marketing director",
              "Marketing coordinator",
              "Sales manager",
              "Content writer",
            ]),
            hint: "Listen to Sarah's introduction about her work experience.",
            startTimeSec: 5,
            endTimeSec: 25,
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "By how much did Sarah help increase online engagement?",
            answer: "Forty percent",
            options: JSON.stringify([
              "Twenty percent",
              "Thirty percent",
              "Forty percent",
              "Fifty percent",
            ]),
            hint: "Sarah mentions a specific number when describing her achievements.",
            startTimeSec: 15,
            endTimeSec: 25,
            sortOrder: 2,
          },
          {
            type: "fill-blank",
            question: "Sarah joined a _____ club to improve her public speaking skills.",
            answer: "Toastmasters",
            options: null,
            hint: "It's a well-known organization for public speaking practice.",
            startTimeSec: 35,
            endTimeSec: 55,
            sortOrder: 3,
          },
          {
            type: "comprehension",
            question: "Why is Sarah interested in this company?",
            answer: "She is excited about their approach to sustainable marketing",
            options: JSON.stringify([
              "They offer the highest salary",
              "She is excited about their approach to sustainable marketing",
              "Her friend works there",
              "They are the biggest company in the industry",
            ]),
            hint: "Listen to Sarah's answer about why she wants the job.",
            startTimeSec: 55,
            endTimeSec: 80,
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // --- Content 6 ---
  await prisma.listeningContent.create({
    data: {
      title: "News Report: Space Exploration",
      slug: "news-report-space-exploration",
      audioUrl: "/audio/listening-6.mp3",
      level: "intermediate",
      category: "news",
      durationSec: 75,
      speakerCount: 1,
      transcript: `Good evening. This is Rachel Torres with Global News Network. Tonight's top story: NASA's Artemis IV mission has successfully launched from Kennedy Space Center in Florida, marking a historic new chapter in human space exploration.

The spacecraft lifted off at 6:47 AM Eastern Time, carrying four astronauts on a journey that will take approximately four days to reach the Moon. This mission is the first to carry a crew to the Lunar Gateway, a small space station orbiting the Moon that will serve as a staging point for future missions to the lunar surface and, eventually, Mars.

Commander James Liu, a veteran of two previous space missions, is leading the crew. In a press conference before launch, he said, quote, "This is not just a mission for NASA. This is a mission for all of humanity. What we learn here will pave the way for the next giant leap."

The crew will spend ten days at the Lunar Gateway, conducting scientific experiments, testing new life-support systems, and deploying a small rover to the Moon's south pole, where scientists believe water ice may exist beneath the surface.

The mission has a total cost of approximately 2.3 billion dollars, funded through an international partnership involving the European Space Agency, the Japanese space agency JAXA, and the Canadian Space Agency.

Public reaction has been overwhelmingly positive, with millions watching the launch live on social media. NASA administrator Dr. Maria Santos called it "the beginning of a new era for space exploration."

We'll have more updates throughout the evening. I'm Rachel Torres. Stay with us.`,
      exercises: {
        create: [
          {
            type: "comprehension",
            question: "What is the destination of the Artemis IV mission?",
            answer: "The Lunar Gateway, a space station orbiting the Moon",
            options: JSON.stringify([
              "Mars",
              "The International Space Station",
              "The Lunar Gateway, a space station orbiting the Moon",
              "Jupiter's moon Europa",
            ]),
            hint: "Listen for the description of where the crew is headed.",
            startTimeSec: 15,
            endTimeSec: 35,
            sortOrder: 1,
          },
          {
            type: "fill-blank",
            question: "The crew will deploy a small rover to the Moon's _____ pole.",
            answer: "south",
            options: null,
            hint: "Scientists believe water ice may exist at this specific location.",
            startTimeSec: 40,
            endTimeSec: 55,
            sortOrder: 2,
          },
          {
            type: "true-false",
            question: "The mission is funded entirely by NASA without international partners.",
            answer: "false",
            options: null,
            hint: "Listen for mentions of other space agencies.",
            startTimeSec: 55,
            endTimeSec: 70,
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // --- Content 7 ---
  await prisma.listeningContent.create({
    data: {
      title: "University Lecture: Psychology",
      slug: "university-lecture-psychology",
      audioUrl: "/audio/listening-7.mp3",
      level: "advanced",
      category: "academic",
      durationSec: 120,
      speakerCount: 1,
      transcript: `Good morning, everyone. Today we're continuing our series on cognitive psychology by examining a topic that affects every decision we make, often without our awareness: cognitive biases.

A cognitive bias is a systematic pattern of deviation from rationality in judgment. In other words, it's a mental shortcut that our brains use to process information quickly, but which can lead us to make errors. Let me give you some key examples.

First, there's confirmation bias. This is our tendency to search for, interpret, and recall information in a way that confirms our pre-existing beliefs. For instance, if you believe that a particular diet is effective, you'll tend to notice success stories and dismiss failures. This bias is particularly dangerous in scientific research, which is why rigorous peer review and double-blind studies are so important.

Next, consider the anchoring effect. When making decisions, we tend to rely heavily on the first piece of information we encounter—the anchor. A classic example is in salary negotiation. If a job listing states a salary range of sixty to eighty thousand dollars, that range becomes the anchor, and most negotiations will fall within or near it, even if the candidate's market value is significantly higher.

Then there's the Dunning-Kruger effect, which describes how people with limited knowledge in a domain tend to overestimate their competence, while experts tend to underestimate theirs. You've probably seen this online—people making confident claims about complex topics they barely understand, while actual researchers express careful uncertainty.

Finally, let's talk about the availability heuristic. This is our tendency to judge the likelihood of events based on how easily examples come to mind. After seeing news reports about airplane crashes, people often overestimate the danger of flying, even though statistically, driving is far more dangerous.

Understanding these biases doesn't make us immune to them, but awareness is the first step toward better decision-making. For next week, please read chapter seven on heuristics and prepare for the in-class discussion.`,
      exercises: {
        create: [
          {
            type: "comprehension",
            question: "How does the lecturer define a cognitive bias?",
            answer: "A systematic pattern of deviation from rationality in judgment",
            options: JSON.stringify([
              "A mental illness that affects judgment",
              "A systematic pattern of deviation from rationality in judgment",
              "A strategy used by advertisers",
              "A technique for improving memory",
            ]),
            hint: "Listen to the definition given near the beginning of the lecture.",
            startTimeSec: 5,
            endTimeSec: 25,
            sortOrder: 1,
          },
          {
            type: "comprehension",
            question: "What example is used to illustrate the anchoring effect?",
            answer: "Salary negotiation",
            options: JSON.stringify([
              "Shopping for a car",
              "Choosing a restaurant",
              "Salary negotiation",
              "Picking a university",
            ]),
            hint: "The lecturer describes a scenario involving job offers.",
            startTimeSec: 40,
            endTimeSec: 65,
            sortOrder: 2,
          },
          {
            type: "fill-blank",
            question: "The _____ effect describes how people with limited knowledge tend to overestimate their competence.",
            answer: "Dunning-Kruger",
            options: null,
            hint: "It is named after two researchers.",
            startTimeSec: 65,
            endTimeSec: 85,
            sortOrder: 3,
          },
          {
            type: "comprehension",
            question: "According to the availability heuristic example, why do people overestimate the danger of flying?",
            answer: "Because airplane crash news reports are vivid and easy to recall",
            options: JSON.stringify([
              "Because airplanes are statistically more dangerous than cars",
              "Because airplane crash news reports are vivid and easy to recall",
              "Because they have experienced a crash personally",
              "Because scientists have proven flying is dangerous",
            ]),
            hint: "The heuristic is about how easily examples come to mind.",
            startTimeSec: 85,
            endTimeSec: 110,
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // --- Content 8 ---
  await prisma.listeningContent.create({
    data: {
      title: "Asking for Directions",
      slug: "asking-for-directions",
      audioUrl: "/audio/listening-8.mp3",
      level: "beginner",
      category: "conversation",
      durationSec: 40,
      speakerCount: 2,
      transcript: `Tourist: Excuse me, could you help me? I'm trying to find the Natural History Museum.

Local: Of course! It's not far from here. Go straight down this street for about two blocks. When you reach the big fountain in the square, turn left.

Tourist: Okay, straight for two blocks, then left at the fountain.

Local: That's right. After you turn left, walk for about one more block. You'll see a large stone building with columns on your right. That's the museum. You can't miss it.

Tourist: Great, thank you. Do you know what time it closes?

Local: I think it closes at five o'clock, so you still have plenty of time.

Tourist: Perfect. And is there a subway station near the museum? I need to get back to my hotel later.

Local: Yes, there's one right across the street from the museum entrance. It's the Green Line, Parkview Station.

Tourist: Wonderful. Thank you so much for your help!

Local: You're welcome. Enjoy the museum!`,
      exercises: {
        create: [
          {
            type: "comprehension",
            question: "Where should the tourist turn left?",
            answer: "At the big fountain in the square",
            options: JSON.stringify([
              "At the traffic light",
              "At the big fountain in the square",
              "At the subway station",
              "At the bookshop",
            ]),
            hint: "Listen for the landmark mentioned as a turning point.",
            startTimeSec: 5,
            endTimeSec: 18,
            sortOrder: 1,
          },
          {
            type: "true-false",
            question: "The museum closes at six o'clock.",
            answer: "false",
            options: null,
            hint: "Listen for the specific closing time the local mentions.",
            startTimeSec: 18,
            endTimeSec: 28,
            sortOrder: 2,
          },
          {
            type: "comprehension",
            question: "What is the name of the nearby subway station?",
            answer: "Parkview Station",
            options: JSON.stringify([
              "Museum Station",
              "Central Station",
              "Greenfield Station",
              "Parkview Station",
            ]),
            hint: "Listen to the end of the conversation about getting back to the hotel.",
            startTimeSec: 28,
            endTimeSec: 40,
            sortOrder: 3,
          },
        ],
      },
    },
  });

  console.log("  ✓ Listening done: 8 contents, ~30 exercises\n");
}
