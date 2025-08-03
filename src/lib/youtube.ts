// YouTube APIレスポンスをUI用のYoutubeVideo型配列に整形するユーティリティ関数
// APIのitems配列から必要な情報だけ抽出
// 使い方: fetchしたAPIレスポンス(JSON)をこの関数に渡すだけ

import { YoutubeVideo, YoutubeVideoDetailsApiResponse } from "../types/youtube";

// APIレスポンス（videosエンドポイント）をYoutubeVideo型配列に整形
export function parseYoutubeApiResponse(
  apiResponse: YoutubeVideoDetailsApiResponse
): YoutubeVideo[] {
  if (!apiResponse?.items) return [];

  return apiResponse.items.map((item) => ({
    videoId: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl: item.snippet.thumbnails?.high?.url || "",
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    duration: item.contentDetails.duration,
    viewCount: Number(item.statistics.viewCount),
  }));
}
