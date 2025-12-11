import { useState } from "react";
import api from "../api/axios";
import "../style/attack.css";

export default function AttackFlow({ product }) {
  const [log, setLog] = useState("");

  const attack = async (type) => {
    if (!product) return alert("상품을 먼저 선택하세요.");

    const res = await api.post(`/attack/${type}`, {
      item: product.name,
      amount: product.price,
    });

    setLog(JSON.stringify(res.data, null, 2));
  };

  return (
    <div className="attack-container">
      {!product && <p>상품을 먼저 선택하세요.</p>}

      <div className="attack-btn-group">
        <button onClick={() => attack("csrf")} disabled={!product}>
          CSRF Attack
        </button>
        <button onClick={() => attack("replay")} disabled={!product}>
          Replay Attack
        </button>
      </div>

      {log && <pre className="attack-output">{log}</pre>}
    </div>
  );
}
