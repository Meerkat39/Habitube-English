import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 既存データをクリア
  await prisma.achievement.deleteMany({});
  await prisma.favoriteChannel.deleteMany({});
  
  // お気に入りチャンネルのサンプル
  const favoriteChannels = [
    { channelId: "UCHaHD477h-FeBbVh9Sh7syA", userId: 1 },  // BBC Learning English
    { channelId: "UCXZCJLdBC09xxGZ6gcdrc6A", userId: 1 },  // OpenAI
    { channelId: "UCsooa4yRKGN_zEE8iknghZA", userId: 1 },  // TED-Ed
    { channelId: "UCX6OQ3DkcsbYNE6H8uQQuVA", userId: 1 },  // MrBeast
    { channelId: "UCixD9UbKvDxzGNiPC_fgHyA", userId: 1 },  // Paolo fromTOKYO
    { channelId: "UCRhzmriNRfJNLIGYzAJgagA", userId: 1 },  // seerasan
    { channelId: "UC3ETCazlHenpXEsrEJH-k5A", userId: 1 },  // The Anime Man
    { channelId: "UCPsZ_0SkFdi551iYTG04R2g", userId: 1 },  // CDawgVA
  ];

  for (const c of favoriteChannels) {
    await prisma.favoriteChannel.create({
      data: c,
    });
  }

  // 達成済みデータのサンプル（必要に応じて日付やユーザーIDを調整）
  const achievements = [
    { date: "2025-07-31", userId: 1 },
    { date: "2025-08-01", userId: 1 },
    { date: "2025-08-02", userId: 1 },
    { date: "2025-08-03", userId: 1 },
    { date: "2025-08-04", userId: 1 },
    { date: "2025-08-05", userId: 1 },
    { date: "2025-08-06", userId: 1 },
    { date: "2025-08-07", userId: 1 },
    { date: "2025-08-08", userId: 1 },
    { date: "2025-08-09", userId: 1 },
    { date: "2025-08-10", userId: 1 },
    { date: "2025-08-11", userId: 1 },
    { date: "2025-08-12", userId: 1 },
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
