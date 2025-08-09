import { useState } from "react";

/**
 * 達成ボタンコンポーネント
 * props:
 *   isAchieved: 今日達成済みかどうか（true/false）
 *   onAchieve: 達成ボタン押下時の処理（async関数）
 */
interface AchievementButtonProps {
  isAchieved: boolean; // 今日達成済みかどうか
  onAchieve: () => Promise<void>; // 達成ボタン押下時の処理（API連携など）
}

/**
 * 今日の達成ボタンを表示し、押下時に記録処理を実行する
 * - isAchieved: trueなら「今日達成済み！」表示＆ボタン非活性
 * - loading: 記録中は「記録中...」表示＆ボタン非活性
 * - error: 記録失敗時は赤字でエラー表示
 */
export default function AchievementButton({
  isAchieved,
  onAchieve,
}: AchievementButtonProps) {
  // --- 状態管理 ---
  const [loading, setLoading] = useState(false); // 記録中かどうか
  const [error, setError] = useState(""); // エラーメッセージ

  // --- ボタン押下時の処理 ---
  // - 記録中はボタン非活性
  // - onAchieve()（API連携など）を実行
  // - 失敗時はエラーメッセージ表示
  const handleClick = async () => {
    setLoading(true);
    setError("");
    try {
      await onAchieve();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message || "記録に失敗しました");
      } else {
        setError("記録に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- UI描画 ---
  return (
    <div className="flex flex-col items-center mb-4">
      {/* 達成ボタン本体 */}
      <button
        className={`px-4 py-2 rounded font-bold text-white bg-green-500 hover:bg-green-600 transition disabled:bg-gray-300 disabled:text-gray-500`}
        onClick={handleClick}
        disabled={isAchieved || loading}
      >
        {/* ボタン表示内容を状態に応じて切り替え */}
        {isAchieved ? "今日達成済み！" : loading ? "記録中..." : "今日の達成"}
      </button>

      {/* エラー時は赤字で表示 */}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
