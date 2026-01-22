<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    private function isAdmin(Request $request)
    {
        return $request->user && $request->user->role === 'admin';
    }

    public function index()
    {
        return response()->json(Book::all());
    }

    public function store(Request $request)
    {
        if ($request->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(Book::create($request->all()), 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $book = Book::findOrFail($id);
        $book->update($request->all());

        return response()->json($book);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        Book::destroy($id);

        return response()->json(['message' => 'Buku dihapus']);
    }
}
