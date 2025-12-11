import "../style/home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">결제 보안 실시간 학습 플랫폼 SafePay</h1>

      <p className="home-desc">
        SafePay는 안전한 결제 흐름과 공격 흐름을 <br />
        한 화면에서 비교하며 학습할 수 있는 보안 실습 플랫폼입니다.
      </p>

      <Link to="/compare" className="home-btn">
        Compare Mode 시작하기
      </Link>
    </div>
  );
}
