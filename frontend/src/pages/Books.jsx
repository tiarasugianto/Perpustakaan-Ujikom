import { useEffect, useState } from "react";
import { getBooks } from "../services/api";

const BookCard = ({ book, isAdmin }) => (
  <div className="book-card-pink" style={{ background: "white", borderRadius: "15px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid #F3F4F6", position: "relative", overflow: "hidden" }}>
    <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, background: '#FCE7F3', borderRadius: '50%', opacity: 0.5 }}></div>
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", zIndex: 1 }}>
      <span style={{ fontSize: "28px" }}>📕</span>
      <h3 style={{ margin: 0, color: "#111827", fontSize: "16px", fontWeight: "600", height: "42px", overflow: "hidden" }}>{book.judul}</h3>
    </div>
    <div style={{ height: "1px", background: "#E5E7EB", margin: "5px 0" }}></div>
    <p style={{ margin: 0, color: "#6B7280", fontSize: "13px" }}>✍️ <strong>{book.penulis}</strong></p>
    <p style={{ margin: 0, color: "#9CA3AF", fontSize: "11px" }}>🏢 {book.penerbit} ({book.tahun})</p>
    <div style={{ marginTop: "auto", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "11px", color: book.stok > 0 ? "#059669" : "#DC2626", background: book.stok > 0 ? "#D1FAE5" : "#FEE2E2", padding: "4px 8px", borderRadius: "99px" }}>
        {book.stok > 0 ? `Stok: ${book.stok}` : "Habis"}
      </span>
      {!isAdmin && <button className="btn-action-pink">Pinjam</button>}
    </div>
  </div>
);

export default function Books({ isAdmin }) {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    getBooks().then(res => setBooks(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div>
      {isAdmin && <button className="btn-action-green" style={{ marginBottom: "20px" }}>➕ Tambah Buku</button>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px" }}>
        {books.map(book => <BookCard key={book.id} book={book} isAdmin={isAdmin} />)}
      </div>
    </div>
  );
}