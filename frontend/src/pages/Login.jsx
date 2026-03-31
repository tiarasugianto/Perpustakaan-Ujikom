import { useState } from "react";
import { login } from "../services/api";
import "./Login.css";

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    login({ email, password })
  .then((res) => {
    console.log(res.data); // ✅ debug

    // ❌ hapus token karena backend gak kirim
    // localStorage.setItem("token", res.data.token);

    localStorage.setItem("user", JSON.stringify(res.data.user));
    setAuth(true);
  })
      .catch(() => {
        setError("Email atau password salah");
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔐 Login Perpustakaan</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Sembunyikan password" : "Lihat password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
