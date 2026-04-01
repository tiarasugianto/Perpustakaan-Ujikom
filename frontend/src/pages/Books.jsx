import { useEffect, useState } from "react";
import { getBooks, createBook, updateBook, deleteBook } from "../services/api";

export default function Books({ isAdmin }) {
  const [books, setBooks] = useState([]);

  useEffect(() => { loadBooks(); }, []);

  const loadBooks = () => {
    getBooks().then(res => setBooks(res.data)).catch(err => console.error(err));
  };

  const handleAdd = () => {
    const judul = prompt("Masukkan Judul Buku:");
    if (!judul) return;
    const penulis = prompt("Masukkan Penulis:");
    const stok = prompt("Masukkan Jumlah Stok:");
    
    createBook({ judul, penulis, penerbit: "PerpusDigi", tahun: 2026, stok })
      .then(() => { alert("Buku ditambahkan!"); loadBooks(); });
  };

  const handleEdit = (book) => {
    const newJudul = prompt("Edit Judul Buku:", book.judul);
    if (!newJudul) return;
    updateBook(book.id, { ...book, judul: newJudul })
      .then(() => { alert("Buku diperbarui!"); loadBooks(); });
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus buku ini?")) {
      deleteBook(id).then(() => { alert("Buku dihapus!"); loadBooks(); });
    }
  };

  return (
    <div>
      {isAdmin && (
        <button onClick={handleAdd} className="btn-action-green" style={{ marginBottom: "20px" }}>
          ➕ Tambah Buku Baru
        </button>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px" }}>
        {books.map((book) => (
          <div key={book.id} className="book-card-pink" style={{ background: "white", borderRadius: "15px", padding: "20px", border: "1px solid #F3F4F6", position: "relative" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "28px" }}>📕</span>
              <h3 style={{ margin: 0, fontSize: "16px" }}>{book.judul}</h3>
            </div>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "10px 0" }}>✍️ {book.penulis}</p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
              <span style={{ fontSize: "11px", background: "#D1FAE5", padding: "4px 8px", borderRadius: "99px" }}>Stok: {book.stok}</span>
              
              {/* Tombol Aksi KHUSUS ADMIN */}
              {isAdmin && (
                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => handleEdit(book)} style={{ background: "#3B82F6", color: "white", border: "none", borderRadius: "5px", padding: "5px", cursor: "pointer" }}>✏️</button>
                  <button onClick={() => handleDelete(book.id)} style={{ background: "#EF4444", color: "white", border: "none", borderRadius: "5px", padding: "5px", cursor: "pointer" }}>🗑️</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}