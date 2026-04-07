import Books from "./Books";
import Users from "./Users";
import { useEffect, useState } from "react";
import { getLoans, getBooks, getUsers, returnBook } from "../services/api";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

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
      // --- LOGIKA: URUTKAN DARI YANG PALING LAMA (A-Z / ID KECIL KE BESAR) ---
      // Kita urutkan berdasarkan ID dari yang terkecil ke terbesar
      const sortedData = res.data.sort((a, b) => a.id - b.id);

      const filtered = currentUser.role === "admin" 
        ? sortedData 
        : sortedData.filter(item => item.user_id === currentUser.id);
      setLoans(filtered);
    }).catch(err => console.error("Gagal muat data:", err));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const calculatePenaltyValue = (loan) => {
    try {
      const dateToCompare = loan.returned_at ? new Date(loan.returned_at) : new Date();
      const deadline = new Date(loan.return_date);
      if (isNaN(deadline.getTime()) || dateToCompare <= deadline) return 0;
      const diffTime = Math.abs(dateToCompare - deadline);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays * 5;
    } catch (e) {
      return 0;
    }
  };

  const downloadExcel = () => {
    const dataUntukExcel = loans.map((loan, index) => ({
      'No': index + 1,
      'Nama Peminjam': loan.user?.name || '-',
      'Judul Buku': loan.book?.judul || '-',
      'Tanggal Pinjam': formatDate(loan.created_at),
      'Waktu Kembali': loan.returned_at ? formatDate(loan.returned_at) : formatDate(loan.return_date),
      'Poin Minus': Number(calculatePenaltyValue(loan)),
      'Status': loan.returned_at ? 'Selesai' : 'Aktif'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataUntukExcel);
    const workbook = XLSX.utils.book_new();

    const wscols = [
      { wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 12 },
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Peminjaman");
    XLSX.writeFile(workbook, `Laporan_Perpus_Tiara_${new Date().getTime()}.xlsx`);

    Swal.fire({
        title: 'Berhasil!',
        text: 'Laporan 1 Bulan Peminjaman Buku Ke Excel!',
        icon: 'success',
        confirmButtonColor: colors.deepPink,
        background: colors.cardPink
    });
  };

  const handleScanStruk = (loan) => {
    Swal.fire({
      title: 'Data Verifikasi Buku',
      html: `
        <div style="text-align: left; padding: 15px; background: #FFF9E6; border-radius: 15px; border: 2px dashed #DB2777">
          <p>👤 <b>Peminjam:</b> ${loan.user?.name || 'Tidak Diketahui'}</p>
          <p>📧 <b>Email:</b> ${loan.user?.email || '-'}</p>
          <p>📖 <b>Buku:</b> ${loan.book?.judul || 'Tidak Diketahui'}</p>
          <p>📅 <b>Tgl Pinjam:</b> ${formatDate(loan.created_at)}</p>
          <hr style="border: 1px solid #DB2777; opacity: 0.2; margin: 10px 0;">
          <p>📍 <b>LOKASI RAK:</b> <span style="color: #DB2777; font-size: 18px; font-weight: 800;">RAK B-03 (Lt. 2)</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Tutup',
      confirmButtonColor: colors.deepPink,
      background: colors.cardPink
    });
  };

  const handleReturn = (id) => {
    Swal.fire({
      title: 'Setujui Peminjaman?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: colors.deepPink,
      confirmButtonText: 'Ya, Setujui',
      background: colors.cardPink
    }).then((result) => {
      if (result.isConfirmed) {
        returnBook(id).then(() => {
          Swal.fire({ title: 'Berhasil!', icon: 'success', background: colors.cardPink });
          loadAllData(user);
        });
      }
    });
  };

  const activeLoansCount = loans.filter(l => !l.returned_at).length;

  return (
    <div style={{ minHeight: "100vh", background: colors.bgCream, fontFamily: "'Poppins', sans-serif", color: colors.textDark, paddingBottom: "50px" }}>
      
      {/* HEADER */}
      <div style={{ background: colors.cardPink, padding: "20px 0", boxShadow: "0 4px 10px rgba(219, 39, 119, 0.1)", marginBottom: "30px", borderBottom: `3px solid ${colors.borderPink}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 25px" }}>
          <h1 style={{ color: colors.deepPink, margin: 0, fontSize: "26px", fontWeight: "800" }}>📚 Peminjaman <span style={{color: colors.skyBlue}}>Buku</span></h1>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {user && (
              <div style={{ background: colors.bgCream, padding: "5px 15px", borderRadius: "15px", border: `1px solid ${colors.borderPink}`, textAlign: "right" }}>
                <p style={{ margin: 0, color: colors.textDark, fontSize: "14px", fontWeight: "600" }}>{user.name}</p>
                <span style={{ fontSize: "10px", color: colors.deepPink, fontWeight: "bold" }}>{user.role.toUpperCase()}</span>
              </div>
            )}
            <button onClick={() => { localStorage.removeItem("user"); window.location.href = "/"; }} style={{ background: colors.deepPink, color: "white", border: "none", padding: "10px 18px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>Logout</button>
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
            { id: "recap", label: "📊 Laporan", adminOnly: true, color: "#10B981" },
          ].map((tab) => {
            if (tab.adminOnly && user?.role !== "admin") return null;
            const isActive = activeTab === tab.id;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: isActive ? tab.color : colors.cardPink, color: isActive ? "white" : colors.textDark, border: `2px solid ${isActive ? tab.color : colors.borderPink}`, padding: "12px 25px", borderRadius: "15px", cursor: "pointer", fontWeight: "700" }}>{tab.label}</button>;
          })}
        </div>

        <div style={{ background: colors.cardPink, padding: "35px", borderRadius: "30px", border: `2px solid ${colors.borderPink}`, boxShadow: "8px 8px 0px rgba(249, 168, 212, 0.3)" }}>
          
          {activeTab === "home" && (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ color: colors.deepPink, fontSize: "28px", fontWeight: "800" }}>Selamat Datang di peminjaman buku Tiara✨</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px", marginTop: "30px" }}>
                <div style={{ background: colors.bgCream, padding: "30px", borderRadius: "25px", border: `3px solid ${colors.deepPink}`, color: colors.deepPink }}><h4>Total Buku</h4><h1>{books.length}</h1></div>
                <div style={{ background: colors.softBlue, padding: "30px", borderRadius: "25px", border: `3px solid ${colors.skyBlue}`, color: colors.skyBlue }}><h4>Dipinjam</h4><h1>{activeLoansCount}</h1></div>
                {user?.role === "admin" && (
                  <div style={{ background: colors.deepPink, padding: "30px", borderRadius: "25px", border: `3px solid ${colors.cardPink}`, color: "white" }}>
                    <h4 style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>Anggota</h4>
                    <h1 style={{ fontSize: "50px", margin: "10px 0" }}>{users.length}</h1>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "books" && <Books isAdmin={user?.role === "admin"} />}
          {activeTab === "users" && user?.role === "admin" && <Users />}

          {/* TAB RIWAYAT */}
          {activeTab === "loans" && (
            <div>
              <h2 style={{ color: colors.deepPink, textAlign: "center", marginBottom: "20px" }}>📊 Log Aktivitas</h2>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
                <thead>
                  <tr style={{ color: colors.deepPink }}>
                    <th>No</th><th>Judul</th><th>Peminjam</th><th>Tgl Pinjam</th><th>Tgl Kembali</th><th>Poin</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan, index) => (
                    <tr key={loan.id} style={{ background: colors.bgCream, borderRadius: "15px" }}>
                      <td style={{ padding: "15px", fontWeight: "bold" }}>{index + 1}</td>
                      <td style={{ padding: "15px", fontWeight: "bold" }}>{loan.book?.judul}</td>
                      <td style={{ padding: "15px" }}>{loan.user?.name}</td>
                      <td style={{ padding: "15px" }}>{formatDate(loan.created_at)}</td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ color: loan.returned_at ? colors.deepPink : colors.skyBlue, fontWeight: "bold" }}>
                          {loan.returned_at ? formatDate(loan.returned_at) : formatDate(loan.return_date)}
                        </span>
                      </td>
                      <td style={{ padding: "15px" }}>{calculatePenaltyValue(loan) > 0 ? `-${calculatePenaltyValue(loan)}` : 0}</td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        {!loan.returned_at ? (
                          <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                            {user?.role === "admin" && (
                              <>
                                <button onClick={() => handleScanStruk(loan)} style={{ background: colors.skyBlue, color: "white", border: "none", padding: "8px 12px", borderRadius: "10px" }}>🔍 Verifikasi</button>
                                <button onClick={() => handleReturn(loan.id)} style={{ background: "#10B981", color: "white", border: "none", padding: "8px 12px", borderRadius: "10px" }}>Setujui</button>
                              </>
                            )}
                          </div>
                        ) : <span style={{ color: colors.deepPink }}>Selesai ✓</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB LAPORAN DETAIL */}
          {activeTab === "recap" && user?.role === "admin" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h2 style={{ color: colors.deepPink, margin: 0 }}>📊 Laporan & Export Excel</h2>
                <button onClick={downloadExcel} style={{ background: "#10B981", color: "white", border: "none", padding: "12px 20px", borderRadius: "15px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px" }}>
                  Download Excel 📥
                </button>
              </div>

              <div style={{ overflowX: "auto", background: colors.bgCream, borderRadius: "20px", padding: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${colors.borderPink}`, color: colors.deepPink }}>
                      <th style={{ padding: "15px" }}>No</th>
                      <th style={{ padding: "15px" }}>Peminjam</th>
                      <th style={{ padding: "15px" }}>Buku</th>
                      <th style={{ padding: "15px" }}>Waktu Pinjam</th>
                      <th style={{ padding: "15px" }}>Waktu Kembali</th>
                      <th style={{ padding: "15px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #FFE4F2" }}>
                        <td style={{ padding: "15px" }}>{idx + 1}</td>
                        <td style={{ padding: "15px" }}>{loan.user?.name}</td>
                        <td style={{ padding: "15px" }}>{loan.book?.judul}</td>
                        <td style={{ padding: "15px", fontSize: "13px" }}>{formatDate(loan.created_at)}</td>
                        <td style={{ padding: "15px", fontSize: "13px" }}>
                           {loan.returned_at ? formatDate(loan.returned_at) : formatDate(loan.return_date)}
                        </td>
                        <td style={{ padding: "15px" }}>
                          <span style={{ padding: "5px 10px", borderRadius: "10px", fontSize: "11px", background: loan.returned_at ? "#D1FAE5" : "#FEF3C7", color: loan.returned_at ? "#059669" : "#D97706" }}>
                            {loan.returned_at ? 'Selesai' : 'Aktif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "20px", textAlign: "right", borderTop: `2px dashed ${colors.borderPink}`, marginTop: "10px" }}>
                   <p style={{ fontWeight: "bold", color: colors.textDark }}>Total Transaksi Bulan Ini: <span style={{ color: colors.deepPink, fontSize: "22px" }}>{loans.length}</span> Buku</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}