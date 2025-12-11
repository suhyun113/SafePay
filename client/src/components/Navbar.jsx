import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";
import { useAppStore } from "../store/useAppStore";

export default function Navbar() {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const logout = useAppStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logout 성공");
    logout();
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">SafePay</Link>

        <Link to="/compare" className="nav-item">Compare</Link>
        <Link to="/safe" className="nav-item">Safe</Link>
        <Link to="/attack" className="nav-item">Attack</Link>
        <Link to="/dashboard" className="nav-item">Dashboard</Link>
        <Link to="/guide" className="nav-item">Guide</Link>
      </div>

      <div className="nav-right">
        {!isLoggedIn ? (
          <>
            <Link to="/auth" className="nav-item">Login</Link>
            <Link to="/auth" className="nav-item">Signup</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
