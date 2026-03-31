use Illuminate\Support\Facades\Hash; // untuk cek password

public function login(Request $request)
{
    $email = $request->email; // ambil email dari frontend
    $password = $request->password; // ambil password

    $user = User::where('email', $email)->first(); // cari user

    // cek user & password
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