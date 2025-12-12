import "../style/safe.css";

export default function SafeFlow({ security, setSecurity }) {
  // 보안 옵션 토글 처리
  const toggle = (key) =>
    setSecurity((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="panel safe-panel">
      <h3>Safe Flow</h3>
      <p className="panel-desc">보안 적용 옵션</p>

      <div className="toggle-row">
        {["signature", "nonce", "timestamp"].map((k) => (
          <button
            key={k}
            className={`toggle-btn ${security[k] ? "active" : ""}`}
            onClick={() => toggle(k)}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
