// src/features/export/printOrderSheet.ts
import { buildPrintHtml } from "./buildPrintHtml";

export type PrintPayload = {
  title: string;
  dateLabel?: string;
  items: Array<{
    id: string;
    label: string;
    targetLabel: string;
    stock: number;
    order: number;
    note?: string;
  }>;
};

function isIOS(): boolean {
  const ua = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua);
}

export function printOrderSheet(payload: PrintPayload) {
  const html = buildPrintHtml(payload);

  // ✅ iOS は iframe + 自動print が不安定なので「新規タブで開く」方式にする
  if (isIOS()) {
    const w = window.open("", "_blank");
    if (!w) {
      alert("ポップアップがブロックされました。ブラウザ設定で許可してください。");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();

    // iOSは自動印刷がブロックされやすいので、ユーザー操作に委ねる（共有→プリント/PDF保存が安定）
    // もし自動を試すなら下をONにできるが、端末によりブロックされる
    // setTimeout(() => { try { w.focus(); w.print(); } catch {} }, 400);

    return;
  }

  // ✅ 非iOS：従来通り iframe でOK
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.setAttribute("aria-hidden", "true");

  document.body.appendChild(iframe);

  const cleanup = () => {
    setTimeout(() => {
      try {
        iframe.remove();
      } catch {}
    }, 300);
  };

  iframe.srcdoc = html;
  iframe.onload = () => {
    const w = iframe.contentWindow;
    if (!w) {
      cleanup();
      return;
    }

    const after = () => {
      w.removeEventListener("afterprint", after);
      cleanup();
    };
    w.addEventListener("afterprint", after);

    setTimeout(() => {
      try {
        w.focus();
        w.print();
      } catch {
        cleanup();
      }
    }, 200);
  };
}
