import type { Achievement } from "../../types/achievement";

// 達成カレンダーUIコンポーネント
// layouts/image.html のデザインを参考に、月ごとの達成日を色分け表示
// props:
//   month: 表示する年月（"2025-08"）
//   records: 達成履歴（Achievement[]）
//   onPrevMonth/onNextMonth: 月切替ボタンのコールバック

type Props = {
  month: string; // 表示する年月（"2025-08"）
  records: Achievement[]; // 達成履歴（DBから取得したもの）
  recordsPrevMonth?: Achievement[]; // 前月の達成履歴
  recordsNextMonth?: Achievement[]; // 翌月の達成履歴
  onPrevMonth?: () => void; // 前月ボタン押下時の処理
  onNextMonth?: () => void; // 翌月ボタン押下時の処理
};

// 曜日ラベル
const WEEK_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

// 指定年月の月の日数を取得
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// 今日かどうか判定
function isToday(year: number, month: number, day: number) {
  const now = new Date();
  return (
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === day
  );
}

export default function AchievementCalendar({
  month,
  records,
  recordsPrevMonth = [],
  recordsNextMonth = [],
  onPrevMonth,
  onNextMonth,
}: Props) {
  // 年・月を数値で取得
  const [year, monthNum] = month.split("-").map(Number);
  // 月の日数
  const daysInMonth = getDaysInMonth(year, monthNum - 1);

  // 達成日（YYYY-MM-DD形式）をSetで管理（高速判定用）
  const achievedSet = new Set(records.map((r) => r.date));

  // 月初の曜日（0:日曜〜6:土曜）
  const firstDay = new Date(year, monthNum - 1, 1).getDay();

  // 日セル配列（カレンダーのマス目）
  const dayCells = [];
  // 月初まで空セルを追加（前月末日を灰色で表示）
  const prevMonthNum = monthNum - 1 === 0 ? 12 : monthNum - 1;
  const prevMonthYear = monthNum - 1 === 0 ? year - 1 : year;
  const prevMonthLastDay = getDaysInMonth(prevMonthYear, prevMonthNum - 1);
  for (let i = 0; i < firstDay; i++) {
    // 前月末日の日付（例: 27, 28, ...）
    const day = prevMonthLastDay - firstDay + 1 + i;
    // 前月末日の日付文字列（YYYY-MM-DD）
    const prevDateStr = `${prevMonthYear}-${String(prevMonthNum).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const prevAchieved = recordsPrevMonth.some((r) => r.date === prevDateStr);
    dayCells.push(
      <div
        key={`empty-${i}`}
        className={`w-10 h-10 border border-gray-200 flex items-center justify-center text-sm font-medium ${
          prevAchieved ? "bg-blue-400 text-white" : "bg-gray-100 text-gray-400"
        }`}
        style={{ borderRadius: "0.5rem" }}
      >
        {day}
      </div>
    );
  }
  // 各日付セルを生成
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;
    const achieved = achievedSet.has(dateStr);
    const today = isToday(year, monthNum - 1, d);
    dayCells.push(
      <div
        key={d}
        className={`w-10 h-10 flex items-center justify-center border border-gray-200 text-sm font-medium
          ${achieved ? "bg-blue-400 text-white" : "bg-white"}
          ${today ? "border-2 border-red-500" : ""}
        `}
        style={{ borderRadius: "0.5rem" }}
      >
        {d}
      </div>
    );
  }
  // 月末の空欄セル（翌月初日を灰色で表示）
  const lastDayOfWeek = new Date(year, monthNum - 1, daysInMonth).getDay();
  const endEmptyCount = 6 - lastDayOfWeek;
  for (let i = 0; i < endEmptyCount; i++) {
    // 翌月初日の日付文字列（YYYY-MM-DD）
    const nextMonthNum = monthNum + 1 > 12 ? 1 : monthNum + 1;
    const nextMonthYear = monthNum + 1 > 12 ? year + 1 : year;
    const nextDay = i + 1;
    const nextDateStr = `${nextMonthYear}-${String(nextMonthNum).padStart(
      2,
      "0"
    )}-${String(nextDay).padStart(2, "0")}`;
    const nextAchieved = recordsNextMonth.some((r) => r.date === nextDateStr);
    dayCells.push(
      <div
        key={`end-empty-${i}`}
        className={`w-10 h-10 border border-gray-200 flex items-center justify-center text-sm font-medium ${
          nextAchieved ? "bg-blue-400 text-white" : "bg-gray-100 text-gray-400"
        }`}
        style={{ borderRadius: "0.5rem" }}
      >
        {nextDay}
      </div>
    );
  }

  // カレンダーUI本体
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      {/* ヘッダー: 月表示・切替ボタン */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onPrevMonth}
          className="px-2 py-1 rounded hover:bg-gray-200"
        >
          &lt;
        </button>
        <h2 className="text-lg font-bold">
          {year}年{monthNum}月
        </h2>
        <button
          onClick={onNextMonth}
          className="px-2 py-1 rounded hover:bg-gray-200"
        >
          &gt;
        </button>
      </div>
      {/* 曜日ラベル＋日セルグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {WEEK_LABELS.map((w) => (
          <span
            key={w}
            className="w-10 h-10 flex items-center justify-center text-xs font-bold text-gray-500"
          >
            {w}
          </span>
        ))}
        {dayCells}
      </div>
    </div>
  );
}
