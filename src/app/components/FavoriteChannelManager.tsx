import { useEffect, useState } from "react";

// チャンネル情報型（チャンネル名も保持）
type Channel = {
  id: number;
  channelId: string;
};
type ChannelWithName = Channel & { channelName?: string };

export default function FavoriteChannelManager() {
  // チャンネル名も含めた一覧
  const [channels, setChannels] = useState<ChannelWithName[]>([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // チャンネルIDからチャンネル名を取得する関数
  const fetchChannelName = async (
    channelId: string
  ): Promise<string | undefined> => {
    try {
      const res = await fetch(
        `/api/youtube-channel-name?channelId=${channelId}`
      );
      const data = await res.json();
      return data.channelName;
    } catch {
      return undefined;
    }
  };

  // お気に入りチャンネル一覧をAPIから取得し、チャンネル名も取得
  useEffect(() => {
    fetch("/api/favorite-channels")
      .then((res) => res.json())
      .then(async (data: Channel[]) => {
        // 各チャンネルIDごとにチャンネル名を取得
        const withNames = await Promise.all(
          data.map(async (ch) => ({
            ...ch,
            channelName: await fetchChannelName(ch.channelId),
          }))
        );
        setChannels(withNames);
      });
  }, []);

  // 新しいチャンネルIDを追加（API連携＋チャンネル名取得）
  const handleAdd = async () => {
    if (!input) return;
    const res = await fetch("/api/favorite-channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: input }),
    });
    const newChannel: Channel = await res.json();
    // 追加したチャンネルIDからチャンネル名を取得
    const channelName = await fetchChannelName(newChannel.channelId);
    setChannels((prev) => [...prev, { ...newChannel, channelName }]);
    setInput("");
  };

  // 指定IDのチャンネルを削除（API連携）
  const handleDelete = async (id: number) => {
    await fetch(`/api/favorite-channels?id=${id}`, { method: "DELETE" });
    setChannels((prev) => prev.filter((ch) => ch.id !== id));
  };

  // 編集モード開始（対象ID・値をセット）
  const startEdit = (id: number, channelId: string) => {
    setEditId(id);
    setEditValue(channelId);
  };

  // 編集内容をAPIで保存＋チャンネル名再取得
  const handleEdit = async (id: number) => {
    const res = await fetch(`/api/favorite-channels?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: editValue }),
    });
    const updated: Channel = await res.json();
    // 編集後のチャンネルIDからチャンネル名を再取得
    const channelName = await fetchChannelName(updated.channelId);
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...updated, channelName } : ch))
    );
    setEditId(null);
    setEditValue("");
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-blue-700">
        お気に入りチャンネル管理
      </h2>
      {/* 追加フォーム */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="YouTubeチャンネルIDを入力"
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={handleAdd}
        >
          追加
        </button>
      </div>
      {/* チャンネル一覧表示 */}
      <ul className="space-y-2">
        {channels.map((ch) => (
          <li
            key={ch.id}
            className="flex items-center justify-between border-b pb-2"
          >
            {editId === ch.id ? (
              <>
                <input
                  type="text"
                  className="border rounded px-2 py-1 font-mono text-sm"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="text-blue-500 px-2 py-1 border rounded"
                    onClick={() => handleEdit(ch.id)}
                  >
                    保存
                  </button>
                  <button
                    className="text-gray-500 px-2 py-1 border rounded"
                    onClick={() => setEditId(null)}
                  >
                    キャンセル
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* チャンネル名のみ表示 */}
                <span className="text-gray-700 text-sm">
                  {ch.channelName ? ch.channelName : "(取得中...)"}
                </span>
                <div className="flex gap-2">
                  <button
                    className="text-gray-500 px-2 py-1 border rounded"
                    onClick={() => startEdit(ch.id, ch.channelId)}
                  >
                    編集
                  </button>
                  <button
                    className="text-red-500 px-2 py-1 border rounded"
                    onClick={() => handleDelete(ch.id)}
                  >
                    削除
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
