import api from "../api/axios";

export default function AttackFlow() {
  const testCSRF = async () => {
    const res = await api.post("/attack/csrf");
    console.log(res.data);
  };

  return (
    <div>
      <h1>Attack Simulation</h1>
      <button onClick={testCSRF}>Simulate CSRF Attack</button>
    </div>
  );
}
