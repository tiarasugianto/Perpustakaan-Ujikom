import Scanner from "./pages/Scanner";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminLoans from "./pages/AdminLoans"; // <--- CEK NAMA FILE INI BEB!
import { useState, useEffect } from "react";

function App() {
  const [auth, setAuth] = useState(localStorage.getItem("user") !== null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setAuth(true);
        // COBA LOG INI DI CONSOLE (F12) BIAR KITA TAU ROLE KAMU APA
        console.log("Role User Login:", user.role); 
        
        // Pakai .toLowerCase() biar kalau di database 'Admin' atau 'admin' tetep jalan
        setIsAdmin(user && user.role.toLowerCase() === 'admin');
      } catch (e) {
        setAuth(false);
      }
    } else {
      setAuth(false);
      setIsAdmin(false);
    }
  }, [auth]);

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

      {/* ROUTE KHUSUS ADMIN */}
      <Route 
        path="/admin/loans" 
        element={auth && isAdmin ? <AdminLoans /> : <Navigate to="/dashboard" />} 
      />
      
      <Route 
  path="/admin/scan" 
  element={auth && isAdmin ? <Scanner /> : <Navigate to="/dashboard" />} 
/>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;