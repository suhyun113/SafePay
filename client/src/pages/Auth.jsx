import { useState } from "react";
import api from "../api/axios";
import "../style/auth.css";
import { useAppStore } from "../store/useAppStore";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const loginState = useAppStore((state) => state.login);

  const signup = async () => {
    try {
      const res = await api.post("/auth/signup", { email, password: pw });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { email, password: pw });
      localStorage.setItem("access", res.data.accessToken);

      loginState(); // ← 로그인 상태 업데이트
      alert("Login success");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
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
