import { useState } from "react";
import api from "../api/axios";
import "../style/attack.css";

export default function AttackFlow({ product }) {
  const [log, setLog] = useState("");

  const attack = async (type) => {
    const res = await api.post(`/attack/${type}`);
    setLog(JSON.stringify(res.data, null, 2));
  };

  return (
    <div className="attack-flow">
      <p className="selected-item">
        {product ? `선택된 상품: ${product.name}` : "상품을 선택하세요."}
      </p>

      <div className="attack-buttons">
        <button disabled={!product} onClick={() => attack("csrf")}>
          CSRF Attack
        </button>
        <button disabled={!product} onClick={() => attack("replay")}>
          Replay Attack
        </button>
      </div>

      {log && <pre className="attack-output">{log}</pre>}
    </div>
  );
}
