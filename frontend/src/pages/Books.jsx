import { useEffect, useState } from "react";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
} from "../services/api";
import "./Books.css";

export default function Books({ isAdmin }) {
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    tahun: "",
    stok: "",
  });

  const loadBooks = () => {
    getBooks().then((res) => setBooks(res.data));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      updateBook(editId, form).then(() => {
        setEditId(null);
        resetForm();
        loadBooks();
      });
    } else {
      createBook(form).then(() => {
        resetForm();
        loadBooks();
      });
    }
  };

  const handleEdit = (book) => {
    setEditId(book.id);
    setForm({
      judul: book.judul,
      penulis: book.penulis,
      penerbit: book.penerbit,
      tahun: book.tahun,
      stok: book.stok,
    });
  };

  const handleDelete = (id) => {
    if (confirm("Yakin hapus buku ini?")) {
      deleteBook(id).then(() => loadBooks());
    }
  };

  const handleBorrow = (bookId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    borrowBook({
      user_id: user.id,
      book_id: bookId,
    }).then(() => {
      alert("Buku berhasil dipinjam");
      loadBooks();
    });
  };

  const resetForm = () => {
    setForm({
      judul: "",
      penulis: "",
      penerbit: "",
      tahun: "",
      stok: "",
    });
  };

  return (
    <div className="container">
      <h1 className="title">📚 Perpustakaan Digital</h1>

      {/* FORM ADMIN */}
      {isAdmin && (
        <div className="card">
          <h2>{editId ? "Edit Buku" : "Tambah Buku"}</h2>

          <form className="form" onSubmit={handleSubmit}>
            <input name="judul" placeholder="Judul Buku" value={form.judul} onChange={handleChange} required />
            <input name="penulis" placeholder="Penulis" value={form.penulis} onChange={handleChange} required />
            <input name="penerbit" placeholder="Penerbit" value={form.penerbit} onChange={handleChange} required />
            <input name="tahun" type="number" placeholder="Tahun" value={form.tahun} onChange={handleChange} required />
            <input name="stok" type="number" placeholder="Stok" value={form.stok} onChange={handleChange} required />

            <button className="btn primary" type="submit">
              {editId ? "Update Buku" : "Simpan Buku"}
            </button>
          </form>
        </div>
      )}

      {/* DAFTAR BUKU */}
      <div className="card">
        <h2>Daftar Buku</h2>

        <table>
          <thead>
            <tr>
              <th>Judul</th>
              <th>Penulis</th>
              <th>Penerbit</th>
              <th>Tahun</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {books.length === 0 && (
              <tr>
                <td colSpan="6" className="empty">Data buku kosong</td>
              </tr>
            )}

            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.judul}</td>
                <td>{b.penulis}</td>
                <td>{b.penerbit}</td>
                <td>{b.tahun}</td>
                <td>{b.stok}</td>
                <td>
                  {isAdmin ? (
                    <>
                      <button className="btn warning" onClick={() => handleEdit(b)}>Edit</button>
                      <button className="btn danger" onClick={() => handleDelete(b.id)}>Hapus</button>
                    </>
                  ) : (
                    <button
                      className="btn success"
                      disabled={b.stok < 1}
                      onClick={() => handleBorrow(b.id)}
                    >
                      {b.stok < 1 ? "Stok Habis" : "Pinjam"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
