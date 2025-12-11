import { useState } from "react";
import api from "../api/axios";
import "../style/safe.css";

export default function SafeFlow({ product }) {
  const [result, setResult] = useState(null);

  const handlePayment = async () => {
    if (!product) return alert("상품을 먼저 선택하세요.");
    const token = localStorage.getItem("access");
    if (!token) return alert("로그인이 필요합니다.");

    const res = await api.post(
      "/payment/checkout",
      { item: product.name, amount: product.price },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setResult(res.data);
  };

  return (
    <div className="safe-container">

      {!product && <p>상품을 먼저 선택하세요.</p>}

      <button className="safe-btn" onClick={handlePayment} disabled={!product}>
        보안 결제 요청
      </button>

      {result && (
        <pre className="safe-output">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
