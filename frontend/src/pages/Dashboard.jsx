import Books from "./Books";
import { useEffect, useState } from "react";
import { getLoans, returnBook } from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);

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
      // Jika admin lihat semua, jika user cuma lihat punya sendiri
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
      loadLoans(user);
      window.location.reload(); // Supaya stok di kartu buku update
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
              <p style={{ margin: 0, color: "#4B5563", fontSize: "14px" }}>
                Halo, <strong>{user.name}</strong> <span style={{fontSize: "12px", color: "#9CA3AF"}}>({user.role})</span>
              </p>
            )}
            <button onClick={handleLogout} className="btn-logout-pink">Logout</button>
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px 40px" }}>
        
        {/* SECTION DAFTAR BUKU */}
        <h2 style={{ color: "#1F2937", marginBottom: "25px", borderBottom: "3px solid #FBCFE8", paddingBottom: "12px", display: "inline-block", fontSize: "20px", fontWeight: "600" }}>
          Daftar Buku Tersedia
        </h2>
        <Books isAdmin={user?.role === "admin"} />

        {/* 🟢 SECTION RIWAYAT PEMINJAMAN (Jam, Tanggal, Tahun Otomatis) */}
        <div style={{ marginTop: "50px", background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: "#DB2777", marginBottom: "20px", fontSize: "18px" }}>📋 Riwayat Peminjaman Buku</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #FDF2F8", color: "#6B7280" }}>
                  <th style={{ padding: "12px" }}>Judul Buku</th>
                  <th style={{ padding: "12px" }}>Peminjam</th>
                  <th style={{ padding: "12px" }}>Waktu Pinjam</th>
                  <th style={{ padding: "12px" }}>Aksi / Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#9CA3AF" }}>Belum ada riwayat peminjaman.</td></tr>
                ) : (
                  loans.map((loan) => (
                    <tr key={loan.id} style={{ borderBottom: "1px solid #FDF2F8" }}>
                      <td style={{ padding: "12px" }}><strong>{loan.book?.judul}</strong></td>
                      <td style={{ padding: "12px" }}>{loan.user?.name}</td>
                      <td style={{ padding: "12px" }}>
                        {new Date(loan.borrowed_at).toLocaleString('id-ID', {
                          dateStyle: 'long',
                          timeStyle: 'short'
                        })}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {loan.returned_at ? (
                          <span style={{ color: "#059669", background: "#D1FAE5", padding: "5px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "500" }}>
                            ✅ Dikembalikan
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleReturn(loan.id)} 
                            style={{ background: "#DB2777", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}
                          >
                            Kembalikan Buku
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