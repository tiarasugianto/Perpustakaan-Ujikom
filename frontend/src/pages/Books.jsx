import { useEffect, useState } from "react";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/api";

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
    setForm(book);
  };

  const handleDelete = (id) => {
    if (confirm("Yakin hapus buku ini?")) {
      deleteBook(id).then(() => loadBooks());
    }
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
    <div style={{ marginTop: 20 }}>

      {/* 🔒 FORM HANYA UNTUK ADMIN */}
      {isAdmin && (
        <>
          <h2>{editId ? "Edit Buku" : "Tambah Buku"}</h2>

          <form onSubmit={handleSubmit}>
            <input name="judul" placeholder="Judul" value={form.judul} onChange={handleChange} required /><br />
            <input name="penulis" placeholder="Penulis" value={form.penulis} onChange={handleChange} required /><br />
            <input name="penerbit" placeholder="Penerbit" value={form.penerbit} onChange={handleChange} required /><br />
            <input name="tahun" type="number" placeholder="Tahun" value={form.tahun} onChange={handleChange} required /><br />
            <input name="stok" type="number" placeholder="Stok" value={form.stok} onChange={handleChange} required /><br />

            <button type="submit">
              {editId ? "Update Buku" : "Simpan Buku"}
            </button>
          </form>

          <hr />
        </>
      )}

      <h2>Daftar Buku</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Penulis</th>
            <th>Penerbit</th>
            <th>Tahun</th>
            <th>Stok</th>
            {isAdmin && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.judul}</td>
              <td>{b.penulis}</td>
              <td>{b.penerbit}</td>
              <td>{b.tahun}</td>
              <td>{b.stok}</td>

              {/* 🔒 AKSI HANYA ADMIN */}
              {isAdmin && (
                <td>
                  <button onClick={() => handleEdit(b)}>Edit</button>
                  <button onClick={() => handleDelete(b.id)}>Hapus</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
