import { useEffect, useState } from "react";
import { getBooks, createBook, updateBook, deleteBook, borrowBook } from "../services/api";
import Swal from "sweetalert2";

export default function Books({ isAdmin }) {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadBooks = () => {
    getBooks()
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Gagal ambil buku:", err));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // 🔍 Logika Filter: Cari berdasarkan Judul atau Penulis
  const filteredBooks = books.filter((book) =>
    book.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.penulis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. TAMBAH BUKU (SweetAlert Tengah)
  const handleAdd = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Buku Baru',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Judul Buku">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Penulis">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Penerbit">' +
        '<input id="swal-input4" class="swal2-input" type="number" placeholder="Stok">',
      focusConfirm: false,
      confirmButtonColor: '#DB2777',
      showCancelButton: true,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
          document.getElementById('swal-input4').value
        ]
      }
    });

    if (formValues && formValues[0]) {
      createBook({ 
        judul: formValues[0], 
        penulis: formValues[1], 
        penerbit: formValues[2], 
        tahun: 2026, 
        stok: formValues[3] 
      })
      .then(() => {
        Swal.fire('Berhasil!', 'Buku sudah ditambahkan.', 'success');
        loadBooks();
      });
    }
  };

  // 2. EDIT BUKU (Bisa Edit Judul, Penerbit, & Stok)
  const handleEdit = async (book) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Buku',
      html:
        `<label style="display:block; text-align:left; font-size:12px; margin:10px 0 0 25px; color:#6B7280">Judul Buku:</label>` +
        `<input id="swal-input1" class="swal2-input" value="${book.judul}">` +
        `<label style="display:block; text-align:left; font-size:12px; margin:10px 0 0 25px; color:#6B7280">Penerbit:</label>` +
        `<input id="swal-input2" class="swal2-input" value="${book.penerbit || ''}">` +
        `<label style="display:block; text-align:left; font-size:12px; margin:10px 0 0 25px; color:#6B7280">Jumlah Stok:</label>` +
        `<input id="swal-input3" class="swal2-input" type="number" value="${book.stok}">`,
      confirmButtonText: 'Update',
      confirmButtonColor: '#3B82F6',
      showCancelButton: true,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value
        ]
      }
    });

    if (formValues) {
      updateBook(book.id, { 
        ...book, 
        judul: formValues[0], 
        penerbit: formValues[1], 
        stok: formValues[2] 
      })
      .then(() => {
        Swal.fire('Updated!', 'Data buku diperbarui.', 'success');
        loadBooks();
      });
    }
  };

  // 3. HAPUS BUKU
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Yakin mau hapus?',
      text: "Data buku ini akan hilang permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Ya, Hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBook(id).then(() => {
          Swal.fire('Terhapus!', 'Buku berhasil dihapus.', 'success');
          loadBooks();
        });
      }
    });
  };

  // 4. PINJAM BUKU
  const handleBorrow = (bookId) => {
    Swal.fire({
      title: 'Pinjam Buku?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#DB2777',
      confirmButtonText: 'Pinjam Sekarang'
    }).then((result) => {
      if (result.isConfirmed) {
        borrowBook({ user_id: JSON.parse(localStorage.getItem("user")).id, book_id: bookId })
          .then(() => {
            Swal.fire('Berhasil!', 'Silakan cek riwayat di bawah.', 'success');
            loadBooks();
            setTimeout(() => window.location.reload(), 1500);
          })
          .catch(err => Swal.fire('Gagal', err.response?.data?.message, 'error'));
      }
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", gap: "15px", flexWrap: "wrap" }}>
        {isAdmin && (
          <button onClick={handleAdd} className="btn-action-green">
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
            style={{ width: "100%", padding: "10px 15px 10px 35px", borderRadius: "10px", border: "1px solid #F9A8D4", outline: "none", fontSize: "14px" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px" }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card-pink" style={{ background: "white", borderRadius: "15px", padding: "20px", border: "1px solid #F3F4F6", position: "relative", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "28px" }}>📕</span>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>{book.judul}</h3>
              </div>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: "5px 0" }}>✍️ {book.penulis}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF" }}>🏢 {book.penerbit || '-'}</p>
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
                    book.stok > 0 && <button onClick={() => handleBorrow(book.id)} className="btn-action-pink">Pinjam</button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#9CA3AF", padding: "20px" }}>Buku tidak ditemukan...</p>
        )}
      </div>
    </div>
  );
}