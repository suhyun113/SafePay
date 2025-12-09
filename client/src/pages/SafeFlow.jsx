import { useState } from "react";
import api from "../api/axios";
import "../style/safe.css";

export default function SafeFlow() {
  const [result, setResult] = useState(null);

  const handlePayment = async () => {
    const token = localStorage.getItem("access");
    if (!token) return alert("로그인이 필요합니다.");

    const res = await api.post(
      "/payment/create",
      { item: "Book", amount: 5000 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setResult(res.data);
  };

  return (
    <div className="safe-container">
      <button className="safe-btn" onClick={handlePayment}>
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
