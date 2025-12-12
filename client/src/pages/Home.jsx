import "../style/home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">
        결제 보안 실험실
      </h1>

      <p className="home-desc">
        SafePay는 결제 과정에서 발생할 수 있는 보안 위협을<br />
        <b>정상 흐름(Safe Flow)</b>과 <b>공격 흐름(Attack Flow)</b>로 직접 실험하며<br />
        원리와 방어 효과를 학습하는 보안 실험실입니다.
      </p>

      <Link to="/security-lab" className="home-btn">
        Security Lab 시작하기
      </Link>
    </div>
  );
}
