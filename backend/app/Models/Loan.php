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

    public function book()
{
    // Pastikan 'book_id' sesuai sama nama kolom di tabel loans kamu
    return $this->belongsTo(Book::class, 'book_id');
}

public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}
}