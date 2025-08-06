// 視聴記録API呼び出し用ユーティリティ
// 目的: API連携を標準化し、型安全・エラー処理も含めてUIから簡単に使えるようにする
import type {
  WatchedVideoListResponse,
  WatchedVideoPostRequest,
  WatchedVideoPostResponse,
} from "../types/watchedVideo";

/**
 * 指定月の視聴記録一覧を取得する（GET）
 * @param month YYYY-MM形式
 */
export async function fetchWatchedVideoList(
  month: string
): Promise<WatchedVideoListResponse> {
  const res = await fetch(`/api/watched-video?month=${month}`);
  if (!res.ok) throw new Error("Failed to fetch watched video list");
  return await res.json();
}

/**
 * 視聴記録を保存する（POST）
 * @param data { videoId, watchedAt? }
 */
export async function postWatchedVideo(
  data: WatchedVideoPostRequest
): Promise<WatchedVideoPostResponse> {
  const res = await fetch("/api/watched-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save watched video");
  return await res.json();
}
