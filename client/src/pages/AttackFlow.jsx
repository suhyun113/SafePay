import "../style/attack.css";

export default function AttackFlow({
  enabled,
  setEnabled,
  attackType,
  setAttackType,
}) {
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
              setEnabled(e.target.checked);
              if (e.target.checked) setAttackType("csrf");
            }}
          />
          공격 ON
        </label>
      </h3>

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
