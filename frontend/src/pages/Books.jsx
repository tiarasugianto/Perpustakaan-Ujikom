import { useEffect, useState } from "react";
import { getBooks, createBook, updateBook, deleteBook, borrowBook } from "../services/api";
import Swal from "sweetalert2";

export default function Books({ isAdmin }) {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- PALET WARNA TIARA ---
  const colors = {
    cardCream: "#FFF9E6",   // Warna Soft Cream favorit kamu
    deepPink: "#DB2777",    // Pink Tua (Tombol/Aksen)
    softPink: "#FFC2E2",    // Pink Muda (Border)
    textDark: "#4D2C3D",    // Teks Cokelat Tua
  };

  const loadBooks = () => {
    getBooks()
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Gagal ambil buku:", err));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.penulis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Buku Baru',
      background: colors.cardCream,
      confirmButtonColor: colors.deepPink,
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Judul Buku">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Penulis">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Penerbit">' +
        '<input id="swal-input4" class="swal2-input" type="number" placeholder="Stok">',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value,
        document.getElementById('swal-input3').value,
        document.getElementById('swal-input4').value
      ]
    });

    if (formValues && formValues[0]) {
      createBook({ 
        judul: formValues[0], penulis: formValues[1], 
        penerbit: formValues[2], tahun: 2026, stok: formValues[3] 
      }).then(() => {
        Swal.fire({ title: 'Berhasil!', icon: 'success', background: colors.cardCream, confirmButtonColor: colors.deepPink });
        loadBooks();
      });
    }
  };

  const handleEdit = async (book) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Buku',
      background: colors.cardCream,
      confirmButtonColor: "#3B82F6",
      html:
        `<label style="display:block; text-align:left; font-size:12px; margin:10px 0 0 25px; color:#6B7280">Judul Buku:</label>` +
        `<input id="swal-input1" class="swal2-input" value="${book.judul}">` +
        `<label style="display:block; text-align:left; font-size:12px; margin:10px 0 0 25px; color:#6B7280">Penerbit:</label>` +
        `<input id="swal-input2" class="swal2-input" value="${book.penerbit || ''}">` +
        `<label style="display:block; text-align:left; font-size:12px; margin:10px 0 0 25px; color:#6B7280">Jumlah Stok:</label>` +
        `<input id="swal-input3" class="swal2-input" type="number" value="${book.stok}">`,
      confirmButtonText: 'Update',
      showCancelButton: true,
      preConfirm: () => [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value,
        document.getElementById('swal-input3').value
      ]
    });

    if (formValues) {
      updateBook(book.id, { ...book, judul: formValues[0], penerbit: formValues[1], stok: formValues[2] })
      .then(() => {
        Swal.fire({ title: 'Updated!', icon: 'success', background: colors.cardCream });
        loadBooks();
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Yakin mau hapus?',
      background: colors.cardCream,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Ya, Hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBook(id).then(() => {
          Swal.fire({ title: 'Terhapus!', icon: 'success', background: colors.cardCream });
          loadBooks();
        });
      }
    });
  };

  const handleBorrow = async (bookId) => {
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const maxDate = nextWeek.toISOString().split("T")[0];

    const { value: returnDate } = await Swal.fire({
      title: 'Pinjam Buku',
      background: colors.cardCream,
      html:
        `<p style="font-size:14px; color:${colors.textDark}; margin-bottom:10px;">Kapan kamu akan mengembalikan buku ini?</p>` +
        `<p style="font-size:12px; color:${colors.deepPink}; margin-bottom:5px;">*Maksimal peminjaman 1 minggu</p>` +
        `<input id="swal-date" type="date" class="swal2-input" min="${today}" max="${maxDate}" value="${today}" style="width: 250px;">`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: colors.deepPink,
      confirmButtonText: 'Pinjam Sekarang',
      preConfirm: () => {
        const dateInput = document.getElementById('swal-date').value;
        if (!dateInput) {
          Swal.showValidationMessage('Tolong pilih tanggal kembali!');
        }
        return dateInput;
      }
    });

    if (returnDate) {
      borrowBook({ 
        user_id: JSON.parse(localStorage.getItem("user")).id, 
        book_id: bookId,
        return_date: returnDate 
      })
      .then(() => {
        Swal.fire({ title: 'Berhasil!', text: `Kembalikan paling lambat ${returnDate}`, icon: 'success', background: colors.cardCream });
        loadBooks();
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch(err => {
        Swal.fire({ title: 'Gagal', text: err.response?.data?.message || "Terjadi kesalahan", icon: 'error', background: colors.cardCream });
      });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", gap: "15px", flexWrap: "wrap" }}>
        {isAdmin && (
          <button onClick={handleAdd} style={{ padding: "10px 20px", background: "#10B981", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>
            ➕ Tambah Buku Baru
          </button>
        )}
        <div style={{ position: "relative", flex: "1", maxWidth: "350px" }}>
          <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: colors.deepPink }}>🔍</span>
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px 15px 12px 40px", borderRadius: "15px", border: `2px solid ${colors.softPink}`, outline: "none", fontSize: "14px", background: colors.cardCream }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} style={{ 
              background: colors.cardCream, 
              borderRadius: "20px", 
              padding: "25px", 
              border: `2px solid ${colors.softPink}`, 
              display: "flex", 
              flexDirection: "column", 
              gap: "12px", 
              boxShadow: "5px 5px 0px rgba(249, 168, 212, 0.2)" 
            }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "35px" }}>📕</span>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: colors.textDark, lineHeight: "1.2" }}>{book.judul}</h3>
              </div>
              <p style={{ fontSize: "14px", color: colors.textDark, margin: "5px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                ✍️ {book.penulis}
              </p>
              <p style={{ fontSize: "13px", color: colors.textDark, opacity: 0.7, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                🏢 {book.penerbit || '-'}
              </p>
              
              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "15px" }}>
                <span style={{ fontSize: "12px", background: "#D1FAE5", color: "#059669", padding: "5px 12px", borderRadius: "12px", fontWeight: "bold" }}>
                  Stok: {book.stok}
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {isAdmin ? (
                    <>
                      <button onClick={() => handleEdit(book)} style={{ background: "#3B82F6", color: "white", border: "none", borderRadius: "10px", padding: "8px", cursor: "pointer" }}>✏️</button>
                      <button onClick={() => handleDelete(book.id)} style={{ background: "#EF4444", color: "white", border: "none", borderRadius: "10px", padding: "8px", cursor: "pointer" }}>🗑️</button>
                    </>
                  ) : (
                    book.stok > 0 && (
                      <button 
                        onClick={() => handleBorrow(book.id)} 
                        style={{ padding: "8px 20px", background: colors.deepPink, color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "13px", boxShadow: "0 4px 0 #9D174D" }}
                      >
                        Pinjam
                      </button>
                    )
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