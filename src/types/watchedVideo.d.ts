// 視聴記録API用型定義

export interface WatchedVideo {
  id: number;
  videoId: string;
  watchedAt: string; // ISO文字列
}

// GET /api/watched-video?month=YYYY-MM のレスポンス型
export type WatchedVideoListResponse = WatchedVideo[];

// POST /api/watched-video のリクエスト型
export interface WatchedVideoPostRequest {
  videoId: string;
  watchedAt?: string; // ISO文字列（任意）
}

// POST /api/watched-video のレスポンス型
export type WatchedVideoPostResponse = WatchedVideo;
