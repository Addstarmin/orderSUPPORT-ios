// src/routes/StockInput.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../state/appStore";
import { ITEMS } from "../domain/items";
import type { Section } from "../domain/items";
import { useMemo, useState } from "react";

export default function StockInput() {
  const navigate = useNavigate();
  const { state, actions } = useAppStore();

  // ✅ 在庫入力に出さないID（表示・印刷・発注用の内部ID）
  const EXCLUDED_STOCK_IDS = useMemo(() => {
    return new Set<string>([
      "sponge_60",
      "sponge_36",
      "sponge_49",
      "sponge_144",
      "rusk", // 念のため（items.tsから消えてる想定）
    ]);
  }, []);

  const inputItems = useMemo(() => {
    return ITEMS.filter((it) => !EXCLUDED_STOCK_IDS.has(it.id));
  }, [EXCLUDED_STOCK_IDS]);

  const baseStock = useMemo(() => {
    const d: Record<string, number> = {};
    for (const item of inputItems) d[item.id] = 0;
    return d;
  }, [inputItems]);

  const [stock, setStock] = useState<Record<string, number>>({
    ...baseStock,
    ...(state.stock || {}),
  });

  const updateValue = (id: string, value: number) => {
    if (!Number.isFinite(value)) value = 0;
    if (value < 0) value = 0;
    setStock((prev) => ({ ...prev, [id]: value }));
  };

  const sections: Section[] = ["冷蔵庫", "常温", "冷凍庫", "ストッカー"];

  return (
    <div style={{ padding: 18, maxWidth: 520, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>在庫入力</h2>

        <button
          type="button"
          onClick={() => {
            actions.setStock(stock);
            actions.setStockDone(true);
            navigate("/");
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 900,
          }}
        >
          入力完了
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {sections.map((section) => {
          const itemsInSection = inputItems.filter((i) => i.section === section);
          if (itemsInSection.length === 0) return null;

          return (
            <div key={section} style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>{section}</h3>

              {itemsInSection.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #cbd5e1",
                    marginBottom: 8,
                    background: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{item.name}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button type="button" onClick={() => updateValue(item.id, (stock[item.id] ?? 0) - 1)} style={btnStyle}>
                      −
                    </button>

                    <input
                      type="number"
                      inputMode="numeric"
                      value={stock[item.id] ?? 0}
                      onChange={(e) => {
                        const v = e.target.value === "" ? 0 : Number(e.target.value);
                        updateValue(item.id, Number.isFinite(v) ? v : 0);
                      }}
                      style={{
                        width: 70,
                        textAlign: "center",
                        padding: 8,
                        borderRadius: 10,
                        border: "1px solid #cbd5e1",
                        fontWeight: 900,
                        fontSize: 16,
                      }}
                    />

                    <button type="button" onClick={() => updateValue(item.id, (stock[item.id] ?? 0) + 1)} style={btnStyle}>
                      ＋
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 900,
  fontSize: 18,
};
