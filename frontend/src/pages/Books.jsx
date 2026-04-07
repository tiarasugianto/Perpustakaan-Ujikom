import { useEffect, useState } from "react";
import { getBooks, createBook, updateBook, deleteBook, borrowBook } from "../services/api";
import Swal from "sweetalert2";

export default function Books({ isAdmin }) {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const colors = {
    cardCream: "#FFF9E6",   
    deepPink: "#DB2777",    
    softPink: "#FFC2E2",    
    textDark: "#4D2C3D",    
  };

  const categories = [
    "Semua", "Romantis", "Horor", "Coding", "Novel", 
    "Sejarah", "Komik", "Puisi", "Bahasa Asing", "Pantun"
  ];

  const loadBooks = () => {
    getBooks()
      .then((res) => {
        console.log("Data Berhasil Dimuat:", res.data);
        setBooks(res.data);
      })
      .catch((err) => console.error("Gagal ambil buku:", err));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const genreBuku = book.kategori || "Umum";
    const matchesSearch = 
      book.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.penulis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "Semua" || 
      genreBuku.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // --- FUNGSI TAMBAH (FIXED) ---
  const handleAdd = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Buku Baru',
      background: colors.cardCream,
      confirmButtonColor: colors.deepPink,
      html:
        '<input id="swal-judul" class="swal2-input" placeholder="Judul Buku">' +
        '<input id="swal-penulis" class="swal2-input" placeholder="Penulis">' +
        '<select id="swal-kategori" class="swal2-input">' +
          categories.filter(c => c !== "Semua").map(c => `<option value="${c}">${c}</option>`).join('') +
        '</select>' +
        '<input id="swal-penerbit" class="swal2-input" placeholder="Penerbit">' +
        '<input id="swal-stok" class="swal2-input" type="number" placeholder="Stok">',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          judul: document.getElementById('swal-judul').value,
          penulis: document.getElementById('swal-penulis').value,
          kategori: document.getElementById('swal-kategori').value,
          penerbit: document.getElementById('swal-penerbit').value,
          stok: document.getElementById('swal-stok').value
        }
      }
    });

    if (formValues && formValues.judul) {
      createBook({ 
        ...formValues,
        tahun: 2026 // Tambahan tahun default
      }).then(() => {
        Swal.fire({ title: 'Berhasil!', icon: 'success', background: colors.cardCream });
        loadBooks();
      });
    }
  };

  // --- FUNGSI EDIT (FIXED & SINKRON) ---
  const handleEdit = async (book) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Buku',
      background: colors.cardCream,
      confirmButtonColor: "#3B82F6",
      html:
        `<input id="edit-judul" class="swal2-input" value="${book.judul}" placeholder="Judul">` +
        `<input id="edit-penulis" class="swal2-input" value="${book.penulis}" placeholder="Penulis">` +
        `<select id="edit-kategori" class="swal2-input">` +
          categories.filter(c => c !== "Semua").map(c => `<option value="${c}" ${book.kategori === c ? 'selected' : ''}>${c}</option>`).join('') +
        `</select>` +
        `<input id="edit-penerbit" class="swal2-input" value="${book.penerbit || ''}" placeholder="Penerbit">` +
        `<input id="edit-stok" class="swal2-input" type="number" value="${book.stok}" placeholder="Stok">`,
      showCancelButton: true,
      preConfirm: () => {
        return {
          judul: document.getElementById('edit-judul').value,
          penulis: document.getElementById('edit-penulis').value,
          kategori: document.getElementById('edit-kategori').value,
          penerbit: document.getElementById('edit-penerbit').value,
          stok: document.getElementById('edit-stok').value
        }
      }
    });

    if (formValues) {
      updateBook(book.id, { ...book, ...formValues })
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
    const { value: returnDate } = await Swal.fire({
      title: 'Pinjam Buku',
      background: colors.cardCream,
      html: `<input id="swal-date" type="date" class="swal2-input" min="${today}" value="${today}">`,
      showCancelButton: true,
      confirmButtonColor: colors.deepPink,
    });

    if (returnDate) {
      borrowBook({ 
        user_id: JSON.parse(localStorage.getItem("user")).id, 
        book_id: bookId,
        return_date: returnDate 
      }).then(() => {
        Swal.fire({ title: 'Berhasil!', icon: 'success', background: colors.cardCream });
        loadBooks();
      });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "15px", flexWrap: "wrap" }}>
        {isAdmin && (
          <button onClick={handleAdd} style={{ padding: "10px 20px", background: "#10B981", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>
            ➕ Tambah Buku Baru
          </button>
        )}
        <div style={{ position: "relative", flex: "1", maxWidth: "350px" }}>
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px 15px 12px 40px", borderRadius: "15px", border: `2px solid ${colors.softPink}`, background: colors.cardCream, outline: "none" }}
          />
          <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }}>🔍</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "25px" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 15px",
              borderRadius: "20px",
              border: `2px solid ${colors.softPink}`,
              background: selectedCategory === cat ? colors.deepPink : "white",
              color: selectedCategory === cat ? "white" : colors.textDark,
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              transition: "0.2s"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} style={{ background: colors.cardCream, borderRadius: "20px", padding: "25px", border: `2px solid ${colors.softPink}`, display: "flex", flexDirection: "column", gap: "10px", boxShadow: "5px 5px 0px rgba(249, 168, 212, 0.2)" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "30px" }}>📕</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", color: colors.textDark }}>{book.judul}</h3>
                  <span style={{ fontSize: "11px", background: colors.softPink, color: colors.deepPink, padding: "2px 8px", borderRadius: "8px", fontWeight: "bold" }}>
                    {book.kategori || "Umum"}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "13px", margin: "5px 0" }}>✍️ {book.penulis}</p>
              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px" }}>
                <span style={{ fontSize: "12px", color: "#059669", fontWeight: "bold" }}>Stok: {book.stok}</span>
                <div style={{ display: "flex", gap: "5px" }}>
                  {isAdmin ? (
                    <>
                      <button onClick={() => handleEdit(book)} style={{ background: "#3B82F6", color: "white", border: "none", borderRadius: "8px", padding: "5px 8px", cursor: "pointer" }}>✏️</button>
                      <button onClick={() => handleDelete(book.id)} style={{ background: "#EF4444", color: "white", border: "none", borderRadius: "8px", padding: "5px 8px", cursor: "pointer" }}>🗑️</button>
                    </>
                  ) : (
                    book.stok > 0 && <button onClick={() => handleBorrow(book.id)} style={{ padding: "8px 15px", background: colors.deepPink, color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Pinjam</button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
             <p style={{ opacity: 0.5, marginBottom: "10px" }}>Yah, kategori "{selectedCategory}" kosong. 🎀</p>
             <button onClick={() => setSelectedCategory("Semua")} style={{ color: colors.deepPink, background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}>Lihat Semua Buku</button>
          </div>
        )}
      </div>
    </div>
  );
}