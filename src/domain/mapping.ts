// src/domain/mapping.ts
export type MappingRule = {
  itemId: string;
  csvNames: string[];
  note?: string;
};

export const MAPPING: MappingRule[] = [
  { itemId: "choco",       csvNames: ["チョコレート500g"] },
  { itemId: "white_onion", csvNames: ["白玉ねぎ"] },
  { itemId: "red_onion",   csvNames: ["赤玉ねぎ"] },
  { itemId: "fruit_peach", csvNames: ["季節のフルーツ（桃）", "季節のフルーツ桃"] },
  { itemId: "fruit_angel", csvNames: ["季節のフルーツ（イチゴ）", "季節のフルーツイチゴ"] },
  { itemId: "egg_s",       csvNames: ["たまごS", "FC様用たまごS", "FC用たまごS"] },
  { itemId: "crumble",     csvNames: ["クランブル200g", "クランブル"] },
  { itemId: "nuts",        csvNames: ["ナッツ"] },

  { itemId: "danish_rusk_5",  csvNames: ["ミルフィーユデニッシュラスク"], note: "規格で 5枚/10枚 を判定" },
  { itemId: "danish_rusk_10", csvNames: ["ミルフィーユデニッシュラスク"], note: "規格で 5枚/10枚 を判定" },

  {
    itemId: "sponge_raw",
    csvNames: ["スポンジ（未加工）"],
    note: "入力数×6 をPDF表示",
  },
  {
    itemId: "sponge_done",
    csvNames: ["スポンジ（加工済）"],
    note: "入力数×36 をPDF表示",
  },
  {
    itemId: "sponge_60",
    csvNames: ["久居用エンジェルスポンジ60個"],
    note: "発注内訳: 60 / 36 / 49 / 144",
  },
  { itemId: "sponge_36",  csvNames: ["エンジェルスポンジ36個"] },
  { itemId: "sponge_49",  csvNames: ["FCエンジェルスポンジ49【直送】", "FCエンジェルスポンジ49個【直送】"] },
  { itemId: "sponge_144", csvNames: ["エンジェルスポンジ144個", "FCエンジェルスポンジ144個", "久居用エンジェルスポンジ144個"] },

  { itemId: "plain",  csvNames: ["シフォンケーキ6個"] },
  { itemId: "tea",    csvNames: ["紅茶シフォン6個"] },
  { itemId: "season", csvNames: ["期間限定シフォン6個"] },

  { itemId: "yamapan", csvNames: ["山パン"] },
  { itemId: "chigiri", csvNames: ["ちぎり"] },
  { itemId: "danish",  csvNames: ["デニッシュ"] },
];

export function normalizeName(s: string): string {
  return (s ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[()]/g, (m) => (m === "(" ? "（" : "）"))
    .replace(/＋/g, "+")
    .replace(/：/g, ":");
}
