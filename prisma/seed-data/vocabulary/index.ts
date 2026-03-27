import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

interface WordEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  definitionZh: string;
  exampleSentence: string;
  exampleTranslation: string;
  difficulty: number;
  tags: string[];
}

interface BankConfig {
  name: string;
  description: string;
  level: string;
  category: string;
  sortOrder: number;
  file: string;
}

const BANKS: BankConfig[] = [
  {
    name: "Essential Daily English",
    description:
      "Core everyday vocabulary for beginners. Master these words to handle common daily situations with confidence.",
    level: "beginner",
    category: "topic",
    sortOrder: 1,
    file: "daily.json",
  },
  {
    name: "CET-6 Core Vocabulary",
    description:
      "大学英语六级考试核心高频词汇。College English Test Band 6 essential words for Chinese university students.",
    level: "intermediate",
    category: "exam",
    sortOrder: 2,
    file: "cet6.json",
  },
  {
    name: "TOEFL Core Vocabulary",
    description:
      "托福考试核心学术词汇。Essential academic vocabulary for the TOEFL iBT test covering science, humanities, and social sciences.",
    level: "intermediate",
    category: "exam",
    sortOrder: 3,
    file: "toefl.json",
  },
  {
    name: "IELTS Academic Vocabulary",
    description:
      "雅思学术类核心词汇。Key words for IELTS Academic and General Training modules including reading, writing, listening, and speaking.",
    level: "intermediate",
    category: "exam",
    sortOrder: 4,
    file: "ielts.json",
  },
  {
    name: "GRE Advanced Vocabulary",
    description:
      "GRE考试高频核心词汇。High-frequency advanced vocabulary for the GRE Verbal Reasoning section.",
    level: "advanced",
    category: "exam",
    sortOrder: 5,
    file: "gre.json",
  },
  {
    name: "Common Phrasal Verbs",
    description:
      "英语常用短语动词。Essential phrasal verbs that native speakers use every day in conversation and writing.",
    level: "intermediate",
    category: "topic",
    sortOrder: 6,
    file: "phrasal-verbs.json",
  },
  {
    name: "Idioms & Expressions",
    description:
      "英语常用习语和表达。Popular English idioms and fixed expressions to make your English sound more natural and fluent.",
    level: "advanced",
    category: "topic",
    sortOrder: 7,
    file: "idioms.json",
  },
  {
    name: "Business English",
    description:
      "商务英语核心词汇。Professional vocabulary for meetings, negotiations, emails, and corporate communication.",
    level: "advanced",
    category: "topic",
    sortOrder: 8,
    file: "business.json",
  },
];

const VOCAB_DIR = join(process.cwd(), "prisma", "seed-data", "vocabulary");

function loadWords(filename: string): WordEntry[] {
  const filePath = join(VOCAB_DIR, filename);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function seedVocabulary(prisma: PrismaClient) {
  console.log("  📚 Seeding vocabulary...");
  let totalWords = 0;

  for (const bank of BANKS) {
    let words: WordEntry[];
    try {
      words = loadWords(bank.file);
    } catch {
      console.log(`    ⚠ Skipping ${bank.name} — ${bank.file} not found`);
      continue;
    }

    const created = await prisma.wordBank.create({
      data: {
        name: bank.name,
        description: bank.description,
        level: bank.level,
        category: bank.category,
        sortOrder: bank.sortOrder,
      },
    });

    const BATCH_SIZE = 100;
    for (let i = 0; i < words.length; i += BATCH_SIZE) {
      const batch = words.slice(i, i + BATCH_SIZE);
      await prisma.word.createMany({
        data: batch.map((w) => ({
          bankId: created.id,
          word: w.word,
          phonetic: w.phonetic || null,
          partOfSpeech: w.partOfSpeech,
          definition: w.definition,
          definitionZh: w.definitionZh || null,
          exampleSentence: w.exampleSentence || null,
          exampleTranslation: w.exampleTranslation || null,
          difficulty: w.difficulty || 1,
          tags: JSON.stringify(w.tags || []),
        })),
      });
    }

    totalWords += words.length;
    console.log(`    ✓ ${bank.name}: ${words.length} words`);
  }

  console.log(`  ✓ Vocabulary done: ${totalWords} words total\n`);
}
