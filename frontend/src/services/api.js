import axios from "axios";

// buat instance axios
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔍 RESPONSE INTERCEPTOR (BIAR KELIHATAN ERROR-NYA)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// =====================
// AUTH
// =====================
export const login = (data) => api.post("/login", data);

// =====================
// BOOKS
// =====================
export const getBooks = () => api.get("/books");
export const createBook = (data) => api.post("/books", data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// =====================
// LOANS
// =====================
export const borrowBook = (data) => api.post("/loans", data);

export default api;
