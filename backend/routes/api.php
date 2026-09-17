<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\BidangController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\LowonganController;
use App\Http\Controllers\Api\MentorController;
use App\Http\Controllers\Api\PeriodeController;
use App\Http\Controllers\Api\Admin\ApplicationAdminController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});
// Publik — tracking pendaftaran tanpa login (by registration_number + email)
Route::get('/applications/track', [ApplicationController::class, 'track']);

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

    // Soft delete (Sampah) untuk bidang — taruh sebelum/di luar apiResource
    // supaya tidak bentrok dengan route {bidang} di atas.
    Route::get('/bidangs-trashed', [BidangController::class, 'trashed']);
    Route::patch('/bidangs/{id}/restore', [BidangController::class, 'restore']);
    Route::delete('/bidangs/{id}/force', [BidangController::class, 'forceDelete']);

    Route::apiResource('kategoris', KategoriController::class)->only(['store', 'update', 'destroy']);

    // Soft delete (Sampah) untuk kategori.
    Route::get('/kategoris-trashed', [KategoriController::class, 'trashed']);
    Route::patch('/kategoris/{id}/restore', [KategoriController::class, 'restore']);
    Route::delete('/kategoris/{id}/force', [KategoriController::class, 'forceDelete']);
    Route::apiResource('periodes', PeriodeController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('lowongans', LowonganController::class)->only(['store', 'update', 'destroy']);

    // Kelola mentor (User berrole 'mentor') + alokasi kategori via pivot kategori_mentor.
    Route::prefix('mentors')->group(function () {
        Route::get('/', [MentorController::class, 'index']);
        Route::post('/', [MentorController::class, 'store']);
        Route::get('/{mentor}', [MentorController::class, 'show']);
        Route::put('/{mentor}', [MentorController::class, 'update']);
        Route::delete('/{mentor}', [MentorController::class, 'destroy']);
    });

    Route::prefix('admin')->group(function () {
        Route::get('/applications', [ApplicationAdminController::class, 'index']);
        Route::get('/applications/{id}', [ApplicationAdminController::class, 'show']);
        Route::get('/applications/{id}/available-mentors', [ApplicationAdminController::class, 'availableMentors']);
        Route::patch('/applications/{id}/mentor', [ApplicationAdminController::class, 'assignMentor']);
        Route::patch('/applications/{id}/status', [ApplicationAdminController::class, 'updateStatus']);
    });
});