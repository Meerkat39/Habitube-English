import { MdSettings } from "react-icons/md";
/**
 * ヘッダーコンポーネント
 * - タイトル中央表示
 * - 右端に「設定」ボタン（アイコンorテキスト）
 * - 設定ボタン押下でお気に入りチャンネル管理UIを開く（onSettingsClickで親から制御）
 */
export default function Header({
  onSettingsClick,
}: {
  onSettingsClick: () => void;
}) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="text-xl font-bold text-blue-700 tracking-wide">
        Habitube English
      </div>
      <button
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
        onClick={onSettingsClick}
        aria-label="設定"
      >
        <MdSettings size={24} />
      </button>
    </header>
  );
}
