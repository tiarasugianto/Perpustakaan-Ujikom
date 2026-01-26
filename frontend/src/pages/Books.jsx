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

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("Gagal load buku", err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateBook(editId, form);
        setEditId(null);
      } else {
        await createBook(form);
      }

      resetForm();
      loadBooks();
    } catch (err) {
      console.error("Gagal simpan buku", err);
      alert("Gagal menyimpan buku");
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

  const handleDelete = async (id) => {
    if (confirm("Yakin hapus buku ini?")) {
      await deleteBook(id);
      loadBooks();
    }
  };

  return (
    <div className="container">
      {/* 🔒 FORM HANYA ADMIN */}
      {isAdmin && (
        <div className="card">
          <h2>{editId ? "Edit Buku" : "Tambah Buku"}</h2>

          <form onSubmit={handleSubmit} className="book-form">
  <input name="judul" placeholder="Judul Buku" value={form.judul} onChange={handleChange} required />
  <input name="penulis" placeholder="Penulis" value={form.penulis} onChange={handleChange} required />

  <input name="penerbit" placeholder="Penerbit" value={form.penerbit} onChange={handleChange} required />
  <input name="tahun" type="number" placeholder="Tahun" value={form.tahun} onChange={handleChange} required />

  <input name="stok" type="number" placeholder="Stok" value={form.stok} onChange={handleChange} required />

  {/* ⬇️ TOMBOL FULL 2 KOLOM */}
  <button type="submit" className="btn-primary full">
    {editId ? "Update Buku" : "Simpan Buku"}
  </button>
</form>
        </div>
      )}

      {/* 📚 DAFTAR BUKU */}
      <div className="card">
        <h2>Daftar Buku</h2>

        <table className="table">
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
    </div>
  );
}
