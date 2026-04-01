import Books from "./Books";
import Users from "./Users";
import { useEffect, useState } from "react";
import { getLoans, returnBook } from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [activeTab, setActiveTab] = useState("books"); // State navigasi

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
                <p style={{ margin: 0, color: "#4B5563", fontSize: "14px" }}>Halo, <strong>{user.name}</strong></p>
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
        
        {/* 🟢 NAVIGASI TAB */}
        <div style={{ marginBottom: "30px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button 
            onClick={() => setActiveTab("books")} 
            style={{ 
              background: activeTab === "books" ? "#DB2777" : "white", 
              color: activeTab === "books" ? "white" : "#DB2777", 
              border: "1px solid #DB2777", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" 
            }}
          >
            📖 Daftar Buku
          </button>

          {user?.role === "admin" && (
            <button 
              onClick={() => setActiveTab("users")} 
              style={{ 
                background: activeTab === "users" ? "#DB2777" : "white", 
                color: activeTab === "users" ? "white" : "#DB2777", 
                border: "1px solid #DB2777", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" 
              }}
            >
              👥 Kelola Anggota
            </button>
          )}

          <button 
            onClick={() => setActiveTab("loans")} 
            style={{ 
              background: activeTab === "loans" ? "#DB2777" : "white", 
              color: activeTab === "loans" ? "white" : "#DB2777", 
              border: "1px solid #DB2777", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" 
            }}
          >
            📋 Riwayat Pinjam
          </button>
        </div>

        {/* 🟢 ISI KONTEN BERDASARKAN TAB */}
        <div style={{ background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          
          {activeTab === "books" && (
            <>
              <h2 style={{ color: "#1F2937", marginBottom: "25px", borderBottom: "3px solid #FBCFE8", paddingBottom: "12px", fontSize: "20px" }}>Daftar Buku Tersedia</h2>
              <Books isAdmin={user?.role === "admin"} />
            </>
          )}

          {activeTab === "users" && user?.role === "admin" && (
            <Users />
          )}

          {activeTab === "loans" && (
            <div>
              <h2 style={{ color: "#1F2937", marginBottom: "25px", borderBottom: "3px solid #FBCFE8", paddingBottom: "12px", fontSize: "20px" }}>📋 Riwayat Peminjaman Buku</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #FDF2F8", color: "#6B7280" }}>
                      <th style={{ padding: "12px" }}>Buku</th>
                      <th style={{ padding: "12px" }}>Peminjam</th>
                      <th style={{ padding: "12px" }}>Waktu Pinjam</th>
                      <th style={{ padding: "12px" }}>Waktu Kembali</th>
                      <th style={{ padding: "12px" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#9CA3AF" }}>Belum ada data peminjaman.</td></tr>
                    ) : (
                      loans.map((loan) => (
                        <tr key={loan.id} style={{ borderBottom: "1px solid #FDF2F8" }}>
                          <td style={{ padding: "12px" }}><strong>{loan.book?.judul || "Buku Dihapus"}</strong></td>
                          <td style={{ padding: "12px" }}>{loan.user?.name}</td>
                          <td style={{ padding: "12px" }}>
                            {new Date(loan.borrowed_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}<br/>
                            <small style={{color: '#9CA3AF'}}>{new Date(loan.borrowed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</small>
                          </td>
                          <td style={{ padding: "12px" }}>
                            {loan.returned_at ? (
                              <>
                                {new Date(loan.returned_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}<br/>
                                <small style={{color: '#9CA3AF'}}>{new Date(loan.returned_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</small>
                              </>
                            ) : <span style={{ color: "#F59E0B", fontSize: "12px" }}>Masih dipinjam</span>}
                          </td>
                          <td style={{ padding: "12px" }}>
                            {loan.returned_at ? (
                              <span style={{ color: "#059669", background: "#D1FAE5", padding: "4px 10px", borderRadius: "8px", fontWeight: "600" }}>Selesai</span>
                            ) : (
                              <button onClick={() => handleReturn(loan.id)} style={{ background: "#DB2777", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}>Kembalikan</button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}