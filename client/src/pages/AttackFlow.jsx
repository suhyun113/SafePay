import "../style/attack.css";

export default function AttackFlow({
  enabled,
  setEnabled,
  attackType,
  setAttackType,
}) {
  // 서버에서 정의한 공격 유형과 동일한 키 값 사용
  const attacks = [
    ["csrf", "CSRF Attack"],
    ["replay", "Replay Attack"],
    ["priceTampering", "Price Tampering"],
    ["signatureTampering", "Signature Tampering"],
  ];

  return (
    <div className="panel attack-panel">
      <h3>
        Attack Flow
        <label className="attack-toggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              // 공격 시뮬레이션 활성화 여부 전환
              setEnabled(e.target.checked);

              // 공격 ON 시 기본 공격 유형 설정
              if (e.target.checked) setAttackType("csrf");
            }}
          />
          공격 ON
        </label>
      </h3>

      {/* 공격이 활성화된 경우에만 공격 유형 선택 UI 표시 */}
      {enabled && (
        <div className="attack-btn-group">
          {attacks.map(([key, label]) => (
            <button
              key={key}
              className={`attack-btn ${
                attackType === key ? "selected" : ""
              }`}
              onClick={() => setAttackType(key)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
