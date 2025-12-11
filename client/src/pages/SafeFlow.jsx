import { useState } from "react";
import api from "../api/axios";
import "../style/safe.css";

export default function SafeFlow({ product }) {
  const [result, setResult] = useState(null);

  const handlePayment = async () => {
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
      console.log("결제 요청 시작:", { item: product.name, amount: product.price });
      
      const res = await api.post(
        "/payment/checkout",
        { item: product.name, amount: product.price, mode: "safe" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("결제 요청 성공:", res.data);
      setResult(res.data);
      
      if (res.data.success) {
        alert("결제가 성공적으로 완료되었습니다!");
      }
    } catch (err) {
      console.error("결제 요청 실패:", err);
      const errorMsg = err.response?.data?.message || err.message || "결제 요청 실패";
      console.error("에러 상세:", err.response?.data);
      alert(errorMsg);
      setResult({ 
        error: errorMsg,
        details: err.response?.data 
      });
    }
  };

  return (
    <div className="safe-container">
      {!product && (
        <p style={{ color: "#e76f51", fontWeight: "600" }}>
          ⚠️ 상품을 먼저 선택하세요.
        </p>
      )}
      
      {product && (
        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
            선택된 상품: <span style={{ color: "#2a9d8f" }}>{product.name}</span>
          </p>
          <p style={{ fontSize: "14px", color: "#666" }}>
            가격: {product.price.toLocaleString()}원
          </p>
        </div>
      )}

      <button 
        className="safe-btn" 
        onClick={handlePayment}
        disabled={!product}
        style={{ 
          opacity: product ? 1 : 0.5,
          cursor: product ? "pointer" : "not-allowed"
        }}
      >
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
