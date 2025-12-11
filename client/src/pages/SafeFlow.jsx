import { useState } from "react";
import api from "../api/axios";
import "../style/safe.css";

export default function SafeFlow({ product }) {
  const [result, setResult] = useState(null);

  const handlePayment = async () => {
    if (!product) return alert("상품을 선택하세요.");

    const token = localStorage.getItem("access");
    if (!token) return alert("로그인이 필요합니다.");

    try {
      const res = await api.post(
        "/payment/checkout",
        { item: product.name, amount: product.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("결제 요청 실패");
    }
  };

  return (
    <div className="safe-flow">
      <p>{product ? `선택된 상품: ${product.name}` : "상품을 선택하세요."}</p>

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
