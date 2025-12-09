import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    alert("Logout 성공");
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
        <Link to="/auth" className="nav-item">Login</Link>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
