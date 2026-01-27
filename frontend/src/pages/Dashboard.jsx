import Books from "./Books";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffe6f0",
        padding: "30px 16px",
      }}
    >
      {/* WRAPPER TENGAH */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <h1 style={{ color: "#ff4f9a", marginBottom: 6 }}>
            Dashboard Perpustakaan
          </h1>

          {user && (
            <p style={{ marginBottom: 12 }}>
              Login sebagai <strong>{user.name}</strong> ({user.role})
            </p>
          )}

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "none",
              background: "#ff7eb3",
              color: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* KONTEN */}
        <Books isAdmin={user?.role === "admin"} />
      </div>
    </div>
  );
}
