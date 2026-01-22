<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\Book;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function index()
    {
        return Loan::with('book','user')->get();
    }

    public function store(Request $request)
    {
        $book = Book::findOrFail($request->book_id);

        if ($book->stok < 1) {
            return response()->json(['message' => 'Stok habis'], 400);
        }

        $book->decrement('stok');

        $loan = Loan::create([
            'user_id' => $request->user_id,
            'book_id' => $request->book_id,
            'tanggal_pinjam' => now(),
            'status' => 'dipinjam'
        ]);

        return response()->json($loan, 201);
    }
}
