import type { NextRequest } from "next/server";

// YouTube Data APIキーは環境変数から取得（youtube/route.tsと同じ方式に統一）
const apiKey = process.env.YOUTUBE_API_KEY;

// GET /api/youtube-channel-name?channelId=xxxx でチャンネル名を返すAPI
// 使い方: fetch('/api/youtube-channel-name?channelId=xxxx')
export async function GET(req: NextRequest) {
  // リクエストURLからクエリパラメータを取得
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId");

  // チャンネルIDが指定されていない場合は400エラー
  if (!channelId) {
    return new Response(JSON.stringify({ error: "channelId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // APIキーが未設定の場合は500エラー
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // YouTube Data APIのURLを生成
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
  try {
    // YouTube APIへリクエスト
    const res = await fetch(url);
    const data = await res.json();
    // チャンネル名を抽出
    const channelName = data.items?.[0]?.snippet?.title;
    // チャンネルが見つからない場合は404エラー
    if (!channelName) {
      return new Response(JSON.stringify({ error: "Channel not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    // 正常時はチャンネル名を返す
    return new Response(JSON.stringify({ channelName }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // APIリクエスト失敗時は500エラー
    return new Response(
      JSON.stringify({ error: "Failed to fetch channel name" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
