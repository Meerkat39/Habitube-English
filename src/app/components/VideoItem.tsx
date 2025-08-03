// 動画1件表示用UIコンポーネント
// YoutubeVideo型の1件分をpropsで受け取り、サムネイル・タイトル・チャンネル名を表示
// 今後クリックでYouTube再生など拡張可能

import Image from "next/image";
import { YoutubeVideo } from "../../types/youtube";

interface VideoItemProps {
  video: YoutubeVideo; // 表示する動画データ1件
}

export default function VideoItem({ video }: VideoItemProps) {
  return (
    <div className="rounded-xl bg-gray-100 shadow-md hover:shadow-lg transition duration-200 overflow-hidden flex flex-col">
      {/*
        サムネイル画像をクリックするとYouTube動画ページを新規タブで開く
        - href: YouTube動画のURL（動画IDを埋め込み）
        - target="_blank": 新しいタブで開く
        - rel="noopener noreferrer": セキュリティ対策（親ウィンドウへのアクセス防止）
        - <Image>はNext.jsの画像最適化
      */}
      <a
        href={`https://www.youtube.com/watch?v=${video.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          width={320}
          height={180}
          className="w-full h-44 object-cover"
          priority
        />
      </a>
      <div className="p-4">
        {/* 動画タイトル */}
        <h3 className="text-lg font-semibold text-indigo-700 mb-1 truncate">
          {video.title}
        </h3>
        {/* チャンネル名 */}
        <p className="text-sm text-gray-500 mb-1">{video.channelTitle}</p>
        {/* 公開日・長さ・再生数（日本語表記） */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-2">
          <span>
            公開日: {new Date(video.publishedAt).toLocaleDateString("ja-JP")}
          </span>
          <span>長さ: {formatDuration(video.duration)}</span>
          <span>再生数: {video.viewCount.toLocaleString()}回</span>
        </div>
      </div>
    </div>
  );
}

// ISO8601形式のduration（例: PT5M12S）を「5:12」形式に変換
function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "-";
  const [, h, m, s] = match;
  const hours = h ? Number(h) : 0;
  const minutes = m ? Number(m) : 0;
  const seconds = s ? Number(s) : 0;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
