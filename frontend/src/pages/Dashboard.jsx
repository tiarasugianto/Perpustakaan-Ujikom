import Books from "./Books";
import Users from "./Users";
import { useEffect, useState } from "react";
import { getLoans, getBooks, getUsers, returnBook } from "../services/api";
import Swal from "sweetalert2";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadAllData(parsedUser);
    }
  }, []);

  const loadAllData = (currentUser) => {
    getBooks().then(res => setBooks(res.data));
    getUsers().then(res => setUsers(res.data));
    getLoans().then((res) => {
      // Admin lihat semua, User lihat miliknya saja
      const dataRecord = res.data;
      const filtered = currentUser.role === "admin" 
        ? dataRecord 
        : dataRecord.filter(item => item.user_id === currentUser.id);
      setLoans(filtered);
    }).catch(err => console.error("Gagal muat data:", err));
  };

  const handleReturn = (id) => {
    Swal.fire({
      title: 'Kembalikan Buku?',
      text: "Pastikan buku dalam kondisi baik ya!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#DB2777',
      confirmButtonText: 'Ya, Kembalikan'
    }).then((result) => {
      if (result.isConfirmed) {
        returnBook(id).then(() => {
          Swal.fire('Berhasil!', 'Buku telah dikembalikan.', 'success');
          window.location.reload(); 
        });
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const activeLoansCount = loans.filter(l => !l.returned_at).length;

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
                <span style={{ fontSize: "11px", color: "#DB2777", background: "#FCE7F3", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>{user.role.toUpperCase()}</span>
              </div>
            )}
            <button onClick={handleLogout} className="btn-logout-pink" style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #F9A8D4", background: "white", color: "#DB2777", cursor: "pointer", fontWeight: "500" }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px 40px" }}>
        
        {/* NAVIGASI UTAMA */}
        <div style={{ marginBottom: "30px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => setActiveTab("home")} style={{ background: activeTab === "home" ? "#DB2777" : "white", color: activeTab === "home" ? "white" : "#DB2777", border: "1px solid #DB2777", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>🏠 Dashboard</button>
          <button onClick={() => setActiveTab("books")} style={{ background: activeTab === "books" ? "#DB2777" : "white", color: activeTab === "books" ? "white" : "#DB2777", border: "1px solid #DB2777", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>📖 Buku</button>
          {user?.role === "admin" && (
            <button onClick={() => setActiveTab("users")} style={{ background: activeTab === "users" ? "#DB2777" : "white", color: activeTab === "users" ? "white" : "#DB2777", border: "1px solid #DB2777", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>👥 Anggota</button>
          )}
          <button onClick={() => setActiveTab("loans")} style={{ background: activeTab === "loans" ? "#DB2777" : "white", color: activeTab === "loans" ? "white" : "#DB2777", border: "1px solid #DB2777", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>📋 Riwayat</button>
        </div>

        {/* BOX KONTEN */}
        <div style={{ background: "white", padding: "30px", borderRadius: "25px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "home" && (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ color: "#1F2937", marginBottom: "10px" }}>Selamat Datang di PerpusDigi! ✨</h2>
              <p style={{ color: "#6B7280", marginBottom: "30px" }}>Ringkasan data perpustakaan saat ini.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                <div style={{ background: "linear-gradient(135deg, #F472B6, #DB2777)", padding: "30px", borderRadius: "20px", color: "white" }}>
                  <h4 style={{ margin: 0, opacity: 0.8 }}>Total Koleksi</h4>
                  <h1 style={{ fontSize: "40px", margin: "10px 0" }}>{books.length}</h1>
                  <p style={{ margin: 0, fontSize: "12px" }}>Buku tersedia</p>
                </div>
                <div style={{ background: "#FFF1F2", padding: "30px", borderRadius: "20px", border: "1px solid #FECDD3" }}>
                  <h4 style={{ margin: 0, color: "#9F1239" }}>Sedang Dipinjam</h4>
                  <h1 style={{ fontSize: "40px", margin: "10px 0", color: "#E11D48" }}>{activeLoansCount}</h1>
                  <p style={{ margin: 0, fontSize: "12px", color: "#FB7185" }}>Belum kembali</p>
                </div>
                {user?.role === "admin" && (
                  <div style={{ background: "#F0F9FF", padding: "30px", borderRadius: "20px", border: "1px solid #BAE6FD" }}>
                    <h4 style={{ margin: 0, color: "#075985" }}>Total Anggota</h4>
                    <h1 style={{ fontSize: "40px", margin: "10px 0", color: "#0284C7" }}>{users.length}</h1>
                    <p style={{ margin: 0, fontSize: "12px", color: "#38BDF8" }}>Siswa terdaftar</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BUKU */}
          {activeTab === "books" && <Books isAdmin={user?.role === "admin"} />}

          {/* TAB 3: ANGGOTA */}
          {activeTab === "users" && user?.role === "admin" && <Users />}

          {/* TAB 4: RIWAYAT (TABEL DIPERBAIKI) */}
          {activeTab === "loans" && (
            <div>
              <h2 style={{ color: "#1F2937", marginBottom: "25px", borderBottom: "3px solid #FBCFE8", paddingBottom: "12px", fontSize: "20px" }}>
                📋 Riwayat Peminjaman Buku
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #FDF2F8", color: "#6B7280" }}>
                      <th style={{ padding: "12px" }}>Judul Buku</th>
                      <th style={{ padding: "12px" }}>Peminjam</th>
                      <th style={{ padding: "12px" }}>Waktu Pinjam</th>
                      <th style={{ padding: "12px" }}>Status</th>
                      <th style={{ padding: "12px" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.length > 0 ? (
                      loans.map((loan) => (
                        <tr key={loan.id} style={{ borderBottom: "1px solid #FDF2F8" }}>
                          <td style={{ padding: "12px" }}><strong>{loan.book?.judul || "Buku Dihapus"}</strong></td>
                          <td style={{ padding: "12px" }}>{loan.user?.name || "User"}</td>
                          <td style={{ padding: "12px" }}>
                            {new Date(loan.borrowed_at).toLocaleDateString('id-ID')} <br/>
                            <small style={{color: '#9CA3AF'}}>{new Date(loan.borrowed_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB</small>
                          </td>
                          <td style={{ padding: "12px" }}>
                            {loan.returned_at ? (
                              <span style={{ color: "#059669", background: "#D1FAE5", padding: "4px 10px", borderRadius: "8px", fontSize: "12px" }}>Selesai</span>
                            ) : (
                              <span style={{ color: "#D97706", background: "#FEF3C7", padding: "4px 10px", borderRadius: "8px", fontSize: "12px" }}>Dipinjam</span>
                            )}
                          </td>
                          <td style={{ padding: "12px" }}>
                            {!loan.returned_at && (
                              <button onClick={() => handleReturn(loan.id)} style={{ background: "#DB2777", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>
                                Kembalikan
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#9CA3AF" }}>Belum ada data peminjaman.</td></tr>
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