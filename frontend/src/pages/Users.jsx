import { useEffect, useState } from "react";
import api, { getUsers, deleteUser } from "../services/api";
import Swal from "sweetalert2";

export default function Users() {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    getUsers().then(res => setUsers(res.data)).catch(err => console.error(err));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Anggota?',
      text: "User ini tidak akan bisa login lagi!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Ya, Hapus'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id).then(() => {
          Swal.fire('Berhasil', 'Anggota telah dihapus', 'success');
          loadUsers();
        });
      }
    });
  };

  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
      <h3 style={{ color: "#DB2777", marginBottom: "20px" }}>👥 Kelola Anggota (User)</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #FDF2F8" }}>
            <th style={{ padding: "10px" }}>Nama</th>
            <th style={{ padding: "10px" }}>Email</th>
            <th style={{ padding: "10px" }}>Role</th>
            <th style={{ padding: "10px" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: "1px solid #FDF2F8" }}>
              <td style={{ padding: "10px" }}>{u.name}</td>
              <td style={{ padding: "10px" }}>{u.email}</td>
              <td style={{ padding: "10px" }}>
                <span style={{ fontSize: "11px", background: u.role === 'admin' ? "#FBCFE8" : "#E5E7EB", padding: "3px 8px", borderRadius: "10px" }}>
                  {u.role}
                </span>
              </td>
              <td style={{ padding: "10px" }}>
                <button onClick={() => handleDelete(u.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}