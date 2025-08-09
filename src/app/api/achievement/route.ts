import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/achievement?month=YYYY-MM
// 指定月の達成記録一覧を返すAPI
export async function GET(request: Request) {
  try {
    // クエリパラメータからmonth（例: 2025-08）を取得
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    // month未指定・形式不正なら400エラー
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: "month (YYYY-MM) is required" },
        { status: 400 }
      );
    }
    // 月初（1日0時）と翌月初を算出
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    // 指定月の達成記録をDBから取得（昇順）
    const records = await prisma.achievement.findMany({
      where: {
        date: {
          gte: start.toISOString().slice(0, 10),
          lt: end.toISOString().slice(0, 10),
        },
      },
      orderBy: { date: "asc" },
    });
    // 取得結果を返却
    return NextResponse.json(records);
  } catch (error) {
    // 取得失敗時は500エラー＋ログ
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

// POST /api/achievement
// 今日の達成記録をDBに保存するAPI
export async function POST(request: Request) {
  try {
    // リクエストボディから日付を取得（例: { date: "2025-08-09" }）
    const { date } = await request.json();
    if (!date) {
      // 日付が未指定の場合は400エラー
      return NextResponse.json({ error: "date is required" }, { status: 400 });
    }

    // MVP段階: ユーザーIDは仮で1固定
    const userId = 1;

    // すでに同じ日付の記録があれば重複登録しない
    const exists = await prisma.achievement.findFirst({
      where: { userId, date },
    });
    if (exists) {
      // 既に達成済みの場合は200でメッセージ返却
      return NextResponse.json(
        { message: "already achieved" },
        { status: 200 }
      );
    }

    // 新規達成記録をDBに保存
    const achievement = await prisma.achievement.create({
      data: { userId, date },
    });
    // 登録成功時は201で記録データ返却
    return NextResponse.json({ achievement }, { status: 201 });
  } catch (e) {
    console.error("Error saving achievement:", e);
    // 予期せぬエラー時は500でエラーメッセージ返却
    return NextResponse.json(
      { error: "failed to save achievement" },
      { status: 500 }
    );
  }
}
