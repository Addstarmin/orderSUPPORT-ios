// src/features/csv/toOrders.ts
import type { CsvRow } from "./parseCsv";
import { buildZeroMap } from "../../domain/items";

function toNumberSafe(x: unknown): number {
  const s = (x ?? "").toString().trim();
  if (!s) return 0;
  const m = s.match(/-?\d+/);
  if (!m) return 0;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : 0;
}

export type OrdersWithMeta = Record<string, number> & {
  __notes?: Record<string, string>;
};

function norm(s: string) {
  return (s ?? "")
    .toString()
    .replace(/[ 　\t]/g, "")
    .trim();
}

/**
 * ✅ ラスク：CSVの「発注数量」が 48 / 96 など “枚数” で来ることがある。
 * 発注として表示したいのは “袋数”。
 *
 * ただし、余計な変換はしない：
 * - 48で割り切れる場合だけ qty/48
 * - それ以外は「すでに袋数」とみなしてそのまま
 */
function ruskToPacks(qty: number) {
  if (!Number.isFinite(qty) || qty <= 0) return 0;
  if (qty < 48) return qty;
  if (qty % 48 === 0) return qty / 48;
  return qty;
}

function pickSpongeUnitFromNameOrSpec(name: string, spec: string): number {
  // 1) 商品名から「◯個」を拾う
  const mName = name.match(/(\d+)個/);
  if (mName) return Number(mName[1]) || 0;

  // 2) 規格(D列)から「144/個」「60.00／個」などを拾う
  // 例: "60.00／個" / "144/個"
  const mSpec = spec.match(/(\d+)(?:\.\d+)?[\/／]個/);
  if (mSpec) return Number(mSpec[1]) || 0;

  return 0;
}

export function buildOrdersFromCsv(rows: CsvRow[]): OrdersWithMeta {
  const orders: OrdersWithMeta = buildZeroMap() as OrdersWithMeta;
  const notes: Record<string, string> = {};

  // スポンジ内訳（数量）を記録しておく
  const spongeBags: Array<{ kind: "60" | "36" | "49直" | "144"; qty: number }> = [];

  for (const row of rows) {
    const nameRaw = (row["商品名"] ?? "").toString();
    const name = norm(nameRaw);
    const qty = toNumberSafe(row["発注数量"]);
    const spec = norm((row["規格・入数／単位"] ?? "").toString());

    if (!name || qty <= 0) continue;

    // ✅ パン類は赤文字なし（発注扱いしない）
    if (
      name.includes("山パン") ||
      name.includes("ちぎり") ||
      (name.includes("デニッシュ") && !name.includes("デニッシュラスク"))
    ) {
      continue;
    }

    // ✅ デニッシュラスク（5/10枚）
    if (name.includes("ミルフィーユデニッシュラスク")) {
      if (spec.includes("5枚")) orders["danish_rusk_5"] += qty;
      else if (spec.includes("10枚")) orders["danish_rusk_10"] += qty;
      continue;
    }

    // ✅ ラスク（珈琲/プレーン）
    // 発注は “袋数” のまま保持（CSVが48/96の枚数なら袋数へ補正）
    if (name.includes("伊勢") && (name.includes("珈琲") || name.includes("コーヒ")) && name.includes("ラスク")) {
      orders["rusk_coffee"] += ruskToPacks(qty);
      continue;
    }
    if (name.includes("なぎさ") && name.includes("ラスク")) {
      orders["rusk_plain"] += ruskToPacks(qty);
      continue;
    }

    // 保険：上の正式名称に一致しなかった「ラスク」行
    if (name.includes("ラスク")) {
      const packs = ruskToPacks(qty);
      if (name.includes("珈琲") || name.includes("コーヒ")) orders["rusk_coffee"] += packs;
      else orders["rusk_plain"] += packs;
      continue;
    }

    // ✅ ナッツ
    if (name.includes("クランブルナッツ200g")) {
      orders["nuts"] += qty;
      continue;
    }

    // ✅ スポンジ（発注の数量は E列をそのまま）
    // - 60/36/49/144 を商品名 or 規格(D列)から拾う
    if (name.includes("エンジェルスポンジ")) {
      const unit = pickSpongeUnitFromNameOrSpec(name, spec);

      if (unit === 60) {
        orders["sponge_60"] += qty;
        spongeBags.push({ kind: "60", qty });
        continue;
      }
      if (unit === 36) {
        orders["sponge_36"] += qty;
        spongeBags.push({ kind: "36", qty });
        continue;
      }
      if (unit === 144) {
        orders["sponge_144"] += qty;
        spongeBags.push({ kind: "144", qty });
        continue;
      }
      if (unit === 49 || name.includes("直送")) {
        orders["sponge_49"] += qty;
        spongeBags.push({ kind: "49直", qty });
        continue;
      }

      notes["sponge_unknown"] = `未対応スポンジ: ${nameRaw} / 規格:${row["規格・入数／単位"] ?? ""} / 数量:${qty}`;
      continue;
    }

    // ✅ たまごS
    if (name.includes("たまご") && (name.includes("S") || name.includes("Ｓ") || spec.includes("S") || spec.includes("Ｓ"))) {
      orders["egg_s"] += qty;
      continue;
    }

    // ✅ 季節のフルーツ（桃/イチゴ）
    if (name.includes("フルーツ")) {
      if (name.includes("桃") || name.includes("もも")) {
        orders["fruit_peach"] += qty;
        continue;
      }
      if (name.includes("イチゴ") || name.includes("いちご") || name.includes("苺")) {
        orders["fruit_angel"] += qty;
        continue;
      }
      notes["fruit_unknown"] = `未対応フルーツ: ${nameRaw} / 数量:${qty}`;
      continue;
    }

    // ✅ その他
    if (name.includes("クランブル200g")) orders["crumble"] += qty;
    if (name.includes("チョコレート500g")) orders["choco"] += qty;
    if (name.includes("白玉ねぎ")) orders["white_onion"] += qty;
    if (name.includes("赤玉ねぎ")) orders["red_onion"] += qty;

    // ✅ シフォン系
    if (name.includes("紅茶") && name.includes("シフォン")) {
      orders["tea"] += qty;
      continue;
    }
    if (name.includes("期間限定") && name.includes("シフォン")) {
      orders["season"] += qty;
      continue;
    }
    if (name.includes("シフォン")) {
      orders["plain"] += qty;
      continue;
    }
  }

  // ✅ スポンジ内訳ノート（数量）
  if (spongeBags.length > 0) {
    const s = spongeBags.map((p) => `${p.kind}×${p.qty}`).join(" / ");
    notes["sponge"] = `内訳(数量): ${s}`;
  }

  orders.__notes = notes;
  return orders;
}
