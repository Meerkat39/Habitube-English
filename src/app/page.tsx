"use client";
// ホーム画面（動画リスト表示）
// YouTube APIから動画データを取得し、VideoListコンポーネントで表示
// MVP用：ローディング・エラー処理は最低限

import AchievementButton from "./components/AchievementButton";
import AchievementCalendar from "./components/AchievementCalendar";
import { useAchievementList } from "./hooks/useAchievementList";

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
  // --- 動画リスト・画面状態管理 ---
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState("2025-08");

  // --- 達成履歴データ（APIから取得） ---
  const {
    data: achievementRecords,
    loading: recordsLoading,
    error: recordsError,
  } = useAchievementList(month);

  // --- 今日の日付（YYYY-MM-DD） ---
  const todayStr = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
  })();

  // --- 今日の達成済み判定 ---
  // achievementRecords（今月の達成履歴）の中に、今日の日付（todayStr）と一致する記録が1つでもあれば true
  // 例: r.date = "2025-08-08" → todayStr = "2025-08-08"
  // つまり「今日達成済みなら true、未達成なら false」
  const isTodayAchieved = achievementRecords?.some((r) => r.date === todayStr);

  // 達成ボタン押下時の処理（API連携）
  const handleAchieveToday = async () => {
    try {
      const res = await fetch("/api/achievement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: todayStr }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "達成記録の登録に失敗しました");
        return;
      }
      // 登録成功時は履歴データを再取得（useWatchedVideoListのリフレッシュ）
      // → 今の実装では自動反映されない場合、月を一度setし直すことで再取得可能
      setMonth((prev) => prev); // ダミーでsetMonth呼び出し（useWatchedVideoList再実行）
    } catch (e) {
      console.error("達成記録の登録に失敗:", e);
      alert("通信エラーが発生しました");
    }
  };

  // --- 月切替コールバック ---
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

  // --- 画面描画・UI ---

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

      {/* 今日の達成ボタンUI（コンポーネント化） */}
      <AchievementButton
        isAchieved={!!isTodayAchieved}
        onAchieve={handleAchieveToday}
      />

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
          records={achievementRecords ?? []}
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
