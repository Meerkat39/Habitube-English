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

  // APIから動画取得する関数
  const fetchVideos = () => {
    setLoading(true);
    setError(null);
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
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          disabled={loading}
          onClick={fetchVideos}
        >
          {loading ? "取得中..." : "もう一度ランダム表示"}
        </button>
      </div>
      {loading && <div>動画取得中...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <li key={video.videoId}>
            <VideoItem video={video} />
          </li>
        ))}
      </ul>
    </div>
  );
}
