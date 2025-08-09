import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 達成済みデータのサンプル（必要に応じて日付やユーザーIDを調整）
  const achievements = [
    { date: "2025-08-01", userId: 1 },
    { date: "2025-08-02", userId: 1 },
    { date: "2025-08-03", userId: 1 },
    { date: "2025-07-31", userId: 1 }, // 前月末
    { date: "2025-08-10", userId: 1 }, // 今日
    { date: "2025-09-01", userId: 1 }, // 翌月初日
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { userId_date: { userId: a.userId, date: a.date } },
      update: {},
      create: { date: a.date, userId: a.userId },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
