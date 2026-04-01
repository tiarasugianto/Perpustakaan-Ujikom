import Books from "./Books";
import Users from "./Users"; // 🟢 Import komponen Users baru
import { useEffect, useState } from "react";
import { getLoans, returnBook } from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [activeTab, setActiveTab] = useState("books"); // 🟢 State untuk navigasi (default: books)

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadLoans(parsedUser);
    }
  }, []);

  const loadLoans = (currentUser) => {
    getLoans().then((res) => {
      const myLoans = currentUser.role === "admin" 
        ? res.data 
        : res.data.filter((l) => l.user_id === currentUser.id);
      setLoans(myLoans);
    }).catch(err => console.error("Gagal muat riwayat:", err));
  };

  const handleReturn = (id) => {
    if (!window.confirm("Kembalikan buku ini?")) return;
    returnBook(id).then(() => {
      alert("Buku berhasil dikembalikan!");
      window.location.reload();
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FDF2F8", fontFamily: "'Poppins', sans-serif" }}>
      {/* HEADER */}
      <div style={{ background: "white", padding: "15px 0", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "30px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" }}>
          <h1 style={{ color: "#DB2777", margin: 0, fontSize: "22px", fontWeight: "600" }}>
            📚 Perpus<span style={{color: "#F472B6"}}>Digi</span>
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {user && (
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, color: "#4B5563", fontSize: "14px" }}>
                  Halo, <strong>{user.name}</strong>
                </p>
                <span style={{ fontSize: "11px", color: "#DB2777", background: "#FCE7F3", padding: "2px 8px", borderRadius: "10px", fontWeight: "600", textTransform: "uppercase" }}>
                  {user.role}
                </span>
              </div>
            )}
            <button onClick={handleLogout} className="btn-logout-pink" style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #F9A8D4", background: "white", color: "#DB2777", cursor: "pointer", fontWeight: "500" }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px 40px" }}>
        
        {/* 🟢 TOMBOL NAVIGASI SEDERHANA */}
        <div style={{ marginBottom: "25px", display: "flex", gap: "10px" }}>
          <button 
            onClick={() => setActiveTab("books")} 
            style={{ 
              background: activeTab === "books" ? "#DB2777" : "white", 
              color: activeTab === "books" ? "white" : "#DB2777", 
              border: "1px solid #DB2777", 
              padding: "10px 20px", 
              borderRadius: "12px", 
              cursor: "pointer",
              fontWeight: "600",
              transition: "0.3s"
            }}
          >
            📚 Daftar Buku
          </button>
          
          {/* Tombol Kelola Anggota hanya muncul untuk Admin */}
          {user?.role === "admin" && (
            <button 
              onClick={() => setActiveTab("users")} 
              style={{ 
                background: activeTab === "users" ? "#DB2777" : "white", 
                color: activeTab === "users" ? "white" : "#DB2777", 
                border: "1px solid #DB2777", 
                padding: "10px 20px", 
                borderRadius: "12px", 
                cursor: "pointer",
                fontWeight: "600",
                transition: "0.3s"
              }}
            >
              👥 Kelola Anggota
            </button>
          )}
        </div>

        {/* 🟢 KONTEN DINAMIS (Berubah sesuai Tab) */}
        {activeTab === "books" ? (
          <>
            <h2 style={{ color: "#1F2937", marginBottom: "25px", borderBottom: "3px solid #FBCFE8", paddingBottom: "12px", display: "inline-block", fontSize: "20px", fontWeight: "600" }}>
              Daftar Buku Tersedia
            </h2>
            <Books isAdmin={user?.role === "admin"} />
          </>
        ) : (
          <Users /> 
        )}

        {/* 🟢 SECTION RIWAYAT PEMINJAMAN (Tetap muncul di bawah) */}
        <div style={{ marginTop: "50px", background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: "#DB2777", marginBottom: "20px", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>📋</span> Riwayat Peminjaman Buku
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #FDF2F8", color: "#6B7280" }}>
                  <th style={{ padding: "12px" }}>Judul Buku</th>
                  <th style={{ padding: "12px" }}>Peminjam</th>
                  <th style={{ padding: "12px" }}>Waktu Pinjam</th>
                  <th style={{ padding: "12px" }}>Waktu Kembali</th>
                  <th style={{ padding: "12px" }}>Status / Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loans.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#9CA3AF" }}>Belum ada riwayat peminjaman.</td></tr>
                ) : (
                  loans.map((loan) => (
                    <tr key={loan.id} style={{ borderBottom: "1px solid #FDF2F8" }}>
                      <td style={{ padding: "12px" }}><strong>{loan.book?.judul || "Buku Dihapus"}</strong></td>
                      <td style={{ padding: "12px" }}>{loan.user?.name}</td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ fontWeight: "500" }}>{new Date(loan.borrowed_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</div>
                        <div style={{ fontSize: "11px", color: "#9CA3AF" }}>Pukul {new Date(loan.borrowed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        {loan.returned_at ? (
                          <>
                            <div style={{ fontWeight: "500", color: "#059669" }}>{new Date(loan.returned_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</div>
                            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>Pukul {new Date(loan.returned_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
                          </>
                        ) : (
                          <span style={{ color: "#F59E0B", fontStyle: "italic", fontSize: "12px" }}>Belum dikembalikan</span>
                        )}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {loan.returned_at ? (
                          <span style={{ color: "#059669", background: "#D1FAE5", padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" }}>
                            ✅ Selesai
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleReturn(loan.id)} 
                            style={{ background: "#DB2777", color: "white", border: "none", padding: "8px 14px", borderRadius: "10px", cursor: "pointer", fontSize: "12px", fontWeight: "500" }}
                          >
                            Kembalikan
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}