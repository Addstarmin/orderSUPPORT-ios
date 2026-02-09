// src/App.tsx
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import CsvImport from "./routes/CsvImport";
import StockInput from "./routes/StockInput";
import ExportPage from "./routes/Export";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/csv" element={<CsvImport />} />
        <Route path="/stock" element={<StockInput />} />
        <Route path="/export" element={<ExportPage />} />
      </Routes>
    </HashRouter>
  );
}
