import { useNavigate } from "react-router-dom";
import { useAppStore } from "../state/appStore";

function StepCard(props: {
  step: number;
  title: string;
  desc?: string;
  done: boolean;
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  const { step, title, desc, done, disabled, active, onClick } = props;

  const opacity = disabled ? 0.45 : 1;
  const cursor = disabled ? "not-allowed" : "pointer";

  const border = active ? "2px solid #2563eb" : "1px solid #e2e8f0";
  const boxShadow = active ? "0 0 0 3px rgba(37,99,235,0.12)" : "none";

  const badgeBg = done ? "#16a34a" : "#e2e8f0";
  const badgeColor = done ? "#ffffff" : "#334155";
  const badgeText = done ? "完了" : "未完了";

  const stepBg = done ? "#16a34a" : active ? "#2563eb" : "#cbd5e1";
  const stepColor = "#ffffff";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        textAlign: "left",
        background: "#fff",
        border,
        borderRadius: 16,
        padding: 16,
        marginTop: 14,
        opacity,
        cursor,
        boxShadow,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: stepBg,
              color: stepColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 14,
              flex: "0 0 auto",
            }}
          >
            {step}
          </div>

          <div style={{ fontSize: 18, fontWeight: 900, color: disabled ? "#64748b" : "#0f172a" }}>
            {title}
          </div>
        </div>

        <div
          style={{
            background: badgeBg,
            color: badgeColor,
            padding: "8px 12px",
            borderRadius: 999,
            fontWeight: 900,
            fontSize: 12,
            minWidth: 64,
            textAlign: "center",
            flex: "0 0 auto",
          }}
        >
          {done ? "✅ " : ""}
          {badgeText}
        </div>
      </div>

      {desc ? (
        <div style={{ marginTop: 10, color: disabled ? "#94a3b8" : "#334155", fontSize: 13, lineHeight: 1.5 }}>
          {desc}
        </div>
      ) : null}

      {active ? (
        <div
          style={{
            marginTop: 12,
            background: "#eff6ff",
            border: "1px solid #dbeafe",
            borderRadius: 12,
            padding: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#1d4ed8",
            fontWeight: 900,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 900,
              color: "#1d4ed8",
              flex: "0 0 auto",
            }}
          >
            i
          </div>
          <div style={{ fontSize: 13 }}>「発送予定一覧.csv」を選択</div>
        </div>
      ) : null}
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { state, actions } = useAppStore();

  const canGoStock = !!state.csvDone;
  const canGoExport = !!state.csvDone && !!state.stockDone;

  // 画像のUIっぽく「今やるべきステップ」を青枠にする
  const activeStep = !state.csvDone ? 1 : !state.stockDone ? 2 : 3;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#f1f5f9",
      }}
    >
      {/* 上部ヘッダー（画像の「ホーム画面」っぽいバー） */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "14px 18px",
          textAlign: "center",
          fontWeight: 900,
          fontSize: 16,
        }}
      >
        ホーム画面
      </div>

      <div style={{ padding: 18, maxWidth: 520, margin: "0 auto" }}>
        <StepCard
          step={1}
          title="CSVを読み込む"
          desc="CSVを選択して読み込みます"
          done={!!state.csvDone}
          active={activeStep === 1}
          onClick={() => navigate("/csv")}
        />

        <StepCard
          step={2}
          title="現在の在庫を入力"
          desc="前の手順を完了させてください"
          done={!!state.stockDone}
          disabled={!canGoStock}
          active={activeStep === 2 && canGoStock}
          onClick={() => navigate("/stock")}
        />

        <StepCard
          step={3}
          title="発注書を出力する"
          desc="前の手順を完了させてください"
          done={!!state.exportDoneAt}
          disabled={!canGoExport}
          active={activeStep === 3 && canGoExport}
          onClick={() => navigate("/export")}
        />

        <div style={{ marginTop: 14 }}>
          <button
            type="button"
            onClick={() => actions.resetAll()}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              fontWeight: 900,
              color: "#334155",
            }}
          >
            すべてリセット
          </button>
        </div>

        <div
          style={{
            marginTop: 18,
            textAlign: "center",
            color: "#94a3b8",
            fontWeight: 800,
            fontSize: 12,
            paddingBottom: 18,
          }}
        >
          
        </div>
      </div>
    </div>
  );
}

