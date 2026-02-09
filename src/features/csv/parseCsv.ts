// src/features/csv/parseCsv.ts
import Encoding from "encoding-japanese";

export type CsvRow = Record<string, string>;

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
      continue;
    }
    if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function decodeArrayBuffer(buf: ArrayBuffer): string {
  const u8 = new Uint8Array(buf);

  // まず UTF-8 として読めるならそれでOK（BOM/UTF-8 CSV 対応）
  try {
    const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(u8);
    // 変換結果が「明らかに壊れていない」なら採用
    // （SJISをUTF-8として読むと "�" が増えがち）
    if (utf8 && !utf8.includes("�")) return utf8;
  } catch {
    // ignore
  }

  // 次に Shift_JIS を試す（環境により TextDecoder が効かないので try）
  try {
    const sjis = new TextDecoder("shift_jis", { fatal: false }).decode(u8);
    if (sjis && !sjis.includes("�")) return sjis;
  } catch {
    // ignore
  }

  // 最後の砦：encoding-japanese で SJIS → Unicode 変換（iPhoneでも安定）
  const unicodeArray = Encoding.convert(u8, {
    from: "SJIS",
    to: "UNICODE",
    type: "array",
  }) as number[];
  return Encoding.codeToString(unicodeArray);
}

function findHeaderIndex(lines: string[]): number {
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes("商品名") && l.includes("発注数量")) return i;
  }
  return 0;
}

export async function parseCsvFile(file: File): Promise<CsvRow[]> {
  const buf = await file.arrayBuffer();
  const text = decodeArrayBuffer(buf);

  const rawLines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0);

  if (rawLines.length === 0) return [];

  const headerIndex = findHeaderIndex(rawLines);
  const lines = rawLines.slice(headerIndex);
  if (lines.length === 0) return [];

  const header = splitCsvLine(lines[0]);
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const row: CsvRow = {};
    for (let c = 0; c < header.length; c++) {
      row[header[c]] = cols[c] ?? "";
    }
    rows.push(row);
  }

  return rows;
}
