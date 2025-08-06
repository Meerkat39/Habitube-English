"use client";
// ホーム画面（動画リスト表示）
// YouTube APIから動画データを取得し、VideoListコンポーネントで表示
// MVP用：ローディング・エラー処理は最低限

import AchievementCalendar from "./components/AchievementCalendar";
import { useWatchedVideoList } from "./hooks/useWatchedVideoList";

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
  // 表示月（YYYY-MM）を状態管理
  const [month, setMonth] = useState("2025-08");
  // 履歴データ（APIから取得）
  const {
    data: watchedRecords,
    loading: recordsLoading,
    error: recordsError,
  } = useWatchedVideoList(month);

  // 月切替コールバック
  const handlePrevMonth = () => {
    const [y, m] = month.split("-").map(Number);
    const prev = new Date(y, m - 2, 1); // 前月
    setMonth(
      `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`
    );
  };
  const handleNextMonth = () => {
    const [y, m] = month.split("-").map(Number);
    const next = new Date(y, m, 1); // 翌月
    setMonth(
      `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`
    );
  };

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
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8 tracking-wide drop-shadow-lg">
        Habitube English
      </h1>
      {/* 履歴取得エラー時はカレンダーUIを非表示にし、エラーメッセージのみ表示 */}
      {recordsError ? (
        <div className="text-center text-red-500 my-4 flex items-center justify-center gap-2">
          <span aria-label="error" role="img">
            ❌
          </span>
          {recordsError}
        </div>
      ) : (
        <AchievementCalendar
          month={month}
          records={watchedRecords ?? []}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      )}
      {/* 履歴データ取得中表示 */}
      {recordsLoading && (
        <div className="text-center text-gray-500 my-2">
          履歴データ取得中...
        </div>
      )}
      <VideoList videos={videos} />
    </main>
  );
}
