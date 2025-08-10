import {
  fetchFavoriteChannels,
  fetchVideosFromChannel,
  pickRandom,
} from "@/lib/randomFavoriteVideos";
import type { YoutubeVideoDetailsApiItem } from "@/types/youtube";
import { NextResponse } from "next/server";

// YouTube Data APIキーは環境変数から取得
const apiKey = process.env.YOUTUBE_API_KEY;

// GET /api/random-favorite-videos
export async function GET() {
  // 1. お気に入りチャンネルID一覧取得
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const channelIds = await fetchFavoriteChannels(baseUrl);
  if (!channelIds.length) {
    return NextResponse.json(
      { error: "No favorite channels" },
      { status: 404 }
    );
  }

  // 2. 各チャンネルから最新動画ID一覧を取得
  let allVideoIds: string[] = [];
  for (const channelId of channelIds) {
    const videos = await fetchVideosFromChannel(channelId, apiKey!, 20);
    allVideoIds = allVideoIds.concat(videos.map((v) => v.videoId));
  }

  // 3. ランダムで8件動画ID選択
  const pickedIds = pickRandom(allVideoIds, 8);
  if (pickedIds.length === 0) {
    return NextResponse.json({ error: "No videos found" }, { status: 404 });
  }

  // 4. videos APIで詳細情報取得
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${pickedIds.join(
    ","
  )}&part=snippet,contentDetails,statistics`;
  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  // 5. 必要な情報だけ整形して返す
  const result = (
    (detailsData.items as YoutubeVideoDetailsApiItem[]) || []
  ).map((item) => ({
    videoId: item.id,
    title: item.snippet.title,
    description: item.snippet.description ?? "",
    thumbnailUrl: item.snippet.thumbnails?.high?.url ?? "",
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt ?? "",
    duration: item.contentDetails.duration ?? "",
    viewCount: Number(item.statistics.viewCount ?? 0),
  }));
  return NextResponse.json(result);
}
