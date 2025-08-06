import { useEffect, useState } from "react";
import { fetchWatchedVideoList } from "../../lib/watchedVideoApi";
import type { WatchedVideoListResponse } from "../../types/watchedVideo";

/**
 * 指定月の視聴記録一覧を取得するカスタムフック
 * 使い方: AchievementCalendar等のUIで呼び出し、
 *   - data: 取得した履歴データ（nullなら未取得）
 *   - loading: 取得中true（スピナー等表示に利用）
 *   - error: 失敗時のエラーメッセージ（UI表示に利用）
 * API呼び出し・状態管理を一括で扱える
 */
export function useWatchedVideoList(month: string) {
  // data: 取得した履歴データ（初期値null）
  const [data, setData] = useState<WatchedVideoListResponse | null>(null);
  // loading: API取得中true
  const [loading, setLoading] = useState(false);
  // error: 失敗時のエラーメッセージ
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // monthが変わるたびにAPI取得開始
    setLoading(true); // ローディング開始
    setError(null); // エラー初期化
    fetchWatchedVideoList(month)
      .then(setData) // 成功時: dataにセット
      .catch((e) => setError(e.message)) // 失敗時: errorにセット
      .finally(() => setLoading(false)); // 完了時: ローディング終了
  }, [month]);

  // UI側で { data, loading, error } を利用
  return { data, loading, error };
}
