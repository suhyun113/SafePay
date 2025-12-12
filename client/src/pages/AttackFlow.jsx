import { useMemo, useState } from "react";
import api from "../api/axios";
import "../style/attack.css";

export default function AttackFlow({ product }) {
  const [selectedAttackType, setSelectedAttackType] = useState(null);
  const [log, setLog] = useState("");
  const [events, setEvents] = useState([]);
  const now = () => new Date().toLocaleTimeString();
  const attackTitle = useMemo(() => "Attack Flow", []);

  const handleAttackRequest = async () => {
    if (!product) {
      alert("상품을 먼저 선택하세요.");
      return;
    }

    if (!selectedAttackType) {
      alert("공격 유형을 먼저 선택하세요.");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      console.log("공격 시뮬레이션 시작:", { 
        item: product.name, 
        amount: product.price,
        attackType: selectedAttackType 
      });
      setEvents((prev) => [
        { type: "request", title: "공격 시뮬레이션 요청 전송", detail: { item: product.name, amount: product.price, attackType: selectedAttackType }, time: now() },
        ...prev,
      ]);

      const res = await api.post(
        "/payment/checkout",
        { 
          item: product.name, 
          amount: product.price, 
          attackType: selectedAttackType
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("공격 시뮬레이션 성공:", res.data);
      setLog(JSON.stringify(res.data, null, 2));
      setEvents((prev) => [
        { type: "response", title: "서버 응답 (공격 처리 결과)", detail: res.data, time: now(), success: res.data.success },
        ...prev,
      ]);
    } catch (err) {
      console.error("공격 시뮬레이션 실패:", err);
      const errorData = err.response?.data || { message: "공격 시뮬레이션 실패" };
      console.error("에러 상세:", errorData);
      setLog(JSON.stringify(errorData, null, 2));
      setEvents((prev) => [
        { type: "response", title: "서버 응답 (실패)", detail: err.response?.data || err.message, time: now(), success: false },
        ...prev,
      ]);
    }
  };

  const attackTypeLabels = {
    csrf: "CSRF Attack",
    replay: "Replay Attack",
    priceTampering: "Price Tampering",
    signatureTampering: "Signature Tampering"
  };

  return (
    <div className="attack-container">
      {!product && (
        <p style={{ color: "#e76f51", fontWeight: "600" }}>
          ⚠️ 상품을 먼저 선택하세요.
        </p>
      )}
      
      {product && (
        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
            선택된 상품: <span style={{ color: "#e76f51" }}>{product.name}</span>
          </p>
          <p style={{ fontSize: "14px", color: "#666" }}>
            가격: {product.price.toLocaleString()}원
          </p>
        </div>
      )}

      <div className="attack-type-section">
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#666", marginBottom: "10px" }}>
          공격 유형 선택:
        </p>
        <div className="attack-btn-group">
          <button
            className={`attack-btn ${selectedAttackType === "csrf" ? "selected" : ""}`}
            onClick={() => setSelectedAttackType("csrf")}
            disabled={!product}
            style={{
              opacity: product ? 1 : 0.5,
              cursor: product ? "pointer" : "not-allowed"
            }}
          >
            CSRF Attack
          </button>

          <button
            className={`attack-btn ${selectedAttackType === "replay" ? "selected" : ""}`}
            onClick={() => setSelectedAttackType("replay")}
            disabled={!product}
            style={{
              opacity: product ? 1 : 0.5,
              cursor: product ? "pointer" : "not-allowed"
            }}
          >
            Replay Attack
          </button>

          <button
            className={`attack-btn ${selectedAttackType === "priceTampering" ? "selected" : ""}`}
            onClick={() => setSelectedAttackType("priceTampering")}
            disabled={!product}
            style={{
              opacity: product ? 1 : 0.5,
              cursor: product ? "pointer" : "not-allowed"
            }}
          >
            Price Tampering
          </button>

          <button
            className={`attack-btn ${selectedAttackType === "signatureTampering" ? "selected" : ""}`}
            onClick={() => setSelectedAttackType("signatureTampering")}
            disabled={!product}
            style={{
              opacity: product ? 1 : 0.5,
              cursor: product ? "pointer" : "not-allowed"
            }}
          >
            Signature Tampering
          </button>
        </div>

        {selectedAttackType && (
          <div style={{ marginTop: "10px", color: "#e76f51", fontWeight: "600" }}>
            선택됨: {attackTypeLabels[selectedAttackType]}
          </div>
        )}
      </div>

      <button
        className="attack-request-btn"
        onClick={handleAttackRequest}
        disabled={!product || !selectedAttackType}
      >
        보안 결제 요청
      </button>

      <div className="live-log">
        <div className="live-log-header">
          <span>{attackTitle} 실시간 로그</span>
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
                    {e.type === "request" ? "요청" : e.success === false ? "차단" : e.success ? "성공" : "응답"}
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

      {log && (
        <pre className="attack-output">
          {typeof log === 'string' ? log : JSON.stringify(log, null, 2)}
        </pre>
      )}
    </div>
  );
}
