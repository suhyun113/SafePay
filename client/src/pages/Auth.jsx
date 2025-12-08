import { useState } from "react";
import api from "../api/axios";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const signup = async () => {
    const res = await api.post("/auth/signup", { email, password: pw });
    alert(res.data.message);
  };

  const login = async () => {
    const res = await api.post("/auth/login", { email, password: pw });
    localStorage.setItem("access", res.data.accessToken);
    alert("Login success");
  };

  return (
    <div>
      <h2>Signup / Login</h2>

      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPw(e.target.value)}
      />

      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
