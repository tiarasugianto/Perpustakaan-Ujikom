import { useState } from "react";
import { login, forgotPassword } from "../services/api";
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
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setAuth(true);
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        const message = err.response?.data?.message || "Email atau password salah";
        setError(message);
      });
  };

  // 🟢 Fungsi Pop-up Lupa Password - DIPERBAIKI POSISINYA
  const handleForgotPassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Reset Password',
      html:
        '<p style="font-size:13px; color:#6B7280; margin-bottom:15px;">Masukkan email akunmu dan password baru.</p>' +
        
        // --- CONTAINER UTAMA BIKIN TENGAH ---
        '<div style="display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%;">' +
          
          // 1. Input Email (Kasih lebar pasti biar sama)
          '<input id="reset-email" class="swal2-input" placeholder="Email Terdaftar" autocomplete="off" value="" style="width: 280px; margin: 0; padding: 10px;">' +
          
          // 2. Pembungkus Password (Bikin relatif untuk mata)
          '<div style="position:relative; width: 280px; margin: 0;">' +
            '<input id="reset-pass" class="swal2-input" type="password" placeholder="Password Baru" style="width:100%; margin: 0; padding: 10px 40px 10px 10px;">' +
            // Icon Mata (Posisikan di dalam input)
            '<span id="toggle-reset-pass" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); cursor:pointer; font-size:16px; color:#9CA3AF; z-index:10;">👁️</span>' +
          '</div>' +
        '</div>',

      focusConfirm: false,
      confirmButtonColor: '#DB2777',
      confirmButtonText: 'Update Password',
      showCancelButton: true,
      
      // Logika Mata (Sama seperti kemarin)
      didOpen: () => {
        const passwordInput = document.getElementById('reset-pass');
        const toggleIcon = document.getElementById('toggle-reset-pass');
        toggleIcon.addEventListener('click', () => {
          const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
          passwordInput.setAttribute('type', type);
          toggleIcon.textContent = type === 'password' ? '👁️‍🗨️' : '👁️';
          toggleIcon.style.color = type === 'password' ? '#9CA3AF' : '#DB2777';
        });
      },
      
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
          Swal.fire('Berhasil!', 'Password sudah diganti. Silakan login.', 'success');
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
        <h2> Login Perpustakaan</h2>

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