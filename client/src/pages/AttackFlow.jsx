import { useState } from "react";
import api from "../api/axios";
import "../style/attack.css";

export default function AttackFlow() {
  const [log, setLog] = useState("");

  const attack = async (type) => {
    const res = await api.post(`/attack/${type}`);
    setLog(JSON.stringify(res.data, null, 2));
  };

  return (
    <div className="attack-container">
      <div className="attack-btn-group">
        <button onClick={() => attack("csrf")}>CSRF Attack</button>
        <button onClick={() => attack("replay")}>Replay Attack</button>
      </div>

      {log && <pre className="attack-output">{log}</pre>}
    </div>
  );
}
