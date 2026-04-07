<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
    'judul', 'penulis', 'kategori', 'penerbit', 'stok', 'tahun', 'Rak' // Harus R besar!
];
    // --- PAKAI INI SAJA BEB, LEBIH AMAN GAK BIKIN ERROR 500 ---
    protected $visible = [
        'id', 'judul', 'penulis', 'penerbit', 'tahun', 'stok', 'kategori', 'rak'
    ];
}