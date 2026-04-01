import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Sesuaikan dengan port Laravel kamu
});

// Interceptor untuk menyisipkan Token (Jika nanti kamu pakai Sanctum/JWT)
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// --- API AUTH ---
export const login = (data) => api.post("/login", data);
export const register = (data) => api.post("/register", data);

// --- API BOOKS ---
export const getBooks = () => api.get("/books");
export const createBook = (data) => api.post("/books", data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// --- API LOANS (PEMINJAMAN) ---
export const getLoans = () => api.get("/loans");
export const borrowBook = (data) => api.post("/loans", data);
export const returnBook = (id) => api.put(`/loans/${id}`);

// --- API USERS (ANGGOTA) ---
// Tambahkan ini di api.js kalau belum ada
export const getUsers = () => api.get("/users");
export const createUser = (data) => api.post("/register", data); // Pakai route register yang sudah ada
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;