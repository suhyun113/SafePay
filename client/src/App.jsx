import { BrowserRouter, Routes, Route } from "react-router-dom";
import DualPanel from "./pages/DualPanel";
import SafeFlow from "./pages/SafeFlow";
import AttackFlow from "./pages/AttackFlow";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DualPanel />} />
        <Route path="/safe" element={<SafeFlow />} />
        <Route path="/attack" element={<AttackFlow />} />
      </Routes>
    </BrowserRouter>
  );
}
