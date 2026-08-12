<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Catatan: file ini cuma berisi route untuk Fase 1 (Auth). Kalau
// routes/api.php di project kamu sudah ada isi lain, JANGAN ditimpa —
// cukup tambahkan blok di bawah ini ke file yang sudah ada.

Route::prefix('auth')->group(function () {
    // Publik
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Butuh token Sanctum
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});