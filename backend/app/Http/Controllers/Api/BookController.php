<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    // ambil semua buku
    public function index()
    {
        return Book::all();
    }

    // simpan buku
    public function store(Request $request) {
        $validated = $request->validate([
            'judul' => 'required',
            'penulis' => 'required',
            'penerbit' => 'required',
            'tahun' => 'required|integer',
            'stok' => 'required|integer',
            'kategori' => 'required', // <--- TAMBAHIN INI BIAR GAK CUEK!
        ]);

        // Sekarang kategori bakal ikut kesimpan karena sudah masuk $validated
        $book = Book::create($validated);
        return response()->json($book, 201);
    }

    public function update(Request $request, $id) {
        $book = Book::findOrFail($id);
        // Kalau update pake $request->all() sudah bener karena dia nangkep semua
        $book->update($request->all());
        return response()->json($book);
    }

    public function destroy($id) {
        Book::destroy($id);
        return response()->json(['message' => 'Buku berhasil dihapus']);
    }
}