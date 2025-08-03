// 動画リストUIコンポーネント
// YoutubeVideo型の配列をpropsで受け取り、各動画をリスト表示
// まずはタイトル・サムネイル・チャンネル名のみ表示

import { YoutubeVideo } from "../../types/youtube";
import VideoItem from "./VideoItem";

interface VideoListProps {
  videos: YoutubeVideo[]; // 表示する動画データ配列
}

export default function VideoList({ videos }: VideoListProps) {
  // 動画データが空の場合はメッセージ表示
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">動画がありません。</div>
    );
  }

  // 画面幅に応じて1〜4列で表示
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <li key={video.videoId}>
          {/* 動画1件表示部分をVideoItemコンポーネントに分割 */}
          <VideoItem video={video} />
        </li>
      ))}
    </ul>
  );
}
