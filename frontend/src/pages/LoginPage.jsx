import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/client";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await login(email, password);
      console.log("login success data =", data);

      localStorage.setItem("token", data.access_token);
      console.log("saved token =", localStorage.getItem("token"));

      navigate("/dashboard");
    } catch (error) {
      console.error("login error =", error);
      setErrorMsg(error.message || "登入失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-badge">Cloud SaaS Platform</div>
        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">
          登入後測試 JWT、/auth/me、tasks API
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="請輸入 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {errorMsg && <div className="error-message">{errorMsg}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}