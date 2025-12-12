import { useState } from "react";
import ProductSelector from "../components/ProductSelector";
import SafeFlow from "../components/SafeFlow";
import AttackFlow from "../components/AttackFlow";
import PaymentButton from "../components/PaymentButton";
import "../style/layout.css";

export default function Compare() {
  // 선택된 상품 상태
  const [product, setProduct] = useState(null);

  // 보안 옵션 적용 여부 상태
  const [security, setSecurity] = useState({
    signature: true,
    nonce: true,
    timestamp: true,
  });

  // 공격 시뮬레이션 활성화 여부
  const [attackEnabled, setAttackEnabled] = useState(false);

  // 선택된 공격 유형
  const [attackType, setAttackType] = useState("csrf");

  // 결제 요청 결과 로그
  const [logs, setLogs] = useState([]);

  return (
    <div className="main-container">
      <div className="compare-container">
        <h2 className="compare-title">보안 결제 시뮬레이터</h2>

        {/* 상품 선택 영역 */}
        <ProductSelector onSelect={setProduct} />

        {/* 보안 흐름 / 공격 흐름 설정 */}
        <div className="compare-panels">
          <SafeFlow security={security} setSecurity={setSecurity} />
          <AttackFlow
            enabled={attackEnabled}
            setEnabled={setAttackEnabled}
            attackType={attackType}
            setAttackType={setAttackType}
          />
        </div>

        {/* 결제 요청 버튼 */}
        <PaymentButton
          product={product}
          security={security}
          attackEnabled={attackEnabled}
          attackType={attackType}
          logs={logs}
          setLogs={setLogs}
        />

        {/* 실시간 결과 로그 */}
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
