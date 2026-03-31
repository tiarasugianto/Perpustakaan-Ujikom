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
    dd($request->all()); // ✅ cek data masuk atau tidak

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Email atau password salah'
        ], 401);
    }

    return response()->json([
        'message' => 'Login berhasil',
        'user' => $user
    ]);
}