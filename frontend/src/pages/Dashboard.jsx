import Books from "./Books";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard Perpustakaan</h1>

      {user && (
        <p>
          Login sebagai <strong>{user.name}</strong> ({user.role})
        </p>
      )}

      <Books isAdmin={user?.role === "admin"} />
    </div>
  );
}
