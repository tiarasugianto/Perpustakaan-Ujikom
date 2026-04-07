import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminLoans() {
  const [loans, setLoans] = useState([]);
  const colors = { cardCream: "#FFF9E6", deepPink: "#DB2777" };

  const loadLoans = () => {
    axios.get("http://localhost:8000/api/loans")
      .then(res => setLoans(res.data));
  };

  useEffect(() => { loadLoans(); }, []);

  const handleApprove = (id) => {
    Swal.fire({ title: 'Sedang Mengirim Email...', allowOutsideClick: false, didOpen: () => { Swal.showLoading() } });
    
    axios.put(`http://localhost:8000/api/loans/${id}/approve`)
      .then(() => {
        Swal.fire('Berhasil!', 'Peminjaman disetujui & QR Code dikirim.', 'success');
        loadLoans();
      })
      .catch(() => Swal.fire('Gagal', 'Pastikan settingan .env email benar.', 'error'));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: colors.deepPink }}>📋 Kelola Peminjaman</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", background: colors.cardCream }}>
        <thead>
          <tr style={{ background: colors.deepPink, color: "white" }}>
            <th style={{ padding: "10px" }}>Peminjam</th>
            <th>Buku</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(loan => (
            <tr key={loan.id} style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}>
              <td style={{ padding: "10px" }}>{loan.user?.name}</td>
              <td>{loan.book?.judul}</td>
              <td>
                 <span style={{ color: loan.status === 'pending' ? 'orange' : 'green' }}>
                    {loan.status.toUpperCase()}
                 </span>
              </td>
              <td>
                {loan.status === 'pending' && (
                  <button onClick={() => handleApprove(loan.id)} style={{ background: "#10B981", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>
                    ✅ Setujui
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}