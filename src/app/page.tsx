"use client";
// ホーム画面（動画リスト表示）
// YouTube APIから動画データを取得し、VideoListコンポーネントで表示
// MVP用：ローディング・エラー処理は最低限

// ホーム画面（動画リスト表示）
// - YouTube APIから動画データを取得し、VideoListコンポーネントで一覧表示
// - MVP用：ローディング・エラー処理は最低限
// - 今後UI/UX強化・デザイン調整予定

import { useEffect, useState } from "react";
import { parseYoutubeApiResponse } from "../lib/youtube";
import { YoutubeVideo } from "../types/youtube";
import ErrorMessage from "./components/ErrorMessage";
import Loading from "./components/Loading";
import VideoList from "./components/VideoList";

export default function Home() {
  // 動画リストデータ
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  // ローディング状態
  const [loading, setLoading] = useState(true);
  // エラー内容
  const [error, setError] = useState("");

  useEffect(() => {
    // YouTube API Route（/api/youtube）から動画データを取得
    // - 成功時: parseYoutubeApiResponseで型整形し、videosにセット
    // - 失敗時: エラーメッセージ表示
    fetch("/api/youtube")
      .then((res) => res.json())
      .then((data) => {
        setVideos(parseYoutubeApiResponse(data));
        setLoading(false);
      })
      .catch(() => {
        setError("動画データの取得に失敗しました。");
        setLoading(false);
      });
  }, []);

  // ローディング中はLoadingコンポーネント表示
  if (loading) return <Loading />;
  // エラー時はErrorMessageコンポーネント表示
  if (error) return <ErrorMessage message={error} />;

  // 動画リスト表示（VideoListコンポーネントにデータ渡す）
  return (
    <main style={{ padding: "2rem" }}>
      <VideoList videos={videos} />
    </main>
  );
}
