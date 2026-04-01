import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const userData = localStorage.getItem("user");

  let user = null;

  try {
    if (userData && userData !== "undefined") {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error parsing user:", error);
    user = null;
  }

  const path = window.location.pathname;

  // belum login
  if (!user) {
    return <Login />;
  }

  // sudah login
  if (path === "/dashboard") {
    return <Dashboard />;
  }

  return <Dashboard />;
}

export default App;