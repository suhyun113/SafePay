import { BrowserRouter, Routes, Route } from "react-router-dom";
import DualPanel from "./pages/DualPanel";
import SafeFlow from "./pages/SafeFlow";
import AttackFlow from "./pages/AttackFlow";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DualPanel />} />
        <Route path="/safe" element={<SafeFlow />} />
        <Route path="/attack" element={<AttackFlow />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
