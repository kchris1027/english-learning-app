import { PrismaClient } from "@prisma/client";
import { seedVocabulary } from "./seed-data/vocabulary/index";
import { seedGrammar } from "./seed-data/grammar";
import { seedReading } from "./seed-data/reading";
import { seedListening } from "./seed-data/listening";
import { seedSpeaking } from "./seed-data/speaking";
import { seedQuizzes } from "./seed-data/quizzes";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...\n");

  console.log("  Cleaning existing data...");
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.speakingRecord.deleteMany();
  await prisma.speakingPrompt.deleteMany();
  await prisma.listeningExercise.deleteMany();
  await prisma.userListeningProgress.deleteMany();
  await prisma.listeningContent.deleteMany();
  await prisma.readingQuestion.deleteMany();
  await prisma.userReadingProgress.deleteMany();
  await prisma.readingArticle.deleteMany();
  await prisma.grammarExercise.deleteMany();
  await prisma.userGrammarProgress.deleteMany();
  await prisma.grammarTopic.deleteMany();
  await prisma.userWordProgress.deleteMany();
  await prisma.wordbookEntry.deleteMany();
  await prisma.word.deleteMany();
  await prisma.wordBank.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.dailyProgress.deleteMany();
  await prisma.userStreak.deleteMany();
  await prisma.user.deleteMany();
  console.log("  ✓ Cleaned.\n");

  const user = await prisma.user.create({
    data: {
      id: "default-user-001",
      email: "learner@example.com",
      name: "Learner",
      level: "beginner",
      nativeLanguage: "zh-CN",
      role: "user",
      streak: {
        create: {
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null,
        },
      },
    },
  });
  console.log(`  ✓ Created user: ${user.email}\n`);

  await seedVocabulary(prisma);
  await seedGrammar(prisma);
  await seedReading(prisma);
  await seedListening(prisma);
  await seedSpeaking(prisma);
  await seedQuizzes(prisma);

  console.log("\n✅ Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
