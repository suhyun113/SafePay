import { useMemo, useState } from "react";
import api from "../api/axios";
import "../style/safe.css";

export default function SafeFlow({ product }) {
  const [result, setResult] = useState(null);
  const [events, setEvents] = useState([]);
  const now = () => new Date().toLocaleTimeString();
  const safeTitle = useMemo(() => "Safe Flow", []);

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
      setEvents((prev) => [
        ...prev,
        { type: "request", title: "보안 결제 요청 전송", detail: { item: product.name, amount: product.price, mode: "safe" }, time: now() },
      ]);
      
      const res = await api.post(
        "/payment/checkout",
        { item: product.name, amount: product.price, mode: "safe" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("결제 요청 성공:", res.data);
      setResult(res.data);
      setEvents((prev) => [
        ...prev,
        { type: "response", title: "서버 응답 (보안 검증 통과)", detail: res.data, time: now(), success: true },
      ]);
      
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
      setEvents((prev) => [
        ...prev,
        { type: "response", title: "서버 응답 (실패)", detail: err.response?.data || errorMsg, time: now(), success: false },
      ]);
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

      <div className="live-log">
        <div className="live-log-header">
          <span>{safeTitle} 실시간 로그</span>
          <span className="live-log-hint">요청 · 응답 흐름을 시간순으로 표시</span>
        </div>
        {events.length === 0 ? (
          <div className="live-log-empty">아직 전송된 요청이 없습니다.</div>
        ) : (
          <ul className="live-log-list">
            {events.map((e, idx) => (
              <li key={idx} className="live-log-item">
                <div className="live-log-meta">
                  <span className={`status-badge ${e.success === false ? "failed" : e.success === true ? "success" : "info"}`}>
                    {e.type === "request" ? "요청" : e.success === false ? "차단" : "성공"}
                  </span>
                  <span className="live-log-time">{e.time}</span>
                </div>
                <div className="live-log-title">{e.title}</div>
                <pre className="live-log-body">{JSON.stringify(e.detail, null, 2)}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>

      {result && (
        <pre className="safe-output">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
