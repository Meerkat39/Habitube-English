import { fetchWatchedVideoList } from "../watchedVideoApi";

// fetchのグローバルモック（型安全に拡張）
// テスト内でAPI通信を実際に行わず、任意の値を返すようにするための仕組み
const globalWithFetch = global as typeof global & { fetch: jest.Mock };

describe("fetchWatchedVideoList", () => {
  // 各テスト前にfetchをモック（偽物の関数）に置き換える
  beforeEach(() => {
    globalWithFetch.fetch = jest.fn();
  });

  it("正常に履歴データを取得できる", async () => {
    // モック: APIが正常にデータを返す場合の挙動を再現
    const mockData = [
      { id: 1, videoId: "abc", watchedAt: "2025-08-01T00:00:00Z" },
    ];
    globalWithFetch.fetch.mockResolvedValue({
      ok: true, // fetchの返り値が正常
      json: async () => mockData, // .json()でmockDataを返す
    });
    // 関数を呼び出し、mockDataが返ることを検証
    const result = await fetchWatchedVideoList("2025-08");
    expect(result).toEqual(mockData);
  });

  it("API失敗時はエラーをthrowする", async () => {
    // モック: APIが失敗（ok: false）した場合の挙動を再現
    globalWithFetch.fetch.mockResolvedValue({ ok: false });
    // 関数を呼び出し、エラーがthrowされることを検証
    await expect(fetchWatchedVideoList("2025-08")).rejects.toThrow(
      "Failed to fetch watched video list"
    );
  });
});
