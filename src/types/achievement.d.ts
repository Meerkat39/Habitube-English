// Achievement記録API用型定義

export interface Achievement {
  id: number;
  userId: number;
  date: string; // "YYYY-MM-DD"
  createdAt: string; // ISO文字列
}

// GET /api/achievement?month=YYYY-MM のレスポンス型
export type AchievementListResponse = Achievement[];

// POST /api/achievement のリクエスト型
export interface AchievementPostRequest {
  date: string; // "YYYY-MM-DD"
}

// POST /api/achievement のレスポンス型
export type AchievementPostResponse = Achievement;
