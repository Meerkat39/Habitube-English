// Prismaクライアントのインポート
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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
