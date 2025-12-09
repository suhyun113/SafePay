import { useState } from "react";
import api from "../api/axios";
import "../style/auth.css";

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
    <div className="auth-container">
      <h2>Login / Signup</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPw(e.target.value)} />

      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
