<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Loan;
use App\Models\Book;
use Carbon\Carbon; // Library untuk urusan Jam & Tanggal

class LoanController extends Controller
{
    // 1. Ambil semua data pinjaman (untuk Admin melihat riwayat)
    public function index()
    {
        // Mengambil data loan beserta data user dan bukunya
        $loans = Loan::with(['user', 'book'])->orderBy('created_at', 'desc')->get();
        return response()->json($loans);
    }

    // 2. Fitur PINJAM BUKU
    public function store(Request $request)
    {
        $book = Book::find($request->book_id);
        
        // Cek stok dulu
        if ($book->stok <= 0) {
            return response()->json(['message' => 'Maaf, stok buku ini sedang habis!'], 400);
        }

        $loan = Loan::create([
            'user_id' => $request->user_id,
            'book_id' => $request->book_id,
            'borrowed_at' => Carbon::now(), // Otomatis catat Jam, Tgl, Bln, Thn sekarang
        ]);

        // Kurangi stok buku
        $book->decrement('stok');

        return response()->json([
            'message' => 'Berhasil meminjam buku!',
            'data' => $loan
        ], 201);
    }

    // 3. Fitur KEMBALIKAN BUKU
    public function update(Request $request, $id)
    {
        $loan = Loan::findOrFail($id);
        
        // Update tanggal kembali
        $loan->update([
            'returned_at' => Carbon::now() // Otomatis catat waktu pengembalian
        ]);

        // Tambah lagi stok bukunya
        Book::find($loan->book_id)->increment('stok');

        return response()->json(['message' => 'Buku telah dikembalikan, terima kasih!']);
    }
}