import { useState } from "react";
import api from "../api/axios";
import "../style/safe.css";

export default function SafeFlow({ product }) {
  const [result, setResult] = useState(null);

  const handlePayment = async () => {
    if (!product) return alert("상품을 먼저 선택하세요.");
    const token = localStorage.getItem("access");
    if (!token) return alert("로그인이 필요합니다.");

    try {
      const res = await api.post(
        "/payment/checkout",
        { item: product.name, amount: product.price, mode: "safe" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "결제 요청 실패");
      setResult({ error: err.response?.data?.message || "결제 요청 실패" });
    }
  };

  return (
    <div className="safe-container">
      {product && <p>선택된 상품: {product.name}</p>}

      <button className="safe-btn" onClick={handlePayment}>
        보안 결제 요청
      </button>

      {result && (
        <div className="safe-output">
          {result.error ? (
            <div style={{ color: "#e76f51" }}>❌ {result.error}</div>
          ) : (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
