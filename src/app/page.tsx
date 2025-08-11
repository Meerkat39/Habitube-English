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

import { useState } from "react";
import Header from "./components/Header";
// import RandomFavoriteVideos from "./components/RandomFavoriteVideos";

export default function Home() {
  // お気に入りチャンネル管理UIの表示状態
  const [showSettings, setShowSettings] = useState(false);
  // 前月・翌月の年月（YYYY-MM）を算出
  const getPrevMonth = (month: string) => {
    const [y, m] = month.split("-").map(Number);
    const prev = new Date(y, m - 2, 1);
    return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };
  const getNextMonth = (month: string) => {
    const [y, m] = month.split("-").map(Number);
    const next = new Date(y, m, 1);
    return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  // --- 画面状態管理 ---
  const [month, setMonth] = useState("2025-08");

  const prevMonth = getPrevMonth(month);
  const nextMonth = getNextMonth(month);

  // 前月・翌月の履歴も取得
  const { data: recordsPrevMonth } = useAchievementList(prevMonth);
  const { data: recordsNextMonth } = useAchievementList(nextMonth);

  // --- 達成履歴データ（APIから取得） ---
  const {
    data: achievementRecords,
    error: recordsError,
    refresh: refreshAchievementRecords,
  } = useAchievementList(month);

  // 今日の月（YYYY-MM）
  const todayMonth = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  })();

  // 今日の月の履歴データ（ボタン判定用）
  const { data: todayRecords, refresh: refreshTodayRecords } =
    useAchievementList(todayMonth);

  // --- 今日の日付（YYYY-MM-DD） ---
  const todayStr = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
  })();

  // --- 今日の達成済み判定 ---
  // 今日の月の履歴データに今日の日付が含まれていれば true
  const isTodayAchieved = todayRecords?.some((r) => r.date === todayStr);

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
      // 登録成功時は履歴データを即時再取得（今日分も再取得）
      refreshAchievementRecords();
      refreshTodayRecords();
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

  // --- 画面描画・UI ---
  return (
    <>
      <Header onSettingsClick={() => setShowSettings(true)} />
      <main style={{ padding: "2rem" }}>
        {/* 今日の達成ボタンUI（コンポーネント化） */}
        <AchievementButton
          isAchieved={!!isTodayAchieved}
          onAchieve={handleAchieveToday}
        />

        {/* カレンダー表示領域の高さを外側で固定 */}
        <div style={{ minHeight: "420px" }}>
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
              recordsPrevMonth={recordsPrevMonth ?? []}
              recordsNextMonth={recordsNextMonth ?? []}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          )}
        </div>

        {/* お気に入りチャンネル管理UI（モーダル表示） */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 min-w-[320px] relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 font-bold text-3xl w-10 h-10 flex items-center justify-center transition-colors duration-150"
                onClick={() => setShowSettings(false)}
                aria-label="閉じる"
                style={{ lineHeight: 1 }}
              >
                ×
              </button>
              {/* <FavoriteChannelManager /> */}
            </div>
          </div>
        )}

        {/* <RandomFavoriteVideos /> */}
      </main>
    </>
  );
}
