import { useState } from "react";
import api from "../api/axios";
import "../style/attack.css";

export default function AttackFlow({ product }) {
  const [log, setLog] = useState("");

  const attack = async (attackType) => {
    if (!product) {
      alert("상품을 먼저 선택하세요.");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await api.post(
        "/payment/checkout",
        { 
          item: product.name, 
          amount: product.price, 
          attackType 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLog(JSON.stringify(res.data, null, 2));
    } catch (err) {
      const errorData = err.response?.data || { message: "공격 시뮬레이션 실패" };
      setLog(JSON.stringify(errorData, null, 2));
    }
  };

  return (
    <div className="attack-container">
      {!product && <p>상품을 먼저 선택하세요.</p>}

      {product && <p>선택된 상품: {product.name}</p>}

      <div className="attack-btn-group">
        <button className="attack-btn" onClick={() => attack("csrf")}>
          CSRF Attack
        </button>

        <button className="attack-btn" onClick={() => attack("replay")}>
          Replay Attack
        </button>

        <button className="attack-btn" onClick={() => attack("priceTampering")}>
          Price Tampering
        </button>

        <button className="attack-btn" onClick={() => attack("signatureTampering")}>
          Signature Tampering
        </button>
      </div>

      {log && <pre className="attack-output">{log}</pre>}
    </div>
  );
}
