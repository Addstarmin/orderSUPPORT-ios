// src/domain/items.ts
export type Section = "冷蔵庫" | "常温" | "冷凍庫" | "ストッカー";

export type Item = {
  id: string;
  name: string;
  section: Section;
  targetLabel: string;
};

export const ITEMS: Item[] = [
  // ===== 冷蔵庫 =====
  { id: "choco",       name: "チョコレート500g",        section: "冷蔵庫", targetLabel: "適正在庫:12袋" },
  { id: "white_onion", name: "白玉ねぎ",                section: "冷蔵庫", targetLabel: "適正在庫:2セット" },
  { id: "red_onion",   name: "赤玉ねぎ",                section: "冷蔵庫", targetLabel: "適正在庫:2セット" },
  { id: "fruit_peach", name: "季節のフルーツ（桃）",      section: "冷蔵庫", targetLabel: "適正在庫:—" },
  { id: "fruit_angel", name: "季節のフルーツ（イチゴ）",  section: "冷蔵庫", targetLabel: "適正在庫:—" },
  { id: "egg_s",       name: "たまごS",                  section: "冷蔵庫", targetLabel: "適正在庫:6箱" },

  // ===== 常温 =====
  { id: "crumble",     name: "クランブル",              section: "常温", targetLabel: "適正在庫:20個" },

  // ✅ ラスク（珈琲/プレーン）※在庫・発注とも「入力数×48」をPDF表示で使う
  { id: "rusk_coffee", name: "ラスク（珈琲）",          section: "常温", targetLabel: "換算:×48（PDF表示）" },
  { id: "rusk_plain",  name: "ラスク（プレーン）",      section: "常温", targetLabel: "換算:×48（PDF表示）" },

  { id: "nuts",        name: "ナッツ",                  section: "常温", targetLabel: "適正在庫:15個" },

  // ===== 冷凍庫 =====
  { id: "danish_rusk_5",  name: "デニッシュラスク(5枚)",  section: "冷凍庫", targetLabel: "適正在庫:??" },
  { id: "danish_rusk_10", name: "デニッシュラスク(10枚)", section: "冷凍庫", targetLabel: "適正在庫:??" },

  // ✅ スポンジ（在庫入力は2つ）
  // - 未加工: 入力数 × 6 をPDFへ
  // - 加工済: 入力数 × 36 をPDFへ
  { id: "sponge_raw",  name: "スポンジ（未加工）",        section: "冷凍庫", targetLabel: "換算:×6（PDF表示）" },
  { id: "sponge_done", name: "スポンジ（加工済）",        section: "冷凍庫", targetLabel: "換算:×36（PDF表示）" },

  // ✅ スポンジ（発注 内訳）※StockInputでは除外する
  { id: "sponge_60",   name: "スポンジ（60）",            section: "冷凍庫", targetLabel: "—" },
  { id: "sponge_36",   name: "スポンジ（36）",            section: "冷凍庫", targetLabel: "—" },
  { id: "sponge_49",   name: "スポンジ（49）",            section: "冷凍庫", targetLabel: "—" },
  { id: "sponge_144",  name: "スポンジ（144）",           section: "冷凍庫", targetLabel: "—" },

  // ✅ パン類（発注は赤なし仕様）
  { id: "yamapan",     name: "山パン",                  section: "冷凍庫", targetLabel: "適正在庫:9本" },
  { id: "chigiri",     name: "ちぎり",                  section: "冷凍庫", targetLabel: "適正在庫:13番重" },
  { id: "danish",      name: "デニッシュ",              section: "冷凍庫", targetLabel: "適正在庫:16本" },

  // ✅ ストッカー廃止 → 冷凍庫枠
  { id: "plain",       name: "プレーン",                section: "冷凍庫", targetLabel: "適正在庫:8台ずつ" },
  { id: "tea",         name: "紅茶",                    section: "冷凍庫", targetLabel: "適正在庫:8台ずつ" },
  { id: "season",      name: "季節",                    section: "冷凍庫", targetLabel: "適正在庫:8台ずつ" },
];

export function buildZeroMap(): Record<string, number> {
  const m: Record<string, number> = {};
  for (const it of ITEMS) m[it.id] = 0;
  return m;
}

