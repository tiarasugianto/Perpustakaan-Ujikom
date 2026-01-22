import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
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
