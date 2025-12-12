import SafeFlow from "./SafeFlow";
import AttackFlow from "./AttackFlow";
import "../style/dual-panel.css";

export default function DualPanel() {
  return (
    <div className="dual-panel">
      <div className="dual-panel-left">
        <h2>Safe Flow</h2>
        <SafeFlow />
      </div>

      <div className="dual-panel-right">
        <h2>Attack Flow</h2>
        <AttackFlow />
      </div>
    </div>
  );
}
