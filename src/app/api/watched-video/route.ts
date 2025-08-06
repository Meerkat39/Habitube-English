import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET /api/watched-video?month=YYYY-MM
// 視聴履歴取得API（GET）: 指定月の視聴記録一覧を返す
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
    // 指定月の視聴記録をDBから取得（昇順）
    const records = await prisma.watchedVideo.findMany({
      where: {
        watchedAt: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { watchedAt: "asc" },
    });
    // 取得結果を返却
    return NextResponse.json(records);
  } catch (error) {
    // 取得失敗時は500エラー＋ログ
    console.error("Error fetching watched videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

// POST /api/watched-video
// 視聴記録保存API（POST）: 動画ID・視聴日時をDBに保存
// body: { videoId: string, watchedAt?: string }
export async function POST(request: Request) {
  try {
    // リクエストボディからvideoIdとwatchedAt（任意）を取得
    const { videoId, watchedAt } = await request.json();
    // videoId未指定・型不正なら400エラー
    if (!videoId || typeof videoId !== "string") {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 }
      );
    }
    // 保存データを整形
    // watchedAtが指定されていればその日時、未指定ならDBのnow()（@default）
    const data = {
      videoId,
      watchedAt: watchedAt ? new Date(watchedAt) : undefined,
    };
    // DBに新規レコード作成
    const record = await prisma.watchedVideo.create({ data });
    // 保存成功時は201でレコード返却
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    // videoId重複（UNIQUE制約違反）の場合は409エラー
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Already recorded" }, { status: 409 });
    }
    // その他のエラーは500で返却＋ログ出力
    console.error("Error saving watched video:", error);
    return NextResponse.json(
      { error: "Failed to save record" },
      { status: 500 }
    );
  }
}
