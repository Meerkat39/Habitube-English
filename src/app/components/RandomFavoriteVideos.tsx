import type { YoutubeVideo } from "@/types/youtube";
import { useEffect, useState } from "react";
import VideoItem from "./VideoItem";

/**
 * お気に入りチャンネルからランダム8件動画表示コンポーネント
 */
export default function RandomFavoriteVideos() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/random-favorite-videos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch(() => {
        setError("動画の取得に失敗しました");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>動画取得中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <li key={video.videoId}>
          <VideoItem video={video} />
        </li>
      ))}
    </ul>
  );
}
