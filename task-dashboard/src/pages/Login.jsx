import { useState } from "react";

function Login({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handle = async () => {
    const url = isLogin
      ? "http://localhost:5000/login"
      : "http://localhost:5000/signup";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        setMsg(data.message || "Invalid credentials");
      }
    } catch {
      setMsg("Server error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-brand">
            <div className="auth-brand-mark">✓</div>
            <span className="auth-brand-name">Tend</span>
          </div>
          <p className="auth-tagline">Managing tasks, the smarter way</p>

          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-icon">✓</span>
              Organize your day with effortless task tracking
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">✓</span>
              Stay on top of priorities, one task at a time
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">✓</span>
              Simple, fast, and built for focus
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? "Welcome back" : "Create account"}</h2>
          <p className="auth-subtitle">
            {isLogin
              ? "Sign in to get back to your tasks"
              : "Sign up to start tracking your tasks"}
          </p>

          <div className="field">
            <label>Username</label>
            <input
              className="input"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handle}>
            {isLogin ? "Login" : "Signup"}
          </button>

          <p className="auth-msg">{msg}</p>

          <p className="auth-switch" onClick={() => {
            setIsLogin(!isLogin);
            setMsg("");
          }}>
            {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;