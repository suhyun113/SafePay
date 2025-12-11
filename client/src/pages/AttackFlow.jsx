import { useState } from "react";
import api from "../api/axios";
import "../style/attack.css";

export default function AttackFlow({ product }) {
  const [selectedAttackType, setSelectedAttackType] = useState(null);
  const [log, setLog] = useState("");

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
    } catch (err) {
      console.error("공격 시뮬레이션 실패:", err);
      const errorData = err.response?.data || { message: "공격 시뮬레이션 실패" };
      console.error("에러 상세:", errorData);
      setLog(JSON.stringify(errorData, null, 2));
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

      {log && (
        <pre className="attack-output">
          {typeof log === 'string' ? log : JSON.stringify(log, null, 2)}
        </pre>
      )}
    </div>
  );
}
