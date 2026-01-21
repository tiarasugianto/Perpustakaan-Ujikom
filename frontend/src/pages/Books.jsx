import { useEffect, useState } from "react";
import { getBooks } from "../services/api";

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getBooks()
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
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
              <td colSpan="5">Belum ada data buku</td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.judul}</td>
                <td>{book.penulis}</td>
                <td>{book.penerbit}</td>
                <td>{book.tahun}</td>
                <td>{book.stok}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
