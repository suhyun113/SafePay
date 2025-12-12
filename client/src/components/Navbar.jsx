import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import "../style/navbar.css";

export default function Navbar() {
  // 전역 상태에서 로그인 여부 조회
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  // 전역 로그아웃 함수
  const logout = useAppStore((s) => s.logout);

  const navigate = useNavigate();

  // 로그아웃 버튼 클릭 시 실행
  const handleLogout = () => {
    // 상태 초기화
    logout();

    // 메인 페이지로 이동
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">SafePay</Link> {/* 서비스 메인 진입 링크 */}
        <Link to="/compare" className="nav-item">SecurityLab</Link> {/* 보안 비교 실험 페이지 */}
        <Link to="/dashboard" className="nav-item">Dashboard</Link> {/* 보안 통계 대시보드 */}
        <Link to="/logs" className="nav-item">Logs</Link> {/* 공격/보안 로그 조회 */}
      </div>

      <div className="nav-right">
        {/* 로그인 여부에 따라 버튼 분기 */}
        {!isLoggedIn ? (
          <Link to="/auth" className="nav-item">Login</Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
