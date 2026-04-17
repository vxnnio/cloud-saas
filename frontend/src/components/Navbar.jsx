import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/dashboard" className="navbar-logo">
            Cloud SaaS
          </Link>

          <div className="navbar-links">
            <Link
              to="/dashboard"
              className={isActive("/dashboard") ? "nav-link active" : "nav-link"}
            >
              Dashboard
            </Link>

            <Link
              to="/tasks"
              className={isActive("/tasks") ? "nav-link active" : "nav-link"}
            >
              Tasks
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}