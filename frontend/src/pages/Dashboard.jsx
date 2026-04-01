import Books from "./Books";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil data user saat komponen dimuat
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FDF2F8", // Pink super lembut untuk background
        fontFamily: "'Poppins', sans-serif", // Gunakan font yang bagus
      }}
    >
      {/* 🟢 HEADER (Diberi Background Putih agar bersih) */}
      <div
        style={{
          background: "white",
          padding: "15px 0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          marginBottom: "30px",
          position: "sticky", // Header tetap di atas saat scroll
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <h1 style={{ color: "#DB2777", margin: 0, fontSize: "22px", fontWeight: "600" }}>
            📚 Perpus<span style={{color: "#F472B6"}}>Digi</span>
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {user && (
              <p style={{ margin: 0, color: "#4B5563", fontSize: "14px" }}>
                Halo, <strong>{user.name}</strong> <span style={{fontSize: "12px", color: "#9CA3AF"}}>({user.role})</span>
              </p>
            )}
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid #F9A8D4", /* Border pink */
                background: "white",
                color: "#DB2777", /* Teks Pink Tua */
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontWeight: "500",
                fontSize: "14px",
              }}
              // CSS Hover akan kita tambahkan di index.css
              className="btn-logout-pink"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 KONTEN UTAMA */}
      <div
        style={{
          maxWidth: "1100px", // Diperlebar agar Card muat banyak
          margin: "0 auto",
          padding: "0 20px 40px",
        }}
      >
        <h2 style={{ 
          color: "#1F2937", 
          marginBottom: "25px", 
          borderBottom: "3px solid #FBCFE8", 
          paddingBottom: "12px", 
          display: "inline-block",
          fontSize: "20px",
          fontWeight: "600"
        }}>
          Daftar Buku Tersedia
        </h2>

        {/* Komponen Books yang sudah kita percantik */}
        <Books isAdmin={user?.role === "admin"} />
      </div>
    </div>
  );
}