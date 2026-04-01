<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB; // Tambahkan ini

class UserSeeder extends Seeder
{
    public function run(): void
{
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    User::truncate();
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');

    // Akun Admin (Yang sudah berhasil)
    User::create([
        'name' => 'Tiara Admin',
        'email' => 'tiara@perpus.com',
        'password' => Hash::make('12345678'),
        'role' => 'admin',
    ]);

    // ✅ Akun User Biasa (Siswa)
    User::create([
        'name' => 'Siswa Perpus',
        'email' => 'siswa@perpus.com',
        'password' => Hash::make('12345678'),
        'role' => 'user', // Role-nya pastikan 'user'
    ]);
}
}