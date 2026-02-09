// src/state/appStore.ts
import { useEffect, useRef, useState } from "react";

export type NumberMap = Record<string, number>;

type AppState = {
  csvDone: boolean;
  stockDone: boolean;
  exportDoneAt: string | null;

  csvFileName: string | null;
  orders: NumberMap;
  stock: NumberMap;
};

const STORAGE_KEY = "order-support-state:v2";

const initialState: AppState = {
  csvDone: false,
  stockDone: false,
  exportDoneAt: null,

  csvFileName: null,
  orders: {},
  stock: {},
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

function safeNumberMap(x: unknown): NumberMap {
  if (!isRecord(x)) return {};
  const out: NumberMap = {};
  for (const [k, v] of Object.entries(x)) {
    const n = typeof v === "number" ? v : Number(v);
    out[k] = Number.isFinite(n) ? n : 0;
  }
  return out;
}

/** localStorage が使えない/落ちる環境でも落とさない */
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // iOS private mode などでは例外になるので無視（アプリは動かす）
  }
}
function safeRemoveItem(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

function loadState(): AppState {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) return initialState;

    const p = JSON.parse(raw) as Partial<AppState>;

    return {
      csvDone: !!p.csvDone,
      stockDone: !!p.stockDone,
      exportDoneAt: typeof p.exportDoneAt === "string" ? p.exportDoneAt : null,

      csvFileName: typeof p.csvFileName === "string" ? p.csvFileName : null,
      orders: safeNumberMap((p as any).orders),
      stock: safeNumberMap((p as any).stock),
    };
  } catch {
    return initialState;
  }
}

function saveState(s: AppState) {
  safeSetItem(STORAGE_KEY, JSON.stringify(s));
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => loadState());

  // 初回マウント直後の二重保存（StrictMode）で無駄に書かないように一応ガード
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      saveState(state);
      return;
    }
    saveState(state);
  }, [state]);

  const actions = {
    setCsvDone(v: boolean) {
      setState((prev) => ({ ...prev, csvDone: v }));
    },
    setStockDone(v: boolean) {
      setState((prev) => ({ ...prev, stockDone: v }));
    },

    setStock(stock: NumberMap) {
      // 念のため数値化して保存
      setState((prev) => ({ ...prev, stock: safeNumberMap(stock) }));
    },

    setOrders(payload: { fileName: string; orders: NumberMap }) {
      setState((prev) => ({
        ...prev,
        csvFileName: payload.fileName,
        orders: safeNumberMap(payload.orders),
      }));
    },

    markExportDoneNow() {
      setState((prev) => ({ ...prev, exportDoneAt: new Date().toISOString() }));
    },

    resetAll() {
      safeRemoveItem(STORAGE_KEY); // ✅ localStorageも消す
      setState(initialState);
    },
  };

  return { state, actions };
}
