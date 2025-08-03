// ローディングUIコンポーネント（中央配置・スピナー付き）
// よくあるUI例：CSSアニメーションでスピナー表示＋テキスト

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "40vh",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: "6px solid #eee",
          borderTop: "6px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ marginTop: 16, fontSize: "1.1rem", color: "#555" }}>
        読み込み中...
      </div>
    </div>
  );
}
