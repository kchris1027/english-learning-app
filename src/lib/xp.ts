export const XP_VALUES = {
  WORD_LEARNED: 5,
  WORD_REVIEWED: 3,
  GRAMMAR_EXERCISE: 10,
  GRAMMAR_TOPIC_COMPLETE: 50,
  ARTICLE_READ: 20,
  LISTENING_COMPLETE: 15,
  DICTATION_COMPLETE: 25,
  SPEAKING_PRACTICE: 20,
  CHAT_MESSAGE: 2,
  QUIZ_COMPLETE: 30,
  QUIZ_PERFECT: 50,
  DAILY_STREAK_BONUS: 10,
} as const;

export function calculateLevel(totalXp: number): { level: number; xpForNext: number; progress: number } {
  const xpPerLevel = 200;
  const level = Math.floor(totalXp / xpPerLevel) + 1;
  const xpInCurrentLevel = totalXp % xpPerLevel;
  return {
    level,
    xpForNext: xpPerLevel - xpInCurrentLevel,
    progress: (xpInCurrentLevel / xpPerLevel) * 100,
  };
}
