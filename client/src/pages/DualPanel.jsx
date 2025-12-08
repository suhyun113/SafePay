import SafeFlow from "./SafeFlow";
import AttackFlow from "./AttackFlow";

export default function DualPanel() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: 20 }}>
        <h2>Safe Flow</h2>
        <SafeFlow />  {/* ← 실제 기능을 이쪽 패널에 렌더링 */}
      </div>
      
      <div style={{ flex: 1, padding: 20 }}>
        <h2>Attack Flow</h2>
        <AttackFlow /> {/* ← 공격 기능을 이쪽 패널에 렌더링 */}
      </div>

    </div>
  );
}
