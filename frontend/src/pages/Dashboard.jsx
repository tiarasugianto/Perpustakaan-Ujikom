import Books from "./Books";
import Users from "./Users";
import { useEffect, useState } from "react";
import { getLoans, getBooks, getUsers, returnBook } from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("books");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadAllData(parsedUser);
    }
  }, []);

  const loadAllData = (currentUser) => {
    // Ambil semua data untuk statistik
    getBooks().then(res => setBooks(res.data));
    getUsers().then(res => setUsers(res.data));
    getLoans().then((res) => {
      const myLoans = currentUser.role === "admin" 
        ? res.data 
        : res.data.filter((l) => l.user_id === currentUser.id);
      setLoans(myLoans);
    });
  };

  const handleReturn = (id) => {
    if (!window.confirm("Kembalikan buku ini?")) return;
    returnBook(id).then(() => {
      window.location.reload();
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // Hitung buku yang sedang dipinjam (belum kembali)
  const activeLoans = loans.filter(l => !l.returned_at).length;

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
            <button onClick={handleLogout} className="btn-logout-pink" style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #F9A8D4", background: "white", color: "#DB2777", cursor: "pointer" }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px 40px" }}>
        
        {/* 🟢 TAMPILAN DASHBOARD STATISTIK */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)", padding: "20px", borderRadius: "20px", color: "white", boxShadow: "0 10px 20px rgba(219, 39, 119, 0.2)" }}>
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Total Koleksi</p>
            <h2 style={{ margin: "5px 0 0", fontSize: "32px" }}>{books.length} <small style={{fontSize: "14px"}}>Buku</small></h2>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "20px", border: "1px solid #FBCFE8", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#6B7280" }}>Sedang Dipinjam</p>
            <h2 style={{ margin: "5px 0 0", fontSize: "32px", color: "#DB2777" }}>{activeLoans} <small style={{fontSize: "14px"}}>Buku</small></h2>
          </div>
          {user?.role === "admin" && (
            <div style={{ background: "white", padding: "20px", borderRadius: "20px", border: "1px solid #FBCFE8", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#6B7280" }}>Total Anggota</p>
              <h2 style={{ margin: "5px 0 0", fontSize: "32px", color: "#DB2777" }}>{users.length} <small style={{fontSize: "14px"}}>Orang</small></h2>
            </div>
          )}
        </div>

        {/* NAVIGASI TAB */}
        <div style={{ marginBottom: "25px", display: "flex", gap: "12px" }}>
          <button onClick={() => setActiveTab("books")} style={{ background: activeTab === "books" ? "#DB2777" : "white", color: activeTab === "books" ? "white" : "#DB2777", border: "1px solid #DB2777", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>📖 Buku</button>
          {user?.role === "admin" && (
            <button onClick={() => setActiveTab("users")} style={{ background: activeTab === "users" ? "#DB2777" : "white", color: activeTab === "users" ? "white" : "#DB2777", border: "1px solid #DB2777", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>👥 Anggota</button>
          )}
          <button onClick={() => setActiveTab("loans")} style={{ background: activeTab === "loans" ? "#DB2777" : "white", color: activeTab === "loans" ? "white" : "#DB2777", border: "1px solid #DB2777", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>📋 Riwayat</button>
        </div>

        {/* KONTEN BOX */}
        <div style={{ background: "white", padding: "25px", borderRadius: "25px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          {activeTab === "books" && <Books isAdmin={user?.role === "admin"} />}
          {activeTab === "users" && <Users />}
          {activeTab === "loans" && (
             <div>
                <h2 style={{ color: "#1F2937", marginBottom: "20px", fontSize: "18px" }}>Riwayat Peminjaman</h2>
                {/* ... Tabel Riwayat sama seperti kode sebelumnya ... */}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left", color: "#9CA3AF", fontSize: "13px", borderBottom: "1px solid #FDF2F8" }}>
                            <th style={{ padding: "10px" }}>Buku</th>
                            <th style={{ padding: "10px" }}>Waktu</th>
                            <th style={{ padding: "10px" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map(l => (
                            <tr key={l.id} style={{ borderBottom: "1px solid #FDF2F8" }}>
                                <td style={{ padding: "10px" }}>{l.book?.judul}</td>
                                <td style={{ padding: "10px", fontSize: "12px" }}>{new Date(l.borrowed_at).toLocaleDateString()}</td>
                                <td style={{ padding: "10px" }}>
                                    {l.returned_at ? <span style={{color:"green"}}>Kembali</span> : <button onClick={() => handleReturn(l.id)}>Kembalikan</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}