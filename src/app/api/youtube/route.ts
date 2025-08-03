// YouTube Data APIから指定チャンネルの最新動画5件を取得するAPI Route
// - APIキーは.envから取得
// - チャンネルIDはハードコーディング（MVP用）
// - fetchでYouTube APIにリクエストし、結果をJSONで返す
// - エラー時は500でエラーメッセージを返す
import { NextResponse } from "next/server";
import type { YoutubeApiItem } from "../../../types/youtube";

export async function GET() {
  // .envからYouTube APIキーを取得
  const apiKey = process.env.YOUTUBE_API_KEY;
  // MVP用：Google Developers公式チャンネルID（今後お気に入りIDに変更予定）
  const channelId = "UCRhzmriNRfJNLIGYzAJgagA";
  // YouTube Data API v3の検索エンドポイントURLを生成
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=8&type=video`;

  try {
    // 1. 動画ID一覧取得
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const videoIds = ((searchData.items as YoutubeApiItem[]) || [])
      .map((item) => item.id?.videoId)
      .filter((id: string | undefined) => !!id);

    if (videoIds.length === 0) {
      return NextResponse.json({ error: "No videos found" }, { status: 404 });
    }

    // 2. 動画詳細情報取得
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds.join(
      ","
    )}&part=snippet,contentDetails,statistics`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    // 3. 必要な情報だけ返す
    return NextResponse.json(detailsData);
  } catch (error) {
    // エラー発生時は内容をログ出力し、500エラーとして返す
    console.error("Error fetching YouTube data:", error);
    return NextResponse.json({ error: "API fetch failed" }, { status: 500 });
  }
}
