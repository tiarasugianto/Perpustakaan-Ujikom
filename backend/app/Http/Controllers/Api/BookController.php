<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    // Ambil semua buku
    public function index()
    {
        // Kita panggil manual semua kolomnya biar Laravel gak pelit ngirim 'rak'
        $books = Book::select('id', 'judul', 'penulis', 'penerbit', 'tahun', 'stok', 'kategori', 'rak')->get();
        return response()->json($books);
    }

    // Simpan buku baru
    public function store(Request $request) 
    {
        $validated = $request->validate([
            'judul' => 'required',
            'penulis' => 'required',
            'penerbit' => 'required',
            'tahun' => 'required|integer',
            'stok' => 'required|integer',
            'kategori' => 'required',
            'rak' => 'required',
        ]);

        $book = Book::create($validated);
        return response()->json($book, 201);
    }

    // Update buku
    public function update(Request $request, $id) 
    {
        $book = Book::findOrFail($id);
        $book->update($request->all());
        return response()->json($book);
    }

    // Hapus buku
    public function destroy($id) 
    {
        Book::destroy($id);
        return response()->json(['message' => 'Buku berhasil dihapus']);
    }
}