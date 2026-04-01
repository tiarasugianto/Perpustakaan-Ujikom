import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useState, useEffect } from "react"; // Tambahkan useEffect

function App() {
  const [auth, setAuth] = useState(localStorage.getItem("user") !== null);

  // Fungsi ini memastikan jika ada perubahan status, App.jsx tahu
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <Routes>
      <Route 
        path="/" 
        element={auth ? <Navigate to="/dashboard" /> : <Login setAuth={setAuth} />} 
      />
      
      <Route 
        path="/login" 
        element={auth ? <Navigate to="/dashboard" /> : <Login setAuth={setAuth} />} 
      />

      <Route 
        path="/dashboard" 
        element={auth ? <Dashboard /> : <Navigate to="/login" />} 
      />
      
      {/* Tambahkan route cadangan jika path tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;