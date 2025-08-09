import type { AchievementListResponse } from "../types/achievement";

/**
 * Achievement履歴取得API
 * @param month YYYY-MM 形式の月
 * @returns AchievementListResponse
 */
export async function fetchAchievementList(
  month: string
): Promise<AchievementListResponse> {
  const res = await fetch(`/api/achievement?month=${month}`);
  if (!res.ok) throw new Error("履歴データの取得に失敗しました");
  return await res.json();
}
