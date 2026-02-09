// src/features/export/buildPrintHtml.ts
import type { PrintPayload } from "./printOrderSheet";
import { PRINT_CSS } from "./buildPrintCss";

function esc(s: string) {
  return (s ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]!));
}

function numSafe(n: unknown): number {
  const x = typeof n === "number" && Number.isFinite(n) ? n : Number(n);
  return Number.isFinite(x) ? x : 0;
}

function cell(
  item?: { label: string; targetLabel: string; stock: number; order: number; note?: string },
  opts?: { blank?: boolean; hideOrder?: boolean }
) {
  const blank = !!opts?.blank;
  const hideOrder = !!opts?.hideOrder;

  const label = blank ? "&nbsp;" : esc(item?.label ?? "");
  const target = blank ? "&nbsp;" : esc(item?.targetLabel ?? "");
  const stockN = blank ? 0 : numSafe(item?.stock);
  const orderN = blank ? 0 : numSafe(item?.order);

  const warn = !blank && !hideOrder && orderN > stockN;

  return `
    <div class="cell ${blank ? "blank" : ""} ${warn ? "warn" : ""}">
      <div class="cell-name">${label}</div>
      <div class="cell-target">${target}</div>

      <div class="stock-area">
        <div class="stock-num">${blank ? "&nbsp;" : String(stockN)}</div>
      </div>

      <div class="mid-divider"></div>

      <div class="order-area ${hideOrder ? "order-hidden" : ""}">
        <div class="order-circle-wrap">
          <span class="order-circle">${blank ? "&nbsp;" : String(orderN)}</span>
        </div>
      </div>

      <div class="cell-note">${blank ? "&nbsp;" : (item?.note ? esc(item.note) : "&nbsp;")}</div>
    </div>
  `;
}

/** ✅ デニッシュラスク（5/10枚）縦分割セル */
function danishSplitCell(
  item5?: { label: string; targetLabel: string; stock: number; order: number; note?: string },
  item10?: { label: string; targetLabel: string; stock: number; order: number; note?: string }
) {
  const stock5N = numSafe(item5?.stock);
  const order5N = numSafe(item5?.order);
  const stock10N = numSafe(item10?.stock);
  const order10N = numSafe(item10?.order);

  const warn5 = order5N > stock5N;
  const warn10 = order10N > stock10N;

  const target5 = esc(item5?.targetLabel ?? "");
  const target10 = esc(item10?.targetLabel ?? "");

  return `
    <div class="cell split">
      <div class="cell-name">デニッシュラスク</div>

      <div class="split-area">
        <div class="split-half ${warn5 ? "warn" : ""}">
          <div class="split-head">
            <div class="split-tag">5枚</div>
            <div class="split-target">${target5}</div>
          </div>
          <div class="split-body">
            <div class="split-stock">
              <div class="split-num-black">${String(stock5N)}</div>
            </div>
            <div class="split-order">
              <div class="order-circle-wrap">
                <span class="order-circle">${String(order5N)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="split-divider"></div>

        <div class="split-half ${warn10 ? "warn" : ""}">
          <div class="split-head">
            <div class="split-tag">10枚</div>
            <div class="split-target">${target10}</div>
          </div>
          <div class="split-body">
            <div class="split-stock">
              <div class="split-num-black">${String(stock10N)}</div>
            </div>
            <div class="split-order">
              <div class="order-circle-wrap">
                <span class="order-circle">${String(order10N)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cell-note">&nbsp;</div>
    </div>
  `;
}

/**
 * ✅ ラスク：もし payload 側で誤って「48/96(枚数)」が入ってきても
 * 印刷は “袋数” を表示したい → 48の倍数なら袋数へ戻す
 */
function normalizeRuskPacks(rawOrder: number): number {
  const o = numSafe(rawOrder);
  if (o <= 0) return 0;

  // 48の倍数なら「枚数→袋数」
  if (o >= 48 && o % 48 === 0) return o / 48;

  // それ以外は袋数として扱う
  return o;
}

/**
 * ✅ ラスク（珈琲/プレーン）縦分割セル
 * - 在庫表示だけ ×48（PDF表示）
 * - 発注は「袋数」を表示（payloadが48/96でも補正）
 */
function ruskSplitCell(
  coffee?: { label: string; targetLabel: string; stock: number; order: number; note?: string },
  plain?: { label: string; targetLabel: string; stock: number; order: number; note?: string }
) {
  const stockCraw = numSafe(coffee?.stock);
  const stockPraw = numSafe(plain?.stock);

  const orderC = normalizeRuskPacks(numSafe(coffee?.order));
  const orderP = normalizeRuskPacks(numSafe(plain?.order));

  // ★表示だけ×48（在庫入力×48）
  const stockCdisp = stockCraw * 48;
  const stockPdisp = stockPraw * 48;

  const targetC = esc(coffee?.targetLabel ?? "換算×48（PDF表示）");
  const targetP = esc(plain?.targetLabel ?? "換算×48（PDF表示）");

  // 比較は“生の在庫（袋数入力）”で
  const warnC = orderC > stockCraw;
  const warnP = orderP > stockPraw;

  return `
    <div class="cell split">
      <div class="cell-name">ラスク</div>

      <div class="split-area">
        <div class="split-half ${warnC ? "warn" : ""}">
          <div class="split-head">
            <div class="split-tag">珈琲</div>
            <div class="split-target">${targetC}</div>
          </div>
          <div class="split-body">
            <div class="split-stock">
              <div class="split-num-black">${String(stockCdisp)}</div>
            </div>
            <div class="split-order">
              <div class="order-circle-wrap">
                <span class="order-circle">${String(orderC)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="split-divider"></div>

        <div class="split-half ${warnP ? "warn" : ""}">
          <div class="split-head">
            <div class="split-tag">プレーン</div>
            <div class="split-target">${targetP}</div>
          </div>
          <div class="split-body">
            <div class="split-stock">
              <div class="split-num-black">${String(stockPdisp)}</div>
            </div>
            <div class="split-order">
              <div class="order-circle-wrap">
                <span class="order-circle">${String(orderP)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cell-note">&nbsp;</div>
    </div>
  `;
}

/**
 * ✅ スポンジ表示用：もし payload 側で誤って「入数×数量（=個数）」が入ってきても、
 * ここでは “数量” を表示したい。
 */
function normalizeSpongeQty(rawOrder: number, unit: number): number {
  const o = numSafe(rawOrder);
  if (unit <= 0) return o;
  if (o <= 0) return 0;

  if (o >= unit && o % unit === 0) {
    const q = o / unit;
    if (q >= 1 && q <= 9999) return q;
  }
  return o;
}

/**
 * ✅ スポンジ（2列幅セル）
 * - 上：未加工/加工済（全幅）
 * - 下：発注（60/36/49/144 と 合計(個数)）
 */
function spongeWideCell(args: {
  stockRaw?: { stock: number };
  stockDone?: { stock: number };
  order60?: number;
  order36?: number;
  order49?: number;
  order144?: number;
}) {
  const raw = numSafe(args.stockRaw?.stock);
  const done = numSafe(args.stockDone?.stock);

  const q60 = normalizeSpongeQty(numSafe(args.order60), 60);
  const q36 = normalizeSpongeQty(numSafe(args.order36), 36);
  const q49 = normalizeSpongeQty(numSafe(args.order49), 49);
  const q144 = normalizeSpongeQty(numSafe(args.order144), 144);

  const totalPieces = q60 * 60 + q36 * 36 + q49 * 49 + q144 * 144;

  return `
    <div class="cell spongewide" style="grid-column: span 2;">
      <div class="cell-name">スポンジ</div>
      <div class="cell-target">（内訳あり）</div>

      <div class="sponge-stock2big">
        <div class="sponge-stock-box">
          <div class="sponge-stock-tag">未加工</div>
          <div class="sponge-stock-num">${String(raw)}</div>
        </div>
        <div class="sponge-stock-box">
          <div class="sponge-stock-tag">加工済</div>
          <div class="sponge-stock-num">${String(done)}</div>
        </div>
      </div>

      <div class="mid-divider"></div>

      <div class="sponge-order-wide">
        <div class="sponge-order-grid">
          <div class="sponge-tag">60</div>
          <div class="sponge-circle"><span class="order-circle">${String(q60)}</span></div>

          <div class="sponge-tag">36</div>
          <div class="sponge-circle"><span class="order-circle">${String(q36)}</span></div>

          <div class="sponge-tag">49</div>
          <div class="sponge-circle"><span class="order-circle">${String(q49)}</span></div>

          <div class="sponge-tag">144</div>
          <div class="sponge-circle"><span class="order-circle">${String(q144)}</span></div>

          <div class="sponge-total">
            <span class="total-circle">${String(totalPieces)}</span>
          </div>
        </div>
      </div>

      <div class="cell-note">&nbsp;</div>
    </div>
  `;
}

export function buildPrintHtml(payload: PrintPayload) {
  const byId = new Map(payload.items.map((x) => [x.id, x]));

  const row1 = ["choco","white_onion","red_onion","fruit_peach","fruit_angel","egg_s"];
  const row2 = ["crumble","rusk_split","nuts","danish_rusk_split","sponge_wide2"];
  const row3 = ["yamapan","chigiri","danish","plain","tea","season"];

  const sideLabels = `
    <div class="sidecol">
      <div></div>
      <div></div>
      <div class="side-stock">在庫</div>
      <div class="mid-divider"></div>
      <div class="side-order">発注</div>
      <div></div>
    </div>
  `;

  const row2Cells = row2.map((id) => {
    if (id === "danish_rusk_split") {
      return danishSplitCell(byId.get("danish_rusk_5"), byId.get("danish_rusk_10"));
    }
    if (id === "rusk_split") {
      return ruskSplitCell(byId.get("rusk_coffee"), byId.get("rusk_plain"));
    }
    if (id === "sponge_wide2") {
      const raw = byId.get("sponge_raw");
      const done = byId.get("sponge_done");

      const o60 = byId.get("sponge_60")?.order ?? 0;
      const o36 = byId.get("sponge_36")?.order ?? 0;
      const o49 = byId.get("sponge_49")?.order ?? 0;
      const o144 = byId.get("sponge_144")?.order ?? 0;

      return spongeWideCell({
        stockRaw: raw ? { stock: raw.stock } : { stock: 0 },
        stockDone: done ? { stock: done.stock } : { stock: 0 },
        order60: o60,
        order36: o36,
        order49: o49,
        order144: o144,
      });
    }
    return cell(byId.get(id));
  }).join("");

  const row3Cells = row3.map((id) => {
    if (id === "yamapan" || id === "chigiri" || id === "danish") {
      return cell(byId.get(id), { hideOrder: true });
    }
    return cell(byId.get(id));
  }).join("");

  return `
<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(payload.title)}</title>
<style>${PRINT_CSS}</style>
</head>
<body>
  <div class="wrap">
    <div class="sheet">

      <div class="band fridge">冷蔵庫</div>
      <div class="rowwrap">
        ${sideLabels}
        <div class="grid6">
          ${row1.map((id) => cell(byId.get(id))).join("")}
        </div>
      </div>

      <div class="bandrow" style="grid-template-columns: 3fr 3fr;">
        <div class="b-room">常温</div>
        <div class="b-freezer">冷凍庫</div>
      </div>
      <div class="rowwrap">
        ${sideLabels}
        <div class="grid6">
          ${row2Cells}
        </div>
      </div>

      <div class="bandrow" style="grid-template-columns: 6fr;">
        <div class="b-freezer">冷凍庫</div>
      </div>
      <div class="rowwrap">
        ${sideLabels}
        <div class="grid6">
          ${row3Cells}
        </div>
      </div>

    </div>

    <div class="footnote">※適正在庫が無い場合は必ず報告する！！</div>
  </div>
</body>
</html>
  `;
}
