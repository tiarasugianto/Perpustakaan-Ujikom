import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";
import Swal from "sweetalert2";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = () => {
    getUsers().then(res => setUsers(res.data)).catch(err => console.error(err));
  };

  useEffect(() => { loadUsers(); }, []);

  // 🔍 Fitur Cari Anggota
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ➕ Fitur Tambah Anggota (Sudah ditambahkan pengecekan error detail)
  const handleAdd = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Anggota Baru',
      html:
        '<input id="u-name" class="swal2-input" placeholder="Nama Lengkap">' +
        '<input id="u-email" class="swal2-input" placeholder="Email">' +
        '<input id="u-pass" class="swal2-input" type="password" placeholder="Password">',
      confirmButtonColor: '#DB2777',
      showCancelButton: true,
      preConfirm: () => [
        document.getElementById('u-name').value,
        document.getElementById('u-email').value,
        document.getElementById('u-pass').value
      ]
    });

    if (formValues && formValues[0]) {
      createUser({ name: formValues[0], email: formValues[1], password: formValues[2], role: 'user' })
        .then(() => {
          Swal.fire('Berhasil', 'Anggota baru terdaftar', 'success');
          loadUsers();
        })
        .catch((err) => {
          // 🟢 Menampilkan pesan error spesifik dari server
          const errorMsg = err.response?.data?.message || "Email mungkin sudah terdaftar atau data tidak valid";
          Swal.fire('Gagal', errorMsg, 'error');
          console.error("Error Detail:", err.response?.data);
        });
    }
  };

  // ✏️ Fitur Edit Anggota (Sudah ditambahkan pengecekan error detail)
  const handleEdit = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Data Anggota',
      html:
        `<input id="u-name" class="swal2-input" value="${user.name}" placeholder="Nama">` +
        `<input id="u-email" class="swal2-input" value="${user.email}" placeholder="Email">`,
      confirmButtonColor: '#3B82F6',
      showCancelButton: true,
      preConfirm: () => [
        document.getElementById('u-name').value,
        document.getElementById('u-email').value
      ]
    });

    if (formValues) {
      updateUser(user.id, { name: formValues[0], email: formValues[1] })
        .then(() => {
          Swal.fire('Updated!', 'Data berhasil diubah', 'success');
          loadUsers();
        })
        .catch((err) => {
          const errorMsg = err.response?.data?.message || "Gagal memperbarui data";
          Swal.fire('Gagal', errorMsg, 'error');
        });
    }
  };

  // 🗑️ Fitur Hapus Anggota
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
          Swal.fire('Terhapus', 'Anggota telah dihapus', 'success');
          loadUsers();
        });
      }
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={handleAdd} style={{ background: "#059669", color: "white", border: "none", padding: "10px 15px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>
          ➕ Tambah Anggota
        </button>
        
        <input 
          type="text" 
          placeholder="Cari nama atau email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", borderRadius: "10px", border: "1px solid #F9A8D4", outline: "none", width: "250px" }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #FDF2F8", color: "#6B7280" }}>
              <th style={{ padding: "12px" }}>Nama</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Role</th>
              <th style={{ padding: "12px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid #FDF2F8" }}>
                <td style={{ padding: "12px", fontWeight: "500" }}>{u.name}</td>
                <td style={{ padding: "12px" }}>{u.email}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ fontSize: "11px", background: u.role === 'admin' ? "#FBCFE8" : "#E5E7EB", color: u.role === 'admin' ? "#DB2777" : "#4B5563", padding: "4px 10px", borderRadius: "10px", fontWeight: "bold" }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEdit(u)} style={{ background: "#3B82F6", color: "white", border: "none", borderRadius: "5px", padding: "5px 8px", cursor: "pointer" }}>✏️</button>
                    <button onClick={() => handleDelete(u.id)} style={{ background: "#EF4444", color: "white", border: "none", borderRadius: "5px", padding: "5px 8px", cursor: "pointer" }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}