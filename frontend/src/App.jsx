import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const path = window.location.pathname;

  // belum login → hanya boleh ke login
  if (!user) {
    return <Login />;
  }

  // sudah login
  if (path === "/dashboard") {
    return <Dashboard />;
  }

  // default redirect
  return <Dashboard />;
}

export default App;