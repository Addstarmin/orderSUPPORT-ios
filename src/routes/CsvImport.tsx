import { useNavigate } from "react-router-dom";
import { useAppStore } from "../state/appStore";
import { useMemo, useRef, useState } from "react";
import { parseCsvFile } from "../features/csv/parseCsv";
import { buildOrdersFromCsv } from "../features/csv/toOrders";

export default function CsvImport() {
  const navigate = useNavigate();
  const { actions } = useAppStore();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [selectedName, setSelectedName] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>("");

  const isDone = useMemo(() => {
    return !!selectedName && message.includes("✅");
  }, [selectedName, message]);

  const onPick = async (file: File) => {
    setBusy(true);
    setMessage("読み込み中…");

    try {
      const rows = await parseCsvFile(file);
      const orders = buildOrdersFromCsv(rows);

      actions.setOrders({ fileName: file.name, orders });

      setSelectedName(file.name);
      setMessage("読み込みました ✅");
    } catch (e) {
      console.error(e);
      setMessage("読み込みに失敗しました（CSV形式/文字コードを確認）");
      setSelectedName("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#f1f5f9" }}>
      {/* ヘッダー */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            left: 12,
            top: 10,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#2563eb",
            fontSize: 22,
            fontWeight: 900,
            lineHeight: 1,
          }}
          aria-label="戻る"
        >
          ←
        </button>

        <div style={{ fontWeight: 900, fontSize: 16 }}>CSV読み込み</div>
      </div>

      <div style={{ padding: 18, maxWidth: 520, margin: "0 auto" }}>
        <div style={{ marginTop: 26, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>CSVファイルを選択</div>
        </div>

        {/* 隠しinput */}
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          disabled={busy}
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            onPick(f);
          }}
        />

        {/* 大きいアップロードカード */}
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            style={{
              width: 240,
              height: 210,
              borderRadius: 18,
              border: "3px solid #dbeafe",
              background: busy ? "#60a5fa" : "#1d4ed8",
              color: "#fff",
              cursor: busy ? "not-allowed" : "pointer",
              boxShadow: "0 10px 22px rgba(15,23,42,0.10)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* 外側の白縁っぽい表現 */}
            <div
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: 16,
                border: "2px solid rgba(255,255,255,0.65)",
                pointerEvents: "none",
              }}
            />
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <div style={{ fontSize: 54, lineHeight: 1 }}>☁️⬆️</div>
              <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 0.5 }}>
                {busy ? "読み込み中…" : "CSVを選ぶ"}
              </div>
            </div>
          </button>
        </div>

        {/* メッセージ（画像の緑バッジ風） */}
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
          {message ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 999,
                fontWeight: 900,
                fontSize: 14,
                border: message.includes("✅") ? "1px solid #86efac" : "1px solid #e2e8f0",
                background: message.includes("✅") ? "#ecfdf5" : "#fff",
                color: message.includes("✅") ? "#166534" : "#475569",
                maxWidth: "100%",
              }}
            >
              <span>{message}</span>
              {selectedName ? (
                <span style={{ fontWeight: 800, color: "#64748b", fontSize: 12 }}>
                  （{selectedName}）
                </span>
              ) : null}
            </div>
          ) : (
            <div style={{ height: 44 }} />
          )}
        </div>

        {/* 入力完了ボタン */}
        <div style={{ marginTop: 18 }}>
          <button
            type="button"
            disabled={!isDone || busy}
            onClick={() => {
              actions.setCsvDone(true);
              navigate("/");
            }}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 14,
              border: "none",
              background: isDone && !busy ? "#2563eb" : "#94a3b8",
              color: "#fff",
              fontWeight: 900,
              fontSize: 16,
              boxShadow: isDone && !busy ? "0 10px 18px rgba(37,99,235,0.18)" : "none",
              cursor: isDone && !busy ? "pointer" : "not-allowed",
            }}
          >
            入力完了
          </button>
        </div>

        {/* 下の余白（スマホでボタンがギリギリにならないように） */}
        <div style={{ height: 18 }} />
      </div>
    </div>
  );
}
