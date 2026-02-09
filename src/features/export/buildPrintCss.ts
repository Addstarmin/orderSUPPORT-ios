// src/features/export/buildPrintCss.ts
export const PRINT_CSS = `
  @page { size: A4 landscape; margin: 5mm; }
  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }

  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", sans-serif; color:#111827; }
  .wrap { width: 100%; }

  .sheet { border: 2px solid #111827; }

  .rowwrap{
    display:grid;
    grid-template-columns: 18mm 1fr;
    border-top: 1px solid #111827;
  }
  .sidecol{
    border-right: 1px solid #111827;
    display:grid;
    grid-template-rows: 20px 18px 1fr 1px 1fr 12px;
    background:#fff;
  }
  .sidecol .side-stock,
  .sidecol .side-order{
    display:flex; align-items:center; justify-content:center;
    font-weight: 900; font-size: 12px; color:#111827;
    letter-spacing: .08em;
  }

  .grid6 { display: grid; grid-template-columns: repeat(6, 1fr); }

  .band {
    display:flex; align-items:center; justify-content:center;
    font-weight: 900; font-size: 12px;
    padding: 2px 0;
    border-bottom: 2px solid #111827;
    line-height: 1;
  }
  .band.fridge { background:#1f6fb2; color:#fff; }

  .bandrow {
    display:grid;
    border-top: 1px solid #111827;
    border-bottom: 2px solid #111827;
    height: 26px;
  }
  .bandrow > div {
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:12px; color:#fff;
    line-height: 1;
  }
  .b-room { background:#2f8f3a; }
  .b-freezer { background:#b14c2f; }

  .cell {
    border-left: 1px solid #111827;
    background: #fff;
    min-height: 36mm;
    display: grid;
    grid-template-rows: 20px 18px 1fr 1px 1fr 12px;
  }
  .cell:nth-child(1) { border-left: none; }

  .cell.warn{ background: #fff7c7; }
  .split-half.warn{ background: #fff7c7; }

  .cell-name {
    background: #f3f4f6;
    border-bottom: 1px solid #111827;
    padding: 2px 5px;
    font-size: 11px;
    font-weight: 900;
    display:flex; align-items:center;
    line-height: 1;
  }

  .cell-target {
    margin: 2px 5px 0 5px;
    padding: 1px 5px;
    background: #ffe867;
    border: 1px solid #c7b600;
    font-size: 10px;
    font-weight: 900;
    display:flex; align-items:center;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stock-area {
    display:flex;
    align-items:center;
    justify-content:center;
    padding-top: 2px;
  }
  .stock-num {
    text-align:center;
    font-weight: 900;
    font-size: 30px;
    line-height: 1;
  }

  .mid-divider { background:#111827; }

  .order-area {
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .order-circle-wrap { display:flex; justify-content:center; align-items:center; }
  .order-circle {
    display:inline-flex;
    align-items:center;
    justify-content:center;
    width: 10mm;
    height: 10mm;
    border-radius: 999px;
    border: 2px solid #e11d48;
    color: #e11d48;
    font-weight: 900;
    font-size: 16px;
    background: #fff;
    line-height: 1;
  }
  .order-hidden .order-circle-wrap { display:none; }

  .cell-note {
    font-size: 9px;
    color: #111827;
    text-align: center;
    padding: 0 4px 2px 4px;
    white-space: pre-wrap;
    line-height: 1;
  }

  .footnote {
    margin-top: 4px;
    font-size: 10px;
    font-weight: 900;
    color:#b91c1c;
    line-height: 1;
  }

  .cell.split { grid-template-rows: 20px 1fr 12px; }
  .split-area {
    border-top: 1px solid #111827;
    display: grid;
    grid-template-rows: 1fr 1px 1fr;
  }
  .split-divider { background:#111827; }
  .split-half { display: grid; grid-template-rows: 16px 1fr; }
  .split-head {
    display: grid;
    grid-template-columns: 46px 1fr;
    align-items: center;
    border-bottom: 1px solid #111827;
    background:#fff;
  }
  .split-tag {
    height: 100%;
    display:flex; align-items:center; justify-content:center;
    font-weight: 900;
    font-size: 11px;
    border-right: 1px solid #111827;
    background: #f9fafb;
    line-height: 1;
  }
  .split-target {
    margin: 0 4px;
    padding: 1px 4px;
    background: #ffe867;
    border: 1px solid #c7b600;
    font-size: 9px;
    font-weight: 900;
    display:flex;
    align-items:center;
    height: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1;
  }
  .split-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding-top: 1px;
  }
  .split-stock, .split-order { display:flex; align-items:center; justify-content:center; }
  .split-num-black { font-size: 22px; font-weight: 900; line-height: 1; }

  .sponge-stock2big{
    display:grid;
    grid-template-rows: 1fr 1fr;
  }
  .sponge-stock-box{
    display:grid;
    grid-template-columns: 64px 1fr;
    align-items:stretch;
    border-bottom: 1px solid #111827;
  }
  .sponge-stock-box:last-child{ border-bottom:none; }
  .sponge-stock-tag{
    border-right: 1px solid #111827;
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:12px;
    background:#f9fafb; line-height:1;
  }
  .sponge-stock-num{
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:34px; line-height:1;
  }

  .sponge-order-grid{
    display:grid;
    grid-template-columns: 56px 1fr 1.3fr;
    grid-template-rows: repeat(4, 1fr);
  }
  .sponge-tag{
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:12px;
    background:#f9fafb;
    border-right: 1px solid #111827;
    border-bottom: 1px solid #111827;
    line-height:1;
  }
  .sponge-circle{
    display:flex; align-items:center; justify-content:center;
    border-bottom: 1px solid #111827;
  }
  .sponge-total{
    grid-column: 3;
    grid-row: 1 / span 4;
    display:flex; align-items:center; justify-content:center;
    border-left: 1px solid #111827;
  }
  .total-circle{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    width: 14mm;
    height: 14mm;
    border-radius: 999px;
    border: 2px solid #e11d48;
    color:#111827;
    font-weight: 900;
    font-size: 22px;
    background:#fff;
    line-height:1;
  }

  .sponge-order-grid > .sponge-tag:nth-of-type(4) { border-bottom:none; }
  .sponge-order-grid > .sponge-circle:nth-of-type(4) { border-bottom:none; }
`;
