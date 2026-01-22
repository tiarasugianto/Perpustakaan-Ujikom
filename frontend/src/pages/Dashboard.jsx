import Books from "./Books";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard Perpustakaan</h1>

      {user && (
        <p>
          Login sebagai <strong>{user.name}</strong> ({user.role})
        </p>
      )}

      <button onClick={handleLogout}>Logout</button>

      <Books isAdmin={user?.role === "admin"} />
    </div>
  );
}
