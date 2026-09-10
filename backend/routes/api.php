<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BidangController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\LowonganController;
use App\Http\Controllers\Api\PeriodeController;
use Illuminate\Support\Facades\Route;

// Catatan: file ini cuma berisi route untuk Fase 1 (Auth) & Fase 2
// (Master Data). Kalau routes/api.php di project kamu sudah ada isi
// lain, JANGAN ditimpa — cukup tambahkan blok di bawah ini ke file
// yang sudah ada.

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

// Master Data — GET publik (dipakai form pendaftaran & landing page),
// method lain (POST/PUT/DELETE) khusus admin lewat middleware 'role:admin'.
// Route::apiResource otomatis expand jadi index/show/store/update/destroy.

Route::get('/periodes/active', [PeriodeController::class, 'active']); // taruh sebelum apiResource biar tidak ketiban route show({periode})

Route::apiResource('bidangs', BidangController::class)->only(['index', 'show']);
Route::apiResource('kategoris', KategoriController::class)->only(['index', 'show']);
Route::apiResource('periodes', PeriodeController::class)->only(['index', 'show']);
Route::apiResource('lowongans', LowonganController::class)->only(['index', 'show']);

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('bidangs', BidangController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('kategoris', KategoriController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('periodes', PeriodeController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('lowongans', LowonganController::class)->only(['store', 'update', 'destroy']);
});