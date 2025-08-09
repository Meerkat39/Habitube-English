import { useEffect, useState } from "react";
import { fetchAchievementList } from "../../lib/achievementApi";
import type { AchievementListResponse } from "../../types/achievement";

/**
 * 指定月の達成記録一覧を取得するカスタムフック
 * 使い方: AchievementCalendar等のUIで呼び出し、
 *   - data: 取得した達成履歴データ（nullなら未取得）
 *   - loading: 取得中true（スピナー等表示に利用）
 *   - error: 失敗時のエラーメッセージ（UI表示に利用）
 * API呼び出し・状態管理を一括で扱える
 */
export function useAchievementList(month: string) {
  // data: 取得した達成履歴データ（初期値null）
  const [data, setData] = useState<AchievementListResponse | null>(null);
  // loading: API取得中true
  const [loading, setLoading] = useState(false);
  // error: 失敗時のエラーメッセージ
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchAchievementList(month)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [month]);

  return { data, loading, error };
}
