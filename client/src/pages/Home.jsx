import "../style/home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">결제 보안 실시간 학습 플랫폼 SafePay</h1>
      <p className="home-subtitle">
        안전한 결제 흐름과 공격 흐름을 비교하며 네트워크 보안 원리를 직관적으로 학습하세요.
      </p>

      <div className="home-card-container">
        <Link to="/compare" className="home-card">
          <h2>Compare Mode</h2>
          <p>안전한 흐름과 공격 흐름을 한 화면에서 비교합니다.</p>
        </Link>

        <Link to="/dashboard" className="home-card">
          <h2>Dashboard</h2>
          <p>공격/방어 결과를 시각화하고 로그를 확인합니다.</p>
        </Link>

        <Link to="/guide" className="home-card">
          <h2>Security Guide</h2>
          <p>CSRF, Replay Attack 등 핵심 개념을 빠르게 이해하세요.</p>
        </Link>

        <Link to="/auth" className="home-card">
          <h2>Login / Signup</h2>
          <p>실험 기록 저장을 위해 로그인이 필요합니다.</p>
        </Link>
      </div>
    </div>
  );
}
