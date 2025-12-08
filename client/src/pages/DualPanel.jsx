export default function DualPanel() {
  return (
    <div style={{ display: "flex", gap: 20, height: "100vh" }}>
      <div style={{ flex: 1, border: "1px solid #ccc", padding: 20 }}>
        <h2>Safe Flow</h2>
      </div>
      <div style={{ flex: 1, border: "1px solid #ccc", padding: 20 }}>
        <h2>Attack Flow</h2>
      </div>
    </div>
  );
}
