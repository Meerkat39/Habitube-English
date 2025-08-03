// エラー表示UIコンポーネント
// エラーメッセージをpropsで受け取り、赤色で表示

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div style={{ color: "red", textAlign: "center", margin: "2rem 0" }}>
      {message}
    </div>
  );
}
