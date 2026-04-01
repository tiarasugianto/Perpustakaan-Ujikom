<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'borrowed_at', // Sesuai dengan database kita
        'returned_at', // Sesuai dengan database kita
    ];

    // 🟢 SANGAT PENTING: Cast agar Laravel mengenali ini sebagai Tanggal & Jam (Carbon)
    protected $casts = [
        'borrowed_at' => 'datetime',
        'returned_at' => 'datetime',
    ];

    // 🟢 Relasi ke User (Agar bisa memunculkan Nama Peminjam)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🟢 Relasi ke Book (Agar bisa memunculkan Judul Buku)
    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}