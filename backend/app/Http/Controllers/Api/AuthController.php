<?php

namespace App\Http\Controllers\Api; // ✅ harus sesuai folder Api

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // ✅ import model user
use Illuminate\Support\Facades\Hash; // ✅ untuk cek password

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $email = $request->email; // ambil email dari frontend
        $password = $request->password; // ambil password

        $user = User::where('email', $email)->first(); // cari user

        // cek user dan password
        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user
        ]);
    }
}