import { useState } from "react";
import api from "../api/axios";

export default function AttackFlow() {
  const [log, setLog] = useState("");

  const csrf = async () => {
    const res = await api.post("/attack/csrf");
    setLog(JSON.stringify(res.data, null, 2));
  };

  const replay = async () => {
    const res = await api.post("/attack/replay");
    setLog(JSON.stringify(res.data, null, 2));
  };

  return (
    <div>
      <h1>Attack Simulation</h1>
      <button onClick={csrf}>CSRF Attack</button>
      <button onClick={replay}>Replay Attack</button>

      <pre style={{ background: "#111", padding: 20, color: "red" }}>
        {log}
      </pre>
    </div>
  );
}
