// YouTube Data APIから指定チャンネルの最新動画5件を取得するAPI Route
// - APIキーは.envから取得
// - チャンネルIDはハードコーディング（MVP用）
// - fetchでYouTube APIにリクエストし、結果をJSONで返す
// - エラー時は500でエラーメッセージを返す
import { NextResponse } from "next/server";

export async function GET() {
  // .envからYouTube APIキーを取得
  const apiKey = process.env.YOUTUBE_API_KEY;
  // MVP用：Google Developers公式チャンネルID（今後お気に入りIDに変更予定）
  const channelId = "UC_x5XG1OV2P6uZZ5FSM9Ttw";
  // YouTube Data API v3の検索エンドポイントURLを生成
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`;

  try {
    // YouTube APIにリクエストを送信
    const response = await fetch(url);
    // レスポンスをJSON形式で取得
    const data = await response.json();
    // 取得した動画データをそのまま返す
    return NextResponse.json(data);
  } catch (error) {
    // エラー発生時は内容をログ出力し、500エラーとして返す
    console.error("Error fetching YouTube data:", error);
    return NextResponse.json({ error: "API fetch failed" }, { status: 500 });
  }
}
