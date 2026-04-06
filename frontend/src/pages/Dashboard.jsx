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

  // --- PALET WARNA FULL COLOR TIARA ---
  const colors = {
    bgCream: "#FFF9E6",
    cardPink: "#FFE4F2",
    deepPink: "#DB2777",
    skyBlue: "#60A5FA",
    softBlue: "#DBEAFE",
    textDark: "#4D2C3D",
    borderPink: "#F9A8D4",
  };

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
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: colors.deepPink,
      confirmButtonText: 'Ya, Kembalikan',
      background: colors.cardPink,
      color: colors.textDark
    }).then((result) => {
      if (result.isConfirmed) {
        returnBook(id).then(() => {
          Swal.fire({
            title: 'Berhasil!',
            text: 'Buku telah dikembalikan.',
            icon: 'success',
            confirmButtonColor: colors.deepPink,
            background: colors.cardPink
          });
          const storedUser = JSON.parse(localStorage.getItem("user"));
          loadAllData(storedUser);
        });
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // 1. Fungsi Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // 2. Fungsi Hitung Poin Minus Otomatis (-5 per hari)
  const calculatePenalty = (loan) => {
    const dateToCompare = loan.returned_at ? new Date(loan.returned_at) : new Date();
    const deadline = new Date(loan.return_date);

    if (dateToCompare <= deadline) return 0;

    const diffTime = Math.abs(dateToCompare - deadline);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays * 5;
  };

  const activeLoansCount = loans.filter(l => !l.returned_at).length;

  return (
    <div style={{ minHeight: "100vh", background: colors.bgCream, fontFamily: "'Poppins', sans-serif", color: colors.textDark, paddingBottom: "50px" }}>
      
      {/* HEADER */}
      <div style={{ background: colors.cardPink, padding: "20px 0", boxShadow: "0 4px 10px rgba(219, 39, 119, 0.1)", marginBottom: "30px", borderBottom: `3px solid ${colors.borderPink}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 25px" }}>
          <h1 style={{ color: colors.deepPink, margin: 0, fontSize: "26px", fontWeight: "800" }}>
            📚 Peminjaman <span style={{color: colors.skyBlue}}>Buku</span>
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {user && (
              <div style={{ background: colors.bgCream, padding: "5px 15px", borderRadius: "15px", border: `1px solid ${colors.borderPink}`, textAlign: "right" }}>
                <p style={{ margin: 0, color: colors.textDark, fontSize: "14px", fontWeight: "600" }}>{user.name}</p>
                <span style={{ fontSize: "10px", color: colors.deepPink, fontWeight: "bold" }}>{user.role.toUpperCase()}</span>
              </div>
            )}
            <button onClick={handleLogout} style={{ background: colors.deepPink, color: "white", border: "none", padding: "10px 18px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* NAVIGASI */}
        <div style={{ marginBottom: "25px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { id: "home", label: "🏠 Home", color: colors.deepPink },
            { id: "books", label: "📖 Buku", color: colors.skyBlue },
            { id: "users", label: "👥 Anggota", adminOnly: true, color: "#9333EA" },
            { id: "loans", label: "📋 Riwayat", color: "#F59E0B" },
          ].map((tab) => {
            if (tab.adminOnly && user?.role !== "admin") return null;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                style={{ 
                  background: isActive ? tab.color : colors.cardPink, 
                  color: isActive ? "white" : colors.textDark, 
                  border: `2px solid ${isActive ? tab.color : colors.borderPink}`, 
                  padding: "12px 25px", 
                  borderRadius: "15px", 
                  cursor: "pointer", 
                  fontWeight: "700",
                  transition: "0.3s"
                }}>
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ background: colors.cardPink, padding: "35px", borderRadius: "30px", border: `2px solid ${colors.borderPink}`, boxShadow: "8px 8px 0px rgba(249, 168, 212, 0.3)" }}>
          
          {activeTab === "home" && (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ color: colors.deepPink, fontSize: "28px", fontWeight: "800", marginBottom: "10px" }}>
                Selamat Datang di peminjaman buku Tiara✨
              </h2>
              <p style={{ marginBottom: "35px", fontWeight: "500", maxWidth: "700px", margin: "0 auto 35px", lineHeight: "1.6" }}>
                Yuk, jelajahi dunia lewat buku hari ini. Pilih bacaan favoritmu dan jangan lupa kembalikan tepat waktu ya, manis! 🎀
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px" }}>
                <div style={{ background: colors.bgCream, padding: "30px", borderRadius: "25px", border: `3px solid ${colors.deepPink}`, color: colors.deepPink }}>
                  <h4 style={{ margin: 0, textTransform: "uppercase", fontSize: "12px" }}>Total Buku</h4>
                  <h1 style={{ fontSize: "50px", margin: "10px 0" }}>{books.length}</h1>
                </div>
                <div style={{ background: colors.softBlue, padding: "30px", borderRadius: "25px", border: `3px solid ${colors.skyBlue}`, color: colors.skyBlue }}>
                  <h4 style={{ margin: 0, textTransform: "uppercase", fontSize: "12px" }}>Dipinjam</h4>
                  <h1 style={{ fontSize: "50px", margin: "10px 0" }}>{activeLoansCount}</h1>
                </div>
                {user?.role === "admin" && (
                  <div style={{ background: colors.deepPink, padding: "30px", borderRadius: "25px", border: `3px solid ${colors.cardPink}`, color: "white" }}>
                    <h4 style={{ margin: 0, textTransform: "uppercase", fontSize: "12px", opacity: 0.8 }}>Anggota</h4>
                    <h1 style={{ fontSize: "50px", margin: "10px 0" }}>{users.length}</h1>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "books" && <Books isAdmin={user?.role === "admin"} />}
          {activeTab === "users" && user?.role === "admin" && <Users />}

          {/* TAB 4: RIWAYAT DENGAN TANGGAL BERSIH & POIN MINUS */}
          {activeTab === "loans" && (
            <div>
              <h2 style={{ color: colors.deepPink, marginBottom: "20px", textAlign: "center" }}>📊 Log Aktivitas</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
                  <thead>
                    <tr style={{ color: colors.deepPink, fontSize: "14px" }}>
                      <th style={{ padding: "15px" }}>Judul</th>
                      <th style={{ padding: "15px" }}>Peminjam</th>
                      <th style={{ padding: "15px" }}>Tgl Pinjam</th>
                      <th style={{ padding: "15px" }}>Tgl Kembali</th>
                      <th style={{ padding: "15px" }}>Poin Minus</th>
                      <th style={{ padding: "15px" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => {
                      const penalty = calculatePenalty(loan);
                      return (
                        <tr key={loan.id} style={{ background: colors.bgCream, borderRadius: "15px" }}>
                          <td style={{ padding: "15px", borderRadius: "15px 0 0 15px", fontWeight: "bold" }}>{loan.book?.judul}</td>
                          <td style={{ padding: "15px" }}>{loan.user?.name}</td>
                          <td style={{ padding: "15px", fontSize: "13px" }}>{formatDate(loan.created_at)}</td>
                          <td style={{ padding: "15px", fontSize: "13px" }}>
                            <span style={{ color: loan.returned_at ? colors.deepPink : colors.skyBlue, fontWeight: "bold" }}>
                              {loan.returned_at ? formatDate(loan.returned_at) : formatDate(loan.return_date)}
                            </span>
                          </td>
                          {/* KOLOM POIN MINUS */}
                          <td style={{ padding: "15px", fontWeight: "bold" }}>
                            {penalty > 0 ? (
                              <span style={{ color: "#EF4444" }}>-{penalty} Point</span>
                            ) : (
                              <span style={{ color: "#10B981" }}>0</span>
                            )}
                          </td>
                          <td style={{ padding: "15px", borderRadius: "0 15px 15px 0", textAlign: "center" }}>
                            {!loan.returned_at ? (
                              <button onClick={() => handleReturn(loan.id)} style={{ background: colors.skyBlue, color: "white", border: "none", padding: "8px 15px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>Kembalikan</button>
                            ) : (
                              <span style={{ color: colors.deepPink, fontWeight: "bold" }}>Selesai ✓</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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