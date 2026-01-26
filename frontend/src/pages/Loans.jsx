import { useEffect, useState } from "react";
import { getBooks, borrowBook } from "../services/api";

export default function Loans({ user }) {
  const [books, setBooks] = useState([]);
  const [bookId, setBookId] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");

  useEffect(() => {
    getBooks().then(res => setBooks(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    borrowBook({
      user_id: user.id,
      book_id: bookId,
      tanggal_kembali: tanggalKembali,
    }).then(() => {
      alert("Buku berhasil dipinjam 💕");
    });
  };

  return (
    <div className="card">
      <h2>📚 Pinjam Buku</h2>

      <form onSubmit={handleSubmit}>
        <select onChange={e => setBookId(e.target.value)} required>
          <option value="">Pilih Buku</option>
          {books.map(b => (
            <option key={b.id} value={b.id}>
              {b.judul} (stok: {b.stok})
            </option>
          ))}
        </select>

        <input
          type="date"
          value={tanggalKembali}
          onChange={e => setTanggalKembali(e.target.value)}
          required
        />

        <button type="submit">Pinjam</button>
      </form>
    </div>
  );
}
