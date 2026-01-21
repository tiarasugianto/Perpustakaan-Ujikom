import { useEffect, useState } from "react";
import { getBooks, createBook } from "../services/api";

export default function Books() {
  const [books, setBooks] = useState([]);

  const [form, setForm] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    tahun: "",
    stok: "",
  });

  const loadBooks = () => {
    getBooks()
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createBook(form)
      .then(() => {
        loadBooks();
        setForm({
          judul: "",
          penulis: "",
          penerbit: "",
          tahun: "",
          stok: "",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Tambah Buku</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="judul"
          placeholder="Judul"
          value={form.judul}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="penulis"
          placeholder="Penulis"
          value={form.penulis}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="penerbit"
          placeholder="Penerbit"
          value={form.penerbit}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="tahun"
          type="number"
          placeholder="Tahun"
          value={form.tahun}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="stok"
          type="number"
          placeholder="Stok"
          value={form.stok}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit">Simpan Buku</button>
      </form>

      <hr />

      <h2>Daftar Buku</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Penulis</th>
            <th>Penerbit</th>
            <th>Tahun</th>
            <th>Stok</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="5">Belum ada data</td>
            </tr>
          ) : (
            books.map((b) => (
              <tr key={b.id}>
                <td>{b.judul}</td>
                <td>{b.penulis}</td>
                <td>{b.penerbit}</td>
                <td>{b.tahun}</td>
                <td>{b.stok}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
