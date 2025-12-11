import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import "../style/navbar.css";

export default function Navbar() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const logout = useAppStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">SafePay</Link>
        <Link to="/compare" className="nav-item">Compare</Link>
        <Link to="/dashboard" className="nav-item">Dashboard</Link>
        <Link to="/logs" className="nav-item">Logs</Link>
      </div>

      <div className="nav-right">
        {!isLoggedIn ? (
          <Link to="/auth" className="nav-item">Login</Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
