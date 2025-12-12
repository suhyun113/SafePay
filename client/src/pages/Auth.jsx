import { useState } from "react";
import api from "../api/axios";
import "../style/auth.css";
import { useAppStore } from "../store/useAppStore";

export default function Auth() {
  // 사용자 입력 상태 관리
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  // 전역 로그인 상태 업데이트 함수
  const loginState = useAppStore((state) => state.login);

  const signup = async () => {
    try {
      // 회원가입 요청
      const res = await api.post("/auth/signup", { email, password: pw });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const login = async () => {
    try {
      // 로그인 요청
      const res = await api.post("/auth/login", { email, password: pw });

      // Access Token을 로컬 스토리지에 저장
      localStorage.setItem("access", res.data.accessToken);

      // 전역 로그인 상태 반영
      loginState();

      alert("Login success");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login / Signup</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPw(e.target.value)}
      />

      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
