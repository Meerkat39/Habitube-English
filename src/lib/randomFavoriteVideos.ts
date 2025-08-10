import type { YoutubeApiItem, YoutubeVideo } from "@/types/youtube";

/**
 * お気に入りチャンネルID一覧を取得（API Route経由）
 */
export async function fetchFavoriteChannels(
  baseUrl: string
): Promise<string[]> {
  const res = await fetch(`${baseUrl}/api/favorite-channels`);
  const data = await res.json();
  return Array.isArray(data)
    ? data.map((ch: { channelId: string }) => ch.channelId)
    : [];
}

/**
 * 指定チャンネルIDから最新動画を複数件取得
 */
export async function fetchVideosFromChannel(
  channelId: string,
  apiKey: string,
  maxResults = 20
): Promise<YoutubeVideo[]> {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return ((data.items as YoutubeApiItem[]) || []).map((item) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      description: item.snippet?.description ?? "",
      thumbnailUrl: item.snippet?.thumbnails?.high?.url ?? "",
      channelTitle: item.snippet?.channelTitle,
      publishedAt: item.snippet?.publishedAt ?? "",
      duration: "",
      viewCount: 0,
    }));
  } catch {
    return [];
  }
}

/**
 * 配列からランダムにn件選ぶ
 */
export function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = arr.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
