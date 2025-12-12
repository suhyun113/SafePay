import { useState } from "react";
import ProductSelector from "./ProductSelector";
import SafeFlow from "./SafeFlow";
import AttackFlow from "./AttackFlow";
import PaymentButton from "./PaymentButton";
import "../style/layout.css";

export default function Compare() {
  const [product, setProduct] = useState(null);

  const [security, setSecurity] = useState({
    signature: true,
    nonce: true,
    timestamp: true,
  });

  const [attackEnabled, setAttackEnabled] = useState(false);
  const [attackType, setAttackType] = useState("csrf");

  const [logs, setLogs] = useState([]);

  return (
    <div className="main-container">
      <div className="compare-container">
        <h2 className="compare-title">Secure Payment Simulator</h2>

        <ProductSelector onSelect={setProduct} />

        <div className="compare-panels">
          <SafeFlow security={security} setSecurity={setSecurity} />

          <AttackFlow
            enabled={attackEnabled}
            setEnabled={setAttackEnabled}
            attackType={attackType}
            setAttackType={setAttackType}
          />
        </div>

        {/* 결제 버튼은 항상 아래 */}
        <PaymentButton
          product={product}
          security={security}
          attackEnabled={attackEnabled}
          attackType={attackType}
          logs={logs}
          setLogs={setLogs}
        />

        {/* 로그 영역 */}
        <div className="log-panel">
          <h3>실시간 로그 (최신 순)</h3>

          {logs.length === 0 && (
            <p className="log-empty">아직 요청이 없습니다.</p>
          )}

          {logs.map((log, i) => (
            <div
              key={i}
              className={`log-item ${log.success ? "success" : "fail"}`}
            >
              <strong>{log.time}</strong>
              <pre>{JSON.stringify(log.data, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
