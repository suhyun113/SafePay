import SafeFlow from "./SafeFlow";
import AttackFlow from "./AttackFlow";
import "../style/layout.css";

export default function Compare() {
  return (
    <div className="dual-wrapper">
      <div className="panel left-panel">
        <h2>Safe Flow</h2>
        <SafeFlow />
      </div>

      <div className="panel right-panel">
        <h2>Attack Flow</h2>
        <AttackFlow />
      </div>
    </div>
  );
}
