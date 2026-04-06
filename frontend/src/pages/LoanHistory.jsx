import { useEffect, useState } from "react";
import { getLoans } from "../services/api";

export default function LoanHistory({ user }) {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    getLoans({
      user_id: user.id,
      role: user.role,
    }).then((res) => setLoans(res.data));
  }, [user]);

  return (
    <div className="card">
      <h2>📄 Riwayat Peminjaman</h2>

      <table>
        <thead>
          <tr>
            {user.role === "admin" && <th>Peminjam</th>}
            <th>Judul Buku</th>
            <th>Tgl Pinjam</th>
            <th>bali</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <tr key={l.id}>
              {user.role === "admin" && (
                <td>{l.user?.name}</td>
              )}
              <td>{l.book?.judul}</td>
              <td>{l.tanggal_pinjam}</td>
              <td>{l.tanggal_kembali}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {loans.length === 0 && (
        <p>Belum ada riwayat peminjaman 📚</p>
      )}
    </div>
  );
}
