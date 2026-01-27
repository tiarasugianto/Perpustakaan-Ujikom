import Books from "./Books";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard Perpustakaan</h1>

        {user && (
          <p className="role-info">
            Login sebagai <strong>{user.name}</strong> ({user.role})
          </p>
        )}

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* KONTEN TENGAH */}
      <div className="dashboard-content">
        <Books isAdmin={user?.role === "admin"} />
      </div>
    </div>
  );
}
