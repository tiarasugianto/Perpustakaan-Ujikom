import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import Swal from "sweetalert2";

export default function Scanner() {
  const [scanResult, setScanResult] = useState(null);
  const [loanData, setLoanData] = useState(null);

  const colors = {
    deepPink: "#DB2777",
    borderPink: "#F9A8D4",
    textDark: "#4D2C3D",
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render((result) => {
      scanner.clear();
      setScanResult(result);
      fetchLoanInfo(result);
    }, (err) => { /* scanning... */ });

    return () => scanner.clear();
  }, []);

  const fetchLoanInfo = (id) => {
    axios.get(`http://localhost:8000/api/loans/${id}`)
      .then(res => {
        console.log("Data dari Laravel:", res.data); // Cek di F12 (Console) buat liat datanya
        setLoanData(res.data);
      })
      .catch(() => {
        Swal.fire({
          title: "Gagal",
          text: "Data tidak ditemukan atau server error!",
          icon: "error",
          confirmButtonColor: colors.deepPink
        }).then(() => window.location.reload());
      });
  };

  const handleReturn = () => {
    axios.put(`http://localhost:8000/api/loans/${loanData.id}`)
      .then(() => {
        Swal.fire({
          title: "Berhasil!",
          text: "Buku telah dikembalikan.",
          icon: "success",
          confirmButtonColor: colors.deepPink
        }).then(() => window.location.reload());
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", background: "#FFF9E6", minHeight: "80vh" }}>
      <h2 style={{ color: colors.deepPink, fontWeight: "800", marginBottom: "20px" }}>📷 Scan QR Peminjaman</h2>
      
      {!scanResult && <div id="reader" style={{ maxWidth: "500px", margin: "auto", border: `2px solid ${colors.borderPink}`, borderRadius: "15px" }}></div>}

      {loanData && (
        <div style={{ marginTop: "20px", padding: "30px", border: `2px dashed ${colors.borderPink}`, borderRadius: "20px", background: "white", maxWidth: "500px", margin: "20px auto", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: "#059669", marginBottom: "20px" }}>✅ Data Ditemukan!</h3>
          
          <div style={{ textAlign: "left", fontSize: "15px", color: colors.textDark, lineHeight: "2" }}>
            <p>👤 <b>Peminjam:</b> {loanData.user?.name || '-'}</p>
            <p>📖 <b>Buku:</b> {loanData.book?.judul || '-'}</p>
            
            {/* Bagian Rak yang kita perbaiki */}
            <p>
  📍 <b>Lokasi Rak:</b> <span style={{ color: colors.deepPink, fontWeight: "bold" }}>
    {/* Perhatikan 'R' besar di bawah ini! */}
    {loanData.book?.Rak ? loanData.book.Rak : "KOLOM 'Rak' MASIH KOSONG"}
  </span>
</p>
          </div>
          
          <button 
            onClick={handleReturn}
            style={{ background: colors.deepPink, color: "white", border: "none", padding: "15px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", marginTop: "25px", width: "100%", fontSize: "16px" }}
          >
            Confirm Pengembalian / Ambil Buku
          </button>
        </div>
      )}
    </div>
  );
}