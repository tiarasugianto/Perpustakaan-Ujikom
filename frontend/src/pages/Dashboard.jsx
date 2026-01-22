import Books from "./Books";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: 20 }}>
      <h1>Halaman Perpustakaan</h1>

      {user && (
        <p>
          Selamat datang, <strong>{user.name}</strong> ({user.role})
        </p>
      )}

      <Books />
    </div>
  );
}
