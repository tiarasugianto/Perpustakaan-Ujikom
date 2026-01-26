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
    public function store(Request $request)
    {
        $data = $request->validate([
            'judul' => 'required',
            'penulis' => 'required',
            'penerbit' => 'required',
            'tahun' => 'required|integer',
            'stok' => 'required|integer',
        ]);

        return Book::create($data);
    }

    // update buku
    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $book->update($request->all());

        return $book;
    }

    // hapus buku
    public function destroy($id)
    {
        Book::destroy($id);

        return response()->json([
            'message' => 'Buku berhasil dihapus'
        ]);
    }
}
