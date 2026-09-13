<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\BidangController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\LowonganController;
use App\Http\Controllers\Api\PeriodeController;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
});



Route::get('/periodes/active', [PeriodeController::class, 'active']);

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