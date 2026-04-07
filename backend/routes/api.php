<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\LoanController;

// ✅ loan routes
Route::get('/loans', [LoanController::class, 'index']);
Route::post('/loans', [LoanController::class, 'store']);
Route::get('/loans/{id}', [LoanController::class, 'show']); // Untuk scan
Route::put('/loans/{id}', [LoanController::class, 'update']); // Untuk kembali
Route::put('/loans/{id}/approve', [LoanController::class, 'approve']); // Untuk approve

// ✅ book routes
Route::get('/books', [BookController::class, 'index']);
Route::post('/books', [BookController::class, 'store']);
Route::put('/books/{id}', [BookController::class, 'update']);
Route::delete('/books/{id}', [BookController::class, 'destroy']);

// ✅ auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ✅ user management
Route::get('/users', function() {
    return \App\Models\User::all();
});
Route::delete('/users/{id}', function($id) {
    return \App\Models\User::destroy($id);
});
Route::put('/users/{id}', function(Request $request, $id) {
    $user = \App\Models\User::find($id);
    $user->update($request->all());
    return $user;
});

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);