import { useEffect, useState } from "react";
import { getBooks, createBook, updateBook, deleteBook, borrowBook } from "../services/api";

export default function Books({ isAdmin }) {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 State untuk menyimpan kata kunci pencarian

  // 1. Fungsi muat data buku
  const loadBooks = () => {
    getBooks()
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Gagal ambil buku:", err));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // 🔍 Logika Filter: Menyaring daftar buku berdasarkan input user (Judul atau Penulis)
  const filteredBooks = books.filter((book) =>
    book.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.penulis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Fungsi TAMBAH BUKU (Admin)
  const handleAdd = () => {
    const judul = prompt("Masukkan Judul Buku:");
    if (!judul) return;
    const penulis = prompt("Masukkan Penulis:");
    const stok = prompt("Masukkan Jumlah Stok:", "1");

    createBook({ judul, penulis, penerbit: "PerpusDigi", tahun: 2026, stok })
      .then(() => {
        alert("Buku berhasil ditambahkan!");
        loadBooks();
      })
      .catch((err) => alert("Gagal tambah buku"));
  };

  // 3. Fungsi EDIT BUKU (Admin)
  const handleEdit = (book) => {
    const newJudul = prompt("Edit Judul Buku:", book.judul);
    if (!newJudul) return;
    const newStok = prompt("Edit Stok:", book.stok);

    updateBook(book.id, { ...book, judul: newJudul, stok: newStok })
      .then(() => {
        alert("Buku diperbarui!");
        loadBooks();
      })
      .catch((err) => alert("Gagal update buku"));
  };

  // 4. Fungsi HAPUS BUKU (Admin)
  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus buku ini?")) {
      deleteBook(id).then(() => {
        alert("Buku dihapus!");
        loadBooks();
      });
    }
  };

  // 5. Fungsi PINJAM BUKU (User)
  const handleBorrow = (bookId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!window.confirm("Pinjam buku ini sekarang?")) return;

    borrowBook({ user_id: user.id, book_id: bookId })
      .then(() => {
        alert("Berhasil meminjam buku!");
        loadBooks();
        window.location.reload();
      })
      .catch((err) => alert(err.response?.data?.message || "Gagal pinjam"));
  };

  return (
    <div>
      {/* 🔍 Bagian Atas: Tombol Tambah & Input Pencarian */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "25px", 
        gap: "15px", 
        flexWrap: "wrap" 
      }}>
        
        {isAdmin && (
          <button onClick={handleAdd} className="btn-action-green" style={{ margin: 0 }}>
            ➕ Tambah Buku Baru
          </button>
        )}

        <div style={{ position: "relative", flex: "1", maxWidth: "350px" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>🔍</span>
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 15px 10px 35px",
              borderRadius: "10px",
              border: "1px solid #F9A8D4",
              outline: "none",
              fontSize: "14px"
            }}
          />
        </div>
      </div>

      {/* Grid Daftar Buku */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px" }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card-pink" style={{ background: "white", borderRadius: "15px", padding: "20px", border: "1px solid #F3F4F6", position: "relative", display: "flex", flexDirection: "column", gap: "10px" }}>
              
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "28px" }}>📕</span>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>{book.judul}</h3>
              </div>
              
              <p style={{ fontSize: "13px", color: "#6B7280", margin: "5px 0" }}>✍️ {book.penulis}</p>
              
              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", background: book.stok > 0 ? "#D1FAE5" : "#FEE2E2", color: book.stok > 0 ? "#059669" : "#DC2626", padding: "4px 8px", borderRadius: "99px" }}>
                  Stok: {book.stok}
                </span>

                <div style={{ display: "flex", gap: "5px" }}>
                  {isAdmin ? (
                    <>
                      <button onClick={() => handleEdit(book)} style={{ background: "#3B82F6", color: "white", border: "none", borderRadius: "5px", padding: "5px 8px", cursor: "pointer" }}>✏️</button>
                      <button onClick={() => handleDelete(book.id)} style={{ background: "#EF4444", color: "white", border: "none", borderRadius: "5px", padding: "5px 8px", cursor: "pointer" }}>🗑️</button>
                    </>
                  ) : (
                    book.stok > 0 && (
                      <button onClick={() => handleBorrow(book.id)} className="btn-action-pink">
                        Pinjam
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#9CA3AF", padding: "20px" }}>
            Buku tidak ditemukan...
          </p>
        )}
      </div>
    </div>
  );
}