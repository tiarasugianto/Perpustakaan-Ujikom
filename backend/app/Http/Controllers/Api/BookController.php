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
    ]);
    $book = \App\Models\Book::create($validated);
    return response()->json($book, 201);
}

public function update(Request $request, $id) {
    $book = \App\Models\Book::findOrFail($id);
    $book->update($request->all());
    return response()->json($book);
}

public function destroy($id) {
    \App\Models\Book::destroy($id);
    return response()->json(['message' => 'Buku berhasil dihapus']);

    }
}
