import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Compare from "./pages/Compare";
import SafeFlow from "./pages/SafeFlow";
import AttackFlow from "./pages/AttackFlow";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Guide from "./pages/Guide";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/safe" element={<SafeFlow />} />
        <Route path="/attack" element={<AttackFlow />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/guide" element={<Guide />} />
      </Routes>
    </BrowserRouter>
  );
}
