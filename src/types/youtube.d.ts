/**
 * YoutubeVideo
 * UI表示用のYouTube動画データ型
 * APIレスポンスから必要な項目のみ抽出して利用
 */
export interface YoutubeVideo {
  videoId: string; // 動画ID（YouTube再生URL生成用）
  title: string; // 動画タイトル
  description: string; // 動画説明文
  thumbnailUrl: string; // サムネイル画像URL
  channelTitle: string; // チャンネル名
  publishedAt: string; // 公開日時（ISO文字列）
  duration: string; // 動画長さ（ISO8601文字列、例: PT5M12S）
  viewCount: number; // 再生数
}

/**
 * YoutubeApiItem
 * YouTube Data API v3のitems配列の1件分の型
 * APIレスポンスの構造に合わせて定義
 */
export interface YoutubeApiItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails?: { high?: { url: string } };
    channelTitle: string;
    publishedAt: string;
  };
}

/**
 * YoutubeVideoDetailsApiItem
 * YouTube Data API v3のvideosエンドポイントの1件分の型
 */
export interface YoutubeVideoDetailsApiItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails?: { high?: { url: string } };
    channelTitle: string;
    publishedAt: string;
  };
  contentDetails: {
    duration: string; // ISO8601形式（例: PT5M12S）
  };
  statistics: {
    viewCount: string; // 数値文字列
  };
}

/**
 * YoutubeVideoDetailsApiResponse
 * YouTube Data API v3のvideosエンドポイントのレスポンス型
 */
export interface YoutubeVideoDetailsApiResponse {
  items?: YoutubeVideoDetailsApiItem[];
}
