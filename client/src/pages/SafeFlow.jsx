import { useState } from "react";
import api from "../api/axios";

export default function SafeFlow() {
  const [result, setResult] = useState(null);

  const pay = async () => {
    const access = localStorage.getItem("access");

    const res = await api.post(
      "/payment/create",
      { item: "Book", amount: 5000 },
      { headers: { Authorization: `Bearer ${access}` } }
    );

    setResult(res.data);
  };

  return (
    <div>
      <h1>Safe Payment Simulation</h1>
      <button onClick={pay}>Start Safe Payment</button>

      {result && (
        <pre style={{ background: "#111", color: "#0f0", padding: 20 }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
