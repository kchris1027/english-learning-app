import { prisma } from "./db";

const DEFAULT_USER_ID = "default-user-001";

export async function getCurrentUser() {
  let user = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
    include: { streak: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: DEFAULT_USER_ID,
        name: "Learner",
        email: "learner@example.com",
        level: "beginner",
        nativeLanguage: "zh-CN",
        streak: {
          create: {
            currentStreak: 0,
            longestStreak: 0,
          },
        },
      },
      include: { streak: true },
    });
  }

  return user;
}

export function getDefaultUserId() {
  return DEFAULT_USER_ID;
}
