import { useState } from "react";
import { login, forgotPassword } from "../services/api"; // 🟢 Import forgotPassword
import Swal from "sweetalert2";
import "./Login.css";

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    login({ email, password })
      .then((res) => {
        console.log("Login Berhasil:", res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setAuth(true);
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        console.error("Login Gagal:", err.response?.data);
        const message = err.response?.data?.message || "Email atau password salah";
        setError(message);
      });
  };

  // 🟢 Fungsi Pop-up Lupa Password
  const handleForgotPassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Reset Password',
      html:
        '<p style="font-size:13px; color:#6B7280; margin-bottom:10px;">Masukkan email akunmu dan password baru.</p>' +
        '<input id="reset-email" class="swal2-input" placeholder="Email Terdaftar">' +
        '<input id="reset-pass" class="swal2-input" type="password" placeholder="Password Baru (min. 8 Karakter)">',
      focusConfirm: false,
      confirmButtonColor: '#DB2777',
      confirmButtonText: 'Update Password',
      showCancelButton: true,
      preConfirm: () => {
        const emailVal = document.getElementById('reset-email').value;
        const passVal = document.getElementById('reset-pass').value;
        if (!emailVal || !passVal) {
          Swal.showValidationMessage('Email dan Password wajib diisi!');
        }
        return [emailVal, passVal];
      }
    });

    if (formValues) {
      forgotPassword({ email: formValues[0], password: formValues[1] })
        .then(() => {
          Swal.fire('Berhasil!', 'Password sudah diganti. Silakan login kembali.', 'success');
        })
        .catch((err) => {
          const msg = err.response?.data?.message || "Email tidak ditemukan";
          Swal.fire('Gagal', msg, 'error');
        });
    }
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
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />

          <div className="password-wrapper" style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#DB2777', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            Login
          </button>
        </form>

        {/* 🟢 Link Lupa Password */}
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#6B7280" }}>
          Lupa password? 
          <span 
            onClick={handleForgotPassword} 
            style={{ color: "#DB2777", cursor: "pointer", fontWeight: "600", marginLeft: "5px" }}
          >
            Klik di sini
          </span>
        </p>
      </div>
    </div>
  );
}