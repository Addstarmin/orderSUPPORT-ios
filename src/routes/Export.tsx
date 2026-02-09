// src/routes/Export.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../state/appStore";
import { ITEMS } from "../domain/items";
import { MAPPING } from "../domain/mapping";
import { printOrderSheet } from "../features/export/printOrderSheet";

function buildNoteMap(): Record<string, string | undefined> {
  const m: Record<string, string | undefined> = {};
  for (const r of MAPPING) {
    if (r.note) m[r.itemId] = r.note;
  }
  return m;
}

function safeNum(x: unknown): number {
  return typeof x === "number" && Number.isFinite(x) ? x : 0;
}

export default function ExportPage() {
  const navigate = useNavigate();
  const { state, actions } = useAppStore();

  const noteMap = buildNoteMap();

  const onPrint = () => {
    actions.markExportDoneNow();

    const getStock = (id: string) => safeNum(state.stock?.[id]);
    const getOrder = (id: string) => safeNum(state.orders?.[id]);

    // ✅ 在庫：表示換算が必要なのはスポンジ系だけ（ラスクはここで×48しない）
    // ラスクは buildPrintHtml.ts の ruskSplitCell が「表示だけ×48」を担当する
    const displayStock = (id: string, raw: number) => {
      if (id === "sponge_raw") return raw * 6;
      if (id === "sponge_done") return raw * 36;
      return raw;
    };

    // ✅ 発注：一切換算しない（袋数/数量のまま）
    const displayOrder = (_id: string, raw: number) => {
      return raw;
    };

    const payload = {
      title: "もちミックス",
      dateLabel: "",
      items: ITEMS.map((it) => {
        const st = getStock(it.id);
        const od = getOrder(it.id);

        return {
          id: it.id,
          label: it.name,
          targetLabel: it.targetLabel,
          stock: displayStock(it.id, st),
          order: displayOrder(it.id, od),
          note: noteMap[it.id],
        };
      }),
    };

    printOrderSheet(payload);
  };

  return (
    <div style={{ padding: 18, maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>出力</h2>

      <div
        style={{
          border: "1px solid #cbd5e1",
          borderRadius: 12,
          padding: 12,
          height: 260,
          overflow: "auto",
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 10 }}>プレビュー（黒=在庫 / 赤=発注）</div>

        {ITEMS.map((it) => (
          <div
            key={it.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 70px 70px",
              gap: 10,
              padding: "8px 0",
              borderBottom: "1px dashed #e2e8f0",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 800 }}>{it.name}</div>
            <div style={{ textAlign: "right", fontWeight: 900 }}>{safeNum(state.stock?.[it.id])}</div>
            <div style={{ textAlign: "right", fontWeight: 900, color: "#e11d48" }}>{safeNum(state.orders?.[it.id])}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <button
          type="button"
          onClick={onPrint}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            background: "#16a34a",
            color: "#fff",
            fontWeight: 900,
            fontSize: 16,
          }}
        >
          PDF（印刷）を開く
        </button>

        <button
          type="button"
          onClick={() => alert("Excel出力は次（xlsx生成）で実装")}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 900,
            fontSize: 16,
          }}
        >
          Excelをダウンロード
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #cbd5e1",
            background: "#fff",
            fontWeight: 900,
          }}
        >
          ホームへ戻る
        </button>
      </div>
    </div>
  );
}
