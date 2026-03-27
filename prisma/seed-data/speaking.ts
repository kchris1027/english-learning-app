import { PrismaClient } from "@prisma/client";

export async function seedSpeaking(prisma: PrismaClient) {
  console.log("  🎤 Seeding speaking prompts...");

  await prisma.speakingPrompt.createMany({
    data: [
      {
        type: "read-aloud",
        title: "Daily Routine Description",
        content:
          "Read the following passage about a typical morning routine clearly and naturally. Pay attention to pronunciation and rhythm.",
        referenceText:
          "Every morning I wake up at seven o'clock. I brush my teeth, take a quick shower, and get dressed for work. After a simple breakfast of toast and coffee, I grab my bag and head to the bus stop. The bus ride takes about thirty minutes. I usually listen to music or read the news on my phone during the commute. By eight thirty, I arrive at the office ready to start my day.",
        level: "beginner",
        category: "daily-life",
      },
      {
        type: "read-aloud",
        title: "Technology and Society",
        content:
          "Read the following passage about technology's impact on modern life. Focus on clear enunciation of technical vocabulary and maintaining a steady pace.",
        referenceText:
          "Technology has fundamentally transformed the way we live, work, and communicate. Smartphones connect us instantly to people around the globe, while artificial intelligence automates tasks that once required hours of human effort. Social media platforms have reshaped how we share information and form communities. However, this rapid digital evolution also raises important questions about privacy, mental health, and the growing digital divide between generations.",
        level: "intermediate",
        category: "technology",
      },
      {
        type: "picture-describe",
        title: "Busy City Street Scene",
        content:
          "Imagine a bustling downtown intersection during rush hour. Describe what you see: the people, vehicles, buildings, and atmosphere. Speak for at least 60 seconds, using vivid details and varied vocabulary.",
        referenceText: null,
        level: "intermediate",
        category: "urban-life",
      },
      {
        type: "picture-describe",
        title: "Environmental Contrast",
        content:
          "Imagine two side-by-side images: on the left, a thriving green forest full of wildlife; on the right, a barren deforested area with stumps and dry soil. Compare and contrast these two scenes. Describe what you observe and explain the possible causes and consequences.",
        referenceText: null,
        level: "advanced",
        category: "environment",
      },
      {
        type: "free-talk",
        title: "Your Ideal Vacation",
        content:
          "Talk about your ideal vacation destination. Where would you go? What would you do there? Who would you travel with? Describe the place, activities, food, and culture. Speak for about 90 seconds.",
        referenceText: null,
        level: "intermediate",
        category: "travel",
      },
      {
        type: "read-aloud",
        title: "Self-Introduction",
        content:
          "Read the following self-introduction passage aloud. Speak naturally, as if you are introducing yourself to a new classmate or colleague.",
        referenceText:
          "Hello, my name is Alex and I am twenty-three years old. I come from a small town near the coast. In my free time, I enjoy reading novels and playing basketball with my friends. I have one older sister who works as a teacher. Right now I am studying computer science at university, and I hope to become a software developer after I graduate.",
        level: "beginner",
        category: "social",
      },
      {
        type: "read-aloud",
        title: "Healthy Eating Habits",
        content:
          "Read the following passage about maintaining a healthy diet. Pay attention to the pronunciation of nutrition-related vocabulary and keep a natural reading flow.",
        referenceText:
          "A balanced diet is essential for maintaining good health and energy throughout the day. Nutritionists recommend eating plenty of fruits, vegetables, and whole grains while limiting processed foods high in sugar and salt. Planning your meals ahead of time can help you make better choices and avoid unhealthy snacking. Drinking enough water is equally important, as it supports digestion and keeps your body functioning properly. Small, consistent changes in your eating habits can lead to significant improvements over time.",
        level: "intermediate",
        category: "health",
      },
      {
        type: "picture-describe",
        title: "Weekend Market",
        content:
          "Imagine a lively outdoor farmers market on a sunny weekend morning. There are colorful stalls selling fresh fruits, vegetables, flowers, and handmade crafts. People are walking around with bags, chatting with vendors, and sampling food. Describe the scene in detail, including what you see, hear, and smell. Speak for at least 45 seconds.",
        referenceText: null,
        level: "beginner",
        category: "daily-life",
      },
      {
        type: "free-talk",
        title: "Dream Job",
        content:
          "Talk about your dream job. What is it and why does it appeal to you? What skills or qualifications do you need? What steps would you take to achieve this goal? Speak for about 60 seconds.",
        referenceText: null,
        level: "beginner",
        category: "career",
      },
      {
        type: "free-talk",
        title: "Climate Change Discussion",
        content:
          "Discuss the topic of climate change. What are the main causes and effects? What solutions do you think are most effective? Give specific examples to support your opinions. Speak for at least two minutes, using advanced vocabulary and well-structured arguments.",
        referenceText: null,
        level: "advanced",
        category: "environment",
      },
      {
        type: "picture-describe",
        title: "Cultural Festival",
        content:
          "Imagine a vibrant cultural festival taking place in a town square. There are colorful decorations, people wearing traditional clothing, food stalls with local delicacies, live music performances, and excited crowds. Describe the scene in rich detail, covering what people are doing, wearing, eating, and how the atmosphere feels. Speak for at least 60 seconds.",
        referenceText: null,
        level: "intermediate",
        category: "culture",
      },
      {
        type: "free-talk",
        title: "Education System",
        content:
          "Compare the education systems in different countries you know about. Discuss their strengths and weaknesses, and suggest possible reforms or improvements. Consider factors such as teaching methods, student workload, creativity, and access to education. Speak for at least two minutes with clear organization.",
        referenceText: null,
        level: "advanced",
        category: "education",
      },
    ],
  });

  console.log("  ✓ Speaking done: 12 prompts\n");
}
