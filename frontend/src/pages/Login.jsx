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
    setError(""); // Reset error setiap klik tombol

    login({ email, password })
      .then((res) => {
        console.log("Login Berhasil:", res.data);

        // 1. Simpan data user ke localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // 2. Update status auth
        setAuth(true);
        
        // 3. Pindah halaman menggunakan cara standar (Anti-Error Router)
        // Ganti "/dashboard" dengan path halaman utama kamu
        window.location.href = "/dashboard"; 
      })
      .catch((err) => {
        console.error("Login Gagal:", err.response?.data);
        const message = err.response?.data?.message || "Email atau password salah";
        setError(message);
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔐 Login Perpustakaan</h2>

        {error && (
          <p className="error" style={{ color: 'white', backgroundColor: '#ff4d4d', padding: '10px', borderRadius: '5px', marginBottom: '10px', textAlign: 'center' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />

          <div className="password-wrapper" style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px' }}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}